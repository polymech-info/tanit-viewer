# Files

Browse local and remote files, move data between devices, search large folder trees, see what is taking up disk space, and let **Tanit** work directly with the files in front of you.

The file panel sits beside the viewer and Tanit. Open a folder on this PC, connect to a phone, browse an SSH or FTP server, preview files, copy between locations, or switch to a visual disk-usage view.

For larger projects, Tanit can also index Markdown, Office documents, source code, and other text so you can search by meaning rather than filename alone.

---

## Browse anywhere

The address bar shows the current location. Click any part of the path to jump upward, or type a path or remote address directly.

**Alt+F1** opens the location menu with:

- bookmarks
- recent locations
- Desktop, Downloads, Documents, Pictures, Music, and Videos
- local and removable drives
- cloud folders already known to Windows
- connected phones and cameras
- Tanit storage

You can also enter locations directly:

| Location | Example |
|:--|:--|
| Local folder | `C:\Projects` |
| SSH host | `ssh://workshop` |
| SFTP | `sftp://user:password@host/home/user` |
| FTP | `ftp://user:password@host/pub` |
| FTPS | `ftps://user:password@host/` |
| Phone or camera | `mtp://realme/Internal storage/DCIM` |

If an address points to a file rather than a folder, Tanit opens its parent folder and selects the file.

### Toolbar

The file panel provides:

- **Back**
- **Up**
- **Forward**
- **List / Icons**
- **Search**
- **Bookmark**
- **New file panel**

Open a second file panel when you want a traditional source/destination layout for copying or moving files.

---

## SSH and SFTP

Browse a remote machine much like a local folder.

```text
ssh://workshop
ssh://workshop/opt
ssh://workshop/home/you/readme.md
ssh://user@host:2222/var/log

sftp://user:password@host/var
sftp://user:password@host:2222/home/user
```

Hosts defined in `~/.ssh/config` can use their configured short name:

```text
ssh://workshop
```

`ssh://workshop` opens the session's home directory.

`ssh://workshop/` opens the remote filesystem root.

Once you are on a remote host, an absolute path such as `/var/log` remains on that host rather than being interpreted as a local Windows path.

Files can be previewed directly from the server. Copy, move, paste, delete, upload, and download all use Tanit's normal transfer queue.

Organization policy can disable SSH access.

---

## FTP and FTPS

FTP locations use URL-style addresses:

```text
ftp://user:password@host/pub
ftp://user:password@host:2121/inbox
ftps://user:password@host/
```

An empty path opens the server's login directory.

`ftps://` uses TLS. Plain `ftp://` is unencrypted.

Browsing and transfers work in the same way as SSH.

Direct phone-to-FTP transfers are not supported. Copy the file to this PC first, then send it to the FTP server.

---

## Phones and cameras

Connected MTP devices appear under **Devices** in the location menu.

Example:

```text
mtp://realme
mtp://realme/Internal storage
mtp://realme/Internal storage/DCIM
mtp://realme/Internal storage/DCIM/IMG.jpg
```

Folder names follow the device itself, such as `Internal storage`, `SD card`, or `DCIM`.

If two devices have the same display name, Tanit can include a hardware identifier in the address to distinguish them.

Photos and other files use the same copy, paste, and drag-and-drop workflow as local files.

---

# Copy and move files

Select one or more items and use the familiar shortcuts:

| Action | Shortcut |
|:--|:--|
| Copy | **Ctrl+C** |
| Cut | **Ctrl+X** |
| Paste | **Ctrl+V** |
| Delete | **Delete** |
| Cancel pending cut | **Escape** |
| Select all | **Ctrl+A** |

Paste normally targets the current folder.

If exactly one folder is selected, Paste goes directly into that folder.

Cut files remain visually faded until they are pasted or the operation is cancelled.

You can also:

- drag files onto another folder
- drag between two Tanit file panels
- drag files onto Tanit
- drop files from Windows File Explorer into the current folder
- paste a bitmap from the clipboard into a local folder

Clipboard images are saved as image files. Raw clipboard images cannot be pasted directly into remote folders.

---

## Copy or Move to…

The **Copy** and **Move** commands in the command palette can prompt for a destination.

Enter:

- a local path
- a remote address
- a recent destination
- a location selected through the browser

If two file panels are open, the other panel is offered automatically.

---

## File conflicts

When a destination already contains the same filename, the transfer pauses and asks what to do:

- **Overwrite** — replace the destination
- **Skip** — keep the existing file
- **Rename** — keep both
- **If newer** — replace only when the source is newer
- **Cancel** — stop the remaining transfer

