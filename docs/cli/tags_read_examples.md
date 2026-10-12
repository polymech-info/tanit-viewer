##### Examples

`read` prints each key and its value from the image. `--family` keeps one of `exif`, `iptc`, or `xmp`. `--sidecar` reads the sibling `.xmp` instead of the image. `--json` prints one object.

**Whole file**

```sh
tanit-cli tags read "D:/pictures/test/press.jpg"
```

**One family** (captions and subjects live in XMP)

```sh
tanit-cli tags read "D:/pictures/test/press.jpg" --family xmp --json
```

**Sidecar** (the image file stays the pixel source; the words are in `press.xmp`)

```sh
tanit-cli tags read "D:/pictures/test/press.jpg" --sidecar
```
