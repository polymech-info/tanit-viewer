# CMS Smart Links

When you write links in a page, you don't have to paste long, full URLs. Write a
short reference — a page slug, a category, or a file path — and the server turns
it into a correct, full link automatically.

Best of all, this happens on **every version of your page**: the live web view,
and every export format:

| Surface | Address |
| --- | --- |
| Web page | `/user/{you}/pages/{slug}` |
| Standalone HTML | `…/pages/{slug}.html` |
| Rich HTML | `…/pages/{slug}.xhtml` |
| Markdown | `…/pages/{slug}.md` |
| PDF | `…/pages/{slug}.pdf` |
| Email | email export |

You write the short form once; readers get a working link everywhere.

## The short version

| You write | You get |
| --- | --- |
| [Pricing](pricing) | link to your page with slug `pricing` |
| [Pricing](page:pricing) | same, but always treated as a page |
| [Guides](category:guides) | link to the `guides` category |
| [Guides](cat:guides) | shorthand for the same |
| [Manual](docs/manual.pdf) | link to that file in your storage |
| ![Diagram](images/diagram.png) | the image, shown inline |
| [Photos](albums/2026) | link to that folder in the file browser |

If a reference can't be found, it is **left exactly as you wrote it** — nothing
is broken or hidden.

## Linking to pages

Type the page's slug as the link target:

```markdown
See our [pricing page](pricing) for details.
```

The slug is the last part of a page's address — for
`…/user/alice/pages/pricing`, the slug is `pricing`.

**Which page is chosen?** Slugs are resolved in this order:

1. **Your own page** with that slug.
2. Otherwise, another user's page with that slug (public pages first).

So if you and someone else both have a `pricing` page, your own always wins.

### Force a page link

A bare word is only treated as a page link if a matching page actually exists.
If you want to be explicit — for example when the slug looks like an ordinary
word — use the `page:` prefix:

```markdown
Read the [handbook](page:handbook).
```

## Linking to categories

Use the `category:` prefix (or the shorter `cat:`) followed by the category
slug:

```markdown
Browse all [guides](category:guides).
Browse all [guides](cat:guides).
```

Categories resolve the same way as pages: **your own category first, then
public / shared categories.** The link points to the category's browse page,
for example `…/categories/guides`.

## Linking to files and folders

You can link straight to files and folders in your storage. Normally a storage
location needs a *mount* name, but you can leave it out — paths are looked up in
your **home storage** by default, including any subfolders.

```markdown
Download the [installation manual](docs/manual.pdf).
Here are the [project files](projects/robot-arm).
```

- `docs/manual.pdf` → the file `docs/manual.pdf` in your home storage.
- `projects/robot-arm` → that folder, opened in the file browser.

### Using a named mount

If the file lives in a shared/named storage mount, put the mount first:

```markdown
See the [machine notes](machines/README.md).
```

Here `machines` is the mount and `README.md` is the file inside it.

### What links where

- **A file** (e.g. `manual.pdf`, `notes.txt`) opens in the web file browser.
- **A folder** opens the file browser at that folder.
- **An image** is embedded inline (see below).

Files and folders are only turned into links if they actually exist. If the path
can't be found, the text is left untouched.

## Showing images from storage

To display an image that lives in your storage, use normal Markdown image syntax
with the file path:

```markdown
![System diagram](images/diagram.png)
```

The image is shown directly in the page (and in every export). Supported image
types include `jpg`, `jpeg`, `png`, `gif`, `webp`, `bmp`, `ico`, `avif`, and
`svg`.

As with files, you can prefix a mount name if the image lives in a shared mount:

```markdown
![Part](machines/parts/bracket.jpg)
```

## What is *not* touched

Smart links are deliberately conservative. These are always left exactly as
written:

- Full web addresses — `https://…`, `mailto:…`, `tel:…`
- Links that already start with `/`
- In-page anchors — `#section`
- Any reference that doesn't match a real page, category, file, or folder

This means you can freely mix smart links with ordinary links in the same page.

## Quick reference

| Goal | Write |
| --- | --- |
| Link to your page `pricing` | [Pricing](pricing) |
| Force a page link | [Pricing](page:pricing) |
| Link to a category | [Guides](category:guides) or [Guides](cat:guides) |
| Link to a home file | [Manual](docs/manual.pdf) |
| Link to a named-mount file | [Notes](machines/README.md) |
| Link to a folder | [Photos](albums/2026) |
| Embed a stored image | ![Alt](images/pic.png) |

## Real examples

The examples below use live entries from this site, so you can see the exact
short form you would type.

### Pages

| You write | Links to the page |
| --- | --- |
| [Home](home) | Home |
| [About & Contact](about-contact) | About & Contact |
| [Library](library) | PolyMech - Library |
| [NodeHub](nodehub) | NodeHub - Visual Programming Language |
| [Pooly-Press](poolypress-cms) | Pooly-Press - NextGen Agentic CMS |
| [Obelix 300](shredder-obellix-300) | Obelix - 300 |
| [CLI docs](page:tanit-cli) | Tanit CLI Documentation |

### Categories

| You write | Links to the category |
| --- | --- |
| [Machines](category:machines) | Machines |
| [Products](cat:products) | Products |
| [Design](category:design) | Design |
| [Software](category:software) | Software |
| [Shredders](cat:shredders) | Shredders |

### Files and folders

These are real entries in a home storage:

| You write | Result |
| --- | --- |
| [Benchmark results](bench-results.md) | opens `bench-results.md` in the file browser |
| [CMS test note](cms-tests/local-1782279756659.md) | opens that file inside the `cms-tests` folder |
| [Test files](cms-tests) | opens the `cms-tests` folder |
| [Settings](settings) | opens the `settings` folder |

### Images

| You write | Result |
| --- | --- |
| ![Render](2327_.png) | shows the `2327_.png` image inline |
| ![Version](1772547045008-version.png) | shows that image inline |

## Good to know

- **Newly created or renamed** pages, categories, or files may take a few minutes
  to be picked up, because results are cached for performance.
- **Access still applies.** A link is only *built* for you as the author; whether
  a given reader can open it depends on the normal visibility and permission
  rules for that page, category, or file.
- Links inside content **pulled in from another page** (e.g. embedded/nested
  pages) are resolved based on that other page, not the one embedding it.
