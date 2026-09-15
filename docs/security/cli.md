# Tanit Security CLI

Use this reference when composing `tanit-security.exe` invocations for gateway probes and security tests.

## Invocation Rules

- Prefer `tanit-security <command> ...` for shell automation and JSON probe output.
- Default output is pretty-printed JSON on stdout; use global `--json` for compact machine-readable output.
- Use `--config-dir` to isolate the settings store for tests.
- Use `--profile LIGHT|STRICT|DEVELOPER` to select the security profile.
- Use `--origin`, `--session`, and `--task` to model provenance and grant lifetimes.

## Global Options

Options:

- `--profile` (TEXT:{LIGHT,STRICT,DEVELOPER}, default `LIGHT`) - Security profile: LIGHT, STRICT, DEVELOPER.
- `--config-dir` (TEXT) - Profile/settings root override (isolates the settings store for tests).
- `--app-name` (TEXT, default `pm-image`) - App id for the security storage path (default pm-image).
- `--origin` (TEXT, default `tanit-security.exe`) - Calling binary for provenance (e.g. tanit.exe, pm-image-cli.exe).
- `--session` (TEXT) - Session id (binds Session-lifetime grants).
- `--task` (TEXT) - Task id (binds Task-lifetime grants).
- `--lang` (TEXT, default `en`) - Consent UI language for --gui (en, de, es).
- `--dark` - Use the dark consent UI theme for --gui.
- `--log-level` (ENUM:value in {debug->3,error->1,info->2,none->0} OR {3,1,2,0}, default `0`) - Sandbox log verbosity: none|error|info|debug (default: none).
Logs go to --log-file when specified, otherwise to stderr.
Covers: profile lifecycle, ACL grant/revoke, process spawn, IPC sim.
- `--log-file` (TEXT) - Write sandbox log to this file (append). Omit to write to stderr when --log-level > none.
- `--storage` (TEXT:{settings-store,grants.json}, default `settings-store`) - Grant persistence backend.
  settings-store  Encrypted settings.json["permissions"] (default).
  grants.json     Plain human-readable <config-dir>/grants.json file.

## Commands

### profile

Print compiled + persisted security profile.

**Example**

```sh
tanit-security profile
```

---

### set-profile

Persist --profile as the active profile.

**Example**

```sh
tanit-security set-profile
```

---

### path

PathSecurity canonicalization / containment / glob probes.

**Example**

```sh
tanit-security path canonicalize --path <path>
```

**Full example**

```sh
tanit-security path canonicalize --path 'foo'
```

#### path canonicalize

Canonicalize --path.

Options:

- `--path` (TEXT, required) - Path to canonicalize.

**Example**

```sh
tanit-security path canonicalize --path <path>
```

**Full example**

```sh
tanit-security path canonicalize --path 'foo'
```

---

#### path inside

Test whether --path is inside --root.

Options:

- `--path` (TEXT, required) - Child path.
- `--root` (TEXT, required) - Root path.

**Example**

```sh
tanit-security path inside --path <path> --root <value>
```

**Full example**

```sh
tanit-security path inside --path 'foo' --root 'foo'
```

---

#### path glob

Match --path against glob --pattern.

Options:

- `--path` (TEXT, required) - Path to match.
- `--pattern` (TEXT, required) - Glob pattern (**, *, ?).

**Example**

```sh
tanit-security path glob --path <path> --pattern <value>
```

**Full example**

```sh
tanit-security path glob --path 'foo' --pattern 'foo'
```

---

### identity

Tool identity / hash probes.

**Example**

```sh
tanit-security identity hash-file --path <path>
```

**Full example**

```sh
tanit-security identity hash-file --path 'foo'
```

#### identity hash-file

Compute SHA-256 for a file.

Options:

- `--path` (TEXT, required) - File to hash.

**Example**

```sh
tanit-security identity hash-file --path <path>
```

**Full example**

```sh
tanit-security identity hash-file --path 'foo'
```

---

### classify

Classify a resource target for an action.

Options:

- `--path` (TEXT) - Resource path.
- `--uri` (TEXT) - Resource URI (alternative to --path).
- `--action` (TEXT:{read,write,delete,execute,network,upload,download,git_push,publish}, default `read`) - Action.
- `--workspace` (TEXT) - Workspace root (drives outside-workspace signal).

**Example**

```sh
tanit-security classify
```

**Full example**

```sh
tanit-security classify --path 'foo' --uri 'foo' --action 'read' --workspace 'foo'
```

---

### authorize

Run the full gateway authorization for a request.

Options:

- `--tool` (TEXT, default `file.read`) - Tool id (e.g. file.read, shell.exec).
- `--provider` (TEXT, default `builtin`) - builtin | plugin | mcp.
- `--server` (TEXT) - MCP/plugin server id (empty for builtin).
- `--actor` (TEXT:{user,llm,plugin,mcp_server,background_agent}, default `llm`) - Actor.
- `--action` (TEXT:{read,write,delete,execute,network,upload,download,git_push,publish}, default `read`) - Action.
- `--path` (TEXT) - Target resource path.
- `--uri` (TEXT) - Target resource URI (file/https/ftp/ws...). Overrides path for non-file resources.
- `--workspace` (TEXT) - Workspace root.
- `--intent` (TEXT) - User-visible intent string.
- `--use-grants` - Load persisted grants before deciding.
- `--interactive` - Act as the consent UI: on Ask, prompt on stderr and read a choice from stdin.
- `--gui` - With --interactive: show the native Win32 consent dialog instead of stdio.
- `--signed` - Mark the tool manifest as signed.
- `--executable-hash` (TEXT) - Bound executable hash for grant invalidation.
- `--manifest-hash` (TEXT) - Bound manifest hash (STRICT registered-signed requires non-empty).

**Example**

```sh
tanit-security authorize
```

**Full example**

