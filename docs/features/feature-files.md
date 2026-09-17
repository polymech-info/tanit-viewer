# Files: browse, copy, and see what takes space

The file panel is a full file manager beside chat and the viewer. Open a folder on this PC, a phone, an SSH host, or an FTP server — then copy, move, preview, and (on local disks) see which subfolders are actually eating space.

Shortcuts follow classic dual-pane managers: **Alt+number** for view modes, **Ctrl+function key** for sort. The current layout and sort are always shown in the status bar.

---

## Who it's for

- Anyone who lives in local folders — projects, exports, photo shoots, client deliverables — and wants navigation next to chat and the viewer.
- People who copy between this PC, a connected phone, a Linux box over SSH, or an FTP drop box without opening a separate client.
- Anyone who has asked *"which folder is 40 GB?"* and wants a sunburst map instead of another disk-usage tool.
- People who ask Chat to find a file in a tree, jump to a heading, or change one section without rewriting the whole document.

---

## Open a location

The **address bar** at the top of the panel shows where you are. Click a segment of the path to jump up; type a path or address and press Enter to go there.

**Alt+F1** opens the location menu: bookmarks, recent folders, local places (Desktop, Downloads, Documents, Pictures, Music, Videos), cloud folders that Windows already knows (OneDrive, Google Drive, Dropbox, and similar), drives, and connected phones.

Toolbar buttons: **Back**, **Up**, **Forward**, **list / icon** toggle, **Search**, **bookmark this folder**, and **new file panel** (a second panel, so you can copy between two places).

| Where | How to open it |
|:------|:---------------|
| This PC | Location menu, or type a path such as `C:\Projects` |
| Bookmarked folder | Star on the toolbar, or **Alt+F1** → Bookmarks |
| Phone / camera (MTP) | **Devices** in the location menu, or type `mtp://…` |
| SSH / SFTP host | Type `ssh://…` or `sftp://…` in the address bar |
| FTP / FTPS server | Type `ftp://…` or `ftps://…` in the address bar |
| Tanit storage | **Tanit** in the location menu (Home, Models, Software) |

While you are already on a remote host, a path that starts with `/` stays on that host — so `/var` on `ssh://workshop` opens `ssh://workshop/var`, not a local folder named `var`.

If the address points at a file (an image on the phone, a log on SSH), the panel opens the parent folder and selects that file.

---

## SSH and SFTP

Browse a remote machine over SSH the same way you browse a local disk. Open a file to preview it in the viewer; copy and paste to upload or download.

Hosts from your SSH config (`~/.ssh/config`) use the short form. Password sessions put the user and password in the address.

```
ssh://workshop
ssh://workshop/opt
ssh://workshop/home/you/readme.md
ssh://user@host:2222/var/log
sftp://user:password@host/var
sftp://user:password@host:2222/home/user
```

- `ssh://workshop` opens the server's home directory (whatever the session starts in). After the first listing, the bar shows the real path.
- `ssh://workshop/` is the remote filesystem root (`/`). Use **Up** from home to get there.
- `sftp://` is the same connection when you want the password in the URL. `ssh://user:password@host/path` works too.

Copy, cut, paste, delete, and drag-and-drop use the same transfer queue as local folders. Organization policy can disable SSH; if a host will not open, that is often why.

---

## FTP and FTPS

FTP is a bookmark-style address: host, user, and password live in the URL so Recents can reopen the same session.

```
ftp://user:password@host/pub
ftp://user:password@host:2121/inbox
ftps://user:password@host/
```

- An empty path is the server's login directory. `ftp://user:password@host/` is `/` on the server.
- **FTPS** (`ftps://`) is FTP over TLS. Plain `ftp://` is unencrypted.
- Same browsing and copy/paste as SSH. Copying **directly between a phone and an FTP server** is not supported — copy to this PC first, then out again.

---

## Phones and cameras (MTP)

Plug in a phone or camera and it appears under **Devices** in the location menu. Folders use the names you see on the device (`Internal storage`, `DCIM`, and so on).

```
mtp://realme
mtp://realme/Internal storage/DCIM
mtp://realme/Internal storage/DCIM/IMG.jpg
```

If two devices share a name, the address can include a hardware pin after `@` so the right one opens. Copy photos off the device with the same copy/paste and drag-and-drop as any other folder.

---

## Copy, cut, paste, and drag

Select items, then copy or move them anywhere the panel can open — this PC, a second file panel, SSH, FTP, a phone, or Tanit storage.

