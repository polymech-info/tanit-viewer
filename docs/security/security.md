# Tanit Security Overview

Tanit is an AI-assisted desktop application that can inspect files, run tools,
edit content, and automate workflows. That power is useful, but it also means the
application must treat prompts, documents, tools, web content, rules, skills, and
stored sessions as security-sensitive.

Version 1.0 is designed around a simple rule:

**The AI can propose actions, but Tanit policy decides what is allowed.**

This page gives a practical overview for administrators, teachers, hobbyists, and
power users. It explains what is protected, how local data is stored, and which
controls are available for managed environments.

It is also meant as a reference for what a responsible **agentic** tool should
cover. If you are evaluating or building AI tools that can read files, run
commands, or automate a desktop, the areas below — policy-gated tools, scoped
permissions, secure local storage, a hardened web bridge, and runtime tamper
detection — are a reasonable checklist for what "safe by default" should mean.

## A Native, Built-From-Scratch Core

Tanit is written mostly from scratch as a native C++ application. The AI
runtime, security gateway, secure storage, and tool execution are compiled
native code — not a stack of scripting-language packages, and not an Electron
shell. The user interface is rendered through the operating system's own
WebView2 runtime for display only; web content has no Node.js integration and
cannot reach native code except through the policy-checked bridge described
below.

This is a deliberate security decision, not just a performance one.

**Why this matters — a smaller, controllable dependency surface.** Node.js and
Python desktop apps typically pull in large trees of third-party packages at
build and run time, any of which can be silently compromised:

- In **September 2025**, attackers phished a maintainer and, within about 16
  minutes, injected credential- and crypto-stealing code into 18+ foundational
  npm packages — `chalk`, `debug`, `ansi-styles` and others — that together see
  **over 2 billion downloads per week**. A self-replicating worm ("Shai-Hulud")
  then spread through install scripts to 500+ more packages. Practically every
  Node app transitively depended on some of these, and there was no meaningful
  per-app fix beyond scrambling to rebuild with clean versions.
- **Electron** apps bundle an entire Chromium browser engine and a Node.js
  runtime that runs with the user's full privileges. In **September 2025**, an
  ASAR integrity bypass (CVE-2025-55305) let anyone with write access to an
  app's resources swap in their own code — affecting the framework behind apps
  like Signal, 1Password, and Slack. The advisory is blunt: **"There are no app
  side workarounds, you must update to a patched version of Electron."** When
  the vulnerability is in the shared runtime, individual apps cannot mitigate
  it; they can only wait for an upstream patch.

A native C++ core avoids bundling a browser engine and a scripting runtime with
full system access, ships a far smaller set of carefully chosen dependencies,
and lets us build binary manifests, signing, and integrity checks directly into
the product instead of inheriting risk from a package ecosystem we do not
control.

**Unprotected AI inputs are a real, exploited attack surface.** We reviewed
popular AI desktop apps and found that the most security-sensitive inputs —
system prompts, rules, MCP server configurations, and session history — are
frequently stored as plain, unsigned, unencrypted files on disk with no
integrity checking. Anything on the machine (another app, a synced repository, a
malicious dependency) can quietly change them. This is not theoretical:

- The **"Rules File Backdoor"** (disclosed 2025) hid instructions inside AI
  editor rules files using invisible Unicode, silently steering assistants like
  Cursor and GitHub Copilot into emitting malicious code — invisible in normal
  code review and in the chat log.
- **CurXecute** (CVE-2025-54135) chained a prompt injection into writing an MCP
  configuration file and triggering code execution.

