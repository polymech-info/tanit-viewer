##### Examples

`tags` reads and writes the metadata stored on an image. EXIF is the technical record. IPTC and XMP hold the caption, title, and subjects. `read` prints what is already there. `write` changes the keys you name and leaves the rest. `--dry-run` checks a write and does not touch the file. `--sidecar` stores the fields in `<stem>.xmp` and leaves the image bytes as they are.

**Print what the file already has**

```sh
tanit-cli tags read "D:/pictures/test/press.jpg" --json
```

**Write a caption and two subjects** (description in EXIF, the words people read in IPTC and XMP)

```sh
tanit-cli tags write "D:/pictures/test/press.jpg" --set "Exif.Image.ImageDescription=Industrial plastic sheet press" --set "Iptc.Application2.Caption=Front view" --add "Xmp.dc.subject=recycling" --add "Xmp.dc.subject=sheet press"
```

**Find the files that carry a subject** (`--tags` matches EXIF, IPTC, and XMP, including `<stem>.xmp`; the file name is left alone)

```sh
tanit-cli find "D:/pictures/test" --tags -p recycling --json
```
