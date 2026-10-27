## Keyboard shortcuts

Reference for keyboard shortcuts in the XBlox builder (`apps/xblox`). Shortcuts use **Ctrl** on Windows/Linux and **Cmd (⌘)** on macOS unless noted.

Shortcuts are ignored while typing in a text field, search box, property editor, or other input. Some overlays (block properties, insert palette, context menu) also suspend global shortcuts until they are closed.

---

### View modes (center preview)

These work from anywhere in the builder except while an overlay has focus (see above). The numbered shortcuts match the **left-to-right order** of the view mode buttons in the toolbar; hidden modes are skipped, so **Alt+1** is always the first visible mode, **Alt+2** the second, and so on.

| Shortcut | Action |
|----------|--------|
| **Alt+1 … Alt+9** | Jump to the Nth visible center view mode |

Typical full build order when all panels are enabled:

| # | Mode |
|---|------|
| 1 | Block list (tree) |
| 2 | Variables |
| 3 | Run log *(preview)* |
| 4 | Wiring |
| 5 | Flow diagram |
| 6 | Sequence diagram |

Hover a view mode button to see its label and **Alt+N** hint.

---

### View panel toggles (toolbar)

Toggle the side/bottom dock panels (**View toggles** group in the toolbar). Same shortcuts as the button tooltips.

| Shortcut | Panel |
|----------|--------|
| **Alt+←** | Block palette (left) |
| **Alt+↓** | Run log panel (bottom) |
| **Alt+→** | Properties panel (right) |

Each shortcut shows or hides the matching panel. Unavailable panels are skipped (embedded builds may hide palette, log, or properties).

---

### Insert block palette

Works in **block list** and **wiring** views (and any other center view that uses the shared builder insert menu).

| Shortcut | Action |
|----------|--------|
| **+**, **=**, or **Numpad +** | Open insert palette — insert **after** the selected block, or **append at end** if nothing is selected |
| **Numpad −** | Open insert palette — insert **before** the selected block, or **before the first block** if nothing is selected |


In **wiring** view you can also click a **+** arm between blocks to open the same palette at that gap.

### Inside the insert palette

| Shortcut | Action |
|----------|--------|
| Type | Filter blocks by name |
| **↑** / **↓** | Move highlight |
| **Home** / **End** | First / last item |
| **Enter** | Insert highlighted block |
| **Esc** | Close without inserting |

---

### Block list (tree view)

Click the block tree (or tab to it) so it has focus, then use:

#### Selection & navigation

| Shortcut | Action |
|----------|--------|
| **↑** / **↓** | Select previous / next visible row |
| **Shift+↑** / **Shift+↓** | Extend selection |
| **Home** | Select first row |
| **End** | Select last row |
| **→** | Expand block and select first child, or move to next sibling |
| **←** | Collapse expanded block, or move to previous sibling |
| **Backspace** | Go to parent block / exit nested list |
| **Enter** | Open block properties *(when properties panel is enabled)* |
| **Ctrl+Enter** or **Enter** | Enter block (drill into first child list) *(when navigation is enabled and properties dialog is off)* |
| **F2** | Focus inline editor on the selected row |

#### Edit & run

| Shortcut | Action |
|----------|--------|
| **Ctrl+Z** | Undo |
| **Ctrl+Shift+Z** or **Ctrl+Y** | Redo |
| **Ctrl+C** | Copy selected block(s) |
| **Ctrl+V** | Paste |
| **Delete** | Delete selected block(s) |
| **Ctrl+S** | Save document |
| **R** | Run selected block |
| **Ctrl+R** | Run chain from selected block (or current chain if none selected) |

#### Move blocks

Requires the **move** action to be enabled.

| Shortcut | Action |
|----------|--------|
| **Ctrl+↑** / **Ctrl+↓** | Move block up / down in list |
| **Ctrl+←** | Outdent (move out of nested list) |
| **Ctrl+→** | Indent (move into previous sibling’s child list) |

---

### Wiring view

Wiring shortcuts are global while the wiring canvas is shown (no need to focus the canvas first), except in typing contexts and overlays.

#### Selection & navigation

| Shortcut | Action |
|----------|--------|
| **↑** / **↓** | Select previous / next block in flow order |
| **←** / **→** | Navigate linked **scope variables** when scope pins are shown *(see below)* |
| **Space** | Pan/zoom to selected block (~105% zoom) |
| **Shift++**, **Shift+=**, or **Shift+Numpad +** | Zoom in |
| **Shift+−** or **Shift+Numpad −** | Zoom out |

**Scope variable navigation** (only when scope variables are visible on blocks):

- **←** on a block with linked scope vars: enter scope selection on the first linked variable.
- **→** while a scope var is selected: move to the next linked scope var, or return to the block.
- **←** while a scope var is selected: move to the previous linked scope var, or return to the block.

**Alt+arrow** keys are reserved for **view panel toggles** and are not used for wiring navigation.

#### Edit & run

Same as the block list where applicable (including **Ctrl+C** / **Ctrl+V** cross-instance copy and paste):

| Shortcut | Action |
|----------|--------|
| **Ctrl+C** | Copy selected block to clipboard (serialized JSON, works across app instances) |
| **Ctrl+V** | Paste after the selected block, or append at list end if nothing is selected |
| **Ctrl+Z** / **Ctrl+Shift+Z** / **Ctrl+Y** | Undo / redo |
| **Delete** | Delete selected block, or delete selected wire/link |
| **Backspace** | Delete selected wire/link, or go to parent block |
| **R** | Run selected block |
| **Ctrl+R** | Run chain from selected block |
| **Enter** | Open properties *(properties dialog)* or enter/open block *(navigation)* |
| **Ctrl+Enter** | Enter/open block *(navigation)* |

#### Move blocks

| Shortcut | Action |
|----------|--------|
| **Ctrl+↑** / **Ctrl+↓** | Move block up / down |
| **Ctrl+←** / **Ctrl+→** | Outdent / indent |

#### Bottom toolbar (display & view)

Matches the wiring footer toolbar left-to-right. Hover a button to see its **Ctrl+N** hint.

| Shortcut | Action |
|----------|--------|
| **Ctrl+1** | Side pin layout |
| **Ctrl+2** | Vertical pin layout |
| **Ctrl+3** | Toggle scope variables |
| **Ctrl+4** | Wired params preset |
| **Ctrl+5** | All params preset |
| **Ctrl+6** | Toggle show group |
| **Ctrl+7** | Toggle show types |
| **Ctrl+8** | Toggle show set values |
| **Ctrl+9** | Toggle complete data flow |
| **Ctrl+0** | Fit flow to view |

**Space** focuses the selected block or link (crosshair button). **Delete** removes a selected link when the remove action is available.

Use **+** / **−** (see [Insert block palette](#insert-block-palette)) to add blocks at the selection or list ends.

Double-click a **parameter row** (input, output, or edge pin label) to open the properties panel, scroll to that field, and highlight it. Canvas double-click no longer zooms (use **Shift+±** or toolbar zoom instead).

---

### Mouse complements (not keyboard)

Worth knowing when learning the wiring and tree UIs:

- **Shift+click** in the tree: range selection.
- **Ctrl+click** ( **⌘+click** on Mac): toggle row in multi-selection.
- **Click** empty tree background: clear selection.
- **Right-click** a block: context menu (run, copy, delete, etc.).

---
