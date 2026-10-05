##### Examples



Quote globs so `tanit-cli` expands them the same way in every shell.

**Upload one file** (home mount)

```sh
tanit-cli service files upload notes.md
```

**Public folder** (artifact is `/app/filebrowser/home/public?mode=thumb&file=…`)

```sh
tanit-cli service files upload "releases/web-docs/llm/*.{png,jpg,jpeg,webp}" --public
```

**List a directory**

```sh
tanit-cli service files list public
```

**Pull into a local folder** (existing local files are skipped)

```sh
tanit-cli service files pull public/diagram.png --local-dir ./downloads
```

**Read a text file**

```sh
tanit-cli service files read settings/settings.json
```
