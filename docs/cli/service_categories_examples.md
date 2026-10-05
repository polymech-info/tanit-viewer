##### Examples



`categories` and `cats` are the same command. `--type` is set on the group and defaults to `pages`.

**Your page categories**

```sh
tanit-cli service categories list
```

**Pages in a category**

```sh
tanit-cli service categories items knowlede-base
```

**Create a category**

```sh
tanit-cli service categories create "Release notes" --slug release-notes
```
