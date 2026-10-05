##### Examples



These commands sync plaintext `settings.json` on the home VFS. Encrypted profile backup is a separate flow.

**Upload local settings**

```sh
tanit-cli service settings upload
```

**Also sync commands and MCP config**

```sh
tanit-cli service settings upload --commands --mcp
```

**Import into this profile**

```sh
tanit-cli service settings import
```

**Remove the remote sync folder**

```sh
tanit-cli service settings remove
```
