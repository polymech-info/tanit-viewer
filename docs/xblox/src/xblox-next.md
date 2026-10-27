# XBlox Next — Block Plugin Architecture

> Design document for the next-generation XBlox block system.  
> Goal: eliminate hardcoded kind-strings and switch-tables everywhere; make blocks
> first-class plugins loadable from DLLs; give the UI a fully self-describing
> manifest it can render without knowing anything about specific blocks.

---

## 1 — Problems with the current architecture

| Area | Problem |
|---|---|
| `xblox_commands.cpp` | Giant `if (kind == "shell") … if (kind == "command") …` dispatch table |
| `xblox-builder.tsx`, `BlockModel.ts` | Hardcoded kind strings for colour coding, label generation, child-list keys, icon selection |
| `xblox-property-panel.tsx` | Bespoke editors per kind (`ShellParamsEditor`, `CommandPropsEditor`, …) that can never know about third-party blocks |
| `src/win/ui_next/CBlockView.cpp` | Win32 host also has kind-string switches for tree rendering hints |
| `registered_block_definitions()` | Returns `BlockDescriptor` but `params` is an opaque `nlohmann::json` array — no C++ type safety, no rich kind metadata |
| DLL / plugin future | No C ABI; blocks are compiled in, can never be loaded at runtime |
| Execution model | `background`, `enabled`, `continueOnError` are runtime fields that duplicate param declarations; no formal "async" / "sync" / "cancellable" surface |

---

## 2 — Core abstractions

### 2.1 Param kind taxonomy

Every parameter has a **kind** that drives both validation and the UI widget chosen.

```
ParamKind  (string enum in JSON, typed enum in C++)
──────────────────────────────────────────────────
Primitive group
  string          plain text input + variable picker
  integer         number spinner
  float           decimal spinner
  boolean         toggle / checkbox
  expression      muParser expression — text + variable picker, eval hint

Path group
  file_path       path picker (read)
  dir_path        directory picker
  audio_path      path picker filtered to .mp3 / .wav / .flac
  image_path      path picker filtered to .jpg / .png / …
  video_path      path picker filtered to .mp4 / .avi / …
  output_path     path picker (write — may not exist yet)

Structured group
  args_list       multi-line list of strings (one per line)
  json_value      raw JSON editor
  enum            drop-down, values declared in `enum_values[]`
  variable_ref    variable name picker (refers to root-scope key)

Rich group  (future)
  coord           {x, y} — two number fields
  rect            {x, y, w, h}
  color           colour picker
  duration_ms     integer with "ms" suffix label and "s" toggle
```

### 2.2 Param descriptor (`ParamDef`)

```jsonc
{
  "name":         "outputPath",          // JSON field name on the block
  "label":        "Output path",         // display label (auto-derived if absent)
  "description":  "…",                   // tooltip / help text
  "kind":         "output_path",         // ParamKind — drives widget + validation
  "group":        "output",              // UI grouping: "input"|"output"|"options"|"advanced"
  "default":      "",                    // value written into new blocks
  "required":     false,                 // block is invalid without a value
  "uses_previous": true,                 // show "← PREVIOUS" hint when empty
  "enum_values":  [],                    // for kind=enum
  "min":          null,                  // for numeric kinds
  "max":          null,
  "platform_mask": 0xFFFFFFFF,           // hide on unsupported platforms
  "hidden":       false                  // suppressed in property panel (runtime-only fields)
}
```

### 2.3 Child-list descriptor (`ChildListDef`)

Container blocks (if/for/while/switch) declare their child lists explicitly so
the UI knows what to render without knowing the kind.

```jsonc
{
  "key":         "items",         // JSON field name on the block
  "label":       "Body",          // palette/tree label
  "role":        "body",          // "body"|"consequent"|"alternate"|"case" — for tree colouring
  "accepts":     ["*"],           // which block kinds can be dropped here; "*" = all
  "min_items":   0,
  "max_items":   -1               // -1 = unlimited
}
```

### 2.4 Execution-model flags (`ExecFlags`)

These are **block-type-level** declarations (not per-instance params) so the
UI can render appropriate controls and warnings.

```jsonc
{
  "supports_background":  false,  // block may fire-and-forget; surface "background" toggle
  "supports_cancel":      true,   // block polls cancel_requested; Stop button active
  "is_blocking":          true,   // default: block chain waits for completion
  "is_container":         false,  // block has child lists and drives its own loop/branch
  "singleton":            false,  // at most one instance may run at a time (future)
  "min_duration_hint_ms": 0       // rough expected duration for progress bar (0 = instant)
}
```

### 2.5 Event schema (`EventDef`)

Each event kind a block can emit (beyond the universal `running`/`ok`/`error`):

```jsonc
{
  "name":        "frame",
  "description": "Emitted for each captured video frame",
  "data_schema": {                // JSON Schema fragment describing `event.data`
    "path":   "string",
    "width":  "integer",
    "height": "integer"
  }
}
```

### 2.6 Block manifest (`BlockManifest`)

The full self-describing block definition sent to the UI (and written by DLL plugins):

```jsonc
{
  "kind":        "videoCapture",
  "label":       "Still Capture",
  "description": "Capture a still frame from a camera and save it as JPEG/PNG.",
  "group":       "Video",          // palette group
  "icon":        "camera",         // icon key from shared icon registry (optional)
  "color":       "#0ea5e9",        // kind badge colour (optional; group default otherwise)
  "tags":        ["camera", "vision", "io"],

  "platform_mask": 6,              // bitmask: 1=Windows, 2=Linux, 4=macOS, 0xFFFF=all
  "palette_visible": true,

  "params":      [ /* ParamDef[] */ ],
  "child_lists": [ /* ChildListDef[] */ ],
  "exec_flags":  { /* ExecFlags */ },
  "events":      [ /* EventDef[] */ ],

  // The default block JSON written when user inserts from palette
  "default_block": {
    "kind": "videoCapture",
    "device": "", "outputPath": "", "width": 0, "height": 0,
    "timeoutMs": 5000, "storeAs": "imagePath"
  },

  // Plugin provenance
  "plugin_id":   "builtin.video",  // "builtin.*" | dll filename | package id
  "version":     "1.0.0",
  "contributes_to": []             // placeholder: future capability groups / "roles"
}
```

---

## 3 — C++ plugin interface

### 3.1 In-process (current) side

`BlockDescriptor` in `builtin_blocks.hpp` grows to embed the full manifest:

