##### Examples

**Semantic search** (`--query` is required; `--limit` is 1–20)

```sh
tanit-cli mcp client Tanit skillhub-search_skills --query "pdf processing" --limit 5
```

**Category filter**

```sh
tanit-cli mcp client Tanit skillhub-search_skills --query pdf --category development --min_score 50
```
