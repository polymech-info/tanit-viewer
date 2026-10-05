##### Examples



Text goes to stdout. Binary and large files need `--download`, `--download-as`, or `--out`.

**Print a text file**

```sh
tanit-cli service files read settings/settings.json
```

**Save using the remote basename**

```sh
tanit-cli service files read public/diagram.png --download
```

**Save to an exact path**

```sh
tanit-cli service files read public/diagram.png --download-as ./out/diagram.png
```

**Metadata JSON beside the bytes**

```sh
tanit-cli service files read settings/settings.json --out ./settings.json --json
```

**Replace a local file that already exists**

```sh
tanit-cli service files read public/diagram.png --download --overwrite
```