```cpp
struct BlockDescriptor {
    // --- existing ---
    std::string kind;
    std::string label;
    std::string description;
    std::string group;
    nlohmann::json default_block;
    nlohmann::json params;          // ParamDef[]  — typed params replacing bare JSON
    nlohmann::json flags;
    std::uint32_t platform_mask = 0xffffffffu;
    bool palette_visible = true;
    BlockHandler handler = nullptr;

    // --- new ---
    std::string icon;               // icon key
    std::string color;              // CSS hex or empty
    std::vector<std::string> tags;
    nlohmann::json child_lists;     // ChildListDef[]
    nlohmann::json exec_flags;      // ExecFlags
    nlohmann::json events;          // EventDef[]
    std::string plugin_id = "builtin";
    std::string version   = "1.0.0";
    std::vector<std::string> contributes_to;

    // Serialise to BlockManifest JSON (sent over RPC to UI)
    nlohmann::json to_manifest() const;
};
```

Helper builders mirror the existing `block_descriptor()` free function family but
use a fluent API to stay readable:

```cpp
auto d = BlockBuilder("videoCapture", video_capture_block)
    .label("Still Capture").group("Video")
    .description("Capture a still frame …")
    .icon("camera").color("#0ea5e9")
    .platform(PLATFORM_WINDOWS)
    .exec({ .supports_cancel = true })
    .param(ParamBuilder("device").kind(ParamKind::String)
           .label("Device").group("input").uses_previous(false))
    .param(ParamBuilder("outputPath").kind(ParamKind::OutputPath)
           .label("Output path").group("output").uses_previous(false))
    .param(ParamBuilder("timeoutMs").kind(ParamKind::Integer)
           .label("Timeout").group("options").default_val(5000))
    .param(ParamBuilder("storeAs").kind(ParamKind::VariableRef)
           .label("Store as").group("output"))
    .build();
```

### 3.2 DLL plugin interface (C ABI)

A DLL plugin exports exactly two symbols:

```cpp
// Version of the xblox plugin ABI this DLL was compiled against.
extern "C" __declspec(dllexport)
int xblox_plugin_abi_version() { return 1; }

// Fill `registry` with all blocks this plugin provides.
// Called once at startup (or on hot-reload).
extern "C" __declspec(dllexport)
void xblox_plugin_register(media::xblox::blocks::BlockRegistry* registry,
                            const media::xblox::blocks::PluginContext* ctx);
```

`PluginContext` provides:
- Logger sink
- Path to plugin's own data directory
- Access to shared `ExecutionOptions` defaults
- `xblox_abi_version` for the host

Plugin loader in `register_builtin_blocks()` (or a new `PluginLoader` class):

```
for each .xblox-plugin.dll in <plugins_dir>:
    load dll
    check xblox_plugin_abi_version()
    call  xblox_plugin_register(&registry, &ctx)
```

Hot-reload (future): `PluginLoader::reload(path)` calls the DLL's optional
`xblox_plugin_unregister()`, FreeLibrary, re-LoadLibrary, re-register.

---

## 4 — Host → UI RPC

### 4.1 Current shape (to be replaced)

Today the host sends:

```json
{ "registeredCommands": [ { "kind": "cli", ... } ] }
```

The UI has static switch tables for everything else (block colours, child-list
keys, param widgets).

### 4.2 New shape

The xblox document payload grows a `block_manifests` array:

```json
{
  "path":     "…/my.xblox",
  "document": { … },
  "commands": { … },

  "block_manifests": [
    { "kind": "shell",        "label": "Shell",        "group": "Shell",   "params": [...], "exec_flags": {...}, … },
    { "kind": "videoCapture", "label": "Still Capture","group": "Video",   "params": [...], "exec_flags": {...}, … },
    …
  ]
}
```

Sent once on document load, and again whenever plugins change (hot-reload event).

The UI (`PrototypeApp.tsx`) stores these in a `Map<string, BlockManifest>` and
passes them down. Every component that currently has a kind-string switch reads
from this map instead:

| UI component | Current | New |
|---|---|---|
| Palette | static `BUILTIN_PALETTE` list | `block_manifests.filter(m => m.palette_visible)` |
| Block colour badge | `kindColor(kind)` switch | `manifest.color ?? groupColor(manifest.group)` |
| Tree label | `blockLabel(block)` switch | `manifest.label` + first non-empty required param |
| Child-list expand | `getChildren(block)` switch | `manifest.child_lists[]` |
| Property panel | bespoke editor per kind | generic `ParamDef[]`-driven renderer |
| `blockLabel` in header | 20-case switch in `BlockModel.ts` | `manifest.label` |

### 4.3 Fallback / offline mode

When running standalone (no native host), the web app ships a **static manifest
bundle** generated at C++ build time:

```
npm run gen:manifests
  → runs `tanit-cli xblox info --json`
  → writes apps/xblox/src/generated/block-manifests.json
```

This gives the UI palette, colours, and param editors without a live host.

---

## 5 — UI implications

### 5.1 Property panel (generic param renderer)

The property panel iterates `manifest.params[]` and selects a widget per `kind`:

| ParamKind | Widget |
|---|---|
| `string` / `expression` | `VariableInputField` (text + variable picker magic button) |
| `integer` / `float` | Number input with optional min/max |
| `boolean` | Toggle |
| `enum` | `XbloxSelect` with `enum_values` |
| `file_path` / `audio_path` / … | `VariableInputField` + file-browser trigger |
| `output_path` | Same, but hint "will be created" |
| `args_list` | `VariableTextField` (multi-line, one arg per line) |
| `variable_ref` | `XbloxSelect` populated from root-scope keys |
| `json_value` | Code editor (future) |

Groups (`input` / `output` / `options` / `advanced`) map to the existing
collapsible section structure; `advanced` starts collapsed.

No more bespoke `ShellParamsEditor`, `CommandPropsEditor`, etc. — those were
workarounds for missing metadata. They go away once all params carry proper kinds.

### 5.2 Palette

Built from `block_manifests` grouped by `manifest.group`. Palette order within
group is `manifest.palette_order` (integer, optional, default `50`).

### 5.3 Tree view row label

```
<kind_badge color={manifest.color}>{manifest.label}</kind_badge>
<param_summary>
  {manifest.params
    .filter(p => p.group === "input" && !p.hidden)
    .slice(0, 2)
    .map(p => block[p.name] ?? "")
    .join(" · ")}
</param_summary>
```

No more `blockLabel()` switch.

---

## 6 — Execution model

Rather than adding more boolean params, execution-model choices the user can
make per block are surfaced as **first-class block options** in a dedicated UI
section, gated by `exec_flags`:

