````md
# Tanit Onboarding — Video-First Handoff

## Goal

Build the public Tanit onboarding experience around **short, practical videos**, not a long feature manual.

Tanit already has rich multimedia capabilities, subtitles, speech-to-text, transcription, translation, and searchable documentation. Use that to make video part of the documentation system rather than a separate marketing surface.

The onboarding should answer:

1. What is Tanit?
2. How do I get useful work done immediately?
3. How does AI fit into normal work?
4. How do I turn successful work into something repeatable?
5. What kinds of real applications can I build?
6. Where do I go when I need advanced configuration?

Do not expose a new user immediately to every feature, model, protocol, CLI option, or configuration surface.

---

# Core principle

Organize onboarding around **what the user wants to accomplish**, not around Tanit's internal feature taxonomy.

Avoid making the primary navigation:

```text
Chat
Images
Audio
Video
XBlox
MCP
CLI
Settings
````

Prefer:

```text
Start
  ↓
Work with your files and media
  ↓
Use AI with that work
  ↓
Repeat / automate successful work
  ↓
See real applications
  ↓
Go deeper when needed
```

The product can remain broad underneath.

The onboarding should feel simple.

---

# Onboarding home

Recommended structure:

```text
WELCOME TO TANIT

One workspace for files, media, AI and automation.

[ large featured video ]
Tanit in 5 minutes

Then choose:

[ Everyday Tanit ]
[ AI & automation ]
[ Configure / deploy ]

Then:

See what you can build
[ example video grid ]

Then:

Learn more
[ advanced video library ]
```

The first screen should not look like a documentation index.

---

# Video 1 — mandatory overview

## Tanit in 5 minutes

Target:

```text
4–6 minutes
```

This is the one video almost every new user should watch.

Show the product rather than explain architecture.

Suggested sequence:

```text
00:00  Tanit workspace
00:20  Browse/open files
00:50  Viewer / images / documents
01:20  Ask AI about the current work
02:00  Select a file/image and use it as context
02:30  Voice interaction
03:00  Perform an action
03:30  Permission / user control
04:00  Repeat the successful operation
04:30  XBlox / command glimpse
05:00  Where presets/settings live
05:20  End
```

Communicate the mental model:

> Files, media, AI and automation live in the same workspace.

Do not explain C++, MCP internals, model quantization, GPO, etc. here.

---

# Path 1 — Everyday Tanit

Short videos focused on immediate use.

## Files, folders and the viewer

Target:

```text
2–3 min
```

Cover:

* file panel
* folders
* selections
* preview/viewer
* filmstrip
* drag/drop
* context actions
* recent/current context

---

## Images and photos

Target:

```text
2–3 min
```

Cover:

* browse/view
* crop
* resize
* convert
* metadata
* quick processing
* ask AI about an image

Do not turn this into a complete image-tools catalog.

---

## Audio and video

Target:

```text
3–4 min
```

Cover:

* playback
* recording
* microphone
* webcam
* screen recording
* conversion
* transcription
* subtitles

This is also a good place to demonstrate Tanit's own subtitle/STT capabilities.

---

## Find anything

Target:

```text
2 min
```

Cover:

* filename search
* content search
* current selection
* recent/open items
* finding relevant files/apps/tools

Keep it task-driven.

---

# Path 2 — AI essentials

## Chat with your actual work

Target:

```text
3–4 min
```

Show:

```text
select file
→ ask question
→ inspect image/document
→ perform useful action
```

Examples:

* explain a document
* summarize selected files
* inspect an image
* rewrite selected text
* process current folder

Emphasize that AI is next to the user's work rather than isolated in a web chat.

---

## Talk to Tanit

Target:

```text
2–3 min
```

Cover:

* microphone
* STT
* text-to-speech
* realtime voice
* spoken commands

Show normal interaction before configuration.

---

## Local AI and cloud AI

Target:

```text
3 min
```

Explain from the benefit side:

```text
keep something local
use cloud where useful
mix them
switch setup when the task changes
```

Avoid beginning with:

```text
GGUF
quantization
context sizes
provider schemas
```

Those belong in advanced material.

---

## Let AI use tools safely

Target:

```text
3–4 min
```

Communicate the core security model visually:

```text
AI proposes
   ↓
Tanit checks
   ↓
allow / deny / ask
   ↓
