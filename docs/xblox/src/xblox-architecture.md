# XBlox Architecture

A map of the native XBlox runtime: what the pieces are, how the headers depend
on each other, and how a block runs. For the design narrative and per-slice
history see [`xblox-next.md`](./xblox-next.md); this file is the structural
overview.

## Overview

XBlox executes a **document of blocks** (a JSON tree of `roots` + `context`).
Blocks are plugin-style units described by a self-contained **manifest**
(`BlockDescriptor`) and implemented as pure-ish handlers over a typed facade
(`BlockIO`). The runtime is a single C++ core shared by the CLI and the desktop
UI.

The core idea is a **resolve-then-dispatch** pipeline: the executor sources,
casts, interpolates and precondition-checks every declared parameter *before* a
handler runs, into a typed `ResolvedInputs` frame. Handlers therefore never touch
`nlohmann::json`, `PREVIOUS`, variables, or filesystem preconditions — they read
finished typed values and write results/events through sinks. This makes the same
machinery support **simulation** (suppress side effects, keep dataflow) and
**diagnostics** (validation/preconditions surfaced as events) for free.

Three layered subsystems:

- **Executor** (`xblox_commands.*`) — walks the block tree, owns control flow,
  scopes, events, and the `BlockRuntime` sink table.
- **Block runtime** (`blocks/block_*.hpp`) — the type vocabulary, parameter
  schema, resolver, registry, and the built-in/plugin handlers.
- **Scope + parameters** (`Scope.*`, `Context.*`, `Parameter*.*`) — `NH_`-backed
  numeric variable frames bound to muParser for expression evaluation.

## Files

| Layer | File | Role |
|---|---|---|
| Public API | `xblox_commands.hpp` | `run_blocks_file` / `run_block_roots` / `build_execution_plan` |
| | `runtime.hpp` | `ExecutionEvent/Options/Result`, `ScopePolicy`, `BlockRunFlag` |
| Executor | `xblox_commands.cpp` | `execute_block_list` → `execute_block`, `RuntimeBridge` sinks, simulate + diagnostics, background/cancel, command payloads |
| Block runtime | `blocks/builtin_blocks.hpp` | **umbrella** re-exporting the headers below |
| · types / IO | `blocks/block_types.hpp` | `BlockRuntime`, `Value`, `Diagnostic`, `ResolvedInputs`, `EventBuilder`, `BlockIO`, `BlockHandler`, `legacy()`/`HandlerArg` |
| · validation | `blocks/block_validation.hpp` | `ParamConstraint` bitmask |
| · parameters | `blocks/block_params.hpp` | `ParamSource`, `ParamDef`, `pd_*` factories |
| · resolver | `blocks/block_resolver.hpp` | `source_param`, `BlockIO::def/resolved`, `resolve_block_inputs` |
| · registry | `blocks/block_registry.hpp` | `ExecFlags`, `ChildListDef`, `BlockDescriptor`, `bdb()`, `builtin_block_*` lookups |
| · variables | `blocks/block_variables.hpp` | `bv::resolve` — `${var}` interpolation incl. app-level vars |
| · impl | `blocks/builtin_blocks.cpp` | registry build, `transform_param`, `validate_constraints`, `resolve_block_inputs` |
| Handlers | `blocks/fs_blocks.*` | filesystem (native, pure `bool(BlockIO&)` — reference migration) |
| | `blocks/{data,network,shell,audio,video,modbus,app}_blocks.*` | data/parse, HTTP, shell, capture, devices, Modbus, app automation (legacy-adapted) |
| Scope / params | `Scope.{h,cpp}` | `Scope`/`ScopeStack`/`ScopeSession` — `NH_Context`-backed numeric var frames + muParser binding |
| | `Context.*`, `Parameter*.*`, `ParameterManager.*` | `NH_` typed parameter system (implicit casting, caching) |
| Consumers | `cli/pm_image_cmd_xblox.cpp` | `xblox run` CLI (`--simulate`, `--no-wait`, `--json`) |
| | `cli/pm_image_cmd_info.cpp` | emits the block manifest for the UI |

## Module dependencies

How the block-runtime headers layer (umbrella re-exports everything; arrows = `#include`):

```mermaid
graph TD
    subgraph external
        RT["runtime.hpp"]
        CV["core/command_variables.hpp"]
    end

    T["block_types.hpp"]
    V["block_validation.hpp"]
    P["block_params.hpp"]
    R["block_resolver.hpp"]
    G["block_registry.hpp"]
    VARS["block_variables.hpp"]
    U["builtin_blocks.hpp (umbrella)"]

    RT --> T
    T --> P
    V --> P
    T --> R
    P --> R
    T --> G
    P --> G
    T --> VARS
    CV --> VARS

    U --> T
    U --> V
    U --> P
    U --> R
    U --> G

    IMPL["builtin_blocks.cpp"]
    U --> IMPL
    VARS --> IMPL
    HANDLERS["fs / data / network / ..."] --> U
    EXEC["xblox_commands.cpp"] --> U
```

Note `block_variables.hpp` includes `block_types.hpp` directly (not the umbrella)
to avoid a cycle, and is pulled in by the `.cpp` translation units that need
interpolation rather than by the umbrella.

