##### Examples

**From a task description**

```sh
tanit-cli mcp client Tanit skillhub-recommend_skills --context "edit and merge PDF files" --limit 5
```

**Skip skills already installed** (`--current_skills` repeats)

```sh
tanit-cli mcp client Tanit skillhub-recommend_skills --context "edit PDFs" --current_skills anthropics-skills-pdf --limit 3
```
