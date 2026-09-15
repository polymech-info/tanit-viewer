##### Examples

Hand-picked patterns beyond the auto-generated flags above.

Path roles: `--source` / `--dst` are whole JSON **files**; `--selector` is a **jq** leaf picker (JSONPath-ish `$.a[*].b` → `.a[].b`); `--target` is an optional **sibling key** (omit = in-place overwrite). Provider flags (`--router`, `--model`, `--api-key`, `--preset`, …) work on `each` or on the parent: `llm agent --router openai each …`.

### Primary case: `dist/data/commands.json`

Ribbon UI copy lives under `.ribbon.groups[]` — item `label` / `description` / `tooltip`, nested submenu items (`.items[].items[]?`), group titles, and a few `extension_maps[].description` strings. Typical shape after a multi-language pass:

```json
{
  "label": "Home",
  "label_de": "Startseite",
  "label_es": "Inicio",
  "description": "Open the home panel",
  "description_de": "…",
  "description_es": "…"
}
```

**Batch DE + ES** (recommended): `npm run build:post:commands-i18n` runs every field/selector below with `--merge-json`. Plan only: `npm run build:post:commands-i18n:dry`.

**One field, multi-language** (`--merge-json`): LLM returns a checked JSON **object**; keys hard-overwrite-merge onto the leaf’s parent. `--target` is ignored. Identical strings coalesce in-process (`--no-cache` disables).

```sh
tanit-cli llm agent each \
  -i dist/data/commands.json \
  --selector '.ribbon.groups[].items[].label' \
  --merge-json \
  -o dist/data/commands.json \
  -p 'Reply with ONLY a JSON object (no markdown): {"label_de":"…","label_es":"…"} — German and Spanish UI translations of the text.' \
  --concurrency 4 \
  --router openai
```

**Other selectors** used by the batch script (optional `[]?` where nested arrays may be missing):

```text
.ribbon.groups[].items[].label
.ribbon.groups[].items[].items[]?.label
.ribbon.groups[].label
.ribbon.groups[].items[].description
.ribbon.groups[].items[].items[]?.description
.ribbon.groups[].items[].extension_maps[]?.description
.ribbon.groups[].description
.ribbon.groups[].items[].tooltip
```

For `description` / `tooltip`, ask for `description_de`/`description_es` or `tooltip_de`/`tooltip_es` in the prompt (same merge rules).

**Single sibling language** (no merge object — one string per leaf):

```sh
tanit-cli llm agent each \
  -i dist/data/commands.json \
  --selector '.ribbon.groups[].items[].label' \
  --target label_de \
  -o dist/data/commands.json \
  -p 'Translate to German. Reply with ONLY the German label. No quotes. No explanation.' \
  --concurrency 4 \
  --router openai
```

**Dry-run on the same shape** (offline; `json-stub` emits `label_de`/`label_fr` for merge smoke tests):

```sh
tanit-cli llm agent each \
  -i dist/data/commands.json \
  --selector '.ribbon.groups[].items[].label' \
  --merge-json \
  -o stemp/commands-i18n/labels-stub.json \
  --dry-run --transform json-stub --json
```

Tiny fixture with the same ribbon nesting (CI / quick probes): `tests/orchestrator/fixtures/iterator-commands-mini.json`.

### Changelog leaves (one `each` pass)

`npm run build:post:changelog` discovers surface bundles, reads headers / labels / CLI registrations into `stemp/changelog-each/phrase.json`, and runs **one** `each` pass. Prompt is `releases/web-docs/changelog.instructions.txt`. No `--router` / `--model`. Merge is additive.

```sh
tanit-cli llm agent each \
  -i stemp/changelog-each/phrase.json \
  --selector '.items[].evidence' \
  --merge-json \
  -o stemp/changelog-each/phrase.out.json \
  -p "$(cat releases/web-docs/changelog.instructions.txt)

Reply with ONLY the JSON object." \
  --concurrency 4 \
  --no-cache
```

Each leaf returns `{"actions":[{surface,action,kind,text},…]}` or `{"actions":[]}`. Same-day action metadata may merge; dates never compete.
