# Find — name, junk, and optional LLM

Companion for [`find`](cli.md#find). Name and `--junk` are offline. `--llm` needs Chat image-recognition settings and is not the Tanit Viewer path (`FEATURE_COMMAND_FIND` is off there).

## Modes

| Invocation | Match | Prompt | Network |
|---|---|---|---|
| default | Filename + parent folders | required | No |
| `--junk` | Quality / accident scores | unused | No |
| `--llm` | Sidecar + EXIF, then a judge (or `--local-text`) | required | Yes unless `--local-text` |

`--junk` and `--llm` are mutually exclusive. Empty match list → exit **1**.

## Name

```sh
tanit-cli find "D:/pictures/test" -p vacation --json
tanit-cli find "D:/pictures/test" -p DSC --case-sensitive --no-folders
```

`--no-recursive` stays in the top folder. Inputs accept files, directories, or quoted globs.

## Junk (pixels only)

One libvips thumbnail (default longest side 128), then pure scores: dark, bright, blur, flat, tiny. Same RGB buffer the `duplicates` fingerprint uses.

```sh
tanit-cli find "D:/pictures/test" --junk --json --min-score 0.7
```

`--min-score 0` keeps every decoded image (useful to inspect `quality.edgeEnergy` / `junk.blur`).

### Kinds

`--junk-kinds` is a comma list: `dark`, `bright` (also `blown` / `white`), `blur`, `flat`, `tiny`, or `all`.

```sh
tanit-cli find "D:/pictures/test" --junk --junk-kinds blur,dark --min-score 0.4 --json
```

### Blur gate

`junk.blur` needs **all three**: low *mean* edge energy, low *p90* edge energy, and “has content”. Mean alone is wrong for a sharp machine on a white wall — the empty background pulls `edgeEnergy` down (~19) while `edgeEnergyP90` stays high (subject edges).

| Flag | Default | Role |
|---|---|---|
| `--edge-energy-blur` | 12 | Mean `\|dx\|+\|dy\|` at/above this → that term is 0. Try 22–28 for full miss-focus. |
| `--edge-energy-p90-blur` | 40 | p90 of the same gradient. At/above this → blur 0. |

```sh
tanit-cli find "D:/pictures/test" --junk --junk-kinds blur --edge-energy-blur 24 --min-score 0.2
```

JSON includes `edgeEnergy` and `edgeEnergyP90`. If a crisp product shot still matches, check p90 — do not only raise the mean gate.

### Other knobs

| Flag | Default | Role |
|---|---|---|
| `--edge-density-lo` | 0.06 | Density at/above this counts as “has edges” |
| `--analyze-max-side` | 128 | Thumbnail longest side |
| `--tiny-min-side` | 128 | `tiny` is 0 when `min(w,h)` ≥ this |
| `--edge-threshold` | 24 | `\|dx\|+\|dy\|` above this is an edge pixel |
| `--junk-opt key=value` | — | Any quality option (`edge_energy_blur_hi`, `edge_energy_p90_blur_hi`, …) |

```sh
tanit-cli find "D:/pictures/test" --junk `
  --junk-opt entropy_content_lo=1.2 `
  --junk-opt dark_fraction_lo=0.75 `
  --json
```

JSON rows add a `quality` object (`entropy`, `edgeEnergy`, `junk.hint`, …).

## Actions

`--action none|delete|recyclebin` runs **after** matches. `--dry-run` skips deletes (and LLM sidecar writes).

```sh
tanit-cli find "D:/pictures/test" --junk --junk-kinds tiny --action recyclebin --dry-run --json
```

`recyclebin` is Windows Recycle Bin (`SHFileOperation`). Confirm the list with `--json` first.

## LLM (full SKU)

`--llm` reads `<stem>.md` / `.json` / EXIF and, by default, asks a vision/chat judge. Missing sidecars are generated unless `--no-generate`.

```sh
tanit-cli find "D:/pictures/test" --llm -p "outdoor product on white" --json
```

Provider / model follow Chat **image recognition** (not the image generator). `--provider` / `--model` override; unset aborts.

`--local-text` skips the judge: case-insensitive substring / word match on the corpus only.

```sh
tanit-cli find "D:/pictures/test" --llm --local-text -p studio --no-generate
```

`--bypass-cache` forces re-extract. `-r` / `--reference` adds example images to every judge call.

```sh
tanit-cli find "D:/pictures/test" --llm -p "like these" -r swatch.jpg -r logo.png --max 20
```

## Related

- [`duplicates`](cli.md#duplicates) — group near-duplicates on the same thumbnail
- XBlox `imageFind` (`junk` / `name`) and `imageAnalyze` (quality rows, `minScore` 0)
