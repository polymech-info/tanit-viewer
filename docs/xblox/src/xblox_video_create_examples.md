##### Examples

Same rules as CLI `video create`: `prompt` is required; `input` / `startFrame` / `lastFrame` are keyframes (at most two); `references` are style / brand, not stills to animate. Empty `provider` / `model` use Chat video settings. Tanit aliases (`video-fast` / `video-deep`) go through LiteLLM `POST /v1/videos`.

**Text-to-video** (fast, 4 s, 720p)

```json
{
  "kind": "videoCreate",
  "prompt": "A glass-top dining table in a sunlit room. Slow camera pan left to right.",
  "outputPath": "${KNOWNFOLDER:Videos}/table.mp4",
  "model": "video-fast",
  "duration": 4,
  "resolution": "720p",
  "aspectRatio": "16:9",
  "generateAudio": false,
  "storeAs": "videoPath"
}
```

**Image-to-video** (PREVIOUS or an explicit start still)

```json
{
  "kind": "videoCreate",
  "prompt": "The table gently appears; soft light sweeping across the glass.",
  "input": "first.jpg",
  "model": "video-fast",
  "duration": 4,
  "storeAs": "videoPath"
}
```

Leave `input` empty to use PREVIOUS as the start frame.

**First + last frame**

```json
{
  "kind": "videoCreate",
  "prompt": "Smooth transition between the two stills. Locked camera.",
  "startFrame": "first.jpg",
  "lastFrame": "last.jpg",
  "model": "video-fast",
  "duration": 6,
  "storeAs": "videoPath"
}
```

Two paths on `input` are the same as start + last. Do not also set `startFrame` / `lastFrame`.

**Style refs + keyframe**

```json
{
  "kind": "videoCreate",
  "prompt": "Same table, brand palette and materials from the references.",
  "input": "first.jpg",
  "references": ["mood.jpg", "logo.png"],
  "model": "video-fast",
  "duration": 4,
  "storeAs": "videoPath"
}
```

**Quality clip with audio**

```json
{
  "kind": "videoCreate",
  "prompt": "Cinematic 360 of a glass dining table with carved legs.",
  "model": "video-deep",
  "duration": 8,
  "resolution": "1080p",
  "generateAudio": true,
  "storeAs": "videoPath"
}
```

`duration` `0` uses the model default (4 on fast, 8 on deep). `4K` is `video-deep` only. See CLI overlay `video_create_examples.md` for Veo limits and list prices.
