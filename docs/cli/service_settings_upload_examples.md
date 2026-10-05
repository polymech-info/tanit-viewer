##### Examples



Uploads unencrypted `settings.json` under the home mount (default remote directory: `settings`).

**Settings only**

```sh
tanit-cli service settings upload
```

**Settings, commands.json, and MCP config**

```sh
tanit-cli service settings upload --commands --mcp
```

**Custom remote directory**

```sh
tanit-cli service settings upload --remote-dir sync/workstation --json
```
