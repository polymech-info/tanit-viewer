# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

The Tanit Chat UI is a WebView2-rendered React/TypeScript application (built with
Rspack, embedded into the native shell). Product runtime is a native C++ desktop
app on Windows (primary, Microsoft Store MSIX + direct download), with Linux and
macOS builds in the monorepo. The design language is web tech inside a native
desktop shell, not a browser tab.

## Users

Three audiences, roughly equal in weight:

- **Everyday knowledge workers** who want a simple AI + file companion for daily
  work — inspecting images, working with documents/Markdown/code, asking about
  content, voice instead of typing, automating repetitive tasks visually.
- **Schools and security-sensitive managed environments** (students, teachers,
  analysts, other managed users) who need useful AI workflows without giving the
  assistant unrestricted access to files, tools, providers, or external services.
- **Developers and researchers** moving from model discovery to repeatable
  experiments — Hugging Face model discovery, mixed-model pipelines,
  reproducible agent runs, saved presets, workflows turned into reusable commands.

## Product Purpose

Bring AI, files, media, automation, and everyday desktop tools into one fast
local-first Windows workspace so people stop moving between separate viewers, AI
websites, scripts, and utilities. The tools sit close to the actual work. Success
means a user can open a file, ask about it, transform it, automate the task, and
publish the result — without leaving the workspace every few minutes.

## Positioning

Local-first by default: many everyday features run on-device without sending
content to a cloud, and AI is a replaceable tool inside the workspace rather than
the foundation that controls it. Capability-based routing lets text, planning,
vision, OCR, image generation, transcription, speech, and realtime voice each use
a different local or cloud provider, so the workflow is not tied to one vendor.
A lean native C++ architecture is deliberately chosen for speed, stability, and a
smaller attack surface. A neighboring product could not truthfully copy this
combination of native-local-first + per-capability routing + inspectable
agent-to-command capture.

## Operating Context

- Workspace centered on the user's actual files: select files in Tanit or Windows
  Explorer and they become chat context; a visual filmstrip shows exactly what Chat
  can see. Drop files onto the composer/filmstrip, paste an image, capture a
  camera still, or type `@` to find a recent workspace file.
- Rich answers: Markdown, tables, code highlighting, Mermaid diagrams, local file
  links, generated images, live shell output, changed-file indicators.
- Persistent sessions with a session sidebar; optional memory recalls useful
  earlier context without replaying full history. Stop response/command/
  sub-agent/speech at any time; assistant can ask structured questions when a
  choice needs user input.
- Inspectable execution: Log view shows model rounds, planning, branches, errors,
  and stops behind an answer.
- Reusable automation: a successful chat becomes an XBlox flow, then a command
  runnable from the ribbon, launcher, Tanit, or Windows Explorer context menu on
  the next selection.
- Edition/policy note: available features can vary by edition and organization
  policy.

## Capabilities and Constraints

**Feature outlines live in one place:** `releases/web-docs/features/`. Each
file there is the canonical outline for one capability area and the source future
work should defer to rather than restating here. The current set:

- `feature-ai.md` — AI: local + cloud models, per-capability routing, agents, MCP, presets
- `feature-audio.md` — Audio: record, transcribe, speak, voice commands
- `feature-video.md` — Video: playback, capture, batch convert
- `feature-images.md` — Images: view, batch, AI image generation, screenshots
- `feature-markdown.md` — Markdown / text / code: KaTeX, Mermaid, live XBlox, version history
- `feature-files.md` — Files: browse, search, formats
- `feature-automation.md` — XBlox automation: visual workflows → ribbon / launcher / Explorer / CLI
- `feature-integration.md` — Partner / MSP / OEM deployment
- `feature-security.md` — Settings encryption, signing, backup (agent/tool policy → security overview)
- `feature-chrome.md` — Chrome extension
- `applications.md`, `compare.md` — application surfaces and edition comparison

Durable product constraints (not feature outlines):

- **Capability routing** is a positioning fact, not just a feature: text,
  planning, vision, image generation, OCR, video, transcription, speech, and
  realtime voice each route to a different local or cloud provider; mix freely.
- **Permissions & sandboxing**: Light / Strict / Developer profiles; review action,
  target, risk before approving (once / task / session / limited time / always /
  never); sandboxed command execution. Administration via Windows Group Policy,
  Intune MDM, or direct registry; machine policy overrides user settings;
  protected security requirements cannot be lowered by a non-admin user.
