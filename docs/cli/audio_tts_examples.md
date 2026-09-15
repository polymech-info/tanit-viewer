##### Examples

`audio tts` supports direct ElevenLabs, the Tanit speech proxy, and local
VibeVoice or MOSS synthesis. Provider credentials can come from App Settings;
use `--api-key` only when overriding them for one command.

**ElevenLabs — stream to the default speakers**

```sh
tanit-cli audio tts --provider elevenlabs \
  --voice-id tLK6fPv15M0oKv4V3ACR \
  --model-id eleven_v3 \
  --text "Hello from ElevenLabs."
```

With no `--dst`, playback uses the low-latency streaming path. The API key is
resolved from App Settings or `ELEVENLABS_API_KEY`.

**ElevenLabs — save MP3 without playing**

```sh
tanit-cli audio tts --provider elevenlabs \
  --voice-id tLK6fPv15M0oKv4V3ACR \
  --model-id eleven_v3 \
  --text narration.md --dst narration.mp3 --no-play
```

Use `--dst narration.wav --format pcm_44100` for PCM WAV. Optional
`--stability`, `--similarity-boost`, and `--style` flags override the selected
voice settings.

**Tanit speech proxy**

```sh
tanit-cli audio tts --provider tanit \
  --model-id pixlwiz-speech \
  --text "Synthesize this through the configured Tanit service."
```

The proxy uses the provider credentials from App Settings. Add
`--dst speech.mp3 --no-play` to save instead of playing.

**Local VibeVoice**

```sh
tanit-cli audio tts --provider vibevoice \
  --model-id models/vibevoice-realtime-0.5B-q8_0.gguf \
  --tokenizer models/tokenizer.gguf \
  --voice-id models/voice-en-Carter_man.gguf \
  --text "Hello from VibeVoice."
```

VibeVoice runs locally and requires its model, tokenizer, and compatible voice
GGUF. Its 1.5B voice-clone path accepts `--ref-audio` instead of a voice GGUF.

##### MOSS-TTS-Nano

MOSS runs locally and does not need an API key. The installed model bundle and
default `ref-en.wav` are discovered automatically.

**Speak with the default reference voice**

```sh
tanit-cli audio tts --provider moss --text "Hello from Moss. How are you?"
```

**Save without playing**

```sh
tanit-cli audio tts --provider moss --text "Your export is ready." --dst ready.wav --no-play
```

MOSS currently writes 48 kHz stereo WAV. Use a `.wav` destination; `--format`
does not transcode local MOSS output.

**Clone a voice from a reference WAV**

```sh
tanit-cli audio tts --provider moss --text "This uses the reference speaker." --ref-audio speaker.wav
```

Use a clean speech recording with little background noise. The reference is
encoded once and cached while the local engine remains loaded.

**Read text from a file**

```sh
tanit-cli audio tts --provider moss --text announcement.md --dst announcement.wav --no-play
```

When `--text` names a readable text or Markdown file, Tanit loads and prepares
its contents before synthesis.

**Use an explicit model bundle**

```sh
tanit-cli audio tts --provider moss \
  --model-id models/moss-tts-nano/moss-tts-nano.gguf \
  --codec models/moss-tts-nano/moss-audio-tokenizer-nano.gguf \
  --tokenizer models/moss-tts-nano/moss-nano-tokenizer.gguf \
  --ref-audio models/moss-tts-nano/ref-en.wav \
  --text "Local synthesis with explicit model paths."
```

Normally these paths are unnecessary. Override them when testing another
installed Nano bundle. MOSS-TTS Local v1.5 models are not compatible with this
provider.

**CPU fallback**

PowerShell:

```powershell
$env:MOSS_TTS_BACKEND = "cpu"
tanit-cli audio tts --provider moss --text "Run this on the CPU."
```

The packaged CUDA build selects the GPU by default when available. CPU is
slower but uses the same Nano model and command path.

MOSS requires `moss-tts.dll` plus the three Nano GGUF files. If any component
is missing, the command reports the expected installed paths without falling
back to a cloud provider.

##### Reverse direction — local speech to text

Use the `whisper` provider to transcribe locally with whisper.cpp. No API key
or network connection is required.

**Microphone → transcript**

```sh
tanit-cli audio record --input-source mic \
  --provider whisper --model models/ggml-base.en.bin \
  --stt --language en --text-out transcript.md
```

Speak into the default microphone and press Ctrl+C to stop. Add `--dst
recording.wav` to keep the captured audio as well as the transcript.

**Existing WAV → transcript**

```sh
tanit-cli audio record --from-wav recording.wav \
  --provider whisper --model models/ggml-base.en.bin \
  --stt --language en --text-out transcript.md
```

Add `--json` for structured stdout. The model can also be omitted when a local
Whisper model is already configured in App Settings.
