# Tanit Commands

Use this skill when composing Tanit CLI invocations or calling user custom commands.

## Invocation Rules

- Prefer `tanit-cli.exe <command> ...` for shell automation and stdout/stderr output.
- `tanit.exe <command> ...` accepts the same CLI surface, but is the Windows app executable; use the CLI exe when an agent needs command output.
- `tanit.exe --ui-preset main --src photo.jpg` (or settings `cliCommand: ui`) opens the UI with **no subcommand**; see `info ui` for launch flags.
- Built-in commands are top-level tokens, for example `tanit-cli.exe resize --src in.png --dst out.png`.
- Custom commands are also top-level CLI subcommands, but their IDs must be exact. Use `tanit-cli.exe custom.mic-start`, not `mic-start`, `custom mic-start`, or `custom_mic_start`.
- If appending extra args to a custom command, use `--` before args that should not be consumed by the wrapper.

## Built-In CLI Commands

### App Control

#### ui

UI launch (main window). Launch `tanit.exe` with **no subcommand** (full reference: `info ui`).

- `--src` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Seed the UI with file(s) or URL(s). Local paths open in the workbench; `http(s)://…`, `//host/…`, and CMS-relative `/…` open in the centre browser. Uses saved default workbench unless --ui-preset is set. Repeat or separate with `;`.
- `--view-locate` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Viewer locate fragment without '#', used by protocol startup.
- `--ui-preset` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">main</span> <span data-cli="choice">chat</span> <span data-cli="choice">viewer</span></span></span>) - Open the UI: `main`, `chat`, or `viewer` (one-shot; overrides saved default `ui.workbench`).
- `--ui-open` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Open a lightweight UI surface without constructing MainFrame. Usage: --ui-open command-settings [--ui-command-id ID | ID] | --ui-open assistant. Reserved surfaces: fileviewer, webapp.
- `--ui-command-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Stable commands.json id for --ui-open command-settings.
- `--ui-web-app` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Web application id for --ui-open webapp.
- `--ui-owner-hwnd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional decimal owner HWND for lightweight UI placement.
- `--ui-context-cwd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Command-variable cwd for a lightweight command-settings launch.
- `--ui-context-hwnd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Command-variable CURRENT_HWND for a lightweight command-settings launch.
- `--ui-request-token` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Opaque callback token for an internally launched lightweight UI surface.
- `--mic` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">start</span> <span data-cli="choice">off</span></span></span>) - Chat launch hint: `start` enables microphone when the composer is ready.
- `--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Pre-fill the chat composer with this text on launch.
- `--type` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">completion</span> <span data-cli="choice">responses</span> <span data-cli="choice">realtime</span></span></span>) - LLM API mode: completion, responses, or realtime.
- `--system-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the system prompt. Use `null` to clear, `@path` to read from a file.
- `--no-tools` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable agent tools; send a text-only LLM turn.
- `--no-skills` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip skill discovery and injection.
- `--app` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Force a specific viewer app (reserved). Default: auto-detect from file type.
- `--edit` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Open files in the code editor instead of the default viewer.
- `--send` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Auto-send the pre-filled prompt when the composer is ready.
- `--consent-ui` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat consent surface for this UI launch: empty (WebView cards) | auto-allow (alias: yolo) | auto-deny. auto-allow grants every Ask with a session grant — use for computer-use harness.
- `--attach-realtime` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Move an active background realtime voice session into the chat panel.
- `--viewer-dev` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Dev mode: navigate the viewer WebView2 to the rspack dev server (http://localhost:5180).
Use --viewer-dev-url=URL to override the default address.
Equivalent to setting PM_VIEWER_DEV_URL before launch; zero production impact.
- `--viewer-dev-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the rspack dev server URL used by --viewer-dev (default: http://localhost:5180).
- `--xblox-dev` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Dev mode: navigate xblox WebView2 to the rspack dev server (http://127.0.0.1:5173).
Use --xblox-dev-url=URL to override the default address.
Equivalent to setting PM_XBLOX_DEV_URL before launch; zero production impact.
- `--xblox-dev-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the rspack dev server URL used by --xblox-dev (default: http://127.0.0.1:5173).
- `--ui-reset` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Reset window layout to built-in defaults for this launch.
- `--layout` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Apply an exported layout JSON for this launch without persisting it.
- `--size` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override main frame outer size for this launch: WxH in pixels, e.g. 800x600. Applied during layout restore so there is no second resize pass.
- `--show-panel` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">filetree</span> <span data-cli="choice">search</span> <span data-cli="choice">queue</span> <span data-cli="choice">log</span> <span data-cli="choice">console</span> <span data-cli="choice">settings</span> <span data-cli="choice">chat</span> <span data-cli="choice">findresults</span> <span data-cli="choice">dupresults</span> <span data-cli="choice">nodes</span></span></span>) - Force panels visible for this launch (comma-separated ids; not persisted). Ids: filetree, search, queue, log, console, settings, chat, findresults, dupresults, nodes. Aliases: explorer→filetree.
- `--hide-panel` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">filetree</span> <span data-cli="choice">search</span> <span data-cli="choice">queue</span> <span data-cli="choice">log</span> <span data-cli="choice">console</span> <span data-cli="choice">settings</span> <span data-cli="choice">chat</span> <span data-cli="choice">findresults</span> <span data-cli="choice">dupresults</span> <span data-cli="choice">nodes</span></span></span>) - Force panels hidden for this launch (comma-separated ids; not persisted). Same ids as --show-panel. On conflict with --show-panel, hide wins.
- `--show-components` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">ribbon</span> <span data-cli="choice">statusbar</span></span></span>) - Force chrome components visible for this launch (comma-separated ids; not persisted). Ids: ribbon, statusbar. Aliases: status-bar, status_bar.
- `--hide-components` (<span data-cli="meta"><span data-cli="tag" data-variant="flags">flags</span> <span data-cli="choices" data-variant="flags"><span data-cli="choice">ribbon</span> <span data-cli="choice">statusbar</span></span></span>) - Force chrome components hidden for this launch (comma-separated ids; not persisted). Same ids as --show-components. On conflict with --show-components, hide wins.
- `--console` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Attach a console window for stdout/stderr (default: off).
- `--pause-on-exit` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wait for Enter before the process exits.
- `--splash,--no-splash` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show the startup splash screen (default: off).
- `--settings` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Read app settings from this file for this process only. Use `settings import` to persist.

### Image

#### resize

Resize / transform an image (libvips, Sharp-like options)

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input path, glob (*, ?, **), or http(s):// URL
- `output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output file/dir, or omit when there is exactly one input; writes under cwd (sanitized name)
- `--src` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input (repeat for multiple); use with --dst; Explorer passes several files
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Same as positional output; directory if multiple inputs
- `--max-width` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Target / max width (0 = no limit)
- `--max-height` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Target / max height (0 = no limit)
- `--format` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output format (default: from extension)
- `--fit` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">inside</span></span></span>) - inside|cover|contain|fill|outside (see Sharp resize.fit)
- `--position` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">centre</span></span></span>) - For cover: centre|attention|entropy|...
- `--kernel` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">lanczos3</span></span></span>) - nearest|cubic|mitchell|lanczos2|lanczos3
- `-q,--quality` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">85</span></span></span>) - JPEG/WebP/AVIF quality 1-100
- `--png-compression` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">6</span></span></span>) - PNG DEFLATE 0-9
- `--background` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Letterbox colour #rrggbb (contain)
- `--rotate` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Rotate 0|90|180|270 after EXIF autorotate
- `--flip` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Vertical flip
- `--flop` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Horizontal flop
- `--no-autorotate` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable EXIF orientation
- `--no-strip` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Keep metadata on output
- `--allow-enlargement` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Allow upscaling (inside/contain/outside)
- `--no-cache` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable output cache (default: cache on)
- `--cache-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Cache root (default: <cwd>/cache/images)
- `--url-timeout` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">5</span></span></span>) - HTTP(S) fetch timeout (seconds, 0 = libcurl default)
- `--url-max-redirects` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Max redirects when fetching URL inputs

**Example**

```sh
tanit-cli resize
```

**Full example**

```sh
tanit-cli resize input 'foo' output 'foo' --src '{}' --dst 'foo' --max-width 0 --max-height 0 --format 'foo' --fit 'inside' --position 'centre' --kernel 'lanczos3' -q 85 --png-compression 6 --background '#ffffff' --rotate 0 --flip --flop --no-autorotate --no-strip --allow-enlargement --no-cache --cache-dir 'foo' --url-timeout 5 --url-max-redirects 20
```

#### compress

Compress images: MozJPEG re-encode or optimised PNG (+ libimagequant / zopfli)

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input file / glob
- `output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output file path (relative or absolute)
- `--src` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input(s); pair with --dst
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output file path for one --src; output directory when multiple --src (relative paths resolve from cwd; parent dirs are created)
- `--compressor` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mozjpeg</span> <span data-cli="choice">png</span></span></span>) - mozjpeg | png  (default: inferred from output extension; falls back to mozjpeg)
- `-q,--quality` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">85</span></span></span>) - MozJPEG quality 1–100
- `--no-progressive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable progressive (interlaced) JPEG
- `--optimize-scans` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - MozJPEG: split DCT coefficient spectrum into separate scans
- `--trellis-quant` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - MozJPEG: trellis quantisation (slower, smaller)
- `--level` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">9</span></span></span>) - PNG DEFLATE level 1–9
- `--quantize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - PNG: libimagequant palette reduction — lossy, up to ~60 % smaller (requires FEATURE_PNG_COMPRESSOR)
- `--colors` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">256</span></span></span>) - Palette size 8–256
- `--quant-quality` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">85</span></span></span>) - Quantise quality 60–100
- `--zopfli` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - PNG: ultra-compress DEFLATE with zopfli — lossless, slow (requires FEATURE_PNG_ZOPFLI)
- `--zopfli-iter` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">15</span></span></span>) - Zopfli iteration count
- `--no-strip` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Keep metadata on output
- `--suffix` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Stem suffix for auto-generated output names (default: _compressed when format unchanged)
- `--job-ui` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List-style job window (pause / cancel) — Windows

**Example**

```sh
tanit-cli compress
```

**Full example**

```sh
tanit-cli compress input 'foo' output 'foo' --src '{}' --dst 'foo' --compressor 'mozjpeg' -q 85 --no-progressive --optimize-scans --trellis-quant --level 9 --quantize --colors 256 --quant-quality 85 --zopfli --zopfli-iter 15 --no-strip --suffix 'foo' --job-ui
```

#### transform

AI image editing (Gemini / Google)

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input image, or use --src for a batch (Explorer multi-select uses --src)
- `--src` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input path (repeat for multiple files; one job queue / one window with --job-ui on Windows)
- `output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path (omit = auto from input + prompt)
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Editing prompt (required if --preset-id is not set, unless preset supplies prompt)
- `--preset-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Preset id from settings: explorer_presets (op=transform), or chat_web quick action as chat-<id>
- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id; loads image_provider/image_model; explicit --provider/--model override
- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - AI provider (google, replicate, pixlwiz, openrouter, openai); omit = from preset / app Chat image_provider (aborts if unset)
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model id; omit = from preset / app Chat image_model (aborts if unset)
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (optional; default from app provider settings)
- `--aspect-ratio` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output aspect ratio (1:1,16:9,4:3,...)
- `--image-size` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output size (512,1K,2K,4K)
- `-r,--reference` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Reference image path (logo / brand sheet / style swatch). Repeatable: -r logo.png -r palette.jpg
- `--job-ui` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List-style job window (pause / cancel) — Windows

**Example**

```sh
tanit-cli transform
```

**Full example**

```sh
tanit-cli transform input 'foo' --src '{}' output 'foo' -p 'foo' --preset-id 'foo' --preset 'foo' --provider 'foo' --model 'foo' --api-key 'foo' --aspect-ratio 'foo' --image-size 'foo' -r '{}' --job-ui
```

#### create

AI text-to-image (Gemini / Google, no input file)

Options:

- `output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path (omit = create_<slug>.png in cwd)
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Generation prompt
- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - AI provider (google, replicate, pixlwiz, openrouter, openai); omit = from preset / app Chat image_provider (aborts if unset)
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model id; omit = from preset / app Chat image_model (aborts if unset)
- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id; loads image_provider/image_model; explicit --provider/--model override
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (optional; default from app provider settings)
- `--aspect-ratio` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output aspect ratio (1:1,16:9,4:3,...)
- `--image-size` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output size (512,1K,2K,4K)
- `-r,--reference` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Reference image path (style / brand). Repeat as needed.

**Example**

```sh
tanit-cli create -p <value>
```

**Full example**

```sh
tanit-cli create output 'foo' -p 'foo' --provider 'foo' --model 'foo' --preset 'foo' --api-key 'foo' --aspect-ratio 'foo' --image-size 'foo' -r '{}'
```

#### understand

Vision OCR / markdown extraction (image_understand; not sidecar meta)

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Input image path
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Instruction; empty = verbatim OCR as structured Markdown (tables, lists, headings)
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Write markdown answer here (default: same folder, stem.md beside input; omit with --stdout)
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print markdown answer on stdout only; do not write --dst (overrides default stem.md)
- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - AI provider; omit = from preset / app Chat image_recognition_provider (aborts if unset)
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model id; omit = from preset / app image_recognition_model (ocr_model fallback)
- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id; loads image_recognition/ocr provider+model; explicit --provider/--model override
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (optional; default from app provider settings)
- `--no-resize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do NOT pre-resize in memory before sending to the model
- `--resize-width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">1024</span></span></span>) - In-memory resize longest edge (default 1024 for OCR)

**Example**

```sh
tanit-cli understand input <value>
```

**Full example**

```sh
tanit-cli understand input 'foo' -p 'foo' --dst 'foo' --stdout --provider 'foo' --model 'foo' --preset 'foo' --api-key 'foo' --no-resize --resize-width 1024
```

#### pdf

PDF tools: inspect documents, rasterize pages, and extract Markdown.

**Example**

```sh
tanit-cli pdf info path {}
```

**Full example**

```sh
tanit-cli pdf info path '{}' --password 'foo'
```

#### pdf info

Print page count and page sizes.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - PDF file path(s).
- `--password` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Document password, if encrypted.

**Example**

```sh
tanit-cli pdf info path {}
```

**Full example**

```sh
tanit-cli pdf info path '{}' --password 'foo'
```

##### Examples

Hand-picked patterns beyond the auto-generated flags above.

**Page count and sizes** (human-readable)

```sh
tanit-cli pdf info report.pdf
```

**JSON for scripting** (page index, 1-based page number, width/height in points)

```sh
tanit-cli pdf info report.pdf --json
```

**Multiple documents in one call**

```sh
tanit-cli pdf info chapter1.pdf chapter2.pdf --json
```

**Encrypted PDF**

```sh
tanit-cli pdf info secure.pdf --password "secret"
```

**Quick sanity check** (same file used in CI smoke tests)

```sh
tanit-cli pdf info tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf --json
```

---

#### pdf render

Rasterize pages to image files (all, ranges, or specific pages).

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - PDF file path.
- `--pages` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">all</span></span></span>) - Pages to render (1-based): all (default), 3, 1-5, 1,3,7, 2-.
- `--dpi` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">300</span></span></span>) - Render DPI (default 300).
- `--rotation` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">0</span> <span data-cli="choice">90</span> <span data-cli="choice">180</span> <span data-cli="choice">270</span></span></span>) - Clockwise rotation in degrees.
- `-o,--output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output image path (single-page selection only; otherwise inferred as stem_N.ext).
- `--output-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output directory (default: PDF folder when multiple pages are rendered).
- `--format` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">png</span> <span data-cli="choice">jpeg</span> <span data-cli="choice">jpg</span> <span data-cli="choice">webp</span></span></span>) - Output format: auto (default), png, jpeg, webp. auto => JPEG for grayscale pages, PNG otherwise.
- `--quality` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 100]</span>, <span data-cli="default">default <span data-cli="value">95</span></span></span>) - JPEG/WebP quality (1-100).
- `--password` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Document password, if encrypted.
- `--no-annot` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip annotation rendering.

**Example**

```sh
tanit-cli pdf render path {}
```

**Full example**

```sh
tanit-cli pdf render path '{}' --pages 'all' --dpi '300' --rotation 0 -o 'foo' --output-dir 'foo' --format 'auto' --quality 95 --password 'foo' --no-annot
```

##### Examples

Hand-picked rasterization patterns beyond the auto-generated flags above.

Uses **PDFium** in-process + **libvips** encode. Defaults: **300 DPI**, **quality 95**, **`--format auto`** (grayscale page → JPEG, color → PNG). Output naming: `report.pdf` → `report_1.png` / `report_1.jpg` beside the PDF unless `--output-dir` is set.

**All pages** (writes `report_1.ext`, `report_2.ext`, … next to the PDF)

```sh
tanit-cli pdf render report.pdf
```

**Page range or pick list** (1-based)

```sh
tanit-cli pdf render report.pdf --pages 1-5
tanit-cli pdf render report.pdf --pages 1,3,7
tanit-cli pdf render report.pdf --pages 2-
```

**Dedicated output folder** (recommended for large PDFs)

```sh
tanit-cli pdf render report.pdf --output-dir ./pages
```

**Single page with explicit path** (`-o` only when exactly one page is selected)

```sh
tanit-cli pdf render report.pdf --pages 3 -o page3.jpg
```

**Force PNG everywhere**

```sh
tanit-cli pdf render report.pdf --pages 1-3 --format png
```

**Web-optimized JPEG**

```sh
tanit-cli pdf render report.pdf --pages all --format jpeg --quality 85 --output-dir ./jpg
```

**Landscape page rotated upright**

```sh
tanit-cli pdf render scan.pdf --pages 1 --rotation 90 -o scan_upright.png
```

**Skip annotations** (form widgets, comment overlays)

```sh
tanit-cli pdf render report.pdf --pages 1 --no-annot
```

**JSON output** (paths + page list for pipelines)

```sh
tanit-cli pdf render report.pdf --pages 1-2 --output-dir ./out --json
```

**Smoke-test fixture** (57-page OWASP doc; first two pages → PNG @ 300 DPI)

```sh
tanit-cli pdf render tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf \
  --pages 1-2 \
  --output-dir tests/pdf/_smoke_pdf_render \
  --json
```

**Notes**

| Topic | Behavior |
|---|---|
| `--format auto` | Samples raster; JPEG if page looks grayscale, else PNG |
| Multi-page + no `--output-dir` | Images land in the PDF’s parent folder |
| `--dpi` | 72 = 100% zoom; 300 ≈ print quality |
| Runtime | Requires `pdfium.dll` beside the executable on Windows |

---

#### pdf md

Extract document text to Markdown via modular PDFium pipeline.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - PDF file path.
- `--pages` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">all</span></span></span>) - Pages to convert (1-based): all (default), 3, 1-5, 1,3,7, 2-.
- `-o,--output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output Markdown or JSON path (default: input stem + .md).
- `--output-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output bundle directory: page_N.md files plus figures/page_N_fig_M.png embedded images.
- `--dpi` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">300</span></span></span>) - Figure render DPI when using --output-dir (default 300).
- `--pipe` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">default</span></span></span>) - Pipeline preset: default, text-only, with-struct, with-ocr, with-vlm.
- `--password` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Document password, if encrypted.
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Write Markdown/JSON to stdout.

**Example**

```sh
tanit-cli pdf md path {}
```

**Full example**

```sh
tanit-cli pdf md path '{}' --pages 'all' -o 'foo' --output-dir 'foo' --dpi '300' --pipe 'default' --password 'foo' --stdout
```

##### Examples

Hand-picked patterns beyond the auto-generated flags above.

**Convert full document to Markdown** (writes `report.md` beside the PDF)

```sh
tanit-cli pdf md report.pdf
```

**Specific pages only**

```sh
tanit-cli pdf md report.pdf --pages 1-5
```

**Write Markdown to stdout**

```sh
tanit-cli pdf md report.pdf --stdout
```

**Dump intermediate representation (IR) as JSON**

```sh
tanit-cli pdf md report.pdf --json --stdout
```

**Per-page bundle** (Markdown pages + embedded figure PNGs)

```sh
tanit-cli pdf md manual.pdf --pages 1-10 --output-dir tests/pdf/ANCEL_BM700_Pro_User_Manual
```

Creates `page_N.md` files and `figures/page_N_fig_M.png` (embedded images + vector region crops — not full-page renders).

**Custom output path**

```sh
tanit-cli pdf md report.pdf -o output/notes.md
```

**Pipeline preset** (default runs full text + figure path; struct/OCR/VLM stages stubbed)

```sh
tanit-cli pdf md report.pdf --pipe default
```

**Encrypted PDF**

```sh
tanit-cli pdf md secure.pdf --password "secret"
```

**Smoke test file**

```sh
tanit-cli pdf md tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf --pages 1 --stdout
```

### Search

#### [find](https://tanit.polymech.info/user/3bb4cfbf-318b-44d3-a9d3-35680e738421/pages/find_more)

Find images by name/folder, semantic LLM prompt, or junk (dark/blur/flat/blown/tiny).

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Input file(s), folder(s) or glob(s); repeatable
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Search query (required for name / --llm; unused with --junk)
- `--junk` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Find likely junk/accident images from pixels (no LLM, no sidecar)
- `--junk-kinds` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Junk kinds: dark,bright,blur,flat,tiny (comma list or all)
- `--min-score` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.7</span></span></span>) - Junk: minimum 0..1 score to match
- `--action` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">none</span></span></span>) - After matches: none | delete | recyclebin
- `--junk-opt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Junk knob key=value (repeatable). Keys: edge_energy_blur_hi, edge_energy_p90_blur_hi, edge_energy_p99_blur_hi, edge_orient_blur_lo, edge_orient_blur_span, edge_density_content_lo, entropy_content_lo, dark_fraction_lo, bright_fraction_lo, analyze_max_side, tiny_min_side, edge_threshold, …
- `--edge-energy-blur` (<span data-cli="meta"><span data-cli="type">FLOAT</span></span>) - Junk blur (OOF path): mean |dx|+|dy| at/above this → that term is 0 (default 12). Motion smear uses --edge-orient-blur; screenshots use --edge-energy-p99-blur.
- `--edge-energy-p90-blur` (<span data-cli="meta"><span data-cli="type">FLOAT</span></span>) - Junk blur (OOF path): p90 |dx|+|dy| at/above this → that term is 0 (default 40). Keeps sharp subjects on empty walls from matching.
- `--edge-energy-p99-blur` (<span data-cli="meta"><span data-cli="type">FLOAT</span></span>) - Junk blur: p99 |dx|+|dy| at/above this → blur 0 (default 88). Keeps screenshots and sharp islands (hand / specular) from matching.
- `--edge-orient-blur` (<span data-cli="meta"><span data-cli="type">FLOAT</span></span>) - Junk blur (motion path): orientation peak at/below this → that term is 0 (default 0.20). Motion smear concentrates; a sharp subject with mixed edges does not.
- `--edge-density-lo` (<span data-cli="meta"><span data-cli="type">FLOAT</span></span>) - Junk: edgeDensity at/above this is “has edges” (default 0.06)
- `--analyze-max-side` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Junk thumbnail longest side (default 128)
- `--tiny-min-side` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Junk tiny: min(width,height) at/above this → tiny 0 (default 128)
- `--edge-threshold` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Junk: |dx|+|dy| above this counts as an edge pixel (default 24)
- `--llm` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Query mode: match prompt vs filename + .md/.json/EXIF (or generate them); default = LLM judge per file, or --local-text
- `--local-text` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - With --llm: no find:judge Gemini; case-insensitive substring/word match on text only
- `--case-sensitive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Name mode: case-sensitive match
- `--no-folders` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Name mode: don't match parent folder names
- `--no-recursive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Don't recurse into directory inputs
- `--bypass-cache` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - LLM: ignore existing .md/.json/EXIF, force re-generate
- `--no-generate` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - LLM: skip images without cached meta (don't call meta_extract)
- `--no-md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - LLM: don't read sidecar .md
- `--no-json` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - LLM: don't read sidecar .json
- `--no-exif` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - LLM: don't read libvips EXIF tags
- `--max` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max results (0 = unlimited)
- `--dry-run` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Resolve + scan; no LLM writes and no --action deletes
- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - AI provider for --llm meta/judge; omit = app Chat image_recognition_provider (aborts if unset when --llm)
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model for --llm; omit = app image_recognition_model (aborts if unset when --llm)
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (optional; default from app provider settings)
- `--judge-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the LLM judge prompt
- `--meta-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the cataloguer prompt used when generating cache
- `--no-resize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Generation: skip in-memory resize before sending to model
- `--resize-width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Generation: resize-width for the model input
- `-r,--reference` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - LLM: reference image(s), examples of what you're looking for; sent as multimodal parts in every judge call. Repeatable: -r logo.png -r palette.jpg

**Example**

```sh
tanit-cli find input {}
```

**Full example**

```sh
tanit-cli find input '{}' -p 'foo' --junk --junk-kinds 'foo' --min-score '0.7' --action 'none' --junk-opt '{}' --edge-energy-blur '12' --edge-energy-p90-blur '40' --edge-energy-p99-blur '88' --edge-orient-blur '0.2' --edge-density-lo '0.06' --analyze-max-side 128 --tiny-min-side 128 --edge-threshold 24 --llm --local-text --case-sensitive --no-folders --no-recursive --bypass-cache --no-generate --no-md --no-json --no-exif --max 0 --dry-run --provider 'foo' --model 'foo' --api-key 'foo' --judge-prompt 'foo' --meta-prompt 'foo' --no-resize --resize-width 512 -r '{}'
```

##### Examples

Hand-picked search patterns. Name and `--junk` are offline. `--llm` needs a recognition provider (not in Tanit Viewer).

**By filename / folder** (default; prompt is a substring)

```sh
tanit-cli find "D:/pictures/test" -p DSC032
```

**Junk / accident shots** (dark, blown, blur, flat, tiny). No prompt.

```sh
tanit-cli find "D:/pictures/test" --junk --json
```

**Lower the junk bar** (see everything the decoder scored)

```sh
tanit-cli find "D:/pictures/test" --junk --min-score 0 --json
```

**Miss-focus photos** (mean edge energy ~12–14 on mushy 24MP thumbs). Sharp subjects on a white wall are **not** blur — they keep a high `edgeEnergyP90`.

```sh
tanit-cli find "D:/pictures/test" --junk --junk-kinds blur --min-score 0.2 --edge-energy-blur 24
```

**Quoted glob, no recurse**

```sh
tanit-cli find "D:/pictures/test/*.{jpg,jpeg,png}" --junk --no-recursive
```

**Recycle Bin after a dry-run** (Windows)

```sh
tanit-cli find "D:/pictures/test" --junk --action recyclebin --dry-run
tanit-cli find "D:/pictures/test" --junk --action recyclebin
```

**Local sidecar / EXIF text** (no judge model)

```sh
tanit-cli find "D:/pictures/test" --llm --local-text -p "product shot"
```