Because those files were treated as ordinary plain text, there was nothing to
detect the tampering. Tanit treats prompts, rules, MCP configuration, and
sessions as security-sensitive resources: they live in signed and encrypted
secure storage with integrity metadata and trust classification, so unexpected
modification is detectable and untrusted inputs are gated by policy before they
influence the agent. The [Secure Storage](#secure-storage) and
[Attack Surface Closure](#attack-surface-closure) sections below cover how.

## Security Features

Tanit includes a local security gateway for agent and tool activity. The
gateway classifies requested actions, checks the active security profile, applies
scoped permission grants, and asks for consent when needed.

Key protections include:

- **Tool authorization**: file, MCP, shell, and app tools pass through policy
  checks before they run.
- **Scoped permissions**: grants can be limited by session, task, tool, action,
  origin, and resource path.
- **Path safety**: workspace boundaries, symlink and junction escapes, glob
  scopes, and sensitive locations are checked before tool access.
- **Run-command validation**: shell commands are screened for dangerous patterns
  such as persistence hooks, secret exfiltration, identity probing, remote URL
  mutation, and unsafe system changes.
- **Consent surfaces**: sensitive actions can require explicit user approval in
  the CLI or in the app UI.
- **AI advisory review**: Tanit can ask a security-review model to advise on
  risky consent requests, while the final enforcement stays in the local policy
  layer.
- **Audit-ready memory**: security reviews and security decisions are stored as
  first-class session memory items so users and admins can inspect what happened.

The goal is not to remove automation. The goal is to make automation explicit,
bounded, reviewable, and controllable.

## Secure Storage

Tanit stores security-sensitive local data through signed and encrypted secure
storage by default.

Secure storage is used for:

- settings profiles;
- command configuration;
- MCP configuration;
- prompt templates;
- app and web bundles;
- chat transcripts;
- session memory;
- session logs and agent sidecars.

Each stored document has a stable `pm://...` resource URI, type metadata, digest,
trust level, provider information, and version metadata. Documents can be signed
for integrity and encrypted for confidentiality.

On Windows, local signing and encryption keys are stored as DPAPI-wrapped
`.pme1` key files under the active secure-storage root. These are local protected
key envelopes, not plain text keys. If an administrator forces a different
session storage root, that root gets its own protected key material.

By default, session documents are:

- stored in secure storage rather than legacy plaintext JSON files;
- encrypted;
- signed;
- queryable through the session-store library for diagnostics and future tools.

Plaintext storage is reserved for test builds and controlled developer probes.
Production policy does not expose plaintext session storage as a managed option.

For the day-to-day **settings** story (Advanced tab, encrypted `.pmbackup`,
cloud upload/download, and moving a profile between machines), see
[Settings encryption, signing, and backup](../features/feature-security.md).
For **MSP / integrator / OEM** rollouts on many machines, see
[Deploy AI as an application](../features/feature-integration.md).

## Built-In Hard Protections

Tanit also has lower-level protections that run before or alongside the AI
policy layer. These are not settings a user needs to understand day to day; they
are guardrails built into the application.

- **String and HTML sanitizers** clean untrusted text before it reaches UI or
  command surfaces. They repair invalid UTF-8, strip dangerous HTML elements,
  remove comments where needed, reject scriptable tags, and normalize text for
  safer rendering and logging.
- **Filesystem guardrails** block writes to sensitive paths and file types. The
  guard rejects dotfiles, credential folders, Git internals, SSH/cloud secrets,
  system directories, scripts, batch files, registry files, archives used for
  payload delivery, and other risky destinations unless a safer workflow is
  used.
- **Run tool protections** validate shell commands before execution. Commands
  are checked for persistence hooks, identity or environment probing, secret
  copy/exfiltration, suspicious network mutation, unsafe system changes, and
  command chains that would expand beyond the requested task.
- **Timeouts and streaming supervision** bound long-running process execution and
  keep output visible to the agent runtime instead of letting hidden background
  work continue silently.
- **Sandbox routing** can run higher-risk process or MCP tool work inside a
  Windows AppContainer or LPAC sandbox. The sandbox is not the permission system;
  the security gateway still decides first. The sandbox adds containment: limited
  filesystem access, restricted process handles, optional network denial, job
  object cleanup, and Windows process mitigation policies.

Together, these layers reduce the chance that a prompt, document, tool
definition, or generated command can turn into an uncontrolled system action.

## Runtime Tamper Detection

An agentic tool runs with real permissions on a real machine, so it is also a
target. An attacker who can attach a debugger, inject a DLL, or patch a running
process could try to disable safety checks, silence audit logging, or read
secrets straight from memory. Tanit ships a runtime self-check that watches for
exactly these tampering attempts.

At startup — before the first window appears — Tanit scans its own process for:

- **Debugger presence**: standard and low-level checks for an attached debugger,
  remote debugger, or hardware breakpoints on the running threads.
- **Inline hooks**: patched entry points on sensitive Windows APIs, including the
  ones an attacker would target to blind event logging or intercept file and
  process operations.
- **Suspicious loaded modules**: code loaded from temp, downloads, public, or
  recycle-bin locations, plus a snapshot of every module in the process.
- **Suspicious memory**: writable-and-executable regions and unexpected
  executable memory that can indicate injected code.

An important design principle: **these are tamper signals, not the security
boundary.** The permission gateway, scoped grants, and secure storage stand on
their own and do not depend on these checks passing. The self-check exists to
detect and report interference, downgrade risky capabilities, and give admins
tamper evidence — not to be the thing that keeps you safe. This matters because
anti-debug and anti-hook tricks are inherently bypassable, and because
legitimate security software (EDR/anti-virus) also hooks the same APIs, so a
signal is treated as *evidence to review*, never as automatic proof of an attack.

We call this out deliberately because it is a capability many agentic tools skip:
a tool that can act on your system should be able to notice when something is
tampering with it, and should say so honestly rather than pretend detection is
prevention.

## Attack Surface Closure

Tanit treats every place where instructions can enter the system as a possible
attack surface. This includes user prompts, opened documents, markdown, web app
bundles, tool definitions, MCP servers, rules, skills, session memory, and
generated agent plans.

The main defenses are:

- **Rules and skills are treated as privileged inputs**: installed guidance and
  skill packages are part of the agent supply chain and are checked as trusted
  local resources.
- **Tool identity is explicit**: tools are identified by provider, server, and
  tool id, so permissions can target a specific tool instead of granting broad
  ambient access.
- **Least privilege by default**: workspace-local work can proceed smoothly, but
  out-of-scope file access, system changes, and command execution require policy
  approval.
- **No silent command execution from content**: documents and embedded web
  surfaces cannot silently jump from rendered content to native command
  execution.
- **Security memory is preserved**: consent decisions and AI security reviews are
  recorded so a session can be reviewed later.

These measures map to the main risks in agentic AI systems: prompt injection,
tool misuse, privilege abuse, supply-chain manipulation, unexpected code
execution, and unsafe autonomy.

## WebView2 Security

Tanit uses embedded WebView2 surfaces for viewers, settings, chat, and other
rich UI. WebView content is isolated from the native host bridge with several
defense layers:

- **Markdown sanitization** removes scripts, event handlers, and dangerous URLs
  from rendered markdown.
- **Origin pinning** rejects unexpected web messages from the wrong host.
- **Content Security Policy** is applied to signed bundled HTML to block injected
  inline scripts.
- **DevTools are disabled in production builds**, preventing interactive access
  to bridge APIs from an F12 console.
- **Web command execution can be locked down by GPO**, including blocking all
  web-triggered command runs or only arbitrary external shell commands.
- **Monaco/editor assets are bundled locally**, avoiding runtime CDN script
  loading.

The intended result is that opening a document, markdown page, or bundled UI
does not create a silent native-code execution path.

## Managed Controls

Organizations can manage Tanit with Windows Group Policy. The generated ADMX
template covers agent tools, providers, UI panels, local inference, web command
execution, verification requirements, and secure session storage.

Useful managed controls include:

- enabling or disabling individual agent tools;
- blocking or allow-listing tool names;
- disabling MCP, skills, computer-use tools, local models, or specific
  providers;
- forcing verification levels for sensitive import, export, and update actions;
- requiring signed and encrypted secure documents;
- forcing session storage location and session protection mode;
- disabling WebView-triggered command execution.

For the complete policy list and deployment instructions, see
[Group Policy Administration](../gpo-setup.md).

## Validation

Tanit security features are exercised with product-level integration tests
that run the same command-line tools, app security helpers, and Windows UI
surfaces used by the shipped application.

The test coverage includes:

- security profiles, authorization decisions, scoped grants, path containment,
  origin tracking, URI scopes, and session/task binding;
- agent tool calls, prompt-injection attempts, dangerous command patterns,
  repeated-denial handling, and shell execution safeguards;
- AppContainer and LPAC sandbox behavior, including output capture, timeouts,
  write containment, shared-folder grants, grant revocation, and scratch cleanup;
- secure storage for settings, commands, MCP config, prompts, bundles, session
  transcripts, session memory, and session logs;
- encrypted document verification, local signatures, tamper rejection, protected
  session query/delete/prune flows, and user-verification prompts;
- native consent dialog behavior, including deny, allow once, allow for session,
  scope narrowing, persisted grants, and sandbox routing;
- runtime tamper detection, including debugger, inline-hook, module, and memory
  scans, verified with a deterministic injected-code self-test to prove the
  detector actually fires.

These checks exercise policy, storage, agent, CLI, UI, and Windows security
integration points together.

## What Users Should Expect

For personal users and hobbyists, Tanit should feel mostly automatic inside
normal project boundaries. When a request becomes sensitive, the app may ask for
approval or refuse the action.

For schools, labs, and managed desktops, admins can restrict higher-risk
features while leaving safe reading, viewing, organization, and assistant
features available.

For developers and power users, secure storage and policy controls are designed
to stay inspectable: the app can list secure resources, verify signatures, query
session memory, and explain which policy layer made a decision.

## Resources

- [Settings encryption, signing, and backup](../features/feature-security.md) —
  end-user / admin guide for secure profile storage and `.pmbackup` cloud sync
- [Encryption And Signing](../signing.md)
- [Settings And Commands Migration](../settings.md)
- [Tanit Security CLI](./cli.md)
- [Group Policy Administration](../gpo-setup.md)
- [OWASP Top 10 for Agentic Applications](https://tanit.polymech.info/user/3bb4cfbf-318b-44d3-a9d3-35680e738421/pages/owasp-top-10-for-agentic)

Background on the incidents referenced above:

- [npm supply chain attack, September 2025 (BleepingComputer)](https://www.bleepingcomputer.com/news/security/hackers-hijack-npm-packages-with-2-billion-weekly-downloads-in-supply-chain-attack/)
- [Electron ASAR integrity bypass, CVE-2025-55305 (advisory)](https://github.com/electron/electron/security/advisories/GHSA-vmqv-hx8q-j7mg)
- [Rules File Backdoor in AI code editors (Pillar Security)](https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents)
