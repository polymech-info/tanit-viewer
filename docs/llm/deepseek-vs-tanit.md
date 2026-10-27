---
title: DeepSeek Harness vs Tanit AI
slug: deepseek-vs-tanit
description: Engineering comparison of DeepSeek Harness (dsh) and Tanit AI — product shape, memory/context, governance, and which testing patterns are worth borrowing.
tags: [tanit, llm, agent, deepseek, harness, comparison, testing]
category-id: [knowlede-base]
private: true
hidden: true
---

<!-- markdownlint-disable MD025 -->

# DeepSeek Harness vs Tanit AI

Internal reference. DeepSeek Harness (`dsh`) was checked out under
`ref/deepseek-harness` (gitignored). Version noted at install:
**0.2.1-rc.3** (developer preview; breaking changes expected).

| | **Tanit AI** | **DeepSeek Harness (`dsh`)** |
|:--|:--|:--|
| **What it is** | Windows workspace product with AI beside files, media, devices, workflows | Open-source agent harness (“everything is a plugin”) on Cordis |
| **Audience** | End users, partners, schools, shops, labs, MSPs | Engineers composing coding-style agents |
| **Primary job** | Usable AI in more places, governed, repeatable | Plugin-composed agent loop for builders |
| **Closest cousin** | Managed Windows workbench + local multimodal stack | Open Cursor / Claude-Code–class harness |
| **Upstream** | — | <https://github.com/deepseek-ai/deepseek-harness> |
| **Docs** | This tree (`feature-ai`, chat, memory, GPO, …) | <https://deepseek-harness.github.io/deepseek-harness/> |

---

## Product shape

| Aspect | Tanit | DeepSeek Harness |
|:--|:--|:--|
| Surfaces | Chat, `tanit-cli`, XBlox (`llmAgent`) — same preset/policy | Web, headless, SDK, ACP, desktop (Electron) |
| Runtime | Compiled C++ core; WebView presentation; policy-checked bridge | Node / TypeScript monorepo; Electron wraps Node host |
| Local AI | llama.cpp GGUF, whisper.cpp, ONNX media, HF install | Not a local-inference product; LLM via adapters |
| Shared host | `tanit-cli llm agent --serve` (OpenAI-compatible LAN) | Not the same product pitch |
| Environment | Windows: files, cameras, Modbus/MQTT, GPO/Intune | Dev machine / server; FS/shell/browser/computer-use as plugins |
| Extensibility | Presets, tools, MCP, skills, GPO | Profiles + bundles + YAML patches; `dsh-plugin` topic |
| Maturity pitch | Deployable installer, inventoryable deps | Developer preview; compatibility breaks expected |

---

## Overlap (conceptual cousins)

| Concern | Tanit | DeepSeek Harness |
|:--|:--|:--|
| Agent loop + tools | Yes | Yes (`core/agent`, `core/agent-loop`, `core/tools`) |
| Presets / composition | Named presets (models, planner, tools, MCP, skills) | Profiles + bundles + `cordis.patch.yml` |
| Approvals / sandbox | Security gateway, consent, AppContainer / LPAC | Approval policy, sandbox seams |
| Multi-provider LLM | Local + cloud + custom, **per capability** | Adapters on `ctx.llm` (DeepSeek-first, extensible) |
| MCP / skills | Built-in | Plugin ecosystem |
| Multi-surface same agent | Chat / CLI / XBlox | Web / headless / SDK / ACP |

---

## Divergence (where they are not the same product)

| | Tanit | DeepSeek Harness |
|:--|:--|:--|
| Governance | Light / Strict / Developer; ADMX; encrypt-at-rest; school/MSP | Plugin sandbox + approvals; not Windows enterprise policy |
| Media / plant I/O | Vision, STT/TTS, camera, Modbus, MQTT in same flow | Coding/dev tools; CUA / browser-use experimental |
| Node in product | Explicitly none (not Electron for seats) | Node is the product runtime |
| Long-term memory | First-class Agent Memory (evidence + recall) | Optional MCP memory servers; not in base composition |
| Verticals | Everyday work, accessibility, education, care, science, manufacturing | Coding agents and harness consumers |

---

## Memory, context, compaction

Tanit’s memory model is **stronger as a product**. dsh optimizes **in-session
context pressure** for long coding chats.

