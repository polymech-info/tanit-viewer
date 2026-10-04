---
title: Tanit 3D
slug: tanit-3d
description: Preview meshes, CAD, FreeCAD documents, and OpenSCAD in the centre viewer — rotate, shade, and check the file without a specialist app.
tags: [tanit, 3d, cad, step, stl, freecad, openscad, mesh]
category-id: [knowlede-base]
private: false
hidden: false
---

<!-- markdownlint-disable MD025 -->

# 3D: open the model, turn it, check it

Select a mesh, a STEP file, or a FreeCAD document in the file panel. The
centre viewer loads it in place — shaded surfaces, optional edges, wireframe,
or hidden lines. Orbit with the mouse; fit, front, top, and isometric from
the toolbar.

No separate CAD package has to start. Chat still sees the file next to the
preview.

> Available capabilities can vary by edition and organization policy.

---

## Who it's for

- Anyone reviewing a print, scan, or supplier STEP without waiting for a
  CAD seat to boot.
- People who keep STL / OBJ / glTF next to the rest of the job folder and
  want to spin the part in the same window as the drawings.
- FreeCAD users who want a fast look at an `.FCStd` (bodies, colours, and
  construction geometry) before opening the full document.
- OpenSCAD users who want a compiled preview of a `.scad` file from the
  folder they already have open.

---

## Open a model

Click the file in the file panel, or drop it on the viewer. Double-click in
Explorer also works when Tanit is registered for that type.

The native 3D viewer is on by default (**Settings → Appearance**). If the
plugin is missing, Tanit falls back to the web 3D preview for the same
extensions.

While it loads you see a spinner. A file that cannot be read shows an error
in the viewer — the file on disk is unchanged.

---

## Look around

| Control | What it does |
|:--------|:-------------|
| Drag | Orbit |
| Scroll | Zoom |
| Fit | Frame the whole model |
| Front / Top / Iso | Standard views |
| Shaded | Solid surfaces |
| Edges | Shaded surfaces with outlines |
| Wireframe | Edges only |
| Hidden lines | Visible edges, hidden ones dashed |
| Perspective | Toggle perspective and orthographic |

The navigation cube in the corner jumps to a face the same way.

Colours come from the file when it stores them (typical for STEP and
FreeCAD). Meshes without a colour use a neutral grey.

---

## Supported formats

### Meshes and scenes

| Extension | Typical source |
|:----------|:---------------|
| `.stl` | 3D prints, slicers |
| `.obj` | Mesh export |
| `.gltf` / `.glb` | glTF scenes |
| `.ply` | Scans, point-sampled meshes |
| `.3ds` | 3D Studio |
| `.3mf` | 3D manufacturing (zip package) |
| `.amf` | Additive manufacturing (XML or zip) |
| `.dae` | Collada |
| `.fbx` | Autodesk FBX (binary or ASCII) |
| `.vrml` / `.wrl` | VRML |

### CAD

| Extension | Typical source |
|:----------|:---------------|
| `.step` / `.stp` / `.stpz` | Neutral CAD exchange (colours when the file has them) |
| `.iges` / `.igs` | Neutral CAD exchange |
| `.brep` / `.brp` | Open CASCADE shape |
| `.fcstd` | FreeCAD document |

### Universal Scene Description and scientific meshes

| Extension | Notes |
|:----------|:------|
| `.usda` / ASCII `.usd` | USD ASCII meshes |
| `.usdz` | Zip package, when it contains ASCII USD |
| `.vtk` / `.vtp` | VTK polydata (ASCII VTK XML for `.vtp`) |

Binary `.usdc` (and a `.usdz` that only contains USDC) does not preview yet.

### Drawings and parametric source

| Extension | What you get |
|:----------|:-------------|
| `.dxf` | 2D drawing preview in the file viewer |
| `.scad` | OpenSCAD source compiled to a mesh preview |

OpenSCAD needs `openscad.exe` on PATH or in the app’s third-party folder.
Tanit compiles to a temporary STL, then shows that mesh. The web preview
keeps the parameter panel so you can change `-D` defines and recompile.
Without OpenSCAD installed, the viewer explains that the compiler is
missing.

### Convert or export something else

The viewer does not write new CAD or mesh formats. For that, add a
[custom command](../commands/commands-intro.md) that calls FreeCAD,
OpenSCAD, `ffmpeg`, or any other tool you already use.

Point it at the current selection (`${CURRENT_FILE}`, `${SRC_DIR}`,
`${SRC_NAME}`). **Run once per file** when each input should produce its
own output (STEP → STL, a folder of OBJ files). **Run once for all** when
one job should see the whole selection (merge, pack, compare).

The same command runs from the ribbon, Explorer, the file panel, Chat, or
`tanit-cli`. After it writes a supported file, open that file in the
viewer as usual.

---

## Size and time

Most models in the tens of megabytes open in the native viewer. Very large
tessellations take longer; a FreeCAD document can be much bigger than a
single STL because it carries the full part history.

The preview is a view of the file, not an editor. Saving still happens in
the tool that created the model.

---

## Related docs

- [Files](./feature-files.md) — folder, selection, Chat context
- [Commands](../commands/commands-intro.md) — custom actions, per file or
  batch
- [Tanit Viewer](../products/tanit-chat/product-tanit-viewer.md) — all
  centre-viewer formats
- [Images](./feature-images.md)
- [Video](./feature-video.md)

---------
