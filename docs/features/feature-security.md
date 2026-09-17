# Security: settings encryption, signing, and backup

Tanit protects the configuration that steers the app and the assistant — settings,
commands, MCP config, and prompt templates — so another process cannot quietly
rewrite them on disk. Separately, a **security gateway** decides what the AI is
allowed to do when it asks to read files, run tools, or execute commands.

This page is the practical guide for end users and admins: what is protected,
how to back up and move a profile between machines, and where the deep references
live.

For the agent / tool policy story (consent, sandbox, tamper detection), start
with [Tanit Security Overview](../security/security.md). For the cryptography
model and Windows Hello prompts, see [Encryption And Signing](../security/signing.md).
For operators who script storage, see [Tanit Security CLI](../security/cli.md).

---

## Who it's for

- Anyone who wants preferences and assistant config to stay private on this PC.
- People who move between machines and need an **encrypted** settings backup, not
  a plain JSON file in cloud storage.
- Admins who need Group Policy hooks for verification, secure documents, and
  which Settings tabs are visible.
- Power users who import vendor seeds or verify `pm://config/...` documents with
  `tanit-security`.

---

## Two layers (do not mix them up)

| Layer | Job | Where you touch it |
|:------|:----|:-------------------|
| **Secure settings storage** | Encrypt + sign profile documents at rest; portable backup/sync | Settings → **Advanced**, `tanit-cli settings …`, `tanit-security storage …` |
| **Agent security gateway** | Allow / deny / consent for tools, paths, shell, MCP | Profiles, consent UI, [security overview](../security/security.md), [security CLI](../security/cli.md) |

Signing a `commands.json` proves the file was not tampered with. It does **not**
mean every command may run — the gateway still decides at use time.

---

## What is protected on disk

When secure storage is enabled, the live copies are encrypted and signed
documents under the profile (default on Windows:
`%APPDATA%\PolyMech\pm-image`), addressed as:

```text
pm://config/settings.json
pm://config/commands.json
pm://config/mcp.json
pm://config/prompts/*.md
```

Plain files with those names are import/export views. Editing a plaintext file
by hand does not make it active until the app or security CLI imports it into
the matching `pm://` document.

Local keys live under the profile (`resources\keys\*.pme1`). They are wrapped
for this Windows user (DPAPI; optional Hello / TPM confirmation for sensitive
import/export). Copying `resources\documents\*.doc` between PCs is **not**
supported sync — use export/import or `.pmbackup` instead.

Details: [Encryption And Signing](../security/signing.md),
[Settings And Commands Migration](../settings.md).

---

## In the app (Settings → Advanced)

Open **Settings**, then the **Advanced** tab (may be hidden by Group Policy
`UI.Settings.EnableAdvancedTab`).

### Profile file and archive

- **Export / Import settings** — portable JSON (or Windows PME1 when encryption
  is checked for local export).
- **Export / Import archive** — ZIP of the profile tree (skips WebView cache
  folders and local key files that must not travel).

### Encrypted portable backup (`.pmbackup`)

Preferred way to move settings **safely**:

1. Optional: set a **passphrase**. If empty, Tanit uses the profile
   `.cloud_storage_key` (created on first export/upload).
2. Choose what to include (commands / MCP / prompts).
3. **Export** writes a dated `yyyy-mm-dd-hh.pmbackup`, or **Import** restores one.

Under **Advanced** (key section):

- **Save / Import key** — share `.cloud_storage_key` with another machine when
  you are not using a passphrase.
- **Generate new key** — rotates the key; old keyfile-encrypted backups will not
  decrypt.

Passphrase backups do not need the key file on the destination machine — only
the same passphrase.

### Cloud sync (Tanit account)

Upload / Download uses your signed-in Tanit VFS **home** mount (default remote
folder `settings`):

1. Machine A: Advanced → Cloud sync → **Upload** — builds an encrypted
   `.pmbackup` and stores it as `home/<dir>/yyyy-mm-dd-hh.pmbackup`.
2. Machine B: same account and remote folder → **Download** — fetches the
   newest backup via `/api/vfs/get` and restores into the local profile.

CMS/VFS only stores the opaque backup. It does not hold your local signing or
encryption keys. Wrong key or passphrase → decrypt failure (check the key /
passphrase, or keep the temp file path shown in CLI errors).

This is **not** the older plaintext `service settings upload` path (that still
exists for unencrypted JSON sync and is a different command).

---

## Command line (`tanit-cli`)

Profile path and portable exchange (examples):

```text
tanit-cli settings path
tanit-cli settings export --pmbackup
tanit-cli settings import 2026-09-17-14.pmbackup --pmbackup
tanit-cli settings export --pmbackup --passphrase "…"
tanit-cli settings key path
tanit-cli settings key export
tanit-cli settings key import .cloud_storage_key
tanit-cli settings key generate
tanit-cli settings cloud upload
tanit-cli settings cloud download --passphrase "…"
```

Useful flags: `--cloud-storage-key`, `--passphrase`, `--no-include-commands`,
`--no-include-mcp`, `--no-include-prompts`, `--remote-dir`, `--server-url`.

Full option lists: [Tanit CLI — settings](../cli/cli.md) (search `settings`).

For secure-document verify / plain import into `pm://` URIs, use
`tanit-security` — see [Security CLI](../security/cli.md) (`storage`,
`settings-store`, `command-store`, …) and the recipes in
[Settings And Commands Migration](../settings.md).

---

## Admins

| Need | Where |
|:-----|:------|
| Overview of agent + storage posture | [Security overview](../security/security.md) |
| Force Hello / signing / encryption | [GPO setup](../gpo-setup.md) — verification and secure-document policies |
| Hide Advanced settings | `UI.Settings.EnableAdvancedTab` |
| Scripted probes and storage ops | [Security CLI](../security/cli.md) |
| Headless / CI without Hello prompts | `PM_SECURE_STORAGE_SECRET_PROTECTOR=dpapi` (see [signing](../security/signing.md)) |

Managed desktops should treat `.pmbackup` and `.cloud_storage_key` like secrets:
restrict who can read the profile folder and who can run cloud download.

---

## What users should expect

- Inside normal day-to-day use, encryption and signing are automatic.
- Sensitive import / export / key change may show a **Windows Hello** or key
  password prompt (then a short session cache so you are not asked every save).
- Cloud download on a new PC needs either the **passphrase** or a copy of
  `.cloud_storage_key` from the source machine.
- Missing profile folder or `settings.json` on first run is normal: Tanit
  creates the profile directory and uses empty defaults until you save or
  import.

---

## Related docs

- [Tanit Security Overview](../security/security.md) — agent gateway, storage
  posture, WebView, GPO summary
- [Encryption And Signing](../security/signing.md) — keys, Hello, trust model
- [Settings And Commands Migration](../settings.md) — `pm://` URIs and
  `tanit-security` import/export recipes
- [Tanit Security CLI](../security/cli.md) — `tanit-security` command reference
- [Tanit CLI](../cli/cli.md) — `settings` / `settings key` / `settings cloud`
- [Group Policy](../gpo-setup.md)
- [OWASP alignment](../security/tanit-owasp.md)
