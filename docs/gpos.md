# Group Policy Reference

Registry root:

```text
HKLM\Software\Policies\PolyMech\tanit
HKCU\Software\Policies\PolyMech\tanit
```

Computer-scope (`HKLM`) wins over user-scope (`HKCU`). Policies marked HKLM-only ignore HKCU so non-admin users cannot weaken security policy.

## Quick Reference

| Policy | Registry value | Type | Default | Scope |
| --- | --- | --- | --- | --- |
| Enable MCP Client | `Agent\EnableMcpClient` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable User Skills | `Agent\EnableSkills` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Computer-Use Tools | `Agent\EnableComputerUse` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Browser-Use Tools | `Agent\EnableBrowserUse` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Real-Time Agent | `Agent\EnableRealtime` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enforce Sandbox Mode | `Agent\SandboxMode` | DWORD | `0` (disabled) | HKCU/HKLM |
| Allowed MCP Hosts | `Agent\AllowedMcpHosts` | REG_MULTI_SZ | empty | HKCU/HKLM |
| Enable Run Tool | `Agent\Tools\EnableRun` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Run-Sequence Tool | `Agent\Tools\EnableRunSequence` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Write-File Tool | `Agent\Tools\EnableWriteFile` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable File-Str-Replace Tool | `Agent\Tools\EnableFileStrReplace` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable File-Delete Tool | `Agent\Tools\EnableFileDelete` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Create-Command Tool | `Agent\Tools\EnableCreateCommand` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Computer-Group Tools | `Agent\Tools\EnableComputerGroup` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Browser-Group Tools | `Agent\Tools\EnableBrowserGroup` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable App-Command Tool | `Agent\Tools\EnableAppCommands` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Scheduler Tools | `Agent\Tools\EnableScheduler` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Memory Tools | `Agent\Tools\EnableMemory` | DWORD | `1` (enabled) | HKCU/HKLM |
| Tool Block List | `Agent\Tools\BlockList` | REG_MULTI_SZ | empty | HKCU/HKLM |
| Tool Allow List | `Agent\Tools\AllowList` | REG_MULTI_SZ | empty | HKCU/HKLM |
| Require Encryption for Stored Assets | `Security\RequireEncryption` | DWORD | `1` (enabled) | HKLM-only |
| Require Signing for Stored Assets | `Security\RequireSigning` | DWORD | `1` (enabled) | HKLM-only |
| Force Session Storage Location | `SessionStorage\Root` | REG_SZ | empty / not configured | HKLM-only |
| Force Application Temp Directory | `Paths\TempDirectory` | REG_SZ | empty / not configured | HKLM-only |
| Force Default Work Folder | `Paths\DefaultFolder` | REG_SZ | empty / not configured | HKLM-only |
| Force Session Storage Protection | `SessionStorage\Protection` | REG_SZ | not configured (compiled default) | HKLM-only |
| Require Encryption for Sessions | `SessionStorage\RequireEncryption` | DWORD | `1` (enabled) | HKLM-only |
| Require Signing for Sessions | `SessionStorage\RequireSigning` | DWORD | `1` (enabled) | HKLM-only |
| Allow Clipboard as a Context Source | `Privacy\EnableClipboardContext` | DWORD | `1` (enabled) | HKCU/HKLM |
| Force Verification Protector | `Security\ForceVerificationProtector` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Import Settings | `Security\Verification\SettingsImportPlain` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Export Settings | `Security\Verification\SettingsExportPlain` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Update Commands | `Security\Verification\CommandConfigUpdate` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Import Commands | `Security\Verification\CommandConfigImport` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Export Commands | `Security\Verification\CommandConfigExport` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Update MCP Config | `Security\Verification\McpConfigUpdate` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Import MCP Config | `Security\Verification\McpConfigImport` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Update Prompts | `Security\Verification\PromptUpdate` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Import Prompts | `Security\Verification\PromptImport` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Import Signed Assets | `Security\Verification\AssetImport` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Save OAuth Credentials | `Security\Verification\OAuthCredentialsSave` | REG_SZ | not configured (compiled default) | HKLM-only |
| Verification Level: Clear OAuth Credentials | `Security\Verification\OAuthCredentialsClear` | REG_SZ | not configured (compiled default) | HKLM-only |
| Enable File Explorer Panel | `UI\Panels\EnableExplorer` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Search Panel | `UI\Panels\EnableSearch` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Console / Shell Panel | `UI\Panels\EnableShell` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Ribbon Toolbar | `UI\Panels\EnableRibbon` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Job Queue Panel | `UI\Panels\EnableQueue` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Log Panel | `UI\Panels\EnableLog` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Chat Panel | `UI\Panels\EnableChat` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Settings Panel | `UI\Panels\EnableSettings` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Providers Tab | `UI\Settings\EnableProvidersTab` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Advanced Settings Tab | `UI\Settings\EnableAdvancedTab` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Chat Model Router | `UI\Settings\EnableChatRouter` | DWORD | `1` (enabled) | HKCU/HKLM |
| Allowed AI Providers | `UI\AllowedProviders` | REG_MULTI_SZ | empty | HKCU/HKLM |
| Enable Prompt Editor | `UI\Editors\EnablePrompt` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Command Editor | `UI\Editors\EnableCommand` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable MCP Config Editor | `UI\Editors\EnableMcp` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable search CLI Command | `CLI\EnableSearch` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Audio CLI Commands | `CLI\EnableAudio` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Video CLI Commands | `CLI\EnableVideo` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable XBlox CLI Commands | `CLI\EnableXblox` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable register-explorer CLI Command | `CLI\EnableRegisterExplorer` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable register-startmenu CLI Command | `CLI\EnableRegisterStartMenu` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable installer CLI Command | `CLI\EnableInstaller` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable settings CLI Command | `CLI\EnableSettings` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable service CLI Command | `CLI\EnableService` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable login / logout CLI Commands | `CLI\EnableLogin` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable status CLI Command | `CLI\EnableStatus` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable run-ipc CLI Command | `CLI\EnableRunIpc` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable mcp server CLI Command | `CLI\EnableMcpServer` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable daemon CLI Command | `CLI\EnableDaemon` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable assistant CLI Command | `CLI\EnableAssistant` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable batch CLI Command | `CLI\EnableBatch` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable bluetooth CLI Command | `CLI\EnableBluetooth` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable media CLI Command | `CLI\EnableMedia` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable tanit:// URL Scheme Handler | `CLI\EnableUrlSchemes` | DWORD | `1` (enabled) | HKLM-only |
| Enable SSH / SFTP access | `Network\EnableSsh` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable FTP / FTPS access | `Network\EnableFtp` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable command execution from web surfaces | `Web\EnableCommandRun` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable arbitrary external/shell commands from web surfaces | `Web\EnableExternalShell` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable local whisper.cpp speech-to-text | `Local\EnableWhisper` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable local ONNX runtime inference | `Local\EnableOnnx` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable local llama.cpp inference | `Local\EnableLlama` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Google / Gemini Provider | `Providers\EnableGoogle` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable OpenAI Provider | `Providers\EnableOpenai` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Replicate Provider | `Providers\EnableReplicate` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable OpenRouter Provider | `Providers\EnableOpenrouter` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Tanit Provider | `Providers\EnablePixlwiz` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable ElevenLabs Provider | `Providers\EnableElevenlabs` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Hugging Face Provider | `Providers\EnableHuggingface` | DWORD | `1` (enabled) | HKCU/HKLM |
| Enable Custom (OpenAI-compatible) Provider | `Providers\EnableCustom` | DWORD | `1` (enabled) | HKCU/HKLM |

