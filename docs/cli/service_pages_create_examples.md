##### Examples



`.md` becomes a markdown-text widget. `.page` uploads raw page JSON (`title`, `slug`, `owner`, `parent`, `tags`, `description` or `meta.description`, `is_public`, `visible`, `meta.categoryIds`). Quote globs so the CLI expands them. `--include-images` applies to `.md` only.

**Front matter** is a `---` YAML block at the start of the file (a UTF-8 BOM is fine). That block is removed before the markdown is stored.

A flag wins when both are set. Front matter fills what the command left empty.

| Key | Also accepted | Effect |
|---|---|---|
| `slug` | | Page URL slug when `--slug` is omitted. If this is empty too, the filename stem is used, then the title. Lowercased, punctuation collapsed to `-`, at most 96 characters. |
| `description` | `summary` | Meta description. |
| `tags` | `keywords` | YAML list or one comma-separated string. |
| `category-id` | `category_id`, `categoryIds`, `category-ids` | Slug, display name, or UUID. Same list shape as tags. Empty becomes `uncategorized`. |
| `owner` | | Owner user UUID. |
| `parent` | | Parent page UUID or slug. |
| `private` | `is_public` | `private: true` sets `is_public` false. |
| `hidden` | `visible` | Omitted: link-only. `hidden: false` or `visible: true` lists the page. |
| `id` | `page_id`, `page-id` | Page UUID. Used on update to find the page. |
| `new-slug` | `new_slug` | Replacement slug on update. |
| `title` | | Applied on update. On create, the title comes from `--title`, otherwise from the filename (`product-tanit-viewer.md` becomes `product tanit viewer`). |

Bools accept `true`/`yes`/`1` and `false`/`no`/`0`. A YAML block that does not parse is dropped from the body, and its fields are ignored.

Creating a slug that owner already has updates that page's content, description, tags, and category. Pass `--hidden` or `--private` on that command when visibility should change too.

**Public link.** Create and update emit `{server}/user/{username}/pages/{slug}` as the run artifact. The username comes from the login cache, otherwise the owner id. A public page is reachable at that URL. `hidden` leaves it out of navigation. `--private` keeps it to the owner. The finish toast labels the artifact with the page title or slug.

`--include-images` probes image refs, uploads them to `home/public/{page-id-prefix}-{slug}/`, and rewrites the markdown to `./{folder}/file.png`. Render turns that into `{server}/api/vfs/get/{owner-uuid}/{folder}/file.png`. Image uploads use `--conflict if-newer` unless you pass `skip` or `overwrite`.

Links inside the page are rewritten when the target exists: `page:slug` or a bare slug, `category:slug` / `cat:slug`, and a VFS path. Images and video become `/api/vfs/get/...`. Other files become a filebrowser URL. A relative path with no mount is looked up under `home/public`.

**Flags, one file**

```sh
tanit-cli service pages create releases/web-docs/changelog.md \
  --title "Changelog" \
  --slug tanit-changelog \
  --tags "changelog,release,tanit" \
  --description "End-user release notes" \
  --category-id knowlede-base
```

**Front matter** (listed page; create title still comes from `--title` or the filename)

```yaml
---
title: Tanit Viewer
slug: tanit-viewer
tags: [tanit-viewer]
category-id: [products]
private: false
hidden: false
---
```

```sh
tanit-cli service pages create releases/web-docs/products/tanit-viewer/product-tanit-viewer.md
```

**Many pages, upload images beside the markdown**

```sh
tanit-cli service pages create "releases/web-docs/llm/*.md" --include-images
tanit-cli service pages create "releases/web-docs/products/**/*.md" --include-images
```

**Replace page images even when the remote copy is newer**

```sh
tanit-cli service pages create page.md --include-images --conflict overwrite
```

**Hidden companion page**

```sh
tanit-cli service pages create releases/web-docs/cli/llm_agent_more.md \
  --slug llm_agent_more \
  --hidden true \
  --tags "llm,automation,cli"
```

**Private page**

```sh
tanit-cli service pages create draft.md --private --hidden true
```

**Raw `.page` JSON**

```sh
tanit-cli service pages create layout.page --slug layout-demo
```
