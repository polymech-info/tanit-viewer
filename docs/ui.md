# Tanit Chat UI Launch

Top-level flags for `tanit.exe` with **no subcommand**. `--ui-preset` picks `main` / `chat` / `viewer` for this run (else saved `ui.workbench`). `--src` seeds local paths, direct https video URLs (centre viewer), or other URLs (`http(s)://`, `//host/…`, CMS `/…`) in the centre browser. `--size WxH` overrides the outer frame for this launch only. `--show-panel` / `--hide-panel` accept comma-separated panel ids; `--show-components` / `--hide-components` accept ribbon and statusbar — all for this process only.

## Flags

- `--src` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Seed the UI with file(s) or URL(s). Local paths open in the workbench. Direct https video URLs (`.mp4`, HLS `.m3u8`, …) open in the centre viewer. Other `http(s)://…`, `//host/…`, and CMS-relative `/…` open in the centre browser. Uses saved default workbench unless --ui-preset is set. Repeat or separate with `;`.
- `--view-locate` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Viewer locate fragment without '#': L12, page=3, t=90 / t=1:30 / t=90,120. Also accepted as a `#t=` suffix on --src.
- `--ui-preset` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">main</span> <span data-cli="choice">chat</span> <span data-cli="choice">viewer</span></span></span>) - Open the UI: `main`, `chat`, or `viewer` (one-shot; overrides saved default `ui.workbench`). Ignored when a subcommand is present. The Store `tanit` alias prepends `--ui-preset=chat`.
- `--ui-open` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Open a lightweight UI surface without constructing MainFrame. Usage: --ui-open settings [section] | --ui-open command-settings [--ui-command-id ID | ID] | --ui-open assistant. Reserved surfaces: fileviewer, webapp.
- `--ui-command-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Stable commands.json id for --ui-open command-settings.
- `--ui-web-app` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Web application id for --ui-open webapp.
- `--ui-owner-hwnd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional decimal owner HWND for lightweight UI placement.
- `--ui-context-cwd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Command-variable cwd for a lightweight command-settings launch.
- `--ui-context-hwnd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Command-variable CURRENT_HWND for a lightweight command-settings launch.
- `--ui-request-token` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Opaque callback token for an internally launched lightweight UI surface.
- `--mic` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">start</span> <span data-cli="choice">off</span></span></span>) - Chat launch hint: `start` enables microphone when the composer is ready.
- `--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Pre-fill the chat composer with this text on launch.
- `--type` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">completion</span> <span data-cli="choice">responses</span> <span data-cli="choice">realtime</span></span></span>) - LLM API mode: completion, responses, or realtime.
- `--system-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the system prompt. Use `null` to clear, `@path` to read from a file.
- `--no-tools` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable agent tools; send a text-only LLM turn.
- `--no-skills` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip skill discovery and injection.
- `--app` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Force a specific viewer app (reserved). Default: auto-detect from file type.
- `--edit` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Open files in the code editor instead of the default viewer.
- `--send` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Auto-send the pre-filled prompt when the composer is ready.
- `--consent-ui` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat consent surface for this UI launch: empty (WebView cards) | auto-allow (alias: yolo) | auto-deny. auto-allow grants every Ask with a session grant — use for computer-use harness.
- `--attach-realtime` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Move an active background realtime voice session into the chat panel.
- `--viewer-dev` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Dev mode: navigate the viewer WebView2 to the rspack dev server (http://localhost:5180).
Use --viewer-dev-url=URL to override the default address.
Equivalent to setting PM_VIEWER_DEV_URL before launch. FEATURE_COMMAND_TEST builds only.
- `--viewer-dev-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the rspack dev server URL used by --viewer-dev (default: http://localhost:5180).
- `--xblox-dev` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Dev mode: navigate xblox WebView2 to the rspack dev server (http://127.0.0.1:5173).
Use --xblox-dev-url=URL to override the default address.
Equivalent to setting PM_XBLOX_DEV_URL before launch; zero production impact.
- `--xblox-dev-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the rspack dev server URL used by --xblox-dev (default: http://127.0.0.1:5173).
- `--ui-reset` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Reset window layout to built-in defaults for this launch.
- `--layout` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Apply an exported layout JSON for this launch without persisting it.
- `--size` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override main frame outer size for this launch: WxH in pixels, e.g. 800x600. Applied during layout restore so there is no second resize pass.
- `--show-panel` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">filetree</span> <span data-cli="choice">search</span> <span data-cli="choice">queue</span> <span data-cli="choice">log</span> <span data-cli="choice">console</span> <span data-cli="choice">settings</span> <span data-cli="choice">chat</span> <span data-cli="choice">findresults</span> <span data-cli="choice">dupresults</span> <span data-cli="choice">nodes</span></span></span>) - Force panels visible for this launch (comma-separated ids; not persisted). Ids: filetree, search, queue, log, console, settings, chat, findresults, dupresults, nodes. Aliases: explorer→filetree.
- `--hide-panel` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">filetree</span> <span data-cli="choice">search</span> <span data-cli="choice">queue</span> <span data-cli="choice">log</span> <span data-cli="choice">console</span> <span data-cli="choice">settings</span> <span data-cli="choice">chat</span> <span data-cli="choice">findresults</span> <span data-cli="choice">dupresults</span> <span data-cli="choice">nodes</span></span></span>) - Force panels hidden for this launch (comma-separated ids; not persisted). Same ids as --show-panel. On conflict with --show-panel, hide wins.
- `--show-components` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">ribbon</span> <span data-cli="choice">statusbar</span></span></span>) - Force chrome components visible for this launch (comma-separated ids; not persisted). Ids: ribbon, statusbar. Aliases: status-bar, status_bar.
- `--hide-components` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">ribbon</span> <span data-cli="choice">statusbar</span></span></span>) - Force chrome components hidden for this launch (comma-separated ids; not persisted). Same ids as --show-components. On conflict with --show-components, hide wins.
- `--console` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Attach a console window for stdout/stderr (default: off).
- `--pause-on-exit` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wait for Enter before the process exits.
- `--splash,--no-splash` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show the startup splash screen (default: off).
- `--settings` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Read app settings from this file for this process only. Use `settings import` to persist.

## Examples

```sh
tanit --ui-preset main
tanit --ui-preset chat
tanit --ui-preset viewer --src .\photo.jpg
tanit --ui-preset main --src https://example.com
tanit --ui-preset main --src //tanit.polymech.info
tanit --ui-preset main --src /user/dashboard
tanit --ui-preset main --size 1280x800
tanit --ui-preset chat --src "C:\docs\notes.txt" --prompt "summarise this" --send
tanit --ui-preset viewer --src .\src\main.cpp --view-locate L150 --edit
tanit --ui-preset main --ui-reset
tanit --ui-preset main --layout .\my-layout.json --size 1440x900
tanit --ui-preset main --show-panel chat,filetree --hide-panel log
tanit --settings .\harness-settings.json --ui-preset viewer --src .\photo.jpg
```

**settings.json and launch args** — Workbench defaults live in the profile `settings.json`
(`pm://config/settings.json`; Settings → Workbench). Launch flags are one-shot overrides
for the process — they do not rewrite the saved default unless you change Settings (or import settings).

| CLI (this run) | settings.json | Notes |
|:---|:---|:---|
| `--ui-preset main\|chat\|viewer` | `ui.workbench` | Saved default when the flag is omitted. Settings “default” badge writes this key. |
| *(omit `--ui-preset`)* | `ui.workbench` | Used as the workbench for `--src` alone. |
| `--size WxH` | `workbench.<slot>.window` / `window_defaults` | Size is not persisted. Saved placement / first-run defaults still come from the slot. |
| `--ui-reset` | *(ignored for this process)* | Skips persisted window, dock, chrome, and disk `ui.workbench` for `main` / `chat` / `viewer` (CLI `--ui-preset` still wins). Other keys load normally. |
| `--layout path.json` | *(not written)* | One-shot layout export; optional `workbench` field in the file. |
| `--show-panel` / `--hide-panel` | `workbench.<slot>.panel_defaults` + saved layout visibility | CLI panel force is not persisted. Panel defaults apply on Reset Layout / `always_restore`. |
| `--settings path` | profile `settings.json` | Read this file for the process only; use `settings import` to persist. |

Relevant Settings → Workbench fields (per slot `main` / `chat` / `viewer`):

| UI control | JSON path | Launch interaction |
|:---|:---|:---|
| Set as default | `ui.workbench` | Default when `--ui-preset` is omitted |
| Always restore | `workbench.<slot>.chrome.always_restore` | Wipe saved dock/window and apply panel + window defaults each start; still respects `--size` / `--ui-reset` |
| Ribbon / menu / status | `workbench.<slot>.chrome.*` | Chrome for the selected slot |
| Panel defaults | `workbench.<slot>.panel_defaults.*` | Reset Layout / always_restore baselines (`filetree`, `queue`, `log`, `chat`, `centre_view`) |
| First-run size | `workbench.<slot>.window_defaults` | Used when no saved window placement; overridden by `--size` |

Minimal shape:

```json
{
  "ui": { "workbench": "main" },
  "workbench": {
    "main": {
      "chrome": { "always_restore": false, "show_ribbon_strip": true },
      "panel_defaults": { "filetree": true, "queue": true, "log": true, "chat": false },
      "window_defaults": { "width": 1280, "height": 860 }
    },
    "chat": {
      "chrome": { "always_restore": false },
      "panel_defaults": { "filetree": true, "centre_view": "chat" },
      "window_defaults": { "width": 640, "height": 720 }
    },
    "viewer": {
      "chrome": { "always_restore": false },
      "panel_defaults": { "filetree": false },
      "window_defaults": { "width": 960, "height": 720 }
    }
  }
}
```

Harness pattern — temporary settings file + launch overrides, no profile write:

```sh
tanit --settings .\harness-settings.json --ui-preset viewer --src .\photo.jpg --size 800x600 --ui-reset
```
