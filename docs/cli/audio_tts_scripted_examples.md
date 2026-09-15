##### Examples

Hand-picked patterns beyond the auto-generated flags above.

Scripted TTS places an SRT / VTT / transcribe-JSON script onto a **48 kHz mono**
WAV. It is a timed voice-over bed, not `audio tts` (speak a string) and not
dubbing. Provider, model, and voice fall back to App Settings.

**SRT → voice-over WAV**

```sh
tanit-cli audio tts-scripted --srt captions.srt --dst voiceover.wav
```

Also writes `voiceover.voiceover.json` (natural / used_gap / stretched /
regenerated / unresolved). `--srt` accepts `.srt`, `.vtt`, or JSON with
`segments` / `cues`.

**Record captions, then narrate**

```sh
tanit-cli audio record --input-source mic --dst take.wav --stt --subtitle-format srt
tanit-cli audio tts-scripted --srt take.srt --dst take.voiceover.wav
```

**Pin ElevenLabs voice**

```sh
tanit-cli audio tts-scripted --srt captions.srt --dst voiceover.wav \
  --provider elevenlabs --model-id eleven_multilingual_v2 \
  --voice-id tLK6fPv15M0oKv4V3ACR
```

**Overflow report on stdout**

```sh
tanit-cli audio tts-scripted --srt captions.srt --dst voiceover.wav --json
```

Default `--overflow resolve` uses the following gap, then mild time-compress
(≤12%), then ElevenLabs `speed` ≤ 1.2. `--overflow truncate` hard-cuts (power
user). `--cache-dir` defaults to `<output>/.voiceover-cache`.
