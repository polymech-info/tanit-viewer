##### Examples



Lists pages in the category, including child categories unless `--no-descendants` is set.

**Category slug**

```sh
tanit-cli service categories items knowlede-base
```

**Cap the list**

```sh
tanit-cli service categories items knowlede-base --limit 20
```

**This category only**

```sh
tanit-cli service categories items knowlede-base --no-descendants --json
```
