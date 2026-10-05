##### Examples



**Last 7 days** (default lookback)

```sh
tanit-cli service spending logs
```

**Last 30 days, JSON**

```sh
tanit-cli service spending logs --days-back 30 --json
```

**Explicit range**

```sh
tanit-cli service spending logs --start-date 2026-09-01 --end-date 2026-09-30 --page-size 50
```

**Every page in the range**

```sh
tanit-cli service spending logs --all-pages --sort-by startTime --sort-order desc
```