Enable **Do this for the remaining files** to apply the same decision to the rest of the batch.

Transfer progress appears in the **Queue** panel.

---

# Choose how files are displayed

Press **Alt+number** to switch views.

| View | Shortcut | Best for |
|:--|:--|:--|
| Tree | **Alt+1** | Expanding folders in place |
| Brief | **Alt+2** | Maximum density |
| Type | **Alt+3** | General browsing |
| Size | **Alt+4** | Disk cleanup |
| Icons | **Alt+5** | Images and visual files |
| Tiles | **Alt+6** | Larger cards with details |
| Types | **Alt+7** | Grouping files by format |
| Sunburst | **Alt+8** | Visual disk-usage analysis |

Folders remain above files in every view.

The same options are available under **Shift+F1 → View options**.

Use:

- **Ctrl++** to enlarge thumbnails and tiles
- **Ctrl+-** to reduce them

Additional columns include:

- Type
- Size
- Extension
- Date
- Resolution

Showing the Size column begins background folder-size calculation on local disks.

Remote locations show individual file sizes but do not recursively calculate directory totals.

---

# See what is taking up space

Press **Alt+8** for **Sunburst** view.

The current folder becomes the center of a circular size map. Each surrounding ring represents another directory level.

Large files and folders occupy larger slices. Very small items are grouped into **Other**.

You can:

- click a file to select it
- click a folder to open it
- use the mouse wheel to zoom
- hover a slice to see its name and size

Folder totals appear progressively while Tanit scans the directory in the background.

Sunburst is useful when the question is simply:

> What is taking up all the space in this folder?

Click the largest branch and keep drilling down.

---

# Sorting

Use **Ctrl+function key** to sort.

| Sort by | Shortcut |
|:--|:--|
| Name | **Ctrl+F3** |
| Extension | **Ctrl+F4** |
| Modified time | **Ctrl+F5** |
| Size | **Ctrl+F6** |

Press the same shortcut again to reverse the order.

Folders remain above files.

Name sorting is natural, so:

```text
file2
file10
```

appears in that order.

When folder sizes have already been calculated, **Ctrl+F6** sorts directories by their actual contents rather than treating them as zero-byte entries.

**F5** refreshes the current location without changing the sort.

---

# Navigation shortcuts

| Action | Shortcut |
|:--|:--|
| Back | **Alt+←** |
| Forward | **Alt+→** |
| Up | **Backspace** |
| Refresh | **F5** |
| Locations | **Alt+F1** |
| View options | **Shift+F1** |
| Open | **Enter** |
| Rename | **F2** |
| Preview / lightbox | **Space** |
| Search | **Ctrl+F** or **F3** |
| Context menu | **Shift+F10** |
| Glob select | **Num+** |

Typing letters jumps to matching names in the current folder.

**Escape** clears the type-ahead search.

Standard keyboard selection works as expected:

- arrows move focus
- **Home / End** jump to the beginning or end
- **Page Up / Page Down** move by one page
- **Shift+click** extends a selection
- **Shift+arrow** extends a keyboard selection
- **Ctrl+click** toggles individual items

Local items use the normal Windows context menu.

Remote locations use Tanit's own transfer operations where Explorer actions do not apply.

---

# Find files

Press **Ctrl+F** or **F3**.

Tanit supports several kinds of search depending on what you remember.

| Search | Use it when |
|:--|:--|
| **Name** | You remember part of the filename |
| **Content** | You remember exact text or a pattern inside the file |
| **Semantic** | You remember what the file was about |
| **Fingerprint** | You are looking for structure such as a heading, class, symbol, or path |

### Name search

Search recursively by filename:

```text
grant
IMG_2041
```

No index is required.

### Content search

Search inside files for text or regular expressions.

You can restrict the search to a folder, file, extension, or glob.

Examples:

```text
docs/**/*.md
src/**/*.cpp
**/*.{md,docx,txt}
```

`**` crosses directory levels.

`*` and `?` stay within one path segment.

`{md,docx}` expands alternatives.

Bulky directories such as `.git` and `node_modules` are ignored unless explicitly included.

### Semantic search

Use this when you remember the subject rather than the exact wording.

For example:

```text
the invoice total
how the spindle starts
the document about the Barcelona installation
```

Semantic search requires the folder to be indexed first.

### Fingerprint search

The index also stores structural information that helps locate things such as:

- Markdown titles and headings
- source-code symbols
- class names
- function names
- path tokens
- front-matter metadata

---

# Select by pattern

Press **Num+** to open **Glob select**.

Examples:

```text
*.wav
*.jpg;*.png
*.{jpg,png}
```

Choose:

- **Select** — highlight matching files
- **Filter** — hide everything that does not match

Selection can optionally recurse through subdirectories.

Filtering keeps folders visible so you can continue navigating.

---

# Hidden files

Open:

**Shift+F1 → Show → Hidden**

to display hidden files and dotfiles.

They are hidden by default.

---

# Index a folder

For larger projects, Tanit can build a searchable index beside the folder.

The default store is:

```text
YourFolder/.pixlwiz/search/index.vstore
```

The index can contain Markdown, text, Office documents, structured data, and source code together.

Once built, semantic searches work across the project without reopening every file for every question.

Indexing is incremental:

- unchanged files are skipped
- changed files are reindexed
- deleted files are removed
- changing the chunk configuration updates affected content rather than rebuilding everything unnecessarily

Long files are split into overlapping passages.

Search results can expand to their natural document structure:

- Markdown → section
- code → symbol
- Excel → row or sheet
- PowerPoint → slide
- Word → document region

---

## What goes into the default index

| Format | Extensions | Indexed content |
|:--|:--|:--|
| Markdown | `.md`, `.markdown`, `.mdx` | Body, title, summary, headings, front matter |
| Text | `.txt` | Body |
| Tables | `.csv` | Cell text |
| Structured data | `.json`, `.yaml`, `.yml` | Text content |
| Word | `.docx` | Extracted text |
| Excel | `.xlsx` | Cell content |
| PowerPoint | `.pptx` | Slide text |
| C/C++ | `.c`, `.cc`, `.cpp`, `.cxx`, `.h`, `.hh`, `.hpp`, `.hxx`, `.inl` | Source plus symbols and adjacent comments |
| Other source | `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.rs`, `.go`, `.java`, `.cs`, `.swift`, `.kt` | Source plus lightweight symbol information |
| Images | supported image and RAW formats | Filename and sidecar information |

For C and C++, fingerprints include information such as:

- namespace
- class
- method
- signature
- comment immediately above the symbol

Other supported languages receive a lighter symbol scan covering constructs such as classes, structs, enums, and functions.

---

## Images, OCR, and vision

Image pixels are **not** analyzed by the default folder index.

That is intentional: OCR and visual understanding are much more expensive than indexing filenames and text.

When required, Tanit can build separate image indexes using:

| Mode | Adds |
|:--|:--|
| OCR | Text visible inside the image |
| Vision | A short description of what the image contains |

These are stored separately unless you explicitly choose otherwise.

---

## Searchable but not included in the default index

Live content search can still read formats such as:

| Type | Extensions |
|:--|:--|
| Logs | `.log`, `.tsv` |
| Web | `.html`, `.htm`, `.xml`, `.css`, `.svg` |
| Configuration | `.toml`, `.ini`, `.conf`, `.cfg`, `.env` |
| Scripts | `.sh`, `.ps1`, `.bat`, `.cmd`, `.sql`, `.cmake` |
| Patches | `.diff`, `.patch` |

These are not copied into the default semantic store.

---

## Not indexed

Some formats are deliberately excluded:

| Format | Reason |
|:--|:--|
| PDF | Not ingested directly |
| Legacy Office | `.doc`, `.xls`, and `.ppt` are not supported by the Open XML reader |
| Executables | Binary content |
| Archives | Binary/container content |
| Audio | Media rather than text |
| Video | Media rather than text |

They can still be opened or previewed where supported.

PDFs can be converted to Markdown when their text is needed.

---

# Let Tanit work with the current files

The file panel, viewer, and Tanit share the same working context.

Tanit knows:

- the current folder
- the selected files
- the file open in the viewer

That means you can say:

```text
find all Markdown files here
```

instead of pasting a full directory path.

Or:

```text
find where this project mentions the spindle
```

Or:

```text
change the installation section in this file
```

The relevant file operations are visible in the Log.

Destructive operations and writes outside the active workspace still use the normal consent controls.

---

## Examples

| Ask Tanit | What happens |
|:--|:--|
| `List the Markdown files here` | Searches the current workspace using a glob |
| `Where is "grant" in the filenames?` | Searches names recursively |
| `Find the heading "### grant"` | Searches file contents |
| `Where do we mention the serial number?` | Searches text with surrounding context |
| `How many photos are in this shoot?` | Lists supported image files |
| `Index this folder, then find where we discuss the spindle` | Builds or updates the folder index and runs semantic search |
| `Who calls startSpindle?` | Can query a configured source-code graph |
| `Set Sheet1!B2 to 42` | Uses the configured Office tooling |
| `Add a slide to this presentation` | Uses the configured Office tooling |
| `Download the PDFs and read me a summary` | Downloads, converts, indexes, summarizes, and speaks the result |

