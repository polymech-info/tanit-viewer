##### Examples

Cached tools are also subcommands: `mcp client <server> <tool> --help`. Schema fields become flags. Hyphens in a flag name become underscores. `--args` is only for nested JSON; flags override those keys.

**Flags, no JSON payload**

```sh
tanit-cli mcp client call --server Tanit --tool skillhub-search_skills --query pdf --limit 2
```

**Same call as a tool subcommand**

```sh
tanit-cli mcp client Tanit skillhub-search_skills --query pdf --limit 2
```

**Nested fields still go through `--args`**

```sh
tanit-cli mcp client call --server Tanit --tool skillhub-search_skills --args '{"query":"pdf","limit":2}'
```
