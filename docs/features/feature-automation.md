---
title: Tanit Automation
slug: tanit-automation
description: Build small visual workflows for files, commands, applications, devices, audio, video, and services — then run them from the app, CLI, live documents, or other tools.
tags: [tanit, automation, xblox, workflows, visual-scripting, cli, mcp, gpo]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Automation without a separate scripting stack

XBlox is Tanit's visual language for small, repeatable tasks.

Use it to call a command, move files, fetch an API, control an application,
record a microphone or screen, inspect an image, or combine several of those
steps into one flow.

It is deliberately smaller than a general-purpose programming language. A
flow is a JSON document made from blocks, variables, expressions, and basic
control flow. You can edit it visually, run it from the command line, or let an
LLM compose the same documented block format.

The runner is native C++. It does not need a separate Python or Node.js runtime
and does not install packages when a flow starts.

> Available blocks vary by operating system, edition, and organization policy.

---

## What it is useful for

- Turn a repeated sequence of commands into one reviewed flow.
- Watch a folder, transform its files, and place the results somewhere else.
- Record audio, transcribe it, and append the text to a journal.
- Pick text from an application and read it aloud.
- Record a window or screen region when a hotkey is pressed.
- Fetch data over HTTP, select a few fields, and write or speak the result.
- Control a desktop application with clicks, keys, UI Automation, and
  screenshots.
- Read and write MQTT or Modbus data beside ordinary file and network steps.
- Add one AI or MCP operation to an otherwise deterministic workflow.

XBlox is intended for these bounded jobs. It does not provide user-defined
functions, classes, or a replacement for a full programming language.

---

## A flow stays readable

The block tree shows the order of work. The wiring view shows where values
come from and where they go. Properties remain attached to the block that uses
them.

Common language blocks include:

- `if` / `elseIf` / `else`
- `switch` / `case` / `default`
- `for` / `while` / `break`
- variables, expressions, groups, waits, and lifecycle blocks
- stdin, stdout, logging, parsing, and iteration

Values can be named with `storeAs`, passed through `PREVIOUS`, or referenced in
text:

```text
${KNOWNFOLDER:DOCUMENTS}/journal-${YYYY}-${MM}-${DD}.txt
```

Conditions and calculations use expressions such as:

```text
count > 0
nowMs - lastRun >= 5000
status == "ready"
```

The format is also suitable for machine authoring. Blocks have stable names,
typed parameters, descriptions, defaults, constraints, and declared outputs,
so an LLM can work from a catalog rather than inventing command syntax.

---

## From input to action

| Area | Examples |
|:-----|:---------|
| **Flow and data** | Conditions, loops, variables, JSON selection, iteration |
| **Files and commands** | Read, write, list, hash, copy, move, shell, saved commands |
| **Applications** | Open, activate, click, type, hotkeys, clipboard, UI Automation |
| **Network** | HTTP, SSH, IPC, MQTT, Modbus, MCP |
| **Audio** | Devices, playback, mic/desktop recording, STT, TTS, voice triggers |
| **Video** | Cameras, screens, windows, still capture, H.264 recording, detection |
| **Images and vision** | Resize, OCR, local vision, create, transform, understand |
| **Services and search** | CMS operations, remote or local vector search |
| **Optional AI** | Agent step, local model, approved provider, MCP tool |

The full list and each block's parameters are in the
[XBlox reference](../xblox.md).

---

## Examples

### Voice journal

Start a microphone recording. When it stops, transcribe locally with Whisper,
append a timestamped entry to a journal, paste the text into the focused
control, and speak a short confirmation.

```sh
tanit-cli xblox run --src tests/xblox/stt-journal-ex.xblox
```

### Weather to speaker

A short flow can request a weather report, select the useful text, turn it
into speech, and play it through a local or Bluetooth speaker:

```text
HTTP → Parse → Text to speech → Play audio
```

### Screen recording from a hotkey

Wait for a shortcut, start a named recording, update zoom while it runs, and
stop it from the same flow. The resulting path can be handed directly to the
next block.

See [Video](./feature-video.md) for recording sources and options.

### Local document search

Index Word and Excel files into a local vector store, ask a question, and
write the ranked results as JSON. A compatible local embedding model is
required.

### Desktop task

Open an application, locate a control through UI Automation, enter text,
capture a screenshot, and close the temporary window. The steps remain visible
and editable instead of being hidden inside an agent conversation.

---

## Run it where it fits

An `.xblox` document is not tied to the visual builder.

| Surface | Typical use |
|:--------|:------------|
| **Builder** | Create, inspect, wire, and run blocks interactively |
| **CLI** | Scheduled jobs, batch work, terminals, and tests |
| **Commands** | Ribbon, Explorer, launcher, and Page Builder buttons |
| **Markdown** | Live examples and notebook-like operating instructions |
| **MCP** | Publish a reviewed flow as one tool with a defined interface |
| **Native host** | Call the C++ header API or load the runtime through a DLL boundary |

Basic CLI use:

```sh
tanit-cli xblox run --src flow.xblox
tanit-cli xblox run --json --src flow.xblox
tanit-cli xblox run --simulate --src flow.xblox
```

