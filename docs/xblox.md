# Tanit Chat XBlox

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

- `--commands` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional commands.json override for custom command metadata.

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

- `--schema-path` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Resolver routing key, e.g. providers.whisper or providers.replicate.image.
- `-p,--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Provider name shorthand; used as providers.<name> when --schema-path is omitted.
- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model slug forwarded to the resolver (e.g. base.en or stability-ai/sdxl).

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

- `-p,--path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Options path, e.g. providers.replicate.collections or providers.replicate.models.official.

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

- `--src` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to a blocks-file JSON document: { version: 1, context?: {}, roots: [...] }.
- `--commands` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional commands.json override for resolving host.runCustomCommand({ id }).
- `--event-mode` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">full</span> <span data-cli="choice">errors</span> <span data-cli="choice">count</span></span></span>) - Event retention: full stores every event, errors stores only failures, count stores no events. Default: errors (full with --json).
- `--dry-run` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Stage CLI/external commands but do not spawn child processes.
- `--simulate` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Simulate execution: resolve inputs and run pure dataflow/control blocks, but suppress side-effecting blocks (fs writes, shell, network, capture, external commands), emitting predicted 'simulated' events instead.
- `--md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print the document as brief pseudo-code markdown (context bullets + script tree) and exit without running it.
- `--md-numbered` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Use numeric bullets (1. / 2.) instead of dashes in --md output.
- `--md-filter` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Block kinds excluded from --md output, with their subtrees (repeatable or comma-separated). Default: stdout. Pass 'none' to include everything.
- `--mermaid` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Render the script section as a fenced mermaid flowchart instead of the bullet tree. Context variables stay as markdown bullets above the diagram. Requires --md.
- `--mermaid-type` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">flow</span> <span data-cli="choice">sequence</span></span></span>) - Diagram type: flow (default; flowchart with decision diamonds) or sequence (registry groups as participants, control flow as alt/loop fragments).
- `--mermaid-direction` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">TD</span> <span data-cli="choice">LR</span> <span data-cli="choice">BT</span> <span data-cli="choice">RL</span></span></span>) - Flowchart direction: TD (default, vertical), LR, BT, or RL. Applies to --mermaid and --diagram.
- `--mermaid-color` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">edges</span> <span data-cli="choice">groups</span> <span data-cli="choice">both</span> <span data-cli="choice">none</span></span></span>) - Colouring: edges (yes/no/loop/case link tints), groups (node strokes per registry group + flow diamonds), both (default), or none.
- `--expand-parameters` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include set block parameters in diagram node labels (default: compact labels — group/kind, set <name>, conditions on diamonds).
- `--diagram` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Render the script as a Tanit-style SVG flowchart and exit without running it. Default: raw SVG on stdout. Use --diagram-dst / --diagram-png for files. Combine with --md to embed the diagram in markdown output instead.
- `--styles` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Diagram styling constants JSON. Default: ${TANIT_SHARED}/xblox-diagram-constants.json. Supports command_variables in the path. Palettes live under JSON "themes".
- `--theme` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">light</span> <span data-cli="choice">dark</span></span></span>) - Diagram color palette: light (default) or dark. Selects themes.<name> in the styles JSON (defaultTheme when omitted).
- `--diagram-type` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">flow</span> <span data-cli="choice">sequence</span></span></span>) - Diagram layout: flow (default; flowchart with decision diamonds and param cards) or sequence (participants, lifelines, Script messages).
- `--diagram-png` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Rasterize the diagram to this PNG path (libvips svgload). Supports command_variables in the path.
- `--diagram-dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Write a standalone .svg file (raw SVG, not markdown). Supports command_variables in the path.
- `--show-arrows` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Draw arrowheads on flow edges when --show-links is true (default: true; styles JSON render.showArrows).
- `--show-links` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Draw connector lines between blocks. When false, nodes are laid out compactly in script order without edges (default: true; styles JSON render.showLinks).
- `--show-disabled` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Include disabled blocks in the diagram (default: false; styles JSON render.showDisabled).
- `--show-variables` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Show storeAs targets and referenced variables on node labels (default: true; styles JSON render.showVariables).
- `--show-groups` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Prefix registry block labels with their group, e.g. audio/audioRecord (default: true; styles JSON render.showGroups).
- `--humanize-node-names` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Humanize registry block labels, e.g. shell/openPath -> Shell / Open Path (default: false; styles JSON render.humanizeNodeNames).
- `--show-variable-delimiters` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Wrap referenced variables as ${name}; when false show plain names (default: false; styles JSON render.showVariableDelimiters).
- `--variable-link-style` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Separator before storeAs targets: arrow, unicode (→), colon, dot, equals, none (default: unicode; styles JSON render.variableLinkStyle).
- `--variable-input-style` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Format for referenced inputs: at (@name), parens, bracket, none (default: at; styles JSON render.variableInputStyle).
- `--link-style` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">straight</span> <span data-cli="choice">bezier</span> <span data-cli="choice">waypoints</span></span></span>) - Edge routing style: straight (orthogonal), bezier (smooth curves), waypoints (obstacle-aware routing ported from nodehub pathfinding; default: straight; styles JSON render.linkStyle).
- `--show-parameters` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">set</span> <span data-cli="choice">all</span></span></span>) - Block parameter visibility on node labels: none (compact), set (wired/set params only, like wiring 'Wired params'), all (full param list, like wiring 'All params'). Styles JSON render.showParameters. --expand-parameters is equivalent to --show-parameters all.
- `--show-parameters-grouped` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Prefix each parameter with its ParamDef group (input/, options/, …). Matches wiring toolbar 'Show group'.
- `--show-parameter-values` (<span data-cli="meta"><span data-cli="type">BOOLEAN</span></span>) - Include parameter values in node labels when --show-parameters is set or all (matches wiring toolbar 'Show set values').
- `--no-wait` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip sleeping for wait blocks.
- `--max-loop-iterations` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 1000000]</span>, <span data-cli="default">default <span data-cli="value">10000</span></span></span>) - Maximum iterations per for/while loop block.
- `--loop` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Re-run the whole document until cancelled (Ctrl+C). Overrides the document's stored loop setting.
- `--no-loop` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Force a single pass even if the document enables looping.
- `--loop-interval-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 86400000]</span></span>) - Gap in milliseconds between loop passes (0 = as fast as possible, yielding each pass). Clamped to [0, 86400000] (1 day).
- `--loop-reset` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Reset scope/state each loop pass (clean restart). Default persists state across passes (variables carry over).
- `--loop-limit` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 9223372036854775807]</span></span>) - Stop after exactly N document-level loop passes (0 = unlimited). Counted at the runtime level before each inter-pass yield.
- `--quiet` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Suppress stdout block output (message is still resolved and the event is still emitted). Useful for benchmarking and CI runs.
- `--profile` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print a per-category timing breakdown to stderr after the run (jq VM, converters, emit, set-ctx).
- `--arg` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Extra argument appended to cliCommand/external argv command invocations; repeatable.

**Security**
- `--consent-ui` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Consent surface for security-gated tools in this run: win32 (default, native dialog) | auto | cli | auto-deny | auto-allow | preset. An llmAgent block's consentUi param overrides this per turn.
- `--consent-owner` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target descriptor (ipc id) for --consent-ui owner routing. Reserved.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Session name/key (default: auto host-<ms>).
- `--label` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Human-friendly label.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.
- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Target every live session.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.
- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Target every live session.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.
- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Target every live session.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.
- `--name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Variable name.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.
- `--name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Variable name.
- `--value` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Value (parsed as JSON when possible, else a string).

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.
- `--message` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Message text.
- `--from` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Sender identity (default: cli).

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

- `--message` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Message text.
- `--from` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Sender identity (default: cli).

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

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target session key, stem, or unambiguous prefix.
- `--peek` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Read without consuming.

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
- `prompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Instruction / question for the agent. Uses PREVIOUS when unset.
- `include` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Files or folders in the agent selection context (CLI --include).
- `embed` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Text files inlined into the prompt (CLI --embed).
- `cwd` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span></span></span>) - Working folder the agent treats as context. Empty = the run cwd.

**advanced**
- `systemPrompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Full system-prompt override (CLI --system-prompt). Supports literal text, null/none, @path, or file:path.
- `system` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional extra system text appended after the resolved system prompt.
- `plannerPrompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Planner system-prompt override (CLI --planner-prompt). Same grammar as systemPrompt.
- `runner` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">native</span> <span data-cli="choice">claude-code</span> <span data-cli="choice">codex</span></span></span>) - Agent backend (CLI --runner). Empty = chat preset, then native. Also reads PM_LLM_AGENT_RUNNER when unset.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Model override. Empty = from App Settings.
- `router` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Provider router override. Empty = from App Settings.
- `type` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;completion&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">completion</span> <span data-cli="choice">responses</span> <span data-cli="choice">realtime</span></span></span>) - LLM API type.
- `streaming` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">on</span> <span data-cli="choice">off</span></span></span>) - Streaming mode for Responses API turns.
- `mcp` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Allow MCP-backed tools. Off forces MCP off for this turn.
- `skills` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Allow agent skill discovery/injection.
- `planner` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Allow the planner pre-pass. Off forces planner off.
- `plannerBudget` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-64</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max tool schemas the planner may pre-expand. 0 = default (8).
- `disableTools` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Path/MCP tool ids to omit for this turn (CLI --disable-tools).
- `enableTools` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Allowlist of path tools for this turn (CLI --enable-tools).
- `parallelTools` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Dispatch multiple tool calls concurrently. Off = serial execution.
- `maxSteps` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Tool-loop iteration cap. 0 = resolved default.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Per-LLM-call timeout in ms. 0 = resolved default.
- `sessionId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional session id for multi-turn memory across runs (CLI --session-id).
- `streamLog` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Mirror streaming assistant text deltas to the trace log.
- `json` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Also emit the full agent transcript as a `transcript` output.

**options**
- `preset` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Chat provider preset name. Empty = default preset from App Settings.
- `tools` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Allow tool calls. Off = plain completion (CLI --no-tools).

**auth**
- `apiKey` (<span data-cli="meta"><span data-cli="type">api_key</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - API key override. Empty = from App Settings.
- `baseUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Router base URL override. Empty = from App Settings.

**security**
- `consentUi` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;win32&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">win32</span> <span data-cli="choice">auto</span> <span data-cli="choice">preset</span> <span data-cli="choice">cli</span> <span data-cli="choice">auto-deny</span> <span data-cli="choice">auto-allow</span></span></span>) - Consent surface for security-gated tools (CLI --consent-ui). win32 = native permission dialog (default, including headless runs). auto = cli when stdin is attached, else win32 on a desktop, else deny. preset = chat preset consent_ui (Yolo / auto-deny). cli = stdio prompt; auto-deny / auto-allow skip the dialog.
- `consentOwner` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Target descriptor (ipc id) for consent-ui owner routing. Reserved.
- `aiConsentReview` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Run the advisory SecurityAgent reviewer before consent prompts.
- `aiConsentRouter` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Router for the advisory SecurityAgent reviewer.
- `aiConsentModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Model for the advisory SecurityAgent reviewer.

**tool_overrides**
- `ocrProvider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - OCR tool provider override for this turn.
- `ocrModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - OCR tool model override for this turn.
- `recognitionProvider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - image_understand provider override.
- `recognitionModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - image_understand model override.
- `imageProvider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - image_create provider override.
- `imageModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - image_create model override.
- `videoProvider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - create_video provider override.
- `videoModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - create_video model override.
- `sttProvider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - STT provider override (audio_transcribe / mic flows).
- `sttModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - STT model override.
- `ttsProvider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - TTS provider override.
- `ttsModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - TTS model override.
- `ttsVoiceId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - TTS voice id override.

**hud**
- `hudMode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;both&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">taskbar</span> <span data-cli="choice">overlay</span> <span data-cli="choice">both</span></span></span>) - Status HUD. taskbar = app taskbar button. overlay = movable pill over the clock. both = combine. off = none.
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Master switch for hudMode. Default: on.

**output**
- `dst` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Write the agent response to this file (CLI --dst). Without json: raw answer text. With json: full result JSON. Parent directories are created automatically.
- `usage` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Aggregated token usage / cost for the turn.
- `transcript` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Full turn transcript. Populated when `json` is on.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;answer&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;List&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">List</span> <span data-cli="choice">Unload</span></span></span>) - List loaded models in this xBlox process, or unload one by key.
- `key` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;models&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - File or folder to add to chat context. Uses PREVIOUS when unset.
- `text` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Composer seed text (same as `--prompt`). Alias: prompt.

**options**
- `send` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Auto-send the seeded text when the composer is ready (same as `--send`).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;referencedPath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `pid` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact process id.
- `hwnd` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact window handle.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Target the current foreground window.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `steps` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Array of {action, ...} steps.

**options**
- `defaultDelayMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">50</span></span></span>) - Delay between steps.
- `continueOnError` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Keep running steps after a failure.

**advanced**
- `defaultWaitTimeoutMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-600000</span>, <span data-cli="default">default <span data-cli="value">5000</span></span></span>) - Default wait timeout.
- `defaultWaitIntervalMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-60000</span>, <span data-cli="default">default <span data-cli="value">100</span></span></span>) - Default wait poll interval.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `x` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Absolute screen X.
- `y` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Absolute screen Y.
- `xw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Window-relative X (preferred).
- `yw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Window-relative Y.

**options**
- `button` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;left&quot;</span></span></span>) - left | right | middle.
- `count` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-10</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Click count (2 = double).

**advanced**
- `virtual` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - PostMessage click; for background apps.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `pid` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact process id.
- `hwnd` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact window handle.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Target the current foreground window.

**options**
- `force` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - TerminateProcess instead of WM_CLOSE.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `x` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Start X (screen).
- `y` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Start Y (screen).
- `xw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Start X (window-relative).
- `yw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Start Y (window-relative).
- `toX` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - End X (screen).
- `toY` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - End Y (screen).
- `toXw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - End X (window-relative).
- `toYw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - End Y (window-relative).
- `dx` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Relative end X delta.
- `dy` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Relative end Y delta.
- `path` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Polyline: [{x,y}|{xw,yw}, ...].
- `arc` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - {cx,cy,radius,startDeg,endDeg,segments}.

**options**
- `button` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;left&quot;</span></span></span>) - left | right | middle.
- `durationMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-30000</span>, <span data-cli="default">default <span data-cli="value">250</span></span></span>) - Drag duration.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `keys` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;ctrl+s&quot;</span></span></span>) - Combo, e.g. ctrl+shift+t.
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Send to the foreground window.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">screen_input</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Picker / screen spec (e.g. from a Picker block). Extracts hwnd and title; overrides the title/process fields when set.
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Dump the foreground window.

**options**
- `format` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;md&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">md</span> <span data-cli="choice">json</span></span></span>) - Output format.
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-500000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max elements per window. 0 = no limit.
- `filterToSelection` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - When the input spec contains rrect= (sub-element pick), filter the output to elements whose center falls inside that rect. Off by default — rrect is used only to identify the window.

**advanced**
- `controls` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span></span>) - Control-type filter for markdown output. "all" = every element (full tree). Empty = smart default (invokable + menus + inputs). CSV of types to include, e.g. buttons,menus,editable.
- `textMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-1e+06</span>, <span data-cli="default">default <span data-cli="value">1200</span></span></span>) - Truncate element text in markdown output.
- `probeCells` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Probe grid / table cells (DataGrid, Table). Needed for spreadsheets like LibreOffice Calc or Excel to enumerate individual cells.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Search the foreground window.
- `name` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Element name substring.
- `value` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Element value substring.
- `automationId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - AutomationId substring.
- `className` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - ClassName substring.

**options**
- `nth` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - Select the nth match (-1 = all).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `key` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;a&quot;</span></span></span>) - Single key to press.
- `modifiers` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Modifier list: ctrl/shift/alt/win.
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Send to the foreground window.

**options**
- `holdMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Note-sustain for piano-style apps.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `x` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Absolute screen X.
- `y` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Absolute screen Y.
- `xw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Window-relative X.
- `yw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Window-relative Y.

**options**
- `smooth` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Smooth (auto-paced) move.
- `durationMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - -1 = auto from distance, 0 = teleport.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `exe` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;notepad.exe&quot;</span></span></span>) - Executable to launch.
- `args` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Command-line arguments.
- `cwd` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Working directory.

**options**
- `x` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Initial window X.
- `y` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Initial window Y.
- `width` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Initial window width.
- `height` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Initial window height.

**advanced**
- `waitMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-120000</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Wait this long for the main window.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;out/shot.jpg&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - JPEG output path.
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Capture the foreground window.