- **Media capture**: webcam/screen/window capture, session MP4 recording, xblox
  record blocks — user-started or user-authored scheduled flows only; no covert
  capture. Windows OS consent dialog on first mic/camera use; no
  `microphone`/`webcam` DeviceCapability in v1.
- **Identity/uploads**: Tanit account login (Zitadel/Entra); CMS uploads of files,
  pictures, posts, pages, categories.
- **Internal exe/CLI slugs**: `tanit.exe` / `tanit-cli.exe` (display name
  **Tanit Chat**). Store identity `PolyMech.TanitChat`, Store ID `9N5F39064NPD`.
- **Licensing (open decision, v1)**: first Microsoft Store submission is a **free
  app** — no trial clock, no post-trial lock. `FEATURE_MS_STORE_APP_TRIAL`,
  `FEATURE_MS_STORE_ENTITLEMENTS`, `FEATURE_MS_STORE_COMMERCE` are OFF on the
  Store preset. Tanit Pro (paid AI routing services) and credit packs become Store
  add-ons in a later resubmit. Zip-bundle HMAC trial (`FEATURE_TRIAL_CHECK`) is a
  direct-download concern, not the Store listing.

## Brand Commitments

- Name: **Tanit Chat** (display name). Publisher: **PolyMech**. Domain:
  polymech.info / tanit.polymech.info.
- Voice: local-first, practical, no subscription pain; "fast, local when you want
  it, powerful when you need it"; AI as a replaceable tool, not the foundation.
- Free for real work is a binding commitment: most functionality is free, including
  local features and local AI models; Tanit Pro is required only when using paid AI
  routing services. The application does not become useless without cloud services.
- The application must not promise a trial or post-trial lock in the v1 Store
  listing copy.

## Evidence on Hand

- **Canonical feature outlines**: `releases/web-docs/features/` — one file per
  capability area (see Capabilities and Constraints). This folder is the source of
  truth for what each feature does; PRODUCT.md does not duplicate it.
- Store listing description: `releases/ms-app-store/tanit-chat/partner-center/en/description.md`
- Store track spec (features, deltas, cert notes): `releases/app-stores/tanit-chat-store.md`
- Public feature page (marketing source of truth for chat): `releases/web-docs/llm/feature-chat.md`
- Feature page (German): `releases/web-docs/products/tanit-chat/features.de.html`,
  `features.inline.de.html`, `product_de.json`
- Store identity: `releases/app-stores/tanit-chat-store-identity.json`
- Build/feature flags: `CMakePresets.json` (`base`, `release`,
  `store-tanit-msix-release`), `CMakeLists.txt` (`FEATURE_*`)
- Feature explorer: `releases/web-docs/products/tanit-chat/product.json` is the
  catalog behind `features.html` (classic sidebar+stage by default; `?layout=scroll`
  expands every feature). German overlay: `product_de.json`.
- NOTE: `product-tanit-viewer.md` is leftover Viewer copy — do not treat it as
  Tanit Chat truth.

## Product Principles

1. **Local-first by default.** Run on-device when possible; cloud is opt-in, not
   the only path. The app stays useful offline.
2. **AI is a tool, not the foundation.** A lean native core keeps speed, stability,
   and a small attack surface; AI is replaceable inside the workspace.
3. **Route per capability.** Let each ability (reasoning, vision, OCR, speech,
   image gen, transcription, realtime voice) use the right local or cloud model;
   never tie the workflow to one vendor.
4. **Files are the context.** The user's selection becomes the conversation
   context — no separate upload workflow; always show what Chat can see.
5. **Control and inspection are first-class.** Permissions, sandboxing, and the
   Log view are core, not afterthoughts; successful work becomes a reusable,
   inspectable command.

## Accessibility & Inclusion

- Multi-lingual UI and content (German localization exists; i18n is an ongoing
  build concern — see `build:post:web-i18n` and `build:post:commands-i18n`).
- Managed-environment deployment (Group Policy / Intune / registry) is a
  first-class requirement, not an add-on: administrators must be able to restrict
  providers, tools, MCP, computer control, realtime voice, and writable folders,
  and machine policy must override user settings.
