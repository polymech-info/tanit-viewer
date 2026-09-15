# Tanit XBlox

Use this skill when composing `.xblox` block-tree command flows.

## Invocation Rules

- Run flows with `tanit-cli.exe xblox run --src flow.xblox`.
- `tanit.exe xblox run --src flow.xblox` accepts the same command, but prefer `tanit-cli.exe` when an agent needs stdout/stderr output.
- Inspect machine-readable block metadata with `tanit-cli.exe xblox info --json`.
- XBlox command blocks that call custom commands must use exact IDs, for example `custom.mic-start`, not `mic-start`.

## Document Shape

`{ "version": 1, "context": {}, "roots": [...] }`

## Calling Commands From XBlox

Use a command block with an exact custom command ID:

```json
{ "kind": "command", "command": { "id": "custom.mic-start" } }
```

Inline CLI command payloads are also supported:

```json
{ "kind": "command", "command": { "cliCommand": "audio", "args": ["record", "status"] } }
```

```json
{ "kind": "command", "command": { "cliCommand": "audio", "args": ["record", "status"] } }
```

## XBlox CLI

#### xblox info

Print XBlox block/command metadata for builders and LLM composition.

Options:

- `--commands` (TEXT) - Optional commands.json override for custom command metadata.

**Example**

```sh
tanit-cli xblox info
```

**Full example**

```sh
tanit-cli xblox info --commands 'foo'
```

#### xblox info schema

Resolve a provider options schema via the block_params_ui resolver. Exits 0 when the schema has properties, 1 when null/unregistered.

Options:

- `--schema-path` (TEXT) - Resolver routing key, e.g. providers.whisper or providers.replicate.image.
- `-p,--provider` (TEXT) - Provider name shorthand; used as providers.<name> when --schema-path is omitted.
- `-m,--model` (TEXT) - Model slug forwarded to the resolver (e.g. base.en or stability-ai/sdxl).

**Example**

```sh
tanit-cli xblox info schema
```

**Full example**

```sh
tanit-cli xblox info schema --schema-path 'foo' -p 'foo' -m 'foo'
```

---

#### xblox info options

Resolve a block-param options list (array of {value,label}) via block_params_ui resolver. Exits 0 when options are returned, 1 when the path is unknown.

Options:

- `-p,--path` (TEXT, required) - Options path, e.g. providers.replicate.collections or providers.replicate.models.official.

**Example**

```sh
tanit-cli xblox info options -p <value>
```

**Full example**

```sh
tanit-cli xblox info options -p 'foo'
```

---

#### xblox selftest

Run native runtime self-tests (scope frames, exit policy, muParser var factory) and print a JSON report.

**Example**

```sh
tanit-cli xblox selftest
```

---

#### xblox run

Run a blocks-file JSON document emitted by the XBlox web app.

Options:

- `--src` (TEXT, required) - Path to a blocks-file JSON document: { version: 1, context?: {}, roots: [...] }.
- `--commands` (TEXT) - Optional commands.json override for resolving host.runCustomCommand({ id }).
- `--event-mode` (TEXT:{full,errors,count}, default `errors`) - Event retention: full stores every event, errors stores only failures, count stores no events. Default: errors (full with --json).
- `--dry-run` - Stage CLI/external commands but do not spawn child processes.
- `--simulate` - Simulate execution: resolve inputs and run pure dataflow/control blocks, but suppress side-effecting blocks (fs writes, shell, network, capture, external commands), emitting predicted 'simulated' events instead.
- `--md` - Print the document as brief pseudo-code markdown (context bullets + script tree) and exit without running it.
- `--md-numbered` - Use numeric bullets (1. / 2.) instead of dashes in --md output.
- `--md-filter` (TEXT, default `{}`) - Block kinds excluded from --md output, with their subtrees (repeatable or comma-separated). Default: stdout. Pass 'none' to include everything.
- `--mermaid` - Render the script section as a fenced mermaid flowchart instead of the bullet tree. Context variables stay as markdown bullets above the diagram. Requires --md.
- `--mermaid-type` (TEXT:{flow,sequence}, default `flow`) - Diagram type: flow (default; flowchart with decision diamonds) or sequence (registry groups as participants, control flow as alt/loop fragments).
- `--mermaid-direction` (TEXT:{TD,LR,BT,RL}, default `TD`) - Flowchart direction: TD (default, vertical), LR, BT, or RL. Applies to --mermaid and --diagram.
- `--mermaid-color` (TEXT:{edges,groups,both,none}, default `both`) - Colouring: edges (yes/no/loop/case link tints), groups (node strokes per registry group + flow diamonds), both (default), or none.
- `--expand-parameters` - Include set block parameters in diagram node labels (default: compact labels — group/kind, set <name>, conditions on diamonds).
- `--diagram` - Render the script as a Tanit-style SVG flowchart and exit without running it. Default: raw SVG on stdout. Use --diagram-dst / --diagram-png for files. Combine with --md to embed the diagram in markdown output instead.
- `--styles` (TEXT) - Diagram styling constants JSON. Default: ${TANIT_SHARED}/xblox-diagram-constants.json. Supports command_variables in the path. Palettes live under JSON "themes".
- `--theme` (TEXT:{light,dark}, default `light`) - Diagram color palette: light (default) or dark. Selects themes.<name> in the styles JSON (defaultTheme when omitted).
- `--diagram-type` (TEXT:{flow,sequence}, default `flow`) - Diagram layout: flow (default; flowchart with decision diamonds and param cards) or sequence (participants, lifelines, Script messages).
- `--diagram-png` (TEXT) - Rasterize the diagram to this PNG path (libvips svgload). Supports command_variables in the path.
- `--diagram-dst` (TEXT) - Write a standalone .svg file (raw SVG, not markdown). Supports command_variables in the path.
- `--show-arrows` (BOOLEAN, default `1`) - Draw arrowheads on flow edges when --show-links is true (default: true; styles JSON render.showArrows).
- `--show-links` (BOOLEAN, default `1`) - Draw connector lines between blocks. When false, nodes are laid out compactly in script order without edges (default: true; styles JSON render.showLinks).
- `--show-disabled` (BOOLEAN, default `0`) - Include disabled blocks in the diagram (default: false; styles JSON render.showDisabled).
- `--show-variables` (BOOLEAN, default `1`) - Show storeAs targets and referenced variables on node labels (default: true; styles JSON render.showVariables).
- `--show-groups` (BOOLEAN, default `1`) - Prefix registry block labels with their group, e.g. audio/audioRecord (default: true; styles JSON render.showGroups).
- `--humanize-node-names` (BOOLEAN, default `0`) - Humanize registry block labels, e.g. shell/openPath -> Shell / Open Path (default: false; styles JSON render.humanizeNodeNames).
- `--show-variable-delimiters` (BOOLEAN, default `0`) - Wrap referenced variables as ${name}; when false show plain names (default: false; styles JSON render.showVariableDelimiters).
- `--variable-link-style` (TEXT, default `unicode`) - Separator before storeAs targets: arrow, unicode (→), colon, dot, equals, none (default: unicode; styles JSON render.variableLinkStyle).
- `--variable-input-style` (TEXT, default `at`) - Format for referenced inputs: at (@name), parens, bracket, none (default: at; styles JSON render.variableInputStyle).
- `--link-style` (TEXT:{straight,bezier,waypoints}, default `straight`) - Edge routing style: straight (orthogonal), bezier (smooth curves), waypoints (obstacle-aware routing ported from nodehub pathfinding; default: straight; styles JSON render.linkStyle).
- `--show-parameters` (TEXT:{none,set,all}, default `none`) - Block parameter visibility on node labels: none (compact), set (wired/set params only, like wiring 'Wired params'), all (full param list, like wiring 'All params'). Styles JSON render.showParameters. --expand-parameters is equivalent to --show-parameters all.
- `--show-parameters-grouped` (BOOLEAN, default `0`) - Prefix each parameter with its ParamDef group (input/, options/, …). Matches wiring toolbar 'Show group'.
- `--show-parameter-values` (BOOLEAN, default `0`) - Include parameter values in node labels when --show-parameters is set or all (matches wiring toolbar 'Show set values').
- `--no-wait` - Skip sleeping for wait blocks.
- `--max-loop-iterations` (INT:INT in [0 - 1000000], default `10000`) - Maximum iterations per for/while loop block.
- `--loop` - Re-run the whole document until cancelled (Ctrl+C). Overrides the document's stored loop setting.
- `--no-loop` - Force a single pass even if the document enables looping.
- `--loop-interval-ms` (INT:INT in [0 - 86400000], default `100`) - Gap in milliseconds between loop passes (0 = as fast as possible, yielding each pass). Clamped to [0, 86400000] (1 day).
- `--loop-reset` - Reset scope/state each loop pass (clean restart). Default persists state across passes (variables carry over).
- `--loop-limit` (INT:INT in [0 - 9223372036854775807], default `0`) - Stop after exactly N document-level loop passes (0 = unlimited). Counted at the runtime level before each inter-pass yield.
- `--quiet` - Suppress stdout block output (message is still resolved and the event is still emitted). Useful for benchmarking and CI runs.
- `--profile` - Print a per-category timing breakdown to stderr after the run (jq VM, converters, emit, set-ctx).
- `--arg` (TEXT, default `{}`) - Extra argument appended to cliCommand/external argv command invocations; repeatable.

**Security**
- `--consent-ui` (TEXT) - Consent surface for security-gated tools in this run: win32 (default, native dialog) | auto | cli | auto-deny | auto-allow | preset. An llmAgent block's consentUi param overrides this per turn.
- `--consent-owner` (TEXT) - Target descriptor (ipc id) for --consent-ui owner routing. Reserved.

**Example**

```sh
tanit-cli xblox run --src <value>
```

**Full example**

```sh
tanit-cli xblox run --src 'foo' --commands 'foo' --consent-ui 'foo' --consent-owner 'foo' --event-mode 'errors' --dry-run --simulate --md --md-numbered --md-filter '{}' --mermaid --mermaid-type 'flow' --mermaid-direction 'TD' --mermaid-color 'both' --expand-parameters --diagram --styles 'foo' --theme 'light' --diagram-type 'flow' --diagram-png 'foo' --diagram-dst 'foo' --show-arrows '1' --show-links '1' --show-disabled '0' --show-variables '1' --show-groups '1' --humanize-node-names '0' --show-variable-delimiters '0' --variable-link-style 'unicode' --variable-input-style 'at' --link-style 'straight' --show-parameters 'none' --show-parameters-grouped '0' --show-parameter-values '0' --no-wait --max-loop-iterations 10000 --loop --no-loop --loop-interval-ms 100 --loop-reset --loop-limit 0 --quiet --profile --arg '{}'
```

---

#### xblox session

Inspect and control live xblox sessions (looping runs and bare hosts).

**Example**

```sh
tanit-cli xblox session list
```

#### xblox session list

List live sessions (stale entries are reaped on scan).

**Example**

```sh
tanit-cli xblox session list
```

---

#### xblox session start

Host a bare session and block until stopped (Ctrl+C or `session stop`).

Options:

- `--key` (TEXT) - Session name/key (default: auto host-<ms>).
- `--label` (TEXT) - Human-friendly label.

**Example**

```sh
tanit-cli xblox session start
```

**Full example**

```sh
tanit-cli xblox session start --key 'foo' --label 'foo'
```

---

#### xblox session stop

Signal a session (or --all) to stop.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.
- `--all` - Target every live session.

**Example**

```sh
tanit-cli xblox session stop
```

**Full example**

```sh
tanit-cli xblox session stop --key 'foo' --all
```

---

#### xblox session ping

Send a ping to a session (or --all); prints the pong reply.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.
- `--all` - Target every live session.

**Example**

```sh
tanit-cli xblox session ping
```

**Full example**

```sh
tanit-cli xblox session ping --key 'foo' --all
```

---

#### xblox session pong

Send a pong to a session (or --all); prints the ping reply.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.
- `--all` - Target every live session.

**Example**

```sh
tanit-cli xblox session pong
```

**Full example**

```sh
tanit-cli xblox session pong --key 'foo' --all
```

---

#### xblox session info

Show a session's details (xblox file, cwd, pid, uptime) and live vars.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.

**Example**

```sh
tanit-cli xblox session info
```

**Full example**

```sh
tanit-cli xblox session info --key 'foo'
```

---

#### xblox session get

Read a variable from a session's published scope.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.
- `--name` (TEXT, required) - Variable name.

**Example**

```sh
tanit-cli xblox session get --name <value>
```

**Full example**

```sh
tanit-cli xblox session get --key 'foo' --name 'foo'
```

---

#### xblox session set

Set a variable on a session (applied at the next loop pass).

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.
- `--name` (TEXT, required) - Variable name.
- `--value` (TEXT) - Value (parsed as JSON when possible, else a string).

**Example**

```sh
tanit-cli xblox session set --name <value>
```

**Full example**

```sh
tanit-cli xblox session set --key 'foo' --name 'foo' --value 'foo'
```

---

#### xblox session vars

List a session's published variables.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.

**Example**

```sh
tanit-cli xblox session vars
```

**Full example**

```sh
tanit-cli xblox session vars --key 'foo'
```

---

#### xblox session send

Send a directed message to a session's inbox.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.
- `--message` (TEXT) - Message text.
- `--from` (TEXT) - Sender identity (default: cli).

**Example**

```sh
tanit-cli xblox session send
```

**Full example**

```sh
tanit-cli xblox session send --key 'foo' --message 'foo' --from 'foo'
```

---

#### xblox session broadcast

Send a message to every live session's inbox.

Options:

- `--message` (TEXT) - Message text.
- `--from` (TEXT) - Sender identity (default: cli).

**Example**

```sh
tanit-cli xblox session broadcast
```

**Full example**

```sh
tanit-cli xblox session broadcast --message 'foo' --from 'foo'
```

---

#### xblox session recv

Drain (or --peek) a session's message inbox.

Options:

- `--key` (TEXT) - Target session key, stem, or unambiguous prefix.
- `--peek` - Read without consuming.

**Example**

```sh
tanit-cli xblox session recv
```

**Full example**

```sh
tanit-cli xblox session recv --key 'foo' --peek
```


## Blocks

### AI

#### LLM Agent

Run an LLM agent turn in-process (tool loop included) and store the answer in PREVIOUS. hudMode=both (default) shows the taskbar button plus a movable overlay over the clock.

Params:

**input**
- `prompt` (prompt, required, from PREVIOUS, resolve: variables+deep) - Instruction / question for the agent. Uses PREVIOUS when unset.
- `include` (args_list, default `[]`, resolve: variables+deep) - Files or folders in the agent selection context (CLI --include).
- `embed` (args_list, default `[]`, resolve: variables+deep) - Text files inlined into the prompt (CLI --embed).
- `cwd` (dir_path, default `""`, resolve: variables) - Working folder the agent treats as context. Empty = the run cwd.

**advanced**
- `systemPrompt` (prompt, default `""`, resolve: variables+deep) - Full system-prompt override (CLI --system-prompt). Supports literal text, null/none, @path, or file:path.
- `system` (string, default `""`, resolve: variables+deep) - Optional extra system text appended after the resolved system prompt.
- `plannerPrompt` (prompt, default `""`, resolve: variables+deep) - Planner system-prompt override (CLI --planner-prompt). Same grammar as systemPrompt.
- `runner` (enum, default `""`, enum: |native|claude-code|codex|cursor) - Agent backend (CLI --runner). Empty = chat preset, then native. Also reads PM_LLM_AGENT_RUNNER when unset.
- `model` (string, default `""`, resolve: variables+deep) - Model override. Empty = from App Settings.
- `router` (string, default `""`) - Provider router override. Empty = from App Settings.
- `type` (enum, default `"completion"`, enum: completion|responses|realtime) - LLM API type.
- `streaming` (enum, default `"auto"`, enum: auto|on|off) - Streaming mode for Responses API turns.
- `mcp` (boolean, default `true`) - Allow MCP-backed tools. Off forces MCP off for this turn.
- `skills` (boolean, default `true`) - Allow agent skill discovery/injection.
- `planner` (boolean, default `true`) - Allow the planner pre-pass. Off forces planner off.
- `plannerBudget` (integer, 0-64, default `0`) - Max tool schemas the planner may pre-expand. 0 = default (8).
- `disableTools` (args_list, default `[]`) - Path/MCP tool ids to omit for this turn (CLI --disable-tools).
- `enableTools` (args_list, default `[]`) - Allowlist of path tools for this turn (CLI --enable-tools).
- `parallelTools` (boolean, default `true`) - Dispatch multiple tool calls concurrently. Off = serial execution.
- `maxSteps` (integer, 0-100, default `0`) - Tool-loop iteration cap. 0 = resolved default.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `0`) - Per-LLM-call timeout in ms. 0 = resolved default.
- `sessionId` (string, default `""`) - Optional session id for multi-turn memory across runs (CLI --session-id).
- `streamLog` (boolean, default `false`) - Mirror streaming assistant text deltas to the trace log.
- `json` (boolean, default `false`) - Also emit the full agent transcript as a `transcript` output.

**options**
- `preset` (string, default `""`) - Chat provider preset name. Empty = default preset from App Settings.
- `tools` (boolean, default `true`) - Allow tool calls. Off = plain completion (CLI --no-tools).

**auth**
- `apiKey` (api_key, default `""`) - API key override. Empty = from App Settings.
- `baseUrl` (string, default `""`) - Router base URL override. Empty = from App Settings.

**security**
- `consentUi` (enum, default `"win32"`, enum: win32|auto|preset|cli|auto-deny|auto-allow) - Consent surface for security-gated tools (CLI --consent-ui). win32 = native permission dialog (default, including headless runs). auto = cli when stdin is attached, else win32 on a desktop, else deny. preset = chat preset consent_ui (Yolo / auto-deny). cli = stdio prompt; auto-deny / auto-allow skip the dialog.
- `consentOwner` (string, default `""`) - Target descriptor (ipc id) for consent-ui owner routing. Reserved.
- `aiConsentReview` (boolean, default `false`) - Run the advisory SecurityAgent reviewer before consent prompts.
- `aiConsentRouter` (string, default `""`) - Router for the advisory SecurityAgent reviewer.
- `aiConsentModel` (string, default `""`) - Model for the advisory SecurityAgent reviewer.

**tool_overrides**
- `ocrProvider` (string, default `""`) - OCR tool provider override for this turn.
- `ocrModel` (string, default `""`) - OCR tool model override for this turn.
- `recognitionProvider` (string, default `""`) - image_understand provider override.
- `recognitionModel` (string, default `""`) - image_understand model override.
- `imageProvider` (string, default `""`) - image_create provider override.
- `imageModel` (string, default `""`) - image_create model override.
- `videoProvider` (string, default `""`) - create_video provider override.
- `videoModel` (string, default `""`) - create_video model override.
- `sttProvider` (string, default `""`) - STT provider override (audio_transcribe / mic flows).
- `sttModel` (string, default `""`) - STT model override.
- `ttsProvider` (string, default `""`) - TTS provider override.
- `ttsModel` (string, default `""`) - TTS model override.
- `ttsVoiceId` (string, default `""`) - TTS voice id override.

**hud**
- `hudMode` (enum, default `"both"`, enum: off|taskbar|overlay|both) - Status HUD. taskbar = app taskbar button. overlay = movable pill over the clock. both = combine. off = none.
- `hud` (boolean, default `true`) - Master switch for hudMode. Default: on.

**output**
- `dst` (output_path, default `""`, constraints: writable+createParents) - Write the agent response to this file (CLI --dst). Without json: raw answer text. With json: full result JSON. Parent directories are created automatically.
- `usage` (json_value) - Aggregated token usage / cost for the turn.
- `transcript` (json_value) - Full turn transcript. Populated when `json` is on.
- `storeAs` (string, default `"answer"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "consentUi": "win32",
  "embed": [],
  "hud": true,
  "hudMode": "both",
  "include": [],
  "kind": "llmAgent",
  "prompt": "",
  "storeAs": "answer",
  "tools": true
}
```

---

#### Model Control

List or unload loaded local model instances for this xBlox process.

Params:

**lifecycle**
- `action` (enum, default `"List"`, enum: List|Unload) - List loaded models in this xBlox process, or unload one by key.
- `key` (string, default `""`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (string, default `"models"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "action": "List",
  "key": "",
  "kind": "modelControl",
  "storeAs": "models"
}
```

---

#### Reference in Chat

Add a file or folder to chat context, and/or seed the composer with text (same as UI launch `--prompt` / `--send`).

Params:

**input**
- `path` (file_path, from PREVIOUS, resolve: variables+deep) - File or folder to add to chat context. Uses PREVIOUS when unset.
- `text` (string, default `""`, resolve: variables+deep) - Composer seed text (same as `--prompt`). Alias: prompt.

**options**
- `send` (boolean, default `false`) - Auto-send the seeded text when the composer is ready (same as `--send`).

**output**
- `storeAs` (string, default `"referencedPath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "referenceInChat",
  "path": "",
  "send": false,
  "storeAs": "referencedPath",
  "text": ""
}
```

### App

#### App Activate

Bring a target window to the foreground.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `pid` (integer) - Exact process id.
- `hwnd` (integer) - Exact window handle.
- `foreground` (boolean, default `false`) - Target the current foreground window.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "appActivate",
  "title": "Notepad"
}
```

---

#### App Batch

Run a sequence of app_batch actions in one block.

Params:

**input**
- `steps` (json_value, required) - Array of {action, ...} steps.

**options**
- `defaultDelayMs` (integer, 0-60000, default `50`) - Delay between steps.
- `continueOnError` (boolean, default `false`) - Keep running steps after a failure.

**advanced**
- `defaultWaitTimeoutMs` (integer, 0-600000, default `5000`) - Default wait timeout.
- `defaultWaitIntervalMs` (integer, 1-60000, default `100`) - Default wait poll interval.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "defaultDelayMs": 50,
  "kind": "appBatch",
  "steps": [
    {
      "action": "activate",
      "title": "Notepad"
    },
    {
      "action": "type",
      "text": "Hello"
    }
  ]
}
```

---

#### App Click

Click at (x,y) or (xw,yw) on a target window.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `x` (integer) - Absolute screen X.
- `y` (integer) - Absolute screen Y.
- `xw` (integer) - Window-relative X (preferred).
- `yw` (integer) - Window-relative Y.

**options**
- `button` (string, default `"left"`) - left | right | middle.
- `count` (integer, 1-10, default `1`) - Click count (2 = double).

**advanced**
- `virtual` (boolean, default `false`) - PostMessage click; for background apps.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "button": "left",
  "count": 1,
  "kind": "appClick",
  "title": "Notepad",
  "xw": 100,
  "yw": 100
}
```

---

#### App Close

Send WM_CLOSE (or TerminateProcess with force=true).

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `pid` (integer) - Exact process id.
- `hwnd` (integer) - Exact window handle.
- `foreground` (boolean, default `false`) - Target the current foreground window.

**options**
- `force` (boolean, default `false`) - TerminateProcess instead of WM_CLOSE.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "force": false,
  "kind": "appClose",
  "title": "Notepad"
}
```

---

#### App Drag

Drag linear / polyline / arc with smooth pacing.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `x` (integer) - Start X (screen).
- `y` (integer) - Start Y (screen).
- `xw` (integer) - Start X (window-relative).
- `yw` (integer) - Start Y (window-relative).
- `toX` (integer) - End X (screen).
- `toY` (integer) - End Y (screen).
- `toXw` (integer) - End X (window-relative).
- `toYw` (integer) - End Y (window-relative).
- `dx` (integer) - Relative end X delta.
- `dy` (integer) - Relative end Y delta.
- `path` (json_value) - Polyline: [{x,y}|{xw,yw}, ...].
- `arc` (json_value) - {cx,cy,radius,startDeg,endDeg,segments}.

**options**
- `button` (string, default `"left"`) - left | right | middle.
- `durationMs` (integer, 0-30000, default `250`) - Drag duration.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "durationMs": 250,
  "kind": "appDrag",
  "title": "Notepad",
  "toXw": 300,
  "toYw": 200,
  "xw": 100,
  "yw": 100
}
```

---

#### App Hotkey

Send a key combination (e.g. ctrl+shift+t).

Params:

**input**
- `keys` (string, required, default `"ctrl+s"`) - Combo, e.g. ctrl+shift+t.
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `foreground` (boolean, default `false`) - Send to the foreground window.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "keys": "ctrl+s",
  "kind": "appHotkey",
  "title": "Notepad"
}
```

---

#### App Inspect Dump

Dump UI Automation tree of matching windows.

Params:

**input**
- `input` (screen_input, from PREVIOUS, default `""`) - Picker / screen spec (e.g. from a Picker block). Extracts hwnd and title; overrides the title/process fields when set.
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `foreground` (boolean, default `false`) - Dump the foreground window.

**options**
- `format` (enum, default `"md"`, enum: md|json) - Output format.
- `limit` (integer, 0-500000, default `0`) - Max elements per window. 0 = no limit.
- `filterToSelection` (boolean, default `false`) - When the input spec contains rrect= (sub-element pick), filter the output to elements whose center falls inside that rect. Off by default — rrect is used only to identify the window.

**advanced**
- `controls` (string, default `"all"`) - Control-type filter for markdown output. "all" = every element (full tree). Empty = smart default (invokable + menus + inputs). CSV of types to include, e.g. buttons,menus,editable.
- `textMaxChars` (integer, 0-1e+06, default `1200`) - Truncate element text in markdown output.
- `probeCells` (boolean, default `false`) - Probe grid / table cells (DataGrid, Table). Needed for spreadsheets like LibreOffice Calc or Excel to enumerate individual cells.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "format": "md",
  "input": "",
  "kind": "appInspectDump",
  "title": "Notepad"
}
```

---

#### App Inspect Find

Filter UIA elements by name/value/automationId/className.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `foreground` (boolean, default `false`) - Search the foreground window.
- `name` (string, default `""`) - Element name substring.
- `value` (string, default `""`) - Element value substring.
- `automationId` (string, default `""`) - AutomationId substring.
- `className` (string, default `""`) - ClassName substring.

**options**
- `nth` (integer, default `-1`) - Select the nth match (-1 = all).

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "appInspectFind",
  "name": "File",
  "title": "Notepad"
}
```

---

#### App Key

Press one key with optional modifiers and hold duration.

Params:

**input**
- `key` (string, required, default `"a"`) - Single key to press.
- `modifiers` (json_value) - Modifier list: ctrl/shift/alt/win.
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `foreground` (boolean, default `false`) - Send to the foreground window.

**options**
- `holdMs` (integer, 0-60000, default `0`) - Note-sustain for piano-style apps.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "holdMs": 100,
  "key": "a",
  "kind": "appKey"
}
```

---

#### App Mouse Move

Smoothly move the cursor (auto-paced) or teleport.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `x` (integer) - Absolute screen X.
- `y` (integer) - Absolute screen Y.
- `xw` (integer) - Window-relative X.
- `yw` (integer) - Window-relative Y.

**options**
- `smooth` (boolean, default `true`) - Smooth (auto-paced) move.
- `durationMs` (integer, default `-1`) - -1 = auto from distance, 0 = teleport.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "appMouseMove",
  "smooth": true,
  "title": "Notepad",
  "xw": 200,
  "yw": 200
}
```

---

#### App Open

Launch an executable and (optionally) wait for its window.

Params:

**input**
- `exe` (string, required, default `"notepad.exe"`) - Executable to launch.
- `args` (string, default `""`) - Command-line arguments.
- `cwd` (string, default `""`) - Working directory.

**options**
- `x` (integer) - Initial window X.
- `y` (integer) - Initial window Y.
- `width` (integer) - Initial window width.
- `height` (integer) - Initial window height.

**advanced**
- `waitMs` (integer, 0-120000, default `3000`) - Wait this long for the main window.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "exe": "notepad.exe",
  "kind": "appOpen",
  "waitMs": 3000
}
```

---

#### App Screenshot

Capture a window / element / explicit rect to a JPEG file.

Params:

**input**
- `outputPath` (output_path, required, default `"out/shot.jpg"`, constraints: writable+createParents) - JPEG output path.
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `foreground` (boolean, default `false`) - Capture the foreground window.

**options**
- `rect` (string, default `""`) - Optional 'x,y,w,h' screen rect.
- `elementIndex` (integer) - Capture a specific UIA element rect.
- `quality` (integer, 1-100, default `85`) - JPEG quality.
- `activate` (boolean, default `true`) - Activate the window before capture.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "appScreenshot",
  "outputPath": "out/shot.jpg",
  "quality": 85,
  "title": "Notepad"
}
```

