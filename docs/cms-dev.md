# CMS — Developer & Authoring Notes

Companion to [`cms.md`](cms.md) (end-user smart links) and [`cli.md`](cli.md) (full
command reference). This file covers:

- **Authors** — publish and update pages from local `.md` files (CLI, globs, front matter).
- **Developers** — how smart links resolve on the server, where to hook fixes, known gaps.

---

## For authors — publish pages from markdown files

You can author pages locally and push them with `tanit-cli service pages`. The CLI
uploads the **body** as a `markdown-text` widget; metadata comes from CLI flags
and/or a YAML front matter block at the top of the file.

### Prerequisites

```powershell
# Point at your CMS (local dev or production)
$env:SERVER_URL = "http://127.0.0.1:3333"

# OAuth token must be present (zitadel-oauth.json from app login)
tanit-cli service info
```

Resolution order for the CMS base URL: `--server-url` → `PM_SERVICE_CMS_SERVER_BASE`
→ `SERVER_URL` → `VITE_SERVER_IMAGE_API_URL` → `CLIENT_URL` → compiled default.

### Single page — front matter + body

Put metadata in `---` YAML; write smart links in the body (see [`cms.md`](cms.md)):

```markdown
---
title: Getting Started
slug: getting-started
description: Quick intro for new users
tags: [docs, guide]
category-id: [guides]
# or display name: category-id: ["Documentation"]
# UUIDs still work: category-id: ["your-category-uuid"]
private: false
hidden: false
---

See the [pricing page](pricing) and browse [guides](category:guides).

Download the [manual](docs/manual.pdf).
```

```powershell
tanit-cli service pages create docs/getting-started.md
```

CLI flags override front matter when both are set:

```powershell
tanit-cli service pages create docs/getting-started.md `
  --title "Getting Started (draft)" `
  --private true
```

`--category-id` accepts a slug, display name, or UUID (repeatable); the CMS resolves
each value to a category id on create/update:

```powershell
tanit-cli service pages create docs/getting-started.md --category-id guides
```

Stdout is one JSON object per file (`page_id`, `slug`, `url`, `path`, …).

### Batch create — globs and brace groups

Same glob rules as `service files upload`: `*`, `?`, `**`, `{a,b}`.
Only `.md` files are uploaded; one JSON line per match.

```powershell
# All markdown under a docs tree
tanit-cli service pages create "docs/public/v1.0/**/*.md"

# Brace expansion
tanit-cli service pages create "docs/{intro,faq,changelog}.md"

# Repeatable specs
tanit-cli service pages create docs/a.md docs/b.md
```

Each file should carry its own `slug` (and optional `title`) in front matter, or
the CLI derives them from the filename.

### Update an existing page

**Single file** — identify the page with `--slug` or `--id`, or front matter:

```markdown
---
slug: getting-started
title: Getting Started
---

Updated body with a [library link](library).
```

```powershell
tanit-cli service pages update docs/getting-started.md --slug getting-started
```

Or rely on front matter only:

```powershell
tanit-cli service pages update docs/getting-started.md
```

Rename slug:

```powershell
tanit-cli service pages update docs/getting-started.md --slug getting-started --new-slug intro
# or in front matter: new-slug: intro
```

**Batch update** — glob many files; each file must identify its page via front
matter `slug` or `id` (or filename stem as slug). Do **not** pass global `--slug`
/`--id` in batch mode.

```powershell
tanit-cli service pages update "content/**/*.md"
```

### Front matter keys (aligned with CLI flags)

