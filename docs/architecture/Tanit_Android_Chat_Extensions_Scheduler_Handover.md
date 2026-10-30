# Tanit Android — chat extensions, scheduler runs, and transcript delivery

Implementation handover · 30 October 2026

## Decision

Split chat into a durable runtime, a transcript projection, and Compose presentation. Treat scheduled ticks and delegated sub-agents as independently identified runs. They publish typed events through a host-owned API; they never mutate a screen's message list.

Use compiled-in Kotlin feature registrations and narrow native adapters initially. Keep the existing shared C++ scheduler and agent runtime. No downloaded plugin loader, general-purpose event bus, or rewrite of scheduling in Kotlin is required.

The scheduler contributes in two distinct ways:

1. **Runtime:** create/disable schedules, launch runs, persist outcomes, publish events.
2. **UI:** task list, run cards, result renderers, settings, and commands such as Open task / Stop run / Disable schedule.

The host owns delivery, transcript identity, resource arbitration, and conversation routing. Removing a UI contribution must not lose a result or stop the runtime.

## Evidence and current limitations

Reviewed inputs:

- `Pasted text(20261030-082144).txt`: approximately 1,580-line `ChatScreen` implementation.
- `Pasted text(20261030-082940).txt`: Android scheduler implementation notes, including source paths and open work.

This is an architectural handover based on those inputs, not a compiled patch or audit of the referenced C++ sources.

The scheduler notes contradict themselves: the introduction and execution description say no tick transcript row is shipped and the native event callback is null; a checked item under Open says a schedule poll now appends replies/errors, excluding results present at initial load. The supplied `ChatScreen` refreshes enabled-task UI, but shows no tick-result ingestion. Verify the actual branch before editing. Do not assume either statement establishes current delivery behavior.

Documented existing semantics to preserve during the first refactor:

| Area | Current documented behavior |
|---|---|
| Execution | In-process C++ thread; one due task runs to completion at a time |
| Startup | Chat initialization starts scheduler; startup is idempotent |
| Lifetime | Scheduler survives activity destruction; process death stops execution |
| Repeats | Fixed delay from completion; overdue runs execute once, missed intervals are not replayed |
| One-shots | Disabled after one attempt, including failure |
| Attempt limit | Failed turns count toward `max_runs` |
| Results | `tick_result` with `ok`, `final_text`, `error`; task retains last 50 events |
| Agent context | Last 10 task events and task memory; task ID is used for scheduled execution |
| Provider | Rebuilt from current chat settings/credentials per tick; planner remains off |
| Camera feedback | `PhoneHost.captureCountdown` is a separate UI side channel |
| Current tests | Persistence/tool round-trip; no due-tick execution or result-delivery coverage |

## 1. Separate the identities

Do not overload the task ID as the transcript session or run ID.

| Identifier | Meaning |
|---|---|
| `profileId` | Stable profile scope, resolved by the host to its storage directory |
| `conversationId` | Destination conversation; may be absent for standalone tasks |
| `taskId` | Existing user-facing schedule ID; retain for compatibility |
| `taskInstanceId` | Immutable identity for this task incarnation, independent of a reusable slug |
| `runId` | Unique execution attempt: one tick or one delegated agent execution |
| `rootRunId` | Root of the execution tree |
| `parentRunId` | Direct parent for a delegated sub-agent; absent for standalone roots |
| `originRunId` | Run that originally created the schedule; provenance, not cancellation ownership |
| `messageId` / `toolCallId` | Stable identities inside a run |
| `eventId` / `runSequence` | Deduplication and ordering |

A recurring schedule produces a new root run for each tick. Its sub-agents reference that tick as their root. The chat turn that created the schedule may be long finished and is not the parent whose cancellation controls future ticks.

Add these optional fields to schedule records with backward-compatible loading:

