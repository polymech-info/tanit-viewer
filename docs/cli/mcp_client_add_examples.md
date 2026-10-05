##### Examples

**HTTP endpoint**

```sh
tanit-cli mcp client add --transport http notion https://mcp.notion.com/mcp
tanit-cli mcp client add ink --url https://mcp.ml.ink/mcp
```

**stdio command** (args that start with `-` go after `--`, or use repeated `--args`)

```sh
tanit-cli mcp client add airtable --env AIRTABLE_API_KEY=KEY -- npx -y airtable-mcp-server
tanit-cli mcp client add github --command npx --args=-y --args=@modelcontextprotocol/server-github
```

**Server object JSON** (flags override the same fields)

```sh
tanit-cli mcp client add myserver --config '{"type":"http","url":"https://example/mcp"}'
```

**Replace an existing name**

```sh
tanit-cli mcp client add notion https://mcp.notion.com/mcp --force
```
