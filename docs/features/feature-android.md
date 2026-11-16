---
title: Tanit on Android
slug: tanit-android
description: Chat, voice, documents, and media on the phone — alone with a cloud account, or paired to an office computer that runs the models, tools, index, MCP, and desktop.
tags: [tanit, android, pairing, tailscale, voice, office, search, mcp, computer-use, lan, agent, research]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Tanit in your pocket

Tanit on Android is a phone app for chat, voice notes, reading documents
aloud, pictures, video, and screen recording. It works with a Tanit cloud
account on its own.

Pair it with a computer that runs Tanit, and the phone becomes the remote
control for that machine: the model, the tools, the shared folders, the
search index, and the desktop stay there. The phone keeps the conversation,
the mic, the speakers, and consent. Heavy work — local models on a company
server, Office edits over a large tree, MCP research tools, computer use,
browser steps — runs on the desk, not on the handset.

The same pairing works on the office Wi‑Fi and across a private Tailscale
network when you are away from the building.

> Available capabilities can vary by edition and organization policy.

For pairing, remote microphones and speakers, cameras, and Tailscale
addresses, see [Tanit on your network](./feature-network.md).

---

## Who it's for

- Someone who wants the assistant on the phone, and the GPU, disk, and
  desktop tools on an office PC or a company server.
- A team that already runs local models where the data may stay — and still
  needs to ask for work from a phone on the road.
- People who dictate, record meetings, or read long documents while away
  from the keyboard.
- Anyone who needs the computer's screen, a window, or a plugged-in
  microphone from the phone, without sending the phone's own screen or mic
  to the desk.
- People who need research agents and hundreds of extra tools — search
  across large document sets, images, Office files, recordings, and web
  services — without carrying that stack on the phone.

---

## What lives on the phone

Home opens these apps. Each one is its own place; Chat is not the only door.

| App | What it does |
|:----|:-------------|
| **Chat** | Talk to a cloud model on the phone, or to the paired computer's agent. Live voice, files in the turn, tools the host allows. Can generate a short video from a plain prompt, or animate a prior session still, when a video model is set. |
| **Voice Recorder** | Takes on this phone. Optional mix with the computer's microphones and what it is playing. Transcribe, change voice, trim, publish. |
| **Reader** | Pick PDF, EPUB, Office, text, or pictures. Generate a spoken reading. Play it in the background; spoken files sit under the document. |
| **Images** | Generate, edit, and keep picture sessions beside Chat. |
| **Video** | Generate clips and open them in the phone player. |
| **Screen Recorder** | Record this phone's screen. Optionally pull audio from the paired computer into that clip. |

Settings, sign-in, and the apps sheet sit under those tiles. Share or Open
with Tanit lands on a chooser that suggests Chat, Reader, Images, Video, or
the player — then opens that app with the file.

A cloud preset keeps the agent on the phone: office create and edit for
Word, Excel, and PowerPoint, pictures, memory, scheduling while the app is
open, MCP clients you configure in Settings, and Tanit cloud files. Local
GGUF models, the full folder search index, skills, and computer use are
not on the handset. Those stay on a paired computer (or a company host
that runs the same serve process) — including heavy MCP servers that sit
next to the data.

---

## Pair once, use the office machine

On the computer, start the agent with LAN and a pairing ticket. The QR is a
one-time secret. The phone checks the computer's identity, stores its own
token, and does not need to scan again when only the address changes.

```sh
tanit-cli llm agent --serve --lan --pair --pair-scopes chat,files,tools,video,audio
```

Default scopes without `--pair-scopes` are chat, files, and tools. Ask for
`video` and `audio` when the phone should watch a camera or record the
computer's sound.

```sh
tanit-cli llm agent --lan-devices
tanit-cli llm agent --lan-revoke <id>
```

Chat then has two homes. A **cloud** preset talks to the account. A
**desktop** preset talks to that serve process: the computer's models,
planner, tool catalog, shared folders, and consent. Discovery still sees
the paired machine for screen and voice recording even when the chat
preset is cloud.

Do not publish this server on the public internet. Pairing and the serve
key are the grant — being on the same Wi‑Fi or the same tailnet is not.

