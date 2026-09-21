# Tanit Chat Agent Tools

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
- `options` (<span data-cli="meta"><span data-cli="type">object</span></span>)
- `pattern` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Glob or path: e.g.

#### file_read

Read a UTF-8 text file.

Params:
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Max lines to return.
- `offset` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  First line to return (1-based).
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  File path: absolute, or relative to the Explorer folder / selection base in-app.

#### file_search

Search file contents (grep) or file names.

Params:
- `-A` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Context lines after each match (rg -A N).
- `-B` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Context lines before each match (rg -B N).
- `-C` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Symmetric context lines (rg -C N, overrides -B / -A).
- `-i` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Case-insensitive (rg -i, default: true).
- `glob` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Filename glob filter (rg -g).
- `head_limit` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Cap on returned hits.
- `indexer` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">own</span> <span data-cli="choice">rg</span></span></span>)  -  rg = bundled ripgrep (recommended for large trees, code search, and any search you'd normally run with rg).
- `inputs` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Files or directories to search (rg PATH …).
- `mode` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">grep</span> <span data-cli="choice">name</span></span></span>)  -  grep = full-text search (default, rg PATTERN); name = filename match (rg --files -g *query*).
- `multiline` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Multiline mode: .
- `offset` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Skip first N hits (pagination).
- `output_mode` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">content</span> <span data-cli="choice">files_with_matches</span></span></span>)  -  content = hits array with path/line/text (default); files_with_matches = deduplicated file paths (rg -l).
- `path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Single file or directory (alias for inputs[0]).
- `pattern` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Alias for 'query' (backward compat).
- `query` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Pattern to search for.
- `regex` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Treat query as a regex (default: false = literal, rg -F).
- `type` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  File type shorthand (rg -t): cpp, c, cs, go, html, java, js, json, md, py, rs, sh, swift, ts, toml, xml, yaml, …
- `whole_word` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Match whole words only (rg -w).

---

### Image

#### image_resize

Resize, re-encode, or convert format for one or more images on disk (libvips, not AI).

Params:
- `options` (<span data-cli="meta"><span data-cli="type">object</span>, <span data-cli="tag" data-variant="required">required</span></span>)
- `output_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional.
- `output_paths` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Optional.
- `paths` (<span data-cli="meta"><span data-cli="type">array</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).

#### image_crop

Crop one or more images on disk to a pixel rectangle (libvips, not AI).

Params:
- `options` (<span data-cli="meta"><span data-cli="type">object</span>, <span data-cli="tag" data-variant="required">required</span></span>)
- `output_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional.
- `output_paths` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Optional.
- `paths` (<span data-cli="meta"><span data-cli="type">array</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).

#### image_transform

AI image edit over one or more images on disk.

Params:
- `options` (<span data-cli="meta"><span data-cli="type">object</span>, <span data-cli="tag" data-variant="required">required</span></span>)
- `output_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional exact output file path for a single input.
- `output_paths` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Optional exact output file paths for multiple inputs; length must match paths.
- `paths` (<span data-cli="meta"><span data-cli="type">array</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).

#### image_create

AI media generation on disk from a **text prompt** (and optional reference images).

Params:
- `options` (<span data-cli="meta"><span data-cli="type">object</span>, <span data-cli="tag" data-variant="required">required</span></span>)
- `out_dir` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional output directory when output_path is omitted (e.g.
- `output_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional exact output file path.

#### create_video

Generate a short video clip.

Params:
- `aspect_ratio` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">16:9</span> <span data-cli="choice">9:16</span></span></span>)  -  Output aspect ratio.
- `conditioningScale` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Provider passthrough (`conditioningScale`).
- `duration` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">4</span> <span data-cli="choice">6</span> <span data-cli="choice">8</span></span></span>)  -  Clip length in seconds.
- `enhancePrompt` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Provider passthrough (`enhancePrompt`).
- `generate_audio` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Request native audio.
- `image` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Legacy alias of start_frame.
- `last_frame` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional last-frame still (host path or data URL).
- `negativePrompt` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Provider passthrough (`negativePrompt`).
- `output` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional output path.
- `paths` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Alias of src (Explorer selection / current folder stills).
- `personGeneration` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Provider passthrough (`personGeneration`).
- `prompt` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Motion / camera / lighting.
- `reference` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Single-path alias of reference_images.
- `reference_images` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Style / brand reference images (not keyframes).
- `references` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Alias of reference_images.
- `resolution` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">720p</span> <span data-cli="choice">1080p</span></span></span>)  -  Output resolution (720p default).
- `src` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Keyframe stills (host paths).
- `start_frame` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional start-frame still (host path or data URL).

#### image_understand

Ask the vision model a question about one or more images on disk.

Params:
- `options` (<span data-cli="meta"><span data-cli="type">object</span></span>)
- `paths` (<span data-cli="meta"><span data-cli="type">array</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Host file paths (absolute, or relative to the current Explorer folder in-app; else process cwd).
- `prompt` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Required.

#### image_from_camera

Capture a still image from a connected webcam / camera and save it to disk.

Workflow:
  1.

Params:
- `action` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">capture</span> <span data-cli="choice">list</span></span>, <span data-cli="default">default <span data-cli="value">&quot;capture&quot;</span></span></span>)  -  "list" - return all capture devices and their available resolutions.
- `device` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Case-insensitive substring of the camera's friendly name (e.g.
- `height` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Preferred capture height in pixels.
- `output_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Destination file path (.jpg, .png, or .bmp).
- `width` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Preferred capture width in pixels.

---

### Utility

#### write_file

Create, overwrite, or append a UTF-8 text file on disk (reports, notes, .md, CSV snippets).

Params:
- `content` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Full file body in UTF-8.
- `expected_version` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional.
- `options` (<span data-cli="meta"><span data-cli="type">object</span></span>)
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Output path: absolute, or relative to the Explorer folder / selection base in-app (e.g.

#### file_str_replace

Surgical edit of an existing UTF-8 file.

Params:
- `end_line` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Optional 1-based window end; must pair with start_line.
- `expected_version` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional.
- `new_string` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Replacement text.
- `old_string` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Exact text to find.
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Existing UTF-8 file to edit.
- `replace_all` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)  -  Replace every match.
- `start_line` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Optional 1-based window start; must pair with end_line.

#### file_delete

Delete one regular file.

Params:
- `expected_version` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional.
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Regular file to delete.

#### speak

Synthesise text to speech and play it on the default speaker.

Params:
- `dst` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional output audio file path.
- `play` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>)  -  Play the audio through the default speaker (default: true).
- `text` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  The text to synthesise and play aloud.
- `text_out` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional path to write the spoken text as a UTF-8 file (transcript/caption).

