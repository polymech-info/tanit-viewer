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
| **Screen Recorder** | Record this phone's screen into a library of clips. Phone sound, the mic, an optional camera, a 9:16 frame, and a shake to pause or stop. A paired computer can supply the audio. |

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

## Pair once, then turn access on

On the computer, start the agent with LAN and open a pairing ticket from
Settings, or pass `--pair` yourself. The QR is a one-time secret. The phone
checks the computer's certificate, stores its own token, and does not need
to scan again when only the address changes.

```sh
tanit-cli llm agent --serve --lan --pair
```

Confirming the code pairs the devices and grants nothing. The ticket can
name chat, files, tools, audio, or video. Those words are what you may turn
on afterwards. They are not already on.

A node without the chat agent serves the same folders, microphones, and
cameras:

```sh
tanit-cli node serve --lan
```

That process does not open a pairing window when it starts. Pair it from
Settings, or start it once with `node serve --pair`.

After the phone is paired, do these three things:

1. On the computer, **Settings → Devices**. This PC allows this device.
   Folder access is **Off**, **Read**, or **Write**. Audio, video, chat,
   and tools are their own switches. An on switch is filled, not gray.
2. On the phone, **Shared folders → Pair → Paired devices**. Choose **Read** or
   **Write**.
3. On that same phone screen, turn on at least one of this phone's
   networks. Read or Write with no network selected cannot be reached.

Each device edits only what it owns. The computer cannot raise what the
phone allows, and the phone cannot raise what the computer allows. Revoke
on either side drops that device's token. On the computer it also drops
the phone's folders from Places.

```sh
tanit-cli llm agent --lan-devices
tanit-cli node revoke <id>
```

Chat then has two homes. A **cloud** preset talks to the account. A
**desktop** preset talks to the agent: the computer's models, planner,
tool catalog, shared folders, and consent. Discovery still sees the paired
machine for screen and voice recording even when the chat preset is cloud.

Do not publish this server on the public internet. Being on the same Wi‑Fi
or the same tailnet is not a grant.