Detail: [Tanit on your network](./feature-network.md#pair-the-phone-once).
Server contract: the desktop `llm agent --serve` runner.

---

## Away from the office: Tailscale

Multicast discovery stays on the local link. A phone on mobile data can
reach the computer through Tailscale and still see an empty Discover list
until a saved address answers.

Start the computer with Tailscale already up. The server prints every
address it accepts, including the `100.x` address, and the TLS port (HTTP
port plus one). On the phone, open Discover and enter:

- the MagicDNS name, `https://<computer>.<tailnet>.ts.net`, or
- `https://100.x.y.z:<tls-port>`.

A name that answers is saved. Later Discover tries saved addresses and
local Wi‑Fi together. The phone still checks the certificate against the
paired fingerprint.

If the computer only listens on localhost, Tailscale Serve can put a
normal certificate on the MagicDNS name. Leave Funnel off.

```sh
tailscale serve --bg http://127.0.0.1:8090
```

Full steps: [On another network](./feature-network.md#on-another-network).

---

## Heavy work stays on the desk

When the chat source is the paired computer, each turn runs there.

| Job | Where it runs |
|:----|:--------------|
| Model and planner | Computer (local GGUF, company OpenAI-compatible host, or the cloud route that machine is allowed to use) |
| Tools and consent | Computer; the phone shows steps and may approve |
| Shared folders | Bookmarks marked share on the computer; the phone browses and opens those paths only |
| Search index | Built and queried on the computer over the folders it indexes |
| MCP tools | Servers configured on that host (or discovered on the LAN); the phone asks, the desk calls |
| Computer use / browser | Desktop host tools — mouse, keys, screenshots, browser steps on that PC |
| Office documents | Same tools as desktop; files live in shared folders or in the turn selection |
| Live voice agent (LAN) | Speech and tools on the computer; the phone starts, stops, and follows the session |

That is the point of pairing: the phone does not need a GPU or a company
disk. The office machine — or a server that already hosts local models for
the team — does the work. The phone brings the request, the selection, and
the answer.

Folders you mark as shared show up in the phone's file picker and in the
system Documents provider as Tanit. Paths outside those folders stay on
the computer. The phone does not publish its own mounts to the desk.

---

## Office documents

On the phone alone, Chat can create and edit `.docx`, `.xlsx`, and `.pptx`
in the phone workspace. Reader opens Word, spreadsheets, slides, PDF, and
EPUB, and can speak them.

Paired with a computer, the same office tools run against files on that
machine when they sit in a shared folder or travel with the turn. Large
project trees, templates, and company document sets stay where they already
are. The phone is how you ask; the computer is where the package is
changed.

---

## Large sets of files — index and search

Semantic search and the folder index live on the computer that built them.
Index Markdown, Office, source, and other text beside the project; query
by meaning rather than filename. From a paired phone, chat that needs those
tools asks the desktop agent — the index does not move to the handset.

Browse shared mounts from the composer or the system file picker. Opening
a shared file downloads a working copy the phone can show. Desktop search
and index maintenance stay on that host.

See [Files](./feature-files.md) for indexing and search on the workstation.

---

## MCP — hundreds of extra tools

Built-in tools cover chat, files, office, pictures, and the desktop when
you are paired. **MCP** (Model Context Protocol) adds the rest: connect
approved servers and the agent can call their tools in the same turn —
often hundreds of specialized operations without shipping each one inside
the phone app.

On the phone, Settings → MCP servers lists saved rows, lets you type a
URL, **Probe** a handshake and tool list, and **Discover MCP** on the
local network (`_tanit-mcp._tcp`). Enable only what you need. The same
`mcp.json` idea as desktop: the agent looks up what a server offers, then
calls it under the usual consent rules.

When chat runs on a paired computer, that machine's MCP catalog is what
matters. Put the heavy servers next to the data — on the office PC or the
company host — and ask from the phone over Wi‑Fi or Tailscale.

| Kind of work | What MCP unlocks |
|:-------------|:-----------------|
| **Search large sets in seconds** | Folder indexes, source graphs, and other search servers over document trees that would not fit on the handset |
| **Popular formats** | Images, Office packages, audio recordings, Markdown, and code — through servers that already understand those files |
| **Web and research agents** | HTTP and research MCP servers that fetch, summarize, and cite external sources as tools in the same conversation |
| **Deep edits** | Extra Office or codebase tools (for example OfficeCLI or a source-graph server) beside Tanit's built-in office and file tools |

Research stays a conversation: ask on the phone, the agent picks MCP tools
(and built-in ones) on the host that owns the turn, and answers come back
with the steps visible. Policy still decides allow, deny, or ask — MCP is
not a bypass.

On the workstation, the same servers are shared with Chat, `tanit-cli mcp`,
and XBlox. See [Files](./feature-files.md#large-source-repositories) and
[Tanit AI](./feature-ai.md).

---

## Computer use from the phone

Computer use and browser automation are desktop host tools. With a paired
serve process and the `tools` (and, for the live picture, `video`) scope,
chat on the phone can ask the agent to look at the screen, click, type, or
drive an approved browser session on that PC.

The phone remains the consent surface. The desktop remains the machine
being operated. Nothing here roots the phone or remote-controls another
person's device without that serve grant.

Watching a camera, a monitor, or one window uses the same serve process
(`video` scope). Saving that picture as a file records it on the computer.
The phone's Screen Recorder still records the phone; it can only borrow the
computer's audio. Detail: [Video on the network](./feature-network.md#video-watch-it-or-record-it-on-the-computer).

---

## Voice: notes, reading, and the voice agent

Three different jobs — do not mix them up.

### Voice Recorder

Record on this phone. With pairing and the `audio` scope, pick the
computer's microphones and outputs as well. The computer mixes those
sources into one stream; the phone listens, or writes a take, and can mix
in its own mic locally. The phone mic is not sent to the computer.

Transcribe (local whisper on device, or Tanit cloud), change voice, trim,
EQ, and publish stay on the recording. Realtime captions and noise remover
are recorder options, not the chat agent.

### Reader

Generate a spoken version of documents and pictures. Background speaking
can continue after you leave; finished wavs use the system media player.
Spoken takes hang under the document the same way Voice Recorder lists
recordings.

### Voice agent

Live two-way talk with the assistant.

- **On the phone (cloud):** the realtime session runs with the phone mic and
  speaker. Tools the phone agent has can run during the call.
- **Paired desktop:** the phone can start and steer the computer's voice
  agent. Speech capture, the model, and the full tool loop stay on the
  desk — including computer use and folders that machine already has. The
  phone follows events and controls push-to-talk, stop, and cancel. Live
  PCM does not cross the LAN as a second upload path for that remote
  session.

Dictation into the composer is separate: it fills text and does not send.
Hands-free wake sounds are a further mode; they keep listening local until
a trigger starts a normal voice turn.

Audio overview on the desk: [Tanit Audio](./feature-audio.md).
Remote listen and record: [Audio on the network](./feature-network.md#audio-listen-or-record-it-on-the-phone).

---

## Company models and private endpoints

A paired computer (or a dedicated company host) can run local models, point
at an approved internal OpenAI-compatible gateway, or mix local speech with
cloud reasoning — whatever that machine's presets and policy allow.

The phone does not install those GGUF builds. It selects the desktop chat
preset (or the server's advertised models) and sends the turn. Spending and
provider choice remain under the organization's desktop / GPO setup.

Same idea as sharing one capable PC over the LAN in
[Tanit AI](./feature-ai.md): seats talk to the host; the host keeps the
hardware and the policy.

---

## What stays on the phone vs the computer

| On the phone alone | With a paired computer |
|:-------------------|:-----------------------|
| Cloud chat, phone tools, office create/edit in the phone workspace | Chat runs on the computer's agent, models, tools, and shared folders |
| Voice notes from the phone mic | Notes of the computer, or computer plus phone mic |
| Screen recording of the phone | Same recording can include the computer's audio |
| Reader and viewers for local / downloaded files | Open shared desktop files; resolve agent outputs inside shared mounts |
| Live voice with the cloud realtime model | Steer the desktop voice agent; heavy tools stay on the desk |
| MCP clients you enable on the phone | Desktop MCP catalog — search, research, format-specific, and web tools next to the data |
| — | Search index, computer use, browser use, local models on that host |
| — | Watch or record a camera, monitor, or window on the computer |

Pairing does not upload the phone's screen, mic stream, or private files to
the computer by default. It lets the phone use what the computer already
has — over Wi‑Fi or Tailscale — under the scopes granted at pair time.

---

## Related

- [Tanit on your network](./feature-network.md) — pairing, Tailscale, remote audio and video
- [Tanit AI](./feature-ai.md) — models, presets, MCP, policy
- [Tanit Audio](./feature-audio.md) — record, STT/TTS, voice commands, realtime
- [Files](./feature-files.md) — browse, index, semantic search, MCP beside large trees
- [Tanit Security](./feature-security.md) — consent and governance