## Agent

Registry subkey: `...\Software\Policies\PolyMech\tanit\Agent`

### Enable MCP Client

| Field | Value |
| --- | --- |
| Policy key | `Agent.EnableMcpClient` |
| Registry value | `Agent\EnableMcpClient` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to connect to external MCP (Model Context Protocol) servers.

When enabled (default) the agent can discover and call tools provided by MCP servers. When disabled all MCP connections are blocked regardless of user settings.

---

### Enable User Skills

| Field | Value |
| --- | --- |
| Policy key | `Agent.EnableSkills` |
| Registry value | `Agent\EnableSkills` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to load and invoke user-installed skills (SKILL.md packages).

When disabled the skills tab is hidden and no skill is executed.

---

### Enable Computer-Use Tools

| Field | Value |
| --- | --- |
| Policy key | `Agent.EnableComputerUse` |
| Registry value | `Agent\EnableComputerUse` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to use screen-capture, mouse, keyboard, and in-app WebView browser-use tools.

Disable this policy on shared or managed desktops where UI automation must be restricted. This is a coarse switch over the computer-use tool group and also turns off browser-use. Use Agent.EnableBrowserUse to disable WebView tools without turning off desktop computer-use.

---

### Enable Browser-Use Tools

| Field | Value |
| --- | --- |
| Policy key | `Agent.EnableBrowserUse` |
| Registry value | `Agent\EnableBrowserUse` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to use in-app WebView browser-use tools (browser_read, browser_find, browser_scope, browser_click, browser_type, browser_select, browser_batch, browser_navigate).

