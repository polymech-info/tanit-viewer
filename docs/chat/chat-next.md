Here’s part 1 only: the **audit/check + dependency handover prompt**.

# Tanit WebRTC audit: existing coverage + dependencies

Goal: inspect the current Tanit codebase and determine exactly what WebRTC infrastructure already exists, what is audio-specific, and what is missing before extending it to LAN/support chat, DataChannels, video and screen sharing.

Do **not** implement the new chat/session system yet.

## Scope

Audit the existing WebRTC-related code, build configuration and dependencies.

We previously focused mainly on **audio/WebRTC**, so do not assume that DataChannels, generic signaling, video tracks, TURN, peer identity or reusable session abstractions are complete.

The future architecture will likely reuse one WebRTC `PeerConnection` for:

```text
audio
video
screen sharing

DataChannels:
    control
    chat
    realtime
    bulk
```

This audit must establish whether that is possible with the current implementation and what must change first.

---

## 1. Locate existing WebRTC code

Search the entire repository for at least:

```text
rtc::PeerConnection
rtc::Configuration
rtc::Description
rtc::Track

createDataChannel
onDataChannel

onLocalDescription
setLocalDescription
setRemoteDescription

onLocalCandidate
addRemoteCandidate

onStateChange
onGatheringStateChange
onSignalingStateChange

STUN
TURN
ICE

Opus
RTP
RTCP
SRTP

usrsctp
libsrtp
libjuice
libnice
libdatachannel
```

Also locate:

* WebRTC wrappers/classes
* audio-specific wrappers
* signaling code
* REST/WebSocket signaling endpoints
* headless WebRTC code
* browser/WebView WebRTC integration
* CMake options
* vendored dependencies
* package-manager dependencies
* platform-specific implementations

Report concrete file paths and class/function names.

---

## 2. Determine current abstraction level

Establish whether the current architecture looks like:

```text
AudioWebRtcSession
    owns PeerConnection
    owns signaling
    owns audio
```

or whether a reusable lower-level abstraction already exists:

```text
RtcPeer
    PeerConnection
    SDP
    ICE
    lifecycle

AudioSession
    uses RtcPeer
```

Identify any coupling that would make chat/video difficult, especially:

```text
PeerConnection lifetime == audio call lifetime

offer generation assumes audio track exists

signaling messages named around audio/call semantics

SDP assumptions specific to Opus/audio

connection destroyed when audio stops

one hard-coded peer

browser-specific assumptions

fixed STUN/TURN configuration
```

Do not refactor yet; report what needs refactoring.

---

## 3. Audit PeerConnection functionality

For the existing native implementation determine whether these work today:

```text
create PeerConnection

create offer
create answer

set local description
set remote description

local ICE candidates
remote ICE candidates

ICE gathering
ICE connection

connection-state callbacks

clean shutdown

reconnect/recreate

multiple simultaneous PeerConnections
```

Classify each as:

```text
READY
PARTIAL
MISSING
UNKNOWN
```

Give evidence from the source.

---

## 4. Audit DataChannel support

Determine whether the current build supports WebRTC DataChannels.

Specifically check for:

```cpp
pc->createDataChannel(...)

pc->onDataChannel(...)
```

and for DataChannel callbacks such as:

```text
onOpen
onClosed
onError
onMessage
bufferedAmount
bufferedAmountLowThreshold
```

Verify that **SCTP/usrsctp is actually present and enabled in the built binaries**, not merely available upstream.

Check relevant libdatachannel/CMake options.

Look for accidental configurations that disable DataChannels or SCTP.

Report:

```text
DataChannel compile support:
DataChannel runtime support:
usrsctp dependency:
existing DataChannel code:
missing pieces:
```

Do not write a chat protocol yet.

---

## 5. Dependency audit

Identify exactly which WebRTC backend Tanit currently uses.

Expected possibility:

```text
libdatachannel
```

but verify rather than assume.

For libdatachannel or equivalent determine the actual dependency chain used by Tanit:

```text
ICE:
    libjuice / libnice / other

DTLS/TLS:
    OpenSSL / GnuTLS / MbedTLS / other

DataChannel:
    usrsctp

media:
    libsrtp

codec/audio:
    Opus / existing Tanit audio stack
```

For every dependency report:

```text
library
version if identifiable
vendored/system/package-manager
license
static/dynamic
platform coverage
Store/MSIX relevance
```

Flag duplicated dependencies already present elsewhere in Tanit.

---

## 6. Build-option audit

Inspect CMake and dependency configuration for options such as:

```text
NO_MEDIA
NO_WEBSOCKET
USE_SYSTEM_USRSCTP
USE_SYSTEM_SRTP
USE_NICE
USE_JUICE
```

or equivalent.

Determine the effective options for:

```text
Windows desktop
Windows Store/MSIX
macOS
Linux
```

Pay particular attention to Store builds.

We need to know whether current MSIX builds contain the same WebRTC functionality as normal desktop builds.

Do not infer this from default upstream settings; trace Tanit's actual build configuration.

---

## 7. STUN / TURN / ICE audit

Determine current support for:

```text
host ICE candidates
STUN
TURN/UDP
TURN/TCP
TURN/TLS if applicable
trickle ICE
non-trickle ICE
```

Find current configuration sources.

Determine whether credentials/servers are:

```text
hard-coded
settings-based
server-provided
environment-based
missing
```

We may later use:

```text
LAN:
    host candidates only where possible

remote/support:
    STUN + TURN
```

Do not configure this yet.

---

## 8. Signaling audit

Locate the signaling mechanism used by the existing audio implementation.

Determine whether it uses:

```text
REST
WebSocket
WebView/browser messaging
custom socket
manual SDP exchange
other
```

Document the current message types and flow:

```text
offer
answer
candidate
connection lifecycle
call start/end
```

Determine whether signaling is generic enough for:

```text
chat-only PeerConnection
audio
video
screen
support session
```

or whether it is tightly coupled to audio calls.

Flag assumptions that should later be generalized.

---

## 9. Media audit

### Audio

Document what already exists:

```text
capture
processing
codec
RTP packetization
RTCP
send track
receive track
playback
mute/unmute
device changes
```

Identify which layer owns each part.

### Video

Search for any existing WebRTC video work:

```text
rtc::Description::Video
video Track
H264
VP8
VP9
AV1
video RTP packetizer
RTCP
NACK
PLI
FIR
```

Separate:

```text
existing generic Tanit video capture/encoding
existing WebRTC video support
missing glue between the two
```

### Screen sharing

Likewise identify whether Tanit's existing screen capture has any WebRTC integration.

Do not implement video/screen support in this task.

---

## 10. Threading / lifecycle

Document how WebRTC callbacks interact with Tanit's threading model.

Check:

```text
which thread creates PeerConnection
callback threads
UI-thread crossing
audio threads
shutdown ordering
object lifetime
shared_ptr ownership
weak_ptr use
process exit
```

Look specifically for:

```text
callback-after-destruction
deadlocks
blocking WebRTC callbacks
UI-thread network work
audio-thread allocations
unsafe shutdown
```

This matters because future persistent peer sessions may live much longer than an audio call.

---

## 11. Multi-instance compatibility

Tanit already has process ownership/election patterns for other subsystems such as the scheduler.

Check whether the WebRTC implementation assumes:

```text
only one Tanit process
fixed ports
one listener
one signaling owner
one audio session
```

Identify what would prevent one elected local Tanit process from becoming the machine-level networking/session owner.

Do not implement election logic in this task.

---

## 12. Store/MSIX audit

Verify current WebRTC behavior/build support for Microsoft Store/MSIX.

Check:

```text
WebRTC dependencies included
WinSock usage
UDP
ICE
STUN/TURN
certificate/DTLS handling
firewall assumptions
AppContainer-specific code if any
full-trust packaged desktop behavior
```

Flag anything compiled out under:

```text
PM_STORE_BUILD
MSIX
Store SKU
Tanit Viewer SKU
```

Do not modify the manifest yet.

---

## 13. Deliverable

Produce a concise technical report with these sections:

```text
1. Existing WebRTC architecture

2. Relevant source files/classes

3. PeerConnection capability matrix

4. DataChannel readiness

5. Current dependency graph

6. Effective CMake/build configuration

7. ICE/STUN/TURN status

8. Signaling architecture

9. Audio/video/screen status

10. Threading/lifetime concerns

11. Multi-instance constraints

12. MSIX/Store constraints

13. Missing prerequisites

14. Recommended refactor boundary
```

For capability matrices use:

```text
READY
PARTIAL
MISSING
UNKNOWN
```

Every important conclusion must reference concrete source files/functions/build definitions.

---

## Desired final conclusion

The report should make it possible to answer, with evidence:

```text
Can the current Tanit WebRTC implementation establish
a PeerConnection containing only DataChannels?

Can audio and DataChannels coexist on the same PeerConnection?

Is usrsctp present and enabled?

Can tracks be added later to a chat-only connection?

Is signaling generic enough?

Does TURN work?

Can this run unchanged in the Store/MSIX build?

What exactly must be extracted/refactored before implementing
the Tanit peer/session layer?
```

Do not implement the LAN discovery, broker, chat protocol or support system yet.

This task is strictly the **existing-code and dependency audit** that will feed the next architecture/implementation-plan stage.

Next, when you want it, we can do part 2 as the **overview/implementation plan based on the expected audit outcome**, without dropping into code details yet.

---

# Audit findings (2026-09-17)

## Executive conclusion

Tanit does **not** currently have a native WebRTC peer implementation to extract.
The shipped code contains two separate things that use the WebRTC name:

1. a Windows WebRTC Audio Processing Module (APM) integration for local echo
   cancellation, noise suppression and gain control; and
2. an HTTP video-stream/signaling prototype whose offer/answer/candidate messages
   are stored in a queue but are not consumed by a native peer.

There is no product-code `PeerConnection`, native DataChannel, ICE agent, DTLS/SRTP
transport, RTP media track, or renegotiation implementation. The optional
libdatachannel v0.22.6 build gate exists, but it is disabled in shipped
configurations and no Tanit source uses its API even when the gate is enabled.

## 1. Existing WebRTC architecture

The effective architecture is:

```text
Local realtime audio
  -> AudioInput / speaker render reference
  -> EchoCancellationProcessor
  -> WebRTC APM directly or tanit-webrtc-plugin.dll
  -> existing WebSocket realtime provider

Video/screen remote prototype
  -> CaptureSource
  -> JPEG encoding
  -> HTTP /mjpeg and /snapshot.jpg
  -> HTTP /control
  -> HTTP /signal mailbox (schema only)

Native PeerConnection / ICE / DataChannels / RTP tracks
  -> not implemented
```

`src/plugins/webrtc/tanit_webrtc_plugin.cpp` only wraps
`webrtc::AudioProcessing`. Its exported capability is `audio.webrtc`; it contains
no peer, SDP, ICE or media-transport code. `src/core/audio_realtime.cpp` uses the
audio processor in a WebSocket-based realtime voice session, not a WebRTC call.

The closest future transport boundary is
`src/video/streaming/streaming_session.hpp`, but its
`EncodedVideoTrackSink`, `DataChannelMessage`, signaling types and capability
structures are declarations/helpers rather than a peer implementation.

## 2. Relevant source files and classes

- `packages/webrtc/CMakeLists.txt`
  - builds a curated, static `webrtc_apm` target;
  - it does not build the vendored tree as a full libwebrtc peer stack.
- `src/audio/echo_cancellation.hpp` and
  `src/audio/echo_cancellation.cpp`
  - `pm::audio::EchoCancellationProcessor`;
  - selects plugin-backed APM, directly linked APM, or pass-through behavior.
- `src/plugins/plugin_webrtc_api.h`
  - `PmWebrtcApmApi`, an audio-processing function table.