**options**
- `rect` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional 'x,y,w,h' screen rect.
- `elementIndex` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Capture a specific UIA element rect.
- `quality` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">85</span></span></span>) - JPEG quality.
- `activate` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Activate the window before capture.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `clicks` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">-3</span></span></span>) - Wheel clicks; positive = up/right.
- `x` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Pre-target cursor X (optional).
- `y` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Pre-target cursor Y (optional).
- `xw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Pre-target cursor X (window-relative).
- `yw` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Pre-target cursor Y (window-relative).

**options**
- `axis` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;vertical&quot;</span></span></span>) - vertical | horizontal.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `text` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;Hello&quot;</span></span></span>) - Text to type.
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Type into the foreground window.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `pid` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact process id.
- `hwnd` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact window handle.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Target the current foreground window.
- `type` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;text&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">text</span> <span data-cli="choice">files</span></span></span>) - Clipboard format to read back: text (CF_UNICODETEXT) or files (CF_HDROP).
- `trigger` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Send Ctrl+C to the target (or focused element) before reading. Set false to read clipboard without triggering a copy.

**options**
- `delayMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-10000</span>, <span data-cli="default">default <span data-cli="value">80</span></span></span>) - Wait this long (ms) after Ctrl+C before reading the clipboard. Increase for slow apps.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Window-title substring.
- `process` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Process-name substring.
- `pid` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact process id.
- `hwnd` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Exact window handle.
- `foreground` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Target the current foreground window.
- `type` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;text&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">text</span> <span data-cli="choice">files</span></span></span>) - Clipboard format to write: text (CF_UNICODETEXT) or files (CF_HDROP).
- `text` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Text to put on the clipboard before pasting (type=text). Uses PREVIOUS when blank. Leave empty to paste whatever is already on clipboard.
- `files` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - File paths to put on the clipboard before pasting (type=files). Leave empty to paste whatever is already on clipboard.
- `trigger` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Send Ctrl+V to the target (or focused element) after writing. Set false to only write to clipboard without triggering a paste.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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

Interactive window / element picker with live highlight + stack HUD. Click to pick the highlighted region; Alt+wheel or [ ] cycles leaf → siblings → ∪siblings → parent; drag (or Shift/Ctrl+drag) selects a free rectangle; Z opens an 8× magnifier, C copies the sampled colour; ESC cancels. Default output is a screen spec for video/screenshot blocks; set format=md or format=html for Chrome DOM via the Tanit extension. format=selection captures the current focused selection (UIA first, Chrome extension fallback) without an interactive click. format=foreground returns JSON for the last focused window (title, hwnd, cursor parent HWND) — remembers the previous app when Tanit is in front. format=context returns Explorer/Desktop/drag sources from the process-local context store (no click). Sampled colour and Chrome DOM selectors always ride along in the payload.

Params:

**options**
- `format` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;screen&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">screen</span> <span data-cli="choice">md</span> <span data-cli="choice">html</span> <span data-cli="choice">text</span> <span data-cli="choice">color</span> <span data-cli="choice">selector</span> <span data-cli="choice">measure</span> <span data-cli="choice">selection</span> <span data-cli="choice">foreground</span> <span data-cli="choice">context</span></span></span>) - Result format. screen = capture spec; md/html = in-app or Chrome DOM; text = plain speakable string (DOM innerText / UIA); selection = current focused selection (UIA TextPattern, then Chrome extension); foreground = last focused window JSON (title, hwnd, cursor parent, Chrome css/xpath when chromeDom); context = OS context sources (Explorer/Desktop/drag/invocation) as JSON+markdown; color = eyedropper; selector = CSS; measure = boundary-snapped point-to-point line.
- `chromeDom` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Chrome / in-app browser: resolve DOM/selectors in the committed payload, and for format=selection fall back to the extension after UIA. Off = UIA/HWND only.
- `scope` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">element</span> <span data-cli="choice">document</span></span></span>) - DOM extract target. element = only the leaf (fail on miss). document = always dump documentSelector. auto = leaf, then document on miss / page-edge / ancestor pick.
- `documentSelector` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;html&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">html</span> <span data-cli="choice">body</span> <span data-cli="choice">main</span></span></span>) - Root used for scope=document and auto fallback. body/main omit leftover <head> in format=html.
- `highlight` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Show the translucent highlight overlay while picking.
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Show the informational picker HUD. Off keeps rectangle highlighting.
- `resolveUia` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Resolve UIA after the cursor settles and on commit (gives sub-window precision for web content, media players, etc.).
- `showHidden` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Consider non-visible child windows (needed to reach Chrome_RenderWidgetHostHWND etc.).
- `siblings` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Include sibling panes and ∪siblings union in the Alt+wheel / [ ] stack (leaf → siblings → parent). Off = ancestors only.
- `sampleColor` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Region picks only: add colorHex/rgb to the payload (sampled once at click). For eyedropper use format=color instead.
- `magnifier` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Region/measure picks: open the 8× loupe (Z toggles).

**capture_options**
- `includeOpenWindows` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - When the pick is a monitor/desktop: capture open apps on that display (screen:N:layer=monitor). Off = wallpaper only (hwnd=Progman/WorkerW PrintWindow).
- `allowMru` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - format=context: include session MRU as eligible candidates. Never auto-resolves file operations.
- `allowOpenApps` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - format=context: include the bounded open-app / taskbar-candidate snapshot.
- `allowAppRecent` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - format=context: lazy per-app Shell Recent/Frequent (IApplicationDocumentLists). Never auto-resolves file operations.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1000-600000</span>, <span data-cli="default">default <span data-cli="value">60000</span></span></span>) - Abort the pick and return an error after this many milliseconds of inactivity. Default 60 s.

**advanced**
- `onDomFail` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;error&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">error</span> <span data-cli="choice">text</span> <span data-cli="choice">screen</span></span></span>) - When format is md/html/selector and DOM inspect fails: error = exit 1 (default); text = UIA spoken text; screen = capture spec.
- `chromePreview` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show live Chrome CSS details in the HUD after the cursor settles. Uses blocking extension IPC and may feel slow on some machines.
- `colorMagnifier` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Color picks: show the live 8× loupe. Disable on slow software GDI/DWM machines; pixel sampling still works.
- `textMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-262144</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Chrome DOM plain-text cap (innerText/speakText). 0 = unlimited (default). Set e.g. 8192 to truncate long articles.
- `htmlMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-3.35544e+07</span>, <span data-cli="default">default <span data-cli="value">8388608</span></span></span>) - Cap cleaned HTML (format=html and the html field used for md). 0 = unlimited. Default 8 MiB (probe default).
- `markdownMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-3.35544e+07</span>, <span data-cli="default">default <span data-cli="value">2097152</span></span></span>) - Cap markdown after conversion (format=md). 0 = unlimited. Default 2 MiB (probe default).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">audio_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Source audio (wav, mp3, …). Default: empty → PREVIOUS chain value.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Destination WAV. Default: empty → <stem>-filtered.wav next to the source.

**filter**
- `filter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;deepfilter&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Enhancer. deepfilter = DeepFilterNet @ 48 kHz. gtcrn = reserved (16 kHz).
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter then exe/../models.
- `attenLim` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-100</span>, <span data-cli="default">default <span data-cli="value">100.0</span></span></span>) - Attenuation limit in dB (in-process libDF only). Default: 100.
- `postFilter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Over-attenuate very noisy sections. Default: false.
- `compensateDelay` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Compensate STFT / model lookahead. Default: true.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;audioPath&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: audioPath.

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

- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;audioDevices&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: audioDevices.

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;List&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">List</span> <span data-cli="choice">Unload</span></span></span>) - List loaded models in this xBlox process, or unload one by key.
- `key` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;vibevoice:tts&quot;</span></span></span>) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;modelKey&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">audio_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Audio file to play. Default: empty → PREVIOUS chain value.

**device**
- `outputDevice` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Playback device. Default: empty → App Settings audio_output_device, then system default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional variable for PREVIOUS. Default: empty (PREVIOUS only).

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

Record mic, desktop, or mixed audio to a file. outputPath extension selects format: .wav = PCM (48 kHz stereo default; long takes spill PCM to disk after ~30 s in RAM); .m4a or .aac = AAC-LC (Windows only). Optional filter runs after capture (DeepFilterNet → 48 kHz mono WAV; not on the callback). Stores the output path in PREVIOUS / storeAs. Optional hud / hudMode shows the Record overlay pill and/or the app taskbar button (Stop ends the take early).

Params:

**source**
- `inputSource` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;mic&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Capture source. Default: mic (microphone). desktop = system loopback; mix = mic + desktop.
- `device` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Mic device for mic/mix. Default: empty → App Settings audio_input_device, then system default.
- `desktopDevice` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Loopback device substring for desktop/mix. Default: empty → default render device.
- `micGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Mic level multiplier (linear) for mix. Default: 1.0.
- `desktopGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Desktop level multiplier for desktop/mix. Default: 1.0.
- `sampleRate` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-192000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Sample rate Hz (0 = default 48000). AAC (.m4a) on Windows is encoded at 48000 Hz (resampled if needed).
- `channels` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-2</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Channels: 0 = default stereo, 1 = mono, 2 = stereo. Applies to .wav and .m4a/.aac.

**input**
- `durationMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="type">100-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Recording duration in milliseconds. Default: 3000.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path; extension selects format. .wav = PCM WAV; .m4a or .aac = AAC-LC (Windows only). Default: empty → temporary .wav in the system temp directory. filter requires .wav.

**filter**
- `filter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;off&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Enhance after capture. off = dry file. deepfilter = DeepFilterNet @ 48 kHz mono. gtcrn = reserved.
- `filterModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter.
- `attenLim` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-100</span>, <span data-cli="default">default <span data-cli="value">100.0</span></span></span>) - Attenuation limit in dB (in-process libDF only). Default: 100.
- `postFilter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Over-attenuate very noisy sections. Implies deepfilter when filter is off.
- `compensateDelay` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Compensate STFT / model lookahead. Default: true.

**hud**
- `hudMode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;overlay&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">taskbar</span> <span data-cli="choice">overlay</span> <span data-cli="choice">both</span></span></span>) - Status HUD. taskbar = app taskbar button. overlay = standalone pill over the clock. both = combine. off = none.
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Master switch for hudMode. Overlay Stop / taskbar Stop cancels the block.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;audioPath&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: audioPath.

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
  "hudMode": "overlay",
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
- `inputSource` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;mic&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Capture source. Default: mic (microphone). desktop = system loopback; mix = mic + desktop.
- `device` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Mic device for mic/mix. Default: empty → App Settings audio_input_device, then system default.
- `desktopDevice` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Loopback device substring for desktop/mix. Default: empty → default render device.
- `micGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Mic level multiplier (linear) for mix. Default: 1.0.
- `desktopGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Desktop level multiplier for desktop/mix. Default: 1.0.
- `sampleRate` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-192000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Sample rate Hz (0 = default 48000). AAC (.m4a) on Windows is encoded at 48000 Hz (resampled if needed).
- `channels` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-2</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Channels: 0 = default stereo, 1 = mono, 2 = stereo. Applies to .wav and .m4a/.aac.

**input**
- `session` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Recording session id. Default: empty → auto-generated unique id.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path; extension selects .wav vs .m4a/.aac (see audioRecord). Default: empty → temporary .wav at start; audioRecordStop outputPath overrides.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;recordSession&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: recordSession.

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
- `session` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Session id from audioRecordStart. Default: empty (required at runtime).

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path; extension selects .wav vs .m4a/.aac (see audioRecord). Default: empty → path from audioRecordStart, or temporary .wav.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;audioPath&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: audioPath.

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
- `text` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Text to speak, or path to a text file (.txt, .md, …). Files are loaded (binary rejected); inline/PREVIOUS markdown is preparsed when detected. Chain fsRead → audioSpeak with empty text to speak file contents. Default: empty → PREVIOUS string (required at runtime).

**voice_model**
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - TTS provider override. Default: empty → App Settings tts_provider (required).
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - TTS model override. Default: empty → App Settings tts_model; pixlwiz → pixlwiz-speech when unset. moss → moss-tts-nano GGUF bundle.
- `voice` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Voice id / UUID / GGUF path. Default: empty → App Settings tts_voice_id.

**local_tts**
- `tokenizer` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Tokenizer GGUF path. Required for VibeVoice; MOSS defaults to models/moss-tts-nano/moss-nano-tokenizer.gguf.
- `codec` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - MOSS Audio Tokenizer Nano GGUF. Default: empty → models/moss-tts-nano/moss-audio-tokenizer-nano.gguf.
- `refAudio` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Reference WAV for VibeVoice 1.5B or MOSS Nano cloning. Default: empty.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Named cached local TTS engine instance. Default: empty → auto-key by model args.

**device**
- `outputDevice` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Playback device. Default: empty → App Settings audio_output_device, then system default.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Optional synthesized audio path (.wav). Default: empty → play only, no file saved.

**hud**
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show the overlay HUD while synthesizing and playing. Default off.

**elevenlabs**
- `sendVoiceSettings` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - ElevenLabs direct only: send voice_settings (stability/similarity/style). Default: true.
- `chunkSentences` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - ElevenLabs direct only: split long text with request stitching. Default: true.
- `chunkTargetChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">100-800</span>, <span data-cli="default">default <span data-cli="value">400</span></span></span>) - ElevenLabs direct only: greedy-merge sentences up to this many chars. Default: 400.
- `chunkMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">200-2000</span>, <span data-cli="default">default <span data-cli="value">800</span></span></span>) - ElevenLabs direct only: hard-split a single long sentence. Default: 800.
- `stability` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.9</span></span></span>) - ElevenLabs direct only: stability (0–1). Default: 0.9.
- `similarityBoost` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.75</span></span></span>) - ElevenLabs direct only: similarity_boost (0–1). Default: 0.75.
- `style` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.0</span></span></span>) - ElevenLabs direct only: style (0–1). Default: 0 (non-zero can add drift/noise).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional variable for PREVIOUS. Default: empty (PREVIOUS only).

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
- `input` (<span data-cli="meta"><span data-cli="type">audio_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Input audio file (wav, mp3, …). Default: empty → PREVIOUS when it is an existing file, otherwise live capture.

**hud**
- `mode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;off&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">transcribe</span></span></span>) - HUD preset. transcribe = level pill + overlay. off = no HUD unless hud is on.
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show the recording HUD (levels + stop) and the overlay pill. Implied when mode=transcribe. Default off.

**source**
- `inputSource` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;mic&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Live capture source when input is not a file. mic = microphone; desktop = system loopback; mix = mic + desktop. Same as audioRecord / video audioSource.
- `device` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Mic device for mic/mix. Default: empty → App Settings audio_input_device, then system default. Ignored when input is an existing file.
- `desktopDevice` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Loopback device substring for desktop/mix. Default: empty → default render device. Ignored when input is an existing file.
- `micGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Mic level multiplier (linear) for mic/mix. Default: 1.0.
- `desktopGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Desktop/loopback level multiplier for desktop/mix. Default: 1.0.

**recording**
- `maxDurationMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">500-120000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Max live capture duration (ms). Default: 30000. Ignored when input is an existing file.
- `silenceMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">1500</span></span></span>) - VAD silence stop (ms) after speech. Default: 1500. 0 = disabled. Ignored when input is an existing file.

**speech_model**
- `stt` (<span data-cli="meta"><span data-cli="type">stt_route</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Dictation STT route {preset,provider,model,options}. Empty {} inherits App Settings. Flat provider/model remain aliases.
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - STT provider override (alias of stt.provider). Default: empty → App Settings stt_provider (required).
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - STT model override (alias of stt.model). Default: empty → App Settings stt_model when provider matches; whisper → base.en (fallback; prefer large-v3-turbo when installed); pixlwiz → pixlwiz-speech-to-text.
- `providerOptions` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Whisper-only options object (alias of stt.options). Defaults: backend=gpu (falls back to cpu), language=auto, threads=0 (auto), flashAttn=auto. Whisper models resolve under ${MODELS_DIR} then exe/../models.

**advanced**
- `apiKey` (<span data-cli="meta"><span data-cli="type">api_key</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - API key override. Default: empty → App Settings providers map (not used for whisper).

**output**
- `json` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Return structured STT JSON vs transcript string. Includes segments when available. Default: false.
- `subtitleFormat` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;none&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">srt</span> <span data-cli="choice">vtt</span> <span data-cli="choice">sbv</span> <span data-cli="choice">all</span></span></span>) - Write YouTube-accepted sidecar(s) next to the audio (or subtitlePath).
- `subtitlePath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Sidecar stem. Default: empty → next to the source/WAV.
- `subtitleMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">8-120</span>, <span data-cli="default">default <span data-cli="value">42</span></span></span>) - Cue wrap width.
- `subtitleMaxLines` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-4</span>, <span data-cli="default">default <span data-cli="value">2</span></span></span>) - Cue wrap line count.
- `result` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Structured STT payload when json=true: provider, model, transcript, segments, duration, samples, optional wav/subtitlePath.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;transcript&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: transcript.

**debug_output**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Save captured WAV. Default: empty → temp file deleted after transcription.

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
- `input` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - SRT/VTT/JSON path, or PREVIOUS transcribe JSON. Default: empty → PREVIOUS.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Canonical 48 kHz mono PCM WAV. Required.

**voice_model**
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - TTS provider. Default: empty → App Settings tts_provider.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - TTS model. Default: empty → App Settings.
- `voice` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Voice id. Default: empty → App Settings tts_voice_id.

**timeline**
- `overflow` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;resolve&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">resolve</span> <span data-cli="choice">truncate</span></span></span>) - resolve = gap → stretch ≲12% → speed regen ≤1.2 → overlap+warn. truncate = hard-cut (power user).
- `maxStretchPercent` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-25</span>, <span data-cli="default">default <span data-cli="value">12.0</span></span></span>) - Max DSP time-compress percent before regeneration. Default: 12.
- `minGapMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-500</span>, <span data-cli="default">default <span data-cli="value">80</span></span></span>) - Minimum inter-utterance silence. Default: 80.
- `maxUtteranceMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">500-25000</span>, <span data-cli="default">default <span data-cli="value">8000</span></span></span>) - Do not merge cues past this estimated duration. Default: 8000.

**elevenlabs**
- `speed` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0.7-1.2</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Initial ElevenLabs speed (0.7–1.2). Default: 1.0.
- `seed` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - Best-effort seed. Default: -1 → derived from text+voice.
- `alignment` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Reserved: character alignment. V1 places from PCM duration only.
- `sendVoiceSettings` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Send voice_settings. Default: true.
- `stability` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.45</span></span></span>) - Lower is more expressive (chat TTS uses 0.9, which sounds flat on short cues). Default: 0.45.
- `similarityBoost` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.8</span></span></span>) - Stay on-voice. Default: 0.80.
- `style` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.2</span></span></span>) - Light style exaggeration for narration. Default: 0.20. High values can add artifacts.
- `speakerBoost` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - ElevenLabs use_speaker_boost. Default: true.
- `textNormalization` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">on</span> <span data-cli="choice">off</span></span></span>) - apply_text_normalization. Default: auto.

**output**
- `cacheDir` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Take cache directory. Default: empty → <output>/.voiceover-cache.
- `json` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Return overflow-report JSON instead of the WAV path.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;voiceoverPath&quot;</span></span></span>) - Variable for PREVIOUS. Default: voiceoverPath.

**hud**
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show overlay HUD while generating. Default off.

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;Start&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">Still</span> <span data-cli="choice">Start</span> <span data-cli="choice">Stop</span> <span data-cli="choice">Status</span> <span data-cli="choice">Replay</span></span></span>) - Still = one match then stop (or wait on a running instance). Start keeps a named instance; with child items it runs them on each match until Stop. Stop / Status address the same instance. Replay injects text (no mic).
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;default&quot;</span></span></span>) - Named listen instance. Use the same name for Stop / Status / a later Still.
- `durationMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-8.64e+07</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Still / Start-with-children: stop waiting after this many ms. 0 = until Stop or cancel.