| Concern | Tanit | DeepSeek Harness |
|:--|:--|:--|
| Cross-session memory | Evidence + observations + checkpoints + hybrid recall + `memory_find` | Opt-in MCP (e.g. reference memory, Memorix, Engram) |
| Exact recovery | Explicit: body/payload behind item ids | Full session log kept; compaction changes *model surface*, not delete archive |
| Active prompt | Bounded inject lines from retrieval | Derived from session surface + system prompt + tools |
| Large history | Memory layers avoid replaying everything | **Compaction**: prune tool results → summarize oldest span → retain recent ~16% |
| Workspace guidance | Skills / prompts / presets | `AGENTS.md` / `CLAUDE.md` chains with byte budgets |
| Cross-chat cite | Search past chats via memory | `@session` → bounded untrusted snapshot (+ spill of omitted text) |
| Hard rule | Evidence wins over summary | **Model-visible means logged** (injectables are durable events) |

### dsh context architecture (short)

1. Append-only **session event log** is truth.
2. Model messages = **surface projection** (`deriveMessages()`), not a separate store.
3. System prompt assembles into **`system/message`** history nodes (node 0 protected from compact).
4. Runtime facts (cwd, time, …) = digest-gated **`user/message`** snapshots.
5. Compaction: log-only `compaction/*` + one `surfaceOp: replace` with `<compacted-summary>`; tool pairs stay balanced; optional image offload / tool-result pruner.
6. Spill: oversized tool (or truncated session-ref) text → locator + retrieval hint.

### Worth stealing vs skip (for Tanit seats)

| Idea | Port? | Why |
|:--|:--|:--|
| Evidence / observation / RRF memory | **Keep Tanit’s** | Ahead of dsh |
| Prune → structured compact → retain tail | Only if coding / multi-hour autonomous agents | Average convert/OCR/voice jobs rarely hit window thrash |
| Model-switch pressure check | Optional | Useful if small local + large cloud share one chat |
| Session cite + spill | Optional complement | “That other thread” without merging memory systems |
| AGENTS.md chain budgets | If workspace instruction packs grow | Skills may already cover enough |
| Cordis everything-is-a-plugin | No | Wrong shape for C++ gateway product |
| Default 65k headroom / coding AGENTS focus | No | Tune for GGUF windows and Windows workspace |

**Average-user verdict:** dsh compaction/surface/log patterns are mostly
**coding-agent infrastructure**. For file conversion, voice, accessibility,
shop/lab flows: presets, routing, security gateway, and Tanit Agent Memory
matter more than `/compact`.

---

## Security and policy

| Aspect | Tanit | DeepSeek Harness |
|:--|:--|:--|
| Decision model | Model proposes → gateway allow / deny / ask | Tool pipeline + approval plugins |
| Profiles | Light, Strict, Developer; exportable grants | Profile YAML composition |
| Consent | Win32 dialog or Chat card; optional advisory model | Approval policy seams |
| Org lock | GPO / Intune / ADMX; HKLM not lowerable by user | Process / plugin policy, not ADMX |
| Sandbox | AppContainer / LPAC | `ctx.sandbox` backends |

---

## Local checkout / smoke (reference)

Under `ref/deepseek-harness` (ignored by git):

1. Shallow clone → `pnpm@11.28.5` install → `pnpm run build` (10 gates).
2. CLI: `pnpm dsh --version` → `0.2.1-rc.3`.
3. Web: `pnpm dsh web --no-open` → `http://127.0.0.1:3080/?token=…` (401 without token; 200 with).
4. Sample unit: `packages/util` — mostly pass; one Windows Shell COM association failure observed in agent environment.

---

## Testing and benchmarks (dsh)

Policy hub: `ref/deepseek-harness/docs/testing.md`. Root `BENCHMARK.md` only
points at the Python SDK for external tasks.

### Enumerated suites / lanes

1. **Unit** — `pnpm run test` / Vitest; package specs.
2. **Coverage** — per-file 100% on many `packages/*/*/src` (correctness of “line ran,” not UX quality).
3. **Real-API e2e** — `test:e2e`; live providers; suites **self-skip** without keys.
4. **Owner-local expected output** — `test:expected`; `*.expected.e2e.ts` CLI/process goldens without full session corpus.
5. **Recorded-session snapshot (replay)** — `test:snapshot`; `DSH_SNAPSHOT=replay|record|refresh`; fixtures under `snapshots/{session,sdk,acp,web}/`.
6. **Snapshot corpus policy** — format-generation / migration coverage over the snapshot tree.
7. **Web browser lane** — `test:web` / `test:web:ci`; Playwright; ARIA `*.expected.md`; CI forces replay-only.
8. **CI performance benchmarks** — `test:bench`; `benchmarks/**/*.bench.ts`; serial workers; median time + peak RSS budgets.
9. **Bench scaling report** — `benchmarks/.dsh-report/report.html`; machine-profile rescale (diagnostic).
10. **Memory-pressure bench** — `test:bench:memory 4g|8g`; Linux cgroup v2, swapless; same budgets.
11. **Web perf (manual)** — `test:web:perf`; GC / long-history diagnostics.
12. **Web stress (opt-in)** — `test:web:stress`; extreme chunk-rate stalls.
13. **GUI subset** — `test:gui` (client + host packages).
14. **Built-artifact / entry smokes** — plain `node` on built `lib/` / bins.
15. **Static / hygiene** — lint, docs, module graph, Cordis config, i18n, publint, many `verify-*`.
16. **Gate DAG** — `scripts/run-gates.ts` (`check:ci`, `check:all`, platform modes).
17. **Windows CI modes** — blocking (build/docs-ish) vs complete / observational.
18. **NPM resolution micro-benchmarks** — tooling install graph; not product UX.