[Read more](https://tanit.polymech.info/user/3bb4cfbf-318b-44d3-a9d3-35680e738421/pages/find_more)

### Subcommands

#### cp

Copy files or folders through the VFS queue (local, ssh://, ftp://, vfs://).

Options:

- `paths` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Sources and destination folder. Last path is dest unless --dst is set.
- `-s,--src` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Source path, glob, or URI (repeatable). ${CWD} ${KNOWNFOLDER:…} ${ENV:…} ${SRC_NAME} …
- `-d,--dst,--dest` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination folder path or URI. Same ${…} variables as --src.
- `--conflict` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Conflict strategy: error (default), overwrite, skip, rename, if-newer.
- `--overwrite` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Overwrite existing dest files.
- `--skip` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip existing dest files.
- `--rename` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Rename dest when it already exists.
- `--if-newer` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Overwrite dest only when the source is newer.
- `--include` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Keep sources matching this glob (repeatable).
- `--exclude` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Drop sources matching this glob (repeatable).
- `--dry-run` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Expand sources and dest; do not copy.

**Example**

```sh
tanit-cli cp
```

**Full example**

```sh
tanit-cli cp paths '{}' -s '{}' -d 'foo' --conflict 'foo' --overwrite --skip --rename --if-newer --include '{}' --exclude '{}' --dry-run
```

### Search

#### search

Unified search. Subcommands: search (files), index, detail, action.

**Example**

```sh
tanit-cli search search
```

**Full example**

```sh
tanit-cli search search input '{}' --log-level 'info' --mode '{}' --content '{}' --backend '{}' --sort 'auto' -q 'foo' --type 'foo' --indexer 'own' --grep --names-only --regex --case-sensitive --whole-word --no-recursive --include-hidden --follow-symlinks --no-skip-binary -C 0 -B 0 -A 0 --multiline --output-mode 'content' --head-limit 0 --offset 0 --max 0 --max-per-file 0 --max-file-size 0 --include '{}' --exclude '{}' --exclude-dir '{}' --dry-run --stream --md --markdown 'auto' --markdown-color 'auto' --index-policy 'same-dir' --index '{}' --model 'foo' --threads 4 --gpu-layers 0 --reindex --no-index-create --extract 'auto' --adapter 'foo' --fingerprint 'off' --chunk-size 500 --chunk-overlap 100 --meta-prompt 'foo' --resize-width 768 --no-resize --include-detail 'auto' --detail-max 0
```

#### search search

Search files with the unified search facade (exact first; semantic later).

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - File(s), folder(s), or glob(s)
- `--log-level` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">info</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">warning</span> <span data-cli="choice">error</span> <span data-cli="choice">err</span> <span data-cli="choice">critical</span> <span data-cli="choice">off</span> <span data-cli="choice">none</span></span></span>) - Log level for this search command: trace, debug, info, warn, error, critical, off
- `--mode` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">{}</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">name</span> <span data-cli="choice">grep</span> <span data-cli="choice">semantic</span> <span data-cli="choice">metadata</span> <span data-cli="choice">fingerprint</span></span></span>) - auto | name | grep | semantic | metadata | fingerprint (repeatable or comma-separated)
- `--content` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">{}</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">any</span> <span data-cli="choice">text</span> <span data-cli="choice">code</span> <span data-cli="choice">image</span> <span data-cli="choice">document</span> <span data-cli="choice">office</span> <span data-cli="choice">pdf</span> <span data-cli="choice">catalog</span></span></span>) - any | text | code | image | document | office | pdf | catalog (repeatable or comma-separated)
- `--backend` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">{}</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">any</span> <span data-cli="choice">exact</span> <span data-cli="choice">image-meta</span> <span data-cli="choice">vector</span> <span data-cli="choice">fingerprint</span> <span data-cli="choice">catalog</span></span></span>) - auto | exact | image-meta | vector | fingerprint | catalog (repeatable or comma-separated)
- `--sort` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">none</span> <span data-cli="choice">score</span> <span data-cli="choice">path</span> <span data-cli="choice">relevance</span></span></span>) - Result order for merged/fan-out search: auto | none | score | path
- `-q,--query` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Search pattern (filename substring, regex, semantic query, or grep needle)
- `--type` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - any | image, or rg-style type shorthand: cpp, ts, py, md, ...
- `--indexer` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">own</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">own</span> <span data-cli="choice">os</span> <span data-cli="choice">rg</span></span></span>) - own (default) | os | rg - exact-search indexer
- `--grep` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Alias for --mode grep
- `--names-only` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - With grep: report only the filepath, not individual match lines
- `--regex` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Treat --query as ECMAScript regex
- `--case-sensitive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Case-sensitive match
- `--whole-word` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Require word-boundary match
- `--no-recursive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not recurse into directory inputs
- `--include-hidden` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include dot-files and dot-directories
- `--follow-symlinks` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Follow symbolic links
- `--no-skip-binary` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Scan binary files
- `-C,--context` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Symmetric context lines
- `-B,--context-before` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Context lines before
- `-A,--context-after` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Context lines after
- `--multiline` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enable multiline regex
- `--output-mode` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">content</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">content</span> <span data-cli="choice">files_with_matches</span> <span data-cli="choice">count</span></span></span>) - content (default) | files_with_matches | count
- `--head-limit` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Cap output to first N entries
- `--offset` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Skip first N entries
- `--max` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max total results
- `--max-per-file` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max grep matches per file
- `--max-file-size` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Skip grep files larger than N bytes
- `--include` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Only scan filename glob; repeatable
- `--exclude` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Skip filename glob; repeatable
- `--exclude-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Directory names to prune; repeatable
- `--dry-run` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Resolve candidates and print counts; no matching
- `--stream` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Stream NDJSON events (start/task/hit/done) incrementally; cancelable, web-friendly
- `--md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print Markdown result tables/details
- `--markdown` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">plain</span> <span data-cli="choice">render</span></span></span>) - With --md: auto (render on TTY), plain (raw Markdown), or render (always run terminal markdown)
- `--markdown-color` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">never</span> <span data-cli="choice">always</span></span></span>) - With rendered --md: auto, never, or always
- `--index-policy` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">same-dir</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">same-dir</span> <span data-cli="choice">specific-dir</span> <span data-cli="choice">disabled</span></span></span>) - same-dir | specific-dir | disabled
- `--index` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Vector store/index dir(s); repeatable or glob. Multiple stores => search merges across them
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Embedding model hint/path
- `--threads` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - Embedding CPU threads
- `--gpu-layers` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Embedding GPU layers: 0 CPU, -1 all GPU
- `--reindex` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Force re-ingest before searching
- `--no-index-create` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Fail if an index is needed but missing
- `--extract` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">auto</span></span></span>) - auto | text | office | pdf
- `--adapter` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Source adapter hint, e.g. image-sidecar | ocr-local | llm-meta | office-officecli
- `--fingerprint` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">off</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">cheap</span></span></span>) - off | cheap
- `--chunk-size` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Semantic ingest chunk size
- `--chunk-overlap` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">100</span></span></span>) - Semantic ingest chunk overlap
- `--meta-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - For --adapter llm-meta: image_understand prompt; empty = built-in search metadata prompt
- `--resize-width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">768</span></span></span>) - For --adapter llm-meta: pre-resize longest edge before external image understanding
- `--no-resize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - For --adapter llm-meta: disable image_understand pre-resize
- `--include-detail` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">row</span> <span data-cli="choice">page</span> <span data-cli="choice">section</span> <span data-cli="choice">object</span> <span data-cli="choice">metadata</span></span></span>) - Expand search hits with adapter detail: auto | row | page | section | object | metadata
- `--detail-max` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - With --include-detail: expand at most N hits (0 = all returned hits)

**Example**

```sh
tanit-cli search search
```

**Full example**

```sh
tanit-cli search search input '{}' --log-level 'info' --mode '{}' --content '{}' --backend '{}' --sort 'auto' -q 'foo' --type 'foo' --indexer 'own' --grep --names-only --regex --case-sensitive --whole-word --no-recursive --include-hidden --follow-symlinks --no-skip-binary -C 0 -B 0 -A 0 --multiline --output-mode 'content' --head-limit 0 --offset 0 --max 0 --max-per-file 0 --max-file-size 0 --include '{}' --exclude '{}' --exclude-dir '{}' --dry-run --stream --md --markdown 'auto' --markdown-color 'auto' --index-policy 'same-dir' --index '{}' --model 'foo' --threads 4 --gpu-layers 0 --reindex --no-index-create --extract 'auto' --adapter 'foo' --fingerprint 'off' --chunk-size 500 --chunk-overlap 100 --meta-prompt 'foo' --resize-width 768 --no-resize --include-detail 'auto' --detail-max 0
```

---

#### search index

Index files for semantic search (cron-friendly).

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - File(s), folder(s), or glob(s)
- `--log-level` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">warning</span> <span data-cli="choice">error</span> <span data-cli="choice">err</span> <span data-cli="choice">critical</span> <span data-cli="choice">off</span> <span data-cli="choice">none</span></span></span>) - Log level for this search command: trace, debug, info, warn, error, critical, off
- `--mode` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">name</span> <span data-cli="choice">grep</span> <span data-cli="choice">semantic</span> <span data-cli="choice">metadata</span> <span data-cli="choice">fingerprint</span></span></span>) - auto | name | grep | semantic | metadata | fingerprint (repeatable or comma-separated)
- `--content` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">any</span> <span data-cli="choice">text</span> <span data-cli="choice">code</span> <span data-cli="choice">image</span> <span data-cli="choice">document</span> <span data-cli="choice">office</span> <span data-cli="choice">pdf</span> <span data-cli="choice">catalog</span></span></span>) - any | text | code | image | document | office | pdf | catalog (repeatable or comma-separated)
- `--backend` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">any</span> <span data-cli="choice">exact</span> <span data-cli="choice">image-meta</span> <span data-cli="choice">vector</span> <span data-cli="choice">fingerprint</span> <span data-cli="choice">catalog</span></span></span>) - auto | exact | image-meta | vector | fingerprint | catalog (repeatable or comma-separated)
- `--sort` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">none</span> <span data-cli="choice">score</span> <span data-cli="choice">path</span> <span data-cli="choice">relevance</span></span></span>) - Result order for merged/fan-out search: auto | none | score | path
- `--index-policy` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">same-dir</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">same-dir</span> <span data-cli="choice">specific-dir</span> <span data-cli="choice">disabled</span></span></span>) - same-dir | specific-dir | disabled
- `--index` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Vector store/index dir(s); repeatable or glob. Multiple stores => search merges across them
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Embedding model hint/path
- `--threads` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - Embedding CPU threads
- `--gpu-layers` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Embedding GPU layers: 0 CPU, -1 all GPU
- `--reindex` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Force re-ingest before searching
- `--no-index-create` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Fail if an index is needed but missing
- `--extract` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">auto</span></span></span>) - auto | text | office | pdf
- `--adapter` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Source adapter hint, e.g. image-sidecar | ocr-local | llm-meta | office-officecli
- `--fingerprint` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">off</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">cheap</span></span></span>) - off | cheap
- `--chunk-size` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Semantic ingest chunk size
- `--chunk-overlap` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">100</span></span></span>) - Semantic ingest chunk overlap
- `--meta-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - For --adapter llm-meta: image_understand prompt; empty = built-in search metadata prompt
- `--resize-width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">768</span></span></span>) - For --adapter llm-meta: pre-resize longest edge before external image understanding
- `--no-resize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - For --adapter llm-meta: disable image_understand pre-resize
- `--md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print Markdown result tables
- `--markdown` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">plain</span> <span data-cli="choice">render</span></span></span>) - With --md: auto (render on TTY), plain (raw Markdown), or render
- `--markdown-color` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">never</span> <span data-cli="choice">always</span></span></span>) - With rendered --md: auto, never, or always

**Example**

```sh
tanit-cli search index
```

**Full example**

```sh
tanit-cli search index input '{}' --log-level 'info' --mode '{}' --content '{}' --backend '{}' --sort 'auto' --index-policy 'same-dir' --index '{}' --model 'foo' --threads 4 --gpu-layers 0 --reindex --no-index-create --extract 'auto' --adapter 'foo' --fingerprint 'off' --chunk-size 500 --chunk-overlap 100 --meta-prompt 'foo' --resize-width 768 --no-resize --md --markdown 'auto' --markdown-color 'auto'
```

---

#### search detail

Expand a search hit through the owning source adapter.

Options:

- `--log-level` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">warning</span> <span data-cli="choice">error</span> <span data-cli="choice">err</span> <span data-cli="choice">critical</span> <span data-cli="choice">off</span> <span data-cli="choice">none</span></span></span>) - Log level for this search command: trace, debug, info, warn, error, critical, off
- `--adapter` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owning source adapter ID, e.g. office-officecli
- `--path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Source file path
- `--selector` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Adapter-owned selector, e.g. officecli query selector
- `--office-path` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Office native/XML path, e.g. /Sheet1/row[6]
- `--include-detail` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">row</span> <span data-cli="choice">page</span> <span data-cli="choice">section</span> <span data-cli="choice">object</span> <span data-cli="choice">metadata</span></span></span>) - auto | row | page | section | object | metadata
- `--meta-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - For --adapter llm-meta: image_understand prompt; empty = built-in search metadata prompt
- `--resize-width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">768</span></span></span>) - For --adapter llm-meta: pre-resize longest edge before external image understanding
- `--no-resize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - For --adapter llm-meta: disable image_understand pre-resize
- `--context-before` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Nearby units before
- `--context-after` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Nearby units after
- `--md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print Markdown detail
- `--markdown` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">plain</span> <span data-cli="choice">render</span></span></span>) - With --md: auto (render on TTY), plain (raw Markdown), or render
- `--markdown-color` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">never</span> <span data-cli="choice">always</span></span></span>) - With rendered --md: auto, never, or always

**Example**

```sh
tanit-cli search detail --path <path>
```

**Full example**

```sh
tanit-cli search detail --log-level 'info' --adapter 'foo' --path 'foo' --selector 'foo' --office-path 'foo' --include-detail 'auto' --meta-prompt 'foo' --resize-width 768 --no-resize --context-before 0 --context-after 0 --md --markdown 'auto' --markdown-color 'auto'
```

---

#### search action

Run a search-scoped action such as replace (implementation pending).

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - File(s), folder(s), or glob(s)
- `--log-level` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">warning</span> <span data-cli="choice">error</span> <span data-cli="choice">err</span> <span data-cli="choice">critical</span> <span data-cli="choice">off</span> <span data-cli="choice">none</span></span></span>) - Log level for this search command: trace, debug, info, warn, error, critical, off
- `--mode` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">name</span> <span data-cli="choice">grep</span> <span data-cli="choice">semantic</span> <span data-cli="choice">metadata</span> <span data-cli="choice">fingerprint</span></span></span>) - auto | name | grep | semantic | metadata | fingerprint (repeatable or comma-separated)
- `--content` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">any</span> <span data-cli="choice">text</span> <span data-cli="choice">code</span> <span data-cli="choice">image</span> <span data-cli="choice">document</span> <span data-cli="choice">office</span> <span data-cli="choice">pdf</span> <span data-cli="choice">catalog</span></span></span>) - any | text | code | image | document | office | pdf | catalog (repeatable or comma-separated)
- `--backend` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">any</span> <span data-cli="choice">exact</span> <span data-cli="choice">image-meta</span> <span data-cli="choice">vector</span> <span data-cli="choice">fingerprint</span> <span data-cli="choice">catalog</span></span></span>) - auto | exact | image-meta | vector | fingerprint | catalog (repeatable or comma-separated)
- `--sort` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">none</span> <span data-cli="choice">score</span> <span data-cli="choice">path</span> <span data-cli="choice">relevance</span></span></span>) - Result order for merged/fan-out search: auto | none | score | path
- `-q,--query` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Search pattern (filename substring, regex, semantic query, or grep needle)
- `--type` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - any | image, or rg-style type shorthand: cpp, ts, py, md, ...
- `--indexer` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">own</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">own</span> <span data-cli="choice">os</span> <span data-cli="choice">rg</span></span></span>) - own (default) | os | rg - exact-search indexer
- `--grep` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Alias for --mode grep
- `--names-only` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - With grep: report only the filepath, not individual match lines
- `--regex` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Treat --query as ECMAScript regex
- `--case-sensitive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Case-sensitive match
- `--whole-word` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Require word-boundary match
- `--no-recursive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not recurse into directory inputs
- `--include-hidden` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include dot-files and dot-directories
- `--follow-symlinks` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Follow symbolic links
- `--no-skip-binary` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Scan binary files
- `-C,--context` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Symmetric context lines
- `-B,--context-before` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Context lines before
- `-A,--context-after` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Context lines after
- `--multiline` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enable multiline regex
- `--output-mode` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">content</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">content</span> <span data-cli="choice">files_with_matches</span> <span data-cli="choice">count</span></span></span>) - content (default) | files_with_matches | count
- `--head-limit` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Cap output to first N entries
- `--offset` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Skip first N entries
- `--max` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max total results
- `--max-per-file` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max grep matches per file
- `--max-file-size` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Skip grep files larger than N bytes
- `--include` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Only scan filename glob; repeatable
- `--exclude` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Skip filename glob; repeatable
- `--exclude-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Directory names to prune; repeatable
- `--dry-run` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Resolve candidates and print counts; no matching
- `--stream` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Stream NDJSON events (start/task/hit/done) incrementally; cancelable, web-friendly
- `--md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print Markdown result tables/details
- `--markdown` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">plain</span> <span data-cli="choice">render</span></span></span>) - With --md: auto (render on TTY), plain (raw Markdown), or render (always run terminal markdown)
- `--markdown-color` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">never</span> <span data-cli="choice">always</span></span></span>) - With rendered --md: auto, never, or always
- `--action` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">replace</span></span></span>) - replace
- `--replacement` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replacement text or prompt
- `--reference-image` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Reference image for image actions; repeatable

**Example**

```sh
tanit-cli search action
```

**Full example**

```sh
tanit-cli search action input '{}' --log-level 'info' --mode '{}' --content '{}' --backend '{}' --sort 'auto' -q 'foo' --type 'foo' --indexer 'own' --grep --names-only --regex --case-sensitive --whole-word --no-recursive --include-hidden --follow-symlinks --no-skip-binary -C 0 -B 0 -A 0 --multiline --output-mode 'content' --head-limit 0 --offset 0 --max 0 --max-per-file 0 --max-file-size 0 --include '{}' --exclude '{}' --exclude-dir '{}' --dry-run --stream --md --markdown 'auto' --markdown-color 'auto' --action 'replace' --replacement 'foo' --reference-image '{}'
```

### Setup

#### settings

Import / export the app settings profile (UTF-8 JSON), manage .cloud_storage_key, or sync encrypted .pmbackup via cloud VFS. Use `settings path` to locate settings.json.

**Example**

```sh
tanit-cli settings path
```

#### settings path

Print the canonical on-disk settings.json path for this OS (no file I/O) and exit.

**Example**

```sh
tanit-cli settings path
```

---

#### settings import

Replace the live profile store with the given UTF-8 JSON file (full document replace). Windows: accepts PME1 or JSON (same as in-app). Other OS: JSON object only. All OSes: --archive restores a profile ZIP; --pmbackup restores an encrypted .pmbackup.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Source file (relative paths are from cwd)
- `--archive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Read a profile ZIP exported by `settings export --archive`. Skips web* folders and never imports .settings-key.dat.
- `--pmbackup` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Read an encrypted .pmbackup file (requires config_dir/.cloud_storage_key from the source machine).
- `--cloud-storage-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Key file for encrypted backup (32-byte secret; default: config_dir/.cloud_storage_key).
- `--passphrase` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Passphrase for pmbackup v2 (instead of the key file).
- `--no-include-commands` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit commands.json from the encrypted backup.
- `--no-include-mcp` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit MCP config from the encrypted backup.
- `--no-include-prompts` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit agent prompts from the encrypted backup.

**Example**

```sh
tanit-cli settings import path <path>
```

**Full example**

```sh
tanit-cli settings import path 'foo' --archive --pmbackup --cloud-storage-key 'foo' --passphrase 'foo' --no-include-commands --no-include-mcp --no-include-prompts
```

---

#### settings export

Write the current profile settings to a UTF-8 JSON file (default: settings.json in cwd). Windows: `--encrypted` writes PME1 instead of JSON. All OSes: `--archive` writes a profile ZIP; `--pmbackup` writes an encrypted portable backup (uses config_dir/.cloud_storage_key).

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">settings.json</span></span></span>) - Output file (relative paths are from cwd)
- `--encrypted` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Write PME1 binary (DPAPI-bound key on this profile) instead of UTF-8 JSON.
- `--archive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Write a ZIP of the app profile. Skips web* WebView folders; Windows settings.json is portable JSON; .settings-key.dat is omitted.
- `--pmbackup` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Write an encrypted portable .pmbackup (auto-creates config_dir/.cloud_storage_key when missing).
- `--cloud-storage-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Key file for encrypted backup (32-byte secret; default: config_dir/.cloud_storage_key).
- `--passphrase` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Passphrase for pmbackup v2 (instead of the key file).
- `--no-include-commands` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit commands.json from the encrypted backup.
- `--no-include-mcp` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit MCP config from the encrypted backup.
- `--no-include-prompts` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit agent prompts from the encrypted backup.

**Example**

```sh
tanit-cli settings export
```

**Full example**

```sh
tanit-cli settings export path 'settings.json' --encrypted --archive --pmbackup --cloud-storage-key 'foo' --passphrase 'foo' --no-include-commands --no-include-mcp --no-include-prompts
```

---

#### settings key

Manage the portable cloud storage key (.cloud_storage_key) used by --pmbackup and cloud sync.

**Example**

```sh
tanit-cli settings key path
```

#### settings key path

Print the profile .cloud_storage_key path (no file I/O) and exit.

**Example**

```sh
tanit-cli settings key path
```

---

#### settings key export

Copy the profile key to a file for another machine (creates the key if missing).

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination path (default: .cloud_storage_key in cwd).

**Example**

```sh
tanit-cli settings key export
```

**Full example**

```sh
tanit-cli settings key export path 'foo'
```

---

#### settings key import

Install a 32-byte key file as this profile's .cloud_storage_key.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Source key file

**Example**

```sh
tanit-cli settings key import path <path>
```

**Full example**

```sh
tanit-cli settings key import path 'foo'
```

---

#### settings key generate

Replace the profile key with a fresh random 32-byte key (old keyfile backups will not decrypt).

**Example**

```sh
tanit-cli settings key generate
```

---

#### settings cloud

Encrypted settings sync via VFS home mount (same .pmbackup flow as the Settings UI). Requires SERVER_URL / login token. Distinct from `service settings` (plaintext JSON).

**Example**

```sh
tanit-cli settings cloud upload
```

**Full example**

```sh
tanit-cli settings cloud upload --remote-dir 'settings' --server-url 'foo' --cloud-storage-key 'foo' --passphrase 'foo' --no-include-commands --no-include-mcp --no-include-prompts
```

#### settings cloud upload

Export an encrypted .pmbackup and upload it to home/<remote-dir>/yyyy-mm-dd-hh.pmbackup.

Options:

- `--remote-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">settings</span></span></span>) - Remote VFS directory under the home mount (default: settings).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL / VITE_SERVER_IMAGE_API_URL / CLIENT_URL).
- `--cloud-storage-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Key file for encrypted backup (32-byte secret; default: config_dir/.cloud_storage_key).
- `--passphrase` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Passphrase for pmbackup v2 (instead of the key file).
- `--no-include-commands` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit commands.json from the encrypted backup.
- `--no-include-mcp` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit MCP config from the encrypted backup.
- `--no-include-prompts` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit agent prompts from the encrypted backup.

**Example**

```sh
tanit-cli settings cloud upload
```

**Full example**

```sh
tanit-cli settings cloud upload --remote-dir 'settings' --server-url 'foo' --cloud-storage-key 'foo' --passphrase 'foo' --no-include-commands --no-include-mcp --no-include-prompts
```

---

#### settings cloud download

Download the newest .pmbackup under home/<remote-dir> via /api/vfs/get and restore the profile.

Options:

- `--remote-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Remote VFS directory under the home mount (default: settings).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL / VITE_SERVER_IMAGE_API_URL / CLIENT_URL).
- `--cloud-storage-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Key file for encrypted backup (32-byte secret; default: config_dir/.cloud_storage_key).
- `--passphrase` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Passphrase for pmbackup v2 (instead of the key file).
- `--no-include-commands` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit commands.json from the encrypted backup.
- `--no-include-mcp` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit MCP config from the encrypted backup.
- `--no-include-prompts` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Omit agent prompts from the encrypted backup.

**Example**

```sh
tanit-cli settings cloud download
```

**Full example**

```sh
tanit-cli settings cloud download --remote-dir 'settings' --server-url 'foo' --cloud-storage-key 'foo' --passphrase 'foo' --no-include-commands --no-include-mcp --no-include-prompts
```

### LLM & Agents

#### provider

Provider utilities (model catalog, etc.)

**Example**

```sh
tanit-cli provider models list
```

**Full example**

```sh
tanit-cli provider models list --provider 'replicate' --api-key 'foo' --base-url 'foo' --limit 0 --cursor 'foo' --sort-by 'foo' --sort-direction 'foo'
```

#### provider models

Provider model catalog operations

**Example**

```sh
tanit-cli provider models list
```

**Full example**

```sh
tanit-cli provider models list --provider 'replicate' --api-key 'foo' --base-url 'foo' --limit 0 --cursor 'foo' --sort-by 'foo' --sort-direction 'foo'
```

#### provider models list

List provider models and return full JSON payload

Options:

- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">replicate</span></span></span>) - Provider id (replicate|openrouter)
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (Replicate: required. OpenRouter: optional for public /v1/models; from app if set for openrouter)
- `--base-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replicate: catalog URL (default official collection). OpenRouter: API root (default https://openrouter.ai/api/v1)
- `--limit` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Replicate /v1/models: optional page size (ignored for openrouter)
- `--cursor` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replicate: optional pagination cursor (ignored for openrouter)
- `--sort-by` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replicate: optional sort field (ignored for openrouter)
- `--sort-direction` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replicate: optional sort direction (asc|desc) (ignored for openrouter)

**Example**

```sh
tanit-cli provider models list
```

**Full example**

```sh
tanit-cli provider models list --provider 'replicate' --api-key 'foo' --base-url 'foo' --limit 0 --cursor 'foo' --sort-by 'foo' --sort-direction 'foo'
```

#### llm

LLM: tools-list / tools-call / info (saved chat + image defaults) / agent (path tools)

**Example**

```sh
tanit-cli llm info
```

**Full example**

```sh
tanit-cli llm info --compress-md --preset 'foo' --markdown 'render' --color 'auto' --no-mcp-probe --mcp-probe
```

#### llm info

Show Chat router/model and image provider/model from app settings, effective defaults for path tools, and which CLI flags override per command (find/transform/meta/duplicates, …)

Options:

- `--compress-md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print raw compact Markdown for router/planner context: tools, skills, XBlox blocks. Ignored with --json.
- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id. If omitted, uses preset `Default`, or the lone saved preset.
- `--markdown` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">render</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">plain</span> <span data-cli="choice">render</span></span></span>) - Human stdout: render (default — always pretty-print), auto (only on TTY), or plain (raw UTF-8). Ignored with --json.
- `--color` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">never</span> <span data-cli="choice">always</span></span></span>) - When markdown rendering is used: auto (color on TTY unless NO_COLOR/TERM=dumb), never, or always.
- `--no-mcp-probe` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not run live MCP profile probes (stdio/HTTP handshakes). JSON/text output still lists settings; the `mcp` object notes that the probe was skipped.
- `--mcp-probe` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Run live MCP profile probes (stdio/HTTP handshakes).

**Example**

```sh
tanit-cli llm info
```

**Full example**

```sh
tanit-cli llm info --compress-md --preset 'foo' --markdown 'render' --color 'auto' --no-mcp-probe --mcp-probe
```

#### llm info providers

List enabled LLM providers from the provider registry and app settings.

Options:

- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include providers disabled by FEATURE_PROVIDER_* or Group Policy (for GPO generation).

**Example**

```sh
tanit-cli llm info providers
```

**Full example**

```sh
tanit-cli llm info providers --all
```

---

#### llm info models

List models for a given provider. local / llama: text/planner GGUF models. vlm: local VLM models (multimodal / vision / OCR) with mmproj paths. whisper: local whisper.cpp ggml models. pixlwiz / openrouter / replicate: fetches live catalog (disk-cached; replicate 3 d, others 24 h). Other names: shows configured default_model from app settings.

Options:

- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Provider to query: local | llama | vlm | whisper | pixlwiz | openrouter | replicate | <name from `llm info providers`>
- `--no-cache` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Bypass the disk cache and force a live HTTP fetch (pixlwiz / openrouter).

**Example**

```sh
tanit-cli llm info models --provider <id>
```

**Full example**

```sh
tanit-cli llm info models --provider 'foo' --no-cache
```

---

#### llm info tools

List all built-in path-mode agent tools (name + description). These are the tools available to the chat agent in every session.

Options:

- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show the full built-in registry, ignoring user/GPO filtering (for GPO template generation).

**Example**

```sh
tanit-cli llm info tools
```

**Full example**

```sh
tanit-cli llm info tools --all
```

---

#### llm info skills

List discovered agent skills from roaming and workspace roots with availability/active state.

**Example**

```sh
tanit-cli llm info skills
```

---

#### llm info policy

Dump the full GPO policy catalog (keys, categories, types, defaults, ADMX strings). Single source consumed by scripts/generate-admx.mjs.

**Example**

```sh
tanit-cli llm info policy
```

---

#### llm tools-list

Print the JSON-Schema tool catalog (one entry per tanit op)

Options:

- `--path` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List path-mode chat agent tools (default catalog for llm agent). Omit for in-buffer REST/MCP tools.

**Example**

```sh
tanit-cli llm tools-list
```

**Full example**

```sh
tanit-cli llm tools-list --path
```

---

#### llm tools-call

Invoke a tool by name with a JSON arguments envelope

Options:

- `--name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Tool name (image_resize|image_compress|image_transform|image_create|image_meta|image_find|file_read)
- `--args` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Path to JSON arguments file ('-' or '@-' for stdin; omit = empty {}).
- `--image-file` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Convenience: read this file, base64-encode it, and inject as arguments.image.b64.

**Example**

```sh
tanit-cli llm tools-call --name <value>
```

**Full example**

```sh
tanit-cli llm tools-call --name 'foo' --args 'foo' --image-file 'foo'
```

---

#### [llm agent](https://tanit.polymech.info/user/3bb4cfbf-318b-44d3-a9d3-35680e738421/pages/llm_agent_more)

Run a single chat-agent turn: LLM picks tools (image_resize / compress / transform / meta / find), runs them on the supplied paths, and writes outputs to disk. Use --no-tools for a plain one-shot text reply (no path tools). Use --disable-tools=a,b to omit specific path tools from the catalog. Provider is router-aware (OpenAI-compatible client).

Options:

**Input**
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - User prompt (required unless piped via stdin or --mic is used, e.g. 'compress these as MozJPEG quality 70'). Supports ${VAR} variable substitution (CWD, SRC_FILE, YYYY, …) and file references: `@path`, `file:path`, or an absolute path to a UTF-8 text file.
- `--logging-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Directory for pm-image.log and per-run agent JSON artifacts. Relative paths are resolved from cwd. Same as the global --logging-dir.
- `--include` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - One or more file paths to put in the agent's selection context. Repeatable. When omitted, --cwd is used as the folder context.
- `--embed` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - One or more text file paths to inline into the user prompt under 'Embedded Content'. Uses the same text read policy as file_read. Repeatable; works even with --system-prompt null.

**Prompts**
- `--system-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the full system prompt. Use `null`/`none` to send no system message, `@path` or `file:path` to read a UTF-8 file (relative or absolute), or literal text.
- `--planner-prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the planner system prompt. Same grammar as --system-prompt (literal text, `@path`, `file:path`, or `null`/`none`). The loaded text is run through `${...}` template substitution; `${builtin}` resolves to the baked-in planner instructions so you can extend rather than fully replace. A `planner-prompt.md` file in the exe folder or the config dir is used automatically when no CLI override is given.

**Provider**
- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id. Loads saved router/model/max-iter/planner defaults; explicit CLI flags override it.
- `--runner` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Agent backend: native (default) | claude-code | codex. Also reads PM_LLM_AGENT_RUNNER when unset.
- `--save-preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Save the resolved chat/tool/MCP/skill settings as a preset name. With --preset, clones/updates from that base; without --prompt, saves and exits.
- `--router` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - LLM router (llama|openrouter|openai|deepseek|gemini|ollama|fireworks|xai|huggingface). Default: from Chat Provider Settings in app.
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model id (router-specific, e.g. openai/gpt-4o-mini). Default: from Chat Provider Settings in app.
- `--ai-consent-review` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Run the SecurityAgent as an advisory reviewer before CLI consent prompts. The review is shown on stderr; human approval is still required.
- `--ai-consent-router` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Router for the advisory SecurityAgent reviewer. Implies --ai-consent-review. Default: Chat security router, then planner router, then text router.
- `--ai-consent-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model/script for the advisory SecurityAgent reviewer. Implies --ai-consent-review. Default: Chat security model, then planner model, then text model.
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (optional; default from app chat / API Keys in settings.json)
- `--base-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the router's default base URL (OpenAI-compatible endpoints). Default: from app API Providers settings.
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - HTTP timeout per LLM round (ms). Default: from Chat Provider Settings (or 60000).

**Security**
- `--consent-ui` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Consent surface for security-gated tools: cli | win32 | owner | auto-deny | auto-allow | auto | preset. cli = stdio prompt (stderr/stdin); win32 = native modal dialog; auto-deny = deny every Ask (headless); auto-allow (alias: yolo) = allow every Ask with a session grant; owner = route to owning surface (not yet wired -> auto). When omitted: chat preset `consent_ui` (Yolo) if set, else auto (cli when stdin is attached, else win32 on an interactive desktop, else auto-deny).
- `--consent-owner` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target descriptor (ipc id) for --consent-ui owner routing. Reserved; owner delegation is not wired yet.

**Tool Overrides**
- `--ocr-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the OCR tool provider for this run (e.g. llama, onnx, replicate). Wins over Chat → OCR settings and the active preset.
- `--ocr-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the OCR tool model id for this run (e.g. paddleocr-vl-1-5). Wins over Chat → OCR settings and the active preset.
- `--recognition-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the image recognition (image_understand) provider for this run.
- `--recognition-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the image recognition model id for this run.
- `--image-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the image creation (image_create) provider for this run.
- `--image-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the image creation model id for this run.
- `--video-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the video creation (create_video) provider for this run.
- `--video-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the video creation model id for this run.

**Agent**
- `--max-iter` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Maximum tool-call iterations before forcing a final response. Default: from Chat Provider Settings (or 8).
- `--no-tools` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not register path tools (no list_images, image_resize, image_compress, …) — one LLM text turn only
- `--no-mcp` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Suppress MCP-backed tools for this turn, overriding the chat preset (path/run tools still register).
- `--no-skills` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip agent skill discovery/injection for this turn, overriding the chat preset.
- `--skills` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Force roaming/workspace skill discovery for this turn, overriding disabled chat/global skill policy.
- `--no-planner` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Force the planner pre-pass off for this turn, overriding --planner and any chat-preset default.
- `--planner` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Run a compact planner pass first to select a budgeted subset of tool schemas, then execute the normal agent.
- `--planner-budget` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - Maximum tool schemas the planner may pre-expand before falling back to the full catalog.
- `--no-parallel-tools` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable concurrent tool dispatch and fall back to serial execution. Parallel dispatch (P6) is on by default; use this flag to opt out.
- `--parallel-tools` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Dispatch all tool calls in a single LLM response concurrently (std::async). On by default — this flag is accepted for compatibility but is a no-op unless --no-parallel-tools was previously applied.
- `--disable-tools` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma- or semicolon-separated enabled tools to omit. Built-ins: list_images, file_glob, file_read, file_search, image_resize, image_crop, image_transform, image_create, create_video, image_understand, image_from_camera, ocr_text, write_file, file_str_replace, file_delete, speak, audio_transcribe, ask_user, memory_read, memory_write, memory_append_event, memory_find, run, run_sequence, info_lookup, service_page_create, service_page_update, service_page_list, service_page_get, service_files_list, service_files_get, service_files_upload, service_search, app_command. MCP tools use mcp_<server>__<tool>; run `llm agent --help` for a live list. Ineffective with --no-tools
- `--enable-tools` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma- or semicolon-separated tool names to allow (whitelist). Only these tools will be offered to the model; all others are hidden. Overrides --disable-tools. Built-ins: list_images, file_glob, file_read, file_search, image_resize, image_crop, image_transform, image_create, create_video, image_understand, image_from_camera, ocr_text, write_file, file_str_replace, file_delete, speak, audio_transcribe, ask_user, schedule_at, schedule_in, schedule_every, schedule_cancel, schedule_list, memory_read, memory_write, memory_append_event, memory_find, run, run_sequence, info_lookup, service_page_create, service_page_update, service_page_list, service_page_get, service_files_list, service_files_get, service_files_upload, service_search, app_command. Ineffective with --no-tools.

**Session**
- `--multi-turn` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enable session memory across turns (default: on).
- `--single-turn` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable session memory and run as one-shot only.
- `--session-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional session id used when --multi-turn is enabled (allows continuity across CLI invocations).
- `--load-snapshot` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - P12: Load a named snapshot before the agent run. Merges the snapshot's memory_state / recent_events into the session context so the agent starts with that knowledge baseline. Name is sanitized to a filename; file lives under <config>/snapshots/<name>.json.
- `--save-snapshot` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - P12: Save the current session state to a named snapshot after the agent run. Requires --multi-turn (needs an active session). The snapshot captures memory_state + recent_events so the workflow can be restored later via --load-snapshot.
- `--memory-features` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override structured-memory feature mask. Accepts a decimal/0xHEX literal or comma-separated flag names with optional +/- deltas. Special tokens: all, default, none. Examples: --memory-features=0x7FF | --memory-features=CaptureWriteArtifacts,InjectItems | --memory-features=default,-ReplayTranscript. Overrides PM_LLM_STRUCTURED_MEMORY_FEATURES. See pm::llm::StructuredMemoryFeature.
- `--no-replay` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Clear the ReplayTranscript bit from the structured-memory mask (skip raw chat-history injection; rely on session items/rules only).

**Scheduler**
- `--scheduler` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - After the first turn completes, start the agent scheduler in this process so schedule_every / schedule_in / schedule_at tasks created by the agent actually fire. Blocks until Ctrl+C, --scheduler-timeout expires, or --scheduler-exit-when-idle and no tasks remain.
- `--scheduler-timeout` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - When --scheduler is set, auto-exit after N seconds (0 = run until Ctrl+C / idle).
- `--scheduler-exit-when-idle` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - When --scheduler is set, exit cleanly once every scheduled task is disabled (one-shots done, every-tasks hit max_runs / cancelled).

