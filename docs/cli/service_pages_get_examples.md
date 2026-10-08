##### Examples



**By owner and slug**

```sh
tanit-cli service pages get <owner> tanit-changelog
```

**By page id** (omit the slug)

```sh
tanit-cli service pages get <page-uuid>
```

**Download** (`.md` only when the page is a single markdown-text widget; otherwise the bare `.page` document, including html-widget pages)

```sh
tanit-cli service pages get <owner> tanit-changelog --download
```

**Download into a directory**

```sh
tanit-cli service pages get <owner> tanit-changelog --download --out ./pages/
```

**Language and raw JSON**

```sh
tanit-cli service pages get <owner> tanit-changelog --lang en --json
```
