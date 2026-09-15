# Files: browse, sort, and see what takes space

Tanit's built-in file panel is a fast way to move through folders without leaving the workbench. Open a path, switch how items are shown, sort the list, and — when you need it — see which subfolders are actually eating disk space.

The shortcuts follow the same pattern as classic dual-pane file managers: **Alt+number** for view modes, **Ctrl+function key** for sort modes. The current layout and sort are always shown in the status bar at the bottom of the panel.

---

## Who it's for

- Anyone who lives in local folders — projects, exports, photo shoots, client deliverables — and wants navigation beside chat and the viewer.
- People who sort by name, date, or size dozens of times a day and expect those shortcuts to be muscle memory.
- Anyone who has asked *"which folder is 40 GB?"* and wants an answer without opening a separate disk-usage tool.

---

## View modes

Press **Alt** and a number to switch how the current folder is displayed. Folders are listed before files in every mode.

| Mode | Shortcut | What you see |
|:-----|:---------|:-------------|
| Brief | **Alt+2** | Name only — compact list |
| Detailed | **Alt+3** | Name, type, size, and modified time (default) |
| Icons | **Alt+4** | Icon grid |
| Thumbnails | **Alt+5** | Large thumbnail grid (images load as you scroll) |
| Tiles | **Alt+6** | Icon plus name and type on each row |
| Types | **Alt+7** | Grouped by file type, with section headers |
| Sunburst | **Alt+8** | Full-panel folder size map (see below) |

**Detailed** and **Sunburst** scan folder sizes in the background for local disk folders. Sizes update progressively in Detailed view; Sunburst uses the same data for its chart.

---

## Sorting

Press **Ctrl** and a function key to sort the current folder. Press the same shortcut again to reverse direction (ascending ↔ descending). Folders stay at the top either way.

| Sort by | Shortcut |
|:--------|:---------|
| Name | **Ctrl+F3** |
| Extension | **Ctrl+F4** |
| Time (modified) | **Ctrl+F5** |
| Size | **Ctrl+F6** |

Name sort uses natural ordering (`file2` before `file10`). Size sort uses scanned folder totals when available, so subfolder sizes reflect real disk usage rather than showing zero.

**F5** alone refreshes the folder listing (without changing sort).

---

## Folder sizes (Detailed view)

In **Detailed** view, the Size column shows live totals for each subfolder while you browse. Scanning starts after the folder list finishes loading and updates as deeper folders are measured — no need to open every directory first.

Folder size scanning applies to normal local paths on your PC. Virtual or remote locations may show file sizes only.

---

## Sunburst map

**Alt+8** switches to **Sunburst** — a three-level circular chart of the current folder, drawn by relative size. Each outer ring shows the next level of children; larger slices mean more disk space.

- **Click** a file segment to select it, or a folder segment to open that folder.
- **Mouse wheel** zooms the chart in and out.
- Hover a segment to see its name and size.
- Sizes fill in as the background scan progresses, same as in Detailed view.

Use Sunburst when you want a quick visual answer to *"what's heavy in this directory?"* without scanning the tree manually.

---

## Navigation

| Action | Shortcut |
|:-------|:---------|
| Back | **Alt+←** |
| Forward | **Alt+→** |
| Up one folder | **Backspace** |
| Refresh | **F5** |
| Open location menu | **Alt+F1** (from the address bar) |
| Open selected item / enter folder | **Enter** |

The address bar shows the current path. Use the location menu (**Alt+F1**) for favorites, recents, and quick jumps.

Type letters to **find by name** in the current folder — matching starts from the focused item and wraps around. **Escape** clears the filter string.

---

## Selection and file operations

| Action | Shortcut |
|:-------|:---------|
| Select all | **Ctrl+A** |
| Copy selection | **Ctrl+C** |
| Paste | **Ctrl+V** |
| Delete selection | **Delete** |
| Extend selection | **Shift+click** or **Shift+arrow** |
| Toggle item in selection | **Ctrl+click** |

Arrow keys move focus; **Home** / **End** jump to the first or last item. **Page Up** / **Page Down** scroll by a page in list views.

Right-click opens the standard Windows shell context menu for the clicked item (or the current selection).

---

## Status bar

The strip at the bottom of the file panel shows:

- item count and selection count
- current **view mode** and its shortcut (e.g. `Detailed (Alt+3)`)
- current **sort** and its shortcut (e.g. `Size ↓ (Ctrl+F6)` when sorted by size descending)
- active type-ahead filter text, if any

---

## Tips

- Switch to **Detailed** when you care about dates and sizes; **Brief** when you only need names.
- Use **Ctrl+F6** (Size) after folder scanning has run to float the largest items to the top — handy before archiving or cleanup.
- **Sunburst** shows three hierarchy levels at once; click a heavy folder to drill into it.
- The file tree panel can be toggled from the app command **`togglefiletree`** if you prefer the classic tree beside the file list.

---

## Under the hood

> Skip this if you just use the app.

The custom file panel is part of Tanit's native Windows UI (`FEATURE_FILEPANEL_CUSTOM`). It uses the Windows shell for local folders and can fall back to Explorer for unsupported locations. Folder size measurement walks each subfolder on a background thread and posts progressive updates to the view.

For developers and contributors, see the internal design notes in the repository: `docs/filepanel-next.md`, `docs/foldersize.md`, and `docs/folder-sunburst.md`.