Disable to block DOM interaction in the centre browser without turning off desktop computer-use. Agent.EnableComputerUse=0 also disables these tools.

---

### Enable Real-Time Agent

| Field | Value |
| --- | --- |
| Policy key | `Agent.EnableRealtime` |
| Registry value | `Agent\EnableRealtime` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the real-time voice agent session (continuous mic + LLM loop).

When disabled the realtime toolbar button and Start/Stop/Toggle Realtime app commands are blocked. Note: CLI.EnableAudio must also be on for realtime to function.

---

### Enforce Sandbox Mode

| Field | Value |
| --- | --- |
| Policy key | `Agent.SandboxMode` |
| Registry value | `Agent\SandboxMode` |
| Type | DWORD |
| Default | `0` (disabled) |
| Scope | HKCU or HKLM; HKLM wins |

When enabled all agent tool calls that spawn processes run inside an AppContainer sandbox with reduced privileges.

Requires Windows 10 1607 or later. AppContainer profiles are deleted on exit.

---

### Allowed MCP Hosts

| Field | Value |
| --- | --- |
| Policy key | `Agent.AllowedMcpHosts` |
| Registry value | `Agent\AllowedMcpHosts` |
| Type | REG_MULTI_SZ |
| Default | empty |
| Scope | HKCU or HKLM; HKLM wins |

Restrict MCP connections to an explicit list of hostnames or URIs (one entry per line, wildcards allowed, e.g. *.corp.example.com).

When empty (default) no host-level restriction is applied.

---

## Agent › Tools

Registry subkey: `...\Software\Policies\PolyMech\tanit\Agent\Tools`

### Enable Run Tool

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableRun` |
| Registry value | `Agent\Tools\EnableRun` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to use the "run" tool to execute arbitrary shell commands.

Disable to prevent the agent from spawning processes.

---

### Enable Run-Sequence Tool

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableRunSequence` |
| Registry value | `Agent\Tools\EnableRunSequence` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to use the "run_sequence" tool for multi-step shell pipelines.

---

### Enable Write-File Tool

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableWriteFile` |
| Registry value | `Agent\Tools\EnableWriteFile` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to create or overwrite files on the local filesystem.

---

### Enable File-Str-Replace Tool

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableFileStrReplace` |
| Registry value | `Agent\Tools\EnableFileStrReplace` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to surgically edit existing UTF-8 files (file_str_replace).

---

### Enable File-Delete Tool

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableFileDelete` |
| Registry value | `Agent\Tools\EnableFileDelete` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to delete regular files (file_delete).

---

### Enable Create-Command Tool

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableCreateCommand` |
| Registry value | `Agent\Tools\EnableCreateCommand` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to create new custom ribbon commands in the application.

---

### Enable Computer-Group Tools

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableComputerGroup` |
| Registry value | `Agent\Tools\EnableComputerGroup` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to use computer-use tools (screenshot, mouse, keyboard, app inspection).

---

### Enable Browser-Group Tools

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableBrowserGroup` |
| Registry value | `Agent\Tools\EnableBrowserGroup` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to use in-app WebView browser-use tools (read, find, scope, click, type, select, batch, navigate).

---

### Enable App-Command Tool

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableAppCommands` |
| Registry value | `Agent\Tools\EnableAppCommands` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to run Tanit app/UI commands on the running instance (openurl, open, browse, toggle panels, takescreenshot, etc.).

---

### Enable Scheduler Tools

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableScheduler` |
| Registry value | `Agent\Tools\EnableScheduler` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to schedule future actions (schedule_at / schedule_in / schedule_every tools).

---

### Enable Memory Tools

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.EnableMemory` |
| Registry value | `Agent\Tools\EnableMemory` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the agent to persist information between sessions using the memory tools.

---

### Tool Block List

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.BlockList` |
| Registry value | `Agent\Tools\BlockList` |
| Type | REG_MULTI_SZ |
| Default | empty |
| Scope | HKCU or HKLM; HKLM wins |

