---
title: Architecture overview
slug: architecture
description: High-level architecture diagrams for the Android client, CMS, LLM agent server, embedded MCP server, and CLI.
tags: [tanit, architecture]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Architecture overview

Each diagram is a standalone interactive HTML file with pan, zoom, search, guided views, and light/dark themes. The `.architecture.json` file next to it is the source.

| Part | Diagram | Source doc |
|------|---------|------------|
| **Overview: phone, desktop, and what they reach** | [overview.html](overview.html) | All of the below, plus [tools.md](../tools.md) |
| Android chat client | [android.html](android.html) | `docs/android/overview-android.md` |
| CMS authoring and serving | [cms.html](cms.html) | [cms.md](../cms.md), [cms-dev.md](../cms-dev.md) |
| LLM agent server (`llm agent --serve`) | [llm-server.html](llm-server.html) | `docs/llm/llm-server.md` |
| Embedded MCP server | [mcp-server.html](mcp-server.html) | [mcp-server.md](../cli/mcp-server.md) |
| `tanit-cli` command surface | [cli.html](cli.html) | [cli.md](../cli/cli.md) |

## Overview

Two front doors, one desktop hub. The phone reaches the desktop in two ways:

- **Paired LAN chat.** Discover LAN finds `_tanit._tcp`, pins the desktop key, and uses a device token. The chat runs on the desktop agent, so every desktop tool is available.
- **Desktop MCP server.** Discover MCP finds `_tanit-mcp._tcp` and saves one `mcp.json` row. The phone's own agent calls desktop tools over `/mcp`.

The phone also runs its own agent against the Tanit cloud. The desktop agent reaches local models (llama.cpp, VLM, embeddings), webcam, mic and screen capture, and desktop files (images, video, Office and PDF to Markdown). It also drives apps and Chrome, talks to network devices (SSH, MQTT, Modbus), and calls external MCP servers. Both agents share the Tanit cloud for LiteLLM models (text, image, video), CMS pages, VFS files, and Zitadel sign-in.

## Android chat client

A Compose UI calls into `libpm_image_jni`. For `tanit-cloud`, `pm_android_agent` runs the shared desktop `AgentFactory` in-process and calls LiteLLM with the Zitadel bearer. For `lan-agent`, `pm_android_chat_client` streams from a desktop `llm agent --serve` over TLS with a pinned key. The agent also reaches Tanit CMS through `service_*` tools and desktop MCP servers through the MCP client.

## CMS

Authors push markdown with `tanit-cli service pages`, or agents use `service_*` tools. The `pm_cms` client turns front matter into a `markdown-text` widget and stores the body verbatim. On read, every surface (`.md`, `.html`, `.xhtml`, `.pdf`, email, SPA JSON) goes through `fetchUserPageDetailsServer`, where `resolvePageContentLinks` rewrites smart links against pages, categories, and VFS.

## LLM agent server

`llm agent --serve` accepts OpenAI-shaped requests on cpp-httplib, queues them behind a concurrency gate, and runs one Tanit agent turn per request. The server owns the tool loop: built-in path tools, skills, MCP, and startup-trusted `IAgentToolProvider` hosts. Phones connect through the `--lan` TLS listener with a device token.

## Embedded MCP server

`--mcp` (background) or `mcp --bind` (foreground) exposes the agent tool catalog at `/mcp` (Streamable HTTP) and over REST under `/v1/llm/path-tools/*`. A non-loopback bind advertises `_tanit-mcp._tcp` so the phone can save it as an `mcpServers` row. There is no trust material in the advert; this is separate from LAN chat pairing.

## CLI

`tanit-cli` routes commands into groups: media and files, `llm`, `mcp`, `service` with `login`, and automation (`xblox`, `scheduler`, `daemon`, `run-ipc`, `assistant`). They share the same C++ core as the desktop app, call the PolyMech cloud for CMS, auth, and LiteLLM, and reach a running Tanit over IPC.

## Regenerating

Edit the `.architecture.json`, then from the archify skill folder:

```sh
node bin/archify.mjs validate architecture <name>.architecture.json --quality showcase
node bin/archify.mjs deliver architecture <name>.architecture.json <name>.html --quality showcase
```
