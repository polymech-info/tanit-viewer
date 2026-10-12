##### Examples

`gen` asks a vision model for field values, then applies the template's operations. The model does not write the file. Dry-run is the default: it prints the plan and leaves the image alone. `--write` commits descriptive fields to `<stem>.xmp`. The JPEG bytes stay as they were. EXIF camera tags are context for the model and are not written. A name resolves under `config_dir()/templates` (`product` loads `product.yaml`). A path to a `.yaml` or `.json` file is used as-is. With no `--provider` and no `--model`, the default chat preset's image-recognition model is used.

**See the plan first** (nothing is written)

```sh
tanit-cli meta gen "D:/pictures/test/press.jpg" --template product --json
```

**Commit the sidecar** (title, description, and subjects land in `press.xmp`)

```sh
tanit-cli meta gen "D:/pictures/test/press.jpg" --template product --write --json
```

**Templates on disk**

```sh
tanit-cli meta gen --list
```

**One-off instructions** (`-p` replaces the template instructions; the field list stays)

```sh
tanit-cli meta gen "D:/pictures/test/press.jpg" --template product -p "Name the machine and the visible materials. Do not invent a serial number." --json
```

**Apply values you already have** (skips the vision model; still dry-run unless `--write`)

```sh
tanit-cli meta gen "D:/pictures/test/press.jpg" --template product --values "D:/pictures/test/press-values.json" --json
```

**A folder of photos** (brace groups expand once; `**` walks subfolders)

```sh
tanit-cli meta gen "D:/pictures/test/**/*.{jpg,jpeg,png,cr3}" --template product --json
```

**Sidecar beside a different folder** (`--dst` is resolved per file. A path that is not a `.xmp` file is a directory, and each image gets `<stem>.xmp` inside it)

```sh
tanit-cli meta gen "D:/pictures/test/**/*.{jpg,jpeg,png}" --template product --dst "D:/pictures/meta" --write
```

**Name the sidecar from the source** (`${SRC_NAME}` is the stem, `${SRC_DIR}` is the parent, `${SRC_EXT}` is the extension without the dot, `${SRC_FILE_EXT}` keeps the dot. `&{SRC_NAME}` is the same token)

```sh
tanit-cli meta gen "D:/pictures/test/press.jpg" --template product --dst "${SRC_DIR}/meta/${SRC_NAME}.xmp" --json
```

**Keep generated sidecars with the app config** (`${CONFIG_DIR}` is the roaming config directory. `${TEMP_DIR}` and `${ENV:NAME}` resolve the same way)

```sh
tanit-cli meta gen "D:/pictures/test/*.{jpg,jpeg,png,cr3}" --template product --dst "${CONFIG_DIR}/sidecars/${SRC_NAME}.xmp" --write
```
