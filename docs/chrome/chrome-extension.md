# Tanit Chrome extension (admin guide)

Tanit can inspect live Chrome page DOM (HTML and markdown) through a Manifest V3 extension plus a small native messaging host. This guide is for IT admins and power users deploying a Tanit build that includes the Chrome bridge.

## What ships in the install folder

Typical Windows layout next to `tanit.exe`:

```text
dist/
  win-x64/
    tanit.exe
    tanit-cli.exe
  extension/
    tanit-chrome/
      manifest.json
      background.js
      domProbe.js
      …
      tanit-chrome-host.exe          ← native bridge (C++, built with Tanit)
      com.polymech.tanit.chrome.json ← written at install/register time
  data/
  shared/
```

Orchestrator tests (`npm run test:tanit-chrome`, `npm run test:assistant-chrome:build`) assume this layout: the native host lives beside the unpacked extension, not under `win-x64/`.

The extension **does not** embed the host path. Chrome resolves it through the registry (see below).

## How the bridge works

1. **Tanit** (picker, assistant, CLI) sends requests on the named pipe `\\.\pipe\tanit-chrome-inspect`.
2. **`tanit-chrome-host.exe`** relays pipe ↔ Chrome native messaging (stdio JSON).
3. **Tanit Chrome MV3 extension** (`background.js`) receives work, injects `domProbe.js`, returns element JSON.
4. Tanit converts cleaned HTML to markdown when needed.

The extension must call `chrome.runtime.connectNative("com.polymech.tanit.chrome")` on startup. That is what launches `tanit-chrome-host.exe`.

Stable extension ID (from committed `manifest.key`):

`bhpeejlpjkdlbibojmbdhdcondflmban`

## Native host registration (Chrome lookup)

Chrome reads:

```text
HKCU\Software\Google\Chrome\NativeMessagingHosts\com.polymech.tanit.chrome
```

The registry default value points to a JSON manifest, for example:

```text
C:\Program Files\Tanit\extension\tanit-chrome\com.polymech.tanit.chrome.json
```

That file contains the absolute path to `tanit-chrome-host.exe` and the allowed extension origin.

Tanit resolves the extension folder relative to the install root (`../extension/tanit-chrome` when `tanit.exe` lives in `win-x64/`). See `src/core/app_exe_directory.cpp`.

## Install options

### A. Tanit installer (recommended for packaged deploys)

After unpacking or updating Tanit:

```text
tanit-cli installer
```

This runs seed data, Explorer/Start Menu hooks, URL schemes (if enabled), and **Chrome native host registration** when the extension folder and host exe are present.

Skip Chrome registration:

```text
tanit-cli installer --no-chrome
```

Uninstall integration (keeps profile data):

```text
tanit-cli installer --uninstall
```

Use `--dry` to print actions without writing registry/files.

### B. Chrome only (user machine, no npm)

From the Tanit install folder:

```text
win-x64\tanit-cli.exe installer chrome
win-x64\tanit-cli.exe installer chrome --verify
```

Or double-click `extension\tanit-chrome\register-native-host.bat`.

Then **Load unpacked** once per Chrome profile (section C below).

### C. Developer script (repo / manual QA)

From a source tree:

```text
npm run build:tanit-chrome
npm run build:cpp
npm run install:tanit-chrome
```

Optional: launch Chrome with the unpacked extension for one session:

```text
npm run install:tanit-chrome:launch
```

Remove registry entry only:

```text
npm run uninstall:tanit-chrome
```

### D. Load the extension in Chrome (required once per profile)

Chrome cannot permanently pin an unpacked extension without enterprise policy. Each user profile must either:

1. Open `chrome://extensions`, enable **Developer mode**, **Load unpacked**, select  
   `<install-root>\extension\tanit-chrome`, or  
2. Use `npm run install:tanit-chrome:launch` (dev) which passes `--load-extension` for that session.

Confirm the extension ID matches `bhpeejlpjkdlbibojmbdhdcondflmban`.

## Verify

With Chrome open and the extension loaded:

```text
tanit-cli assistant chrome-inspect status --json
```

Expect `"nativeHost": "connected"`.

Or run automated checks:

```text
npm run test:tanit-chrome
npm run test:assistant-chrome
```

## Troubleshooting

