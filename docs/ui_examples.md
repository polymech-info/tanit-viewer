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