| exec_flag | User-visible control | Notes |
|---|---|---|
| `supports_background` | "Run in background" toggle | Block starts and chain continues immediately |
| `supports_cancel` | Stop button active | Visual indicator; no UI control needed |
| `is_blocking` (false) | "Async" toggle | Fires and forgets; chain continues |
| `singleton` | _(informational)_ | UI shows warning if block already running |

**Not** exposed as user-settable for now:
- `is_container` — purely structural
- `min_duration_hint_ms` — future progress bar hint

Common runtime options (`enabled`, `continueOnError`, `storeAs`) remain as
universal params declared on every block by the registry helper rather than
repeated by each plugin author:

```cpp
BlockBuilder& BlockBuilder::with_universal_params() {
    // appends enabled, continueOnError, storeAs
}
```

---

## 7 — Migration path

### Phase 0 — Already done
- `BlockDescriptor` has `kind`, `label`, `group`, `description`, `params` (JSON), `platform_mask`, `palette_visible`
- `registered_block_definitions()` collects and serialises them
- Host sends palette via RPC; UI has some static manifest data

### Phase 1 — Enrich existing descriptors
- Add `ParamKind` enum; update all `params` JSON to include `"kind"` on each entry
- Add `child_lists`, `exec_flags`, `color`, `icon` to `BlockDescriptor`
- Implement `BlockDescriptor::to_manifest()` serialiser
- Add `block_manifests` to the xblox document payload
- UI: store manifests in context; replace `kindColor()`, palette listing, child-list expansion

### Phase 2 — Generic property panel
- Implement `ParamKind`-driven widget selector
- Remove `ShellParamsEditor`, `CommandPropsEditor` kind-specific overrides
- Property panel reads `manifest.params[]` only

### Phase 3 — Generic tree label
- Replace `blockLabel()` switch with manifest-driven label + summary
- Remove `BLOCK_KIND_*` string constants from `BlockModel.ts`

### Phase 4 — DLL plugin loading
- Define `PluginContext` struct
- Implement `PluginLoader` (LoadLibrary, symbol resolution, versioning)
- Gate behind `FEATURE_XBLOX_PLUGINS` cmake flag
- Ship first external plugin: `xblox-robocar.dll` (Modbus + serial)

### Phase 5 — Hot-reload + dev-mode
- `PluginLoader::watch()` uses ReadDirectoryChangesW to detect DLL changes
- Host sends `xbloxPluginsChanged` event; UI refreshes manifests without restart
- Dev tooling: `npm run gen:manifests` bakes static bundle for standalone mode

---

## 9 — NH type system integration

The `NH_Parameter` family (ported from NodeHub, stripped of ImGui/node-editor
dependencies) is now the canonical typed parameter runtime for XBlox blocks.

### 9.1 File layout

```
src/
  types.h              — NH_ParameterTypeDesc, function-pointer typedefs, return codes
  enums.h              — NH_OBJECT_FLAGS, NH_BEHAVIOR_FLAGS, NH_PARAMETERTYPE_FLAGS,
                          all NHP_GUID_* constants (primitives + XBlox domain GUIDs)
  xblox/
    BaseManager.h      — minimal NH_BaseManager base (no external deps)
    Object.h / .cpp    — NH_Object base (nlohmann/json serialisation, no App/Container)
    Parameter.h / .cpp — NH_Parameter: typed buffer storage, GetValue/SetValue
    ParameterIn.h/.cpp — NH_ParameterIn: read-only, direct/shared source chain
    ParameterOut.h/.cpp— NH_ParameterOut: write side, destination fanout
    ParameterManager.h/.cpp — registers NH_ParameterTypeDesc by Uuid64 GUID
    Context.h / .cpp   — NH_Context: owns manager, factory for In/Out params
```

### 9.2 Registered type GUIDs

```
Primitive seeds
  NHP_GUID_FLOAT       float
  NHP_GUID_INT         int
  NHP_GUID_BOOL        bool
  NHP_GUID_STRING      char* / variable-size
  NHP_GUID_VECTOR      float[3]

XBlox domain types (all variable-size string-backed unless noted)
  NHP_GUID_FILE_PATH   local file path
  NHP_GUID_DIR_PATH    local directory path
  NHP_GUID_EXPRESSION  muParser / interpolation expression
  NHP_GUID_JSON        arbitrary JSON payload
  NHP_GUID_PROMPT      multi-line text / LLM prompt
  NHP_GUID_DEVICE_NAME audio or video device name string
  NHP_GUID_IMAGE_REF   image file path or PREVIOUS sentinel
  NHP_GUID_AUDIO_REF   audio file path or PREVIOUS sentinel
  NHP_GUID_VIDEO_REF   video file path or PREVIOUS sentinel
  NHP_GUID_DURATION_MS integer millisecond duration
```

### 9.3 Mapping to ParamKind

| `NHP_GUID_*`      | `ParamKind`   | UI widget                        |
|-------------------|---------------|----------------------------------|
| `_STRING`         | `string`      | text input + variable picker     |
| `_INT`            | `integer`     | number spinner                   |
| `_FLOAT`          | `float`       | decimal spinner                  |
| `_BOOL`           | `boolean`     | toggle / checkbox                |
| `_EXPRESSION`     | `expression`  | text input + eval hint           |
| `_FILE_PATH`      | `file_path`   | path picker (read)               |
| `_DIR_PATH`       | `dir_path`    | directory picker                 |
| `_IMAGE_REF`      | `image_path`  | filtered path picker             |
| `_AUDIO_REF`      | `audio_path`  | filtered path picker             |
| `_VIDEO_REF`      | `video_path`  | filtered path picker             |
| `_PROMPT`         | `string`      | multi-line text area             |
| `_DEVICE_NAME`    | `string`      | device-name text + picker        |
| `_JSON`           | `json_value`  | JSON editor                      |
| `_DURATION_MS`    | `duration_ms` | spinner with "ms" label          |

### 9.4 Block manifest integration (Phase 1)

When `BlockDescriptor::to_manifest()` is implemented (Phase 1), each `ParamDef`
will carry its `type_guid` alongside `kind`:

```jsonc
{
  "name":      "filePath",
  "kind":      "file_path",
  "type_guid": "a1b2c3d4-00000001",   // NHP_GUID_FILE_PATH
  "label":     "File",
  "group":     "input"
}
```

The host RPC payload already transports this as part of `block_manifests`.
The UI resolves the `type_guid` to its `ParamKind` for widget selection;
the C++ runtime resolves it to an `NH_ParameterTypeDesc` for typed validation.

### 9.5 What is NOT yet used

