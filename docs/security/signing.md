# Encryption And Signing

Tanit uses encryption and signing for different jobs:

- **Encryption** keeps private profile data unreadable at rest.
- **Signing** proves that a stored config document has not been changed outside
  the trusted update path.
- **Verification policy** decides when a user must confirm an import, export, or
  update through the local platform verifier.

This document describes the current Windows stack for secure settings,
commands, MCP configuration, and prompt assets.

## What Is Protected

When secure storage is enabled, these profile documents are stored as encrypted
and signed `pm://config/...` documents:

```text
pm://config/settings.json
pm://config/commands.json
pm://config/mcp.json
pm://config/prompts/system-prompt.md
pm://config/prompts/planner-prompt.md
pm://config/prompts/realtime-prompt.md
pm://config/prompts/mode-<name>.md
```

The active copy is under the profile selected by `--config-dir`. On Windows the
default profile is:

```text
%APPDATA%\PolyMech\pm-image
```

Plain files such as `settings.json`, `commands.json`, `mcp.json`, and
`prompts\*.md` are import/export views. The app does not treat those plaintext
files as authoritative once the matching secure document exists.

## Local Encryption

Profile documents are encrypted before they are written to the secure document
store. The document bytes are protected with a local encryption key stored under
the profile:

```text
resources\keys\local-encryption-key.pme1
```

