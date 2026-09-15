##### Examples

Hand-picked patterns beyond the auto-generated flags above.

**Page count and sizes** (human-readable)

```sh
tanit-cli pdf info report.pdf
```

**JSON for scripting** (page index, 1-based page number, width/height in points)

```sh
tanit-cli pdf info report.pdf --json
```

**Multiple documents in one call**

```sh
tanit-cli pdf info chapter1.pdf chapter2.pdf --json
```

**Encrypted PDF**

```sh
tanit-cli pdf info secure.pdf --password "secret"
```

**Quick sanity check** (same file used in CI smoke tests)

```sh
tanit-cli pdf info tests/pdf/OWASP-Top-10-for-Agentic-Applications-2026-12.6-1.pdf --json
```
