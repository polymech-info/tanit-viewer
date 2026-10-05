##### Examples

**Installed skill** (folder name). When both copies exist, the path shown is the workspace one.

```sh
tanit-cli skills detail pdf
```

**Print SKILL.md**

```sh
tanit-cli skills detail pdf --content
```

**Not installed** falls through to SkillHub `get_skill_detail`.

```sh
tanit-cli skills detail anthropics-skills-pdf --content --json
```