```json
{
  "schema_version": 2,
  "task_instance_id": "opaque-stable-id",
  "origin_conversation_id": "conversation-id-or-null",
  "origin_run_id": "creating-run-id-or-null",
  "delivery": {
    "target": "origin_conversation",
    "presentation": "grouped_runs",
    "context_policy": "explicit_only"
  },
  "execution_binding": {
    "mode": "follow_current_settings"
  }
}
```

The host injects provenance from the tool execution context. Do not ask the model to choose arbitrary conversation/profile IDs. Legacy tasks without an origin go to a task Activity inbox until explicitly linked; never bind them to the chat visible at startup.

Retain current provider selection initially using `follow_current_settings`. A future pinned connection/preset policy should be explicit. Snapshot the resolved configuration at run start and record non-secret identifiers for diagnosis; do not persist bearer tokens in events.

## 2. Host-owned event API

Use a small versioned envelope across C++/JNI/Kotlin. JSON is adequate for the first bridge; Kotlin and C++ should decode it into typed structures at their boundaries. Do not expose Android classes or Compose objects in the wire contract.

```json
{
  "schema_version": 1,
  "event_id": "opaque-event-id",
  "profile_id": "profile-id",
  "producer_id": "scheduler",
  "task_instance_id": "task-instance-id",
  "run_id": "run-id",
  "root_run_id": "run-id",
  "parent_run_id": null,
  "conversation_id": "origin-conversation-id",
  "run_sequence": 7,
  "occurred_at": "2026-10-30T08:00:00Z",
  "type": "run.completed",
  "payload": {
    "outcome": "succeeded",
    "final_message_id": "message-id",
    "text": "Saved one photograph.",
    "artifacts": [
      {"id": "artifact-id", "mime_type": "image/jpeg", "label": "Camera still"}
    ]
  }
}
```

The host assigns/validates identity, routing, and producer ownership. Artifact IDs resolve through an artifact repository; a plugin cannot authorize a file merely by supplying its path.

| Event family | Purpose | Retention |
|---|---|---|
| `schedule.created/updated/disabled` | Update schedule projections | Durable state/revision |
| `run.started` | Establish an execution and its ownership | Durable |
| `message.started`, `text.delta`, `text.snapshot` | Progressive output | Live stream; checkpoint as needed |
| `tool.started/completed` | Per-run tool activity and structured outputs | Bounded durable detail as needed |
| `artifact.created` | Registered output, MIME type, provenance | Durable |
| `interaction.required/resolved` | Approval/permission/user action request with correlation ID | Durable state when recovery is needed |
| `run.completed/failed/cancelled/interrupted` | Final state and recoverable output | Durable |
| `device.capture_countdown`, audio levels | Transient device feedback | Live only |

Specify text delta versus text snapshot explicitly. Preserve whether output comes from model text or spoken transcription; remove prefix-based guessing from `appendVoiceDelta()`.

Schedule changes are domain events emitted by the schedule store after a successful mutation, regardless of whether the caller was an LLM tool or a settings UI. Replace `toolName.startsWith("schedule_")` refresh heuristics with that source of truth.

Unknown event versions must not crash the screen. Unsupported rich output falls back to a generic run card with outcome and plain text; retain its durable payload for a later compatible renderer.

## 3. Durability before delivery

A `SharedFlow`, callback, or plugin event bus alone cannot provide background result delivery. Subscribers can be absent, and processes can die.

Recommended first storage design: native-owned per-run records under `<profile>/runs/<runId>.json`, reusing the established atomic temp-file/rename convention. The schedule retains references and its bounded history; it is not the only copy of an output. A database is optional later, not a prerequisite.

Each run record contains immutable identity, lifecycle state, final text, artifacts, revision, and delivery/outbox state. Persist the terminal result and its pending delivery marker in the same atomic record update. Emit a wake-up only after the write succeeds.

Delivery sequence:

