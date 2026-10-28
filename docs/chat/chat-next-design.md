Part 2 — the **overview / implementation plan**, intentionally staying above concrete code-level implementation details.

# Tanit peer sessions: architecture + implementation plan

Goal: define the architecture and implementation sequence for adding a native
WebRTC peer transport around Tanit's reusable audio/capture components and
signaling schema, then exposing it as a reusable peer/session layer supporting:

```text
LAN chat
support chat
audio
video
screen sharing
remote-control metadata
agent/RPC messages
file transfer
```

This stage is an **architecture and implementation plan only**.

Do not write detailed production code yet.

Use the previous WebRTC audit as the source of truth for what already exists.

---

# Audit baseline

The audit establishes these constraints:

```text
READY
    Windows WebRTC APM audio preprocessing
    webcam and screen capture
    HTTP signaling envelope/mailbox prototype
    browser-side offer/DataChannel prototype

MISSING
    native PeerConnection
    native SDP/ICE execution
    native DataChannels
    RTP media tracks
    STUN/TURN
    peer/session manager

DISABLED IN SHIPPED BUILDS
    libdatachannel v0.22.6 gate
    video-stream signaling prototype
```

Consequently, Phase 1 introduces a native peer backend; it does not extract one
from the existing `tanit-webrtc-plugin.dll`. That plugin is an `audio.webrtc`
APM provider with a deliberately narrow audio-DSP ABI and should remain separate
from network transport.

---

# 1. Core design principle

Do not build separate networking stacks for:

```text
LAN chat
support
voice calls
video calls
screen sharing
remote support
agent-to-agent communication
```

Build one reusable abstraction:

```text
TanitPeerSession
```

A peer session owns or references one WebRTC `PeerConnection` and exposes application-level capabilities.

Conceptually:

```text
                    TanitPeerSession
                           |
             +-------------+-------------+
             |             |             |
           media       DataChannels     identity
             |             |             |
        audio/video     control          peer ID
        screen          chat             trust
                        realtime         permissions
                        bulk             capabilities
```

The discovery/signaling mechanism may differ, but the peer session should not care whether the other endpoint was found through:

```text
mDNS / LAN
support backend
account/device directory
browser support console
future mobile client
```

---

# 2. Separate transport from application protocol

Keep these layers independent:

```text
Discovery
    ↓
Signaling
    ↓
Peer/session establishment
    ↓
WebRTC transport
    ↓
Tanit protocol
    ↓
Feature-specific handlers
```

Avoid letting WebRTC callbacks directly manipulate:

```text
chat UI
support UI
agent system
screen-sharing UI
file panel
```

Instead:

```text
WebRTC event
    ↓
PeerSession event
    ↓
protocol dispatcher
    ↓
feature handler
```

This allows the transport to change later without rewriting application features.

---

# 3. Proposed module boundaries

Target structure:

```text
rtc/
    rtc_peer
        PeerConnection lifecycle
        SDP
        ICE
        tracks
        DataChannels

peer/
    peer_identity
    peer_session
    peer_manager
    peer_permissions
    peer_capabilities

protocol/
    peer_protocol
    control_protocol
    chat_protocol
    file_protocol
    rpc_protocol

lan/
    lan_discovery
    lan_signaling
    lan_broker

support/
    support_signaling
    support_session

storage/
    conversation_store
    trusted_peer_store
```

Exact filenames may follow existing Tanit conventions.

The important part is ownership separation.

---

# 4. RtcPeer responsibility

The lower WebRTC layer should expose a generic connection abstraction.

Conceptually:

```text
RtcPeer
```

owns:

```text
PeerConnection
ICE
SDP
DataChannels
media tracks
WebRTC state
```

It must not know about:

```text
LAN rooms
support tickets
chat conversations
Tanit agents
UI
```

Its responsibility ends at events such as:

```text
connected
disconnected
failed

channel opened
channel closed
data received

track added
track removed

local SDP
local candidate
```

Existing APM, audio-device and capture code should be adapted into this boundary
without moving their ownership into it. The native `RtcPeer` transport itself is
new code.

---

# 5. PeerSession responsibility

`PeerSession` adds Tanit semantics.

It owns:

```text
peer identity
session identity
trust state
permissions
capabilities
connection state
protocol dispatch
```

Conceptually:

```text
PeerSession
    PeerIdentity
    SessionId
    RtcPeer

    permissions
    capabilities

    channels:
        control
        chat
        realtime
        bulk
```

