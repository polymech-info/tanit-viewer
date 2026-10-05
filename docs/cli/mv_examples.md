##### Examples

`mv` and `move` use the same paths, globs, URIs, and conflict flags as `cp`. The transfer copies, then deletes the source. A finished move emits each destination path as a run artifact.

**Local**

```sh
tanit-cli mv report.pdf ./archive
tanit-cli mv "shots/*.jpg" --dst "${KNOWNFOLDER:Desktop}" --skip
```

**SSH, FTP, or Tanit VFS**

```sh
tanit-cli mv ./build ssh://workshop/opt/incoming --if-newer
tanit-cli mv ftp://user:password@host/pub/old.zip ./archive
tanit-cli mv diagram.png vfs://home/public
```

**Phone.** Copy with `cp`. Deleting the file on the device is not available, so `mv` from `mtp://` stops when it tries to remove the source. A phone and SSH, FTP, or VFS still need a local folder between them.

```sh
tanit-cli cp "mtp://realme/Internal storage/DCIM/IMG.jpg" ./inbox
```

**Dry-run**

```sh
tanit-cli mv report.pdf ssh://workshop/opt/incoming --dry-run
```
