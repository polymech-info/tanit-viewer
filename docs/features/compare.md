---
title: Why Tanit
slug: why-tanit
description: Tanit turns local and cloud AI into a governed Windows workspace for files, media, devices, and repeatable work.
tags: [tanit, comparison, ai, codex, claude, ollama, hermes, unsloth, automation, security]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# AI that belongs to the workstation

Codex and Claude are excellent coding agents. Ollama runs local models.
Unsloth trains them. Hermes follows you across chat platforms.

**Tanit turns those capabilities into a Windows application people can use
for everyday work.**

Files, documents, images, speech, cameras, applications, and workflows live
beside the agent. Local and cloud models can be mixed per task. Successful
work is packaged as a portable preset, command, or visual flow—not left in a
chat transcript. The same solution can run in Chat, the CLI, Explorer, or on
a schedule.

---

## The difference in 30 seconds

| | Tanit | A model server or agent alone |
|:--|:------|:------------------------------|
| **What users receive** | A complete Windows workspace | A model endpoint, terminal, chat, or web UI |
| **Where AI works** | Beside folders, documents, media, applications, cameras, and devices | Inside its own conversation or development environment |
| **Model choice** | Local GGUF, cloud providers, private endpoints, or a mix per capability | Usually one provider or one runtime at a time |
| **Portable solutions** | Presets and XBlox flows move a reviewed setup between interactive, headless, and managed deployments | Prompts, scripts, or product-specific tasks |
| **Runtime** | Compiled C++ core; no Python, Node.js, virtual environment, or container required | Often an interpreter, package environment, service, or browser stack |
| **Parallel work** | Multiple agent sessions, flows, and tool calls can run concurrently | Depends on the client and the surrounding orchestration |
| **Control** | One security gateway for built-in tools and MCP across every surface | Permissions limited to that agent or service |
| **Deployment** | One installer; reduced runtime dependency surface; GPO, Intune, ADMX, secure profiles, and UI lockdown | An integration project around separate components |

Tanit is not another wrapper around a chat API. Its agent, tool gateway,
automation runtime, file workspace, media tools, and policy controls ship
together.

---

## Compared with the usual choices

| Product | What it does best | Why choose Tanit |
|:--------|:------------------|:-----------------|
| **Codex** | Writes and tests code in a repository, locally or in a cloud task | Tanit covers the rest of the workstation: files, Office and PDF documents, images, speech, cameras, applications, devices, and repeatable operational workflows |
| **Claude** | Strong interactive reasoning and coding with MCP, skills, hooks, and managed settings | Tanit is provider-independent and local-capable, with native Windows integration and one policy path from conversation to scheduled automation |
| **Ollama** | Downloads and serves open models through a local API | Tanit puts local models to work inside a governed application instead of leaving users to assemble the interface, tools, automation, and security |
| **Hermes Agent** | A personal agent with memory, skills, scheduling, and messaging gateways | Tanit is designed as a deployable workstation: controlled UI, local media, deterministic flows, Windows fleet policy, and bounded tools for each role |
| **Unsloth Studio** | Fine-tunes, compares, runs, and exports models | Tanit deploys models into daily work. Train or export in Unsloth; use the result in presets, files, voice, and workflows |

These products can remain part of the solution. Tanit can use compatible local
endpoints, install GGUF models exported by training tools, and hand repository
work to installed Codex or Claude Code runners.

---

## Build once, carry the solution

A Tanit solution is configuration, not a fragile conversation. Package the
working setup and reuse it on the next file, in another interface, or on
another managed PC.

| Portable part | What travels |
|:--------------|:-------------|
| **Preset** | Agent runner, main and planner models, media routes, tools, MCP, skills, prompts, limits, and consent behavior |
| **Flow** | Reviewed XBlox steps for files, media, HTTP, applications, MQTT, Modbus, and AI |
| **Command** | A named action for the ribbon, Explorer, voice, CLI, or scheduler |
| **Profile** | Encrypted, signed configuration that can be backed up, restored, or deployed |

Create as many solutions as the organization needs: a local-only document
helper, a voice-first accessibility agent, a research setup with selected MCP
tools, or a workshop flow limited to approved manuals and devices.

The package is portable across Tanit surfaces and Windows PCs; model files,
provider credentials, and machine-level policy remain separately managed.
Organization policy is the outer boundary and cannot be weakened by a preset.

---

## Native by design

Tanit’s agent loop, security gateway, secure storage, tools, automation, file
operations, and media pipeline run in a compiled C++ core. The OS WebView
presents selected interfaces; it is not a Node.js application runtime.

