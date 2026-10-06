##### Examples

**Office folder** (`.docx` / `.xlsx` / `.pptx` and `.odt` / `.ods` land in `office.vstore`)

```sh
tanit-cli search index docs/ --content office --index-policy specific-dir --index .pixlwiz/search
```

**Default store beside the inputs**

```sh
tanit-cli search index docs/ --content any
```

**Rebuild**

```sh
tanit-cli search index docs/ --content office --index .pixlwiz/search/office.vstore --reindex
```
