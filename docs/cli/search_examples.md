##### Examples

`search` needs a subcommand. `action` is not implemented yet.

**Find files by name**

```sh
tanit-cli search search docs/ -q report
```

**Grep inside Office files** (`.docx` / `.xlsx` / `.pptx` via officecli, `.odt` / `.ods` via anydoc)

```sh
tanit-cli search search docs/ --content office --mode grep --backend exact --query electrocultura --max 5 --json
```

**Index a folder**

```sh
tanit-cli search index docs/ --content office --index-policy specific-dir --index .pixlwiz/search
```

**Read one document**

```sh
tanit-cli search detail --path notes.odt --json
```

**Image tags** (`--content image` selects the `image-tags` adapter. The index is a fingerprint store, not an embedding model. `find --tags` reads the files directly and does not use this index)

```sh
tanit-cli search index . --content image --index ".tanit-index"
tanit-cli search search . --adapter image-tags --index ".tanit-index" --query bicycles --json
```

**Write tags, then index them** (`meta gen --write` writes the template fields. `writeMode: embedded` puts XMP in the JPEG and mirrors IPTC plus rating and comment EXIF. `sidecar` writes `<stem>.xmp` and leaves the JPEG bytes. Re-index after a later write, or the query still sees the old tags)

```sh
tanit-cli meta gen "press.jpg" --template product --write
tanit-cli search index . --content image --index ".tanit-index"
tanit-cli search search . --adapter image-tags --index ".tanit-index" --query "bicycle" --json
```

**Ask the model only while indexing** (`--adapter llm-meta` stores the vision answer in `image-meta.vstore`. The JPEG and any sidecar stay unchanged. The query is semantic)

```sh
tanit-cli search index . --adapter llm-meta --index ".tanit-index"
tanit-cli search search . --adapter llm-meta --mode semantic --index ".tanit-index" --query "bicycle" --json
```
