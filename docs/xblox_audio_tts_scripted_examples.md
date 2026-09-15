##### Examples

**SRT → 48 kHz voice-over WAV** (provider / voice from App Settings when omitted)

```json
{
  "kind": "audioTtsScripted",
  "input": "captions.srt",
  "outputPath": "voiceover.wav",
  "storeAs": "voiceoverPath"
}
```

**Pin ElevenLabs narration voice**

```json
{
  "kind": "audioTtsScripted",
  "input": "captions.srt",
  "outputPath": "voiceover.wav",
  "provider": "elevenlabs",
  "model": "eleven_multilingual_v2",
  "voice": "tLK6fPv15M0oKv4V3ACR",
  "overflow": "resolve",
  "stability": 0.45,
  "style": 0.2,
  "storeAs": "voiceoverPath"
}
```

`input` may be an SRT/VTT path or transcribe JSON (`segments`). Output is
always 48 kHz mono PCM. A `{stem}.voiceover.json` report is written next to
the WAV. Does not play; chain `audioPlay` if you want speakers.
