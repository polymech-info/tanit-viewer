# Duplicates — fingerprints, Hamming, and LLM compare

Companion for [`duplicates`](cli.md#duplicates). Default mode is **offline**. Tanit Viewer (`FEATURE_COMMAND_LLM=OFF`) ships fingerprint, size, and sidecar-hash only.

## Modes

| `--by` | What matches | Network |
|---|---|---|
| `fingerprint` (default) | Perceptual hashes on one 128px sRGB thumbnail | No |
| `size` | Equal file byte size | No |
| `meta` | SHA-256 of sidecar `.md` / `.json` + optional EXIF | No |
| `meta` + `--meta-compare-json-llm` | Chat LLM on sidecar JSON fields | Yes — full builds only |

Exact-byte identity is `--by size` (or a file hash you compute yourself). The fingerprint module does not hash the file.

## Fingerprint pipeline

```
source image
    ↓
libvips thumbnail (EXIF orientation applied)
    ↓
one RGB buffer
    ├── dHash (9×8 luma, 64 bits)
    ├── pHash-like 32×32 → 8×8 DCT (optional, `--no-phash`)
    ├── edge / shape hash (`|dx|+|dy|`)
    └── compact luma + color histograms
```

Same decode as `find --junk`. Do not run quality and fingerprint as two separate file reads if you can call `analyze_image` once.

### Hamming (`--max-hamming`)

Applies to **dHash**. Aspect ratio is also gated (`max_aspect_delta` ≈ 8%).

| Distance | Meaning |
|---|---|
| 0 | Exact dHash bucket (use `--max-hamming 0`) |
| 1–3 | Extremely close (re-encode / metadata) |
| 4–8 | Likely near-duplicate (default **8**) |
| 9–14 | Ambiguous — use `--min-similarity` or inspect |
| >14 | Unlikely the same picture |

`--min-similarity` (0..1) is an extra composite score (dHash + pHash + edge + histograms). `0` (default) leaves Hamming + aspect as the only link test.

Crops are **not** matched in v1. Recolored logos / icons often stay close on the **edge hash**. Rotation is EXIF-normalized only.

### Throughput knobs

```sh
tanit-cli duplicates "D:/pictures/100MSDCF" `
  --max-hamming 8 `
  --no-phash `
  --fingerprint-same-size-only `
  --analyze-max-side 128 `
  --json
```

| Flag | Effect |
|---|---|
| `--no-phash` | Skip the 32×32 DCT |
| `--fingerprint-same-size-only` | Pairwise only inside equal `file_size` buckets |
| `--analyze-max-side N` | Thumbnail longest side (default 128) |
| `--min-group N` | Hide groups smaller than N (minimum 2) |

## Reports

`--report-json` / `--save-session` / `--report-md` turn on full diagnostics (per-file hashes, pairwise Hamming, `duplicate_map`).

```sh
tanit-cli duplicates "D:/pictures/test" `
  --save-session dups.json `
  --report-md dups.md `
  --json
```

`--load-session` validates and prints a summary; it does not rescan.

`--json` on a live scan prints `groups[]` with `method`, `key`, `paths`. Empty groups → exit **1**.

## Meta hash (offline)

```sh
tanit-cli duplicates "D:/pictures/test" --by meta --no-exif
```

`--meta-prompt` is prepended to the corpus before normalize + SHA-256 (same prompt → same bucket). `--no-md` / `--no-json` / `--no-exif` drop those sources.

## LLM sidecar compare (full SKU only)

Compiled out when `FEATURE_COMMAND_LLM=OFF`. Uses the same `--preset` / `--provider` / `--model` / `--api-key` resolution as `create` / `transform` (chat router, not the image generator).

```sh
tanit-cli duplicates "D:/pictures/test" --by meta --meta-compare-json-llm --preset work
```

Generate missing `<stem>.json` first:

```sh
tanit-cli duplicates "D:/pictures/test" `
  --by meta `
  --meta-compare-json-llm `
  --meta-json-implicit-generate `
  --preset work
```

`--meta-json-min-sim` is 0–10 (default 7). Pairwise LLM calls grow as n² — prefer fingerprint for large folders.

## Related

- [`find --junk`](cli.md#find) — same thumbnail, junk scores instead of grouping
- XBlox `imageAnalyze` / `imageFind` — quality rows and junk/name find; fingerprint grouping stays on this CLI