Deny-list of agent tool names (one per line). Tools in this list are never dispatched even if their individual Enable* flag is set.

Available tool names as of this build (34 tools):
  ?: app_command
  File: file_glob, file_read, file_search, list_images
  Image: create_video, image_create, image_crop, image_from_camera, image_resize, image_transform, image_understand, ocr_text
  Memory: memory_append_event, memory_find, memory_read, memory_write
  Service: service_files_get, service_files_list, service_files_upload, service_page_create, service_page_get, service_page_list, service_page_update, service_search
  Utility: ask_user, audio_transcribe, file_delete, file_str_replace, info_lookup, run, run_sequence, speak, write_file

---

### Tool Allow List

| Field | Value |
| --- | --- |
| Policy key | `Agent.Tools.AllowList` |
| Registry value | `Agent\Tools\AllowList` |
| Type | REG_MULTI_SZ |
| Default | empty |
| Scope | HKCU or HKLM; HKLM wins |

Allow-list of agent tool names. When non-empty, only tools listed here are available; all others are implicitly blocked.

Leave empty (default) to allow all tools that are not individually disabled.

Available tool names as of this build (34 tools):
  ?: app_command
  File: file_glob, file_read, file_search, list_images
  Image: create_video, image_create, image_crop, image_from_camera, image_resize, image_transform, image_understand, ocr_text
  Memory: memory_append_event, memory_find, memory_read, memory_write
  Service: service_files_get, service_files_list, service_files_upload, service_page_create, service_page_get, service_page_list, service_page_update, service_search
  Utility: ask_user, audio_transcribe, file_delete, file_str_replace, info_lookup, run, run_sequence, speak, write_file

---

## AI Providers

Registry subkey: `...\Software\Policies\PolyMech\tanit\Providers`

### Enable Google / Gemini Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnableGoogle` |
| Registry value | `Providers\EnableGoogle` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow Google / Gemini (google) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

Note: this provider is disabled by FEATURE_PROVIDER_* in the current build.

---

### Enable OpenAI Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnableOpenai` |
| Registry value | `Providers\EnableOpenai` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow OpenAI (openai) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

---

### Enable Replicate Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnableReplicate` |
| Registry value | `Providers\EnableReplicate` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow Replicate (replicate) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

Note: this provider is disabled by FEATURE_PROVIDER_* in the current build.

---

### Enable OpenRouter Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnableOpenrouter` |
| Registry value | `Providers\EnableOpenrouter` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow OpenRouter (openrouter) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

---

### Enable Tanit Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnablePixlwiz` |
| Registry value | `Providers\EnablePixlwiz` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow Tanit (tanit) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

---

### Enable ElevenLabs Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnableElevenlabs` |
| Registry value | `Providers\EnableElevenlabs` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow ElevenLabs (elevenlabs) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

---

### Enable Hugging Face Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnableHuggingface` |
| Registry value | `Providers\EnableHuggingface` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow Hugging Face (huggingface) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

---

### Enable Custom (OpenAI-compatible) Provider

| Field | Value |
| --- | --- |
| Policy key | `Providers.EnableCustom` |
| Registry value | `Providers\EnableCustom` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow Custom (OpenAI-compatible) (custom) to appear in provider registry driven surfaces.

When disabled, policy-aware provider listings hide this provider.

---

## Security

Registry subkey: `...\Software\Policies\PolyMech\tanit\Security`

### Require Encryption for Stored Assets

| Field | Value |
| --- | --- |
| Policy key | `Security.RequireEncryption` |
| Registry value | `Security\RequireEncryption` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKLM-only |

Enforce DPAPI-backed encryption for all secure documents (settings, OAuth credentials, commands, prompts, MCP config).

Disabling this policy allows plain-text storage, which is not recommended on shared or managed machines.

---

### Require Signing for Stored Assets

| Field | Value |
| --- | --- |
| Policy key | `Security.RequireSigning` |
| Registry value | `Security\RequireSigning` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKLM-only |

Reject assets that are not signed with the local Ed25519 signing key.

When enabled any unsigned or tampered document will be rejected at load time.

---

### Force Session Storage Location

| Field | Value |
| --- | --- |
| Policy key | `SessionStorage.Root` |
| Registry value | `SessionStorage\Root` |
| Type | REG_SZ |
| Default | empty / not configured |
| Scope | HKLM-only |

Force the secure session storage root used for chat transcripts, session memory, agent logs, and session sidecars.

