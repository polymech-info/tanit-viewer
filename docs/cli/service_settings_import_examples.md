##### Examples



Downloads the remote sync folder, then imports `settings.json` into the local profile.

**Default remote directory** (`settings`)

```sh
tanit-cli service settings import
```

**Also import commands and MCP when they exist remotely**

```sh
tanit-cli service settings import --commands --mcp
```

**Keep the downloaded files in a chosen folder**

```sh
tanit-cli service settings import --download-dir ./sync --json
```
