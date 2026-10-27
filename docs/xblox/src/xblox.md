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
- `--mermaid-direction` (TEXT:{TD,LR,BT,RL}, default `TD`) - Flowchart direction: TD (default, vertical), LR, BT, or RL.
- `--mermaid-color` (TEXT:{edges,groups,both,none}, default `both`) - Colouring: edges (yes/no/loop/case link tints), groups (node strokes per registry group + flow diamonds), both (default), or none.
- `--expand-parameters` - Include set block parameters in mermaid node labels (default: compact labels — group/kind, set <name>, conditions on diamonds).
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

**Example**

```sh
tanit-cli xblox run --src <value>
```

**Full example**

```sh
tanit-cli xblox run --src 'foo' --commands 'foo' --event-mode 'errors' --dry-run --simulate --md --md-numbered --md-filter '{}' --mermaid --mermaid-type 'flow' --mermaid-direction 'TD' --mermaid-color 'both' --expand-parameters --no-wait --max-loop-iterations 10000 --loop --no-loop --loop-interval-ms 100 --loop-reset --loop-limit 0 --quiet --profile --arg '{}'
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

Run an LLM agent turn in-process (tool loop included) and store the answer in PREVIOUS.

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
- `aiConsentReview` (boolean, default `false`) - Run the advisory SecurityAgent reviewer before consent prompts.
- `aiConsentRouter` (string, default `""`) - Router for the advisory SecurityAgent reviewer.
- `aiConsentModel` (string, default `""`) - Model for the advisory SecurityAgent reviewer.
- `streamLog` (boolean, default `false`) - Mirror streaming assistant text deltas to the trace log.
- `json` (boolean, default `false`) - Also emit the full agent transcript as a `transcript` output.
- `contextReduction` (enum, default `"off"`, enum: off|tool-results|all) - Pre-API context reduction mode (CLI --context-reduction).
- `contextReductionRatio` (float, 0-1, default `0.5`) - Target output/input byte ratio for reduced messages.
- `contextReductionMinBytes` (integer, 0-1e+06, default `2048`) - Minimum message size before reduction applies.
- `contextReductionObjective` (string, default `""`) - Relevance objective for text reduction. Empty = user prompt.

**options**
- `preset` (string, default `""`) - Chat provider preset name. Empty = default preset from App Settings.
- `tools` (boolean, default `true`) - Allow tool calls. Off = plain completion (CLI --no-tools).

**auth**
- `apiKey` (api_key, default `""`) - API key override. Empty = from App Settings.
- `baseUrl` (string, default `""`) - Router base URL override. Empty = from App Settings.

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

**output**
- `dst` (output_path, default `""`, constraints: writable+createParents) - Write the agent response to this file (CLI --dst). Without json: raw answer text. With json: full result JSON. Parent directories are created automatically.
- `usage` (json_value) - Aggregated token usage / cost for the turn.
- `transcript` (json_value) - Full turn transcript. Populated when `json` is on.
- `storeAs` (string, default `"answer"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "embed": [],
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
- `key` (string, default `""`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

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

Interactive window / element picker with live highlight + stack HUD. Click to pick the highlighted region; Alt+wheel or [ ] cycles leaf → siblings → ∪siblings → parent; Shift+drag (or Ctrl+drag) selects a free rectangle; Z opens an 8× magnifier, C copies the sampled colour; ESC cancels. Default output is a screen spec for video/screenshot blocks; set format=md or format=html for Chrome DOM via the Tanit extension. Sampled colour and Chrome DOM selectors always ride along in the payload.

Params:

**options**
- `format` (enum, default `"screen"`, enum: screen|md|html|text|color|selector|measure) - Result format. screen = capture spec; md/html = Chrome DOM; text = plain speakable string (Chrome innerText / UIA); color = eyedropper; selector = CSS; measure = boundary-snapped point-to-point line.
- `chromeDom` (boolean, default `true`) - Chrome picks: resolve DOM/selectors in the committed payload. Off = UIA/HWND only.
- `highlight` (boolean, default `true`) - Show the translucent highlight overlay while picking.
- `hud` (boolean, default `true`) - Show the informational picker HUD. Off keeps rectangle highlighting.
- `resolveUia` (boolean, default `true`) - Resolve UIA after the cursor settles and on commit (gives sub-window precision for web content, media players, etc.).
- `showHidden` (boolean, default `true`) - Consider non-visible child windows (needed to reach Chrome_RenderWidgetHostHWND etc.).
- `siblings` (boolean, default `true`) - Include sibling panes and ∪siblings union in the Alt+wheel / [ ] stack (leaf → siblings → parent). Off = ancestors only.
- `sampleColor` (boolean, default `false`) - Region picks only: add colorHex/rgb to the payload (sampled once at click). For eyedropper use format=color instead.
- `magnifier` (boolean, default `false`) - Region/measure picks: open the 8× loupe (Z toggles).

**advanced**
- `chromePreview` (boolean, default `false`) - Show live Chrome CSS details in the HUD after the cursor settles. Uses blocking extension IPC and may feel slow on some machines.
- `colorMagnifier` (boolean, default `true`) - Color picks: show the live 8× loupe. Disable on slow software GDI/DWM machines; pixel sampling still works.
- `textMaxChars` (integer, 0-262144, default `0`) - Chrome DOM plain-text cap (innerText/speakText). 0 = unlimited (default). Set e.g. 8192 to truncate long articles.
- `timeoutMs` (integer, 1000-600000, default `60000`) - Abort the pick and return an error after this many milliseconds of inactivity. Default 60 s.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "chromeDom": true,
  "chromePreview": false,
  "colorMagnifier": true,
  "format": "screen",
  "highlight": true,
  "hud": true,
  "kind": "picker",
  "magnifier": false,
  "resolveUia": true,
  "sampleColor": false,
  "showHidden": true,
  "siblings": true,
  "timeoutMs": 60000
}
```

### Audio

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
- `key` (string, default `"vibevoice:tts"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

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