| Front matter | CLI flag | Notes |
| --- | --- | --- |
| `title` | `--title` | Default: filename stem |
| `slug` | `--slug` | Default: slugified title |
| `new-slug` | `--new-slug` | Update only |
| `description`, `summary` | `--description` | Stored in `meta.description` |
| `tags`, `keywords` | `--tags` | Comma string or YAML list |
| `owner` | `--owner` | Default: logged-in app user |
| `parent` | `--parent` | Parent page UUID or slug |
| `category-id`, `category_id`, `categoryIds` | `--category-id` | Repeatable; list or comma string. Each value is a **category slug, display name, or UUID** — the CMS resolves to ids on create/update (same ownership rules as `category:` smart links). |
| `id`, `page_id` | `--id` | Update lookup |
| `private` | `--private` | `true` → `is_public=false` |
| `hidden` | `--hidden` | `true` → `visible=false` |
| `is_public`, `visible` | — | Direct boolean overrides |

The `---` block is **stripped** before upload; readers never see raw front matter
in the stored widget content.

### Pull, edit, push (round trip)

```powershell
# Download current markdown body
tanit-cli service pages get alice getting-started --download --out ./pages/

# Edit locally, then update
tanit-cli service pages update ./pages/getting-started.md --slug getting-started
```

`--download` writes widget markdown only (no front matter yet). Add a `---`
block yourself before batch workflows.

### List and remove

```powershell
tanit-cli service pages list
tanit-cli service pages list --user-id <uuid> --json

tanit-cli service pages remove <page-uuid>
tanit-cli service pages remove --slug old-page --owner alice
```

### Smart links in authored content

Write short link targets in markdown (`[T](slug)`, `category:…`, `path/file.png`).
**Resolution happens on the server** when the page is served or exported — not in
the CLI. See [`cms.md`](cms.md) for author-facing rules and examples.

Relative paths in the body are uploaded as-is; `pages-links.ts` rewrites them at
render time (see developer section below).

### Upload assets referenced by pages

Use `service files upload` for images/PDFs linked from page content:

```powershell
# Flat upload (viewer assets → home root filenames)
tanit-cli service files upload docs/public/v1.0/viewer/tanit-viewer-*.{png,jpg}

# Preserve subfolders under a remote prefix
tanit-cli service files upload --remote-dir documentation/viewer `
  docs/public/v1.0/viewer/**/*.{png,jpg}