1. Claim a due occurrence and persist its `runId` before execution.
2. Execute with that identity attached to all callbacks and tool calls.
3. Persist final outcome and pending transcript delivery together.
4. Project a stable run reference into the destination transcript.
5. Mark delivery complete only after the transcript write succeeds.
6. On restart or listener reconnect, replay pending deliveries.

Use at-least-once delivery with an idempotent transcript upsert keyed by `(profileId, runId)`. A crash between steps 4 and 5 must update the existing row, not append another. Acknowledge persistence, never merely receipt by a screen.

Multi-file writes are not one transaction. Implement a recoverable occurrence claim keyed by task incarnation plus occurrence generation. The run record retains the claimed due time and schedule version. On recovery, reconcile schedule counters/next due time once for a terminal run; do not execute it again merely because the schedule write was interrupted. Cancellation/version changes must not be overwritten by this reconciliation.

For a run left in `running` after process death, mark it interrupted/uncertain and avoid automatic re-execution of side effects. Persisted events cannot guarantee exactly-once camera captures, messages, or remote actions. Tool-specific idempotency keys are required where retrying those effects is supported.

Do not prune a run until delivery is settled. A separate retention policy must preserve artifacts referenced by retained transcripts. Trimming the task's 50-event window must not break old cards.

For the first implementation, notifications from the native bridge can mean “store changed”; consumers reread durable revisions. Polling is an acceptable temporary wake-up mechanism if it scans durable pending results, includes disabled/completed tasks, and does not initialize by skipping existing results.

## 4. Transcript routing and sub-agent presentation

The transcript is a persisted projection of runs and user messages. Plugins provide rendering; the host decides where entries belong.

| Situation | Required behavior |
|---|---|
| Origin conversation open | Update its run card, optionally stream expanded details |
| Another conversation open | Persist to origin; update unread/task indicators without injecting foreign output |
| No screen observing | Persist normally; display on next open |
| Origin deleted | Deliver to task Activity inbox; do not silently recreate the conversation |
| Duplicate callback/replay | Idempotent update by event/run/message identity |
| Repeated identical answer on different ticks | Preserve both runs; do not deduplicate by text |
| Task disabled after its last tick | Retain and deliver the final result |
| Feature UI unavailable | Generic run/result renderer remains usable |

Separate visual presentation from model context. A card appearing in the transcript must not silently add every background output to the next prompt. Default scheduled results to `explicit_only`; provide “Use in chat” to attach a selected result. Define an explicit alternative policy if automatic inclusion is desired.

Default rendering:

- A schedule creation tool result links to a task card.
- Each completed tick is a durable child run, shown in a grouped task-results section at the relevant transcript position.
- Latest outcome, unread count, and artifact thumbnails are visible without expanding all tool calls.
- Expanding a run reveals its text, tools, errors, and delegated sub-agents.
- A delegated child run appears under its parent. The parent's final synthesis remains its own assistant message.
- Keep child and parent outputs identifiable; do not suppress a child just because the parent's summary repeats its text.

For long-running schedules, append chronological result groups after intervening conversation activity rather than continually moving one old creation card to the bottom. Each underlying run still has one identity and one delivery record.

Scroll only when the user is already near the bottom or chooses the new-results indicator. Background ticks must not steal scroll position or change the draft.

## 5. Extension contracts and slots

Start with explicit registration at the app composition root. Feature dependencies point toward host API interfaces, not toward `ChatScreen` or each other's internals.

Conceptual Kotlin interfaces; adapt names to the project:

```kotlin
interface RunEventSink {
    suspend fun publish(event: RunEventEnvelope): PublishReceipt
}

interface RunRepository {
    fun observeConversation(id: ConversationId): Flow<List<RunSummary>>
    fun observeRun(id: RunId): Flow<RunSnapshot>
}

interface RunCommands {
    suspend fun cancelRun(id: RunId): CommandResult
}

interface ScheduleCommands {
    suspend fun disableTask(id: TaskInstanceId): CommandResult
}

interface TranscriptContribution {
    val id: String
    fun supports(entry: TranscriptEntry): Boolean

    @Composable
    fun Content(entry: TranscriptEntry, actions: TranscriptActions)
}
```