```sh
tanit-security authorize --tool 'file.read' --provider 'builtin' --server 'foo' --actor 'llm' --action 'read' --path 'foo' --uri 'foo' --workspace 'foo' --intent 'foo' --use-grants --interactive --gui --signed --executable-hash 'foo' --manifest-hash 'foo'
```

---

### grant

Capability grant store (settings-backed).

**Example**

```sh
tanit-security grant add
```

**Full example**

```sh
tanit-security grant add --id 'foo' --tool 'file.read' --provider 'builtin' --server 'foo' --subject 'user' --action 'read' --scope '{}' --lifetime 'session' --bind-session 'foo' --bind-task 'foo' --workspace 'foo' --reason 'foo' --allow-secrets --allow-network --signed --executable-hash 'foo' --manifest-hash 'foo' --sandbox-backend 'foo'
```

#### grant add

Persist a capability grant.

Options:

- `--id` (TEXT) - Grant id (generated when omitted).
- `--tool` (TEXT, default `file.read`) - Tool id (supports * / ? wildcards).
- `--provider` (TEXT, default `builtin`) - Provider (supports wildcards).
- `--server` (TEXT) - MCP/plugin server id (supports wildcards; empty = any).
- `--subject` (TEXT, default `user`) - Subject (user/session/agent/mcp id).
- `--action` (TEXT:{read,write,delete,execute,network,upload,download,git_push,publish}, default `read`) - Action.
- `--scope` (TEXT, default `{}`) - Resource scope: URI pattern or path glob (repeatable).
- `--lifetime` (TEXT:{once,session,task,until_timestamp,permanent}, default `session`) - once|session|task|until_timestamp|permanent.
- `--bind-session` (TEXT) - Bind this grant to a session id.
- `--bind-task` (TEXT) - Bind this grant to a task id.
- `--workspace` (TEXT) - Workspace id/root.
- `--reason` (TEXT) - Why this grant exists.
- `--allow-secrets` - Permit secret-classified resources.
- `--allow-network` - Permit network egress.
- `--signed` - Mark the bound tool manifest as signed.
- `--executable-hash` (TEXT) - Bind grant to an executable hash.
- `--manifest-hash` (TEXT) - Bind grant to a manifest/config hash.
- `--sandbox-backend` (TEXT) - Require this grant to run inside the named sandbox backend (e.g. appcontainer). Surfaces as PolicyDecision.sandboxBackend.

**Example**

```sh
tanit-security grant add
```

**Full example**

```sh
tanit-security grant add --id 'foo' --tool 'file.read' --provider 'builtin' --server 'foo' --subject 'user' --action 'read' --scope '{}' --lifetime 'session' --bind-session 'foo' --bind-task 'foo' --workspace 'foo' --reason 'foo' --allow-secrets --allow-network --signed --executable-hash 'foo' --manifest-hash 'foo' --sandbox-backend 'foo'
```

---

#### grant list

List persisted grants.

**Example**

```sh
tanit-security grant list
```

---

#### grant find

Find a live grant covering a request.

Options:

- `--tool` (TEXT, default `file.read`) - Tool id.
- `--provider` (TEXT, default `builtin`) - Provider.
- `--server` (TEXT) - MCP/plugin server id.
- `--action` (TEXT:{read,write,delete,execute,network,upload,download,git_push,publish}, default `read`) - Action.
- `--path` (TEXT) - Target path.
- `--uri` (TEXT) - Target URI (non-file resources).
- `--workspace` (TEXT) - Workspace root.
- `--signed` - Mark the request manifest as signed.
- `--executable-hash` (TEXT) - Request executable hash.
- `--manifest-hash` (TEXT) - Request manifest/config hash.

**Example**

```sh
tanit-security grant find
```

**Full example**

```sh
tanit-security grant find --tool 'file.read' --provider 'builtin' --server 'foo' --action 'read' --path 'foo' --uri 'foo' --workspace 'foo' --signed --executable-hash 'foo' --manifest-hash 'foo'
```

---

#### grant revoke

Revoke a grant by id.

Options:

- `--id` (TEXT, required) - Grant id.

**Example**

```sh
tanit-security grant revoke --id <id>
```

**Full example**

```sh
tanit-security grant revoke --id 'foo'
```

---

#### grant import

Merge (or replace) grants from a plain JSON file into the active store.
The file must be a JSON array of CapabilityGrant objects (same format as
--storage grants.json). Each grant is validated before it is accepted:
  - must have at least one resource scope (no ambient authority)
  - action must not be never_persistable (Execute/Delete/GitPush/...)
  - permanent lifetime is only allowed for Read
Use --replace to overwrite the store instead of merging.

Options:

- `--file` (TEXT, required) - Path to the grants JSON file to import.
- `--replace` - Replace the entire active store instead of merging.

**Example**

```sh
tanit-security grant import --file <file>
```

**Full example**

```sh
tanit-security grant import --file 'foo' --replace
```

---

### crypto

CryptoStore probes.

**Example**

```sh
tanit-security crypto roundtrip
```

**Full example**

```sh
tanit-security crypto roundtrip --text 'the quick brown fox'
```

#### crypto roundtrip

Encrypt then decrypt --text.

Options:

- `--text` (TEXT, default `the quick brown fox`) - Plaintext to round-trip.

**Example**

```sh
tanit-security crypto roundtrip
```

**Full example**

```sh
tanit-security crypto roundtrip --text 'the quick brown fox'
```

---

### storage

Secure resource storage probes.

**Example**

```sh
tanit-security storage put --uri <uri> --file <file>
```

**Full example**

```sh
tanit-security storage put --uri 'foo' --file 'foo' --type 'prompt-template' --trust 'user-local' --version '1' --provider 'user' --signer 'foo' --bundle 'local'
```

#### storage put

Store a file as a pm:// resource.

Options:

