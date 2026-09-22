# Tanit App Commands

App commands are named verbs that control a running Tanit UI instance from outside (keyboard shortcuts, custom commands, IPC, or the `app` CLI subcommand).

## Invocation

- Via the CLI: `tanit-cli.exe app <verb>` (sends to the primary running instance).
- Via custom command action field `appCommand`: `"appCommand": "togglechat"`.
- Via IPC to a live instance: `tanit-cli.exe run-ipc app-cmd <pid> <verb> [-d '{...}']`.
- List verbs a live instance accepts (including args): `tanit-cli.exe run-ipc app-cmds <pid>`.
- Native search (`showsearchnative` / `togglesearchnative`) accepts a `query` arg, e.g. `tanit-cli.exe run-ipc app-cmd <pid> showsearchnative -d '{"query":"cats"}'`, or the pipe leftover `showsearchnative|cats`.

Commands that take args list them under the verb. Pass JSON with `tanit-cli.exe run-ipc app-cmd` `-d`, or a `|leftover` on the verb.

## Available App Commands

### Files

- `browse` - Browse
  - `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Folder or files to reveal.
- `edit` - Edit (open in editor)
  - `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Optional file to load first.
- `open` - Open (preview in viewer)
  - `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - File or folder to open. Accepts ${…} expansion.
- `openurl` - Open URL (in-app browser)
  - `url` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - HTTP(S) URL or CMS-relative path.
- `previousfile` - Previous file
- `nextfile` - Next file
- `fscopy` - Copy (file panels)
- `fsmove` - Move (file panels)
- `fsmkdir` - New folder
- `fstouch` - New file
- `fsrename` - Rename

### Recording

- `takescreenshot` - Take screenshot
- `recordstart` - Start session record
- `recordstop` - Stop session record
- `videorecordstart` - Start session video
- `videorecordstop` - Stop session video
- `videorecordpause` - Toggle session video pause
- `replay` - Session replay
  - `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - UTF-8 session JSON path.
- `togglevideorecord` - Toggle video record
- `togglemicrecord` - Toggle mic record

### Voice

- `realtimestart` - Start realtime voice
- `realtimestop` - Stop realtime voice
- `togglerealtime` - Toggle realtime voice
- `activaterealtime` - Activate realtime voice
- `voicecommandstart` - Start voice commands
  - `route` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;trigger&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trigger</span> <span data-cli="choice">agent</span></span></span>) - trigger = emit a command envelope; agent = later realtime handoff.
  - `wakePhrase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;Tanit&quot;</span></span></span>) - Prefix that must precede a command, e.g. Tanit.
  - `filter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">off</span> <span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Utterance enhancer. auto uses DeepFilter when available.
  - `filterModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Optional DeepFilter or GTCRN model path.
  - `postFilter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Aggressive DeepFilter post-filter.
  - `filterBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Wet/dry mix: 0 = original speech, 1 = full filter.
  - `provider` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">whisper</span> <span data-cli="choice">tanit</span> <span data-cli="choice">pixlwiz</span> <span data-cli="choice">elevenlabs</span></span></span>) - Local whisper or network STT. Moss is TTS and is not valid here.
  - `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Model id or whisper ggml path. Empty uses settings / provider default.
  - `language` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span></span>) - auto or an STT language code.
  - `inputSource` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;mic&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Microphone, desktop loopback, or both.
  - `input` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Microphone device substring. Empty uses settings.
  - `desktop` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Loopback device substring. Empty uses settings.
  - `micGain` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;1&quot;</span></span></span>) - Microphone gain multiplier.
  - `desktopGain` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;1&quot;</span></span></span>) - Desktop loopback gain multiplier.
- `voicecommandstop` - Stop voice commands
- `togglevoicecommand` - Toggle voice commands
  - `route` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;trigger&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">trigger</span> <span data-cli="choice">agent</span></span></span>) - trigger = emit a command envelope; agent = later realtime handoff.
  - `wakePhrase` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;Tanit&quot;</span></span></span>) - Prefix that must precede a command, e.g. Tanit.
  - `filter` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">auto</span> <span data-cli="choice">off</span> <span data-cli="choice">deepfilter</span> <span data-cli="choice">gtcrn</span></span></span>) - Utterance enhancer. auto uses DeepFilter when available.
  - `filterModel` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Optional DeepFilter or GTCRN model path.
  - `postFilter` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Aggressive DeepFilter post-filter.
  - `filterBlend` (<span data-cli="meta"><span data-cli="type">float</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">1.0</span></span></span>) - Wet/dry mix: 0 = original speech, 1 = full filter.
  - `provider` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">whisper</span> <span data-cli="choice">tanit</span> <span data-cli="choice">pixlwiz</span> <span data-cli="choice">elevenlabs</span></span></span>) - Local whisper or network STT. Moss is TTS and is not valid here.
  - `model` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Model id or whisper ggml path. Empty uses settings / provider default.
  - `language` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;auto&quot;</span></span></span>) - auto or an STT language code.
  - `inputSource` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;mic&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">mic</span> <span data-cli="choice">desktop</span> <span data-cli="choice">mix</span></span></span>) - Microphone, desktop loopback, or both.
  - `input` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Microphone device substring. Empty uses settings.
  - `desktop` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Loopback device substring. Empty uses settings.
  - `micGain` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;1&quot;</span></span></span>) - Microphone gain multiplier.
  - `desktopGain` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;1&quot;</span></span></span>) - Desktop loopback gain multiplier.