| Symptom | Likely cause | Action |
|--------|----------------|--------|
| `nativeHost: disconnected` | Registry/manifest missing or wrong path | Run `tanit-cli installer` or `npm run install:tanit-chrome` |
| Extension loaded but bridge still down | Host exe missing or locked | Rebuild (`npm run build:cpp`), kill stale `tanit-chrome-host.exe`, reload extension |
| `TAB_NOT_FOUND` on pick | Title/window mismatch | Ensure the picked Chrome window title matches the tab; multi-monitor picks send screen coordinates |
| `ReadFile failed` on pipe | Zombie host after rebuild | Kill host process, reload extension |
| Picker returns screen spec only | Bridge unavailable | Load extension + register host; check Chrome is running |
| Picker returns outer page chrome / wrong node | Stale extension or DPI/iframe miss | Rebuild + reload unpacked extension; `inspectAtPoint` converts physical client pixels and walks iframes via `webNavigation` |
| Parent pick HTML missing nested form | Stale extension without iframe inlining | Rebuild + reload; same-origin/srcdoc iframe bodies are inlined into `html` before clean; opaque frames become placeholders |

After updating `tanit-chrome-host.exe`, reload the extension or restart Chrome so Chrome spawns the new binary.

## Security notes

- The native host is scoped to extension ID `bhpeejlpjkdlbibojmbdhdcondflmban` via `allowed_origins` in the manifest.
- The extension requests broad host permissions (`<all_urls>`) for DOM inspection on arbitrary pages the user picks.
- Registration is per-user (`HKCU`), not machine-wide.

## Next milestone: tanit chat side panel

Status: **design / implementation plan**. The current extension is an inspection
bridge. It does not yet host chat, start an agent daemon, or expose the complete
browser-use tool set.

### Product boundary

The extension becomes **tanit chat** with two surfaces:

1. The toolbar popup remains a compact bridge/status and diagnostics surface.
2. The Chrome side panel hosts the existing `apps/chat-next` application.

The side panel is a client. It must not implement an LLM loop, execute model
`tool_calls`, or spawn a fresh process for every message. The existing
`tanit-cli llm agent --serve` process owns the same agent turn pipeline used by
desktop chat and CLI:

```text
Chrome side panel (chat-next)
  -> extension service worker
  -> native messaging port
  -> tanit-chrome-host.exe
  -> hidden tanit-cli --no-gui llm agent --serve
  -> run_turn / Tanit tool registry
  -> Chrome browser-use bridge
  -> active tab
```

This preserves one agent loop and one tool registry. `pm_image_cmd_llm_agent.cpp`
is still the CLI/daemon entry point; it is not copied into the extension.

### Process ownership and lifecycle

`tanit-chrome-host.exe` is the supervisor and transport adapter:

- Chrome starts it through `connectNative`.
- It keeps the existing named-pipe inspection relay working.
- On the first chat request, it probes the local agent daemon (`/ready`), then
  starts `tanit-cli --no-gui llm agent --serve` hidden if no compatible daemon is
  available.
- Production launch uses `CREATE_NO_WINDOW` plus `SW_HIDE`, matching the existing
  hidden realtime-agent launch. Development may opt into a visible console.
- The daemon binds only to `127.0.0.1` and receives a random per-launch bearer
  token. The token stays in the native host; it is never written to
  `localStorage`, extension storage, logs, or the page.
- The native host translates native-messaging messages to HTTP/SSE and sends
  ordered agent events back to the side panel.
- A daemon is reusable across side-panel reopen/reload. The native host should
  not kill an already-running compatible daemon it did not start.
- Add an idle shutdown policy for a daemon started by the host. Do not tie an
  active turn to MV3 service-worker suspension.

The first implementation should use one in-flight agent turn per side-panel
session. Cancellation is explicit. Reconnect must identify the session and
either resume event delivery or mark the interrupted turn failed; silently
starting a duplicate turn is not acceptable.

### Native-message envelope

The current native channel assumes every stdin message is an inspection
response. It must become a multiplexed channel with explicit message kinds:

```json
{ "kind": "inspect.request", "request": { "...": "existing bridge request" } }
{ "kind": "inspect.response", "response": { "...": "existing bridge response" } }
{ "kind": "agent.start", "id": "run-id", "sessionId": "chat-id", "tabId": 42, "request": {} }
{ "kind": "agent.cancel", "id": "run-id" }
{ "kind": "agent.event", "id": "run-id", "sequence": 7, "event": {} }
{ "kind": "agent.done", "id": "run-id", "ok": true }
{ "kind": "daemon.status", "requestId": "status-id" }
```

Requirements:

- Keep inspection request IDs and agent run IDs in separate namespaces.
- Serialize all writes to native-messaging stdout; multiple threads must never
  interleave Chrome length-prefixed frames.
