---
title: Tanit on your network
slug: tanit-network
description: The Android app keeps its own recorders and viewers. Paired with a computer, chat runs on that desktop, and the computer's cameras, screen, microphones, and speakers can be watched or recorded.
tags: [tanit, android, lan, pairing, tailscale, agent, video, audio, streaming]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# The phone, plus the computer

Tanit on Android already records the phone's screen, takes a voice note, and
chats on its own. Pair it with a Tanit computer and the phone also uses that
machine.

The agent runs on the computer: the model, the tools, and the files stay
there. The computer's cameras, monitors, and windows can be watched, or
recorded to a file on the desk. Its microphones and whatever it is playing
can be listened to on the phone, or saved into a phone recording.

The phone does not upload its screen or its microphone to the computer.
A screen recording stays a recording of the phone. A voice note can be the
computer's audio, the phone's mic, or both, and the mic mix happens on the
phone.

> Available capabilities can vary by edition and organization policy.

---

## Who it's for

- Someone who wants the assistant on the phone, and the heavy work on a
  computer that already has the models, files, and tools.
- A recording of the phone's screen that should also contain a meeting,
  a browser tab, or a microphone plugged into the computer.
- A voice note of what the computer is playing, without holding the phone
  up to the speakers.
- Watching a camera, a monitor, or one window on the computer, or saving
  that picture to a file there.

---

## Pair the phone once

On the computer, start the agent and open a pairing window. The QR is a
one-time ticket. The phone checks the computer's identity, then stores a
token of its own. Scanning again rotates that token.

```sh
tanit-cli llm agent --serve --lan --pair --pair-scopes chat,files,tools,video,audio
```

Leave `--pair-scopes` off and the phone gets chat, files, and tools. Video
and audio are separate grants. Ask for them on the ticket when the phone
should watch a camera or record the computer's sound.

```sh
tanit-cli llm agent --lan-devices
tanit-cli llm agent --lan-revoke <id>
```

The phone connects to the TLS address from the QR, not to the plain HTTP
port. The same computer can be reached later by a saved address, including
one on a tailnet, without pairing again. A new certificate means pairing
again. Do not publish this server on the public internet.

Chat on the phone then has two homes. A cloud preset talks to that account.
The desktop preset talks to the paired computer. Discovery uses the paired
computer either way: screen and voice recording can take its audio without
switching the chat preset.

---

## On another network

Discovery on the local Wi-Fi uses a multicast announcement. That
announcement stays on the local link. A phone on mobile data can ping the
computer through Tailscale and still see an empty Discover list, because
Tailscale carries ordinary connections, not that announcement.

Start the computer while Tailscale is already connected. The server prints
every address it will accept, including the `100.x` address, and the TLS
port. That port is the HTTP port plus one. A server on 8090 is reached at
`https://…:8091`. The fingerprint printed next to those addresses is the
computer's identity. The name is only how to find it.

On the phone, open Discover and use one of these:

- The MagicDNS name, `https://<computer>.<tailnet>.ts.net`. With no port,
  the phone also tries the TLS port above. Port 443 is empty unless you
  put Tailscale Serve in front of the server.
- The tailnet address with that same TLS port,
  `https://100.x.y.z:8091`.

A name that answers is saved. The next Discover tries saved addresses and
the local Wi-Fi search together, so the computer shows up without waiting
for the local announcement. The saved row is still the paired computer:
the phone checks the certificate against the fingerprint. Being on the
tailnet does not grant chat, files, or the camera.

Tailscale Serve is the other way onto a computer that only listens on
localhost. It gives the MagicDNS name a normal certificate. Leave Funnel
off. Funnel publishes the server on the public internet.

```sh
tailscale serve --bg http://127.0.0.1:8090
```

Use the `https://…ts.net` address Serve prints. The phone stores that name
the same way it stores a TLS address from the QR.

If the name answers on this computer and the phone still reports it
unreachable, allow the TLS port through Windows Firewall on the Tailscale
adapter. Ping only shows that the tunnel is up.

---

