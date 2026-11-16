##### Examples

Live speech-to-speech translation (interpreter). Mic → `/v1/realtime/translations` →
speakers. Not a voice agent: no tools, no turns, no `response.create`. Stop with
Ctrl+C or `--duration-ms` (the CLI prints the stop reason).

**Tanit proxy (recommended)**

```sh
tanit-cli audio translate --router tanit --model tanit-realtime-translate --lang es
```

Uses the chat Tanit credentials from App Settings. Alias bills through LiteLLM
(`tanit-realtime-translate` → `openai/gpt-realtime-translate`).

**Bounded smoke (JSON transcripts)**

```sh
tanit-cli audio translate --router tanit --model tanit-realtime-translate \
  --lang es --duration-ms 30000 --json
```

Emits `{"type":"in"|"out"|"stopped","…"}` lines on stdout. A 30s bound stops with
reason `duration-ms` — that is intentional, not a hang.

**Direct OpenAI**

```sh
tanit-cli audio translate --router openai --model gpt-realtime-translate --lang fr
```

**Device + noise**

```sh
tanit-cli audio translate --router tanit --lang de \
  --mic Yeti --speaker Headphones --noise far_field
```

Empty `--mic` / `--speaker` use Audio & Video settings, then the system default.
`--noise off` disables input noise reduction (`near_field` is the default).

**Conversational playback (local VAD)**

```sh
tanit-cli audio translate --router tanit --lang es \
  --playback conversational --silence-ms 700 \
  --playback-buffer-ms 3000 --vad-log --log-level debug
```

The translation stream stays continuous. Translated PCM is held until WebRTC VAD
(or RMS fallback) sees `--silence-ms` of end-of-speech silence (200–2000), then
released to the speakers. `--playback-buffer-ms` (0–5000, default 3000) is the
lead before that burst starts. It is not armed again while audio is still
playing. Prefer `--silence-ms 700`–`1000` so a mid-sentence pause does not
release early.

While translated audio is queued or was rendered in the last 500 ms, the mic is
replaced with silence on the wire. A turn that already started is still sent
until `speech_end`. Provider digital silence is discarded, so it cannot hold
the speaker queue open. `--playback simultaneous` (default) plays as received,
with a short ~200 ms lead.

`--log-level debug` prints the gate line (`uplink=open` / `uplink=silence`,
`queued_ms`, `priming`, `playout underruns`, `refill_gaps`). The first
`session.updated` logs `warmup_ms=`.

**Switch the output language on the same session**

```sh
tanit-cli audio translate --router tanit --lang es \
  --switch-lang de --switch-after-ms 1200 \
  --playback conversational --json --log-level debug
```

`--switch-lang` sends `session.update`. It does not reconnect and does not
flush the playback queue. Stdout gains `{"type":"language","text":"de"}`.
The log then shows `language=de warmup_ms=` for that update. The initial
ready line is `warmup_ms=` with `lang=es`.

**Battle-test with a TTS WAV (no mic)**

```sh
tanit-cli audio tts --provider tanit --text "Hello, how are you today?" \
  --dst %TEMP%\tr-en.wav --no-play --format pcm_44100

tanit-cli audio translate --router tanit --lang es \
  --src %TEMP%\tr-en.wav --playback conversational --silence-ms 700 \
  --vad-log --json
```

`--src` paces the file in realtime (16 kHz mono after decode). Without `--loop`,
the session stops shortly after EOF (`src-eof`). Use `--loop --duration-ms 60000`
for a longer paced soak.

###### Notes

- Target language is a BCP-47 / ISO code (`es`, `fr`, `de`, `ja`, …).
- Audio is always 24 kHz PCM16 on the wire; capture is resampled from the mic rate.
- Transcript deltas keep spaces. A missing boundary between two words is filled.
  `session.input_transcript.done` and `session.output_transcript.done` are the
  punctuated utterance.
- Prefer Tanit in product paths so usage shows up on the proxy spend dashboards.
- Do not call `session.close` at each silence — that ends the whole session.
- `--cancel-after-ms` trips the same latch as Ctrl+C. On Windows, sending
  Ctrl+Break from a test runner kills the process before that drain.
