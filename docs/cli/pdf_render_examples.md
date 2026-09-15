##### Examples

Hand-picked rasterization patterns beyond the auto-generated flags above.

Uses **PDFium** in-process + **libvips** encode. Defaults: **300 DPI**, **quality 95**, **`--format auto`** (grayscale page → JPEG, color → PNG). Output naming: `report.pdf` → `report_1.png` / `report_1.jpg` beside the PDF unless `--output-dir` is set.

**All pages** (writes `report_1.ext`, `report_2.ext`, … next to the PDF)

```sh
tanit-cli pdf render report.pdf
```

**Page range or pick list** (1-based)

```sh
tanit-cli pdf render report.pdf --pages 1-5
tanit-cli pdf render report.pdf --pages 1,3,7
tanit-cli pdf render report.pdf --pages 2-
```

**Dedicated output folder** (recommended for large PDFs)

```sh
tanit-cli pdf render report.pdf --output-dir ./pages
```

**Single page with explicit path** (`-o` only when exactly one page is selected)

```sh
tanit-cli pdf render report.pdf --pages 3 -o page3.jpg
```

**Force PNG everywhere**

```sh
tanit-cli pdf render report.pdf --pages 1-3 --format png
```

**Web-optimized JPEG**

```sh
tanit-cli pdf render report.pdf --pages all --format jpeg --quality 85 --output-dir ./jpg
```

**Landscape page rotated upright**

```sh
tanit-cli pdf render scan.pdf --pages 1 --rotation 90 -o scan_upright.png
```

**Skip annotations** (form widgets, comment overlays)

```sh
tanit-cli pdf render report.pdf --pages 1 --no-annot
```

**JSON output** (paths + page list for pipelines)

```sh
tanit-cli pdf render report.pdf --pages 1-2 --output-dir ./out --json
```

**Smoke-test fixture** (57-page OWASP doc; first two pages → PNG @ 300 DPI)

```sh
tanit-cli pdf render tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf \
  --pages 1-2 \
  --output-dir tests/pdf/_smoke_pdf_render \
  --json
```

**Notes**

| Topic | Behavior |
|---|---|
| `--format auto` | Samples raster; JPEG if page looks grayscale, else PNG |
| Multi-page + no `--output-dir` | Images land in the PDF’s parent folder |
| `--dpi` | 72 = 100% zoom; 300 ≈ print quality |
| Runtime | Requires `pdfium.dll` beside the executable on Windows |
