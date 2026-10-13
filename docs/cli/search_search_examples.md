##### Examples

**Name match** (no `--mode` is filename search)

```sh
tanit-cli search search docs/ -q report
```

**Text grep**

```sh
tanit-cli search search docs/ --content text --grep --query "vector store" -C 2
```

**Office and OpenDocument** (`.docx` / `.xlsx` / `.pptx` through officecli; `.odt` / `.ods` through anydoc). `--content any` does not open these files.

```sh
tanit-cli search search docs/ --content office --mode grep --backend exact --query electrocultura --max 5 --json
```

**One spreadsheet**

```sh
tanit-cli search search budget.ods --content office --mode grep --backend exact --query HarvestYield
```

**Indexed image tags** (same `--index` directory as `search index`; the query matches title, description, subjects, and `<stem>.xmp`. Index again after `meta gen --write`)

```sh
tanit-cli search search . --adapter image-tags --index ".tanit-index" --query bicycles --json
```

**Indexed vision text** (`llm-meta` store. `--mode semantic` reads `image-meta.vstore`. This is not the EXIF or `.xmp` written by `meta gen`)

```sh
tanit-cli search search . --adapter llm-meta --mode semantic --index ".tanit-index" --query "bicycle" --json
```

**Force the OpenDocument adapter**

```sh
tanit-cli search search notes.odt --adapter opendocument-anydoc --mode grep --backend exact --query 1908
```
