##### Examples

Hand-picked patterns beyond the auto-generated flags above.

**Convert full document to Markdown** (writes `report.md` beside the PDF)

```sh
tanit-cli pdf md report.pdf
```

**Specific pages only**

```sh
tanit-cli pdf md report.pdf --pages 1-5
```

**Write Markdown to stdout**

```sh
tanit-cli pdf md report.pdf --stdout
```

**Dump intermediate representation (IR) as JSON**

```sh
tanit-cli pdf md report.pdf --json --stdout
```

**Per-page bundle** (Markdown pages + embedded figure PNGs)

```sh
tanit-cli pdf md manual.pdf --pages 1-10 --output-dir tests/pdf/ANCEL_BM700_Pro_User_Manual
```

Creates `page_N.md` files and `figures/page_N_fig_M.png` (embedded images + vector region crops — not full-page renders).

**Custom output path**

```sh
tanit-cli pdf md report.pdf -o output/notes.md
```

**Pipeline preset** (default is text + figures. `struct_overlay`, `ocr_fallback`, and `vlm_enrich` are still no-ops. OCR of empty-text pages is a CLI post-pass on `--pipe with-ocr` or `with-vlm`.)

```sh
tanit-cli pdf md report.pdf --pipe default
```

**Unlimited-OCR on a scanned page**

Download once. A later run skips `Unlimited-OCR-BF16.gguf` when the size matches and fetches `mmproj-Unlimited-OCR-F16.gguf` if it is missing. Both files stay in the same variant folder. Do not pass `--overwrite`.

```sh
tanit-cli hg download sahilchachra/Unlimited-OCR-GGUF --variant BF16
```

`--pipe with-vlm` (or `with-ocr`) renders a page and runs OCR only when that page has no extracted text. stderr shows `pdf md: page N llama model=...` for those pages. A text PDF does not load the GGUF. Empty `--prompt` is `<|grounding|>Convert the document to markdown.` Catalog id: `unlimited-ocr-bf16`.

```sh
tanit-cli pdf md scan.pdf --pages 1 --pipe with-vlm --provider llama \
  --model "D:/models/Unlimited-OCR-GGUF/BF16/Unlimited-OCR-BF16.gguf" \
  --max-tokens 4096 --stdout
```

Paddle ONNX instead of the VLM (needs `en_PP-OCRv3_det_infer.onnx`, rec ONNX, and `en_dict.txt`):

```sh
tanit-cli pdf md scan.pdf --pages 1 --pipe with-ocr --provider paddle --stdout
```

To OCR a page that already has a text layer, render it and use `understand` (see `understand_examples.md`). That command always runs the model.

**Encrypted PDF**

```sh
tanit-cli pdf md secure.pdf --password "secret"
```

**Smoke test file**

```sh
tanit-cli pdf md tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf --pages 1 --stdout
```
