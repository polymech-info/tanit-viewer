##### Examples

Creates an empty file on a local path or a `ssh://`, `sftp://`, `ftp://`, `ftps://`, `vfs://`, or `mtp://` URI. An existing file is an error unless `--skip` or `--overwrite`. `--overwrite` replaces it with an empty file. Each created file is a run artifact.

**Local**

```sh
tanit-cli touch ./notes.md
tanit-cli touch "${KNOWNFOLDER:Desktop}/scratch.txt" --skip
```

**Remote**

```sh
tanit-cli touch ssh://workshop/opt/incoming/.keep
tanit-cli touch ftp://user:password@host/pub/marker.txt
tanit-cli touch vfs://home/public/album/.keep
tanit-cli touch "mtp://realme/Internal storage/DCIM/note.txt"
```

**Replace an existing file**

```sh
tanit-cli touch vfs://home/inbox/empty.txt --overwrite --json
```