`PublishReceipt` distinguishes durable acceptance from ephemeral acceptance. Terminal events cannot be acknowledged as durable merely because they were queued in memory. Native implementations may expose equivalent non-coroutine interfaces.

The scheduler's internal event sink is producer-scoped; consumers receive read-only repositories and commands. Do not pass a mutable message list, Activity, all-purpose service locator, or unrestricted profile object to every contribution.

| Slot | Scheduler contribution | Host responsibility |
|---|---|---|
| Sidebar | Tasks section, active/unread counts | Navigation and ordering |
| Above composer | Relevant running task or device countdown | Resource feedback arbitration and compact layout |
| Transcript | Scheduled run card and sub-agent details | Durable placement, dedupe, fallback renderer |
| Message actions | Open task, Use in chat, Stop run | Validate command scope |
| Settings | Tasks/history and execution policy | State ownership and persistence |
| Artifact renderer | Existing image/Markdown/file viewers reused | Resolve artifact access and MIME type |

Registry entries need stable IDs, deterministic order, visibility predicates, duplicate-ID validation, and deterministic renderer selection. Use one primary renderer per entry and additive actions. Compose lambdas suffice for single-owner regions; do not create a registry for every widget.

Runtime feature enablement and presentation enablement are separate. With `FEATURE_SCHEDULER_TOOL=0`, preserve old run/task viewing through generic read-only UI while preventing new task creation/execution. Generate or validate prompt capability descriptions against the actual tool catalog.

## 6. Ownership and code split

| Component | Scope and responsibility |
|---|---|
| `ProfileRuntime` | Process/profile lifetime; starts scheduler once, manages native bridge and profile switching |
| Existing C++ `AgentScheduler` | Due checks and existing schedule semantics |
| `RunCoordinator` | Run identity, execution admission, snapshots, cancellation ownership |
| Native `RunStore` / outbox | Durable outcomes, recovery, pending delivery |
| `NativeRunBridge` | JNI decoding, listener lifecycle, thread boundary, reconnect |
| `TranscriptProjector` | Idempotent persisted transcript updates, routing, grouping metadata |
| `TranscriptRepository` | Observe/read transcript state; sole write boundary for projection |
| `ChatViewModel` | Current conversation, draft, selected context, commands |
| `ChatTurnRunner` | Foreground chat turn using the same run/event contracts |
| `ChatVoiceController` | Dictation/realtime/playback lifecycle and resource ownership |
| `ScheduleRepository` / `TasksViewModel` | Task list and run history projections |
| `ChatRoute` | Activity-result launchers, permissions, lifecycle collection, navigation |
| `ChatScreen` | Rendering and slots |
| `SchedulerUiContribution` | Task-specific UI registration |

Initially these are files/packages in the current Gradle module. Split build modules after dependencies are stable. Keep wire/domain types free of Compose and Activity dependencies.

Native scheduler lifetime must not be tied to composable collection. The UI observes and detaches; the process runtime owns the scheduler. On profile changes, stop/drain or explicitly isolate the old runtime before switching global session-store configuration.

Native callbacks must not call Compose state directly. Serialize ingestion and validate profile/run identity. Keep JNI callback references properly registered/released; never retain Activity references on a scheduler thread. Prefer store-change signals plus queries for the first version; add streaming once terminal delivery works.

## 7. Concurrency, cancellation, and device feedback

The scheduler serializes its own ticks, but that does not prove safety against foreground chat, realtime agents, or other native callers. Audit shared agent state, cancellation globals, session-store settings, HTTP cancellation, and the documented `chdir` before allowing overlap.