**Output**
- `--hud` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show the overlay HUD over the clock. Stop cancels the run. Default off.
- `--hud-mode` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">taskbar</span> <span data-cli="choice">overlay</span> <span data-cli="choice">both</span></span></span>) - HUD mode: off, taskbar, overlay, or both. Empty + --hud = overlay. taskbar/overlay/both enable the HUD even without --hud.
- `--dry-run` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Resolve provider + tools + selection; print context as Markdown to stdout. With --planner, runs only the planner LLM pass to preview selected schemas.
- `--log` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">agent.json</span></span></span>) - Write a JSON run log (provider, per-event tool calls with full envelopes, transcript) to this file (truncates). Default: <logging-dir>/agent.json.
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Write the agent response to this file path (truncates on each turn). Without --json: writes result.final_text (raw markdown, no ANSI). With --json: writes the full result JSON object. Supports ${VAR} variable substitution (CWD, SRC_FILE, YYYY, MM, DD, …) resolved against --cwd / --include paths. Relative paths are resolved from --cwd. Parent directories are created automatically.
- `--streaming` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">on</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">on</span> <span data-cli="choice">off</span></span></span>) - Streaming mode: on (default), auto (catalog-gated), off. Implemented now for --type responses; completion remains non-streaming.
- `--markdown` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">plain</span> <span data-cli="choice">render</span></span></span>) - Human stdout: auto (render when stdout is a TTY), plain (raw model UTF-8), or render (always run the terminal markdown pass). Ignored with --json.
- `--color` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">never</span> <span data-cli="choice">always</span></span></span>) - When markdown rendering is used: auto (color on TTY unless NO_COLOR/TERM=dumb), never, or always.

**API Mode**
- `--type` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">responses</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">completion</span> <span data-cli="choice">responses</span> <span data-cli="choice">realtime</span></span></span>) - LLM API type: completion (POST /chat/completions) or responses (POST /responses — OpenAI Responses API; supported by OpenAI, OpenRouter, and LiteLLM proxy), or realtime (experimental WebSocket /realtime PoC; text-only; best with router=openai). Default: responses.
- `--realtime` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Start a live speech-to-speech voice session over the WebSocket /v1/realtime endpoint (mic + speaker; the full agent is exposed as the run_pm_agent tool). No --prompt is required; if given it seeds the conversation. Runs until Ctrl+C or `--realtime-stop`. Best with router=openai / a realtime model. (With --save-preset, falls back to the text PoC `--type realtime` path.)
- `--realtime-stop` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Signal a running `--realtime` live voice session (this or another process) to stop cooperatively, then exit. Uses the cross-process session file.
- `--realtime-status` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print whether a live `--realtime` voice session is running (add --json for machine-readable output), then exit.
- `--realtime-idle-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">120000</span></span></span>) - Self-stop a live `--realtime` session after this many ms of genuine idle time — no speech, no reply, and no delegated run_pm_agent in flight (a running agent task always keeps the session alive). Stops headless sessions from lingering. 0 = never auto-stop. Default: 120000 (2 min).

**Server**
- `--serve` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Run an OpenAI-compatible HTTP daemon (GET /health, GET /v1/models, POST /v1/chat/completions). Turns inherit the same preset/tools/MCP/skills pipeline as a normal `llm agent` run. Default consent is auto-deny. See docs/llm/llm-server.md.
- `--host` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">127.0.0.1</span></span></span>) - Bind host for --serve (default 127.0.0.1).
- `--port` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">8090</span></span></span>) - Bind port for --serve (default 8090).
- `--concurrency` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">2</span></span></span>) - Max concurrent agent turns for --serve (default 2).
- `--http-workers` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - httplib worker threads for --serve (default: max(32, concurrency*2); raise for stress with many waiting clients).
- `--serve-api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Require Authorization: Bearer <key> on /v1/* when set. Empty = open (dev). Overrides TANIT_SERVE_API_KEY when passed.
- `--host-tool-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Register an HTTP IAgentToolProvider as id=http://127.0.0.1:port/path (repeatable). Loopback HTTP only. Also TANIT_HOST_TOOL_PROVIDER.

**Voice**
- `--mic` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Use the microphone as prompt input (continuous STT → LLM → TTS loop). Replaces --prompt for user input; --prompt may still be given as context. Requires --stt-api-key or ELEVENLABS_API_KEY. Press Ctrl+C to stop.
- `--stt-api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ElevenLabs API key for real-time STT (and TTS when --voice-id is set). Falls back to ELEVENLABS_API_KEY environment variable.
- `--voice-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ElevenLabs voice ID to speak LLM responses aloud (empty = text-only). Browse voices at elevenlabs.io/app/voice-library.
- `--no-tts` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Mic mode: disable TTS playback entirely (keep listening continuously after each response).
- `--tts-model-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">eleven_v3</span></span></span>) - ElevenLabs TTS model used with --voice-id (default: eleven_v3).
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Microphone device name (case-insensitive substring; use `audio info` to list). Omit to use the system default input device.
- `--input-source` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">mic</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Input source for the realtime session: mic (default), desktop (system loopback), or mix (mic + desktop summed). Use `audio info` to list available devices.
- `--desktop` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Loopback device name substring for --input-source desktop or mix (case-insensitive; empty = default render device). Sets --input-source desktop when --input-source is not explicitly provided.
- `--mic-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Mic input level multiplier (linear; 0 = mute, 1 = unity, 2 = double). Applied before mixing when --input-source mix is set.
- `--desktop-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Desktop/loopback input level multiplier (linear; 0 = mute, 1 = unity). Applied before mixing when --input-source desktop or mix is set.
- `--silence-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">1500</span></span></span>) - Silence duration in ms after which speech is auto-committed to the LLM (0 = disabled; default 1500).
- `--stt-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the STT provider for this run (whisper for local built-in, elevenlabs, …). Default: from Chat → Voice & Audio settings. Use 'whisper' to select the built-in local whisper.cpp (no API key needed).
- `--stt-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the STT model id / alias for this run (e.g. base.en, small.en for whisper; scribe_v2_realtime for ElevenLabs). Default: from settings.
- `--tts-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the TTS provider for this run (e.g. elevenlabs). Default: from settings.
- `--tts-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the TTS model id for this run (e.g. eleven_flash_v2_5). Also applies as --tts-model-id when --voice-id is used.
- `--tts-voice-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the TTS voice id for this run. Alias for --voice-id; wins if both are set.

**Example**

```sh
tanit-cli llm agent
```

**Full example**

```sh
tanit-cli llm agent -p 'foo' --logging-dir 'foo' --system-prompt 'foo' --planner-prompt 'foo' --include '{}' --embed '{}' --preset 'foo' --runner 'foo' --save-preset 'foo' --router 'foo' --model 'foo' --ai-consent-review --ai-consent-router 'foo' --ai-consent-model 'foo' --consent-ui 'foo' --consent-owner 'foo' --ocr-provider 'foo' --ocr-model 'foo' --recognition-provider 'foo' --recognition-model 'foo' --image-provider 'foo' --image-model 'foo' --video-provider 'foo' --video-model 'foo' --api-key 'foo' --base-url 'foo' --timeout-ms 0 --max-iter 0 --no-tools --no-mcp --no-skills --skills --no-planner --planner --planner-budget 8 --no-parallel-tools --parallel-tools --multi-turn --single-turn --session-id 'foo' --load-snapshot 'foo' --save-snapshot 'foo' --memory-features 'foo' --no-replay --scheduler --scheduler-timeout 0 --scheduler-exit-when-idle --disable-tools 'foo' --enable-tools 'foo' --hud --hud-mode 'off' --dry-run --log 'agent.json' --dst 'foo' --type 'responses' --realtime --realtime-stop --realtime-status --serve --host '127.0.0.1' --port 8090 --concurrency 2 --http-workers 0 --serve-api-key 'foo' --host-tool-provider '{}' --realtime-idle-ms 120000 --streaming 'on' --markdown 'auto' --color 'auto' --mic --stt-api-key 'foo' --voice-id 'foo' --no-tts --tts-model-id 'eleven_v3' --input 'foo' --input-source 'mic' --desktop 'foo' --mic-gain '1' --desktop-gain '1' --silence-ms 1500 --stt-provider 'foo' --stt-model 'foo' --tts-provider 'foo' --tts-model 'foo' --tts-voice-id 'foo'
```

##### Examples

Hand-picked patterns beyond the auto-generated flags above.

For bulk JSON leaf transforms (jq selector + optional sibling `--target`), see **`llm agent each`** and `llm_agent_each_examples.md`.


[Read more](https://tanit.polymech.info/user/3bb4cfbf-318b-44d3-a9d3-35680e738421/pages/llm_agent_more)

#### llm agent each

Transform selected JSON string fields with a prompt (async iterator). --source/--dst are files; --selector is a jq filter; --target is an optional sibling key (omit = in-place); --merge-json merges a checked JSON object onto the parent (hard overwrite).

Options:

**Each**
- `-i,--source` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Input JSON file (e.g. dist/data/commands.json)
- `--selector,--path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - jq filter selecting string leaves to transform (JSONPath-ish accepted: $.a[*].b -> .a[].b). Example: .ribbon.groups[].items[].label
- `--target,--as` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional sibling field name for the transformed value on the parent object. Omit to overwrite the selected leaf in place. Ignored when --merge-json is set. Example: --selector '.items[].label' --target label_de -> writes items[i].label_de
- `--merge-json` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Expect a JSON object from the transformer/LLM (checked; optional ```json fences ok). Merge object keys onto the selected leaf's parent. HARD OVERWRITE: existing keys with the same name are replaced (dev-tool semantics). Use for multi-language replies in one shot, e.g. {"label_de":"…","label_fr":"…"}. Incompatible with --target.
- `-o,--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path for the full mutated JSON document (not a single field). Required unless --json (stdout payload includes output).
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Prompt applied to each selected value (shaped as: <prompt>\n\nText to transform: "…"). Required unless --dry-run. With --merge-json, ask for a JSON object only.
- `--dry-run` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip live LLM; use --transform (default upper) for offline/fixture runs.
- `--transform` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">upper</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">upper</span> <span data-cli="choice">prefix</span> <span data-cli="choice">identity</span> <span data-cli="choice">llm-stub</span> <span data-cli="choice">json-stub</span></span></span>) - Dry-run transformer: upper | prefix | identity | llm-stub | json-stub (json-stub emits {label_de,label_fr} for --merge-json tests)
- `--prefix` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">x</span></span></span>) - Prefix string when --transform prefix
- `--concurrency` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 64]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Max concurrent leaf transforms (0 = auto: 1 dry-run, 4 live)
- `--max-retries` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 16]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Per-leaf retries on transform failure (0 = auto: 1 dry-run, 3 live)
- `--throttle-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 60000]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Minimum delay between transform starts (rate limit)
- `--no-cache` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable identical-input result cache (default: cache on).

**Provider**
- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id (same as parent llm agent).
- `--router` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - LLM router (llama|openrouter|openai|…). Default: Chat Provider Settings.
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model id (router-specific). Default: Chat Provider Settings.
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (optional; default from app chat / API Keys).
- `--base-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override the router's default base URL (OpenAI-compatible).
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - HTTP timeout per LLM round (ms). Default: Chat Provider Settings (or 60000).

**Example**

```sh
tanit-cli llm agent each -i <value> --selector <value>
```

**Full example**

```sh
tanit-cli llm agent each -i 'foo' --selector 'foo' --target 'foo' --merge-json -o 'foo' -p 'foo' --dry-run --transform 'upper' --prefix 'x' --concurrency 0 --max-retries 0 --throttle-ms 0 --no-cache --preset 'foo' --router 'foo' --model 'foo' --api-key 'foo' --base-url 'foo' --timeout-ms 0
```

##### Examples

Hand-picked patterns beyond the auto-generated flags above.

Path roles: `--source` / `--dst` are whole JSON **files**; `--selector` is a **jq** leaf picker (JSONPath-ish `$.a[*].b` → `.a[].b`); `--target` is an optional **sibling key** (omit = in-place overwrite). Provider flags (`--router`, `--model`, `--api-key`, `--preset`, …) work on `each` or on the parent: `llm agent --router openai each …`.

### Primary case: `dist/data/commands.json`

Ribbon UI copy lives under `.ribbon.groups[]` — item `label` / `description` / `tooltip`, nested submenu items (`.items[].items[]?`), group titles, and a few `extension_maps[].description` strings. Typical shape after a multi-language pass:

```json
{
  "label": "Home",
  "label_de": "Startseite",
  "label_es": "Inicio",
  "description": "Open the home panel",
  "description_de": "…",
  "description_es": "…"
}
```

**Batch DE + ES** (recommended): `npm run build:post:commands-i18n` runs every field/selector below with `--merge-json`. Plan only: `npm run build:post:commands-i18n:dry`.

**One field, multi-language** (`--merge-json`): LLM returns a checked JSON **object**; keys hard-overwrite-merge onto the leaf’s parent. `--target` is ignored. Identical strings coalesce in-process (`--no-cache` disables).

```sh
tanit-cli llm agent each \
  -i dist/data/commands.json \
  --selector '.ribbon.groups[].items[].label' \
  --merge-json \
  -o dist/data/commands.json \
  -p 'Reply with ONLY a JSON object (no markdown): {"label_de":"…","label_es":"…"} — German and Spanish UI translations of the text.' \
  --concurrency 4 \
  --router openai
```

**Other selectors** used by the batch script (optional `[]?` where nested arrays may be missing):

```text
.ribbon.groups[].items[].label
.ribbon.groups[].items[].items[]?.label
.ribbon.groups[].label
.ribbon.groups[].items[].description
.ribbon.groups[].items[].items[]?.description
.ribbon.groups[].items[].extension_maps[]?.description
.ribbon.groups[].description
.ribbon.groups[].items[].tooltip
```

For `description` / `tooltip`, ask for `description_de`/`description_es` or `tooltip_de`/`tooltip_es` in the prompt (same merge rules).

**Single sibling language** (no merge object — one string per leaf):

```sh
tanit-cli llm agent each \
  -i dist/data/commands.json \
  --selector '.ribbon.groups[].items[].label' \
  --target label_de \
  -o dist/data/commands.json \
  -p 'Translate to German. Reply with ONLY the German label. No quotes. No explanation.' \
  --concurrency 4 \
  --router openai
```

**Dry-run on the same shape** (offline; `json-stub` emits `label_de`/`label_fr` for merge smoke tests):

```sh
tanit-cli llm agent each \
  -i dist/data/commands.json \
  --selector '.ribbon.groups[].items[].label' \
  --merge-json \
  -o stemp/commands-i18n/labels-stub.json \
  --dry-run --transform json-stub --json
```

Tiny fixture with the same ribbon nesting (CI / quick probes): `tests/orchestrator/fixtures/iterator-commands-mini.json`.

### Changelog leaves (one `each` pass)

`npm run build:post:changelog` discovers surface bundles, reads headers / labels / CLI registrations into `stemp/changelog-each/phrase.json`, and runs **one** `each` pass. Prompt is `releases/web-docs/changelog.instructions.txt`. No `--router` / `--model`. Merge is additive.

```sh
tanit-cli llm agent each \
  -i stemp/changelog-each/phrase.json \
  --selector '.items[].evidence' \
  --merge-json \
  -o stemp/changelog-each/phrase.out.json \
  -p "$(cat releases/web-docs/changelog.instructions.txt)

Reply with ONLY the JSON object." \
  --concurrency 4 \
  --no-cache
```

Each leaf returns `{"actions":[{surface,action,kind,text},…]}` or `{"actions":[]}`. Same-day action metadata may merge; dates never compete.

---

#### llm agent dedupe

Cluster jq-selected string leaves by local embedding cosine similarity. Annotates duplicates with keep/duplicateOf/clusterId; optional keptTexts output.

Options:

- `-i,--source` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Input JSON file (e.g. changelog leaf bundle)
- `--selector,--path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - jq filter selecting string leaves to compare (e.g. .items[].text)
- `-m,--embed-model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to GGUF embedding model (e.g. ${MODELS_DIR}/all-MiniLM-L6-v2.Q5_K_M.gguf).
- `-o,--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output JSON report path (required unless --json).
- `--threshold` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.78</span></span></span>) - Cosine similarity threshold to treat two entries as duplicates (default 0.78).
- `--margin` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.05</span></span></span>) - Required lead over the runner-up cluster score (default 0.05).
- `-j,--threads` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 256]</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - CPU threads for embedding inference (default 4).
- `--ctx` (<span data-cli="meta"><span data-cli="type">INT:INT in [32 - 8192]</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Embedding model context length (default 512).
- `--drop` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include output.keptTexts in the report (kept strings only).

**Example**

```sh
tanit-cli llm agent dedupe -i <value> --selector <value> -m <value>
```

**Full example**

```sh
tanit-cli llm agent dedupe -i 'foo' --selector 'foo' -m 'foo' -o 'foo' --threshold '0.78' --margin '0.05' -j 4 --ctx 512 --drop
```

---

#### llm codex

Run one turn via the Codex CLI (`codex exec --json`). Requires `codex login`. Build flag: FEATURE_AGENT_CODEX.

Options:

**Input**
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - User prompt (required). Supports the same path grammar as `llm agent --prompt`.
- `--include` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - File paths to inject as Pixlwiz selection context. Repeatable.
- `--embed` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Text files whose contents are appended to the prompt (same as `llm agent --embed`). Repeatable. Max 1 MiB per file.
- `--cwd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Working directory / workspace root for the external agent.

**Provider**
- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - External CLI model override.

**Session**
- `--resume` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Resume a prior external session (Codex thread id; Claude/Cursor session id).
- `--ephemeral` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not persist the external session to disk (Codex --ephemeral).

**Runtime**
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Max wait for the external CLI process (default 600000).
- `--executable` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override CLI executable name/path (default: codex | claude | agent).

**Codex**
- `-s,--sandbox` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">read-only</span> <span data-cli="choice">workspace-write</span> <span data-cli="choice">danger-full-access</span></span></span>) - Codex sandbox: read-only | workspace-write | danger-full-access (default read-only).
- `-a,--ask-for-approval` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">on-request</span> <span data-cli="choice">never</span></span></span>) - Codex approval policy: on-request | never (default never).
- `--profile` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Codex profile from $CODEX_HOME/<name>.config.toml.
- `-c,--config` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Trusted Codex TOML override in key=value form. Repeatable.
- `--add-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Additional writable directory for Codex. Repeatable.
- `--ignore-user-config` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not load the user's Codex config.toml (authentication is still loaded).
- `--ignore-rules` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not load user or project Codex execpolicy rule files.
- `--skip-git-repo-check` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Allow Codex outside a git repository (default on).

**Example**

```sh
tanit-cli llm codex
```

**Full example**

```sh
tanit-cli llm codex -p 'foo' --include '{}' --embed '{}' --cwd '.' -m 'foo' --resume 'foo' --timeout-ms 0 --executable 'foo' --ephemeral -s 'read-only' -a 'never' --profile 'foo' -c '{}' --add-dir '{}' --ignore-user-config --ignore-rules --skip-git-repo-check
```

---

#### llm claude

Run one turn via Claude Code (`claude -p --output-format stream-json`). Build flag: FEATURE_AGENT_CLAUDE.

Options:

**Input**
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - User prompt (required). Supports the same path grammar as `llm agent --prompt`.
- `--include` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - File paths to inject as Pixlwiz selection context. Repeatable.
- `--embed` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Text files whose contents are appended to the prompt (same as `llm agent --embed`). Repeatable. Max 1 MiB per file.
- `--cwd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Working directory / workspace root for the external agent.

**Provider**
- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - External CLI model override.

**Session**
- `--resume` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Resume a prior external session (Codex thread id; Claude/Cursor session id).
- `--ephemeral` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not persist the external session to disk (Codex --ephemeral).

**Runtime**
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Max wait for the external CLI process (default 600000).
- `--executable` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override CLI executable name/path (default: codex | claude | agent).

**Example**

```sh
tanit-cli llm claude
```

**Full example**

```sh
tanit-cli llm claude -p 'foo' --include '{}' --embed '{}' --cwd '.' -m 'foo' --resume 'foo' --timeout-ms 0 --executable 'foo' --ephemeral
```

### Setup

#### register-explorer

Register Windows Explorer menus: resize / convert / meta + Workbench + Viewer + Chat + Presets

Options:

- `--group` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">Tanit</span></span></span>)
- `--unregister` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>)
- `--dry` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>)
- `--no-refresh-shell` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>)
- `--media-bin` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Path to tanit.exe (default: GUI sibling when this is tanit-cli.exe)
- `--widths` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">1980,1200</span></span></span>)

**Example**

```sh
tanit-cli register-explorer
```

**Full example**

```sh
tanit-cli register-explorer --group 'Tanit' --unregister --dry --no-refresh-shell --media-bin 'foo' --widths '1980,1200'
```

#### register-startmenu

Register current-user Start Menu shortcuts for a zip/unpacked install.

Options:

- `--folder` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">PolyMech</span></span></span>)
- `--unregister` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>)
- `--dry` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>)
- `--media-bin` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Path to tanit.exe (default: this executable)
- `--install-root` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Install/zip root for docs and Uninstall.exe lookup (default: parent of win-x64, or exe directory).

**Example**

```sh
tanit-cli register-startmenu
```

**Full example**

```sh
tanit-cli register-startmenu --folder 'PolyMech' --unregister --dry --media-bin 'foo' --install-root 'foo'
```

#### installer

Zip/unpacked install helper: seed profile data, register Explorer integration, Start Menu shortcuts, optional Chrome native host.

Options:

- `--uninstall,--uninistall` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Unregister Explorer and Start Menu integration. Profile data is kept.
- `--dry` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>)
- `--no-seed` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip copying missing dist/data files into the roaming profile.
- `--no-explorer` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip register-explorer / unregister.
- `--no-startmenu` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip register-startmenu / unregister.
- `--no-url-schemes` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip registering / unregistering the tanit:// URL scheme handler.
- `--no-chrome` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip registering / unregistering the Tanit Chrome native messaging host.
- `--root` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Install/zip root. Default: parent of win-x64, or exe directory.
- `--bundle` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Path to a JSON bundle manifest (${VAR}-aware; resolved after --root/--config). Executed after seed/register steps. ${INSTALL_ROOT} resolves to --root.
- `--verbs` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma-separated verb allow globs (e.g. copy,vfs_*). Empty = all registered verbs.
- `--journal-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Directory for run-journal sidecars (resume support; ${VAR}-aware).
- `--resume` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Resume from an existing journal (default).
- `--fresh` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Ignore any existing journal and start fresh.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL override for vfs_pull / vfs_push verbs.
- `--config` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - JSON variable overrides applied before manifest resolution. Flat object or { "variables": { … } }. Installer keys include DEFAULT_VFS_SERVER (CMS host for vfs:// sources). Values are deep-resolved (${OTHER}/sub, ${ENV:NAME}, ${KNOWNFOLDER:…}).

**Example**

```sh
tanit-cli installer
```

**Full example**

```sh
tanit-cli installer --uninstall --dry --no-seed --no-explorer --no-startmenu --no-url-schemes --no-chrome --root 'foo' --bundle 'foo' --verbs 'foo' --journal-dir 'foo' --resume --fresh --server-url 'foo' --config 'foo'
```

#### installer chrome

Register Tanit Chrome native messaging host only (no npm). Run once per user, then Load unpacked from extension/tanit-chrome in Chrome.

Options:

- `--verify` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Check registry, host manifest, and host exe.

**Example**

```sh
tanit-cli installer chrome
```

**Full example**

```sh
tanit-cli installer chrome --verify
```

### Service

#### service

Call the configured Tanit web service API. Run `login` first.

**Example**

```sh
tanit-cli service info
```

**Full example**

```sh
tanit-cli service info --server-url 'foo'
```

#### service info

Print resolved CMS, LLM, license, and Zitadel service URLs.

Options:

- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service info
```

**Full example**

```sh
tanit-cli service info --server-url 'foo'
```

---

#### service search

GET /api/search?q=... - full-text search across pages, posts, pictures, VFS files, and places. Default uses login token (includes your private content); --public searches global/public content only.

Options:

- `query` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Search query.
- `--type` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Content type: all, pages, posts, pictures, files, places (default: all).
- `--limit` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Max results (default: 20, server cap: 50).
- `--sizes` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma-separated responsive image widths.
- `--formats` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma-separated responsive image formats.
- `--visibility-filter` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Filter authenticated results: invisible or private.
- `--public` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Anonymous/global search without bearer token (public content only).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service search query <value>
```

**Full example**

```sh
tanit-cli service search query 'foo' --type 'all' --limit 20 --sizes 'foo' --formats 'foo' --visibility-filter 'foo' --public --server-url 'foo'
```

---

#### service spending

AI gateway spend APIs on the CMS server (GET /api/ai-gateway/spend/me).

Options:

- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service spending
```

**Full example**

```sh
tanit-cli service spending --server-url 'foo'
```

#### service spending logs

GET /api/ai-gateway/spend/me/logs - paginated request-level spend logs.

Options:

- `--days-back` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Lookback window when start/end dates are omitted (default: 7).
- `--start-date` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Range start (YYYY-MM-DD).
- `--end-date` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Range end (YYYY-MM-DD).
- `--page` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Page number (default: 1).
- `--page-size` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Page size (default: 25, max: 100).
- `--sort-by` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Sort column (default: startTime).
- `--sort-order` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - asc or desc (default: desc).
- `--all-pages` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Fetch and merge every page in range (CMS path; direct LiteLLM fallback when empty).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service spending logs
```

**Full example**

```sh
tanit-cli service spending logs --days-back 7 --start-date 'foo' --end-date 'foo' --page 1 --page-size 25 --sort-by 'startTime' --sort-order 'desc' --all-pages --server-url 'foo'
```

---

#### service balance

GET /api/ai-gateway/balance/me - purchased credits minus synced spend.

Options:

- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service balance
```

**Full example**

```sh
tanit-cli service balance --server-url 'foo'
```

---

#### service ai-gateway-health

GET /api/ai-gateway/health - gateway configured/alive state.

Options:

- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service ai-gateway-health
```

**Full example**

```sh
tanit-cli service ai-gateway-health --server-url 'foo'
```

---

#### service upload

Deprecated alias for `service images upload`.

Options:

- `files` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Local image path(s); repeat or list several
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; each line also includes http_status and raw_body (exact /api/images response string).

**Example**

```sh
tanit-cli service upload files {}
```

**Full example**

```sh
tanit-cli service upload files '{}' --server-url 'foo' --dump-raw-http
```

---

#### service images

Image APIs: upload image files through /api/images and receive image metadata.

**Example**

```sh
tanit-cli service images upload files {}
```

**Full example**

```sh
tanit-cli service images upload files '{}' --server-url 'foo' --dump-raw-http
```

#### service images upload

POST /api/images?forward=vfs&original=true - multipart field "file" (same as uploadUtils.uploadImage).

Options:

- `files` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Local image path(s); repeat or list several
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; each line also includes http_status and raw_body (exact /api/images response string).

**Example**

```sh
tanit-cli service images upload files {}
```

**Full example**

```sh
tanit-cli service images upload files '{}' --server-url 'foo' --dump-raw-http
```

---

#### service settings

Settings sync APIs: upload/import unencrypted settings JSON via the home VFS mount.

**Example**

```sh
tanit-cli service settings upload
```

**Full example**

```sh
tanit-cli service settings upload --remote-dir 'settings' --commands --mcp --server-url 'foo'
```

#### service settings upload

Upload portable unencrypted settings.json to VFS for cross-machine sync.

Options:

- `--remote-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">settings</span></span></span>) - Remote VFS directory under home mount (default: settings).
- `--commands` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also upload commands.json when present.
- `--mcp` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also upload MCP config files/folder when present.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service settings upload
```

**Full example**

```sh
tanit-cli service settings upload --remote-dir 'settings' --commands --mcp --server-url 'foo'
```

---

#### service settings import

Import portable unencrypted settings.json from VFS into the local profile.

Options:

- `--remote-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Remote VFS directory under home mount (default: settings).
- `--download-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Temporary/local directory for downloaded files before importing settings.json (default: cwd).
- `--commands` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also import commands.json when present remotely.
- `--mcp` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also import MCP config files/folder when present remotely.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service settings import
```

**Full example**

```sh
tanit-cli service settings import --remote-dir 'settings' --download-dir '.' --commands --mcp --server-url 'foo'
```

---

#### service settings remove

Remove the remote settings sync directory from VFS.

Options:

- `--remote-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Remote VFS directory under home mount (default: settings).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service settings remove
```

**Full example**

```sh
tanit-cli service settings remove --remote-dir 'settings' --server-url 'foo'
```

---

#### service files

VFS file APIs: upload arbitrary files and return Tanit filebrowser URLs.

**Example**

```sh
tanit-cli service files upload files {}
```

**Full example**

```sh
tanit-cli service files upload files '{}' --mount 'home' --remote-dir 'foo' --public --remote-path 'foo' --conflict 'foo' --skip --overwrite --if-newer --server-url 'foo' --dump-raw-http
```

#### service files upload

POST /api/vfs/upload/{mount}/{path} for any file type (multipart field "file"). Default: overwrite remote when the local file is newer; skip when remote is newer or the same.

Options:

- `files` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Local file path(s), globs, or brace groups (e.g. dir/**/*.{png,jpg}); repeat or list several
- `--mount` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">home</span></span></span>) - VFS mount name (default: home). Resulting user URL is /app/filebrowser/<mount>?file=...
- `--remote-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Remote VFS directory. Each matched file is placed under this path; glob matches preserve relative subfolders. Default: VFS root. Prefer --public for the shared public folder.
- `--public` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Upload into the home/public folder (same as --remote-dir public). Filebrowser URL uses ?mode=thumb&file=… for explorer links.
- `--remote-path` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Exact remote VFS path for one matched file (overrides --remote-dir; one positional spec only).
- `--conflict` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Conflict policy: if-newer (default; overwrite older remotes), skip, overwrite.
- `--skip` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip when the remote file already exists (any age).
- `--overwrite` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Always replace the remote file.
- `--if-newer` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Overwrite remote only when the local file is newer (default).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; each uploaded-file line also includes http_status and raw_body from /api/vfs/upload.

**Example**

```sh
tanit-cli service files upload files {}
```

**Full example**

```sh
tanit-cli service files upload files '{}' --mount 'home' --remote-dir 'foo' --public --remote-path 'foo' --conflict 'foo' --skip --overwrite --if-newer --server-url 'foo' --dump-raw-http
```

---

#### service files list

GET /api/vfs/ls/{mount}/{path} - list files in a VFS directory.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Directory path inside the mount. Default: root.
- `--mount` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - VFS mount name (default: home).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service files list
```

**Full example**

```sh
tanit-cli service files list path 'foo' --mount 'home' --server-url 'foo'
```

---

#### service files pull

Stream-download VFS file(s) to a local directory (HTTP Range resume, retries). Skips files that already exist locally unless --overwrite. Uses GET /api/vfs/get by default (public mounts such as models).

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Remote file or directory path inside the mount.
- `--mount` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - VFS mount name (default: home).
- `--local-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Local destination root (default: MODELS_DIR when --mount models, else cwd).
- `--pattern` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Glob filter when pulling a directory (e.g. widget-test.md, **/*.gguf).
- `--no-resume` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable HTTP Range resume.
- `--overwrite` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Re-download even when the local file already exists (default: skip existing).
- `--retries` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Per-file retry count (default: 3).
- `--read-endpoint` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Use GET /api/vfs/read instead of /api/vfs/get.
- `--progress` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Log download progress ([service-pull]).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service files pull path <path>
```

**Full example**

```sh
tanit-cli service files pull path 'foo' --mount 'home' --local-dir 'foo' --pattern 'foo' --no-resume --overwrite --retries 3 --read-endpoint --progress --server-url 'foo'
```

---

#### service files read

GET /api/vfs/read/{mount}/{path} - read raw file content for download/buffer use.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - File path inside the mount.
- `--mount` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - VFS mount name (default: home).
- `--out` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Write raw bytes to this file and print JSON metadata. Default: write raw bytes to stdout.
- `--download` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Save to current directory using this name; omit name to use the remote path basename. Refused for binary/large files when no destination is given.
- `--download-as` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Save to this exact local path (creates parent directories automatically).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--overwrite` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Re-download even when the local destination already exists (default: skip existing).

**Example**

```sh
tanit-cli service files read path <path>
```

**Full example**

```sh
tanit-cli service files read path 'foo' --mount 'home' --out 'foo' --download 'foo' --download-as 'foo' --server-url 'foo' --overwrite
```

---

#### service files get

Alias for `files read`: GET /api/vfs/read/{mount}/{path}. Binary and large files require --download or --download-as.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - File path inside the mount.
- `--mount` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - VFS mount name (default: home).
- `--download` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Save to current directory using this name; omit name to use the remote path basename.
- `--download-as` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Save to this exact local path (creates parent directories automatically).
- `--out` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Alias for --download-as: write raw bytes to this file and print metadata.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--overwrite` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Re-download even when the local destination already exists (default: skip existing).

**Example**

```sh
tanit-cli service files get path <path>
```

**Full example**

```sh
tanit-cli service files get path 'foo' --mount 'home' --download 'foo' --download-as 'foo' --out 'foo' --server-url 'foo' --overwrite
```

