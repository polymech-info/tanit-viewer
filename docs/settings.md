# Settings And Commands Migration

## Settings Migration

Settings now use the secure profile store. The profile follows `--config-dir`,
so these commands can target either your live profile or an isolated test folder.

The built CLI lives under `dist\win-x64`. Do not run a same-named file from
`dist\data`.

When secure storage is enabled, the in-app editor treats the active config files
under `%APPDATA%\PolyMech\pm-image` as secure document views. Saving
`settings.json`, `commands.json`, `mcp.json`, or `prompts\*.md` from the editor
updates and re-signs the corresponding `pm://config/...` document instead of
trusting the plaintext file as the active source.

```powershell
# PowerShell
$profileDir = "$env:APPDATA\PolyMech\pm-image"

# Import plaintext settings into the secure profile
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir settings-store import-plain --file "$profileDir\settings.json"

# Export the secure profile back to plaintext JSON
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir settings-store export-plain --file ".\settings-export.json"

# Verify the secure settings document
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir storage doc verify --uri pm://config/settings.json --require-signature --require-encryption --allow-trust user-local
```

```cmd
REM cmd.exe
.\dist\win-x64\pm-image-security.exe --config-dir "%APPDATA%\PolyMech\pm-image" settings-store import-plain --file "%APPDATA%\PolyMech\pm-image\settings.json"
```

## Commands Migration

`commands.json` is migrating to the same secure document storage model. The
legacy file remains the plaintext import/export format, while the app profile
stores the active commands document encrypted and signed under
`pm://config/commands.json`.

```powershell
# PowerShell
$profileDir = "$env:APPDATA\PolyMech\pm-image"

# Import plaintext commands into the secure profile
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir command-store import-plain --file ".\dist\data\commands.json"

# Export the secure commands document back to plaintext JSON
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir command-store export-plain --file ".\commands-export.json"

# Verify the secure commands document
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir storage doc verify --uri pm://config/commands.json --require-signature --require-encryption --allow-trust user-local
```

```cmd
REM cmd.exe
.\dist\win-x64\pm-image-security.exe --config-dir "%APPDATA%\PolyMech\pm-image" command-store import-plain --file ".\dist\data\commands.json"
```

## Prompt Migration

Prompt Markdown files are moving to encrypted, signed `prompt-template`
documents. Plain Markdown files are import/export artifacts only; use
`prompt-store import-plain` to make a prompt active.

Default prompt URI mapping:

- `system-prompt.md` -> `pm://config/prompts/system-prompt.md`
- `planner-prompt.md` -> `pm://config/prompts/planner-prompt.md`
- `realtime-prompt.md` -> `pm://config/prompts/realtime-prompt.md`
- `mode-<name>.md` -> `pm://config/prompts/mode-<name>.md`

```powershell
# PowerShell
$profileDir = "$env:APPDATA\PolyMech\pm-image"

# Import plaintext prompts into the secure profile
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir prompt-store import-plain --name system --file ".\dist\data\prompts\system-prompt.md"
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir prompt-store import-plain --name planner --file ".\dist\data\prompts\planner-prompt.md"
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir prompt-store import-plain --name realtime --file ".\dist\data\prompts\realtime-prompt.md"

# Export a secure prompt back to plaintext Markdown
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir prompt-store export-plain --name system --file ".\system-prompt-export.md"

# Verify the secure system prompt document
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir storage doc verify --uri pm://config/prompts/system-prompt.md --require-signature --require-encryption --allow-trust user-local
```

```cmd
REM cmd.exe
.\dist\win-x64\pm-image-security.exe --config-dir "%APPDATA%\PolyMech\pm-image" prompt-store import-plain --name system --file ".\dist\data\prompts\system-prompt.md"
```

## MCP Migration

`mcp.json` is moving to an encrypted, signed `mcp-config` document at
`pm://config/mcp.json`. Plain `mcp.json` files are import/export artifacts
only; use `mcp-store import-plain` to make an MCP configuration active.

```powershell
# PowerShell
$profileDir = "$env:APPDATA\PolyMech\pm-image"

# Import plaintext MCP config into the secure profile
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir mcp-store import-plain --file ".\dist\data\mcp.json"

.\dist\win-x64\pm-image-security.exe --config-dir "$env:APPDATA\PolyMech\pm-image" mcp-store import-plain --file ".\dist\data\mcp.json"


# Export the secure MCP config back to plaintext JSON
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir mcp-store export-plain --file ".\mcp-export.json"

# Verify the secure MCP config document
.\dist\win-x64\pm-image-security.exe --config-dir $profileDir storage doc verify --uri pm://config/mcp.json --require-signature --require-encryption --allow-trust user-local
```

