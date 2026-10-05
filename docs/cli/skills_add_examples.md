##### Examples

Writes `config_dir()/skills/<slug>/SKILL.md`. Refuses when that roaming skill already exists unless `--force` replaces `SKILL.md`. A workspace skill of the same name still hides the new copy.

**Install a SkillHub slug**

```sh
tanit-cli skills add anthropics-skills-pdf
```

**Replace the roaming file**

```sh
tanit-cli skills add anthropics-skills-pdf --force
```

**JSON** (`replaced`, `shadowed_by_workspace`)

```sh
tanit-cli skills add anthropics-skills-pdf --json
```