---

#### service files remove

DELETE /api/vfs/delete/{mount}/{path} - remove one or more VFS files/folders.

Options:

- `paths` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - VFS path(s) inside the mount.
- `--mount` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - VFS mount name (default: home).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service files remove paths {}
```

**Full example**

```sh
tanit-cli service files remove paths '{}' --mount 'home' --server-url 'foo'
```

---

#### service pages

Page APIs: list, fetch, and create Tanit pages.

**Example**

```sh
tanit-cli service pages create input {}
```

**Full example**

```sh
tanit-cli service pages create input '{}' --title 'foo' --slug 'foo' --description 'foo' --tags 'foo' --owner 'foo' --parent 'foo' --category-id '{}' --include-images --conflict 'foo' --private 'foo' --hidden 'foo' --server-url 'foo' --dump-raw-http
```

#### service pages create

POST /api/pages. .md is wrapped as a markdown-text widget; .page uploads raw page JSON content.

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Local .md/.page file(s), globs, or brace groups (e.g. docs/**/*.{md,page}); repeatable
- `--title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Page title (default: filename, or title from .page JSON).
- `--slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Page URL slug (default: generated from title).
- `--description` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional page description.
- `--tags` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma-separated page tags.
- `--owner` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner user UUID for API create (default: app_user_id from zitadel-oauth.json). Output URL prefers cached app_username when available.
- `--parent` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional parent page UUID or slug.
- `--category-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Optional category slug, display name, or UUID; repeatable.
- `--include-images` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Find image refs in markdown, probe with libmagic, upload to home/public/{page-id-prefix}-{slug}/, and rewrite refs as ./{folder}/… for server render (default upload policy: if-newer).
- `--conflict` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Image upload policy with --include-images: if-newer (default), skip, overwrite.
- `--private` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Create with is_public=false. Optional value: true/false.
- `--hidden` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Set visible=false (default without flags: link-only / hidden).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; also includes http_raw_steps and raw /api/pages response.

**Example**

```sh
tanit-cli service pages create input {}
```

**Full example**

```sh
tanit-cli service pages create input '{}' --title 'foo' --slug 'foo' --description 'foo' --tags 'foo' --owner 'foo' --parent 'foo' --category-id '{}' --include-images --conflict 'foo' --private 'foo' --hidden 'foo' --server-url 'foo' --dump-raw-http
```

---

#### service pages update

PATCH /api/pages/{id}; with --slug, resolves /api/user-page/{owner}/{slug} first.

Options:

- `input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Local .md/.page file(s), globs, or brace groups; repeatable. Batch update uses slug/id from markdown front matter or .page JSON.
- `--id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Page UUID to update.
- `--slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Existing page slug to update when --id is omitted.
- `--owner` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner user UUID or username for --slug lookup (default: app_user_id from zitadel-oauth.json).
- `--title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional replacement page title.
- `--new-slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional replacement page slug.
- `--description` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional replacement meta description.
- `--tags` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma-separated replacement page tags.
- `--parent` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional replacement parent page UUID or slug.
- `--category-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional replacement category slug, display name, or UUID; repeatable.
- `--include-images` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Find image refs in markdown, probe with libmagic, upload to home/public/{page-id-prefix}-{slug}/, and rewrite refs as ./{folder}/… for server render (default upload policy: if-newer).
- `--conflict` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Image upload policy with --include-images: if-newer (default), skip, overwrite.
- `--private` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Set is_public=false. Optional value: true/false.
- `--hidden` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Set visible=false. Optional value: true/false.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; also includes http_raw_steps and raw /api/pages response.

**Example**

```sh
tanit-cli service pages update input {}
```

**Full example**

```sh
tanit-cli service pages update input '{}' --id 'foo' --slug 'foo' --owner 'foo' --title 'foo' --new-slug 'foo' --description 'foo' --tags 'foo' --parent 'foo' --category-id '{}' --include-images --conflict 'foo' --private 'foo' --hidden 'foo' --server-url 'foo' --dump-raw-http
```

---

#### service pages list

GET /api/pages?userId=... - list pages for a user.

Options:

- `--user-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner user UUID (default: app_user_id from zitadel-oauth.json, then Tanit default).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service pages list
```

**Full example**

```sh
tanit-cli service pages list --user-id 'foo' --server-url 'foo'
```

---

#### service pages get

GET /api/user-page/{identifier}/{slug}; if slug is omitted, fetch by page id.

Options:

- `identifier` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Owner/username for route lookup, or page id when slug is omitted.
- `slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Page slug. Omit to fetch by page id.
- `--lang` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional page language query parameter.
- `--download` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Export page content to disk. Writes markdown-text content as .md when present, otherwise raw .page JSON.
- `--out` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination file or directory for --download. Default: slug/title/id with .md or .page.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service pages get identifier <id>
```

**Full example**

```sh
tanit-cli service pages get identifier 'foo' slug 'foo' --lang 'foo' --download --out 'foo' --server-url 'foo'
```

---

#### service pages remove

DELETE /api/pages/{id}; with --slug, resolves /api/user-page/{owner}/{slug} first.

Options:

- `ids` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Page UUID(s).
- `--slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Existing page slug to remove.
- `--owner` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner user UUID or username for --slug lookup (default: app_user_id from zitadel-oauth.json).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service pages remove
```

**Full example**

```sh
tanit-cli service pages remove ids '{}' --slug 'foo' --owner 'foo' --server-url 'foo'
```

---

#### service pictures

Picture APIs: list and fetch /api/pictures records.

**Example**

```sh
tanit-cli service pictures list
```

**Full example**

```sh
tanit-cli service pictures list --user-id 'foo' --page 0 --limit 9999 --server-url 'foo'
```

#### service pictures list

GET /api/pictures?userId=...&page=...&limit=... - list pictures for a user.

Options:

- `--user-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner user UUID (default: app_user_id from zitadel-oauth.json, then Tanit default).
- `--page` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Page index (default: 0).
- `--limit` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">9999</span></span></span>) - Page size (default: 9999).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service pictures list
```

**Full example**

```sh
tanit-cli service pictures list --user-id 'foo' --page 0 --limit 9999 --server-url 'foo'
```

---

#### service pictures get

GET /api/pictures/{id} - fetch a picture record.

Options:

- `id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Picture UUID.
- `--download` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Download the picture asset referenced by image_url/url instead of printing the detail summary.
- `--out` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination file or directory for --download. Default: filename from URL in the current directory.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service pictures get id <id>
```

**Full example**

```sh
tanit-cli service pictures get id 'foo' --download --out 'foo' --server-url 'foo'
```

---

#### service pictures remove

DELETE /api/pictures/{id} - remove one or more picture records.

Options:

- `ids` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Picture UUID(s).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service pictures remove ids {}
```

**Full example**

```sh
tanit-cli service pictures remove ids '{}' --server-url 'foo'
```

---

#### service posts

Post APIs: list, fetch, and create posts.

**Example**

```sh
tanit-cli service posts list
```

**Full example**

```sh
tanit-cli service posts list --user-id 'foo' --page 0 --limit 9999 --visibility-filter 'foo' --server-url 'foo'
```

#### service posts list

GET /api/posts?page=...&limit=...&userId=... - list posts for a user.

Options:

- `--user-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner user UUID (default: app_user_id from zitadel-oauth.json, then Tanit default).
- `--page` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Page index (default: 0).
- `--limit` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">9999</span></span></span>) - Page size (default: 9999).
- `--visibility-filter` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner-only filter: listed | unlisted | private | non-public | all (default: public only).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service posts list
```

**Full example**

```sh
tanit-cli service posts list --user-id 'foo' --page 0 --limit 9999 --visibility-filter 'foo' --server-url 'foo'
```

---

#### service posts get

GET /api/posts/{id} - fetch post details.

Options:

- `id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Post UUID.
- `--sizes` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional responsive image sizes query.
- `--formats` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional responsive image formats query.
- `--lang` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional language query parameter.
- `--download` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Download media assets referenced by the post detail response instead of printing the detail summary.
- `--out` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination file/directory for --download. Multiple post media files are written into this directory.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service posts get id <id>
```

**Full example**

```sh
tanit-cli service posts get id 'foo' --sizes 'foo' --formats 'foo' --lang 'foo' --download --out 'foo' --server-url 'foo'
```

---

#### service posts remove

DELETE /api/posts/{id} - remove one or more posts.

Options:

- `ids` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Post UUID(s).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service posts remove ids {}
```

**Full example**

```sh
tanit-cli service posts remove ids '{}' --server-url 'foo'
```

---

#### service posts create

POST /api/posts then multipart /api/images per file, then POST /api/pictures (same as web publish flow). Default post title is the first file's filename; each picture title is that file's filename. Description optional.

Options:

- `files` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Local image path(s)
- `--title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Post title (default: filename of the first image, e.g. photo.png).
- `--description` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional post description.
- `--visibility` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">public</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">public</span> <span data-cli="choice">listed</span> <span data-cli="choice">private</span></span></span>) - Post visibility: public | listed | private (JSON settings.visibility; default public).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; also includes http_raw_steps: label, http_status, body_raw for each API call.
- `--job-ui` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Windows: list-style job window + Tanit post dialog (Explorer `Share to Tanit...` verb).

**Example**

```sh
tanit-cli service posts create files {}
```

**Full example**

```sh
tanit-cli service posts create files '{}' --title 'foo' --description 'foo' --visibility 'public' --server-url 'foo' --dump-raw-http --job-ui
```

---

#### service categories

Category APIs: list, fetch, create, update, and remove Tanit categories.

Options:

- `--type` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">pages</span></span></span>) - Category meta.type filter/field (default: pages). Applies to list, get, items, create, update, and remove.

**Example**

```sh
tanit-cli service categories list
```

**Full example**

```sh
tanit-cli service categories list --user-id 'foo' --all --parent-slug 'foo' --include-children --lang 'foo' --server-url 'foo'
```

#### service categories list

GET /api/categories - list categories (default: own categories only).

Options:

- `--user-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Owner user UUID (default: app_user_id from zitadel-oauth.json, then Tanit default). Used unless --all.
- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include all visible categories (public/global), not just categories owned by --user-id.
- `--parent-slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Only list children of this parent category slug.
- `--include-children` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Return only top-level categories with nested children.
- `--lang` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional language for translated names.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service categories list
```

**Full example**

```sh
tanit-cli service categories list --user-id 'foo' --all --parent-slug 'foo' --include-children --lang 'foo' --server-url 'foo'
```

---

#### service categories get

GET /api/categories/{id} - fetch a category with its parents and children.

Options:

- `id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Category UUID.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service categories get id <id>
```

**Full example**

```sh
tanit-cli service categories get id 'foo' --server-url 'foo'
```

---

#### service categories items

GET /api/categories/{slug}/items - list pages in a category with resolved variables.

Options:

- `slug` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Category slug.
- `--limit` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Max items (default: server default 50).
- `--no-descendants{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Exclude items from child categories.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service categories items slug <value>
```

**Full example**

```sh
tanit-cli service categories items slug 'foo' --limit 9999 --no-descendants{false} --server-url 'foo'
```

---

#### service categories create

POST /api/categories - create a category.

Options:

- `name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Category name.
- `--slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Category slug (default: from name).
- `--description` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional description.
- `--visibility` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - public | unlisted | private (default: public).
- `--parent` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional parent category UUID (creates a relation).
- `--relation-type` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Relation type for --parent (default: generalization).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; also includes http_status and raw_body.

**Example**

```sh
tanit-cli service categories create name <value>
```

**Full example**

```sh
tanit-cli service categories create name 'foo' --slug 'foo' --description 'foo' --visibility 'foo' --parent 'foo' --relation-type 'foo' --server-url 'foo' --dump-raw-http
```

---

#### service categories update

PATCH /api/categories/{id} - update category fields.

Options:

- `id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Category UUID.
- `--name` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replacement name.
- `--slug` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replacement slug.
- `--description` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replacement description.
- `--visibility` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replacement visibility: public | unlisted | private.
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.
- `--dump-raw-http` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Implies JSON stdout; also includes http_status and raw_body.

**Example**

```sh
tanit-cli service categories update id <id>
```

**Full example**

```sh
tanit-cli service categories update id 'foo' --name 'foo' --slug 'foo' --description 'foo' --visibility 'foo' --server-url 'foo' --dump-raw-http
```

---

#### service categories remove

DELETE /api/categories/{id} - remove one or more categories.

Options:

- `ids` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Category UUID(s).
- `--server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Service base URL (default: env SERVER_URL, else VITE_SERVER_IMAGE_API_URL, else CLIENT_URL). No trailing slash.

**Example**

```sh
tanit-cli service categories remove ids {}
```

**Full example**

```sh
tanit-cli service categories remove ids '{}' --server-url 'foo'
```

---

#### service store

Microsoft Store billing (pm-pics billing-ms). Requires login + MS_STORE_MOCK on dev server.

**Example**

```sh
tanit-cli service store app-license
```

#### service store app-license

Microsoft Store app license (trial/full). PM_STORE_LICENSE_MOCK defaults to full; trial|expired|inactive override.

**Example**

```sh
tanit-cli service store app-license
```

---

#### service store health

GET /api/billing/ms/health (public; shows mock flag and product ids).

Options:

- `--license-server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - License/billing API base (default: PM_SERVICE_LICENSE_SERVER_BASE or SERVER_URL).

**Example**

```sh
tanit-cli service store health
```

**Full example**

```sh
tanit-cli service store health --license-server-url 'foo'
```

---

#### service store link

POST /api/billing/ms/link — associate UserCollectionsId with your account.

Options:

- `--collections-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - UserCollectionsId (default: cached or dev-mock-collections-* for MS_STORE_MOCK).
- `--license-server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - License/billing API base.

**Example**

```sh
tanit-cli service store link
```

**Full example**

```sh
tanit-cli service store link --collections-id 'foo' --license-server-url 'foo'
```

---

#### service store reconcile

POST /api/billing/ms/reconcile — grant credits and Pro entitlements.

Options:

- `--license-server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - License/billing API base.

**Example**

```sh
tanit-cli service store reconcile
```

**Full example**

```sh
tanit-cli service store reconcile --license-server-url 'foo'
```

---

#### service store ms-balance

GET /api/billing/balance — credit_ledger sum (not AI gateway balance).

Options:

- `--license-server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - License/billing API base.

**Example**

```sh
tanit-cli service store ms-balance
```

**Full example**

```sh
tanit-cli service store ms-balance --license-server-url 'foo'
```

---

#### service store entitlements

GET /api/billing/ms/entitlements — durable/subscription rows.

Options:

- `--license-server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - License/billing API base.

**Example**

```sh
tanit-cli service store entitlements
```

**Full example**

```sh
tanit-cli service store entitlements --license-server-url 'foo'
```

---

#### service store mock-enqueue

POST /api/billing/ms/mock/enqueue — seed a pending purchase (server MS_STORE_MOCK=1 only).

Options:

- `--product-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Store product id (e.g. STORE_PRODUCT_ID_100K).
- `--kind` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - consumable | durable | subscription (default: consumable).
- `--microsoft-item-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional stable item id for idempotency tests.
- `--license-server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - License/billing API base.

**Example**

```sh
tanit-cli service store mock-enqueue --product-id <id>
```

**Full example**

```sh
tanit-cli service store mock-enqueue --product-id 'foo' --kind 'consumable' --microsoft-item-id 'foo' --license-server-url 'foo'
```

---

#### service store mock-reset

POST /api/billing/ms/mock/reset — delete billing rows for the logged-in user.

Options:

- `--license-server-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - License/billing API base.

**Example**

```sh
tanit-cli service store mock-reset
```

**Full example**

```sh
tanit-cli service store mock-reset --license-server-url 'foo'
```

### Automation

#### batch

Manage batch sessions (save / load / resume / list / discard).

**Example**

```sh
tanit-cli batch list
```

#### batch list

List saved sessions from sessions.json.

**Example**

```sh
tanit-cli batch list
```

---

#### batch discard

Remove a saved session by id.

Options:

- `session-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Session id to remove

**Example**

```sh
tanit-cli batch discard session-id <id>
```

**Full example**

```sh
tanit-cli batch discard session-id 'foo'
```

---

#### batch resume

Resume a saved session by id (auto-detects op and re-runs pending items).

Options:

- `session-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Session id to resume

**Example**

```sh
tanit-cli batch resume session-id <id>
```

**Full example**

```sh
tanit-cli batch resume session-id 'foo'
```

### Service

#### login

Sign in via OIDC PKCE or RFC 8628 device code, or use --probe / --decode-jwt.

Options:

- `--probe` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Fetch OIDC discovery + JWKS only; verbose stderr logs; no browser.
- `--no-browser` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not launch a browser; print the PKCE URL or device verification instructions.
- `--device-code` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Use RFC 8628 Device Authorization Grant (no loopback callback port).
- `--decode-jwt` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Decode a JWT access token and explain `sub` vs app user id (optional value; if omitted, uses ZITADEL_TEST_ACCESS_TOKEN from the environment).
- `--issuer` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override ZITADEL_ISSUER / VITE_ZITADEL_AUTHORITY.
- `--client-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Override ZITADEL_NATIVE_CLIENT_ID / ZITADEL_OIDC_CLIENT_ID.
- `--oauth-port` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 65535]</span></span>) - Diagnostic fixed loopback port. Default 0 asks Windows for an ephemeral port; the ZITADEL application must be a Native client with http://127.0.0.1/callback registered.

**Example**

```sh
tanit-cli login
```

**Full example**

```sh
tanit-cli login --probe --no-browser --device-code --decode-jwt 'foo' --issuer 'foo' --client-id 'foo' --oauth-port 0
```

### Media & Capture

#### audio

Audio utilities: list devices, record, play, filter, synthesise, and change voices.

**Example**

```sh
tanit-cli audio info
```

**Full example**

```sh
tanit-cli audio info --models --playback --all
```

#### audio info

List audio devices: capture inputs by default; use --playback for MMDevice render endpoints.

Options:

- `--models` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List discovered local whisper.cpp ggml models instead of capture devices.
- `--playback` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List MMDevice playback (render) endpoints instead of capture devices. Shows active speakers, monitors, and Bluetooth audio outputs.
- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List all playback endpoints including UNPLUGGED (paired Bluetooth speakers/headphones that are not currently connected). Implies --playback.

**Example**

```sh
tanit-cli audio info
```

**Full example**

```sh
tanit-cli audio info --models --playback --all
```

---

#### [audio record](https://tanit.polymech.info/user/3bb4cfbf-318b-44d3-a9d3-35680e738421/pages/audio_record_more)

Record from mic, desktop loopback, or mix. Default capture: PCM s16le 48 kHz stereo. Output format follows --dst extension: .wav (PCM; after ~30 s in RAM, PCM spills to a temp file) or .m4a/.aac (AAC-LC, Windows only, encoded during capture). Optional --filter deepfilter enhances the file after capture (48 kHz mono WAV; not on the callback). Stops after --duration-ms, Ctrl+C, console close, or `audio record stop`. Plain recording: --dst. Transcript only: --text-out, or --provider/--model to print to stdout. Timed sidecars: --subtitle-format srt (same wrap as xblox audioTranscribe). Both is fine.

Options:

**Output**
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination audio file; extension selects format. .wav = PCM WAV (long recordings keep ~30 s in RAM then spill PCM to disk). .m4a or .aac = AAC-LC via Media Foundation (Windows only; 48 kHz; no full-RAM buffer). Optional when --text-out is set (scratch file used internally). Relative paths are resolved from the current working directory.
- `--duration,--duration-ms` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Stop recording after this many milliseconds (0 = run until Ctrl+C).
- `--seconds` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Stop recording after this many seconds (0 = run until Ctrl+C).
- `--hud` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show the overlay HUD while recording or transcribing. Stop ends the take. Default off.

**Source**
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Capture device name (case-insensitive substring; use `audio info` to list names). Omit to use the system default input device. Ignored when --input-source desktop is set.
- `--input-source` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">mic</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Input source: mic (default), desktop (system loopback), or mix (mic + desktop).
- `--desktop` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Loopback device name substring for --input-source desktop/mix (empty = default render device). Sets --input-source desktop when --input-source is not explicitly given.
- `--mic-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Mic level multiplier (linear; 0 = mute, 1 = unity). Used with --input-source mix.
- `--desktop-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Desktop/loopback level multiplier (linear; 0 = mute, 1 = unity). Used with --input-source desktop or mix.
- `--output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Playback device name for TTS output during STT→TTS loop (case-insensitive substring). Omit to use the system default output device.

**Format**
- `--sample-rate` (<span data-cli="meta"><span data-cli="type">INT:INT in [8000 - 192000]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Capture/output sample rate in Hz (default 48000). Common: 44100, 48000, 96000. AAC (.m4a/.aac) on Windows is always encoded at 48000 Hz (resampled when needed).
- `--channels` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">0</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">0</span> <span data-cli="choice">1</span> <span data-cli="choice">2</span></span></span>) - Output channels: 1 = mono, 2 = stereo (default 2). Applies to .wav and .m4a/.aac. Ignored for the final file when --filter is set (DeepFilterNet writes 48 kHz mono).

**Filter**
- `--filter` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">deepfilter</span> <span data-cli="choice">dfn</span> <span data-cli="choice">deepfilternet</span> <span data-cli="choice">gtcrn</span></span></span>) - Enhance after capture (same lib as `audio filter`). deepfilter = DeepFilterNet @ 48 kHz mono WAV. gtcrn = reserved. Omit to keep the dry recording. Not applied on the capture callback.
- `--filter-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - DeepFilterNet tar.gz. Default: ${MODELS_DIR}/deepfilter/DeepFilterNet3_onnx.tar.gz. Use this instead of --model (that flag is STT).
- `--atten` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 100]</span></span>) - Attenuation limit in dB (in-process libDF only). Default: 100.
- `--post-filter,--pf` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Over-attenuate very noisy sections. Implies --filter deepfilter.
- `--no-delay` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not compensate STFT / model lookahead. Implies --filter deepfilter.

**Bluetooth**
- `--connect` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Connect a paired Bluetooth audio device by address or fuzzy name before recording. If --input is omitted, this value is also used as the capture device selector.
- `--connect-timeout-ms` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Maximum ms to wait for --connect device to become ready (default 30000 = 30 s). Increase for AV receivers or devices that take a long time to boot from standby.
- `--connect-delay-ms,--delay` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Extra delay (ms) after --connect succeeds, before recording starts. Useful when the BT device needs time to switch inputs or unmute (default 0).

**STT**
- `--stt` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enable speech-to-text alongside recording (live ElevenLabs or batch Whisper). Implied by --text-out, --subtitle-format, --provider, or --model. Without STT flags, --dst records audio only (.wav or .m4a/.aac by extension). Batch Whisper with .m4a uses a temporary WAV for transcription.
- `--provider` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">elevenlabs</span> <span data-cli="choice">tanit</span> <span data-cli="choice">whisper</span></span></span>) - STT provider. Implies transcription when no --dst/--text-out is set. Currently supported: elevenlabs (Scribe v2 Realtime), pixlwiz (Whisper batch), whisper (local whisper.cpp, offline). Defaults to chat.stt_provider from app settings.
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - STT model override. For --provider whisper this may be a ggml model path, for example ${MODELS_DIR}/ggml-base.en.bin. Defaults to Chat Provider voice model settings.
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key for the selected STT provider (--provider elevenlabs → xi-api-key). Also used as the TTS key when --voice-id is set. Falls back to the provider entry in App Settings when omitted.
- `--from-wav` (<span data-cli="meta"><span data-cli="type">TEXT:FILE</span></span>) - Transcribe an existing WAV file instead of capturing from the mic (batch providers only: whisper local / pixlwiz). Implies --stt. Prints the transcript and exits; combine with --text-out / --subtitle-format to write files.
- `--silence-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">1500</span></span></span>) - Auto-commit STT utterance after this many milliseconds of silence (0 = disabled; requires --stt or --text-out; default: 1500).
- `--text-out` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Write the full STT transcript to this file (UTF-8 text). Enables STT automatically. --dst is optional. Relative paths are resolved from the current working directory.
- `--subtitle-format` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">none</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">off</span> <span data-cli="choice">srt</span> <span data-cli="choice">vtt</span> <span data-cli="choice">sbv</span> <span data-cli="choice">all</span> <span data-cli="choice">on</span></span></span>) - Write YouTube-accepted subtitle sidecar(s) next to --dst (or --subtitle-path). none (default) | srt | vtt | sbv | all. Implies --stt.
- `--subtitle-path` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Sidecar stem. Default: empty → next to --dst, --from-wav, or --text-out.
- `--subtitle-max-chars` (<span data-cli="meta"><span data-cli="type">INT:INT in [8 - 120]</span>, <span data-cli="default">default <span data-cli="value">42</span></span></span>) - Cue wrap width (default 42).
- `--subtitle-max-lines` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 4]</span>, <span data-cli="default">default <span data-cli="value">2</span></span></span>) - Cue wrap line count (default 2).

**Whisper**
- `--backend` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">cpu</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">cpu</span> <span data-cli="choice">gpu</span></span></span>) - Local whisper.cpp only: inference backend policy, cpu or gpu. Default: cpu.
- `--gpu-device` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Local whisper.cpp only: GPU device index, only meaningful with --backend gpu.
- `--flash-attn` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">on</span> <span data-cli="choice">off</span></span></span>) - Local whisper.cpp only: flash attention policy, auto/on/off. Default: auto.
- `--threads` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Local whisper.cpp only: CPU thread count (0 = auto, capped by the wrapper).
- `--language` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">auto</span></span></span>) - Local whisper.cpp only: language code such as en or de, or auto. Default: auto.

**Live TTS**
- `--voice-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ElevenLabs voice ID for real-time TTS playback. When set, each committed transcript is synthesised and played through the speakers. Requires --stt/--text-out and --provider elevenlabs. Browse voices at elevenlabs.io/app/voice-library.
- `--model-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">eleven_v3</span></span></span>) - ElevenLabs TTS model used with --voice-id (default: eleven_v3).

**Example**

```sh
tanit-cli audio record
```

**Full example**

```sh
tanit-cli audio record --dst 'foo' --input 'foo' --input-source 'mic' --desktop 'foo' --mic-gain '1' --desktop-gain '1' --sample-rate 0 --channels 0 --filter 'deepfilter' --filter-model 'foo' --atten '100' --post-filter --no-delay --output 'foo' --connect 'foo' --connect-timeout-ms 30000 --connect-delay-ms 0 --duration 0 --seconds 0 --hud --stt --provider 'elevenlabs' --model 'foo' --backend 'cpu' --gpu-device 0 --flash-attn 'auto' --threads 0 --language 'auto' --api-key 'foo' --from-wav 'foo' --voice-id 'foo' --model-id 'eleven_v3' --silence-ms 1500 --text-out 'foo' --subtitle-format 'none' --subtitle-path 'foo' --subtitle-max-chars 42 --subtitle-max-lines 2
```

##### Examples

Hand-picked patterns beyond the auto-generated flags above.

**Desktop loopback → WAV** (48 kHz stereo default; PCM spills to disk after ~30 s in RAM)

```sh
tanit-cli audio record --input-source desktop --dst meeting.wav
```

**Timed capture**

```sh
tanit-cli audio record --input-source desktop --dst clip.wav --seconds 120
```

**Desktop → AAC/M4A** (Windows only; encoded during capture at 48 kHz)

```sh
tanit-cli audio record --input-source desktop --dst meeting.m4a
```

**Mic + desktop mix with gain**

```sh
tanit-cli audio record --input-source mix --mic-gain 0.8 --desktop-gain 1.0 --dst call.wav
```

**Custom format**

```sh
tanit-cli audio record --input-source desktop --dst voice.wav --sample-rate 44100 --channels 1
```

**Record + DeepFilterNet** (dry capture, then enhance; writes 48 kHz mono WAV). `--pf` alone also turns the filter on. `--model` is STT; the DFN tar is `--filter-model`. Use a `.wav` `--dst` (not `.m4a`).

```sh
tanit-cli audio record --dst rec.wav --filter deepfilter --pf
```

Existing file (no capture): `tanit-cli audio filter --input in.wav --dst out.wav --filter deepfilter --pf`

**Record + live STT transcript**

```sh
tanit-cli audio record --input-source mic --dst take.wav --stt --text-out take.md
```

**Record + SRT sidecar** (same wrap as xblox audioTranscribe; implies `--stt`). Writes `take.srt` next to the WAV. Use `--subtitle-format vtt`, `sbv`, or `all` for other YouTube sidecars; `--subtitle-path` overrides the stem.

```sh
tanit-cli audio record --input-source mic --dst take.wav --stt --subtitle-format srt
```

**Existing WAV → SRT**

```sh
tanit-cli audio record --from-wav take.wav --stt --subtitle-format srt
```

Feed the sidecar into `audio tts-scripted --srt take.srt --dst take.voiceover.wav`.

**Record to M4A + batch Whisper** (writes a temporary WAV for transcription, then removes it)

```sh
tanit-cli audio record --input-source desktop --dst meeting.m4a --provider whisper --model base.en --text-out meeting.md
```

On completion, check **capture** (frame ratio), **levels** (peak/RMS dBFS, clip count), and **file** size.

**Cooperative stop / status from another terminal**

```sh
tanit-cli audio record stop
tanit-cli audio record status --json
```

