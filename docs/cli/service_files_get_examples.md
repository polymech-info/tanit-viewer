##### Examples



`files get` is an alias of `files read`. `--out` is an alias of `--download-as`. Binary and large files need a destination.

**Print a text file**

```sh
tanit-cli service files get settings/settings.json
```

**Save using the remote basename**

```sh
tanit-cli service files get public/diagram.png --download
```

**Save to an exact path**

```sh
tanit-cli service files get public/diagram.png --out ./out/diagram.png --json
```
