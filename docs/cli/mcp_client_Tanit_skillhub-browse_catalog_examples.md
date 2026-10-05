##### Examples

**First page, default sort** (`composite`)

```sh
tanit-cli mcp client Tanit skillhub-browse_catalog --limit 10
```

**Recent skills in one category**

```sh
tanit-cli mcp client Tanit skillhub-browse_catalog --sort recent --category development --offset 10 --limit 10
```
