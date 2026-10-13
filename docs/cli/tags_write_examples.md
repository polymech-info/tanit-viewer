##### Examples

`write` changes the keys you name and keeps every other key. `--set` replaces one value. `--add` appends; a second `--add` on `Xmp.dc.subject` keeps both subjects. `--unset` removes one key. The image is updated in place. `--sidecar` writes `press.xmp` beside it and the image bytes stay as they were. `--dry-run` checks the keys and prints the edits; nothing is written. A custom XMP field needs `--xmlns prefix=uri` in the same command.

**Caption and subjects** (technical line in EXIF, readable text in IPTC and XMP)

```sh
tanit-cli tags write "press.jpg" --set "Exif.Image.ImageDescription=Industrial plastic sheet press" --set "Iptc.Application2.Caption=Front view" --add "Xmp.dc.subject=bicycles" --add "Xmp.dc.subject=sheet press"
```

**Check the edit before it lands**

```sh
tanit-cli tags write "press.jpg" --dry-run --set "Exif.Image.Artist=Tanit"
```

**Remove one field** (the description stays)

```sh
tanit-cli tags write "press.jpg" --unset Exif.Image.Artist
```

**Every JPEG in the folder** (quote the pattern so the shell does not eat it; `*.{jpg,jpeg,png,cr3}` is the same brace form)

```sh
tanit-cli tags write "*.jpg" --set "Exif.Image.ImageDescription=Industrial plastic sheet press" --set "Iptc.Application2.Caption=Front view" --add "Xmp.dc.subject=bicycles" --add "Xmp.dc.subject=sheet press"
```

**Leave the JPEG bytes unchanged** (custom namespace on the sidecar)

```sh
tanit-cli tags write "press.jpg" --sidecar --xmlns "tanit=http://ns.tanit.local/meta/1.0/" --set "Xmp.tanit.productType=Sheet press" --set "Xmp.dc.title=Press"
```