- `src/plugins/webrtc/host_webrtc.cpp`
  - loads the `audio.webrtc` plugin through the plugin manager.
- `src/plugins/webrtc/tanit_webrtc_plugin.cpp`
  - `ApmHandle`, `create`, `destroy`, `process_render`, `process_capture`.
- `cmake/Plugins.cmake`
  - builds `tanit-webrtc-plugin.dll` and statically links `webrtc_apm`.
- `src/video/streaming/streaming_session.hpp/.cpp`
  - signaling schema, capability JSON and unimplemented track-sink boundary.
- `src/cli/pm_image_cmd_video_streaming.cpp`
  - HTTP `/signal`, `/control`, `/mjpeg`, capture lifecycle and signal queue.
- `apps/remote/src/PrototypeApp.tsx`
  - browser-side `RTCPeerConnection`, offer creation and `pm-control`
    DataChannel prototype; the native endpoint never answers it.
- `CMakeLists.txt`
  - `FEATURE_VIDEO_WEBRTC` scaffold gate and disabled
    `FEATURE_VIDEO_WEBRTC_LIBDATACHANNEL` dependency gate.

## 3. PeerConnection capability matrix

| Capability | Status | Evidence |
|---|---|---|
| Create native PeerConnection | MISSING | No product-code peer construction or `rtc::PeerConnection`; the vendored link probe is not a product target |
| Create native offer | MISSING | Offer creation exists only in `apps/remote/src/PrototypeApp.tsx` |
| Create native answer | MISSING | `POST /signal` stores the offer and never generates an answer |
| Set local/remote description | MISSING | Browser-side only; no native implementation |
| Local/remote ICE candidates | MISSING | Native queue parses candidate fields but has no ICE agent |
| ICE gathering/connection | MISSING | No native ICE callbacks or configuration |
| Connection/signaling callbacks | MISSING | Browser prototype only |
| Clean HTTP stream shutdown | READY | `cmd_video_stream()` stops capture/server, notifies waiters and joins its listener thread |
| Peer shutdown/reconnect | MISSING | There is no native peer lifecycle |
| Multiple PeerConnections | MISSING | No session manager; prototype uses one queue and hard-coded `stream_id = "default"` |
| Multiple APM instances | READY | Each `create()` owns an independent `ApmHandle` |

The standalone peer-factory link probe under `packages/webrtc` is not evidence of
runtime peer capability: the root build disables the probe and links only
`webrtc_apm`.

## 4. DataChannel readiness

```text
DataChannel compile support: MISSING in effective builds
DataChannel runtime support: MISSING
usrsctp dependency: not built or shipped
existing DataChannel code: browser prototype + JSON envelope helper only
missing pieces: native peer, SCTP association, channel callbacks, buffering,
                flow control, shutdown and protocol dispatch
```

The browser creates `pm-control` and has open/close/error/message handling, but
the native host never answers SDP, so that channel cannot open. Browser control
therefore falls back to HTTP `/control`.

`make_webrtc_capabilities_json()` currently reports `dataChannel: true` when
`FEATURE_VIDEO_WEBRTC` is set even though its implementation value is
`protocol-scaffold`. That field describes schema intent, not working runtime
support. Callers must use `nativePeer`/`implementation`, or the capability report
must be tightened before it is used for negotiation.

`bufferedAmount`, a low-water mark, backpressure and native message callbacks are
all missing.

## 5. Current dependency graph

### Effective shipped audio path

```text
tanit-webrtc-plugin.dll (dynamic Tanit plugin)
  -> webrtc_apm (static curated WebRTC sources)
  -> Abseil (static dependencies)
  -> winmm on Windows
```

- WebRTC source license: BSD-3-Clause, evidenced by
  `packages/webrtc/LICENSE`.
- Abseil license: Apache-2.0; the shipped third-party notice identifies the
  dependency.
- `webrtc_apm` is compiled only on Windows by the root integration.
- The WebRTC APM license is not explicitly identified in the current generated
  third-party notice, which is a release/compliance gap.