[Read more](https://tanit.polymech.info/user/3bb4cfbf-318b-44d3-a9d3-35680e738421/pages/audio_record_more)

#### audio record stop

Signal a running `audio record` session in another terminal to stop cooperatively.

**Example**

```sh
tanit-cli audio record stop
```

---

#### audio record status

Show the active `audio record` session (device, format, provider/model, elapsed time, dst, text-out, live STT buffer).

**Example**

```sh
tanit-cli audio record status
```

---

#### audio play

Play an audio file through the default output device. Supports MP3, WAV, FLAC via miniaudio. Playback is asynchronous by default; use --wait to block until finished.

Options:

**Playback**
- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to the audio file. Relative paths are resolved from the current working directory.
- `--wait` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Block until playback finishes (normally async). Ctrl+C aborts playback.
- `--output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Playback device name (case-insensitive substring; use `audio info` to list names). Omit to use the system default output device.

**Bluetooth**
- `--connect` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Connect a paired Bluetooth audio device by address or fuzzy name before playback. When --output is omitted, playback uses the newly connected default endpoint.
- `--connect-timeout-ms` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Maximum ms to wait for --connect device to become ready (default 30000 = 30 s).
- `--connect-delay-ms,--delay` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Extra delay (ms) after --connect succeeds, before playback starts. Useful for AV receivers that need time to switch inputs or unmute (default 0).

**Example**

```sh
tanit-cli audio play path <path>
```

**Full example**

```sh
tanit-cli audio play path 'foo' --wait --output 'foo' --connect 'foo' --connect-timeout-ms 30000 --connect-delay-ms 0
```

---

#### audio filter

Enhance a recorded audio file. Default: DeepFilterNet at 48 kHz (same lib as xblox audioFilter). GTCRN is reserved for the 16 kHz live path.

Options:

**Input**
- `source,--input` (<span data-cli="meta"><span data-cli="type">TEXT:FILE</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Source audio file (wav, mp3, flac, …). Decoded and resampled to 48 kHz mono.

**Output**
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Destination WAV (48 kHz mono s16le).

**Filter**
- `--filter` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">deepfilter</span> <span data-cli="choice">dfn</span> <span data-cli="choice">deepfilternet</span> <span data-cli="choice">gtcrn</span></span></span>) - Enhancer: deepfilter (DeepFilterNet, default) or gtcrn (reserved).
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - DeepFilterNet tar.gz. Default: ${MODELS_DIR}/deepfilter/DeepFilterNet3_onnx.tar.gz (same catalog as embeddings; `hg download deepfilternet3` / `hg download gtcrn`).
- `--atten` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 100]</span></span>) - Attenuation limit in dB (in-process libDF only). Default: 100.
- `--post-filter,--pf` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Over-attenuate very noisy sections.
- `--no-delay` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not compensate STFT / model lookahead.

**Example**

```sh
tanit-cli audio filter source,--input <value> --dst <value>
```

**Full example**

```sh
tanit-cli audio filter source,--input 'foo' --dst 'foo' --filter 'deepfilter' --model 'foo' --atten '100' --post-filter --no-delay
```

---

#### audio voice-change

Transform speech into an ElevenLabs voice while preserving timing, emotion, and delivery.

Options:

**Input**
- `source` (<span data-cli="meta"><span data-cli="type">TEXT:FILE</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Source audio file. Encoded audio is accepted by default; use --input-format pcm_s16le_16 for raw 16 kHz mono signed 16-bit little-endian PCM.
- `--input-format` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">other</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">other</span> <span data-cli="choice">pcm_s16le_16</span></span></span>) - Input encoding hint: other (encoded audio) or pcm_s16le_16 (raw PCM).

**Output**
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Destination audio file. .mp3, .wav, and .opus select a matching default --format.
- `--format` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ElevenLabs output format, for example mp3_44100_128, wav_44100, or opus_48000_128. Defaults from --dst extension.

**Voice**
- `--voice-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Target ElevenLabs voice ID. Defaults to the configured TTS voice.
- `--model-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">eleven_multilingual_sts_v2</span></span></span>) - Speech-to-speech model ID.

**Auth**
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ElevenLabs API key. Falls back to the configured ElevenLabs provider, then ELEVENLABS_API_KEY.
- `--base-url` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ElevenLabs API origin for regional residency, without /v1 (default: https://api.elevenlabs.io).

**Voice Settings**
- `--voice-settings` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Advanced JSON object overriding target voice settings. Individual flags below override matching JSON fields.
- `--stability` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span></span>) - Voice stability from 0 to 1. Lower is more expressive; higher is more consistent.
- `--similarity-boost` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span></span>) - Target-voice similarity from 0 to 1.
- `--style` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span></span>) - Style exaggeration from 0 to 1.
- `--speaker-boost` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enable ElevenLabs speaker boost for stronger target-voice similarity.
- `--no-speaker-boost` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Explicitly disable ElevenLabs speaker boost.

**Advanced**
- `--seed` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 4294967295]</span></span>) - Best-effort deterministic seed (0..4294967295).
- `--optimize-streaming-latency` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 4]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - ElevenLabs latency optimisation level (0..4).
- `--remove-background-noise` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Remove background noise from the source using ElevenLabs Audio Isolation.
- `--zero-retention` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Send enable_logging=false. ElevenLabs restricts zero-retention mode to eligible enterprise accounts.

**Example**

```sh
tanit-cli audio voice-change source <value> --dst <value>
```

**Full example**

```sh
tanit-cli audio voice-change source 'foo' --dst 'foo' --voice-id 'foo' --model-id 'eleven_multilingual_sts_v2' --format 'foo' --input-format 'other' --api-key 'foo' --base-url 'foo' --voice-settings 'foo' --stability '-1' --similarity-boost '-1' --style '-1' --speaker-boost --no-speaker-boost --seed -1 --optimize-streaming-latency 0 --remove-background-noise --zero-retention
```

---

#### audio tts

Synthesise speech from text using a TTS provider and write audio to a file.

Options:

**Input**
- `--text` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Text to synthesise, or path to a plain-text file (.txt, .md, …). When the value is an existing readable file it is loaded (binary files rejected). Use quotes for inline multi-word input.

**Output**
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination file (.mp3 / .wav / .opus). Extension determines the default output format when --format is omitted. Omit to play through speakers without saving.
- `--hud` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show the overlay HUD while synthesizing and playing. Stop cancels playback. Default off.
- `--no-play` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not play audio through speakers; only save to --dst.
- `--output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Playback device name (case-insensitive substring; use `audio info` to list names). Omit to use the system default output device.
- `--no-stream` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Opt out of the streaming playback path (curl → ring → device). When omitted and --dst is not set, the playback path uses streaming for lowest first-audio latency (mirrors the agent's `do_speak`). Ignored when --dst is set (the file write requires the full buffer).
- `--format` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output format override. ElevenLabs: mp3_44100_128, pcm_44100, opus_48000_32. Tanit proxy: mp3, opus, aac, flac. Defaults to mp3_44100_128 for .mp3, pcm_44100 for .wav.

**Bluetooth**
- `--connect` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Connect a paired Bluetooth audio device by address or fuzzy name before TTS playback. Synthesis is overlapped with the device wake-up so total latency is minimised. Ignored with --no-play.
- `--connect-timeout-ms` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Maximum ms to wait for --connect device to become ready (default 30000 = 30 s).
- `--connect-delay-ms,--delay` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Extra delay (ms) after --connect succeeds, before TTS playback starts. Useful for AV receivers that need time to switch inputs or unmute (default 0).

**Provider**
- `--provider` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">elevenlabs</span> <span data-cli="choice">tanit</span> <span data-cli="choice">vibevoice</span> <span data-cli="choice">moss</span></span></span>) - TTS provider: elevenlabs (direct API), pixlwiz (proxy /audio/speech), vibevoice (local ggml), or moss (local MOSS-TTS-Nano). Defaults to chat.tts_provider from app settings, then elevenlabs.
- `--tokenizer` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Tokenizer GGUF path for vibevoice or moss. MOSS defaults to models/moss-tts-nano/moss-nano-tokenizer.gguf.
- `--codec` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - MOSS Audio Tokenizer Nano GGUF. Defaults to models/moss-tts-nano/moss-audio-tokenizer-nano.gguf.
- `--ref-audio` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Reference WAV for local voice cloning (vibevoice 1.5B or MOSS Nano).
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key for the TTS provider. Falls back to ELEVENLABS_API_KEY env var.
- `--voice-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">tLK6fPv15M0oKv4V3ACR</span></span></span>) - Voice ID. For elevenlabs: ElevenLabs voice UUID. For pixlwiz: ElevenLabs voice UUID override (empty = proxy default). Defaults to chat.tts_model from app settings when omitted.
- `--model-id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">eleven_v3</span></span></span>) - Model ID. For elevenlabs: eleven_v3, eleven_turbo_v2, etc. For pixlwiz: proxy alias (pixlwiz-speech, pixlwiz-speech-turbo). Defaults to chat.tts_model from app settings when omitted.

**Voice Settings**
- `--no-voice-settings` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not send explicit ElevenLabs voice_settings (use voice defaults).
- `--no-chunk` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable sentence chunking + request stitching for long ElevenLabs inputs.
- `--chunk-target-chars` (<span data-cli="meta"><span data-cli="type">INT:INT in [100 - 800]</span>, <span data-cli="default">default <span data-cli="value">400</span></span></span>) - Greedy-merge sentences up to this many chars per ElevenLabs request (default 400; range 100–800).
- `--chunk-max-chars` (<span data-cli="meta"><span data-cli="type">INT:INT in [200 - 2000]</span>, <span data-cli="default">default <span data-cli="value">800</span></span></span>) - Hard-split a single sentence beyond this length (default 800; range 200–2000).
- `--stability` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.9</span></span></span>) - ElevenLabs voice_settings.stability (0–1, default 0.9). Higher reduces drift on long inputs.
- `--similarity-boost` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.75</span></span></span>) - ElevenLabs voice_settings.similarity_boost (0–1, default 0.75).
- `--style` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - ElevenLabs voice_settings.style (0–1, default 0). Non-zero style can cause inconsistent speed and added sounds.

**Example**

```sh
tanit-cli audio tts --text <value>
```

**Full example**

```sh
tanit-cli audio tts --text 'foo' --dst 'foo' --hud --no-play --output 'foo' --connect 'foo' --connect-timeout-ms 30000 --connect-delay-ms 0 --no-stream --provider 'elevenlabs' --tokenizer 'foo' --codec 'foo' --ref-audio 'foo' --api-key 'foo' --voice-id 'tLK6fPv15M0oKv4V3ACR' --model-id 'eleven_v3' --format 'foo' --no-voice-settings --no-chunk --chunk-target-chars 400 --chunk-max-chars 800 --stability '0.9' --similarity-boost '0.75' --style '0'
```

##### Examples

`audio tts` supports direct ElevenLabs, the Tanit speech proxy, and local
VibeVoice or MOSS synthesis. Provider credentials can come from App Settings;
use `--api-key` only when overriding them for one command.

**ElevenLabs — stream to the default speakers**

```sh
tanit-cli audio tts --provider elevenlabs \
  --voice-id tLK6fPv15M0oKv4V3ACR \
  --model-id eleven_v3 \
  --text "Hello from ElevenLabs."
```

With no `--dst`, playback uses the low-latency streaming path. The API key is
resolved from App Settings or `ELEVENLABS_API_KEY`.

**ElevenLabs — save MP3 without playing**

```sh
tanit-cli audio tts --provider elevenlabs \
  --voice-id tLK6fPv15M0oKv4V3ACR \
  --model-id eleven_v3 \
  --text narration.md --dst narration.mp3 --no-play
```

Use `--dst narration.wav --format pcm_44100` for PCM WAV. Optional
`--stability`, `--similarity-boost`, and `--style` flags override the selected
voice settings.

**Tanit speech proxy**

```sh
tanit-cli audio tts --provider tanit \
  --model-id pixlwiz-speech \
  --text "Synthesize this through the configured Tanit service."
```

The proxy uses the provider credentials from App Settings. Add
`--dst speech.mp3 --no-play` to save instead of playing.

**Local VibeVoice**

```sh
tanit-cli audio tts --provider vibevoice \
  --model-id models/vibevoice-realtime-0.5B-q8_0.gguf \
  --tokenizer models/tokenizer.gguf \
  --voice-id models/voice-en-Carter_man.gguf \
  --text "Hello from VibeVoice."
```

VibeVoice runs locally and requires its model, tokenizer, and compatible voice
GGUF. Its 1.5B voice-clone path accepts `--ref-audio` instead of a voice GGUF.

##### MOSS-TTS-Nano

MOSS runs locally and does not need an API key. The installed model bundle and
default `ref-en.wav` are discovered automatically.

**Speak with the default reference voice**

```sh
tanit-cli audio tts --provider moss --text "Hello from Moss. How are you?"
```

**Save without playing**

```sh
tanit-cli audio tts --provider moss --text "Your export is ready." --dst ready.wav --no-play
```

MOSS currently writes 48 kHz stereo WAV. Use a `.wav` destination; `--format`
does not transcode local MOSS output.

**Clone a voice from a reference WAV**

```sh
tanit-cli audio tts --provider moss --text "This uses the reference speaker." --ref-audio speaker.wav
```

Use a clean speech recording with little background noise. The reference is
encoded once and cached while the local engine remains loaded.

**Read text from a file**

```sh
tanit-cli audio tts --provider moss --text announcement.md --dst announcement.wav --no-play
```

When `--text` names a readable text or Markdown file, Tanit loads and prepares
its contents before synthesis.

**Use an explicit model bundle**

```sh
tanit-cli audio tts --provider moss \
  --model-id models/moss-tts-nano/moss-tts-nano.gguf \
  --codec models/moss-tts-nano/moss-audio-tokenizer-nano.gguf \
  --tokenizer models/moss-tts-nano/moss-nano-tokenizer.gguf \
  --ref-audio models/moss-tts-nano/ref-en.wav \
  --text "Local synthesis with explicit model paths."
```

Normally these paths are unnecessary. Override them when testing another
installed Nano bundle. MOSS-TTS Local v1.5 models are not compatible with this
provider.

**CPU fallback**

PowerShell:

```powershell
$env:MOSS_TTS_BACKEND = "cpu"
tanit-cli audio tts --provider moss --text "Run this on the CPU."
```

The packaged CUDA build selects the GPU by default when available. CPU is
slower but uses the same Nano model and command path.

MOSS requires `moss-tts.dll` plus the three Nano GGUF files. If any component
is missing, the command reports the expected installed paths without falling
back to a cloud provider.

##### Reverse direction — local speech to text

Use the `whisper` provider to transcribe locally with whisper.cpp. No API key
or network connection is required.

**Microphone → transcript**

```sh
tanit-cli audio record --input-source mic \
  --provider whisper --model models/ggml-base.en.bin \
  --stt --language en --text-out transcript.md
```

Speak into the default microphone and press Ctrl+C to stop. Add `--dst
recording.wav` to keep the captured audio as well as the transcript.

**Existing WAV → transcript**

```sh
tanit-cli audio record --from-wav recording.wav \
  --provider whisper --model models/ggml-base.en.bin \
  --stt --language en --text-out transcript.md
```

Add `--json` for structured stdout. The model can also be omitted when a local
Whisper model is already configured in App Settings.

---

#### audio tts-scripted

Place scripted TTS from an SRT/VTT/JSON script onto a 48 kHz PCM timeline.

Options:

- `--srt` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - SRT, VTT, or JSON cues file.
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Output 48 kHz mono WAV.
- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - TTS provider override.
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key override.
- `--voice-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Voice id override.
- `--model-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model id override.
- `--overflow` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">resolve</span> <span data-cli="choice">truncate</span></span></span>) - resolve (default) or truncate.
- `--speed` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0.7 - 1.2]</span></span>) - Initial ElevenLabs speed (0.7–1.2).
- `--max-stretch-pct` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 25]</span></span>) - Max DSP compress percent before speed regen.
- `--min-gap-ms` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Minimum inter-utterance gap.
- `--seed` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Best-effort seed (-1 = derived).
- `--cache-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Take cache directory.

**Example**

```sh
tanit-cli audio tts-scripted --srt <value> --dst <value>
```

**Full example**

```sh
tanit-cli audio tts-scripted --srt 'foo' --dst 'foo' --provider 'foo' --api-key 'foo' --voice-id 'foo' --model-id 'foo' --overflow 'resolve' --speed '1' --max-stretch-pct '12' --min-gap-ms 80 --seed -1 --cache-dir 'foo'
```

#### voice

Always-listening voice command and realtime-agent trigger.

**Example**

```sh
tanit-cli voice listen
```

**Full example**

```sh
tanit-cli voice listen --route 'trigger' --wake-phrase 'foo' --filter 'auto' --filter-model 'foo' --post-filter --filter-blend '1' --provider 'whisper' --model 'foo' --language 'auto' --backend 'gpu' --gpu-device 0 --flash-attn 'auto' --threads 0 --jsonl --input-source 'mic' --input 'foo' --desktop 'foo' --mic-gain '1' --desktop-gain '1' --duration-ms 0
```

#### voice listen

Listen for a wake-prefixed command.

Options:

- `--route` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">trigger</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trigger</span> <span data-cli="choice">agent</span></span></span>) - Route: trigger emits a mapping envelope; agent starts realtime voice.
- `--wake-phrase` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Spoken prefix. Empty = no prefix; the whole utterance is the command.
- `--filter` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">off</span> <span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Utterance enhancement: auto, off, deepfilter, or gtcrn.
- `--filter-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Enhancement model override.
- `--post-filter` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - DeepFilterNet aggressive post-filter for very noisy audio.
- `--filter-blend` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Wet/dry mix for utterance enhancement: 0 = original, 1 = full filter. Default: 1.
- `--provider` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">whisper</span> <span data-cli="choice">tanit</span> <span data-cli="choice">pixlwiz</span> <span data-cli="choice">elevenlabs</span></span></span>) - STT provider: whisper, tanit/pixlwiz, or elevenlabs.
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - STT model override.
- `--language` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">auto</span></span></span>) - Whisper language: auto, ISO code (de), or name (german).
- `--backend` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">gpu</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">cpu</span> <span data-cli="choice">gpu</span></span></span>) - Local whisper.cpp only: cpu or gpu. Default: gpu (falls back to cpu).
- `--gpu-device` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Local whisper.cpp only: GPU device index (with --backend gpu).
- `--flash-attn` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">on</span> <span data-cli="choice">off</span></span></span>) - Local whisper.cpp only: flash attention auto, on, or off.
- `--threads` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Local whisper.cpp only: CPU threads; 0 = auto.
- `--jsonl,--json` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Emit versioned envelopes on stdout (JSONL). Heard speech always prints to stderr.
- `--input-source` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">mic</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - mic, desktop, or mix.
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Microphone device substring.
- `--desktop` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Desktop loopback device substring.
- `--mic-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Microphone gain.
- `--desktop-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Desktop gain.
- `--duration-ms` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Optional bounded listen duration; 0 runs until stopped.

**Example**

```sh
tanit-cli voice listen
```

**Full example**

```sh
tanit-cli voice listen --route 'trigger' --wake-phrase 'foo' --filter 'auto' --filter-model 'foo' --post-filter --filter-blend '1' --provider 'whisper' --model 'foo' --language 'auto' --backend 'gpu' --gpu-device 0 --flash-attn 'auto' --threads 0 --jsonl --input-source 'mic' --input 'foo' --desktop 'foo' --mic-gain '1' --desktop-gain '1' --duration-ms 0
```

---

#### voice replay

Run a WAV or injected transcript through wake/intent routing.

Options:

- `--route` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">trigger</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trigger</span> <span data-cli="choice">agent</span></span></span>) - Route: trigger emits a mapping envelope; agent starts realtime voice.
- `--wake-phrase` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Spoken prefix. Empty = no prefix; the whole utterance is the command.
- `--filter` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">off</span> <span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Utterance enhancement: auto, off, deepfilter, or gtcrn.
- `--filter-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Enhancement model override.
- `--post-filter` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - DeepFilterNet aggressive post-filter for very noisy audio.
- `--filter-blend` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Wet/dry mix for utterance enhancement: 0 = original, 1 = full filter. Default: 1.
- `--provider` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">whisper</span> <span data-cli="choice">tanit</span> <span data-cli="choice">pixlwiz</span> <span data-cli="choice">elevenlabs</span></span></span>) - STT provider: whisper, tanit/pixlwiz, or elevenlabs.
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - STT model override.
- `--language` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">auto</span></span></span>) - Whisper language: auto, ISO code (de), or name (german).
- `--backend` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">gpu</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">cpu</span> <span data-cli="choice">gpu</span></span></span>) - Local whisper.cpp only: cpu or gpu. Default: gpu (falls back to cpu).
- `--gpu-device` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Local whisper.cpp only: GPU device index (with --backend gpu).
- `--flash-attn` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">on</span> <span data-cli="choice">off</span></span></span>) - Local whisper.cpp only: flash attention auto, on, or off.
- `--threads` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Local whisper.cpp only: CPU threads; 0 = auto.
- `--jsonl,--json` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Emit versioned envelopes on stdout (JSONL). Heard speech always prints to stderr.
- `path` (<span data-cli="meta"><span data-cli="type">TEXT:FILE</span></span>) - Input audio file (WAV, MP3, or other decodeable).
- `--text` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Deterministic transcript injection (does not require STT/model).

**Example**

```sh
tanit-cli voice replay
```

**Full example**

```sh
tanit-cli voice replay --route 'trigger' --wake-phrase 'foo' --filter 'auto' --filter-model 'foo' --post-filter --filter-blend '1' --provider 'whisper' --model 'foo' --language 'auto' --backend 'gpu' --gpu-device 0 --flash-attn 'auto' --threads 0 --jsonl path 'foo' --text 'foo'
```

---

#### voice status

Show active voice listeners.

**Example**

```sh
tanit-cli voice status
```

---

#### voice stop

Cooperatively stop active voice listeners.

**Example**

```sh
tanit-cli voice stop
```

#### video

Video capture, AI generation, and recording.

**Example**

```sh
tanit-cli video create -p <value>
```

**Full example**

```sh
tanit-cli video create output 'foo' -p 'foo' --provider 'foo' --model 'foo' --preset 'foo' --api-key 'foo' --duration 0 --resolution '720p' --aspect-ratio '16:9' --generate-audio --src '{}' --start-frame 'foo' --last-frame 'foo' -r '{}'
```

#### video create

AI text-to-video / image-to-video (Tanit LiteLLM /v1/videos, or Replicate).

Options:

**Output**
- `output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path (omit = video_<slug>.mp4 in the implicit output folder)

**Prompt**
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Generation prompt

**Provider**
- `--provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - AI provider (tanit, replicate); omit = from --preset / app Chat video_provider
- `--model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Model id (video-fast, video-deep, or a Replicate slug); omit = from --preset / app Chat video_model
- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id; loads that preset's video_provider/video_model. explicit --provider/--model override
- `--api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key (optional; default from app provider settings)

**Clip**
- `--duration` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Seconds (Veo: 4 / 6 / 8). 0 = model default (4 fast / 8 deep)
- `--resolution` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">720p</span></span></span>) - 720p, 1080p, or 4K (deep only)
- `--aspect-ratio` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">16:9</span></span></span>) - 16:9 or 9:16
- `--generate-audio` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Request native audio (higher cost)

**Source**
- `--src` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Input still (repeatable: first = start frame, second = end frame). Do not mix with --start-frame/--last-frame.
- `--start-frame,--image` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Start-frame still (alias of a single --src). --image is a legacy alias.
- `--last-frame` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Last-frame still

**References**
- `-r,--reference` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Style / brand reference image (not a keyframe). Repeat as needed. Sent as OpenRouter input_references.

**Example**

```sh
tanit-cli video create -p <value>
```

**Full example**

```sh
tanit-cli video create output 'foo' -p 'foo' --provider 'foo' --model 'foo' --preset 'foo' --api-key 'foo' --duration 0 --resolution '720p' --aspect-ratio '16:9' --generate-audio --src '{}' --start-frame 'foo' --last-frame 'foo' -r '{}'
```

##### Examples

Hand-picked generation patterns beyond the auto-generated flags.

`--prompt` is required. Provider and model come from Chat settings (`video_provider` / `video_model`) unless you pass `--provider` / `--model` or `--preset`. Tanit aliases go through LiteLLM `POST /v1/videos` (OpenRouter Veo). Omit `output` to write `video_<slug>.mp4` in the implicit output folder.

**`--src` is keyframes** (at most two: first frame, last frame). **`-r,--reference` is style / brand**, not a still to animate. Do not mix `--src` with `--start-frame` / `--image` / `--last-frame`.

**Text-to-video** (fast, 4 s, 720p, no audio — cheapest Veo Lite clip)

```sh
tanit-cli video create table.mp4 `
  -p "A glass-top dining table in a sunlit room. Slow camera pan left to right." `
  --model video-fast `
  --duration 4 `
  --resolution 720p `
  --aspect-ratio 16:9
```

**Portrait / short-form**

```sh
tanit-cli video create short.mp4 `
  -p "Product spin of a copper bolt on a white studio sweep. Soft light." `
  --model video-fast `
  --duration 6 `
  --resolution 720p `
  --aspect-ratio 9:16
```

**Image-to-video** (one still → start frame)

```sh
tanit-cli video create from-still.mp4 `
  -p "The table gently appears; soft light sweeping across the glass." `
  --src first.jpg `
  --model video-fast `
  --duration 4
```

`--start-frame first.jpg` (or legacy `--image first.jpg`) is the same as a single `--src`.

**First + last frame** (two stills). Either form — not both:

```sh
tanit-cli video create morph.mp4 `
  -p "Smooth transition between the two stills. Locked camera." `
  --src first.jpg --src last.jpg `
  --model video-fast `
  --duration 6
```

```sh
tanit-cli video create morph.mp4 `
  -p "Smooth transition between the two stills. Locked camera." `
  --start-frame first.jpg --last-frame last.jpg `
  --model video-fast `
  --duration 6
```

**Style / brand refs** (not keyframes). Repeat `-r` as needed.

```sh
tanit-cli video create branded.mp4 `
  -p "Same table, brand palette and materials from the references." `
  --src first.jpg `
  -r mood.jpg -r logo.png `
  --model video-fast `
  --duration 4
```

A third `--src` is an error — put extra images on `-r`.

**Quality / 4K / native audio** (`video-deep` only for 4K; audio costs more)

```sh
tanit-cli video create showcase.mp4 `
  -p "Cinematic 360 of a glass dining table with carved legs." `
  --model video-deep `
  --duration 8 `
  --resolution 1080p `
  --generate-audio
```

```sh
tanit-cli video create showcase-4k.mp4 `
  -p "Cinematic 360 of a glass dining table with carved legs." `
  --model video-deep `
  --duration 8 `
  --resolution 4K
```

**Preset** (loads that Chat preset’s `video_provider` / `video_model` only). `--provider` / `--model` still win.

```sh
tanit-cli video create clip.mp4 -p "Slow dolly in on the table." --preset Tanit-Fast
```

**JSON stdout** (path + ok; useful for scripts)

```sh
tanit-cli video create clip.mp4 -p "Slow dolly in." --model video-fast --duration 4 --json
```

**Veo limits**

| Flag | Allowed |
|---|---|
| `--duration` | `4` / `6` / `8` (`0` = default: 4 on fast, 8 on deep) |
| `--resolution` | `720p` / `1080p` / `4K` (`4K` = `video-deep` only) |
| `--aspect-ratio` | `16:9` / `9:16` |

**List (OpenRouter Veo, no audio)**

| Model | Typical |
|---|---|
| `video-fast` (`veo-3.1-lite`) | ~$0.03/s @ 720p, ~$0.05/s @ 1080p |
| `video-deep` (`veo-3.1`) | ~$0.20/s; 4K / audio higher |

Jobs take tens of seconds to a few minutes. Status polls and `/content` downloads are not billed as extra clip seconds.

Same mapping on the XBlox **Create Video** block (`videoCreate`): `input` / `startFrame` / `lastFrame` = keyframes; `references` = style.

---

#### video info

List capture sources usable by `video image` / `video record` / `video detect`: webcam devices plus (Win32) display monitors and application windows with their `screen:` --input specs. Use --modes to also enumerate each device's supported resolutions and frame rates; --screens to show only monitors and windows.

Options:

- `-m,--modes` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enumerate supported capture modes (resolution, fps, format) for each device.
- `-s,--screens` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List ONLY display monitors and visible application windows (capture devices are also shown without this flag). Use the printed spec as --input for both `video record` and `video detect` (e.g. screen:0:wintitle=Notepad*).
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Filter to a specific device (case-insensitive substring match on name). With --modes, enumerate modes for this device only.

**Example**

```sh
tanit-cli video info
```

**Full example**

```sh
tanit-cli video info -m -s --input 'foo'
```

---

#### video image

Capture a single still frame from a webcam and save it as an image file.

Options:

- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Destination image file (.jpg / .jpeg / .png / .bmp). Relative paths are resolved from the current working directory.
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Capture source: webcam name (case-insensitive substring) OR a screen spec "screen:N" / "screen:0:wintitle=GLOB" to grab a monitor or app window (Win32). Omit to use the first/default device. Run `video info` to list devices, screens, and applications.
- `--mode` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - Mode index from `video info --modes` (0-based). Overrides --width/--height when set.
- `--width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred capture width in pixels (0 = device default).
- `--height` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred capture height in pixels (0 = device default).

**Example**

```sh
tanit-cli video image --dst <value>
```

**Full example**

```sh
tanit-cli video image --dst 'foo' --input 'foo' --mode -1 --width 0 --height 0
```

---

#### video record

Record video from a webcam OR a screen/window. Windows .mp4 uses H.264 + optional AAC audio (mic/desktop/mix). --filter deepfilter enhances mic/mix on the mux worker (not the callback). .avi uses MJPEG. macOS .mp4/.mov uses native H.264. Use --input "screen:N[:wintitle=GLOB]" for monitor/window capture. Stops after --duration-ms, on Ctrl+C, or via `video record stop`. Optional --preview and face beauty (--skin/--lips/--teeth/--face-gain/--warmth/--undereye/--redness/--eye-sharpen) use the CPU frame pump.

Options:

**Output**
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Destination file (.avi MJPEG, or .mp4/.mov H.264). Relative paths are resolved from the current working directory.
- `--duration-ms` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Stop recording after this many milliseconds (0 = run until Ctrl+C).
- `--quality` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [1 - 100]</span>, <span data-cli="default">default <span data-cli="value">85</span></span></span>) - JPEG quality for MJPEG frames (1-100; default: 85).

**Source**
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Capture source: webcam name (case-insensitive substring) OR a screen spec "screen:N" / "screen:0:wintitle=GLOB" to record a monitor or app window (Win32, same grammar as `video detect`). Omit to use the first/default device. Run `video info` to list devices, screens, and applications.
- `--mode` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - Mode index from `video info --modes` (0-based). Overrides --width/--height/--fps when set.
- `--width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred capture width in pixels (0 = device default).
- `--height` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred capture height in pixels (0 = device default).
- `--fps` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">30</span></span></span>) - Frame rate for capture and AVI header (default: 30).
- `--preview` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Live window at the captured frame size (same pixels as --width/--height/--mode; scaled down only if it will not fit the screen). Close the window to stop.
- `--capture-engine` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">fast</span> <span data-cli="choice">compat</span></span></span>) - Screen/window backend: auto prefers fast Windows Graphics Capture, fast requires it, compat uses the frame-pump recorder.
- `--no-cursor,--cursor{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Exclude the pointer from screen/window capture.

**Encode**
- `--encoder` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">nvenc</span> <span data-cli="choice">mediaFoundation</span></span></span>) - Fast Windows H.264 encoder: auto tries the optional NVENC plugin then Media Foundation; nvenc requires NVIDIA; mediaFoundation forces Windows.
- `--bitrate-kbps` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 100000]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Fast Windows H.264 bitrate in Kbps (0 = automatic from size and fps).

**Zoom**
- `--size-mode` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">native</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">native</span> <span data-cli="choice">pad</span> <span data-cli="choice">fit</span> <span data-cli="choice">fill</span></span></span>) - Fast fixed-canvas layout: native, pad, fit, or fill.
- `--zoom` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [1 - 32]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Initial fast-recorder viewport zoom multiplier.
- `--follow` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">none</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">anchor</span> <span data-cli="choice">cursor</span></span></span>) - Fast-recorder viewport tracking: none, anchor, or cursor.
- `--follow-speed` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [0.01 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.2</span></span></span>) - Cursor-follow interpolation factor.
- `--follow-deadzone` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 1000]</span>, <span data-cli="default">default <span data-cli="value">3</span></span></span>) - Cursor-follow deadzone in source pixels.
- `--transition-ms` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 10000]</span>, <span data-cli="default">default <span data-cli="value">300</span></span></span>) - Zoom transition duration.
- `--interactive-zoom` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Change zoom with Shift+mouse-wheel while recording.
- `--zoom-step` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [0.01 - 2]</span>, <span data-cli="default">default <span data-cli="value">0.15</span></span></span>) - Interactive zoom increment per wheel notch.
- `--zoom-min` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [1 - 32]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>)
- `--zoom-max` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [1 - 32]</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>)
- `--pass-zoom-input,--consume-zoom-input{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Let Shift+wheel also reach the application under the cursor.
- `--no-zoom-status,--zoom-status{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Hide the interactive recording zoom HUD.
- `--hud-capture` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">exclude</span> <span data-cli="choice">visible</span></span></span>) - HUD/frame capture policy: auto, exclude, or visible. visible allows OBS and other screen recorders to capture overlays.
- `--pause-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Global shortcut that toggles recording pause/resume, e.g. F9 or Ctrl+Shift+P. Empty disables it.
- `--stop-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Global shortcut that stops and finalizes recording, e.g. F10 or Ctrl+Shift+S. Empty disables it.

**Key Overlay**
- `--key-overlay` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show typed / shortcut keystrokes as an on-screen overlay (fast WGC).
- `--key-overlay-burn-in` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also burn keystrokes into the encoded MP4 (reserved; not yet composited).
- `--key-overlay-align` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">bottom</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">center</span> <span data-cli="choice">left</span> <span data-cli="choice">right</span> <span data-cli="choice">top</span> <span data-cli="choice">bottom</span> <span data-cli="choice">top-left</span> <span data-cli="choice">top-right</span> <span data-cli="choice">bottom-left</span> <span data-cli="choice">bottom-right</span></span></span>) - VLC-style position: center, left, right, top, bottom, top-left, top-right, bottom-left, bottom-right.
- `--key-overlay-margin-x` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 500]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Horizontal margin px (0 = auto from short edge).
- `--key-overlay-margin-y` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 500]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Vertical margin px (0 = auto from short edge).
- `--key-overlay-font-size` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 96]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Chip font size px (0 = auto ~2.2% of short edge).
- `--key-overlay-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#F8F9FB</span></span></span>) - Key label text color (#RRGGBB).
- `--key-overlay-bg-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#181B21</span></span></span>) - Chip background color (#RRGGBB).
- `--key-overlay-accent-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#EB445A</span></span></span>) - Chip accent bar color (#RRGGBB).
- `--key-overlay-opacity` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.9</span></span></span>) - Overlay opacity 0–1.
- `--key-overlay-hold-ms` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [100 - 10000]</span>, <span data-cli="default">default <span data-cli="value">1200</span></span></span>) - Fully-visible duration per keychip before fade.
- `--key-overlay-fade-ms` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 5000]</span>, <span data-cli="default">default <span data-cli="value">450</span></span></span>) - Fade-out duration after hold.
- `--key-overlay-max-entries` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [1 - 16]</span>, <span data-cli="default">default <span data-cli="value">5</span></span></span>) - Max stacked recent keychips.
- `--key-overlay-filter` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">all</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">all</span> <span data-cli="choice">printable</span> <span data-cli="choice">shortcuts</span></span></span>) - all (default), printable, or shortcuts (modifier chords only).
- `--key-overlay-stack` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">up</span> <span data-cli="choice">down</span></span></span>) - Chip stack growth: auto (bottom→up, else down), up, or down.
- `--no-key-overlay-modifiers,--key-overlay-modifiers{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Omit Ctrl/Alt/Shift/Win prefixes on displayed chords.
- `--key-overlay-capture` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">visible</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">inherit</span> <span data-cli="choice">auto</span> <span data-cli="choice">exclude</span> <span data-cli="choice">visible</span></span></span>) - Key overlay capture policy: visible (default, in MP4), inherit (use --hud-capture), auto, or exclude.