Leave empty / Not Configured to use the compiled default under the user's app configuration directory. The path may be local or UNC; no import/export behavior is controlled by this policy.

---

### Force Application Temp Directory

| Field | Value |
| --- | --- |
| Policy key | `Paths.TempDirectory` |
| Registry value | `Paths\TempDirectory` |
| Type | REG_SZ |
| Default | empty / not configured |
| Scope | HKLM-only |

Force the application-scoped temporary directory used for agent tool scratch files and implicit generated outputs (e.g. image_create defaults).

Leave empty / Not Configured to use the compiled default under the user's app configuration directory (<config-dir>/temp). The path may be local or UNC.

---

### Force Default Work Folder

| Field | Value |
| --- | --- |
| Policy key | `Paths.DefaultFolder` |
| Registry value | `Paths\DefaultFolder` |
| Type | REG_SZ |
| Default | empty / not configured |
| Scope | HKLM-only |

Force the default Explorer work folder used when the app starts without --src or an explicit user context (e.g. Start Menu launch).

Leave empty / Not Configured to use the user's default-folder mode (last visited folder or a custom path in settings). The path may be local or UNC; it must exist and must not be the application install directory.

---

### Force Session Storage Protection

| Field | Value |
| --- | --- |
| Policy key | `SessionStorage.Protection` |
| Registry value | `SessionStorage\Protection` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `signed`, `encrypted`, `encrypted+up` |

Force the protection mode for secure session documents.

Signed stores readable JSON with a local document signature. Encrypted stores encrypted documents and also signs them. Encrypted with user presence is reserved for stronger local unlock flows. Plain text is intentionally not offered here.

Values:

- `signed`: Signed
- `encrypted`: Encrypted and signed
- `encrypted+up`: Encrypted with user presence and signed

---

### Require Encryption for Sessions

| Field | Value |
| --- | --- |
| Policy key | `SessionStorage.RequireEncryption` |
| Registry value | `SessionStorage\RequireEncryption` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKLM-only |

Require encrypted secure-storage documents for chat transcripts, session memory, agent logs, and session sidecars.

When enabled this overrides user settings that request signed-only or plain session storage.

---

### Require Signing for Sessions

| Field | Value |
| --- | --- |
| Policy key | `SessionStorage.RequireSigning` |
| Registry value | `SessionStorage\RequireSigning` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKLM-only |

Require local document signatures for chat transcripts, session memory, agent logs, and session sidecars.

When enabled every session document is signed and unsigned/tampered documents are rejected.

---

### Allow Clipboard as a Context Source

| Field | Value |
| --- | --- |
| Policy key | `Privacy.EnableClipboardContext` |
| Registry value | `Privacy\EnableClipboardContext` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the OS context service to treat clipboard files, text, images, and other Win32 clipboard formats as eligible sources for launcher commands, processors, and agents.

On by default. Clipboard is never equivalent to Explorer or Desktop selection. Group Policy can still disable this for managed desktops.

---

### Force Verification Protector

| Field | Value |
| --- | --- |
| Policy key | `Security.ForceVerificationProtector` |
| Registry value | `Security\ForceVerificationProtector` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `dpapi`, `mock-hello`, `windows-hello` |

Override the verification mechanism used for all sensitive operations.

Leave Not Configured to use the compiled default (Windows Hello when available, DPAPI otherwise).

Values:

- `dpapi`: DPAPI (no interactive challenge)
- `mock-hello`: Mock Hello (automated/CI environments only)
- `windows-hello`: Windows Hello (biometric or PIN)

---

## Security › Verification

Registry subkey: `...\Software\Policies\PolyMech\tanit\Security\Verification`

### Verification Level: Import Settings

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.SettingsImportPlain` |
| Registry value | `Security\Verification\SettingsImportPlain` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum user verification level required before importing settings from a plain file.

Compiled default: local_unlock. Leave Not Configured to keep the default.

---

### Verification Level: Export Settings

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.SettingsExportPlain` |
| Registry value | `Security\Verification\SettingsExportPlain` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum user verification level required before exporting settings to a plain file.

Compiled default: local_unlock. Leave Not Configured to keep the default.

---

### Verification Level: Update Commands

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.CommandConfigUpdate` |
| Registry value | `Security\Verification\CommandConfigUpdate` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to update the command configuration in-app.

Compiled default: presence.

---

### Verification Level: Import Commands

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.CommandConfigImport` |
| Registry value | `Security\Verification\CommandConfigImport` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to import commands from a plain file.

