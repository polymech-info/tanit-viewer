# Group Policy Administration

Tanit supports Windows Group Policy (GPO), Intune MDM, and direct registry
management so IT administrators can control application behaviour across managed
machines — without touching per-user settings files.

The application **reads** policy only. It never writes to the policy registry
hive.

---

## Policy Precedence

When the same setting exists at multiple layers, the higher layer wins:

```text
Compiled defaults          (lowest priority)
        ↓
Vendor JSON bundle         (dist\data\policy.json, optional)
        ↓
User settings.json         (per-user, encrypted + signed)
        ↓
HKCU policy registry       (user-level GPO)
        ↓
HKLM policy registry       (machine-level GPO)
        ↓
Effective policy           (what the app uses)
```

`HKLM` always beats `HKCU`. Both beat user settings. A missing key means "fall
through to the next layer".

**Security keys are HKLM-only.**  
`Security.Verification.*`, `Security.RequireEncryption`,
`Security.RequireSigning`, and `Security.ForceVerificationProtector` are read
from `HKLM` only — `HKCU` is skipped so a non-admin user cannot lower or replace
machine security requirements.

---

## Windows Hello and DPAPI fallback

On an unmanaged installation, Tanit prefers Windows Hello for operations that
require user presence or local unlock. If Windows Hello is unavailable,
unsupported, or not provisioned for the current account, Tanit automatically
falls back to Windows DPAPI. This supports Windows Home and machines without
Hello while keeping protected data bound to the current Windows user.

DPAPI fallback does not display an interactive confirmation prompt. It uses the
current signed-in Windows account as the protection boundary.

The fallback is deliberately restricted:

- Cancelling a Windows Hello prompt cancels the operation; it does not fall
  back to DPAPI.
- Setting `Security.ForceVerificationProtector` to `windows-hello` through
  `HKLM` is fail-closed. If Hello cannot complete, the operation is denied.
- Explicitly setting `PM_SECURE_STORAGE_SECRET_PROTECTOR` to `windows-hello`,
  `windows-hello-tpm`, or `tpm` is also fail-closed.
- Setting the policy or environment value to `dpapi` selects DPAPI directly.
- If no policy or environment override exists, automatic Hello-to-DPAPI
  fallback is enabled.

This behavior applies to guarded operations such as command, MCP, and prompt
configuration changes and plaintext import/export. Ordinary settings updates
whose verification policy is `none` do not invoke either protector. OAuth
credentials remain encrypted even though saving them after a completed browser
sign-in does not require a second Hello prompt.

---

## Registry Root

```text
HKLM\Software\Policies\PolyMech\tanit\
HKCU\Software\Policies\PolyMech\tanit\
```

All values use `REG_DWORD` for booleans, `REG_SZ` for strings, and
`REG_MULTI_SZ` for multi-line lists.

---

## Deploying the ADMX Templates

The ADMX/ADML templates are included with the installer and ship inside the
product ZIP under `PolicyDefinitions\`.

| File | Deploy to |
| --- | --- |
| `tanit.admx` | `%SystemRoot%\PolicyDefinitions\` |
| `en-US\tanit.adml` | `%SystemRoot%\PolicyDefinitions\en-US\` |

After deploying, the **Tanit** category appears in the Group Policy Editor
(`gpedit.msc`) under:

> **Computer Configuration** → **Administrative Templates** → **Tanit**  
> **User Configuration** → **Administrative Templates** → **Tanit**

### Using install_gpo.ps1 (recommended)

The bundled `install_gpo.ps1` script auto-elevates and handles all copy
operations:

```powershell
# Install on the local machine
.\install_gpo.ps1

# Install to the domain Central Store
.\install_gpo.ps1 -Target domain

# Remove templates
.\install_gpo.ps1 -Uninstall
.\install_gpo.ps1 -Uninstall -Target domain
```

### Manual — single machine

```powershell
$src = ".\PolicyDefinitions"
$dst = "$env:SystemRoot\PolicyDefinitions"

