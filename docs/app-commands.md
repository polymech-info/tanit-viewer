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
  - `path` (file_path, optional) - Folder or files to reveal.
- `edit` - Edit (open in editor)
  - `path` (file_path, optional) - Optional file to load first.
- `open` - Open (preview in viewer)
  - `path` (file_path, optional) - File or folder to open. Accepts ${…} expansion.
- `openurl` - Open URL (in-app browser)
  - `url` (string, optional) - HTTP(S) URL or CMS-relative path.
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
  - `path` (file_path, optional) - UTF-8 session JSON path.
- `togglevideorecord` - Toggle video record
- `togglemicrecord` - Toggle mic record

### Voice

- `realtimestart` - Start realtime voice
- `realtimestop` - Stop realtime voice
- `togglerealtime` - Toggle realtime voice
- `activaterealtime` - Activate realtime voice
- `voicecommandstart` - Start voice commands
  - `route` (enum, optional, default `"trigger"`, enum: trigger|agent) - trigger = emit a command envelope; agent = later realtime handoff.
  - `wakePhrase` (string, optional, default `"Tanit"`) - Prefix that must precede a command, e.g. Tanit.
  - `filter` (enum, optional, default `"auto"`, enum: auto|off|deepfilter|gtcrn) - Utterance enhancer. auto uses DeepFilter when available.
  - `filterModel` (string, optional) - Optional DeepFilter or GTCRN model path.
  - `postFilter` (boolean, optional, default `false`) - Aggressive DeepFilter post-filter.
  - `filterBlend` (float, optional, default `1.0`) - Wet/dry mix: 0 = original speech, 1 = full filter.
  - `provider` (enum, optional, enum: whisper|tanit|pixlwiz|elevenlabs) - Local whisper or network STT. Moss is TTS and is not valid here.
  - `model` (string, optional) - Model id or whisper ggml path. Empty uses settings / provider default.
  - `language` (string, optional, default `"auto"`) - auto or an STT language code.
  - `inputSource` (enum, optional, default `"mic"`, enum: mic|desktop|mix) - Microphone, desktop loopback, or both.
  - `input` (string, optional) - Microphone device substring. Empty uses settings.
  - `desktop` (string, optional) - Loopback device substring. Empty uses settings.
  - `micGain` (string, optional, default `"1"`) - Microphone gain multiplier.
  - `desktopGain` (string, optional, default `"1"`) - Desktop loopback gain multiplier.
- `voicecommandstop` - Stop voice commands
- `togglevoicecommand` - Toggle voice commands
  - `route` (enum, optional, default `"trigger"`, enum: trigger|agent) - trigger = emit a command envelope; agent = later realtime handoff.
  - `wakePhrase` (string, optional, default `"Tanit"`) - Prefix that must precede a command, e.g. Tanit.
  - `filter` (enum, optional, default `"auto"`, enum: auto|off|deepfilter|gtcrn) - Utterance enhancer. auto uses DeepFilter when available.
  - `filterModel` (string, optional) - Optional DeepFilter or GTCRN model path.
  - `postFilter` (boolean, optional, default `false`) - Aggressive DeepFilter post-filter.
  - `filterBlend` (float, optional, default `1.0`) - Wet/dry mix: 0 = original speech, 1 = full filter.
  - `provider` (enum, optional, enum: whisper|tanit|pixlwiz|elevenlabs) - Local whisper or network STT. Moss is TTS and is not valid here.
  - `model` (string, optional) - Model id or whisper ggml path. Empty uses settings / provider default.
  - `language` (string, optional, default `"auto"`) - auto or an STT language code.
  - `inputSource` (enum, optional, default `"mic"`, enum: mic|desktop|mix) - Microphone, desktop loopback, or both.
  - `input` (string, optional) - Microphone device substring. Empty uses settings.
  - `desktop` (string, optional) - Loopback device substring. Empty uses settings.
  - `micGain` (string, optional, default `"1"`) - Microphone gain multiplier.
  - `desktopGain` (string, optional, default `"1"`) - Desktop loopback gain multiplier.
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
  - `path` (file_path, optional) - File or folder to add to chat context.
  - `prompt` (string, optional) - Composer seed text (same as UI launch --prompt).
  - `send` (boolean, optional, default `false`) - Auto-send the seeded text (same as UI launch --send).
- `togglefiletree` - Toggle file explorer
- `showfiletree` - Show file explorer
- `hidefiletree` - Hide file explorer
- `newfiletab` - New file panel
  - `folder` (file_path, optional) - UTF-8 folder / virtual URI.
- `closefiletab` - Close file panel
  - `dock_id` (string, optional) - Optional extra file-panel dock id.
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
  - `query` (string, optional) - Search text applied to a running UI instance. Empty just shows the overlay.
- `showsearchnative` - Show native search
  - `query` (string, optional) - Search text applied to a running UI instance. Empty just shows the overlay.
- `hidesearchnative` - Hide native search
- `toggleperf` - Toggle perf overlay
- `showperf` - Show perf overlay
- `hideperf` - Hide perf overlay
- `togglecenterview` - Toggle centre view
- `showcentrechat` - Show centre chat
- `hidecentrechat` - Hide centre chat

### Workbench

- `switchworkbench` - Switch workbench
  - `slot` (enum, optional, enum: main|chat|viewer) - Workbench slot to activate.

### Window

- `debugstate` - Dump dock debug snapshot
- `resetlayout` - Reset layout
- `settings` - Open settings
- `toggletheme` - Toggle theme
- `toggleautogrow` - Toggle auto grow
- `showautogrow` - Enable auto grow
- `hideautogrow` - Disable auto grow
- `setframesize` - Set main frame size
  - `size` (string, optional) - Outer pixels (`800x600`) or `maximize` / `minimize`.
- `togglecommandpalette` - Toggle command palette
- `showcommandpalette` - Show command palette
- `hidecommandpalette` - Hide command palette
- `closewindow` - Close window
- `startfullscreen` - Start fullscreen
  - `preset` (enum, optional, default `"frame"`, enum: frame|immersive) - frame = F11: window chrome off and ribbon hidden; docks and viewer chrome stay. immersive also hides docks, statusbar, breadcrumb, toolbar, filmstrip, and pill.
  - `show` (string, optional) - Force visible after the preset (wins over hide). Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
  - `hide` (string, optional) - Force hidden after the preset, before show. Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
- `stopfullscreen` - Stop fullscreen
- `togglefullscreen` - Toggle fullscreen
  - `preset` (enum, optional, default `"frame"`, enum: frame|immersive) - frame = F11: window chrome off and ribbon hidden; docks and viewer chrome stay. immersive also hides docks, statusbar, breadcrumb, toolbar, filmstrip, and pill.
  - `show` (string, optional) - Force visible after the preset (wins over hide). Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
  - `hide` (string, optional) - Force hidden after the preset, before show. Comma-separated ids: docks, statusbar, ribbon, breadcrumb, toolbar, filmstrip, pill. Aliases: dock/panels, status, ribbonbar, breadcrumbs/pathbar, viewertoolbar/apptoolbar, gallery/strip, pilltoolbar/imagepill.
- `snapleft` - Snap left (Win+Left)
- `snapright` - Snap right (Win+Right)
- `snapup` - Snap up (Win+Up)
- `snapdown` - Snap down (Win+Down)
- `login` - Sign in
- `logout` - Sign out