| Action | Shortcut |
|:-------|:---------|
| Copy | **Ctrl+C** |
| Cut | **Ctrl+X** |
| Paste | **Ctrl+V** |
| Delete | **Delete** |
| Cancel a pending cut | **Escape** |
| Select all | **Ctrl+A** |

- **Paste** goes into the current folder. If exactly one folder is selected, paste goes *into that folder* instead.
- Cut items look faded until you paste or press **Escape**.
- Drag items onto another folder in the panel, onto a second file panel, or onto chat.
- Drop files from File Explorer onto the current folder (or a folder under the cursor).
- Paste a bitmap from the clipboard into a **local** folder — it is saved as an image file. Remote folders do not accept a raw clipboard image; copy a file instead.

### Copy / Move with a destination box

The command palette **Copy** and **Move** commands (file panels) ask for a destination. Type a path or remote address, pick from history, or browse. If you have two file panels open, the other panel is offered as the destination.

### When a name already exists

The transfer pauses and asks what to do:

- **Overwrite** — replace the file at the destination
- **Skip** — leave the destination as-is
- **Rename** — keep both (a new name is suggested)
- **If newer** — replace only when the source is newer
- **Cancel** — stop the rest of the job

Tick **Do this for the remaining files** to apply the same choice to the rest of the batch. Progress lives in the **queue** panel.

---

## View modes

Press **Alt** and a number to switch how the current folder is displayed. Folders are listed before files in every mode. The same names appear under **View options** (**Shift+F1**).

| Mode | Shortcut | What you see |
|:-----|:---------|:-------------|
| Tree | **Alt+1** | Folder tree you can expand in place |
| Brief | **Alt+2** | Name only — compact list |
| Type | **Alt+3** | Name and type (default) |
| Size | **Alt+4** | Name and size; folder totals fill in as they are measured |
| Icons | **Alt+5** | Thumbnail grid (images load as you scroll) |
| Tiles | **Alt+6** | Icon plus name and details on each card |
| Types | **Alt+7** | Grouped by file type, with section headers |
| Sunburst | **Alt+8** | Full-panel folder size map (see below) |

**Ctrl++** / **Ctrl+-** zoom tiles and thumbnails.

Turn extra columns on from **Shift+F1** → Columns: Type, Size, Extension, Date, Resolution (pixel size of images). Showing the Size column also starts folder-size scanning on local disks.

**Size** view and **Sunburst** scan folder totals in the background for local disk folders. Sizes update as deeper folders are measured. Remote locations (SSH, FTP, phones) show file sizes only.

---

## Sorting

Press **Ctrl** and a function key to sort the current folder. Press the same shortcut again to reverse direction (ascending ↔ descending). Folders stay at the top either way.

| Sort by | Shortcut |
|:--------|:---------|
| Name | **Ctrl+F3** |
| Extension | **Ctrl+F4** |
| Time (modified) | **Ctrl+F5** |
| Size | **Ctrl+F6** |

Name sort uses natural ordering (`file2` before `file10`). Size sort uses scanned folder totals when they are available, so subfolders reflect real disk usage rather than showing zero.

**F5** alone refreshes the listing (without changing sort).

---

## Sunburst map

**Alt+8** switches to **Sunburst** — a circular chart of the current folder, drawn by relative size. The center is this folder; each outer ring is the next level of children. Larger slices take more space. Tiny items are grouped as **Other**.

- **Click** a file slice to select it, or a folder slice to open that folder.
- **Mouse wheel** zooms the chart in and out.
- Hover a slice to see its name and size. The center shows the running total.
- Sizes fill in as the background scan progresses — same data as Size view.

Use Sunburst when you want a quick visual answer to *"what's heavy in this directory?"* without walking the tree by hand. Click a heavy folder to drill into it.

---

## Navigation

| Action | Shortcut |
|:-------|:---------|
| Back | **Alt+←** |
| Forward | **Alt+→** |
| Up one folder | **Backspace** |
| Refresh | **F5** |
| Open location menu | **Alt+F1** |
| View options | **Shift+F1** |
| Open selected item / enter folder | **Enter** |
| Rename | **F2** |
| Preview (lightbox) | **Space** |
| Search | **Ctrl+F** or **F3** |
| Context menu | **Shift+F10** or right-click |
| Glob select | **Num+** |

Type letters to **find by name** in the current folder — matching starts from the focused item and wraps around. **Escape** clears that filter string (and also cancels a pending cut).

Arrow keys move focus; **Home** / **End** jump to the first or last item. **Page Up** / **Page Down** scroll by a page in list views. **Shift+click** or **Shift+arrow** extends the selection; **Ctrl+click** toggles one item.