### Benchmark directories (user-path gates)

1. `benchmarks/session-open/` — cold open, migration, first history, resume; time + heap.
2. `benchmarks/session-corpus/` — list / search / fork at large synthetic corpus.
3. `benchmarks/session-corpus/projection-list` — list-query responsiveness.
4. `benchmarks/agent-continuation/` — long-history request, tool continuation, fork-child discovery.
5. `benchmarks/terminal-io/` — terminal chunking must not full-rescan.
6. `benchmarks/user-text/` — sent text + credential-matcher time/allocation.
7. `benchmarks/conversation-fold/` — client history fold + tool prep.
8. `benchmarks/long-session-browser/` — Chromium open / page / continue on synthetic long history.
9. `benchmarks/active-stream-reconnect/` — reconnect during large active stream.

### Snapshot / replay mechanics (names)

1. `packages/test-support/llm-replay` — keyless model stream replay from session JSONL.
2. `packages/test-support/session-snapshot` — shared storage rules, profile adapters, normalization tokens.
3. `snapshot.yml` per scenario — profile, composition, recording policy, workspace facts.
4. Sidecars — e.g. system-prompt / tool-schemas expected; `workspace.expected/` for file effects; `replay.override.json` for failures/cancel/hangs.
5. Rule: model-visible change → update a recorded scenario in the same PR; CI never record/refresh.

### Perf discipline (patterns, not cases)

1. Organize benches by **user path**, not package tree.
2. Synthetic fixtures only — no recorded user Sessions, no network in CI benches.
3. Fresh child process + private temp root per sample; serial file execution.
4. Reviewed constant budgets — env must not override; reference machine → CI scale + headroom (`calibration.ts`: e.g. 2× scale, 1.25× headroom).
5. Record wall medians + peak RSS before assert; HTML report for humans.
6. Memory-pressure: **same** scenarios under hard RAM cap (dsh: Linux cgroup; Tanit would need Windows Job Object or equivalent).

---

## What is worth porting to Tanit

Ranked for **conversions + chat + local/cloud**, not coding-agent depth.

| Rank | Pattern | Use for Tanit | Skip / defer |
|:--|:--|:--|:--|
| 1 | Keyless **LLM replay + golden runs** (record / replay / refresh) | Chat turn + tools, resume, agent-driven convert; assert files/consent/memory shape | Full `snapshots/session` coding corpus |
| 2 | **Few user-path perf budgets** (median of N) | Open chat with N turns; batch-convert M files; LAN `--serve` with C seats | Agent-continuation, terminal-io, 3k-session fork |
| 3 | **Memory-pressure** on 4/8 GB | Thin lab seats / shared host | Linux-only cgroup script as-is |
| 4 | **Gate aggregate** (`check:ci` DAG) | unit → replay snapshots → optional bench → `tanit.exe` smoke | Cordis / plugin-graph theater |
| 5 | Narrow **UI goldens** + self-skipping **live API** smokes | Composer / streaming / error; nightly provider smoke | Full web snapshot tree |

### Still Tanit’s own (not in dsh)

1. Conversion **quality** matrix (formats, corrupt input, VRAM OOM).
2. Local GGUF / whisper **latency and failure** under policy.
3. Agent Memory **recall quality** (hybrid retrieval / evidence recovery).
4. GPO / consent / sandbox **policy regression** for managed seats.

### Coding-agent noise (low priority unless productized)

1. Subagent / fork / schedule / PTC / office / landlock snapshot corpora.
2. ACP automation protocol suite.
3. SDK TypeScript / Python single-exe snapshot parity.
4. AGENTS.md instruction-chain e2e depth.
5. npm-resolution and Cordis composition verifiers.

---

## Related Tanit docs

- [Tanit AI](../features/feature-ai.md)
- [Tanit Chat](./feature-chat.md)
- [Agent Memory](./feature-agent-memory.md)
- [Chat settings](./settings-chat.md)
