---
title: Tanit Images
slug: tanit-images
description: Clean a shoot, catalog photos, create and edit with AI, resize without a model — in the app, CLI, and XBlox.
tags: [tanit, images, photos, duplicates, junk, create, transform, search]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Images: clean the shoot, then make the next one

Tanit lives next to the folder. Cull accident shots. Group near-duplicates.
Write a caption beside the file. Ask what is in a photo. Resize for the web
without a model. Generate or edit when you need pixels that are not on disk
yet.

The same jobs run in the file panel, Chat, the CLI, and XBlox. Chat settings
pick default image / recognition providers; CLI flags and blocks override.

> Available capabilities can vary by edition and organization policy.

---

## Who it's for

- Anyone dumping a camera card who wants the dark, blown, and miss-focus
  frames first — offline, no cloud.
- People who keep three copies of the same product shot and want groups, not
  another duplicate app.
- Teams that catalog a folder (markdown / JSON / EXIF) and later search that
  text.
- People who say “remove the watermark” or “make a 1:1 hero” next to the
  files, not in a separate generator.

---

## Clean a shoot (offline)

**Junk** scores pixels on a small thumbnail: dark, blown, blur, flat, tiny.
No LLM, no sidecar. Sharp subject on a white wall is **not** blur — it keeps
a high edge peak.

```sh
tanit-cli find "D:/pictures/test" --junk --json
tanit-cli find "D:/pictures/test" --junk --min-score 0 --json
tanit-cli find "D:/pictures/test" --junk --junk-kinds blur --min-score 0.2
```

Dry-run, then Recycle Bin on Windows:

```sh
tanit-cli find "D:/pictures/test" --junk --action recyclebin --dry-run
tanit-cli find "D:/pictures/test" --junk --action recyclebin
```

XBlox: `imageAnalyze` (every decoded file) and `imageFind` mode `junk`.

**Duplicates** are a different pass. Default `--by fingerprint`: one libvips
thumbnail, then dHash / pHash / edge hash. No LLM. Tanit Viewer keeps this
path.

```sh
tanit-cli duplicates "D:/pictures/test"
tanit-cli duplicates "D:/pictures/test" --max-hamming 0
tanit-cli duplicates "D:/pictures/test" --by size
tanit-cli duplicates "D:/pictures/test" --save-session dups.json --report-md dups.md
```

`--by meta` hashes sidecar / EXIF text. XBlox duplicate mode is not shipped
yet — use the CLI.

By **filename** (substring, no pixels):

```sh
tanit-cli find "D:/pictures/test" -p DSC032
```

More patterns: [find examples](../cli/find_examples.md) ·
[duplicates examples](../cli/duplicates_examples.md).

---

## Catalog and ask

**Meta** writes description sidecars next to the file (`.md` / `.json`) and
can update EXIF. Needs a recognition provider (Chat image recognition).
`--dry-run` prints JSON and writes nothing.

```sh
tanit-cli meta shot.jpg
tanit-cli meta "D:/pictures/test" --out-dir catalog
```

**Understand** is the question, not the cataloguer. No sidecar. Local llama
VLM or the same cloud recognition model. Chat uses `image_understand` (not
`image_meta` — that tool is gone from the agent catalog).

```sh
tanit-cli understand shot.jpg -p "What text is readable?"
tanit-cli understand receipt.jpg -p "Extract prices and names as JSON" --stdout
```

XBlox: `imageUnderstand`. Chat also has **`ocr_text`** when you only want
verbatim text.

`find --llm --local-text` searches existing sidecar / EXIF strings without a
judge model:

```sh
tanit-cli find "D:/pictures/test" --llm --local-text -p "product shot"
```

---

## Search the tree

`search search` is unified **file** search (exact first; semantic after you
index). It is not the junk scorer.

```sh
tanit-cli search search "D:/pictures" -p invoice
tanit-cli search index "D:/pictures"
```

`search detail` expands a hit through the owning adapter. `search action`
(replace) is reserved — do not rely on it yet.

In the app, the file panel **Search** is the same idea next to the folder.

---

## Resize and compress (no model)

libvips, Sharp-like fit. Convert format in the same call. This is **not**
“remove the object” — that is transform.

```sh
tanit-cli resize hero.png --max-width 1920 --format webp
tanit-cli compress shoot/*.jpg -q 85
```

Chat: `image_resize`, `image_crop`. XBlox: `imageResize`. Compress is CLI
(and an internal agent helper); there is no XBlox compress block.

---

## Create, then edit

**Create** — text to image. No input file. Optional `-r` style / brand stills.
Provider/model from Chat image settings unless you pass `--provider` /
`--model` / `--preset`.

```sh
tanit-cli create table.png -p "A glass dining table, sunlit room, 1:1 product still"
tanit-cli create hero.png -p "Same table, brand palette from the refs." -r mood.jpg -r logo.png
```

**Transform** — edit a file that already exists. Prompt is the action
(“remove the watermark”, “composite the logo”). Destination is the input;
content to insert goes on `-r`, not as a second `--src` (that would edit
each file separately).

```sh
tanit-cli transform shot.jpg -p "Remove the watermark, keep the product"
tanit-cli transform poster.jpg -p "Place the logo bottom-right, small" -r logo.png
```

Chat: `image_create` / `image_transform`. XBlox: `imageCreate` /
`imageTransform`. Video-from-a-still is [video create](./feature-video.md),
not transform.

---

## Grab a still

XBlox `imageScreenshot` — monitor, window, or interactive pick, optional
clipboard. Chat `image_from_camera` — list devices, then capture a JPEG into
the current folder. Same capture stack as `video image`.

---

## App, CLI, Chat, XBlox

| | Use it when |
|:--|:------------|
| **File panel** | Browse, select, Search; Chat sees the current folder |
| **Chat** | “What’s in this?”, “make a square webp”, “remove the cable” |
| **CLI** | Scripts, Recycle Bin after a dry-run, duplicate sessions |
| **XBlox** | Analyze → Find junk → Resize → hand to the next block |

| Job | CLI | Chat tool | XBlox |
|:----|:----|:----------|:------|
| Junk / name | `find --junk` / `-p` | (CLI / block) | `imageAnalyze`, `imageFind` |
| Duplicates | `duplicates` | — | (CLI) |
| Catalog | `meta` | `image_understand` to ask | — |
| Ask / OCR | `understand` | `image_understand`, `ocr_text` | `imageUnderstand` |
| File search | `search search` / `index` | file panel | — |
| Resize | `resize` | `image_resize`, `image_crop` | `imageResize` |
| Compress | `compress` | (internal) | — |
| Generate | `create` | `image_create` | `imageCreate` |
| Edit | `transform` | `image_transform` | `imageTransform` |
| Capture | `video image` | `image_from_camera` | `imageScreenshot` |

[CLI](../cli/cli.md) · [XBlox](../xblox.md) · [Chat settings](../llm/settings-chat.md).

---

## Related docs

- [Files](./feature-files.md) — folder, selection, Chat context
- [Tanit AI](./feature-ai.md) — providers, vision, agent tools
- [Video](./feature-video.md) — still from screen / camera, generate motion
- [Audio](./feature-audio.md)

---------

