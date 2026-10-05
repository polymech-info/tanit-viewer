##### Examples

Creates folders on a local path or a `ssh://`, `sftp://`, `ftp://`, `ftps://`, `vfs://`, or `mtp://` URI. A folder that already exists succeeds. `--skip` skips a path that a file already occupies. Each created folder is a run artifact.

**Local and known folders**

```sh
tanit-cli mkdir ./archive "${KNOWNFOLDER:Desktop}/incoming"
```

**Remote**

```sh
tanit-cli mkdir ssh://workshop/opt/incoming
tanit-cli mkdir ftp://user:password@host/pub/drops
tanit-cli mkdir vfs://home/public/album
tanit-cli mkdir "mtp://realme/Internal storage/DCIM/tanit"
```

**Several paths, JSON**

```sh
tanit-cli mkdir vfs://home/inbox vfs://home/public/album --json
```
