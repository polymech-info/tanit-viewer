##### Examples

**Catalog page** (`--sort` is `composite`, `score`, `stars`, or `recent`)

```sh
tanit-cli skills browse --sort recent --limit 10
```

**Next page**

```sh
tanit-cli skills browse --category development --offset 10 --limit 10 --json
```
