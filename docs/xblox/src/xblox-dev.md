# xblox dev (rspack HMR + native host)

## Runtimes

| How you open xblox | JS source | RPC backend |
|---|---|---|
| Browser → `http://127.0.0.1:5173` | rspack dev server | **web** — in-browser preview / mock host |
| `tanit` + `PM_XBLOX_DEV_URL` | rspack dev server (HMR) | **native-webview** — full C++ bridge, real runs |
| Installed build (`xblox.pmbundle`) | bundled embed | **native-webview** |

Rspack dev defaults `VITE_XBLOX_RUNTIME=web` for browser work. When the same dev bundle loads inside WebView2, the gateway auto-switches to the native bridge if `chrome.webview` is present.

## Native host + HMR

```powershell
# Terminal 1
cd apps/xblox && npm run dev

# Terminal 2 — either:
tanit --xblox-dev --log-level trace --ui-preset viewer --src .\tests\xblox\network-mcp-live.xblox

# or:
$env:PM_XBLOX_DEV_URL = "http://127.0.0.1:5173"
tanit --log-level trace --ui-preset viewer --src .\tests\xblox\network-mcp-live.xblox
```

Restart rspack after changing env/feature flags baked at compile time.

## Verify

- Log: `[xblox] dev mode — navigating to http://127.0.0.1:5173`
- DevTools console: `xbloxRpc.transport` → `"native-webview"` (not `"web"`)

## Variable-wiring view

Fourth toolbar mode (**Wiring**). Variable-plumbing only — not a second execution model:

- Block tree order remains source of truth for control flow.
- Edges mean “this input reads that output/variable”.
- Implicit `PREVIOUS` stays valid; shown as dashed compatibility edges.
- Bindings live in `bindings[param]` on the target block; they do not reorder blocks.

### Identity

| Field | Role |
|---|---|
| `blockId` | Stable graph/runtime identity (bindings, output frames, events) |
| `id` | Block-specific semantics only (e.g. command id, bluetooth device id) |
| path (`0/items/2`) | Ephemeral tree position for selection/UI only |

Format: `<kind>-<short-random>` (e.g. `setVariable-k7m2p9`).

- v1 docs backfill `blockId` on load via `normalizeBlocksFile`.
- Legacy path-based `bindings.blockId` values are rewritten during migration.
- Paste/clone regenerates subtree IDs and remaps internal bindings.

### Shipped

**Native (v2 contract)**

- Manifest v2: `OutputDef`, bindable params, `previousBehavior`, parameter-operation stub registry.
- Output frames keyed by `blockId` + slot; binding resolver in the executor.
- Run events carry typed `outputs[]`; `blockId` on events is graph identity, not command id.
- Handlers receive pre-resolved inputs; no binding logic inside block algorithms.

**TypeScript / UI**

- Document schema: v1/v2, optional `blockId`, `bindings`.
- `normalizeBlocksFile` — load-time migration and ID assignment.
- Wiring projection (`projectDocument.ts`) resolves producers by `blockId`.
- `@xyflow/react` wiring view: top-to-bottom layout, dashed PREVIOUS, solid bindings.
- Connect/disconnect persists `bindings`; undo/redo via existing builder commit path.

**Tests**

- `npm run test:xblox-next -- --only wiring`
- Core legacy slices still green: variables, expressions, loops, previous, refs.

### Key files

| Area | Path |
|---|---|
| Dev app load/save | `apps/xblox/src/PrototypeApp.tsx` |
| ID migration | `apps/xblox/src/schema/normalize-blocks-file.ts` |
| Document schema | `apps/xblox/src/schema/blocks-file.ts` |
| Wiring projection | `apps/xblox/src/xblox/wiring/projectDocument.ts` |
| Binding mutations | `apps/xblox/src/xblox/wiring/mutateBindings.ts` |
| Wiring canvas | `apps/xblox/src/xblox/wiring/WiringFlowPreview.tsx` |
| Native descriptors | `src/xblox/blocks/block_registry.hpp` |
| Binding resolver | `src/xblox/blocks/block_resolver.hpp` |
| Executor / frames | `src/xblox/xblox_commands.cpp` |
| Wiring harness | `tests/orchestrator/test-xblox-next.mjs` |

Handoff detail for follow-up work: `docs/xblox/xblox-flow.md`.

### Guardrails

- Do not add binding-specific conditions to block handlers.
- Do not make edge connections reorder blocks.
- Do not use tree paths as persisted binding targets.
- Save after load if migration assigned new `blockId`s (host marks document dirty).