---

#### App Scroll

Wheel scroll (vertical or horizontal) at an optional point.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `clicks` (integer, required, default `-3`) - Wheel clicks; positive = up/right.
- `x` (integer) - Pre-target cursor X (optional).
- `y` (integer) - Pre-target cursor Y (optional).
- `xw` (integer) - Pre-target cursor X (window-relative).
- `yw` (integer) - Pre-target cursor Y (window-relative).

**options**
- `axis` (string, default `"vertical"`) - vertical | horizontal.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "clicks": -3,
  "kind": "appScroll",
  "title": "Notepad"
}
```

---

#### App Type

Type a string into the activated window.

Params:

**input**
- `text` (string, required, default `"Hello"`) - Text to type.
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `foreground` (boolean, default `false`) - Type into the foreground window.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "appType",
  "text": "Hello",
  "title": "Notepad"
}
```

---

#### Clipboard Copy

Send Ctrl+C to the focused or targeted element, then return the clipboard content (text or file paths). No target selector = operates on the currently focused element.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `pid` (integer) - Exact process id.
- `hwnd` (integer) - Exact window handle.
- `foreground` (boolean, default `false`) - Target the current foreground window.
- `type` (enum, default `"text"`, enum: text|files) - Clipboard format to read back: text (CF_UNICODETEXT) or files (CF_HDROP).
- `trigger` (boolean, default `true`) - Send Ctrl+C to the target (or focused element) before reading. Set false to read clipboard without triggering a copy.

**options**
- `delayMs` (integer, 0-10000, default `80`) - Wait this long (ms) after Ctrl+C before reading the clipboard. Increase for slow apps.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "delayMs": 80,
  "kind": "clipboardCopy",
  "trigger": true,
  "type": "text"
}
```

---

#### Clipboard Paste

Write text or file paths to the clipboard, then send Ctrl+V to the focused or targeted element. No target selector = operates on the currently focused element.

Params:

**input**
- `title` (string, default `""`) - Window-title substring.
- `process` (string, default `""`) - Process-name substring.
- `pid` (integer) - Exact process id.
- `hwnd` (integer) - Exact window handle.
- `foreground` (boolean, default `false`) - Target the current foreground window.
- `type` (enum, default `"text"`, enum: text|files) - Clipboard format to write: text (CF_UNICODETEXT) or files (CF_HDROP).
- `text` (string, from PREVIOUS, default `""`) - Text to put on the clipboard before pasting (type=text). Uses PREVIOUS when blank. Leave empty to paste whatever is already on clipboard.
- `files` (json_value, default `[]`) - File paths to put on the clipboard before pasting (type=files). Leave empty to paste whatever is already on clipboard.
- `trigger` (boolean, default `true`) - Send Ctrl+V to the target (or focused element) after writing. Set false to only write to clipboard without triggering a paste.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "files": [],
  "kind": "clipboardPaste",
  "text": "",
  "trigger": true,
  "type": "text"
}
```

---

#### Picker

Interactive window / element picker with live highlight + stack HUD. Click to pick the highlighted region; Alt+wheel or [ ] cycles leaf → siblings → ∪siblings → parent; Shift+drag (or Ctrl+drag) selects a free rectangle; Z opens an 8× magnifier, C copies the sampled colour; ESC cancels. Default output is a screen spec for video/screenshot blocks; set format=md or format=html for Chrome DOM via the Tanit extension. format=selection captures the current focused selection (UIA first, Chrome extension fallback) without an interactive click. format=foreground returns JSON for the last focused window (title, hwnd, cursor parent HWND) — remembers the previous app when Tanit is in front. Sampled colour and Chrome DOM selectors always ride along in the payload.

Params:

**options**
- `format` (enum, default `"screen"`, enum: screen|md|html|text|color|selector|measure|selection|foreground) - Result format. screen = capture spec; md/html = in-app or Chrome DOM; text = plain speakable string (DOM innerText / UIA); selection = current focused selection (UIA TextPattern, then Chrome extension); foreground = last focused window JSON (title, hwnd, cursor parent, Chrome css/xpath when chromeDom); color = eyedropper; selector = CSS; measure = boundary-snapped point-to-point line.
- `chromeDom` (boolean, default `true`) - Chrome / in-app browser: resolve DOM/selectors in the committed payload, and for format=selection fall back to the extension after UIA. Off = UIA/HWND only.
- `scope` (enum, default `"auto"`, enum: auto|element|document) - DOM extract target. element = only the leaf (fail on miss). document = always dump documentSelector. auto = leaf, then document on miss / page-edge / ancestor pick.
- `documentSelector` (enum, default `"html"`, enum: html|body|main) - Root used for scope=document and auto fallback. body/main omit leftover <head> in format=html.
- `highlight` (boolean, default `true`) - Show the translucent highlight overlay while picking.
- `hud` (boolean, default `true`) - Show the informational picker HUD. Off keeps rectangle highlighting.
- `resolveUia` (boolean, default `true`) - Resolve UIA after the cursor settles and on commit (gives sub-window precision for web content, media players, etc.).
- `showHidden` (boolean, default `true`) - Consider non-visible child windows (needed to reach Chrome_RenderWidgetHostHWND etc.).
- `siblings` (boolean, default `true`) - Include sibling panes and ∪siblings union in the Alt+wheel / [ ] stack (leaf → siblings → parent). Off = ancestors only.
- `sampleColor` (boolean, default `false`) - Region picks only: add colorHex/rgb to the payload (sampled once at click). For eyedropper use format=color instead.
- `magnifier` (boolean, default `false`) - Region/measure picks: open the 8× loupe (Z toggles).

**capture_options**
- `includeOpenWindows` (boolean, default `true`) - When the pick is a monitor/desktop: capture open apps on that display (screen:N:layer=monitor). Off = wallpaper only (hwnd=Progman/WorkerW PrintWindow).
- `timeoutMs` (integer, 1000-600000, default `60000`) - Abort the pick and return an error after this many milliseconds of inactivity. Default 60 s.