- `packages/webrtc/CMakeLists.txt` fetches Abseil from floating `master`; this is
  not reproducible and should be pinned before relying on this dependency in new
  transport work.

### Optional, inactive peer path

`CMakeLists.txt` declares libdatachannel from
`https://github.com/paullouisageneau/libdatachannel.git` at tag `v0.22.6` only
when `FEATURE_VIDEO_WEBRTC_LIBDATACHANNEL=ON`.

In the effective build:

- libdatachannel: not fetched/linked/shipped;
- usrsctp: not built/shipped;
- libsrtp: not built/shipped;
- libjuice/libnice: not built/shipped;
- WebRTC DTLS/TLS backend: not configured;
- Opus WebRTC media codec: not built/shipped.

Files for these concepts inside the vendored upstream WebRTC tree are not linked
product dependencies.

## 6. Effective CMake/build configuration

Relevant root options:

```text
FEATURE_WEBRT_ECHO_CANCELLATION
  release/store: ON

PM_PLUGIN_WEBRTC
  release/store: ON

FEATURE_VIDEO_WEBRTC
  exported as ON, but only applied inside FEATURE_VIDEO_STREAM

FEATURE_VIDEO_STREAM
  release/store feature manifest: OFF

FEATURE_VIDEO_WEBRTC_LIBDATACHANNEL
  default and shipped value: OFF
```

Evidence:

- `CMakePresets.json` enables `PM_PLUGIN_WEBRTC` in release presets.
- `dist/shared/features.json` and the Store package feature file report
  `FEATURE_VIDEO_STREAM=false`,
  `FEATURE_VIDEO_WEBRTC=true`,
  `FEATURE_VIDEO_WEBRTC_LIBDATACHANNEL=false`, and
  `FEATURE_WEBRT_ECHO_CANCELLATION=true`.
- `CMakeLists.txt` only compiles `streaming_session.cpp` and
  `pm_image_cmd_video_streaming.cpp` inside the video-stream gate.

The project does not set libdatachannel's effective `USE_NICE`, `USE_JUICE`,
`USE_SYSTEM_USRSCTP`, `USE_SYSTEM_SRTP`, TLS or media options. Those must be
chosen and locked explicitly before the optional dependency becomes a supported
backend; relying on upstream defaults would make the dependency graph unstable.

Platform status:

- Windows desktop: APM READY; native peer MISSING.
- Windows Store/MSIX: APM packaged; native peer MISSING.
- macOS/Linux: the root build does not provide the APM backend or native peer;
  echo cancellation falls back when the backend is unavailable.

## 7. ICE/STUN/TURN status

| Capability | Status |
|---|---|
| Host ICE candidates | MISSING natively |
| STUN | MISSING |
| TURN/UDP | MISSING |
| TURN/TCP | MISSING |
| TURN/TLS | MISSING |
| Trickle ICE transport schema | PARTIAL |
| Trickle/non-trickle ICE execution | MISSING |

`apps/remote/src/PrototypeApp.tsx` constructs its browser peer with an empty
`iceServers` list. The native code only parses and queues candidate-shaped JSON.
No settings, server-provided credentials, environment configuration or hard-coded
STUN/TURN service was found.

Therefore TURN does not work today, and no NAT/firewall traversal claim can be
made.

## 8. Signaling architecture

The prototype uses token-protected HTTP:

```text
POST /signal
  parse JSON
  normalize type/from/payload
  append to mutex-protected deque (maximum 256)

GET /signal?since=N&waitMs=M
  long-poll queued messages
```

Supported schema names are `offer`, `answer`, `candidate`, `bye`, `agentEvent`
and `control`. This vocabulary is generic enough to reuse as an initial signaling
envelope, but the implementation is not a router:

- it does not bind messages to a PeerConnection;
- it defaults the sender to `client`;
- it has one process-local queue;
- it has no authenticated peer identity or authorization;
- it has no per-session/per-recipient isolation;
- it has no replay protection, durable delivery or distributed routing.

