##### Examples



`--type` on the parent selects the category meta type (`pages` by default).

**Name only** (slug is derived from the name, visibility defaults to public)

```sh
tanit-cli service categories create "Release notes"
```

**Slug, description, and a parent**

```sh
tanit-cli service categories --type pages create "Release notes" \
  --slug release-notes \
  --description "End-user notes" \
  --visibility public \
  --parent <parent-category-uuid>
```

**Unlisted**

```sh
tanit-cli service categories create "Drafts" --visibility unlisted --json
```
