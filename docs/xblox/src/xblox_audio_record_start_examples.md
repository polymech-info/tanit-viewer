##### Examples

Non-blocking session — pair with `audioRecordStop`. Set `outputPath` here or on stop (extension selects `.wav` vs `.m4a`).

```json
{
  "kind": "audioRecordStart",
  "inputSource": "desktop",
  "outputPath": "${KNOWNFOLDER:Desktop}/session.m4a",
  "storeAs": "recordSession"
}
```

See the **Record Audio** block overlays for format and spill notes.
