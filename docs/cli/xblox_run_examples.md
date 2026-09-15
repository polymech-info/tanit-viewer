#### XBlox diagram generation

Standalone SVG (stdout):

```bash
tanit-cli xblox run --src dist/shared/xblox/stt-journal-ex.xblox --diagram > diagram.svg
```

Write `.svg` / `.png` files directly (no markdown):

```bash
tanit-cli xblox run --src dist/shared/xblox/stt-journal-ex.xblox --diagram --diagram-dst diagram.svg
tanit-cli xblox run --src dist/shared/xblox/stt-journal-ex.xblox --diagram --diagram-png diagram.png
```

Embed in markdown sidecar (with context bullets + title):

```bash
tanit-cli xblox run --src script.xblox --md --diagram > script.en.md
tanit-cli xblox run --src script.xblox --md --diagram --mermaid-direction LR
```

Custom styles and render knobs:

```bash
tanit-cli xblox run --src script.xblox --diagram \
  --styles "${TANIT_SHARED}/xblox-diagram-constants.json" \
  --show-arrows true \
  --show-links true \
  --show-disabled false \
  --show-variables true \
  --show-groups true \
  --humanize-node-names true \
  --show-variable-delimiters false \
  --variable-link-style unicode \
  --variable-input-style at \
  --diagram-dst ./out/diagram.svg
```

Variable formatting knobs in `render`:
- `variableLinkStyle`: `unicode` (→), `arrow` (->), `colon`, `dot`, `equals`, `none`
- `variableInputStyle`: `at` (@name), `parens`, `bracket`, `none`
- `node.variableOperatorFill`: muted color for separators (default `#BBBBBB`)

`render.showVariableDelimiters=false` shows plain variable names (still tinted via `node.variableFill`). Styles JSON defaults apply; CLI flags override when passed.
