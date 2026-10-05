##### Examples



A single file can be addressed with `--slug` or `--id`. Those flags are refused when more than one file matches. A batch reads `slug` or `id` (`page-id`) from each file's front matter or `.page` JSON, and reads `title`, `description`, `tags`, `category-id`, `parent`, and `new-slug` from that same block. `--hidden` and `--private` still apply to every file in the batch.

On one file, a flag overrides the same front-matter field. The `---` block is removed from the stored markdown. `new-slug` renames the page. The run artifact is the same public page URL as create: `{server}/user/{username}/pages/{slug}`.

**Update by slug**

```sh
tanit-cli service pages update releases/web-docs/changelog.md --slug tanit-changelog
```

**Update by page UUID**

```sh
tanit-cli service pages update page.md --id <page-uuid>
```

**Batch from front matter, refresh images**

```sh
tanit-cli service pages update "releases/web-docs/llm/*.md" --include-images
```

**Rename and list the page**

```sh
tanit-cli service pages update page.md --slug tanit-changelog --new-slug tanit-changes --hidden false
```

**Change category** (slug, display name, or UUID; repeat the flag)

```sh
tanit-cli service pages update page.md --slug tanit-changelog --category-id knowlede-base
```
