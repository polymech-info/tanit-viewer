# Tanit Agent Tools

These are the path-mode LLM agent tools available in this build. They are offered to the model during `tanit-cli.exe llm agent` runs and via the embedded MCP server.

## Invocation Notes

- Tools run in the agent's sandboxed path context; the model calls them by name.
- Use `tanit-cli.exe llm info --tools` to inspect the active tool list for a given chat preset.
- Disable individual tools per-run with `--no-tools` (all) or `--disable-tools <name,...>`.
- Enable only specific tools with `--enable-tools <name,...>`.

## Tools

### File

#### file_glob

List files matching a glob or directory (e.g.

Params:
- `options` (object)
- `pattern` (string, required)  -  Glob or path: e.g.

#### file_read

Read a UTF-8 text file.

Params:
- `limit` (integer)  -  Max lines to return.
- `offset` (integer)  -  First line to return (1-based).
- `path` (string, required)  -  File path: absolute, or relative to the Explorer folder / selection base in-app.

#### file_search

Search file contents (grep) or file names.

Params:
- `-A` (integer)  -  Context lines after each match (rg -A N).
- `-B` (integer)  -  Context lines before each match (rg -B N).
- `-C` (integer)  -  Symmetric context lines (rg -C N, overrides -B / -A).
- `-i` (boolean)  -  Case-insensitive (rg -i, default: true).
- `glob` (string)  -  Filename glob filter (rg -g).
- `head_limit` (integer)  -  Cap on returned hits.
- `indexer` (enum: own|rg)  -  rg = bundled ripgrep (recommended for large trees, code search, and any search you'd normally run with rg).
- `inputs` (array)  -  Files or directories to search (rg PATH …).
- `mode` (enum: grep|name)  -  grep = full-text search (default, rg PATTERN); name = filename match (rg --files -g *query*).
- `multiline` (boolean)  -  Multiline mode: .
- `offset` (integer)  -  Skip first N hits (pagination).
- `output_mode` (enum: content|files_with_matches)  -  content = hits array with path/line/text (default); files_with_matches = deduplicated file paths (rg -l).
- `path` (string)  -  Single file or directory (alias for inputs[0]).
- `pattern` (string)  -  Alias for 'query' (backward compat).
- `query` (string, required)  -  Pattern to search for.
- `regex` (boolean)  -  Treat query as a regex (default: false = literal, rg -F).
- `type` (string)  -  File type shorthand (rg -t): cpp, c, cs, go, html, java, js, json, md, py, rs, sh, swift, ts, toml, xml, yaml, …
- `whole_word` (boolean)  -  Match whole words only (rg -w).

---

### Image

#### image_resize

Resize, re-encode, or convert format for one or more images on disk (libvips, not AI).

Params:
- `options` (object, required)
- `output_path` (string)  -  Optional.
- `output_paths` (array)  -  Optional.
- `paths` (array, required)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).

#### image_crop

Crop one or more images on disk to a pixel rectangle (libvips, not AI).

Params:
- `options` (object, required)
- `output_path` (string)  -  Optional.
- `output_paths` (array)  -  Optional.
- `paths` (array, required)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).

#### image_transform

AI image edit over one or more images on disk.

Params:
- `options` (object, required)
- `output_path` (string)  -  Optional exact output file path for a single input.
- `output_paths` (array)  -  Optional exact output file paths for multiple inputs; length must match paths.
- `paths` (array, required)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).

#### image_create

AI media generation on disk from a **text prompt** (and optional reference images).

