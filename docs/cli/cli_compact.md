# CLI compact

One command per line: `stem (arg0,arg1,...)` then a short description. `...` means more arguments follow. `=> return` is present when that command names a result (`{stem}_return.txt`, or `returns` on a custom command).

assistant - AI assistant: toolbar, global shortcuts, realtime voice, and UIA spy. With no subcommand: starts...
assistant app-find (query,intent,limit) - Find an installed program and its folder (same lookup as Settings → Directories).
assistant app-inspect dump (pid,hwnd,process,title,...) - Dump visible windows and useful UIA elements with screen coordinates.
assistant app-inspect screenshot (pid,hwnd,process,title,...) - Save a window (or screen crop) as JPEG. Prefer --pid + --title (exact title wins) or --hwnd so...
assistant app-use batch (file,default-delay-ms,speed) - Run a JSON app-use action sequence in one process, with per-step delays and wait-element...
assistant app-use click (x,y,button,count,...) - Click a screen coordinate. Supports --button, --count, scaled API coords, and --virtual HWND...
assistant app-use close-app (pid,hwnd,title,wait-ms) - Close a window gracefully (WM_CLOSE) and wait for the process to exit. Pass --force to...
assistant app-use cursor-position (api-width,api-height) - Report cursor position and virtual-screen dimensions; optionally include scaled API coordinates.
assistant app-use hotkey (keys) - Send a hotkey sequence such as ctrl+s, alt+f, or f5.
assistant app-use key-press (key,hold-ms,modifiers) - Press a single key, hold for --hold-ms, release. Use this when key DURATION matters (virtual...
assistant app-use mouse-move (x,y,api-width,api-height) - Move the cursor to a screen coordinate. Use --api-width/--api-height for scaled LLM coordinates.
assistant app-use open-app (exe,args,cwd,x,...) - Launch an app with optional args/cwd and place its first visible window.
assistant app-use type (text) - Type UTF-8 text into the currently focused control via Unicode SendInput.
assistant chrome-inspect at-point (x,y,tab-title,format,...) - Inspect the DOM element at viewport coordinates in a matching Chrome tab.
assistant chrome-inspect ping (timeout-ms) - Ping the Tanit Chrome extension bridge.
assistant chrome-inspect selector (selector,tab-title,format,timeout-ms) - Inspect the first matching DOM node in a Chrome tab.
assistant chrome-inspect status (timeout-ms) - Report Tanit Chrome extension and native host connection state.
assistant context-dump (capabilities,app-id,max-age-ms,mru-max-age-ms) - One-shot Windows OS context snapshot (Explorer/Desktop/drag/invocation, optional MRU, open apps,...
assistant pick (target) - Interactively pick a window/element on any monitor with a live highlight. Move the mouse over...
assistant spy (interval-ms,text-max-chars,stt-provider,stt-api-key,...) - Foreground UIAutomation focus spy: polls the focused element and logs all available UIA...
audio filter (source,dst,filter,model,...) - Enhance a recorded audio file. Default: DeepFilterNet at 48 kHz (same lib as xblox audioFilter)....
audio info - List audio devices: capture inputs by default; use --playback for MMDevice render endpoints.
audio play (path,output,connect,connect-timeout-ms,...) - Play an audio file through the default output device. Supports MP3, WAV, FLAC via miniaudio....
audio record (dst,input,input-source,desktop,...) - Record from mic, desktop loopback, or mix. Default capture: PCM s16le 48 kHz stereo. Output...
audio record status - Show the active `audio record` session (device, format, provider/model, elapsed time, dst,...
audio record stop - Signal a running `audio record` session in another terminal to stop cooperatively.
audio tts (text,dst,output,connect,...) - Synthesise speech from text using a TTS provider and write audio to a file.
audio tts-scripted (srt,dst,provider,api-key,...) - Place scripted TTS from an SRT/VTT/JSON script onto a 48 kHz PCM timeline.
audio voice-change (source,dst,voice-id,model-id,...) - Transform speech into an ElevenLabs voice while preserving timing, emotion, and delivery.
batch discard (session-id) - Remove a saved session by id.
batch list - List saved sessions from sessions.json.
batch resume (session-id) - Resume a saved session by id (auto-detects op and re-runs pending items).
batch.pause - Pause
batch.start - Start
bluetooth connect (id,timeout-ms) - Connect a Bluetooth audio device (pairs if needed) and route audio to it.
bluetooth disconnect (id) - Disconnect a Bluetooth audio device (best-effort).
bluetooth endpoints - List MMDevice audio endpoints (playback by default).
bluetooth list - List paired/connected Bluetooth devices (and optionally audio endpoints). Implicitly routes...
bluetooth pair (id) - Pair a Bluetooth device.
bluetooth set-default (id) - Set an audio endpoint as the default device for all roles.
bluetooth unpair (id) - Remove (unpair) a Bluetooth device.
commands - List registered pm-image CLI commands for UI/custom-command pickers and scripts.
compress (input,output,src,dst,...) - Compress images: MozJPEG re-encode or optimised PNG (+ libimagequant / zopfli)
cp (paths,s,d,conflict,...) => dest - Copy files or folders through the VFS queue (local, ssh://, ftp://, vfs://).
create (output,p,provider,model,...) - AI text-to-image (Gemini / Google, no input file)
custom.command-224bc88db575c7763fbcb9eb96399fcf (--headless,--convert-to,pdf,--outdir,...) - Convert each selected Office document to PDF beside the source file using LibreOffice.
custom.command-6a11b0a8acce258600f5e6dbcd5780cc (-y,-i,${CURRENT_FILE},-vn,...) - Extract MP3 audio beside each selected MP4 using FFMPEG.
custom.command-70eabea6-957e6 (agent,--embed,${CURRENT_FILE},--prompt,...) - Translate the currently selected file to Spanish via the LLM agent
custom.command-712fbd00-f9ac4 (--prompt,"render this as product shooting, white backgroun...",--json,${CURRENT_SELECTION}) - Render current selection as a product photo using white studio background
custom.command-7201753fce13ac9f1c6b945856a73c94 (tts-scripted,--srt,${CURRENT_FILE},--dst,...) - Generate timed speech from the selected SRT, VTT, or JSON cues file and save a sibling 48 kHz...
custom.command-7883566e75cb852699295a0cc2a574c5 (-y,-i,${CURRENT_FILE},-frames:v,...) - Extract the first video frame as a PNG beside the selected video using FFMPEG
custom.command-mpch9gdx-44982 (--src,${CURRENT_FILE},--prompt,"as technical illustration",...) - description
custom.command-mpohnfaf-26b0c - TTS
custom.command-mpokt0hv-41237 - Funny
custom.command-mpokxo4w-0910a - Serious
custom.command-mppft700-137e9 - Edit planner prompt for Tanit agent
custom.command-mpx9r1ur-8c6df (agent,--consent-ui,win32,--realtime,...) - Activates real-time voice assistant in background
custom.command-mpxytlpz-bcde4 - Open launcher menu
custom.command-mpxzk7g4-67590 (record,--dst,${CONFIG_DIR}/recordings/tanit-${DD}-${HH}-${mm}...,--hud,...) - Starts voice recorder. See command settings for more.
custom.command-mpxzouxv-ab189 - App
custom.command-mpy7w3px-8a1e0 - Log
custom.command-mpy7z14t-bcef8 - Queue
custom.command-mq6okpfh-b145b - Home
custom.command-mqj3feqz-72a1a (run,--CURRENT_FILE,${CURRENT_FILE},--max-width,...) - Resize selection to 1920
custom.command-mqkneqp7-3fcb0 - Console
custom.command-mqkxsx6y-56346 - Center
custom.command-mr50fk3n-1a7d7 - Edit real-time prompt for Tanit agent
custom.command-mr51514h-c34ec - Edit system prompt for Tanit agent
custom.command-mr5ebav3-ec35c - Search
custom.command-mrcja3yb-306c8 (run,--src,${TANIT_SCRIPTS}/screenshot.xblox) - Region
custom.command-mre4dk8y-7a985 (run,--src,${TANIT_SCRIPTS}/screenshot-vision-md.xblox) - Uses AI to convert selected image to Markdown
custom.command-mrf5dhi8-76608 (run,--src,${TANIT_SCRIPTS}/video-recorder-ex.xblox) - 1:1
custom.command-ms0phpqj-d1ca3 (run,--src,${TANIT_SCRIPTS}/inspect-chrome.xblox) - Convert a picked region in Chrome to Markdown
custom.command-ms0q0j9j-92441 (run,--src,${TANIT_SCRIPTS}/bluetooth-yamaha.xblox) - Connect to Yamaha over Bluetooth
custom.command-ms33shnl-97127 (run,--src,${TANIT_SCRIPTS}/inspect-win32.xblox) - Convert a picked application region to Markdown
custom.command-ms4vl4ur-4569d (run,--src,${TANIT_SCRIPTS}/video-recorder-16-9.xblox) - 16:9
custom.command-msakytc7-dd084 - Online Help
custom.command-msghb0e2-e8c47 (run,--src,${TANIT_SCRIPTS}/video-recorder-fixed.xblox) - Fixed
custom.command-msqfoqej-85fb5 - Performance
custom.command-msx1rszr-32ae1 (run,--src,${TANIT_SCRIPTS}/intern/new_file.xblox,--content,...) - XBlox Script
custom.command-msx1xf70-ed2f7 (run,--src,${TANIT_SCRIPTS}/intern/new_file.xblox,--ext,...) - Text File
custom.command-msyzmkcu-9b027 (agent,--embed,${CURRENT_FILE},--no-mcp,...) - Translate the currently selected file to Spanish via the LLM agent
custom.command-msyznegr-9190e (agent,--embed,${CURRENT_FILE},--no-mcp,...) - Translate the currently selected file to Spanish via the LLM agent
custom.command-mszwq2g6-780cb (agent,--no-mcp,--no-planner,--no-parallel-tools,...) - Convert current selected image file to Markdown document, using selected image vision provider &...
custom.command-mt06aefh-c364b - Cancel
custom.command-mt0dfzrn-665b0 (agent,--embed,${CURRENT_FILE},--no-mcp,...) - Translate the currently selected file to Spanish via the LLM agent
custom.command-mt4msl99-55414 - Start
custom.command-mt4munur-873bb - Stop
custom.command-mt7672eh-b7786 (render,${CURRENT_FILE},--output-dir,${SRC_DIR}/${SRC_NAME}_images,...) - Convert PDF into image slides
custom.command-mt8msflf-fe3b7 - Tabbed
custom.command-mtczu1xa-c605f - File Tab
custom.command-mtfnk3hu-47302 (run,--src,${TANIT_SCRIPTS}/intern/new_file.xblox,--variable-public,...) - Markdown File
custom.command-mtfpcfxj-e1333 (run,--src,${TANIT_SCRIPTS}/video-recorder-16-9.xblox) - Screen Recording
custom.command-mtk0rcb2-f401a (run,--src,${TANIT_SCRIPTS}/stt-paste-whisper.xblox) - Speech to text and clipboard, uses local Whisper model and external AI for correction.
custom.command-mtld2y23-123a4 - Chat
custom.command-mtlh4sop-a7c1b - New
custom.command-mtlnivuv-4aae3 - Explorer
custom.command-mtloapd5-06baa (--json) - MCP
custom.command-mtn0t1b3-722de - Start voice command mode - requires Whisper model and GPU
custom.command-mtoxzgrv-1f644 - Maximize
custom.command-mtun9312-7d0e1 (posts,create,${CURRENT_SELECTION},--visibility,...) - Share selected image file as article
custom.command-mtv9cd7k-7a458 - Reset
custom.command-mtva51l4-2e559 - Login into Tanit
custom.command-mtvdak7f-00d65 - Login into Tanit
custom.command-mtwl51se-b7440 - 1269x846
custom.command-mu114s8q-17bff (files,upload,${CURRENT_SELECTION},--public) - Share current file to your Tanit CMS (5 MB maximum)
custom.command-mu1wam8u-bfd55 (run,--src,${TANIT_SCRIPTS}/webcam.xblox,--audioSource,...) - WebCam Beautifier
custom.command-mu1wob56-d1f45 (pages,create,--category-id,uncategorized,...) - Share selected Markdown file as article
custom.command-mu4l7dsk-4b406 (run,--src,${TANIT_SCRIPTS}/screenshot-full.xblox) - Fullscreen Screenshot
custom.command-mubm8ayh-a6d58 (run,--src,${TANIT_SCRIPTS}/video-recorder-fixed-subs.xblox) - Fixed & Subs
custom.command-mudse19e-edcc5 - Browser
custom.command-muib2fcm-b25cf (--dst,${SRC_DIR}/${SRC_NAME}.md,--prompt,"Create Markdown Document using the provided path...",...) - Convert current selected image file to Markdown document, using selected OCR local model
custom.command-mujkog2v-f9c2b (-y,-i,${CURRENT_SELECTION_0},-i,...) - Replace the audio on the first selected MP4 with the second selected audio file. Writes a new...
custom.command-mujkxt3w-4af40 (record,--from-wav,${CURRENT_FILE},--stt,...) - Create sub titles from Microphone - using local Whisper model
custom.command-mujlyke2-1c42f (-y,-i,${CURRENT_FILE},-vn,...) - Extract WAV audio beside each selected MP4 using FFMPEG.
custom.command-mulazcgl-a19cb - New Chat
custom.command-mulbk22p-b16a6 - Open setup wizard
custom.command-video-social-hq (run,--src,${TANIT_SCRIPTS}/video-encode-social-hq.xblox,--CURRENT_FILE,...) - Create a high-quality 1080p60 H.264 social-media master from the selected screen capture using...
custom.dropdown-msaj5qk5-78a6b - Help
custom.dropdown-msx1rszr-19148 - New
custom.fs-copy - Copy
custom.fs-move - Move
custom.handbrake-hq (run,--src,${TANIT_SCRIPTS}/video-encode-medium.xblox,--CURRENT_FILE,...) - Convert selected file with Handbrake
custom.help-cli - Open CLI documentation locally
custom.help-xblox - Open XBlox documentation locally
custom.image-understand-speak (run,--src,${TANIT_SCRIPTS}/vision-pipe-speak.xblox,--CURRENT_FILE,...) - Speaks the content of an selected image over the speaker
custom.pdf-to-md (md,${CURRENT_FILE},--output-dir,${SRC_DIR}/${SRC_NAME}_md,...) - Extract PDF text and figures to a Markdown bundle (page_N.md + figures/)
custom.text-speak (run,--src,${TANIT_SCRIPTS}/inspect-text-speak.xblox) - Pick an element and send it over the speaker using text to speech.
custom.video-start (run,--src,${TANIT_SCRIPTS}/webcam.xblox) - WebCam
custom.view-explorer - Explorer
custom.view-maximize - Fullscreen
custom.view-snap-down - Snap Down
custom.view-snap-left - Snap Left
custom.view-snap-right - Snap Right
custom.view-snap-up - Snap Up
custom.voice-cloner (voice-change,--remove-background-noise,${CURRENT_FILE},--dst,...) - Run voice cloner on selected wav file, uses ElevenLabs
daemon (config) - Global shortcut daemon: hotkeys, UI presets, app commands, STT, and voice session.
daemon path - Print the effective daemon.json path and exit.
daemon register - Windows: register the daemon for logon by writing HKLM Run (requires elevation). Seeds config if...
daemon run - Run the foreground hotkey daemon (default action).
daemon stop - Windows: stop the running daemon for this user session.
daemon tray - Run the user-session tray daemon with global hotkeys and a notification-area menu.
daemon unregister - Windows: remove the daemon HKLM Run entry (requires elevation).
file.next - navigates to next file
file.prev - navigates to previous file
find (input,p,junk-kinds,min-score,...) - Find images by name/folder, semantic LLM prompt, or junk (dark/blur/flat/blown/tiny).
hg download (model,v,o) - Download one catalog variant into ${MODELS_DIR} (GGUF, its mmproj when the repo has one, and a...
hg list - List built-in catalog aliases (GGUF + file models).
hg meta (model) - Fetch Hugging Face model card JSON for a catalog alias or repo id.
hg org (org,n) - List models published by a Hugging Face organization or user.
hg probe (model,v) - Resolve variant files and sizes without downloading.
hg search (query,n) - Search Hugging Face models by free text (not just org or owner/repo slugs).
hg sidecar (path,v) - Rebuild model.local.json sidecar from a downloaded variant directory.
hg variants (model) - List GGUF quantization variants for a catalog alias or repo id.
info app-commands (dst,author) - Generate a Tanit app/UI command verb reference (togglechat, takescreenshot, etc.) grouped by...
info commands (dst,author) - Generate a CLI + custom command reference. Plain md: commands.md in cwd. --skill:...
info compact (dst,author) - Compact CLI stem list for agents, including custom commands. Each line is `stem (arg0,arg1,...)`...
info keyboard-shortcuts (dst,author) - Generate an end-user keyboard shortcut reference: built-in app-command defaults (Settings ->...
info tools (dst,author) - Generate an LLM agent path-tool reference with parameters and descriptions. Plain md: tools.md...
info ui (dst,author) - Generate a Tanit UI launch flag reference (--ui-preset, --size, --src paths/URLs, --show-panel,...
info xblox (dst,author) - Generate an XBlox block-flow reference. Plain md: xblox.md in cwd. --skill:...
installer (root,bundle,verbs,journal-dir,...) - Zip/unpacked install helper: seed profile data, register Explorer integration, Start Menu...
installer chrome - Register Tanit Chrome native messaging host only (no npm). Run once per user. Load unpacked from...
llama benchmark (m,j,ctx) - Run built-in string-utils parity cases and report pass/fail.
llama embed (m,j,ctx,t) - Embed one or more texts and print JSON with dim, ok, and optionally the full vector.
llama match (m,j,ctx,q,...) - Rank candidates by cosine similarity to a query, output JSON.
llama vlm (m,mmproj,i,p,...) - Multimodal VLM inference: encode an image and generate text (OCR, captions, ...).
llm agent (p,logging-dir,system-prompt,planner-prompt,...) - Run a single chat-agent turn: LLM picks tools (image_resize / compress / transform / meta /...
llm agent decide (i,questions,selector,pairs,...) - Run choice / noul / score questions on a JSON document. --selector, --pairs, or --left with...
llm agent dedupe (i,selector,m,o,...) - Cluster jq-selected string leaves by local embedding cosine similarity. Annotates duplicates...
llm agent each (i,selector,target,merge-keys,...) - Transform selected JSON string fields with a prompt (async iterator). --source/--dst are files;...
llm claude (p,include,embed,cwd,...) - Run one turn via Claude Code (`claude -p --output-format stream-json`). Build flag:...
llm codex (p,include,embed,cwd,...) - Run one turn via the Codex CLI (`codex exec --json`). Requires `codex login`. Build flag:...
llm info (preset,markdown,color) - Show Chat router/model and image provider/model from app settings, effective defaults for path...
llm info models (provider) - List models for a given provider. local / llama: text/planner GGUF models. vlm: local VLM models...
llm info policy - Dump the full GPO policy catalog (keys, categories, types, defaults, ADMX strings). Single...
llm info providers - List enabled LLM providers from the provider registry and app settings.
llm info skills - List discovered agent skills from roaming and workspace roots with availability/active state.
llm info tools - List all built-in path-mode agent tools (name + description). These are the tools available to...
llm tools-call (name,args,image-file) - Invoke a tool by name with a JSON arguments envelope
llm tools-list - Print the JSON-Schema tool catalog (one entry per tanit op)
login (decode-jwt,issuer,client-id,oauth-port) - Sign in via OIDC PKCE or RFC 8628 device code, or use --probe / --decode-jwt.
logout - Sign out and remove stored tokens from the app profile.
mcp (preset,bind,port,disable-tools) - MCP utilities: run a foreground agent-tool server, or inspect, add, remove, and call external...
mcp client Tanit deepl-get-custom-instruction (args,timeout-ms,instructionId,styleId) - Get a single custom instruction belonging to a style rule. Use the get-style-rule tool to find...
mcp client Tanit deepl-get-glossary-dictionary-entries (args,timeout-ms,glossaryId,sourceLangCode,...) - Retrieve all the entries from a given glossary dictionary. (A glossary consists one of one or...
mcp client Tanit deepl-get-glossary-info (args,timeout-ms,glossaryId) - Given an id, get metadata about the glossary with that id - its name, available dictionaries,...
mcp client Tanit deepl-get-source-languages (args,timeout-ms) - Get list of available source languages for translation
mcp client Tanit deepl-get-style-rule (args,timeout-ms,styleId) - Given an id, get a single style rule with its full detail - configured rules and custom...
mcp client Tanit deepl-get-target-languages (args,timeout-ms) - Get list of available target languages for translation
mcp client Tanit deepl-get-writing-styles (args,timeout-ms) - Get list of writing styles the DeepL API can use while rephrasing text
mcp client Tanit deepl-get-writing-tones (args,timeout-ms) - Get list of writing tones the DeepL API can use while rephrasing text
mcp client Tanit deepl-list-glossaries (args,timeout-ms) - Get a list of all glossaries with metadata for each - name, dictionaries available, and creation...
mcp client Tanit deepl-list-style-rules (args,timeout-ms,page,pageSize) - Get a list of all style rules with metadata for each - id, name, language, and timestamps. Style...
mcp client Tanit deepl-rephrase-text (args,timeout-ms,style,targetLangCode,...) - Rephrase text in the same language, or into a different language, using DeepL API
mcp client Tanit deepl-translate-document (args,timeout-ms,formality,glossaryId,...) - Translate a document file using DeepL API
mcp client Tanit deepl-translate-text (args,timeout-ms,context,customInstructions,...) - Translate text to a target language using DeepL API. Review all available optional parameters...
mcp client Tanit serpapi-search (args,timeout-ms,mode,params) - Universal search tool supporting all SerpApi engines and result types. When to use: - Any query...
mcp client Tanit serpapi-search_dashboard (args,timeout-ms,params) - Interactive dashboard variant of `search`: returns summary metrics, a source breakdown chart,...
mcp client Tanit serpapi-search_table (args,timeout-ms,params) - Interactive UI variant of `search`: returns organic results as a sortable, searchable table...
mcp client Tanit skillhub-browse_catalog (args,timeout-ms,category,limit,...) - Browse the skill catalog with filtering and sorting options. Good for discovering skills by...
mcp client Tanit skillhub-create_skill (args,timeout-ms,category,description,...) - Create a new skill on SkillHub. Returns the skill ID and slug. Requires SKILLHUB_API_KEY.
mcp client Tanit skillhub-generate_skill (args,timeout-ms,category,description,...) - AI-generate a complete SKILL.md file from a natural language description. Uses streaming...
mcp client Tanit skillhub-get_skill_detail (args,timeout-ms,skill_id) - Get detailed information about a specific skill including evaluation, pros/cons, and optionally...
mcp client Tanit skillhub-import_registry_skill (args,timeout-ms,expected_sha256,identifier_or_url,...) - Preview or confirm a private registry import. Confirmation normalizes the files and leaves them...
mcp client Tanit skillhub-install_skill (args,timeout-ms,agents,expected_artifact_sha256,...) - Install a skill to the local filesystem. First call shows a preview, then call with confirm=true...
mcp client Tanit skillhub-install_skill_stack (args,timeout-ms,agents,stack_id) - Install all skills from a SkillStack to the local filesystem. First call shows a preview of all...
mcp client Tanit skillhub-list_my_skills (args,timeout-ms) - List all skills you own. Returns a table with name, slug, status, version, and last updated....
mcp client Tanit skillhub-publish_skill (args,timeout-ms,skill_id) - Publish a skill to make it publicly visible on SkillHub. Requires SKILLHUB_API_KEY.
mcp client Tanit skillhub-push_skill (args,timeout-ms,change_summary,files,...) - Push files (e.g., SKILL.md) to an existing skill. Creates a new version. Requires...
mcp client Tanit skillhub-recommend_skills (args,timeout-ms,context,current_skills,...) - Get skill recommendations based on what you're working on. Uses semantic matching to find...
mcp client Tanit skillhub-resolve_registry_skill (args,timeout-ms,identifier,provider) - Resolve one upstream distribution by exact identifier without importing or executing it.
mcp client Tanit skillhub-search_registry_skills (args,timeout-ms,limit,page,...) - Search an upstream skill registry, or paste a RedSkill install prompt/identifier to resolve the...
mcp client Tanit skillhub-search_skill_stacks (args,timeout-ms,limit,query) - Search for SkillStacks — pre-configured collections of related skills for common workflows...
mcp client Tanit skillhub-search_skills (args,timeout-ms,category,limit,...) - Search for Claude Code Skills using natural language. Returns relevant skills based on semantic...
mcp client Tanit skillhub-unpublish_skill (args,timeout-ms,skill_id) - Unpublish a skill to hide it from the public catalog. Requires SKILLHUB_API_KEY.
mcp client Tanit tavily-tavily_crawl (args,timeout-ms,extract_depth,format,...) - Crawl a website starting from a URL. Extracts content from pages with configurable depth and...
mcp client Tanit tavily-tavily_extract (args,timeout-ms,extract_depth,format,...) - Extract content from URLs. Returns raw page content in markdown or text format.
mcp client Tanit tavily-tavily_map (args,timeout-ms,instructions,limit,...) - Map a website's structure. Returns a list of URLs found starting from the base URL.
mcp client Tanit tavily-tavily_research (args,timeout-ms,input,model) - Perform comprehensive research on a given topic or question. Use this tool when you need to...
mcp client Tanit tavily-tavily_search (args,timeout-ms,country,end_date,...) - Search the web for current information on any topic. Use for news, facts, or data beyond your...
mcp client add (name,target,transport,url,...) - Add an MCP server to mcp.json. Non-interactive, same shapes Claude, Codex, and Hermes agents...
mcp client call (server,tool,args,timeout-ms) - Call a tool on an MCP server (fresh session per invocation).
mcp client list - List MCP servers from mcp.json and the tools each enabled server exposes.
mcp client query (filter,input) - Run a jq filter on a previous JSON result (stdin or --input).
mcp client remove (name) - Remove an MCP server from mcp.json. Non-interactive (Claude, Codex, and Hermes mcp remove).
mcp client schema (server,tool) - Show a tool's inputSchema from tools/list.
mcp client tools (server) - List tools on an MCP server (name and description).
media probe (path,magic-db) - Probe file MIME type, likely extensions, and Tanit media kind.
media search (pattern,source-dir) - Search raw file(1) Magdir source lines with wildcards; useful when a type has no !:ext...
media types (pattern,kind,ext,source-dir) - List MIME types and extensions from file(1) Magdir annotations; supports wildcards like...
mkdir (paths,s,d) => path - Create folders through the VFS queue (local, ssh://, ftp://, vfs://). Existing folders succeed.
mv (paths,s,d,conflict,...) => dest - Move files or folders through the VFS queue (copy then delete source).
pdf info (path,password) - Print page count and page sizes.
pdf md (path,pages,o,output-dir,...) - Extract document text to Markdown via modular PDFium pipeline.
pdf render (path,pages,dpi,rotation,...) - Rasterize pages to image files (all, ranges, or specific pages).
provider models list (provider,api-key,base-url,limit,...) - List provider models and return full JSON payload
register-explorer (group,media-bin) - Register Windows Explorer menus: convert / meta + Workbench + Viewer + Chat + Presets
register-startmenu (folder,media-bin,install-root) - Register current-user Start Menu shortcuts for a zip/unpacked install.
replay (path,replay-speed,size) - Start the UI and apply a saved session layout (snapshot.window_layout).
resize (input,output,src,dst,...) - Resize / transform an image (libvips, Sharp-like options)
run-ipc agents (target) - List ongoing agents (regular + realtime) from the cross-process registry, with cwd, command...
run-ipc app-cmd (target,command,d,timeout-ms) - Send an app command to a live UI instance (e.g. replay, takescreenshot, togglequeue). Command...
run-ipc app-cmds (target,timeout-ms) - List app commands accepted by a live UI instance over `run-ipc app-cmd`, including arg names...
run-ipc cancel (target,run_id) - Cancel a command-runner run on a live instance by its run ID.
run-ipc host (cwd) - Spawn a bare IPC server host (registers in instances dir, serves until stopped). Primarily for...
run-ipc info (target) - Show composed details for an IPC descriptor, including child registries.
run-ipc list - List pm-image IPC descriptors, including orphaned descriptors that fail liveness validation.
run-ipc ping (target) - Send a ping to a live instance and print the pong reply.
run-ipc prune - Remove orphaned run-ipc instance and agent descriptor JSON files.
run-ipc run-ids (target) - List active command-runner run IDs on a live instance.
run-ipc send (target,action,d,timeout-ms) - Send an arbitrary action frame to a live instance and print the reply.
run-ipc status (target) - Query the status (descriptor + process info) of a live instance.
run-ipc tree - Render the IPC registry as a plain tree, or a navigable FTXUI tree with --interactive.
scheduler (now,namespace,count,schedule) - Compile and preview command schedules. Uses --commands and --config-dir.
scheduler compile (now,namespace,count,schedule) - Parse commands.json schedules and print compiled definitions.
scheduler lock (now,namespace,count,schedule,...) - Try the config_dir leader lock (file + session mutex).
scheduler next (now,namespace,count,schedule) - Preview the next planned occurrence(s) without persisting.
scheduler notify (now,namespace,count,schedule) - Ask live daemon instances to reload commands (cmd_ipc reload_commands).
scheduler paths (now,namespace,count,schedule) - Print isolated scheduler/daemon/command paths for this --config-dir.
scheduler pause (now,namespace,count,schedule) - Persist paused=true and notify the live leader.
scheduler reload (now,namespace,count,schedule) - Recompile commands.json into the local host and notify daemon peers.
scheduler resume (now,namespace,count,schedule) - Clear paused and notify the live leader.
scheduler run-now (now,namespace,count,schedule) - Emit one occurrence for --schedule immediately and persist state.
scheduler serve (now,namespace,count,schedule,...) - Foreground scheduler host: claim/lock, tick while leader, stay as follower otherwise. Ctrl+C...
scheduler status (now,namespace,count,schedule) - Print persisted scheduler runtime state.
scheduler tick (now,namespace,count,schedule) - Emit due occurrences and persist scheduler state under config_dir.
search action (input,log-level,mode,content,...) - Run a search-scoped action such as replace (implementation pending).
search detail (log-level,adapter,path,selector,...) - Expand a search hit through the owning source adapter.
search index (input,log-level,mode,content,...) - Index files for semantic search (cron-friendly).
search search (input,log-level,mode,content,...) - Search files with the unified search facade (exact first; semantic later).
service ai-gateway-health (server-url) - GET /api/ai-gateway/health - gateway configured/alive state.
service balance (server-url) - GET /api/ai-gateway/balance/me - purchased credits minus synced spend.
service categories create (name,slug,description,visibility,...) - POST /api/categories - create a category.
service categories get (id,server-url) - GET /api/categories/{id} - fetch a category with its parents and children.
service categories items (slug,limit,server-url) - GET /api/categories/{slug}/items - list pages in a category with resolved variables.
service categories list (user-id,parent-slug,lang,server-url) - GET /api/categories - list categories (default: own categories only).
service categories remove (ids,server-url) - DELETE /api/categories/{id} - remove one or more categories.
service categories update (id,name,slug,description,...) - PATCH /api/categories/{id} - update category fields.
service files get (path,mount,download,download-as,...) - Alias for `files read`: GET /api/vfs/read/{mount}/{path}. Binary and large files require...
service files list (path,mount,server-url) - GET /api/vfs/ls/{mount}/{path} - list files in a VFS directory.
service files pull (path,mount,local-dir,pattern,...) - Stream-download VFS file(s) to a local directory (HTTP Range resume, retries). Skips files that...
service files read (path,mount,out,download,...) - GET /api/vfs/read/{mount}/{path} - read raw file content for download/buffer use.
service files remove (paths,mount,server-url) - DELETE /api/vfs/delete/{mount}/{path} - remove one or more VFS files/folders.
service files upload (files,mount,remote-dir,remote-path,...) => url - POST /api/vfs/upload/{mount}/{path} for any file type (multipart field "file"). Default:...
service images upload (files,server-url) - POST /api/images?forward=vfs&original=true - multipart field "file" (same as...
service info (server-url) - Print resolved CMS, LLM, license, and Zitadel service URLs.
service pages create (input,title,slug,description,...) => url - POST /api/pages. .md is wrapped as a markdown-text widget; .page uploads raw page JSON content.
service pages get (identifier,slug,lang,out,...) - GET /api/user-page/{identifier}/{slug}; if slug is omitted, fetch by page id.
service pages list (user-id,server-url) - GET /api/pages?userId=... - list pages for a user.
service pages remove (ids,slug,owner,server-url) - DELETE /api/pages/{id}; with --slug, resolves /api/user-page/{owner}/{slug} first.
service pages update (input,id,slug,owner,...) => url - PATCH /api/pages/{id}; with --slug, resolves /api/user-page/{owner}/{slug} first.
service pictures get (id,out,server-url) - GET /api/pictures/{id} - fetch a picture record.
service pictures list (user-id,page,limit,server-url) - GET /api/pictures?userId=...&page=...&limit=... - list pictures for a user.
service pictures remove (ids,server-url) - DELETE /api/pictures/{id} - remove one or more picture records.
service posts create (files,title,description,visibility,...) - POST /api/posts then multipart /api/images per file, then POST /api/pictures (same as web...
service posts get (id,sizes,formats,lang,...) - GET /api/posts/{id} - fetch post details.
service posts list (user-id,page,limit,visibility-filter,...) - GET /api/posts?page=...&limit=...&userId=... - list posts for a user.
service posts remove (ids,server-url) - DELETE /api/posts/{id} - remove one or more posts.
service search (query,type,limit,sizes,...) - GET /api/search?q=... - full-text search across pages, posts, pictures, VFS files, and places....
service settings import (remote-dir,download-dir,server-url) - Import portable unencrypted settings.json from VFS into the local profile.
service settings remove (remote-dir,server-url) - Remove the remote settings sync directory from VFS.
service settings upload (remote-dir,server-url) - Upload portable unencrypted settings.json to VFS for cross-machine sync.
service spending (server-url) - AI gateway spend APIs on the CMS server (GET /api/ai-gateway/spend/me).
service spending logs (days-back,start-date,end-date,page,...) - GET /api/ai-gateway/spend/me/logs - paginated request-level spend logs.
service store app-license - Microsoft Store app license. v1 is free (no trial lock)....
service store entitlements (license-server-url) - GET /api/billing/ms/entitlements — durable/subscription rows.
service store health (license-server-url) - GET /api/billing/ms/health (public; shows mock flag and product ids).
service store link (collections-id,license-server-url) - POST /api/billing/ms/link — associate UserCollectionsId with your account.
service store mock-enqueue (product-id,kind,microsoft-item-id,license-server-url) - POST /api/billing/ms/mock/enqueue — seed a pending purchase (server MS_STORE_MOCK=1 only).
service store mock-reset (license-server-url) - POST /api/billing/ms/mock/reset — delete billing rows for the logged-in user.
service store ms-balance (license-server-url) - GET /api/billing/balance — credit_ledger sum (not AI gateway balance).
service store reconcile (license-server-url) - POST /api/billing/ms/reconcile — grant credits and Pro entitlements.
service upload (files,server-url) - Deprecated alias for `service images upload`.
settings cloud download (remote-dir,server-url,cloud-storage-key,passphrase) - Download the newest .pmbackup under home/<remote-dir> via /api/vfs/get and restore the profile.
settings cloud upload (remote-dir,server-url,cloud-storage-key,passphrase) - Export an encrypted .pmbackup and upload it to home/<remote-dir>/yyyy-mm-dd-hh.pmbackup.
settings export (path,cloud-storage-key,passphrase) - Write the current profile settings to a UTF-8 JSON file (default: settings.json in cwd)....
settings import (path,cloud-storage-key,passphrase) - Replace the live profile store with the given UTF-8 JSON file (full document replace). Windows:...
settings key export (path) - Copy the profile key to a file for another machine (creates the key if missing).
settings key generate - Replace the profile key with a fresh random 32-byte key (old keyfile backups will not decrypt).
settings key import (path) - Install a 32-byte key file as this profile's .cloud_storage_key.
settings key path - Print the profile .cloud_storage_key path (no file I/O) and exit.
settings path - Print the canonical on-disk settings.json path for this OS (no file I/O) and exit.
skills add (skill_id) - Install a SkillHub skill into the roaming skills folder (config_dir()/skills).
skills browse (limit,offset,sort,category) - Browse the SkillHub catalog (browse_catalog).
skills detail (name) - Show an installed skill, or a SkillHub skill when it is not installed.
skills list - List skills the agent can see (workspace hides a roaming skill of the same name).
skills recommend (context,limit) - Recommend SkillHub skills (recommend_skills).
skills remove (name) - Delete one skill folder from the roaming skills root. Workspace copies stay.
skills search (query,limit,category) - Semantic search on SkillHub (search_skills).
status (log-days) - Show Tanit credits and license status.
terminal - Open PowerShell (Tanit Terminal). Uses pwsh if present, otherwise Windows PowerShell.
test core commands - Command schema / registry probe: shared parameter dump, exact options_path, seeded app-command...
test core context (scenario) - Windows OS context-store acceptance scenarios (synthetic Explorer/Desktop/drag).
test core file-handlers (scenario) - Windows file-association resolver (SHAssocEnumHandlers + Installed Apps identity).
test core fs-guard (mode,path) - Run LLM filesystem guard policy against --path.
test core id (kind,input) - Run UUID/id/group/permission cleanup helpers against --input.
test core iterator (input,input-file,path,target-path,...) - Async JSON field iterator: jq path selection + pluggable transformer (upper/prefix/identity; llm...
test core kompress (onnx,vocab,input,input-file,...) - Run the Kompress ONNX text scorer over --input/--input-file: keep important words. Uses --onnx +...
test core loopback (script) - agent_factory loopback router: script rounds, cancel, and reset_script.
test core path (input) - Run string path cleanup helpers against --input.
test core process-runner (scenario) - Captured process stdio: invalid UTF-8, a code point split across the read buffer, malformed...
test core settings (path) - Settings path handles: config dir, settings.json, and stored-expression UTF-8.
test core settings-mutate (op,key,value,guid) - Optimistic local + IPC mutate: --op set|merge|append-history.
test core settings-owner (persist-delay-ms,timeout-ms,apply-key,apply-value,...) - Claim settings owner mutex, start cmd_ipc, print status; --hold blocks.
test core settings-roundtrip - Single-process save_subtree / merge_subtree_object / reload.
test core settings-status - Owner/client snapshot: epoch, revision, pending, persistSeq, lastCommitMeta.
test core settings-wait-changed (min-revision,timeout-ms) - Connect as IPC client and wait until revision >= --min-revision.
test core src (input,argv) - Entry --src path: media fragment split, UTF-8 normalize, and first-source argv scan.
test core string (profile,input,input-file) - Apply a registered text sanitizer profile to --input.
test core tokenize (vocab,input,max-len) - ModernBERT byte-level BPE parity probe: dump [CLS]+subtokens+[SEP] ids and word_ids for --input...
test core url-schemes parse (uri) - Validate and parse a tanit:// URI, including fragment/locate data.
test core url-schemes variables (input) - Expand ${VAR} templates using the URI-safe restricted VariableMap (no ENV:, no session context).
test screenshot (o,wait-ms) - Start the main window, wait, capture it to a PNG, then exit.
touch (paths,s,d,conflict) => path - Create empty files through the VFS queue. Existing files conflict unless --skip / --overwrite.
transform (input,src,output,p,...) - AI image editing (Gemini / Google)
understand (input,p,dst,provider,...) - OCR / markdown extraction for one image (local llama VLM, Paddle ONNX, or a cloud vision...
video create (output,p,provider,model,...) - AI text-to-video / image-to-video (Tanit LiteLLM /v1/videos, or Replicate).
video detect (m,i,width,height,...) - Real-time YOLO-format object detection from a webcam. Outputs NDJSON frames to stdout; prints a...
video filter (input,dst,skin-strength,lips-color,...) - Test harness: file/still in → face beauty → file out. Product capture path is `video record`...
video image (dst,input,mode,width,...) - Capture a single still frame from a webcam and save it as an image file.
video info (input) - List capture sources usable by `video image` / `video record` / `video detect`: webcam devices...
video record (dst,input,mode,width,...) - Record video from a webcam OR a screen/window. Windows .mp4 uses H.264 + optional AAC audio...
video record status - Show the active `video record` session (device, mode, codec, elapsed time, frames, dst).
video record stop - Signal a running `video record` session in another terminal to stop cooperatively.
voice listen (route,wake-phrase,filter,filter-model,...) - Listen for a wake-prefixed command.
voice replay (route,wake-phrase,filter,filter-model,...) - Run a WAV or injected transcript through wake/intent routing.
voice status - Show active voice listeners.
voice stop - Cooperatively stop active voice listeners.
xblox info (commands) - Print XBlox block/command metadata for builders and LLM composition.
xblox info options (p) - Resolve a block-param options list (array of {value,label}) via block_params_ui resolver. Exits...
xblox info schema (schema-path,p,m) - Resolve a provider options schema via the block_params_ui resolver. Exits 0 when the schema has...
xblox run (src,commands,consent-ui,consent-owner,...) - Run a blocks-file JSON document emitted by the XBlox web app.
xblox selftest - Run native runtime self-tests (scope frames, exit policy, muParser var factory) and print a JSON...
xblox session broadcast (message,from) - Send a message to every live session's inbox.
xblox session get (key,name) - Read a variable from a session's published scope.
xblox session info (key) - Show a session's details (xblox file, cwd, pid, uptime) and live vars.
xblox session list - List live sessions (stale entries are reaped on scan).
xblox session ping (key) - Send a ping to a session (or --all); prints the pong reply.
xblox session pong (key) - Send a pong to a session (or --all); prints the ping reply.
xblox session recv (key) - Drain (or --peek) a session's message inbox.
xblox session send (key,message,from) - Send a directed message to a session's inbox.
xblox session set (key,name,value) - Set a variable on a session (applied at the next loop pass).
xblox session start (key,label) - Host a bare session and block until stopped (Ctrl+C or `session stop`).
xblox session stop (key) - Signal a session (or --all) to stop.
xblox session vars (key) - List a session's published variables.