action
```

Show a real action:

```text
AI proposes editing file
→ permission shown
→ user approves
→ edit occurs
```

Avoid abstract security marketing.

---

## Presets

Target:

```text
2–3 min
```

Mental model:

> A preset saves a working AI setup.

Show that it may include:

* models
* tools
* prompts
* skills
* MCP
* policy
* media routing

But do not dive into every field.

---

# Path 3 — From conversation to automation

This should be one of Tanit's strongest onboarding areas.

The story:

```text
Do something successfully once
        ↓
make it repeatable
        ↓
run it again without rebuilding the process
```

---

## Do it once, then automate it

Target:

```text
4 min
```

Example:

```text
select folder
→ ask Tanit to process contents
→ inspect result
→ save successful operation
→ expose as reusable command/workflow
```

This connects Chat with automation conceptually.

---

## XBlox in 5 minutes

Target:

```text
5–6 min
```

Do not attempt a full programming tutorial.

Show:

```text
add block
connect block
run
inspect output
add AI block
save
reuse
```

Goal:

> viewer understands what visual automation is and why they might use it.

---

## Build one useful workflow

Target:

```text
6–8 min
```

Use a concrete example.

Recommended first example:

```text
folder of images
    ↓
inspect
    ↓
resize
    ↓
generate descriptions
    ↓
save results
```

Alternative:

```text
video
 ↓
transcribe
 ↓
generate subtitles
 ↓
translate
 ↓
export
```

Do not demonstrate a meaningless "hello world" flow.

---

## Scheduled and unattended work

Target:

```text
3 min
```

Explain conceptually:

* commands
* scheduled jobs
* CLI
* headless execution

Do not make the beginner watch terminal syntax for five minutes.

Provide commands underneath the video for users who want them.

---

# See what you can build

Create a dedicated section containing application videos.

These should not be feature demos.

Each video shows a **real problem and a complete outcome**.

Target:

```text
3–6 minutes each
```

Use at least three very different application domains.

---

# Example 1 — Understand and answer a difficult letter

Scenario:

```text
open / scan letter
→ OCR
→ explain in simple language
→ translate if needed
→ identify important date/action
→ draft response
→ read response aloud
→ user approves
```

Demonstrates:

* documents
* OCR
* AI
* translation
* accessibility
* speech
* safe actions

Possible environments:

* ordinary home user
* elderly person
* public service desk
* community centre
* accessibility scenario

Do not frame this as a medical/care product.

---

# Example 2 — Group discussion assistant

Problem:

In groups larger than roughly a dozen people, contributions are easily lost.

Some participants:

* do not find an opportunity to speak
* need longer to formulate a thought
* are uncomfortable speaking publicly
* struggle with the meeting language
* struggle with formal/institutional communication
* cannot easily speak at all

Show a meeting where participants can contribute through:

```text
speech
text
private dictation
questions
translation
assisted wording
read-aloud
simple reactions
```

Tanit structures:

```text
current topic
questions waiting
concerns
repeated themes
unaddressed contributions
possible decisions
follow-up actions
```

Core message:

> Lower technical, language and institutional barriers to participation.

Do not position this merely as "AI meeting notes".

The important benefit is:

> More people can actually take part.

---

# Example 3 — Assisted-use / supported-living workstation

Use a carefully scoped demonstration.

Examples:

* voice-first interface
* read a letter aloud
* explain something simply
* familiar photos/media
* reminders from approved schedules
* guided activities
* dictate a message
* contact an approved person

Possible longer-term use cases:

* elderly users
* people living alone
* cognitive impairment
* memory refreshers
* guided daily routines
* supported employment

Keep the distinction clear:

> Tanit can support repetitive and accessible interactions; it is not a replacement for professional care or human responsibility.

Use deterministic workflows for critical actions where possible.

---

# Example 4 — Classroom workstation

Scenario:

Teacher selects:

* model
* content
* tools
* provider
* permissions
* UI

Student receives a simple learning environment.

Example:

```text
photograph exercise
→ ask for help
→ receive guided explanation
→ request another example
→ use voice/read-aloud if useful
```

Core idea:

> AI can adapt the presentation without exposing the student to an unrestricted agent environment.

Possible extensions:

* language learning
* reading support
* students needing more time
* step-by-step activities
* students uncomfortable speaking in class

---

# Example 5 — Workshop / manufacturing assistant

Scenario:

```text
photograph problem
→ inspect image
→ find relevant manual
→ explain likely issue
→ read approved sensor value
→ prepare maintenance note
```

Optional later:

```text
Modbus / MQTT
```

Show AI next to existing work rather than as a separate chatbot.

---

# Example 6 — Research workflow

Scenario:

```text
documents
+ scans
+ images
+ notes
       ↓