Record mic, desktop, or mixed audio to a file. outputPath extension selects format: .wav = PCM (48 kHz stereo default; long takes spill PCM to disk after ~30 s in RAM); .m4a or .aac = AAC-LC (Windows only). Stores the output path in PREVIOUS / storeAs.

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
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path; extension selects format. .wav = PCM WAV; .m4a or .aac = AAC-LC (Windows only). Default: empty → temporary .wav in the system temp directory.

**output**
- `storeAs` (string, default `"audioPath"`) - Variable for PREVIOUS / downstream blocks. Default: audioPath.

Features: cancellable

Default block:

```json
{
  "channels": 0,
  "desktopDevice": "",
  "desktopGain": 1.0,
  "device": "",
  "durationMs": 3000,
  "inputSource": "mic",
  "kind": "audioRecord",
  "micGain": 1.0,
  "outputPath": "",
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

Convert text to speech via the configured TTS provider and play it through the speakers. Supports Tanit, ElevenLabs, and local VibeVoice builds. Uses PREVIOUS string as text when text is empty. Markdown/plain-text pre-parsers run on file paths and on inline/PREVIOUS content (e.g. fsRead → audioSpeak). Stores output file path in PREVIOUS / storeAs when outputPath is set, otherwise stores the input text.

Params:

**input**
- `text` (prompt, from PREVIOUS, default `""`) - Text to speak, or path to a text file (.txt, .md, …). Files are loaded (binary rejected); inline/PREVIOUS markdown is preparsed when detected. Chain fsRead → audioSpeak with empty text to speak file contents. Default: empty → PREVIOUS string (required at runtime).

**voice_model**
- `provider` (string, default `""`) - TTS provider override. Default: empty → App Settings tts_provider (required).
- `model` (string, default `""`, resolve: variables+deep) - TTS model override. Default: empty → App Settings tts_model; pixlwiz → pixlwiz-speech when unset.
- `voice` (string, default `""`) - Voice id / UUID / GGUF path. Default: empty → App Settings tts_voice_id.

**vibevoice**
- `tokenizer` (string, default `""`) - VibeVoice tokenizer GGUF path. Default: empty (required when provider=vibevoice).
- `refAudio` (string, default `""`) - Reference WAV for VibeVoice 1.5B cloning (~5 s 24 kHz mono). Default: empty.
- `instance` (string, default `""`) - Named cached VibeVoice engine instance. Default: empty → auto-key by model/tokenizer/voice.

**device**
- `outputDevice` (device_name, default `""`) - Playback device. Default: empty → App Settings audio_output_device, then system default.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Optional synthesized audio path (.wav). Default: empty → play only, no file saved.

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

Transcribe an audio file, or record from the microphone and transcribe speech to text. When 'input' is set, the file is transcribed directly (no microphone, no duration limit). When empty, records from the microphone for up to maxDurationMs ms with optional VAD silence-gate. Prefers local Whisper when selected/available, with Tanit as a provider-backed fallback. Stores the transcript string in PREVIOUS / storeAs, or a structured STT payload when json is on.

Params:

**input**
- `input` (audio_path, from PREVIOUS, default `""`) - Input audio file (wav, mp3, …). Default: empty → record from microphone.

**recording**
- `maxDurationMs` (duration_ms, 500-120000, default `30000`) - Max mic recording duration (ms). Default: 30000. Ignored when input is set.
- `silenceMs` (duration_ms, 0-60000, default `1500`) - VAD silence stop (ms) after speech. Default: 1500. 0 = disabled. Ignored when input is set.

**device**
- `device` (device_name, default `""`) - Mic device. Default: empty → App Settings audio_input_device, then system default. Ignored when input is set.

**speech_model**
- `provider` (string, default `""`) - STT provider override. Default: empty → App Settings stt_provider (required).
- `model` (string, default `""`, resolve: variables+deep) - STT model override. Default: empty → App Settings stt_model when provider matches; whisper → base.en; pixlwiz → pixlwiz-speech-to-text.
- `providerOptions` (json_value, default `{}`) - Whisper-only options object. Defaults: backend=cpu, language=auto, threads=0 (auto), flashAttn=auto. Whisper models resolve under ${MODELS_DIR} then exe/../models.

**advanced**
- `apiKey` (api_key, default `""`) - API key override. Default: empty → App Settings providers map (not used for whisper).

**output**
- `json` (boolean, default `false`) - Return structured STT JSON vs transcript string. Default: false.
- `result` (json_value) - Structured STT payload when json=true: provider, model, transcript, duration, samples, optional wav.
- `storeAs` (string, default `"transcript"`) - Variable for PREVIOUS / downstream blocks. Default: transcript.

**debug_output**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Save captured mic WAV. Default: empty → temp file deleted after transcription.

Features: cancellable

Default block:

```json
{
  "device": "",
  "input": "",
  "json": false,
  "kind": "audioTranscribe",
  "maxDurationMs": 30000,
  "model": "",
  "outputPath": "",
  "provider": "",
  "providerOptions": {},
  "silenceMs": 1500,
  "storeAs": "transcript"
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
- `value` (json_value) - Literal value (JSON). Leave empty to use expression.
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

Create a directory (and all parents). Stores the created path in PREVIOUS / storeAs.

Params:

**input**
- `path` (dir_path, required, resolve: custom) - Folder path to create.

**output**
- `storeAs` (string, default `""`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "fsMkdir",
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

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "apiKey": "",
  "aspectRatio": "",
  "baseUrl": "",
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

#### Unload Model

List or unload loaded local model instances for this xBlox process.

Params:

**lifecycle**
- `action` (enum, default `"List"`, enum: List|Unload) - List loaded models in this xBlox process, or unload one by key.
- `key` (string, default `"llama:vlm"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

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

**output**
- `storeAs` (string, default `"imagePath"`) - Variable to also store the result in (always sets PREVIOUS).

Features: background cancellable

Default block:

```json
{
  "apiKey": "",
  "aspectRatio": "",
  "baseUrl": "",
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

Ask the vision/recognition model a question about one or more images. Same pipeline as the image_understand agent tool: cloud providers via meta_extract, local VLM via llama (provider=llama). Pure query no sidecar files written.

Params:

**input**
- `input` (image_path, required, from PREVIOUS, resolve: variables+globs) - Input image path or glob. Uses PREVIOUS when unset. Pass multiple images for comparison prompts.
- `prompt` (prompt, required) - Vision question or instruction for the recognition model.

**model**
- `provider` (string, default `""`) - Image recognition provider. Empty = App Settings image recognition provider.
- `model` (string, default `""`, resolve: variables+deep) - Image recognition model. Empty = App Settings image recognition model. For provider=llama, use a local VLM id from vision.models.vlm.
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

Features: background cancellable

Default block:

```json
{
  "apiKey": "",
  "baseUrl": "",
  "ctx": 4096,
  "gpuLayers": -1,
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
- `key` (string, default `"llama:vlm"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

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

#### List Files

GET /api/vfs/ls/{mount}/{path}  -  list files in a VFS directory.

Params:

**input**
- `mount` (string, default `"home"`, resolve: variables+deep) - VFS mount name. Supports ${var} interpolation.
- `path` (string, default `""`, resolve: variables+deep) - Directory path within the mount (empty = root). Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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

POST /api/vfs/upload/{mount}/{remotePath}  -  upload any file to the VFS.

Params:

**input**
- `file` (file_path, required, default `""`, constraints: mustExist+readable, resolve: variables+custom+deep) - Local file path to upload. Supports ${var} interpolation.

**vfs**
- `mount` (string, default `"home"`, resolve: variables+deep) - VFS mount name (e.g. home). Supports ${var} interpolation.
- `remotePath` (string, default `""`, resolve: variables+deep) - Remote VFS path (relative to mount root). Supports ${var} interpolation. Empty = local filename.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (string, default `""`, resolve: variables+deep) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (duration_ms, 1000-300000, default `30000`) - HTTP timeout in ms.

**output**
- `storeAs` (string, default `"fileResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "auth": "auto",
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `slug` (string, default `""`, resolve: variables+deep) - Page slug (URL-safe identifier). Required unless 'body' is set. Supports ${var} interpolation.
- `title` (string, default `""`, resolve: variables+deep) - Page title. Supports ${var} interpolation.
- `content` (prompt, default `""`, resolve: variables+deep) - Page content (Markdown). Wrapped as a markdown-text widget. Supports ${var} interpolation.
- `body` (json_value) - Full POST body as JSON object  -  overrides all individual params.

**meta**
- `tags` (string, default `""`, resolve: variables+deep) - Comma-separated tag list. Supports ${var} interpolation.
- `visibility` (enum, default `"public"`, enum: public|listed|private) - Page visibility: public / listed / private.
- `ownerId` (string, default `""`, resolve: variables+deep) - Owner user UUID (default: from zitadel-oauth.json).

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
  "visibility": "public"
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `content` (prompt, default `""`, resolve: variables+deep) - Replacement page content (Markdown). Wrapped as a markdown-text layout. Supports ${var} interpolation.
- `title` (string, default `""`, resolve: variables+deep) - Optional replacement page title. Supports ${var} interpolation.
- `newSlug` (string, default `""`, resolve: variables+deep) - Optional replacement page slug. Supports ${var} interpolation.
- `body` (json_value) - Full PATCH body as JSON object  -  overrides individual update params.

**lookup**
- `userId` (string, default `""`, resolve: variables+deep) - Alias/fallback for ownerId in slug lookup. Supports ${var} interpolation.

**meta**
- `tags` (string, default `""`, resolve: variables+deep) - Comma-separated replacement tag list. Supports ${var} interpolation.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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

GET /api/posts?page=...&limit=...&userId=...  -  list posts.

Params:

**input**
- `userId` (string, default `""`, resolve: variables+deep) - Filter by owner user UUID. Supports ${var} interpolation.

**pagination**
- `page` (integer, 1-10000, default `1`) - Page number (1-based).
- `limit` (integer, 1-200, default `20`) - Results per page.

**auth**
- `serverUrl` (string, default `""`, resolve: variables+deep) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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
- `auth` (enum, default `"auto"`, enum: auto|bearer|none) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `pm-image login` first). bearer = explicit bearerToken only. none = unauthenticated.
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

Open a file or folder with the system default application.

Params:

**input**
- `path` (file_path, required, resolve: variables+deep) - File or folder path to open with the system default application.

**output**
- `storeAs` (string, default `"openedPath"`) - Variable to also store the result in (always sets PREVIOUS).

Default block:

```json
{
  "kind": "openPath",
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
  "logLevel": "off",
  "path": "",
  "reload": false,
  "storeAs": "xbloxResult"
}
```

### Vector

#### Index Directory into Local Vector Store

Recursively index all supported files (txt, md, docx, xlsx, pptx) in a directory. Already-indexed paths are skipped. PREVIOUS = {files:[{file,count,skipped}], totalChunks:N, storePath, docCount}.

Params:

**input**
- `dir` (dir_path, required, default `""`, resolve: variables+deep) - Directory to index. Supports ${var}.
- `storePath` (string, required, default `""`, resolve: variables+deep) - Directory for the local vector store (created if absent). Supports ${var}.

**filter**
- `recursive` (boolean, default `true`) - Descend into subdirectories.
- `maxFiles` (integer, 1-10000, default `500`) - Hard cap on files processed in one call.

**chunking**
- `chunkSize` (integer, 50-4000, default `500`) - Max characters per chunk when splitting long text (approx 100-800 tokens).
- `chunkOverlap` (integer, 0-500, default `100`) - Overlap characters between adjacent chunks.

**advanced**
- `model` (string, default `""`, resolve: variables+deep) - Path to GGUF embedding model. Empty = auto-discover (PM_EMBED_MODEL, ${MODELS_DIR}, exe/../models).
- `threads` (integer, 1-32, default `4`) - CPU threads for llama.cpp embedding inference.
- `gpuLayers` (integer, -1-999, default `0`) - GPU offload for embedding: 0 = CPU only, -1 = all layers on GPU, >0 = first N layers. Speeds up large ingests on CUDA/Metal/Vulkan builds.

**output**
- `storeAs` (string, default `"addDirResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "chunkOverlap": 100,
  "chunkSize": 500,
  "kind": "vectorLocalAddDir",
  "maxFiles": 500,
  "recursive": true,
  "storeAs": "addDirResult"
}
```

---

#### Add File to Local Vector Store

Read a text file, chunk it, embed each chunk with the local GGUF model, insert into the store. Binary/image files and files > 1 MiB are rejected. PREVIOUS = {ids:[...], count:N, file, storePath, docCount}.

Params:

**input**
- `file` (file_path, required, default `""`, constraints: mustExist+readable, resolve: variables+custom+deep) - Path to a text file to embed and insert. Supports ${var}.
- `source` (string, default `"file"`, resolve: variables+deep) - Source label (default: file). Supports ${var}.
- `title` (string, default `""`, resolve: variables+deep) - Override title (default: filename). Supports ${var}.
- `tags` (string, default `""`, resolve: variables+deep) - JSON array of tag strings. Supports ${var}.
- `storePath` (string, required, default `""`, resolve: variables+deep) - Directory for the local vector store (created if absent). Supports ${var}.

**chunking**
- `chunkSize` (integer, 50-4000, default `500`) - Max characters per chunk when splitting long text (approx 100-800 tokens).
- `chunkOverlap` (integer, 0-500, default `100`) - Overlap characters between adjacent chunks.

**advanced**
- `model` (string, default `""`, resolve: variables+deep) - Path to GGUF embedding model. Empty = auto-discover (PM_EMBED_MODEL, ${MODELS_DIR}, exe/../models).
- `threads` (integer, 1-32, default `4`) - CPU threads for llama.cpp embedding inference.
- `gpuLayers` (integer, -1-999, default `0`) - GPU offload for embedding: 0 = CPU only, -1 = all layers on GPU, >0 = first N layers. Speeds up large ingests on CUDA/Metal/Vulkan builds.

**output**
- `storeAs` (string, default `"addResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "chunkOverlap": 100,
  "chunkSize": 500,
  "kind": "vectorLocalAddFile",
  "source": "file",
  "storeAs": "addResult"
}
```

---

#### Add Text to Local Vector Store

Embed text locally (GGUF model), chunk if needed, insert into the store, and save. All embedding is offline  -  no network calls. PREVIOUS = {ids:[...], count:N, storePath, docCount}.

Params:

**input**
- `text` (string, required, default `""`, resolve: variables+deep) - Text to embed and insert. Long text is chunked automatically. Supports ${var}.
- `source` (string, default `"text"`, resolve: variables+deep) - Source label for the document (e.g. text, memory, note). Supports ${var}.
- `path` (string, default `""`, resolve: variables+deep) - Origin path or URI (optional). Supports ${var}.
- `title` (string, default `""`, resolve: variables+deep) - Human-readable title (optional). Supports ${var}.
- `tags` (string, default `""`, resolve: variables+deep) - JSON array of tag strings, e.g. ["docs","2026"]. Supports ${var}.
- `storePath` (string, required, default `""`, resolve: variables+deep) - Directory for the local vector store (created if absent). Supports ${var}.

**chunking**
- `chunkSize` (integer, 50-4000, default `500`) - Max characters per chunk when splitting long text (approx 100-800 tokens).
- `chunkOverlap` (integer, 0-500, default `100`) - Overlap characters between adjacent chunks.

**advanced**
- `model` (string, default `""`, resolve: variables+deep) - Path to GGUF embedding model. Empty = auto-discover (PM_EMBED_MODEL, ${MODELS_DIR}, exe/../models).
- `threads` (integer, 1-32, default `4`) - CPU threads for llama.cpp embedding inference.
- `gpuLayers` (integer, -1-999, default `0`) - GPU offload for embedding: 0 = CPU only, -1 = all layers on GPU, >0 = first N layers. Speeds up large ingests on CUDA/Metal/Vulkan builds.

**output**
- `storeAs` (string, default `"addResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "chunkOverlap": 100,
  "chunkSize": 500,
  "kind": "vectorLocalAddText",
  "source": "text",
  "storeAs": "addResult"
}
```

---

#### Delete from Local Vector Store by Path

Remove all chunks for a given source path from the store. PREVIOUS = {deleted:N, path, storePath, docCount}.

Params:

**input**
- `path` (string, required, default `""`, resolve: variables+deep) - Exact source path to remove. Supports ${var}.
- `storePath` (string, required, default `""`, resolve: variables+deep) - Directory for the local vector store (created if absent). Supports ${var}.

**advanced**
- `model` (string, default `""`, resolve: variables+deep) - Path to GGUF embedding model. Empty = auto-discover (PM_EMBED_MODEL, ${MODELS_DIR}, exe/../models).
- `threads` (integer, 1-32, default `4`) - CPU threads for llama.cpp embedding inference.
- `gpuLayers` (integer, -1-999, default `0`) - GPU offload for embedding: 0 = CPU only, -1 = all layers on GPU, >0 = first N layers. Speeds up large ingests on CUDA/Metal/Vulkan builds.

**output**
- `storeAs` (string, default `"deleteResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "kind": "vectorLocalDelete",
  "storeAs": "deleteResult"
}
```

---

#### Open Local Vector Store

Open or create a local GGUF-backed vector store at storePath. Loads the embedding model once; subsequent blocks on the same path reuse it. Set gpuLayers to offload embedding to the GPU (-1 = all layers) for faster ingest. PREVIOUS = {docCount, dims, modelPath, gpu, gpuLayers}.

Params:

**input**
- `storePath` (string, required, default `""`, resolve: variables+deep) - Directory for the local vector store (created if absent). Supports ${var}.

**advanced**
- `model` (string, default `""`, resolve: variables+deep) - Path to GGUF embedding model. Empty = auto-discover (PM_EMBED_MODEL, ${MODELS_DIR}, exe/../models).
- `threads` (integer, 1-32, default `4`) - CPU threads for llama.cpp embedding inference.
- `gpuLayers` (integer, -1-999, default `0`) - GPU offload for embedding: 0 = CPU only, -1 = all layers on GPU, >0 = first N layers. Speeds up large ingests on CUDA/Metal/Vulkan builds.

**output**
- `storeAs` (string, default `"storeInfo"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "kind": "vectorLocalOpen",
  "storeAs": "storeInfo"
}
```

---

#### Search Local Vector Store

Embed the query locally (GGUF model) and return top-k results by cosine similarity. Offline, no network. PREVIOUS = {hits:[{id,source,path,title,chunk,tags,score},...], count:N, query}.

Params:

**input**
- `query` (string, required, default `""`, resolve: variables+deep) - Semantic search query. Supports ${var}.
- `storePath` (string, required, default `""`, resolve: variables+deep) - Directory for the local vector store (created if absent). Supports ${var}.

**filter**
- `topK` (integer, 1-200, default `10`) - Maximum number of results to return.
- `filterSource` (string, default `""`, resolve: variables+deep) - Restrict to docs with this source label (empty = no filter).
- `filterPath` (string, default `""`, resolve: variables+deep) - Restrict to docs with this exact path (empty = no filter).

**advanced**
- `model` (string, default `""`, resolve: variables+deep) - Path to GGUF embedding model. Empty = auto-discover (PM_EMBED_MODEL, ${MODELS_DIR}, exe/../models).
- `threads` (integer, 1-32, default `4`) - CPU threads for llama.cpp embedding inference.
- `gpuLayers` (integer, -1-999, default `0`) - GPU offload for embedding: 0 = CPU only, -1 = all layers on GPU, >0 = first N layers. Speeds up large ingests on CUDA/Metal/Vulkan builds.

**output**
- `storeAs` (string, default `"searchResult"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Children:
- **items** (Then, role: body)