- Put bounded limits on message size, buffered SSE events, and concurrent runs.
- Preserve event order with a monotonically increasing `sequence`.
- Treat unknown kinds, stale run IDs, malformed payloads, and protocol-version
  mismatches as structured failures.
- Never relay arbitrary URLs or commands from the extension to the native host.

### Reusing chat-next

Do not fork the chat UI. Add a Chrome transport to the existing host abstraction:

- `chrome.webview.postMessage` continues to serve desktop WebView2.
- `chrome.runtime.sendMessage` / `connect` serves the side panel.
- The same store receives normalized `hostChatWeb`, text delta, thinking,
  tool-call, tool-result, completion, cancellation, and error events.
- Features that require a desktop HWND, file picker, drag/drop path, or native
  clipboard are hidden or disabled in Chrome mode with a clear explanation.
- Browser tab context is supplied by the extension, not inferred from page text.
- Chat session IDs remain stable across side-panel close/reopen.

Build the side-panel artifact from `apps/chat-next/rspack.config.js` using a
Chrome target/mode and output it into `dist/extension/tanit-chrome/`. Do not
duplicate the chat-next loader/alias/DefinePlugin setup in the extension config.
The root `build:tanit-chrome` task should orchestrate both builds.

Manifest work:

- Add `"sidePanel"` permission.
- Add `"side_panel": { "default_path": "side-panel.html" }`.
- Configure the action click to open the side panel; keep status diagnostics
  reachable from the panel or an explicit popup/settings action.
- Keep extension pages under the MV3 CSP: no remote scripts or `eval`.

### Complete Chrome browser-use coverage

The present inspect protocol only supports `ping`, `getStatus`,
`inspectAtPoint`, `inspectSelector`, `getSelectedText`, and
`captureVisibleTab`. The agent expects:

- `browser_read`
- `browser_find`
- `browser_scope`
- `browser_click`
- `browser_type`
- `browser_select`
- `browser_batch`
- `browser_navigate` (`tabs`, `switch`, `new`, `goto`, `reload`, `close`)

Reuse `apps/shared/inspect/domUse.ts`; do not create a second DOM indexing and
ref implementation. The extension already emits `domUse.js`, but its service
worker does not currently dispatch browser-use requests to it.

Add protocol v2 with a typed `browserUse` command. Its payload carries the
existing browser-use request (`v`, `id`, `cmd`, `args`, optional `epoch`) plus a
target (`tabId`, with optional `frameId`). The service worker:

1. Resolves and validates the target tab.
2. Injects `domUse.js` where Chrome permits scripting.
3. calls `window.__tanitBrowserUse.rpc(request)` for synchronous DOM operations.
4. Handles tab/window navigation through `chrome.tabs` rather than page script.
5. Returns the same browser-use result envelope consumed by
   `Tool_BrowserUse.cpp`.

Protocol v2 must continue accepting the current v1 inspection commands during
the migration. Existing picker/CLI clients must not fail merely because the
extension was upgraded first.

Do not expose CSS selectors or script strings supplied by the model directly to
`chrome.scripting.executeScript`. Only typed commands and validated arguments
cross the boundary.

The agent needs a request-scoped Chrome target:

- The side panel supplies its active `tabId` and `windowId` when starting a turn.
- The daemon maps that target into `Turn`; browser tool execution reads it from
  the current turn rather than global "last focused" state.
- An explicit `tab` tool argument overrides the default target after validation.
- Concurrent sessions must not steal each other's active tab.
- Desktop chat keeps the existing in-app WebView backend. Headless/side-panel
  turns use the Chrome named-pipe backend. Selection must be explicit or
  deterministic; do not silently click a different backend after a mutation
  fails.

`BrowserUseFeature::on_prepare` must obtain Chrome tab/status/page-model context
through the new backend when no in-app WebView is available. The existing prompt
injection detection and abort behavior applies unchanged to Chrome results.

### Browser context and command variables

Tab routing alone is insufficient. Tanit command templates also consume the
browser variables defined by `media::commands::VariableContext`:

```text
${CURRENT_URL}
${CURRENT_URL_TITLE}
${LAST_URL}
${BROWSER_TAB_COUNT}
${BROWSER_TAB_0}, ${BROWSER_TAB_TITLE_0}, ...
```

Today `webview_BrowserUse.cpp::apply_command_context` fills those fields from
the in-app centre WebViews and Tanit's browser-history store. A hidden daemon
has neither source. If the side-panel turn only transmits `tabId`, command
creation/expansion can retain literal variables or resolve them against an
unrelated desktop WebView while browser tools act on Chrome.