Initial safe policy: serialize agent execution through a shared coordinator wherever the native runtime is process-global. Give foreground work priority at admission; allow the user to stop a running task. Do not imply existing work can be preempted safely without testing cancellation.

Remove process-global working-directory changes from per-run execution. Resolve tool paths using an explicit run workspace/folder context. Two runs cannot safely choose independent directories through `chdir`.

| Command | Meaning |
|---|---|
| Stop response | Cancel the specific foreground run and its owned child runs |
| Stop task run | Cancel the selected tick; retain the schedule under its defined repeat policy |
| Disable schedule | Prevent future occurrences; current run is unchanged by default |
| Disable and stop | Explicit combined operation |
| Clear conversations | Delete conversation history; tasks remain unless separately requested |

If native cancellation is global today, expose that limitation and serialize execution until handles become scoped. Do not implement a scoped-looking API on top of indiscriminate `ChatHttp.cancelOutstanding()` without enforcing exclusivity.

Camera/microphone ownership uses leases keyed by run ID. Release the lease in all terminal/cancellation paths. Countdown events include run and task identity, so the UI can say “Camera burst · taking photo” even while another chat is visible. That device feedback does not change transcript routing.

Do not use the chat `busy` flag as an aggregate task flag. Distinguish foreground-turn state, relevant background-run summaries, and active device capture. Keep-awake may cover an active foreground capture session; do not hold it merely because a future schedule exists.

## 8. Android scheduling policy

Preserve the current in-process behavior in the first release and label it accurately: short intervals require Tanit to remain active. Periodic WorkManager work has a 15-minute minimum and can be delayed. Camera/microphone foreground services have while-in-use and background-start restrictions. An exact alarm is not a general authorization to execute arbitrary camera/LLM work in the background. See references below.

For unavailable permissions or missing foreground access, report an actionable blocked condition. Do not repeatedly launch permission dialogs from unattended runs. Any change from today's failure-counting semantics to pause/retry requires an explicit versioned execution policy and tests.

The current camera example is twelve LLM-driven attempts separated by a five-second delay after completion. It is not twelve photos at five-second wall-clock spacing or a sixty-second duration.

Future execution types can share the same run/result API:

| Executor | Suitable work |
|---|---|
| Agent turn | Reasoning, conditional checks, adaptive tool use |
| Direct tool/action | Deterministic capture or export, no model required per tick |
| XBlox workflow | Multi-step explicit workflow |

A true timed camera burst belongs in a dedicated capture workflow with a duration, cadence, call count, and device lifecycle contract. Do not silently replace existing schedule semantics during the architecture cleanup.

## 9. Migration plan

### Phase A — identity and durable final results

1. Verify which tick-poll delivery code exists in the actual branch.
2. Add backward-compatible task provenance and immutable task incarnation IDs.
3. Add persisted per-run identity/outcomes and occurrence recovery bookkeeping.
4. Emit durable terminal events from `AgentScheduler` after `run_turn` returns; live token callbacks can remain absent initially.
5. Add query APIs for run results/pending deliveries, including disabled tasks.
6. Project results to origin conversations or the task inbox with idempotent keys.
7. Remove the legacy append-on-poll path once the projector is authoritative; do not leave two writers.

### Phase B — UI ownership and contribution slots

1. Extract `ChatRoute`, rendering-only `ChatScreen`, and `ChatViewModel`.
2. Move scheduler startup out of screen-owned initialization to `ProfileRuntime`.
3. Register task sidebar, transcript cards, settings, and actions through explicit slots.
4. Replace shared status strings with typed auth/run/playback states.
5. Collect high-frequency audio levels in the meter composable only.

### Phase C — foreground and child-run unification

1. Snapshot foreground requests/configuration before suspending.
2. Route native and LAN adapters through the same normalized run events.
3. Add run-scoped live text, tool, artifact, and delegated-agent callbacks.
4. Preserve delta/snapshot and spoken/text-source distinctions.
5. Remove text-based duplicate suppression and unguarded `Handler.post` transcript writes.
6. Scope cancellation and tool-resource ownership; retain serialization where required.

