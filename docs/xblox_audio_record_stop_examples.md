##### Examples

```json
{
  "kind": "audioRecordStop",
  "session": "${recordSession}",
  "outputPath": "${KNOWNFOLDER:Desktop}/session.m4a",
  "storeAs": "audioPath"
}
```

Finalizes AAC on Windows or WAV elsewhere. `outputPath` overrides the path from `audioRecordStart` when set.
