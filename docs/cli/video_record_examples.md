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