| Advantage | What it means |
|:----------|:--------------|
| **Ready after install** | The product runtime is complete—no Python environment, `pip install`, `npm install`, package restore, or container bootstrap |
| **Fast launch** | Start the native application directly instead of first starting an application server and its dependency stack |
| **Small operational surface** | Desktop, CLI, tools, policy, and XBlox ship as one versioned product instead of a chain of separately managed frameworks |
| **Reduced supply-chain exposure** | Editions compile out unused capabilities; native dependencies and signed plugins can be inventoried and shipped deliberately |
| **Multiple instances** | Run independent agent sessions and XBlox jobs with different presets; dispatch independent tool calls in parallel |
| **Predictable deployment** | The same binaries, presets, and included GPO / ADMX policy can be tested once and deployed across the fleet |

Tanit does not download packages when a flow starts. Connect an approved
provider or select an installed model and work immediately. Large local model
weights remain separate payloads; cloud-backed and shared models avoid that
load on each seat.

Schools, laboratories, and corporate IT can ship the application, portable
solutions, and Group Policy without first building a Python or Node stack,
agent UI, and security layer.

---

## Built around actual work

| Work | What Tanit provides |
|:-----|:--------------------|
| **Files and documents** | Local folders, SSH/SFTP, FTP, connected phones, Office and PDF viewing, search, and file-aware chat |
| **Images and video** | Browse, cull, OCR, understand, resize, generate, capture, record, and process |
| **Speech** | Local whisper.cpp transcription, TTS, realtime voice, mic recording, and voice commands |
| **Applications** | Commands, UI Automation, computer-use tools, Explorer integration, and global shortcuts |
| **Lab and shop systems** | MQTT and Modbus in the same flow as files, HTTP, and AI |
| **Automation** | Native C++ XBlox flows, CLI jobs, schedules, ribbon actions, and Explorer commands |

### Skip the chat when the job is already known

A repeated job should not pay for a fresh conversation, a full chat history,
every tool schema, and another round of prompt engineering.

Presets select the right provider and model for text, planning, vision, OCR,
images, video, speech, and realtime voice. XBlox then sends only the required
input to the required step. A document flow can extract, classify, and file;
an image flow can inspect and resize; an audio flow can clean, transcribe, and
export—without asking the user to reconstruct the procedure in chat.

Deterministic work stays deterministic. File moves, conditions, device writes,
exports, and approvals remain explicit blocks. AI is used only where
interpretation or generation adds value. This removes noise, improves
repeatability, and lets each step use the smallest local model or most
cost-effective provider that can do the job.

---

## Local where it matters, cloud where it earns its keep

A single preset can use:

- a local llama.cpp model for private text or vision
- local whisper.cpp for speech
- ONNX models for focused media work
- a fast model for planning
- an approved cloud model for difficult reasoning
- a private OpenAI-compatible endpoint on the LAN

The Models page helps select GGUF variants by quantization, size, sharding,
capabilities, and estimated VRAM. A stronger machine can serve other seats
over the LAN with `llm agent --serve`; the clients keep the managed Tanit
workspace and its policy.

No cloud account is required for a local-only configuration.

---

## Policy follows the action

The assistant proposes an action. Tanit allows it, denies it, or asks the
user.

| Control | Scope |
|:--------|:------|
| **Consent** | Once, session, timed, always, or never — with the action and target named |
| **Profiles** | Light, Strict, and Developer grant sets |
| **Sandbox** | AppContainer / LPAC isolation and limited writable paths for higher-risk tools |
| **Fleet policy** | GPO, Intune, and ADMX for providers, tools, MCP hosts, skills, computer use, voice, CLI verbs, and UI panels |
| **Secure storage** | Encrypt and sign settings, commands, MCP configuration, and prompt documents |

The same gateway protects built-in and MCP tool calls in Chat, CLI jobs, and
headless flows. Security is not a warning added to one interface; it is part
of the runtime.

---

## Choose Tanit when

- Users need an application, not an AI infrastructure project.
- Work begins with folders, documents, speech, images, or devices—not only a
  prompt or git repository.
- Local and cloud models must coexist without changing the user experience.
- A successful interaction must become a reviewed, repeatable procedure.
- Different roles need different agents, tools, and interfaces.
- A solution must move from one user or machine to another without recreating
  its prompts, tools, and workflow.

**Choose the models you trust. Build the agents each role needs. Keep the
workspace, automation, and policy in one deployable product.**

---

## Learn more

[Tanit AI](./feature-ai.md) ·
[Automation](./feature-automation.md) ·
[Deployment](./feature-integration.md) ·
[Security](./feature-security.md) ·
[Files](./feature-files.md) ·
[Images](./feature-images.md) ·
[Audio](./feature-audio.md) ·
[Video](./feature-video.md)

## Comparison sources

- [OpenAI Codex sandboxing](https://developers.openai.com/codex/sandboxing)
- [Claude Desktop](https://code.claude.com/docs/en/desktop)
- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)
- [Hermes Agent](https://hermes-agent.nousresearch.com/)
- [Unsloth Studio](https://unsloth.ai/docs/new/studio)