OCR / extraction
       ↓
chosen reasoning model
       ↓
structured result
       ↓
repeatable workflow
```

Show:

* local/cloud model choice
* inspectable intermediate results
* reproducibility

---

# Example 7 — Media workflow

Scenario:

```text
record / open video
→ transcribe
→ create subtitles
→ correct transcript
→ translate subtitles
→ export
```

This is especially useful because Tanit's own onboarding videos can be produced using the same capability.

---

# Advanced / power-user library

Keep these out of the beginner path.

## Suggested videos

```text
MCP and external tools
CLI essentials
Custom providers and endpoints
Installing local models
Choosing a local model
Shared local AI host
Agent tools
Skills
System / planner / realtime prompts
Security profiles
Permissions and consent
Sandbox
UI presets
XBlox advanced
Commands
Scheduling
GPO / Intune
Partner deployment
```

Target most of these at:

```text
3–8 minutes
```

Prefer multiple focused videos over one 40-minute tutorial.

---

# Video page design

Each video should have its own page.

Recommended structure:

```text
TITLE
one-sentence outcome

[ VIDEO ]

chapters

subtitle / language controls

searchable transcript

related actions / commands

example files / workflow

related documentation

next recommended video
```

---

# Chapters

Every video should contain chapters.

Example:

```text
00:00  What we're doing
00:28  Open the source files
01:05  Ask Tanit about the selection
01:48  Perform the action
02:34  Review permission
03:15  Inspect the result
03:50  Save it for reuse
```

Chapters should be stored separately from the rendered video where practical.

Do not burn them only into the media.

---

# Subtitles

Tanit already supports STT/subtitle workflows.

Every onboarding video should therefore have subtitles.

Initial languages should follow supported documentation/product languages.

Example:

```text
English
Deutsch
Español
Français
```

Keep:

```text
original transcript
translated subtitle tracks
```

separate.

If machine-translated and not reviewed, retain metadata that identifies this internally and optionally in UI.

---

# Searchable transcripts

Do not treat transcripts merely as accessibility metadata.

Index them as documentation.

Example search:

```text
screen recording subtitles
```

may return:

```text
Audio & Video
02:14 — Generate subtitles from a recording
```

Selecting the result should open the video at that timestamp.

---

# Transcript representation

Store transcript segments structurally.

Example:

```json
{
  "video": "audio-video-basics",
  "segments": [
    {
      "start": 134.2,
      "end": 141.8,
      "text": "Tanit can generate a subtitle track directly from the recording."
    }
  ]
}
```

Recommended metadata:

```text
video id
locale
start
end
text
speaker optional
chapter id optional
confidence optional
reviewed optional
```

This enables:

* full-text search
* timestamp links
* AI retrieval
* subtitle regeneration
* translation
* chapter generation
* documentation search

---

# Videos as knowledge-base content

Treat video transcript chunks like normal documentation chunks.

Search/retrieval result may represent:

```text
documentation page
video
video chapter
transcript segment
command reference
example workflow
```

A user asking Tanit:

> How do I generate subtitles?

could receive:

```text
Video: Audio & Video
Jump to 02:14
```

alongside written instructions.

---

# Translation workflow

Suggested pipeline:

```text
record video
↓
STT
↓
review source transcript
↓
generate chapters
↓
generate source subtitles
↓
translate transcript/subtitles
↓
optional review
↓
publish
```

Translate from the reviewed source transcript.

Do not repeatedly translate from already-translated subtitle tracks.

---

# Video length policy

Recommended:

```text
Overview               4–6 min
Simple feature         2–4 min
AI concept             3–5 min
Example/application    3–6 min
XBlox/tutorial          5–8 min
Deployment/admin       5–10 min
```

Avoid:

```text
20–60 minute monolithic tutorials
```

unless explicitly presented as a workshop/course.

---

# Recording style

Prefer real Tanit UI.

Use:

* deliberate mouse movement
* larger cursor where helpful
* moderate UI zoom if required
* clean example files
* realistic tasks
* minimal editing gimmicks
* no fake AI output
* no unnecessary animation

Keep the viewer oriented.

Before every action, make it visually clear:

```text
what is selected
what Tanit is being asked
what changed
```

---

# Narration

Narration is optional.

Good default:

```text
short spoken explanation
+
subtitles always available
```

Do not narrate every mouse movement.

Focus narration on:

* why the action matters
* what Tanit is doing
* what choice the user has
* what happens next

---

# Content tone

Avoid:

> Tanit features an advanced multimodal agent architecture...

Prefer:

> Select the document and ask Tanit what it means.

Avoid:

> Configure per-capability provider routing.

Prefer:

> Keep speech local and use a cloud model for writing if you want.

Advanced terminology can appear after the concept is understood.

---

# Beginner vs advanced disclosure

Beginner video:

```text
Use a local model.
```

Advanced documentation/video:

```text
llama.cpp
GGUF
quantization
VRAM
context size
GPU layers
```

Beginner:

```text
Connect another AI provider.
```

Advanced:

```text
OpenAI-compatible endpoint
BYOK
base URL
provider capability routing
```

Use progressive disclosure consistently.

---

# Recommended initial launch set

Do not wait until every feature has a video.

Ship a strong first collection:

```text
01  Tanit in 5 minutes