On Windows, key material in `.pme1` files is wrapped by the platform protection
layer. The default wrapping is Windows DPAPI (tied to the Windows user account).
Builds that include `FEATURE_SECURE_STORAGE_WIN_HELLO` can also wrap the
protection keys through a Windows Hello / TPM-backed NCrypt key — this is
independent of the encryption key wrapping and is used specifically for the
user-facing confirmation step described in [Windows User Confirmation](#windows-user-confirmation).

The important properties are:

- The CMS/cloud copy should not receive local encrypted document blobs.
- Copying `resources\documents\*.doc` from one machine to another is not the
  supported sync model.
- Import/export is the portable boundary: export plaintext or a future signed
  package, transfer it, then import on the destination machine so that machine
  re-encrypts it with its own local key.

## Local Signing

Each secure document has metadata and a detached signature. Signing uses Ed25519
through libsodium. The private signing key is local to the profile:

```text
resources\keys\local-signing-key.pme1
```

The signature covers the canonical document metadata, including the document URI,
type, trust, version, provider, signer id, encryption flag, byte size, and
SHA-256 digest of the plaintext document.

Verification checks:

```text
stored bytes -> decrypt -> plaintext SHA-256 == signed metadata digest
metadata + signature + public key -> Ed25519 valid
document type / trust / encryption policy -> allowed
```

Signing is not the same as authorization. A signed `commands.json` proves the
document is intact, but commands that perform sensitive actions still go through
the security gateway and operation policy.

## Windows User Confirmation

Sensitive operations can require a local user verification step. Current default
policy separates document reads from explicit import/export/update actions:

```text
operation                         default verification
settings.load                     none
settings.importPlain              local_unlock
settings.exportPlain              local_unlock
commandConfig.update              presence
commandConfig.importPlain         local_unlock
commandConfig.exportPlain         local_unlock
mcpConfig.update                  local_unlock
mcpConfig.importPlain             local_unlock
mcpConfig.exportPlain             local_unlock
promptTemplate.update             presence
promptTemplate.importPlain        local_unlock
promptTemplate.exportPlain        local_unlock
```

### How verification works on Windows

When `FEATURE_SECURE_STORAGE_WIN_HELLO` is compiled in (the default on Windows),
`local_unlock` and `presence` operations are confirmed through an NCrypt key
backed by the platform verifier. Two flows are possible depending on what the
machine has set up:

**Windows Hello with biometrics or PIN (preferred)**

The NCrypt key lives under "Microsoft Passport Key Storage Provider". Unlocking
it presents the normal Windows Hello biometric / PIN prompt. Once confirmed, the
session cache holds the result for 10 minutes so repeated saves or exports
within one session do not re-prompt.

**Software key fallback (no Hello enrolled)**

If Microsoft Passport is not available, the app falls back to "Microsoft
Platform Crypto Provider". In this case Windows shows a one-time dialog:

```
Windows Security — This application needs to create a cryptographic key
Key name:        PolyMech secure storage
Key description: Confirm with Windows Hello to unlock local PolyMech asset keys.
☑ Require a password with this key
```

This is **a one-time key creation event per machine**. Set a password and click
OK. From that point forward, the same dialog appears as a password prompt (not
creation) whenever the session cache has expired. The same 10-minute cache
applies, so you are not asked repeatedly within one working session.

The password protects the NCrypt key file on disk. It is separate from your
Windows account password and unrelated to DPAPI or the profile encryption key.

**Opting out of interactive verification**

Set `PM_SECURE_STORAGE_SECRET_PROTECTOR=dpapi` before launching the app or
running the CLI to fall back to pure DPAPI — no interactive prompt, but also no
"something you know" confirmation step. This is the recommended mode for CI/CD
pipelines or headless scripts (the `import-plain.sh` bootstrap script uses it
automatically).

### In-app editing flow

```text
open pm://config/... document
-> materialize temporary plaintext editor view
-> intercept save in native host
-> check update policy (presence / local_unlock)
-> [Windows Hello or password prompt, then 10-min session cache]
-> encrypt, sign, and verify the secure document
```

## Built-In Assets

The installer can ship default assets under `dist\data`. Those are templates or
vendor seeds, not the active mutable user profile.

Recommended release model:

```text
dist\data vendor seed   = signed, plaintext
profile runtime copy    = encrypted + signed for the local user/profile
```

This avoids shipping a reusable decryption key with the app. On first import or
setup, the seed is verified, copied into the profile, encrypted with the local
profile key, and signed for the local profile.

## Cloud / Machine Sync

Tanit CMS/VFS can relay backups without holding local profile keys. The supported
portable package is an encrypted **`.pmbackup`** (optional passphrase, or the
profile `.cloud_storage_key`). Settings → Advanced and
`tanit-cli settings cloud|export --pmbackup` use that path.

Correct model:

```text
Machine A secure documents
  -> .pmbackup (encrypted) or plaintext export
  -> Tanit CMS/VFS (or USB / file share)
  -> Machine B import
  -> Machine B secure documents (re-keyed locally)
```

Avoid:

```text
Machine A resources\documents\*.doc
  -> Tanit CMS/VFS
  -> Machine B resources\documents\*.doc
```

The second model copies local encryption/signing state between machines and
breaks the intended trust boundary.

End-user guide: [Security: settings encryption, signing, and backup](./features/feature-security.md).
Migration recipes: [Settings And Commands Migration](./settings.md).

## What CMS Can And Cannot See

With the current cloud backup flow, CMS/VFS stores the `.pmbackup` (or, if you
deliberately use plaintext `service settings` sync, exported JSON). Opaque
`.pmbackup` bytes are not decryptable without the passphrase or
`.cloud_storage_key`. CMS does not hold private signing or encryption keys from
the local profile.

Signed peer-share packages (multi-recipient, `PeerSigned` trust) remain a
separate roadmap item; `.pmbackup` is profile backup, not a general resource
share format. Clients still reject unexpected signer keys or downgraded trust
when verifying `pm://` documents locally.

## Organization And User-Owned Keys

The next design step is organization-wide and user-owned keys. This matters for
schools, companies, and teams that want to use Tanit CMS as convenient remote
storage without giving Tanit the ability to read or forge their config assets.

A practical model is:

```text
organization root signing key
  -> signs allowed policy / package signing keys

user or device encryption keys
  -> decrypt packages locally

CMS/VFS
  -> stores packages only
  -> never receives private keys
```

For teams, this allows:

- A school or company to own its signing root.
- Admins to publish approved prompts, MCP configs, commands, and settings
  packages.
- Devices to verify package provenance before import.
- Departed users or compromised keys to be revoked through key rotation and
  policy updates.
- Tanit CMS to act as storage and distribution, not as a cryptographic
  authority.

## Is PGP Still A Thing?

Yes, but it is not the only or usually the easiest option for application-level
asset security.

PGP/OpenPGP is still useful when you need:

- Existing enterprise/user key material.
- Human-readable key fingerprints.
- Offline file exchange.
- Compatibility with existing security workflows.

For this app, OpenPGP is more likely to be an interchange option than the core
runtime primitive. The current runtime stack already uses:

- Ed25519 for signatures.
- SHA-256 for content digests.
- DPAPI / Windows Hello-capable protection for local secrets.
- A typed `pm://config/...` document model with policy checks.

A good future package format can support both:

```text
native package signatures: Ed25519
optional interchange wrapper: OpenPGP / age / enterprise KMS envelope
```

If an organization already uses PGP, we can support importing trusted PGP public
keys or accepting OpenPGP-wrapped packages. But for most users, an app-native
package with clear signer identity, policy metadata, and local verification will
be simpler and less error-prone.

## Current Limitations

- Cloud Upload/Download still uses the older settings backup flow for some
  files. Prompt sync through `pm://config/prompts/*.md` still needs to be added.
- There is not yet a full organization key management UI.
- There is not yet a signed multi-asset package format for CMS sync.
- Local signing keys are profile-local. They protect local tamper detection, but
  they are not a substitute for organization or vendor trust roots.

## Summary

On Windows today:

- Local secure documents are encrypted and signed.
- Local encryption/signing keys are stored as `.pme1` blobs and wrapped by
  Windows DPAPI (tied to the user account).
- Imports, exports, and in-app updates of sensitive documents require user
  confirmation through Windows Hello or a software NCrypt key password.
  A 10-minute session cache avoids repeated prompts within one working session.
- The NCrypt key creation dialog appears **once per machine** the first time a
  confirmation is needed (when Windows Hello biometrics/PIN are not enrolled,
  the platform uses a software key protected by a password you choose).
- CMS/VFS should be treated as remote storage, not a trusted key holder.
- Machine-to-machine sync should export/import documents or packages, never copy
  raw local secure document blobs.
