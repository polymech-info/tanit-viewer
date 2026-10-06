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