```cmd
REM cmd.exe
.\dist\win-x64\pm-image-security.exe --config-dir "%APPDATA%\PolyMech\pm-image" mcp-store import-plain --file ".\dist\data\mcp.json"
```

### Updates

With `FEATURE_SECURE_STORAGE` enabled, the app treats editable config files as
secure document views. UI surfaces may still show familiar file names, but the
authoritative update target is always a `pm://config/...` URI:

- `settings.json` -> `pm://config/settings.json`
- `commands.json` -> `pm://config/commands.json`
- `mcp.json` -> `pm://config/mcp.json`
- `prompts\system-prompt.md` -> `pm://config/prompts/system-prompt.md`
- `prompts\planner-prompt.md` -> `pm://config/prompts/planner-prompt.md`
- `prompts\realtime-prompt.md` -> `pm://config/prompts/realtime-prompt.md`
- `prompts\mode-<name>.md` -> `pm://config/prompts/mode-<name>.md`

In-app editing follows this flow:

1. The settings UI, commands UI, or editor opens a `pm://config/...` document.
2. The native host materializes a temporary plaintext view for editing when a
   text editor needs a file path.
3. Save is intercepted by the native host and routed through the secure storage
   update path.
4. The document is encrypted, signed, and verified under the active
   `--config-dir` profile.

Plain files under `%APPDATA%\PolyMech\pm-image` or `dist\data` are import/export
artifacts only. Editing them directly does not make them active unless the app
or `pm-image-security.exe` imports them into the matching `pm://config/...`
document.

Update policy keys use the same resource names as imports/exports:

- `settingsProfile.update`
- `commandConfig.update`
- `mcpConfig.update`
- `promptTemplate.update`

Those update checks are enforced in the native save path, not in the web editor
component itself. This keeps Monaco/editor UI generic while centralizing consent,
session TTL, signing, and encryption in secure storage/native host code.

## Cloud Backup / Machine Sync

The Settings → **Advanced** tab can upload and download an **encrypted**
`.pmbackup` through the Tanit VFS `home` mount (same Tanit account on both
machines). This is the supported cloud path for settings exchange.

Current flow:

1. Machine A signs in to Tanit.
2. Open Settings → Advanced. Optionally set a passphrase, or rely on
   `.cloud_storage_key` (created on first encrypted export/upload).
3. Choose a remote directory (default `settings`) and what to include
   (commands / MCP / prompts).
4. Click **Upload** — the app writes a temporary `.pmbackup` and stores it as
   `home/<dir>/yyyy-mm-dd-hh.pmbackup`.
5. Machine B signs in to the same account, uses the same remote directory, and
   clicks **Download** — the newest backup is fetched with `/api/vfs/get` and
   imported into Machine B's local profile (re-encrypted/signed for that
   machine's secure documents).

VFS layout (example):

```text
home:/settings/2026-09-17-14.pmbackup
```

Key / passphrase notes:

- Passphrase (v2): destination only needs the passphrase.
- Key file (v1): copy `.cloud_storage_key` from the source profile (Advanced →
  Save key, or `tanit-cli settings key export`), then Import key on Machine B
  before download — or pass `--cloud-storage-key`.
- Do **not** copy `resources\documents\*.doc` between machines.

End-user walkthrough: [Security: settings encryption, signing, and backup](./features/feature-security.md).
Cryptography model: [Encryption And Signing](./signing.md).

CLI:

```text
tanit-cli settings cloud upload
tanit-cli settings cloud download --passphrase "…"
tanit-cli settings export --pmbackup
tanit-cli settings key export
```

There is a separate, older **plaintext** sync via `tanit-cli service settings
upload|import` (JSON on VFS). Prefer `.pmbackup` / Settings cloud for anything
that should stay opaque to the server.

The Secure assets section in Advanced still exposes per-document Edit / Import /
Export for `pm://config/...` (plaintext at the portable boundary, then
re-encrypt on import). Prompt templates follow the same secure-document model;
include them in `.pmbackup` when the include-prompts option is on.
