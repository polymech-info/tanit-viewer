##### Examples

**Beside the source** (writes `report.md` next to the file)

```sh
tanit-cli markdown report.docx
```

**One output file**

```sh
tanit-cli markdown report.docx notes/report.md
```

**Glob into a directory** (each file becomes `<stem>.md`)

```sh
tanit-cli markdown "docs/**/*.{docx,pdf,pptx,xlsx}" out/
```

**Template** (`${SRC_DIR}`, `${SRC_NAME}`, `${SRC_FILE_EXT}`, or `&{SRC_*}`)

```sh
tanit-cli markdown "docs/*.docx" "${SRC_DIR}/${SRC_NAME}.md"
```

**Several files** (`--dst` is a directory)

```sh
tanit-cli markdown --src a.docx --src b.pdf --dst out/
```

**CSV** (no file signature; name the format)

```sh
tanit-cli markdown table.csv -f csv --stdout
```
