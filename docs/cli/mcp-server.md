---
title: Embedded MCP server
slug: mcp-server
description: How the desktop MCP listener starts, what it advertises on the LAN, and the record the Android app saves.
tags: [tanit, mcp, android, lan]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Embedded MCP server

The desktop process can expose its agent tools over HTTP. Two commands start that listener. A phone finds it by browsing DNS-SD, then stores the URL in `mcp.json`.

This page is the pairing contract. Chat on the LAN (`llm agent --serve --lan`, service `_tanit._tcp`) is a different listener: TLS, a key fingerprint, and a serve API key. MCP discovery does not use that fingerprint and does not send a pairing secret.

---

## Start the listener

The background listener follows the process. It is off until you ask for it.

```sh
tanit-cli --mcp --mcp-bind 0.0.0.0 --mcp-port 4444 llm agent --serve --host 0.0.0.0 --port 8090 --serve-api-key test --lan
```

The foreground command is only the MCP server. It runs until Ctrl+C.

```sh
tanit-cli mcp --bind 0.0.0.0 --port 4444
```

`--preset` selects the same chat preset as `llm agent`. Omit it and the default preset is used. `--disable-tools name1,name2` drops tools for this process. `--json` prints the bind, port, and `mcp_url` instead of the text banner.

| Flag | Default | Meaning |
|------|---------|---------|
| `--mcp` / `--no-mcp` | off | Background listener for this process. Place these before the subcommand. |
| `--mcp-bind` | `127.0.0.1` | Background bind address. |
| `--mcp-port` | `4444` | First port to try. The next free port is used, up to 64 attempts. |
| `mcp --bind` | `127.0.0.1` | Foreground bind address. |
| `mcp --port` | `4444` | Foreground first port. |
| `PM_IMAGE_MCP` | unset | `1` / `true` / `on` / `yes` forces the background listener on. `0` / `false` / `off` / `no` forces it off, including the on-demand start used by an external agent preset. |

A successful foreground start prints:

```text
pm-image mcp: http://0.0.0.0:4444/mcp (agent path tools, N tools, preset …)
  REST: http://0.0.0.0:4444/v1/llm/path-tools/list
  mdns: _tanit-mcp._tcp
  stop: Ctrl+C
```

The `mdns` line is present only when the bind is not loopback. `127.0.0.1` and `localhost` stay unpublished. `0.0.0.0` is published. Advertising is implemented on Windows. On other systems the HTTP server still listens and the log says mDNS advertising is unavailable.

The port in that banner is the one clients must use. If 4444 is taken, the process moves to 4445 and the advertisement uses that port.

---

## What the phone discovers

Service type: `_tanit-mcp._tcp`.

The instance name is the computer name. The phone shows that name. The name is not an authenticator.

TXT records:

| Key | Value |
|-----|--------|
| `txtvers` | `1` |
| `v` | `1` |
| `path` | `/mcp` |

There is no fingerprint, token, or API key in the advertisement.

The phone builds:

```text
http://<resolved-ipv4>:<port><path>
```

`path` defaults to `/mcp` when the TXT key is missing. An IPv6 host is wrapped in brackets. Protocol `v` must be absent, `0`, or `1`. Any other value is shown and not saved.

Example: a desktop named `DESKTOP-QH14L5F` advertising port `4444` becomes `http://192.168.1.13:4444/mcp`.

That URL is MCP Streamable HTTP: `POST /mcp` and `GET /mcp` (SSE) on the same path. The site root is not an MCP endpoint.

---

## What the phone saves

Settings → **MCP servers** → **Discover MCP** → **Save this server** appends one object under `mcpServers` in the profile `mcp.json`.

```json
{
  "mcpServers": {
    "DESKTOP-QH14L5F": {
      "type": "http",
      "url": "http://192.168.1.13:4444/mcp",
      "enabled": true,
      "enabled_tools": ["*"]
    }
  }
}
```

The key is the advertised name, trimmed to 40 characters, with characters other than letters, digits, `_`, and `-` replaced by `-`. A second desktop with the same name becomes `Name-2`. Saving the same URL again does not add a second row.

The row is cleartext HTTP. The phone does not pin a certificate for this service. Use it on a network you trust. To keep the tools on this machine only, bind `127.0.0.1` and type the URL yourself; that process will not appear in Discover MCP.

**Probe** on a saved row runs the same client the agent uses: MCP `initialize`, then `tools/list`. A disabled row stays in the file and is skipped on the next chat turn.

---

## HTTP on that port

| Method | Path | Who uses it |
|--------|------|-------------|
| `POST`, `GET` | `/mcp` | MCP clients, including the phone agent after the row above is saved |
| `GET` | `/v1/llm/tools/list` | Scripts. Buffer-tool catalog |
| `POST` | `/v1/llm/tools/call` | Scripts. Body `{ "name", "arguments" }` |
| `GET` | `/v1/llm/path-tools/list` | Scripts. Agent path-tool catalog |
| `POST` | `/v1/llm/path-tools/call` | Scripts. Same body shape, paths on the desktop |

`/mcp` is the catalog the chat agent uses, after `--preset` and `--disable-tools`. A tool error is often HTTP 200 with `{ "ok": false, "error": "…" }`.

Check the desktop from the phone's network:

```sh
curl -s http://192.168.1.13:4444/v1/llm/path-tools/list
```

A refused connection with the server running usually means the process is still bound to `127.0.0.1`.

---

## Not the LAN chat pairing

| | LAN chat | This MCP server |
|--|----------|-----------------|
| DNS-SD | `_tanit._tcp` | `_tanit-mcp._tcp` |
| Start | `llm agent --serve --lan` | `--mcp --mcp-bind 0.0.0.0` or `mcp --bind 0.0.0.0` |
| Port | HTTP port + 1, TLS | `4444`, or the next free port |
| Trust | SPKI fingerprint in TXT `fp` | None. The URL is cleartext |
| Phone result | Active server `https://host:tlsPort` plus the pin | One `mcpServers` row |

Both can run in one process. The phone's **Discover LAN** list and **Discover MCP** list are separate. A fingerprint from `_tanit._tcp` does not apply to `/mcp`.
