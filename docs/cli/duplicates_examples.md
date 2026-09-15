##### Examples

Hand-picked offline duplicate patterns. Default `--by fingerprint` uses one libvips thumbnail, then dHash / pHash / edge hash. No LLM. Tanit Viewer builds keep this path.

**Near-duplicates in a folder** (default Hamming ≤ 8)

```sh
tanit-cli duplicates "D:/pictures/test"
```

**Exact dHash only** (same pixel structure after the 128px thumb)

```sh
tanit-cli duplicates "D:/pictures/test" --max-hamming 0
```

**Same file size** (byte-size buckets; not a content hash)

```sh
tanit-cli duplicates "D:/pictures/test" --by size
```

**JSON groups on stdout** (exit 1 when no group)

```sh
tanit-cli duplicates "D:/pictures/test" --json
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
tanit-cli duplicates "D:/pictures/test" --by meta
```

**Save a session, reopen later** (no second scan)

```sh
tanit-cli duplicates "D:/pictures/test" --save-session dups.json --report-md dups.md
tanit-cli duplicates --load-session dups.json --json
```