The side panel must capture and transmit a bounded browser-context snapshot with
every agent start:

```json
{
  "tanit": {
    "browser": {
      "source": "chrome",
      "windowId": 7,
      "tabId": 42,
      "currentUrl": "https://example.test/current",
      "currentTitle": "Current page",
      "lastUrl": "https://example.test/previous",
      "tabs": [
        { "id": 42, "url": "https://example.test/current", "title": "Current page", "active": true },
        { "id": 43, "url": "https://example.test/other", "title": "Other page", "active": false }
      ]
    }
  }
}
```

Rules:

- Obtain the snapshot from `chrome.tabs` immediately before the turn starts.
- Include normal web pages only. Exclude blank/internal/restricted URLs using
  the same semantics as `browser_url::is_blank_or_internal_utf8`.
- Preserve Chrome tab order so indexed `BROWSER_TAB_N` variables are stable for
  that snapshot.
- Bound tab count and URL/title lengths before crossing native messaging.
- `CURRENT_URL` is the originating active tab, not whichever Chrome window
  becomes focused later.
- `LAST_URL` is optional. Track it in extension session state from
  `tabs.onUpdated` / `webNavigation`, rather than reading Tanit's in-app history.
- Do not accept browser context from page content or a content script. Only the
  trusted extension service worker may construct it.

Add a request-scoped browser context to `Turn`. The agent server parses
`tanit.browser`, validates it, and stores it before feature preparation. Prompt
variable builders copy the snapshot into `media::commands::VariableContext`
before `make_variable_map`:

- `agent_commons.cpp::build_agent_prompt_vars`
- `agent_runner_claude_defaults.cpp::build_claude_defaults_variable_map`
- any command/tool execution path that builds a fresh `VariableContext`

Precedence is explicit:

1. A validated per-turn Chrome snapshot for a Chrome-origin turn.
2. The existing in-app WebView snapshot for desktop-origin turns.
3. No browser variables; unresolved tokens remain literal as they do today.

Do not merge Chrome and in-app tab lists. `CURRENT_URL` and
`BROWSER_TAB_N` must describe the same backend selected for browser tools.

There are two refresh points:

1. **Turn start:** immutable snapshot used for prompt/template rendering and
   deterministic indexed variables.
2. **After a successful browser navigation/tab mutation:** refresh the live
   Chrome context returned with the tool result. Subsequent command execution in
   the same turn uses the refreshed context, while the original prompt is not
   rewritten.

That requires the browser backend to return context metadata after
`switch/new/goto/reload/close`, and the active run context to accept a guarded
revision update. Use a monotonically increasing browser-context revision so a
late response from an older tab state cannot overwrite a newer one.

### Consent and security

- Starting chat is user initiated from the side panel. Merely loading the
  extension must not start an agent daemon or issue model requests.
- Headless consent currently defaults to `auto-deny`. Preserve that until a
  Chrome consent UI is implemented.
- Mutating browser actions require the same policy and consent checks as desktop
  browser-use; the extension is transport, not an authorization bypass.
- Block Chrome-restricted pages (`chrome://`, Web Store, other extension origins)
  with a stable `RESTRICTED_PAGE` result.
- Never read or type password input values. Preserve the current selected-text
  password guard and add equivalent type/read guards to browser-use tests.
- Page content and attributes remain untrusted. Prompt-injection flags must flow
  from `domUse` through the native bridge to the agent feature.
- Native host and daemon errors returned to the UI must redact bearer tokens,
  API keys, local absolute paths, and raw authorization headers.
- Bind the daemon to loopback only. Refuse a non-loopback inherited daemon for
  extension use.

### Implementation phases

#### Phase 1 - side-panel shell and shared UI

- [x] Add MV3 side-panel manifest fields and opening behavior.
- [x] Add a Chrome build mode to chat-next and emit `side-panel.html` plus assets.
- [x] Add a transport interface beneath chat-next's existing `postHost`.
- [x] Render disconnected/setup/status states without starting an agent.
- [x] Keep the current status popup functional during migration.

