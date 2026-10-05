##### Examples



Run `tanit-cli login` first. These calls use the logged-in account.

**Resolved service URLs**

```sh
tanit-cli service info
```

**Search your pages**

```sh
tanit-cli service search "keyboard" --type pages
```

**Publish a markdown page** (front matter can supply title, slug, and category)

```sh
tanit-cli service pages create releases/web-docs/changelog.md \
  --title "Changelog" \
  --slug tanit-changelog \
  --category-id knowlede-base
```

**Upload a file to the home VFS**

```sh
tanit-cli service files upload notes.md
```

**Credit balance**

```sh
tanit-cli service balance
```
