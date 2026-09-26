##### Examples

Hand-picked patterns beyond the auto-generated flags above.

Local OCR check for one image. `llama` / `vlm` use slot `ocr` and need the language GGUF plus a sibling `*mmproj*.gguf`. `paddle` / `onnx` use the PP-OCR ONNX files. `--resize-width` (default 1600) shrinks the longest edge before llama, paddle, and cloud upload. Images already smaller stay at their own size. `--no-resize` sends the original file. Cloud providers also take `--api-key`.

**Full flow — download Unlimited-OCR, render a page, OCR the PNG**

`tanit-cli` is on `PATH`. Download skips a file whose size already matches, so this is safe to re-run. Do not pass `--overwrite`. The BF16 weights and `mmproj-Unlimited-OCR-F16.gguf` land in the same folder. Catalog id: `unlimited-ocr-bf16`.

```sh
tanit-cli hg download sahilchachra/Unlimited-OCR-GGUF --variant BF16

tanit-cli pdf render tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf \
  --pages 1 --format png -o tests/pdf/_ocr/page1.png

tanit-cli understand tests/pdf/_ocr/page1.png \
  --provider llama \
  --model "D:/models/Unlimited-OCR-GGUF/BF16/Unlimited-OCR-BF16.gguf" \
  --stdout
```

`understand` always runs the model. Empty `--prompt` is `<|grounding|>Convert the document to markdown.` Stderr prints `understand: resize WxH -> WxH` and then `understand: llama model=...`. Markdown is written beside the image as `page1.md` when `--stdout` is omitted. Pass `--resize-width 2048` for a larger page, or `--no-resize` to keep the PNG as rendered.

Smaller quant (new folder, still downloads the shared F16 mmproj):

```sh
tanit-cli hg download sahilchachra/Unlimited-OCR-GGUF --variant Q4_K_M
```

**Catalog id** (same files, after the sidecar is on disk)

```sh
tanit-cli understand tests/pdf/_ocr/page1.png \
  --provider llama --model unlimited-ocr-bf16 --stdout
```

**Paddle ONNX** (no GGUF; looks up `en_PP-OCRv3_det_infer.onnx`, `en_PP-OCRv4_rec_infer.onnx` or v3 rec, and `en_dict.txt`)

```sh
tanit-cli understand page.png --provider paddle --stdout
```

**PDF pages with no text layer** use `pdf md`, not `understand`. That command skips pages that already have extracted text. See `pdf_md_examples.md`.

```sh
tanit-cli pdf md scan.pdf --pages 1 --pipe with-vlm --provider llama \
  --model "D:/models/Unlimited-OCR-GGUF/BF16/Unlimited-OCR-BF16.gguf" \
  --stdout
```