Right-click opens the usual Windows context menu for the clicked item (or the current selection). On remote folders, copy / cut / paste / delete go through Tanit's transfer queue instead of Explorer.

---

## Search, glob select, and hidden files

**Ctrl+F** (or **F3**) opens search in the file panel. Results stay in the same pane; Enter opens a hit.

**Num+** (numeric keypad plus) opens **glob select**. Type a mask such as `*.wav`, `*.jpg;*.png`, or `*.{jpg,png}`:

- **Select** highlights matching files in the current folder (optionally recursive).
- **Filter** hides non-matching files in every folder until you clear it. Folders stay visible so you can still browse.

**Shift+F1** → **Show → Hidden** lists hidden files and names that start with a dot. Off by default.

---

## Ask Chat to find and edit files

The file panel and Chat share a workspace. Chat already knows the **current folder** and any **selected files** (and what is open in the viewer). Relative names resolve there — you do not have to paste a full path every time.

Ask in plain language. The assistant calls file tools; you can follow those calls in the Log. Writes that leave the workspace, or anything destructive, go through the usual consent prompt.

### Find a particular file

| You might say | What Chat does |
|:--------------|:---------------|
| “List the Markdown files here” | Matches a glob in the current folder (`*.md`, `src/**/*.cpp`, a directory). Skips junk such as `.git` and `node_modules` unless you ask otherwise. |
| “Where is `grant` in the file names?” | Fast **name** search across the tree (good on large projects). |
| “Find the heading `### grant`” / “Where do we mention the serial?” | **Content** search — literal text by default, or a regex when you need one. You can limit by type (`*.md`, C++, JSON) and ask for surrounding lines. |
| “How many photos are in this shoot?” | Lists images in the folder (JPEG, PNG, WebP, RAW, and similar). Read-only. |

On a large file, Chat does **not** swallow the whole thing. It locates the hit, then reads a **window of lines** around it (about 400 lines at a time). An unwindowed read of a big file is refused — that is intentional, so a 2,000-line spec is not dumped into the prompt.

Tanit cloud storage is separate from this disk: Chat can list, download, or upload files there when you are signed in. Local globs stay on this PC.

### Fine-grained edits

For an **existing** text file, Chat is steered away from “read everything, write everything back.” The path is:

1. **Locate** the section (search by heading or unique phrase).
2. **Read** just that window of lines.
3. **Replace** a unique snippet with the new text.

The replacement must match once (or you can say “replace all”). If the snippet appears twice, the edit fails with line numbers instead of guessing — Chat then widens the snippet or pins a line range. Empty replacement deletes the snippet. Binary and image files are refused here; use image tools for pictures.

Use a full rewrite only when you really want a new file, or when the task is “replace this whole document.” Creating notes, reports, and Markdown from scratch still writes the complete body in one step.

| You might say | What Chat does |
|:--------------|:---------------|
| “In `handbook.md`, change the grant section to …” | Search → read that region → surgical replace. The rest of the file is left alone. |
| “Write `notes.md` in this folder with …” | Create or overwrite a UTF-8 text file. |
| “Delete `scratch.tmp`” | Removes that one regular file. Folders are not deleted this way. |

Chat shows which files changed. A one-section tweak on a large handbook should not rewrite thousands of untouched lines.

Paths you invent (a folder that is not the current one, a file that is not selected) fail — point Chat at the file panel folder, select the file, or `@`-mention it in the composer.

---

## Status bar

The strip at the bottom of the file panel shows:

- item count and selection count
- current **view mode** and its shortcut (e.g. `Type (Alt+3)`)
- current **sort** and its shortcut (e.g. `Size ↓ (Ctrl+F6)` when sorted by size descending)
- active type-ahead or glob filter text, if any

---

## Tips

- Open a **second file panel**, put the source on one side and the destination on the other, then Copy / Move — or just drag.
- Switch to **Type** when you care about kinds of files; **Brief** when you only need names; **Size** when you are cleaning up.
- Use **Ctrl+F6** (Size) after folder scanning has run to float the largest items to the top — handy before archiving.
- **Sunburst** shows several hierarchy levels at once; click a heavy folder to drill into it.
- Bookmark remote sessions you reuse (`sftp://…`, `ftp://…`, `ssh://workshop/opt`). They land in Recents after the first visit, and you can star the current folder from the toolbar.
- On a phone, start at the device name, then open **Internal storage** (or **SD card**) before you hunt for `DCIM`.
- To change one heading in a long document, select the file (or `@` it) and say which section — Chat searches and edits that region instead of rewriting the file.