Copy-Item "$src\tanit.admx"        "$dst\tanit.admx"        -Force
Copy-Item "$src\en-US\tanit.adml"  "$dst\en-US\tanit.adml"  -Force
```

> Requires an elevated (Administrator) PowerShell session.

### Manual — domain Central Store

```powershell
$domain = $env:USERDNSDOMAIN          # e.g. corp.example.com
$src    = ".\PolicyDefinitions"
$dst    = "\\$domain\SYSVOL\$domain\Policies\PolicyDefinitions"

New-Item -Path "$dst\en-US" -ItemType Directory -Force | Out-Null
Copy-Item "$src\tanit.admx"        "$dst\tanit.admx"        -Force
Copy-Item "$src\en-US\tanit.adml"  "$dst\en-US\tanit.adml"  -Force
```

All domain machines pick up the new templates automatically on the next
Group Policy refresh — no reboot required for template propagation.

### Verify the installation

```powershell
Test-Path "$env:SystemRoot\PolicyDefinitions\tanit.admx"
Test-Path "$env:SystemRoot\PolicyDefinitions\en-US\tanit.adml"
```

Both should return `True`.

---

## Setting Policies via PowerShell

For standalone machines or developer overrides, write directly to the registry
without GPMC. User-scope writes (`HKCU`) require no elevation; machine-scope
writes (`HKLM`) require an elevated session.

```powershell
$root = "HKCU:\Software\Policies\PolyMech\tanit"

# Disable the Run tool for the current user
New-ItemProperty -Path "$root\Agent\Tools" -Name EnableRun `
  -PropertyType DWord -Value 0 -Force

# Block specific tools by name
New-ItemProperty -Path "$root\Agent\Tools" -Name BlockList `
  -PropertyType MultiString -Value @("run","run_sequence") -Force

# Restrict to a read-only agent (allow-list)
New-ItemProperty -Path "$root\Agent\Tools" -Name AllowList `
  -PropertyType MultiString -Value @("file_read","file_glob","info_lookup","ask_user") -Force

# Enforce Windows Hello fail-closed (machine-wide, requires elevation)
New-ItemProperty -Path "HKLM:\Software\Policies\PolyMech\tanit\Security" `
  -Name ForceVerificationProtector -PropertyType String -Value "windows-hello" -Force

# Hide the settings panel for all users (machine-wide, requires elevation)
New-ItemProperty -Path "HKLM:\Software\Policies\PolyMech\tanit\UI" `
  -Name DisableSettingsPanel -PropertyType DWord -Value 1 -Force
```

Remove a single override:

```powershell
Remove-ItemProperty -Path "$root\Agent\Tools" -Name EnableRun -Force
```

Wipe all HKCU overrides at once:

```powershell
Remove-Item "HKCU:\Software\Policies\PolyMech\tanit" -Recurse -Force
```

---

## Diagnosing the Effective Policy

Use the `tanit-security` CLI to inspect what policy the application will
actually apply on a machine, including which layer each value comes from.

```powershell
# Show every key with its effective value and source layer
.\tanit-security.exe gpo effective

# Raw registry dump (no merging)
.\tanit-security.exe gpo read
.\tanit-security.exe gpo read --hive hklm
.\tanit-security.exe gpo read --hive hkcu
```

Example output from `gpo effective`:

```json
{
  "Agent.EnableMcpClient":   { "value": 0, "source": "hklm" },
  "Agent.EnableRunTool":     { "value": 1, "source": "builtin" },
  "Agent.SandboxMode":       { "value": 2, "source": "hklm" },
  "UI.DisableSettingsPanel": { "value": 1, "source": "hkcu" }
}
```

`source` values: `builtin` (compiled default), `vendor-json`, `hkcu`, `hklm`.

---

## Notes

- All policy values are **read at startup** and cached for the session. A change
  requires restarting the application (standard Windows Group Policy behaviour).
- `HKLM` keys require Administrator or GPO to write. `HKCU` keys can be set by
  the current user, making them convenient for per-user developer overrides.
- `HKLM\…\Security\ForceVerificationProtector` is the enterprise equivalent of
  the `PM_SECURE_STORAGE_SECRET_PROTECTOR` environment variable. It takes
  precedence over the environment variable, letting an admin mandate
  `windows-hello` across all machines in a domain.
- `Security.*` keys (except `ForceVerificationProtector`) are enforced from
  `HKLM` only — a non-administrator cannot lower verification requirements via
  `HKCU`.
