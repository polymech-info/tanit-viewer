##### Examples

Hand-picked search patterns. Name and `--junk` are offline. `--llm` needs a recognition provider (not in Tanit Viewer).

**By filename / folder** (default; prompt is a substring)

```sh
tanit-cli find "D:/pictures/test" -p DSC032
```

**Junk / accident shots** (dark, blown, blur, flat, tiny). No prompt.

```sh
tanit-cli find "D:/pictures/test" --junk --json
```

**Lower the junk bar** (see everything the decoder scored)

```sh
tanit-cli find "D:/pictures/test" --junk --min-score 0 --json
```

**Miss-focus photos** (mean edge energy ~12–14 on mushy 24MP thumbs). Sharp subjects on a white wall are **not** blur — they keep a high `edgeEnergyP90`.

```sh
tanit-cli find "D:/pictures/test" --junk --junk-kinds blur --min-score 0.2 --edge-energy-blur 24
```

**Quoted glob, no recurse**

```sh
tanit-cli find "D:/pictures/test/*.{jpg,jpeg,png}" --junk --no-recursive
```

**Recycle Bin after a dry-run** (Windows)

```sh
tanit-cli find "D:/pictures/test" --junk --action recyclebin --dry-run
tanit-cli find "D:/pictures/test" --junk --action recyclebin
```

**Local sidecar / EXIF text** (no judge model)

```sh
tanit-cli find "D:/pictures/test" --llm --local-text -p "product shot"
```