**matcher**
- `phrase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional spoken phrase or catalog id to accept. Empty = any wake+command. On match, child items run with PREVIOUS = the trigger envelope.
- `wakePhrase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;Tanit&quot;</span></span></span>) - Wake prefix. Default: Tanit (or Audio & Video voice_commands).
- `route` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;trigger&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trigger</span></span></span>) - XBlox mapping uses trigger. Children replace catalog dispatch unless dispatch is on.
- `dispatch` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Also run the catalog command (hotkey / app_cmd) on a match. Default off — children are the mapping.

**replay**
- `text` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Replay only: full utterance including the wake word, e.g. "Tanit screenshot".

**source**
- `inputSource` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;mic&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Capture source. Default: mic (microphone). desktop = system loopback; mix = mic + desktop.
- `device` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Mic device for mic/mix. Default: empty → voice_commands.audio_input_device, then App Settings audio_input_device.
- `desktopDevice` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Loopback device for desktop/mix. Default: empty → default render device.
- `micGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Mic level multiplier (linear) for mic/mix. Default: 1.0.
- `desktopGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Desktop level multiplier for desktop/mix. Default: 1.0.

**filter**
- `filter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">off</span> <span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Enhance after VAD. auto = DeepFilter when available. off = dry/APM. deepfilter / gtcrn are strict.
- `filterModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter.
- `postFilter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Over-attenuate very noisy sections (DeepFilter). Default: false.
- `filterBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Wet/dry mix after enhancement. 0 = original, 1 = full filter (default).

**speech_model**
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - STT provider override. Default: empty → App Settings stt_provider.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - STT model override. Default: empty → App Settings stt_model when provider matches.
- `language` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span></span>) - Whisper language (auto, en, de, …). Default: auto.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;voice&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: voice.

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
- `id` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Device address (AA:BB:CC:DD:EE:FF) or name substring. Empty = use PREVIOUS.

**advanced**
- `autoRoute` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - After connecting, set the device's audio endpoint as the default playback device.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">6000</span></span></span>) - How long to wait (ms) for the audio endpoint to go ACTIVE.
- `delayMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-30000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Extra delay (ms) after connecting before the block returns. Use for AV receivers that need time to switch inputs or unmute (0 = none).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;bluetooth&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `id` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Device address or name substring. Empty = use PREVIOUS.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;bluetooth&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `capture` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - List recording (capture) endpoints instead of playback.
- `includeDisconnected` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Also include UNPLUGGED endpoints (paired Bluetooth devices not yet connected).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;audioEndpoints&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `nearby` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Also issue an inquiry for nearby discoverable devices (slow).
- `autoRoute` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Implicitly route audio output to a connected Bluetooth audio device.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;bluetoothDevices&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `id` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Device address or name substring. Empty = use PREVIOUS.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;bluetooth&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `id` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - MMDevice endpoint id (e.g. "{0.0.0.00000000}.{guid}"). Empty = use PREVIOUS.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;bluetooth&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `id` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Device address or name substring. Empty = use PREVIOUS.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;bluetooth&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `epoch` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional page epoch from Browser Read.
- `steps` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Ordered step objects with action/type plus step fields.

**options**
- `defaultDelayMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-5000</span>, <span data-cli="default">default <span data-cli="value">50</span></span></span>)
- `continueOnError` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Opaque ref returned by Browser Read/Find.
- `epoch` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Page epoch returned with the ref.
- `selector` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - CSS selector alternative to ref.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Opaque ref returned by Browser Read/Find.
- `epoch` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Page epoch returned with the ref.
- `selector` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - CSS selector alternative to ref.
- `role` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>)
- `name` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>)

**options**
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>)

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Opaque ref returned by Browser Read/Find.
- `epoch` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Page epoch returned with the ref.
- `selector` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - CSS selector alternative to ref.

**options**
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-500</span>, <span data-cli="default">default <span data-cli="value">120</span></span></span>)
- `viewportOnly` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)

**advanced**
- `textMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100000</span>, <span data-cli="default">default <span data-cli="value">12000</span></span></span>)

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Opaque ref returned by Browser Read/Find.
- `epoch` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Page epoch returned with the ref.
- `selector` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - CSS selector alternative to ref.
- `value` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>)
- `label` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>)
- `index` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Zero-based option index alternative.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - Previous Browser Read/Find result; extracts epoch and the first ref.
- `ref` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Opaque ref returned by Browser Read/Find.
- `epoch` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Page epoch returned with the ref.
- `selector` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - CSS selector alternative to ref.
- `text` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Text to enter.

**options**
- `clear` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>)
- `submit` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `commandId` (<span data-cli="meta"><span data-cli="type">string</span></span>) - Optional: look up a commands.json entry by id. Leave empty to call an inline app/CLI/external action below.
- `command` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Inline call: app/CLI/external/url/path plus args. Args support ${var} from the xblox context (deep-resolved).

**advanced**
- `args` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Extra argv tokens appended after the saved/inline command. Use two tokens for xblox scope, e.g. --CURRENT_FILE and ${output}.
- `log` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Echo captured stdout/stderr to the host logger and xBlox run log, prefixed with this block's id.
- `stdout` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;info&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span> <span data-cli="choice">off</span></span></span>) - Log level for captured stdout lines.
- `stderr` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;error&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span> <span data-cli="choice">off</span></span></span>) - Log level for captured stderr lines.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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

- `name` (<span data-cli="meta"><span data-cli="type">variable_ref</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Variable name to read.
- `target` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;PREVIOUS&quot;</span></span></span>) - Variable to copy the value into. PREVIOUS updates the pipeline value only.

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
- `level` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;info&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span></span></span>) - Log level.
- `message` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;PREVIOUS&quot;</span></span></span>) - Message or variable expression. Leave empty to log the whole scope.

**query**
- `input` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;PREVIOUS&quot;</span></span></span>) - Optional context variable to query with jq. When set with filter/query, it replaces message output.
- `filter` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;.&quot;</span></span></span>) - jq filter applied to input, e.g. .items[0].name.
- `format` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">json</span></span></span>) - auto prints scalars naturally and objects/arrays as JSON; json always emits compact JSON.

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

- `scope` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;context&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">context</span></span></span>) - State area to persist. Currently only document context.
- `mode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;existing&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">existing</span> <span data-cli="choice">all</span></span></span>) - existing = update keys already present in the file context. all = write the full current scope.
- `keys` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Optional context keys to persist. Empty uses mode.

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

- `name` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Variable name to write.
- `value` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Literal value (JSON). String values interpolate ${var}.
- `valueFrom` (<span data-cli="meta"><span data-cli="type">string</span></span>) - Copy this context variable. Wins over value when set.
- `fallbackFrom` (<span data-cli="meta"><span data-cli="type">string</span></span>) - If the chosen value is empty, copy this context variable instead.
- `expression` (<span data-cli="meta"><span data-cli="type">expression</span></span>) - Expression evaluated to the stored value. Overrides value when set.

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
- `mode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">all</span> <span data-cli="choice">line</span></span></span>) - all = read the entire stream to EOF; line = read the next line (streamable inside loops).
- `parse` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;text&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">text</span> <span data-cli="choice">json</span> <span data-cli="choice">number</span> <span data-cli="choice">boolean</span> <span data-cli="choice">auto</span></span></span>) - Result type for PREVIOUS/storeAs: text (string), json (object/array/scalar), number (int/float � usable in expressions), boolean, or auto (JSON-scalar detection with text fallback). Binary input (NUL bytes) is rejected.
- `trim` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Trim trailing whitespace/newlines before parsing.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `message` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;PREVIOUS&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Message or variable expression. Leave empty to output the whole scope.
- `newline` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Append a newline.

**query**
- `input` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;PREVIOUS&quot;</span></span></span>) - Optional context variable to query with jq. When set with filter/query, it replaces message output.
- `filter` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;.&quot;</span></span></span>) - jq filter applied to input, e.g. .items[0].name.
- `format` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">json</span></span></span>) - auto prints scalars naturally and objects/arrays as JSON; json always emits compact JSON.

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
- `parser` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;jq&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">jq</span> <span data-cli="choice">jsonpath</span></span></span>) - Parser engine.

**input**
- `filter` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;.&quot;</span></span></span>) - jq filter expression (e.g. .items[] | select(.active)).
- `input` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;PREVIOUS&quot;</span></span></span>) - Input to parse. Leave as PREVIOUS to use the previous block's result.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;parsed&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `parser` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;jq&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">jq</span> <span data-cli="choice">jsonpath</span></span></span>) - Parser engine.

**input**
- `filter` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;.&quot;</span></span></span>) - jq filter expression to select the value to iterate.
- `input` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;PREVIOUS&quot;</span></span></span>) - Scope/context variable to iterate. Leave as PREVIOUS to use the previous block's result.

**iteration**
- `mode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">array</span> <span data-cli="choice">objectEntries</span> <span data-cli="choice">objectValues</span> <span data-cli="choice">once</span></span></span>) - How to normalize the selected value before fan-out.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;items&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `src` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - File, folder, glob, or URI. Leave empty to use PREVIOUS (path, list, or fsList entries). ${…} expand in the transfer lib.
- `dst` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Destination folder (path or URI). Keep ${KNOWNFOLDER:Desktop} / ${CWD} as stored templates.

**options**
- `conflict` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;error&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">error</span> <span data-cli="choice">overwrite</span> <span data-cli="choice">skip</span> <span data-cli="choice">rename</span> <span data-cli="choice">if-newer</span></span></span>) - When a dest file already exists.
- `include` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Keep sources matching this glob. Separate multiple with ;
- `exclude` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Drop sources matching this glob. Separate multiple with ;
- `dryRun` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Expand variables and sources only; do not copy.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">custom</span></span></span>) - File or folder to delete. Leave empty to use PREVIOUS.

**delete_options**
- `recursive` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Delete a directory and all of its contents.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">custom</span></span></span>) - File or folder to check. Leave empty to use PREVIOUS.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;exists&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mustExist</span> <span data-cli="choice">readable</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">custom</span></span></span>) - File to hash. Leave empty to use PREVIOUS as the path.