One session represents one logical relationship between Tanit and another endpoint.

Possible peer types:

```text
local Tanit instance
remote Tanit device
support service
support operator
browser client
future mobile client
```

---

# 6. DataChannel layout

Do not put all application traffic into one DataChannel.

Use logical separation:

```text
control
chat
realtime
bulk
```

Suggested intent:

```text
control
    reliable
    ordered

    session negotiation
    capabilities
    permissions
    call state
    RPC
    system events


chat
    reliable
    ordered

    text messages
    reactions
    receipts
    conversation events


realtime
    unordered
    low-latency
    limited/no retransmission

    cursor movement
    audio levels
    transient UI state
    remote pointer
    live presence


bulk
    reliable
    ordered

    attachments
    snapshots
    optional file chunks
```

Avoid allowing bulk transfers to block control/chat traffic.

---

# 7. Session capability model

Every peer advertises supported capabilities.

Example conceptual capability set:

```text
chat
audio
video
screen.send
screen.receive

files

clipboard
remote_input

agent.rpc
diagnostics

support
```

Capabilities describe what the endpoint technically supports.

Permissions separately describe what the local user allows.

Example:

```text
peer supports:
    chat
    audio
    screen.receive
    remote_input

local permissions:
    chat             allowed
    audio            allowed
    screen.receive   ask
    remote_input     denied
```

Never equate capability with authorization.

---

# 8. Identity and trust

Introduce a stable Tanit machine/device identity.

It should be independent from:

```text
IP address
hostname
process ID
WebRTC connection
Zitadel account
```

Conceptually:

```text
DeviceIdentity
    stable UUID
    friendly name
    public identity key
```

Persist trusted peers separately.

Example stored trust relationship:

```text
peer ID
public key/fingerprint
friendly name
first seen
last seen
permissions
trust state
```

A LAN peer must not become trusted merely because it is on the same subnet.

---

# 9. Pairing model

First connection should support explicit pairing.

Possible UX:

```text
Workshop-PC wants to connect

Pairing code:
381 249

[Reject]
[Trust once]
[Trust device]
```

After successful pairing:

```text
peer identity
    +
cryptographic identity
    +
stored trust
```

should bind future sessions.

Avoid relying only on:

```text
hostname
IP
mDNS service name
WebRTC certificate fingerprint
```

because those are not sufficient long-term identity mechanisms by themselves.

---

# 10. LAN discovery

Use local service discovery only to locate potential Tanit peers.

Expected approach:

```text
DNS-SD / mDNS
```

Advertise a minimal service record such as:

```text
_tanit._tcp.local
```

Possible metadata:

```text
protocol version
device ID
friendly name
capability summary
signaling port
broker state
```

Keep TXT records small.

Do not expose:

```text
user data
tokens
chat metadata
support credentials
```

---

# 11. Local-machine ownership

Multiple Tanit processes on one machine must not each expose a separate LAN identity.

Reuse the existing scheduler-style ownership/election infrastructure where practical.

The reusable production pattern is concrete:

```text
SchedulerHost::step
    heartbeat_scheduler_claim
    priority-based cooperative yield
    try_scheduler_leader_lock

try_scheduler_leader_lock
    named Windows mutex
    + leader.lock file lock

CommandLease
    per-resource file lease

cmd_ipc instance registry
    per-process descriptor
    loopback ephemeral listener
```

Relevant implementation lives in:

```text
src/tasks/scheduler_host.cpp
src/tasks/scheduler_platform_win32.cpp
src/tasks/scheduler_claim.*
src/tasks/scheduler_lease.*
src/core/cmd_ipc.cpp
```

Establish:

```text
LocalPeerOwner
```

One eligible Tanit process owns:

```text
LAN discovery
signaling listener
machine peer identity
peer sessions
```

Other local Tanit processes communicate with that owner through the existing/local IPC strategy.

Do not reuse `src/llm/agent_scheduler.hpp::global_scheduler()` for this role; it
is an in-process LLM timer and has no cross-process election.

The LAN should see one machine:

```text
Workshop-PC
```

not:

```text
Workshop-PC process 1
Workshop-PC process 2
Workshop-PC CLI
```

---

# 12. LAN broker

Separate:

```text
machine-level owner
```

from:

```text
LAN-level broker
```

The LAN broker is an elected Tanit machine used only for coordination.

Responsibilities:

```text
presence registry
room membership
signaling routing
peer lookup
broker epoch
```

Do not route established peer media/data through the broker by default.

Architecture:

```text
                   LAN broker
                     / | \
                    /  |  \
             signaling/presence
                  /    |    \
              A        B        C

actual data/media:
              A <----> B
              A <----> C
              B <----> C
```

If the broker disappears:

```text
existing WebRTC sessions continue
new broker elected
signaling/presence reconnects
```

---

# 13. Broker election

Reuse concepts from the scheduler election mechanism rather than inventing a separate infrastructure.

Requirements:

```text
deterministic winner
heartbeat/lease
clean handover
crash recovery
epoch/generation
```

Use a broker epoch so stale broker state cannot override newer state.

The scheduler pattern provides mutual exclusion and cooperative priority, but not
this epoch. Add owner generation/epoch explicitly. Also define deterministic
tie-breaking among equal-priority UI processes rather than relying on mutex race
order as a stable identity decision.

Example:

```text
broker A epoch 42

A dies

broker B epoch 43
```

State should primarily be reconstructable from connected peers.

Avoid complex replicated broker state.

---

# 14. LAN signaling

LAN signaling should remain lightweight.

For initial LAN implementation prefer:

```text
mDNS discovery
    ↓
local REST or existing socket signaling
    ↓
SDP exchange
    ↓
WebRTC
```

Reuse existing REST/socket infrastructure where possible.

Signaling messages should be generic:

```text
offer
answer
candidate
session event
```

Avoid audio-specific API names.

For LAN-only sessions, evaluate whether complete ICE gathering before signaling simplifies the first implementation.

Do not introduce trickle ICE complexity unless needed.

---

# 15. Internet/support signaling

Support sessions use the same `PeerSession` architecture but a different signaling backend.

Conceptually:

```text
Tanit
    ↓
Hono/Zitadel authenticated signaling
    ↓
support endpoint
    ↓
WebRTC PeerConnection
```

The support endpoint may be:

```text
AI support service
human operator browser
another Tanit instance
```

Do not introduce a separate support transport.

---

# 16. Support as a peer

Model support endpoints as peers with limited capabilities.

Possible peer kinds:

```text
local_device
remote_device
support_bot
support_agent
server_service
```

A support peer may request:

```text
chat
diagnostics
logs
audio
screen viewing
remote input
```

Local Tanit permissions decide whether those requests are allowed.

Support must never implicitly receive agent/computer-use authority.

---

# 17. Server participation

The backend may join as an actual WebRTC peer when useful.

Suitable cases:

```text
AI support
persistent support bot
diagnostic service
automated support workflow
```

Human browser support should preferably connect directly:

```text
Tanit <---- WebRTC ----> operator browser
```

with the server handling:

```text
authentication
ticket assignment
signaling
TURN credentials
history
```

---

# 18. Persistent chat vs live transport

Do not use WebRTC as the canonical message store.

Separate:

```text
delivery transport
```

from:

```text
conversation storage
```

For LAN:

```text
local conversation store
    +
WebRTC delivery
```

For support:

```text
server-side conversation store
    +
WebRTC delivery while online
```

This allows:

```text
offline support messages
reconnect
missing-message synchronization
history
multi-device access
```

Every durable message needs a stable ID.

---

# 19. Message protocol

Define a versioned envelope shared across peer features.

Conceptually:

```text
protocol version
message/event type
message ID
session/conversation ID
sender
timestamp
payload
```

Examples:

```text
chat.message
chat.receipt
chat.typing

peer.capabilities
peer.presence

call.offer
call.state

screen.offer

file.offer
file.accept

rpc.request
rpc.response
rpc.error
```

Do not create protocol versions independently for every feature unless necessary.

---

# 20. RPC and agent integration

Use the control channel for structured RPC.

Example capabilities may eventually include:

```text
support.get_version
support.get_environment
support.get_logs

agent.invoke

screen.start
screen.stop

clipboard.get
clipboard.set
```

RPC must go through a local permission/policy layer.

Never directly map remote RPC names to arbitrary Tanit tools.

Use:

```text
remote request
    ↓
RPC registry
    ↓
permission/policy check
    ↓
approved handler
```

---

# 21. Audio integration

Existing WebRTC APM functionality is preprocessing, not a peer transport. Keep it
as an optional audio source/sink adapter. A future WebRTC audio track becomes a
capability of `PeerSession`.