## Runtime dispatch sequence

A single block, from CLI to handler:

```mermaid
sequenceDiagram
    participant CLI as pm_image_cmd_xblox
    participant EX as executor (xblox_commands)
    participant REG as BlockRegistry (cached)
    participant RES as resolve_block_inputs
    participant IO as BlockIO
    participant H as BlockHandler

    CLI->>EX: run_blocks_file(doc, options)
    EX->>EX: execute_block_list(roots)
    loop each block
        EX->>EX: execute_block(block, path)
        EX->>REG: builtin_block_handler / param_defs / exec_flags
        EX->>RES: resolve_block_inputs(block, defs, runtime)
        RES-->>EX: ResolvedInputs (values + diagnostics)

        alt diagnostics has severity ≥ 2
            EX-->>CLI: emit "error" (precondition failed)
            Note over EX: handler skipped (normal & simulate)
        else simulate and side-effecting leaf
            EX-->>CLI: emit "ok (simulated)" + predicted result
            Note over EX: side effect suppressed
        else dispatch
            EX->>IO: BlockIO{block, path, runtime}
            EX->>H: handler(io)
            H->>IO: io.str / i64 / flag (read frame)
            H->>IO: io.ok(...).result(v) (write)
            IO-->>EX: set PREVIOUS / storeAs + emit event
        end
    end
    EX-->>CLI: ExecutionResult (events + exit_code)
```

Container blocks (`if`/`for`/`while`/`switch`/`group`) re-enter via
`io.run(key)` → `execute_block_list`, pushing a `ScopePolicy` frame (loops
`Isolate`; `PREVIOUS` always hoists).

## Parameter resolution pipeline

What `resolve_block_inputs` does per declared `ParamDef`, producing the typed
frame the handler reads:

```mermaid
flowchart LR
    A["ParamDef"] --> B["source_param<br/>field → PREVIOUS / variable → default"]
    B --> C["transform_param<br/>cast + clamp range + enum check"]
    C --> D{"string / path kind?"}
    D -- yes --> E["bv::resolve<br/>variable interpolation"]
    D -- no --> F["validate_constraints<br/>MustExist / Writable / CreateParents"]
    E --> F
    F --> G[("ResolvedInputs")]
    C -. "warning (sev 1)" .-> X[["diagnostics"]]
    F -. "error (sev 2)" .-> X
    X --> G
```

- **source** is declared, not hardcoded (`.prev()`, `.from_var()`, else literal).
- **transform** clamps/validates against the schema already on the def.
- **interpolation** is centralized here (handlers dropped `bv::resolve`).
- **constraints** are read-only probes except `CreateParents` (suppressed under
  `--simulate`); `RequiresPermission` is reserved for a future async/host
  capability gate.
- `diagnostics` severity 1 → non-fatal `warning`; severity 2 → handler skipped.

## Variables

`bv::resolve` (`block_variables.hpp`) builds a `VariableMap` by overlaying the
xblox execution context (`PREVIOUS`, user vars, `loop.index`, …) **on top of**
the app/folder variables from `media::commands::make_variable_map` (dates, `CWD`,
selection, `${ENV:…}`, `${KNOWNFOLDER:…}`). This is the single seam where
**app-level variables** resolve, and it now runs inside the resolver so every
string/path input is fully expanded before the handler — and before constraint
checks see the path.

```mermaid
flowchart LR
    subgraph app["app level"]
        SYS["make_variable_map<br/>dates, CWD, ENV, KNOWNFOLDER"]
    end
    subgraph run["run context"]
        CTX["xblox context<br/>PREVIOUS, myVar, loop.index"]
    end
    SYS --> MAP["VariableMap"]
    CTX --> MAP
    MAP --> RES["resolve_variables<br/>expand placeholders"]
```

## Registry & manifest

Block descriptors are built once into a cached `BlockRegistry`; the same
descriptors serialise to the UI as a manifest and feed the executor's resolver.

```mermaid
flowchart TD
    REGFN["register_builtin_blocks"] --> R1["register_fs_blocks"]
    REGFN --> R2["register_data / network / shell / ..."]
    R1 --> REG[("BlockRegistry (cached)")]
    R2 --> REG

    REG --> H["builtin_block_handler"]
    REG --> PD["builtin_block_param_defs"]
    REG --> EF["builtin_block_exec_flags"]
    H --> EXEC["executor dispatch"]
    PD --> EXEC
    EF --> EXEC

    REG --> DEFS["registered_block_definitions"]
    DEFS --> MAN["BlockDescriptor::to_manifest"]
    MAN --> UI["host RPC → UI palette / props"]
```

Handlers register with either a native `bool(BlockIO&)` function or a legacy
`bool(json,path,runtime)` fn-ptr; `HandlerArg`/`legacy()` adapt the latter so the
migration is incremental and call sites are unchanged.

## Testing

`tests/orchestrator/test-xblox-next.mjs` drives the native `xblox` CLI directly
and asserts on emitted events / variable state. Suites: `engine`, `variables`,
`expressions`, `loops`, `previous`, `containers`, `scoping`, `transform`,
`simulate`, `constraints`. Run: `npm run test:xblox-next` (or `-- --only <suite>`).


npm run test:xblox-next