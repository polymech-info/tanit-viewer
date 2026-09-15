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