Compiled default: local_unlock.

---

### Verification Level: Export Commands

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.CommandConfigExport` |
| Registry value | `Security\Verification\CommandConfigExport` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to export commands to a plain file.

Compiled default: local_unlock.

---

### Verification Level: Update MCP Config

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.McpConfigUpdate` |
| Registry value | `Security\Verification\McpConfigUpdate` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to update MCP server configuration in-app.

Compiled default: local_unlock.

---

### Verification Level: Import MCP Config

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.McpConfigImport` |
| Registry value | `Security\Verification\McpConfigImport` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to import MCP configuration from a plain file.

Compiled default: local_unlock.

---

### Verification Level: Update Prompts

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.PromptUpdate` |
| Registry value | `Security\Verification\PromptUpdate` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to edit or save prompt templates in-app.

Compiled default: presence.

---

### Verification Level: Import Prompts

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.PromptImport` |
| Registry value | `Security\Verification\PromptImport` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to import prompt templates from plain files.

Compiled default: local_unlock.

---

### Verification Level: Import Signed Assets

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.AssetImport` |
| Registry value | `Security\Verification\AssetImport` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required to import a signed asset bundle (.pmbundle).

Compiled default: local_unlock.

---

### Verification Level: Save OAuth Credentials

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.OAuthCredentialsSave` |
| Registry value | `Security\Verification\OAuthCredentialsSave` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required before persisting ZITADEL OAuth tokens after login.

Compiled default: presence.

---

### Verification Level: Clear OAuth Credentials

| Field | Value |
| --- | --- |
| Policy key | `Security.Verification.OAuthCredentialsClear` |
| Registry value | `Security\Verification\OAuthCredentialsClear` |
| Type | REG_SZ |
| Default | not configured (compiled default) |
| Scope | HKLM-only |
| Allowed values | `none`, `presence`, `local_unlock`, `strong` |

Minimum verification required before clearing stored ZITADEL OAuth credentials (logout).

Compiled default: local_unlock.

---

## User Interface › Panels

Registry subkey: `...\Software\Policies\PolyMech\tanit\UI\Panels`

### Enable File Explorer Panel

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableExplorer` |
| Registry value | `UI\Panels\EnableExplorer` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the file explorer / tree panel in the main window. Disable to hide it for all users.

---

### Enable Search Panel

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableSearch` |
| Registry value | `UI\Panels\EnableSearch` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the search panel in the main window. Disable to hide it and block the search view toggle.

---

### Enable Console / Shell Panel

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableShell` |
| Registry value | `UI\Panels\EnableShell` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the integrated shell/console panel. Disable to hide it and block the console view toggle.

---

### Enable Ribbon Toolbar

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableRibbon` |
| Registry value | `UI\Panels\EnableRibbon` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the ribbon toolbar. Disable to hide it (commands remain available via keyboard shortcuts).

---

### Enable Job Queue Panel

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableQueue` |
| Registry value | `UI\Panels\EnableQueue` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the batch job queue panel. Requires the queue feature to be compiled in; disable to hide it.

---

### Enable Log Panel

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableLog` |
| Registry value | `UI\Panels\EnableLog` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the activity log panel. Requires the log feature to be compiled in; disable to hide it.

---

### Enable Chat Panel

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableChat` |
| Registry value | `UI\Panels\EnableChat` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the embedded chat panel. Requires the chat feature to be compiled in; disable to hide it.

---

### Enable Settings Panel

| Field | Value |
| --- | --- |
| Policy key | `UI.Panels.EnableSettings` |
| Registry value | `UI\Panels\EnableSettings` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the settings panel. Disable to prevent users from opening application settings entirely.

---

## User Interface › Settings & Tabs

Registry subkey: `...\Software\Policies\PolyMech\tanit\UI\Settings`

### Enable Providers Tab

| Field | Value |
| --- | --- |
| Policy key | `UI.Settings.EnableProvidersTab` |
| Registry value | `UI\Settings\EnableProvidersTab` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the Providers tab in Settings. Disable to prevent users from adding or changing AI providers.

---

### Enable Advanced Settings Tab

| Field | Value |
| --- | --- |
| Policy key | `UI.Settings.EnableAdvancedTab` |
| Registry value | `UI\Settings\EnableAdvancedTab` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Show the Advanced tab in Settings. Disable to hide advanced configuration.

---