The transport is therefore READY only as a laboratory HTTP mailbox and MISSING
as production peer signaling.

## 9. Audio/video/screen status

### Audio

- Capture/device handling: READY through the existing Tanit/miniaudio stack.
- AEC/NS/AGC: READY on Windows through WebRTC APM.
- Existing realtime transport: WebSocket to an AI/realtime provider.
- Opus, RTP/RTCP, send/receive WebRTC audio tracks and peer playout: MISSING.

APM is reusable as media preprocessing, but it is not an audio WebRTC session and
must remain independent of peer lifetime.

### Video

- Webcam capture: READY on Windows through Media Foundation.
- Existing recording/file encode paths: reusable input infrastructure.
- WebRTC video track, RTP packetization, RTCP feedback, NACK/PLI/FIR and browser
  delivery: MISSING.
- `EncodedVideoTrackSink` has no implementation.

### Screen sharing

- Screen/window enumeration and capture: READY in the Windows stream prototype.
- Current remote preview: MJPEG over HTTP.
- WebRTC screen track and renegotiation: MISSING.

## 10. Threading and lifetime concerns

Existing implemented paths have bounded ownership:

- `ApmHandle` serializes processing through a mutex and is explicitly destroyed.
- `cmd_video_stream()` owns a listener thread, capture runtime and shared state;
  shutdown stops producers before joining the listener.
- capture and HTTP state use separate mutexes/condition variables.

There is no native WebRTC callback model to audit. A new peer layer must define:

- one serialized peer/signaling executor;
- callback-to-owner/UI dispatch rules;
- weak/cancellation-safe callback capture;
- channel/track shutdown before peer destruction;
- no blocking, UI work or unbounded allocation on audio/video callbacks;
- deterministic destruction for long-lived and multiple simultaneous sessions.

These are prerequisites, not properties of the current implementation.

## 11. Multi-instance constraints

The current stream command is process-local. Each invocation may bind its own
TCP port and expose a separate generated token and hard-coded `default` stream
identity. It has no elected owner, shared machine identity or cross-process
session registry.

Multiple APM processors are safe at the handle level, but that does not solve
network ownership. A machine-level `LocalPeerOwner` must be layered over the
existing scheduler/local-IPC election precedent; the stream prototype itself
must not become the implicit singleton.

Concrete reusable election pieces are:

- `src/tasks/scheduler_platform_win32.cpp`
  - `try_scheduler_leader_lock()` combines a named `Local\...` mutex with a
    `leader.lock` file lock.
- `src/tasks/scheduler_claim.hpp/.cpp`
  - `SchedulerLeaderClaim`, a 2000 ms freshness window and priority-based
    cooperative yield.
- `src/tasks/scheduler_host.cpp`
  - `SchedulerHost::step()` heartbeats, yields and acquires leadership.
- `src/tasks/scheduler_lease.hpp/.cpp`
  - `CommandLease` supplies per-resource exclusion under `run-ipc/scheduler/`.
- `src/core/cmd_ipc.cpp`
  - per-process descriptors and ephemeral loopback listeners provide a starting
    point for non-owner-to-owner local communication.

The future owner needs a new broker/owner epoch and deterministic tie-breaking.
The scheduler's equal-priority UI claim can be resolved by whichever process wins
the mutex; that is sufficient for mutual exclusion but not a stable machine-peer
identity or observable handover protocol.

## 12. MSIX/Store constraints

Verified existing package evidence:

- `store-tanit-msix-release` inherits the normal release preset and enables
  `PM_STORE_BUILD`;
- `releases/tanit-store/store-package/plugins/webrtc/` contains
  `tanit-webrtc-plugin.dll` and a manifest advertising only `audio.webrtc`;
- the package feature manifest keeps libdatachannel disabled and video streaming
  disabled;
- `AppxManifest.xml` targets `Windows.Desktop`, uses
  `Windows.FullTrustApplication`, and declares `internetClient`,
  `runFullTrust`, webcam and microphone capabilities.

