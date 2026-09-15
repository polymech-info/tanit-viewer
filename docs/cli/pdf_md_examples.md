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

**Pipeline preset** (default runs full text + figure path; struct/OCR/VLM stages stubbed)

```sh
tanit-cli pdf md report.pdf --pipe default
```

**Encrypted PDF**

```sh
tanit-cli pdf md secure.pdf --password "secret"
```

**Smoke test file**

```sh
tanit-cli pdf md tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf --pages 1 --stdout
```