#### audio_transcribe

Record from the default microphone, transcribe with the chat STT provider, and return the text.

Params:
- `api_key` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional API key override.
- `dst` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional WAV file path for the recorded audio (16 kHz mono s16le).
- `input_device` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional capture device name (case-insensitive substring; use `audio info` to list).
- `max_duration_ms` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>)  -  Hard cap on recording length in milliseconds (default 30 000).
- `prompt` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional short cue to speak before recording starts (one sentence is ideal, e.g.
- `provider` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">tanit</span> <span data-cli="choice">elevenlabs</span> <span data-cli="choice">whisper</span> <span data-cli="choice"></span></span></span>)  -  STT provider override.
- `silence_ms` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="default">default <span data-cli="value">1500</span></span></span>)  -  VAD: auto-stop after this many ms of silence following at least one speech burst (default 1 500).
- `text_out` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional path to write the transcript as a UTF-8 text file.

#### ask_user

Interactively ask the human user a question and wait for their reply.

Params:
- `default`  -  Optional pre-selected answer matching `kind`: `text` → string; `choice` → option label or 0-based index; `multi_choice` → array of labels or indices; `con…
- `kind` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">text</span> <span data-cli="choice">choice</span> <span data-cli="choice">multi_choice</span> <span data-cli="choice">confirm</span></span>, <span data-cli="default">default <span data-cli="value">&quot;text&quot;</span></span></span>)  -  Interaction modality.
- `multiline` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)  -  Allow multi-line input (`kind=text` only).
- `options` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Selectable labels for `choice` / `multi_choice`.
- `placeholder` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Hint text shown inside the text input when empty (e.g.
- `question` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  The prompt rendered to the user.
- `timeout_ms` (<span data-cli="meta"><span data-cli="type">integer</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>)  -  Reserved.

#### run

Execute a shell command and return stdout/stderr.

Params:
- `command` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Shell command (PowerShell on Windows, bash/sh on Unix).
- `shell` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">bash</span> <span data-cli="choice">sh</span> <span data-cli="choice">pwsh</span> <span data-cli="choice">cmd</span></span></span>)  -  Shell to use.
- `timeout_ms` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Wall-clock ms before the process is killed.

#### run_sequence

Execute a deterministic sequence of shell commands and timed waits without spending extra LLM round-trips between steps.

Params:
- `context` (<span data-cli="meta"><span data-cli="type">object</span></span>)  -  Optional initial key-value context passed to the first step.
- `steps` (<span data-cli="meta"><span data-cli="type">array</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Ordered list of steps to execute.

#### info_lookup

Look up Tanit's local catalog: CLI commands, in-app UI verbs (app_command), path tools, MCP tool names, apps, skills.

Params:
- `depth` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Explicit cross-resource traversal depth for cycle/depth guards.
- `detail` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>)  -  When true, include generated help / schemas for exact syntax.
- `kind` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">command</span> <span data-cli="choice">app_command</span> <span data-cli="choice">tool</span> <span data-cli="choice">mcp</span> <span data-cli="choice">app</span> <span data-cli="choice">app_state</span> <span data-cli="choice">skill</span> <span data-cli="choice">resource</span> <span data-cli="choice">all</span></span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span></span>)  -  Surface to search.
- `max_bytes` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Maximum body bytes when materializing a resource.
- `max_results` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Maximum matches to return.
- `query` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Name or keyword, e.g.

---

### Memory

#### memory_read

Read persistent long-term memory and per-item metadata.

Params:
- `task_id` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional: read a scheduled task's memory instead.

#### memory_write

Merge a JSON object into long-term memory.

Params:
- `state` (<span data-cli="meta"><span data-cli="type">object</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Partial object to merge.
- `tags` (<span data-cli="meta"><span data-cli="type">array</span></span>)  -  Optional tags applied to every key in this write.

#### memory_append_event

Append a structured event to the session event log.

Params:
- `event` (<span data-cli="meta"><span data-cli="type">object</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  JSON object.

#### memory_find

Rank session memory facts or items with BM25 plus available dense recall.

Params:
- `includeArtifacts` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)  -  Include artifact items.
- `includeBody` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)  -  Materialize canonical assistant final_text for an exact itemId, or for the top-ranked query result.
- `includePayload` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)  -  Materialize one canonical same-session tool_result envelope.
- `includeSecurity` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)  -  Include security-review items.
- `itemId` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Exact session-item ID (for example turn_ab12).
- `maxBytes` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Maximum UTF-8 bytes of assistant body or tool payload to return.
- `maxResults` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Max items to return.
- `offset` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  UTF-8 byte offset for the body or payload slice.
- `query` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Natural-language ranked query.
- `searchPastChats` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>)  -  Also search all persisted past sessions.
- `sessionId` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional exact owning session ID used to disambiguate itemId.
- `toolCallId` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Exact transcript tool-call ID exposed in turn metadata.

---

### Service

#### service_page_create

Create a Tanit CMS page from markdown.

Params:
- `category_ids` (<span data-cli="meta"><span data-cli="type">array</span></span>)
- `description` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Meta description.
- `is_public` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)
- `markdown` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Inline markdown body.
- `owner` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `parent` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Local .md file (supports front matter).
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  URL slug (required for inline markdown unless set in front matter).
- `tags` (<span data-cli="meta"><span data-cli="type">array</span></span>)
- `title` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Page title.
- `visible` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)

#### service_page_update

Update an existing Tanit page from markdown.

Params:
- `category_ids` (<span data-cli="meta"><span data-cli="type">array</span></span>)
- `description` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `is_public` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)
- `markdown` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `new_slug` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `owner` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `page_id` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Page UUID.
- `parent` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `path` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Existing page slug when page_id omitted.
- `tags` (<span data-cli="meta"><span data-cli="type">array</span></span>)
- `title` (<span data-cli="meta"><span data-cli="type">string</span></span>)
- `visible` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)

#### service_page_list

List Tanit CMS pages for the logged-in user.

Params:
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.
- `user_id` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Owner user UUID.

#### service_page_get

Fetch a Tanit CMS page by page_id or owner/slug.

Params:
- `lang` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional page language query parameter.
- `local_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Save markdown or full page JSON to this local path.
- `owner` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Owner UUID/username for slug lookup.
- `page_id` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Page UUID.
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.
- `slug` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Page slug (requires owner unless page_id is owner).

