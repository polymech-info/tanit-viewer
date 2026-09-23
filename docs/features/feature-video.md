---
title: Tanit Video
slug: tanit-video
description: Record the screen, a window, or a camera — then play the file in the centre viewer. Cursor, PiP, skin, captions, skip-dead-air, native mpv playback.
tags: [tanit, video, capture, playback, mpv, screen-record, webcam, skin, tutorial]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Video: capture it, then play it

Tanit records a monitor, one application, a precise region, or a webcam —
without making you crop the desktop afterward. On top of that: tutorial-grade
cursor, a picture-in-picture camera with skin, captions after you stop, and
skip-dead-air so the MP4 does not keep the coffee pause.

Open the file in the centre viewer and it plays there — native on-screen
controls by default, or the web player if that plugin is off. The same
recording runs in the app, the CLI, and XBlox. Full flag lists live in the
[CLI](../cli/cli.md) and [XBlox](../xblox.md) references; the patterns below
are what people actually type.

> Available capabilities can vary by edition and organization policy.

---

## Who it's for

- A walkthrough, bug report, or lesson — one window, not the whole desk.
- A vertical clip that follows the pointer.
- A meeting take: you on camera, skin and light, or a circle on the screen.
- A long capture that should omit idle and come with an SRT for YouTube.
- Anyone opening a clip from the file panel who wants pause, seek, volume,
  and the next file in the folder — without leaving Tanit.

---

## Play a file

Select a video in the file panel. The centre viewer opens it. Typical
extensions: `.mp4`, `.m4v`, `.mkv`, `.webm`, `.mov`, `.avi`, `.wmv`, `.ogv`,
`.mpg` / `.mpeg`, `.ts` / `.m2ts` / `.mts`, `.3gp` / `.3g2`. Direct `https://`
files play too — from the file panel, or `tanit --src "https://host/clip.mp4"`
(HLS `.m3u8` as well). YouTube pages and other site URLs stay in the browser —
youtube-dl is off.

### Native player (default)

When **Settings → General → Use mpv player** is on and the plugin is
installed, playback is an embedded native surface with mpv's on-screen
controller (OSC): play/pause, seek bar, volume, fullscreen, and folder
prev/next.

The bar shows on load and on mouse move, then hides after about a second.
Move the mouse over the video to bring it back. **Delete** cycles OSC
visibility: never, auto (mouse), always. On 2K/4K (or HiDPI) the bar is
drawn larger so the buttons stay clickable; a smaller pane keeps the
stock size.

| OSC control | Left click | Middle click | Right click / other |
|:---|:---|:---|:---|
| Play / pause | Pause | Loop playlist | Loop this file |
| Playlist arrows | Previous / next **video in the folder** | Toggle **auto-play** (prev) or **auto-next** (next) | Track / playlist picker |
| Seek bar | Jump | — | — |
| Skip back / forward | -5 s / +10 s | Frame step | -30 s / +60 s |
| Volume | Mute | — | Wheel over the bar +/- 5 |
| Fullscreen | Cover the monitor | — | — |

Folder prev/next is Tanit walking sibling videos in the current folder —
the same list as the web viewer's prev/next. It is **not** mpv's own
playlist. Keyboard `Left` / `Right` seek inside the clip; they do not
change files. Use the OSC arrows (or the web toolbar, in fallback).

**Auto-play** starts the file when it opens (on by default). **Auto-next**
opens the next sibling when the current file ends (off by default). Both
persist in appearance settings. Mid-click the OSC arrows to toggle them;
the player shows a short OSD.

