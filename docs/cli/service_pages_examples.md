##### Examples



`.md` is wrapped as a markdown-text widget. `.page` uploads raw page JSON. Quote globs.

A new page is link-only until front matter `hidden: false` or `--hidden false` lists it. The opening `---` block is stripped from the stored markdown. A flag overrides the same front-matter field. On create, `slug` comes from `--slug`, then front matter, then the filename. The create title comes from `--title`, otherwise from the filename. `title:` is applied on update. Create emits `{server}/user/{username}/pages/{slug}` as the run artifact. `--include-images` uploads referenced images to `home/public/{page-id-prefix}-{slug}/` and rewrites those refs to `./…`, which render as `/api/vfs/get/{owner-uuid}/…`.

**One page from flags** (same shape as `releases/build-docs.sh`)

```sh
tanit-cli service pages create releases/web-docs/changelog.md \
  --title "Changelog" \
  --slug tanit-changelog \
  --tags "changelog,release,tanit" \
  --description "End-user release notes" \
  --category-id knowlede-base
```

**Front matter supplies slug, tags, category, and visibility**

```yaml
---
title: Tanit Chat
slug: tanit-chat
description: Chat with the files in your workspace.
tags: [tanit, chat]
category-id: [knowlede-base]
hidden: false
---
```

```sh
tanit-cli service pages create "releases/web-docs/llm/*.md" --include-images
```

**Nested product pages**

```sh
tanit-cli service pages create "releases/web-docs/products/**/*.md" --include-images
```

**Link-only companion** (hidden from nav, still reachable by slug)

```sh
tanit-cli service pages create releases/web-docs/cli/llm_agent_more.md \
  --slug llm_agent_more \
  --hidden true
```

**JSON per created page**

```sh
tanit-cli service pages create page.md --json
```
