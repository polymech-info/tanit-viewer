##### Examples

**Office folder** (`.docx` / `.xlsx` / `.pptx` and `.odt` / `.ods` land in `office.vstore`)

```sh
tanit-cli search index docs/ --content office --index-policy specific-dir --index .pixlwiz/search
```

**Default store beside the inputs**

```sh
tanit-cli search index docs/ --content any
```

**Image tags** (EXIF, IPTC, and XMP, including `<stem>.xmp`. No embedding model. Run this after `meta gen --write` or `tags write`. `ocr-local` and `llm-meta` stay opt-in)

```sh
tanit-cli search index "**/*.{jpg,jpeg,png,cr3}" --adapter image-tags --index ".tanit-index"
```

**Vision text, no file write** (`llm-meta` calls the vision model and stores the answer in `image-meta.vstore`. EXIF and `<stem>.xmp` are not changed)

```sh
tanit-cli search index . --adapter llm-meta --index ".tanit-index"
```

**Rebuild**

```sh
tanit-cli search index docs/ --content office --index .pixlwiz/search/office.vstore --reindex
```