**Cursor**
- `--cursor-highlight` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Soft highlight ring around the pointer (fast WGC).
- `--cursor-highlight-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#F5C542</span></span></span>) - Cursor highlight color (#RRGGBB).
- `--cursor-highlight-size` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 256]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Highlight diameter px (0 = auto).
- `--cursor-clicks` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Click ripple animations (fast WGC).
- `--cursor-click-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#EB445A</span></span></span>) - Click ripple color (#RRGGBB).
- `--cursor-trail` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Short motion trail behind the pointer (fast WGC).
- `--hide-cursor-when-typing` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Hide the OS cursor while typing (fast WGC).

**Camera**
- `--camera-overlay` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Picture-in-picture webcam over the recording (fast WGC path). Face / background flags (--skin, --blur, --mirror, …) apply to this PiP camera only; the screen stays on the fast recorder.
- `--camera-input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - PiP camera device name substring (empty = default).
- `--camera-position` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">bottom-right</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">top-left</span> <span data-cli="choice">top-right</span> <span data-cli="choice">bottom-left</span> <span data-cli="choice">bottom-right</span></span></span>) - PiP corner: top-left, top-right, bottom-left, bottom-right.
- `--camera-size` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [4 - 80]</span>, <span data-cli="default">default <span data-cli="value">22</span></span></span>) - PiP size as percent of short output edge (4–80).
- `--camera-resolution` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">auto</span></span></span>) - Webcam capture mode: auto (PiP-sized), max (highest native), or WxH[@fps] / 720p / 1080p / 4k (nearest native mode).
- `--camera-shape` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">circle</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">circle</span> <span data-cli="choice">rounded</span> <span data-cli="choice">square</span></span></span>) - PiP mask: circle, rounded, or square.
- `--no-camera-border,--camera-border{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Disable PiP border.
- `--camera-border-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#FFFFFF</span></span></span>) - PiP border color (#RRGGBB).
- `--no-camera-shadow,--camera-shadow{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Disable PiP drop shadow.
- `--camera-audio` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include the webcam microphone in the recording mix (matched from --camera-input; works with --audio-source none/mic/desktop/mix).
- `--camera-audio-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [0 - 4]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Linear gain for the webcam mic (0 = mute, 1 = unity).

**Audio**
- `--audio-source` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">none</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">none</span> <span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Mux audio into MP4: none (default), mic, desktop (system loopback), or mix.
- `--audio-device` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Mic device name substring for --audio-source mic/mix. Omit to use the system default input device.
- `--desktop` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Loopback device name substring for --audio-source desktop/mix (empty = default render device). Implies desktop when --audio-source is omitted.
- `--mic-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Mic level multiplier (linear; 0 = mute, 1 = unity). Used with mix.
- `--desktop-gain` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Desktop/loopback level multiplier (linear). Used with desktop or mix.
- `--audio-normalize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Reserved: normalize mixed audio level before AAC encode.
- `--audio-auto-gain` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Reserved: gentle automatic gain on the microphone path.

**Idle**
- `--auto-pause` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">off</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">visual</span> <span data-cli="choice">audio</span> <span data-cli="choice">both</span></span></span>) - Skip dead air in the MP4: off (default), visual, audio, or both. WGC/WASAPI stay running; encoder writes pause.
- `--auto-pause-idle-ms` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 60000]</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Overall idle timer before PauseIdle (0 with auto-pause off).
- `--auto-pause-grid` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">32x18</span></span></span>) - Logical tile grid WxH (default 32x18).
- `--no-auto-pause-mic-wake,--auto-pause-mic-wake{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Disable speech-mic RMS/peak as idle activity (audio|both).
- `--auto-pause-mic-activity-db` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT bounded to [-90 - 0]</span>, <span data-cli="default">default <span data-cli="value">-40</span></span></span>) - Mic activity threshold in dBFS (not VAD). Default -40.
- `--auto-pause-preroll-ms` (<span data-cli="meta"><span data-cli="type">INT:INT bounded to [0 - 2000]</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Video frames kept while auto-paused and flushed on resume.
- `--no-auto-pause-wake-key,--auto-pause-wake-key{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Ignore keyboard/click/wheel as activity.
- `--no-auto-pause-wake-mouse,--auto-pause-wake-mouse{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Ignore mouse movement as activity.

**Captions**
- `--captions` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">off</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">off</span> <span data-cli="choice">sidecar</span> <span data-cli="choice">srt</span> <span data-cli="choice">vtt</span> <span data-cli="choice">sbv</span> <span data-cli="choice">all</span></span></span>) - After finalize, transcribe the encoded-timeline dump: off or sidecar.
- `--caption-format` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">srt</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">srt</span> <span data-cli="choice">vtt</span> <span data-cli="choice">sbv</span> <span data-cli="choice">all</span></span></span>) - Sidecar format: srt (default), vtt, sbv, or all.
- `--stt-preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat preset whose STT provider/model captionStt inherits.
- `--stt-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Caption STT provider override (empty = App Settings).
- `--stt-model` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Caption STT model override (empty = App Settings).

**Beauty**
- `--face,--no-face{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Run FaceLandmarker (off unless set; implied by --skin/--lips/--teeth and the other face filters).
- `--skin,--no-skin{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Smooth skin (face oval minus eyes/lips). Slow at 1080p.
- `--skin-strength` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.5</span></span></span>) - Skin smoothing strength 0..1.
- `--lips,--no-lips{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Tint lips (Lab a/b toward --lips-color).
- `--lips-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#C45C6A</span></span></span>) - Lip tint as #RRGGBB (quote it in PowerShell: "#C41E3A").
- `--lips-alpha` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.35</span></span></span>) - Lip tint alpha 0..1.
- `--teeth,--no-teeth{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Whiten teeth (inner-lip mask, Lab b* toward neutral).
- `--teeth-strength` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.4</span></span></span>) - Teeth whitening strength 0..1.
- `--model-face` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - FaceLandmarker .task path. Empty = bundled models/vision/face_landmarker_v2.task.
- `--dll` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Diagnostic override for pixlwiz_face_landmarker.dll.
- `--show-landmarks` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Draw landmark overlay (debug).
- `--face-gain` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Lift crushed face exposure (Lab L* toward a meeting target). 0 = off, 1 = full. Same oval as --skin.
- `--warmth` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Warm the face oval (Lab b*). 0 = off, 1 = full.
- `--undereye,--no-undereye{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Lighten under-eye bands (dark circles).
- `--undereye-blend` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.45</span></span></span>) - Under-eye mix 0..1.
- `--redness,--no-redness{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Mute flush / acne (pull Lab a* toward neutral on the face oval).
- `--redness-blend` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.4</span></span></span>) - Redness mute mix 0..1.
- `--eye-sharpen,--no-eye-sharpen{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Unsharp the eye polys (restores focus after --skin).
- `--eye-sharpen-blend` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.35</span></span></span>) - Eye sharpen mix 0..1.

**Frame**
- `--mirror,--no-mirror{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Horizontal flip (webcam mirror). No model.

**Background**
- `--blur,--no-blur{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Blur the non-person background (ImageSegmenter).
- `--background,--no-background{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Replace the non-person background with --bg-color / --bg-image.
- `--blur-strength` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.65</span></span></span>) - Background blur mix 0..1.
- `--feather-px` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - Person-mask feather in pixels.
- `--bg-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#1A1A1A</span></span></span>) - Solid replacement color (#RRGGBB). Quote it in PowerShell.
- `--bg-image` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replacement background image (scaled to the frame).
- `--model-seg` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ImageSegmenter .task path. Empty = bundled models/vision/selfie_segmenter.task.

**Example**

```sh
tanit-cli video record
```

**Full example**

```sh
tanit-cli video record --dst 'foo' --input 'foo' --mode -1 --width 0 --height 0 --fps 30 --preview --capture-engine 'auto' --encoder 'auto' --bitrate-kbps 0 --no-cursor --size-mode 'native' --zoom '1' --follow 'none' --follow-speed '0.2' --follow-deadzone 3 --transition-ms 300 --interactive-zoom --zoom-step '0.15' --zoom-min '1' --zoom-max '4' --pass-zoom-input --no-zoom-status --hud-capture 'auto' --pause-key 'foo' --stop-key 'foo' --key-overlay --key-overlay-burn-in --key-overlay-align 'bottom' --key-overlay-margin-x 0 --key-overlay-margin-y 0 --key-overlay-font-size 0 --key-overlay-color '#F8F9FB' --key-overlay-bg-color '#181B21' --key-overlay-accent-color '#EB445A' --key-overlay-opacity '0.9' --key-overlay-hold-ms 1200 --key-overlay-fade-ms 450 --key-overlay-max-entries 5 --key-overlay-filter 'all' --key-overlay-stack 'auto' --no-key-overlay-modifiers --key-overlay-capture 'visible' --cursor-highlight --cursor-highlight-color '#F5C542' --cursor-highlight-size 0 --cursor-clicks --cursor-click-color '#EB445A' --cursor-trail --hide-cursor-when-typing --camera-overlay --camera-input 'foo' --camera-position 'bottom-right' --camera-size '22' --camera-resolution 'auto' --camera-shape 'circle' --no-camera-border --camera-border-color '#FFFFFF' --no-camera-shadow --camera-audio --camera-audio-gain '1' --duration-ms 0 --quality 85 --audio-source 'none' --audio-device 'foo' --desktop 'foo' --mic-gain '1' --desktop-gain '1' --audio-normalize --audio-auto-gain --auto-pause 'off' --auto-pause-idle-ms 3000 --auto-pause-grid '32x18' --no-auto-pause-mic-wake --auto-pause-mic-activity-db '-40' --auto-pause-preroll-ms 500 --no-auto-pause-wake-key --no-auto-pause-wake-mouse --captions 'off' --caption-format 'srt' --stt-preset 'foo' --stt-provider 'foo' --stt-model 'foo' --face --skin --skin-strength '0.5' --lips --lips-color '#C45C6A' --lips-alpha '0.35' --teeth --teeth-strength '0.4' --model-face 'foo' --dll 'foo' --show-landmarks --mirror --face-gain '0' --warmth '0' --undereye --undereye-blend '0.45' --redness --redness-blend '0.4' --eye-sharpen --eye-sharpen-blend '0.35' --blur --background --blur-strength '0.65' --feather-px 8 --bg-color '#1A1A1A' --bg-image 'foo' --model-seg 'foo'
```

##### Examples

Hand-picked HQ screen-recording patterns beyond the auto-generated flags.

**Monitor → MP4** (fast WGC on Windows; H.264 + optional AAC audio)

```sh
tanit-cli video record --input "screen:0" --dst demo.mp4 --fps 30 --duration-ms 10000
```

**Portrait / short-form canvas with cursor follow**

```sh
tanit-cli video record `
  --input "screen:0" `
  --dst short.mp4 `
  --width 1080 --height 1920 `
  --size-mode fill `
  --follow cursor `
  --bitrate-kbps 20000 `
  --fps 30
```

**Square viewport + interactive zoom** (Shift+wheel while recording)

```sh
tanit-cli video record `
  --input "screen:0" `
  --dst square.mp4 `
  --width 1080 --height 1080 `
  --size-mode fill `
  --interactive-zoom `
  --bitrate-kbps 18000
```

**Desktop audio mux** (48 kHz stereo AAC in MP4)

```sh
tanit-cli video record --input "screen:0" --dst walkthrough.mp4 --audio-source desktop
```

**Mic + desktop mix**

```sh
tanit-cli video record --input "screen:0" --dst tutorial.mp4 --audio-source mix --mic-gain 0.9
```

**Live DeepFilterNet on mic/mix** (worker hop into AAC; not on the capture callback). Desktop-only loopback stays dry.

```sh
tanit-cli video record --input "screen:0" --dst talk.mp4 --audio-source mic --filter deepfilter --pf
```

**Window or picked region**

```text
screen:0:hwnd=123456
screen:0:wintitle=Tanit*
screen:0:hwnd=123456:rrect=120,80,900,900
```

**Webcam → MP4** (omit `--input` for the default camera; `video info` lists names)

```sh
tanit-cli video record --dst rec.mp4 --preview --width 1280 --height 720
tanit-cli video record --input "Sony" --dst rec.mp4 --duration-ms 8000
```

**Mirror** (horizontal flip; no model). Face beauty, blur, and virtual cam also force the compatibility CPU pump — WGC zoom / follow / `--bitrate-kbps` do not apply.

```sh
tanit-cli video record --dst rec.mp4 --preview --mirror --width 1280 --height 720
```

**Face beauty** (off unless you pass a flag). Quote hex colors in PowerShell (`"#C41E3A"`). `--skin` is the heavy one at 1080p.

```sh
tanit-cli video record --dst rec-lips.mp4 --lips --preview --duration-ms 8000
tanit-cli video record --dst rec-mesh.mp4 --skin --lips --teeth --preview --width 1280 --height 720
tanit-cli video record --dst rec-hot.mp4 --lips --lips-color "#C41E3A" --lips-alpha 0.55 --preview
tanit-cli video record --dst rec-meet.mp4 --preview --width 1280 --height 720 --face-gain 0.35 --warmth 0.3 --undereye --redness --eye-sharpen
```

**Screen + PiP webcam** (fast WGC). Face / background flags apply to the circle only.

```sh
tanit-cli video record --input "screen:0" --dst demo.mp4 --camera-overlay --skin --blur --mirror --width 1920 --height 1080
```

**Virtual webcam** (Windows 11). Zoom / Teams see **Tanit Cam**. `--dst` is optional. Output is always 1280×720 @ 30.

```sh
tanit-cli video record --virtual-out --preview --mirror --lips
tanit-cli video record --virtual-out --dst rec.mp4 --skin --preview --width 1280 --height 720
```

**Background blur / replace** (person stays sharp). Same flags on `video filter` for a still first. Probe with `tanit-cli video filter --status`.

```sh
tanit-cli video record --preview --blur --width 1280 --height 720
tanit-cli video record --preview --background --bg-color "#1A1A1A" --width 1280 --height 720
tanit-cli video record --preview --background --bg-image wall.png --feather-px 12
```

**Still / clip test harness** (same flags; not the live product path)

```sh
tanit-cli video filter --status
tanit-cli video filter --input face.jpg --dst out.png --mirror --lips --running-mode image
tanit-cli video filter --input face.jpg --dst out-meet.png --face-gain 0.35 --warmth 0.3 --undereye --redness --eye-sharpen --running-mode image
tanit-cli video filter --input face.jpg --dst out-blur.png --blur --no-face --running-mode image
tanit-cli video filter --input face.jpg --dst out.png --lips --preview --running-mode image
```

**Engine notes**

| `--capture-engine` | Zoom / follow / `--bitrate-kbps` | Typical use |
|---|---|---|
| `auto` | ✅ when fast path starts | Default; falls back to compat |
| `fast` | ✅ required | HQ window/monitor capture (Windows) |
| `compat` | ❌ ignored | Portable frame-pump fallback |

Cooperative stop / status:

```sh
tanit-cli video record stop
tanit-cli video record status --json
```

On completion, check **frames**, **droppedFrames**, and **effectiveBitrateKbps** (fast path).

#### video record stop

Signal a running `video record` session in another terminal to stop cooperatively.

**Example**

```sh
tanit-cli video record stop
```

---

#### video record status

Show the active `video record` session (device, mode, codec, elapsed time, frames, dst).

**Example**

```sh
tanit-cli video record status
```

---

#### video detect

Real-time YOLO-format object detection from a webcam. Outputs NDJSON frames to stdout; prints a summary on exit. Requires FEATURE_VIDEO_DETECTION (FEATURE_VIDEO + FEATURE_ONNX).

Options:

- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - YOLO ONNX model (e.g. yolov8n.onnx).
- `-i,--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Capture source: camera device name (case-insensitive substring; default = first device), a monitor "screen:N", or a window "screen:0:wintitle=GLOB". GLOB is a full-title match (*, ?), so wrap with stars: screen:0:wintitle=*Chrome*. See `video info --screens` for available screens/windows.
- `--width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred capture width  (0 = device default).
- `--height` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Preferred capture height (0 = device default).
- `--fps` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">30</span></span></span>) - Preferred capture frame rate (default 30).
- `--conf` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.25</span></span></span>) - Confidence threshold (default 0.25).
- `--nms` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span>, <span data-cli="default">default <span data-cli="value">0.45</span></span></span>) - NMS IoU threshold (default 0.45).
- `--input-size` (<span data-cli="meta"><span data-cli="type">INT:INT in [32 - 4096]</span>, <span data-cli="default">default <span data-cli="value">640</span></span></span>) - Model input size in pixels (default 640).
- `--every-n` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Run YOLO every N captured frames — drop intermediate frames (default 1).
- `-j,--threads` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 256]</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - ONNX intra-op thread count (default 4).
- `--duration-ms` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Stop after N milliseconds (0 = run until Ctrl+C).
- `--task` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">detect</span> <span data-cli="choice">classify</span> <span data-cli="choice">cls</span> <span data-cli="choice">obb</span> <span data-cli="choice">pose</span> <span data-cli="choice">segment</span> <span data-cli="choice">seg</span></span></span>) - YOLO head to decode: auto|detect|classify|obb|pose|segment. auto (default) infers detect/classify/segment from the model; obb/pose must be requested explicitly. segment emits a mask polygon (contour) per box (no OpenCV).
- `--top-k` (<span data-cli="meta"><span data-cli="type">INT:POSITIVE</span>, <span data-cli="default">default <span data-cli="value">5</span></span></span>) - classify task: number of top predictions to emit per frame (default 5).
- `--classes` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma-separated class label list matching model output class indices (e.g. 'person,bicycle,car,...'). Overridden by --labels-yaml.
- `--labels-yaml` (<span data-cli="meta"><span data-cli="type">TEXT:FILE</span></span>) - Path to a YOLO data.yaml; reads the 'names:' block as class labels. Takes precedence over --classes.
- `--save-frames` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Directory to save every captured frame as JPEG (useful for building a training dataset).
- `--filter-classes,--only` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Only emit NDJSON lines for frames that contain at least one box whose label matches (case-insensitive substring). Frames with no matching detections are silently skipped. Can be specified multiple times or as a comma-separated list (e.g. --filter-classes cat --filter-classes car).
- `-q,--quiet` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Suppress the per-frame NDJSON stream on stdout (the final summary line still prints). Handy for --visualize-only runs. Combine with --no-summary for total silence, or redirect stdout (1>$null).
- `--no-summary` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also suppress the end-of-run summary line on stdout.
- `--max-objects,--max-det` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span></span>) - Keep only the top-N detections per frame (0 = unlimited). Selection is sticky across frames (follows the same object by position) so a single box doesn't hop between similar objects. Applies after --filter-classes, to both the NDJSON output and the overlay. E.g. --max-objects 1 = single object.
- `--max-by` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">conf</span> <span data-cli="choice">area</span></span></span>) - Priority when picking which object(s) to keep for --max-objects: 'conf' (default, highest confidence) or 'area' (largest extent — the biggest / closest object).
- `--smooth-alpha` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span></span>) - EMA smoothing factor for overlay bounding boxes (0=maximum smooth, 1=raw/no smoothing, default 0.35). Only affects visualization.
- `--smooth-age` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span></span>) - Frames a detection persists in the overlay after it disappears (prevents flashing, default 4). Set 0 to disable persistence.
- `-V,--visualize` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Open an on-screen visualization window with bounding boxes. Mode is auto-selected: transparent overlay for screen: inputs, preview window for webcam. Override with --visualize-mode.
- `--visualize-mode` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">overlay</span> <span data-cli="choice">preview</span></span></span>) - Visualization mode: auto (default), overlay (transparent topmost window over source rect), or preview (windowed frame + boxes).
- `--no-stats,--stats{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Hide the stats bar (frame / infer_ms / fps / box count) from the visualization window.
- `--no-labels,--labels{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Hide class label + confidence text above each bounding box.
- `--fill-alpha` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 255]</span></span>) - Box fill opacity 0–255 (0 = border-only, default 40).
- `--smooth-min-hits` (<span data-cli="meta"><span data-cli="type">INT:NONNEGATIVE</span></span>) - Frames a track must be seen before it is shown (confirmation / "min age"; default 0 = show immediately). Suppresses one-frame false positives in the overlay.
- `--track-ids` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Assign a stable track id per object and show it (#id) with a per-track color in the overlay.
- `--track-two-stage` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - ByteTrack-style association: match high-confidence detections first, then recover lost tracks with leftover low-confidence ones (fewer id switches through occlusion).
- `--track-conf-high` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span></span>) - High/low confidence split for --track-two-stage (default 0.50).
- `--no-track-center,--track-center{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Center-distance fallback: match by nearest predicted center when IoU=0 (recovers fast movers). On by default.
- `--track-center-dist` (<span data-cli="meta"><span data-cli="type">FLOAT:NONNEGATIVE</span></span>) - Center-distance gate as a multiple of the box mean side (w+h)/2 (default 1.2). Larger = match farther jumps.
- `--track-vel-blend` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span></span>) - Velocity EMA factor for prediction during dropouts (higher = steadier but laggier, default 0.7).
- `--kpt-min-score` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0 - 1]</span></span>) - Min pose keypoint score to update a joint; weaker joints freeze at their last good position (default 0.30). Reduces off-body joint snapping.
- `--provider` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">cpu</span> <span data-cli="choice">cuda</span></span></span>) - ONNX execution provider: auto (default, try CUDA then CPU), cpu, or cuda (hard-require NVIDIA CUDA EP). Requires FEATURE_ONNX_CUDA=ON for CUDA.
- `--gpu-stats,--vram` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include best-effort NVIDIA VRAM telemetry in the final summary (requires nvidia-smi; ignored if unavailable).

**Example**

```sh
tanit-cli video detect -m <value>
```

**Full example**

```sh
tanit-cli video detect -m 'foo' -i 'foo' --width 0 --height 0 --fps 30 --conf '0.25' --nms '0.45' --input-size 640 --every-n 1 -j 4 --duration-ms 0 --task 'auto' --top-k 5 --classes 'foo' --labels-yaml 'foo' --save-frames 'foo' --filter-classes '{}' -q --no-summary --max-objects 0 --max-by 'conf' --smooth-alpha '0.35' --smooth-age 4 -V --visualize-mode 'auto' --no-stats --no-labels --fill-alpha 40 --smooth-min-hits 0 --track-ids --track-two-stage --track-conf-high '0.5' --no-track-center --track-center-dist '1.2' --track-vel-blend '0.7' --kpt-min-score '0.3' --provider 'auto' --gpu-stats
```

---

#### video filter

Test harness: file/still in → face beauty → file out. Product capture path is `video record` (same flags).

Options:

- `--input,--src` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input video or still image path.
- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output video or still image path.
- `--status` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print MediaPipe bridge / model capability and exit.
- `--preview` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show a live window of the processed frames (same pixels as the output). Close the window to stop. Stills stay open until you close them.
- `--running-mode` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">video</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">image</span> <span data-cli="choice">video</span></span></span>) - image | video. video uses DetectForVideo timestamps. Default: image for stills, video for clips.

**Beauty**
- `--face,--no-face{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">true</span></span></span>) - Run FaceLandmarker (default on for this command).
- `--skin,--no-skin{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Smooth skin (face oval minus eyes/lips). Slow at 1080p.
- `--skin-strength` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.5</span></span></span>) - Skin smoothing strength 0..1.
- `--lips,--no-lips{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Tint lips (Lab a/b toward --lips-color).
- `--lips-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#C45C6A</span></span></span>) - Lip tint as #RRGGBB (quote it in PowerShell: "#C41E3A").
- `--lips-alpha` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.35</span></span></span>) - Lip tint alpha 0..1.
- `--teeth,--no-teeth{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Whiten teeth (inner-lip mask, Lab b* toward neutral).
- `--teeth-strength` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.4</span></span></span>) - Teeth whitening strength 0..1.
- `--model-face` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - FaceLandmarker .task path. Empty = bundled models/vision/face_landmarker_v2.task.
- `--dll` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Diagnostic override for pixlwiz_face_landmarker.dll.
- `--show-landmarks` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Draw landmark overlay (debug).
- `--face-gain` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Lift crushed face exposure (Lab L* toward a meeting target). 0 = off, 1 = full. Same oval as --skin.
- `--warmth` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Warm the face oval (Lab b*). 0 = off, 1 = full.
- `--undereye,--no-undereye{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Lighten under-eye bands (dark circles).
- `--undereye-blend` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.45</span></span></span>) - Under-eye mix 0..1.
- `--redness,--no-redness{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Mute flush / acne (pull Lab a* toward neutral on the face oval).
- `--redness-blend` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.4</span></span></span>) - Redness mute mix 0..1.
- `--eye-sharpen,--no-eye-sharpen{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Unsharp the eye polys (restores focus after --skin).
- `--eye-sharpen-blend` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.35</span></span></span>) - Eye sharpen mix 0..1.

**Frame**
- `--mirror,--no-mirror{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Horizontal flip (webcam mirror). No model.

**Background**
- `--blur,--no-blur{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Blur the non-person background (ImageSegmenter).
- `--background,--no-background{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Replace the non-person background with --bg-color / --bg-image.
- `--blur-strength` (<span data-cli="meta"><span data-cli="type">FLOAT</span>, <span data-cli="default">default <span data-cli="value">0.65</span></span></span>) - Background blur mix 0..1.
- `--feather-px` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - Person-mask feather in pixels.
- `--bg-color` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">#1A1A1A</span></span></span>) - Solid replacement color (#RRGGBB). Quote it in PowerShell.
- `--bg-image` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Replacement background image (scaled to the frame).
- `--model-seg` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - ImageSegmenter .task path. Empty = bundled models/vision/selfie_segmenter.task.

**Example**

```sh
tanit-cli video filter
```

**Full example**

```sh
tanit-cli video filter --input 'foo' --dst 'foo' --status --preview --face --skin --skin-strength '0.5' --lips --lips-color '#C45C6A' --lips-alpha '0.35' --teeth --teeth-strength '0.4' --model-face 'foo' --dll 'foo' --show-landmarks --mirror --face-gain '0' --warmth '0' --undereye --undereye-blend '0.45' --redness --redness-blend '0.4' --eye-sharpen --eye-sharpen-blend '0.35' --blur --background --blur-strength '0.65' --feather-px 8 --bg-color '#1A1A1A' --bg-image 'foo' --model-seg 'foo' --running-mode 'video'
```

#### bluetooth

Bluetooth and audio-endpoint management: list, pair, and connect devices.

**Example**

```sh
tanit-cli bluetooth list
```

**Full example**

```sh
tanit-cli bluetooth list --nearby --endpoints --no-switch
```

#### bluetooth list

List paired/connected Bluetooth devices (and optionally audio endpoints). Implicitly routes audio to a connected Bluetooth audio device.

Options:

- `--nearby` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also issue an inquiry for nearby discoverable devices (slow).
- `--endpoints` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also list playback audio endpoints.
- `--no-switch` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not implicitly change the default playback endpoint.

**Example**

```sh
tanit-cli bluetooth list
```

**Full example**

```sh
tanit-cli bluetooth list --nearby --endpoints --no-switch
```

---

#### bluetooth endpoints

List MMDevice audio endpoints (playback by default).

Options:

- `--capture` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - List recording (capture) endpoints instead of playback.

**Example**

```sh
tanit-cli bluetooth endpoints
```

**Full example**

```sh
tanit-cli bluetooth endpoints --capture
```

---

#### bluetooth connect

Connect a Bluetooth audio device (pairs if needed) and route audio to it.

Options:

- `id,--id,--name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Device address (AA:BB:CC:DD:EE:FF) or name substring.
- `--no-switch` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Connect only; do not change the default playback endpoint.
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">6000</span></span></span>) - How long to wait for the audio endpoint to appear (default 6000).

**Example**

```sh
tanit-cli bluetooth connect id,--id,--name <id>
```

**Full example**

```sh
tanit-cli bluetooth connect id,--id,--name 'foo' --no-switch --timeout-ms 6000
```

---

#### bluetooth disconnect

Disconnect a Bluetooth audio device (best-effort).

Options:

- `id,--id,--name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Device address or name substring.

**Example**

```sh
tanit-cli bluetooth disconnect id,--id,--name <id>
```

**Full example**

```sh
tanit-cli bluetooth disconnect id,--id,--name 'foo'
```

---

#### bluetooth pair

Pair a Bluetooth device.

Options:

- `id,--id,--name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Device address or name substring.

**Example**

```sh
tanit-cli bluetooth pair id,--id,--name <id>
```

**Full example**

```sh
tanit-cli bluetooth pair id,--id,--name 'foo'
```

---

#### bluetooth unpair

Remove (unpair) a Bluetooth device.

Options:

- `id,--id,--name` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Device address or name substring.

**Example**

```sh
tanit-cli bluetooth unpair id,--id,--name <id>
```

**Full example**

```sh
tanit-cli bluetooth unpair id,--id,--name 'foo'
```

---

#### bluetooth set-default

Set an audio endpoint as the default device for all roles.

Options:

- `id,--id` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - MMDevice endpoint id (from `bluetooth endpoints`).

**Example**

```sh
tanit-cli bluetooth set-default id,--id <id>
```

**Full example**

```sh
tanit-cli bluetooth set-default id,--id 'foo'
```

### Automation

#### xblox

Run XBlox block-tree command flows.

Options:

- `--log-level` (<span data-cli="meta"><span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trace</span> <span data-cli="choice">debug</span> <span data-cli="choice">info</span> <span data-cli="choice">warn</span> <span data-cli="choice">warning</span> <span data-cli="choice">error</span> <span data-cli="choice">err</span> <span data-cli="choice">critical</span> <span data-cli="choice">off</span> <span data-cli="choice">none</span></span></span>) - Alias for the global --log-level option when using `xblox --log-level ... run`.

**Example**

```sh
tanit-cli xblox info
```

**Full example**

```sh
tanit-cli xblox info --commands 'foo'
```

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

#### XBlox diagram generation

Standalone SVG (stdout):

```bash
tanit-cli xblox run --src dist/shared/xblox/stt-journal-ex.xblox --diagram > diagram.svg
```

Write `.svg` / `.png` files directly (no markdown):

```bash
tanit-cli xblox run --src dist/shared/xblox/stt-journal-ex.xblox --diagram --diagram-dst diagram.svg
tanit-cli xblox run --src dist/shared/xblox/stt-journal-ex.xblox --diagram --diagram-png diagram.png
```

Embed in markdown sidecar (with context bullets + title):

```bash
tanit-cli xblox run --src script.xblox --md --diagram > script.en.md
tanit-cli xblox run --src script.xblox --md --diagram --mermaid-direction LR
```

Custom styles and render knobs:

```bash
tanit-cli xblox run --src script.xblox --diagram \
  --styles "${TANIT_SHARED}/xblox-diagram-constants.json" \
  --show-arrows true \
  --show-links true \
  --show-disabled false \
  --show-variables true \
  --show-groups true \
  --humanize-node-names true \
  --show-variable-delimiters false \
  --variable-link-style unicode \
  --variable-input-style at \
  --diagram-dst ./out/diagram.svg
```

Variable formatting knobs in `render`:
- `variableLinkStyle`: `unicode` (→), `arrow` (->), `colon`, `dot`, `equals`, `none`
- `variableInputStyle`: `at` (@name), `parens`, `bracket`, `none`
- `node.variableOperatorFill`: muted color for separators (default `#BBBBBB`)

`render.showVariableDelimiters=false` shows plain variable names (still tinted via `node.variableFill`). Styles JSON defaults apply; CLI flags override when passed.

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

### Developer

#### test

Developer probes: low-level core and UI tests.

**Example**

```sh
tanit-cli test core string
```

**Full example**

```sh
tanit-cli test core string --profile 'common' --input 'foo' --input-file 'foo'
```

#### test core

Low-level JSON probes for sanitizer, filesystem guard, and compression tests.

**Example**

```sh
tanit-cli test core string
```

**Full example**

```sh
tanit-cli test core string --profile 'common' --input 'foo' --input-file 'foo'
```

#### test core string

Apply a registered text sanitizer profile to --input.

Options:

- `--profile` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">common</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">common</span> <span data-cli="choice">html</span> <span data-cli="choice">markdown</span> <span data-cli="choice">skill</span> <span data-cli="choice">strip-bom</span> <span data-cli="choice">repair-utf8</span> <span data-cli="choice">ascii</span> <span data-cli="choice">html-comments</span> <span data-cli="choice">html-dangerous</span></span></span>) - common, html, markdown, skill, strip-bom, repair-utf8, ascii, html-comments, html-dangerous
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Input text
- `--input-file` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - UTF-8/binary input file to sanitize

**Example**

```sh
tanit-cli test core string
```

**Full example**

```sh
tanit-cli test core string --profile 'common' --input 'foo' --input-file 'foo'
```

---

#### test core path

Run string path cleanup helpers against --input.

Options:

- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Input path

**Example**

```sh
tanit-cli test core path --input <value>
```

**Full example**

```sh
tanit-cli test core path --input 'foo'
```

---

#### test core id

Run UUID/id/group/permission cleanup helpers against --input.

Options:

