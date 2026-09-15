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
