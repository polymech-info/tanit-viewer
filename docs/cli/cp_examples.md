##### Examples

`cp` and `copy` copy through the same queue as the file panel. The last path is the destination folder unless `--dst` is set. Quote globs and any URI that contains a space. A finished copy emits each destination path as a run artifact.

`${CWD}`, `${ENV:…}`, `${KNOWNFOLDER:Desktop}`, and `${SRC_NAME}` expand in `--src` and `--dst`.

**Local folder**

```sh
tanit-cli cp report.pdf notes.md ./out
tanit-cli cp "shots/*.{jpg,png}" --dst "${KNOWNFOLDER:Desktop}"
```

**Preview, then copy**

```sh
tanit-cli cp report.pdf ./out --dry-run
tanit-cli cp report.pdf ./out --if-newer --json
```

**SSH / SFTP** (`ssh://host/` is the filesystem root; a host with no slash opens that session's home. A key in `~/.ssh` is used when the URI has no password.)

```sh
tanit-cli cp report.pdf ssh://workshop/opt/incoming
tanit-cli cp ssh://workshop/home/you/readme.md ./inbox
tanit-cli cp ./build sftp://user:password@host/var/drops --overwrite
```

**FTP / FTPS**

```sh
tanit-cli cp report.pdf ftp://user:password@host/pub
tanit-cli cp ftps://user@host/inbox/brief.pdf ./inbox --skip
```

**Tanit VFS** (`vfs://{mount}/{path}` — `home`, `models`, `software`, …)

```sh
tanit-cli cp diagram.png vfs://home/public
tanit-cli cp vfs://models/weights/model.gguf ./models --if-newer
```

**Phone or camera** (folder names come from the device)

```sh
tanit-cli cp "mtp://realme/Internal storage/DCIM/IMG.jpg" ./inbox
tanit-cli cp shot.jpg "mtp://realme/Internal storage/DCIM"
```

Copy a phone file to a local folder, then copy that folder to SSH, FTP, or VFS. One command cannot put the phone on one side and SSH, FTP, or VFS on the other.

**Keep or drop names**

```sh
tanit-cli cp ./photos --dst ssh://workshop/opt/incoming --include "*.jpg" --exclude "*~"
```