- `--uri` (TEXT, required) - Resource URI, e.g. pm://config/prompts/system-prompt.md.
- `--file` (TEXT, required) - File to store.
- `--type` (TEXT:{prompt-template,command-config,mcp-config,prompt,settings-profile,web-app-bundle,asset-archive}, default `prompt-template`) - prompt-template | command-config | mcp-config | prompt | settings-profile | web-app-bundle | asset-archive.
- `--trust` (TEXT:{builtin,signed-vendor,user-local,peer-signed,workspace,untrusted}, default `user-local`) - builtin | signed-vendor | user-local | peer-signed | workspace | untrusted.
- `--version` (TEXT, default `1`) - Resource version token.
- `--provider` (TEXT, default `user`) - Provider id.
- `--signer` (TEXT) - Signer id/fingerprint.
- `--bundle` (TEXT, default `local`) - Bundle id.

**Example**

```sh
tanit-security storage put --uri <uri> --file <file>
```

**Full example**

```sh
tanit-security storage put --uri 'foo' --file 'foo' --type 'prompt-template' --trust 'user-local' --version '1' --provider 'user' --signer 'foo' --bundle 'local'
```

---

#### storage get

Load a resource by URI.

Options:

- `--uri` (TEXT, required) - Resource URI.

**Example**

```sh
tanit-security storage get --uri <uri>
```

**Full example**

```sh
tanit-security storage get --uri 'foo'
```

---

#### storage list

List indexed resources.

**Example**

```sh
tanit-security storage list
```

---

#### storage verify

Verify a resource digest by URI.

Options:

- `--uri` (TEXT, required) - Resource URI.

**Example**

```sh
tanit-security storage verify --uri <uri>
```

**Full example**

```sh
tanit-security storage verify --uri 'foo'
```

---

#### storage sign

Sign a resource manifest by URI.

Options:

- `--uri` (TEXT, required) - Resource URI.

**Example**

```sh
tanit-security storage sign --uri <uri>
```

**Full example**

```sh
tanit-security storage sign --uri 'foo'
```

---

#### storage import

Import a single-resource .pmbundle JSON package.

Options:

- `--file` (TEXT, required) - Package file to import.

**Example**

```sh
tanit-security storage import --file <file>
```

**Full example**

```sh
tanit-security storage import --file 'foo'
```

---

#### storage export

Export a single-resource .pmbundle JSON package.

Options:

- `--uri` (TEXT, required) - Resource URI.
- `--file` (TEXT, required) - Package file to write.

**Example**

```sh
tanit-security storage export --uri <uri> --file <file>
```

**Full example**

```sh
tanit-security storage export --uri 'foo' --file 'foo'
```

---

#### storage bundle

All-in-one web app bundle (*.pmbundle) probes.

**Example**

```sh
tanit-security storage bundle pack --dir <value> --file <file>
```

**Full example**

```sh
tanit-security storage bundle pack --dir 'foo' --file 'foo'
```

##### storage bundle pack

Pack a directory into an all-in-one *.pmbundle archive.

Options:

- `--dir` (TEXT, required) - Source directory (the built web app).
- `--file` (TEXT, required) - Output .pmbundle file.

**Example**

```sh
tanit-security storage bundle pack --dir <value> --file <file>
```

**Full example**

```sh
tanit-security storage bundle pack --dir 'foo' --file 'foo'
```

---

##### storage bundle sign

Sign a *.pmbundle with an Ed25519 seed (detached <file>.sig).

Options:

- `--file` (TEXT, required) - Bundle to sign.
- `--seed-hex` (TEXT) - 32-byte Ed25519 seed (hex). Defaults to $PM_BUNDLE_SIGNING_SEED_HEX.
- `--out` (TEXT) - Output signature path (default: <file>.sig).

**Example**

```sh
tanit-security storage bundle sign --file <file>
```

**Full example**

```sh
tanit-security storage bundle sign --file 'foo' --seed-hex 'foo' --out 'foo'
```

---

##### storage bundle verify-file

Verify a *.pmbundle against the pinned signing key.

Options:

- `--file` (TEXT, required) - Bundle to verify.
- `--sig` (TEXT) - Signature path (default: <file>.sig).

**Example**

```sh
tanit-security storage bundle verify-file --file <file>
```

**Full example**

```sh
tanit-security storage bundle verify-file --file 'foo' --sig 'foo'
```

---

##### storage bundle list

List entries in a bundle (--uri verifies storage, --file reads raw).

Options:

- `--uri` (TEXT) - Stored bundle resource URI (verified).
- `--file` (TEXT) - Raw .pmbundle file (unverified).

**Example**

```sh
tanit-security storage bundle list
```

**Full example**

```sh
tanit-security storage bundle list --uri 'foo' --file 'foo'
```

---

##### storage bundle serve

Resolve one request path inside a bundle (emulates a web engine request).

Options:

- `--uri` (TEXT) - Stored bundle resource URI (verified before serve).
- `--file` (TEXT) - Raw .pmbundle file (unverified).
- `--path` (TEXT, required) - Request path inside the bundle, e.g. /index.html.

**Example**

```sh
tanit-security storage bundle serve --path <path>
```

**Full example**

```sh
tanit-security storage bundle serve --uri 'foo' --file 'foo' --path 'foo'
```

---

##### storage bundle unpack

Extract a bundle to a directory (--uri verifies storage).

Options:

- `--uri` (TEXT) - Stored bundle resource URI (verified).
- `--file` (TEXT) - Raw .pmbundle file (unverified).
- `--out` (TEXT, required) - Output directory.

**Example**

```sh
tanit-security storage bundle unpack --out <value>
```

**Full example**

```sh
tanit-security storage bundle unpack --uri 'foo' --file 'foo' --out 'foo'
```

---

#### storage doc

Named secure document probes.

**Example**

```sh
tanit-security storage doc put --uri <uri> --file <file>
```

**Full example**