**advanced**
- `onDomFail` (enum, default `"error"`, enum: error|text|screen) - When format is md/html/selector and DOM inspect fails: error = exit 1 (default); text = UIA spoken text; screen = capture spec.
- `chromePreview` (boolean, default `false`) - Show live Chrome CSS details in the HUD after the cursor settles. Uses blocking extension IPC and may feel slow on some machines.
- `colorMagnifier` (boolean, default `true`) - Color picks: show the live 8× loupe. Disable on slow software GDI/DWM machines; pixel sampling still works.
- `textMaxChars` (integer, 0-262144, default `0`) - Chrome DOM plain-text cap (innerText/speakText). 0 = unlimited (default). Set e.g. 8192 to truncate long articles.
- `htmlMaxChars` (integer, 0-3.35544e+07, default `8388608`) - Cap cleaned HTML (format=html and the html field used for md). 0 = unlimited. Default 8 MiB (probe default).
- `markdownMaxChars` (integer, 0-3.35544e+07, default `2097152`) - Cap markdown after conversion (format=md). 0 = unlimited. Default 2 MiB (probe default).

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "chromeDom": true,
  "chromePreview": false,
  "colorMagnifier": true,
  "documentSelector": "html",
  "format": "screen",
  "highlight": true,
  "htmlMaxChars": 8388608,
  "hud": true,
  "includeOpenWindows": true,
  "kind": "picker",
  "magnifier": false,
  "markdownMaxChars": 2097152,
  "onDomFail": "error",
  "resolveUia": true,
  "sampleColor": false,
  "scope": "auto",
  "showHidden": true,
  "siblings": true,
  "textMaxChars": 0,
  "timeoutMs": 60000
}
```

### Audio

#### Filter Audio

Enhance a recorded audio file. Default filter is DeepFilterNet (48 kHz). GTCRN is reserved. Stores the output WAV path in PREVIOUS / storeAs.

Params:

**input**
- `input` (audio_path, from PREVIOUS, default `""`) - Source audio (wav, mp3, …). Default: empty → PREVIOUS chain value.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Destination WAV. Default: empty → <stem>-filtered.wav next to the source.

**filter**
- `filter` (enum, default `"deepfilter"`, enum: deepfilter|gtcrn) - Enhancer. deepfilter = DeepFilterNet @ 48 kHz. gtcrn = reserved (16 kHz).
- `model` (string, default `""`) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter then exe/../models.
- `attenLim` (float, 0-100, default `100.0`) - Attenuation limit in dB (in-process libDF only). Default: 100.
- `postFilter` (boolean, default `false`) - Over-attenuate very noisy sections. Default: false.
- `compensateDelay` (boolean, default `true`) - Compensate STFT / model lookahead. Default: true.

**output**
- `storeAs` (string, default `"audioPath"`) - Variable for PREVIOUS / downstream blocks. Default: audioPath.

Features: cancellable

Default block:

```json
{
  "attenLim": 100.0,
  "compensateDelay": true,
  "filter": "deepfilter",
  "input": "",
  "kind": "audioFilter",
  "model": "",
  "outputPath": "",
  "postFilter": false,
  "storeAs": "audioPath"
}
```

---

#### List Audio Devices

List microphone and desktop/loopback capture devices.

Params:

- `storeAs` (string, default `"audioDevices"`) - Variable for PREVIOUS / downstream blocks. Default: audioDevices.

Features: non-blocking

Default block:

```json
{
  "kind": "audioListDevices",
  "storeAs": "audioDevices"
}
```

---

#### Unload Model

List or unload loaded local model instances for this xBlox process.

Params:

**lifecycle**
- `action` (enum, default `"List"`, enum: List|Unload) - List loaded models in this xBlox process, or unload one by key.
- `key` (string, default `"vibevoice:tts"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (string, default `"modelKey"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "action": "Unload",
  "key": "vibevoice:tts",
  "kind": "audioModelControl",
  "storeAs": "modelKey"
}
```

---

#### Play Audio

Play an audio file (MP3, WAV, or FLAC). Uses PREVIOUS as the file path when path is empty.

Params:

**input**
- `path` (audio_path, from PREVIOUS, default `""`) - Audio file to play. Default: empty → PREVIOUS chain value.

**device**
- `outputDevice` (device_name, default `""`) - Playback device. Default: empty → App Settings audio_output_device, then system default.

**output**
- `storeAs` (string, default `""`) - Optional variable for PREVIOUS. Default: empty (PREVIOUS only).

Features: cancellable

Default block:

```json
{
  "kind": "audioPlay",
  "outputDevice": "",
  "path": "",
  "storeAs": ""
}
```

---

#### Record Audio

Record mic, desktop, or mixed audio to a file. outputPath extension selects format: .wav = PCM (48 kHz stereo default; long takes spill PCM to disk after ~30 s in RAM); .m4a or .aac = AAC-LC (Windows only). Optional filter runs after capture (DeepFilterNet → 48 kHz mono WAV; not on the callback). Stores the output path in PREVIOUS / storeAs.

Params:

**source**
- `inputSource` (enum, default `"mic"`, enum: mic|desktop|mix) - Capture source. Default: mic (microphone). desktop = system loopback; mix = mic + desktop.
- `device` (device_name, default `""`) - Mic device for mic/mix. Default: empty → App Settings audio_input_device, then system default.
- `desktopDevice` (string, default `""`) - Loopback device substring for desktop/mix. Default: empty → default render device.
- `micGain` (float, 0-4, default `1.0`) - Mic level multiplier (linear) for mix. Default: 1.0.
- `desktopGain` (float, 0-4, default `1.0`) - Desktop level multiplier for desktop/mix. Default: 1.0.
- `sampleRate` (integer, 0-192000, default `0`) - Sample rate Hz (0 = default 48000). AAC (.m4a) on Windows is encoded at 48000 Hz (resampled if needed).
- `channels` (integer, 0-2, default `0`) - Channels: 0 = default stereo, 1 = mono, 2 = stereo. Applies to .wav and .m4a/.aac.

**input**
- `durationMs` (duration_ms, required, 100-3.6e+06, default `3000`) - Recording duration in milliseconds. Default: 3000.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path; extension selects format. .wav = PCM WAV; .m4a or .aac = AAC-LC (Windows only). Default: empty → temporary .wav in the system temp directory. filter requires .wav.

**filter**
- `filter` (enum, default `"off"`, enum: off|deepfilter|gtcrn) - Enhance after capture. off = dry file. deepfilter = DeepFilterNet @ 48 kHz mono. gtcrn = reserved.
- `filterModel` (string, default `""`) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter.
- `attenLim` (float, 0-100, default `100.0`) - Attenuation limit in dB (in-process libDF only). Default: 100.
- `postFilter` (boolean, default `false`) - Over-attenuate very noisy sections. Implies deepfilter when filter is off.
- `compensateDelay` (boolean, default `true`) - Compensate STFT / model lookahead. Default: true.

**hud**
- `hud` (boolean, default `false`) - Show the movable overlay HUD while recording. Stop ends the take early. Default off.

**output**
- `storeAs` (string, default `"audioPath"`) - Variable for PREVIOUS / downstream blocks. Default: audioPath.

Features: cancellable

Default block:

```json
{
  "attenLim": 100.0,
  "channels": 0,
  "compensateDelay": true,
  "desktopDevice": "",
  "desktopGain": 1.0,
  "device": "",
  "durationMs": 3000,
  "filter": "off",
  "filterModel": "",
  "hud": false,
  "inputSource": "mic",
  "kind": "audioRecord",
  "micGain": 1.0,
  "outputPath": "",
  "postFilter": false,
  "sampleRate": 0,
  "storeAs": "audioPath"
}
```

##### Examples

**Timed mic → WAV** (default 48 kHz stereo; spills after ~30 s for longer takes)

```json
{
  "kind": "audioRecord",
  "inputSource": "mic",
  "durationMs": 10000,
  "outputPath": "${KNOWNFOLDER:Desktop}/note.wav",
  "storeAs": "audioPath"
}
```

**Desktop loopback → M4A** (Windows only)

```json
{
  "kind": "audioRecord",
  "inputSource": "desktop",
  "durationMs": 60000,
  "outputPath": "${KNOWNFOLDER:Desktop}/desktop_clip.m4a",
  "storeAs": "audioPath"
}
```

**Mix with gain**

```json
{
  "kind": "audioRecord",
  "inputSource": "mix",
  "micGain": 0.9,
  "desktopGain": 1.0,
  "durationMs": 30000,
  "outputPath": "call.wav"
}
```

**Start / stop session** (non-blocking; finalize on stop)

```json
{ "kind": "audioRecordStart", "inputSource": "desktop", "outputPath": "session.m4a", "storeAs": "recordSession" }
```

```json
{ "kind": "audioRecordStop", "session": "${recordSession}", "outputPath": "session.m4a", "storeAs": "audioPath" }
```

Block outputs include `peakDbfs`, `rmsDbfs`, `clippedSamples`, and `format` (`aac/m4a` or PCM string).

**Example flow**

```xblox
{
  "document": {
    "context": {},
    "roots": [
      {
        "kind": "stdout",
        "message": "Recording 5 s of desktop audio to M4A (Windows) or use .wav on other platforms."
      },
      {
        "durationMs": 5000,
        "inputSource": "desktop",
        "kind": "audioRecord",
        "outputPath": "${KNOWNFOLDER:Desktop}/xblox_desktop_clip.m4a",
        "storeAs": "audioPath"
      },
      {
        "kind": "stdout",
        "message": "Saved: ${audioPath}"
      }
    ],
    "version": 1
  },
  "options": {
    "autoHeight": true,
    "defaultExpandedDepth": 3,
    "editable": false,
    "hasLog": true,
    "hasProps": true,
    "hasRunLog": true,
    "showHelp": true,
    "showLog": true,
    "showPalette": false,
    "showProps": false,
    "showRunLog": false,
    "showToolbar": true
  }
}
```

---

#### Start Recording

Start a mic/desktop/mix recording session and store its session id. Optional outputPath (.wav or .m4a/.aac) may be set here or on audioRecordStop.

Params:

**source**
- `inputSource` (enum, default `"mic"`, enum: mic|desktop|mix) - Capture source. Default: mic (microphone). desktop = system loopback; mix = mic + desktop.
- `device` (device_name, default `""`) - Mic device for mic/mix. Default: empty → App Settings audio_input_device, then system default.
- `desktopDevice` (string, default `""`) - Loopback device substring for desktop/mix. Default: empty → default render device.
- `micGain` (float, 0-4, default `1.0`) - Mic level multiplier (linear) for mix. Default: 1.0.
- `desktopGain` (float, 0-4, default `1.0`) - Desktop level multiplier for desktop/mix. Default: 1.0.
- `sampleRate` (integer, 0-192000, default `0`) - Sample rate Hz (0 = default 48000). AAC (.m4a) on Windows is encoded at 48000 Hz (resampled if needed).
- `channels` (integer, 0-2, default `0`) - Channels: 0 = default stereo, 1 = mono, 2 = stereo. Applies to .wav and .m4a/.aac.

**input**
- `session` (string, default `""`) - Recording session id. Default: empty → auto-generated unique id.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path; extension selects .wav vs .m4a/.aac (see audioRecord). Default: empty → temporary .wav at start; audioRecordStop outputPath overrides.

**output**
- `storeAs` (string, default `"recordSession"`) - Variable for PREVIOUS / downstream blocks. Default: recordSession.

Features: cancellable non-blocking

Default block:

```json
{
  "desktopDevice": "",
  "desktopGain": 1.0,
  "device": "",
  "inputSource": "mic",
  "kind": "audioRecordStart",
  "micGain": 1.0,
  "outputPath": "",
  "session": "",
  "storeAs": "recordSession"
}
```

##### Examples

Non-blocking session — pair with `audioRecordStop`. Set `outputPath` here or on stop (extension selects `.wav` vs `.m4a`).

```json
{
  "kind": "audioRecordStart",
  "inputSource": "desktop",
  "outputPath": "${KNOWNFOLDER:Desktop}/session.m4a",
  "storeAs": "recordSession"
}
```

See the **Record Audio** block overlays for format and spill notes.

---

#### Stop Recording

Stop a recording session and finalize the output file (.wav or .m4a/.aac by extension).

Params:

**input**
- `session` (string, required, default `""`) - Session id from audioRecordStart. Default: empty (required at runtime).

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path; extension selects .wav vs .m4a/.aac (see audioRecord). Default: empty → path from audioRecordStart, or temporary .wav.

**output**
- `storeAs` (string, default `"audioPath"`) - Variable for PREVIOUS / downstream blocks. Default: audioPath.

Features: cancellable

Default block:

```json
{
  "kind": "audioRecordStop",
  "outputPath": "",
  "session": "",
  "storeAs": "audioPath"
}
```

##### Examples

```json
{
  "kind": "audioRecordStop",
  "session": "${recordSession}",
  "outputPath": "${KNOWNFOLDER:Desktop}/session.m4a",
  "storeAs": "audioPath"
}
```

Finalizes AAC on Windows or WAV elsewhere. `outputPath` overrides the path from `audioRecordStart` when set.

---

#### Text to Speech

Convert text to speech via the configured TTS provider and play it through the speakers. Supports Tanit, ElevenLabs, local VibeVoice, and MOSS-TTS-Nano builds. Uses PREVIOUS string as text when text is empty. Markdown/plain-text pre-parsers run on file paths and on inline/PREVIOUS content (e.g. fsRead → audioSpeak). hud=true shows the overlay pill while synthesizing and playing. Stores output file path in PREVIOUS / storeAs when outputPath is set, otherwise stores the input text.

Params:

**input**
- `text` (prompt, from PREVIOUS, default `""`) - Text to speak, or path to a text file (.txt, .md, …). Files are loaded (binary rejected); inline/PREVIOUS markdown is preparsed when detected. Chain fsRead → audioSpeak with empty text to speak file contents. Default: empty → PREVIOUS string (required at runtime).

**voice_model**
- `provider` (string, default `""`) - TTS provider override. Default: empty → App Settings tts_provider (required).
- `model` (string, default `""`, resolve: variables+deep) - TTS model override. Default: empty → App Settings tts_model; pixlwiz → pixlwiz-speech when unset. moss → moss-tts-nano GGUF bundle.
- `voice` (string, default `""`) - Voice id / UUID / GGUF path. Default: empty → App Settings tts_voice_id.

**local_tts**
- `tokenizer` (string, default `""`) - Tokenizer GGUF path. Required for VibeVoice; MOSS defaults to models/moss-tts-nano/moss-nano-tokenizer.gguf.
- `codec` (string, default `""`) - MOSS Audio Tokenizer Nano GGUF. Default: empty → models/moss-tts-nano/moss-audio-tokenizer-nano.gguf.
- `refAudio` (string, default `""`) - Reference WAV for VibeVoice 1.5B or MOSS Nano cloning. Default: empty.
- `instance` (string, default `""`) - Named cached local TTS engine instance. Default: empty → auto-key by model args.

**device**
- `outputDevice` (device_name, default `""`) - Playback device. Default: empty → App Settings audio_output_device, then system default.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Optional synthesized audio path (.wav). Default: empty → play only, no file saved.

**hud**
- `hud` (boolean, default `false`) - Show the overlay HUD while synthesizing and playing. Default off.

**elevenlabs**
- `sendVoiceSettings` (boolean, default `true`) - ElevenLabs direct only: send voice_settings (stability/similarity/style). Default: true.
- `chunkSentences` (boolean, default `true`) - ElevenLabs direct only: split long text with request stitching. Default: true.
- `chunkTargetChars` (integer, 100-800, default `400`) - ElevenLabs direct only: greedy-merge sentences up to this many chars. Default: 400.
- `chunkMaxChars` (integer, 200-2000, default `800`) - ElevenLabs direct only: hard-split a single long sentence. Default: 800.
- `stability` (float, 0-1, default `0.9`) - ElevenLabs direct only: stability (0–1). Default: 0.9.
- `similarityBoost` (float, 0-1, default `0.75`) - ElevenLabs direct only: similarity_boost (0–1). Default: 0.75.
- `style` (float, 0-1, default `0.0`) - ElevenLabs direct only: style (0–1). Default: 0 (non-zero can add drift/noise).

**output**
- `storeAs` (string, default `""`) - Optional variable for PREVIOUS. Default: empty (PREVIOUS only).

Features: cancellable

Default block:

```json
{
  "chunkMaxChars": 800,
  "chunkSentences": true,
  "chunkTargetChars": 400,
  "codec": "",
  "hud": false,
  "instance": "",
  "kind": "audioSpeak",
  "model": "",
  "outputDevice": "",
  "outputPath": "",
  "provider": "",
  "refAudio": "",
  "sendVoiceSettings": true,
  "similarityBoost": 0.75,
  "stability": 0.9,
  "storeAs": "",
  "style": 0.0,
  "text": "",
  "tokenizer": "",
  "voice": ""
}
```

---

#### Speech to Text

Transcribe an audio file, or record mic / desktop / mix and transcribe speech to text. When 'input' is an existing audio file, it is transcribed directly (no capture, no duration limit). When empty or not a real file (including PREVIOUS text from a prior block), records from inputSource (mic, desktop loopback, or mix) for up to maxDurationMs ms with optional VAD silence-gate. Prefers local Whisper when selected/available, with Tanit as a provider-backed fallback. mode=transcribe (or hud=true) shows the recording HUD (levels + stop) and the overlay pill; ElevenLabs streams live, Whisper/Tanit transcribe after the take. Stores the transcript string in PREVIOUS / storeAs, or a structured STT payload when json is on.

Params:

**input**
- `input` (audio_path, from PREVIOUS, default `""`) - Input audio file (wav, mp3, …). Default: empty → PREVIOUS when it is an existing file, otherwise live capture.

**hud**
- `mode` (enum, default `"off"`, enum: off|transcribe) - HUD preset. transcribe = level pill + overlay. off = no HUD unless hud is on.
- `hud` (boolean, default `false`) - Show the recording HUD (levels + stop) and the overlay pill. Implied when mode=transcribe. Default off.

**source**
- `inputSource` (enum, default `"mic"`, enum: mic|desktop|mix) - Live capture source when input is not a file. mic = microphone; desktop = system loopback; mix = mic + desktop. Same as audioRecord / video audioSource.
- `device` (device_name, default `""`) - Mic device for mic/mix. Default: empty → App Settings audio_input_device, then system default. Ignored when input is an existing file.
- `desktopDevice` (string, default `""`) - Loopback device substring for desktop/mix. Default: empty → default render device. Ignored when input is an existing file.
- `micGain` (float, 0-4, default `1.0`) - Mic level multiplier (linear) for mic/mix. Default: 1.0.
- `desktopGain` (float, 0-4, default `1.0`) - Desktop/loopback level multiplier for desktop/mix. Default: 1.0.

**recording**
- `maxDurationMs` (duration_ms, 500-120000, default `30000`) - Max live capture duration (ms). Default: 30000. Ignored when input is an existing file.
- `silenceMs` (duration_ms, 0-60000, default `1500`) - VAD silence stop (ms) after speech. Default: 1500. 0 = disabled. Ignored when input is an existing file.

**speech_model**
- `stt` (stt_route, default `{}`) - Dictation STT route {preset,provider,model,options}. Empty {} inherits App Settings. Flat provider/model remain aliases.
- `provider` (string, default `""`) - STT provider override (alias of stt.provider). Default: empty → App Settings stt_provider (required).
- `model` (string, default `""`, resolve: variables+deep) - STT model override (alias of stt.model). Default: empty → App Settings stt_model when provider matches; whisper → base.en (fallback; prefer large-v3-turbo when installed); pixlwiz → pixlwiz-speech-to-text.
- `providerOptions` (json_value, default `{}`) - Whisper-only options object (alias of stt.options). Defaults: backend=cpu, language=auto, threads=0 (auto), flashAttn=auto. Whisper models resolve under ${MODELS_DIR} then exe/../models.

**advanced**
- `apiKey` (api_key, default `""`) - API key override. Default: empty → App Settings providers map (not used for whisper).

**output**
- `json` (boolean, default `false`) - Return structured STT JSON vs transcript string. Includes segments when available. Default: false.
- `subtitleFormat` (enum, default `"none"`, enum: none|srt|vtt|sbv|all) - Write YouTube-accepted sidecar(s) next to the audio (or subtitlePath).
- `subtitlePath` (output_path, default `""`, constraints: writable+createParents) - Sidecar stem. Default: empty → next to the source/WAV.
- `subtitleMaxChars` (integer, 8-120, default `42`) - Cue wrap width.
- `subtitleMaxLines` (integer, 1-4, default `2`) - Cue wrap line count.
- `result` (json_value) - Structured STT payload when json=true: provider, model, transcript, segments, duration, samples, optional wav/subtitlePath.
- `storeAs` (string, default `"transcript"`) - Variable for PREVIOUS / downstream blocks. Default: transcript.

**debug_output**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Save captured WAV. Default: empty → temp file deleted after transcription.

Features: cancellable

Default block:

```json
{
  "desktopDevice": "",
  "desktopGain": 1.0,
  "device": "",
  "hud": false,
  "input": "",
  "inputSource": "mic",
  "json": false,
  "kind": "audioTranscribe",
  "maxDurationMs": 30000,
  "micGain": 1.0,
  "mode": "off",
  "model": "",
  "outputPath": "",
  "provider": "",
  "providerOptions": {},
  "silenceMs": 1500,
  "storeAs": "transcript",
  "stt": {},
  "subtitleFormat": "none",
  "subtitleMaxChars": 42,
  "subtitleMaxLines": 2,
  "subtitlePath": ""
}
```

---

#### TTS Scripted

Place scripted TTS from an SRT/VTT file or transcribe JSON onto a 48 kHz PCM timeline. Merges cues with a punctuation-aware score, then resolves overflow with gap, mild stretch, and optional ElevenLabs speed regeneration. Does not play audio (use audioPlay).

Params:

**input**
- `input` (file_path, from PREVIOUS, default `""`) - SRT/VTT/JSON path, or PREVIOUS transcribe JSON. Default: empty → PREVIOUS.

**output_file**
- `outputPath` (output_path, required, default `""`, constraints: writable+createParents) - Canonical 48 kHz mono PCM WAV. Required.

**voice_model**
- `provider` (string, default `""`) - TTS provider. Default: empty → App Settings tts_provider.
- `model` (string, default `""`, resolve: variables+deep) - TTS model. Default: empty → App Settings.
- `voice` (string, default `""`) - Voice id. Default: empty → App Settings tts_voice_id.

**timeline**
- `overflow` (enum, default `"resolve"`, enum: resolve|truncate) - resolve = gap → stretch ≲12% → speed regen ≤1.2 → overlap+warn. truncate = hard-cut (power user).
- `maxStretchPercent` (float, 0-25, default `12.0`) - Max DSP time-compress percent before regeneration. Default: 12.
- `minGapMs` (duration_ms, 0-500, default `80`) - Minimum inter-utterance silence. Default: 80.
- `maxUtteranceMs` (duration_ms, 500-25000, default `8000`) - Do not merge cues past this estimated duration. Default: 8000.

**elevenlabs**
- `speed` (float, 0.7-1.2, default `1.0`) - Initial ElevenLabs speed (0.7–1.2). Default: 1.0.
- `seed` (integer, default `-1`) - Best-effort seed. Default: -1 → derived from text+voice.
- `alignment` (boolean, default `false`) - Reserved: character alignment. V1 places from PCM duration only.
- `sendVoiceSettings` (boolean, default `true`) - Send voice_settings. Default: true.
- `stability` (float, 0-1, default `0.45`) - Lower is more expressive (chat TTS uses 0.9, which sounds flat on short cues). Default: 0.45.
- `similarityBoost` (float, 0-1, default `0.8`) - Stay on-voice. Default: 0.80.
- `style` (float, 0-1, default `0.2`) - Light style exaggeration for narration. Default: 0.20. High values can add artifacts.
- `speakerBoost` (boolean, default `true`) - ElevenLabs use_speaker_boost. Default: true.
- `textNormalization` (enum, default `"auto"`, enum: auto|on|off) - apply_text_normalization. Default: auto.

**output**
- `cacheDir` (string, default `""`) - Take cache directory. Default: empty → <output>/.voiceover-cache.
- `json` (boolean, default `false`) - Return overflow-report JSON instead of the WAV path.
- `storeAs` (string, default `"voiceoverPath"`) - Variable for PREVIOUS. Default: voiceoverPath.

**hud**
- `hud` (boolean, default `false`) - Show overlay HUD while generating. Default off.

Features: cancellable

Default block:

```json
{
  "alignment": false,
  "hud": false,
  "input": "",
  "json": false,
  "kind": "audioTtsScripted",
  "maxStretchPercent": 12.0,
  "maxUtteranceMs": 8000,
  "minGapMs": 80,
  "model": "",
  "outputPath": "",
  "overflow": "resolve",
  "provider": "",
  "seed": -1,
  "sendVoiceSettings": true,
  "similarityBoost": 0.8,
  "speakerBoost": true,
  "speed": 1.0,
  "stability": 0.45,
  "storeAs": "voiceoverPath",
  "style": 0.2,
  "textNormalization": "auto",
  "voice": ""
}
```

##### Examples

**SRT → 48 kHz voice-over WAV** (provider / voice from App Settings when omitted)

```json
{
  "kind": "audioTtsScripted",
  "input": "captions.srt",
  "outputPath": "voiceover.wav",
  "storeAs": "voiceoverPath"
}
```

**Pin ElevenLabs narration voice**

```json
{
  "kind": "audioTtsScripted",
  "input": "captions.srt",
  "outputPath": "voiceover.wav",
  "provider": "elevenlabs",
  "model": "eleven_multilingual_v2",
  "voice": "tLK6fPv15M0oKv4V3ACR",
  "overflow": "resolve",
  "stability": 0.45,
  "style": 0.2,
  "storeAs": "voiceoverPath"
}
```

`input` may be an SRT/VTT path or transcribe JSON (`segments`). Output is
always 48 kHz mono PCM. A `{stem}.voiceover.json` report is written next to
the WAV. Does not play; chain `audioPlay` if you want speakers.

---

#### Voice Listen

Voice Command Center: named Still / Start / Stop listen loop. On a wake+phrase match, child items run with PREVIOUS = pm.voice.trigger/v1 (text, raw_text, intent.commandId). Multiple instances can run in parallel. Replay injects text without a microphone.

Params:

**mode**
- `action` (enum, default `"Start"`, enum: Still|Start|Stop|Status|Replay) - Still = one match then stop (or wait on a running instance). Start keeps a named instance; with child items it runs them on each match until Stop. Stop / Status address the same instance. Replay injects text (no mic).
- `instance` (string, default `"default"`) - Named listen instance. Use the same name for Stop / Status / a later Still.
- `durationMs` (duration_ms, 0-8.64e+07, default `0`) - Still / Start-with-children: stop waiting after this many ms. 0 = until Stop or cancel.

**matcher**
- `phrase` (string, default `""`) - Optional spoken phrase or catalog id to accept. Empty = any wake+command. On match, child items run with PREVIOUS = the trigger envelope.
- `wakePhrase` (string, default `"Tanit"`) - Wake prefix. Default: Tanit (or Audio & Video voice_commands).
- `route` (enum, default `"trigger"`, enum: trigger) - XBlox mapping uses trigger. Children replace catalog dispatch unless dispatch is on.
- `dispatch` (boolean, default `false`) - Also run the catalog command (hotkey / app_cmd) on a match. Default off — children are the mapping.

**replay**
- `text` (string, default `""`) - Replay only: full utterance including the wake word, e.g. "Tanit screenshot".

**source**
- `inputSource` (enum, default `"mic"`, enum: mic|desktop|mix) - Capture source. Default: mic (microphone). desktop = system loopback; mix = mic + desktop.
- `device` (device_name, default `""`) - Mic device for mic/mix. Default: empty → voice_commands.audio_input_device, then App Settings audio_input_device.
- `desktopDevice` (device_name, default `""`) - Loopback device for desktop/mix. Default: empty → default render device.
- `micGain` (float, 0-4, default `1.0`) - Mic level multiplier (linear) for mic/mix. Default: 1.0.
- `desktopGain` (float, 0-4, default `1.0`) - Desktop level multiplier for desktop/mix. Default: 1.0.

**filter**
- `filter` (enum, default `"auto"`, enum: auto|off|deepfilter|gtcrn) - Enhance after VAD. auto = DeepFilter when available. off = dry/APM. deepfilter / gtcrn are strict.
- `filterModel` (string, default `""`) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter.
- `postFilter` (boolean, default `false`) - Over-attenuate very noisy sections (DeepFilter). Default: false.
- `filterBlend` (float, 0-1, default `1.0`) - Wet/dry mix after enhancement. 0 = original, 1 = full filter (default).

**speech_model**
- `provider` (string, default `""`) - STT provider override. Default: empty → App Settings stt_provider.
- `model` (string, default `""`, resolve: variables+deep) - STT model override. Default: empty → App Settings stt_model when provider matches.
- `language` (string, default `"auto"`) - Whisper language (auto, en, de, …). Default: auto.

**output**
- `storeAs` (string, default `"voice"`) - Variable for PREVIOUS / downstream blocks. Default: voice.

Features: container cancellable

Children:
- **items** (On Match, role: body)

Default block:

```json
{
  "action": "Start",
  "desktopDevice": "",
  "desktopGain": 1.0,
  "device": "",
  "dispatch": false,
  "durationMs": 0,
  "filter": "auto",
  "filterBlend": 1.0,
  "filterModel": "",
  "inputSource": "mic",
  "instance": "default",
  "items": [],
  "kind": "voiceListen",
  "language": "auto",
  "micGain": 1.0,
  "model": "",
  "phrase": "",
  "postFilter": false,
  "provider": "",
  "route": "trigger",
  "storeAs": "voice",
  "text": "",
  "wakePhrase": "Tanit"
}
```

### Bluetooth

#### Bluetooth Connect

Connect a Bluetooth audio device (pairs if needed) and implicitly route audio to it. Uses PREVIOUS as the device id/name when 'id' is empty. Stores {ok,target,routed_to} in PREVIOUS / storeAs.

Params:

**input**
- `id` (string, from PREVIOUS, default `""`) - Device address (AA:BB:CC:DD:EE:FF) or name substring. Empty = use PREVIOUS.

**advanced**
- `autoRoute` (boolean, default `true`) - After connecting, set the device's audio endpoint as the default playback device.
- `timeoutMs` (duration_ms, 0-60000, default `6000`) - How long to wait (ms) for the audio endpoint to go ACTIVE.
- `delayMs` (duration_ms, 0-30000, default `0`) - Extra delay (ms) after connecting before the block returns. Use for AV receivers that need time to switch inputs or unmute (0 = none).

**output**
- `storeAs` (string, default `"bluetooth"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "autoRoute": true,
  "delayMs": 0,
  "id": "",
  "kind": "bluetoothConnect",
  "storeAs": "bluetooth",
  "timeoutMs": 6000
}
```

---

#### Bluetooth Disconnect

Disconnect a Bluetooth audio device (best-effort). Uses PREVIOUS when 'id' is empty.

Params:

**input**
- `id` (string, from PREVIOUS, default `""`) - Device address or name substring. Empty = use PREVIOUS.

**output**
- `storeAs` (string, default `"bluetooth"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "id": "",
  "kind": "bluetoothDisconnect",
  "storeAs": "bluetooth"
}
```

---

#### Audio Endpoints

List MMDevice audio endpoints (playback by default). Stores an array of {id,name,default,is_bluetooth,state,active,...} in PREVIOUS / storeAs. Set includeDisconnected to also list Bluetooth devices that are paired but not yet connected.

Params:

**advanced**
- `capture` (boolean, default `false`) - List recording (capture) endpoints instead of playback.
- `includeDisconnected` (boolean, default `false`) - Also include UNPLUGGED endpoints (paired Bluetooth devices not yet connected).

**output**
- `storeAs` (string, default `"audioEndpoints"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable pure non-blocking

Children:
- **items** (For each, role: body)

Default block:

```json
{
  "capture": false,
  "includeDisconnected": false,
  "kind": "bluetoothEndpoints",
  "storeAs": "audioEndpoints"
}
```

---

#### Bluetooth Devices

List paired / connected Bluetooth devices. Stores an array of {id,name,address,paired,connected,is_audio_device,...} in PREVIOUS / storeAs. Set autoRoute to implicitly switch the default playback endpoint to a connected audio device.

Params:

**advanced**
- `nearby` (boolean, default `false`) - Also issue an inquiry for nearby discoverable devices (slow).
- `autoRoute` (boolean, default `false`) - Implicitly route audio output to a connected Bluetooth audio device.

**output**
- `storeAs` (string, default `"bluetoothDevices"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable non-blocking

Children:
- **items** (For each, role: body)

Default block:

```json
{
  "autoRoute": false,
  "kind": "bluetoothListDevices",
  "nearby": false,
  "storeAs": "bluetoothDevices"
}
```

##### Examples

```sh
tanit-cli xblox run --src flow.xblox
```

List paired Bluetooth devices inside a flow using the `bluetoothListDevices` block.

**Example flow**

```xblox
{
  "document": {
    "context": {
      "bluetooth": {
        "ok": true,
        "target": "bose"
      },
      "bluetoothDevices": [
        {
          "address": "CC:C5:0A:83:03:47",
          "can_pair": false,
          "connected": false,
          "device_class": "Audio/Video",
          "id": "CC:C5:0A:83:03:47",
          "is_audio_device": true,
          "name": "Voombox-outdoor",
          "paired": true
        },
        {
          "address": "C4:30:18:11:1A:F3",
          "can_pair": false,
          "connected": false,
          "device_class": "Audio/Video",
          "id": "C4:30:18:11:1A:F3",
          "is_audio_device": true,
          "name": "RX-V383 Yamaha ",
          "paired": true
        },
        {
          "address": "78:2B:64:13:D8:A5",
          "can_pair": false,
          "connected": true,
          "device_class": "Audio/Video",
          "id": "78:2B:64:13:D8:A5",
          "is_audio_device": true,
          "name": "Bose NC 700 HP",
          "paired": true
        }
      ]
    },
    "loop": {
      "enabled": false,
      "intervalMs": 5000,
      "reset": true
    },
    "roots": [
      {
        "autoRoute": false,
        "items": [
          {
            "kind": "log",
            "level": "info",
            "message": "PREVIOUS"
          }
        ],
        "kind": "bluetoothListDevices",
        "nearby": false,
        "storeAs": "bluetoothDevices"
      },
      {
        "autoRoute": true,
        "id": "bose",
        "kind": "bluetoothConnect",
        "storeAs": "bluetooth",
        "timeoutMs": 10000
      },
      {
        "kind": "stdout",
        "message": "bluetooth",
        "newline": true
      },
      {
        "id": "bose",
        "kind": "bluetoothDisconnect",
        "storeAs": "bluetooth"
      }
    ],
    "version": 1
  },
  "options": {
    "autoHeight": true,
    "defaultExpandedDepth": 3,
    "editable": false,
    "hasLog": true,
    "hasProps": true,
    "hasRunLog": true,
    "showHelp": true,
    "showLog": true,
    "showPalette": false,
    "showProps": false,
    "showRunLog": false,
    "showToolbar": true
  }
}
```

---

#### Bluetooth Pair

Pair a Bluetooth device (just-works / SSP). Uses PREVIOUS when 'id' is empty.

Params:

**input**
- `id` (string, from PREVIOUS, default `""`) - Device address or name substring. Empty = use PREVIOUS.

**output**
- `storeAs` (string, default `"bluetooth"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "id": "",
  "kind": "bluetoothPair",
  "storeAs": "bluetooth"
}
```

---

#### Set Default Endpoint

Set an MMDevice audio endpoint as the default device for all roles. Pass the endpoint id from bluetoothEndpoints (or PREVIOUS).

Params:

**input**
- `id` (string, from PREVIOUS, default `""`) - MMDevice endpoint id (e.g. "{0.0.0.00000000}.{guid}"). Empty = use PREVIOUS.

**output**
- `storeAs` (string, default `"bluetooth"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "id": "",
  "kind": "bluetoothSetDefault",
  "storeAs": "bluetooth"
}
```

---

#### Bluetooth Unpair

Remove (unpair) a Bluetooth device. Uses PREVIOUS when 'id' is empty.

Params:

**input**
- `id` (string, from PREVIOUS, default `""`) - Device address or name substring. Empty = use PREVIOUS.

**output**
- `storeAs` (string, default `"bluetooth"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "id": "",
  "kind": "bluetoothUnpair",
  "storeAs": "bluetooth"
}
```

### Browser

#### Browser Batch

Run multiple WebView actions in one call.

Params:

**input**
- `epoch` (string, default `""`) - Optional page epoch from Browser Read.
- `steps` (json_value, default `[]`) - Ordered step objects with action/type plus step fields.

**options**
- `defaultDelayMs` (integer, 0-5000, default `50`)
- `continueOnError` (boolean, default `false`)

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "continueOnError": false,
  "defaultDelayMs": 50,
  "epoch": "",
  "kind": "browserBatch",
  "steps": [],
  "storeAs": ""
}
```

---

#### Browser Click

Click a WebView element by ref or selector.

Params:

**input**
- `target` (json_value, from PREVIOUS) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (string, default `""`) - Opaque ref returned by Browser Read/Find.
- `epoch` (string, default `""`) - Page epoch returned with the ref.
- `selector` (string, default `""`) - CSS selector alternative to ref.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "epoch": "",
  "kind": "browserClick",
  "ref": "",
  "selector": "",
  "storeAs": ""
}
```

---

#### Browser Find

Find WebView elements by selector, role, or name.

Params:

**input**
- `target` (json_value, from PREVIOUS) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (string, default `""`) - Opaque ref returned by Browser Read/Find.
- `epoch` (string, default `""`) - Page epoch returned with the ref.
- `selector` (string, default `""`) - CSS selector alternative to ref.
- `role` (string, default `""`)
- `name` (string, default `""`)

**options**
- `limit` (integer, 1-100, default `20`)

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "epoch": "",
  "kind": "browserFind",
  "limit": 20,
  "name": "",
  "ref": "",
  "role": "",
  "selector": "",
  "storeAs": ""
}
```

---

#### Browser Read

Read a compact index or focused DOM snapshot.

Params:

**input**
- `target` (json_value, from PREVIOUS) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (string, default `""`) - Opaque ref returned by Browser Read/Find.
- `epoch` (string, default `""`) - Page epoch returned with the ref.
- `selector` (string, default `""`) - CSS selector alternative to ref.

**options**
- `limit` (integer, 1-500, default `120`)
- `viewportOnly` (boolean, default `false`)

**advanced**
- `textMaxChars` (integer, 0-100000, default `12000`)

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "epoch": "",
  "kind": "browserRead",
  "limit": 120,
  "ref": "",
  "selector": "",
  "storeAs": "",
  "viewportOnly": false
}
```

---

#### Browser Select

Choose a WebView select option.

Params:

**input**
- `target` (json_value, from PREVIOUS) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (string, default `""`) - Opaque ref returned by Browser Read/Find.
- `epoch` (string, default `""`) - Page epoch returned with the ref.
- `selector` (string, default `""`) - CSS selector alternative to ref.
- `value` (string, default `""`)
- `label` (string, default `""`)
- `index` (integer) - Zero-based option index alternative.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "epoch": "",
  "kind": "browserSelect",
  "label": "",
  "ref": "",
  "selector": "",
  "storeAs": "",
  "value": ""
}
```

---

#### Browser Type

Enter text into a WebView form control.

Params:

**input**
- `target` (json_value, from PREVIOUS) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (string, default `""`) - Opaque ref returned by Browser Read/Find.
- `epoch` (string, default `""`) - Page epoch returned with the ref.
- `selector` (string, default `""`) - CSS selector alternative to ref.
- `text` (string, default `""`) - Text to enter.

**options**
- `clear` (boolean, default `true`)
- `submit` (boolean, default `false`)

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "clear": true,
  "epoch": "",
  "kind": "browserType",
  "ref": "",
  "selector": "",
  "storeAs": "",
  "submit": false,
  "text": ""
}
```

### Commands

#### Command

Run a saved custom command or an inline CLI/app/external/url/path payload.

Params:

**input**
- `commandId` (string) - Optional: look up a commands.json entry by id. Leave empty to call an inline app/CLI/external action below.
- `command` (json_value) - Inline call: app/CLI/external/url/path plus args. Args support ${var} from the xblox context (deep-resolved).

**advanced**
- `args` (args_list, default `[]`) - Extra argv tokens appended after the saved/inline command. Use two tokens for xblox scope, e.g. --CURRENT_FILE and ${output}.
- `log` (boolean, default `false`) - Echo captured stdout/stderr to the host logger and xBlox run log, prefixed with this block's id.
- `stdout` (enum, default `"info"`, enum: trace|debug|info|warn|error|off) - Log level for captured stdout lines.
- `stderr` (enum, default `"error"`, enum: trace|debug|info|warn|error|off) - Log level for captured stderr lines.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "command": {
    "appCommand": "open",
    "args": []
  },
  "commandId": "",
  "kind": "command",
  "log": false,
  "stderr": "error",
  "stdout": "info",
  "storeAs": ""
}
```

### Context

#### Get Variable

Read a value from root scope.

Params:

- `name` (variable_ref, required) - Variable name to read.
- `target` (string, default `"PREVIOUS"`) - Variable to copy the value into. PREVIOUS updates the pipeline value only.

Features: pure

Default block:

```json
{
  "kind": "getVariable",
  "name": "",
  "target": "PREVIOUS"
}
```

---

#### Log

Log a message, expression, variable, or the whole scope.

Params:

**input**
- `level` (enum, default `"info"`, enum: trace|debug|info|warn|error) - Log level.
- `message` (string, from PREVIOUS, default `"PREVIOUS"`) - Message or variable expression. Leave empty to log the whole scope.

**query**
- `input` (string, default `"PREVIOUS"`) - Optional context variable to query with jq. When set with filter/query, it replaces message output.
- `filter` (string, default `"."`) - jq filter applied to input, e.g. .items[0].name.
- `format` (enum, default `"auto"`, enum: auto|json) - auto prints scalars naturally and objects/arrays as JSON; json always emits compact JSON.

Features: pure

Default block:

```json
{
  "kind": "log",
  "level": "info",
  "message": "PREVIOUS"
}
```

---

#### Save State

Persist current scope values back into this XBlox document's context.

Params:

- `scope` (enum, default `"context"`, enum: context) - State area to persist. Currently only document context.
- `mode` (enum, default `"existing"`, enum: existing|all) - existing = update keys already present in the file context. all = write the full current scope.
- `keys` (args_list, default `[]`) - Optional context keys to persist. Empty uses mode.

Features: cancellable

Default block:

```json
{
  "keys": [],
  "kind": "saveState",
  "mode": "existing",
  "scope": "context"
}
```

---

#### Set Variable

Write a value into root scope.

Params:

- `name` (string, required) - Variable name to write.
- `value` (json_value) - Literal value (JSON). String values interpolate ${var}.
- `valueFrom` (string) - Copy this context variable. Wins over value when set.
- `fallbackFrom` (string) - If the chosen value is empty, copy this context variable instead.
- `expression` (expression) - Expression evaluated to the stored value. Overrides value when set.

Features: pure

Default block:

```json
{
  "kind": "setVariable",
  "name": "value",
  "value": null
}
```

---

#### Stdin

Read piped input from stdin (whole stream or one line) into PREVIOUS/storeAs.

Params:

**input**
- `mode` (enum, default `"all"`, enum: all|line) - all = read the entire stream to EOF; line = read the next line (streamable inside loops).
- `parse` (enum, default `"text"`, enum: text|json|number|boolean|auto) - Result type for PREVIOUS/storeAs: text (string), json (object/array/scalar), number (int/float � usable in expressions), boolean, or auto (JSON-scalar detection with text fallback). Binary input (NUL bytes) is rejected.
- `trim` (boolean, default `true`) - Trim trailing whitespace/newlines before parsing.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "stdin",
  "mode": "all",
  "parse": "text",
  "trim": true
}
```

---

#### Stdout

Write a message directly to stdout (pipe-friendly).

Params:

**input**
- `message` (string, from PREVIOUS, default `"PREVIOUS"`, resolve: variables+deep) - Message or variable expression. Leave empty to output the whole scope.
- `newline` (boolean, default `true`) - Append a newline.

**query**
- `input` (string, default `"PREVIOUS"`) - Optional context variable to query with jq. When set with filter/query, it replaces message output.
- `filter` (string, default `"."`) - jq filter applied to input, e.g. .items[0].name.
- `format` (enum, default `"auto"`, enum: auto|json) - auto prints scalars naturally and objects/arrays as JSON; json always emits compact JSON.

Features: pure

Default block:

```json
{
  "kind": "stdout",
  "message": "PREVIOUS",
  "newline": true
}
```

### Data

#### Parse JSON

Parse PREVIOUS or named input with a jq filter expression.

Params:

**options**
- `parser` (enum, default `"jq"`, enum: jq|jsonpath) - Parser engine.

**input**
- `filter` (string, required, default `"."`) - jq filter expression (e.g. .items[] | select(.active)).
- `input` (string, default `"PREVIOUS"`) - Input to parse. Leave as PREVIOUS to use the previous block's result.

**output**
- `storeAs` (string, default `"parsed"`) - Variable to also store the result in (always sets PREVIOUS).

Features: pure

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "filter": ".",
  "kind": "Parse",
  "parser": "jq",
  "storeAs": "parsed"
}
```

---

#### Iterator

Iterate over PREVIOUS or any named scope/context variable. Arrays fan out directly, objects become {key,value} entries, scalars run once.

Params:

**options**
- `parser` (enum, default `"jq"`, enum: jq|jsonpath) - Parser engine.

**input**
- `filter` (string, required, default `"."`) - jq filter expression to select the value to iterate.
- `input` (string, default `"PREVIOUS"`) - Scope/context variable to iterate. Leave as PREVIOUS to use the previous block's result.

**iteration**
- `mode` (enum, default `"auto"`, enum: auto|array|objectEntries|objectValues|once) - How to normalize the selected value before fan-out.

**output**
- `storeAs` (string, default `"items"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable pure

Children:
- **items** (For each, role: body)

Default block:

```json
{
  "filter": ".",
  "input": "PREVIOUS",
  "items": [],
  "kind": "iterator",
  "mode": "auto",
  "parser": "jq",
  "storeAs": "items"
}
```

### Files

#### Copy Files

Copy files or folders through the VFS queue (local, ssh://, ftp://, vfs://). src and dst accept ${CWD}, ${KNOWNFOLDER:…}, ${PREVIOUS}.

Params:

**input**
- `src` (file_path, from PREVIOUS) - File, folder, glob, or URI. Leave empty to use PREVIOUS (path, list, or fsList entries). ${…} expand in the transfer lib.
- `dst` (dir_path, required) - Destination folder (path or URI). Keep ${KNOWNFOLDER:Desktop} / ${CWD} as stored templates.

**options**
- `conflict` (enum, default `"error"`, enum: error|overwrite|skip|rename|if-newer) - When a dest file already exists.
- `include` (string, default `""`) - Keep sources matching this glob. Separate multiple with ;
- `exclude` (string, default `""`) - Drop sources matching this glob. Separate multiple with ;
- `dryRun` (boolean, default `false`) - Expand variables and sources only; do not copy.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "conflict": "error",
  "dryRun": false,
  "dst": "",
  "kind": "fsCopy",
  "src": "",
  "storeAs": ""
}
```

---

#### Delete Path

Delete a file or directory. Returns true if something was deleted.

Params:

**input**
- `path` (file_path, required, from PREVIOUS, resolve: custom) - File or folder to delete. Leave empty to use PREVIOUS.

**delete_options**
- `recursive` (boolean, default `false`) - Delete a directory and all of its contents.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "fsDelete",
  "path": "",
  "recursive": false,
  "storeAs": ""
}
```

---

#### Path Exists

Check whether a path exists. Stores a boolean in PREVIOUS / storeAs.

Params:

**input**
- `path` (file_path, required, from PREVIOUS, resolve: custom) - File or folder to check. Leave empty to use PREVIOUS.

**output**
- `storeAs` (string, default `"exists"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "fsExists",
  "path": "",
  "storeAs": "exists"
}
```

---

#### Hash File

Compute a file content hash. Stores the hex digest in PREVIOUS / storeAs.

Params:

**input**
- `path` (file_path, required, from PREVIOUS, constraints: mustExist+readable, resolve: custom) - File to hash. Leave empty to use PREVIOUS as the path.

**hash_options**
- `algorithm` (enum, default `"sha256"`, enum: sha256) - Hash algorithm.
- `prefixLength` (integer, 0-64, default `0`) - Return only the first N hex characters. 0 returns the full digest.

**output**
- `storeAs` (string, default `"hash"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "algorithm": "sha256",
  "kind": "fsHash",
  "path": "",
  "prefixLength": 0,
  "storeAs": "hash"
}
```

---

#### List Files

List a directory or glob. Stores an array of {name, path, type, size} in PREVIOUS / storeAs.

Params:

**input**
- `path` (dir_path, required, from PREVIOUS, resolve: variables+globs+custom) - Directory to list, or a glob pattern such as ${ENV:HOME}/*.png. Leave empty to use PREVIOUS.

**list_options**
- `only` (enum, default `"all"`, enum: all|dir|file) - Show all entries, only folders, or only files.

**output**
- `storeAs` (string, default `"entries"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable

Children:
- **items** (For each, role: body)

Default block:

```json
{
  "kind": "fsList",
  "only": "all",
  "path": "",
  "storeAs": "entries"
}
```

---

#### Create Folder

Create a folder through the VFS queue (local, ssh://, ftp://, vfs://). Existing folders succeed. path accepts ${CWD}, ${KNOWNFOLDER:…}, ${PREVIOUS}.

Params:

**input**
- `path` (dir_path, required, from PREVIOUS, resolve: custom) - Folder path or URI to create (and parents). Leave empty to use PREVIOUS. ${…} expand in the transfer lib.

**options**
- `dryRun` (boolean, default `false`) - Expand variables only; do not create.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "dryRun": false,
  "kind": "fsMkdir",
  "path": "",
  "storeAs": ""
}
```

---

#### Move Files

Move files or folders through the VFS queue. Same src/dst ${…} variables as fsCopy.

Params:

**input**
- `src` (file_path, from PREVIOUS) - File, folder, glob, or URI. Leave empty to use PREVIOUS.
- `dst` (dir_path, required) - Destination folder (path or URI). Same ${…} templates as fsCopy.

**options**
- `conflict` (enum, default `"error"`, enum: error|overwrite|skip|rename|if-newer) - When a dest file already exists.
- `include` (string, default `""`) - Keep sources matching this glob. Separate multiple with ;
- `exclude` (string, default `""`) - Drop sources matching this glob. Separate multiple with ;
- `dryRun` (boolean, default `false`) - Expand variables and sources only; do not move.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "conflict": "error",
  "dryRun": false,
  "dst": "",
  "kind": "fsMove",
  "src": "",
  "storeAs": ""
}
```

---

#### New File

Create a new file with the Explorer New name for an extension (localized). Stores the absolute path in PREVIOUS / storeAs. Windows only.

Params:

**input**
- `ext` (string, required, default `"txt"`) - File type to create, e.g. txt or .txt. Uses the localized Explorer New name for that type. Alias: extension.
- `path` (dir_path, from PREVIOUS) - Folder to create the file in. Leave empty to use PREVIOUS (folder, or parent of a file) or the current directory.

**options**
- `name` (string, default `""`) - Optional file name override. Empty = localized Explorer New name.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "ext": "txt",
  "kind": "fsNew",
  "name": "",
  "path": "",
  "storeAs": ""
}
```

---

#### Read File

Read a text or JSON file. Stores file content in PREVIOUS / storeAs.

Params:

**input**
- `path` (file_path, required, from PREVIOUS, constraints: mustExist+readable, resolve: custom) - File to read. Leave empty to use PREVIOUS as the path.

**read_options**
- `encoding` (enum, default `"text"`, enum: text|json) - Read as plain text, or parse the file as JSON.

**output**
- `storeAs` (string, default `"fileContent"`) - Variable to also store the result in (always sets PREVIOUS).

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "encoding": "text",
  "kind": "fsRead",
  "path": "",
  "storeAs": "fileContent"
}
```

---

#### Write File

Write text from the content field or PREVIOUS to a file. Creates parent folders automatically.

Params:

**input**
- `path` (output_path, required, constraints: writable+createParents, resolve: custom) - File to write.
- `content` (string, from PREVIOUS, default `""`) - Content to write. Leave empty to use PREVIOUS.

**write_options**
- `append` (boolean, default `false`) - Append to the existing file instead of overwriting it.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "append": false,
  "content": "",
  "kind": "fsWrite",
  "path": "",
  "storeAs": ""
}
```

### Flow

#### Break

Break out of the current loop.

Features: pure

Default block:

```json
{
  "kind": "break"
}
```

---

#### Case

One switch branch: runs when the switch value matches its expression.

Params:

- `comparator` (string, default `"==="`) - Comparison operator (===, !=, <, >, ...).
- `expression` (expression) - Value the switch variable is compared against.

Features: container

Children:
- **consequent** (Body, role: consequent)

Default block:

```json
{
  "comparator": "===",
  "consequent": [],
  "expression": "\"value\"",
  "kind": "case"
}
```

---

#### Else

Runs when the preceding if/elseIf chain has not matched.

Features: container

Children:
- **items** (Body, role: body)

Default block:

```json
{
  "items": [],
  "kind": "else"
}
```

---

#### Else If

Runs when the preceding if/elseIf chain has not matched and its own condition is true.

Params:

- `condition` (expression, required, default `"true"`) - Condition expression.

Features: container

Children:
- **items** (Body, role: body)

Default block:

```json
{
  "condition": "true",
  "items": [],
  "kind": "elseIf"
}
```

---

#### Exit

Stop the run immediately and set the process exit code.

Params:

- `code` (integer, 0-255, default `0`) - Process exit code (0-255). Standard meanings: 0 = success, 1 = general error, 2 = misuse/invalid input, 126 = not executable, 127 = not found, 130 = interrupted (Ctrl+C). Any other value is allowed for app-specific signalling to pipelines.
- `message` (string, default `""`) - Optional message recorded on the exit event.

Features: pure

Default block:

```json
{
  "code": 0,
  "kind": "exit"
}
```

---

#### For

Run child blocks over a numeric range.

Params:

- `initial` (expression, required, default `"0"`) - Loop counter initial value.
- `comparator` (enum, required, default `"<"`, enum: <|<=|>|>=|!=|==)
- `final` (expression, required, default `"3"`) - Loop bound expression.
- `modifier` (expression, required, default `"+1"`) - Counter increment expression, e.g. +1 or *2.

Features: container cancellable

Children:
- **items** (Body, role: body)

Default block:

```json
{
  "comparator": "<",
  "final": "3",
  "initial": "0",
  "items": [],
  "kind": "for",
  "modifier": "+1"
}
```

---

#### Group

Transparent container: runs its child blocks in the current scope.

Features: container

Children:
- **items** (Body, role: body)

Default block:

```json
{
  "items": [],
  "kind": "group"
}
```

---

#### If

Run child blocks when the condition is true. Chain `elseIf`/`else` siblings after it.

Params:

- `condition` (expression, required, default `"true"`) - Condition expression.

Features: container

Children:
- **consequent** (Then, role: consequent)

Default block:

```json
{
  "condition": "true",
  "consequent": [],
  "kind": "if"
}
```

---

#### On Start

Run child blocks once when the document starts or ends.

Params:

- `event` (enum, default `"On Start"`, enum: On Start|On End) - Document lifecycle moment that runs this block's children once.

Features: container

Children:
- **items** (Body, role: body)

Default block:

```json
{
  "event": "On Start",
  "items": [],
  "kind": "onStart"
}
```

---

#### Switch

Run the first matching case.

Params:

- `variable` (variable_ref, required, default `"mode"`) - Variable to switch on.

Features: container

Children:
- **items** (Cases, role: case) - accepts: `case`, `switchDefault`

Default block:

```json
{
  "items": [],
  "kind": "switch",
  "variable": "mode"
}
```

---

#### Default

Fallback switch branch: runs when no case matches.

Features: container

Children:
- **consequent** (Body, role: consequent)

Default block:

```json
{
  "consequent": [],
  "kind": "switchDefault"
}
```

---

#### Wait

Sleep for a fixed number of milliseconds.

Params:

- `ms` (duration_ms, required, 0-3.6e+06, default `500`) - Duration to sleep in milliseconds.

Default block:

```json
{
  "kind": "wait",
  "ms": 500
}
```

---

#### While

Run child blocks while a condition is true.

Params:

**input**
- `condition` (expression, required, default `"false"`) - Loop condition expression.

**advanced**
- `loopLimit` (integer, 1-1e+06, default `10`) - Maximum iterations (safety cap).

Features: container cancellable

Children:
- **items** (Body, role: body)

Default block:

```json
{
  "condition": "false",
  "items": [],
  "kind": "while",
  "loopLimit": 10
}
```

### Image

#### Analyze Image

Decode each image once (libvips thumbnail) and emit quality / junk scores. Same analyzer as `find --junk`. Fingerprints will attach here later — no second decode.

Params:

**input**
- `input` (image_path, required, from PREVIOUS, resolve: variables+globs) - Image file, folder, or glob. Uses PREVIOUS when unset.

**scan**
- `recursive` (boolean, default `true`) - Recurse into folder inputs.

**filter**
- `minScore` (float, 0-1, default `0.0`) - Keep rows with junk.hint >= this. 0 = every decoded image.
- `junkKinds` (string, default `"all"`) - dark,bright,blur,flat,tiny or all.
- `maxResults` (integer, 0-100000, default `0`) - 0 = unlimited.

**tune**
- `edgeEnergyBlur` (float, 0-128, default `12.0`) - Blur: mean |dx|+|dy| at/above this → that term is 0.
- `edgeEnergyP90Blur` (float, 0-256, default `40.0`) - Blur OOF path: p90 |dx|+|dy| at/above this → that term is 0.
- `edgeEnergyP99Blur` (float, 0-510, default `88.0`) - Blur: p99 |dx|+|dy| at/above this → blur 0 (screenshots / sharp islands).
- `edgeOrientBlur` (float, 0-1, default `0.2`) - Blur motion path: orientation peak at/below this → that term is 0.
- `edgeDensityLo` (float, 0-1, default `0.06`) - edgeDensity at/above this counts as having edges.
- `analyzeMaxSide` (integer, 16-1024, default `128`) - Analysis thumbnail longest side.
- `tinyMinSide` (integer, 1-4096, default `128`) - tiny score 0 when min(width,height) >= this.
- `edgeThreshold` (integer, 0-510, default `24`) - |dx|+|dy| above this is an edge pixel.

**output**
- `storeAs` (string, default `"analyses"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "analyzeMaxSide": 128,
  "edgeDensityLo": 0.06,
  "edgeEnergyBlur": 12.0,
  "edgeEnergyP90Blur": 40.0,
  "edgeEnergyP99Blur": 88.0,
  "edgeOrientBlur": 0.2,
  "edgeThreshold": 24,
  "input": "",
  "junkKinds": "all",
  "kind": "imageAnalyze",
  "maxResults": 0,
  "minScore": 0.0,
  "recursive": true,
  "storeAs": "analyses",
  "tinyMinSide": 128
}
```

---

#### Create Image

Generate an image from a prompt using the same core create_image API as the CLI create command.

Params:

**input**
- `prompt` (prompt, required) - Prompt for image generation/editing.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path. Empty = core default naming.

**model**
- `provider` (string, default `""`) - Image generation provider. Empty = App Settings image provider.
- `model` (string, default `""`, resolve: variables+deep) - Image generation model. Empty = App Settings image model.
- `replicateCollection` (string, default `"official"`) - Replicate collection for browsing models. Only relevant when provider = replicate.
- `providerOptions` (json_value, default `{}`) - Replicate model-specific input fields (seed, num_inference_steps, ...). Resolved per model via OpenAPI cache.

**auth**
- `apiKey` (api_key, default `""`) - API key override. Empty = from App Settings.
- `baseUrl` (string, default `""`) - Provider base URL override. Empty = provider default/App Settings.

**request**
- `aspectRatio` (enum, default `""`, enum: |1:1|16:9|9:16|4:3|3:4|21:9) - Aspect ratio shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `imageSize` (enum, default `""`, enum: |512|1K|2K|4K) - Size shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `references` (args_list, default `[]`) - Reference image paths (one per row). Each supports the file picker.

**pre_resize**
- `resizeFirst` (boolean, default `false`) - Pre-resize input/reference raster before sending to the provider.
- `resizeWidth` (integer, 0-8192, default `0`) - Longest edge for pre-resize when resizeFirst is on. 0 = provider/default.
- `preresizeRawOnly` (boolean, default `false`) - When pre-resizing, only force RAW/HEIC rasters through the explicit long-edge resize.

**hud**
- `hud` (boolean, default `false`) - Show the movable overlay HUD while this block runs. Default off.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "apiKey": "",
  "aspectRatio": "",
  "baseUrl": "",
  "hud": false,
  "imageSize": "",
  "kind": "imageCreate",
  "model": "",
  "outputPath": "",
  "preresizeRawOnly": false,
  "prompt": "",
  "provider": "",
  "references": [],
  "replicateCollection": "official",
  "resizeFirst": false,
  "resizeWidth": 0,
  "storeAs": "imagePath"
}
```

---

#### Find Images

Find images by junk/accident scores or by filename. Same core as `tanit-cli find`. Duplicate / near-duplicate mode comes next and will reuse imageAnalyze features.

Params:

**input**
- `input` (image_path, required, from PREVIOUS, resolve: variables+globs) - Image file, folder, or glob. Uses PREVIOUS when unset.

**query**
- `mode` (enum, default `"junk"`, enum: junk|name) - junk = quality scores. name = filename / folder substring. duplicates = parked.
- `prompt` (string, default `""`) - Required for mode=name.

**scan**
- `recursive` (boolean, default `true`) - Recurse into folder inputs.

**filter**
- `minScore` (float, 0-1, default `0.7`) - Junk: minimum hint to match.
- `junkKinds` (string, default `"all"`) - dark,bright,blur,flat,tiny or all.
- `maxResults` (integer, 0-100000, default `0`)

**tune**
- `edgeEnergyBlur` (float, 0-128, default `12.0`) - Same as find --edge-energy-blur.
- `edgeEnergyP90Blur` (float, 0-256, default `40.0`) - Same as find --edge-energy-p90-blur.
- `edgeEnergyP99Blur` (float, 0-510, default `88.0`) - Same as find --edge-energy-p99-blur.
- `edgeOrientBlur` (float, 0-1, default `0.2`) - Same as find --edge-orient-blur.
- `edgeDensityLo` (float, 0-1, default `0.06`) - Same as find --edge-density-lo.
- `analyzeMaxSide` (integer, 16-1024, default `128`)
- `tinyMinSide` (integer, 1-4096, default `128`)
- `edgeThreshold` (integer, 0-510, default `24`)

**output**
- `storeAs` (string, default `"matches"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "analyzeMaxSide": 128,
  "edgeDensityLo": 0.06,
  "edgeEnergyBlur": 12.0,
  "edgeEnergyP90Blur": 40.0,
  "edgeEnergyP99Blur": 88.0,
  "edgeOrientBlur": 0.2,
  "edgeThreshold": 24,
  "input": "",
  "junkKinds": "all",
  "kind": "imageFind",
  "maxResults": 0,
  "minScore": 0.7,
  "mode": "junk",
  "prompt": "",
  "recursive": true,
  "storeAs": "matches",
  "tinyMinSide": 128
}
```

---

#### Unload Model

List or unload loaded local model instances for this xBlox process.

Params:

**lifecycle**
- `action` (enum, default `"List"`, enum: List|Unload) - List loaded models in this xBlox process, or unload one by key.
- `key` (string, default `"llama:vlm"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (string, default `"modelKey"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "action": "Unload",
  "key": "llama:vlm",
  "kind": "imageModelControl",
  "storeAs": "modelKey"
}
```

---

#### Resize Image

Resize/transform one or more image files using the same libvips pipeline as the resize CLI command.

Params:

**input**
- `input` (image_path, required, from PREVIOUS, resolve: variables+globs) - Input image path or glob. Uses PREVIOUS when unset.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output file, directory, or dst template. Empty = core default output path(s).
- `suffix` (string, default `""`) - Suffix for implicit output names, e.g. _small.

**dimensions**
- `maxWidth` (integer, 0-100000, default `0`) - Target/max width. 0 = unconstrained.
- `maxHeight` (integer, 0-100000, default `0`) - Target/max height. 0 = unconstrained.
- `allowEnlargement` (boolean, default `false`) - Allow upscaling.

**format**
- `format` (enum, default `""`, enum: |jpg|jpeg|png|webp|avif|tif|tiff|heic) - Output format. Empty = infer from output path/input.
- `fit` (enum, default `"inside"`, enum: inside|cover|contain|fill|outside) - Resize fit mode, matching Sharp/libvips semantics.
- `position` (string, default `"centre"`) - For cover: centre, attention, entropy, low, high, etc.
- `kernel` (enum, default `"lanczos3"`, enum: nearest|cubic|mitchell|lanczos2|lanczos3) - Resize kernel.
- `background` (string, default `"#ffffff"`) - Letterbox color for contain, e.g. #ffffff.

**codec**
- `quality` (integer, 1-100, default `85`) - JPEG/WebP/AVIF quality.
- `pngCompression` (integer, 0-9, default `6`) - PNG DEFLATE compression level.
- `stripMetadata` (boolean, default `true`) - Strip metadata on output where supported.

**transform**
- `rotate` (integer, 0-270, default `0`) - Rotate 0, 90, 180, or 270 degrees after autorotate.
- `flip` (boolean, default `false`) - Vertical flip.
- `flop` (boolean, default `false`) - Horizontal flop.
- `autorotate` (boolean, default `true`) - Apply EXIF orientation.

**cache**
- `cache` (boolean, default `true`) - Enable resize output cache.
- `cacheDir` (dir_path, default `""`) - Cache directory. Empty = core default.

**network**
- `urlTimeoutSec` (integer, 0-3600, default `5`) - HTTP(S) input timeout in seconds.
- `urlMaxRedirects` (integer, 0-100, default `20`) - Max HTTP redirects.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "allowEnlargement": false,
  "autorotate": true,
  "background": "#ffffff",
  "cache": true,
  "cacheDir": "",
  "fit": "inside",
  "flip": false,
  "flop": false,
  "format": "",
  "input": "",
  "kernel": "lanczos3",
  "kind": "imageResize",
  "maxHeight": 0,
  "maxWidth": 0,
  "outputPath": "",
  "pngCompression": 6,
  "position": "centre",
  "quality": 85,
  "rotate": 0,
  "storeAs": "imagePath",
  "stripMetadata": true,
  "suffix": "",
  "urlMaxRedirects": 20,
  "urlTimeoutSec": 5
}
```

---

#### Screenshot

Capture a monitor, window, or webcam to an image file and/or clipboard. The input source string is typically wired from a Picker block (e.g. 'screen:0', 'screen:0:wintitle=Chrome*', or a camera device name).

Params:

**input**
- `input` (screen_input, from PREVIOUS, default `"screen:0"`) - Capture source same format as videoDetect / videoScreenCapture. Wire from a Picker block: 'screen:N', 'screen:N:wintitle=Glob*', 'screen:N:hwnd=<id>:rrect=x,y,w,h', or a camera device name.

**output**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path (.jpg or .png). Optional leave empty to skip saving.
- `copyToClipboard` (boolean, default `false`) - Copy the captured image to the clipboard as CF_DIB (bitmap).
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

**advanced**
- `timeoutMs` (integer, 100-60000, default `5000`) - Webcam capture timeout in milliseconds (unused for screen sources).

Features: cancellable

Default block:

```json
{
  "copyToClipboard": false,
  "input": "screen:0",
  "kind": "imageScreenshot",
  "outputPath": "",
  "storeAs": "imagePath",
  "timeoutMs": 5000
}
```

---

#### Transform Image

Edit one or more images with an AI prompt using the same core transform_image API as the CLI transform command.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`, resolve: variables+globs) - Input image path or glob. Uses PREVIOUS when unset.
- `prompt` (prompt, required) - Prompt for image generation/editing.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path. Empty = core default naming.

**model**
- `provider` (string, default `""`) - Image generation provider. Empty = App Settings image provider.
- `model` (string, default `""`, resolve: variables+deep) - Image generation model. Empty = App Settings image model.
- `replicateCollection` (string, default `"official"`) - Replicate collection for browsing models. Only relevant when provider = replicate.
- `providerOptions` (json_value, default `{}`) - Replicate model-specific input fields (seed, num_inference_steps, ...). Resolved per model via OpenAPI cache.

**auth**
- `apiKey` (api_key, default `""`) - API key override. Empty = from App Settings.
- `baseUrl` (string, default `""`) - Provider base URL override. Empty = provider default/App Settings.

**request**
- `aspectRatio` (enum, default `""`, enum: |1:1|16:9|9:16|4:3|3:4|21:9) - Aspect ratio shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `imageSize` (enum, default `""`, enum: |512|1K|2K|4K) - Size shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `references` (args_list, default `[]`) - Reference image paths (one per row). Each supports the file picker.

**pre_resize**
- `resizeFirst` (boolean, default `false`) - Pre-resize input/reference raster before sending to the provider.
- `resizeWidth` (integer, 0-8192, default `0`) - Longest edge for pre-resize when resizeFirst is on. 0 = provider/default.
- `preresizeRawOnly` (boolean, default `false`) - When pre-resizing, only force RAW/HEIC rasters through the explicit long-edge resize.

**hud**
- `hud` (boolean, default `false`) - Show the movable overlay HUD while this block runs. Default off.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "apiKey": "",
  "aspectRatio": "",
  "baseUrl": "",
  "hud": false,
  "imageSize": "",
  "input": "",
  "kind": "imageTransform",
  "model": "",
  "outputPath": "",
  "preresizeRawOnly": false,
  "prompt": "",
  "provider": "",
  "references": [],
  "replicateCollection": "official",
  "resizeFirst": false,
  "resizeWidth": 0,
  "storeAs": "imagePath"
}
```

---

#### Image Understand

Ask the vision/recognition model a question about one or more images. Same pipeline as the image_understand agent tool: cloud via image_understand (plain markdown/text), local VLM via llama (provider=llama). Pure query, no sidecars.

Params:

**input**
- `input` (image_path, required, from PREVIOUS, resolve: variables+globs) - Input image path or glob. Uses PREVIOUS when unset. Pass multiple images for comparison prompts.
- `prompt` (prompt, required) - Vision question or instruction for the recognition model.

**model**
- `provider` (string, default `""`) - Image recognition provider. Empty = App Settings image recognition provider.
- `model` (string, default `""`, resolve: variables+deep) - Image recognition model. Empty = App Settings image recognition model. For provider=llama, local VLMs come from vision.models.vlm.
- `replicateCollection` (string, default `"official"`) - Replicate collection for browsing vision models. Only relevant when provider = replicate.

**auth**
- `apiKey` (api_key, default `""`) - API key override. Empty = from App Settings.
- `baseUrl` (string, default `""`) - Provider base URL override. Empty = provider default/App Settings.

**pre_resize**
- `resizeFirst` (boolean, default `true`) - Pre-resize images before upload (default true, matching image_understand).
- `resizeWidth` (integer, 64-2048, default `512`) - Longest edge for pre-resize when resizeFirst is on.

**output**
- `json` (boolean, default `false`) - When true, result is structured JSON; when false, result is answer text only.
- `storeAs` (string, default `"answer"`) - Variable to also store the result in (always sets PREVIOUS).

**runtime**
- `threads` (integer, 1-64, default `4`) - CPU threads for local VLM (provider=llama).
- `gpuLayers` (integer, -1-999, default `-1`) - GPU layers for local VLM. -1 = all available, 0 = CPU-only.
- `ctx` (integer, 1024-65536, default `4096`) - Context size for local VLM. Use 8192+ for multi-image prompts.
- `maxTokens` (integer, 1-32768, default `2048`) - Maximum generated tokens for local VLM.

**hud**
- `hud` (boolean, default `false`) - Show the movable overlay HUD while this block runs. Default off.

Features: background cancellable

Default block:

```json
{
  "apiKey": "",
  "baseUrl": "",
  "ctx": 4096,
  "gpuLayers": -1,
  "hud": false,
  "input": "",
  "json": false,
  "kind": "imageUnderstand",
  "maxTokens": 2048,
  "model": "",
  "prompt": "",
  "provider": "",
  "replicateCollection": "official",
  "resizeFirst": true,
  "resizeWidth": 512,
  "storeAs": "answer",
  "threads": 4
}
```

### Input

#### Key Event

Sample a keyboard shortcut once and emit down/pressed/released/toggle state. Designed for document loops: run it each pass, then branch with if blocks.

Params:

**input**
- `keys` (shortcut, default `"F9"`) - Keyboard shortcut to sample, e.g. F9 or Ctrl+Shift+R. Ignored when anyKey is on.

**options**
- `anyKey` (boolean, default `false`) - Match any key press instead of the configured shortcut.
- `toggle` (boolean, default `true`) - Flip the emitted toggle state on each press edge.

**output**
- `storeAs` (string, default `"key"`) - Variable to also store the result in (always sets PREVIOUS).

Features: pure

Default block:

```json
{
  "anyKey": false,
  "keys": "F9",
  "kind": "keyEvent",
  "storeAs": "key",
  "toggle": true
}
```

---

#### Key Wait

Wait for a keyboard shortcut then run child blocks. on=pressed fires on key-down edge; on=released fires on key-up edge; on=held fires while the key is held; on=toggle starts children on the first press and cancels them on the second. repeat=true keeps listening across multiple events. Stores the fired key string in PREVIOUS / storeAs when the wait cycle completes.

Params:

**input**
- `keys` (shortcut, default `"F9"`) - Keyboard shortcut to listen for, e.g. F9 or Ctrl+Shift+R. Ignored when anyKey is on.
- `on` (enum, default `"pressed"`, enum: pressed|held|released|toggle) - When to fire: pressed (leading edge), held (while down), released (trailing edge), or toggle (first press starts child blocks, second press cancels them).

**options**
- `repeat` (boolean, default `false`) - Keep listening and fire on every matching event. Not applicable to toggle (which always re-arms after each cycle).
- `anyKey` (boolean, default `false`) - Match any key press instead of the configured shortcut. Stores the key name in PREVIOUS / storeAs.
- `timeoutMs` (duration_ms, default `0`) - Stop listening after this many milliseconds. 0 = wait forever.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Features: container cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "anyKey": false,
  "keys": "F9",
  "kind": "keyWait",
  "on": "pressed",
  "repeat": false,
  "storeAs": "",
  "timeoutMs": 0
}
```

### MQTT

#### MQTT Client

Connect to an MQTT broker and Publish, Subscribe, or RoundTrip a test message. For received messages, runs child items with PREVIOUS={topic,payload,host,port}.

Params:

**mode**
- `action` (enum, default `"RoundTrip"`, enum: Publish|Subscribe|RoundTrip) - Publish sends one message. Subscribe waits for one message. RoundTrip subscribes then publishes and waits for its echo.

**input**
- `host` (string, default `"127.0.0.1"`) - Broker host.
- `port` (integer, 1-65535, default `1883`) - Broker port.
- `topic` (string, default `"xblox/smoke"`) - MQTT topic.
- `payload` (prompt, default `"hello from xblox"`) - Payload to publish.

**advanced**
- `clientId` (string, default `"xblox-mqtt"`) - MQTT client id.
- `qos` (integer, 0-2, default `0`) - MQTT QoS level.

**timeouts**
- `timeoutMs` (duration_ms, 1-60000, default `5000`) - Client operation timeout.

**output**
- `storeAs` (string, default `"mqtt"`) - Variable to also store the result in (always sets PREVIOUS).

Features: container cancellable

Children:
- **items** (On Message, role: body)

Default block:

```json
{
  "action": "RoundTrip",
  "host": "127.0.0.1",
  "items": [],
  "kind": "mqttClient",
  "payload": "hello from xblox",
  "port": 1883,
  "qos": 0,
  "storeAs": "mqtt",
  "timeoutMs": 5000,
  "topic": "xblox/smoke"
}
```

---

#### MQTT Server

Start, stop, or inspect a named in-process MQTT broker instance.

Params:

**server_lifecycle**
- `action` (enum, default `"Start"`, enum: Start|Stop|Status) - Start a named MQTT broker, Stop it, or report Status.
- `instance` (string, default `"default"`) - Named broker instance. Use the same name for Stop/Status.

**network**
- `bind` (string, default `"127.0.0.1"`) - Network interface to listen on.
- `port` (integer, 1-65535, default `1883`) - MQTT TCP port.

**output**
- `storeAs` (string, default `"mqttServer"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "action": "Start",
  "bind": "127.0.0.1",
  "instance": "default",
  "kind": "mqttServer",
  "port": 1883,
  "storeAs": "mqttServer"
}
```

### Modbus

#### Modbus Connection

Start, stop, or inspect a named cached Modbus client connection for fast repeated reads/writes.

Params:

**connection**
- `action` (enum, default `"Start"`, enum: Start|Stop|Status) - Start/open a named connection, Stop/release it, or report Status.
- `connection` (string, default `"default"`) - Named connection/pool key reused by read/write blocks.
- `instance` (string, default `""`) - Alias for connection.

**input**
- `url` (string, default `"tcp:127.0.0.1:15020"`) - Endpoint to connect to.

**advanced**
- `slave` (integer, 0-255) - Unit/slave id.
- `unitId` (integer, 0-255) - Alias for slave.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `reload` (boolean, default `false`) - Force reconnect even if the named connection is already open.

**output**
- `storeAs` (string, default `"modbusConnection"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "action": "Start",
  "connection": "default",
  "kind": "modbusConnection",
  "storeAs": "modbusConnection",
  "url": "tcp:127.0.0.1:15020"
}
```

---

#### Modbus Read

Read coils, discrete inputs, holding registers, or input registers. ModbusPoll-style aliases: area/functionCode, address, count/regCount.

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to read from.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|inputRegisters|coils|discreteInputs) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (integer, 1-2000, default `1`) - Number of coils/registers to read.
- `regCount` (integer, 1-2000, default `1`) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `"values"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "area": "holdingRegisters",
  "count": 3,
  "kind": "modbusRead",
  "storeAs": "values",
  "url": "tcp:127.0.0.1:15020"
}
```

---

#### Modbus Read Coils

Read coils (FC01).

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to read from.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|inputRegisters|coils|discreteInputs) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (integer, 1-2000, default `1`) - Number of coils/registers to read.
- `regCount` (integer, 1-2000, default `1`) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `"values"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "area": "coils",
  "count": 8,
  "kind": "modbusReadCoils",
  "storeAs": "values",
  "url": "tcp:127.0.0.1:15020"
}
```

---

#### Modbus Read Discrete Inputs

Read discrete inputs (FC02).

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to read from.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|inputRegisters|coils|discreteInputs) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (integer, 1-2000, default `1`) - Number of coils/registers to read.
- `regCount` (integer, 1-2000, default `1`) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `"values"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "area": "discreteInputs",
  "count": 8,
  "kind": "modbusReadDiscreteInputs",
  "storeAs": "values",
  "url": "tcp:127.0.0.1:15020"
}
```

---

#### Modbus Read Holding Registers

Read holding registers from a Modbus TCP/RTU endpoint.

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to read from.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|inputRegisters|coils|discreteInputs) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (integer, 1-2000, default `1`) - Number of coils/registers to read.
- `regCount` (integer, 1-2000, default `1`) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `"values"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "count": 3,
  "kind": "modbusReadHoldingRegisters",
  "storeAs": "values",
  "url": "tcp:127.0.0.1:15020"
}
```

---

#### Modbus Read Input Registers

Read input registers (FC04).

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to read from.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|inputRegisters|coils|discreteInputs) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (integer, 1-2000, default `1`) - Number of coils/registers to read.
- `regCount` (integer, 1-2000, default `1`) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `"values"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "area": "inputRegisters",
  "count": 3,
  "kind": "modbusReadInputRegisters",
  "storeAs": "values",
  "url": "tcp:127.0.0.1:15020"
}
```

---

#### Modbus Server

Run a Modbus TCP server until cancelled, durationMs expires, or maxRequests is reached.

Params:

**input**
- `url` (string, default `"tcp:127.0.0.1:15020"`) - Listen endpoint, e.g. tcp:127.0.0.1:15020.
- `holdingRegisters` (json_value) - Initial holding-register values (integer array).
- `inputRegisters` (json_value) - Initial input-register values (integer array).

**advanced**
- `registerCount` (integer, 0-65535, default `128`) - Number of holding registers to expose.
- `inputRegisterCount` (integer, 0-65535, default `128`) - Number of input registers to expose.
- `coilCount` (integer, 0-65535, default `128`) - Number of coils to expose.
- `coils` (json_value) - Initial coil values (boolean/integer array).
- `discreteInputCount` (integer, 0-65535, default `128`) - Number of discrete inputs to expose.
- `discreteInputs` (json_value) - Initial discrete-input values (boolean/integer array).
- `durationMs` (duration_ms, 0-3.6e+06, default `0`) - Auto-stop after this many ms. 0 = run until cancelled.
- `maxRequests` (integer, 0-1e+06, default `0`) - Auto-stop after this many requests. 0 = unlimited.
- `unitId` (integer, 0-255, default `1`) - Modbus unit/slave id.
- `pollTimeoutMs` (integer, 1-60000, default `100`) - Server poll timeout in ms.
- `debug` (boolean, default `false`) - Verbose server logging.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "coils": [
    1,
    0,
    1
  ],
  "discreteInputs": [
    0,
    1,
    0
  ],
  "durationMs": 3000,
  "holdingRegisters": [
    11,
    22,
    33
  ],
  "inputRegisters": [
    44,
    55,
    66
  ],
  "kind": "modbusServer",
  "url": "tcp:127.0.0.1:15020"
}
```

---

#### Modbus Write

Write one or many holding registers/coils. Chooses FC06/FC16 or FC05/FC15 based on area and value count.

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to write to.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|coils) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (json_value) - Single 16-bit register value or coil boolean/0/1.
- `values` (json_value) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "area": "holdingRegisters",
  "kind": "modbusWrite",
  "url": "tcp:127.0.0.1:15020",
  "values": [
    101,
    202
  ]
}
```

---

#### Modbus Write Coil

Write a single coil (FC05).

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to write to.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|coils) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (json_value) - Single 16-bit register value or coil boolean/0/1.
- `values` (json_value) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "area": "coils",
  "kind": "modbusWriteCoil",
  "url": "tcp:127.0.0.1:15020",
  "value": 1
}
```

---

#### Modbus Write Coils

Write multiple coils (FC15).

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to write to.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|coils) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (json_value) - Single 16-bit register value or coil boolean/0/1.
- `values` (json_value) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "area": "coils",
  "kind": "modbusWriteCoils",
  "url": "tcp:127.0.0.1:15020",
  "values": [
    1,
    0,
    1
  ]
}
```

---

#### Modbus Write Register

Write a single holding register.

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to write to.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|coils) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (json_value) - Single 16-bit register value or coil boolean/0/1.
- `values` (json_value) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "kind": "modbusWriteRegister",
  "url": "tcp:127.0.0.1:15020",
  "value": 123
}
```

---

#### Modbus Write Registers

Write multiple holding registers.

Params:

**input**
- `url` (string, required, default `"tcp:127.0.0.1:15020"`) - Endpoint to write to.
- `area` (enum, default `"holdingRegisters"`, enum: holdingRegisters|coils) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (integer, 0-65535, default `0`) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (json_value) - Single 16-bit register value or coil boolean/0/1.
- `values` (json_value) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (string, default `""`) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (string, default `""`) - Alias for connection.
- `reload` (boolean, default `false`) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (string, default `"zero"`) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (integer, 0-255) - Unit/slave id.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`)
- `waitTimeMs` (duration_ms, 0-60000, default `20`) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "address": 0,
  "kind": "modbusWriteRegisters",
  "url": "tcp:127.0.0.1:15020",
  "values": [
    101,
    202
  ]
}
```

### Network

#### Fetch

Fetch a URL. With decode:json + a JSON-array response, child blocks iterate over each element (PREVIOUS = element, index = i).

Params:

**input**
- `url` (string, required, default `"https://"`) - Request URL. Supports ${var} interpolation.

**request**
- `method` (string, default `"GET"`, enum: GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) - HTTP method  -  GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, or any custom verb.
- `queryParams` (json_value) - Query-string parameters as a JSON object {"key":"value"}. Appended to the URL (percent-encoded). Merged with any params already in the URL.
- `headers` (string, default `""`) - Extra request headers  -  JSON object {"Name":"value"} or array of "Name: value" strings.

**body**
- `bodyType` (enum, default `"none"`, enum: none|raw|json|form|multipart) - Request body format. none = no body (GET / HEAD). raw = plain text body. json = serialize bodyJson + Content-Type: application/json. form = URL-encode bodyFields + Content-Type: application/x-www-form-urlencoded. multipart = curl_mime from bodyParts ("name=value" or "name@/path").
- `body` (prompt, default `""`) - Raw request body (used when bodyType is raw). Supports ${var} interpolation.
- `bodyJson` (json_value) - Body as a JSON value (object, array, string, ...). Serialized and sent with Content-Type: application/json. Used when bodyType is json.
- `bodyFields` (json_value) - Form fields as a JSON object {"key": "value"}. URL-encoded and sent with Content-Type: application/x-www-form-urlencoded. Used when bodyType is form.
- `bodyParts` (args_list) - Multipart form parts (bodyType: multipart). Each entry uses curl -F syntax: "name=value" for a text field, "name@/path/to/file" for a file part, or bare "/path/to/file" to use the filename as field name.

**response**
- `decode` (enum, default `"raw"`, enum: raw|json) - raw = body as a string. json = parse body as JSON and apply the parse selector.
- `parse` (string, default `"."`) - Dotted-path selector applied after decode:json (e.g. .items[0].name). Default . = whole document.

**auth**
- `auth` (enum, default `"none"`, enum: none|bearer|basic|apikey) - Authentication mode. none = no auth header added.
- `authToken` (string, default `""`) - Bearer token or API key value.
- `authUser` (string, default `""`) - HTTP Basic auth username.
- `authPass` (string, default `""`) - HTTP Basic auth password.
- `authHeader` (string, default `"X-Api-Key"`) - Header name used for apikey auth. Default: X-Api-Key.

**download**
- `downloadAs` (output_path, default `""`) - Save the response body to this file path; the saved path is available as the savedPath output. decode/parse/storeAs still apply normally — result (PREVIOUS) is the decoded value, not the path. "auto" derives the filename from Content-Disposition or the URL and saves to Downloads.

**cache**
- `cache` (boolean, default `false`) - Cache responses to disk. Sends ETag / Last-Modified revalidation on stale hits.
- `cacheDir` (string, default `""`) - Cache directory. Default: system cache dir / pixlwiz / net.
- `cacheTtlMs` (duration_ms, -1-8.64e+07, default `3600000`) - Cache TTL in ms. -1 = rely solely on server ETag / Last-Modified. Default: 1 h.

**proxy**
- `proxy` (string, default `""`) - Proxy URL, e.g. http://proxy.corp:8080.
- `proxyUser` (string, default `""`) - Proxy username.
- `proxyPass` (string, default `""`) - Proxy password.

**session**
- `sessionId` (string, default `""`) - Named persistent cookie jar. All requests sharing the same sessionId reuse cookies set by previous responses (login flows, OAuth redirects, CSRF tokens). Concurrent requests to the same session are serialized. Empty = no session.
- `sessionDir` (dir_path, default `""`) - Directory for session jar files. Default: system cache dir / pixlwiz / sessions.

**ssl**
- `insecure` (boolean, default `false`) - Skip SSL peer and host verification. Implies verifyPeer=false + verifyHost=false.
- `verifyPeer` (boolean, default `true`) - Verify SSL certificate chain. Overridden to false by insecure:true.
- `verifyHost` (boolean, default `true`) - Verify SSL hostname. Overridden to false by insecure:true.

**timeouts**
- `timeoutMs` (duration_ms, 0-300000, default `30000`) - Total transfer timeout in ms (0 = no limit).
- `connectTimeoutMs` (integer, 0-300000, default `10000`) - TCP connect timeout in ms.

**redirects**
- `followRedirects` (boolean, default `true`) - Follow 3xx redirects automatically.
- `maxRedirects` (integer, 0-30, default `5`) - Maximum number of redirects to follow.

**retry**
- `retries` (integer, 0-10, default `2`) - Maximum number of retries after a transient failure (curl error or 5xx / 408 / 429).
- `retryDelayMs` (integer, 0-60000, default `250`) - Base retry delay in ms. Each retry doubles the delay plus random jitter (exponential back-off).

**output**
- `statusCode` (integer) - HTTP status code of the final response. 0 for file:// and transport errors.
- `storeAs` (string, default `"response"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable cancellable

Children:
- **items** (Body, role: body)

Default block:

```json
{
  "decode": "raw",
  "followRedirects": true,
  "kind": "fetch",
  "method": "GET",
  "storeAs": "response",
  "timeoutMs": 30000,
  "url": "https://"
}
```

---

#### IPC Broadcast

Send a message to every live XBlox session.

Params:

**input**
- `from` (string, default `"xblox"`) - Sender identity stored with the message.
- `message` (string, default `""`) - Message text. Supports ${var} interpolation.
- `data` (json_value) - Optional structured payload attached as message.data.

**timeouts**
- `timeoutMs` (duration_ms, 1-300000, default `3000`) - Per-session IPC request timeout.

**output**
- `storeAs` (string, default `"ipcBroadcast"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "data": null,
  "from": "xblox",
  "kind": "ipcBroadcast",
  "message": "",
  "storeAs": "ipcBroadcast"
}
```

---

#### IPC Receive

Drain or wait for messages from a live XBlox session inbox. Child blocks iterate over received messages.

Params:

**input**
- `target` (string, required) - Target session key, descriptor stem, or unambiguous key prefix.
- `peek` (boolean, default `false`) - Read without consuming messages.

**wait**
- `waitMs` (duration_ms, 0-300000, default `0`) - Poll until messages arrive or this timeout elapses.
- `pollMs` (duration_ms, 10-60000, default `100`) - Polling interval while waiting.

**timeouts**
- `timeoutMs` (duration_ms, 1-300000, default `3000`) - Per-IPC request timeout.

**output**
- `storeAs` (string, default `"messages"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable cancellable

Children:
- **items** (For each, role: body)

Default block:

```json
{
  "items": [],
  "kind": "ipcReceive",
  "peek": false,
  "pollMs": 100,
  "storeAs": "messages",
  "target": "",
  "waitMs": 0
}
```

---

#### IPC Send

Send a message to a live XBlox session.

Params:

**input**
- `target` (string, required) - Target session key, descriptor stem, or unambiguous key prefix.
- `from` (string, default `"xblox"`) - Sender identity stored with the message.
- `message` (string, default `""`) - Message text. Supports ${var} interpolation.
- `data` (json_value) - Optional structured payload attached as message.data.

**timeouts**
- `timeoutMs` (duration_ms, 1-300000, default `3000`) - IPC request timeout.

**output**
- `storeAs` (string, default `"ipcReply"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "data": null,
  "from": "xblox",
  "kind": "ipcSend",
  "message": "",
  "storeAs": "ipcReply",
  "target": ""
}
```

---

#### IPC Send Batch

Send many messages to a live XBlox session in one IPC frame.

Params:

**input**
- `target` (string, required) - Target session key, descriptor stem, or unambiguous key prefix.
- `from` (string, default `"xblox"`) - Sender identity stored with each message.
- `message` (string, default `""`) - Message text. Supports ${var} interpolation.
- `count` (integer, 0-10000, default `1`) - Number of messages to create when source is empty.
- `source` (string, default `""`) - Optional context array to send one message per element.
- `data` (json_value) - Optional shared structured payload when source is empty.

**timeouts**
- `timeoutMs` (duration_ms, 1-300000, default `3000`) - IPC request timeout.

**output**
- `storeAs` (string, default `"ipcBatchReply"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "count": 1,
  "data": null,
  "from": "xblox",
  "kind": "ipcSendBatch",
  "message": "",
  "source": "",
  "storeAs": "ipcBatchReply",
  "target": ""
}
```

---

#### IPC Session

Host a named XBlox IPC session for this run. Reuses the same session on later loop passes.

Params:

**input**
- `name` (string, required) - Session name. Plain names are normalized to name:<value>.
- `label` (string, default `""`) - Optional display label for the session.

**output**
- `storeAs` (string, default `"session"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "ipcSession",
  "name": "ipc",
  "storeAs": "session"
}
```

---

#### IPC Sessions

List live XBlox sessions. Child blocks iterate over each session descriptor.

Params:

- `storeAs` (string, default `"sessions"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable pure

Children:
- **items** (For each, role: body)

Default block:

```json
{
  "items": [],
  "kind": "ipcSessions",
  "storeAs": "sessions"
}
```

---

#### MCP Call

Call a tool on an MCP server. Supports profile servers (mcp.json), bundled system servers, and inline custom configs (stdio + HTTP). Fresh session per call. When the tool result is a JSON array, child blocks iterate over each element (PREVIOUS = element, index = i); otherwise children run once with the full result as PREVIOUS.

Params:

**server**
- `server` (string, required) - MCP server name from mcp.json, a bundled system server, or __custom__ for an inline config.  Supports ${var} interpolation.

**connection**
- `serverConfig` (json_value, default `{}`) - Inline MCP server config (used only when server == __custom__). Use ${USER:…} for secrets in headers / env / args.

**request**
- `tool` (string, required) - Remote tool name on the selected server. Supports ${var} interpolation.

**arguments**
- `arguments` (json_value, default `{}`) - Tool arguments object. Supports ${var} interpolation on all fields.

**timeouts**
- `timeoutMs` (duration_ms, default `60000`) - MCP request timeout in milliseconds.

**output**
- `storeAs` (string, default `"mcpResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: iterable cancellable

Children:
- **items** (For each, role: body)

Default block:

```json
{
  "arguments": {},
  "items": [],
  "kind": "mcpCall",
  "server": "",
  "serverConfig": {
    "args": [],
    "auth": "none",
    "authHeader": "X-Api-Key",
    "authPass": "",
    "authToken": "",
    "authUser": "",
    "command": "",
    "env": {},
    "headers": {},
    "tool_timeout": 30,
    "type": "",
    "url": ""
  },
  "storeAs": "mcpResult",
  "timeoutMs": 60000,
  "tool": ""
}
```

---

#### SSH Exec

Run a command on a remote host over SSH using password or public-key authentication.

Params:

**input**
- `host` (string, required) - SSH host name or IP address.
- `port` (integer, 1-65535, default `22`) - SSH port.
- `username` (string, default `""`) - SSH username. Empty lets libssh use the current user.
- `password` (string, default `""`) - Password authentication value. Empty tries public-key auth.
- `privateKey` (file_path, default `""`) - Optional private key file for public-key auth.
- `passphrase` (string, default `""`) - Optional private key passphrase.
- `command` (prompt, required) - Remote command to execute. Supports ${var} interpolation.

**ssh**
- `configFile` (file_path, default `""`) - Optional SSH config file. Empty parses the OS user default ~/.ssh/config.
- `knownHosts` (file_path, default `""`) - Optional known_hosts file. Empty uses libssh defaults.
- `verifyHost` (boolean, default `true`) - Verify the server host key against known_hosts.
- `acceptUnknownHost` (boolean, default `false`) - Add an unknown host key to known_hosts when verifyHost is enabled.

**timeouts**
- `timeoutMs` (duration_ms, 1-300000, default `30000`) - Connect and command timeout in ms.

**output**
- `exitStatus` (integer) - Remote command exit status.
- `storeAs` (string, default `"ssh"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "command": "",
  "host": "",
  "kind": "sshExec",
  "port": 22,
  "storeAs": "ssh",
  "timeoutMs": 30000,
  "username": ""
}
```

### OCR

#### Unload Model

List or unload loaded local model instances for this xBlox process.

Params:

**lifecycle**
- `action` (enum, default `"List"`, enum: List|Unload) - List loaded models in this xBlox process, or unload one by key.
- `key` (string, default `"llama:vlm"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (string, default `"modelKey"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "action": "Unload",
  "key": "llama:vlm",
  "kind": "ocrModelControl",
  "storeAs": "modelKey"
}
```

---

#### OCR Text

Ready-to-go document OCR: PP-DocLayoutV3 detects layout, PaddleOCR-VL extracts text/tables, and child items can iterate documents.

Params:

**source_model**
- `input` (image_path, required, from PREVIOUS, resolve: variables+globs) - Input image path or glob. Default: PREVIOUS chain value.
- `provider` (enum, default `"auto"`, enum: auto|layout|table|text|vlm|paddle) - OCR runtime. Default: auto (PP-DocLayoutV3 + PaddleOCR-VL). layout/table/text force the VLM prompt; paddle uses raw ONNX PaddleOCR. Empty falls back to App Settings ocr_provider, then image_recognition_provider.
- `mode` (enum, default `"layout"`, enum: layout|table|text) - Layout-table routing when provider=auto. Default: layout (detect tables first, then choose OCR: vs Table Recognition:).
- `model` (string, default `""`, resolve: variables+deep) - Local OCR VLM model id or GGUF path. Default: empty → first OCR-slot VLM (prefers PaddleOCR-VL), else App Settings ocr_model / image_recognition_model.

**vlm_prompt**
- `prompt` (prompt, default `"OCR: Extract all text verbatim, preserving line breaks and spatial layout."`) - VLM prompt override for provider=vlm only. Default: OCR: Extract all text verbatim… Layout/table/text providers choose OCR: or Table Recognition: automatically.

**output**
- `json` (boolean, default `true`) - Structured JSON document array vs plain markdown. Default: true.
- `markdown` (boolean, default `true`) - Include markdown on each JSON document. Default: true.
- `result` (json_value) - OCR document array when json=true; markdown string when json=false.
- `storeAs` (string, default `"ocr"`) - Variable name for PREVIOUS / downstream blocks. Default: ocr.

**runtime**
- `backend` (enum, default `"auto"`, enum: auto|cpu|gpu|cuda|coreml|metal) - ONNX Runtime EP for PP-DocLayoutV3 / PaddleOCR ONNX. Default: auto.
- `threads` (integer, 1-64, default `4`) - CPU threads for ONNX and VLM inference. Default: 4.

**layout_model**
- `layoutModel` (file_path, default `""`) - Override PP-DocLayoutV3.onnx path. Default: empty → auto-discover PP-DocLayoutV3.onnx under ${MODELS_DIR} then install models (exe/../models).
- `layoutConf` (float, 0-1, default `0.5`) - Minimum PP-DocLayoutV3 region confidence. Default: 0.5.

**onnx_model_overrides**
- `detModel` (file_path, default `""`) - Override PaddleOCR det ONNX path. Default: empty → en_PP-OCRv3_det_infer.onnx from paddleocr-en preset under model roots.
- `recModel` (file_path, default `""`) - Override PaddleOCR rec ONNX path. Default: empty → en_PP-OCRv4_rec_infer.onnx (or v3) from paddleocr-en preset under model roots.
- `dict` (file_path, default `""`) - Override OCR character dictionary. Default: empty → en_dict.txt from paddleocr-en preset.

**onnx_options**
- `threshold` (float, 0-1, default `0.3`) - PaddleOCR detection probability threshold. Default: 0.3.
- `recThreshold` (float, 0-1, default `0.5`) - PaddleOCR recognition confidence threshold. Default: 0.5.
- `maxSize` (integer, 32-4096, default `960`) - PaddleOCR detector max image side after resize (px). Default: 960.

**vlm_runtime**
- `maxTokens` (integer, 1-32768, default `2048`) - VLM max generated tokens. Default: 2048.
- `ctx` (integer, 512-131072, default `8192`) - VLM context length. Default: 8192.
- `gpuLayers` (integer, -1-999, default `-1`) - VLM GPU layer offload (-1 = all, 0 = CPU). Default: -1.

Features: iterable background cancellable

Children:
- **items** (For each document, role: body)

Default block:

```json
{
  "backend": "auto",
  "ctx": 8192,
  "detModel": "",
  "dict": "",
  "gpuLayers": -1,
  "input": "",
  "items": [],
  "json": true,
  "kind": "ocrText",
  "layoutConf": 0.5,
  "layoutModel": "",
  "markdown": true,
  "maxSize": 960,
  "maxTokens": 2048,
  "mode": "layout",
  "model": "",
  "prompt": "OCR: Extract all text verbatim, preserving line breaks and spatial layout.",
  "provider": "auto",
  "recModel": "",
  "recThreshold": 0.5,
  "storeAs": "ocr",
  "threads": 4,
  "threshold": 0.3
}
```

### Service

#### Create Category

POST /api/categories.

Params:

**input**
- `name` (string, required, default `""`, resolve: variables+deep) - Category display name.
- `slug` (string, default `""`, resolve: variables+deep) - Optional slug (derived from name when empty).

**meta**
- `description` (string, default `""`, resolve: variables+deep) - Optional description.
- `visibility` (string, default `""`, resolve: variables+deep) - public | unlisted | private.
- `parentId` (string, default `""`, resolve: variables+deep) - Optional parent category UUID.
- `relationType` (string, default `""`, resolve: variables+deep) - Relation type for the parent link.
- `type` (string, default `"pages"`, resolve: variables+deep) - Stored as meta.type.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"category"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceCategoriesCreate",
  "storeAs": "category",
  "type": "pages"
}
```

---

#### Get Category

GET /api/categories/{categoryId}.

Params:

**input**
- `categoryId` (string, required, default `""`, resolve: variables+deep) - Category UUID.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"category"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceCategoriesGet",
  "storeAs": "category"
}
```

---

#### Category Items

GET /api/categories/{slug}/items.

Params:

**input**
- `slug` (string, required, default `""`, resolve: variables+deep) - Category slug.

**filter**
- `limit` (integer, 0-1000, default `0`) - Optional item limit (0 = server default).
- `includeDescendants` (boolean, default `true`) - Include descendant category items.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"items"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "includeDescendants": true,
  "kind": "serviceCategoriesItems",
  "storeAs": "items"
}
```

---

#### List Categories

GET /api/categories  -  list categories (default: own only; optional parentSlug / includeChildren / type).

Params:

**input**
- `userId` (string, default `""`, resolve: variables+deep) - Owner UUID for own-only list (default: current app user).
- `parentSlug` (string, default `""`, resolve: variables+deep) - Optional parent category slug.

**filter**
- `all` (boolean, default `false`) - List all visible categories, not just own.
- `includeChildren` (boolean, default `false`) - Include nested children.
- `lang` (string, default `""`, resolve: variables+deep) - Optional Accept-Language / lang query.
- `type` (string, default `"pages"`, resolve: variables+deep) - Category meta.type filter (default: pages).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"categories"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceCategoriesList",
  "storeAs": "categories",
  "type": "pages"
}
```

---

#### Remove Category

DELETE /api/categories/{categoryId} after checking meta.type.

Params:

**input**
- `categoryId` (string, required, default `""`, resolve: variables+deep) - Category UUID.

**filter**
- `type` (string, default `"pages"`, resolve: variables+deep) - Expected meta.type (default: pages).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"removeResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceCategoriesRemove",
  "storeAs": "removeResult",
  "type": "pages"
}
```

---

#### Update Category

PATCH /api/categories/{categoryId}.

Params:

**input**
- `categoryId` (string, required, default `""`, resolve: variables+deep) - Category UUID.
- `name` (string, default `""`, resolve: variables+deep) - Replacement name.
- `slug` (string, default `""`, resolve: variables+deep) - Replacement slug.

**meta**
- `description` (string, default `""`, resolve: variables+deep) - Replacement description.
- `visibility` (string, default `""`, resolve: variables+deep) - public | unlisted | private.
- `type` (string, default `"pages"`, resolve: variables+deep) - Stored as meta.type.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"category"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceCategoriesUpdate",
  "storeAs": "category",
  "type": "pages"
}
```

---

#### List Files

GET /api/vfs/ls/{mount}/{path}  -  list files in a VFS directory.

Params:

**input**
- `mount` (string, default `"home"`, resolve: variables+deep) - VFS mount name. Supports ${var} interpolation.
- `path` (string, default `""`, resolve: variables+deep) - Directory path within the mount (empty = root). Supports ${var} interpolation.

**vfs**
- `includeSize` (boolean, default `true`) - Include file/directory sizes in the listing (CLI default).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"fileList"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceFilesList",
  "mount": "home",
  "path": "",
  "storeAs": "fileList"
}
```

---

#### Read File

GET /api/vfs/read/{mount}/{path}  -  download a VFS file. Set downloadAs to save to disk (PREVIOUS = saved path); else PREVIOUS = body string.

Params:

**input**
- `mount` (string, default `"home"`, resolve: variables+deep) - VFS mount name. Supports ${var} interpolation.
- `path` (string, required, default `""`, resolve: variables+deep) - File path within the mount. Supports ${var} interpolation.

**download**
- `downloadAs` (output_path, default `""`, constraints: writable+createParents, resolve: variables+custom+deep) - Save response body to this path. Supports ${var} interpolation. Parent directories are created automatically. Empty = return body as string.
- `overwrite` (boolean, default `false`) - Re-download even when downloadAs already exists (default: skip existing).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"fileContent"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceFilesRead",
  "mount": "home",
  "storeAs": "fileContent"
}
```

---

#### Remove File

DELETE /api/vfs/delete/{mount}/{path}  -  remove a file or folder from the VFS.

Params:

**input**
- `mount` (string, default `"home"`, resolve: variables+deep) - VFS mount name. Supports ${var} interpolation.
- `path` (string, required, default `""`, resolve: variables+deep) - File or folder path to remove. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"removeResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceFilesRemove",
  "mount": "home",
  "storeAs": "removeResult"
}
```

---

#### Search Files (VFS)

GET /api/vfs/search/{mount}/{path}?q=...&type=...&maxResults=...&fts=1  -  search VFS files by filename walk (default) or PostgreSQL FTS index (fts=1). FTS only reflects the last index run; fresh uploads may not appear until the index is rebuilt. PREVIOUS = {results:[...], total:N, truncated:bool}.

Params:

**input**
- `q` (string, required, default `""`, resolve: variables+deep) - Search query (min 2 chars). Supports ${var} interpolation.
- `mount` (string, default `"home"`, resolve: variables+deep) - VFS mount name (e.g. "home", "shared").
- `path` (string, default `""`, resolve: variables+deep) - Subpath to restrict search within (optional).

**filter**
- `type` (enum, default `"all"`, enum: all|file|dir) - Node type filter.
- `maxResults` (integer, 1-500, default `200`) - Max results (server cap: 500).
- `fts` (integer, 0-1, default `0`) - 1 = use PostgreSQL full-text index (fast, but stale for fresh uploads). 0 = live filesystem walk (slower, always current).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"searchResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "auth": "auto",
  "fts": 0,
  "kind": "serviceFilesSearch",
  "maxResults": 200,
  "mount": "home",
  "storeAs": "searchResult",
  "type": "all"
}
```

---

#### Upload File

POST /api/vfs/upload/{mount}/{remotePath}  -  upload any file to the VFS. Default conflict: if-newer (overwrite older remotes; skip when remote is newer or the same).

Params:

**input**
- `file` (file_path, default `""`, constraints: mustExist+readable, resolve: variables+custom+deep) - Local file path to upload. Supports ${var} interpolation. Use 'files' for multiple.
- `files` (args_list, resolve: variables+custom+deep) - Multiple local file paths. Each is uploaded separately.

**vfs**
- `mount` (string, default `"home"`, resolve: variables+deep) - VFS mount name (e.g. home). Supports ${var} interpolation.
- `remoteDir` (string, default `""`, resolve: variables+deep) - Remote VFS directory. Each file is placed under this path as its filename. Empty = mount root. Prefer public=true for the shared public folder.
- `public` (boolean, default `false`) - Upload into home/public (same as remoteDir=public). Filebrowser links use ?mode=thumb&file=…
- `remotePath` (string, default `""`, resolve: variables+deep) - Exact remote VFS path for one file (overrides remoteDir). Supports ${var} interpolation.

**conflict**
- `conflict` (enum, default `"if-newer"`, enum: if-newer|skip|overwrite) - Conflict policy. if-newer (default) overwrites older remotes; skip leaves existing; overwrite always replaces.
- `skip` (boolean, default `false`) - Skip when the remote file already exists (any age).
- `overwrite` (boolean, default `false`) - Always replace the remote file.
- `ifNewer` (boolean, default `false`) - Overwrite remote only when the local file is newer (default policy).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `failed` (integer) - Number of files that failed to upload (files[] mode).
- `storeAs` (string, default `"fileResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "conflict": "if-newer",
  "kind": "serviceFilesUpload",
  "mount": "home",
  "storeAs": "fileResult"
}
```

---

#### Upload Image(s)

POST /api/images?forward=vfs&original=true  -  multipart upload one or more image files. PREVIOUS = array of per-file response objects.

Params:

**input**
- `file` (file_path, default `""`, constraints: mustExist+readable, resolve: variables+custom+deep) - Single image file path to upload. Supports ${var} interpolation. Use 'files' for multiple.
- `files` (args_list, resolve: variables+custom+deep) - Multiple image file paths. Each is uploaded separately.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `failed` (integer) - Number of files that failed to upload.
- `storeAs` (string, default `"uploadResults"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceImagesUpload",
  "storeAs": "uploadResults"
}
```

---

#### Create Page

POST /api/pages  -  create a CMS page. Provide slug + title + content, or a full body JSON object.

Params:

**input**
- `slug` (string, default `""`, resolve: variables+deep) - Page slug (URL-safe identifier). Required unless 'body' or 'markdownFile' is set. Supports ${var} interpolation.
- `title` (string, default `""`, resolve: variables+deep) - Page title. Supports ${var} interpolation.
- `markdownFile` (string, default `""`, resolve: variables+custom+deep) - Local .md/.page file to publish (same as CLI pages create). Supports ${var} interpolation.
- `content` (prompt, default `""`, resolve: variables+deep) - Page content (Markdown). Wrapped as a markdown-text widget. Supports ${var} interpolation.
- `body` (json_value) - Full POST body as JSON object  -  overrides all individual params.

**images**
- `includeImages` (boolean, default `false`) - Extract co-located image refs from markdownFile, upload to home/public, rewrite refs.
- `conflict` (enum, default `"if-newer"`, enum: if-newer|skip|overwrite) - Image upload conflict policy when includeImages is true.
- `skip` (boolean, default `false`) - Skip existing remote images.
- `overwrite` (boolean, default `false`) - Always replace remote images.
- `ifNewer` (boolean, default `false`) - Replace remote images only when local is newer.

**meta**
- `useFrontmatter` (boolean, default `true`) - When markdownFile is .md, apply YAML front matter to title/slug/tags/category.
- `tags` (string, default `""`, resolve: variables+deep) - Comma-separated tag list. Supports ${var} interpolation.
- `description` (string, default `""`, resolve: variables+deep) - Optional page description (stored in meta.description).
- `parent` (string, default `""`, resolve: variables+deep) - Optional parent page UUID or slug.
- `categoryId` (string, default `""`, resolve: variables+deep) - Category slug, display name, or UUID. Missing cats are created in user space on the server.
- `categoryIds` (args_list) - Multiple category slugs/names/UUIDs. Missing cats are created in user space on the server.
- `private` (boolean, default `false`) - Create with is_public=false.
- `hidden` (boolean, default `false`) - Create with visible=false (default is link-only).
- `visibility` (enum, default `""`, enum: |public|listed|private) - Page visibility: listed=link-only (default), public=listed in feeds, private.
- `ownerId` (string, default `""`, resolve: variables+deep) - Owner user UUID (default: from zitadel-oauth.json).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"page"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePagesCreate",
  "storeAs": "page",
  "visibility": "listed"
}
```

---

#### Get Page

GET /api/user-page/{identifier}/{slug}  -  fetch a single page by pageId or ownerId/userId + slug.

Params:

**input**
- `pageId` (string, default `""`, resolve: variables+deep) - Page UUID. If empty, slug lookup is used. Supports ${var} interpolation.
- `slug` (string, default `""`, resolve: variables+deep) - Page slug for lookup when pageId is empty. Supports ${var} interpolation.
- `ownerId` (string, default `""`, resolve: variables+deep) - Owner user UUID or username for slug lookup. Defaults to logged-in app user when empty.

**lookup**
- `userId` (string, default `""`, resolve: variables+deep) - Alias/fallback for ownerId in slug lookup. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"page"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePagesGet",
  "storeAs": "page"
}
```

---

#### List Pages

GET /api/pages?userId=...&page=...&limit=...  -  list pages.

Params:

**input**
- `userId` (string, default `""`, resolve: variables+deep) - Filter by owner user UUID. Supports ${var} interpolation.

**pagination**
- `page` (integer, 1-10000, default `1`) - Page number (1-based).
- `limit` (integer, 1-200, default `20`) - Results per page.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"pages"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePagesList",
  "limit": 20,
  "page": 1,
  "storeAs": "pages"
}
```

---

#### Remove Page

DELETE /api/pages/{pageId}; or resolve ownerId/userId + slug before deleting.

Params:

**input**
- `pageId` (string, default `""`, resolve: variables+deep) - Page UUID. If empty, slug lookup is used. Supports ${var} interpolation.
- `slug` (string, default `""`, resolve: variables+deep) - Page slug for lookup when pageId is empty. Supports ${var} interpolation.
- `ownerId` (string, default `""`, resolve: variables+deep) - Owner user UUID or username for slug lookup. Defaults to logged-in app user when empty.

**lookup**
- `userId` (string, default `""`, resolve: variables+deep) - Alias/fallback for ownerId in slug lookup. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"removeResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePagesRemove",
  "storeAs": "removeResult"
}
```

---

#### Update Page

PATCH /api/pages/{pageId}; or resolve ownerId/userId + slug before updating.

Params:

**input**
- `pageId` (string, default `""`, resolve: variables+deep) - Page UUID. If empty, slug lookup is used. Supports ${var} interpolation.
- `slug` (string, default `""`, resolve: variables+deep) - Existing page slug for lookup when pageId is empty. Supports ${var} interpolation.
- `ownerId` (string, default `""`, resolve: variables+deep) - Owner user UUID or username for slug lookup. Defaults to logged-in app user when empty.
- `markdownFile` (string, default `""`, resolve: variables+custom+deep) - Local .md/.page file to publish. Supports ${var} interpolation.
- `content` (prompt, default `""`, resolve: variables+deep) - Replacement page content (Markdown). Wrapped as a markdown-text layout. Supports ${var} interpolation.
- `title` (string, default `""`, resolve: variables+deep) - Optional replacement page title. Supports ${var} interpolation.
- `newSlug` (string, default `""`, resolve: variables+deep) - Optional replacement page slug. Supports ${var} interpolation.
- `body` (json_value) - Full PATCH body as JSON object  -  overrides individual update params.

**lookup**
- `userId` (string, default `""`, resolve: variables+deep) - Alias/fallback for ownerId in slug lookup. Supports ${var} interpolation.

**images**
- `includeImages` (boolean, default `false`) - Extract co-located image refs from markdownFile, upload to home/public, rewrite refs.
- `conflict` (enum, default `"if-newer"`, enum: if-newer|skip|overwrite) - Image upload conflict policy when includeImages is true.
- `skip` (boolean, default `false`) - Skip existing remote images.
- `overwrite` (boolean, default `false`) - Always replace remote images.
- `ifNewer` (boolean, default `false`) - Replace remote images only when local is newer.

**meta**
- `useFrontmatter` (boolean, default `true`) - When markdownFile is .md, apply YAML front matter to title/slug/tags/category.
- `tags` (string, default `""`, resolve: variables+deep) - Comma-separated replacement tag list. Supports ${var} interpolation.
- `description` (string, default `""`, resolve: variables+deep) - Optional replacement meta description.
- `parent` (string, default `""`, resolve: variables+deep) - Optional replacement parent page UUID or slug.
- `categoryId` (string, default `""`, resolve: variables+deep) - Category slug, display name, or UUID. Missing cats are created in user space on the server.
- `categoryIds` (args_list) - Multiple category slugs/names/UUIDs. Missing cats are created in user space on the server.
- `private` (boolean, default `false`) - Set is_public=false when this flag is present.
- `hidden` (boolean, default `false`) - Set visible=false when this flag is present.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"page"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePagesUpdate",
  "storeAs": "page"
}
```

---

#### Get Picture

GET /api/pictures/{pictureId}  -  fetch a picture record.

Params:

**input**
- `pictureId` (string, required, default `""`, resolve: variables+deep) - Picture record ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"picture"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePicturesGet",
  "storeAs": "picture"
}
```

---

#### List Pictures

GET /api/pictures?userId=...&page=...&limit=...  -  list picture records.

Params:

**input**
- `userId` (string, default `""`, resolve: variables+deep) - Filter by owner user UUID. Supports ${var} interpolation.

**pagination**
- `page` (integer, 1-10000, default `1`) - Page number (1-based).
- `limit` (integer, 1-200, default `20`) - Results per page.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"pictures"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePicturesList",
  "limit": 20,
  "page": 1,
  "storeAs": "pictures"
}
```

---

#### Remove Picture

DELETE /api/pictures/{pictureId}  -  remove a picture record.

Params:

**input**
- `pictureId` (string, required, default `""`, resolve: variables+deep) - Picture record ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"removeResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePicturesRemove",
  "storeAs": "removeResult"
}
```

---

#### Create Post

Full publish flow: POST /api/posts then upload each image via /api/images and attach via /api/pictures. PREVIOUS = {postId, pictureIds, post}.

Params:

**input**
- `title` (string, default `""`, resolve: variables+deep) - Post title. Supports ${var} interpolation.
- `description` (string, default `""`, resolve: variables+deep) - Post description. Supports ${var} interpolation.

**meta**
- `visibility` (enum, default `"public"`, enum: public|listed|private) - Post visibility.
- `ownerId` (string, default `""`, resolve: variables+deep) - Owner user UUID.

**images**
- `file` (file_path, default `""`, constraints: mustExist+readable, resolve: variables+custom+deep) - Single image file to upload and attach. Supports ${var} interpolation.
- `files` (args_list, resolve: variables+custom+deep) - Multiple image files to upload and attach (positional).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"post"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePostsCreate",
  "storeAs": "post",
  "visibility": "public"
}
```

---

#### Get Post

GET /api/posts/{postId}  -  fetch a post with its pictures.

Params:

**input**
- `postId` (string, required, default `""`, resolve: variables+deep) - Post ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"post"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePostsGet",
  "storeAs": "post"
}
```

---

#### List Posts

GET /api/posts?page=...&limit=...&userId=...&visibilityFilter=...  -  list posts.

Params:

**input**
- `userId` (string, default `""`, resolve: variables+deep) - Filter by owner user UUID. Supports ${var} interpolation.

**pagination**
- `page` (integer, 1-10000, default `1`) - Page number (1-based).
- `limit` (integer, 1-200, default `20`) - Results per page.

**filter**
- `visibilityFilter` (enum, default `""`, enum: |listed|unlisted|private|non-public|all|public) - Owner-only: listed/unlisted (link-only), private, non-public, all, or public (default).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"posts"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePostsList",
  "limit": 20,
  "page": 1,
  "storeAs": "posts"
}
```

---

#### Remove Post

DELETE /api/posts/{postId}  -  remove a post.

Params:

**input**
- `postId` (string, required, default `""`, resolve: variables+deep) - Post ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"removeResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
  "kind": "servicePostsRemove",
  "storeAs": "removeResult"
}
```

---

#### Search

GET /api/search?q=...&type=...&limit=...  -  full-text search across pages, posts, pictures, VFS files and places. Auth is optional (unauthenticated calls see only public content). PREVIOUS = array of enriched FeedPost objects.

Params:

**input**
- `q` (string, required, default `""`, resolve: variables+deep) - Search query. Supports ${var} interpolation.

**filter**
- `type` (enum, default `"all"`, enum: all|pages|posts|pictures|files|places) - Content type to search (default: all).
- `limit` (integer, 1-50, default `20`) - Max results (server cap: 50).
- `sizes` (string, default `""`, resolve: variables+deep) - Comma-separated image widths for responsive variants, e.g. "320,640,1024".
- `formats` (string, default `""`, resolve: variables+deep) - Comma-separated image formats, e.g. "avif,webp".
- `visibilityFilter` (enum, default `""`, enum: |invisible|private) - Visibility filter (requires auth). empty = no filter.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"results"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "auth": "auto",
  "kind": "serviceSearch",
  "limit": 20,
  "storeAs": "results",
  "type": "all"
}
```

### Shell

#### Open Path

Open a file or folder with the OS default app, or inside Tanit.

Params:

**input**
- `path` (file_path, required, resolve: variables+deep) - File or folder path to open.

**options**
- `openIn` (enum, default `"system"`, enum: system|app|edit) - system = OS default application. app = Tanit viewer (app command open). edit = Tanit editor (app command edit).

**output**
- `storeAs` (string, default `"openedPath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "openPath",
  "openIn": "system",
  "path": "",
  "storeAs": "openedPath"
}
```

---

#### Shell

Run a shell command through the native RunTool.

Params:

**options**
- `mode` (enum, default `"shell"`, enum: shell|powershell|cmd|bash|auto|argv) - Shell interpreter: shell|powershell|cmd|bash|auto|argv.

**advanced**
- `shell` (enum, default `"auto"`, enum: auto|cmd|powershell|bash|sh) - Shell binary override. auto = platform default.
- `timeoutMs` (duration_ms, 0-3.6e+06, default `30000`) - Maximum execution time in milliseconds. 0 = no timeout.
- `log` (boolean, default `false`) - Echo stdout/stderr to the host logger.
- `stdout` (enum, default `"info"`, enum: trace|debug|info|warn|error|off) - Log level for stdout lines.
- `stderr` (enum, default `"error"`, enum: trace|debug|info|warn|error|off) - Log level for stderr lines.

**input**
- `command` (string, required, default `"echo hello"`, resolve: variables+deep) - Command or script to execute.
- `args` (args_list, default `[]`) - Argument tokens for argv mode. Each token supports variable interpolation and is quoted separately.
- `cwd` (string, default `""`, resolve: variables+deep) - Working directory (supports ${var} interpolation). Empty = default.

**output**
- `storeAs` (string, default `"stdout"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "args": [],
  "command": "echo hello",
  "kind": "shell",
  "log": false,
  "mode": "shell",
  "shell": "auto",
  "stderr": "error",
  "stdout": "info",
  "storeAs": "stdout",
  "timeoutMs": 30000
}
```

---

#### XBlox Script

Run another XBlox document directly, with context overrides and optional document-loop controls.

Params:

**lifecycle**
- `action` (enum, default `"Run"`, enum: Run|Stop|Status) - Run the script, Stop a background run keyed by path, or report Status.

**input**
- `path` (file_path, required, constraints: mustExist+readable) - XBlox document to run.
- `context` (json_value, default `{}`) - Context variables merged into the child script before it runs.

**advanced**
- `args` (args_list, default `[]`) - Advanced CLI-style overrides, e.g. --CURRENT_FILE path or --name=value. Merged after context.
- `reload` (boolean, default `false`) - Reload the child script from disk before this run. Off reuses the run-scoped cached document.
- `background` (boolean, default `false`) - Start the child script on a detached background thread and return immediately.
- `log` (boolean, default `false`) - Forward captured child stdout/stderr lines to the parent xBlox run log.
- `stdout` (enum, default `"info"`, enum: trace|debug|info|warn|error|off) - Parent run-log level for child stdout lines.
- `stderr` (enum, default `"error"`, enum: trace|debug|info|warn|error|off) - Parent run-log level for child stderr lines.
- `logLevel` (enum, default `"off"`, enum: off|trace|debug|info|warn|error) - Optional host log level for child-run summaries and collected child events.

**loop**
- `loop` (boolean, default `false`) - Override the child document loop setting and run it as a document loop.
- `loopIntervalMs` (duration_ms, 0-8.64e+07, default `100`) - Loop interval override in milliseconds. 0 = as fast as possible.
- `loopReset` (boolean, default `false`) - Reset child scope every loop pass instead of persisting variables.

**output**
- `storeAs` (string, default `"xbloxResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "action": "Run",
  "args": [],
  "background": false,
  "context": {},
  "items": [],
  "kind": "xbloxRun",
  "log": false,
  "logLevel": "off",
  "path": "",
  "reload": false,
  "stderr": "error",
  "stdout": "info",
  "storeAs": "xbloxResult"
}
```

### Video

#### Picture Out

Encode a frame handle (or pass-through image) to a file on disk. The exit from the in-memory filter pipeline. Stores the written path in PREVIOUS / storeAs.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`) - Frame handle (mem://...) from a previous filter, or an image path.
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output file path (.jpg/.png/.bmp). Required.

**advanced**
- `quality` (integer, 1-100, default `90`) - JPEG quality (1-100).

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "input": "",
  "kind": "pictureOut",
  "outputPath": "",
  "quality": 90,
  "storeAs": "imagePath"
}
```

---

#### Capture Image / Video

Capture a still image or record a camera, screen, or window source to H.264 MP4. HQ zoom/follow/interactive zoom require Windows fast (WGC) capture. Optional audio mux is 48 kHz stereo AAC. Optional skin / lips / teeth / faceGain / warmth / undereye / redness / eyeSharpen / mirror / blur / background apply to the full-frame camera, or to the PiP webcam when cameraOverlay is on (screen stays on fast WGC). preview use the CPU path as `video record`. Optional hud / hudMode shows the Capture overlay or taskbar while Still, Record, or Start is running. Stores the output path in PREVIOUS / storeAs.

Params:

**mode**
- `action` (enum, default `"Still"`, enum: Still|Record|Start|Update|Status|Stop) - Still = one frame; Record = capture MP4 until duration/cancel; Start keeps recording under instance; Update changes its viewport; Status reports it; Stop finalizes it.

**input**
- `input` (video_input, default `""`) - Camera device name, screen/window spec (screen:current / screen for the monitor of the launching window, screen:N, screen:N:wintitle=GLOB, screen:N:hwnd=ID), image (.png/.jpg), or video file (.mp4). Empty = preferred camera.

**recording**
- `instance` (string, default `""`) - Recording instance name for Start/Stop. Use the same name to stop and finalize the recording.
- `fps` (integer, 1-240, default `30`) - Target recording frame rate.
- `bitrateKbps` (integer, 0-100000, default `0`) - H.264 bitrate in Kbps for fast (WGC) recording. 0 = automatic from resolution and fps. Ignored on compat fallback.
- `captureEngine` (enum, default `"auto"`, enum: auto|fast|compat) - auto = prefer fast Windows WGC; fast = require it (zoom/follow/bitrate); compat = portable frame-pump fallback (no zoom/follow/bitrate).
- `encoder` (enum, default `"auto"`, enum: auto|nvenc|mediaFoundation) - Fast Windows capture encoder: auto tries the optional NVIDIA plugin then Media Foundation; nvenc requires NVIDIA hardware; mediaFoundation uses the Windows encoder.
- `durationMs` (duration_ms, 0-8.64e+07, default `0`) - Record action only: stop after this many ms. 0 = record until cancellation or stopKey. Start ignores this and runs until Stop or stopKey.
- `pauseKey` (shortcut, default `""`) - Optional global shortcut that toggles recording pause/resume, e.g. F9 or Ctrl+Shift+P. Empty disables it.
- `stopKey` (shortcut, default `""`) - Optional global shortcut that stops and finalizes recording, e.g. F10 or Ctrl+Shift+S. Empty disables it.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path (.jpg/.png for Still, .mp4 for Record/Start). Empty = auto temp file.

**capture_options**
- `includeCursor` (boolean, default `true`) - Window fast recording: include the mouse cursor in the captured MP4 when supported.
- `width` (integer, 0-7680, default `0`) - Preferred width in pixels. 0 = device default.
- `height` (integer, 0-4320, default `0`) - Preferred height in pixels. 0 = device default.
- `timeoutMs` (duration_ms, 100-30000, default `5000`) - Max ms to wait for first frame.

**viewport**
- `aspectRatio` (enum, default `"source"`, enum: source|16:9|9:16|4:3|3:4|1:1|21:9|3:2|2:3|custom) - Output and zoom-viewport aspect ratio. Kept through interactive zoom and cursor follow. source = capture region; custom uses aspectCustomW/H. Pair with sizeMode fill for a hard crop.
- `aspectCustomW` (integer, 1-100, default `16`) - Custom aspect ratio width part (e.g. 16 in 16:10). Only used when aspectRatio is custom.
- `aspectCustomH` (integer, 1-100, default `9`) - Custom aspect ratio height part (e.g. 10 in 16:10). Only used when aspectRatio is custom.
- `sizeMode` (enum, default `"native"`, enum: native|pad|fit|fill) - Fixed-canvas layout: native/pad preserve 1:1 pixels when possible, fit shows the full region, fill crops to cover.
- `zoom` (float, 1-32, default `1.0`) - Viewport zoom multiplier. Update changes zoom without restarting capture or encoding.
- `follow` (enum, default `"none"`, enum: none|anchor|cursor) - Keep the initial picked anchor fixed, or smoothly follow the Windows cursor.
- `followSpeed` (float, 0.01-1, default `0.2`) - Per-update cursor-follow interpolation factor.
- `followDeadzone` (integer, 0-1000, default `3`) - Source pixels the cursor may move before the viewport follows.
- `transitionMs` (duration_ms, 0-10000, default `300`) - Smooth zoom transition duration.
- `updateIntervalMs` (duration_ms, 1-1000, default `16`) - Interactive/follow tracking interval.
- `focusX` (float, -1-1, default `-1.0`) - Optional normalized horizontal focus point; -1 keeps the picked anchor.
- `focusY` (float, -1-1, default `-1.0`) - Optional normalized vertical focus point; -1 keeps the picked anchor.
- `interactiveZoom` (boolean, default `false`) - While recording, Shift+mouse-wheel changes zoom around the cursor.
- `zoomStep` (float, 0.01-2, default `0.15`) - Zoom multiplier increment per Shift+wheel notch.
- `zoomMin` (float, 1-32, default `1.0`) - Minimum interactive zoom.
- `zoomMax` (float, 1-32, default `4.0`) - Maximum interactive zoom.
- `consumeZoomInput` (boolean, default `true`) - Prevent Shift+wheel from also reaching the application under the cursor.
- `showZoomStatus` (boolean, default `true`) - Show a click-through recording HUD and active viewport while zoom changes.
- `hudCapture` (enum, default `"auto"`, enum: auto|exclude|visible) - Overlay capture policy. visible lets OBS and other screen recorders capture the HUD/frame; auto and exclude keep them out of captures.

**audio**
- `audioSource` (enum, default `"none"`, enum: none|mic|desktop|mix) - Mux audio into MP4: none, mic, desktop (loopback), or mix. When enabled, audio is 48 kHz stereo AAC (no separate rate/channel params).
- `audioDevice` (device_name, default `""`) - Mic device for audioSource mic/mix. Empty = app setting, then system default.
- `desktopDevice` (string, default `""`) - Loopback device substring for audioSource desktop/mix. Empty = default render device.
- `micGain` (float, 0-4, default `1.0`) - Mic level multiplier (linear) for mix mode.
- `desktopGain` (float, 0-4, default `1.0`) - Desktop/loopback level multiplier for desktop/mix.
- `filter` (enum, default `"off"`, enum: off|deepfilter|gtcrn) - Live DeepFilterNet on the AAC mux worker (mic/mix/cameraAudio). off = dry. desktop-only loopback stays dry. gtcrn is reserved.
- `filterModel` (string, default `""`) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter.
- `attenLim` (float, 0-100, default `100.0`) - Attenuation limit in dB. Default: 100.
- `postFilter` (boolean, default `false`) - Over-attenuate very noisy sections. Implies deepfilter when filter is off.
- `compensateDelay` (boolean, default `true`) - Compensate STFT / model lookahead. Default: true.
- `audioNormalize` (boolean, default `false`) - Reserved (low risk): normalize mixed audio level before AAC encode.
- `audioAutoGain` (boolean, default `false`) - Reserved (low risk): gentle automatic gain on the microphone path.

**hud**
- `hudMode` (enum, default `"overlay"`, enum: off|taskbar|overlay|both) - Status HUD while Still / Record / Start is running. taskbar = app taskbar button. overlay = movable pill over the clock. both = combine. off = none. Separate from showZoomStatus / hudCapture.
- `hud` (boolean, default `false`) - Master switch for hudMode. Stop on the overlay or taskbar ends Record early, or finalizes a Start session. Default off.

**output**
- `storeAs` (string, default `"capturePath"`) - Variable to also store the result in (always sets PREVIOUS).

**key_overlay**
- `keyOverlay` (boolean, default `false`) - Show typed / shortcut keystrokes as an on-screen overlay while recording.
- `keyOverlayBurnIn` (boolean, default `false`) - Also burn keystrokes into the encoded MP4 (independent of hudCapture).
- `keyOverlayAlign` (enum, default `"bottom"`, enum: center|left|right|top|bottom|top-left|top-right|bottom-left|bottom-right) - VLC-style subtitle / marquee position (0/1/2/4/5/6/8/9/10).
- `keyOverlayMarginX` (integer, 0-500, default `0`) - Horizontal margin in px. 0 = auto from short edge (~1.2%).
- `keyOverlayMarginY` (integer, 0-500, default `0`) - Vertical margin in px. 0 = auto from short edge (~1.2%).
- `keyOverlayFontSize` (integer, 0-96, default `0`) - Chip font size in px. 0 = auto (~2.2% of short edge, clamped 14–32).
- `keyOverlayColor` (color, default `"#F8F9FB"`) - Key label text color.
- `keyOverlayBgColor` (color, default `"#181B21"`) - Chip background color.
- `keyOverlayAccentColor` (color, default `"#EB445A"`) - Left accent bar color.
- `keyOverlayOpacity` (float, 0-1, default `0.9`) - Overlay opacity (0–1).
- `keyOverlayHoldMs` (duration_ms, 100-10000, default `1200`) - How long each keychip stays fully visible before fading.
- `keyOverlayFadeMs` (duration_ms, 0-5000, default `450`) - Fade-out duration after hold.
- `keyOverlayMaxEntries` (integer, 1-16, default `5`) - Max stacked recent keychips; oldest are evicted.
- `keyOverlayFilter` (enum, default `"all"`, enum: all|printable|shortcuts) - all = every key; printable = letters/digits; shortcuts = modifier chords only.
- `keyOverlayStack` (enum, default `"auto"`, enum: auto|up|down) - Chip stack growth. auto = up for bottom-* (newest at screen edge), down for top/center. up/down force direction.
- `keyOverlayModifiers` (boolean, default `true`) - Prefix Ctrl/Alt/Shift/Win on displayed chords.
- `keyOverlayCapture` (enum, default `"visible"`, enum: inherit|auto|exclude|visible) - Capture policy. Default visible so keys appear in the MP4 even when hudCapture excludes the zoom HUD. inherit uses hudCapture.

**cursor**
- `cursorHighlight` (boolean, default `false`) - Soft highlight ring around the pointer (capture-visible overlay).
- `cursorHighlightColor` (color, default `"#F5C542"`) - Cursor highlight ring color.
- `cursorHighlightSize` (integer, 0-256, default `0`) - Highlight diameter in px. 0 = auto (~72).
- `cursorClicks` (boolean, default `false`) - Animate a ripple at the click point (left/right/middle).
- `cursorClickColor` (color, default `"#EB445A"`) - Left-click ripple color. Right/middle use complementary hues (+180° / +120°) derived from this.
- `cursorTrail` (boolean, default `false`) - Short motion trail behind the pointer.
- `hideCursorWhenTyping` (boolean, default `false`) - Temporarily hide highlight/trail while typing.

**camera_overlay**
- `cameraOverlay` (boolean, default `false`) - Picture-in-picture webcam over the recording (capture-visible overlay). When on, skin / lips / blur / mirror and the other face knobs apply to this PiP camera only — the screen stays on the fast recorder.
- `cameraAudio` (boolean, default `false`) - Include the webcam microphone in the recording mix (matched from Camera; combines with audioSource).
- `cameraAudioGain` (float, 0-4, default `1.0`) - Linear gain for the webcam mic (0 = mute, 1 = unity).
- `cameraInput` (video_input, default `""`) - Webcam device for the PiP / camera mic. Empty = system default camera.
- `cameraResolution` (string, default `"auto"`) - Webcam capture mode: auto (PiP-sized), max (highest native, including 4K), or a device mode like 1920x1080@30.
- `cameraPosition` (enum, default `"bottom-right"`, enum: top-left|top-right|bottom-left|bottom-right) - PiP corner on the capture monitor/window.
- `cameraSize` (float, 4-80, default `22.0`) - PiP size as percent of the short capture edge.
- `cameraShape` (enum, default `"circle"`, enum: circle|rounded|square) - Webcam mask shape (circle / rounded / square).
- `cameraBorder` (boolean, default `true`) - Draw a border around the PiP.
- `cameraBorderColor` (color, default `"#FFFFFF"`) - PiP border color.
- `cameraShadow` (boolean, default `true`) - Soft drop shadow under the PiP.

**idle**
- `autoPause` (enum, default `"off"`, enum: off|visual|audio|both) - Skip encoder writes while the capture is idle. Capture stays up. Activity = user input OR speech-mic energy OR a substantial frame change.
- `autoPauseIdleMs` (duration_ms, 0-60000, default `3000`) - Overall idle timer. No activity for this long sets PauseIdle. 0 with autoPause off.
- `autoPauseResumeMs` (duration_ms, 0-5000, default `300`) - Visual must persist this long while auto-paused. Pre-roll covers the start of the action.
- `autoPauseGridW` (integer, 8-128, default `32`) - Logical tile columns.
- `autoPauseGridH` (integer, 8-72, default `18`) - Logical tile rows.
- `autoPauseProbeW` (integer, 64-192, default `64`) - Intermediate luma width (aggregated into logical tiles).
- `autoPauseProbeH` (integer, 36-108, default `36`) - Intermediate luma height.
- `autoPausePixelDelta` (integer, 1-255, default `12`) - Luma abs-diff threshold (0–255).
- `autoPauseTilePercent` (integer, 1-100, default `8`) - Percent of a tile’s probe samples over pixelDelta.
- `autoPauseMinTiles` (integer, 1-512, default `4`) - Minimum changed logical tiles. Typing is input activity, not this gate.
- `autoPauseMinCoveragePercent` (float, 0-100, default `2.0`) - sum(activeTile.changedFraction) / gridTileCount as percent. Not bbox area.
- `autoPauseSampleFps` (integer, 1-30, default `8`) - Visual probe rate (independent of encode fps).
- `autoPauseMicWake` (boolean, default `true`) - Use speech-mic energy as activity (RMS/peak, not VAD). Desktop-only loopback ignored.
- `autoPauseMicActivityDb` (float, -90-0, default `-40.0`) - Mic activity threshold in dBFS (not speech). Swappable for WebRTC VAD later.
- `autoPauseMicHangoverMs` (duration_ms, 0-5000, default `500`) - Mic activity hold after the last hot window.
- `autoPauseKeyHoldMs` (duration_ms, 0-5000, default `750`) - Key / click / wheel hold. Not the overall idle timer.
- `autoPauseMouseHoldMs` (duration_ms, 0-5000, default `350`) - Mouse-move hold. A nudge must not keep recording for idleMs.
- `autoPauseWakeKey` (boolean, default `true`) - Count keyboard as first-class activity (ignore pauseKey/stopKey).
- `autoPauseWakeMouse` (boolean, default `true`) - Count mouse move/click/wheel as activity.
- `autoPauseMouseDeltaPx` (integer, 0-64, default `4`) - Ignore cursor jitter below this many screen pixels.
- `autoPausePrerollMs` (duration_ms, 0-2000, default `500`) - Frames kept while PauseIdle and flushed on resume.

**captions**
- `captions` (enum, default `"off"`, enum: off|sidecar) - After finalize, transcribe the encoded-timeline 16 kHz dump and write sidecars. Not a live HUD (use audioTranscribe for that).
- `captionFormat` (enum, default `"srt"`, enum: srt|vtt|sbv|all) - YouTube-accepted sidecar: SubRip, WebVTT, SubViewer, or all three.
- `captionStt` (stt_route, default `{}`) - Dictation STT route. Empty {} inherits App Settings Voice & Audio.
- `subtitleMaxChars` (integer, 8-120, default `42`) - Cue wrap width (writer, not viewport).
- `subtitleMaxLines` (integer, 1-4, default `2`) - Cue wrap line count.

**beauty**
- `skin` (boolean, default `false`) - Smooth skin (face oval minus eyes/lips). Forces the compatibility CPU recorder.
- `skinBlend` (float, 0-1, default `0.5`) - Skin mix 0..1 (0 dry / 1 wet). Same as CLI --skin-blend / --skin-strength.
- `lips` (boolean, default `false`) - Tint lips from the face mesh. Forces the compatibility CPU recorder.
- `lipsColor` (color, default `"#C45C6A"`) - Lip tint color.
- `lipsBlend` (float, 0-1, default `0.35`) - Lip tint mix 0..1. Same as CLI --lips-blend / --lips-alpha.
- `teeth` (boolean, default `false`) - Whiten teeth from the face mesh. Forces the compatibility CPU recorder.
- `teethBlend` (float, 0-1, default `0.4`) - Teeth mix 0..1. Same as CLI --teeth-blend / --teeth-strength.
- `landmarks` (boolean, default `false`) - Draw face-mesh landmarks on the frame (debug).
- `faceGain` (float, 0-1, default `0.0`) - Lift crushed face exposure (Lab L*). 0 = off. Same oval as skin. Same as CLI --face-gain.
- `warmth` (float, 0-1, default `0.0`) - Warm the face oval (Lab b*). 0 = off. Same as CLI --warmth.
- `undereye` (boolean, default `false`) - Lighten under-eye bands (dark circles). Forces the compatibility CPU recorder.
- `undereyeBlend` (float, 0-1, default `0.45`) - Under-eye mix 0..1. Same as CLI --undereye-blend.
- `redness` (boolean, default `false`) - Mute flush / acne (Lab a* toward neutral). Forces the compatibility CPU recorder.
- `rednessBlend` (float, 0-1, default `0.4`) - Redness mute mix 0..1. Same as CLI --redness-blend.
- `eyeSharpen` (boolean, default `false`) - Unsharp the eye polys after skin. Forces the compatibility CPU recorder.
- `eyeSharpenBlend` (float, 0-1, default `0.35`) - Eye sharpen mix 0..1. Same as CLI --eye-sharpen-blend.

**frame**
- `mirror` (boolean, default `false`) - Horizontal flip (webcam mirror). No model.
- `preview` (boolean, default `false`) - Live window at the captured frame size. Close the window to stop. Forces the compatibility CPU recorder. Same as CLI --preview.

**background**
- `blur` (boolean, default `false`) - Blur the non-person region (ImageSegmenter). Forces the compatibility CPU recorder.
- `blurBlend` (float, 0-1, default `0.65`) - Background blur mix 0..1. Same as CLI --blur-strength.
- `background` (boolean, default `false`) - Replace the non-person region with bgColor / bgImage.
- `bgColor` (color, default `"#1A1A1A"`) - Solid replacement color.
- `bgImage` (image_path, default `""`) - Replacement image, scaled to the frame.
- `featherPx` (integer, default `8`) - Person-mask feather in pixels.

Features: cancellable

Default block:

```json
{
  "action": "Still",
  "aspectCustomH": 9,
  "aspectCustomW": 16,
  "aspectRatio": "source",
  "attenLim": 100.0,
  "audioAutoGain": false,
  "audioDevice": "",
  "audioNormalize": false,
  "audioSource": "none",
  "autoPause": "off",
  "autoPauseGridH": 18,
  "autoPauseGridW": 32,
  "autoPauseIdleMs": 3000,
  "autoPauseKeyHoldMs": 750,
  "autoPauseMicActivityDb": -40.0,
  "autoPauseMicHangoverMs": 500,
  "autoPauseMicWake": true,
  "autoPauseMinCoveragePercent": 2.0,
  "autoPauseMinTiles": 4,
  "autoPauseMouseDeltaPx": 4,
  "autoPauseMouseHoldMs": 350,
  "autoPausePixelDelta": 12,
  "autoPausePrerollMs": 500,
  "autoPauseProbeH": 36,
  "autoPauseProbeW": 64,
  "autoPauseResumeMs": 300,
  "autoPauseSampleFps": 8,
  "autoPauseTilePercent": 8,
  "autoPauseWakeKey": true,
  "autoPauseWakeMouse": true,
  "background": false,
  "bgColor": "#1A1A1A",
  "bgImage": "",
  "bitrateKbps": 0,
  "blur": false,
  "blurBlend": 0.65,
  "cameraAudio": false,
  "cameraAudioGain": 1.0,
  "cameraBorder": true,
  "cameraBorderColor": "#FFFFFF",
  "cameraInput": "",
  "cameraOverlay": false,
  "cameraPosition": "bottom-right",
  "cameraResolution": "auto",
  "cameraShadow": true,
  "cameraShape": "circle",
  "cameraSize": 22.0,
  "captionFormat": "srt",
  "captionStt": {},
  "captions": "off",
  "captureEngine": "auto",
  "compensateDelay": true,
  "consumeZoomInput": true,
  "cursorClickColor": "#EB445A",
  "cursorClicks": false,
  "cursorHighlight": false,
  "cursorHighlightColor": "#F5C542",
  "cursorHighlightSize": 0,
  "cursorTrail": false,
  "desktopDevice": "",
  "desktopGain": 1.0,
  "device": "",
  "durationMs": 0,
  "encoder": "auto",
  "eyeSharpen": false,
  "eyeSharpenBlend": 0.35,
  "faceGain": 0.0,
  "featherPx": 8,
  "filter": "off",
  "filterModel": "",
  "focusX": -1.0,
  "focusY": -1.0,
  "follow": "none",
  "followDeadzone": 3,
  "followSpeed": 0.2,
  "fps": 30,
  "height": 0,
  "hideCursorWhenTyping": false,
  "hud": false,
  "hudCapture": "auto",
  "hudMode": "overlay",
  "includeCursor": true,
  "input": "",
  "instance": "",
  "interactiveZoom": false,
  "keyOverlay": false,
  "keyOverlayAccentColor": "#EB445A",
  "keyOverlayAlign": "bottom",
  "keyOverlayBgColor": "#181B21",
  "keyOverlayBurnIn": false,
  "keyOverlayCapture": "visible",
  "keyOverlayColor": "#F8F9FB",
  "keyOverlayFadeMs": 450,
  "keyOverlayFilter": "all",
  "keyOverlayFontSize": 0,
  "keyOverlayHoldMs": 1200,
  "keyOverlayMarginX": 0,
  "keyOverlayMarginY": 0,
  "keyOverlayMaxEntries": 5,
  "keyOverlayModifiers": true,
  "keyOverlayOpacity": 0.9,
  "keyOverlayStack": "auto",
  "kind": "videoCapture",
  "landmarks": false,
  "lips": false,
  "lipsBlend": 0.35,
  "lipsColor": "#C45C6A",
  "micGain": 1.0,
  "mirror": false,
  "outputPath": "",
  "pauseKey": "",
  "postFilter": false,
  "preview": false,
  "redness": false,
  "rednessBlend": 0.4,
  "showZoomStatus": true,
  "sizeMode": "native",
  "skin": false,
  "skinBlend": 0.5,
  "stopKey": "",
  "storeAs": "capturePath",
  "subtitleMaxChars": 42,
  "subtitleMaxLines": 2,
  "teeth": false,
  "teethBlend": 0.4,
  "timeoutMs": 5000,
  "transitionMs": 300,
  "undereye": false,
  "undereyeBlend": 0.45,
  "updateIntervalMs": 16,
  "warmth": 0.0,
  "width": 0,
  "zoom": 1.0,
  "zoomMax": 4.0,
  "zoomMin": 1.0,
  "zoomStep": 0.15
}
```

##### Examples

**Timed screen record with desktop audio** (48 kHz stereo AAC muxed into MP4)

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "screen:0",
  "outputPath": "${KNOWNFOLDER:Videos}/screen-recordings/demo.mp4",
  "width": 1920,
  "height": 1080,
  "sizeMode": "fill",
  "fps": 30,
  "bitrateKbps": 18000,
  "captureEngine": "auto",
  "encoder": "auto",
  "audioSource": "desktop",
  "durationMs": 15000,
  "storeAs": "capturePath"
}
```

`durationMs: 0` records until the run is cancelled. `bitrateKbps: 0` lets the fast encoder pick a rate from resolution and fps.

**Portrait short with cursor follow**

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "screen:0",
  "outputPath": "${KNOWNFOLDER:Videos}/short.mp4",
  "width": 1080,
  "height": 1920,
  "sizeMode": "fill",
  "follow": "cursor",
  "followSpeed": 0.2,
  "bitrateKbps": 20000,
  "fps": 30,
  "interactiveZoom": true,
  "pauseKey": "F9"
}
```

**Start → Update → Stop** (non-blocking; change zoom/follow without restarting encoder or audio)

```json
{
  "kind": "videoCapture",
  "action": "Start",
  "instance": "demo",
  "input": "screen:0",
  "outputPath": "${KNOWNFOLDER:Videos}/demo.mp4",
  "width": 1080,
  "height": 1080,
  "sizeMode": "fill",
  "fps": 30,
  "storeAs": "capturePath"
}
```

```json
{
  "kind": "videoCapture",
  "action": "Update",
  "instance": "demo",
  "zoom": 1.8,
  "follow": "cursor",
  "transitionMs": 350
}
```

```json
{ "kind": "videoCapture", "action": "Stop", "instance": "demo" }
```

**Screen + PiP webcam** (fast WGC). `skin` / `blur` / `mirror` apply to the overlay camera only.

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "screen:0",
  "outputPath": "${KNOWNFOLDER:Videos}/screen-pip.mp4",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "cameraOverlay": true,
  "cameraPosition": "bottom-right",
  "mirror": true,
  "skin": true,
  "blur": true,
  "storeAs": "capturePath"
}
```

**Webcam → MP4** (empty `input` = default camera; `videoListDevices` lists names)

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "",
  "outputPath": "${KNOWNFOLDER:Videos}/cam.mp4",
  "width": 1280,
  "height": 720,
  "fps": 30,
  "durationMs": 8000,
  "storeAs": "capturePath"
}
```

**Mirror** (horizontal flip; no model). Face beauty, blur, and `virtualOut` also force the compatibility CPU pump — WGC zoom / follow / `bitrateKbps` do not apply.

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "",
  "outputPath": "${KNOWNFOLDER:Videos}/cam-mirror.mp4",
  "width": 1280,
  "height": 720,
  "mirror": true,
  "storeAs": "capturePath"
}
```

**Face beauty** (off unless you set a flag). `skin` is the heavy one at 1080p. `preview` opens the same live window as `video record --preview` (close it to stop; forces the CPU pump).

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "",
  "outputPath": "${KNOWNFOLDER:Videos}/cam-lips.mp4",
  "width": 1280,
  "height": 720,
  "lips": true,
  "lipsColor": "#C41E3A",
  "lipsBlend": 0.55,
  "durationMs": 8000,
  "preview": true,
  "storeAs": "capturePath"
}
```

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "",
  "outputPath": "${KNOWNFOLDER:Videos}/cam-meet.mp4",
  "width": 1280,
  "height": 720,
  "mirror": true,
  "faceGain": 0.35,
  "warmth": 0.3,
  "undereye": true,
  "redness": true,
  "eyeSharpen": true,
  "preview": true,
  "virtualOut": true,
  "storeAs": "capturePath"
}
```

**Virtual webcam** (Windows 11). Zoom / Teams see **Tanit Cam**. `outputPath` may be empty (vcam only). Output is always 1280×720 @ 30.

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "",
  "outputPath": "",
  "width": 1280,
  "height": 720,
  "mirror": true,
  "lips": true,
  "virtualOut": true,
  "storeAs": "capturePath"
}
```

**Background blur / replace** (person stays sharp). Same knobs as `video record --blur` / `--background`. Probe the runtime with `tanit-cli video filter --status`.

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "",
  "outputPath": "${KNOWNFOLDER:Videos}/cam-blur.mp4",
  "width": 1280,
  "height": 720,
  "mirror": true,
  "blur": true,
  "blurBlend": 0.65,
  "virtualOut": true,
  "storeAs": "capturePath"
}
```

```json
{
  "kind": "videoCapture",
  "action": "Record",
  "input": "",
  "outputPath": "${KNOWNFOLDER:Videos}/cam-bg.mp4",
  "width": 1280,
  "height": 720,
  "background": true,
  "bgColor": "#1A1A1A",
  "bgImage": "wall.png",
  "featherPx": 12,
  "virtualOut": true,
  "storeAs": "capturePath"
}
```

**Capture engine matrix**

| `captureEngine` | `bitrateKbps` | Zoom / follow / `sizeMode` |
|---|---|---|
| `auto` | ✅ on fast path | ✅ when fast starts |
| `fast` | ✅ (`0` = auto) | ✅ Windows WGC only |
| `compat` | ❌ ignored | ❌ native-size frame pump |

Fast `Record` / `Stop` outputs include `frames`, `droppedFrames`, `effectiveBitrateKbps`, and viewport fields. When `audioSource` is not `none`, audio is **48 kHz stereo AAC** — there are no separate sample-rate block params.

**Example flow**

```xblox
{
  "document": {
    "context": {},
    "roots": [
      {
        "kind": "stdout",
        "message": "Start HQ screen capture, zoom in while recording, then finalize."
      },
      {
        "action": "Start",
        "audioSource": "desktop",
        "bitrateKbps": 18000,
        "captureEngine": "auto",
        "follow": "cursor",
        "fps": 30,
        "height": 1080,
        "input": "screen:0",
        "instance": "demo",
        "interactiveZoom": true,
        "kind": "videoCapture",
        "outputPath": "${KNOWNFOLDER:Videos}/xblox_demo.mp4",
        "sizeMode": "fill",
        "storeAs": "capturePath",
        "width": 1080
      },
      {
        "kind": "delay",
        "ms": 3000
      },
      {
        "action": "Update",
        "follow": "cursor",
        "instance": "demo",
        "kind": "videoCapture",
        "transitionMs": 400,
        "zoom": 1.5
      },
      {
        "kind": "delay",
        "ms": 5000
      },
      {
        "action": "Stop",
        "instance": "demo",
        "kind": "videoCapture",
        "storeAs": "capturePath"
      },
      {
        "kind": "stdout",
        "message": "Saved: ${capturePath}"
      }
    ],
    "version": 1
  },
  "options": {
    "autoHeight": true,
    "defaultExpandedDepth": 3,
    "editable": false,
    "hasLog": true,
    "hasProps": true,
    "hasRunLog": true,
    "showHelp": true,
    "showLog": true,
    "showPalette": false,
    "showProps": false,
    "showRunLog": false,
    "showToolbar": true
  }
}
```

---

#### Color Adjust

Adjust brightness / contrast / saturation of a frame. Pipes a frame handle in/out.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`) - Frame handle (mem://...) from a previous filter, or an image path.

**options**
- `brightness` (float, -1-1, default `0.0`) - Brightness offset. 0 = none; -1..1 maps to ±255.
- `contrast` (float, 0-3, default `1.0`) - Contrast multiplier around mid-gray. 1 = none.
- `saturation` (float, 0-3, default `1.0`) - Saturation. 1 = none; 0 = grayscale; >1 = more vivid.

**advanced**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "brightness": 0.0,
  "contrast": 1.0,
  "input": "",
  "kind": "videoColor",
  "outputPath": "",
  "saturation": 1.0,
  "storeAs": "imagePath"
}
```

---

#### Create Video

Generate a video from a prompt using the same core create_video API as `video create`. input stills are keyframes (first / last frame); references are style/brand images. Tanit aliases (video-fast / video-deep) use LiteLLM POST /v1/videos.

Params:

**input**
- `prompt` (prompt, required) - Motion / camera / lighting prompt.

**source**
- `input` (image_path, from PREVIOUS, default `""`, resolve: variables+globs) - Keyframe stills. First path = start frame, second = end frame. Uses PREVIOUS when unset. Extra style images go in references.
- `startFrame` (image_path, default `""`) - Optional start-frame still (alias of a single input).
- `lastFrame` (image_path, default `""`) - Optional last-frame still.

**references**
- `references` (args_list, default `[]`) - Style / brand reference images (not keyframes). Sent as OpenRouter input_references.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path (.mp4). Empty = core default naming.

**model**
- `provider` (string, default `""`) - Video generation provider. Empty = App Settings video provider.
- `model` (string, default `""`, resolve: variables+deep) - Video model (video-fast, video-deep, or a Replicate slug). Empty = App Settings video model.
- `providerOptions` (json_value, default `{}`) - Extra provider fields (personGeneration, negativePrompt, …).

**request**
- `duration` (integer, 0-8, default `0`) - Seconds. Veo accepts 4 / 6 / 8. 0 = model default (4 fast / 8 deep).
- `resolution` (enum, default `"720p"`, enum: 720p|1080p|4K) - Output resolution. 4K is video-deep only.
- `aspectRatio` (enum, default `"16:9"`, enum: 16:9|9:16) - Output aspect ratio.
- `generateAudio` (boolean, default `false`) - Request native audio (higher cost on OpenRouter Veo).

**auth**
- `apiKey` (api_key, default `""`) - API key override. Empty = from App Settings.
- `baseUrl` (string, default `""`) - Provider base URL override. Empty = App Settings.

**output**
- `storeAs` (string, default `"videoPath"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "apiKey": "",
  "aspectRatio": "16:9",
  "baseUrl": "",
  "duration": 0,
  "generateAudio": false,
  "input": "",
  "kind": "videoCreate",
  "lastFrame": "",
  "model": "",
  "outputPath": "",
  "prompt": "",
  "provider": "",
  "providerOptions": {},
  "references": [],
  "resolution": "720p",
  "startFrame": "",
  "storeAs": "videoPath"
}
```

##### Examples

Same rules as CLI `video create`: `prompt` is required; `input` / `startFrame` / `lastFrame` are keyframes (at most two); `references` are style / brand, not stills to animate. Empty `provider` / `model` use Chat video settings. Tanit aliases (`video-fast` / `video-deep`) go through LiteLLM `POST /v1/videos`.

**Text-to-video** (fast, 4 s, 720p)

```json
{
  "kind": "videoCreate",
  "prompt": "A glass-top dining table in a sunlit room. Slow camera pan left to right.",
  "outputPath": "${KNOWNFOLDER:Videos}/table.mp4",
  "model": "video-fast",
  "duration": 4,
  "resolution": "720p",
  "aspectRatio": "16:9",
  "generateAudio": false,
  "storeAs": "videoPath"
}
```

**Image-to-video** (PREVIOUS or an explicit start still)

```json
{
  "kind": "videoCreate",
  "prompt": "The table gently appears; soft light sweeping across the glass.",
  "input": "first.jpg",
  "model": "video-fast",
  "duration": 4,
  "storeAs": "videoPath"
}
```

Leave `input` empty to use PREVIOUS as the start frame.

**First + last frame**

```json
{
  "kind": "videoCreate",
  "prompt": "Smooth transition between the two stills. Locked camera.",
  "startFrame": "first.jpg",
  "lastFrame": "last.jpg",
  "model": "video-fast",
  "duration": 6,
  "storeAs": "videoPath"
}
```

Two paths on `input` are the same as start + last. Do not also set `startFrame` / `lastFrame`.

**Style refs + keyframe**

```json
{
  "kind": "videoCreate",
  "prompt": "Same table, brand palette and materials from the references.",
  "input": "first.jpg",
  "references": ["mood.jpg", "logo.png"],
  "model": "video-fast",
  "duration": 4,
  "storeAs": "videoPath"
}
```

**Quality clip with audio**

```json
{
  "kind": "videoCreate",
  "prompt": "Cinematic 360 of a glass dining table with carved legs.",
  "model": "video-deep",
  "duration": 8,
  "resolution": "1080p",
  "generateAudio": true,
  "storeAs": "videoPath"
}
```

`duration` `0` uses the model default (4 on fast, 8 on deep). `4K` is `video-deep` only. See CLI overlay `video_create_examples.md` for Veo limits and list prices.

---

#### Crop

Crop a rectangular region from a frame. Pipes a frame handle in/out.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`) - Frame handle (mem://...) from a previous filter, or an image path.

**options**
- `x` (integer, 0-32768, default `0`) - Left edge (px).
- `y` (integer, 0-32768, default `0`) - Top edge (px).
- `width` (integer, 0-32768, default `0`) - Crop width (px). 0 = to right edge.
- `height` (integer, 0-32768, default `0`) - Crop height (px). 0 = to bottom edge.

**advanced**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "height": 0,
  "input": "",
  "kind": "videoCrop",
  "outputPath": "",
  "storeAs": "imagePath",
  "width": 0,
  "x": 0,
  "y": 0
}
```

---

#### Detect Objects

Capture one frame (webcam or screen) and run a YOLO model. task = detect/obb/pose -> {boxes:[{x,y,w,h,conf,cls,label,angle?,keypoints?}]}; classify -> {classes:[{cls,score,label}]}. Stores {ok, image_w, image_h, infer_ms, task, ...} in PREVIOUS / storeAs.

Params:

**source_model**
- `model` (file_path, required) - YOLO ONNX model path (required). Examples: ${MODELS_DIR}/yolov8n.onnx, yolo11n-obb.onnx, yolo11n-cls.onnx, yolo11n-pose.onnx under model roots.
- `input` (screen_input, default `""`) - Webcam device name or screen spec (screen:0, screen:0:wintitle*). Default: empty → App Settings video_capture_device, then default webcam.
- `task` (enum, default `"auto"`, enum: auto|detect|classify|obb|pose|segment) - YOLO head to decode. Default: auto (infer detect/classify/segment from model). obb and pose must be selected explicitly.

**labels_filter**
- `labels` (file_path, default `""`) - Optional YOLO labels YAML. Default: empty → classes CSV, then task default (obb: DOTA-15, classify: imagenet-classes.txt beside model, else COCO-80).
- `classes` (string, default `""`) - Comma-separated class names (index order). Default: empty. Ignored when labels is set.
- `filterClasses` (string, default `""`) - Comma-separated class names to keep. Default: empty → keep all detections.

**thresholds**
- `conf` (float, 0-1, default `0.25`) - Detection confidence threshold (0–1). Default: 0.25.
- `nms` (float, 0-1, default `0.45`) - NMS IoU threshold for detect/obb/pose. Default: 0.45.
- `topK` (integer, 1-100, default `5`) - classify task: top predictions to return. Default: 5.

**runtime**
- `inputSize` (integer, 0-4096, default `0`) - Model input size (px). Default: 0 → from metadata (detect 640, classify 224, obb 1024).
- `threads` (integer, 1-64, default `4`) - ONNX Runtime intra-op CPU threads. Default: 4.
- `provider` (enum, default `"gpu"`, enum: gpu|auto|cpu|cuda) - ONNX execution provider. Default: gpu (CUDA required). auto = CUDA then CPU fallback.
- `gpuStats` (boolean, default `false`) - Attach NVIDIA VRAM telemetry when activeProvider=cuda. Default: false.
- `instance` (string, default `""`) - Named cached model/session instance across loop passes. Default: empty → hash by args.

**visualization**
- `visualize` (boolean, default `false`) - Live detection window (Win32). Default: false. Persists across loop passes.
- `visualizeMode` (enum, default `"auto"`, enum: auto|overlay|preview) - Visualization window mode. Default: auto (overlay for screen:*, preview otherwise).
- `visualizeStats` (boolean, default `true`) - Draw FPS / infer-time / class-count overlay text. Default: true.
- `visualizeLabels` (boolean, default `true`) - Draw label + confidence on boxes. Default: true.

**smoothing**
- `smoothAlpha` (float, 0-1, default `0.35`) - Temporal EMA for overlay boxes (viz only). Default: 0.35.
- `smoothAge` (integer, 0-60, default `4`) - Overlay box persistence after disappearance (viz only). Default: 4 frames.
- `smoothMinHits` (integer, 0-60, default `0`) - Frames before a track is drawn (viz only). Default: 0.

**tracking**
- `trackIds` (boolean, default `false`) - Stable track ids and per-track colors (viz only). Default: false.
- `trackTwoStage` (boolean, default `false`) - ByteTrack-style high/low association (viz only). Default: false.
- `trackConfHigh` (float, 0-1, default `0.5`) - High-confidence split for trackTwoStage (viz only). Default: 0.5.
- `trackCenter` (boolean, default `true`) - Center-distance fallback matching (viz only). Default: true.
- `trackCenterDist` (float, 0-10, default `1.2`) - Center-distance gate as multiple of mean box side (viz only). Default: 1.2.
- `trackVelBlend` (float, 0-1, default `0.7`) - Velocity EMA during dropouts (viz only). Default: 0.7.

**pose**
- `kptMinScore` (float, 0-1, default `0.3`) - Min pose keypoint score to update a joint (viz only). Default: 0.30.

**output_recording**
- `timeoutMs` (duration_ms, 100-30000, default `5000`) - Webcam capture timeout (ms). Default: 5000. Ignored for screen input.
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Optional annotated still image (.jpg/.png). Default: empty → do not save.
- `recordPath` (output_path, default `""`, constraints: writable+createParents) - Optional annotated burn-in video (.mp4). Default: empty → do not record.
- `recordFps` (integer, 1-240, default `30`) - Burn-in video frame rate when recordPath is set. Default: 30.

**output**
- `storeAs` (string, default `"detections"`) - Variable for PREVIOUS / downstream blocks. Default: detections.

Features: container cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "classes": "",
  "conf": 0.25,
  "filterClasses": "",
  "gpuStats": false,
  "input": "",
  "inputSize": 0,
  "instance": "",
  "items": [],
  "kind": "videoDetect",
  "kptMinScore": 0.3,
  "labels": "",
  "model": "",
  "nms": 0.45,
  "outputPath": "",
  "provider": "gpu",
  "recordFps": 30,
  "recordPath": "",
  "smoothAge": 4,
  "smoothAlpha": 0.35,
  "smoothMinHits": 0,
  "storeAs": "detections",
  "task": "auto",
  "threads": 4,
  "timeoutMs": 5000,
  "topK": 5,
  "trackCenter": true,
  "trackCenterDist": 1.2,
  "trackConfHigh": 0.5,
  "trackIds": false,
  "trackTwoStage": false,
  "trackVelBlend": 0.7,
  "visualize": false,
  "visualizeLabels": true,
  "visualizeMode": "auto",
  "visualizeStats": true
}
```

---

#### Grayscale

Convert a frame to grayscale (Rec.601 luma). Pipes a frame handle in/out.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`) - Frame handle (mem://...) from a previous filter, or an image path.

**advanced**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "input": "",
  "kind": "videoGrayscale",
  "outputPath": "",
  "storeAs": "imagePath"
}
```

---

#### Video Devices

List all available video capture (camera) devices.

Params:

- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Features: non-blocking

Default block:

```json
{
  "kind": "videoListDevices",
  "storeAs": "videoDevices"
}
```

---

#### List Screens

Enumerate physical monitors and visible windows. Stores {monitors:[...], windows:[...]} in PREVIOUS / storeAs.

Params:

- `storeAs` (string, default `"screens"`) - Variable for PREVIOUS / downstream blocks. Default: screens.

Features: non-blocking

Default block:

```json
{
  "kind": "videoListScreens",
  "storeAs": "screens"
}
```

---

#### Unload Model

List or unload loaded local model instances for this xBlox process.

Params:

**lifecycle**
- `action` (enum, default `"List"`, enum: List|Unload) - List loaded models in this xBlox process, or unload one by key.
- `key` (string, default `""`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (string, default `"modelKey"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "action": "Unload",
  "key": "",
  "kind": "videoModelControl",
  "storeAs": "modelKey"
}
```

---

#### Resize

Resize / resample a frame (bilinear). A 0 dimension is derived from the other to keep aspect. Pipes a frame handle in/out.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`) - Frame handle (mem://...) from a previous filter, or an image path.

**options**
- `width` (integer, 0-16384, default `0`) - Target width (px). 0 = keep aspect from height.
- `height` (integer, 0-16384, default `0`) - Target height (px). 0 = keep aspect from width.

**advanced**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "height": 0,
  "input": "",
  "kind": "videoResize",
  "outputPath": "",
  "storeAs": "imagePath",
  "width": 0
}
```

---

#### Screen Capture

Capture a single frame from a screen or window via GDI BitBlt. input: "screen:0", "screen:0:wintitle*". Stores output path in PREVIOUS / storeAs.

Params:

**input**
- `input` (screen_input, default `"screen:0"`) - Screen spec. Default: screen:0 (primary monitor). Examples: screen:current, screen:N, screen:N:wintitle=GLOB.

**advanced**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output image path (.jpg/.png). Default: empty → temp file in system temp directory.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable for PREVIOUS / downstream blocks. Default: imagePath.

Default block:

```json
{
  "input": "screen:0",
  "kind": "videoScreenCapture",
  "outputPath": "",
  "storeAs": "imagePath"
}
```

---

#### Video Source

Pump frames from a webcam, screen/window, image, or video file. With child items it runs them once per frame (PREVIOUS = frame handle)  -  a flat pipe that transcodes a clip with no for/while and no storeAs. With no items it is a one-shot grabber emitting a handle/path in PREVIOUS / storeAs.

Params:

**input**
- `input` (screen_input, default `""`) - Camera name, screen/window spec (screen:current / screen for the monitor of the launching window, screen:N, screen:N:wintitle=GLOB, screen:N:hwnd=ID), image (.png/.jpg), or video file (.mp4). Empty = preferred camera.

**one_shot_output**
- `emit` (enum, default `"both"`, enum: both|file|handle) - One-shot mode only (no child items): both = write file + cache frame; file = write only; handle = in-memory only (mem:// handle, no file).
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - One-shot output file path (.jpg/.png) for emit=file/both. Empty = auto temp file.

**pump_limits**
- `frames` (integer, 0-1e+06, default `0`) - Max frames to pump (0 = unbounded -> video files run to EOF; live sources run until durationMs/cancel). Use N for a fixed-length grab.
- `durationMs` (duration_ms, 0-8.64e+07, default `0`) - Live sources only: stop after this wall-clock budget (0 = no cap).
- `progressEvery` (integer, 0-100000, default `60`) - Pump mode: emit a progress event every N frames (child events are muted). 0 = only the final summary.

**capture_options**
- `fps` (integer, 0-240, default `0`) - Preferred capture rate for live sources. 0 = source default.
- `width` (integer, 0-7680, default `0`) - Preferred width in pixels (live sources). 0 = source default.
- `height` (integer, 0-4320, default `0`) - Preferred height in pixels (live sources). 0 = source default.
- `timeoutMs` (duration_ms, 100-30000, default `5000`) - Max ms to wait for the first frame of a live source.

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Features: container cancellable

Children:
- **items** (Pipeline, role: body)

Default block:

```json
{
  "durationMs": 0,
  "emit": "both",
  "fps": 0,
  "frames": 0,
  "height": 0,
  "input": "",
  "items": [],
  "kind": "videoSource",
  "outputPath": "",
  "progressEvery": 60,
  "storeAs": "imagePath",
  "timeoutMs": 5000,
  "width": 0
}
```

---

#### Video Writer

Append a frame (handle or image path) to an .mp4. Stateful across loop iterations  -  drive it from a for/while loop or --loop run to build a video. Finalized when the run ends. Stores the output path in PREVIOUS / storeAs.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`) - Frame handle (mem://...) from a previous filter, or an image path.
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output video path (.mp4). Required.

**options**
- `fps` (integer, 0-240, default `0`) - Output frame rate. 0 = follow the source (videoSource's detected fps; 30 if unknown). Set a value to force constant-rate output.

**advanced**
- `instance` (string, default `""`) - Optional writer id. Empty = keyed by output path. Use distinct ids for parallel writers.

**output**
- `storeAs` (string, default `"videoPath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "fps": 0,
  "input": "",
  "instance": "",
  "kind": "videoWriter",
  "outputPath": "",
  "storeAs": "videoPath"
}
```

### Vision

#### Vision Ask

Ask a local MiniCPM-style VLM about one or more images.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`, resolve: variables+globs) - Image path, glob, or PREVIOUS. Glob arrays are passed as multiple images.

**source_model**
- `frames` (json_value, default `[]`) - Additional image paths for multi-frame or comparison prompts.
- `model` (string, default `""`, resolve: variables+deep) - Local vision VLM model id/path. Empty = prefer MiniCPM-V from downloaded models.
- `slot` (enum, default `"vision"`, enum: vision|image|video) - Local model catalog slot used for auto-selection.

**prompt**
- `prompt` (prompt, default `"Describe what you see in detail."`) - Question or instruction for the vision model.

**output**
- `json` (boolean, default `true`) - When true, result is structured JSON; when false, result is only generated text.
- `includeRaw` (boolean, default `false`) - Include rawText in JSON output for debugging before normalizers were applied.
- `result` (json_value) - Structured vision response when json=true.
- `storeAs` (string, default `"vision"`) - Variable to also store the result in (always sets PREVIOUS).

**output_normalization**
- `normalizers` (flags, default `15`) - Post-process generated text for common model-output artifacts.
  - `1` Strip thinking - Remove reasoning sections such as <think>...</think>, including unclosed sections.
  - `2` Strip fences - Unwrap a single outer Markdown/code fence around the whole answer.
  - `4` Strip role labels - Remove common leading/trailing assistant role or template markers.
  - `8` Trim output - Trim leading and trailing whitespace after other normalizers.

**runtime**
- `threads` (integer, 1-64, default `8`) - CPU thread count for llama.cpp.
- `gpuLayers` (integer, -1-999, default `-1`) - GPU layers to offload. -1 = all available, 0 = CPU-only.
- `ctx` (integer, 1024-65536, default `4096`) - Context size. Use 8192+ for multi-frame prompts.
- `maxTokens` (integer, 1-8192, default `512`) - Maximum generated tokens.

Features: background cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "ctx": 4096,
  "frames": [],
  "gpuLayers": -1,
  "includeRaw": false,
  "input": "",
  "items": [],
  "json": true,
  "kind": "visionAsk",
  "maxTokens": 512,
  "model": "",
  "normalizers": 15,
  "prompt": "Describe what you see in detail.",
  "slot": "vision",
  "storeAs": "vision",
  "threads": 8
}
```

---

#### Unload Model

List or unload loaded local model instances for this xBlox process.

Params:

**lifecycle**
- `action` (enum, default `"List"`, enum: List|Unload) - List loaded models in this xBlox process, or unload one by key.
- `key` (string, default `"llama:vlm"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (string, default `"modelKey"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "action": "Unload",
  "key": "llama:vlm",
  "kind": "visionModelControl",
  "storeAs": "modelKey"
}
```

## Supported Custom Commands

| Exact ID | Label | Action | Pre-configured Args |
|:---|:---|:---|:---|
| `custom.command-mq6okpfh-b145b` | Home | `app:showhome` |  |
| `file.prev` | Previous | `app:previousfile` |  |
| `custom.command-mtlnivuv-4aae3` | Explorer | `app:togglefiletree` |  |
| `file.next` | Next | `app:nextfile` |  |
| `custom.command-mpx9r1ur-8c6df` | Assistant | `cli:llm` | `agent`<br>`--consent-ui`<br>`win32`<br>`--realtime` |
| `custom.command-mpxytlpz-bcde4` | Launcher | `app:togglelauncher` |  |
| `custom.command-mq6i351x-bdb01` | Edit | `app:edit` |  |
| `custom.command-ms1sb66o-f4ae7` | Commands | `app:togglecommandpalette` |  |
| `custom.native-search` | Search | `app:togglesearchnative` |  |
| `custom.command-mr87jv7l-cbcd4` | Edit Home | `app:edit` |  |
| `custom.command-mu1mbvt3-ecf83` | Commands | `app:togglecommandpalette` |  |
| `custom.dropdown-msx1rszr-19148` | New | `metadata` |  |
| `custom.command-msx1rszr-32ae1` | XBlox Script | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/intern/new_file.xblox`<br>`--content`<br>`{}`<br>`--ext`<br>`xblox`<br>`--variable-public`<br>`{"ext":true}` |
| `custom.command-msx1xf70-ed2f7` | Text File | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/intern/new_file.xblox`<br>`--ext`<br>`txt`<br>`--variable-public`<br>`{"ext":true}` |
| `custom.command-mtfnk3hu-47302` | Markdown File | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/intern/new_file.xblox`<br>`--variable-public`<br>`{"ext":true}`<br>`--content`<br>`# Caption`<br>`--ext`<br>`md` |
| `custom.command-mtczu1xa-c605f` | File Tab | `app:newfiletab` |  |
| `custom.command-mtfpcfxj-e1333` | Screen Recording | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-16-9.xblox` |
| `custom.command-mtox7vvr-093fc` | Voice Commands | `app:togglevoicecommand` |  |
| `custom.dropdown-mset8bmm-ad9d3` | Installer | `metadata` |  |
| `custom.command-mqj3lo3h-fed59` | Register | `cli:register-explorer` |  |
| `custom.command-mr90wbc8-2bf79` | Installer | `cli:installer` | `--no-seed` |
| `custom.command-mqj4ixcu-3a87a` | Unregister | `cli:register-explorer` | `--unregister` |
| `custom.command-712fbd00-f9ac4` | Product | `cli:transform` | `--prompt`<br>`render this as product shooting, white background, studio`<br>`--json`<br>`${CURRENT_SELECTION}` |
| `custom.command-mpch9gdx-44982` | Illustration | `cli:transform` | `--src`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`as technical illustration`<br>`--model`<br>`image-generation-deep` |
| `custom.command-mq97rchy-5fcbf` | IllustrationX | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/image-pipe-blocks.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.image-understand-speak` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/vision-pipe-speak.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mq9b2upm-93cf4` | Excel | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/vision-pipe.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mqj3feqz-72a1a` | Resize-HD | `cli:resize` | `run`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--max-width`<br>`800`<br>`--src`<br>`${CURRENT_SELECTION}`<br>`--format`<br>`jpg`<br>`--cache-dir`<br>`${ENV:PIXLWIZ}/cache/images`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_hd.jpg`<br>`--job-ui` |
| `custom.image-compress` | Compress | `cli:compress` | `run`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--max-width`<br>`800`<br>`--src`<br>`${CURRENT_SELECTION}`<br>`--format`<br>`jpg`<br>`--cache-dir`<br>`${ENV:PIXLWIZ}/cache/images`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_hd.jpg`<br>`--job-ui`<br>`--compressor`<br>`mozjpeg`<br>`--quality`<br>`92` |
| `custom.command-mszwq2g6-780cb` | To Markdown | `cli:llm` | `agent`<br>`--no-mcp`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--include`<br>`${CURRENT_FILE}`<br>`--enable-tools`<br>`image_understand,write_file`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}.md`<br>`--prompt`<br>`Create Markdown Document using the provided path to an image, and image_understand tool - dont comment, just print the result of image_understand.`<br>`--no-skills` |
| `custom.command-mtun9312-7d0e1` | Share Post | `cli:service` | `posts`<br>`create`<br>`${CURRENT_SELECTION}`<br>`--visibility`<br>`listed` |
| `custom.command-mpxzouxv-ab189` | App | `app:takescreenshot` |  |
| `custom.command-mrcja3yb-306c8` | Region | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/screenshot.xblox` |
| `custom.command-mre4dk8y-7a985` | To Markdown | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/screenshot-vision-md.xblox` |
| `custom.command-mtlh4sop-a7c1b` | New | `app:togglechat` |  |
| `custom.command-mpohnfaf-26b0c` | TTS | `app:setVariable` |  |
| `custom.command-mpokt0hv-41237` | Funny | `app:setVariable` |  |
| `custom.command-mpokxo4w-0910a` | Serious | `app:setVariable` |  |
| `custom.command-mtloapd5-06baa` | MCP | `cli:mcp` |  |
| `custom.command-mu1wob56-d1f45` | Share as Article (copy) | `cli:service` | `pages`<br>`create`<br>`--category-id`<br>`uncategorized`<br>`--private`<br>`${CURRENT_SELECTION}` |
| `custom.command-mtva51l4-2e559` | Login | `app:login` |  |
| `custom.command-mtvdak7f-00d65` | Logout | `app:logout` |  |
| `custom.view-explorer` | Explorer | `app:togglefiletree` |  |
| `custom.command-mpy7w3px-8a1e0` | Log | `app:togglelog` |  |
| `custom.command-mqkxsx6y-56346` | Center | `app:togglecenterview` |  |
| `custom.command-mtld2y23-123a4` | Chat | `app:togglechat` |  |
| `custom.command-mpy7z14t-bcef8` | Queue | `app:togglequeue` |  |
| `custom.command-mqkneqp7-3fcb0` | Console | `app:toggleconsole` |  |
| `custom.command-mr5ebav3-ec35c` | Search | `app:togglesearchnative` |  |
| `custom.command-mt8msflf-fe3b7` | Tabbed | `app:viewtabbed` |  |
| `custom.command-mt8sceaa-06010` | New File Tab | `app:newfiletab` |  |
| `custom.view-half` | 800x600 | `app:setframesize` |  |
| `custom.command-mtlnui5r-42237` | 720x1080 | `app:setframesize` |  |
| `custom.command-mtw1hthj-f17ee` | 1080x720 | `app:setframesize` |  |
| `custom.command-mtwl51se-b7440` | 1269x846 | `app:setframesize` |  |
| `custom.view-maximize` | Fullscreen | `app:togglefullscreen` |  |
| `custom.command-mtoxzgrv-1f644` | Maximize | `app:setframesize` |  |
| `custom.command-mtv9cd7k-7a458` | Reset | `app:resetlayout` |  |
| `custom.command-msqfoqej-85fb5` | Performance | `app:toggleperf` |  |
| `custom.command-70eabea6-957e6` | Spanish | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`Translate to Spanish`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_es.${SRC_EXT}`<br>`--hud` |
| `custom.command-msyzmkcu-9b027` | English | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_en.${SRC_EXT}`<br>`--prompt`<br>`Translate to English`<br>`--no-tools`<br>`--preset`<br>`Tanit-Fast`<br>`--hud`<br>`--hud-mode`<br>`both` |
| `custom.command-msyznegr-9190e` | German | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_de.${SRC_EXT}`<br>`--prompt`<br>`Translate to German` |
| `custom.command-mt0dfzrn-665b0` | French | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--prompt`<br>`Translate to French`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_fr.${SRC_EXT}` |
| `text.md2pdf` | MD->PDF | `external` | `--headless`<br>`--convert-to pdf`<br>`--outdir`<br>`${CWD}`<br>`${CURRENT_FILE}` |
| `custom.command-ms0phpqj-d1ca3` | Chrome | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-chrome.xblox` |
| `custom.command-ms33shnl-97127` | App | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-win32.xblox` |
| `custom.color-picker` | Color | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-color.xblox` |
| `custom.text-speak` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-text-speak.xblox` |
| `custom.distance` | Distance | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-distance.xblox` |
| `custom.picker-chrome-selector` | Color | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-chrome-selector.xblox` |
| `custom.command-mqauenwv-74ac8` | Mic-Journal | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/stt-journal-ex.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--journal`<br>`${KNOWNFOLDER:Documents}\journal.txt`<br>`--journalPath`<br>`C:\Users\zx/Documents/journal.txt`<br>`--recording`<br>`false`<br>`--started`<br>`false` |
| `custom.voice-cloner` | Voice Cloner | `cli:audio` | `voice-change`<br>`--remove-background-noise`<br>`${CURRENT_FILE}`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_cloned.wav`<br>`--style`<br>`0.5`<br>`--stability`<br>`1` |
| `custom.command-mrckqhx7-38b2d` | Mic-Journal | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/stt-paste.xblox` |
| `custom.command-mpxzk7g4-67590` | Voice Recorder | `cli:audio` | `record`<br>`--dst`<br>`${CONFIG_DIR}/recordings/tanit-${DD}-${HH}-${mm}.wav`<br>`--hud`<br>`--filter`<br>`deepfilter` |
| `custom.command-mtk0rcb2-f401a` | Speech to Text | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/stt-paste-whisper.xblox` |
| `custom.command-ms0q0j9j-92441` | Yamaha | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/bluetooth-yamaha.xblox` |
| `custom.mic-start` | Mic Capture Start | `cli:audio` | `record`<br>`--text-out`<br>`${KNOWNFOLDER:Config}/last.md` |
| `custom.mic-stop` | Mic Capture Stop | `cli:audio` | `record`<br>`stop` |
| `custom.command-mtn0t1b3-722de` | Voice Commands | `app:togglevoicecommand` |  |
| `custom.command-mrf5dhi8-76608` | 1:1 | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-ex.xblox` |
| `custom.command-mssrlhcu-5aa17` | 1:1-ex | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-ex.xblox` |
| `custom.command-ms4vl4ur-4569d` | 16:9 | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-16-9.xblox` |
| `custom.command-msghb0e2-e8c47` | Fixed | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-fixed.xblox` |
| `custom.video-start` | WebCam | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/webcam.xblox` |
| `custom.command-mu1wam8u-bfd55` | WebCam Beautifier | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/webcam.xblox` |
| `custom.command-d204eb95-8101e` | To Step | `external` | `<placeholder>` |
| `custom.command-msg3o7ti-d4db9` | To HTML | `external` | `<placeholder>` |
| `custom.command-msg3opko-d2e18` | BOM | `external` | `<placeholder>` |
| `custom.command-msg3p48b-0db60` | Print | `external` | `<placeholder>` |
| `custom.command-msg3pbh4-64134` | FreeCAD | `external` | `<placeholder>` |
| `custom.command-msafwmdu-b9a48` | Pose | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-detect-yolo26-pose.xblox` |
| `custom.command-msajhop7-a071b` | Segments | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-detect-yolo26-seg.xblox` |
| `custom.handbrake-hq` | Handbrake | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-encode-medium.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-video-social-hq` | Social Video HQ | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-encode-social-hq.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mr51514h-c34ec` | System | `app:edit` |  |
| `custom.command-mr50fk3n-1a7d7` | Realtime | `app:edit` |  |
| `custom.command-mppft700-137e9` | Planner | `app:edit` |  |
| `batch.start` | Start | `app:resumebatch` |  |
| `batch.pause` | Pause | `app:resumebatch` |  |
| `custom.command-mt06aefh-c364b` | Cancel | `app:cancelbatch` |  |
| `custom.view-snap-up` | Snap Up | `app:snapup` |  |
| `custom.view-snap-down` | Snap Down | `app:snapdown` |  |
| `custom.view-snap-left` | Snap Left | `app:snapleft` |  |
| `custom.view-snap-right` | Snap Right | `app:snapright` |  |
| `custom.dropdown-msaj5qk5-78a6b` | Help | `metadata` |  |
| `custom.help-cli` | CLI-Manual | `app:open` |  |
| `custom.help-xblox` | XBlox | `app:open` |  |
| `custom.command-msakytc7-dd084` | Online Help | `app:openurl` |  |
| `custom.youtube` | Youtube | `app:openurl` |  |
| `custom.command-mt4iq9cc-46e06` | test-screen | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/webcam-scheduled.xblox` |
| `custom.command-mt4msl99-55414` | Start | `app:schedulerstart` |  |
| `custom.command-mt4munur-873bb` | Stop | `app:schedulerstop` |  |
| `custom.command-mt7672eh-b7786` | To Images | `cli:pdf` | `render`<br>`${CURRENT_FILE}`<br>`--output-dir`<br>`${SRC_DIR}/${SRC_NAME}_images`<br>`--quality`<br>`100`<br>`--format`<br>`png`<br>`--pages`<br>`all`<br>`--output`<br>`${SRC_DIR}/${SRC_NAME}_images/${SRC_NAME}.png` |
| `custom.pdf-to-md` | To Markdown | `cli:pdf` | `md`<br>`${CURRENT_FILE}`<br>`--output-dir`<br>`${SRC_DIR}/${SRC_NAME}_md`<br>`--output`<br>`${SRC_DIR}/${SRC_NAME}.md` |
| `custom.command-mq9a0i3l-576f4` | OCR - MD | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/ocr-pipe.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mq9azo3w-5b894` | OCR - CSV | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/ocr-pipe-csv.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.fs-copy` | Copy | `app:fscopy` |  |
| `custom.fs-move` | Move | `app:fsmove` |  |
| `custom.command-mtvbj8xw-2ef0a` | Info | `app:fsmove` |  |
| `custom.command-mu114s8q-17bff` | Share | `cli:service` | `files`<br>`upload`<br>`${CURRENT_SELECTION}`<br>`--if-newer`<br>`--remote-dir`<br>`public` |
| `custom.command-mu1w66c6-5b959` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-text-speak.xblox` |
| `custom.command-mtum9djk-a760d` | Share as Article | `cli:service` | `pages`<br>`create`<br>`--category-id`<br>`uncategorized`<br>`--private`<br>`${CURRENT_SELECTION}` |
