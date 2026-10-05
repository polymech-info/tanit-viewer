##### Examples



The default search uses the login token and includes your private content.

**Pages**

```sh
tanit-cli service search "keyboard shortcuts" --type pages --limit 10
```

**VFS files**

```sh
tanit-cli service search "settings.json" --type files --json
```

**Posts, pictures, or places**

```sh
tanit-cli service search "bench" --type posts
tanit-cli service search "diagram" --type pictures
```

**Public content only** (no bearer token)

```sh
tanit-cli service search "tanit" --public
```

**Owner-only visibility**

```sh
tanit-cli service search "draft" --visibility-filter private
```