Default block:

```json
{
  "kind": "vectorLocalSearch",
  "storeAs": "searchResult",
  "topK": 10
}
```

---

#### Local Vector Store Stats

Return metadata about an open store: doc count, dims, model, index size. PREVIOUS = {docCount, dims, modelPath, storePath, indexSizeBytes}.

Params:

**input**
- `storePath` (string, required, default `""`, resolve: variables+deep) - Directory for the local vector store (created if absent). Supports ${var}.

**advanced**
- `model` (string, default `""`, resolve: variables+deep) - Path to GGUF embedding model. Empty = auto-discover (PM_EMBED_MODEL, ${MODELS_DIR}, exe/../models).
- `threads` (integer, 1-32, default `4`) - CPU threads for llama.cpp embedding inference.
- `gpuLayers` (integer, -1-999, default `0`) - GPU offload for embedding: 0 = CPU only, -1 = all layers on GPU, >0 = first N layers. Speeds up large ingests on CUDA/Metal/Vulkan builds.

**output**
- `storeAs` (string, default `"storeStats"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "kind": "vectorLocalStats",
  "storeAs": "storeStats"
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

Capture a still image or record a camera, screen, or window source to H.264 MP4. HQ zoom/follow/interactive zoom require Windows fast (WGC) capture. Optional audio mux is 48 kHz stereo AAC. Optional skin / lips / teeth / mirror / blur / background and virtualOut use the same CPU path as `video record`. Stores the output path in PREVIOUS / storeAs.

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
- `durationMs` (duration_ms, 0-8.64e+07, default `0`) - Record action only: stop after this many ms. 0 = record until cancellation. Start ignores this and runs until Stop.
- `pauseKey` (shortcut, default `""`) - Optional global shortcut that toggles recording pause/resume, e.g. F9 or Ctrl+Shift+P. Empty disables it.

**output_file**
- `outputPath` (output_path, default `""`, constraints: writable+createParents) - Output path (.jpg/.png for Still, .mp4 for Record/Start). Empty = auto temp file. With virtualOut, empty means virtual cam only (no MP4).

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
- `audioNormalize` (boolean, default `false`) - Reserved (low risk): normalize mixed audio level before AAC encode.
- `audioAutoGain` (boolean, default `false`) - Reserved (low risk): gentle automatic gain on the microphone path.

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
- `cameraOverlay` (boolean, default `false`) - Picture-in-picture webcam over the recording (capture-visible overlay).
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

**beauty**
- `skin` (boolean, default `false`) - Smooth skin (face oval minus eyes/lips). Forces the compatibility CPU recorder.
- `skinBlend` (float, 0-1, default `0.5`) - Skin mix 0..1 (0 dry / 1 wet). Same as CLI --skin-blend / --skin-strength.
- `lips` (boolean, default `false`) - Tint lips from the face mesh. Forces the compatibility CPU recorder.
- `lipsColor` (color, default `"#C45C6A"`) - Lip tint color.
- `lipsBlend` (float, 0-1, default `0.35`) - Lip tint mix 0..1. Same as CLI --lips-blend / --lips-alpha.
- `teeth` (boolean, default `false`) - Whiten teeth from the face mesh. Forces the compatibility CPU recorder.
- `teethBlend` (float, 0-1, default `0.4`) - Teeth mix 0..1. Same as CLI --teeth-blend / --teeth-strength.
- `landmarks` (boolean, default `false`) - Draw face-mesh landmarks on the frame (debug).

**frame**
- `mirror` (boolean, default `false`) - Horizontal flip (webcam mirror). No model.

**background**
- `blur` (boolean, default `false`) - Blur the non-person region (ImageSegmenter). Forces the compatibility CPU recorder.
- `blurBlend` (float, 0-1, default `0.65`) - Background blur mix 0..1. Same as CLI --blur-strength.
- `background` (boolean, default `false`) - Replace the non-person region with bgColor / bgImage.
- `bgColor` (color, default `"#1A1A1A"`) - Solid replacement color.
- `bgImage` (image_path, default `""`) - Replacement image, scaled to the frame.
- `featherPx` (integer, default `8`) - Person-mask feather in pixels.

**virtual_camera**
- `virtualOut` (boolean, default `false`) - Publish frames to Pixlwiz Cam (Windows 11 MF Frame Server). Zoom / Teams see it while this process runs. Forces the compatibility CPU recorder. outputPath may be empty (vcam only).
- `virtualOutName` (string, default `"Tanit Cam"`) - Device name shown to Zoom / Teams (Windows adds “Windows Virtual Camera”).

Features: cancellable

Default block:

```json
{
  "action": "Still",
  "aspectCustomH": 9,
  "aspectCustomW": 16,
  "aspectRatio": "source",
  "audioAutoGain": false,
  "audioDevice": "",
  "audioNormalize": false,
  "audioSource": "none",
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
  "captureEngine": "auto",
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
  "featherPx": 8,
  "focusX": -1.0,
  "focusY": -1.0,
  "follow": "none",
  "followDeadzone": 3,
  "followSpeed": 0.2,
  "fps": 30,
  "height": 0,
  "hideCursorWhenTyping": false,
  "hudCapture": "auto",
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
  "showZoomStatus": true,
  "sizeMode": "native",
  "skin": false,
  "skinBlend": 0.5,
  "storeAs": "capturePath",
  "teeth": false,
  "teethBlend": 0.4,
  "timeoutMs": 5000,
  "transitionMs": 300,
  "updateIntervalMs": 16,
  "virtualOut": false,
  "virtualOutName": "Tanit Cam",
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

**Face beauty** (off unless you set a flag). `skin` is the heavy one at 1080p.

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
- `key` (string, default `""`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

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

#### Remote Stream

Start, stop, or inspect a named remote video stream server for the mobile web remote. The current backend launches the same video stream server used by the CLI.

Params:

**server_lifecycle**
- `action` (enum, default `"Start"`, enum: Start|Stop|Status) - Start a named remote video stream server, Stop it, or report Status.
- `instance` (string, default `"default"`) - Named stream instance. Use the same name for Stop/Status.
- `open` (boolean, default `false`) - Ask the stream server to open the local browser after starting.

**input**
- `input` (screen_input, default `"screen:0"`) - Camera or screen/window source for Start. Examples: screen:current, screen:0, screen:0:hwnd=..., screen:0:wintitle=...:rrect=x,y,w,h.

**network**
- `bind` (string, default `"0.0.0.0"`) - Network interface to listen on. 0.0.0.0 allows LAN/mobile access; 127.0.0.1 is local only.
- `port` (integer, 1-65535, default `8787`) - TCP port for the stream server. Use a fixed port so Status can report a stable URL.

**quality**
- `fps` (integer, 1-240, default `30`) - Target capture frame rate.
- `bitrateKbps` (integer, 1-100000, default `8000`) - Future WebRTC/video encoder bitrate hint.
- `mjpegQuality` (integer, 1-100, default `85`) - JPEG quality for the MJPEG fallback preview.
- `encoder` (string, default `"auto"`) - Future encoder selector.

**capture_options**
- `includeCursor` (boolean, default `true`) - Include the cursor in screen capture when supported.

**access**
- `token` (string, default `""`) - Remote access token. Empty generates one for Start.

**output**
- `storeAs` (string, default `"stream"`) - Variable to also store the result in (always sets PREVIOUS).

Features: cancellable

Default block:

```json
{
  "action": "Start",
  "bind": "0.0.0.0",
  "bitrateKbps": 8000,
  "encoder": "auto",
  "fps": 30,
  "includeCursor": true,
  "input": "screen:0",
  "instance": "default",
  "kind": "videoStream",
  "mjpegQuality": 85,
  "open": false,
  "port": 8787,
  "storeAs": "stream",
  "token": ""
}
```

---

#### Virtual Camera Out

Push a frame to the Pixlwiz virtual webcam (MF Frame Server). Windows 11 only (MFCreateVirtualCamera). Same sink as `video record --virtual-out`. Zoom / Teams pick the device while this process is running.

Params:

**input**
- `input` (image_path, from PREVIOUS, default `""`) - Frame handle (mem://...) or image path.

**options**
- `name` (string, default `"Tanit Cam"`) - Device name shown to Zoom / Teams (Windows adds “Windows Virtual Camera”).

Default block:

```json
{
  "input": "",
  "kind": "videoVirtualOut",
  "name": "Tanit Cam"
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
- `key` (string, default `"llama:vlm"`) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

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
| `custom.command-mpx9r1ur-8c6df` | Assistant | `cli:llm` | `agent`<br>`--consent-ui`<br>`win32`<br>`--realtime` |
| `custom.command-mpxytlpz-bcde4` | Launcher | `app:togglelauncher` |  |
| `file.prev` | Previous | `app:previousfile` |  |
| `file.next` | Next | `app:nextfile` |  |
| `custom.command-mq3i85bj-db474` | Share | `cli:service` | `files`<br>`upload`<br>`${CURRENT_SELECTION}` |
| `custom.command-mq6i351x-bdb01` | Edit | `app:edit` |  |
| `custom.command-ms1sb66o-f4ae7` | Commands | `app:togglecommandpalette` |  |
| `custom.native-search` | Search | `app:togglesearchnative` |  |
| `custom.command-mr87jv7l-cbcd4` | Edit Home | `app:edit` |  |
| `custom.dropdown-msaj5qk5-78a6b` | Help | `metadata` |  |
| `custom.help-cli` | CLI-Manual | `app:open` |  |
| `custom.help-xblox` | XBlox | `app:open` |  |
| `custom.command-msakytc7-dd084` | Online Help | `app:openurl` |  |
| `custom.youtube` | Youtube | `app:openurl` |  |
| `custom.dropdown-mset8bmm-ad9d3` | Installer | `metadata` |  |
| `custom.command-mqj3lo3h-fed59` | Register | `cli:register-explorer` |  |
| `custom.command-mr90wbc8-2bf79` | Installer | `cli:installer` | `--no-explorer`<br>`--no-seed` |
| `custom.command-mqj4ixcu-3a87a` | Unregister | `cli:register-explorer` | `--unregister` |
| `custom.command-712fbd00-f9ac4` | Product | `cli:transform` | `--prompt`<br>`render this as product shooting, white background, studio`<br>`--json`<br>`--reference`<br>`${CURRENT_FILE}` |
| `custom.command-mpch9gdx-44982` | Illustration | `cli:transform` | `--src`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`as technical illustration`<br>`--provider`<br>`replicate`<br>`--model`<br>`google/gemini-2.5-flash` |
| `custom.image-understand-speak` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/vision-pipe-speak.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mq9b2upm-93cf4` | Excel | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/vision-pipe.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mqj3feqz-72a1a` | Resize-HD | `cli:resize` | `run`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--max-width`<br>`800`<br>`--src`<br>`${CURRENT_SELECTION}`<br>`--format`<br>`jpg`<br>`--cache-dir`<br>`${ENV:PIXLWIZ}/cache/images`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_hd.jpg`<br>`--job-ui` |
| `custom.image-compress` | Compress | `cli:compress` | `run`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--max-width`<br>`800`<br>`--src`<br>`${CURRENT_SELECTION}`<br>`--format`<br>`jpg`<br>`--cache-dir`<br>`${ENV:PIXLWIZ}/cache/images`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_hd.jpg`<br>`--job-ui`<br>`--compressor`<br>`mozjpeg`<br>`--quality`<br>`92` |
| `custom.command-mpxzouxv-ab189` | App | `app:takescreenshot` |  |
| `custom.command-mrcja3yb-306c8` | Region | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/screenshot.xblox` |
| `custom.command-mre4dk8y-7a985` | Markdown | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/screenocr.xblox` |
| `custom.command-mpohnfaf-26b0c` | TTS | `app:setVariable` |  |
| `custom.command-mpokt0hv-41237` | Funny | `app:setVariable` |  |
| `custom.command-mrm14de3-f8ab5` | Rapper | `app:setVariable` |  |
| `custom.command-mpokxo4w-0910a` | Serious | `app:setVariable` |  |
| `custom.command-mrm0kgf2-99791` | Granny | `app:setVariable` |  |
| `custom.command-mpohmxea-c64a1` | Agent | `metadata` |  |
| `custom.command-mpi5stmy-8e9cb` | Assistant | `cli:assistant` |  |
| `custom.command-mpvpg0b7-81457` | RT-Agent-On | `app:realtimestart` |  |
| `custom.command-mpvps7tt-3f40f` | RT-Agent-Off | `app:realtimestop` |  |
| `custom.view-explorer` | Explorer | `app:togglefiletree` |  |
| `custom.command-mpy7w3px-8a1e0` | Log | `app:togglelog` |  |
| `custom.command-mqkxsx6y-56346` | Center | `app:togglecenterview` |  |
| `custom.command-mpy7z14t-bcef8` | Queue | `app:showqueue` |  |
| `custom.command-mqkneqp7-3fcb0` | Console | `app:toggleconsole` |  |
| `custom.command-mr5ebav3-ec35c` | Search | `app:togglesearch` |  |
| `custom.view-maximize` | Maximize | `app:togglefullscreen` |  |
| `custom.view-half` | Half Size | `app:setframesize` |  |
| `custom.view-snap-left` | Snap Left | `app:snapleft` |  |
| `custom.view-snap-up` | Snap Up | `app:snapup` |  |
| `custom.view-snap-down` | Snap Down | `app:snapdown` |  |
| `custom.view-snap-right` | Snap Right | `app:snapright` |  |
| `custom.command-msqfoqej-85fb5` | Performance | `app:toggleperf` |  |
| `custom.command-70eabea6-957e6` | Spanish | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`Translate to Spanish`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-tools`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_ex.${SRC_EXT}` |
| `custom.command-mrbx2n44-a2c9c` | French | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/network-deepl.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--docStatus`<br>`{"status":"queued"}`<br>`--lang`<br>`DE`<br>`--pollCount`<br>`0` |
| `custom.command-ms0phpqj-d1ca3` | Chrome | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-chrome.xblox` |
| `custom.command-ms33shnl-97127` | App | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-win32.xblox` |
| `custom.color-picker` | Color | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-color.xblox` |
| `custom.text-speak` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-text-speak.xblox` |
| `custom.distance` | Distance | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-distance.xblox` |
| `custom.picker-chrome-selector` | Color | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/inspect-chrome-selector.xblox` |
| `custom.command-mqauenwv-74ac8` | Mic-Journal | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/stt-journal-ex.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--journal`<br>`${KNOWNFOLDER:Documents}\journal.txt`<br>`--journalPath`<br>`C:\Users\zx/Documents/journal.txt`<br>`--recording`<br>`false`<br>`--started`<br>`false` |
| `custom.voice-cloner` | Voice Cloner | `cli:audio` | `voice-change`<br>`--remove-background-noise`<br>`--no-speaker-boost`<br>`${CURRENT_FILE}`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_cloned.wav`<br>`--voice-id`<br>`wBnAJRbu3cj93gnAm02O` |
| `custom.command-mrckqhx7-38b2d` | Mic-Journal F12 | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/stt-paste.xblox` |
| `custom.command-mpxzk7g4-67590` | Voice Recorder | `cli:audio` | `record`<br>`--text-out`<br>`${KNOWNFOLDER:Desktop}/mic_last.md`<br>`--dst`<br>`${CONFIG_DIR}/recordings/tanit-${DD}-${HH}-${mm}.wav` |
| `custom.command-ms0q0j9j-92441` | Yamaha | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/bluetooth-yamaha.xblox` |
| `custom.mic-start` | Mic Capture Start | `cli:audio` | `record`<br>`--text-out`<br>`${KNOWNFOLDER:Config}/last.md` |
| `custom.mic-stop` | Mic Capture Stop | `cli:audio` | `record`<br>`stop` |
| `custom.command-mrf5dhi8-76608` | 1:1 | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-ex.xblox` |
| `custom.command-mssrlhcu-5aa17` | 1:1-ex | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-ex.xblox` |
| `custom.command-ms4vl4ur-4569d` | 16:9 | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-16-9.xblox` |
| `custom.command-msghb0e2-e8c47` | Fixed | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-recorder-fixed.xblox` |
| `custom.video-start` | Cam-Start | `cli:video` | `record`<br>`--dst`<br>`${KNOWNFOLDER:Videos}/capture.avi` |
| `custom.video-stop` | CamStop | `cli:video` | `record`<br>`stop` |
| `custom.command-d204eb95-8101e` | To Step | `external` | `<placeholder>` |
| `custom.command-msg3o7ti-d4db9` | To HTML | `external` | `<placeholder>` |
| `custom.command-msg3opko-d2e18` | BOM | `external` | `<placeholder>` |
| `custom.command-msg3p48b-0db60` | Print | `external` | `<placeholder>` |
| `custom.command-msg3pbh4-64134` | FreeCAD | `external` | `<placeholder>` |
| `custom.command-msafwmdu-b9a48` | Pose | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-detect-yolo26-pose.xblox` |
| `custom.command-msajhop7-a071b` | Segments | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-detect-yolo26-seg.xblox` |
| `custom.handbrake-hq` | Handbrake-HQ | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-encode-medium.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-video-social-hq` | Social Video HQ | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SHARED}/xblox/video-encode-social-hq.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mr51514h-c34ec` | System | `app:edit` |  |
| `custom.command-mr50fk3n-1a7d7` | Realtime | `app:edit` |  |
| `custom.command-mppft700-137e9` | Planner | `app:edit` |  |