## The agent stays on the computer

The phone sends the conversation. The computer runs the turn: the model,
the tools, and the memory of that chat. Answers, tool steps, and files the
agent wrote come back to the phone.

Folders you mark as shared on the computer show up in the phone's chat.
The phone can open those files. It does not see the rest of the disk.

That is the part the phone cannot do alone. A phone chat preset can still
talk to a cloud model. It does not have the computer's tools or the
computer's folders until this serve process is paired.

---

## Audio: listen, or record it on the phone

The computer lists its microphones and its outputs (what it is playing).
The phone picks any of those. Each one has a level and a gain. The computer
applies the gains and sums them into **one** stream. Moving a gain does not
restart the capture.

On the phone that stream is used in two ways:

- **Listen.** Speaker plays it as it arrives. Gain at the centre is
  pass-through. Gain at zero is quiet. This is monitoring, not a second
  recording.
- **Record.** Screen Recorder and Voice Recorder can save that stream.
  Screen Recorder puts it in the phone's screen video. Voice Recorder
  writes a take. The phone's own microphone can be mixed in on the phone.
  That mic is not sent to the computer.

One source still works. Several microphones and outputs need the mix on
the computer (`bus` in the source list). Until that build is running,
the phone records a single device.

List the names on the computer. The phone matches those names.

```sh
tanit-cli audio info
tanit-cli audio info --playback
```

The phone calls the same serve process. From the computer, the list and a
mix look like this (default HTTP port 8090; set a serve key if you bound
one):

```sh
curl -s http://127.0.0.1:8090/v1/audio/sources
curl -s -X POST http://127.0.0.1:8090/v1/audio/start -H "content-type: application/json" -d "{\"input\":\"mix\",\"sources\":[{\"spec\":\"mic:Yeti\",\"gain\":1},{\"spec\":\"loopback:Speakers\",\"gain\":0.8}]}"
```

Use the `spec` strings from the list. Gain runs from 0 to 2. Post the same
specs again to `/v1/audio/source` to change gains without reopening the
devices. `/v1/audio/stream` is the raw audio the phone records or plays.
`/v1/audio/stop` lets the devices go.

---

## Video: watch it, or record it on the computer

The same serve process can show a camera, a monitor, or one window. Nothing
is captured until a client asks. One picture at a time. Several viewers can
watch that same picture.

```sh
curl -s http://127.0.0.1:8090/v1/video/sources
curl -s -X POST http://127.0.0.1:8090/v1/video/start -H "content-type: application/json" -d "{\"input\":\"screen:0\"}"
```

Open `http://127.0.0.1:8090/v1/video/mjpeg` to watch. Stop with
`/v1/video/stop`. A `spec` from the list is a camera id, a camera name, or
a screen (`screen:0`, or `screen:0:hwnd=` / `screen:0:wintitle=` for one
window). The phone needs the `video` scope to call these routes.

To save that picture as a file on the computer, record it there instead of
only streaming it:

```sh
tanit-cli video info
tanit-cli video record --input screen:0 --dst walkthrough.mp4
tanit-cli video record --input "screen:0:wintitle=Chrome" --dst browser.mp4
```

A separate preview process is `video stream`. The paired phone does not
need it; the agent serve already carries the picture.

```sh
tanit-cli video stream --server --input screen:0 --bind 127.0.0.1 --open
```

The phone's Screen Recorder is not this stream. It records the phone's
screen, with the computer's audio when you pick a desktop source. The
computer's camera and screen are watched or recorded on the computer.

---

## What stays on the phone

| On the phone alone | With a paired computer |
|:-------------------|:-----------------------|
| Chat with a cloud preset | Chat runs on the computer's agent, tools, and shared folders |
| Screen recording of the phone | The same recording can include the computer's microphones and outputs |
| Voice note from the phone mic | A voice note of the computer, or the computer plus the phone mic |
| — | Watch or record a camera, monitor, or window on the computer |

Pairing does not move the phone's files, screen, or microphone onto the
computer. It lets the phone use what the computer already has.
