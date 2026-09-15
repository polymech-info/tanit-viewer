# Audio record — formats, buffering, and STT

Reference companion for [`audio record`](cli.md#audio-record) in the CLI docs.

## Output format (`--dst` extension)

| Extension | Format | Platform | Buffering |
|-----------|--------|----------|-----------|
| `.wav` | PCM s16le (default **48 kHz stereo**) | All | ~30 s in RAM, then PCM **spills** to a temp raw file; merged at stop |
| `.m4a`, `.aac`, `.mp4` | AAC-LC (**48 kHz**, 192 kbps) | **Windows** (Media Foundation) | Stream-encoded during capture (no full-RAM PCM buffer) |

The extension selects the container/codec. There is no separate `--format` flag.

### WAV spill (long recordings)

At 48 kHz stereo, PCM uses about **192 KB/s**. Keeping ~30 s in RAM caps working set near **6 MB** regardless of total duration. When spill is active, the session banner prints `buffer: spill active`.

### AAC on Windows

AAC output uses the same Media Foundation encoder as video desktop-audio mux. Non-48 kHz `--sample-rate` values are **resampled to 48 kHz** before encode.

On Linux/macOS, `.m4a`/`.aac` exits with an error — use `.wav` or transcode externally.

## Capture sources

| `--input-source` | Meaning |
|------------------|---------|
| `mic` (default) | Microphone |
| `desktop` | System loopback (WASAPI render device) |
| `mix` | Mic + desktop (use `--mic-gain` / `--desktop-gain`) |

List devices: `tanit-cli audio info`

## Speech-to-text

| Mode | Providers | Output file |
|------|-----------|-------------|
| Live | `elevenlabs` (Scribe realtime) | `--text-out` and/or stdout |
| Batch | `whisper` (local), `tanit` (Whisper API) | Transcribes `--dst` or temp WAV |

When `--dst` is `.m4a` and batch Whisper/tanit STT is requested, a **temporary WAV** is written for transcription and deleted afterward. Live ElevenLabs STT feeds from the capture callback directly.

## Diagnostics on `done`

- **capture** — captured frames vs wall-clock expected (should be ~100%)
- **levels** — peak/RMS dBFS and clipped sample count
- **file** — path and byte size

## Related XBlox blocks

See [Record Audio](xblox.md#record-audio) (`audioRecord`, `audioRecordStart`, `audioRecordStop`) — same extension rules on `outputPath`.