Params:
- `options` (object, required)
- `out_dir` (string)  -  Optional output directory when output_path is omitted (e.g.
- `output_path` (string)  -  Optional exact output file path.

#### create_video

Generate a short video clip.

Params:
- `aspect_ratio` (enum: 16:9|9:16)  -  Output aspect ratio.
- `conditioningScale` (string)  -  Provider passthrough (`conditioningScale`).
- `duration` (enum: 4|6|8)  -  Clip length in seconds.
- `enhancePrompt` (string)  -  Provider passthrough (`enhancePrompt`).
- `generate_audio` (boolean)  -  Request native audio.
- `image` (string)  -  Legacy alias of start_frame.
- `last_frame` (string)  -  Optional last-frame still (host path or data URL).
- `negativePrompt` (string)  -  Provider passthrough (`negativePrompt`).
- `output` (string)  -  Optional output path.
- `paths` (array)  -  Alias of src (Explorer selection / current folder stills).
- `personGeneration` (string)  -  Provider passthrough (`personGeneration`).
- `prompt` (string, required)  -  Motion / camera / lighting.
- `reference` (string)  -  Single-path alias of reference_images.
- `reference_images` (array)  -  Style / brand reference images (not keyframes).
- `references` (array)  -  Alias of reference_images.
- `resolution` (enum: 720p|1080p)  -  Output resolution (720p default).
- `src` (array)  -  Keyframe stills (host paths).
- `start_frame` (string)  -  Optional start-frame still (host path or data URL).

#### image_understand

Ask the vision model a question about one or more images on disk.

Params:
- `options` (object)
- `paths` (array, required)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).
- `prompt` (string, required)  -  Required.

#### ocr_text

Extract text from one or more images using the configured OCR model (local VLM or cloud).

Params:
- `paths` (array, required)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).
- `prompt` (string)  -  Optional.

#### image_from_camera

Capture a still image from a connected webcam / camera and save it to disk.

Workflow:
  1.

Params:
- `action` (enum: capture|list, default `"capture"`)  -  "list" - return all capture devices and their available resolutions.
- `device` (string)  -  Case-insensitive substring of the camera's friendly name (e.g.
- `height` (integer)  -  Preferred capture height in pixels.
- `output_path` (string)  -  Destination file path (.jpg, .png, or .bmp).
- `width` (integer)  -  Preferred capture width in pixels.

---

### Utility

#### write_file

Create, overwrite, or append a UTF-8 text file on disk (reports, notes, .md, CSV snippets).

