# LLM agent HTTP API

OpenAI-compatible HTTP surface for `tanit-cli llm agent --serve`.

The daemon owns the **agent tool loop**. Clients send `messages[]` (or document
ops) and read the final answer / SSE. They do **not** execute assistant
`tool_calls`. Request `tools[]` is ignored. Host apps attach tools by
registering an `IAgentToolProvider`, then naming it in `tanit.tool_providers`.

Default bind: `http://127.0.0.1:8090`.

```powershell
tanit-cli --no-gui llm agent --serve --host 127.0.0.1 --port 8090 `
  --concurrency 2 --preset quick --consent-ui auto-deny `
  --serve-api-key $env:TANIT_SERVE_API_KEY `
  --host-tool-provider opendesign=http://127.0.0.1:3727/api/agent-tools
```

`--host-tool-provider` is `id=url`, repeatable. Env:
`TANIT_HOST_TOOL_PROVIDER=id=url;id2=url2`. Provider URLs must be `http://` on
loopback (`127.0.0.1`, `localhost`, `::1`, or `127.*`).

Harness: `npm run test:llm-server` (loopback), `test:llm-server:each:live`,
`test:llm-server:decide:live`. CLI siblings: `test:llm:iterator`,
`test:llm:decide`.

---

## Route index

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/health` | no | Service + concurrency counters |
| GET | `/ready` | no | Liveness (`ready !== false`) |
| GET | `/v1/models` | no | Chat presets as OpenAI models |
| GET | `/v1/credit` | yes | PixlWiz budget |
| GET | `/v1/sysprobe` | yes | Host CPU/mem sample |
| POST | `/v1/chat/completions` | yes | Agent turn (stream or JSON) |
| POST | `/v1/chat/consent` | yes | Unblock `--consent-ui stream` security consent |
| POST | `/v1/chat/ask` | yes | Unblock `--consent-ui stream` `ask_user` |
| GET | `/v1/chat/events` | yes | SSE chat event hub |
| GET/POST | `/v1/chat/commands` (+ `/run`) | yes | Launcher catalog |
| GET | `/v1/chat/skills` | yes | Skills for a cwd |
| GET/POST/DELETE | `/v1/chat/session(s)` | yes | Session store |
| GET | `/v1/chat/recent-paths` | yes | Window layout paths |
| GET | `/v1/chat/xblox-artifacts` | yes | xblox artifact index |
| GET/POST | `/v1/chat/typeahead-presets`, `/search-names` | yes | Windows bookmarks |
| POST | `/v1/llm/path-tools/call` | yes | One builtin path tool |
| POST | `/v1/llm/each` | yes | jq leaf transform |
| POST | `/v1/llm/decide` | yes | System One decisions |
| GET/POST | `/v1/host-tool-providers` | yes | Loopback register/list |
| POST | `/v1/browser/page-model/rank` | yes | Loopback BM25 rank |
| POST | `/v1/speak` (+ stop/pause/resume) | yes | TTS path tool |
| POST/GET | `/v1/realtime/*` | yes | Voice session + SSE |
| POST | `/v1/ui/open`, `/v1/ui/open-file` | yes | Windows UI IPC |

`POST /v1/responses` is **not** mounted — use chat completions.

---

## Auth

When `--serve-api-key` or `TANIT_SERVE_API_KEY` is set, every `/v1/*` route
except `GET /v1/models` requires one of:

| Header | Value |
|--------|--------|
| `Authorization` | `Bearer <key>` |
| `x-api-key` or `api-key` | `<key>` |

`/health` and `/ready` stay open.

- **Non-loopback bind without a key is refused at startup.**
- Empty key on loopback is allowed for local dev and means **full desktop
  trust** (path tools, sessions, realtime, consent). Upstream hosts (e.g.
  pm-pics) should always set a serve key and forward **per-user provider
  credentials in the JSON body**. Never reuse the serve key as a model API key.

Missing or wrong key → HTTP **401**:

```json
{
  "error": {
    "message": "missing or invalid Authorization Bearer token",
    "type": "invalid_request_error",
    "code": "unauthorized",
    "param": null
  }
}
```

---

## Request headers the agent reads

| Header | Also in body | Effect |
|--------|--------------|--------|
| `X-Tanit-Cwd` | `cwd`, `tanit.cwd` | Working directory for path tools. Else process `--cwd`. With `--fs-jail`, FS / search / pictures / service hard-deny paths outside this cwd (`run` / MCP not jailed). |
| `X-Tanit-Session` | `session_id`, `tanit.session_id` | Agent memory id. Empty creates one. Echoed on the response. Not a Chrome broker token. |
| `X-Tanit-Provider-Key` | `apiKey` / `tanit.apiKey` | **Provider** credential (Zitadel JWT for LiteLLM spend). Not the serve API key. Highest priority wins: header → `tanit.*` → top-level → daemon defaults → `tanit-cli login` store. |
| `X-Tanit-Provider-Base-Url` | `baseUrl` / `tanit.baseUrl` | Provider base URL override (same priority). |

Non-stream completions also echo:

| Response header | JSON |
|-----------------|------|
| `X-Tanit-Queue-Wait-Ms` | `tanit.queue_wait_ms` |
| `X-Tanit-Exec-Ms` | `tanit.exec_ms` |
| `X-Tanit-Session` | `tanit.session_id` |

### Concurrency gate

`--concurrency` caps parallel agent turns / document jobs / path-tool calls.
Extra work **waits** (queue-block) until a gate waiter cap is hit, then the
server returns **503** with `code: "queue_full"` and `Retry-After: 1` instead of
parking every HTTP worker. A few workers stay reserved for consent / health /
control.

---

## `model` and `messages`

`model` is a **chat preset name** (`id` from `GET /v1/models`), not a raw
provider slug. Leading `[` or `@` is a loopback script (tests only).

`messages` is required and must contain a user turn with non-empty content.

- Leading `role: "system"` rows → system prompt (last wins). Content may be a
  string or OpenAI text parts (`{ "type": "text", "text": "…" }`).
- Last `role: "user"` → current prompt.
- User / assistant rows between → prior turns (`seed_chat_messages`).

```json
{
  "model": "quick",
  "stream": true,
  "messages": [
    { "role": "system", "content": "Reply in one sentence." },
    { "role": "user", "content": "Remember the codeword zebra-42." },
    { "role": "assistant", "content": "OK" },
    { "role": "user", "content": "What was the codeword?" }
  ],
  "tanit": {
    "session_id": "design-1",
    "cwd": "C:/work/app",
    "tool_providers": ["opendesign"],
    "selection": ["C:/work/app/.OpenDesign/uploads/photo.png"],
    "browser": {
      "currentUrl": "https://example.com",
      "currentTitle": "Example",
      "lastUrl": "https://example.com/prev",
      "tabs": [{ "url": "https://example.com", "title": "Example" }]
    }
  }
}
```

| `tanit` field | Effect |
|---------------|--------|
| `tool_providers` | Opt into providers already registered on the daemon |
| `selection` | Disk paths (Explorer filmstrip); fills empty `image_understand.paths` |
| `browser` | Active-tab metadata for child commands (`TANIT_CURRENT_URL`, …). Applied after the concurrency gate; cleared when omitted so requests do not inherit a prior URL |

Malformed chat bodies (missing `messages`, no user turn, empty user content) →
HTTP **400**, `code: "invalid_messages"` or `"invalid_json"`.

---

## Discovery and health

### `GET /health`

No auth.

```json
{
  "ok": true,
  "ready": true,
  "service": "tanit-llm-agent",
  "auth_required": true,
  "preset": "quick",
  "concurrency": {
    "limit": 2,
    "inflight": 0,
    "waiting": 0,
    "peak_inflight": 1,
    "peak_waiting": 0,
    "accepted": 4,
    "waited": 1,
    "rejected": 0,
    "max_waiting": 24,
    "policy": "queue-block"
  }
}
```

On Windows, when a perf sample exists: `hostWsMb`, `hostCpu`, `sysCpu`, `sysMem`.

### `GET /ready`

No auth. Liveness probe (`ready !== false`).

```json
{ "ok": true, "ready": true, "inflight": 0, "waiting": 0, "limit": 2 }
```

### `GET /v1/models`

No auth. OpenAI list shape; each row is a saved chat preset.

```json
{
  "object": "list",
  "data": [
    {
      "id": "quick",
      "object": "model",
      "created": 1710000000,
      "owned_by": "tanit",
      "tanit_preset_id": "quick",
      "tanit_is_default": true
    }
  ]
}
```

No presets → one row, `id: "default"`.

### `GET /v1/credit`

PixlWiz budget for the signed-in user. HTTP 200 even when signed out.

```json
{ "ok": true, "data": { "spend": 1.2, "max_budget": 20 } }
```

`max_budget` is `null` when unlimited. Signed out:
`{ "ok": false, "error": "not signed in" }`.

### `GET /v1/sysprobe`

`pm::perf::sample()`. Query `mode=last` or `mode=peek` returns the previous
sample without moving CPU deltas. A full sample adds peak fields and
`sampleMode`. Not built on Linux → HTTP **501**, `code: "sysprobe_unsupported"`.

---

## `POST /v1/chat/completions`

The agent turn. Non-stream → one JSON object. `stream: true` → SSE.

### Non-stream (HTTP 200)

```json
{
  "id": "chatcmpl-tanit-1710000000000",
  "object": "chat.completion",
  "created": 1710000000,
  "model": "quick",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "3" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0 },
  "tanit": { "queue_wait_ms": 0, "exec_ms": 840, "session_id": "design-1" }
}
```

### Stream

`Content-Type: text/event-stream`. Headers include `X-Tanit-Session` and
`X-Tanit-Queue-Wait-Ms`.

Text deltas are unnamed SSE data lines (OpenAI chunks). First delta carries
`role`; later deltas carry `content` only.

Named Tanit events (`event:` line; OpenAI SDKs ignore the name):

```text
event: tanit.thinking
data: {"object":"tanit.event","type":"thinking","model":"quick","text":"…"}

event: tanit.tool_call
data: {"object":"tanit.event","type":"tool_call","model":"quick","name":"design_update","text":"design_update","id":"call_1"}

event: tanit.tool_result
data: {"object":"tanit.event","type":"tool_result","model":"quick","name":"design_update","text":"ok","id":"call_1","duration_ms":40,"path":"C:/…/out.png"}

event: tanit.tool_file_progress
data: {"object":"tanit.event","type":"tool_file_progress","model":"quick","name":"run"}
```

`path` is set when a successful envelope has `output_path`
(`image_transform` / `image_create`). `tanit.tool_file_progress` is for `run`
and `download_url` only.

With `--consent-ui stream`:

```text
event: tanit.consent
data: {"object":"tanit.event","type":"consent","reqId":"…","title":"…","risk":"low","tool":"…","action":"…","resource":"…","choices":["allow","deny"]}

event: tanit.consent.dismiss

event: tanit.ask
data: {"object":"tanit.event","type":"ask","reqId":"ask-…","kind":"choice","question":"…","options":["…"],"placeholder":"","multiline":false}
```

Security consent blocks until `POST /v1/chat/consent`. `ask_user` blocks until
`POST /v1/chat/ask` with the same `reqId` (and `stoppedBy` / answer fields).

Stream ends with a stop chunk (`finish_reason`, usually `"stop"`, plus
`tanit.queue_wait_ms` / `exec_ms` / `session_id` / stream stats / `usage`), then:

```text
data: [DONE]
```

Failed turn → SSE `data:` error object, then `[DONE]`.

### Errors

| HTTP | When |
|------|------|
| 400 | Not JSON, bad/empty `messages`, empty user content (`invalid_json` / `invalid_messages`) |
| 503 | Turn queue full (`queue_full`) |
| 500 | Agent turn failed (`agent_error`) |

```json
{
  "error": {
    "message": "chat preset not found: quick",
    "type": "server_error",
    "code": "agent_error",
    "param": null
  }
}
```

---

## `POST /v1/chat/consent`

Unblocks a `--consent-ui stream` security consent card. HTTP 200 `{ "ok": true }`.

Send the card body (`decision` `allow` / `deny` / `settings`, plus `lifetime`,
`scope` / `scopes`, `aiDelegated`, `sandboxBackend`). `settings` is stored as
deny.

```json
{ "cancel": true }
```

Denies every consent still waiting. Invalid JSON → HTTP 200
`{ "ok": false, "error": "invalid JSON body" }`.

## `POST /v1/chat/ask`

Unblocks a `--consent-ui stream` `ask_user` tool call. HTTP 200 `{ "ok": true }`.

Body matches the chat-panel `askUserReply` IPC shape:

```json
{
  "reqId": "ask-…",
  "stoppedBy": "submitted",
  "kind": "choice",
  "index": 0
}
```

`stoppedBy`: `submitted` | `default` | `cancelled` | `timeout` | `error`.
Answer fields by kind: `text` (string), `index` (choice), `indices` (multi_choice),
`bool` (confirm). `{ "cancel": true }` cancels every pending ask.

---

## Path tools

### `POST /v1/llm/path-tools/call`

Runs one builtin path tool in the request cwd. Does **not** start an agent turn.
Honors the same daemon policy as completions:

- `--no-tools` → HTTP **403**, `code: "tools_disabled"`
- `--enable-tools` allowlist → HTTP **403**, `code: "tool_not_allowed"` when the
  name is outside the list
- `--disable-tools` blocklist applied around the execute call
- Shares the concurrency gate (503 `queue_full` when full)

```json
{
  "name": "image_understand",
  "arguments": { "paths": ["C:/photo.png"], "prompt": "Describe this." }
}
```

HTTP 200 → tool envelope. HTTP 400 when `name` is missing (`missing_name`) or
the body is not JSON (`invalid_json`).

---

## JSON document ops

Same engines as `tanit-cli llm agent each` and `llm agent decide`. CamelCase and
snake_case keys both accepted. Prefer inline `document` / `questions` when the
caller already holds JSON; relative file paths resolve against `X-Tanit-Cwd` /
`cwd` / the daemon `--cwd`.

### Provider credentials

Omit `apiKey` / `baseUrl` to inherit the serve process defaults
(`--api-key`, `--base-url`, preset). **If the request sets a foreign `baseUrl`
and omits `apiKey`, the daemon does not attach its key** (avoids credential
exfiltration to a caller-chosen host). Upstream apps should pass the end-user’s
provider key explicitly when redirecting.

Requires `FEATURE_JQ`.

CLI walkthroughs: [each examples](../cli/llm_agent_each_examples.md),
[decide examples](../cli/llm_agent_decide_examples.md).

### `POST /v1/llm/each`

Transform jq-selected string leaves.

| Field | Required | Notes |
|-------|----------|-------|
| `document` / `doc` or `source` | yes | Inline JSON or file path |
| `selector` / `path` | yes | jq leaf picker |
| `prompt` | unless `dryRun` | Shaped as `<prompt>\n\nText to transform: "…"` |
| `target` / `as` | no | Sibling key (omit = in-place) |
| `mergeJson` | no | LLM returns a JSON object; hard-merge onto parent |
| `mergeKeys` | no | Required non-empty string keys before merge |
| `dst` / `output` | no | Write mutated document |
| `dryRun` | no | Offline transformers: `upper` / `prefix` / `identity` / `llm-stub` / `json-stub` |
| `transform`, `prefix` | no | Dry-run transformer |
| `concurrency`, `throttleMs`, `maxRetries` | no | 0 = auto |
| `noCache`, `partialCommit`, `abortAfterConsecutiveErrors` | no | |
| `preset`, `router`, `model`, `apiKey`, `baseUrl`, `apiMode`, `timeoutMs`, `systemPrompt`, `cwd` | no | Provider / path overrides |

```json
{
  "document": {
    "ribbon": { "groups": [{ "items": [{ "label": "Home" }] }] }
  },
  "selector": ".ribbon.groups[].items[].label",
  "mergeJson": true,
  "prompt": "Reply with ONLY a JSON object: {\"label_de\":\"…\",\"label_es\":\"…\"}",
  "concurrency": 4
}
```

HTTP **200** body matches CLI `--json` (`ok`, stats, `output`, `timingsMs`, …).

| HTTP | `code` |
|------|--------|
| 400 | `invalid_json`, `invalid_each_options`, or `each_error` (missing selector/prompt, bad file, …) |
| 503 | `queue_full` |
| 500 | `each_error` (runtime failure after a valid setup) |

### `POST /v1/llm/decide`

System One questions (`choice` / `noul` / `score`) on a document or selected
values.

| Field | Required | Notes |
|-------|----------|-------|
| `document` / `doc` or `source` | yes | |
| `questions` object or `questionsFile` | yes | Inline object, or path / string path in `questions` |
| picker | no | Omit = whole document as one state. Exactly one of: `selector`, `pairs`, or `left`+`right` |
| `leftKey` / `rightKey` | no | Pair field names (default `left` / `right`) |
| `target` | no | Answer key (default `decisions`) |
| `chunk` | no | Max expanded questions per request (default 32) |
| `maxTokens` | no | Estimated body ceiling (default 24000) |
| `dst`, `dryRun`, `provider`, `model`, `apiKey`, `baseUrl`, `timeoutMs`, `cwd` | no | |

```json
{
  "document": {
    "items": [
      { "id": "a", "left": "apple", "right": "apple" },
      { "id": "b", "left": "apple", "right": "orange" }
    ]
  },
  "questions": {
    "same": {
      "type": "noul",
      "instructions": "Does `pair.left` equal `pair.right`?"
    }
  },
  "pairs": ".items[]",
  "dryRun": true
}
```

HTTP **200** matches CLI `--json` (`ok`, `provider`, `pairs`, `requests`,
`expandedQuestions`, `usage`, `output`, …).

| HTTP | `code` |
|------|--------|
| 400 | `invalid_json`, `invalid_decide_options`, or `decide_error` |
| 503 | `queue_full` |
| 500 | `decide_error` |

Instructions name `` `item` `` / `` `item.field` `` for `--selector`, and
`` `pair.left` `` / `` `pair.right` `` / `` `pair` `` for pairs.

---

## Host tool providers

Registration is trusted. `GET` / `POST /v1/host-tool-providers` are
**loopback-only** (HTTP 403 otherwise) and still require the serve API key.

### `GET /v1/host-tool-providers`

```json
{ "providers": [{ "id": "opendesign", "name": "OpenDesign" }] }
```

### `POST /v1/host-tool-providers`

```json
{ "id": "opendesign", "url": "http://127.0.0.1:3727/api/agent-tools", "token": "optional" }
```

`token` is used on outbound calls (`X-Tanit-Session` to the provider). A `token`
query already on `url` is stripped from the response and logs.

HTTP 400 when `id` / `url` is missing or the URL is not loopback `http`.

Opt in per turn:

```json
"tanit": { "tool_providers": ["opendesign"] }
```

### What Tanit calls on that URL

Base URL = catalog. Tanit appends `/context` and `/call`.

| Call | Purpose |
|------|---------|
| `GET {base}` | Catalog (cached ~5s) |
| `GET {base}/context` | Short prompt injected into the turn |
| `POST {base}/call` | Run one tool (60s read timeout) |

Catalog:

```json
{
  "id": "opendesign",
  "name": "OpenDesign",
  "tools": [
    {
      "name": "design_update",
      "description": "…",
      "parameters": { "type": "object", "properties": {}, "required": [] }
    }
  ]
}
```

Context: `{ "prompt": "…" }` or `{ "context": "…" }` (or raw text). Failure →
empty prompt; the turn continues.

Call body:

```json
{
  "name": "design_update",
  "arguments": { "design": "hero", "page": 1 },
  "context": { "session_id": "design-1", "cwd": "C:/work/app", "extra": {} }
}
```

JSON response = tool envelope. Non-JSON / non-2xx fails the tool.

---

## OpenDesign `/api/agent-tools`

Provider routes Tanit calls outbound (not Tanit daemon routes). Mounted by
OpenDesign `mountAgentTools`.

| Method | Path | Caller |
|--------|------|--------|
| GET | `/api/agent-tools` | Tanit catalog |
| GET | `/api/agent-tools/context` | Tanit, once per turn |
| POST | `/api/agent-tools/call` | Tanit `invoke` |
| PUT | `/api/agent-tools/session` | Editor, before a chat turn |
| POST | `/api/agent-tools/apply-media` | Editor, after `image_transform` / `image_create` |

OpenDesign’s LLM proxy strips the browser `Authorization` / `x-api-key`, injects
`OPEND_LLM_KEY` when set, and maps `/api/llm/*` → daemon paths (prefix removed).
`POST /api/path-tools/call` → `POST /v1/llm/path-tools/call`.

### `PUT /api/agent-tools/session`

Heartbeat for the next `context` / `call` (not read by Tanit itself).

```json
{
  "design": "hero",
  "page": 1,
  "selectionIds": ["hero.title"],
  "selectionCount": 1,
  "projectRoot": "C:/work/app",
  "attachments": [{ "src": "uploads/photo.png", "name": "photo.png" }],
  "screenshotPath": "C:/work/app/.OpenDesign/shot.jpg"
}
```

### `POST /api/agent-tools/apply-media`

Editor-only. Writes tool output onto the selected canvas image.

```json
{
  "name": "image_transform",
  "arguments": {},
  "result": { "output_path": "C:/work/app/.OpenDesign/out.png" }
}
```

---

## Chat catalog

HTTP 200 `{ "ok": true, "data": … }` or `{ "ok": false, "error": "…" }` unless
noted. Require the serve API key.

| Method | Path | Body / query | `data` |
|--------|------|--------------|--------|
| GET | `/v1/chat/commands` | | Launcher command catalog |
| POST | `/v1/chat/commands/run` | `{ "id", "sender"? }` | See below |
| GET | `/v1/chat/skills` | `?cwd=` | Skills visible from that directory |
| GET | `/v1/chat/recent-paths` | | `{ files, folders }` (empty off Windows) |
| GET | `/v1/chat/xblox-artifacts` | `?limit=` | `{ version, items }` |
| GET | `/v1/chat/sessions` | | `{ sessions }` |
| POST | `/v1/chat/sessions` | session object, `id` required | `{ "ok": true }` |
| GET | `/v1/chat/session` | `?id=` | `{ session }` |
| DELETE | `/v1/chat/session` | `?id=` | `{ "ok": true, "removed": true }` |
| GET | `/v1/chat/events` | `?sender=` `&after=<id>` | SSE (below) |

`POST /v1/chat/commands/run`:

- Variable: `{ "ok": true, "data": { "kind": "variable", "id", "active" } }`
- Process: `{ "ok": true, "data": { "kind": "process", "id", "runId", "status": "started" } }`
- Needs desktop window: `{ "ok": false, "needsUi": true, "error", "id" }`

`GET /v1/chat/events` is `text/event-stream`. Each event:

```text
data: {"id":1,"ts":1710000000,"method":"…","args":[…]}

```

`after` skips events with `id <= after`. `sender` filters visibility. Idle
streams send `: keepalive` about every 15s. Omitting `sender` returns every
event — treat one API key as access to all desktop chat state.

Windows only:

| Method | Path |
|--------|------|
| GET | `/v1/chat/typeahead-presets` |
| POST | `/v1/chat/search-names` |
| POST | `/v1/ui/open` — `{ "section": "chat" }` |
| POST | `/v1/ui/open-file` — `{ "path", "paths"?, "fullscreen"? }` |

---

## Speak

| Method | Path | Body |
|--------|------|------|
| POST | `/v1/speak` | `{ "text" }` → runs the `speak` path tool |
| POST | `/v1/speak/stop` | |
| POST | `/v1/speak/pause` | |
| POST | `/v1/speak/resume` | |

Responses: `{ "ok": true }` or `{ "ok": false, "error" }`.

---

## Realtime voice

| Method | Path | Body |
|--------|------|------|
| POST | `/v1/realtime/start` | `{ "preset", "chat_session_id", "mic_send", "voice"?, "instructions"?, "acquire_timeout_ms"? }` |
| POST | `/v1/realtime/stop` | |
| POST | `/v1/realtime/ptt` | `{ "held": true, "finishInputTurn": false }` |
| GET | `/v1/realtime/events` | SSE |

`start` returns `{ "ok": true }` immediately and opens the session on a
background thread. A newer `start` closes the previous stream and bumps the
epoch. `GET /v1/realtime/events` follows the latest epoch:

```text
data: {"method":"realtimeTextDelta","args":["hello"]}
```

Method names match the chat panel (`realtimeTextDelta`, `consentRequest`,
`dismissConsent`, `realtimeError`, …). Keepalive `: keepalive` ~15s.
`stop` / `ptt` → `{ "ok": true }` (ptt is a no-op when nothing is live).

One global realtime session — any authorized caller can replace, stop, or
subscribe.

---

## Browser rank (loopback)

### `POST /v1/browser/page-model/rank`

BM25 over a page model the caller already holds. Does not open a tab.
**Loopback only** (HTTP 403 otherwise). Feature missing / bad input → HTTP 200
`{ "ok": false, "error" }`.

```json
{ "query": "sign in", "model": { "zones": [] }, "topK": 5 }
```

`model` may also be `data.model`. `topK` is clamped to 1…16 (default 5).

```json
{ "ok": true, "data": { "rankedZones": [], "zoneCount": 0, "topK": 5 } }
```

---

## Error shapes

OpenAI-style helper (auth, completions, path tools, each/decide setup, sysprobe,
loopback 403):

```json
{
  "error": {
    "message": "…",
    "type": "server_error",
    "code": "agent_error",
    "param": null
  }
}
```

Common `code` values: `unauthorized`, `invalid_json`, `invalid_messages`,
`invalid_each_options`, `invalid_decide_options`, `each_error`, `decide_error`,
`missing_name`, `tools_disabled`, `tool_not_allowed`, `queue_full`,
`sysprobe_unsupported`, `agent_error`.

Catalog / session / speak routes often use `{ "ok": false, "error": "…" }` at
HTTP 200 instead.

---

## Trust model (for host apps)

One serve API key unlocks chat, path tools, sessions, events, realtime, and
consent for whoever can reach the listener. That is intentional for a single
trusted desktop client or a backend (pm-pics) that already authenticated the
user.

Recommended host pattern:

1. Bind loopback (or TLS + non-loopback only with a strong `--serve-api-key`).
2. Authenticate end users in the host app.
3. Forward per-user **provider** credentials in each JSON body (`apiKey` /
   router fields) — never as the serve bearer.
4. Set `X-Tanit-Cwd` / `tanit.session_id` per user/workspace.
5. Prefer `--fs-jail` so path tools cannot leave that cwd (pm-pics daemon default).
6. Prefer `--consent-ui auto-deny` (or stream + host UI) in automated hosts.