- `NH_ParameterIn` / `NH_ParameterOut` source–destination wiring is compiled in
  but not yet connected to the XBlox `PREVIOUS` chain.  That wiring is the Phase 1
  task: replace the JSON-string `PREVIOUS` sentinel with typed `NH_ParameterOut →
  NH_ParameterIn` links so mismatched types surface at graph-build time.
- `NH_Context` is instantiated per-session but not yet passed into `BlockRuntime`.
  Phase 1 will add `BlockRuntime::param_context` so blocks can query typed outputs
  from previous steps.


- **contributes_to** — placeholder field for capability groups (e.g. `"vision"`, `"speech"`).
  Allows future "smart insert" suggestions and graph-level validation. No design yet.
- **Event subscription model** — should blocks declare which events they fire so downstream
  blocks can subscribe? Deferred; scope is large.
- **Block versioning / migration** — when a param is renamed across plugin versions, how
  does the runtime upgrade saved `.xblox` files? Needs a `migrations[]` field on the manifest.
- **WASM / sandboxed plugins** — DLL ABI is Windows-only; a WASM sandbox could enable
  cross-platform community plugins. Completely deferred.
- **UI-only blocks** — blocks that have no C++ handler but manipulate the graph (notes,
  dividers). Need a `"ui_only": true` flag and a client-side execution skip.
  - *Partly addressed:* a `group` block now exists — a transparent container that
    runs its children in the inherited scope. The deprecated `runScript` kind is
    repurposed as a hidden alias of `group` (`palette_visible = false`, filtered
    out of the manifest/palette by `registered_block_definitions()`) so saved
    documents keep running their children instead of erroring; new flows should
    use `group`. Manifest now carries `paletteVisible` for the UI to honour.


---

## 10 — Scope frames & parameter-store execution

This section supersedes the earlier hand-wave about "flat scope". It is the
authoritative model for variable lifetimes, loops, and `PREVIOUS`.

### 10.1 What the runtime does today (baseline)

Execution is **already nested**: a container block (`if` / `for` / `while` /
`switch`) runs its child block-list, and any `setVariable` a child performs
writes into the **same single mutable store** the parent reads
(`nlohmann::json context` + `NumericContextStore numeric_context` in
`xblox_commands.cpp`). There is one store for the whole run.

Consequences observed in the `_probe_scope` test:
- `total` accumulates across iterations (✔ desired — children collect into parent).
- the loop counter `i` and a body-local `loopLocal` **leak** out of the loop and
  remain visible afterward (✗ usually undesired).

So the issue is **not** "no nesting" — it is "no per-frame isolation". A block
that runs sub-blocks and harvests their new variables is a real and wanted
pattern; we must keep it while gaining the ability to scope-out temporaries.

### 10.2 Target model — scope frames + exit policy

A `Scope` frame is pushed when a container runs a child-list and popped on exit.
Name resolution walks **child → parent** (lexical). Assignment to an existing
name updates the nearest frame that defines it; a brand-new name is created in
the current frame.

On exit the container declares an **exit policy** (not a single hard rule):

| policy    | locals on exit                              | typical block               |
|-----------|---------------------------------------------|-----------------------------|
| `inherit` | merged up into the parent frame             | `if`, plain sequence groups |
| `isolate` | discarded                                   | `for` counter, body temps   |
| `collect` | gathered into the block's *result* output   | `for`/`map` harvesting rows  |

`PREVIOUS` is special and **always hoists** to the parent regardless of policy —
it is the block's "last result" and the next sibling expects it. Inside a loop,
`PREVIOUS` is inherited on entry, updated each iteration, and the final value is
hoisted out.

The policy comes from the descriptor (`ExecFlags` → `BlockRunFlag::Isolate` /
`BlockRunFlag::Collect`), so it is declared per block-type, not hard-coded into
the executor.

### 10.3 Variable storage — backed by NH_Parameter

Each scope frame owns its variables as `NH_ParameterOut` instances (created via
`NH_Context`):
- **Numeric** vars use the inline-scalar fast path (`SetScalar` / `GetScalarPtr`)
  — the `NH_Parameter` union is now 64-bit so a `double` lives inline with no
  heap and a **stable address**.
- **String / path / json** vars use the heap buffer path (`SetValue`).

`muParser` binds to the numeric vars lazily through `SetVarFactory`: when an
expression references `x`, the factory walks the scope chain, finds (or lazily
creates) the `NH_ParameterOut` for `x`, and returns its `GetScalarPtr()`. The
pointer stays valid for the frame's lifetime, so the parser caches it across
`Eval()` calls and writes back through the same address. This replaces the eager
`NumericContextStore` snapshot-and-`DefineVar`-per-eval approach.

### 10.4 Implementation slices

- [x] **S0 (done)** — widen `NH_Parameter` union to 64-bit; add
  `SetScalar/GetScalar/GetScalarPtr` + inline-storage discriminant so the dtor
  never frees a scalar. (`Parameter.h/.cpp`)
- [x] **S0 (done)** — replace `BlockRunFlags` bool-struct with extensible
  `BlockRunFlag` bitmask + `BlockRunSpec` (`runtime.hpp`); rewire producer and
  `execute_block_list`. New bits reserved: `Isolate`, `Collect`, `Singleton`.
- [x] **S1 (done)** — `Scope` / `ScopeStack` engine (`Scope.h/.cpp`): each frame
  owns its numeric vars as `NH_ParameterOut` (inline scalar, stable `double*`);
  resolution walks parent chain; push/pop with `Inherit`/`Isolate`/`Collect`
  exit policy; `PREVIOUS` always hoists. Verified by `xblox selftest`.
- [x] **S2 (proven)** — muParser `SetVarFactory` binds to the `ScopeStack`
  (`scope_var_factory`): unknown vars resolve/lazily-declare against the chain
  and return a stable pointer muParser caches across `Eval()`, so writes through
  the scope are reflected without re-binding. Proven in isolation by the
  selftest.