#### service_files_list

List files in the Tanit VFS (remote cloud storage).

Params:
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span></span>)  -  VFS mount name.
- `path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Directory inside mount.
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.

#### service_files_get

Read a file from Tanit VFS.

Params:
- `local_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Download to this local path instead of inline content.
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span></span>)  -  VFS mount name.
- `overwrite` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Re-download when local_path exists.
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Remote VFS file path (required).
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.

#### service_files_upload

Upload a local file to Tanit VFS.

Params:
- `conflict` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">if-newer</span> <span data-cli="choice">skip</span> <span data-cli="choice">overwrite</span></span></span>)  -  Conflict policy.
- `if_newer` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Overwrite remote only when local is newer (default).
- `mount` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="default">default <span data-cli="value">&quot;home&quot;</span></span></span>)  -  VFS mount name.
- `overwrite` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Always replace the remote file.
- `path` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Local file path (required).
- `remote_dir` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Remote directory when remote_path omitted.
- `remote_path` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Exact remote path; default: filename under remote_dir.
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.
- `skip` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Skip when the remote file already exists.

#### service_search

Full-text search Tanit CMS (pages, posts, pictures, VFS files, places).

Params:
- `formats` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Responsive image formats, e.g.
- `limit` (<span data-cli="meta"><span data-cli="type">integer</span></span>)  -  Max results (default 20, server cap 50).
- `public_only` (<span data-cli="meta"><span data-cli="type">boolean</span></span>)  -  Anonymous/global search without bearer (public content only).
- `q` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="required">required</span></span>)  -  Search query (required).
- `server_url` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Optional Tanit CMS base URL override.
- `sizes` (<span data-cli="meta"><span data-cli="type">string</span></span>)  -  Responsive image widths, e.g.
- `type` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">all</span> <span data-cli="choice">pages</span> <span data-cli="choice">posts</span> <span data-cli="choice">pictures</span> <span data-cli="choice">files</span> <span data-cli="choice">places</span></span>, <span data-cli="default">default <span data-cli="value">&quot;all&quot;</span></span></span>)
- `visibility_filter` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">invisible</span> <span data-cli="choice">private</span></span></span>)  -  Authenticated-only filter for invisible or private content.

