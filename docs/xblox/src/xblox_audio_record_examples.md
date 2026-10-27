##### Examples

**Timed mic → WAV** (default 48 kHz stereo; spills after ~30 s for longer takes)

```json
{
  "kind": "audioRecord",
  "inputSource": "mic",
  "durationMs": 10000,
  "outputPath": "${KNOWNFOLDER:Desktop}/note.wav",
  "storeAs": "audioPath"
}
```

**Desktop loopback → M4A** (Windows only)

```json
{
  "kind": "audioRecord",
  "inputSource": "desktop",
  "durationMs": 60000,
  "outputPath": "${KNOWNFOLDER:Desktop}/desktop_clip.m4a",
  "storeAs": "audioPath"
}
```

**Mix with gain**

```json
{
  "kind": "audioRecord",
  "inputSource": "mix",
  "micGain": 0.9,
  "desktopGain": 1.0,
  "durationMs": 30000,
  "outputPath": "call.wav"
}
```

**Start / stop session** (non-blocking; finalize on stop)

```json
{ "kind": "audioRecordStart", "inputSource": "desktop", "outputPath": "session.m4a", "storeAs": "recordSession" }
```

```json
{ "kind": "audioRecordStop", "session": "${recordSession}", "outputPath": "session.m4a", "storeAs": "audioPath" }
```

Block outputs include `peakDbfs`, `rmsDbfs`, `clippedSamples`, and `format` (`aac/m4a` or PCM string).