Params:
- `content` (string, required)  -  Full file body in UTF-8.
- `expected_version` (string)  -  Optional.
- `options` (object)
- `path` (string, required)  -  Output path: absolute, or relative to the Explorer folder / selection base in-app (e.g.

#### file_str_replace

Surgical edit of an existing UTF-8 file.

Params:
- `end_line` (integer)  -  Optional 1-based window end; must pair with start_line.
- `expected_version` (string)  -  Optional.
- `new_string` (string, required)  -  Replacement text.
- `old_string` (string, required)  -  Exact text to find.
- `path` (string, required)  -  Existing UTF-8 file to edit.
- `replace_all` (boolean, default `false`)  -  Replace every match.
- `start_line` (integer)  -  Optional 1-based window start; must pair with end_line.

#### file_delete

Delete one regular file.

Params:
- `expected_version` (string)  -  Optional.
- `path` (string, required)  -  Regular file to delete.

#### speak

Synthesise text to speech and play it on the default speaker.

Params:
- `dst` (string)  -  Optional output audio file path.
- `play` (boolean, default `true`)  -  Play the audio through the default speaker (default: true).
- `text` (string, required)  -  The text to synthesise and play aloud.
- `text_out` (string)  -  Optional path to write the spoken text as a UTF-8 file (transcript/caption).

#### audio_transcribe

Record from the default microphone, transcribe with the chat STT provider, and return the text.

Params:
- `api_key` (string)  -  Optional API key override.
- `dst` (string)  -  Optional WAV file path for the recorded audio (16 kHz mono s16le).
- `input_device` (string)  -  Optional capture device name (case-insensitive substring; use `audio info` to list).
- `max_duration_ms` (integer, default `30000`)  -  Hard cap on recording length in milliseconds (default 30 000).
- `prompt` (string)  -  Optional short cue to speak before recording starts (one sentence is ideal, e.g.
- `provider` (enum: tanit|elevenlabs|whisper|)  -  STT provider override.
- `silence_ms` (integer, default `1500`)  -  VAD: auto-stop after this many ms of silence following at least one speech burst (default 1 500).
- `text_out` (string)  -  Optional path to write the transcript as a UTF-8 text file.

#### ask_user

Interactively ask the human user a question and wait for their reply.

Params:
- `default`  -  Optional pre-selected answer matching `kind`: `text` → string; `choice` → option label or 0-based index; `multi_choice` → array of labels or indices; `con…
- `kind` (enum: text|choice|multi_choice|confirm, default `"text"`)  -  Interaction modality.
- `multiline` (boolean, default `false`)  -  Allow multi-line input (`kind=text` only).
- `options` (array)  -  Selectable labels for `choice` / `multi_choice`.
- `placeholder` (string)  -  Hint text shown inside the text input when empty (e.g.
- `question` (string, required)  -  The prompt rendered to the user.
- `timeout_ms` (integer, default `0`)  -  Reserved.

#### run

Execute a shell command and return stdout/stderr.

Params:
- `command` (string, required)  -  Shell command (PowerShell on Windows, bash/sh on Unix).
- `shell` (enum: auto|bash|sh|pwsh|cmd)  -  Shell to use.
- `timeout_ms` (integer)  -  Wall-clock ms before the process is killed.

#### run_sequence

Execute a deterministic sequence of shell commands and timed waits without spending extra LLM round-trips between steps.

Params:
- `context` (object)  -  Optional initial key-value context passed to the first step.
- `steps` (array, required)  -  Ordered list of steps to execute.

#### info_lookup

Look up Tanit's local catalog: CLI commands, in-app UI verbs (app_command), path tools, MCP tool names, apps, skills.

Params:
- `depth` (integer)  -  Explicit cross-resource traversal depth for cycle/depth guards.
- `detail` (boolean, default `true`)  -  When true, include generated help / schemas for exact syntax.
- `kind` (enum: auto|command|app_command|tool|mcp|app|app_state|skill|resource|all, default `"auto"`)  -  Surface to search.
- `max_bytes` (integer)  -  Maximum body bytes when materializing a resource.
- `max_results` (integer)  -  Maximum matches to return.
- `query` (string, required)  -  Name or keyword, e.g.

#### create_command

Add a ribbon or context-menu button.

Params:
- `args` (array)  -  Arguments.
- `command` (string, required)  -  pm-image-cli subcommand slug (resize, transform, llm, audio, video, …), executable name in PATH (vlc, gimp, ffmpeg) or absolute path, or shell name (bash, pow…
- `cwd_from_selection` (boolean, default `false`)  -  When true, sets cwd to ${CURRENT_PATH} so the command runs in the selected folder.
- `description` (string)  -  Optional tooltip / description text for the command.
- `group` (string)  -  Ribbon group label to place the button in.
- `icon` (string)  -  Lucide icon name for the button (e.g.
- `label` (string, required)  -  Display name shown in the ribbon button or context-menu entry.
- `surface` (enum: ribbon|context_menu|both, default `"ribbon"`)  -  Where to surface the command.
- `tint` (string)  -  Accent / tint color in #RRGGBB hex format (e.g.

---

### Scheduler

#### schedule_at

Schedule a one-shot agent task to run at an exact UTC time.

Params:
- `folder_hint` (string)  -  Optional folder context for the scheduled turn.
- `initial_state` (object)  -  Optional initial memory_state JSON.
- `prompt` (string, required)  -  The full prompt to run at fire time.
- `run_at` (string, required)  -  ISO 8601 UTC datetime, e.g.
- `title` (string, required)  -  Short human-readable name for the task.

#### schedule_in

Schedule a one-shot agent task to run after a delay.

Params:
- `delay_seconds` (integer, required)  -  Seconds from now until the task fires.
- `folder_hint` (string)
- `initial_state` (object)
- `prompt` (string, required)
- `title` (string, required)

#### schedule_every

Schedule a recurring agent task on a fixed interval.

Params:
- `folder_hint` (string)
- `initial_state` (object)
- `interval_seconds` (integer, required)  -  Seconds between ticks.
- `max_runs` (integer)  -  Optional cap on total runs; omit for unlimited.
- `prompt` (string, required)
- `start_at` (string)  -  Optional ISO 8601 UTC start time.
- `title` (string, required)

#### schedule_cancel

Cancel (disable) a scheduled task by its id.

Params:
- `task_id` (string, required)  -  The task id returned by schedule_at / schedule_in / schedule_every.

#### schedule_list

List all scheduled tasks (id, title, schedule, enabled, next_run_at, run_count).

Params:

---

### Memory

#### memory_read

Read persistent long-term memory and per-item metadata.

Params:
- `task_id` (string)  -  Optional: read a scheduled task's memory instead.

#### memory_write

Merge a JSON object into long-term memory.

Params:
- `state` (object, required)  -  Partial object to merge.
- `tags` (array)  -  Optional tags applied to every key in this write.

#### memory_append_event

Append a structured event to the session event log.

Params:
- `event` (object, required)  -  JSON object.

#### memory_find

Rank session memory facts or items with BM25 plus available dense recall.

Params:
- `includeArtifacts` (boolean, default `false`)  -  Include artifact items.
- `includeBody` (boolean, default `false`)  -  Materialize canonical assistant final_text for an exact itemId, or for the top-ranked query result.
- `includePayload` (boolean, default `false`)  -  Materialize one canonical same-session tool_result envelope.
- `includeSecurity` (boolean, default `false`)  -  Include security-review items.
- `itemId` (string)  -  Exact session-item ID (for example turn_ab12).
- `maxBytes` (integer)  -  Maximum UTF-8 bytes of assistant body or tool payload to return.
- `maxResults` (integer)  -  Max items to return.
- `offset` (integer)  -  UTF-8 byte offset for the body or payload slice.
- `query` (string)  -  Natural-language ranked query.
- `searchPastChats` (boolean, default `false`)  -  Also search all persisted past sessions.
- `sessionId` (string)  -  Optional exact owning session ID used to disambiguate itemId.
- `toolCallId` (string)  -  Exact transcript tool-call ID exposed in turn metadata.

---

### Computer

#### app_inspect_dump

Observe a desktop app and cache a session tree for later app_inspect_find/app_click calls.

Params:
- `controls` (string)  -  Advanced raw control filter: buttons,menus,editable,cells,all.
- `foreground` (boolean)  -  Backward-compatible alias for target.foreground.
- `format` (enum: md|json)  -  Default md.
- `limit` (integer)  -  Max elements to inspect/cache.
- `probe_cells` (boolean)  -  Force slower visible-cell probing.
- `process` (string)  -  Backward-compatible alias for target.process.
- `session_id` (string)  -  Cache key for this app tree.
- `target` (object)  -  Preferred target selector.
- `text_max_chars` (integer)  -  Max chars per text/value field.
- `title` (string)  -  Backward-compatible alias for target.title.
- `view` (enum: actions|editable|cells|all)  -  What to show.

#### app_inspect_find

Find targetable elements.

Params:
- `automation_id` (string)  -  Backward-compatible alias for query.automation_id.
- `class_name` (string)  -  Backward-compatible alias for query.class_name.
- `controls` (string)  -  Advanced raw control filter.
- `limit` (integer)  -  Only used for fresh inspect.
- `name` (string)  -  Backward-compatible alias for query.name.
- `nth` (integer)  -  Optional zero-based match index to return as selected.
- `probe_cells` (boolean)
- `process` (string)  -  Backward-compatible alias for target.process.
- `query` (object)  -  Preferred element selector.
- `ref` (string)  -  Backward-compatible alias for query.ref.
- `session_id` (string)  -  Use cached tree from app_inspect_dump.
- `target` (object)  -  Optional fresh target if not using session.
- `title` (string)  -  Backward-compatible alias for target.title.
- `value` (string)  -  Backward-compatible alias for query.value.
- `view` (enum: actions|editable|cells|all)  -  Backward-compatible alias for query.view.

#### app_screenshot

Capture a desktop app window, element, or explicit screen rectangle as JPEG.

Params:
- `activate` (boolean)  -  Bring target window to foreground before capture.
- `element_index` (integer)  -  Element index from a prior dump/find.
- `foreground` (boolean)
- `output_path` (string, required)  -  Destination .jpg path.
- `process` (string)
- `quality` (integer)
- `rect` (string)  -  Screen rectangle x,y,w,h.
- `title` (string)

#### app_click

Click a screen coordinate, a window-relative coordinate, or find an app element and click its center.

Params:
- `automation_id` (string)  -  Backward-compatible alias for query.automation_id.
- `button` (enum: left|right|middle)
- `class_name` (string)  -  Backward-compatible alias for query.class_name.
- `controls` (string)  -  Control filter for selector mode.
- `count` (integer)
- `foreground` (boolean)
- `name` (string)  -  Backward-compatible alias for query.name.
- `nth` (integer)  -  Zero-based match index for selector mode.
- `probe_cells` (boolean)
- `process` (string)
- `query` (object)  -  Element selector for click-by-element.
- `ref` (string)  -  Backward-compatible alias for query.ref.
- `session_id` (string)  -  Cached tree id from app_inspect_dump.
- `title` (string)
- `value` (string)  -  Backward-compatible alias for query.value.
- `virtual` (boolean)  -  Post mouse messages instead of moving the physical cursor.
- `x` (integer)  -  Screen x (absolute).
- `xw` (integer)  -  Window-relative x.
- `y` (integer)  -  Screen y (absolute).
- `yw` (integer)  -  Window-relative y.

#### app_drag

Press the mouse button, walk along a path, release.

Params:
- `arc` (object)  -  Draw a circular arc as the drag path.
- `button` (enum: left|right|middle)  -  Default 'left'.
- `duration_ms` (integer)  -  Total drag wall-time in ms.
- `dx` (integer)  -  Horizontal delta from start.
- `dy` (integer)  -  Vertical delta from start.
- `foreground` (boolean)  -  Activate the foreground window first.
- `hwnd` (integer)  -  Optional HWND (as integer) to activate first.
- `pid` (integer)  -  Optional pid to activate first.
- `process` (string)  -  Optional process-name substring.
- `steps` (integer)  -  Legacy hint - paths are now auto-sampled at one event per ~16 ms frame.
- `title` (string)  -  Optional window-title substring to activate first.
- `to_x` (integer)  -  End screen x.
- `to_y` (integer)  -  End screen y.
- `x` (integer, required)  -  Start screen x (absolute).
- `xw` (integer)  -  Start window-relative x.
- `y` (integer, required)  -  Start screen y (absolute).
- `yw` (integer)  -  Start window-relative y.

#### app_open

Launch a desktop application and optionally place its window.

Params:
- `args` (string)  -  Optional command-line arguments as a single string.
- `cwd` (string)  -  Optional working directory.
- `exe` (string, required)  -  Executable name on PATH (notepad.exe, calc.exe, soffice.exe) or absolute path.
- `height` (integer)  -  Optional window height.
- `wait_ms` (integer)  -  How long to wait for the main window.
- `width` (integer)  -  Optional window width.
- `x` (integer)  -  Optional window x position (screen px).
- `y` (integer)  -  Optional window y position (screen px).

#### app_type

Type Unicode text into the currently focused control.

Params:
- `foreground` (boolean)  -  If true, activate the current foreground window first.
- `hwnd` (integer)  -  Optional HWND (as integer) to activate first.
- `pid` (integer)  -  Optional pid to activate first.
- `process` (string)  -  Optional process-name substring (used when no pid/title).
- `text` (string, required)  -  The text to type.
- `title` (string)  -  Optional window-title substring to activate first.

#### app_hotkey

Send a hotkey combination to the focused (or activated) window.

Params:
- `foreground` (boolean)
- `hwnd` (integer)
- `keys` (string, required)  -  Hotkey spec like 'ctrl+s' or 'alt+f4'.
- `pid` (integer)
- `process` (string)
- `title` (string)

#### app_close

Close a desktop window safely.

Params:
- `force` (boolean)  -  TerminateProcess instead of WM_CLOSE (requires pid).
- `foreground` (boolean)  -  Close the current foreground window.
- `hwnd` (integer)  -  Window handle (as integer) from a prior dump/find.
- `pid` (integer)  -  Process id (e.g.
- `process` (string)  -  Process-name substring (used when no pid/hwnd).
- `title` (string)  -  Window-title substring (used with pid or alone).

#### app_batch

Execute a sequence of UI actions in ONE tool call — use for any multi-step gesture (drawing strokes, menu-open + item-click, activate+select-all+type, playing notes).

Params:
- `actions` (array)  -  Alias for steps.
- `continue_on_error` (boolean)  -  If true, run remaining steps even after one fails.
- `default_delay_ms` (integer)  -  Sleep added after each step that does not set delayMs.
- `steps` (array)  -  Array of step objects, executed in order.

---

### Browser

#### browser_read

Read the current (or tab=) in-app browser tab index (ref, role, name).

Params:
- `compact` (boolean)  -  Summary only (omit item arrays).
- `epoch` (string)  -  Optional page epoch from browser_read.
- `highlight` (boolean)  -  Show a brief on-page flash (corner brackets) at the target.
- `limit` (integer)  -  Maximum index rows.
- `query` (string)  -  Optional: BM25-rank model.zones into model.rankedZones (task / zone name).
- `ref` (string)  -  Opaque ref from browser_read/browser_find, for example e42.
- `scope` (enum: set|clear|full)  -  set=persist within_ref/within_selector (or ref/selector) as the session zone; clear=drop zone; full=one-shot full-page bypass.
- `selector` (string)  -  CSS selector alternative to ref.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.
- `viewport_only` (boolean)  -  Filter to viewport-near elements (default true).
- `within_ref` (string)  -  Limit index/find to descendants of this container ref.
- `within_selector` (string)  -  Limit index/find to descendants of this CSS selector root.

#### browser_find

Find by selector or role/name only when you lack a ref from a scoped read.

Params:
- `limit` (integer)
- `name` (string)  -  Optional case-insensitive accessible-name substring.
- `role` (string)  -  Optional role such as button, link, textbox.
- `scope` (enum: set|clear|full)  -  set=persist within_ref/within_selector (or ref/selector) as the session zone; clear=drop zone; full=one-shot full-page bypass.
- `selector` (string)  -  Optional CSS selector.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.
- `viewport_only` (boolean)  -  Default true.
- `within_ref` (string)  -  Limit index/find to descendants of this container ref.
- `within_selector` (string)  -  Limit index/find to descendants of this CSS selector root.

#### browser_scope

Inspect or clear the session zone.

Params:
- `action` (enum: set|clear|status)  -  Default status.
- `epoch` (string)  -  Optional page epoch for ref on action=set; defaults to live page.
- `ref` (string)  -  Container ref for action=set.
- `selector` (string)  -  CSS root for action=set.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.
- `within_selector` (string)  -  Alias for selector on action=set.

#### browser_click

Click an element in the current (or tab=) in-app browser tab by ref (preferred) or CSS selector.

Params:
- `epoch` (string)  -  Optional page epoch from browser_read.
- `highlight` (boolean)  -  Show a brief on-page flash (corner brackets) at the target.
- `ref` (string)  -  Opaque ref from browser_read/browser_find, for example e42.
- `selector` (string)  -  CSS selector alternative to ref.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.

#### browser_type

Enter text into an input, textarea, or contenteditable element by ref or selector.

Params:
- `clear` (boolean)  -  Replace existing text.
- `epoch` (string)  -  Optional page epoch from browser_read.
- `highlight` (boolean)  -  Show a brief on-page flash (corner brackets) at the target.
- `ref` (string)  -  Opaque ref from browser_read/browser_find, for example e42.
- `selector` (string)  -  CSS selector alternative to ref.
- `submit` (boolean)  -  Submit the containing form afterwards.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.
- `text` (string, required)  -  Text to enter.

#### browser_select

Select an option in a select element by ref or selector.

Params:
- `epoch` (string)  -  Optional page epoch from browser_read.
- `highlight` (boolean)  -  Show a brief on-page flash (corner brackets) at the target.
- `index` (integer)  -  Zero-based option index alternative.
- `label` (string)  -  Exact option label alternative.
- `ref` (string)  -  Opaque ref from browser_read/browser_find, for example e42.
- `selector` (string)  -  CSS selector alternative to ref.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.
- `value` (string)  -  Option value.

#### browser_navigate

Navigate a centre browser tab: goto/back/reload, list/switch/close tabs, or open a new tab.

Params:
- `action` (enum: goto|back|reload|tabs|switch|new|close)  -  Default goto when url is set.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.
- `url` (string)  -  For goto/new: absolute http(s) URL or CMS-relative path such as /user/…

#### browser_batch

Execute a sequence of WebView actions in ONE tool call (read, find, click, type, select, wait).

Params:
- `epoch` (string)  -  Optional page epoch from browser_read; omit to use the live page.
- `steps` (array, required)  -  Ordered action-specific step objects.
- `tab` (string)  -  Centre browser tab id from the open-tabs list (dock id, e.g.

---

### Service

#### service_page_create

Create a Tanit CMS page from markdown.

Params:
- `category_ids` (array)
- `description` (string)  -  Meta description.
- `is_public` (boolean)
- `markdown` (string)  -  Inline markdown body.
- `owner` (string)
- `parent` (string)
- `path` (string)  -  Local .md file (supports front matter).
- `server_url` (string)  -  Optional Tanit CMS base URL override.
- `slug` (string)  -  URL slug (required for inline markdown unless set in front matter).
- `tags` (array)
- `title` (string)  -  Page title.
- `visible` (boolean)

#### service_page_update

Update an existing Tanit page from markdown.

Params:
- `category_ids` (array)
- `description` (string)
- `is_public` (boolean)
- `markdown` (string)
- `new_slug` (string)
- `owner` (string)
- `page_id` (string)  -  Page UUID.
- `parent` (string)
- `path` (string)
- `server_url` (string)  -  Optional Tanit CMS base URL override.
- `slug` (string)  -  Existing page slug when page_id omitted.
- `tags` (array)
- `title` (string)
- `visible` (boolean)

#### service_page_list

List Tanit CMS pages for the logged-in user.

Params:
- `server_url` (string)  -  Optional Tanit CMS base URL override.
- `user_id` (string)  -  Owner user UUID.

#### service_page_get

Fetch a Tanit CMS page by page_id or owner/slug.

Params:
- `lang` (string)  -  Optional page language query parameter.
- `local_path` (string)  -  Save markdown or full page JSON to this local path.
- `owner` (string)  -  Owner UUID/username for slug lookup.
- `page_id` (string)  -  Page UUID.
- `server_url` (string)  -  Optional Tanit CMS base URL override.
- `slug` (string)  -  Page slug (requires owner unless page_id is owner).

#### service_files_list

List files in the Tanit VFS (remote cloud storage).

Params:
- `mount` (string, default `"home"`)  -  VFS mount name.
- `path` (string)  -  Directory inside mount.
- `server_url` (string)  -  Optional Tanit CMS base URL override.

#### service_files_get

Read a file from Tanit VFS.

Params:
- `local_path` (string)  -  Download to this local path instead of inline content.
- `mount` (string, default `"home"`)  -  VFS mount name.
- `overwrite` (boolean)  -  Re-download when local_path exists.
- `path` (string, required)  -  Remote VFS file path (required).
- `server_url` (string)  -  Optional Tanit CMS base URL override.

#### service_files_upload

Upload a local file to Tanit VFS.

Params:
- `conflict` (enum: if-newer|skip|overwrite)  -  Conflict policy.
- `if_newer` (boolean)  -  Overwrite remote only when local is newer (default).
- `mount` (string, default `"home"`)  -  VFS mount name.
- `overwrite` (boolean)  -  Always replace the remote file.
- `path` (string, required)  -  Local file path (required).
- `remote_dir` (string)  -  Remote directory when remote_path omitted.
- `remote_path` (string)  -  Exact remote path; default: filename under remote_dir.
- `server_url` (string)  -  Optional Tanit CMS base URL override.
- `skip` (boolean)  -  Skip when the remote file already exists.

#### service_search

Full-text search Tanit CMS (pages, posts, pictures, VFS files, places).

Params:
- `formats` (string)  -  Responsive image formats, e.g.
- `limit` (integer)  -  Max results (default 20, server cap 50).
- `public_only` (boolean)  -  Anonymous/global search without bearer (public content only).
- `q` (string, required)  -  Search query (required).
- `server_url` (string)  -  Optional Tanit CMS base URL override.
- `sizes` (string)  -  Responsive image widths, e.g.
- `type` (enum: all|pages|posts|pictures|files|places, default `"all"`)
- `visibility_filter` (enum: invisible|private)  -  Authenticated-only filter for invisible or private content.

---

### Other

#### app_command

Run a Tanit app command on the running UI instance (same verbs as the command palette).

Params:
- `command` (string, required)  -  App command id or alias.
- `extra` (string)  -  Raw pipe payload appended after command| when none of url/path/paths apply.
- `path` (string)  -  For open, edit, browse, replay.
- `paths` (array)  -  Multiple paths for open/edit/browse (semicolon-joined for the app bridge).
- `url` (string)  -  For openurl.