**Fullscreen** is Tanit's immersive cover — workbench chrome hidden, or
the lightbox covering the monitor — not a separate exclusive mpv window.
`f`, double-click the picture, or the OSC fullscreen button. Leave with
`Esc` (while fullscreen) or the same toggle. Window shortcuts `F11` and
`Alt+F` still belong to the Tanit frame; see
[keyboard shortcuts](../keyboard-shortcuts.md#video-viewer) for the full
player map (seek, speed, volume, tracks, picture).

The cursor on the video hides on the same idle timeout as the OSC.

### Scripts and key bindings

Tanit does **not** load a user `mpv.conf`, `input.conf`, or Lua from the
standalone mpv folders (`%APPDATA%\mpv\` on Windows, `~/.config/mpv/`
elsewhere). There is no “drop a script in `scripts/`” path, and no way to
rebind keys with a config file. That is the embed: one Store-safe Lua
(PUC-Rio 5.2) and a fixed option set.

What does run:

- Builtin OSC (`@osc.lua` compiled into the player) — the on-screen bar.
- Builtin `select` — OSC track / playlist pickers, and the `g` then letter
  menus (`g` `a` audio, `g` `s` subtitle, `g` `p` playlist).
- mpv’s **compiled-in default key bindings**, injected from the embed
  window. Space, seek arrows, `f`, `m`, `[` / `]`, and the rest of that
  map work as in stock mpv, except as noted below.

What does not:

- Your own `.lua` under `scripts/`.
- A custom `input.conf` or `mpv.conf`.
- Stats overlay (`i` / `I`), console (`` ` ``), auto-profiles, youtube-dl /
  yt-dlp, and the positioning script (Ctrl+wheel zoom, drag-to-pan).
  Those bindings exist in the default map but have nothing to call.

Tanit remaps only the OSC playlist arrows (folder siblings, auto-play /
auto-next). Keyboard `<` / `>` / Enter still mean mpv playlist, which is
a single file here — use the OSC arrows (or the web toolbar) to change
files. `F11` and `Alt+F` stay Tanit window chrome, not the player.

The full key table is in [keyboard shortcuts](../keyboard-shortcuts.md#video-viewer).

### Web player (fallback)

If the mpv setting is off, or the plugin is missing, the centre pane uses
the web video viewer. Auto-play, auto-next, playback rate, zoom/pan, and
subtitle browse live on that toolbar. Space / seek / mute follow the
in-pane player chrome. Codecs then depend on the installed WebView
runtime — the same caveat as [embedded Markdown video](./feature-markdown.md).

---

## A walkthrough

Pick the monitor or the window. Mux desktop sound, or mix in your mic.
Highlight the pointer so viewers can follow.

```sh
tanit-cli video record --input "screen:0" --dst demo.mp4 --fps 30
```

```sh
tanit-cli video record --input "screen:0:wintitle=Tanit*" --dst walkthrough.mp4 `
  --audio-source mix --mic-gain 0.9 `
  --cursor-highlight --cursor-clicks
```

A region stays attached if the window moves:

```text
screen:0:hwnd=123456:rrect=120,80,900,900
```

Windows `.mp4` is H.264 + optional AAC (48 kHz stereo — the same mux as
[audio record](./feature-audio.md)). NVIDIA can use NVENC; otherwise the
Windows encoder. Clean the mic on the mux worker (not the capture callback):

```sh
tanit-cli video record --input "screen:0" --dst talk.mp4 `
  --audio-source mic --filter deepfilter --pf
```

Desktop-only loopback stays dry. Stop with duration, Ctrl+C, the overlay
(`--hud`), a `stopKey`, or `video record stop` from another terminal.

XBlox: `videoCapture` action **Record**, or **Start** / **Update** / **Stop**
on a named instance (change zoom without restarting the encoder).

---

## A short

Portrait canvas, fill-crop, follow the cursor. Shift+wheel zooms while you
record (`--interactive-zoom`).

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

Square + interactive zoom:

```sh
tanit-cli video record `
  --input "screen:0" --dst square.mp4 `
  --width 1080 --height 1080 --size-mode fill --interactive-zoom
```

Zoom / follow / bitrate need the **fast** Windows capture path (WGC). That
is the default for screen/window.

---

## You on camera

Omit `--input` for the default webcam (`video info` lists names). `--preview`
opens a live window; close it to stop.

```sh
tanit-cli video record --dst rec.mp4 --preview --width 1280 --height 720
```

**Skin** (off unless you set it) smooths the face oval minus eyes and lips.
`--skin` is the heavy one at 1080p. GPU ROI blur when available, else CPU.
A meeting-style stack — gain, warmth, under-eye, redness, restore the eyes
after skin:

```sh
tanit-cli video record --dst rec-meet.mp4 --preview --width 1280 --height 720 `
  --face-gain 0.35 --warmth 0.3 --undereye --redness --eye-sharpen
```

Full mesh (skin + lips + teeth):

```sh
tanit-cli video record --dst rec-mesh.mp4 --skin --lips --teeth --preview `
  --width 1280 --height 720
```

Quote hex in PowerShell (`"--lips-color" "#C41E3A"`).

**Live vs a file you already have.** `video record --skin` is the product
path. `video filter` is the same processor on a still or clip (try a JPEG
first; `--status` probes the face runtime):

```sh
tanit-cli video filter --status
tanit-cli video filter --input face.jpg --dst out-meet.png `
  --face-gain 0.35 --warmth 0.3 --undereye --redness --eye-sharpen `
  --running-mode image
tanit-cli video filter --input take.mp4 --dst take-skin.mp4 --skin --eye-sharpen
```

Background: person stays sharp (`--blur`, or `--background` + color/image).
`--mirror` is a flip with no model.

Full-frame skin, preview, blur, and virtual camera **force the compatibility
CPU recorder** — no HQ zoom/follow on that pass. Compose instead: record the
screen fast, or put skin on the PiP (next).

---

## Screen and a camera tile

Picture-in-picture without OBS. The screen stays on fast WGC. Skin / blur /
mirror apply to **the circle only**.

```sh
tanit-cli video record --input "screen:0" --dst demo.mp4 `
  --camera-overlay --skin --blur --mirror --width 1920 --height 1080
```

Corner, size, and shape (`circle` / `rounded` / `square`) are optional.
XBlox: `cameraOverlay`, `cameraPosition`, `skin`, `blur`, `mirror`.

**Tanit Cam** (Windows 11): Zoom / Teams see the processed camera while this
process runs. `--dst` may be empty. Register once: `video vcam-register`.

```sh
tanit-cli video record --virtual-out --dst rec.mp4 --skin --preview `
  --width 1280 --height 720
```

---

## Skip the silence, keep the captions

Idle auto-pause omits dead air from the MP4 without stopping capture.
Keyboard, mouse, speech, or a real frame change keep it rolling; a coffee
pause does not. Manual pause still wins.

```sh
tanit-cli video record --input "screen:0" --dst lesson.mp4 `
  --audio-source mix --auto-pause both
```

Captions are **after finalize**, on the encoded timeline (paused time already
gone). YouTube-accepted **SRT** (default), VTT, or SBV — not a live HUD.

```sh
tanit-cli video record --input "screen:0" --dst lesson.mp4 `
  --audio-source mix --captions sidecar --caption-format srt
```

STT follows Chat voice settings unless you pass `--stt-provider` /
`--stt-model`. Same sidecar idea as [audio](./feature-audio.md).

---

## Generate when there is no take

Prompt → MP4 through the Chat video provider (`video-fast` / `video-deep`).
At most two **keyframes** (`--src` start / last). Extra style images are
`-r`, not a third `--src`.

```sh
tanit-cli video create table.mp4 `
  -p "A glass-top dining table in a sunlit room. Slow camera pan left to right." `
  --model video-fast --duration 4 --resolution 720p --aspect-ratio 16:9
```

More patterns: [video create examples](../cli/video_create_examples.md).
XBlox: `videoCreate`.

---

## When the frame should become data

`video detect` runs YOLO on a webcam or `screen:N` — boxes, pose, classify.
Optional annotated still or burn-in MP4. XBlox `videoDetect` can run child
blocks when something is found. `videoSource` pumps frames into a flow
without a `for` loop.

That is a different job from recording a tutorial. List devices and windows
with `video info` / `videoListScreens`.

---

## App, CLI, XBlox

| | Use it when |
|:--|:------------|
| **App** | Overlay HUD, session record, the same source picker as screenshots |
| **CLI** | Scripts, a second terminal (`record stop` / `status`) |
| **XBlox** | Hotkey Start/Stop, Update zoom, hand the file to the next block |

Worked examples: [video record](../cli/video_record_examples.md) ·
[XBlox capture](../xblox_video_capture_examples.md).

---

## Related docs

- [Keyboard shortcuts](../keyboard-shortcuts.md#video-viewer) — native player keys, OSC clicks, folder prev/next
- [Audio](./feature-audio.md) — mic / desktop / mix, DeepFilter on the mux
- [Tanit AI](./feature-ai.md) — models, vision, generate
- [Images](./feature-images.md) — stills, junk, create, transform
- [Files](./feature-files.md)
- [App commands](../app-commands.md) — session video record start / stop

---

## Illustration prompts

<!-- Internal production notes: remove this section before publishing. -->

Use one visual language across the set: clean white / very light warm-grey background, flat editorial vector illustration, restrained teal `#4A90A4` accent with small coral highlights, soft shadows, rounded panels, crisp geometry, generous whitespace, no gradients, no logos, no fake UI text, no tiny labels, no dark cyberpunk styling. Images should feel fast, calm, capable, and human — a sophisticated desktop creative tool rather than a developer dashboard.

### 1. Hero — video capture on its own

**Filename:** `tanit-video-capture-hero.png`  
**Format:** wide 16:9 editorial illustration.

> A modern desktop video recorder centred on one clear idea: capture exactly what matters. Show a large monitor with several applications visible, while a precise teal selection frame isolates one useful window panel. That selected region flows into a polished video card with a play symbol, clean audio waveform, cursor toggle, and quality indicator. Add a small webcam tile and microphone symbol as optional sources. Convey directness and speed with two or three subtle motion lines, but keep the composition calm and uncluttered. White zen background, flat vector style, teal accent, soft shadows, no readable interface text.

_Suggested caption: Screen, window, region, camera, and sound — captured as one clean result._

### 2. Pick once — screen, window, or exact region

**Filename:** `tanit-video-source-picker.png`  
**Format:** landscape 4:3 explanatory diagram.

> Show one desktop branching into three simple capture choices: full monitor, one application window, and a precise sub-region inside that window. The sub-region remains visually attached as the window shifts slightly, communicating that the selected area follows its parent window. Each choice converges into the same recording tile. Use spatial storytelling instead of text labels: nested frames, a monitor outline, a window card, and a cropped panel. Minimal teal-and-grey vector diagram, generous whitespace, no technical notation.

_Suggested caption: Choose the whole scene or only the part your audience needs._

### 3. Xblox — a video workflow at light speed

**Filename:** `tanit-video-xblox-flow.png`  
**Format:** extra-wide 16:9 workflow illustration.

> A joyful, high-speed visual pipeline made from large friendly Xblox-style cards connected left to right: choose source, capture frames, detect objects, draw results, encode video, save or publish. Show real visual payloads moving through the cards — a small frame enters, detected objects gain clean bounding boxes, the annotated frame becomes a finished video. The blocks should look approachable and rearrangeable, not like programming code. Add subtle streaks and a fast-moving frame ribbon to suggest “automation at light speed.” White background, teal connectors, coral highlights for detections, crisp editorial vector style, no readable code or tiny text.

_Suggested caption: Capture, understand, transform, and deliver — one fast visual flow._

### 4. Video in context — detection, AI, and action

**Filename:** `tanit-video-detection-context.png`  
**Format:** wide 16:9 system illustration.

> Show a live video frame of a workshop, studio, or desktop application entering a visual intelligence layer. A few objects are identified with elegant bounding boxes and simple category markers; the result branches into three useful outcomes: an annotated recording, a concise AI observation card, and an automation trigger. Keep people and objects natural and professional, with detection graphics restrained rather than surveillance-like. The image should communicate that video is not merely stored — it can be understood and acted upon. Light editorial vector style, white background, teal and coral accents, no fake analytics dashboard.

_Suggested caption: Video can become evidence, insight, or the start of the next action._

### 5. Skin — live camera and post file

**Filename:** `tanit-video-skin-filter.png`  
**Format:** landscape 16:9 split illustration.

> Two calm panels, same person, no before/after horror. Left: a webcam take with a soft oval on the face (eyes and lips left crisp) flowing into a recording tile — live skin. Right: a file card entering a compact filter step and leaving as a polished clip — post. A small PiP circle on a screen recording sits off to the side, showing skin on the overlay only. White background, teal oval, coral accent on the file path, no readable UI, no beauty-app tropes.

_Suggested caption: Smooth skin on the camera now, or on the file you already shot._

### 6. From capture to CMS and sharing

**Filename:** `tanit-video-cms-publish.png`  
**Format:** landscape 16:9 journey diagram.

> Illustrate a finished recording moving from a local project folder into the Tanit content system, then becoming available as a private client share, a published page, and a social-media-ready clip. Keep the local file, CMS library, web page, and phone preview visually connected as one continuous journey. Include a small lock symbol on the private route and a globe on the public route. Emphasise one workspace and no repeated upload/download steps. Clean white editorial diagram, teal path, warm human details, no brand logos and no readable UI text.

_Suggested caption: From local capture to private review or published content, without changing tools._

### 7. FFmpeg sidecar — the long tail of video possibilities

**Filename:** `tanit-video-ffmpeg-sidecar.png`  
**Format:** wide 16:9 capability map.

> Show the central Tanit/Xblox video flow connected to a compact high-performance FFmpeg sidecar represented as a small engine module. From it, fan out a rich but orderly set of visual outcomes: trimmed clip, resized vertical video, format conversion, extracted thumbnails, burned-in captions, audio replacement, compressed archive copy, and live stream. Use icons and transformed media cards rather than words. The main Xblox route remains simple while the sidecar opens a broad constellation of specialist options around it. Make the possibilities feel nearly endless but still organised: white background, teal pathways, subtle coral accents, flat precise vector design, energetic without clutter.

_Suggested caption: A simple visual workflow up front, with FFmpeg's deep toolbox available whenever needed._