- [x] **S2.1 (done) — expression runtime reads the scope chain (single source).**
  `eval_mu_expression` no longer builds its muParser variable pool from the JSON
  context (`collect_numeric_vars`). When the live executor supplies a `ScopeStack`
  (the normal path), it binds every variable **visible in the frame chain**
  (`bind_scope_vars`) to that variable's stable inline `double*`, child-frame
  shadowing outer (lexical). So the scope is the single source of truth for
  user/loop numerics and the old JSON mirror can no longer feed a stale value into
  an expression. Notes:
  - We rebind from the chain each `Eval()` (explicit `DefineVar`) rather than the
    lazy `SetVarFactory`, because the parser is cached per-expression and loop
    frames hand out fresh pointers across pop/push — per-eval rebinding stays
    correct without stale-pointer risk, and unknown names error instead of being
    silently declared as `0`.
  - `PREVIOUS` is global by design (hoists, never frame-scoped); it's bound from
    the numeric slot cache, not JSON. `nowMs` is a clock input.
  - Initial run `context` numerics are seeded into the root frame at startup so
    seed vars (`context:{ seed:3 }`) resolve as scope variables.
  - The JSON context mirror still exists, but only as the **surface** for `${…}`
    string interpolation, `getVariable` reads, and event serialization — it is no
    longer consulted by the numeric expression runtime. A `scopes == nullptr`
    fallback (detached background runs) keeps the legacy JSON pool.
  - Verified by `test:xblox-next` (`variables`/`expressions`/`loops`/`scoping`,
    incl. a `PREVIOUS + 1` expression assertion).