### Enable Chat Model Router

| Field | Value |
| --- | --- |
| Policy key | `UI.Settings.EnableChatRouter` |
| Registry value | `UI\Settings\EnableChatRouter` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow users to change the active AI provider or model from the chat UI. Disable to lock the router.

---

### Allowed AI Providers

| Field | Value |
| --- | --- |
| Policy key | `UI.AllowedProviders` |
| Registry value | `UI\AllowedProviders` |
| Type | REG_MULTI_SZ |
| Default | empty |
| Scope | HKCU or HKLM; HKLM wins |

Restrict the AI providers users may select (one provider id per line).

Leave empty (default) to allow all configured providers.

---

## User Interface › Editors

Registry subkey: `...\Software\Policies\PolyMech\tanit\UI\Editors`

### Enable Prompt Editor

| Field | Value |
| --- | --- |
| Policy key | `UI.Editors.EnablePrompt` |
| Registry value | `UI\Editors\EnablePrompt` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow users to view and edit prompt templates. Disable to lock the prompt editor.

---

### Enable Command Editor

| Field | Value |
| --- | --- |
| Policy key | `UI.Editors.EnableCommand` |
| Registry value | `UI\Editors\EnableCommand` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow users to edit custom ribbon commands. Disable to lock the command editor.

---

### Enable MCP Config Editor

| Field | Value |
| --- | --- |
| Policy key | `UI.Editors.EnableMcp` |
| Registry value | `UI\Editors\EnableMcp` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow users to edit MCP server configuration. Disable to lock the MCP editor.

---

## CLI Commands

Registry subkey: `...\Software\Policies\PolyMech\tanit\CLI`

### Enable search CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableSearch` |
| Registry value | `CLI\EnableSearch` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "search" command (semantic / visual image search from the CLI). This is the CLI counterpart to the search panel governed by UI.Panels.EnableSearch; the "find" and "duplicates" discovery commands are unaffected.

---

### Enable Audio CLI Commands

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableAudio` |
| Registry value | `CLI\EnableAudio` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "audio" command group (recording, TTS, STT). Disabling also blocks the realtime agent. See also: Agent.EnableRealtime.

---

### Enable Video CLI Commands

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableVideo` |
| Registry value | `CLI\EnableVideo` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "video" command group from the CLI and the in-app video capture commands.

---

### Enable XBlox CLI Commands

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableXblox` |
| Registry value | `CLI\EnableXblox` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "xblox" command group and the block palette.

---

### Enable register-explorer CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableRegisterExplorer` |
| Registry value | `CLI\EnableRegisterExplorer` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow "register-explorer", which registers Windows Explorer context menus.

---

### Enable register-startmenu CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableRegisterStartMenu` |
| Registry value | `CLI\EnableRegisterStartMenu` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow "register-startmenu", which registers Start Menu shortcuts.

---

### Enable installer CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableInstaller` |
| Registry value | `CLI\EnableInstaller` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "installer" zip/unpacked install helper.

---

### Enable settings CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableSettings` |
| Registry value | `CLI\EnableSettings` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow import/export of the app settings profile via the CLI "settings" command.

---

### Enable service CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableService` |
| Registry value | `CLI\EnableService` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "service" command that calls the configured Tanit web service API.

---

### Enable login / logout CLI Commands

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableLogin` |
| Registry value | `CLI\EnableLogin` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "login" command (OIDC browser flow) for CLI sign-in / sign-out.

---

### Enable status CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableStatus` |
| Registry value | `CLI\EnableStatus` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "status" command that shows Tanit credits and license status.

---

### Enable run-ipc CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableRunIpc` |
| Registry value | `CLI\EnableRunIpc` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the "run-ipc" command that discovers and controls live tanit instances over the command IPC bus.

---

### Enable mcp server CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableMcpServer` |
| Registry value | `CLI\EnableMcpServer` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow launching the foreground MCP Streamable HTTP server via the "mcp" CLI command. Note: this controls the embedded server only — use Agent.EnableMcpClient for agent-side MCP client access.

---

### Enable daemon CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableDaemon` |
| Registry value | `CLI\EnableDaemon` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the global shortcut daemon (hotkeys, UI presets, app commands, STT, voice session).

---

### Enable assistant CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableAssistant` |
| Registry value | `CLI\EnableAssistant` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the AI assistant toolbar / global shortcuts / realtime voice / UIA spy host.