**hash_options**
- `algorithm` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;sha256&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">sha256</span></span></span>) - Hash algorithm.
- `prefixLength` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-64</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Return only the first N hex characters. 0 returns the full digest.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;hash&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span> <span data-cli="choice">custom</span></span></span>) - Directory to list, or a glob pattern such as ${ENV:HOME}/*.png. Leave empty to use PREVIOUS.

**list_options**
- `only` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">all</span> <span data-cli="choice">dir</span> <span data-cli="choice">file</span></span></span>) - Show all entries, only folders, or only files.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;entries&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">custom</span></span></span>) - Folder path or URI to create (and parents). Leave empty to use PREVIOUS. ${…} expand in the transfer lib.

**options**
- `dryRun` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Expand variables only; do not create.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `src` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - File, folder, glob, or URI. Leave empty to use PREVIOUS.
- `dst` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Destination folder (path or URI). Same ${…} templates as fsCopy.

**options**
- `conflict` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;error&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">error</span> <span data-cli="choice">overwrite</span> <span data-cli="choice">skip</span> <span data-cli="choice">rename</span> <span data-cli="choice">if-newer</span></span></span>) - When a dest file already exists.
- `include` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Keep sources matching this glob. Separate multiple with ;
- `exclude` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Drop sources matching this glob. Separate multiple with ;
- `dryRun` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Expand variables and sources only; do not move.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `ext` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;txt&quot;</span></span></span>) - File type to create, e.g. txt or .txt. Uses the localized Explorer New name for that type. Alias: extension.
- `path` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span></span>) - Folder to create the file in. Leave empty to use PREVIOUS (folder, or parent of a file) or the current directory.

**options**
- `name` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional file name override. Empty = localized Explorer New name.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mustExist</span> <span data-cli="choice">readable</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">custom</span></span></span>) - File to read. Leave empty to use PREVIOUS as the path.

**read_options**
- `encoding` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;text&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">text</span> <span data-cli="choice">json</span></span></span>) - Read as plain text, or parse the file as JSON.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;fileContent&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">custom</span></span></span>) - File to write.
- `content` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Content to write. Leave empty to use PREVIOUS.

**write_options**
- `append` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Append to the existing file instead of overwriting it.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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

- `comparator` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;===&quot;</span></span></span>) - Comparison operator (===, !=, <, >, ...).
- `expression` (<span data-cli="meta"><span data-cli="type">expression</span></span>) - Value the switch variable is compared against.

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

- `condition` (<span data-cli="meta"><span data-cli="type">expression</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;true&quot;</span></span></span>) - Condition expression.

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

- `code` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Process exit code (0-255). Standard meanings: 0 = success, 1 = general error, 2 = misuse/invalid input, 126 = not executable, 127 = not found, 130 = interrupted (Ctrl+C). Any other value is allowed for app-specific signalling to pipelines.
- `message` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional message recorded on the exit event.

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

- `initial` (<span data-cli="meta"><span data-cli="type">expression</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;0&quot;</span></span></span>) - Loop counter initial value.
- `comparator` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&lt;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">&lt;</span> <span data-cli="choice">&lt;=</span> <span data-cli="choice">&gt;</span> <span data-cli="choice">&gt;=</span> <span data-cli="choice">!=</span> <span data-cli="choice">==</span></span></span>)
- `final` (<span data-cli="meta"><span data-cli="type">expression</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;3&quot;</span></span></span>) - Loop bound expression.
- `modifier` (<span data-cli="meta"><span data-cli="type">expression</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;+1&quot;</span></span></span>) - Counter increment expression, e.g. +1 or *2.

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

- `condition` (<span data-cli="meta"><span data-cli="type">expression</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;true&quot;</span></span></span>) - Condition expression.

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

- `event` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;On Start&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">On Start</span> <span data-cli="choice">On End</span></span></span>) - Document lifecycle moment that runs this block's children once.

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

- `variable` (<span data-cli="meta"><span data-cli="type">variable_ref</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;mode&quot;</span></span></span>) - Variable to switch on.

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

- `ms` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Duration to sleep in milliseconds.

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
- `condition` (<span data-cli="meta"><span data-cli="type">expression</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;false&quot;</span></span></span>) - Loop condition expression.

**advanced**
- `loopLimit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-1e+06</span>, <span data-cli="default">default <span data-cli="value">10</span></span></span>) - Maximum iterations (safety cap).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Image file, folder, or glob. Uses PREVIOUS when unset.

**scan**
- `recursive` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Recurse into folder inputs.

**filter**
- `minScore` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.0</span></span></span>) - Keep rows with junk.hint >= this. 0 = every decoded image.
- `junkKinds` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span></span>) - dark,bright,blur,flat,tiny or all.
- `maxResults` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - 0 = unlimited.

**tune**
- `edgeEnergyBlur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-128</span>, <span data-cli="default">default <span data-cli="value">12.0</span></span></span>) - Blur: mean |dx|+|dy| at/above this → that term is 0.
- `edgeEnergyP90Blur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-256</span>, <span data-cli="default">default <span data-cli="value">40.0</span></span></span>) - Blur OOF path: p90 |dx|+|dy| at/above this → that term is 0.
- `edgeEnergyP99Blur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-510</span>, <span data-cli="default">default <span data-cli="value">88.0</span></span></span>) - Blur: p99 |dx|+|dy| at/above this → blur 0 (screenshots / sharp islands).
- `edgeOrientBlur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.2</span></span></span>) - Blur motion path: orientation peak at/below this → that term is 0.
- `edgeDensityLo` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.06</span></span></span>) - edgeDensity at/above this counts as having edges.
- `analyzeMaxSide` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">16-1024</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>) - Analysis thumbnail longest side.
- `tinyMinSide` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-4096</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>) - tiny score 0 when min(width,height) >= this.
- `edgeThreshold` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-510</span>, <span data-cli="default">default <span data-cli="value">24</span></span></span>) - |dx|+|dy| above this is an edge pixel.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;analyses&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `prompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Prompt for image generation/editing.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path. Empty = core default naming.

**model**
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Image generation provider. Empty = App Settings image provider.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Image generation model. Empty = App Settings image model.
- `replicateCollection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;official&quot;</span></span></span>) - Replicate collection for browsing models. Only relevant when provider = replicate.
- `providerOptions` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Replicate model-specific input fields (seed, num_inference_steps, ...). Resolved per model via OpenAPI cache.

**auth**
- `apiKey` (<span data-cli="meta"><span data-cli="type">api_key</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - API key override. Empty = from App Settings.
- `baseUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Provider base URL override. Empty = provider default/App Settings.

**request**
- `aspectRatio` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">1:1</span> <span data-cli="choice">16:9</span> <span data-cli="choice">9:16</span> <span data-cli="choice">4:3</span> <span data-cli="choice">3:4</span> <span data-cli="choice">21:9</span></span></span>) - Aspect ratio shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `imageSize` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">512</span> <span data-cli="choice">1K</span> <span data-cli="choice">2K</span> <span data-cli="choice">4K</span></span></span>) - Size shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `references` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Reference image paths (one per row). Each supports the file picker.

**pre_resize**
- `resizeFirst` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Pre-resize input/reference raster before sending to the provider.
- `resizeWidth` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-8192</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Longest edge for pre-resize when resizeFirst is on. 0 = provider/default.
- `preresizeRawOnly` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - When pre-resizing, only force RAW/HEIC rasters through the explicit long-edge resize.

**hud**
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show the movable overlay HUD while this block runs. Default off.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Image file, folder, or glob. Uses PREVIOUS when unset.

**query**
- `mode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;junk&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">junk</span> <span data-cli="choice">name</span></span></span>) - junk = quality scores. name = filename / folder substring. duplicates = parked.
- `prompt` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Required for mode=name.

**scan**
- `recursive` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Recurse into folder inputs.

**filter**
- `minScore` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.7</span></span></span>) - Junk: minimum hint to match.
- `junkKinds` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span></span>) - dark,bright,blur,flat,tiny or all.
- `maxResults` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>)

**tune**
- `edgeEnergyBlur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-128</span>, <span data-cli="default">default <span data-cli="value">12.0</span></span></span>) - Same as find --edge-energy-blur.
- `edgeEnergyP90Blur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-256</span>, <span data-cli="default">default <span data-cli="value">40.0</span></span></span>) - Same as find --edge-energy-p90-blur.
- `edgeEnergyP99Blur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-510</span>, <span data-cli="default">default <span data-cli="value">88.0</span></span></span>) - Same as find --edge-energy-p99-blur.
- `edgeOrientBlur` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.2</span></span></span>) - Same as find --edge-orient-blur.
- `edgeDensityLo` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.06</span></span></span>) - Same as find --edge-density-lo.
- `analyzeMaxSide` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">16-1024</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>)
- `tinyMinSide` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-4096</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>)
- `edgeThreshold` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-510</span>, <span data-cli="default">default <span data-cli="value">24</span></span></span>)

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;matches&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;List&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">List</span> <span data-cli="choice">Unload</span></span></span>) - List loaded models in this xBlox process, or unload one by key.
- `key` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;llama:vlm&quot;</span></span></span>) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;modelKey&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Input image path or glob. Uses PREVIOUS when unset.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output file, directory, or dst template. Empty = core default output path(s).
- `suffix` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Suffix for implicit output names, e.g. _small.

**dimensions**
- `maxWidth` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Target/max width. 0 = unconstrained.
- `maxHeight` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Target/max height. 0 = unconstrained.
- `allowEnlargement` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Allow upscaling.

**format**
- `format` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">jpg</span> <span data-cli="choice">jpeg</span> <span data-cli="choice">png</span> <span data-cli="choice">webp</span> <span data-cli="choice">avif</span> <span data-cli="choice">tif</span> <span data-cli="choice">tiff</span> <span data-cli="choice">heic</span></span></span>) - Output format. Empty = infer from output path/input.
- `fit` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;inside&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">inside</span> <span data-cli="choice">cover</span> <span data-cli="choice">contain</span> <span data-cli="choice">fill</span> <span data-cli="choice">outside</span></span></span>) - Resize fit mode, matching Sharp/libvips semantics.
- `position` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;centre&quot;</span></span></span>) - For cover: centre, attention, entropy, low, high, etc.
- `kernel` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;lanczos3&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">nearest</span> <span data-cli="choice">cubic</span> <span data-cli="choice">mitchell</span> <span data-cli="choice">lanczos2</span> <span data-cli="choice">lanczos3</span></span></span>) - Resize kernel.
- `background` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;#ffffff&quot;</span></span></span>) - Letterbox color for contain, e.g. #ffffff.

**codec**
- `quality` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">85</span></span></span>) - JPEG/WebP/AVIF quality.
- `pngCompression` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-9</span>, <span data-cli="default">default <span data-cli="value">6</span></span></span>) - PNG DEFLATE compression level.
- `stripMetadata` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Strip metadata on output where supported.

**transform**
- `rotate` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-270</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Rotate 0, 90, 180, or 270 degrees after autorotate.
- `flip` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Vertical flip.
- `flop` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Horizontal flop.
- `autorotate` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Apply EXIF orientation.

**cache**
- `cache` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Enable resize output cache.
- `cacheDir` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Cache directory. Empty = core default.

**network**
- `urlTimeoutSec` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-3600</span>, <span data-cli="default">default <span data-cli="value">5</span></span></span>) - HTTP(S) input timeout in seconds.
- `urlMaxRedirects` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Max HTTP redirects.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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

Capture a monitor, window, or webcam to an image file and/or clipboard. Set pick=interactive to choose the region in the same block (click window/UIA, drag a rectangle). pick=off uses input or PREVIOUS from a Picker block.

Params:

**input**
- `input` (<span data-cli="meta"><span data-cli="type">screen_input</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;screen:0&quot;</span></span></span>) - Capture source when pick=off. Same format as videoDetect. Ignored when pick=interactive (the pick becomes the source).

**picker**
- `pick` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;off&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">interactive</span></span></span>) - interactive runs the window/element picker, then captures that region. off uses input (or PREVIOUS). Click = window/UIA; drag = free rectangle; Alt+wheel or [ ] cycles the stack; Esc cancels.
- `includeOpenWindows` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Monitor/desktop picks: capture open apps on that display (layer=monitor). Off = wallpaper only.
- `highlight` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Translucent highlight overlay while picking.
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Picker HUD chip (stack name / shortcuts). Off keeps the highlight.
- `resolveUia` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Resolve the UIA element under the cursor (web nodes, video players).
- `showHidden` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Include non-visible child windows (Chrome render widget, etc.).
- `siblings` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Alt+wheel / [ ] stack includes sibling panes and their union. Off = leaf and ancestors only.
- `magnifier` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Open the 8× loupe at pick start (Z toggles).
- `pickTimeoutMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1000-600000</span>, <span data-cli="default">default <span data-cli="value">60000</span></span></span>) - Abort the pick after this many milliseconds. Default 60 s.

**output**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path (.jpg or .png). Optional leave empty to skip saving.
- `copyToClipboard` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Copy the captured image to the clipboard as CF_DIB (bitmap).
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

**advanced**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">100-60000</span>, <span data-cli="default">default <span data-cli="value">5000</span></span></span>) - Webcam capture timeout in milliseconds (unused for screen sources).

**capture_options**
- `hudCapture` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">exclude</span> <span data-cli="choice">visible</span></span></span>) - Overlay capture policy. With pick=interactive, visible BitBlts the live picker HUD/highlight into the still before the overlay closes. auto and exclude omit overlays. Idle picker/status HUDs stay visible to Windows Snap and other-process recorders.

Features: cancellable

Default block:

```json
{
  "copyToClipboard": false,
  "highlight": true,
  "hud": true,
  "hudCapture": "auto",
  "includeOpenWindows": true,
  "input": "screen:0",
  "kind": "imageScreenshot",
  "magnifier": false,
  "outputPath": "",
  "pick": "off",
  "pickTimeoutMs": 60000,
  "resolveUia": true,
  "showHidden": true,
  "siblings": false,
  "storeAs": "imagePath",
  "timeoutMs": 5000
}
```

---

#### Transform Image

Edit one or more images with an AI prompt using the same core transform_image API as the CLI transform command.

Params:

**input**
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Input image path or glob. Uses PREVIOUS when unset.
- `prompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Prompt for image generation/editing.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path. Empty = core default naming.

**model**
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Image generation provider. Empty = App Settings image provider.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Image generation model. Empty = App Settings image model.
- `replicateCollection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;official&quot;</span></span></span>) - Replicate collection for browsing models. Only relevant when provider = replicate.
- `providerOptions` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Replicate model-specific input fields (seed, num_inference_steps, ...). Resolved per model via OpenAPI cache.

**auth**
- `apiKey` (<span data-cli="meta"><span data-cli="type">api_key</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - API key override. Empty = from App Settings.
- `baseUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Provider base URL override. Empty = provider default/App Settings.

**request**
- `aspectRatio` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">1:1</span> <span data-cli="choice">16:9</span> <span data-cli="choice">9:16</span> <span data-cli="choice">4:3</span> <span data-cli="choice">3:4</span> <span data-cli="choice">21:9</span></span></span>) - Aspect ratio shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `imageSize` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">512</span> <span data-cli="choice">1K</span> <span data-cli="choice">2K</span> <span data-cli="choice">4K</span></span></span>) - Size shortcut  -  not all providers use this; for Replicate use providerOptions instead.
- `references` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Reference image paths (one per row). Each supports the file picker.

**pre_resize**
- `resizeFirst` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Pre-resize input/reference raster before sending to the provider.
- `resizeWidth` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-8192</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Longest edge for pre-resize when resizeFirst is on. 0 = provider/default.
- `preresizeRawOnly` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - When pre-resizing, only force RAW/HEIC rasters through the explicit long-edge resize.

**hud**
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show the movable overlay HUD while this block runs. Default off.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Input image path or glob. Uses PREVIOUS when unset. Pass multiple images for comparison prompts.
- `prompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Vision question or instruction for the recognition model.

**model**
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Image recognition provider. Empty = App Settings image recognition provider.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Image recognition model. Empty = App Settings image recognition model. For provider=llama, local VLMs come from vision.models.vlm.
- `replicateCollection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;official&quot;</span></span></span>) - Replicate collection for browsing vision models. Only relevant when provider = replicate.

**auth**
- `apiKey` (<span data-cli="meta"><span data-cli="type">api_key</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - API key override. Empty = from App Settings.
- `baseUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Provider base URL override. Empty = provider default/App Settings.

**pre_resize**
- `resizeFirst` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Pre-resize images before upload (default true, matching image_understand).
- `resizeWidth` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">64-2048</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Longest edge for pre-resize when resizeFirst is on.

**output**
- `json` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - When true, result is structured JSON; when false, result is answer text only.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;answer&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

**runtime**
- `threads` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-64</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - CPU threads for local VLM (provider=llama).
- `gpuLayers` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">-1-999</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - GPU layers for local VLM. -1 = all available, 0 = CPU-only.
- `ctx` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1024-65536</span>, <span data-cli="default">default <span data-cli="value">4096</span></span></span>) - Context size for local VLM. Use 8192+ for multi-image prompts.
- `maxTokens` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-32768</span>, <span data-cli="default">default <span data-cli="value">2048</span></span></span>) - Maximum generated tokens for local VLM.

**hud**
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show the movable overlay HUD while this block runs. Default off.

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
- `keys` (<span data-cli="meta"><span data-cli="type">shortcut</span>, <span data-cli="default">default <span data-cli="value">&quot;F9&quot;</span></span></span>) - Keyboard shortcut to sample, e.g. F9 or Ctrl+Shift+R. Ignored when anyKey is on.

**options**
- `anyKey` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Match any key press instead of the configured shortcut.
- `toggle` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Flip the emitted toggle state on each press edge.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;key&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `keys` (<span data-cli="meta"><span data-cli="type">shortcut</span>, <span data-cli="default">default <span data-cli="value">&quot;F9&quot;</span></span></span>) - Keyboard shortcut to listen for, e.g. F9 or Ctrl+Shift+R. Ignored when anyKey is on.
- `on` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;pressed&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">pressed</span> <span data-cli="choice">held</span> <span data-cli="choice">released</span> <span data-cli="choice">toggle</span></span></span>) - When to fire: pressed (leading edge), held (while down), released (trailing edge), or toggle (first press starts child blocks, second press cancels them).

**options**
- `repeat` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Keep listening and fire on every matching event. Not applicable to toggle (which always re-arms after each cycle).
- `anyKey` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Match any key press instead of the configured shortcut. Stores the key name in PREVIOUS / storeAs.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Stop listening after this many milliseconds. 0 = wait forever.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;RoundTrip&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">Publish</span> <span data-cli="choice">Subscribe</span> <span data-cli="choice">RoundTrip</span></span></span>) - Publish sends one message. Subscribe waits for one message. RoundTrip subscribes then publishes and waits for its echo.

**input**
- `host` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;127.0.0.1&quot;</span></span></span>) - Broker host.
- `port` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-65535</span>, <span data-cli="default">default <span data-cli="value">1883</span></span></span>) - Broker port.
- `topic` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;xblox/smoke&quot;</span></span></span>) - MQTT topic.
- `payload` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;hello from xblox&quot;</span></span></span>) - Payload to publish.

**advanced**
- `clientId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;xblox-mqtt&quot;</span></span></span>) - MQTT client id.
- `qos` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-2</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - MQTT QoS level.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1-60000</span>, <span data-cli="default">default <span data-cli="value">5000</span></span></span>) - Client operation timeout.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;mqtt&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;Start&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">Start</span> <span data-cli="choice">Stop</span> <span data-cli="choice">Status</span></span></span>) - Start a named MQTT broker, Stop it, or report Status.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;default&quot;</span></span></span>) - Named broker instance. Use the same name for Stop/Status.

**network**
- `bind` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;127.0.0.1&quot;</span></span></span>) - Network interface to listen on.
- `port` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-65535</span>, <span data-cli="default">default <span data-cli="value">1883</span></span></span>) - MQTT TCP port.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;mqttServer&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;Start&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">Start</span> <span data-cli="choice">Stop</span> <span data-cli="choice">Status</span></span></span>) - Start/open a named connection, Stop/release it, or report Status.
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;default&quot;</span></span></span>) - Named connection/pool key reused by read/write blocks.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.

**input**
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to connect to.

**advanced**
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `unitId` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Alias for slave.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect even if the named connection is already open.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;modbusConnection&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to read from.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">inputRegisters</span> <span data-cli="choice">coils</span> <span data-cli="choice">discreteInputs</span></span></span>) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Number of coils/registers to read.
- `regCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;values&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to read from.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">inputRegisters</span> <span data-cli="choice">coils</span> <span data-cli="choice">discreteInputs</span></span></span>) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Number of coils/registers to read.
- `regCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;values&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to read from.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">inputRegisters</span> <span data-cli="choice">coils</span> <span data-cli="choice">discreteInputs</span></span></span>) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Number of coils/registers to read.
- `regCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;values&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to read from.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">inputRegisters</span> <span data-cli="choice">coils</span> <span data-cli="choice">discreteInputs</span></span></span>) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Number of coils/registers to read.
- `regCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;values&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to read from.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">inputRegisters</span> <span data-cli="choice">coils</span> <span data-cli="choice">discreteInputs</span></span></span>) - Modbus table/function: holdingRegisters=FC03, inputRegisters=FC04, coils=FC01, discreteInputs=FC02.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/30001/10001 style addresses are also accepted.
- `count` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Number of coils/registers to read.
- `regCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-2000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Alias for count, matching ModbusPoll wording.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated reads.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful read before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;values&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Listen endpoint, e.g. tcp:127.0.0.1:15020.
- `holdingRegisters` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Initial holding-register values (integer array).
- `inputRegisters` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Initial input-register values (integer array).

**advanced**
- `registerCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>) - Number of holding registers to expose.
- `inputRegisterCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>) - Number of input registers to expose.
- `coilCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>) - Number of coils to expose.
- `coils` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Initial coil values (boolean/integer array).
- `discreteInputCount` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">128</span></span></span>) - Number of discrete inputs to expose.
- `discreteInputs` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Initial discrete-input values (boolean/integer array).
- `durationMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Auto-stop after this many ms. 0 = run until cancelled.
- `maxRequests` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-1e+06</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Auto-stop after this many requests. 0 = unlimited.
- `unitId` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Modbus unit/slave id.
- `pollTimeoutMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-60000</span>, <span data-cli="default">default <span data-cli="value">100</span></span></span>) - Server poll timeout in ms.
- `debug` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Verbose server logging.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to write to.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">coils</span></span></span>) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Single 16-bit register value or coil boolean/0/1.
- `values` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to write to.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">coils</span></span></span>) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Single 16-bit register value or coil boolean/0/1.
- `values` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to write to.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">coils</span></span></span>) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Single 16-bit register value or coil boolean/0/1.
- `values` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to write to.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">coils</span></span></span>) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Single 16-bit register value or coil boolean/0/1.
- `values` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;tcp:127.0.0.1:15020&quot;</span></span></span>) - Endpoint to write to.
- `area` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;holdingRegisters&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">holdingRegisters</span> <span data-cli="choice">coils</span></span></span>) - Writable table/function: holdingRegisters=FC06/FC16, coils=FC05/FC15.
- `address` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-65535</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Starting address. Zero-based by default; 40001/00001 style addresses are also accepted.
- `value` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Single 16-bit register value or coil boolean/0/1.
- `values` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Multiple values. Arrays and comma-separated strings are accepted.

**connection**
- `connection` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional named connection to reuse/open for fast repeated writes.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Alias for connection.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Force reconnect the named connection before this operation.

**advanced**
- `addressBase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;zero&quot;</span></span></span>) - zero (default), one, or modbus. one subtracts 1 from address.
- `slave` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-255</span></span>) - Unit/slave id.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)
- `waitTimeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Cancellable delay after a successful write before the next block. 0 = no delay.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;https://&quot;</span></span></span>) - Request URL. Supports ${var} interpolation.

**request**
- `method` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;GET&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">GET</span> <span data-cli="choice">POST</span> <span data-cli="choice">PUT</span> <span data-cli="choice">PATCH</span> <span data-cli="choice">DELETE</span> <span data-cli="choice">HEAD</span> <span data-cli="choice">OPTIONS</span></span></span>) - HTTP method  -  GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, or any custom verb.
- `queryParams` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Query-string parameters as a JSON object {"key":"value"}. Appended to the URL (percent-encoded). Merged with any params already in the URL.
- `headers` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Extra request headers  -  JSON object {"Name":"value"} or array of "Name: value" strings.

**body**
- `bodyType` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;none&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">raw</span> <span data-cli="choice">json</span> <span data-cli="choice">form</span> <span data-cli="choice">multipart</span></span></span>) - Request body format. none = no body (GET / HEAD). raw = plain text body. json = serialize bodyJson + Content-Type: application/json. form = URL-encode bodyFields + Content-Type: application/x-www-form-urlencoded. multipart = curl_mime from bodyParts ("name=value" or "name@/path").
- `body` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Raw request body (used when bodyType is raw). Supports ${var} interpolation.
- `bodyJson` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Body as a JSON value (object, array, string, ...). Serialized and sent with Content-Type: application/json. Used when bodyType is json.
- `bodyFields` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Form fields as a JSON object {"key": "value"}. URL-encoded and sent with Content-Type: application/x-www-form-urlencoded. Used when bodyType is form.
- `bodyParts` (<span data-cli="meta"><span data-cli="type">args_list</span></span>) - Multipart form parts (bodyType: multipart). Each entry uses curl -F syntax: "name=value" for a text field, "name@/path/to/file" for a file part, or bare "/path/to/file" to use the filename as field name.

**response**
- `decode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;raw&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">raw</span> <span data-cli="choice">json</span></span></span>) - raw = body as a string. json = parse body as JSON and apply the parse selector.
- `parse` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;.&quot;</span></span></span>) - Dotted-path selector applied after decode:json (e.g. .items[0].name). Default . = whole document.

**auth**
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;none&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">bearer</span> <span data-cli="choice">basic</span> <span data-cli="choice">apikey</span></span></span>) - Authentication mode. none = no auth header added.
- `authToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Bearer token or API key value.
- `authUser` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - HTTP Basic auth username.
- `authPass` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - HTTP Basic auth password.
- `authHeader` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;X-Api-Key&quot;</span></span></span>) - Header name used for apikey auth. Default: X-Api-Key.

**download**
- `downloadAs` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Save the response body to this file path; the saved path is available as the savedPath output. decode/parse/storeAs still apply normally — result (PREVIOUS) is the decoded value, not the path. "auto" derives the filename from Content-Disposition or the URL and saves to Downloads.

**cache**
- `cache` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Cache responses to disk. Sends ETag / Last-Modified revalidation on stale hits.
- `cacheDir` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Cache directory. Default: system cache dir / pixlwiz / net.
- `cacheTtlMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">-1-8.64e+07</span>, <span data-cli="default">default <span data-cli="value">3600000</span></span></span>) - Cache TTL in ms. -1 = rely solely on server ETag / Last-Modified. Default: 1 h.

**proxy**
- `proxy` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Proxy URL, e.g. http://proxy.corp:8080.
- `proxyUser` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Proxy username.
- `proxyPass` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Proxy password.

**session**
- `sessionId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Named persistent cookie jar. All requests sharing the same sessionId reuse cookies set by previous responses (login flows, OAuth redirects, CSRF tokens). Concurrent requests to the same session are serialized. Empty = no session.
- `sessionDir` (<span data-cli="meta"><span data-cli="type">dir_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Directory for session jar files. Default: system cache dir / pixlwiz / sessions.

**ssl**
- `insecure` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Skip SSL peer and host verification. Implies verifyPeer=false + verifyHost=false.
- `verifyPeer` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Verify SSL certificate chain. Overridden to false by insecure:true.
- `verifyHost` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Verify SSL hostname. Overridden to false by insecure:true.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Total transfer timeout in ms (0 = no limit).
- `connectTimeoutMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-300000</span>, <span data-cli="default">default <span data-cli="value">10000</span></span></span>) - TCP connect timeout in ms.

**redirects**
- `followRedirects` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Follow 3xx redirects automatically.
- `maxRedirects` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-30</span>, <span data-cli="default">default <span data-cli="value">5</span></span></span>) - Maximum number of redirects to follow.

**retry**
- `retries` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-10</span>, <span data-cli="default">default <span data-cli="value">2</span></span></span>) - Maximum number of retries after a transient failure (curl error or 5xx / 408 / 429).
- `retryDelayMs` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">250</span></span></span>) - Base retry delay in ms. Each retry doubles the delay plus random jitter (exponential back-off).

**output**
- `statusCode` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - HTTP status code of the final response. 0 for file:// and transport errors.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;response&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `from` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;xblox&quot;</span></span></span>) - Sender identity stored with the message.
- `message` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Message text. Supports ${var} interpolation.
- `data` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Optional structured payload attached as message.data.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1-300000</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Per-session IPC request timeout.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;ipcBroadcast&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Target session key, descriptor stem, or unambiguous key prefix.
- `peek` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Read without consuming messages.

**wait**
- `waitMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-300000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Poll until messages arrive or this timeout elapses.
- `pollMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">10-60000</span>, <span data-cli="default">default <span data-cli="value">100</span></span></span>) - Polling interval while waiting.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1-300000</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Per-IPC request timeout.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;messages&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Target session key, descriptor stem, or unambiguous key prefix.
- `from` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;xblox&quot;</span></span></span>) - Sender identity stored with the message.
- `message` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Message text. Supports ${var} interpolation.
- `data` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Optional structured payload attached as message.data.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1-300000</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - IPC request timeout.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;ipcReply&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `target` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Target session key, descriptor stem, or unambiguous key prefix.
- `from` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;xblox&quot;</span></span></span>) - Sender identity stored with each message.
- `message` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Message text. Supports ${var} interpolation.
- `count` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-10000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Number of messages to create when source is empty.
- `source` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional context array to send one message per element.
- `data` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Optional shared structured payload when source is empty.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1-300000</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - IPC request timeout.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;ipcBatchReply&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `name` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Session name. Plain names are normalized to name:<value>.
- `label` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional display label for the session.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;session&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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

- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;sessions&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `server` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - MCP server name from mcp.json, a bundled system server, or __custom__ for an inline config.  Supports ${var} interpolation.

**connection**
- `serverConfig` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Inline MCP server config (used only when server == __custom__). Use ${USER:…} for secrets in headers / env / args.

**request**
- `tool` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Remote tool name on the selected server. Supports ${var} interpolation.

**arguments**
- `arguments` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Tool arguments object. Supports ${var} interpolation on all fields.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="default">default <span data-cli="value">60000</span></span></span>) - MCP request timeout in milliseconds.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;mcpResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `host` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>) - SSH host name or IP address.
- `port` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-65535</span>, <span data-cli="default">default <span data-cli="value">22</span></span></span>) - SSH port.
- `username` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - SSH username. Empty lets libssh use the current user.
- `password` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Password authentication value. Empty tries public-key auth.
- `privateKey` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional private key file for public-key auth.
- `passphrase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional private key passphrase.
- `command` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Remote command to execute. Supports ${var} interpolation.

**ssh**
- `configFile` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional SSH config file. Empty parses the OS user default ~/.ssh/config.
- `knownHosts` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional known_hosts file. Empty uses libssh defaults.
- `verifyHost` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Verify the server host key against known_hosts.
- `acceptUnknownHost` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Add an unknown host key to known_hosts when verifyHost is enabled.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Connect and command timeout in ms.

**output**
- `exitStatus` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Remote command exit status.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;ssh&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;List&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">List</span> <span data-cli="choice">Unload</span></span></span>) - List loaded models in this xBlox process, or unload one by key.
- `key` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;llama:vlm&quot;</span></span></span>) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;modelKey&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Input image path or glob. Default: PREVIOUS chain value.
- `provider` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">layout</span> <span data-cli="choice">table</span> <span data-cli="choice">text</span> <span data-cli="choice">vlm</span> <span data-cli="choice">paddle</span></span></span>) - OCR runtime. Default: auto (PP-DocLayoutV3 + PaddleOCR-VL). layout/table/text force the VLM prompt; paddle uses raw ONNX PaddleOCR. Empty falls back to App Settings ocr_provider, then image_recognition_provider.
- `mode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;layout&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">layout</span> <span data-cli="choice">table</span> <span data-cli="choice">text</span></span></span>) - Layout-table routing when provider=auto. Default: layout (detect tables first, then choose OCR: vs Table Recognition:).
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Local OCR VLM model id or GGUF path. Default: empty → first OCR-slot VLM (prefers PaddleOCR-VL), else App Settings ocr_model / image_recognition_model.

**vlm_prompt**
- `prompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;OCR: Extract all text verbatim, preserving line breaks and spatial layout.&quot;</span></span></span>) - VLM prompt override for provider=vlm only. Default: OCR: Extract all text verbatim… Layout/table/text providers choose OCR: or Table Recognition: automatically.

**output**
- `json` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Structured JSON document array vs plain markdown. Default: true.
- `markdown` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Include markdown on each JSON document. Default: true.
- `result` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - OCR document array when json=true; markdown string when json=false.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;ocr&quot;</span></span></span>) - Variable name for PREVIOUS / downstream blocks. Default: ocr.

**runtime**
- `backend` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">cpu</span> <span data-cli="choice">gpu</span> <span data-cli="choice">cuda</span> <span data-cli="choice">coreml</span> <span data-cli="choice">metal</span></span></span>) - ONNX Runtime EP for PP-DocLayoutV3 / PaddleOCR ONNX. Default: auto.
- `threads` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-64</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - CPU threads for ONNX and VLM inference. Default: 4.

**layout_model**
- `layoutModel` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Override PP-DocLayoutV3.onnx path. Default: empty → auto-discover PP-DocLayoutV3.onnx under ${MODELS_DIR} then install models (exe/../models).
- `layoutConf` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.5</span></span></span>) - Minimum PP-DocLayoutV3 region confidence. Default: 0.5.

**onnx_model_overrides**
- `detModel` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Override PaddleOCR det ONNX path. Default: empty → en_PP-OCRv3_det_infer.onnx from paddleocr-en preset under model roots.
- `recModel` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Override PaddleOCR rec ONNX path. Default: empty → en_PP-OCRv4_rec_infer.onnx (or v3) from paddleocr-en preset under model roots.
- `dict` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Override OCR character dictionary. Default: empty → en_dict.txt from paddleocr-en preset.

**onnx_options**
- `threshold` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.3</span></span></span>) - PaddleOCR detection probability threshold. Default: 0.3.
- `recThreshold` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.5</span></span></span>) - PaddleOCR recognition confidence threshold. Default: 0.5.
- `maxSize` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">32-4096</span>, <span data-cli="default">default <span data-cli="value">960</span></span></span>) - PaddleOCR detector max image side after resize (px). Default: 960.

**vlm_runtime**
- `maxTokens` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-32768</span>, <span data-cli="default">default <span data-cli="value">2048</span></span></span>) - VLM max generated tokens. Default: 2048.
- `ctx` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">512-131072</span>, <span data-cli="default">default <span data-cli="value">8192</span></span></span>) - VLM context length. Default: 8192.
- `gpuLayers` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">-1-999</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - VLM GPU layer offload (-1 = all, 0 = CPU). Default: -1.

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
- `name` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category display name.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional slug (derived from name when empty).

**meta**
- `description` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional description.
- `visibility` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - public | unlisted | private.
- `parentId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional parent category UUID.
- `relationType` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Relation type for the parent link.
- `type` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;pages&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Stored as meta.type.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;category&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `categoryId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category UUID.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;category&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `slug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category slug.

**filter**
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-1000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Optional item limit (0 = server default).
- `includeDescendants` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Include descendant category items.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;items&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `userId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Owner UUID for own-only list (default: current app user).
- `parentSlug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional parent category slug.

**filter**
- `all` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - List all visible categories, not just own.
- `includeChildren` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Include nested children.
- `lang` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional Accept-Language / lang query.
- `type` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;pages&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category meta.type filter (default: pages).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;categories&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `categoryId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category UUID.

**filter**
- `type` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;pages&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Expected meta.type (default: pages).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;removeResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `categoryId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category UUID.
- `name` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Replacement name.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Replacement slug.

**meta**
- `description` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Replacement description.
- `visibility` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - public | unlisted | private.
- `type` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;pages&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Stored as meta.type.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;category&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - VFS mount name. Supports ${var} interpolation.
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Directory path within the mount (empty = root). Supports ${var} interpolation.

**vfs**
- `includeSize` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Include file/directory sizes in the listing (CLI default).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;fileList&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - VFS mount name. Supports ${var} interpolation.
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - File path within the mount. Supports ${var} interpolation.

**download**
- `downloadAs` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Save response body to this path. Supports ${var} interpolation. Parent directories are created automatically. Empty = return body as string.
- `overwrite` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Re-download even when downloadAs already exists (default: skip existing).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;fileContent&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - VFS mount name. Supports ${var} interpolation.
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - File or folder path to remove. Supports ${var} interpolation.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;removeResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `q` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Search query (min 2 chars). Supports ${var} interpolation.
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - VFS mount name (e.g. "home", "shared").
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Subpath to restrict search within (optional).

**filter**
- `type` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">all</span> <span data-cli="choice">file</span> <span data-cli="choice">dir</span></span></span>) - Node type filter.
- `maxResults` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-500</span>, <span data-cli="default">default <span data-cli="value">200</span></span></span>) - Max results (server cap: 500).
- `fts` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - 1 = use PostgreSQL full-text index (fast, but stale for fresh uploads). 0 = live filesystem walk (slower, always current).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;searchResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `file` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mustExist</span> <span data-cli="choice">readable</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Local file path to upload. Supports ${var} interpolation. Use 'files' for multiple.
- `files` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Multiple local file paths. Each is uploaded separately.

**vfs**
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - VFS mount name (e.g. home). Supports ${var} interpolation.
- `remoteDir` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Remote VFS directory. Each file is placed under this path as its filename. Empty = mount root. Prefer public=true for the shared public folder.
- `public` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Upload into home/public (same as remoteDir=public). Filebrowser links use ?mode=thumb&file=…
- `remotePath` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Exact remote VFS path for one file (overrides remoteDir). Supports ${var} interpolation.

**conflict**
- `conflict` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;if-newer&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">if-newer</span> <span data-cli="choice">skip</span> <span data-cli="choice">overwrite</span></span></span>) - Conflict policy. if-newer (default) overwrites older remotes; skip leaves existing; overwrite always replaces.
- `skip` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Skip when the remote file already exists (any age).
- `overwrite` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Always replace the remote file.
- `ifNewer` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Overwrite remote only when the local file is newer (default policy).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `failed` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Number of files that failed to upload (files[] mode).
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;fileResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `file` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mustExist</span> <span data-cli="choice">readable</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Single image file path to upload. Supports ${var} interpolation. Use 'files' for multiple.
- `files` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Multiple image file paths. Each is uploaded separately.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `failed` (<span data-cli="meta"><span data-cli="type">integer</span></span>) - Number of files that failed to upload.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;uploadResults&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `slug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page slug (URL-safe identifier). Required unless 'body' or 'markdownFile' is set. Supports ${var} interpolation.
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page title. Supports ${var} interpolation.
- `markdownFile` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Local .md/.page file to publish (same as CLI pages create). Supports ${var} interpolation.
- `content` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page content (Markdown). Wrapped as a markdown-text widget. Supports ${var} interpolation.
- `body` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Full POST body as JSON object  -  overrides all individual params.

**images**
- `includeImages` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Extract co-located image refs from markdownFile, upload to home/public, rewrite refs.
- `conflict` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;if-newer&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">if-newer</span> <span data-cli="choice">skip</span> <span data-cli="choice">overwrite</span></span></span>) - Image upload conflict policy when includeImages is true.
- `skip` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Skip existing remote images.
- `overwrite` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Always replace remote images.
- `ifNewer` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Replace remote images only when local is newer.

**meta**
- `useFrontmatter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - When markdownFile is .md, apply YAML front matter to title/slug/tags/category.
- `tags` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Comma-separated tag list. Supports ${var} interpolation.
- `description` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional page description (stored in meta.description).
- `parent` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional parent page UUID or slug.
- `categoryId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category slug, display name, or UUID. Missing cats are created in user space on the server.
- `categoryIds` (<span data-cli="meta"><span data-cli="type">args_list</span></span>) - Multiple category slugs/names/UUIDs. Missing cats are created in user space on the server.
- `private` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Create with is_public=false.
- `hidden` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Create with visible=false (default is link-only).
- `visibility` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">public</span> <span data-cli="choice">listed</span> <span data-cli="choice">private</span></span></span>) - Page visibility: listed=link-only (default), public=listed in feeds, private.
- `ownerId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Owner user UUID (default: from zitadel-oauth.json).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;page&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `pageId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page UUID. If empty, slug lookup is used. Supports ${var} interpolation.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page slug for lookup when pageId is empty. Supports ${var} interpolation.
- `ownerId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Owner user UUID or username for slug lookup. Defaults to logged-in app user when empty.

**lookup**
- `userId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Alias/fallback for ownerId in slug lookup. Supports ${var} interpolation.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;page&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `userId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Filter by owner user UUID. Supports ${var} interpolation.

**pagination**
- `page` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-10000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Page number (1-based).
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-200</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Results per page.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;pages&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `pageId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page UUID. If empty, slug lookup is used. Supports ${var} interpolation.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page slug for lookup when pageId is empty. Supports ${var} interpolation.
- `ownerId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Owner user UUID or username for slug lookup. Defaults to logged-in app user when empty.

**lookup**
- `userId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Alias/fallback for ownerId in slug lookup. Supports ${var} interpolation.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;removeResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `pageId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Page UUID. If empty, slug lookup is used. Supports ${var} interpolation.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Existing page slug for lookup when pageId is empty. Supports ${var} interpolation.
- `ownerId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Owner user UUID or username for slug lookup. Defaults to logged-in app user when empty.
- `markdownFile` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Local .md/.page file to publish. Supports ${var} interpolation.
- `content` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Replacement page content (Markdown). Wrapped as a markdown-text layout. Supports ${var} interpolation.
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional replacement page title. Supports ${var} interpolation.
- `newSlug` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional replacement page slug. Supports ${var} interpolation.
- `body` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Full PATCH body as JSON object  -  overrides individual update params.

**lookup**
- `userId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Alias/fallback for ownerId in slug lookup. Supports ${var} interpolation.

**images**
- `includeImages` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Extract co-located image refs from markdownFile, upload to home/public, rewrite refs.
- `conflict` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;if-newer&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">if-newer</span> <span data-cli="choice">skip</span> <span data-cli="choice">overwrite</span></span></span>) - Image upload conflict policy when includeImages is true.
- `skip` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Skip existing remote images.
- `overwrite` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Always replace remote images.
- `ifNewer` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Replace remote images only when local is newer.

**meta**
- `useFrontmatter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - When markdownFile is .md, apply YAML front matter to title/slug/tags/category.
- `tags` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Comma-separated replacement tag list. Supports ${var} interpolation.
- `description` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional replacement meta description.
- `parent` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Optional replacement parent page UUID or slug.
- `categoryId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Category slug, display name, or UUID. Missing cats are created in user space on the server.
- `categoryIds` (<span data-cli="meta"><span data-cli="type">args_list</span></span>) - Multiple category slugs/names/UUIDs. Missing cats are created in user space on the server.
- `private` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Set is_public=false when this flag is present.
- `hidden` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Set visible=false when this flag is present.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;page&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `pictureId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Picture record ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;picture&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `userId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Filter by owner user UUID. Supports ${var} interpolation.

**pagination**
- `page` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-10000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Page number (1-based).
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-200</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Results per page.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;pictures&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `pictureId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Picture record ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;removeResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `title` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Post title. Supports ${var} interpolation.
- `description` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Post description. Supports ${var} interpolation.

**meta**
- `visibility` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;public&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">public</span> <span data-cli="choice">listed</span> <span data-cli="choice">private</span></span></span>) - Post visibility.
- `ownerId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Owner user UUID.

**images**
- `file` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mustExist</span> <span data-cli="choice">readable</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Single image file to upload and attach. Supports ${var} interpolation.
- `files` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">custom</span> <span data-cli="choice">deep</span></span></span>) - Multiple image files to upload and attach (positional).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;post&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `postId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Post ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;post&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `userId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Filter by owner user UUID. Supports ${var} interpolation.

**pagination**
- `page` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-10000</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Page number (1-based).
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-200</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Results per page.

**filter**
- `visibilityFilter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">listed</span> <span data-cli="choice">unlisted</span> <span data-cli="choice">private</span> <span data-cli="choice">non-public</span> <span data-cli="choice">all</span> <span data-cli="choice">public</span></span></span>) - Owner-only: listed/unlisted (link-only), private, non-public, all, or public (default).

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;posts&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `postId` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Post ID. Supports ${var} interpolation.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;removeResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `q` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Search query. Supports ${var} interpolation.

**filter**
- `type` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">all</span> <span data-cli="choice">pages</span> <span data-cli="choice">posts</span> <span data-cli="choice">pictures</span> <span data-cli="choice">files</span> <span data-cli="choice">places</span></span></span>) - Content type to search (default: all).
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-50</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Max results (server cap: 50).
- `sizes` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Comma-separated image widths for responsive variants, e.g. "320,640,1024".
- `formats` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Comma-separated image formats, e.g. "avif,webp".
- `visibilityFilter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice"></span> <span data-cli="choice">invisible</span> <span data-cli="choice">private</span></span></span>) - Visibility filter (requires auth). empty = no filter.

**auth**
- `serverUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Tanit service base URL (e.g. https://tanit.polymech.info). Supports ${var} / ${ENV:NAME} interpolation. Empty = resolved from SERVER_URL / VITE_SERVER_IMAGE_API_URL env vars.
- `auth` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bearer</span> <span data-cli="choice">none</span></span></span>) - Auth mode. auto = bearerToken param if set, else zitadel-oauth.json (run `tanit-cli login` first). bearer = explicit bearerToken only. none = unauthenticated.
- `bearerToken` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Explicit JWT bearer token. Supports ${var} interpolation.

**timeouts**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1000-300000</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - HTTP timeout in ms.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;results&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - File or folder path to open.

**options**
- `openIn` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;system&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">system</span> <span data-cli="choice">app</span> <span data-cli="choice">edit</span></span></span>) - system = OS default application. app = Tanit viewer (app command open). edit = Tanit editor (app command edit).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;openedPath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `mode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;shell&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">shell</span> <span data-cli="choice">powershell</span> <span data-cli="choice">cmd</span> <span data-cli="choice">bash</span> <span data-cli="choice">auto</span> <span data-cli="choice">argv</span></span></span>) - Shell interpreter: shell|powershell|cmd|bash|auto|argv.

**advanced**
- `shell` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">cmd</span> <span data-cli="choice">powershell</span> <span data-cli="choice">bash</span> <span data-cli="choice">sh</span></span></span>) - Shell binary override. auto = platform default.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-3.6e+06</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Maximum execution time in milliseconds. 0 = no timeout.
- `log` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Echo stdout/stderr to the host logger.
- `stdout` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;info&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span> <span data-cli="choice">off</span></span></span>) - Log level for stdout lines.
- `stderr` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;error&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span> <span data-cli="choice">off</span></span></span>) - Log level for stderr lines.

**input**
- `command` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">&quot;echo hello&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Command or script to execute.
- `args` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Argument tokens for argv mode. Each token supports variable interpolation and is quoted separately.
- `cwd` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Working directory (supports ${var} interpolation). Empty = default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;stdout&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;Run&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">Run</span> <span data-cli="choice">Stop</span> <span data-cli="choice">Status</span></span></span>) - Run the script, Stop a background run keyed by path, or report Status.

**input**
- `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mustExist</span> <span data-cli="choice">readable</span></span></span>) - XBlox document to run.
- `context` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Context variables merged into the child script before it runs.

**advanced**
- `args` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Advanced CLI-style overrides, e.g. --CURRENT_FILE path or --name=value. Merged after context.
- `reload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Reload the child script from disk before this run. Off reuses the run-scoped cached document.
- `background` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Start the child script on a detached background thread and return immediately.
- `log` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Forward captured child stdout/stderr lines to the parent xBlox run log.
- `stdout` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;info&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span> <span data-cli="choice">off</span></span></span>) - Parent run-log level for child stdout lines.
- `stderr` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;error&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span> <span data-cli="choice">off</span></span></span>) - Parent run-log level for child stderr lines.
- `logLevel` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;off&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">error</span></span></span>) - Optional host log level for child-run summaries and collected child events.

**loop**
- `loop` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Override the child document loop setting and run it as a document loop.
- `loopIntervalMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-8.64e+07</span>, <span data-cli="default">default <span data-cli="value">100</span></span></span>) - Loop interval override in milliseconds. 0 = as fast as possible.
- `loopReset` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Reset child scope every loop pass instead of persisting variables.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;xbloxResult&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Frame handle (mem://...) from a previous filter, or an image path.
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output file path (.jpg/.png/.bmp). Required.

**advanced**
- `quality` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">90</span></span></span>) - JPEG quality (1-100).

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;Still&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">Still</span> <span data-cli="choice">Record</span> <span data-cli="choice">Start</span> <span data-cli="choice">Update</span> <span data-cli="choice">Status</span> <span data-cli="choice">Stop</span></span></span>) - Still = one frame; Record = capture MP4 until duration/cancel; Start keeps recording under instance; Update changes its viewport; Status reports it; Stop finalizes it.

**input**
- `input` (<span data-cli="meta"><span data-cli="type">video_input</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Camera device name, screen/window spec (screen:current / screen for the monitor of the launching window, screen:N, screen:N:wintitle=GLOB, screen:N:hwnd=ID), image (.png/.jpg), or video file (.mp4). Empty = preferred camera.

**recording**
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Recording instance name for Start/Stop. Use the same name to stop and finalize the recording.
- `fps` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-240</span>, <span data-cli="default">default <span data-cli="value">30</span></span></span>) - Target recording frame rate.
- `bitrateKbps` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100000</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - H.264 bitrate in Kbps for fast (WGC) recording. 0 = automatic from resolution and fps. Ignored on compat fallback.
- `captureEngine` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">fast</span> <span data-cli="choice">compat</span></span></span>) - auto = prefer fast Windows WGC; fast = require it (zoom/follow/bitrate); compat = portable frame-pump fallback (no zoom/follow/bitrate).
- `encoder` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">nvenc</span> <span data-cli="choice">mediaFoundation</span></span></span>) - Fast Windows capture encoder: auto tries the optional NVIDIA plugin then Media Foundation; nvenc requires NVIDIA hardware; mediaFoundation uses the Windows encoder.
- `durationMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-8.64e+07</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Record action only: stop after this many ms. 0 = record until cancellation or stopKey. Start ignores this and runs until Stop or stopKey.
- `pauseKey` (<span data-cli="meta"><span data-cli="type">shortcut</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional global shortcut that toggles recording pause/resume, e.g. F9 or Ctrl+Shift+P. Empty disables it.
- `stopKey` (<span data-cli="meta"><span data-cli="type">shortcut</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional global shortcut that stops and finalizes recording, e.g. F10 or Ctrl+Shift+S. Empty disables it.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path (.jpg/.png for Still, .mp4 for Record/Start). Empty = auto temp file.

**capture_options**
- `includeCursor` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Window fast recording: include the mouse cursor in the captured MP4 when supported.
- `width` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-7680</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred width in pixels. 0 = device default.
- `height` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-4320</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred height in pixels. 0 = device default.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">100-30000</span>, <span data-cli="default">default <span data-cli="value">5000</span></span></span>) - Max ms to wait for first frame.

**viewport**
- `aspectRatio` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;source&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">source</span> <span data-cli="choice">16:9</span> <span data-cli="choice">9:16</span> <span data-cli="choice">4:3</span> <span data-cli="choice">3:4</span> <span data-cli="choice">1:1</span> <span data-cli="choice">21:9</span> <span data-cli="choice">3:2</span> <span data-cli="choice">2:3</span> <span data-cli="choice">custom</span></span></span>) - Output and zoom-viewport aspect ratio. Kept through interactive zoom and cursor follow. source = capture region; custom uses aspectCustomW/H. Pair with sizeMode fill for a hard crop.
- `aspectCustomW` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">16</span></span></span>) - Custom aspect ratio width part (e.g. 16 in 16:10). Only used when aspectRatio is custom.
- `aspectCustomH` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">9</span></span></span>) - Custom aspect ratio height part (e.g. 10 in 16:10). Only used when aspectRatio is custom.
- `sizeMode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;native&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">native</span> <span data-cli="choice">pad</span> <span data-cli="choice">fit</span> <span data-cli="choice">fill</span></span></span>) - Fixed-canvas layout: native/pad preserve 1:1 pixels when possible, fit shows the full region, fill crops to cover.
- `zoom` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">1-32</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Viewport zoom multiplier. Update changes zoom without restarting capture or encoding.
- `follow` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;none&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">anchor</span> <span data-cli="choice">cursor</span></span></span>) - Keep the initial picked anchor fixed, or smoothly follow the Windows cursor.
- `followSpeed` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0.01-1</span>, <span data-cli="default">default <span data-cli="value">0.2</span></span></span>) - Per-update cursor-follow interpolation factor.
- `followDeadzone` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-1000</span>, <span data-cli="default">default <span data-cli="value">3</span></span></span>) - Source pixels the cursor may move before the viewport follows.
- `transitionMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-10000</span>, <span data-cli="default">default <span data-cli="value">300</span></span></span>) - Smooth zoom transition duration.
- `updateIntervalMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">1-1000</span>, <span data-cli="default">default <span data-cli="value">16</span></span></span>) - Interactive/follow tracking interval.
- `focusX` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">-1-1</span>, <span data-cli="default">default <span data-cli="value">-1.0</span></span></span>) - Optional normalized horizontal focus point; -1 keeps the picked anchor.
- `focusY` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">-1-1</span>, <span data-cli="default">default <span data-cli="value">-1.0</span></span></span>) - Optional normalized vertical focus point; -1 keeps the picked anchor.
- `interactiveZoom` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - While recording, Shift+mouse-wheel changes zoom around the cursor.
- `zoomStep` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0.01-2</span>, <span data-cli="default">default <span data-cli="value">0.15</span></span></span>) - Zoom multiplier increment per Shift+wheel notch.
- `zoomMin` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">1-32</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Minimum interactive zoom.
- `zoomMax` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">1-32</span>, <span data-cli="default">default <span data-cli="value">4.0</span></span></span>) - Maximum interactive zoom.
- `consumeZoomInput` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Prevent Shift+wheel from also reaching the application under the cursor.
- `showZoomStatus` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Show a click-through recording HUD and active viewport while zoom changes.
- `hudCapture` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">exclude</span> <span data-cli="choice">visible</span></span></span>) - Overlay capture policy. visible includes the recording zoom HUD/frame, a live picker HUD/highlight, and block status HUDs in WGC/BitBlt captures; auto and exclude keep them out. Status HUDs stay visible to Windows Snap when we are not capturing.

**audio**
- `audioSource` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;none&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Mux audio into MP4: none, mic, desktop (loopback), or mix. When enabled, audio is 48 kHz stereo AAC (no separate rate/channel params).
- `audioDevice` (<span data-cli="meta"><span data-cli="type">device_name</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Mic device for audioSource mic/mix. Empty = app setting, then system default.
- `desktopDevice` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Loopback device substring for audioSource desktop/mix. Empty = default render device.
- `micGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Mic level multiplier (linear) for mix mode.
- `desktopGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Desktop/loopback level multiplier for desktop/mix.
- `filter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;off&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Live DeepFilterNet on the AAC mux worker (mic/mix/cameraAudio). off = dry. desktop-only loopback stays dry. gtcrn is reserved.
- `filterModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional DeepFilterNet tar.gz. Default: empty → ${MODELS_DIR}/deepfilter.
- `attenLim` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-100</span>, <span data-cli="default">default <span data-cli="value">100.0</span></span></span>) - Attenuation limit in dB. Default: 100.
- `postFilter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Over-attenuate very noisy sections. Implies deepfilter when filter is off.
- `compensateDelay` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Compensate STFT / model lookahead. Default: true.
- `audioNormalize` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Reserved (low risk): normalize mixed audio level before AAC encode.
- `audioAutoGain` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Reserved (low risk): gentle automatic gain on the microphone path.

**hud**
- `hudMode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;overlay&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">taskbar</span> <span data-cli="choice">overlay</span> <span data-cli="choice">both</span></span></span>) - Status HUD while Still / Record / Start is running. taskbar = app taskbar button. overlay = movable pill over the clock. both = combine. off = none. Separate from showZoomStatus / hudCapture.
- `hud` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Master switch for hudMode. Stop on the overlay or taskbar ends Record early, or finalizes a Start session. Default off.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;capturePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

**key_overlay**
- `keyOverlay` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Show typed / shortcut keystrokes as an on-screen overlay while recording.
- `keyOverlayBurnIn` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Also burn keystrokes into the encoded MP4 (independent of hudCapture).
- `keyOverlayAlign` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;bottom&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">center</span> <span data-cli="choice">left</span> <span data-cli="choice">right</span> <span data-cli="choice">top</span> <span data-cli="choice">bottom</span> <span data-cli="choice">top-left</span> <span data-cli="choice">top-right</span> <span data-cli="choice">bottom-left</span> <span data-cli="choice">bottom-right</span></span></span>) - VLC-style subtitle / marquee position (0/1/2/4/5/6/8/9/10).
- `keyOverlayMarginX` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-500</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Horizontal margin in px. 0 = auto from short edge (~1.2%).
- `keyOverlayMarginY` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-500</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Vertical margin in px. 0 = auto from short edge (~1.2%).
- `keyOverlayFontSize` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-96</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Chip font size in px. 0 = auto (~2.2% of short edge, clamped 14–32).
- `keyOverlayColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#F8F9FB&quot;</span></span></span>) - Key label text color.
- `keyOverlayBgColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#181B21&quot;</span></span></span>) - Chip background color.
- `keyOverlayAccentColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#EB445A&quot;</span></span></span>) - Left accent bar color.
- `keyOverlayOpacity` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.9</span></span></span>) - Overlay opacity (0–1).
- `keyOverlayHoldMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">100-10000</span>, <span data-cli="default">default <span data-cli="value">1200</span></span></span>) - How long each keychip stays fully visible before fading.
- `keyOverlayFadeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-5000</span>, <span data-cli="default">default <span data-cli="value">450</span></span></span>) - Fade-out duration after hold.
- `keyOverlayMaxEntries` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-16</span>, <span data-cli="default">default <span data-cli="value">5</span></span></span>) - Max stacked recent keychips; oldest are evicted.
- `keyOverlayFilter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">all</span> <span data-cli="choice">printable</span> <span data-cli="choice">shortcuts</span></span></span>) - all = every key; printable = letters/digits; shortcuts = modifier chords only.
- `keyOverlayStack` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">up</span> <span data-cli="choice">down</span></span></span>) - Chip stack growth. auto = up for bottom-* (newest at screen edge), down for top/center. up/down force direction.
- `keyOverlayModifiers` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Prefix Ctrl/Alt/Shift/Win on displayed chords.
- `keyOverlayCapture` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;visible&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">inherit</span> <span data-cli="choice">auto</span> <span data-cli="choice">exclude</span> <span data-cli="choice">visible</span></span></span>) - Capture policy. Default visible so keys appear in the MP4 even when hudCapture excludes the zoom HUD. inherit uses hudCapture.

**cursor**
- `cursorHighlight` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Soft highlight ring around the pointer (capture-visible overlay).
- `cursorHighlightColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#F5C542&quot;</span></span></span>) - Cursor highlight ring color.
- `cursorHighlightSize` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-256</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Highlight diameter in px. 0 = auto (~72).
- `cursorClicks` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Animate a ripple at the click point (left/right/middle).
- `cursorClickColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#EB445A&quot;</span></span></span>) - Left-click ripple color. Right/middle use complementary hues (+180° / +120°) derived from this.
- `cursorTrail` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Short motion trail behind the pointer.
- `hideCursorWhenTyping` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Temporarily hide highlight/trail while typing.

**camera_overlay**
- `cameraOverlay` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Picture-in-picture webcam over the recording (capture-visible overlay). When on, skin / lips / blur / mirror and the other face knobs apply to this PiP camera only — the screen stays on the fast recorder.
- `cameraAudio` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Include the webcam microphone in the recording mix (matched from Camera; combines with audioSource).
- `cameraAudioGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-4</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Linear gain for the webcam mic (0 = mute, 1 = unity).
- `cameraInput` (<span data-cli="meta"><span data-cli="type">video_input</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Webcam device for the PiP / camera mic. Empty = system default camera.
- `cameraResolution` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span></span>) - Webcam capture mode: auto (PiP-sized), max (highest native, including 4K), or a device mode like 1920x1080@30.
- `cameraPosition` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;bottom-right&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">top-left</span> <span data-cli="choice">top-right</span> <span data-cli="choice">bottom-left</span> <span data-cli="choice">bottom-right</span></span></span>) - PiP corner on the capture monitor/window.
- `cameraSize` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">4-80</span>, <span data-cli="default">default <span data-cli="value">22.0</span></span></span>) - PiP size as percent of the short capture edge.
- `cameraShape` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;circle&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">circle</span> <span data-cli="choice">rounded</span> <span data-cli="choice">square</span></span></span>) - Webcam mask shape (circle / rounded / square).
- `cameraBorder` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Draw a border around the PiP.
- `cameraBorderColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#FFFFFF&quot;</span></span></span>) - PiP border color.
- `cameraShadow` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Soft drop shadow under the PiP.

**idle**
- `autoPause` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;off&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">visual</span> <span data-cli="choice">audio</span> <span data-cli="choice">both</span></span></span>) - Skip encoder writes while the capture is idle. Capture stays up. Activity = user input OR speech-mic energy OR a substantial frame change.
- `autoPauseIdleMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-60000</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Overall idle timer. No activity for this long sets PauseIdle. 0 with autoPause off.
- `autoPauseResumeMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-5000</span>, <span data-cli="default">default <span data-cli="value">300</span></span></span>) - Visual must persist this long while auto-paused. Pre-roll covers the start of the action.
- `autoPauseGridW` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">8-128</span>, <span data-cli="default">default <span data-cli="value">32</span></span></span>) - Logical tile columns.
- `autoPauseGridH` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">8-72</span>, <span data-cli="default">default <span data-cli="value">18</span></span></span>) - Logical tile rows.
- `autoPauseProbeW` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">64-192</span>, <span data-cli="default">default <span data-cli="value">64</span></span></span>) - Intermediate luma width (aggregated into logical tiles).
- `autoPauseProbeH` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">36-108</span>, <span data-cli="default">default <span data-cli="value">36</span></span></span>) - Intermediate luma height.
- `autoPausePixelDelta` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-255</span>, <span data-cli="default">default <span data-cli="value">12</span></span></span>) - Luma abs-diff threshold (0–255).
- `autoPauseTilePercent` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - Percent of a tile’s probe samples over pixelDelta.
- `autoPauseMinTiles` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-512</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - Minimum changed logical tiles. Typing is input activity, not this gate.
- `autoPauseMinCoveragePercent` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-100</span>, <span data-cli="default">default <span data-cli="value">2.0</span></span></span>) - sum(activeTile.changedFraction) / gridTileCount as percent. Not bbox area.
- `autoPauseSampleFps` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-30</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - Visual probe rate (independent of encode fps).
- `autoPauseMicWake` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Use speech-mic energy as activity (RMS/peak, not VAD). Desktop-only loopback ignored.
- `autoPauseMicActivityDb` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">-90-0</span>, <span data-cli="default">default <span data-cli="value">-40.0</span></span></span>) - Mic activity threshold in dBFS (not speech). Swappable for WebRTC VAD later.
- `autoPauseMicHangoverMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-5000</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Mic activity hold after the last hot window.
- `autoPauseKeyHoldMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-5000</span>, <span data-cli="default">default <span data-cli="value">750</span></span></span>) - Key / click / wheel hold. Not the overall idle timer.
- `autoPauseMouseHoldMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-5000</span>, <span data-cli="default">default <span data-cli="value">350</span></span></span>) - Mouse-move hold. A nudge must not keep recording for idleMs.
- `autoPauseWakeKey` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Count keyboard as first-class activity (ignore pauseKey/stopKey).
- `autoPauseWakeMouse` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Count mouse move/click/wheel as activity.
- `autoPauseMouseDeltaPx` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-64</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - Ignore cursor jitter below this many screen pixels.
- `autoPausePrerollMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-2000</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Frames kept while PauseIdle and flushed on resume.

**captions**
- `captions` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;off&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">sidecar</span></span></span>) - After finalize, transcribe the encoded-timeline 16 kHz dump and write sidecars. Not a live HUD (use audioTranscribe for that).
- `captionFormat` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;srt&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">srt</span> <span data-cli="choice">vtt</span> <span data-cli="choice">sbv</span> <span data-cli="choice">all</span></span></span>) - YouTube-accepted sidecar: SubRip, WebVTT, SubViewer, or all three.
- `captionStt` (<span data-cli="meta"><span data-cli="type">stt_route</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Dictation STT route. Empty {} inherits App Settings Voice & Audio.
- `subtitleMaxChars` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">8-120</span>, <span data-cli="default">default <span data-cli="value">42</span></span></span>) - Cue wrap width (writer, not viewport).
- `subtitleMaxLines` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-4</span>, <span data-cli="default">default <span data-cli="value">2</span></span></span>) - Cue wrap line count.

**beauty**
- `skin` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Smooth skin (face oval minus eyes/lips). Forces the compatibility CPU recorder.
- `skinBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.5</span></span></span>) - Skin mix 0..1 (0 dry / 1 wet). Same as CLI --skin-blend / --skin-strength.
- `lips` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Tint lips from the face mesh. Forces the compatibility CPU recorder.
- `lipsColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#C45C6A&quot;</span></span></span>) - Lip tint color.
- `lipsBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.35</span></span></span>) - Lip tint mix 0..1. Same as CLI --lips-blend / --lips-alpha.
- `teeth` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Whiten teeth from the face mesh. Forces the compatibility CPU recorder.
- `teethBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.4</span></span></span>) - Teeth mix 0..1. Same as CLI --teeth-blend / --teeth-strength.
- `landmarks` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Draw face-mesh landmarks on the frame (debug).
- `faceGain` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.0</span></span></span>) - Lift crushed face exposure (Lab L*). 0 = off. Same oval as skin. Same as CLI --face-gain.
- `warmth` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.0</span></span></span>) - Warm the face oval (Lab b*). 0 = off. Same as CLI --warmth.
- `undereye` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Lighten under-eye bands (dark circles). Forces the compatibility CPU recorder.
- `undereyeBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.45</span></span></span>) - Under-eye mix 0..1. Same as CLI --undereye-blend.
- `redness` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Mute flush / acne (Lab a* toward neutral). Forces the compatibility CPU recorder.
- `rednessBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.4</span></span></span>) - Redness mute mix 0..1. Same as CLI --redness-blend.
- `eyeSharpen` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Unsharp the eye polys after skin. Forces the compatibility CPU recorder.
- `eyeSharpenBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.35</span></span></span>) - Eye sharpen mix 0..1. Same as CLI --eye-sharpen-blend.

**frame**
- `mirror` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Horizontal flip (webcam mirror). No model.
- `preview` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Live window at the captured frame size. Close the window to stop. Forces the compatibility CPU recorder. Same as CLI --preview.

**background**
- `blur` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Blur the non-person region (ImageSegmenter). Forces the compatibility CPU recorder.
- `blurBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.65</span></span></span>) - Background blur mix 0..1. Same as CLI --blur-strength.
- `background` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Replace the non-person region with bgColor / bgImage.
- `bgColor` (<span data-cli="meta"><span data-cli="type">color</span>, <span data-cli="default">default <span data-cli="value">&quot;#1A1A1A&quot;</span></span></span>) - Solid replacement color.
- `bgImage` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Replacement image, scaled to the frame.
- `featherPx` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - Person-mask feather in pixels.

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Frame handle (mem://...) from a previous filter, or an image path.

**options**
- `brightness` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">-1-1</span>, <span data-cli="default">default <span data-cli="value">0.0</span></span></span>) - Brightness offset. 0 = none; -1..1 maps to ±255.
- `contrast` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-3</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Contrast multiplier around mid-gray. 1 = none.
- `saturation` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-3</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Saturation. 1 = none; 0 = grayscale; >1 = more vivid.

**advanced**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `prompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Motion / camera / lighting prompt.

**source**
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Keyframe stills. First path = start frame, second = end frame. Uses PREVIOUS when unset. Extra style images go in references.
- `startFrame` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional start-frame still (alias of a single input).
- `lastFrame` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional last-frame still.

**references**
- `references` (<span data-cli="meta"><span data-cli="type">args_list</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Style / brand reference images (not keyframes). Sent as OpenRouter input_references.

**output_file**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output path (.mp4). Empty = core default naming.

**model**
- `provider` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Video generation provider. Empty = App Settings video provider.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Video model (video-fast, video-deep, or a Replicate slug). Empty = App Settings video model.
- `providerOptions` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Extra provider fields (personGeneration, negativePrompt, …).

**request**
- `duration` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-8</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Seconds. Veo accepts 4 / 6 / 8. 0 = model default (4 fast / 8 deep).
- `resolution` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;720p&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">720p</span> <span data-cli="choice">1080p</span> <span data-cli="choice">4K</span></span></span>) - Output resolution. 4K is video-deep only.
- `aspectRatio` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;16:9&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">16:9</span> <span data-cli="choice">9:16</span></span></span>) - Output aspect ratio.
- `generateAudio` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Request native audio (higher cost on OpenRouter Veo).

**auth**
- `apiKey` (<span data-cli="meta"><span data-cli="type">api_key</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - API key override. Empty = from App Settings.
- `baseUrl` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Provider base URL override. Empty = App Settings.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;videoPath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Frame handle (mem://...) from a previous filter, or an image path.

**options**
- `x` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-32768</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Left edge (px).
- `y` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-32768</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Top edge (px).
- `width` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-32768</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Crop width (px). 0 = to right edge.
- `height` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-32768</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Crop height (px). 0 = to bottom edge.

**advanced**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `model` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="required">required</span></span>) - YOLO ONNX model path (required). Examples: ${MODELS_DIR}/yolov8n.onnx, yolo11n-obb.onnx, yolo11n-cls.onnx, yolo11n-pose.onnx under model roots.
- `input` (<span data-cli="meta"><span data-cli="type">screen_input</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Webcam device name or screen spec (screen:0, screen:0:wintitle*). Default: empty → App Settings video_capture_device, then default webcam.
- `task` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">detect</span> <span data-cli="choice">classify</span> <span data-cli="choice">obb</span> <span data-cli="choice">pose</span> <span data-cli="choice">segment</span></span></span>) - YOLO head to decode. Default: auto (infer detect/classify/segment from model). obb and pose must be selected explicitly.

**labels_filter**
- `labels` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional YOLO labels YAML. Default: empty → classes CSV, then task default (obb: DOTA-15, classify: imagenet-classes.txt beside model, else COCO-80).
- `classes` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Comma-separated class names (index order). Default: empty. Ignored when labels is set.
- `filterClasses` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Comma-separated class names to keep. Default: empty → keep all detections.

**thresholds**
- `conf` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.25</span></span></span>) - Detection confidence threshold (0–1). Default: 0.25.
- `nms` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.45</span></span></span>) - NMS IoU threshold for detect/obb/pose. Default: 0.45.
- `topK` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-100</span>, <span data-cli="default">default <span data-cli="value">5</span></span></span>) - classify task: top predictions to return. Default: 5.

**runtime**
- `inputSize` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-4096</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Model input size (px). Default: 0 → from metadata (detect 640, classify 224, obb 1024).
- `threads` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-64</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - ONNX Runtime intra-op CPU threads. Default: 4.
- `provider` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;gpu&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">gpu</span> <span data-cli="choice">auto</span> <span data-cli="choice">cpu</span> <span data-cli="choice">cuda</span></span></span>) - ONNX execution provider. Default: gpu (CUDA required). auto = CUDA then CPU fallback.
- `gpuStats` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Attach NVIDIA VRAM telemetry when activeProvider=cuda. Default: false.
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Named cached model/session instance across loop passes. Default: empty → hash by args.

**visualization**
- `visualize` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Live detection window (Win32). Default: false. Persists across loop passes.
- `visualizeMode` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">overlay</span> <span data-cli="choice">preview</span></span></span>) - Visualization window mode. Default: auto (overlay for screen:*, preview otherwise).
- `visualizeStats` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Draw FPS / infer-time / class-count overlay text. Default: true.
- `visualizeLabels` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Draw label + confidence on boxes. Default: true.

**smoothing**
- `smoothAlpha` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.35</span></span></span>) - Temporal EMA for overlay boxes (viz only). Default: 0.35.
- `smoothAge` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-60</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - Overlay box persistence after disappearance (viz only). Default: 4 frames.
- `smoothMinHits` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-60</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Frames before a track is drawn (viz only). Default: 0.

**tracking**
- `trackIds` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Stable track ids and per-track colors (viz only). Default: false.
- `trackTwoStage` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - ByteTrack-style high/low association (viz only). Default: false.
- `trackConfHigh` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.5</span></span></span>) - High-confidence split for trackTwoStage (viz only). Default: 0.5.
- `trackCenter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Center-distance fallback matching (viz only). Default: true.
- `trackCenterDist` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-10</span>, <span data-cli="default">default <span data-cli="value">1.2</span></span></span>) - Center-distance gate as multiple of mean box side (viz only). Default: 1.2.
- `trackVelBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.7</span></span></span>) - Velocity EMA during dropouts (viz only). Default: 0.7.

**pose**
- `kptMinScore` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="type">0-1</span>, <span data-cli="default">default <span data-cli="value">0.3</span></span></span>) - Min pose keypoint score to update a joint (viz only). Default: 0.30.

**output_recording**
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">100-30000</span>, <span data-cli="default">default <span data-cli="value">5000</span></span></span>) - Webcam capture timeout (ms). Default: 5000. Ignored for screen input.
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Optional annotated still image (.jpg/.png). Default: empty → do not save.
- `recordPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Optional annotated burn-in video (.mp4). Default: empty → do not record.
- `recordFps` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-240</span>, <span data-cli="default">default <span data-cli="value">30</span></span></span>) - Burn-in video frame rate when recordPath is set. Default: 30.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;detections&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: detections.

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Frame handle (mem://...) from a previous filter, or an image path.

**advanced**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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

- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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

- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;screens&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: screens.

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;List&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">List</span> <span data-cli="choice">Unload</span></span></span>) - List loaded models in this xBlox process, or unload one by key.
- `key` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;modelKey&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Frame handle (mem://...) from a previous filter, or an image path.

**options**
- `width` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-16384</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Target width (px). 0 = keep aspect from height.
- `height` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-16384</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Target height (px). 0 = keep aspect from width.

**advanced**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output file (.jpg/.png). Empty = keep in-memory (mem:// handle) for the next filter.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">screen_input</span>, <span data-cli="default">default <span data-cli="value">&quot;screen:0&quot;</span></span></span>) - Screen spec. Default: screen:0 (primary monitor). Examples: screen:current, screen:N, screen:N:wintitle=GLOB.

**advanced**
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output image path (.jpg/.png). Default: empty → temp file in system temp directory.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable for PREVIOUS / downstream blocks. Default: imagePath.

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
- `input` (<span data-cli="meta"><span data-cli="type">screen_input</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Camera name, screen/window spec (screen:current / screen for the monitor of the launching window, screen:N, screen:N:wintitle=GLOB, screen:N:hwnd=ID), image (.png/.jpg), or video file (.mp4). Empty = preferred camera.

**one_shot_output**
- `emit` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;both&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">both</span> <span data-cli="choice">file</span> <span data-cli="choice">handle</span></span></span>) - One-shot mode only (no child items): both = write file + cache frame; file = write only; handle = in-memory only (mem:// handle, no file).
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - One-shot output file path (.jpg/.png) for emit=file/both. Empty = auto temp file.

**pump_limits**
- `frames` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-1e+06</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max frames to pump (0 = unbounded -> video files run to EOF; live sources run until durationMs/cancel). Use N for a fixed-length grab.
- `durationMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">0-8.64e+07</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Live sources only: stop after this wall-clock budget (0 = no cap).
- `progressEvery` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-100000</span>, <span data-cli="default">default <span data-cli="value">60</span></span></span>) - Pump mode: emit a progress event every N frames (child events are muted). 0 = only the final summary.

**capture_options**
- `fps` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-240</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred capture rate for live sources. 0 = source default.
- `width` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-7680</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred width in pixels (live sources). 0 = source default.
- `height` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-4320</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred height in pixels (live sources). 0 = source default.
- `timeoutMs` (<span data-cli="meta"><span data-cli="type">duration_ms</span>, <span data-cli="type">100-30000</span>, <span data-cli="default">default <span data-cli="value">5000</span></span></span>) - Max ms to wait for the first frame of a live source.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;imagePath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Frame handle (mem://...) from a previous filter, or an image path.
- `outputPath` (<span data-cli="meta"><span data-cli="type">output_path</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">constraints</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">writable</span> <span data-cli="choice">createParents</span></span></span>) - Output video path (.mp4). Required.

**options**
- `fps` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">0-240</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Output frame rate. 0 = follow the source (videoSource's detected fps; 30 if unknown). Set a value to force constant-rate output.

**advanced**
- `instance` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span></span>) - Optional writer id. Empty = keyed by output path. Use distinct ids for parallel writers.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;videoPath&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
- `input` (<span data-cli="meta"><span data-cli="type">image_path</span>, <span data-cli="tag" data-variant="enum">from PREVIOUS</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">globs</span></span></span>) - Image path, glob, or PREVIOUS. Glob arrays are passed as multiple images.

**source_model**
- `frames` (<span data-cli="meta"><span data-cli="type">json_value</span>, <span data-cli="default">default <span data-cli="value">[]</span></span></span>) - Additional image paths for multi-frame or comparison prompts.
- `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;&quot;</span></span>, <span data-cli="tag" data-variant="enum">resolve</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">variables</span> <span data-cli="choice">deep</span></span></span>) - Local vision VLM model id/path. Empty = prefer MiniCPM-V from downloaded models.
- `slot` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;vision&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">vision</span> <span data-cli="choice">image</span> <span data-cli="choice">video</span></span></span>) - Local model catalog slot used for auto-selection.

**prompt**
- `prompt` (<span data-cli="meta"><span data-cli="type">prompt</span>, <span data-cli="default">default <span data-cli="value">&quot;Describe what you see in detail.&quot;</span></span></span>) - Question or instruction for the vision model.

**output**
- `json` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - When true, result is structured JSON; when false, result is only generated text.
- `includeRaw` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Include rawText in JSON output for debugging before normalizers were applied.
- `result` (<span data-cli="meta"><span data-cli="type">json_value</span></span>) - Structured vision response when json=true.
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;vision&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

**output_normalization**
- `normalizers` (<span data-cli="meta"><span data-cli="type">flags</span>, <span data-cli="default">default <span data-cli="value">15</span></span></span>) - Post-process generated text for common model-output artifacts.
  - `1` Strip thinking - Remove reasoning sections such as <think>...</think>, including unclosed sections.
  - `2` Strip fences - Unwrap a single outer Markdown/code fence around the whole answer.
  - `4` Strip role labels - Remove common leading/trailing assistant role or template markers.
  - `8` Trim output - Trim leading and trailing whitespace after other normalizers.

**runtime**
- `threads` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-64</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - CPU thread count for llama.cpp.
- `gpuLayers` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">-1-999</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - GPU layers to offload. -1 = all available, 0 = CPU-only.
- `ctx` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1024-65536</span>, <span data-cli="default">default <span data-cli="value">4096</span></span></span>) - Context size. Use 8192+ for multi-frame prompts.
- `maxTokens` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="type">1-8192</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Maximum generated tokens.

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
- `action` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="default">default <span data-cli="value">&quot;List&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">List</span> <span data-cli="choice">Unload</span></span></span>) - List loaded models in this xBlox process, or unload one by key.
- `key` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;llama:vlm&quot;</span></span></span>) - Loaded model key to unload, e.g. llama:vlm, llama:text, vibevoice:tts, moss:tts, onnx:*, or * to unload every stoppable model in this process. Empty aliases use their group default.

**output**
- `storeAs` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;modelKey&quot;</span></span></span>) - Variable to also store the result in (always sets PREVIOUS).

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
| `custom.dropdown-msx1rszr-19148` | New | `metadata` |  |
| `custom.command-msx1rszr-32ae1` | XBlox Script | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/intern/new_file.xblox`<br>`--content`<br>`{}`<br>`--ext`<br>`xblox`<br>`--variable-public`<br>`{"ext":true}` |
| `custom.command-msx1xf70-ed2f7` | Text File | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/intern/new_file.xblox`<br>`--ext`<br>`txt`<br>`--variable-public`<br>`{"ext":true}` |
| `custom.command-mtfnk3hu-47302` | Markdown File | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/intern/new_file.xblox`<br>`--variable-public`<br>`{"ext":true}`<br>`--content`<br>`# Caption`<br>`--ext`<br>`md` |
| `custom.command-mtczu1xa-c605f` | File Tab | `app:newfiletab` |  |
| `custom.command-mtfpcfxj-e1333` | Screen Recording | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-16-9.xblox` |
| `custom.command-mpx9r1ur-8c6df` | Assistant | `cli:llm` | `agent`<br>`--consent-ui`<br>`win32`<br>`--realtime`<br>`--hud`<br>`--hud-mode`<br>`both` |
| `custom.command-mpxytlpz-bcde4` | Launcher | `app:togglelauncher` |  |
| `custom.command-mtox7vvr-093fc` | Voice Commands | `app:togglevoicecommand` |  |
| `custom.command-712fbd00-f9ac4` | Product | `cli:transform` | `--prompt`<br>`render this as product shooting, white background, studio`<br>`--json`<br>`${CURRENT_SELECTION}` |
| `custom.command-mpch9gdx-44982` | Illustration | `cli:transform` | `--src`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`as technical illustration`<br>`--model`<br>`image-generation-deep` |
| `custom.image-understand-speak` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/vision-pipe-speak.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mqj3feqz-72a1a` | Resize-HD | `cli:resize` | `run`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--max-width`<br>`800`<br>`--src`<br>`${CURRENT_SELECTION}`<br>`--format`<br>`jpg`<br>`--cache-dir`<br>`${ENV:PIXLWIZ}/cache/images`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_hd.jpg`<br>`--job-ui` |
| `custom.command-mszwq2g6-780cb` | To Markdown | `cli:llm` | `agent`<br>`--no-mcp`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--include`<br>`${CURRENT_FILE}`<br>`--enable-tools`<br>`image_understand,write_file`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}.md`<br>`--prompt`<br>`Create Markdown Document using the provided path to an image, and image_understand tool - dont comment, just print the result of image_understand.`<br>`--no-skills`<br>`--hud`<br>`--hud-mode`<br>`both` |
| `custom.command-mtun9312-7d0e1` | Share Post | `cli:service` | `posts`<br>`create`<br>`${CURRENT_SELECTION}`<br>`--visibility`<br>`listed` |
| `custom.command-mrcja3yb-306c8` | Region | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/screenshot.xblox` |
| `custom.command-mpxzouxv-ab189` | App | `app:takescreenshot` |  |
| `custom.command-mu4l7dsk-4b406` | Fullscreen Screenshot | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/screenshot-full.xblox` |
| `custom.command-mre4dk8y-7a985` | To Markdown | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/screenshot-vision-md.xblox` |
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
| `custom.command-msqfoqej-85fb5` | Performance | `app:toggleperf` |  |
| `custom.command-mtwl51se-b7440` | 1269x846 | `app:setframesize` |  |
| `custom.view-maximize` | Fullscreen | `app:togglefullscreen` |  |
| `custom.command-mtoxzgrv-1f644` | Maximize | `app:setframesize` |  |
| `custom.command-mtv9cd7k-7a458` | Reset | `app:resetlayout` |  |
| `custom.command-70eabea6-957e6` | Spanish | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`Translate to Spanish`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_es.${SRC_EXT}`<br>`--hud` |
| `custom.command-msyzmkcu-9b027` | English | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_en.${SRC_EXT}`<br>`--prompt`<br>`Translate to English`<br>`--no-tools`<br>`--preset`<br>`Tanit-Fast`<br>`--hud`<br>`--hud-mode`<br>`both` |
| `custom.command-msyznegr-9190e` | German | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_de.${SRC_EXT}`<br>`--prompt`<br>`Translate to German` |
| `custom.command-mt0dfzrn-665b0` | French | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--prompt`<br>`Translate to French`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_fr.${SRC_EXT}` |
| `text.md2pdf` | MD->PDF | `external` | `--headless`<br>`--convert-to pdf`<br>`--outdir`<br>`${CWD}`<br>`${CURRENT_FILE}` |
| `custom.command-ms0phpqj-d1ca3` | Chrome | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-chrome.xblox` |
| `custom.command-ms33shnl-97127` | App | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-win32.xblox` |
| `custom.color-picker` | Color | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-color.xblox` |
| `custom.text-speak` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-text-speak.xblox` |
| `custom.voice-cloner` | Voice Cloner | `cli:audio` | `voice-change`<br>`--remove-background-noise`<br>`${CURRENT_FILE}`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_cloned.wav`<br>`--style`<br>`0.5`<br>`--stability`<br>`1` |
| `custom.command-mpxzk7g4-67590` | Voice Recorder | `cli:audio` | `record`<br>`--dst`<br>`${CONFIG_DIR}/recordings/tanit-${DD}-${HH}-${mm}.wav`<br>`--hud`<br>`--filter`<br>`deepfilter` |
| `custom.command-mtk0rcb2-f401a` | Speech to Text | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/stt-paste-whisper.xblox` |
| `custom.command-ms0q0j9j-92441` | Yamaha | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/bluetooth-yamaha.xblox` |
| `custom.command-mtn0t1b3-722de` | Voice Commands | `app:togglevoicecommand` |  |
| `custom.command-mrf5dhi8-76608` | 1:1 | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-ex.xblox` |
| `custom.command-mssrlhcu-5aa17` | 1:1-ex | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-ex.xblox` |
| `custom.command-ms4vl4ur-4569d` | 16:9 | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-16-9.xblox` |
| `custom.command-msghb0e2-e8c47` | Fixed | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-fixed.xblox` |
| `custom.video-start` | WebCam | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/webcam.xblox` |
| `custom.command-mu1wam8u-bfd55` | WebCam Beautifier | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/webcam.xblox` |
| `custom.handbrake-hq` | Handbrake | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-encode-medium.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-video-social-hq` | Social Video HQ | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-encode-social-hq.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
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
| `custom.command-mt4msl99-55414` | Start | `app:schedulerstart` |  |
| `custom.command-mt4munur-873bb` | Stop | `app:schedulerstop` |  |
| `custom.command-mt7672eh-b7786` | To Images | `cli:pdf` | `render`<br>`${CURRENT_FILE}`<br>`--output-dir`<br>`${SRC_DIR}/${SRC_NAME}_images`<br>`--quality`<br>`100`<br>`--format`<br>`png`<br>`--pages`<br>`all`<br>`--output`<br>`${SRC_DIR}/${SRC_NAME}_images/${SRC_NAME}.png` |
| `custom.pdf-to-md` | To Markdown | `cli:pdf` | `md`<br>`${CURRENT_FILE}`<br>`--output-dir`<br>`${SRC_DIR}/${SRC_NAME}_md`<br>`--output`<br>`${SRC_DIR}/${SRC_NAME}.md` |
| `custom.fs-copy` | Copy | `app:fscopy` |  |
| `custom.fs-move` | Move | `app:fsmove` |  |
| `custom.command-mu114s8q-17bff` | Share | `cli:service` | `files`<br>`upload`<br>`${CURRENT_SELECTION}`<br>`--if-newer`<br>`--remote-dir`<br>`public` |
| `custom.dropdown-msaj5qk5-78a6b` | Help | `metadata` |  |
| `custom.help-cli` | CLI-Manual | `app:open` |  |
| `custom.help-xblox` | XBlox | `app:open` |  |
| `custom.command-msakytc7-dd084` | Online Help | `app:openurl` |  |
| `custom.command-mu1w66c6-5b959` | Speak | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-text-speak.xblox` |
| `custom.command-mtum9djk-a760d` | Share as Article | `cli:service` | `pages`<br>`create`<br>`--category-id`<br>`uncategorized`<br>`--private`<br>`${CURRENT_SELECTION}` |
