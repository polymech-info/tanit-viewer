##### Examples

Skills the agent sees live under `config_dir()/skills` (roaming) and `<work>/skills` (workspace). A workspace folder with the same name hides the roaming copy. Search, browse, and recommend go through SkillHub. `skills add` writes the roaming folder itself; it does not call remote `install_skill`.

```sh
tanit-cli skills list
tanit-cli skills search pdf --limit 5
tanit-cli skills detail pdf --content
tanit-cli skills add pdf
tanit-cli skills remove pdf
```
