##### Examples

Hand-picked patterns beyond the auto-generated flags above.

**Desktop loopback → WAV** (48 kHz stereo default; PCM spills to disk after ~30 s in RAM)

```sh
tanit-cli audio record --input-source desktop --dst meeting.wav
```

**Timed capture**

```sh
tanit-cli audio record --input-source desktop --dst clip.wav --seconds 120
```

**Desktop → AAC/M4A** (Windows only; encoded during capture at 48 kHz)

```sh
tanit-cli audio record --input-source desktop --dst meeting.m4a
```

**Mic + desktop mix with gain**

```sh
tanit-cli audio record --input-source mix --mic-gain 0.8 --desktop-gain 1.0 --dst call.wav
```

**Custom format**

```sh
tanit-cli audio record --input-source desktop --dst voice.wav --sample-rate 44100 --channels 1
```

**Record + DeepFilterNet** (dry capture, then enhance; writes 48 kHz mono WAV). `--pf` alone also turns the filter on. `--model` is STT; the DFN tar is `--filter-model`. Use a `.wav` `--dst` (not `.m4a`).

```sh
tanit-cli audio record --dst rec.wav --filter deepfilter --pf
```

Existing file (no capture): `tanit-cli audio filter --input in.wav --dst out.wav --filter deepfilter --pf`

**Record + live STT transcript**

```sh
tanit-cli audio record --input-source mic --dst take.wav --stt --text-out take.md
```

**Record + SRT sidecar** (same wrap as xblox audioTranscribe; implies `--stt`). Writes `take.srt` next to the WAV. Use `--subtitle-format vtt`, `sbv`, or `all` for other YouTube sidecars; `--subtitle-path` overrides the stem.

```sh
tanit-cli audio record --input-source mic --dst take.wav --stt --subtitle-format srt
```

**Existing WAV → SRT**

```sh
tanit-cli audio record --from-wav take.wav --stt --subtitle-format srt
```

Feed the sidecar into `audio tts-scripted --srt take.srt --dst take.voiceover.wav`.

**Record to M4A + batch Whisper** (writes a temporary WAV for transcription, then removes it)

```sh
tanit-cli audio record --input-source desktop --dst meeting.m4a --provider whisper --model base.en --text-out meeting.md
```

On completion, check **capture** (frame ratio), **levels** (peak/RMS dBFS, clip count), and **file** size.

**Cooperative stop / status from another terminal**

```sh
tanit-cli audio record stop
tanit-cli audio record status --json
```
