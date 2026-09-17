---
title: Tanit Chat
slug: tanit-chat
description: Chat with the files in your workspace using local or cloud AI, voice, tools, MCP integrations, security controls, and reusable automations.
tags: [tanit, chat, llm, ai, local-ai, voice, automation]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# Chat with your files while keeping control of your AI

Tanit Chat brings AI into the workspace where you already browse, preview, and
organize files. Select what you want to work with, ask a question, and see
exactly what the assistant can access before you send.

Start with a simple conversation. Add voice, tools, local models, integrations,
or reusable automations when the work calls for them.

**One workspace, your choice of AI**  
Connect direct providers, bring your own key, use compatible endpoints, choose
an aggregator, or run supported models locally. Switch models as your needs
change instead of tying your workflow to one vendor.

Tanit uses a lean native architecture designed for speed, stability, and a
smaller attack surface. AI remains a replaceable tool inside your workspace,
not the foundation that controls it.

> Available features can vary by edition and organization policy.

---

## What sets Tanit Chat apart

- **Turn your file selection into context**  
  Select files in Tanit or Windows Explorer and work with them immediately—no
  separate upload workflow. A visual filmstrip shows exactly what Chat can see.

- **Route each capability to the right model**  
  Use different local or cloud providers for reasoning, vision, OCR, image
  generation, transcription, speech, and realtime voice.

- **Build a complete agent, then save it**  
  Store the model, planner, tools, MCP connections, skills, and media options as
  one preset you can restore reliably.

- **Grant access at the level the task needs**  
  Review the action, target, and risk, then approve it once, for a task or
  session, for a limited time, always, or not at all.

- **Inspect what happened behind an answer**  
  Follow tool calls and command output live, then inspect model rounds,
  planning, branches, errors, and stops in the Log view.

- **Turn successful work into a command**  
  Capture the process as an XBlox flow and run it later from the ribbon,
  launcher, Tanit, or Windows Explorer on the next selection.

---

## Work directly with your files

**Workspace context**  
Chat knows your active folder and can use the files currently selected in
Tanit's integrated file manager as context.

**Flexible references**  
Drop files onto the composer or filmstrip, choose them manually, paste an image,
capture a camera still, or type `@` to find a recent workspace file.

**Rich answers**  
Responses support Markdown, tables, code highlighting, Mermaid diagrams, local
file links, generated images, live shell output, and changed-file indicators.

**Control while it runs**  
Stop a response, command, sub-agent, or speech playback at any time. The
assistant can ask structured questions when an important choice needs your
input.

**Persistent sessions**  
Start, switch, resize, or remove conversations from the session sidebar.
Optional memory recalls useful earlier context without replaying the full
history.

---

## Choose the right cloud model for each job

**Cloud and BYOK**  
Use your Tanit account or configure supported services such as OpenAI, Gemini,
OpenRouter, Replicate, ElevenLabs, and compatible endpoints.

**Capability-based routing**  
Text, planning, vision, image generation, OCR, video, transcription, speech,
and realtime voice can each use a different provider.

**Mix providers**  
Choose the strongest or most economical provider for each capability without
moving the rest of your workflow.

---

## Find and run models locally

**Hugging Face support**  
Find and install supported GGUF models from Hugging Face. Tanit inspects
available variants, quantization, download size, sharding, model capabilities,
and estimated VRAM requirements to help you choose a suitable build.

**llama.cpp**  
Run compatible GGUF text models locally. Where supported, use visual-language
models for private image understanding.

**ONNX Runtime**  
Use focused local pipelines for OCR, layout analysis, classification, object
detection, segmentation, and other media tasks.

**whisper.cpp and local speech**  
Transcribe recordings and voice input offline with whisper.cpp. Supported local
speech synthesis can read responses without sending them to a cloud voice
provider.

**Local semantic search**  
Use local embeddings to find conceptually related material, while exact search
handles known paths, names, symbols, and phrases.

**Mix local and cloud**  
Combine local transcription with cloud reasoning, local OCR with online image
generation, or local chat with external research tools.

---

## Add tools without giving up control

**Built-in tools**  
Let the assistant find, read, search, and write files; process media; transcribe
audio; run approved commands; schedule work; and ask structured questions.

**MCP connections**  
Connect local or remote Model Context Protocol servers, inspect discovered
capabilities, and enable only the servers and tools you want Chat to use.