- [x] **S3 (done)** — the live executor now threads a per-run `ScopeStack`
  (via `FlowState::scopes`, created by a pimpl `ScopeSession` so the executor
  needn't include the NH headers / collide with Win32 `E_FAIL` macros).
  `for`/`while` handlers wrap their body in an `Isolate` child frame (RAII
  `ScopeGuard`); numeric `setVariable` writes route through `ScopeStack::set`
  (nearest-defining-frame, so assignments to outer vars still accumulate) and on
  frame exit the frame's locals are erased from the JSON/numeric mirrors. `if`
  needs no frame (inherit is the natural default). `PREVIOUS` stays a global in
  the JSON context (hoists naturally) and is never frame-scoped. The compiled
  fast-path was dead code (only the general path runs), so nothing to migrate.
  Verified: `test:xblox-next` scoping suite flipped to isolated; legacy `fs` /
  `shell` / `context` *variable* suites still green. (The legacy `expressions` /
  `context` *command-flow* assertions fail — but for an unrelated reason: they
  drive control flow through `runScript` + `host.runCustomCommand(...)`, which
  the `runScript` repurpose retired. The modern form is a first-class
  `kind:"command"` block; `test:xblox-next` is the sanctioned green suite.)
- [~] **S4 (in progress)** — typed `BlockIO` accessor lands as an **additive**
  layer rather than a big-bang signature change. `BlockHandler`'s signature is
  unchanged; a handler opts in by constructing `BlockIO io{block, path, runtime}`
  at the top and routing reads/writes through it:
  - **Typed inputs** — `io.str / i64 / f64 / flag / str_any` coerce the raw JSON
    field to a concrete C++ type (with default), so block logic never touches
    `nlohmann::json` directly. `io.json("x")` is the single explicit escape hatch
    for blocks that genuinely operate on structured JSON (e.g. `Parse`).
  - **Multiple typed outputs** — `io.set_output(name, kind, value)` /
    `io.set_previous(...)` / `io.set_result(...)` publish named, kind-tagged
    outputs (the `outputs()` ledger is the LLM/host introspection surface) and
    flush through `set_context_value` (the RPC/serialization boundary). JSON only
    appears at the two boundaries `BlockIO` owns.
  - Migrated: `wait` (typed `ms`); `Parse` (typed `parser`/`filter`,
    `io.context` input resolution, `set_result` honouring `storeAs`→`target`);
    all of `fs_blocks` (the local `fs_jstr`/`fs_jbool`/`fs_store` helpers were
    deleted in favour of `io.str`/`io.flag`/`io.set_result`, while the two
    path-bearing fields keep `bv::resolve_field` for `${var}` interpolation,
    which `BlockIO` deliberately does not do). The `Parse` migration also fixed a
    latent bug: the handler read a `target` field while the manifest declared
    `storeAs`, so `storeAs` never took effect.
  - **B1 (in progress) — JSON-free handler bodies.** The goal is that handlers
    name neither `nlohmann::json`, `block`, nor `path`; JSON survives only in the
    executor (`xblox_commands.cpp`) and the manifest/RPC code. Pieces landed:
    - **`Value`** — the typed currency (`bool/int64/double/string` inline; a
      `shared_ptr<const json>` arm carries structured blobs *opaquely*, opened
      only by json-processing blocks via `as_json()`). `to_json()` is the single
      serialisation step.
    - **`EventBuilder`** — fluent, typed replacement for
      `runtime.emit(ExecutionEvent{…})`: `io.ok/warn/error(kind,msg).set(k,Value)`
      serialises to the report event on `.emit()` (or end-of-statement). It
      respects `events_enabled` and lets the runtime sink derive `error_code`.
    - **Implicit result** — `.result(v)` sets PREVIOUS (+ the block's
      `storeAs`/`target` sink, which the executor also flushes from
      `event.data["result"]`) and attaches `result` to the event in one step.
      No separate `set_result` call.
    - **Children by key** — `io.run("items")` / `io.has_children(key)` run a
      declared child list without the handler touching the JSON array.
    - Proven: **all of `fs_blocks`** now has fully JSON-free bodies
      (`io.str/flag` in, `io.ok(...).set(...).result(...)` out; the one
      structured output — `fsList` entries — is built as a blob and wrapped via
      `Value::from_json`). `bv::resolve_field` stays for `${var}` path/content
      interpolation.
  - **B2 (planned)** — once every body is migrated, flip `BlockHandler` to
    `bool(BlockIO&)` and delete the `block`/`path`/`runtime` params, so
    JSON-absence at the handler surface is **compiler-enforced**.
  - **B3 (planned)** — make the primary result a *returned* `Value`/`BlockOutcome`;
    the executor flushes PREVIOUS/storeAs, retiring even `.result()`.
  - **Decision (settled): Path B** — `BlockIO` is a coerce-on-read view; the
    `NH_Parameter`-backed implicit-cast/cache machinery lands at the *scope*
    layer (where it already powers numeric muParser binding, S1) and extends to
    rich buffer kinds (image/audio) only when a real buffer-handoff block exists.
    No speculative wrapping of trivial scalar params.
  - **Remaining**: migrate handler bodies file-by-file (`audio_blocks`,
    `video_blocks`, `network_blocks`, `shell_blocks`, `app_blocks`,
    `modbus_blocks`, plus the rest of `builtin_blocks`), building between each.
    Backing the typed surface with real `NH_ParameterIn/Out`
    instances (vs. the current coerce-on-read view) is a follow-up decision —
    the view keeps the hot path allocation-free and avoids pulling the NH/Win32
    headers into the widely-included `builtin_blocks.hpp`.

### 10.45 Executor-side parameter resolution + transform pipeline (R1 — done)

The handler no longer sources, defaults, or casts its own inputs — the executor
pre-resolves them into a typed frame before dispatch. Per declared `ParamDef`:

1. **Source** (`source_param`) — `explicit field → declared source → default`.
   The source is declared, not hard-coded: `.prev()` (PREVIOUS), `.from_var(x)`
   (a named variable), `.from_expr(e)` (future), else the literal field. An empty
   string on a sourced param defers to the source (the documented "leave empty to
   use PREVIOUS"). Value-sourcing is skipped for `variable_ref` kinds (those carry
   a *name*, dereferenced by the handler).
2. **Transform / cast** (`transform_param`, the "zod-like" stage) — coerce + validate
   the sourced json against the schema already on the def: integer/`duration_ms`
   and `float_` coerce and **clamp to `range(min,max)`**; `enum_` validates
   membership; `boolean_` normalises; `json_value`/`args_list` stay opaque; the
   rest collapse to string (interpolation still happens in the handler). Validation
   issues are recorded in `ResolvedInputs::diagnostics` (param-prefixed) rather than
   aborting — normal execution stays best-effort; strict/simulate modes will act on
   them.

The result is a `ResolvedInputs` frame (`vector<pair<name, Value>>`, declaration
order) stashed on `BlockRuntime::inputs`. `BlockIO`'s `str/i64/f64/flag` read the
typed frame first; only **undeclared** fields (e.g. `id`, Parse's dynamic var name
via `str_any`) fall back to the lazy field→source lookup. Because resolution is a
pure read of context, the same frame can be built *without* running the handler —
the basis for prediction and simulate mode (R3).

`fs_blocks` is the reference migration: handlers read `io.str("path")` /
`io.str("content")` (sourcing decided by `.prev()` in the schema) and only apply
`bv::resolve` for `${var}` interpolation; no `io.context("PREVIOUS")` remains.

### 10.46 Simulate / emulate mode + diagnostic surfacing (R3 — done)

Built on the pure resolver: inputs are always resolved, but **side-effecting
blocks are suppressed** so a flow can be dry-run without touching the world.

- **Classification.** `ExecFlags::has_side_effects` (default **true** — unknown/new
  blocks are conservatively suppressed). Container blocks (`is_container`) always
  run (they only orchestrate children). Pure dataflow/control leaves opt out via
  the builder's `.pure()`: `setVariable`, `getVariable`, `log`, `break`,
  `Parse`/`parse`. `wait` stays side-effecting so simulate skips its sleep.
- **Flag.** `ExecutionOptions::simulate` (CLI `xblox run --simulate`). Distinct
  from `--dry-run`, which only stages *external* commands.
- **Suppression.** For a suppressed leaf the executor calls `emit_simulated_block`
  instead of the handler: emits an `ok` event with `data.simulated=true`, the full
  resolved `inputs`, any `diagnostics`, and a **predicted result** — the resolved
  `path`/`output`/`file`/`dest`/`url` input (most side-effecting blocks output the
  path they would produce), fed into `PREVIOUS` + `storeAs` so downstream blocks
  still chain. `command` blocks are suppressed the same way.
- **Diagnostic surfacing.** When the resolver records validation issues
  (out-of-range, bad enum, type mismatch), the executor emits a non-fatal
  `warning` event carrying `data.diagnostics` before dispatch — in **both** normal
  and simulate mode. Execution stays best-effort.

Verified by `test-xblox-next` suites `transform` (enum/range diagnostics are
surfaced and non-fatal; valid inputs don't over-warn) and `simulate` (file is NOT
written, an `ok (simulated)` event fires with the predicted path, the path flows
into `storeAs`, pure `setVariable` still runs, and a control run without
`--simulate` actually writes the file). Harness total: **46 passed, 0 failed**.

**Still deferred:** `variable_ref` as a first-class resolved kind; custom named
transforms (registry hook); a "predict the whole flow ahead" planner (the resolved
frame + simulate make it mechanical — resolve each block, thread PREVIOUS/vars,
collect predicted results without dispatch).

### 10.47 Handler surface flip: `bool(BlockIO&)` (B2 — in progress)

The block-handler contract drops raw JSON from its arguments. With sourcing,
defaulting, casting and validation now owned by the executor (§10.45), a handler
needs nothing but the typed facade:

```cpp
using BlockHandler       = std::function<bool(BlockIO&)>;            // the surface
using LegacyBlockHandler = bool (*)(const nlohmann::json&,
                                    const std::string&, BlockRuntime&); // old form
```

- **`std::function`, not a raw pointer** — a handler can be a free function, a
  lambda, or a stateful closure. That is what later lets a DLL plugin register a
  capturing handler, and it answers the "can the resolver/validator be closures?"
  question: yes — anything callable as `bool(BlockIO&)` is a block.
- **The executor owns `BlockIO`.** It builds it once (raw block + path + runtime
  sinks + the pre-resolved `ResolvedInputs` frame) and calls `handler(io)`. The
  handler never sees `nlohmann::json`, a path string, or `BlockRuntime` in its
  signature; it reads typed inputs (`io.str/i64/f64/flag`) and writes via the
  `EventBuilder`/`set_result` sinks.

**Migration is incremental and churn-free at the call sites.** Two adapters in
`builtin_blocks.hpp` bridge the not-yet-migrated handlers:

```cpp
inline BlockHandler legacy(LegacyBlockHandler fn) {           // explicit wrap
    return [fn](BlockIO& io) { return fn(io.raw(), io.path(), io.runtime()); };
}
struct HandlerArg { /* implicit from native fn-ptr, lambda, or legacy fn-ptr */ };
```

`bdb()` / `block_descriptor()` take a `HandlerArg`, so a registration passes
*either* a native `bool(BlockIO&)` handler or a legacy fn-ptr **unchanged** — the
legacy one auto-adapts. Because the wrapper rebuilds `BlockIO` over the *same*
`BlockRuntime`, adapted handlers still see the resolved input frame; behaviour is
identical. A handler is migrated by flipping its signature to `bool(BlockIO&)` and
deleting its `BlockIO io{block, path, runtime};` prologue — nothing else moves.

**Status.** `fs_blocks` (all 6: `fsRead/Write/Exists/Delete/List/Mkdir`) are
native and JSON-free — the reference for the rest. Everything else
(`builtin`, `data/parse`, `network`, `shell`, `audio`, `video`, `modbus`, `app`)
runs through `legacy()`/`HandlerArg` until migrated file-by-file. Spec-table files
(`app`, `modbus`) type their `handler` field as `LegacyBlockHandler` for now.
Verified: clean `build:cpp`, `test-xblox-next` **57 passed, 0 failed**. Per-file
`*_block_handler` lookups are dead (the cached registry is the single dispatch
path) and are candidates for removal in the cleanup pass.

### 10.48 Declared param preconditions: `ParamConstraint` (R1.1 — done)

Per-handler validation boilerplate (`if (empty)`, `if (!exists)`, `if (!open)`)
is replaced by **declared preconditions** on the `ParamDef`, checked centrally by
the resolver and surfaced as `Diagnostic`s. Because the resolver already knows the
param's `kind` (e.g. `file_path`) and now its final value, the check lives there,
not in the handler.

- **`ParamConstraint` (bitmask enum).** Extensible flags: `NonEmpty`, `MustExist`,
  `Readable`, `Writable`, `IsFile`, `IsDir`, `ParentExists`, `CreateParents`,
  `Absolute`. Builder sugar on `ParamDef`: `.must_exist()` (= MustExist|Readable),
  `.writable()`, `.create_parents()`, `.as_file()/.as_dir()`, `.nonempty()`,
  `.constrain(c)`. Serialized in `to_json()` so the UI/LLM see the contract.
- **`Diagnostic { param, message, severity }`** replaces the old `vector<string>`.
  `severity` 1 = best-effort (clamp/enum coercion, advisory) → non-fatal `warning`;
  `severity` 2 = a **violated precondition** → the executor emits an `error` event
  and **skips the handler** (`ResolvedInputs::has_errors()`), in both normal and
  simulate mode, so a doomed block is *predicted, not run*.
- **Interpolation moved into the resolver.** `${var}` expansion for string/path
  kinds (`is_interpolatable`) now happens in `resolve_block_inputs`, so the frame
  holds final values, constraint probes see the real path, and handlers drop
  `bv::resolve` entirely (`fs_path` is just `io.str("path")`).
- **Effect + mode awareness.** Probes are read-only (`exists`/type/perms) and run
  in every mode. `CreateParents` is the one *effectful* flag: it builds the parent
  tree on a real run, but under `--simulate` it is suppressed yet still treated as
  *satisfied* (predicted), so a simulated write neither fails nor touches disk.
- **Forward-looking (async/host).** High bits (`RequiresPermission`, …) are
  reserved for **host-mediated / asynchronous** constraints (e.g. an app-level
  permission prompt). Those are deliberately *not* resolved by the synchronous
  `validate_constraints` probe; they belong to a future **capability gate** in the
  executor that can await a host RPC (reusing the background/async machinery)
  before dispatch. The `Diagnostic`+severity+skip pipeline is the substrate that
  gate plugs into.

`fsRead` declares `.must_exist()` and `fsWrite` `.writable().create_parents()`;
their handler bodies lost every guard. Verified by the `constraints` suite (missing
file → precondition error + handler skipped; real file runs clean; empty path →
required-but-empty; `create_parents` builds the tree on a real write; `--simulate`
suppresses both the write and the dir).

### 10.485 Composable resolution features: `ParamResolve` (done)

Resolution is **composed from features on a `ParamDef`**, not keyed by a new
`ParamKind`. A `file_path`/`dir_path` already interpolates `${var}`; layering glob
expansion is just `pd_dir("path").globs()` — same kind, more features. This mirrors
the `ParamConstraint` bitmask pattern and keeps the kind taxonomy small.

- **`ParamResolve` (bitmask enum).** `Variables` (`${var}`/`${ENV:…}`/
  `${KNOWNFOLDER:…}` interpolation) and `Globs` (`*`,`?`,`**` → a list of matching
  paths). Builder sugar: `.vars()`, `.globs()` (implies `Variables`),
  `.resolves(set)`. Serialized in `to_json()` (`"resolve": ["variables","globs"]`).
- **Default from kind, composed by the param.** `resolve_block_inputs` computes
  the effective set as `kind-default | declared` — interpolatable kinds get
  `Variables` implicitly (so nothing regresses), and a param opts into `Globs` on
  top. Features run **in order**: Variables first (so `${ENV:ROOT}/*` interpolates
  before globbing), then Globs.
- **Glob output is an array.** When a `.globs()` param's value carries glob tokens,
  the resolver expands it (via `media::path_matches_path_glob`, splitting a literal
  base dir from the glob remainder) and stores a **JSON array** of matched paths in
  the frame. No glob tokens → the value stays a scalar (a plain directory path).
  Handlers read the typed result through `io.value(name)->is_array()`.
- **`fsList` is the reference consumer.** Its `path` is `pd_dir("path").globs()`
  plus an `only` enum (`all`/`dir`/`file`). Glob mode stats each matched path;
  scalar mode enumerates the directory; `only:"dir"` lists folders only. So
  `fsList ${ENV:HOME}/*  only:dir` lists desktop/home folders with **no new kind,
  no handler glob code** — the resolver did the work.

Verified by the `globs` suite (ENV-var interpolation + `*`/`*.txt` expansion +
type filter + scalar-dir fallback, composed with `group`/`for` scope and
`set/getVariable`). Future resolvers (URL fetch, expression-valued params, …) slot
into the same enum without touching kinds or handlers.

### 10.486 App-level resolve hooks: `ParamResolve::Custom` (done)

Composition again — not a new mechanism. A param opts in with `.guard()`
(`ParamResolve::Custom`), and the resolver consults **app-level hooks registered at
xblox initiation** for that value. A hook can **rewrite** the value (redirect a
path) or **veto** it (the block won't run). The veto reuses the existing pipeline:
a scalar veto pushes a `severity-2 Diagnostic` → `has_errors()` → the executor
emits an error and skips the handler. **No executor change** — the hook just feeds
the same route a failed precondition takes.

- **`ResolveHook` lives in `ExecutionOptions`** (`runtime.hpp`), so it's passed in
  at init and reachable from the resolver via `rt.options.resolve_hooks`. It's
  string-centric (`ResolveHookInput{ block_kind, param, param_kind, value,
  writable, simulate }` → `ResolveHookOutput{ deny, severity, message, rewrite,
  value }`) so this layer stays free of the blocks `Value`/`ParamDef` types.
- **Ordering.** Hooks run in `resolve_block_inputs` **after** Variables + Globs
  (so they see the final, interpolated/expanded value) and **before**
  `validate_constraints`. First veto wins.
- **Scalar vs list.** A scalar veto is fatal (block skipped). For a glob-expanded
  list each match is run through the chain and a vetoed entry is *filtered out* as
  a non-fatal advisory (`severity 1`), so the surviving matches still flow.
- **Wiring (CLI).** `register_xblox_resolve_hooks()` registers the real
  `media::llm::llm_fs_guard_*` policy (read vs write deny-lists, keyed off the
  `Writable`/`CreateParents` hint) for path-shaped params, plus an env-gated dev
  hook (`XBLOX_DENY_PATH_SUBSTR`) used by the `hooks` suite. The fs blocks flag
  their `path` params with `.guard()`.
- **Async / host-mediated.** These hooks are synchronous predicates. The
  capability gate reserved by `ParamConstraint::RequiresPermission` (an awaited
  host RPC / permission prompt) is the asynchronous sibling and plugs into the same
  `Diagnostic`+skip substrate later.

Verified by the `hooks` suite (scalar veto skips the handler; control run with no
match runs clean; a denied glob match is filtered while the listing succeeds).

### 10.487 Composition: any block may carry `items` children (done)

Realisation that collapses a lot of would-be machinery: **a block is not special
because it has children — *any* block can.** After a leaf block's handler runs,
the **executor** (`run_child_blocks`, `xblox_commands.cpp`) runs any `items` list
the block carries, in an **`Isolate` child frame**, with `PREVIOUS` already set to
the block's result. So plain nesting *is* a pipeline:

```
fs_read → Parse(.nested.v) → fs_write
```

Each child consumes its parent's output via `PREVIOUS` — **no named variables, no
new block kinds.** Field projection is the existing `Parse` block's job
(`.field`, `.0`), which is why iteration needs no `pluck`. The nest's final value
is the last child's output; the producer's own result is still captured by its
`storeAs` (which runs *before* the children).

- **`ExecFlags::iterable`** (a single bit, end of the struct so the positional
  `.exec({...})` inits on the native containers stay valid) flips the loop from
  *once* to *once per element*: when the producer's result is a JSON **array**,
  the executor runs `items` for each element with `PREVIOUS` = the element plus a
  numeric **`index`** in the child frame. `fsList` opts in with `.iterable()`.
- **Native containers are skipped.** `if/for/while/switch/group` set
  `is_container` and drive their own child lists internally, so `run_child_blocks`
  early-returns for them — only leaf producers get the auto-run.
- **Scope reuse.** The loop drives the *same* `BlockRuntime` sinks handlers use
  (`push_scope`/`set_context_value`/`execute_block_list`/`pop_scope`), so isolated
  locals (and `index`) are stripped on pop by the existing `bridge_pop_scope`
  cleanup; `PREVIOUS` hoists as always. No bespoke scope code.
- **Async / background for free.** Because the loop lives in the executor (not the
  handler), it composes with the run flags: flag a producer `iterable` **and**
  `background` and the whole map runs on the detached worker. Per-*item*
  parallelism (a concurrent map) is a future flag on the same seam.
- **Simulate.** A side-effecting producer that *has* children is no longer
  suppressed (so the pipeline is observable); side-effecting **children** are still
  suppressed individually by the existing per-block gate.
- **UI.** `fsRead`/`fsWrite`/`Parse`/`fsList` now advertise an `items` child list
  in their manifest so the pipe is droppable; the backend runs `items` regardless
  of the declaration.

Verified by the `iterate` suite: the `fs_read → Parse → fs_write` nest persists
the projected value; `fsList` (iterable) runs children once per entry with
`index = 0,1,2`; `PREVIOUS` = the entry object and a child `Parse(.name)` projects
each filename; and a childless producer is byte-for-byte unchanged.

### 10.49 Header split: `builtin_blocks.hpp` by concern (done)

The ~1000-line `builtin_blocks.hpp` is split into focused, header-only concern
headers (no new `.cpp`, no CMake changes — implementations already lived in
`builtin_blocks.cpp`). `builtin_blocks.hpp` is now a thin **umbrella** that
re-includes them in dependency order, so all 18 existing includers keep working
unchanged. Prefer including the specific header when you only need part of it.

| header | concern | contents |
|---|---|---|
| `block_types.hpp` | types / IO | `BlockRuntime`, `BlockHandler`/`LegacyBlockHandler`, `ParamKind`, `Value`, `Diagnostic`, `ResolvedInputs`, `EventBuilder`, `BlockIO`, `legacy()`/`HandlerArg` |
| `block_validation.hpp` | validation | `ParamConstraint` bitmask (+ ops + `param_constraint_tokens`) |
| `block_params.hpp` | parameters | `ParamSource`, `ParamResolve` (feature bitmask), `ParamDef`, `pd_*` factories |
| `block_resolver.hpp` | resolver | `source_param`, out-of-line `BlockIO::def/resolved`, `resolve_block_inputs` decl |
| `block_registry.hpp` | registry | `ExecFlags`, `ChildListDef`, `BlockDescriptor`, `bdb()`/`block_descriptor()`, `builtin_block_*` lookups |
| `block_variables.hpp` | variables | `bv::resolve` — `${var}` interpolation (folds in app-level vars via `core/command_variables.hpp`) |

Ordering notes that constrain the layering: `Diagnostic`/`ResolvedInputs` sit in
`block_types.hpp` (not the resolver) because `BlockIO::frame()` reads the frame
inline and needs the complete type; `BlockIO::def/resolved` are *declared* in
`block_types.hpp` but *defined* in `block_resolver.hpp` (they need the complete
`ParamDef` + `source_param`). `block_variables.hpp` includes `block_types.hpp`
directly rather than the umbrella, breaking the otherwise-circular include.

The **variables** seam is where app-level resolution lands: `bv::resolve` already
overlays `media::commands::make_variable_map(runtime.options.command_context)`
(dates, CWD, `${ENV:…}`, `${KNOWNFOLDER:…}`) under the xblox context vars, so
app/folder variables resolve through the same path the resolver now calls up front
(§10.48). Future app-scoped/secret variables plug in there without touching blocks.

### 10.5 Test harness

`tests/orchestrator/test-xblox-next.mjs` is the legacy-free harness for the new
runtime. It drives the native `xblox` CLI directly (no `runScript`) and asserts
on emitted variable state / events. Suites: `engine`, `variables`, `expressions`,
`loops`, `previous`, `containers`, `scoping`, `transform`, `simulate`,
`constraints`, `globs`, `hooks`, `iterate`.

- `engine` shells `xblox selftest`, which runs the native `scope_selftest()` —
  scope-chain resolution, the three exit policies, `PREVIOUS` hoist, and the
  muParser var-factory binding. This is the S1/S2 regression gate.
- The `scoping` suite encodes the **baseline (leaky)** end-to-end behaviour; its
  `[BASELINE]`-tagged assertions flip to the isolate/collect expectations once
  S3 routes the live executor through `ScopeStack`.

Run: `npm run test:xblox-next` (or `-- --only engine`).
