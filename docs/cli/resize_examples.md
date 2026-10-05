##### Examples

Hand-picked resize patterns. Default `--fit inside` keeps aspect and does not enlarge. `--aspect` fills the unset side from `--max-width` or `--max-height`. `--auto-rotate` turns the image 90° when its orientation does not match that box. EXIF orientation stays on unless you pass `--no-autorotate`.

**Longest edge** (both sides at most 2048; output size still follows the photo)

```sh
tanit-cli resize "D:/pictures/test/*.{jpg,jpeg,png}" out/ --max-width 2048 --max-height 2048
```

**Ratio from width** (`4:5` → 1080×1350). Same for `1:1`, `16:9`, or `9:16`.

```sh
tanit-cli resize "D:/pictures/test/*.{jpg,jpeg,png}" out/ --max-width 1080 --aspect 4:5
```

**Social folder, nothing cropped** (same canvas, centered, white bars). `--allow-enlargement` scales small files up to the box.

```sh
tanit-cli resize "D:/pictures/test/*.{jpg,jpeg,png}" out/ --max-width 1080 --aspect 4:5 --fit contain --background "#ffffff" --allow-enlargement --auto-rotate --format jpg -q 85
```

**Full-bleed crop** (center crop; `attention` follows the subject)

```sh
tanit-cli resize "D:/pictures/test/*.{jpg,jpeg,png}" out/ --max-width 1080 --aspect 4:5 --fit cover --auto-rotate --format jpg -q 85
```

**Stories / reels** (`9:16` → 1080×1920)

```sh
tanit-cli resize "D:/pictures/test/*.{jpg,jpeg,png}" out/ --max-width 1080 --aspect 9:16 --fit cover --auto-rotate --format jpg
```

**Several files from Explorer** (`--dst` is a directory)

```sh
tanit-cli resize --src a.jpg --src b.jpg --dst out/ --max-width 1080 --aspect 1:1 --fit contain --background "#111111" --auto-rotate
```