02  Files, folders and viewer
03  Images and photos
04  Audio, video and recording

05  Chat with your actual work
06  Talk to Tanit
07  Local and cloud AI
08  Let AI use tools safely

09  Do it once, then automate it
10  XBlox in 5 minutes

11  Understand and answer a difficult letter
12  Group discussion assistant
13  Classroom workstation
14  Workshop / manufacturing assistant
15  Media: transcription and subtitles
```

Then expand based on actual user questions.

---

# Recommended onboarding paths

## Everyday user

```text
Tanit in 5 minutes
→ Files
→ Chat with your work
→ Voice
→ relevant example
```

## AI / automation user

```text
Tanit in 5 minutes
→ Chat with your work
→ Local/cloud AI
→ Safe tools
→ Do it once, automate it
→ XBlox
```

## Admin / integrator

```text
Tanit in 5 minutes
→ Local/cloud AI
→ Presets
→ Security
→ UI presets
→ Shared host
→ deployment
```

Do not require users to explicitly identify their role before they can browse.

These are recommendations, not separate products.

---

# UX requirements

Video library cards should expose:

```text
thumbnail
title
one-line outcome
duration
level
language/subtitle availability
```

Optional tags:

```text
Getting started
AI
Files
Media
Automation
Examples
Advanced
Admin
```

Avoid huge taxonomies.

---

# Resume / history

Useful later:

```text
Continue watching
Recently viewed
Completed
```

Do not turn onboarding into a compulsory course.

Users must always be able to skip it.

---

# Contextual onboarding

Where useful, link videos directly from the product.

Examples:

```text
Chat empty state
→ Watch "Chat with your actual work"

XBlox first open
→ Watch "XBlox in 5 minutes"

Models page
→ Watch "Local and cloud AI"

Recorder
→ Watch "Audio, video and recording"
```

Keep these unobtrusive.

---

# Video production should dogfood Tanit

Where practical, produce onboarding using Tanit's own capabilities:

```text
screen recording
audio recording
STT
subtitle generation
subtitle correction
translation
video conversion
thumbnail/image tooling
```

This helps validate the product against a real production workflow.

Do not compromise production quality merely to claim everything was made inside Tanit.

---

# Technical/content separation

Keep these separate:

```text
video media
source transcript
subtitle tracks
translated transcript
chapter metadata
thumbnail
page metadata
related docs
download/example assets
```

Do not bake information into the video that should be searchable independently.

---

# Content IDs

Give every video a stable semantic ID.

Examples:

```text
getting-started-overview
files-basics
media-recording
chat-workspace
voice-basics
ai-local-cloud
agent-permissions
automation-from-chat
xblox-basics
example-letter
example-meeting
example-classroom
example-manufacturing
example-subtitles
```

Use the same ID for:

```text
page
video metadata
transcripts
subtitle tracks
search index
analytics
related-content links
```

---

# Success criteria

A new user should be able to answer after the first video:

```text
What is Tanit?
Where are my files?
How do I ask AI about what I'm working on?
Can it act on things?
Do I stay in control?
Can I repeat something useful later?
Where do I learn the next thing?
```

After approximately 15 minutes of chosen onboarding, they should have completed at least one real task.

The onboarding should demonstrate that Tanit is broad without making Tanit feel complicated.

---

# Core message

The onboarding story is:

> Start with the work already in front of you.

Then:

> Bring AI into it.

Then:

> Once something works, make it repeatable.

The video library exists to show those ideas through real work, not to enumerate every feature Tanit contains.

```
```