```sh
tanit-security storage doc put --uri 'foo' --file 'foo' --type 'settings-profile' --trust 'user-local' --version '1' --provider 'user' --signer 'foo' --encrypt --no-encrypt --seed-plaintext
```

##### storage doc put

Store a file as a named secure document.

Options:

- `--uri` (TEXT, required) - Document URI.
- `--file` (TEXT, required) - File to store.
- `--type` (TEXT:{settings-profile,command-config,mcp-config,prompt-template,prompt}, default `settings-profile`) - settings-profile | command-config | mcp-config | prompt-template | prompt.
- `--trust` (TEXT:{builtin,signed-vendor,user-local,peer-signed,workspace,untrusted}, default `user-local`) - builtin | signed-vendor | user-local | peer-signed | workspace | untrusted.
- `--version` (TEXT, default `1`) - Document version token.
- `--provider` (TEXT, default `user`) - Provider id.
- `--signer` (TEXT) - Signer id/fingerprint.
- `--encrypt` - Encrypt document bytes (default; explicit for scripts).
- `--no-encrypt` - Store plaintext document bytes (requires --seed-plaintext).
- `--seed-plaintext` - Allow plaintext signed vendor seed documents.

**Example**

```sh
tanit-security storage doc put --uri <uri> --file <file>
```

**Full example**

```sh
tanit-security storage doc put --uri 'foo' --file 'foo' --type 'settings-profile' --trust 'user-local' --version '1' --provider 'user' --signer 'foo' --encrypt --no-encrypt --seed-plaintext
```

---

##### storage doc import-plain

Import a plaintext settings/commands/prompt file as a secure document.

Options:

- `--uri` (TEXT, required) - Document URI.
- `--file` (TEXT, required) - Plain file to import.
- `--type` (TEXT:{settings-profile,command-config,mcp-config,prompt-template,prompt}, default `settings-profile`) - settings-profile | command-config | mcp-config | prompt-template | prompt.
- `--trust` (TEXT:{builtin,signed-vendor,user-local,peer-signed,workspace,untrusted}, default `user-local`) - builtin | signed-vendor | user-local | peer-signed | workspace | untrusted.
- `--version` (TEXT, default `1`) - Document version token.
- `--provider` (TEXT, default `user`) - Provider id.
- `--signer` (TEXT) - Signer id/fingerprint.
- `--encrypt` - Encrypt document bytes (default; explicit for scripts).
- `--no-encrypt` - Store plaintext document bytes (requires --seed-plaintext).
- `--seed-plaintext` - Allow plaintext signed vendor seed documents.
- `--sign,--no-sign{false}` - Sign the imported document manifest.

**Example**

```sh
tanit-security storage doc import-plain --uri <uri> --file <file>
```

**Full example**

```sh
tanit-security storage doc import-plain --uri 'foo' --file 'foo' --type 'settings-profile' --trust 'user-local' --version '1' --provider 'user' --signer 'foo' --encrypt --no-encrypt --seed-plaintext --sign
```

---

##### storage doc get

Load a secure document by URI.

Options:

- `--uri` (TEXT, required) - Document URI.
- `--require-signature` - Reject unsigned documents.
- `--require-encryption` - Reject plaintext documents.
- `--allow-vendor-seed-plaintext` - Allow plaintext builtin/signed-vendor seed documents when encryption is required.
- `--allow-trust` (TEXT:{builtin,signed-vendor,user-local,peer-signed,workspace,untrusted}, default `{}`) - Allowed trust level. Repeatable.

**Example**

```sh
tanit-security storage doc get --uri <uri>
```

**Full example**

```sh
tanit-security storage doc get --uri 'foo' --require-signature --require-encryption --allow-vendor-seed-plaintext --allow-trust '{}'
```

---

##### storage doc export-plain

Export a secure document plaintext payload to a file.

Options:

- `--uri` (TEXT, required) - Document URI.
- `--file` (TEXT, required) - Plain output file.
- `--require-signature` - Reject unsigned documents.
- `--require-encryption` - Reject plaintext documents.
- `--allow-vendor-seed-plaintext` - Allow plaintext builtin/signed-vendor seed documents when encryption is required.
- `--allow-trust` (TEXT:{builtin,signed-vendor,user-local,peer-signed,workspace,untrusted}, default `{}`) - Allowed trust level. Repeatable.

**Example**

```sh
tanit-security storage doc export-plain --uri <uri> --file <file>
```

**Full example**

```sh
tanit-security storage doc export-plain --uri 'foo' --file 'foo' --require-signature --require-encryption --allow-vendor-seed-plaintext --allow-trust '{}'
```

---

##### storage doc list

List indexed secure documents.

**Example**

```sh
tanit-security storage doc list
```

---

##### storage doc verify

Verify a secure document by URI.

Options:

- `--uri` (TEXT, required) - Document URI.
- `--require-signature` - Reject unsigned documents.
- `--require-encryption` - Reject plaintext documents.
- `--allow-vendor-seed-plaintext` - Allow plaintext builtin/signed-vendor seed documents when encryption is required.
- `--allow-trust` (TEXT:{builtin,signed-vendor,user-local,peer-signed,workspace,untrusted}, default `{}`) - Allowed trust level. Repeatable.

**Example**

```sh
tanit-security storage doc verify --uri <uri>
```

**Full example**

```sh
tanit-security storage doc verify --uri 'foo' --require-signature --require-encryption --allow-vendor-seed-plaintext --allow-trust '{}'
```

---

##### storage doc sign

Sign a secure document manifest by URI.

Options:

- `--uri` (TEXT, required) - Document URI.

**Example**

```sh
tanit-security storage doc sign --uri <uri>
```

**Full example**

```sh
tanit-security storage doc sign --uri 'foo'
```

---

##### storage doc delete

Delete a secure document by URI.

Options:

- `--uri` (TEXT, required) - Document URI.

**Example**

```sh
tanit-security storage doc delete --uri <uri>
```

**Full example**

