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

## Enterprise deployment hints

- Ship `extension/tanit-chrome/` beside `win-x64/` in your zip/MSI layout.
- Run `tanit-cli installer --no-explorer --no-startmenu` (or your chosen flags) during setup so Chrome registration runs without extra scripts.
- For forced extension install, use Chrome enterprise policy (ExtensionInstallForcelist) with a packed CRX or update URL; the native host registry step is still required unless you automate it via GPO/scripts mirroring `register_chrome.cpp`.

## Related docs

- Architecture and picker behavior: `docs/inspect-next-cdp.md`
- Extension development: `apps/tanit-chrome/README.md`
