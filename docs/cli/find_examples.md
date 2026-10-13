##### Examples

Hand-picked search patterns. Name, `--tags`, and `--junk` are offline. `--tags` reads EXIF, IPTC, and XMP on the image and on `<stem>.xmp`; it does not use the search index. `--llm` needs a recognition provider (not in Tanit Viewer). `--tags` and `--junk` cannot be combined.

**By a tag value** (embedded metadata first, then `<stem>.xmp`; the file name is not required to match)

```sh
tanit-cli find . --tags -p bicycles --json
```

**Sidecar field** (a custom XMP value written with `tags write --sidecar`)

```sh
tanit-cli find "**/*.{jpg,jpeg,png,cr3}" --tags -p "flexo plate" --json
```

**By filename / folder** (default; prompt is a substring)

```sh
tanit-cli find . -p DSC032
```

**Junk / accident shots** (dark, blown, blur, flat, tiny). No prompt.

```sh
tanit-cli find . --junk --json
```

**Lower the junk bar** (see everything the decoder scored)

```sh
tanit-cli find . --junk --min-score 0 --json
```

**Miss-focus photos** (mean edge energy ~12–14 on mushy 24MP thumbs). Sharp subjects on a white wall are **not** blur — they keep a high `edgeEnergyP90`.

```sh
tanit-cli find . --junk --junk-kinds blur --min-score 0.2 --edge-energy-blur 24
```

**Quoted glob, no recurse**

```sh
tanit-cli find "*.{jpg,jpeg,png}" --junk --no-recursive
```

**Recycle Bin after a dry-run** (Windows)

```sh
tanit-cli find . --junk --action recyclebin --dry-run
tanit-cli find . --junk --action recyclebin
```

**Local sidecar / EXIF text** (no judge model)

```sh
tanit-cli find . --llm --local-text -p "product shot"
```