```sh
tanit-security storage doc delete --uri 'foo'
```

---

##### storage doc import-seed

Verify a signed plaintext vendor seed document and import it encrypted into the active profile.

Options:

- `--seed-config-dir` (TEXT, required) - Source seed config dir.
- `--uri` (TEXT, required) - Document URI.

**Example**

```sh
tanit-security storage doc import-seed --seed-config-dir <value> --uri <uri>
```

**Full example**

```sh
tanit-security storage doc import-seed --seed-config-dir 'foo' --uri 'foo'
```

---

### settings-store

Probe app settings_store backed by secure SettingsProfile.

**Example**

```sh
tanit-security settings-store put --file <file>
```

**Full example**

```sh
tanit-security settings-store put --file 'foo'
```

#### settings-store put

Save a plaintext JSON file through media::settings::save_settings_utf8.

Options:

- `--file` (TEXT, required) - Plain settings JSON file.

**Example**

```sh
tanit-security settings-store put --file <file>
```

**Full example**

```sh
tanit-security settings-store put --file 'foo'
```

---

#### settings-store import-plain

Import a plaintext JSON file into the secure settings profile.

Options:

- `--file` (TEXT, required) - Plain settings JSON file.

**Example**

```sh
tanit-security settings-store import-plain --file <file>
```

**Full example**

```sh
tanit-security settings-store import-plain --file 'foo'
```

---

#### settings-store update

Update the secure settings profile from a plaintext JSON file.

Options:

- `--file` (TEXT, required) - Plain settings JSON file.

**Example**

```sh
tanit-security settings-store update --file <file>
```

**Full example**

```sh
tanit-security settings-store update --file 'foo'
```

---

#### settings-store get

Load settings through media::settings::load_settings_utf8.

**Example**

```sh
tanit-security settings-store get
```

---

#### settings-store export

Export settings through media::settings::export_settings_file.

Options:

- `--file` (TEXT, required) - Output file.
- `--encrypted` - Export encrypted PME1 compatibility blob.

**Example**

```sh
tanit-security settings-store export --file <file>
```

**Full example**

```sh
tanit-security settings-store export --file 'foo' --encrypted
```

---

#### settings-store export-plain

Export the secure settings profile as plaintext JSON.

Options:

- `--file` (TEXT, required) - Plain output file.

**Example**

```sh
tanit-security settings-store export-plain --file <file>
```

**Full example**

```sh
tanit-security settings-store export-plain --file 'foo'
```

---

### command-store

Probe app command config backed by secure CommandConfig.

**Example**

```sh
tanit-security command-store import-plain --file <file>
```

**Full example**

```sh
tanit-security command-store import-plain --file 'foo'
```

#### command-store import-plain

Import plaintext commands JSON into the secure command config.

Options:

- `--file` (TEXT, required) - Plain commands JSON file.

**Example**

```sh
tanit-security command-store import-plain --file <file>
```

**Full example**

```sh
tanit-security command-store import-plain --file 'foo'
```

---

#### command-store get

Load commands through media::settings::load_command_json_utf8.

**Example**

```sh
tanit-security command-store get
```

---

#### command-store export-plain

Export the secure command config as plaintext JSON.

Options:

- `--file` (TEXT, required) - Plain output file.

**Example**

```sh
tanit-security command-store export-plain --file <file>
```

**Full example**

```sh
tanit-security command-store export-plain --file 'foo'
```

---

### mcp-store

Probe MCP config backed by secure McpConfig.

**Example**

```sh
tanit-security mcp-store import-plain --file <file>
```

**Full example**

```sh
tanit-security mcp-store import-plain --file 'foo'
```

#### mcp-store import-plain

Import plaintext mcp.json into secure MCP config.

Options:

- `--file` (TEXT, required) - Plain mcp.json file.

**Example**

```sh
tanit-security mcp-store import-plain --file <file>
```

**Full example**

```sh
tanit-security mcp-store import-plain --file 'foo'
```

---

#### mcp-store get

Load the secure MCP config document.

**Example**

```sh
tanit-security mcp-store get
```

---

#### mcp-store export-plain

Export secure MCP config as plaintext JSON.

Options:

- `--file` (TEXT, required) - Plain output file.

**Example**

```sh
tanit-security mcp-store export-plain --file <file>
```

**Full example**

```sh
tanit-security mcp-store export-plain --file 'foo'
```

---

### prompt-store

Probe app prompts backed by secure PromptTemplate documents.

**Example**

```sh
tanit-security prompt-store import-plain --name <value> --file <file>
```

**Full example**

```sh
tanit-security prompt-store import-plain --name 'foo' --file 'foo'
```

#### prompt-store import-plain

Import a plaintext prompt into secure prompt storage.

Options:

- `--name` (TEXT, required) - system | planner | realtime | mode-<name>.
- `--file` (TEXT, required) - Plain prompt Markdown file.

**Example**

```sh
tanit-security prompt-store import-plain --name <value> --file <file>
```

**Full example**

```sh
tanit-security prompt-store import-plain --name 'foo' --file 'foo'
```

---

#### prompt-store get

Load a prompt through the agent prompt loader.

Options:

- `--name` (TEXT, required) - system | planner | realtime | mode-<name>.

**Example**

```sh
tanit-security prompt-store get --name <value>
```

**Full example**

```sh
tanit-security prompt-store get --name 'foo'
```

---

#### prompt-store export-plain

Export a secure prompt document as plaintext Markdown.

Options:

- `--name` (TEXT, required) - system | planner | realtime | mode-<name>.
- `--file` (TEXT, required) - Plain output file.

**Example**

```sh
tanit-security prompt-store export-plain --name <value> --file <file>
```

**Full example**

```sh
tanit-security prompt-store export-plain --name 'foo' --file 'foo'
```

---

### origin

First-party binary provenance registry.

**Example**

```sh
tanit-security origin list
```

#### origin list