The third host is `apps/chat-next` `--env chrome` (`VITE_CHAT_HOST=chrome`).
Dev stays the default rspack server. In-app embed stays `--env embed`
(`VITE_CHAT_HOST=webview`). The Chrome build writes `side-panel.html` and
`chat.bundle.js` into `dist/extension/tanit-chrome` without cleaning that
folder. `npm run build:tanit-chrome` runs it after the extension build. The
popup **Open chat** button calls `chrome.sidePanel.open`. The panel asks the
service worker for native-host status (`source: "tanit-chat"`). That path does
not start a daemon. `hasWebProviderHost()` is true for this build, so presets
and commands use the same `providerRpc` messages as the in-app chat.

Exit gate: the side panel opens the real chat-next UI and can exchange a
ping/status message with the native host. No model call yet. Confirm after
`npm run build:tanit-chrome` and an unpacked reload.

#### Phase 2 - on-demand `llm agent --serve`

Same shape as OpenDesign: the side panel does not require the Tanit window. `tanit-chrome-host` starts `tanit-cli --no-gui llm agent --serve` on the first preset or prompt, reuses it while the panel is active, and terminates that child after 60 seconds without a chat message. A serve process that was already listening is left alone.

Presets are `GET /v1/models`. A prompt is `POST /v1/chat/completions` with `stream: true`. The host writes each `pmChat` event to the native port as it arrives, and the service worker forwards it on the side panel's port.

OpenDesign layers its own tools by serving `GET /api/agent-tools` and registering `POST /v1/host-tool-providers` (`id` + loopback URL). `tanit-chrome-host` serves that catalog on `127.0.0.1` and registers it as provider `chrome`. The same `browser_*` names are used. The extension injects `domUse.js` for read, find, scope, click, type, select, and batch, and uses `chrome.tabs` for navigation. Each send attaches the active http(s) tab so the model sees the URL. The spawned agent uses `--consent-ui auto-allow` so those writes run without a consent window. That snapshot is also written onto the serve process environment for the turn, so a child `tanit-cli` custom command resolves `${CURRENT_URL}`, `${CURRENT_URL_TITLE}`, and `${BROWSER_TAB_N}` from the Chrome tab rather than the in-app WebView. Chat transcripts are saved through the serve process into the shared session store, spend is `GET /v1/credit`, and a transcript path link opens the file from the extension directory. Live voice stays in that process too: `POST /v1/realtime/start` opens the chat-plugin session, and `GET /v1/realtime/events` pushes `realtimeReady` so the side panel leaves connecting.

