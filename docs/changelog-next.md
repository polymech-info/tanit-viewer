# Changelog

End-user features for Tanit / Tanit Viewer, from `src/` only.
Generated via `npm run build:post:changelog:next`.
Each change is dated **DD-MM**. Newest first.

## 1.0.71 - 04-10

- 04-10 Settings: Voice commands.
- 02-10 CLI: Enhance after capture (same lib as `audio filter`).
- 02-10 CLI: DeepFilterNet tar.gz or unpacked ONNX directory.
- 02-10 xblox: Enhance a recorded audio file.
- 28-09 CLI: Microsoft Store billing (pm-pics billing-ms).
- 28-09 CLI: Microsoft Store app license.
- 28-09 CLI: GET /api/billing/ms/health (public; shows mock flag and product ids).
- 28-09 CLI: POST /api/billing/ms/link — associate UserCollectionsId with your account.
- 28-09 CLI: POST /api/billing/ms/reconcile — grant credits and Pro entitlements.
- 28-09 Commands: Start the in-process Voice Command Center listen loop.
- 28-09 Commands: Start or stop the in-process Voice Command Center listen loop.
- 26-09 CLI: List built-in catalog aliases (GGUF + file models).
- 26-09 CLI: Search Hugging Face models by free text (not just org or owner/repo slugs).
- 26-09 CLI: PDF tools: inspect documents, rasterize pages, and extract Markdown.
- 26-09 CLI: Print page count and page sizes.
- 26-09 CLI: Rasterize pages to image files (all, ranges, or specific pages).
- 26-09 CLI: Extract document text to Markdown.
- 26-09 xblox: Generate a video from a prompt using the same core create_video API as `video create`.
- 25-09 CLI: MCP server from the tools cache.
- 25-09 CLI: Run a jq filter on a previous JSON result (stdin or --input).
- 24-09 Settings: Show &groups.
- 22-09 CLI: Manage the portable cloud storage key (.cloud_storage_key) used by --pmbackup and cloud sync.
- 22-09 CLI: Print the profile .cloud_storage_key path (no file I/O) and exit.
- 20-09 CLI: Generate an end-user keyboard shortcut reference: built-in app-command defaults.
- 18-09 CLI: One-shot Windows OS context snapshot (Explorer/Desktop/drag/invocation, optional MRU.
- 18-09 CLI: Find an installed program and its folder (same lookup as Settings → Directories).
- 16-09 The launcher: Open with, Show in folder, Copy path.
- 15-09 CLI: Consent surface for security-gated tools in this run:.
- 15-09 CLI: Target descriptor (ipc id) for --consent-ui owner routing.
- 11-09 CLI: Chat settings preset name or id; loads image_provider/image_model;.
- 10-09 xblox: Place scripted TTS from an SRT/VTT file or transcribe JSON onto a 48 kHz PCM timeline.
- 05-09 CLI: Route: trigger emits a mapping envelope; agent starts realtime voice.
- 05-09 CLI: Wet/dry mix for utterance enhancement: 0 = original, 1 = full filter.
- 30-08 CLI, xblox: Copy files or folders through the VFS queue (local, ssh://, ftp://, vfs://).
- 30-08 CLI, xblox: Move files or folders through the VFS queue (copy then delete source).
- 30-08 CLI: Create folders through the VFS queue (local, ssh://, ftp://, vfs://).
- 30-08 xblox: Create a new file with the Explorer New name for an extension (localized).
- 24-08 CLI: Search query (required for name / --llm; unused with --junk).
- 24-08 CLI: After matches: none | delete | recyclebin.
- 22-08 CLI: Compile and preview command schedules.
- 22-08 CLI: Parse commands.json schedules and print compiled definitions.
- 22-08 CLI: Preview the next planned occurrence(s) without persisting.
- 22-08 CLI: Emit due occurrences and persist scheduler state under config_dir.
- 22-08 CLI: Emit one occurrence for --schedule immediately and persist state.
- 22-08 CLI: Recompile commands.json into the local host and notify daemon peers.
- 16-08 xblox: Push a frame to the Pixlwiz virtual webcam (MF Frame Server).