---

# Large files stay large

Tanit does not need to load an entire 2,000-line document into the model just to change one paragraph.

For existing text files, the normal edit flow is:

1. locate the relevant section
2. read a small surrounding window
3. replace the exact target text

Large reads are deliberately windowed, typically around a few hundred lines at a time.

This reduces prompt size and avoids unnecessary rewriting.

If the same target text appears more than once, Tanit does not guess. It can widen the match or use a more precise range.

A complete rewrite is still available when that is actually what you want—for example, when creating a new document or replacing the entire file.

---

## Fine-grained edit examples

```text
In handbook.md, replace the grant section with …
```

Tanit finds that section, reads the relevant region, and changes only that part.

```text
Write notes.md in this folder with …
```

Tanit creates the new file.

```text
Delete scratch.tmp
```

Tanit removes that file after the appropriate confirmation.

Invented paths do not silently resolve somewhere else. If a file is not part of the current workspace, select it, navigate to its folder, or reference it explicitly.

---

# Build a document from many sources

Tanit can combine information from multiple files without feeding every source document into the model at once.

A typical flow is:

1. collect or download the source files
2. extract searchable text where necessary
3. build a temporary index
4. locate the most relevant passages
5. compose the result from those passages

For example:

```text
Download these PDFs and read me a summary.
```

Tanit can download the documents, convert their text, index the extracted material, write a combined summary, and read it aloud.

The same workflow can be started from Tanit's Chrome extension while working on a page in the browser.

Temporary indexes used for this kind of job live in the application temp area and are automatically cleared later.

Large files assembled from material already on disk stay on disk; the model only needs the outline and relevant passages.

---

# Word, Excel, and PowerPoint

Tanit uses components from [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI) for Open XML documents.

Word and Excel reading is integrated directly into Tanit in C++, keeping folder indexing fast and independent of Microsoft Office.

PowerPoint processing uses OfficeCLI.

For edits—such as changing workbook cells, creating workbooks, or adding slides—OfficeCLI can run as an MCP server.

The same server can be used from:

- Tanit
- `tanit-cli mcp`
- XBlox **MCP Call** steps

---

# Large source repositories

The standard folder index works well for mixed projects containing documentation, Office files, and source code.

Very large repositories need something more structural when the question becomes:

```text
Who defines this function?
Who calls it?
What depends on this class?
```

For that kind of work, add a source graph such as:

[codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)

It stores functions, classes, and call relationships in a graph that can be queried repeatedly.

Configured MCP servers are shared by:

- Tanit
- `tanit-cli mcp`
- XBlox workflows

Servers can be configured through `mcp.json` or directly on an XBlox MCP step.

---

# Tanit storage

Tanit cloud storage is separate from the local filesystem.

When signed in, Tanit can list, upload, and download files stored there.

Local globs and folder searches remain local to this PC unless another location is explicitly selected.

---

# Status bar

The bottom of the file panel shows the state of the current view, including:

- number of items
- number of selected items
- current view mode
- view shortcut
- current sort
- sort direction
- sort shortcut
- active type-ahead text
- active glob filter

Examples:

```text
Type (Alt+3)
Size ↓ (Ctrl+F6)
```

The status bar makes the current view and sort state visible without opening another menu.

---

# Useful combinations

For moving files between locations, open **two file panels**, put the source on one side and the destination on the other, then drag or use Copy / Move.

For a compact directory, use **Brief (Alt+2)**.

For general browsing, use **Type (Alt+3)**.

For cleanup, use **Size (Alt+4)** and then **Ctrl+F6** once folder totals have been calculated.

For visual cleanup, use **Sunburst (Alt+8)** and drill into the largest slices.

Bookmark remote locations you use regularly:

```text
ssh://workshop/opt
sftp://user:password@host/home/user
ftp://user:password@host/pub
```

For a phone, start at the device and then open `Internal storage`, `SD card`, or `DCIM`.

For a precise change in a long document, select the file and tell Tanit which section to change.

For recurring semantic searches across a project, index the folder once.

For large source repositories that need call relationships rather than just text search, add a source-code graph MCP server.

For Office editing, add OfficeCLI as an MCP server.

And when the request spans several steps, just describe the result you want:

```text
Download the PDFs, summarize them, save the summary here, and read it aloud.
```

Tanit can handle the file operations, indexing, composition, and speech as one workflow.