- `--kind` (<span data-cli="meta"><span data-cli="tag" data-variant="required">required</span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">uuid</span> <span data-cli="choice">id</span> <span data-cli="choice">group</span> <span data-cli="choice">permission</span> <span data-cli="choice">permissions</span></span></span>) - uuid, id, group, permission, permissions
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Input value

**Example**

```sh
tanit-cli test core id --kind <value> --input <value>
```

**Full example**

```sh
tanit-cli test core id --kind 'uuid' --input 'foo'
```

---

#### test core commands

Command schema / registry probe: shared parameter dump, exact options_path, seeded app-command compat.

**Example**

```sh
tanit-cli test core commands
```

---

#### test core fs-guard

Run LLM filesystem guard policy against --path.

Options:

- `--mode` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">read</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">read</span> <span data-cli="choice">sensitive</span> <span data-cli="choice">write</span></span></span>) - read, sensitive, or write
- `--path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to check

**Example**

```sh
tanit-cli test core fs-guard --path <path>
```

**Full example**

```sh
tanit-cli test core fs-guard --mode 'read' --path 'foo'
```

---

#### test core url-schemes

URL scheme parsing and variable expansion probes.

**Example**

```sh
tanit-cli test core url-schemes parse --uri <uri>
```

**Full example**

```sh
tanit-cli test core url-schemes parse --uri 'foo'
```

#### test core url-schemes parse

Validate and parse a tanit:// URI, including fragment/locate data.

Options:

- `--uri` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - tanit:// URI to parse and validate

**Example**

```sh
tanit-cli test core url-schemes parse --uri <uri>
```

**Full example**

```sh
tanit-cli test core url-schemes parse --uri 'foo'
```

---

#### test core url-schemes variables

Expand ${VAR} templates using the URI-safe restricted VariableMap (no ENV:, no session context).

Options:

- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Template string to expand

**Example**

```sh
tanit-cli test core url-schemes variables --input <value>
```

**Full example**

```sh
tanit-cli test core url-schemes variables --input 'foo'
```

---

#### test core iterator

Async JSON field iterator: jq path selection + pluggable transformer (upper/prefix/identity; llm = prompt-shaped stub for agent wiring).

Options:

- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - JSON text
- `--input-file` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - JSON file
- `--path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">.items[].name</span></span></span>) - jq filter selecting string leaves (JSONPath-ish $./[*] accepted)
- `--target-path` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Write result to sibling key instead of in-place (e.g. label_de). Ignored with --merge-json.
- `--merge-json` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Expect JSON object from transformer; hard-overwrite-merge onto parent (existing keys replaced).
- `--transform` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">upper</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">upper</span> <span data-cli="choice">prefix</span> <span data-cli="choice">identity</span> <span data-cli="choice">llm</span> <span data-cli="choice">json-stub</span></span></span>) - upper, prefix, identity, llm, json-stub
- `--prefix` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">x</span></span></span>) - Prefix string when --transform prefix
- `--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Prompt template when --transform llm (echo stub for now)
- `--out` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional path to write transformed JSON
- `--concurrency` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 64]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Max concurrent transforms
- `--throttle-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 60000]</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Min delay between transform starts

**Example**

```sh
tanit-cli test core iterator
```

**Full example**

```sh
tanit-cli test core iterator --input 'foo' --input-file 'foo' --path '.items[].name' --target-path 'foo' --merge-json --transform 'upper' --prefix 'x' --prompt 'foo' --out 'foo' --concurrency 1 --throttle-ms 0
```

---

#### test core tokenize

ModernBERT byte-level BPE parity probe: dump [CLS]+subtokens+[SEP] ids and word_ids for --input using a vocab-only GGUF (--vocab). Compare against the HF reference fixture.

Options:

- `--vocab` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to vocab-only ModernBERT GGUF
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Text to tokenize (split on ASCII whitespace)
- `--max-len` (<span data-cli="meta"><span data-cli="type">INT:INT in [2 - 8192]</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Max sequence length incl. [CLS]/[SEP] (default 512)

**Example**

```sh
tanit-cli test core tokenize --vocab <value> --input <value>
```

**Full example**

```sh
tanit-cli test core tokenize --vocab 'foo' --input 'foo' --max-len 512
```

---

#### test core kompress

Run the Kompress ONNX text scorer over --input/--input-file: keep important words. Uses --onnx + --vocab when set; otherwise shipped exe/../models/kompress, then ${MODELS_DIR}/kompress.

Options:

- `--onnx` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - kompress-int8-wo.onnx (default: shipped, then ${MODELS_DIR})
- `--vocab` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - modernbert-vocab.gguf (default: shipped, then ${MODELS_DIR})
- `--input` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Text to compress
- `--input-file` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - File alternative to --input
- `--ratio` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [-1 - 1]</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - Keep ratio per chunk (0-1). <=0 (default): score-threshold mode.
- `--chunk` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 4096]</span>, <span data-cli="default">default <span data-cli="value">350</span></span></span>) - Words per chunk (default 350)
- `--scores` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also dump per-word max scores

**Example**

```sh
tanit-cli test core kompress
```

**Full example**

```sh
tanit-cli test core kompress --onnx 'foo' --vocab 'foo' --input 'foo' --input-file 'foo' --ratio '-1' --chunk 350 --scores
```

---

#### test core context

Windows OS context-store acceptance scenarios (synthetic Explorer/Desktop/drag).

Options:

- `--scenario` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">all</span></span></span>) - A, B, C, D, E, F, policy, mru, apps, signals, or all

**Example**

```sh
tanit-cli test core context
```

**Full example**

```sh
tanit-cli test core context --scenario 'all'
```

---

#### test core file-handlers

Windows file-association resolver (SHAssocEnumHandlers + Installed Apps identity).

Options:

- `--scenario` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">all</span></span></span>) - normalize, png, unknown, identity, context, path, open-apps, or all

**Example**

```sh
tanit-cli test core file-handlers
```

**Full example**

```sh
tanit-cli test core file-handlers --scenario 'all'
```

---

#### test screenshot

Start the main window, wait, capture it to a PNG, then exit.

Options:

- `-o,--output` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - PNG output path
- `--wait-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">2000</span></span></span>) - Milliseconds to wait after UI init before capture (default: 2000)

**Example**

```sh
tanit-cli test screenshot -o <value>
```

**Full example**

```sh
tanit-cli test screenshot -o 'foo' --wait-ms 2000
```

### Service

#### status

Show Tanit credits and license status.

Options:

- `--log` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Show recent Tanit spend log entries.
- `--log-days` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 365]</span></span>) - Number of days to look back for --log (default 7).

**Example**

```sh
tanit-cli status
```

**Full example**

```sh
tanit-cli status --log --log-days 7
```

### Reference

#### commands

List registered pm-image CLI commands for UI/custom-command pickers and scripts.

**Example**

```sh
tanit-cli commands
```

### Automation

#### daemon

Global shortcut daemon: hotkeys, UI presets, app commands, STT, and voice session.

Options:

- `--config` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Daemon JSON config path. Default: the app roaming profile daemon.json next to settings.json.

**Example**

```sh
tanit-cli daemon
```

**Full example**

```sh
tanit-cli daemon --config 'foo'
```

#### daemon run

Run the foreground hotkey daemon (default action).

Options:

- `--tray` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Run with a notification-area tray icon.

**Example**

```sh
tanit-cli daemon run
```

**Full example**

```sh
tanit-cli daemon run --tray
```

---

#### daemon tray

Run the user-session tray daemon with global hotkeys and a notification-area menu.

**Example**

```sh
tanit-cli daemon tray
```

---

#### daemon register

Windows: register the daemon for logon by writing HKLM Run (requires elevation). Seeds config if missing.

**Example**

```sh
tanit-cli daemon register
```

---

#### daemon unregister

Windows: remove the daemon HKLM Run entry (requires elevation).

**Example**

```sh
tanit-cli daemon unregister
```

---

#### daemon stop

Windows: stop the running daemon for this user session.

**Example**

```sh
tanit-cli daemon stop
```

---

#### daemon path

Print the effective daemon.json path and exit.

**Example**

```sh
tanit-cli daemon path
```

#### assistant

AI assistant: toolbar, global shortcuts, realtime voice, and UIA spy.
With no subcommand: starts the assistant toolbar/global shortcut host (GUI: same as --ui-open assistant).

Options:

- `--ui,--no-ui{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Show the assistant toolbar window (topmost pill, left-edge snap by default).
Default: on when no subcommand is given.
- `--realtime` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Toggle a live voice session (start if idle, stop if running) and exit.
- `--stop` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Signal a detached assistant toolbar (started via `--ui-open assistant` or `app togglelauncher`) to close cooperatively.

**Example**

```sh
tanit-cli assistant
```

**Full example**

```sh
tanit-cli assistant --ui --realtime --stop
```

#### assistant app-inspect

Inspect desktop applications for computer-use.

**Example**

```sh
tanit-cli assistant app-inspect dump
```

**Full example**

```sh
tanit-cli assistant app-inspect dump --md --probe-cells --foreground --pid 0 --hwnd 0 --process 'foo' --title 'foo' --controls 'foo' --limit 500 --text-max-chars 4096
```

#### assistant app-inspect dump

Dump visible windows and useful UIA elements with screen coordinates.

Options:

- `--md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print a compact Markdown tree for humans and LLMs.
- `--probe-cells` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Probe visible virtualized cells with ElementFromPoint (slower; auto-enabled for spreadsheet-looking --md targets).
- `--foreground` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Inspect only the foreground window.
- `--pid` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Inspect windows for a process id.
- `--hwnd` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Inspect a specific window handle (decimal).
- `--process` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Case-insensitive process-name substring filter, e.g. notepad.exe.
- `--title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Case-insensitive title substring filter.
- `--controls` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Markdown control filter, e.g. button,menuitem,edit,input,text.
- `--limit` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 10000]</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Maximum useful elements per window.
- `--text-max-chars` (<span data-cli="meta"><span data-cli="type">INT:INT in [20 - 200000]</span>, <span data-cli="default">default <span data-cli="value">4096</span></span></span>) - Maximum characters per Markdown text/value field.

**Example**

```sh
tanit-cli assistant app-inspect dump
```

**Full example**

```sh
tanit-cli assistant app-inspect dump --md --probe-cells --foreground --pid 0 --hwnd 0 --process 'foo' --title 'foo' --controls 'foo' --limit 500 --text-max-chars 4096
```

---

#### assistant app-inspect screenshot

Save a window (or screen crop) as JPEG. Prefer --pid + --title (exact title wins) or --hwnd so browser tabs with similar titles are not captured.

Options:

- `--foreground` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Resolve --element in the foreground window.
- `--pid` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Resolve windows for a process id (combine with --title).
- `--hwnd` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Capture a specific window handle (decimal).
- `--process` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Resolve window/element by process-name substring.
- `--title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Title filter (substring). When several windows match, an exact (ci) title is preferred.
- `--element` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Element index from app-inspect dump.
- `--rect` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Screen rectangle x,y,w,h.
- `-o,--output` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Destination .jpg path.
- `--quality` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 100]</span>, <span data-cli="default">default <span data-cli="value">85</span></span></span>) - JPEG quality 1..100.
- `--no-activate` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip bringing the target window to foreground before capture. Default: when a window is resolved by --title/--process/--pid/--hwnd/--foreground, it is activated first so the capture matches what the user sees.

**Example**

```sh
tanit-cli assistant app-inspect screenshot -o <value>
```

**Full example**

```sh
tanit-cli assistant app-inspect screenshot --foreground --pid 0 --hwnd 0 --process 'foo' --title 'foo' --element -1 --rect 'foo' -o 'foo' --quality 85 --no-activate
```

---

#### assistant context-dump

One-shot Windows OS context snapshot (Explorer/Desktop/drag/invocation, optional MRU,
open apps, per-app Shell Recent/Frequent). Does not auto-resolve file operations.
Lazy providers run only when their --allow-* flags are set.

Options:

- `--md` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print Markdown only (no JSON envelope).
- `--allow-mru` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include session MRU as eligible candidates. Never implicit input for ResolveContext.
- `--allow-open-apps` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enumerate bounded open-app / taskbar-candidate windows (EnumWindows, dirty/on-demand).
- `--allow-app-recent` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Lazy IApplicationDocumentLists Recent/Frequent for --app-id (default: foreground AppUserModelID).
- `--historical,--no-historical{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Include last-non-empty Explorer/Desktop selections (default: on).
- `--clipboard` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Consent to include clipboard payload and event-preview metadata.
- `--internal` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include internal fields (hwnd, confidence) in JSON.
- `--track` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Install WinEvent hooks for this process for the duration of the dump (usually unnecessary).
- `--capabilities` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">files,folders,text,url</span></span></span>) - Comma-separated capabilities: files,folders,text,image,url,window,uielement.
- `--app-id` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - AppUserModelID for --allow-app-recent. Empty = current foreground app.
- `--max-age-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 86400000]</span>, <span data-cli="default">default <span data-cli="value">30000</span></span></span>) - Max age for live/historical sources (0 = policy default).
- `--mru-max-age-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 86400000]</span>, <span data-cli="default">default <span data-cli="value">1800000</span></span></span>) - Max age for session MRU / app-recent candidates.

**Example**

```sh
tanit-cli assistant context-dump
```

**Full example**

```sh
tanit-cli assistant context-dump --md --allow-mru --allow-open-apps --allow-app-recent --historical --clipboard --internal --track --capabilities 'files,folders,text,url' --app-id 'foo' --max-age-ms 30000 --mru-max-age-ms 1800000
```

---

#### assistant app-find

Find an installed program and its folder (same lookup as Settings → Directories).

Options:

- `query,--query` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Name or path, e.g. solidworks, git, chatgpt.
- `--intent` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">application</span></span></span>) - command (PATH/App Paths only), application (default, includes installed-app index), or installRoot.
- `--all,--first{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Show every candidate (default). --first keeps the top hit.
- `--limit` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 50]</span>, <span data-cli="default">default <span data-cli="value">8</span></span></span>) - Maximum results.

**Example**

```sh
tanit-cli assistant app-find query,--query <value>
```

**Full example**

```sh
tanit-cli assistant app-find query,--query 'foo' --intent 'application' --all --limit 8
```

---

#### assistant app-use

Perform replayable computer-use actions: open apps, click, type, and send hotkeys.

**Example**

```sh
tanit-cli assistant app-use open-app --exe <value>
```

**Full example**

```sh
tanit-cli assistant app-use open-app --exe 'foo' --args 'foo' --cwd 'foo' --x 0 --y 0 --width 0 --height 0 --wait-ms 1000
```

#### assistant app-use open-app

Launch an app with optional args/cwd and place its first visible window.

Options:

- `--exe` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Executable path or name.
- `--args` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Raw command-line args passed after --exe.
- `--cwd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Working directory.
- `--x` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Window left coordinate.
- `--y` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Window top coordinate.
- `--width` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Window width.
- `--height` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Window height.
- `--wait-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 60000]</span>, <span data-cli="default">default <span data-cli="value">1000</span></span></span>) - Milliseconds to wait for first visible window.

**Example**

```sh
tanit-cli assistant app-use open-app --exe <value>
```

**Full example**

```sh
tanit-cli assistant app-use open-app --exe 'foo' --args 'foo' --cwd 'foo' --x 0 --y 0 --width 0 --height 0 --wait-ms 1000
```

---

#### assistant app-use mouse-move

Move the cursor to a screen coordinate. Use --api-width/--api-height for scaled LLM coordinates.

Options:

- `--x` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - X coordinate.
- `--y` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Y coordinate.
- `--api-width` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Coordinate-space width from an LLM computer-use API.
- `--api-height` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Coordinate-space height from an LLM computer-use API.

**Example**

```sh
tanit-cli assistant app-use mouse-move --x 0 --y 0
```

**Full example**

```sh
tanit-cli assistant app-use mouse-move --x 0 --y 0 --api-width 0 --api-height 0
```

---

#### assistant app-use click

Click a screen coordinate. Supports --button, --count, scaled API coords, and --virtual HWND messages.

Options:

- `--virtual` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not move the physical cursor; post mouse messages.
- `--x` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Screen x coordinate.
- `--y` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Screen y coordinate.
- `--button` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">left</span></span></span>) - Mouse button: left, right, or middle.
- `--count` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 10]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Click count (2 = double click).
- `--api-width` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Coordinate-space width from an LLM computer-use API.
- `--api-height` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Coordinate-space height from an LLM computer-use API.

**Example**

```sh
tanit-cli assistant app-use click --x 0 --y 0
```

**Full example**

```sh
tanit-cli assistant app-use click --virtual --x 0 --y 0 --button 'left' --count 1 --api-width 0 --api-height 0
```

---

#### assistant app-use type

Type UTF-8 text into the currently focused control via Unicode SendInput.

Options:

- `--text` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Text to type.

**Example**

```sh
tanit-cli assistant app-use type --text <value>
```

**Full example**

```sh
tanit-cli assistant app-use type --text 'foo'
```

---

#### assistant app-use hotkey

Send a hotkey sequence such as ctrl+s, alt+f, or f5.

Options:

- `--keys` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Keys separated by +, comma, or spaces.

**Example**

```sh
tanit-cli assistant app-use hotkey --keys <value>
```

**Full example**

```sh
tanit-cli assistant app-use hotkey --keys 'foo'
```

---

#### assistant app-use key-press

Press a single key, hold for --hold-ms, release. Use this when key DURATION matters (virtual pianos, rhythm games, held-modifier window managers). For chords / shortcuts, prefer `hotkey` (atomic) and for melodies use `batch` with key-press steps.

Options:

- `--key` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Single key name (a-z, 0-9, f1..f12, enter, space, left, up, ...).
- `--hold-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 30000]</span>, <span data-cli="default">default <span data-cli="value">50</span></span></span>) - How long to hold the key down (ms). FreePiano / similar apps treat this as note sustain.
- `--modifiers` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional modifiers held during the press, separated by +/,/space (e.g. "ctrl" or "ctrl+shift").

**Example**

```sh
tanit-cli assistant app-use key-press --key <value>
```

**Full example**

```sh
tanit-cli assistant app-use key-press --key 'foo' --hold-ms 50 --modifiers 'foo'
```

---

#### assistant app-use cursor-position

Report cursor position and virtual-screen dimensions; optionally include scaled API coordinates.

Options:

- `--api-width` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Coordinate-space width from an LLM computer-use API.
- `--api-height` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Coordinate-space height from an LLM computer-use API.

**Example**

```sh
tanit-cli assistant app-use cursor-position
```

**Full example**

```sh
tanit-cli assistant app-use cursor-position --api-width 0 --api-height 0
```

---

#### assistant app-use batch

Run a JSON app-use action sequence in one process, with per-step delays and wait-element polling.

Options:

- `--continue-on-error` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Continue running later steps after a step fails.
- `--file` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Batch JSON file: an array or {"steps":[...]} document.
- `--default-delay-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 60000]</span>, <span data-cli="default">default <span data-cli="value">50</span></span></span>) - Default delay after each step (ms).
- `--speed` (<span data-cli="meta"><span data-cli="type">FLOAT:FLOAT in [0.05 - 20]</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Replay speed multiplier: 1.0=normal, 0.5=half speed (delays×2), 2.0=double speed. Also settable as top-level JSON key "speed" in the batch file.

**Example**

```sh
tanit-cli assistant app-use batch --file <file>
```

**Full example**

```sh
tanit-cli assistant app-use batch --continue-on-error --file 'foo' --default-delay-ms 50 --speed '1'
```

---

#### assistant app-use close-app

Close a window gracefully (WM_CLOSE) and wait for the process to exit. Pass --force to TerminateProcess if it doesn't exit within --wait-ms.

Options:

- `--pid` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Target process id.
- `--hwnd` (<span data-cli="meta"><span data-cli="type">INT</span></span>) - Target window handle (decimal).
- `--title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Find window by title substring.
- `--force` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - TerminateProcess if graceful close times out.
- `--wait-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [0 - 30000]</span>, <span data-cli="default">default <span data-cli="value">2000</span></span></span>) - Wait for process exit (default 2000 ms).

**Example**

```sh
tanit-cli assistant app-use close-app
```

**Full example**

```sh
tanit-cli assistant app-use close-app --pid 0 --hwnd 0 --title 'foo' --force --wait-ms 2000
```

---

#### assistant pick

Interactively pick a window/element on any monitor with a live highlight.
Move the mouse over the target and left-click (ESC cancels). Prints a JSON
descriptor with a canonical capture `selector` (usable as `video detect/out
--input screen:...`), plus HWND, UIA (AutomationId/Name/ControlType), process
exe + command line, and the precise rectangle (coords fallback).

Options:

- `--target` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">auto</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">follow</span> <span data-cli="choice">element</span> <span data-cli="choice">window</span> <span data-cli="choice">monitor</span></span></span>) - Which selector to make canonical: auto|follow|element|window|monitor.
auto   = follow when a sub-window element is picked, else window.
follow = hwnd=<root>:rrect=dx,dy,w,h — sub-rect that tracks window moves.
element= fixed screen rect (does not track moves).
window = whole window (hwnd=).  monitor = whole monitor.
- `--no-highlight` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not draw the translucent highlight that follows the cursor.
- `--no-uia` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip UIA ElementFromPoint (no AutomationId/Name/precise element rect).
- `--visible-only` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Disable descent into hidden child windows (WinSpy fShowHidden). Default off: hidden descent is needed to land on Chrome render widgets.
- `--no-cmdline` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip reading the target process command line (args).

**Example**

```sh
tanit-cli assistant pick
```

**Full example**

```sh
tanit-cli assistant pick --target 'auto' --no-highlight --no-uia --visible-only --no-cmdline
```

---

#### assistant chrome-inspect

Inspect Chrome tab DOM through the Tanit MV3 extension and native host bridge.

**Example**

```sh
tanit-cli assistant chrome-inspect ping
```

**Full example**

```sh
tanit-cli assistant chrome-inspect ping --timeout-ms 15000
```

#### assistant chrome-inspect ping

Ping the Tanit Chrome extension bridge.

Options:

- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [1000 - 120000]</span>, <span data-cli="default">default <span data-cli="value">15000</span></span></span>) - Bridge timeout in milliseconds.

**Example**

```sh
tanit-cli assistant chrome-inspect ping
```

**Full example**

```sh
tanit-cli assistant chrome-inspect ping --timeout-ms 15000
```

---

#### assistant chrome-inspect status

Report Tanit Chrome extension and native host connection state.

Options:

- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [1000 - 120000]</span>, <span data-cli="default">default <span data-cli="value">15000</span></span></span>) - Bridge timeout in milliseconds.

**Example**

```sh
tanit-cli assistant chrome-inspect status
```

**Full example**

```sh
tanit-cli assistant chrome-inspect status --timeout-ms 15000
```

---

#### assistant chrome-inspect at-point

Inspect the DOM element at viewport coordinates in a matching Chrome tab.

Options:

- `--x` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Viewport X coordinate.
- `--y` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Viewport Y coordinate.
- `--tab-title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Case-insensitive Chrome tab title substring filter.
- `--format` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">json</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">json</span> <span data-cli="choice">md</span> <span data-cli="choice">html</span></span></span>) - Output format: json, md, or html.
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [1000 - 120000]</span>, <span data-cli="default">default <span data-cli="value">15000</span></span></span>) - Bridge timeout in milliseconds.

**Example**

```sh
tanit-cli assistant chrome-inspect at-point --x 0 --y 0
```

**Full example**

```sh
tanit-cli assistant chrome-inspect at-point --x 0 --y 0 --tab-title 'foo' --format 'json' --timeout-ms 15000
```

---

#### assistant chrome-inspect selector

Inspect the first matching DOM node in a Chrome tab.

Options:

- `--selector` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - CSS selector to inspect.
- `--tab-title` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Case-insensitive Chrome tab title substring filter.
- `--format` (<span data-cli="meta"><span data-cli="default">default <span data-cli="value">json</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">json</span> <span data-cli="choice">md</span> <span data-cli="choice">html</span></span></span>) - Output format: json, md, or html.
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [1000 - 120000]</span>, <span data-cli="default">default <span data-cli="value">15000</span></span></span>) - Bridge timeout in milliseconds.

**Example**

```sh
tanit-cli assistant chrome-inspect selector --selector <value>
```

**Full example**

```sh
tanit-cli assistant chrome-inspect selector --selector 'foo' --tab-title 'foo' --format 'json' --timeout-ms 15000
```

---

#### assistant spy

Foreground UIAutomation focus spy: polls the focused element and logs all available UIA properties + text content (ValuePattern, TextPattern). Target apps: Notepad, LibreOffice, Chrome. Press Ctrl+C to stop.

Targets with special handling in src/win/assistant/:
  notepad.exe  — class RichEditD2DPT; ValuePattern + TextPattern both work.
  soffice.bin  — class SALFRAME; TextPattern in Writer, clipboard in Calc/Impress.
  chrome.exe   — framework 'Chrome'; address bar via ValuePattern, content via TextPattern.
  msedge.exe   — same as Chrome.
  code.exe     — VSCode Electron; Monaco a11y bridge exposes TextPattern.

Options:

- `--interval-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [50 - 60000]</span>, <span data-cli="default">default <span data-cli="value">500</span></span></span>) - Poll interval in milliseconds (default 500; minimum 50).
- `--no-value` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip IUIAutomationValuePattern (edit fields, cells, address bars).
- `--no-selection` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip IUIAutomationTextPattern selection ranges.
- `--no-text` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Skip IUIAutomationTextPattern document range (full buffer).
- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Log every poll tick even when nothing changed (very verbose).
- `-v,--verbose` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print the full text content of each snapshot (up to 50 lines / --text-max-chars).
- `--text-max-chars` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">4096</span></span></span>) - Maximum characters to extract from the TextPattern document range (default 4096; -1 = no cap — caution: can be very large).
- `--stt` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Enable live STT dictation: microphone → ElevenLabs Scribe v2 Realtime →
write-back to the currently focused UI element via SendInput (KEYEVENTF_UNICODE).
Ctrl+C stops both spy and STT. In --stt mode, spy output shows focus changes only.
- `--stt-live,--no-stt-live{false}` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span>, <span data-cli="default">default <span data-cli="value">1</span></span></span>) - Stream audio to the STT server as each chunk is captured (default: on).
With --no-stt-live, PCM is buffered per utterance and sent in one shot on VAD commit
(no partial transcript feedback; may improve accuracy for short phrases).
- `--stt-provider` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - STT provider name (default: chat settings stt_provider, e.g. "elevenlabs").
- `--stt-api-key` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - API key for the STT provider (default: from app provider settings).
- `--stt-silence-ms` (<span data-cli="meta"><span data-cli="type">INT:INT in [300 - 10000]</span>, <span data-cli="default">default <span data-cli="value">1200</span></span></span>) - VAD silence threshold in ms before auto-committing an utterance (default 1200).

**Example**

```sh
tanit-cli assistant spy
```

**Full example**

```sh
tanit-cli assistant spy --interval-ms 500 --no-value --no-selection --no-text --all -v --text-max-chars 4096 --stt --stt-live --stt-provider 'foo' --stt-api-key 'foo' --stt-silence-ms 1200
```

### Reference

#### info

Generate reference docs for Tanit: CLI commands, XBlox blocks, UI launch flags, app verbs, keyboard shortcuts, and agent tools. Default: plain markdown (end-user docs). --skill: agent-skill with YAML frontmatter. --json: structured JSON for scripting.

**Example**

```sh
tanit-cli info commands
```

**Full example**

```sh
tanit-cli info commands --dst 'releases/web-docs/cli/cli.md' --stdout --skill --author 'foo'
```

#### info commands

Generate a CLI + custom command reference. Plain md: commands.md in cwd. --skill: <profile>/skills/commands/SKILL.md. --json: commands.json.

Options:

- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">releases/web-docs/cli/cli.md</span></span></span>) - Output path. Plain md: <name>.md in cwd (default). --skill: <profile>/skills/<name>/SKILL.md (default). --json: <name>.json in cwd (default).
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print to stdout instead of writing --dst.
- `--skill` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wrap output with YAML frontmatter and a generated-by marker for use as an agent skill file. Default (without --skill): plain markdown for end-user docs.
- `--author` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - CMS user UUID for absolute *_more.md page links (default: built-in public PolyMech user id).

**Example**

```sh
tanit-cli info commands
```

**Full example**

```sh
tanit-cli info commands --dst 'releases/web-docs/cli/cli.md' --stdout --skill --author 'foo'
```

---

#### info xblox

Generate an XBlox block-flow reference. Plain md: xblox.md in cwd. --skill: <profile>/skills/xblox/SKILL.md. --json: xblox.json.

Options:

- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path. Plain md: <name>.md in cwd (default). --skill: <profile>/skills/<name>/SKILL.md (default). --json: <name>.json in cwd (default).
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print to stdout instead of writing --dst.
- `--skill` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wrap output with YAML frontmatter and a generated-by marker for use as an agent skill file. Default (without --skill): plain markdown for end-user docs.
- `--author` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - CMS user UUID for absolute *_more.md page links (default: built-in public PolyMech user id).

**Example**

```sh
tanit-cli info xblox
```

**Full example**

```sh
tanit-cli info xblox --dst 'releases/web-docs/cli/cli.md' --stdout --skill --author 'foo'
```

---

#### info app-commands

Generate a Tanit app/UI command verb reference (togglechat, takescreenshot, etc.) grouped by category. Plain md: app-commands.md in cwd. --skill: <profile>/skills/app-commands/SKILL.md.

Options:

- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path. Plain md: <name>.md in cwd (default). --skill: <profile>/skills/<name>/SKILL.md (default). --json: <name>.json in cwd (default).
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print to stdout instead of writing --dst.
- `--skill` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wrap output with YAML frontmatter and a generated-by marker for use as an agent skill file. Default (without --skill): plain markdown for end-user docs.
- `--author` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - CMS user UUID for absolute *_more.md page links (default: built-in public PolyMech user id).

**Example**

```sh
tanit-cli info app-commands
```

**Full example**

```sh
tanit-cli info app-commands --dst 'releases/web-docs/cli/cli.md' --stdout --skill --author 'foo'
```

---

#### info keyboard-shortcuts

Generate an end-user keyboard shortcut reference: built-in app-command defaults (Settings -> Keyboard shortcuts grouping) plus custom command shortcuts from commands.json. Plain md: keyboard-shortcuts.md in cwd. --skill: <profile>/skills/keyboard-shortcuts/SKILL.md.

Options:

- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path. Plain md: <name>.md in cwd (default). --skill: <profile>/skills/<name>/SKILL.md (default). --json: <name>.json in cwd (default).
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print to stdout instead of writing --dst.
- `--skill` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wrap output with YAML frontmatter and a generated-by marker for use as an agent skill file. Default (without --skill): plain markdown for end-user docs.
- `--author` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - CMS user UUID for absolute *_more.md page links (default: built-in public PolyMech user id).

**Example**

```sh
tanit-cli info keyboard-shortcuts
```

**Full example**

```sh
tanit-cli info keyboard-shortcuts --dst 'releases/web-docs/cli/cli.md' --stdout --skill --author 'foo'
```

---

#### info ui

Generate a Tanit UI launch flag reference (--ui-preset, --size, --src paths/URLs, --show-panel, chat seed options). Plain md: ui.md in cwd. --skill: <profile>/skills/ui/SKILL.md.

Options:

- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path. Plain md: <name>.md in cwd (default). --skill: <profile>/skills/<name>/SKILL.md (default). --json: <name>.json in cwd (default).
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print to stdout instead of writing --dst.
- `--skill` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wrap output with YAML frontmatter and a generated-by marker for use as an agent skill file. Default (without --skill): plain markdown for end-user docs.
- `--author` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - CMS user UUID for absolute *_more.md page links (default: built-in public PolyMech user id).

**Example**

```sh
tanit-cli info ui
```

**Full example**

```sh
tanit-cli info ui --dst 'releases/web-docs/cli/cli.md' --stdout --skill --author 'foo'
```

---

#### info tools

Generate an LLM agent path-tool reference with parameters and descriptions. Plain md: tools.md in cwd. --skill: <profile>/skills/tools/SKILL.md. --json: tools.json.

Options:

- `--dst` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output path. Plain md: <name>.md in cwd (default). --skill: <profile>/skills/<name>/SKILL.md (default). --json: <name>.json in cwd (default).
- `--stdout` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Print to stdout instead of writing --dst.
- `--skill` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Wrap output with YAML frontmatter and a generated-by marker for use as an agent skill file. Default (without --skill): plain markdown for end-user docs.
- `--author` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - CMS user UUID for absolute *_more.md page links (default: built-in public PolyMech user id).

**Example**

```sh
tanit-cli info tools
```

**Full example**

```sh
tanit-cli info tools --dst 'releases/web-docs/cli/cli.md' --stdout --skill --author 'foo'
```

### LLM & Agents

#### llama

GGUF embedding: embed texts, rank candidates by cosine similarity, or benchmark.

**Example**

```sh
tanit-cli llama embed -m <value> -t {}
```

**Full example**

```sh
tanit-cli llama embed -m 'foo' -j 4 --ctx 512 -t '{}' --full-vec
```

#### llama embed

Embed one or more texts and print JSON with dim, ok, and optionally the full vector.

Options:

- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to GGUF embedding model (e.g. ${MODELS_DIR}/all-MiniLM-L6-v2.Q5_K_M.gguf).
- `-j,--threads` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 256]</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - CPU threads for inference (default 4).
- `--ctx` (<span data-cli="meta"><span data-cli="type">INT:INT in [32 - 8192]</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Context length for the embedding model (default 512).
- `-t,--text` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - Text to embed (repeat for multiple).
- `--full-vec` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Include the full float32 embedding array in the JSON output.

**Example**

```sh
tanit-cli llama embed -m <value> -t {}
```

**Full example**

```sh
tanit-cli llama embed -m 'foo' -j 4 --ctx 512 -t '{}' --full-vec
```

---

#### llama match

Rank candidates by cosine similarity to a query, output JSON.

Options:

- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to GGUF embedding model (e.g. ${MODELS_DIR}/all-MiniLM-L6-v2.Q5_K_M.gguf).
- `-j,--threads` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 256]</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - CPU threads for inference (default 4).
- `--ctx` (<span data-cli="meta"><span data-cli="type">INT:INT in [32 - 8192]</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Context length for the embedding model (default 512).
- `-q,--query` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Query text.
- `-c,--candidate` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Candidate text(s) to rank (repeat for each).
- `-n,--top` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - Return only the top N results (0 = all).

**Example**

```sh
tanit-cli llama match -m <value> -q <value> -c {}
```

**Full example**

```sh
tanit-cli llama match -m 'foo' -j 4 --ctx 512 -q 'foo' -c '{}' -n 0
```

---

#### llama benchmark

Run built-in string-utils parity cases and report pass/fail.

Options:

- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to GGUF embedding model (e.g. ${MODELS_DIR}/all-MiniLM-L6-v2.Q5_K_M.gguf).
- `-j,--threads` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 256]</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - CPU threads for inference (default 4).
- `--ctx` (<span data-cli="meta"><span data-cli="type">INT:INT in [32 - 8192]</span>, <span data-cli="default">default <span data-cli="value">512</span></span></span>) - Context length for the embedding model (default 512).

**Example**

```sh
tanit-cli llama benchmark -m <value>
```

**Full example**

```sh
tanit-cli llama benchmark -m 'foo' -j 4 --ctx 512
```

---

#### llama vlm

Multimodal VLM inference: encode an image and generate text (OCR, captions, ...).

Options:

- `-m,--model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to the language-model GGUF (e.g. PaddleOCR-VL-1.5.gguf).
- `--mmproj` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to the vision projector GGUF (e.g. PaddleOCR-VL-1.5-mmproj.gguf).
- `-i,--image` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Path to the input image (JPEG / PNG).
- `-p,--prompt` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">OCR:</span></span></span>) - Text prompt appended after the image tokens (default: "OCR:").
- `-j,--threads` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 256]</span>, <span data-cli="default">default <span data-cli="value">4</span></span></span>) - CPU threads for inference (default 4).
- `--ctx` (<span data-cli="meta"><span data-cli="type">INT:INT in [512 - 65536]</span>, <span data-cli="default">default <span data-cli="value">8192</span></span></span>) - KV context length (default 8192).
- `-n,--n-predict` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 16384]</span>, <span data-cli="default">default <span data-cli="value">2048</span></span></span>) - Maximum tokens to generate (default 2048).
- `--ngl,--gpu-layers` (<span data-cli="meta"><span data-cli="type">INT:INT in [-1 - 1000]</span>, <span data-cli="default">default <span data-cli="value">-1</span></span></span>) - Number of model layers to offload to GPU (-1 = all, 0 = CPU-only; default -1).
- `--frame` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Additional image path(s) for multi-frame / video inference. Repeat for each frame: --image frame0.png --frame frame1.png --frame frame2.png. All frames are passed to the model simultaneously; --image is always frame 0.

