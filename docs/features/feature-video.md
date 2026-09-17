---
title: Tanit Video
slug: tanit-video
description: Record the screen, a window, or a camera — with cursor, PiP, skin, captions, and skip-dead-air — in the app, CLI, and XBlox.
tags: [tanit, video, capture, screen-record, webcam, skin, tutorial]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Video: capture exactly what matters

Tanit records a monitor, one application, a precise region, or a webcam —
without making you crop the desktop afterward. On top of that: tutorial-grade
cursor, a picture-in-picture camera with skin, captions after you stop, and
skip-dead-air so the MP4 does not keep the coffee pause.

The same recording runs in the app, the CLI, and XBlox. Full flag lists live
in the [CLI](../cli/cli.md) and [XBlox](../xblox.md) references; the patterns
below are what people actually type.

> Available capabilities can vary by edition and organization policy.

---

## Who it's for

- A walkthrough, bug report, or lesson — one window, not the whole desk.
- A vertical clip that follows the pointer.
- A meeting take: you on camera, skin and light, or a circle on the screen.
- A long capture that should omit idle and come with an SRT for YouTube.

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