Detail: [Tanit on your network](./feature-network.md#pair-the-phone-once).

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
| Shared folders | Both ways. Each side publishes its own folders and edits its own grant |
| Search index | Built and queried on the computer over the folders it indexes |
| MCP tools | Servers configured on that host (or discovered on the LAN); the phone asks, the desk calls |
| Computer use / browser | Desktop host tools — mouse, keys, screenshots, browser steps on that PC |
| Office documents | Same tools as desktop; files live in shared folders or in the turn selection |
| Live voice agent (LAN) | The phone mic and speaker stay on the phone. Steering a desktop voice agent is events, not a second recording of that mic |
| Desktop microphones and speakers | One mix on the computer, played or saved on the phone. Needs the computer's audio grant |

That is the point of pairing: the phone does not need a GPU or a company
disk. The office machine — or a server that already hosts local models for
the team — does the work. The phone brings the request, the selection, and
the answer.

---

## Shared folders, both ways

A paired computer opens nothing on the phone until you allow it under
**Shared folders → Pair → Paired devices**. A paired phone opens nothing on the
computer until you allow it under **Settings → Devices**.

On the phone, turn on the folders a computer may see: the app's own files,
pictures, or a folder you pick. **Off** hides them. **Read** lets the
computer list and open them. **Write** also lets it add, change, and
delete inside those folders. Pick at least one network — Wi‑Fi, a VPN or
Tailscale, mobile data, or a cable. The warning on that screen means the
folder grant is on and no network is selected.

Those folders show up in **Places** on the computer, labeled with the
phone. An unreachable phone keeps the names and marks them offline.
Opening one then fails until the phone answers. Revoking the phone removes
the names.

The other direction is unchanged. Folders you mark as shared on the
computer show up in the phone's file picker and in the system Documents
provider as Tanit. Paths outside those folders stay on the computer.

Two phones pair with the same code. One shows it and the other scans it,
both under **Shared folders → Pair**. When the phone showing the code is on
more than one network, Wi‑Fi and a VPN or Tailscale included, switch the
address on that code. The same screen shows the link inside that code.
Paste it on the computer under **Settings → Devices**. **Discover** there
lists Tanit devices on the network; the link is what adds the phone.
A code from a computer connects chat on this phone to
that computer. Each phone decides what the other may
open, and on which of its networks. A grant on one phone does not extend
through the computer to a third device.

The address of a phone folder is that phone's name, not its certificate
and not the display name you can edit later. Rotating the certificate
does not rename the folder.

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
The phone's Screen Recorder still records the phone. A desktop audio source
can replace the phone's sound in that clip; the computer's camera and screen
are a different stream. Detail below, and
[Video on the network](./feature-network.md#video-watch-it-or-record-it-on-the-computer).

---

## Screen Recorder

Screen Recorder is its own app. The list is the library: open a clip, rename
it, or remove it. **Record** and **Stop** sit at the bottom. Choices live in
the recording settings sheet. Android still asks before the first capture.

### Sound

| Choice | What goes in the file |
|:-------|:----------------------|
| **App sound** | What this phone is playing. Some apps block it. |
| **Microphone** | Your voice and nearby sound. |
| **App sound + microphone** | Both, with a level for each. Playback from the built-in speaker can leak into the mic; headphones keep the mix clean. |

A paired computer source overrides that choice. Pick **Phone audio** in the
computer list to use the table above. The phone needs the `audio` scope.
The computer's microphones and what it is playing are mixed on the desk;
the phone writes them into the screen video.

### Camera

The camera is off until you enable it. It is drawn into the next recording.
Drag the preview to move it. Front and back are separate, and each lens
remembers its own mirror. The shape is a rounded square or a circle.

### Frame

**Original** keeps the captured screen. The resolution setting applies to
this format.

**9:16** encodes a vertical file: 1080 × 1920 when this phone's encoder
accepts it, otherwise 720 × 1280. The resolution setting does not change
that size.

| Layout | What you get |
|:-------|:-------------|
| **Fit** | The whole screen, with side margins. |
| **Fill** | The frame is full. The top and bottom of the screen are cropped. |
| **Creator** | The whole screen, with the camera placed on the 9:16 frame. |

A preview shows the frame before you record. Caption guides draw on that
preview only. They are not in the file.

Bit rate is a separate choice for either format.

### While it is recording

A shake cannot start a take. With **Stop**, a shake ends it. With **Pause**,
a shake pauses it and the next shake resumes it. **Off** ignores the
accelerometer.

Sensitivity is low, normal, or high. While Stop or Pause is selected, the
sheet shows a live level and the mark you have to cross. **Haptic** buzzes
when a shake is recognized, including on that sheet so you can try it
before a take. During a recording the same buzz fires, and the notification
can pause or stop the take as well.

**Countdown** shows a count after capture is allowed. The **floating
button** is optional: it draws over other apps so you can start or stop a
recording you already allowed. Android asks for Display over other apps.
Turning the button off does not stop a recording that is already going.
Tanit works without it.

---

## Voice: notes, reading, and the voice agent

Three different jobs — do not mix them up.

### Voice Recorder

Record on this phone. With the computer's audio grant on, pick its
microphones and what it is playing. The computer mixes those sources into
one stream. The phone listens, or writes a take. A starred device that has
gone away leaves that mix once the list has loaded.

**To Phone** plays the mix and saves nothing. Gain at the centre is
pass-through. Gain at zero is quiet.

The phone's own microphone can join a recording or the speaker on the
phone. It is not sent to the computer, and it is not played back into the
computer's speakers. The phone can send what it is playing to one speaker
on the computer. That path is separate from the microphone.

Transcribe on the phone (local whisper, or Tanit cloud). Realtime captions
sit on the level meter while a take is open. Change voice, trim, a
three-band EQ, and publish stay on the recording. Search matches titles
and the saved transcript. Noise remover and volume leveling are recorder
options, not the chat agent. Speech uses a saved cloud server even when
chat is pointed at the paired computer, and it does not switch that preset.

### Reader

Generate a spoken version of documents and pictures. Background speaking
can continue after you leave; finished wavs use the system media player.
Spoken takes hang under the document the same way Voice Recorder lists
recordings.

### Voice agent

Live two-way talk with the assistant.

- **On the phone (cloud):** the realtime session runs with the phone mic and
  speaker. Tools the phone agent has can run during the call.
- **Paired desktop:** the live button still uses this phone's microphone
  and speaker. Selecting the computer as the chat server does not move
  that capture onto a desktop microphone. The phone can also start and
  steer the computer's own voice agent. That remote session is events:
  push-to-talk, stop, and cancel. It is not the listen stream above, and
  the phone mic is not posted to the computer as a second recording.

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
| Voice notes from the phone mic | Notes of the computer, or the computer plus the phone mic mixed on the phone |
| Screen recording of the phone, with its sound, mic, and optional camera | The same clip can use the computer's mix instead of the phone's sound |
| This phone's files stay on the phone | Folders you share appear in Places on the computer. Desktop shared folders open on the phone |
| Reader and viewers for files on the phone | Open a shared desktop file, or a file the agent wrote inside a shared folder |
| Live voice with this phone's mic and the cloud model | The live button still uses this phone's mic. A separate control steers the desktop voice agent |
| MCP clients you enable on the phone | Desktop MCP catalog — search, research, format-specific, and web tools next to the data |
| — | Search index, computer use, browser use, local models on that host |
| — | Watch or record a camera, monitor, or window on the computer |

Pairing does not upload the phone's screen, microphone, or private files.
Folder access, microphones, cameras, chat, and tools stay off until you
turn them on, on the device that owns them, over Wi‑Fi or Tailscale.

---

## Related

- [Tanit on your network](./feature-network.md) — pairing, Tailscale, remote audio and video
- [Tanit AI](./feature-ai.md) — models, presets, MCP, policy
- [Tanit Audio](./feature-audio.md) — record, STT/TTS, voice commands, realtime
- [Files](./feature-files.md) — browse, index, semantic search, MCP beside large trees
- [Tanit Security](./feature-security.md) — consent and governance