- `togglelauncher` - Toggle assistant toolbar

### Jobs

- `pausebatch` - Pause batch
- `resumebatch` - Resume batch
- `cancelbatch` - Cancel batch
- `schedulerstart` - Start scheduler
- `schedulerstop` - Stop scheduler
- `schedulerpause` - Pause scheduler

### Panels

- `chat` - Chat
- `referenceinchat` - Reference in Chat
  - `path` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - File or folder to add to chat context.
  - `prompt` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Composer seed text (same as UI launch --prompt).
  - `send` (<span data-cli="meta"><span data-cli="type">boolean</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">false</span></span></span>) - Auto-send the seeded text (same as UI launch --send).
- `togglefiletree` - Toggle file explorer
- `showfiletree` - Show file explorer
- `hidefiletree` - Hide file explorer
- `newfiletab` - New file panel
  - `folder` (<span data-cli="meta"><span data-cli="type">file_path</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - UTF-8 folder / virtual URI.
- `closefiletab` - Close file panel
  - `dock_id` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Optional extra file-panel dock id.
- `closeallfiletabs` - Close all extra file panels
- `togglequeue` - Toggle job queue
- `showqueue` - Show job queue
- `hidequeue` - Hide job queue
- `togglelog` - Toggle log panel
- `showlog` - Show log panel
- `hidelog` - Hide log panel
- `togglechat` - Toggle chat
- `showchat` - Show chat
- `hidechat` - Hide chat
- `togglesearchnative` - Toggle native search
  - `query` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Search text applied to a running UI instance. Empty just shows the overlay.
- `showsearchnative` - Show native search
  - `query` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Search text applied to a running UI instance. Empty just shows the overlay.
- `hidesearchnative` - Hide native search
- `toggleperf` - Toggle perf overlay
- `showperf` - Show perf overlay
- `hideperf` - Hide perf overlay
- `togglecenterview` - Toggle centre view
- `showcentrechat` - Show centre chat
- `hidecentrechat` - Hide centre chat

### Workbench

- `switchworkbench` - Switch workbench
  - `slot` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">main</span> <span data-cli="choice">chat</span> <span data-cli="choice">viewer</span></span></span>) - Workbench slot to activate.

### Window

- `debugstate` - Dump dock debug snapshot
- `resetlayout` - Reset layout
- `settings` - Open settings
- `toggletheme` - Toggle theme
- `toggleautogrow` - Toggle auto grow
- `showautogrow` - Enable auto grow
- `hideautogrow` - Disable auto grow
- `setframesize` - Set main frame size
  - `size` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Outer pixels (`800x600`) or `maximize` / `minimize`.
- `togglecommandpalette` - Toggle command palette
- `showcommandpalette` - Show command palette
- `hidecommandpalette` - Hide command palette
- `closewindow` - Close window
- `startfullscreen` - Start fullscreen
  - `preset` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;frame&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">frame</span> <span data-cli="choice">immersive</span></span></span>) - frame = F11: window chrome off and ribbon hidden; docks and viewer chrome stay. immersive also hides docks, statusbar, breadcrumb, toolbar, filmstrip, and pill.
  - `show` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Force visible after the preset (wins over hide). Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
  - `hide` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Force hidden after the preset, before show. Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
- `stopfullscreen` - Stop fullscreen
- `togglefullscreen` - Toggle fullscreen
  - `preset` (<span data-cli="meta"><span data-cli="type">enum</span>, <span data-cli="tag" data-variant="optional">optional</span>, <span data-cli="default">default <span data-cli="value">&quot;frame&quot;</span></span>, <span data-cli="tag" data-variant="enum">one of</span> <span data-cli="choices" data-variant="enum"><span data-cli="choice">frame</span> <span data-cli="choice">immersive</span></span></span>) - frame = F11: window chrome off and ribbon hidden; docks and viewer chrome stay. immersive also hides docks, statusbar, breadcrumb, toolbar, filmstrip, and pill.
  - `show` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Force visible after the preset (wins over hide). Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
  - `hide` (<span data-cli="meta"><span data-cli="type">string</span>, <span data-cli="tag" data-variant="optional">optional</span></span>) - Force hidden after the preset, before show. Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
- `snapleft` - Snap left (Win+Left)
- `snapright` - Snap right (Win+Right)
- `snapup` - Snap up (Win+Up)
- `snapdown` - Snap down (Win+Down)
- `login` - Sign in
- `logout` - Sign out
