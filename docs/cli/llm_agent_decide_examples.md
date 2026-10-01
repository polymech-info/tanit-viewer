##### Examples

Hand-picked patterns beyond the auto-generated flags above.

Path roles: `--source` / `--dst` are whole JSON **files**; `--questions` is a JSON object of choice / noul / score questions; `--selector` (or `--pairs`, or `--left` with `--right`) picks the values to judge. `--target` is the key that receives the answer object (default `decisions`). Omit the picker to judge the whole document as one state.

One request is one state plus many questions. That is the batch this endpoint accepts. `--chunk` (default 32) caps expanded questions per request. `--max-tokens` (default 24000) caps the estimated body so a large set stays under Jev's 32k context. One value is never split. A value that does not fit alone is rejected.

Instructions name `` `item` `` / `` `item.field` `` for `--selector`, and `` `pair.left` `` / `` `pair.right` `` / `` `pair` `` for pairs. The model is `~typesafe/jev-latest` when `--model` is omitted. OpenRouter credentials come from app settings when `--api-key` is omitted.

### Primary case: one question per selected object

`items[]` is the usual shape. Each object needs a string `id` (otherwise ids are `i0`, `i1`, …). Answers are written onto that object.

```json
{
  "items": [
    { "id": "a", "phrase": "resize all to 1980" },
    { "id": "b", "phrase": "what is the best free recorder?" }
  ]
}
```

```json
{
  "fit": {
    "type": "choice",
    "instructions": "The user asked `item.phrase`. Which fit is honest?",
    "criteria": {
      "direct": "One capability does the job",
      "composed": "Several capabilities together do the job",
      "editorial": "The evidence only sits next to the job"
    }
  },
  "supports": {
    "type": "noul",
    "instructions": "Can the product actually perform `item.phrase`?"
  }
}
```

```sh
tanit-cli llm agent decide \
  -i items.json \
  --questions questions.json \
  --selector '.items[]' \
  -o items.out.json \
  --json
```

Each item gains a `decisions` object: `fit.choice` and `supports.noul` (0..1). `--json` also prints request count, token usage, and the resolved model.

### Pairs

`--pairs` selects objects with `left` / `right` (or a 2-element array). `--left-key` / `--right-key` rename those fields. `--left` and `--right` zip two selectors; answers land on the parent of each left value.

```sh
tanit-cli llm agent decide \
  -i pairs.json \
  --questions pair-questions.json \
  --pairs '.items[]' \
  -o pairs.out.json \
  --dry-run
```

Pair questions may say `` `pair.left` `` and `` `pair.right` ``. `--dry-run` uses the stub: equal sides score as the same, everything else as different. No network.

### Whole document

No `--selector` and no pair flags. Questions are sent as written. The answer object is written at the root `--target`.

```sh
tanit-cli llm agent decide \
  -i doc.json \
  --questions questions.json \
  --target decisions \
  -o doc.out.json
```

### Large sets

Independent values are packed until the next one would pass `--chunk` or `--max-tokens`, then another request starts. The estimate is the JSON body length divided by 3. Pass `--max-tokens 0` to disable the ceiling.

```sh
tanit-cli llm agent decide \
  -i items.json \
  --questions questions.json \
  --selector '.items[]' \
  --chunk 32 \
  --max-tokens 24000 \
  -o items.out.json \
  --json
```

### Direct Jev

`--provider jev` sends the same JSON body and requires `--base-url`. `openai` is reserved and fails before the call.

```sh
tanit-cli llm agent decide \
  -i items.json \
  --questions questions.json \
  --selector '.items[]' \
  -o items.out.json \
  --provider jev \
  --base-url https://api.typesafe.ai \
  --api-key "$TYPESAFE_API_KEY"
```
