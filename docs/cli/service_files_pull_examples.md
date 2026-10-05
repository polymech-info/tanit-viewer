##### Examples



Downloads with HTTP Range resume. Files that already exist locally are skipped unless `--overwrite`. `--mount models` writes under `MODELS_DIR` when `--local-dir` is omitted. Other mounts write under the current directory.

**One file**

```sh
tanit-cli service files pull public/diagram.png --local-dir ./downloads
```

**A model tree, filtered**

```sh
tanit-cli service files pull weights --mount models --pattern "**/*.gguf" --progress
```

**Settings sync folder**

```sh
tanit-cli service files pull settings --local-dir ./sync
```

**Re-download even when the local file exists**

```sh
tanit-cli service files pull public/diagram.png --overwrite
```

**JSON summary**

```sh
tanit-cli service files pull public --local-dir ./downloads --json
```
