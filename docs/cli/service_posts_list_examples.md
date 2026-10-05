##### Examples



Public posts are the default.

**Logged-in user**

```sh
tanit-cli service posts list --page 0 --limit 20
```

**Private and unlisted**

```sh
tanit-cli service posts list --visibility-filter private
tanit-cli service posts list --visibility-filter non-public --json
```

**Another owner**

```sh
tanit-cli service posts list --user-id <user-uuid> --limit 20
```
