##### Examples



Quote globs. A directory path uploads the tree. Default conflict policy is `if-newer`: replace the remote file only when the local file is newer.

**Public link.** Each upload, including a skip, emits a filebrowser URL as the run artifact. The finish toast and recent-outputs list label it with the `file=` name. Opening the artifact follows that URL.

| Remote path | Artifact URL |
|---|---|
| `notes.md` | `{server}/app/filebrowser/home?file=notes.md` |
| `--public` / `public/shot.png` | `{server}/app/filebrowser/home/public?mode=thumb&file=shot.png` |
| `public/album/shot.png` | `{server}/app/filebrowser/home/public/album?mode=thumb&file=shot.png` |

`--json` also includes `api_get_url`: a signed download (`/api/vfs/sign-get`, about 15 minutes, `download=1`). If signing fails, that field is `/api/vfs/get/home/...`.

`home/public` is the public tree. The owner's user id is a mount for that folder with `public/` omitted, so a rendered image is `{server}/api/vfs/get/{owner-uuid}/shot.png`.

**One file at the VFS root**

```sh
tanit-cli service files upload notes.md
```

**Public images** (same as `--remote-dir public`)

```sh
tanit-cli service files upload "releases/web-docs/llm/*.{png,jpg,jpeg,webp}" --public
```

**Keep relative subfolders**

```sh
tanit-cli service files upload "docs/**/*.md" --remote-dir docs
```

**Exact remote path** (one local file)

```sh
tanit-cli service files upload report.pdf --remote-path inbox/report.pdf
```

**Leave an existing remote file alone**

```sh
tanit-cli service files upload clip.mp4 --skip
```

**Always replace**

```sh
tanit-cli service files upload clip.mp4 --overwrite
```

**JSON per file, including skips**

```sh
tanit-cli service files upload "shots/*.jpg" --json
```
