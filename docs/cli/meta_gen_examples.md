##### Examples

`gen` asks a vision model for field values, then applies the template's operations. The model does not write the file. Dry-run is the default and leaves the image alone. `--json` prints the plan and nothing else. `--write` commits descriptive fields to `<stem>.xmp` and prints that path. The JPEG bytes stay as they were. EXIF camera tags are context for the model and are not written. A name resolves under `config_dir()/templates` as `<name>.yaml`, then `.yml`, then `.json` (`product` loads `product.yaml`). An existing file path is used as-is, including an absolute `.json` path. With no `--provider` and no `--model`, the default chat preset's image-recognition model is used.

**See the plan first** (nothing is written)

```sh
tanit-cli meta gen "press.jpg" --template product --json
```

**Commit the sidecar** (title, description, and subjects land in `press.xmp`)

```sh
tanit-cli meta gen "press.jpg" --template product --write --json
```

**Templates on disk**

```sh
tanit-cli meta gen --list
```

**Larger preview for the vision model** (longest edge, default 512. The JPEG on disk stays the same size. `--no-resize` sends the image as it is)

```sh
tanit-cli meta gen "press.jpg" --template product --resize-width 1024 --json
```

**One-off instructions** (`-p` replaces the template instructions; the field list stays)

```sh
tanit-cli meta gen "press.jpg" --template product -p "Name the machine and the visible materials. Do not invent a serial number." --json
```

**Pin a rating and a comment in the template** (`value` is any text. The model is not asked for that field. A `--values` file overrides it. `rating` writes `Xmp.xmp.Rating`. `comments` writes `Xmp.exif.UserComment`. With `writeMode: embedded`, the same text is also written to `Exif.Image.Rating` and `Exif.Photo.UserComment`)

```yaml
rating:
  type: string
  operation: replace
  value: "4"
comments:
  type: string
  operation: replace
  value: "Industrial plastic sheet press, front view"
```

```sh
tanit-cli meta gen "press.jpg" --template product --json
```

**Apply values you already have** (skips the vision model; still dry-run unless `--write`)

```sh
tanit-cli meta gen "press.jpg" --template product --values "press-values.json" --json
```

**A folder of photos** (brace groups expand once; `**` walks subfolders)

```sh
tanit-cli meta gen "**/*.{jpg,jpeg,png,cr3}" --template product --json
```

**Sidecar beside a different folder** (`--dst` is resolved per file. A path that is not a `.xmp` file is a directory, and each image gets `<stem>.xmp` inside it)

```sh
tanit-cli meta gen "**/*.{jpg,jpeg,png}" --template product --dst "D:/pictures/meta" --write
```

**Name the sidecar from the source** (`${SRC_NAME}` is the stem, `${SRC_DIR}` is the parent, `${SRC_EXT}` is the extension without the dot, `${SRC_FILE_EXT}` keeps the dot. `&{SRC_NAME}` is the same token)

```sh
tanit-cli meta gen "press.jpg" --template product --dst "${SRC_DIR}/meta/${SRC_NAME}.xmp" --json
```

**Keep generated sidecars with the app config** (`${CONFIG_DIR}` is the roaming config directory. `${TEMP_DIR}` and `${ENV:NAME}` resolve the same way)

```sh
tanit-cli meta gen "*.{jpg,jpeg,png,cr3}" --template product --dst "${CONFIG_DIR}/sidecars/${SRC_NAME}.xmp" --write
```