**Example**

```sh
tanit-cli llama vlm -m <value> --mmproj <value> -i <value>
```

**Full example**

```sh
tanit-cli llama vlm -m 'foo' --mmproj 'foo' -i 'foo' -p 'OCR:' -j 4 --ctx 8192 -n 2048 --ngl -1 --frame '{}'
```

#### hg

Hugging Face / catalog models: list, inspect, probe, and download into ${MODELS_DIR}.

Options:

- `--token` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - HF API token (default: settings variable HF_TOKEN, else Providers → Hugging Face, else HF_TOKEN env).

**Example**

```sh
tanit-cli hg list
```

#### hg list

List built-in catalog aliases (GGUF + file models).

**Example**

```sh
tanit-cli hg list
```

---

#### hg search

Search Hugging Face models by free text (not just org or owner/repo slugs).

Options:

- `query` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Search text (e.g. qwen, mini lm, embedding).
- `-n,--limit` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 100]</span>, <span data-cli="default">default <span data-cli="value">20</span></span></span>) - Max models to return (default 20).
- `--all` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Do not restrict results to GGUF-tagged models.

**Example**

```sh
tanit-cli hg search query <value>
```

**Full example**

```sh
tanit-cli hg search query 'foo' -n 20 --all
```

---

#### hg org

List models published by a Hugging Face organization or user.

Options:

- `org` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Org slug or URL (e.g. sentence-transformers or https://huggingface.co/sentence-transformers).
- `-n,--limit` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 500]</span>, <span data-cli="default">default <span data-cli="value">100</span></span></span>) - Max models to return (default 100).

**Example**

```sh
tanit-cli hg org org <value>
```

**Full example**

```sh
tanit-cli hg org org 'foo' -n 100
```

---

#### hg variants

List GGUF quantization variants for a catalog alias or repo id.

Options:

- `model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Catalog alias, org/repo id, or HF model URL.

**Example**

```sh
tanit-cli hg variants model <value>
```

**Full example**

```sh
tanit-cli hg variants model 'foo'
```

---

#### hg meta

Fetch Hugging Face model card JSON for a catalog alias or repo id.

Options:

- `model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Catalog alias, org/repo id, or HF model URL.

**Example**

```sh
tanit-cli hg meta model <value>
```

**Full example**

```sh
tanit-cli hg meta model 'foo'
```

---

#### hg probe

Resolve variant files and sizes without downloading.

Options:

- `model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Catalog alias, org/repo id, or HF model URL.
- `-v,--variant` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional quant label filter.

**Example**

```sh
tanit-cli hg probe model <value>
```

**Full example**

```sh
tanit-cli hg probe model 'foo' -v 'foo'
```

---

#### hg sidecar

Rebuild model.local.json sidecar from a downloaded variant directory.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Variant directory containing .gguf files.
- `-v,--variant` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Quant label override (default: directory name).

**Example**

```sh
tanit-cli hg sidecar path <path>
```

**Full example**

```sh
tanit-cli hg sidecar path 'foo' -v 'foo'
```

---

#### hg download

Download one catalog variant into ${MODELS_DIR} (GGUF + sidecar, or a named file).

Options:

- `model` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Catalog alias, org/repo id, or HF model URL.
- `-v,--variant` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Quant label (default: catalog default_variant).
- `-o,--output` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Output root (default: ${MODELS_DIR} / settings_store models).
- `--overwrite` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Re-download even when files exist.
- `--remanifest-only` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Rebuild tanit-manifest.json and model.local.json without downloading.
- `-q,--quiet` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Suppress stderr progress lines.

**Example**

```sh
tanit-cli hg download model <value>
```

**Full example**

```sh
tanit-cli hg download model 'foo' -v 'foo' -o 'foo' --overwrite --remanifest-only -q
```

### Servers

#### run-ipc

Discover and control live pm-image instances over the command IPC bus.

**Example**

```sh
tanit-cli run-ipc list
```

#### run-ipc list

List pm-image IPC descriptors, including orphaned descriptors that fail liveness validation.

**Example**

```sh
tanit-cli run-ipc list
```

---

#### run-ipc info

Show composed details for an IPC descriptor, including child registries.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id ("pid:<n>") or bare pid.

**Example**

```sh
tanit-cli run-ipc info target <value>
```

**Full example**

```sh
tanit-cli run-ipc info target 'foo'
```

---

#### run-ipc tree

Render the IPC registry as a plain tree, or a navigable FTXUI tree with --interactive.

Options:

- `--interactive` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Open the navigable FTXUI tree view (requires an interactive terminal).

**Example**

```sh
tanit-cli run-ipc tree
```

**Full example**

```sh
tanit-cli run-ipc tree --interactive
```

---

#### run-ipc prune

Remove orphaned run-ipc instance and agent descriptor JSON files.

**Example**

```sh
tanit-cli run-ipc prune
```

---

#### run-ipc ping

Send a ping to a live instance and print the pong reply.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id ("pid:<n>") or bare pid.

**Example**

```sh
tanit-cli run-ipc ping target <value>
```

**Full example**

```sh
tanit-cli run-ipc ping target 'foo'
```

---

#### run-ipc status

Query the status (descriptor + process info) of a live instance.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id or bare pid.

**Example**

```sh
tanit-cli run-ipc status target <value>
```

**Full example**

```sh
tanit-cli run-ipc status target 'foo'
```

---

#### run-ipc run-ids

List active command-runner run IDs on a live instance.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id or bare pid.

**Example**

```sh
tanit-cli run-ipc run-ids target <value>
```

**Full example**

```sh
tanit-cli run-ipc run-ids target 'foo'
```

---

#### run-ipc cancel

Cancel a command-runner run on a live instance by its run ID.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id or bare pid.
- `run_id` (<span data-cli="meta"><span data-cli="type">UINT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Numeric run ID to cancel (from run-ids).

**Example**

```sh
tanit-cli run-ipc cancel target <value> run_id 0
```

**Full example**

```sh
tanit-cli run-ipc cancel target 'foo' run_id 0
```

---

#### run-ipc send

Send an arbitrary action frame to a live instance and print the reply.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id or bare pid.
- `action` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Action name (e.g. ping, status, run_ids, cancel, app_cmd, stop, …).
- `-d,--json` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Extra JSON object to merge into the request (e.g. '{"run_id":42}').
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Socket timeout in milliseconds (default: 3000).

**Example**

```sh
tanit-cli run-ipc send target <value> action <value>
```

**Full example**

```sh
tanit-cli run-ipc send target 'foo' action 'foo' -d 'foo' --timeout-ms 3000
```

---

#### run-ipc host

Spawn a bare IPC server host (registers in instances dir, serves until stopped). Primarily for testing and scripted orchestration.

Options:

- `--cwd` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Working directory to advertise (default: current directory).
- `--register-agent` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Also publish a live entry in the agent registry (test fixture for `run-ipc agents`).

**Example**

```sh
tanit-cli run-ipc host
```

**Full example**

```sh
tanit-cli run-ipc host --cwd 'foo' --register-agent
```

---

#### run-ipc agents

List ongoing agents (regular + realtime) from the cross-process registry, with cwd, command line, model, session, and sampled memory/CPU. With no target, reads the shared registry directly; with a target, queries that instance.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Optional instance id or bare pid to query over the bus (default: local registry).

**Example**

```sh
tanit-cli run-ipc agents
```

**Full example**

```sh
tanit-cli run-ipc agents target 'foo'
```

---

#### run-ipc app-cmds

List app commands accepted by a live UI instance over `run-ipc app-cmd`, including arg names when the verb takes them.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id or bare pid.
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Socket timeout in milliseconds (default: 3000).

**Example**

```sh
tanit-cli run-ipc app-cmds target <value>
```

**Full example**

```sh
tanit-cli run-ipc app-cmds target 'foo' --timeout-ms 3000
```

---

#### run-ipc app-cmd

Send an app command to a live UI instance (e.g. replay, takescreenshot, togglequeue). Command names are matched case/separator-insensitively via app_commands.cpp registry.

Options:

- `target` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Instance id or bare pid.
- `command` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - App command name (e.g. replay, takescreenshot, browse, togglequeue, …).
- `-d,--json` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Extra JSON args for the command (e.g. '{"path":"session.json"}' for replay, '{"query":"cats"}' for showsearchnative / togglesearchnative).
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">3000</span></span></span>) - Socket timeout in milliseconds (default: 3000).

**Example**

```sh
tanit-cli run-ipc app-cmd target <value> command <value>
```

**Full example**

```sh
tanit-cli run-ipc app-cmd target 'foo' command 'foo' -d 'foo' --timeout-ms 3000
```

### Media & Capture

#### media

Experimental media type tools: probe files and inspect libmagic MIME/extension metadata.

**Example**

```sh
tanit-cli media probe path {}
```

**Full example**

```sh
tanit-cli media probe path '{}' --magic-db 'foo'
```

#### media probe

Probe file MIME type, likely extensions, and Tanit media kind.

Options:

- `path` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - File path(s) to probe
- `--magic-db` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Explicit magic.mgc database path.

**Example**

```sh
tanit-cli media probe path {}
```

**Full example**

```sh
tanit-cli media probe path '{}' --magic-db 'foo'
```

---

#### media types

List MIME types and extensions from file(1) Magdir annotations; supports wildcards like application/*.

Options:

- `pattern` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">*</span></span></span>) - MIME/kind/extension wildcard pattern.
- `--kind` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Filter by kind: image, video, document, code, script, binary, ...
- `--ext` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Filter by extension, e.g. .pdf or jpg.
- `--source-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Explicit packages/file/magic/Magdir directory.

**Example**

```sh
tanit-cli media types
```

**Full example**

```sh
tanit-cli media types pattern '*' --kind 'foo' --ext 'foo' --source-dir 'foo'
```

---

#### media search

Search raw file(1) Magdir source lines with wildcards; useful when a type has no !:ext annotation.

Options:

- `pattern` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Wildcard pattern to match against source lines or filenames.
- `--source-dir` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Explicit packages/file/magic/Magdir directory.

**Example**

```sh
tanit-cli media search pattern *
```

**Full example**

```sh
tanit-cli media search pattern '*' --source-dir 'foo'
```

### Servers

#### mcp

MCP utilities: run a foreground agent-tool server, or inspect/call external MCP servers.

Options:

- `--preset` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Chat settings preset name or id. If omitted, uses preset `Default`, or the lone saved preset.
- `--bind` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">127.0.0.1</span></span></span>) - Interface/address for MCP HTTP. Default: 127.0.0.1 (loopback only).
- `--port` (<span data-cli="meta"><span data-cli="type">INT:INT in [1 - 65535]</span>, <span data-cli="default">default <span data-cli="value">4444</span></span></span>) - First TCP port to try for MCP HTTP (default 4444; next free port if busy)
- `--disable-tools` (<span data-cli="meta"><span data-cli="type">TEXT</span></span>) - Comma- or semicolon-separated enabled tools to omit. Built-ins: list_images, file_glob, file_read, file_search, image_resize, image_crop, image_transform, image_create, create_video, image_understand, image_from_camera, ocr_text, write_file, file_str_replace, file_delete, speak, audio_transcribe, ask_user, memory_read, memory_write, memory_append_event, memory_find, run, run_sequence, info_lookup, service_page_create, service_page_update, service_page_list, service_page_get, service_files_list, service_files_get, service_files_upload, service_search, app_command. MCP tools use mcp_<server>__<tool>; run `llm agent --help` for a live list. Ineffective with --no-tools

**Example**

```sh
tanit-cli mcp
```

**Full example**

```sh
tanit-cli mcp --preset 'foo' --bind '127.0.0.1' --port 4444 --disable-tools 'foo'
```

#### mcp client

Inspect and call external MCP servers configured in mcp.json.

Options:

- `--no-probe` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Use cached tools/list only; skip live MCP handshakes.
- `--probe` (<span data-cli="meta"><span data-cli="tag" data-variant="flag">flag</span></span>) - Allow live MCP handshakes when cache is missing or stale (default).

**Example**

```sh
tanit-cli mcp client list
```

#### mcp client list

List MCP server names, transport, and enabled state from mcp.json.

**Example**

```sh
tanit-cli mcp client list
```

---

#### mcp client tools

List tools on an MCP server (name and description).

Options:

- `--server` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - MCP server name from mcp.json.

**Example**

```sh
tanit-cli mcp client tools --server <value>
```

**Full example**

```sh
tanit-cli mcp client tools --server 'foo'
```

---

#### mcp client schema

Show a tool's inputSchema from tools/list.

Options:

- `--server` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - MCP server name from mcp.json.
- `--tool` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Remote tool name.

**Example**

```sh
tanit-cli mcp client schema --server <value> --tool <value>
```

**Full example**

```sh
tanit-cli mcp client schema --server 'foo' --tool 'foo'
```

---

#### mcp client call

Call a tool on an MCP server (fresh session per invocation).

Options:

- `--server` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - MCP server name from mcp.json.
- `--tool` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="tag" data-variant="required">required</span></span>) - Remote tool name.
- `--args` (<span data-cli="meta"><span data-cli="type">TEXT</span>, <span data-cli="default">default <span data-cli="value">{}</span></span></span>) - JSON object of tool arguments.
- `--timeout-ms` (<span data-cli="meta"><span data-cli="type">INT</span>, <span data-cli="default">default <span data-cli="value">0</span></span></span>) - MCP request timeout in milliseconds.

**Example**

```sh
tanit-cli mcp client call --server <value> --tool <value>
```

**Full example**

```sh
tanit-cli mcp client call --server 'foo' --tool 'foo' --args '{}' --timeout-ms 0
```

## Custom Commands

| Exact ID | Label | Group | Action | Pre-configured Args |
|:---|:---|:---|:---|:---|
| `custom.command-mq6okpfh-b145b` | Home | Navigation | `app:showhome` |  |
| `file.prev` | Previous | Navigation | `app:previousfile` |  |
| `custom.command-mtlnivuv-4aae3` | Explorer | Navigation | `app:togglefiletree` |  |
| `file.next` | Next | Navigation | `app:nextfile` |  |
| `custom.dropdown-msx1rszr-19148` | New | New | `metadata` |  |
| `custom.command-msx1rszr-32ae1` | XBlox Script | New | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/intern/new_file.xblox`<br>`--content`<br>`{}`<br>`--ext`<br>`xblox`<br>`--variable-public`<br>`{"ext":true}` |
| `custom.command-msx1xf70-ed2f7` | Text File | New | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/intern/new_file.xblox`<br>`--ext`<br>`txt`<br>`--variable-public`<br>`{"ext":true}` |
| `custom.command-mtfnk3hu-47302` | Markdown File | New | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/intern/new_file.xblox`<br>`--variable-public`<br>`{"ext":true}`<br>`--content`<br>`# Caption`<br>`--ext`<br>`md` |
| `custom.command-mtczu1xa-c605f` | File Tab | New | `app:newfiletab` |  |
| `custom.command-mtfpcfxj-e1333` | Screen Recording | New | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-16-9.xblox` |
| `custom.command-mpx9r1ur-8c6df` | Assistant | Home | `cli:llm` | `agent`<br>`--consent-ui`<br>`win32`<br>`--realtime`<br>`--hud`<br>`--hud-mode`<br>`both` |
| `custom.command-mpxytlpz-bcde4` | Launcher | Home | `app:togglelauncher` |  |
| `custom.command-mtox7vvr-093fc` | Voice Commands | Home | `app:togglevoicecommand` |  |
| `custom.command-712fbd00-f9ac4` | Product | Images | `cli:transform` | `--prompt`<br>`render this as product shooting, white background, studio`<br>`--json`<br>`${CURRENT_SELECTION}` |
| `custom.command-mpch9gdx-44982` | Illustration | Images | `cli:transform` | `--src`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`as technical illustration`<br>`--model`<br>`image-generation-deep` |
| `custom.image-understand-speak` | Speak | Images | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/vision-pipe-speak.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mqj3feqz-72a1a` | Resize-HD | Images | `cli:resize` | `run`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}`<br>`--max-width`<br>`800`<br>`--src`<br>`${CURRENT_SELECTION}`<br>`--format`<br>`jpg`<br>`--cache-dir`<br>`${ENV:PIXLWIZ}/cache/images`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_hd.jpg`<br>`--job-ui` |
| `custom.command-mszwq2g6-780cb` | To Markdown | Images | `cli:llm` | `agent`<br>`--no-mcp`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--include`<br>`${CURRENT_FILE}`<br>`--enable-tools`<br>`image_understand,write_file`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}.md`<br>`--prompt`<br>`Create Markdown Document using the provided path to an image, and image_understand tool - dont comment, just print the result of image_understand.`<br>`--no-skills`<br>`--hud`<br>`--hud-mode`<br>`both` |
| `custom.command-mtun9312-7d0e1` | Share Post | Images | `cli:service` | `posts`<br>`create`<br>`${CURRENT_SELECTION}`<br>`--visibility`<br>`listed` |
| `custom.command-mrcja3yb-306c8` | Region | Screenshots | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/screenshot.xblox` |
| `custom.command-mpxzouxv-ab189` | App | Screenshots | `app:takescreenshot` |  |
| `custom.command-mu4l7dsk-4b406` | Fullscreen Screenshot | Screenshots | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/screenshot-full.xblox` |
| `custom.command-mre4dk8y-7a985` | To Markdown | Screenshots | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/screenshot-vision-md.xblox` |
| `custom.command-mtlh4sop-a7c1b` | New | AI | `app:togglechat` |  |
| `custom.command-mpohnfaf-26b0c` | TTS | AI | `app:setVariable` |  |
| `custom.command-mpokt0hv-41237` | Funny | AI | `app:setVariable` |  |
| `custom.command-mpokxo4w-0910a` | Serious | AI | `app:setVariable` |  |
| `custom.command-mtloapd5-06baa` | MCP | AI | `cli:mcp` |  |
| `custom.command-mu1wob56-d1f45` | Share as Article (copy) | AI | `cli:service` | `pages`<br>`create`<br>`--category-id`<br>`uncategorized`<br>`--private`<br>`${CURRENT_SELECTION}` |
| `custom.command-mtva51l4-2e559` | Login | AI | `app:login` |  |
| `custom.command-mtvdak7f-00d65` | Logout | AI | `app:logout` |  |
| `custom.view-explorer` | Explorer | View | `app:togglefiletree` |  |
| `custom.command-mpy7w3px-8a1e0` | Log | View | `app:togglelog` |  |
| `custom.command-mqkxsx6y-56346` | Center | View | `app:togglecenterview` |  |
| `custom.command-mtld2y23-123a4` | Chat | View | `app:togglechat` |  |
| `custom.command-mpy7z14t-bcef8` | Queue | View | `app:togglequeue` |  |
| `custom.command-mqkneqp7-3fcb0` | Console | View | `app:toggleconsole` |  |
| `custom.command-mr5ebav3-ec35c` | Search | View | `app:togglesearchnative` |  |
| `custom.command-mt8msflf-fe3b7` | Tabbed | View | `app:viewtabbed` |  |
| `custom.command-msqfoqej-85fb5` | Performance | View | `app:toggleperf` |  |
| `custom.command-mtwl51se-b7440` | 1269x846 | View | `app:setframesize` |  |
| `custom.view-maximize` | Fullscreen | View | `app:togglefullscreen` |  |
| `custom.command-mtoxzgrv-1f644` | Maximize | View | `app:setframesize` |  |
| `custom.command-mtv9cd7k-7a458` | Reset | View | `app:resetlayout` |  |
| `custom.command-70eabea6-957e6` | Spanish | Translate | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--prompt`<br>`Translate to Spanish`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_es.${SRC_EXT}`<br>`--hud` |
| `custom.command-msyzmkcu-9b027` | English | Translate | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_en.${SRC_EXT}`<br>`--prompt`<br>`Translate to English`<br>`--no-tools`<br>`--preset`<br>`Tanit-Fast`<br>`--hud`<br>`--hud-mode`<br>`both` |
| `custom.command-msyznegr-9190e` | German | Translate | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_de.${SRC_EXT}`<br>`--prompt`<br>`Translate to German` |
| `custom.command-mt0dfzrn-665b0` | French | Translate | `cli:llm` | `agent`<br>`--embed`<br>`${CURRENT_FILE}`<br>`--no-mcp`<br>`--preset`<br>`quick`<br>`--no-planner`<br>`--no-parallel-tools`<br>`--prompt`<br>`Translate to French`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_fr.${SRC_EXT}` |
| `text.md2pdf` | MD->PDF | Translate | `external` | `--headless`<br>`--convert-to pdf`<br>`--outdir`<br>`${CWD}`<br>`${CURRENT_FILE}` |
| `custom.command-ms0phpqj-d1ca3` | Chrome | Pickers | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-chrome.xblox` |
| `custom.command-ms33shnl-97127` | App | Pickers | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-win32.xblox` |
| `custom.color-picker` | Color | Pickers | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-color.xblox` |
| `custom.text-speak` | Speak | Pickers | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-text-speak.xblox` |
| `custom.voice-cloner` | Voice Cloner | Audio | `cli:audio` | `voice-change`<br>`--remove-background-noise`<br>`${CURRENT_FILE}`<br>`--dst`<br>`${SRC_DIR}/${SRC_NAME}_cloned.wav`<br>`--style`<br>`0.5`<br>`--stability`<br>`1` |
| `custom.command-mpxzk7g4-67590` | Voice Recorder | Audio | `cli:audio` | `record`<br>`--dst`<br>`${CONFIG_DIR}/recordings/tanit-${DD}-${HH}-${mm}.wav`<br>`--hud`<br>`--filter`<br>`deepfilter` |
| `custom.command-mtk0rcb2-f401a` | Speech to Text | Audio | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/stt-paste-whisper.xblox` |
| `custom.command-ms0q0j9j-92441` | Yamaha | Audio | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/bluetooth-yamaha.xblox` |
| `custom.command-mtn0t1b3-722de` | Voice Commands | Audio | `app:togglevoicecommand` |  |
| `custom.command-mrf5dhi8-76608` | 1:1 | Screen-Recorder | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-ex.xblox` |
| `custom.command-mssrlhcu-5aa17` | 1:1-ex | Screen-Recorder | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-ex.xblox` |
| `custom.command-ms4vl4ur-4569d` | 16:9 | Screen-Recorder | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-16-9.xblox` |
| `custom.command-msghb0e2-e8c47` | Fixed | Screen-Recorder | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-recorder-fixed.xblox` |
| `custom.video-start` | WebCam | Video-Recorder | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/webcam.xblox` |
| `custom.command-mu1wam8u-bfd55` | WebCam Beautifier | Video-Recorder | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/webcam.xblox` |
| `custom.command-msafwmdu-b9a48` | Pose | Video-Detect | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-detect-yolo26-pose.xblox` |
| `custom.command-msajhop7-a071b` | Segments | Video-Detect | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-detect-yolo26-seg.xblox` |
| `custom.handbrake-hq` | Handbrake | Converters | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-encode-medium.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-video-social-hq` | Social Video HQ | Converters | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/video-encode-social-hq.xblox`<br>`--CURRENT_FILE`<br>`${CURRENT_FILE}` |
| `custom.command-mr51514h-c34ec` | System | Default Prompts | `app:edit` |  |
| `custom.command-mr50fk3n-1a7d7` | Realtime | Default Prompts | `app:edit` |  |
| `custom.command-mppft700-137e9` | Planner | Default Prompts | `app:edit` |  |
| `batch.start` | Start | Batch | `app:resumebatch` |  |
| `batch.pause` | Pause | Batch | `app:resumebatch` |  |
| `custom.command-mt06aefh-c364b` | Cancel | Batch | `app:cancelbatch` |  |
| `custom.view-snap-up` | Snap Up | View Snap | `app:snapup` |  |
| `custom.view-snap-down` | Snap Down | View Snap | `app:snapdown` |  |
| `custom.view-snap-left` | Snap Left | View Snap | `app:snapleft` |  |
| `custom.view-snap-right` | Snap Right | View Snap | `app:snapright` |  |
| `custom.dropdown-msaj5qk5-78a6b` | Help | Help | `metadata` |  |
| `custom.help-cli` | CLI-Manual | Help | `app:open` |  |
| `custom.help-xblox` | XBlox | Help | `app:open` |  |
| `custom.command-msakytc7-dd084` | Online Help | Help | `app:openurl` |  |
| `custom.command-mt4msl99-55414` | Start | Scheduler | `app:schedulerstart` |  |
| `custom.command-mt4munur-873bb` | Stop | Scheduler | `app:schedulerstop` |  |
| `custom.command-mt7672eh-b7786` | To Images | PDF | `cli:pdf` | `render`<br>`${CURRENT_FILE}`<br>`--output-dir`<br>`${SRC_DIR}/${SRC_NAME}_images`<br>`--quality`<br>`100`<br>`--format`<br>`png`<br>`--pages`<br>`all`<br>`--output`<br>`${SRC_DIR}/${SRC_NAME}_images/${SRC_NAME}.png` |
| `custom.pdf-to-md` | To Markdown | PDF | `cli:pdf` | `md`<br>`${CURRENT_FILE}`<br>`--output-dir`<br>`${SRC_DIR}/${SRC_NAME}_md`<br>`--output`<br>`${SRC_DIR}/${SRC_NAME}.md` |
| `custom.fs-copy` | Copy | Files | `app:fscopy` |  |
| `custom.fs-move` | Move | Files | `app:fsmove` |  |
| `custom.command-mu114s8q-17bff` | Share | Files | `cli:service` | `files`<br>`upload`<br>`${CURRENT_SELECTION}`<br>`--if-newer`<br>`--remote-dir`<br>`public` |
| `custom.command-mu1w66c6-5b959` | Speak | Text | `cli:xblox` | `run`<br>`--src`<br>`${TANIT_SCRIPTS}/inspect-text-speak.xblox` |
| `custom.command-mtum9djk-a760d` | Share as Article | Text | `cli:service` | `pages`<br>`create`<br>`--category-id`<br>`uncategorized`<br>`--private`<br>`${CURRENT_SELECTION}` |

Call custom commands with the exact dotted ID shown above, e.g. `tanit-cli.exe custom.mic-start`.
Pass `...` extra args after `--` to append them to the configured command without wrapper interception.

## Variables

Variable tokens are substituted at run time before a command is dispatched.
Use them in `args`, `cwd`, `command`, `url`, and `path` fields of custom commands.
Unresolved tokens are left as-is so downstream steps can still see them.

### Context (file / selection)

| Token | Value |
|:---|:---|
| `${CURRENT_FILE}` | Absolute path of the focused file |
| `${CURRENT_FILE_NAME}` | Filename with extension (`photo.jpg`) |
| `${CURRENT_PATH}` | Parent directory of the focused file (or cwd when a folder is active) |
| `${CURRENT_SELECTION}` | Space-separated quoted absolute paths of all selected items. In an `args` array each path becomes a separate argument. |
| `${CWD}` | Working directory for this command |
| `${SRC_FILE}` | Source file path as originally given |
| `${SRC_DIR}` | Parent directory of the source file |
| `${SRC_NAME}` | Filename stem without extension (`photo`) |
| `${SRC_EXT}` | Extension without leading dot (`jpg`) |
| `${SRC_FILE_EXT}` | Extension with leading dot (`.jpg`) |

### Context (window / taskbar)

| Token | Value |
|:---|:---|
| `${CURRENT_HWND}` | Decimal HWND of the selected taskbar app (launcher Apps pill) |
| `${CURRENT_PID}` | Process id of that window |
| `${CURRENT_WINTITLE}` | Window title |
| `${CURRENT_PROCESS}` | Process image name (`soffice.bin`) |
| `${CURRENT_SCREEN_SPEC}` | xblox capture/record spec `screen:0:hwnd=<CURRENT_HWND>` |

### Date / time

| Token | Value |
|:---|:---|
| `${YYYY}` | 4-digit year |
| `${MM}` | 2-digit month |
| `${DD}` | 2-digit day |
| `${HH}` | 2-digit hour (24 h) |
| `${mm}` | 2-digit minute |
| `${SS}` | 2-digit second |

### App / system

| Token | Value |
|:---|:---|
| `${TANIT_ROOT}` / `${tanit}` | Directory containing the Tanit executable |
| `${PATH_SEP}` | OS path separator (`\` on Windows, `/` elsewhere) |
| `${PATH_LIST_SEP}` | OS path-list separator (`;` on Windows, `:` elsewhere) |

### Prefixed lookups

| Token | Value |
|:---|:---|
| `${ENV:NAME}` | Value of the environment variable `NAME` |
| `${USER:name}` | User-defined variable from Settings > Variables |
| `${KNOWNFOLDER:name}` | OS well-known folder path. Supported names: `HOME`, `DESKTOP`, `DOCUMENTS`, `DOWNLOADS`, `PICTURES`, `MUSIC`, `VIDEOS`, `CONFIG` (app profile dir), `DATA`, `CACHE`, `TEMP`, `PROGRAM_FILES`, `WINDOWS`, `PUBLIC`, and others (case-insensitive). |

### Path decomposition

These operate on the resolved value of another variable.

| Token | Value |
|:---|:---|
| `${PATH_DIR:VAR}` | Parent directory of the value of `VAR` |
| `${PATH_NAME:VAR}` | Filename stem (no extension) of the value of `VAR` |
| `${PATH_EXT:VAR}` | Extension with leading dot of the value of `VAR` |
| `${PATH_BASE:VAR}` | Filename with extension of the value of `VAR` |
| `${PATH_ABS:VAR}` | Absolute path version of the value of `VAR` |

**Example:** `${PATH_DIR:CURRENT_FILE}` yields the parent folder of the focused file.

