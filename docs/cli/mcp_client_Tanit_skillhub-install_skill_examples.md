##### Examples

`skillhub-install_skill` runs inside the Tanit MCP server. "Local filesystem" and the detected agent (`claude`) are that server, so a confirmed install never lands in this machine's `config_dir()/skills`. `skills add` is the local write: it only reads `get_skill_detail` over MCP, then saves `SKILL.md` here.

**Preview** (no files written)

```sh
tanit-cli mcp client Tanit skillhub-install_skill --skill_id anthropics-skills-pdf
```

**Confirm** repeats the preflight hashes from that preview (`--expected_artifact_sha256`, `--expected_assessment_id`, `--expected_policy_version`, `--expected_scan_run_id`).

```sh
tanit-cli mcp client Tanit skillhub-install_skill --skill_id anthropics-skills-pdf --confirm --accept_risk --agents claude --expected_artifact_sha256 <sha256> --expected_assessment_id <uuid> --expected_policy_version <version> --expected_scan_run_id <uuid>
```