Expected progression:

```text
chat-only connection
    ↓
user presses Call
    ↓
enable/add audio track
```

The PeerConnection should not be destroyed merely because audio is stopped.

Audio lifecycle must be separated from peer-session lifecycle.

This architecture must also remain compatible with the separate room/SFU
direction documented in `docs/audio_chat.md`. Direct `RtcPeer` media should not
silently replace an SFU where multi-party voice, jitter handling and congestion
control require the fuller media stack.

---

# 22. Video integration

Video is a later feature phase.

Reuse existing Tanit capture/encoding infrastructure where possible.

The WebRTC work should primarily provide:

```text
video track creation
codec description
RTP packetization
RTCP handling
track lifecycle
```

Do not tie camera and screen sharing to the same source abstraction unless they naturally share one.

---

# 23. Screen sharing

Screen sharing becomes another media source attached to the existing session.

Conceptually:

```text
PeerSession
    chat
    audio
    screen track
```

Screen viewing and screen control remain separate capabilities.

Example:

```text
screen.receive    allowed
remote_input      denied
```

This distinction is important for support/security.

---

# 24. File transfer

Support two strategies.

Small/medium attachments:

```text
bulk DataChannel
```

Large files:

```text
local/server HTTP transfer
    +
DataChannel metadata/control
```

Do not force every file through SCTP.

DataChannel transfers must implement:

```text
chunking
backpressure
cancel
progress
integrity
resume strategy if supported
```

The exact wire format belongs in the implementation-detail stage.

---

# 25. TURN

LAN connections should normally use direct host candidates.

Remote/support sessions require TURN fallback.

Expected architecture:

```text
LAN
    host ICE candidates

Internet/support
    STUN
    TURN fallback
```

TURN credentials should be short-lived and obtained from the authenticated backend.

Do not embed permanent TURN credentials in Tanit.

---

# 26. Failure model

The session architecture must explicitly handle:

```text
peer process crash
machine sleep
network change
Wi-Fi reconnect
broker failure
signaling disconnect
WebRTC ICE failure
support server unavailable
TURN unavailable
DataChannel failure
```

Keep failures scoped.

Examples:

```text
broker failure
    ≠ destroy existing peer sessions

support backend failure
    ≠ destroy LAN chat

audio-track failure
    ≠ destroy chat

bulk-transfer failure
    ≠ destroy control channel
```

---

# 27. Session lifecycle

Target conceptual state machine:

```text
Discovered
    ↓
Connecting
    ↓
Authenticating/Pairing
    ↓
Connected
    ↓
Ready
    ↓
Closing
    ↓
Closed
```

Potential side states:

```text
Failed
Reconnecting
AwaitingPermission
```

Do not expose raw WebRTC ICE states directly as the user-facing session state.

---

# 28. Threading

Keep WebRTC networking/callback threads separate from:

```text
UI
audio realtime processing
file I/O
agent execution
database work
```

PeerSession should marshal events to the appropriate execution contexts.

Do not allow:

```text
WebRTC callback
    ↓
heavy synchronous agent/tool call
```

or:

```text
audio callback
    ↓
JSON/database/file work
```

---

# 29. Store/MSIX strategy

The same peer/session architecture should be usable in:

```text
desktop Win32 build
Microsoft Store/MSIX build
macOS
Linux
```

Platform-specific networking/discovery code should sit behind interfaces.

Avoid maintaining:

```text
Store networking architecture
Desktop networking architecture
```

as separate implementations unless required by platform constraints.

The audit verifies only that the Windows APM plugin is packaged in the existing
MSIX. It does not verify UDP/ICE, inbound LAN listeners, firewall behavior,
DataChannels or TURN.

Store acceptance for the new peer backend therefore requires an installed-MSIX
test matrix covering:

```text
outbound and inbound LAN signaling
host candidates
STUN reflexive candidates
TURN/UDP, TURN/TCP and TURN/TLS
sleep/network-change recovery
webcam and microphone permission denial
multiple packaged Tanit entry points
```

Manifest/network capability changes must follow measured behavior of the chosen
backend. Do not infer them solely from `runFullTrust` or `internetClient`.

---

# 30. Implementation phases

Implement incrementally.

## Phase 1 — introduce generic WebRTC peer

Add a separately owned transport component:

```text
RtcPeer
```

with:

```text
SDP
ICE
lifecycle
generic DataChannel support
callback executor and deterministic shutdown
```

