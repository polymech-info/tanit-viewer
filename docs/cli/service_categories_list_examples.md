##### Examples



Default type is `pages`, and the list is your own categories. `service cats` is the same command.

**Own page categories**

```sh
tanit-cli service categories list
```

**Post categories, including ones you do not own**

```sh
tanit-cli service categories --type posts list --all
```

**Children of one parent, with nested children**

```sh
tanit-cli service categories list --parent-slug knowlede-base --include-children
```

**Translated names**

```sh
tanit-cli service categories list --lang en --json
```