- [x] Multiplex `source: "tanit-chat"` on the native host and serialize stdout writes.
- [x] Start `llm agent --serve` on demand and stop the child this host spawned after 60 seconds idle.
- [x] Presets from `/v1/models`, turns from streaming `/v1/chat/completions`.
- [x] `hasWebProviderHost()` is true for the Chrome build.
- [x] Register a Chrome DOM host-tool provider (OpenDesign's `IAgentToolProvider` pattern).
- [x] Browser snapshot / command variables (Phase 3). Snapshot is attached on send and fills `${CURRENT_URL}` on the serve process.

Exit gate: a side-panel prompt streams a response from the same native agent
pipeline as desktop chat, with no visible console and no browser tools.

#### Phase 3 - Chrome browser-use

- [x] Dispatch `browserUse` on the existing bridge. Protocol version stays 1.
- [x] Dispatch `read`, `find`, `scope`, and tab list.
- [x] Default tool target is the tab captured on send. `tab=` overrides it.
- [x] Populate browser command variables from the Chrome snapshot.
- [x] Chrome transport: host-tool HTTP server in `tanit-chrome-host`, extension runs the page.
- [ ] Feed page model and injection flags into `BrowserUseFeature`.

Exit gate: the side-panel agent can read/find/scope the originating tab and
cannot cross into another session's tab. `${CURRENT_URL}` and
`${BROWSER_TAB_N}` resolve to that same Chrome session.

#### Phase 4 - mutating and navigation coverage

- [x] Add click, type, select, batch, switch, goto, new, reload, and close.
- [x] Epoch/stale-ref checks stay inside `domUse`.
- [ ] Return and apply revisioned browser-context updates after navigation.
- [x] Spawned agent uses `--consent-ui auto-allow` so Chrome mutations are not auto-denied. There is no Chrome consent card.
- [ ] Cover iframe, SPA rerender, navigation, restricted-page, and password cases beyond what `domUse` already does.

Exit gate: all eight browser tools pass against Chrome with behavior equivalent
to the existing in-app WebView backend.

#### Phase 5 - packaging and operations

- [ ] Include side-panel assets in zip/MSI/store staging and audits.
- [ ] Productize daemon startup/idle cleanup and stale-process recovery.
- [ ] Add diagnostics for extension, native host, daemon, agent session, and
  selected browser backend.
- [ ] Update end-user docs and enterprise deployment policy examples.

### Affected files

Extension and shared web code:

- `apps/tanit-chrome/manifest.json`
- `apps/tanit-chrome/rspack.config.js`
- `apps/tanit-chrome/src/background.ts`
- `apps/tanit-chrome/src/domUse.ts`
- `apps/tanit-chrome/src/popup/main.tsx`
- `apps/tanit-chrome/src/nativeHostDebug.ts`
- `apps/shared/inspect/protocol.ts`
- `apps/shared/inspect/domUse.ts`
- `apps/chat-next/rspack.config.js`
- `apps/chat-next/src/main.tsx` or a small Chrome entry beside it
- `apps/chat-next/src/pm-chat/hostBridge.ts`
- `apps/shared/web/hostBridge.ts`

Native host, daemon, and agent:

- `src/win/chrome_inspect/native_host_main.cpp`
- `src/win/chrome_inspect/protocol_framing.hpp`
- `src/win/chrome_inspect/bridge.cpp`
- `src/win/chrome_inspect/bridge.hpp`
- `src/cli/pm_image_cmd_llm_agent.cpp`
- `src/cli/pm_image_cmd_llm_agent_server.cpp`
- `src/cli/pm_image_cmd_llm_agent_server.hpp`
- `src/llm/agent.hpp`
- `src/llm/agent_commons.cpp`
- `src/llm/agent_runner_claude_defaults.cpp`
- `src/llm/agent_feature_BrowserUse.cpp`
- `src/llm/tools/browser_use/Tool_BrowserUse.cpp`
- `src/core/command_variables.hpp`
- `src/core/command_variables.cpp`
- `src/core/host_backends.hpp`
- `src/core/host_backends.cpp`
- Windows backend registration files if Chrome browser-use is exposed through
  the existing host-backend table.

Build, install, packaging, and docs:

- `CMakeLists.txt`
- root `package.json` build scripts
- `scripts/install-tanit-chrome.mjs`
- `src/win/register_chrome.cpp`
- release manifests/audits that stage `extension/tanit-chrome`
- `apps/tanit-chrome/README.md`
- this guide

Tests:

- Extend `tests/orchestrator/test-tanit-chrome.mjs` for protocol v2 and all DOM
  operations.
- Extend `tests/orchestrator/test-assistant-chrome.mjs` for native pipe and
  browser-use parity.
- Extend `tests/orchestrator/test-llm-server.mjs` for side-panel session headers,
  SSE relay, cancel, and reconnect.
- Add a side-panel end-to-end test that launches Chrome with the unpacked
  extension, sends a prompt, observes streamed events, and verifies read-only
  then mutating actions against `tests/orchestrator/fixtures/tanit-dom-fixture.html`.
- Add native framing tests for concurrent inspect responses and agent events.
- Add failure tests: daemon absent, auth mismatch, native disconnect, worker
  suspension/reconnect, restricted URL, stale epoch/ref, prompt injection,
  password field, tab closed during a turn, and two concurrent tab sessions.
- Add command-variable tests for Chrome `CURRENT_URL`, `CURRENT_URL_TITLE`,
  `LAST_URL`, ordered `BROWSER_TAB_N`, navigation refresh, revision races, and
  strict separation from in-app WebView tabs.

### Decisions still to lock before implementation

- Daemon ownership: native-host child with idle timeout versus a separately
  installed per-user service. Use the child process first; keep the transport
  contract service-compatible.
- Side-panel action behavior: direct action click versus popup-first. Prefer
  direct side-panel open once diagnostics are available inside the panel.
- Event resume: bounded native-host replay buffer versus mark interrupted and
  retry. Prefer bounded replay keyed by run ID and sequence.
- Chrome consent UX. Until implemented, mutations remain auto-denied in the
  headless daemon even if read-only browsing is enabled.

## Enterprise deployment hints

- Ship `extension/tanit-chrome/` beside `win-x64/` in your zip/MSI layout.
- Run `tanit-cli installer --no-explorer --no-startmenu` (or your chosen flags) during setup so Chrome registration runs without extra scripts.
- For forced extension install, use Chrome enterprise policy (ExtensionInstallForcelist) with a packed CRX or update URL; the native host registry step is still required unless you automate it via GPO/scripts mirroring `register_chrome.cpp`.

## Related docs

- Architecture and picker behavior: `docs/inspect-next-cdp.md`
- Extension development: `apps/tanit-chrome/README.md`