### Phase D — optional execution enhancements

Add direct-action/XBlox execution, explicit failure policies, notifications, and appropriate Android OS scheduling separately. Keep current timing/failure behavior stable until each policy change is deliberately shipped.

## 10. Acceptance tests

Use fake providers, controlled clocks, and temporary test profiles. Do not require paid model calls or real camera access for event/delivery tests.

| Test | Expected result |
|---|---|
| Due task fires | Unique run persisted; one terminal result; schedule updated once |
| One-shot succeeds or fails | Disabled task's result still delivered |
| Result while another chat is open | Origin receives it; current transcript/draft unchanged |
| No UI subscriber | Result appears after reopening |
| Duplicate event/reconnect replay | One run card, stable message identity |
| Crash after result write, before delivery | Pending result recovered |
| Crash after transcript write, before acknowledgement | Existing row updated, not duplicated |
| Crash before schedule bookkeeping finishes | Terminal occurrence reconciled once, not rerun |
| Crash during side-effecting run | Mark interrupted/uncertain; no blind automatic rerun |
| Origin deleted | Result routed to task inbox |
| Two ticks return identical text | Two distinct run results retained |
| Child agent completes before parent | Child card preserved; parent synthesis separate |
| Task history exceeds 50 events | Retained transcript results/artifacts remain available |
| Disable during execution | No new occurrence; active run behavior matches command semantics |
| Foreground Stop while task exists | Only owning run cancelled, or enforced serial-runtime limitation reported |
| Profile switch and late callback | No cross-profile write |
| Feature UI missing/disabled | Generic read-only result remains visible |
| Slow consumer/high token rate | Bounded live buffering; terminal outcomes never silently dropped |
| Permission/camera unavailable | Actionable failure/block state, no repeated unsolicited dialog loop |
| Legacy schedule load | Existing timing preserved; unlinked output goes to inbox |

Also retain current persistence/tool round-trip tests. Add projector/reducer tests for snapshots versus deltas, stale callbacks, cancellation, and artifact references. Instrument camera lifecycle, JNI listener teardown, and activity recreation separately.

## 11. Source touchpoints and verification checklist

Paths below come from the supplied scheduler notes; confirm them in the checkout:

| Existing location | Planned work |
|---|---|
| `src/llm/agent_scheduler.cpp` | Occurrence claims, run lifecycle, durable outcomes |
| `src/llm/agent_memory.cpp` | Versioned schedule provenance; integrate separate run store |
| `src/llm/tools/scheduler/SchedulerTools.cpp` | Host-injected provenance and schedule-change events |
| `src/android/pm_android_agent.cpp` | Profile runtime/provider snapshot and event sink wiring |
| `android/pm-image/app/src/main/cpp/jni_pm_chat.cpp` | Run queries, change subscription, scoped commands |
| Supplied `ChatScreen` | Remove scheduler ownership and direct event-to-list mutations |
| `ScheduledTasks` | Replace enabled-only presentation polling as a delivery source |
| `PhoneHost` / camera tool bridge | Correlated device events and resource leases |
| Prompt assets / feature catalog | Keep declared tools consistent with feature flags |

Open code questions to resolve before enabling concurrent execution: native cancellation scope, global provider/session state, serialization of store writes, stable tool/message IDs, and actual current poll-to-transcript behavior.

## References

- Android architecture recommendations: https://developer.android.com/topic/architecture/recommendations
- WorkManager work requests and periodic timing: https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started/define-work
- Foreground-service background-start and while-in-use restrictions: https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start
- Foreground service types: https://developer.android.com/develop/background-work/services/fgs/service-types

Android references checked 30 October 2026. Implementation behavior above is attributed to the supplied code/notes; proposed contracts, persistence design, and migration steps are recommendations.