**Reusable skills**  
Use personal and workspace skills as focused instruction packs for recurring
work. Enable, disable, pin, inspect, or edit them as needed.

**Presets and planning**  
Save a complete setup, or let a planner choose a focused set of capabilities
before the assistant begins.

**Permissions and sandboxing**  
Choose Light, Strict, or Developer security profiles, review active grants, and
control which additional folders sandboxed tasks can read or write.

**Inspectable execution**  
Open the Log view to inspect the model rounds, planning, tool calls, branches,
errors, and stops behind an answer.

---

## Tanit Chat for schools and security-sensitive environments

Give students, teachers, analysts, and other managed users access to useful AI
workflows without giving every assistant unrestricted access to files, tools,
providers, or external services.

**Keep supported workloads on the device**  
Use local llama.cpp models, whisper.cpp transcription, ONNX media pipelines,
local speech, and local semantic search when data should remain on managed
hardware. Administrators can also restrict which cloud providers are available.

**Set policy centrally**  
Apply organization settings through Windows Group Policy, Intune MDM, or direct
registry management. Machine-level policy takes precedence over user settings,
and protected security requirements cannot be lowered by a non-admin user.

**Control tools and connections precisely**  
Disable MCP entirely or restrict it to approved hosts. Allow or block individual
tools, disable computer control and realtime voice, lock provider and model
selection, restrict writable folders, and require sandboxed command execution.

**Protect sensitive configuration**  
Enforce encryption, signing, and verification requirements for settings,
credentials, prompts, commands, and MCP configuration. Users still see
permission requests before sensitive actions are allowed.

See [Group Policy administration](tanit-gpo) for deployment, precedence, and
policy examples.

---

## Tanit Chat for developers and researchers

Move from model discovery to repeatable experiments without assembling a
separate application around every model, file set, or tool.

**Explore Hugging Face models**  
Resolve Hugging Face repositories and supported GGUF variants, compare
quantizations and download sizes, estimate VRAM use, and install model assets
for local llama.cpp workflows.

**Build mixed-model pipelines**  
Route text, vision, OCR, transcription, speech, image generation, and research
tools independently. Combine llama.cpp, whisper.cpp, ONNX Runtime, cloud APIs,
compatible endpoints, and MCP servers in one workflow.

**Inspect and reproduce agent runs**  
Follow tool calls and command output live, inspect planning and model rounds in
the Log view, then save the provider, model, tools, skills, and MCP configuration
as a reusable preset.

**Turn experiments into tools**  
Capture a successful process in XBlox, add conditions, loops, file inputs, and
saved outputs, then publish it as a command for a team or the next dataset.

---

## Turn a successful chat into a reusable command

**Build visually with XBlox**  
Combine an LLM agent with file input, local or external models, OCR, vision,
audio, video, conditions, loops, commands, and saved output.

**Use the current selection**  
Pass files selected in Tanit or Windows Explorer to an automation, then process
each item or the entire selection.

**Publish as a ready-to-run command**  
Place a finished workflow in the ribbon, command launcher, integrated file
manager, or Windows Explorer context menu.

**Create one-click actions for recurring work**  
Translate documents, transcribe recordings, extract receipts to CSV, describe
images, build galleries, summarize files, or classify media into folders.

**Keep your model and security choices**  
Run automations locally, call external providers, or combine both while
preserving provider settings, file scope, permissions, and sandbox policy.

---

## Start with the files in front of you

Select one or more files, open Chat, and ask your first question. When the task
becomes repeatable, capture the successful process in XBlox and publish it as a
command for the next file.

---

## Related pages

| Topic | Page |
| :-- | :-- |
| AI capabilities (public) | [feature-ai](../features/feature-ai.md) |
| Chat settings | [tanit-chat-settings](tanit-chat-settings) |
| Agent memory | [tanit-agent-memory](tanit-agent-memory) |
| LLM tools and MCP | [tanit-llm-tools](tanit-llm-tools) |
| Commands | [tanit-commands](tanit-commands) |
| XBlox automations | [xblox-docs](xblox-docs) |
| Viewer | [tanit-viewer](tanit-viewer) |
| Security overview | [tanit-security](tanit-security) |
| Group Policy | [tanit-gpo](tanit-gpo) |