The native runtime is available on Windows, macOS, and Linux. Individual
blocks can still be platform-specific; application control and Windows capture
are examples.

---

## Self-documenting by design

Blocks describe their own parameters, defaults, input types, constraints,
outputs, child lists, platform support, and execution behavior. The runner,
property editor, wiring view, and generated documentation read the same
manifest.

A flow can produce a human-readable outline or diagram without running:

```sh
tanit-cli xblox run --md --src flow.xblox
tanit-cli xblox run --md --mermaid --src flow.xblox
tanit-cli xblox run --diagram --src flow.xblox
```

This is useful for reviewing a flow, including it in documentation, or showing
an operator what will happen before they run it.

The next schema work extends this model to structured values: for example,
describing a file-list result as a list of file entries rather than opaque
JSON. Project-level ambient schemas will also be able to describe custom API
and integration blocks without recompiling the runtime.

---

## Safety and managed use

Automation can have side effects. A flow may write files, start processes,
send network requests, capture media, or control an application. XBlox exposes
those operations as named blocks; it does not make them harmless.

The runtime and host provide several controls:

- parameter types and constraints are checked before the block handler runs;
- shell and command steps use Tanit's validation and consent paths;
- cancellation, timeouts, and structured error events are available;
- `--simulate` runs control and data blocks while suppressing blocks declared
  as side-effecting;
- optional cloud, AI, and MCP operations remain explicit blocks;
- Windows Group Policy can disable XBlox and restrict command groups,
  providers, tools, or other optional capabilities.

For organization-wide configuration, see
[Group Policy setup](../gpo-setup.md). For consent, sandboxing, paths, tools,
and agent policy, see [Security](./feature-security.md).

---

## Native and integration-friendly

XBlox can be used as part of another application rather than only through the
Tanit UI.

The C++ headers expose document and root-list execution, execution options,
structured events, outputs, cancellation, and command callbacks. Applications
may link the implementation directly or place it behind a DLL API. Web-based
hosts use a small host bridge, while previews can use an in-memory runtime.

Because the document stays JSON, the same flow can move between the embedded
builder, CLI, native host, live documentation, and MCP interface without
changing its block representation.

---

## Related docs

- [XBlox reference](../xblox.md) — blocks, CLI flags, and language details
- [Video](./feature-video.md) — screen, window, camera, and detection flows
- [Audio](./feature-audio.md) — recording, transcription, and speech
- [AI](./feature-ai.md) — models, agents, MCP, and local inference
- [Files](./feature-files.md) — local and remote files
- [Security](./feature-security.md) — consent, policy, encryption, and backup
- [Deployment](./feature-integration.md) — managed and partner deployments

---

## Illustration prompts

<!-- Internal production notes: remove this section before publishing. -->

Use the feature-page visual language: white or very light warm-grey
background, flat editorial vector illustration, restrained teal `#4A90A4`
with small coral highlights, soft shadows, rounded panels, generous
whitespace, no gradients, no logos, no fake UI text, and no dark developer
dashboard.

### 1. Hero — a small task becomes a visible flow

**Filename:** `tanit-automation-hero.png`  
**Format:** wide 16:9 editorial illustration.

> Show four large, approachable workflow cards connected left to right: choose a file, run a command, inspect the result, save or send it. The cards should carry recognizable visual payloads rather than code: a document, a compact terminal action, a transformed preview, and a finished output. Add a small human hand arranging one card to show that the sequence remains editable. Keep the flow modest and practical, not futuristic. White background, teal connectors, one coral status accent, no readable interface text.

_Suggested caption: Small repeated tasks, kept visible and reusable._

### 2. One flow, several places

**Filename:** `tanit-automation-surfaces.png`  
**Format:** landscape 16:9 system illustration.

> Place one simple workflow document in the centre. Connect it to five restrained surfaces around it: visual builder, command line, Markdown document, desktop button, and MCP tool. The central flow stays identical while each surface presents it differently. Use clear geometry and sparse icons. Avoid a cloud-platform diagram or dense technical labels.

_Suggested caption: Build the flow once; run the same document where it is useful._

### 3. Managed automation

**Filename:** `tanit-automation-managed.png`  
**Format:** landscape 4:3 explanatory illustration.

> Show a visible workflow approaching a policy gate before reaching files, shell, network, camera, and application controls. Allowed routes pass through in teal; one restricted route stops calmly at the gate. Include a small administrator policy sheet and lock symbol without implying that every action is automatically safe. Light editorial style, no shields covering the whole image, no surveillance imagery.

_Suggested caption: Visible actions, host checks, and policy controls for managed environments._

### 4. Self-documenting flow

**Filename:** `tanit-automation-self-documenting.png`  
**Format:** wide 16:9 explanatory illustration.

> Show one block flow in the centre branching into three views generated from the same source: a compact parameter card, a readable document outline, and a clean flow diagram. Use matching colors and shapes to make their shared origin obvious. The image should communicate inspection and documentation, not code generation.

_Suggested caption: The block definitions drive the editor, runner, and documentation._
