---
title: Image metadata templates
slug: image-meta
description: Template fields for meta gen — which names write to XMP, IPTC, and EXIF, and which stay in the plan.
tags: [tanit, images, metadata, exif, xmp, iptc]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Image metadata templates

`tanit-cli meta gen` loads a YAML or JSON template, asks a vision model for the fields that are not pinned, and writes the result. The model never writes the file.

A name resolves under `config_dir()/templates` (`product` loads `product.yaml`). A path to an existing `.yaml`, `.yml`, or `.json` file is used as-is. `tanit-cli meta gen --list` prints that directory. Template and `--values` files are capped at 1 MB.

Dry-run is the default. `--json` prints the plan. `--write` commits it.

---

## Example

This is the product template. Descriptive fields go into the JPEG because `writeMode` is `embedded`. Omit `writeMode` and the engine default is `sidecar` (`<stem>.xmp` beside the image).

```yaml
name: Product Photography
instructions: |
  Identify the product in the photograph. Use existing metadata as context.
  Name what is visible: the machine, the view, and the materials you can see.
  Do not invent specifications, serial numbers, prices, or brand names that are not visible.
defaults:
  operation: fill
  onConflict: review
  onError: skip
  writeMode: embedded
fields:
  title:
    type: string
    operation: fill
  description:
    type: string
    operation: replace
  keywords:
    type: string[]
    operation: merge
  creator:
    type: string
    operation: fill
  copyright:
    type: string
    operation: preserve
  rating:
    type: string
    operation: replace
    value: "4"
  comments:
    type: string
    operation: replace
    value: "Industrial plastic sheet press, front view"
```

The same template as JSON. A name `product` still prefers `product.yaml` when both files exist, because `.yaml` is tried first. Pass the `.json` path to load that file.

```json
{
  "name": "Product Photography",
  "instructions": "Identify the product in the photograph. Use existing metadata as context.\nName what is visible: the machine, the view, and the materials you can see.\nDo not invent specifications, serial numbers, prices, or brand names that are not visible.",
  "defaults": {
    "operation": "fill",
    "onConflict": "review",
    "onError": "skip",
    "writeMode": "embedded"
  },
  "fields": {
    "title": { "type": "string", "operation": "fill" },
    "description": { "type": "string", "operation": "replace" },
    "keywords": { "type": "string[]", "operation": "merge" },
    "creator": { "type": "string", "operation": "fill" },
    "copyright": { "type": "string", "operation": "preserve" },
    "rating": { "type": "string", "operation": "replace", "value": "4" },
    "comments": { "type": "string", "operation": "replace", "value": "Industrial plastic sheet press, front view" }
  }
}
```

```sh
tanit-cli meta gen shot.jpg --template "D:/templates/product.json" --json
```

`value` is written as given. The model is not asked for that field. A `--values` file overrides it when the key is present. If every field that is not `preserve` has a `value`, the vision model is not called.

`category`, `materials`, and `altText` may appear in a template. They stay in the plan (`action: deferred`) and are not written.

---

## Fields that write

These seven names are the registry. Any other name is accepted and kept in the plan only.

XMP is always the authority. IPTC and the EXIF mirrors below are written only when `writeMode` is `embedded`. Camera EXIF (make, model, lens, exposure, `DateTimeOriginal`) is sent to the model as context and is never written.

| Field | Type | XMP (always) | IPTC (`embedded` only) | EXIF (`embedded` only) |
|:------|:-----|:-------------|:-----------------------|:-----------------------|
| `title` | string | `Xmp.dc.title` | `Iptc.Application2.ObjectName` | |
| `description` | string | `Xmp.dc.description` | `Iptc.Application2.Caption` | |
| `keywords` | string[] | `Xmp.dc.subject` | `Iptc.Application2.Keywords` | |
| `creator` | string | `Xmp.dc.creator` | `Iptc.Application2.Byline` | |
| `copyright` | string | `Xmp.dc.rights` | `Iptc.Application2.Copyright` | |
| `rating` | string | `Xmp.xmp.Rating` | | `Exif.Image.Rating` |
| `comments` | string | `Xmp.exif.UserComment` | | `Exif.Photo.UserComment` |

Keys are [Exiv2](https://exiv2.org/metadata.html) names (`tags write` uses the same names).

| Property | Spec |
|:---------|:-----|
| `dc:title`, `dc:description`, `dc:subject`, `dc:creator`, `dc:rights` | [Dublin Core](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/), mapped by [XMP `dc`](https://developer.adobe.com/xmp/docs/XMPNamespaces/dc/) |
| `xmp:Rating` (−1 rejected, 0 unrated, 1–5) | [XMP Basic](https://developer.adobe.com/xmp/docs/XMPNamespaces/xmp/) |
| `exif:UserComment` | [XMP `exif`](https://developer.adobe.com/xmp/docs/XMPNamespaces/exif/) and [CIPA EXIF](https://www.cipa.jp/e/std/std-sec.html) (UserComment, tag 37510) |
| Object Name, Caption, Keywords, By-line, Copyright Notice | [IPTC Photo Metadata](https://iptc.org/standards/photo-metadata/iptc-standard/) and [IPTC IIM 4.2](https://www.iptc.org/std/IIM/4.2/specification/IIMV4.2.pdf) |
| `Exif.Image.Rating` | Windows rating (0–5), not a CIPA camera tag. Exiv2 lists it on [Exif tags](https://exiv2.org/tags.html). IPTC keywords and the other IIM tags are on [IPTC tags](https://exiv2.org/iptc.html). |

`type` is `string` or `string[]` (`array` is the same as `string[]`). Anything else is treated as `string`. `keywords` is the only registry field that is a list. `merge` on a string is skipped (`string merge is not concatenation`).

---

## Operations

A field `operation` overrides `defaults.operation`. The default is `fill`.

| Operation | What it does |
|:----------|:-------------|
| `fill` | Write only when the destination is empty. |
| `replace` | Overwrite. |
| `merge` | `string[]` only. Keep the existing order, then add items that are not already there (trim, case-insensitive). |
| `append` | Same as `merge` for a list. For a string, add the new text on a new line when it is not already in the current text. |
| `remove` | Drop list items that match the generated values. |
| `clear` | Unset the keys. An empty generated value still clears. |
| `preserve` | Do not ask the model. Do not write. |

A missing value, JSON `null`, or an empty string or empty list becomes `keep`, except `clear`. When the result equals what is already there, the action is `keep` and no edit is emitted.

---

## Defaults

| Key | Values | Default |
|:----|:-------|:--------|
| `operation` | `fill`, `replace`, `merge`, `append`, `remove`, `clear`, `preserve` | `fill` |
| `writeMode` | `sidecar`, `embedded` | `sidecar` |
| `onConflict` | `review`, `skip`, `sidecar`, `embedded` | `review` |
| `onError` | stored on the template | `skip` |

`onConflict: review` and `skip` do the same thing. If the image and the sibling `.xmp` both have a non-empty value and those values differ, that field is `conflict` and is not written. Empty against non-empty is not a conflict. `sidecar` and `embedded` write anyway, using `writeMode` as the destination.

`instructions` is the prompt. `-p` replaces it for that run. The field list stays.

---

## Related

- [Images](../features/feature-images.md)
- [meta gen examples](./meta_gen_examples.md)
- [tags](./tags_examples.md)
