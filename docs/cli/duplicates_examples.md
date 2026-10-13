##### Examples

Hand-picked offline duplicate patterns. Default `--by fingerprint` uses one libvips thumbnail, then dHash / pHash / edge hash. No LLM. Tanit Viewer builds keep this path.

**Near-duplicates in a folder** (default Hamming ≤ 8)

```sh
tanit-cli duplicates .
```

**Exact dHash only** (same pixel structure after the 128px thumb)

```sh
tanit-cli duplicates . --max-hamming 0
```

**Same file size** (byte-size buckets; not a content hash)

```sh
tanit-cli duplicates . --by size
```

**JSON groups on stdout** (exit 1 when no group)

```sh
tanit-cli duplicates . --json
```

**Quoted glob**

```sh
tanit-cli duplicates "D:/pictures/**/*.{jpg,jpeg,png}"
```

**Faster scan** (skip pHash; only compare equal file sizes)

```sh
tanit-cli duplicates "D:/pictures/100MSDCF" --no-phash --fingerprint-same-size-only
```

**Sidecar + EXIF hash** (offline; same `.md` / `.json` corpus)

```sh
tanit-cli duplicates . --by meta
```

**Save a session, reopen later** (no second scan)

```sh
tanit-cli duplicates . --save-session dups.json --report-md dups.md
tanit-cli duplicates --load-session dups.json --json
```

**Remove extras** (keeps the first path in each group)

```sh
tanit-cli duplicates . --action recyclebin --dry-run
tanit-cli duplicates . --action recyclebin
tanit-cli duplicates --load-session dups.json --action delete
```