# Deep glob from cwd
tanit-cli service files upload '**/**/*.jpg'
```

Pull for sync:

```powershell
tanit-cli service files pull test/widget-test.md --mount models --local-dir "${MODELS_DIR}"
tanit-cli service files pull test/widget-test.md --mount models --local-dir "${MODELS_DIR}" --overwrite
```

---

## For developers — smart link resolution

Technical reference for page/category/VFS link resolution described in [`cms.md`](cms.md).
Documents *how* it works, *where* it hooks in, and parts that **still need fixing**.

### Overview

Authors write short references in page content (`[Text](my-slug)`,
`[Text](category:x)`, `![alt](path/pic.png)`, …). The server rewrites these to
full URLs so every render surface emits working links.

The whole feature is a **single resolution pass** applied at one shared choke
point, so all surfaces inherit it without per-renderer changes.

**CLI scope:** `tanit-cli service pages create|update` does **not** resolve links.
It stores the markdown body verbatim. Resolution runs in
`resolvePageContentLinks` on GET/export paths.

### Architecture

#### The shared seam

Every surface fetches the page through `fetchUserPageDetailsServer(identifier,
slug, requesterUserId)` in
`server/src/products/serving/pages/pages-data.ts`. The resolver runs there,
just before the result is cached:

```ts
result.page.content = await resolvePageContentLinks(
    result.page.content,
    page.owner,                       // owner-first resolution scope
    pagesStateForRelations.pages,     // already-loaded pages cache
);
```

Because resolution depends only on the page owner (not the viewer), the rewritten
content is safe to store in the result cache and share across requesters.

#### The resolver

`server/src/products/serving/pages/pages-links.ts` exports:

```ts
resolvePageContentLinks(content, ownerId, pages): Promise<content>
```

Flow:

1. **Scan** — cheap pre-check; bail if content has no `](` / `href=`. Also flags
   whether the category cache is needed (`category:` / `cat:` present).
2. **Index** — build `slug → page[]` from the pages cache; `slug → category[]`
   from `getCategoryState()` only if needed; `ownerId → username` from
   `fetchProfilesServer({})`.
3. **Collect** — gather every unique href from all text widgets
   (`markdown-text`, `text-widget`, `html-widget`) via markdown `](href)` and raw
   HTML `href="…"` regexes.
4. **Resolve** — per unique href: try static (page/category/bare-slug) first,
   then async VFS existence check.
5. **Rewrite** — deep-clone the content (so the shared pages cache is never
   mutated) and replace resolved hrefs in place.

Redux-normalized content (`{ pages: { [id]: layout } }`) is unwrapped before
widget traversal (`iterateWidgets` from `@polymech/shared`).

### Resolution rules

#### Pages
- Syntax: bare slug `[T](slug)` (no scheme/slash/dot/hash/space) or `page:slug`.
- Order: owner's page → other user's page (`is_public && visible`) → first match.
- URL: `${SERVER_URL}/user/{username||ownerId}/pages/{slug}`.

#### Categories
- Syntax: `category:slug` or `cat:slug` (explicit only — bare is claimed by pages).
- Order: owner's category → public/global (`visibility==='public' || owner_id===null`) → first.
- URL: `${SERVER_URL}/categories/{slug}`.
- Mirrors `resolveCategoryRefsToIds` scoping in `db-categories.ts` (slug, display name, or UUID).

#### VFS files / folders / images
- Candidate: not a scheme/anchor/absolute path; contains `/` or `.`.
- Mount resolution via `createVfsForMountSubpath(mount, subpath, ownerId)`
  (`storage/api/vfs-core.ts`), using the **page owner** as caller:
  1. first segment as a named mount, if `getMountManager().findByName()` matches
     (or it's `home` / a uuid);
  2. otherwise the owner's implicit `home` mount, full path incl. subfolders.
- Rewritten **only if `vfs.exists(path)`**; otherwise left intact.
- `vfs.stat()` decides file vs directory.
- URLs:
  - image file → `${SERVER_URL}/api/vfs/get/{mount}/{path}` (renders inline)
  - other file → `${SERVER_URL}/app/filebrowser/{mount}[/{dir}]?file={name}`
  - folder → `${SERVER_URL}/app/filebrowser/{mount}/{path}`
- Home references are emitted with the **owner's uuid** as the mount segment (not
  `home`, which is caller-relative) so they resolve for any viewer under ACL.
- Image extensions: `jpg jpeg png gif webp bmp ico avif svg`.

### CLI implementation map (pages)

| Concern | Location |
| --- | --- |
| `service pages create\|update` handlers | `src/cli/pm_image_cmd_service.cpp` |
| Glob expansion (`.md` only) | `resolve_service_pages_markdown_entries()` — same engine as `files upload` (`core/glob_paths.hpp`) |
| Front matter parse + merge | `src/cms/pm_cms_pages.cpp` — `parse_cms_page_frontmatter()` |
| API payload (markdown-text widget) | `markdown_page_content()` in `pm_cms_pages.cpp` |
| Slug lookup for update | `resolve_page_id_by_owner_slug()` → `GET /api/user-page/{owner}/{slug}` |

Precedence: explicit CLI flags win; front matter fills empty fields; filename/title
defaults last.

### Surface coverage

| Surface | Handler | File |
| --- | --- | --- |
| `.md` | `handleGetUserPageMarkdown` | `pages-markdown.ts` |
| `.html` / bot-meta | `handleGetUserPageHtml` / `handleGetPageMeta` | `pages-html.ts` |
| `.xhtml` | `handleGetUserPageRichHtml` | `pages-rich-html.ts` |
| `.pdf` (typst + pdfmake) | `handleGetUserPagePdf` → `renderPageToPdf` | `pages-pdf.ts` |
| email | `renderPageToEmail` | `pages-email.ts` |
| SPA JSON | `handleGetUserPageJson` | `pages-data.ts` |

All of the above call `fetchUserPageDetailsServer`, so all inherit resolution.

### Env vars

- `SERVER_URL` — base for page, category, `/api/vfs/get`, and `/app/filebrowser`
  URLs. Empty ⇒ site-relative URLs (works same-origin).

### Caching / performance

- Result cache key `page-details-${identifier}-${slug}` (TTL `PAGES_CACHE_TTL`,
  ~5 min) — resolution runs once per period.
- Pages cache via `getPagesState()`; categories via `getCategoryState()`.
- VFS: one `createVfsForMountSubpath` + `exists`/`stat` per **unique** candidate
  href on a cache-miss render. `createVFS` performs `ensureVfsSettings` +
  `getAclForUser` (disk/db).

### Security

- Resolution uses the **author/owner** as the VFS caller to *build* links; actual
  reads are ACL-checked at serve time for the real viewer.
- `sanitizeSubpath` guards VFS path traversal; failures skip that interpretation.

---

## Known issues / needs fixing

### Smart links (server)

1. **Nested/embedded pages not resolved.** Content pulled in at render time via
   `fetchPageContentById` (tabs `tabs-widget`, `layout-container-widget`,
   `page-card`) does **not** pass through `resolvePageContentLinks`, so slug/VFS
   links inside embedded pages stay raw. Fix: apply the resolver in those fetch
   paths (or resolve nested content within the resolver).

2. **`handleGetPageContent` bypasses resolution.** It reads raw content via
   `fetchPageContentByOwnerAndSlug` in `pages-html.ts`, not
   `fetchUserPageDetailsServer` — links there are not rewritten.

3. **Editor live preview is unresolved.** The client `MarkdownRenderer`
   (`src/modules/pages/markdown/MarkdownRenderer.tsx`) has no server context, so
   unsaved authoring preview shows raw `page:`/`cat:`/path forms. Served views
   (SPA JSON) are fine. Consider a client-side resolver or a preview endpoint.

4. **Bare-slug ambiguity.** A bare word resolves to a page only if a matching
   page exists — but a home folder named like a page slug (no dot/slash) is *not*
   considered for VFS (VFS requires `/` or `.`). Document/confirm this is intended;
   a bare folder reference won't resolve.

5. **Image host env var.** `/api/vfs/get` images use `SERVER_URL`. If image
   serving should go through `SERVER_IMAGE_API_URL`, add an override in
   `buildVfsUrl`.

6. **Private home images on public pages.** Home links resolve to
   `/api/vfs/get/{ownerId}/…`; a public viewer without ACL access gets a broken
   image. No warning is surfaced to the author.

7. **Posts not supported.** There is no `post:` scheme. Adding one (→ `/post/{id}`
   or a post-slug lookup) is a natural extension in `resolveStaticHref`.

8. **Cache staleness.** New/renamed pages, categories, or files aren't reflected
   until the relevant cache expires (~5 min). No targeted invalidation on
   create/rename.

9. **VFS cost on cache miss.** Many unique path-like hrefs ⇒ many `createVFS` +
   `stat` calls (with `ensureVfsSettings` side effects) during a GET render. No
   per-render batching or hard cap yet.

### CLI / authoring

10. **`pages get --download` has no front matter round-trip.** Downloaded `.md` is
    widget body only; authors must re-add `---` metadata for batch update workflows.

11. **Batch update identity.** Glob update requires per-file `slug`/`id` in front
    matter (or filename stem); no directory→slug mapping like `files upload`
    `--remote-dir`.

### Related CMS follow-ups

- **Category read-side leak.** `category_paths` in `pages-data.ts` can expose
  private categories on public pages; filter by viewer visibility
  (`isCategoryVisible`).
- **Category assignment guard.** `resolveCategoryRefsToIds` / write path should
  reject categories the page owner can't use (not owned and not public/global).