Pin the selected backend and all effective dependency options. Preserve the
existing APM plugin unchanged behind its audio preprocessing facade. Reuse only
the signaling schema concepts from `streaming_session.*`; do not promote its
single process-local queue into the production session router.

No LAN discovery yet.

Success criterion:

```text
two local test peers can establish
a DataChannel-only PeerConnection
```

---

## Phase 2 — PeerSession + protocol

Build:

```text
PeerIdentity
PeerSession
PeerManager
protocol envelope
control channel
chat channel
```

Test using explicitly configured peers.

No automatic LAN discovery required yet.

Success criterion:

```text
two Tanit instances exchange reliable chat/events
through the generic session layer
```

---

## Phase 3 — LAN discovery

Add:

```text
DNS-SD/mDNS
machine identity
peer discovery
```

Success criterion:

```text
Tanit instances automatically discover
available peers on the LAN
```

---

## Phase 4 — local ownership

Integrate scheduler-style process ownership.

Success criterion:

```text
multiple Tanit processes on one PC
appear as one LAN device
```

---

## Phase 5 — LAN broker

Add:

```text
broker election
presence
room coordination
signaling routing
broker handover
```

Success criterion:

```text
broker can disappear without terminating
existing peer connections
```

---

## Phase 6 — trust/pairing

Add:

```text
persistent peer identity
pairing
trusted-peer storage
permissions
```

Success criterion:

```text
unknown peers cannot access privileged capabilities
without approval
```

---

## Phase 7 — support signaling

Connect:

```text
Hono
Zitadel identity
support backend
```

to the same `PeerSession`.

Success criterion:

```text
support service/browser can join
using the same session protocol
```

---

## Phase 8 — durable messaging

Add:

```text
local LAN conversation history
server-backed support history
message synchronization
delivery states
```

---

## Phase 9 — media expansion

Add:

```text
audio session integration cleanup
video
screen sharing
```

without changing the chat/session protocol.

---

## Phase 10 — files / RPC / remote support

Add:

```text
bulk/file transfer
diagnostics
controlled RPC
screen control
agent integrations
```

only after permissions/trust are mature.

---

# 31. Initial minimal viable target

Do not attempt the entire architecture in the first implementation.

The first useful vertical slice should be:

```text
existing WebRTC
    ↓
generic RtcPeer
    ↓
DataChannel support
    ↓
PeerSession
    ↓
control + chat channels
    ↓
manual/local signaling
    ↓
two Tanit instances exchanging messages
```

Then add discovery.

This isolates WebRTC/session correctness from:

```text
mDNS
broker election
support backend
TURN
UI
persistent history
```

---

# 32. Non-goals for initial implementation

Do not initially build:

```text
SFU
group video
complex room server
distributed database
full agent RPC
remote desktop
multi-GB DataChannel transfers
automatic trust
federation
cloud peer directory
```

Design so these can be added, but do not make them prerequisites.

---

# 33. Important architecture constraints

Preserve these invariants:

```text
1. One peer/session abstraction across LAN and support.

2. WebRTC transport is independent from chat/support semantics.

3. Audio/video are capabilities, not session types.

4. Peer identity is independent from IP/process/session.

5. Capability does not imply permission.

6. WebRTC is live transport, not canonical storage.

7. Broker coordinates; it does not normally relay media/data.

8. Broker failure does not kill established sessions.

9. Multiple local Tanit processes expose one machine identity.

10. Remote RPC never bypasses local permission/policy checks.

11. Bulk traffic cannot block control traffic.

12. Support uses the same peer protocol rather than a parallel transport.
```

---

# 34. Deliverable for this stage

Before detailed implementation begins, produce an architecture report containing:

```text
existing components to reuse

components requiring refactor

new modules

ownership/lifetime relationships

session state model

channel model

identity/trust model

LAN discovery model

broker model

support model

storage model

implementation phases

platform/build implications

major risks
```

Reference conclusions from the WebRTC audit rather than assuming functionality exists.

The next stage will specify concrete:

```text
C++ interfaces/classes
message schemas
DataChannel configuration
SDP/signaling flow
mDNS records
broker election protocol
threading/queues
persistence structures
CMake changes
error handling
tests
```

Do not implement those details in this stage.

This is the right breakpoint before part 3: the next handover can be much more concrete—classes, event flow, DataChannel settings, signaling messages, broker election, threading, persistence and test cases.