This proves that the APM plugin is packaged. It does **not** prove ICE, UDP,
STUN/TURN, inbound LAN listening, firewall behavior or DataChannels, because none
of that native transport is present.

No WebRTC-specific `PM_STORE_BUILD` compile-out was found. However, unchanged
Store compatibility is UNKNOWN until a peer backend is added and tested in the
installed MSIX. The final manifest/network-capability and firewall requirements
must be validated against the chosen listener/ICE behavior rather than inferred
from full-trust packaging.

The manifest exposes six full-trust application entries over `tanit.exe` and
`tanit-cli.exe`. They can produce concurrent processes sharing the
`%APPDATA%\PolyMech\tanit-chat` profile; the package does not impose
single-instance ownership. It also does not currently declare
`privateNetworkClientServer` or `internetClientServer`. Whether either capability
is required for the chosen full-trust peer/listener implementation is a runtime
and Store-certification question, not something established by this static
audit.

The packaged artifact observations in this audit refer to existing staged files;
no build was run as part of the audit.

## 13. Missing prerequisites

Before implementing LAN/support chat:

1. Choose and pin the peer backend and its complete dependency/options matrix.
2. Add a real native PeerConnection wrapper with SDP, trickle ICE, connection
   states, restart/recreate and deterministic shutdown.
3. Add native DataChannel creation/reception and open/close/error/message/
   backpressure handling.
4. Bind signaling to peer/session IDs, authenticated identity and authorization.
5. Add configurable STUN/TURN with short-lived server-issued credentials.
6. Define the callback executor and lifetime model.
7. Add multi-peer and multi-process ownership support.
8. Add channel-only, channel-plus-media and late-track renegotiation tests.
9. Verify Windows desktop and installed-MSIX networking separately.
10. Update dependency notices and pin the floating Abseil revision.

Media work additionally requires real RTP/codec track adapters; existing
capture/APM code is reusable but is not transport glue.

## 14. Recommended refactor boundary

This is a **new generic transport boundary**, not an extraction of an existing
audio call:

```text
RtcPeer
  owns native peer backend
  owns SDP and ICE state
  owns DataChannels and media-track attachment
  emits serialized lifecycle/channel/track events
  has no chat, support, broker or audio-device policy

PeerSession
  owns identity, trust, capabilities and application protocol
  maps control/chat/realtime/bulk channels
  requests tracks without owning capture implementations

Existing reusable adapters
  WebRTC APM -> optional audio preprocessing
  AudioInput/output -> future audio source/sink
  CaptureSource -> future video/screen source
  HTTP signal schema -> possible bootstrap envelope after hardening
```

Do not make `PeerConnection` lifetime equal audio-call lifetime. Do not put the
peer implementation in `tanit-webrtc-plugin.dll` as it exists today: that plugin
has a narrow `PmWebrtcApmApi` contract and should remain an audio DSP provider.
A new plugin/target may be appropriate, but it needs a separate transport ABI.

## Direct answers

- **Can current Tanit establish a DataChannel-only PeerConnection?** No.
- **Can audio and DataChannels coexist on one current PeerConnection?** No;
  there is no native PeerConnection. The proposed backend should support this.
- **Is usrsctp present and enabled?** No in the effective build/package.
- **Can tracks be added later?** No current implementation exists for tracks or
  renegotiation.
- **Is signaling generic enough?** The JSON names are generic; the mailbox,
  identity, routing and peer binding are not production-ready.
- **Does TURN work?** No.
- **Can current peer functionality run unchanged in Store/MSIX?** There is no
  peer functionality to carry over. Only APM packaging is verified.
- **What must be extracted first?** Preserve/reuse APM, capture and signaling
  schema helpers; introduce the generic `RtcPeer` transport and `PeerSession`
  boundary rather than attempting to extract a nonexistent audio peer.


## References

https://git.jami.net/savoirfairelinux/jami-client-android/-/tree/master/jami-android/app/src?ref_type=heads