List registered first-party origins.

**Example**

```sh
tanit-security origin list
```

---

#### origin resolve

Resolve a binary name/path to an origin.

Options:

- `--binary` (TEXT, required) - Binary name or path (e.g. tanit.exe).

**Example**

```sh
tanit-security origin resolve --binary <value>
```

**Full example**

```sh
tanit-security origin resolve --binary 'foo'
```

---

### uri

RFC-3986 resource URI parse / scope match.

**Example**

```sh
tanit-security uri parse --uri <uri>
```

**Full example**

```sh
tanit-security uri parse --uri 'foo'
```

#### uri parse

Parse --uri into scheme/host/port/path.

Options:

- `--uri` (TEXT, required) - URI/scope to parse (fs:// normalizes to file://).

**Example**

```sh
tanit-security uri parse --uri <uri>
```

**Full example**

```sh
tanit-security uri parse --uri 'foo'
```

---

#### uri match

Match --uri against one or more --scope patterns.

Options:

- `--uri` (TEXT, required) - Target URI.
- `--scope` (TEXT, required, default `{}`) - Scope pattern (repeatable).

**Example**

```sh
tanit-security uri match --uri <uri> --scope {}
```

**Full example**

```sh
tanit-security uri match --uri 'foo' --scope '{}'
```

---

### verification

User verification policy and provider probes.

**Example**

```sh
tanit-security verification defaults
```

#### verification defaults

Print compiled default verification policies for settings/assets/grants.

**Example**

```sh
tanit-security verification defaults
```

---

#### verification guard

Evaluate an operation through verification + privilege policy.

Options:

- `--operation` (TEXT, required) - Operation id, e.g. settings.exportPlain.
- `--provider-result` (TEXT:{success,cancelled,canceled,timeout,not_configured,not-configured,failed}, default `success`) - success|cancelled|timeout|not_configured|failed.
- `--ttl-seconds` (UINT, default `600`) - Verification session TTL in seconds.
- `--repeat` (UINT, default `1`) - Repeat in one process to exercise the session cache.
- `--assume-privilege` - Treat admin/system broker requirements as already satisfied.

**Example**

```sh
tanit-security verification guard --operation <value>
```

**Full example**

```sh
tanit-security verification guard --operation 'foo' --provider-result 'success' --ttl-seconds 600 --repeat 1 --assume-privilege
```

---

### sandbox

AppContainer / LPAC experimentation [FEATURE_SECURITY_SANDBOX].
probe     — create/derive profile, report SID.
acl       — grant a path to the container SID ('shared folder').
launch    — spawn an exe inside AppContainer (or LPAC), wait for exit.
wrap-mcp  — simulate an MCP tool call inside the container;
            on ACL miss synthesizes a PrivilegeEscalationRequest.

**Example**

```sh
tanit-security sandbox probe --moniker <value>
```

**Full example**

```sh
tanit-security sandbox probe --moniker 'foo' --retain
```

#### sandbox probe

Create (or derive) an AppContainer profile and report its SID.

Options:

- `--moniker` (TEXT, required) - AppContainer package moniker (e.g. pm-mcp-sandbox-test).
- `--retain` - Keep the profile after the probe (default: delete it).

**Example**

```sh
tanit-security sandbox probe --moniker <value>
```

**Full example**

```sh
tanit-security sandbox probe --moniker 'foo' --retain
```

---

#### sandbox acl

Grant a filesystem path to the container SID ('shared folder' semantics).
Adds an ALLOW ACE for the AppContainer SID to the path's DACL.
Run sandbox probe --retain first to ensure the profile exists.

--check-access: read-only probe — reports whether the path DACL already
has the container SID ACE without making any changes (no grant, no profile
creation). Useful for verifying ACE inheritance on child files/dirs.

Options:

- `--moniker` (TEXT, required) - AppContainer moniker.
- `--path` (TEXT, required) - Filesystem path to grant or check.
- `--access` (TEXT:{read,write,read-write,exec}, default `read`) - read | write | read-write | exec  (default: read). Ignored with --check-access.
- `--check-access` - Read-only: check whether the path DACL has the container SID ACE.

**Example**

```sh
tanit-security sandbox acl --moniker <value> --path <path>
```

**Full example**

```sh
tanit-security sandbox acl --moniker 'foo' --path 'foo' --access 'read' --check-access
```

---

#### sandbox launch

Launch an exe inside an AppContainer (or LPAC) and wait for exit.
Uses PROC_THREAD_ATTRIBUTE_SECURITY_CAPABILITIES + optional
ALL_APPLICATION_PACKAGES_OPT_OUT (LPAC) and Win32k lockdown.

--sandbox-config accepts @file.json or inline JSON:
  { "moniker":"pm-test", "run":"cmd.exe", "args":["/c","exit 0"],
    "lpac":false, "paths":[{"path":"C:\\ws","access":"read-write"}] }
Config paths are granted before launch and revoked after exit.

Options:

- `--moniker` (TEXT) - AppContainer moniker (overrides config.moniker). Required if --sandbox-config is not provided.
- `--exe` (TEXT) - Executable path / command line (overrides config.run+args). Required if --sandbox-config.run is not set.
- `--lpac` - Launch as Less-Privileged AppContainer (LPAC).
- `--no-win32k` - Enable Win32k syscall disable mitigation.
- `--no-child-process` - Prevent the sandboxed child from spawning sub-processes (PROC_THREAD_ATTRIBUTE_CHILD_PROCESS_POLICY / PROCESS_CREATION_CHILD_PROCESS_RESTRICTED).
- `--capabilities` (TEXT, default `{}`) - WinRT capability names granted to the AC profile (e.g. internetClient). Repeatable: --capabilities internetClient --capabilities picturesLibrary.
- `--retain` - Keep the AppContainer profile after launch.
- `--timeout-ms` (UINT, default `10000`) - Wait timeout in milliseconds (default 10 000; 0 = no wait).
- `--sandbox-config` (TEXT) - JSON sandbox spec: @path/to/file.json or inline JSON.
Specifies run, args, paths (grant+revoke), capabilities, etc.
Individual flags overlay matching config fields.
- `--preset` (TEXT) - Named sandbox configuration preset.
offline: linters/formatters — no network, exec+rw on bin+cwd.
fetch:   package managers  — internetClient, scratch dir.
run:     general scripts   — scratch dir, no network default.
strict:  untrusted MCP     — LPAC + no network + no sub-spawn + no Win32k.
self:    app own binary    — all network caps, dist+bin+roaming+userPaths.
         --capabilities replaces (not appends) the self default cap set.
Config JSON and individual flags overlay the preset.
- `--bin-dir` (TEXT) - Path to the sidecar binary directory (default: dirname(this exe)/bin).
Used to build the exec path grant when a --preset is active.
- `--user-path` (TEXT, default `{}`) - Additional path granted read-write to the AppContainer (self preset).
Repeatable: --user-path /workspace --user-path /models.

**Example**

```sh
tanit-security sandbox launch
```

**Full example**

```sh
tanit-security sandbox launch --moniker 'foo' --exe 'foo' --lpac --no-win32k --no-child-process --capabilities '{}' --retain --timeout-ms 10000 --sandbox-config 'foo' --preset 'foo' --bin-dir 'foo' --user-path '{}'
```

---

#### sandbox wrap-mcp

Simulate wrapping an MCP tool call inside an AppContainer.
Checks the target path's DACL for the container SID.
On ACL miss: emits a PrivilegeEscalationRequest — the structured
signal the broker receives and routes to SecurityGateway.
On ACL hit: confirms the 'shared folder' grant allows the call.
No child process is launched; this is a pure ACL-check simulation.

Options:

- `--moniker` (TEXT, default `pm-mcp-sandbox-test`) - AppContainer moniker (default: pm-mcp-sandbox-test).
- `--tool` (TEXT, required) - MCP tool id (e.g. mcp.fs.write, mcp.fs.read).
- `--action` (TEXT:{read,write,delete,execute,network,upload,download,git_push,publish}, default `read`) - Action.
- `--path` (TEXT, required) - Resource path the MCP tool is requesting.
- `--lpac` - Simulate LPAC container.
- `--retain` - Keep the AppContainer profile after the probe.

**Example**

```sh
tanit-security sandbox wrap-mcp --tool <value> --path <path>
```

**Full example**

```sh
tanit-security sandbox wrap-mcp --moniker 'pm-mcp-sandbox-test' --tool 'foo' --action 'read' --path 'foo' --lpac --retain
```

---

### schema

Emit the UI contract (enums + type defs) for web & win32.

**Example**

```sh
tanit-security schema
```

---

### session-store

Chat/agent session persistence probes [FEATURE_COMMAND_TEST].

**Example**

```sh
tanit-security session-store put --file <file>
```

**Full example**

```sh
tanit-security session-store put --id 'foo' --file 'foo'
```

#### session-store put

Save one session JSON document.

Options:

- `--id` (TEXT) - Override session id from the JSON file.
- `--file` (TEXT, required) - Session JSON file.

**Example**

```sh
tanit-security session-store put --file <file>
```

**Full example**

```sh
tanit-security session-store put --id 'foo' --file 'foo'
```

---

#### session-store load

Load one session JSON document.

Options:

- `--id` (TEXT, required) - Session id.

**Example**

```sh
tanit-security session-store load --id <id>
```

**Full example**

```sh
tanit-security session-store load --id 'foo'
```

---

#### session-store memory-put

Save one session memory sidecar document.

Options:

- `--id` (TEXT, required) - Session id.
- `--file` (TEXT, required) - Memory JSON file.

**Example**

```sh
tanit-security session-store memory-put --id <id> --file <file>
```

**Full example**

```sh
tanit-security session-store memory-put --id 'foo' --file 'foo'
```

---

#### session-store log-put

Save one session log sidecar document.

Options:

- `--id` (TEXT, required) - Session id.
- `--log-id` (TEXT, required) - Log id.
- `--file` (TEXT, required) - Log JSON file.

**Example**

```sh
tanit-security session-store log-put --id <id> --log-id <id> --file <file>
```

**Full example**

```sh
tanit-security session-store log-put --id 'foo' --log-id 'foo' --file 'foo'
```

---

#### session-store list

List session metadata.

**Example**

```sh
tanit-security session-store list
```

---

#### session-store query

Enumerate sessions, memory items, artifacts, and security sidecar items.

**Example**

```sh
tanit-security session-store query
```

---

#### session-store delete

Delete one session.

Options:

- `--id` (TEXT, required) - Session id.

**Example**

```sh
tanit-security session-store delete --id <id>
```

**Full example**

```sh
tanit-security session-store delete --id 'foo'
```

---

#### session-store prune

Keep the newest N sessions and delete the rest.

Options:

- `--keep-latest` (INT, required, default `0`) - Number of newest sessions to keep.

**Example**

```sh
tanit-security session-store prune --keep-latest 0
```

---

### license

License purchase/activation payload probes [FEATURE_COMMAND_TEST].

**Example**

```sh
tanit-security license endpoints
```

**Full example**

```sh
tanit-security license endpoints --server-url 'foo'
```

#### license endpoints

Resolve planned Pixlwiz purchase/license endpoints.

Options:

- `--server-url` (TEXT) - Override service base URL; empty = SERVER_URL / VITE_SERVER_IMAGE_API_URL / built-in default.

**Example**

```sh
tanit-security license endpoints
```

**Full example**

```sh
tanit-security license endpoints --server-url 'foo'
```

---

#### license purchase-payload

Build Stripe PaymentIntent request payload.

Options:

- `--email` (TEXT) - Buyer email.
- `--app-user-id` (TEXT) - Authenticated app user id from login metadata.
- `--machine-hash` (TEXT, required) - 64-hex hardware fingerprint.
- `--machine-label` (TEXT) - Human label for this machine.
- `--app-version` (TEXT) - Client app version.
- `--product-id` (TEXT) - Server/product page id.
- `--slug` (TEXT, default `pixlwiz-pro`) - Product slug.
- `--title` (TEXT, default `Pixlwiz Pro`) - Product title.
- `--amount-cents` (INT, required, default `0`) - Price in smallest currency unit.
- `--currency` (TEXT, default `usd`) - ISO currency code.
- `--quantity` (INT, default `1`) - Quantity.
- `--calculate-tax` - Request server-side tax calculation where supported.

**Example**

```sh
tanit-security license purchase-payload --machine-hash <value> --amount-cents 0
```

**Full example**

```sh
tanit-security license purchase-payload --email 'foo' --app-user-id 'foo' --machine-hash 'foo' --machine-label 'foo' --app-version 'foo' --product-id 'foo' --slug 'pixlwiz-pro' --title 'Pixlwiz Pro' --amount-cents 0 --currency 'usd' --quantity 1 --calculate-tax
```

---

#### license issue-payload

Build post-purchase license issue payload.

Options:

- `--email` (TEXT) - Buyer email.
- `--app-user-id` (TEXT) - Authenticated app user id from login metadata.
- `--machine-hash` (TEXT, required) - 64-hex hardware fingerprint.
- `--machine-label` (TEXT) - Human label for this machine.
- `--app-version` (TEXT) - Client app version.
- `--transaction-id` (TEXT) - Server transaction id.
- `--stripe-payment-intent-id` (TEXT) - Stripe PaymentIntent id.
- `--feature` (TEXT, default `{}`) - Feature id (repeatable; default: pro).
- `--entitlement` (TEXT, default `{}`) - Deprecated alias for --feature.
- `--format` (TEXT:{dat,json}, default `dat`) - License file format: dat or json.

**Example**

```sh
tanit-security license issue-payload --machine-hash <value>
```

**Full example**

```sh
tanit-security license issue-payload --email 'foo' --app-user-id 'foo' --machine-hash 'foo' --machine-label 'foo' --app-version 'foo' --transaction-id 'foo' --stripe-payment-intent-id 'foo' --feature '{}' --entitlement '{}' --format 'dat'
```

---

#### license revalidate-payload

Build future home-call revalidation payload.

Options:

- `--license-id` (TEXT, required) - Signed license id.
- `--email` (TEXT) - Buyer email.
- `--machine-hash` (TEXT, required) - 64-hex hardware fingerprint.
- `--app-version` (TEXT) - Client app version.
- `--generation` (INT, default `0`) - Local license-state generation.
- `--active-seconds` (INT, default `0`) - Accumulated active-use seconds.

**Example**

```sh
tanit-security license revalidate-payload --license-id <id> --machine-hash <value>
```

**Full example**

```sh
tanit-security license revalidate-payload --license-id 'foo' --email 'foo' --machine-hash 'foo' --app-version 'foo' --generation 0 --active-seconds 0
```

---

### antihack

Runtime tamper telemetry [FEATURE_ANTI_HACKING].
debugger  — debugger presence (PEB / NtQueryInformationProcess / DRx).
hooks     — inline hooks on sensitive ntdll/kernel32 exports.
modules   — loaded-module provenance snapshot.
memory    — private executable / RWX memory regions.
scan      — run all of the above and aggregate.

**Example**

```sh
tanit-security antihack debugger
```

#### antihack debugger

Probe debugger-presence signals.

**Example**

```sh
tanit-security antihack debugger
```

---

#### antihack hooks

Probe inline hooks on sensitive exports.

Options:

- `--module` (TEXT, default `{}`) - Restrict to module(s), e.g. ntdll.dll (repeatable; default: all).

**Example**

```sh
tanit-security antihack hooks
```

**Full example**

```sh
tanit-security antihack hooks --module '{}'
```

---

#### antihack modules

Snapshot loaded modules + flag suspicious paths.

**Example**

```sh
tanit-security antihack modules
```

---

#### antihack memory

Scan for private-executable / RWX regions.

Options:

- `--self-test-rwx` - Allocate one RWX page first so the scan has a deterministic positive (test harness).

**Example**

```sh
tanit-security antihack memory
```

**Full example**

```sh
tanit-security antihack memory --self-test-rwx
```

---

#### antihack scan

Run every probe and aggregate one report.

Options:

- `--self-test-rwx` - Inject an RWX page for the memory probe (test harness).

**Example**

```sh
tanit-security antihack scan
```

**Full example**

```sh
tanit-security antihack scan --self-test-rwx
```

---

### gpo

Windows Group Policy Object queries.
Read HKCU/HKLM policy keys under Software\Policies\PolyMech\pm-image and show the effective policy.

**Example**

```sh
tanit-security gpo effective
```

**Full example**

```sh
tanit-security gpo effective --set-only
```

#### gpo effective

Show the merged effective policy for all known keys.
Builtin defaults are overridden by HKCU, which is overridden by HKLM.

Options:

- `--set-only` - Only emit keys explicitly configured via GPO (omit the full policy dump).

**Example**

```sh
tanit-security gpo effective
```

**Full example**

```sh
tanit-security gpo effective --set-only
```

---

#### gpo read

Dump raw registry values from HKCU and/or HKLM.

Options:

- `--hive` (TEXT:{hkcu,hklm,both}, default `both`) - Which hive(s) to read: hkcu | hklm | both (default: both).

**Example**

```sh
tanit-security gpo read
```

**Full example**

```sh
tanit-security gpo read --hive 'both'
```

---

#### gpo list-tools

List all agent tools with their GPO-effective enabled/disabled status.

**Example**

```sh
tanit-security gpo list-tools
```

