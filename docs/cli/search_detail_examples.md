##### Examples

**OpenDocument** (whole document; omit `--selector` and `--office-path`)

```sh
tanit-cli search detail --path notes.odt --json
```

```sh
tanit-cli search detail --path budget.ods --md --markdown plain
```

**Excel row** (officecli)

```sh
tanit-cli search detail --adapter office-officecli --path invoice.xlsx --office-path /Sheet1/row[2] --include-detail row --context-before 1 --context-after 1 --md --markdown plain
```