---

### Enable batch CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableBatch` |
| Registry value | `CLI\EnableBatch` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow batch session management (save / load / resume / list / discard).

---

### Enable bluetooth CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableBluetooth` |
| Registry value | `CLI\EnableBluetooth` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow Bluetooth and audio-endpoint management (list, pair, connect devices).

---

### Enable media CLI Command

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableMedia` |
| Registry value | `CLI\EnableMedia` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the experimental "media" type tools (file probing, libmagic MIME/extension metadata).

---

### Enable tanit:// URL Scheme Handler

| Field | Value |
| --- | --- |
| Policy key | `CLI.EnableUrlSchemes` |
| Registry value | `CLI\EnableUrlSchemes` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKLM-only |

Allow the application to act as a registered handler for the tanit:// custom URL scheme.

When enabled (default) users can register the scheme via "tanit installer --url-schemes" and clicking a tanit:// link in a browser or email will open the application. Disabling this policy prevents scheme registration (the installer --url-schemes flag becomes a no-op) and causes the application to reject any protocol URI passed on the command line via argv[1], silently exiting rather than processing the link.

This policy is HKLM-only. User-scope hive cannot re-enable it if an administrator disables it.

---

## Remote Locations

Registry subkey: `...\Software\Policies\PolyMech\tanit\Network`

### Enable SSH / SFTP access

| Field | Value |
| --- | --- |
| Policy key | `Network.EnableSsh` |
| Registry value | `Network\EnableSsh` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow ssh:// and sftp:// locations in the file panel, viewer, copy/move queue, XBlox fsCopy/fsMove/fsMkdir and sshExec, and tanit-cli cp/mv/mkdir/touch.

When disabled the app does not connect (libssh), does not list ~/.ssh/config hosts, and refuses stored recents or --src that use those schemes.

---

### Enable FTP / FTPS access

| Field | Value |
| --- | --- |
| Policy key | `Network.EnableFtp` |
| Registry value | `Network\EnableFtp` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow ftp:// and ftps:// bookmark URLs in the file panel, viewer, copy/move queue, XBlox fsCopy/fsMove/fsMkdir, and tanit-cli cp/mv/mkdir/touch.

When disabled the app does not connect (libcurl) and refuses stored recents or --src that use those schemes. Passwords already stored in a bookmark URL are not used.

---

## Local Inference Backends

Registry subkey: `...\Software\Policies\PolyMech\tanit\Local`

### Enable local whisper.cpp speech-to-text

| Field | Value |
| --- | --- |
| Policy key | `Local.EnableWhisper` |
| Registry value | `Local\EnableWhisper` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow whisper.cpp on-device transcription. Cloud STT providers are unaffected. Applies to: audio CLI --provider whisper, agent mic STT, xblox audio blocks.

---

### Enable local ONNX runtime inference

| Field | Value |
| --- | --- |
| Policy key | `Local.EnableOnnx` |
| Registry value | `Local\EnableOnnx` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow ONNX Runtime sessions (OCR, object detection, image classification, document layout). Applies to: onnx CLI, xblox OCR/detect/model blocks, search OCR, video detection.

---

### Enable local llama.cpp inference

| Field | Value |
| --- | --- |
| Policy key | `Local.EnableLlama` |
| Registry value | `Local\EnableLlama` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow llama.cpp model loading — local text chat routing, local embedding/semantic search, VLM, and the llama CLI. Whisper is separately controlled by Enable local whisper.cpp.

---

## Web Surfaces

Registry subkey: `...\Software\Policies\PolyMech\tanit\Web`

### Enable command execution from web surfaces

| Field | Value |
| --- | --- |
| Policy key | `Web.EnableCommandRun` |
| Registry value | `Web\EnableCommandRun` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow embedded web views (viewer, chat, xblox, home, settings) to launch processes through the host commandRun bridge. Disable to fully lock down command execution triggered from documents and panels.

---

### Enable arbitrary external/shell commands from web surfaces

| Field | Value |
| --- | --- |
| Policy key | `Web.EnableExternalShell` |
| Registry value | `Web\EnableExternalShell` |
| Type | DWORD |
| Default | `1` (enabled) |
| Scope | HKCU or HKLM; HKLM wins |

Allow the arbitrary-process path (externalCommand: a free executable or shell line) from web surfaces. Disable to permit only curated commands and tanit-cli verbs, bounding the blast radius of a document.

---
