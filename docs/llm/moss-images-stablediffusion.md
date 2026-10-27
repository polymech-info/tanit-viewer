# Tanit — Local AI Image Capabilities

**Technical handover / parked roadmap**\
Status: **Research / Deferred**\
Date: 2026-10-26\
Target: Native C++ desktop application — Windows first, macOS/Linux later.

## 1. Objective

Extend Tanit's existing image viewer, batch processing and AI tool infrastructure with local AI-powered image operations:

- Text-to-image generation
- Image-to-image editing
- Selective editing / generative fill
- Object removal and replacement
- Automatic segmentation and masking
- Background removal and replacement
- Image restoration and upscaling
- Identity-preserving portrait generation
- Image understanding and object detection
- Depth estimation and depth-aware editing

Keep the application compact and self-contained. Avoid introducing Python, PyTorch, ComfyUI or large dependency trees into the core distribution.

**Guiding principle:** Add specialized models and capabilities to existing runtimes wherever possible, rather than integrating an entire AI application for each feature.

## 2. Existing Tanit Infrastructure

| Component                | Current role                                                                |
| ------------------------ | --------------------------------------------------------------------------- |
| C++ / Win32              | Native application                                                          |
| libvips                  | Image loading, conversion, resizing, compositing, batch operations          |
| llama.cpp                | LLM and multimodal inference                                                |
| ONNX Runtime             | Embeddings and other inference workloads                                    |
| Existing AI tools        | `image_create`, `image_understand`, `image_resize`, `image_transform`, etc. |
| CLI / agent architecture | Native tools, process execution, provider configuration                     |

Target test hardware: **NVIDIA RTX 3060 12 GB**, with optional CPU offloading.

## 3. Additional Inference Engine

### stable-diffusion.cpp

Repository: [https://github.com/leejet/stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp)

License: MIT (verify bundled dependencies separately).

Proposed role: Primary native generative image/video inference engine.

Capabilities include, depending on architecture and model:

- Text-to-image
- Image-to-image
- Inpainting and masked edits
- Instruction-based image editing
- LoRA
- AI upscaling
- Selected video-generation architectures
- Model quantization and CPU/GPU offloading

Relevant model families to investigate:

- MOSS-Image
- FLUX / FLUX.2 Klein
- Qwen-Image / Qwen-Image-Edit
- Z-Image
- Stable Diffusion / SDXL
- PhotoMaker

**Important:** Engine support is model- and version-dependent. Individual features must be confirmed against actual model-loading and inference tests.

### Integration strategy

**Phase 1: CLI subprocess**

Call `sd-cli` from Tanit's existing tool runner.

Advantages:

- Minimal integration complexity
- GPU failures and out-of-memory errors isolated from the main application
- Simple cancellation by terminating the process
- Independent binary updates
- No additional AI libraries loaded into the main process

Disadvantages:

- Repeated model-loading costs
- Temporary input/output files
- Limited structured progress and preview support

**Phase 2: Optional persistent native worker**

Use the stable-diffusion.cpp C API in a separate process.

Advantages:

- Keep models loaded between requests
- Pass images and masks as memory buffers
- Structured progress callbacks
- Intermediate previews
- Better control of GPU memory and model lifetime
- Cooperative cancellation where supported

Do not embed the diffusion runtime directly into the main Win32 process initially.

## 4. Proposed Image Editing Pipeline

Example request: *Remove the red car from this photograph.*

```
Tanit Image Viewer
       |
       v
User input
  - Brush / rectangle
  - Click object
  - Text instruction
       |
       v
Object Selection
  - Manual mask
  - ONNX segmentation
  - Detector + segmentation
       |
       v
Mask Processing (libvips)
  - Dilate
  - Feather
  - Crop / expand context
  - Resize / normalize
       |
       v
Editing Engine
  - LaMa (fast object removal)
  - stable-diffusion.cpp (generative edits)
       |
       v
Output Compositing (libvips)
  - Preserve original outside mask
  - Blend repaired region
       |
       v
Tanit Viewer
  - Preview / compare
  - Accept / reject
  - Undo
  - Save / export
```

### Crop-first optimization

For selective edits:

1. Calculate the selected mask's bounding box.
2. Expand it to include surrounding visual context.
3. Extract source image, mask and contextual crop.
4. Run inference on the crop.
5. Resize or align the result to the original coordinates.
6. Composite only the selected region back into the original.

Benefits:

- Lower VRAM usage
- Shorter generation times
- Preserved resolution outside the edited region
- Less unintended alteration of image content

The crop must retain sufficient context for lighting, shadows, perspective and background reconstruction.

## 5. Candidate Projects

### Priority A — High practical value

| Project                                                                  | Purpose                                                 | Integration                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------ |
| [BiRefNet](https://github.com/ZhengPeng7/BiRefNet)                       | High-quality foreground extraction / background removal | ONNX                                 |
| [LaMa](https://github.com/advimman/lama)                                 | Fast object removal and background reconstruction       | ONNX conversion                      |
| [Segment Anything](https://github.com/facebookresearch/segment-anything) | Click-to-select, interactive object masks               | ONNX                                 |
| [FLUX.2 Klein](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B) | Image generation and prompt-based editing               | stable-diffusion.cpp, verify support |

**BiRefNet**

- Single-image foreground/background separation.
- Particularly useful for product photography and batch processing.
- No generative model needed.
- Investigate ONNX-exported model variants and licensing.

**LaMa**

- Specialized object removal.
- User supplies image + mask.
- Reconstructs background without a text prompt.
- Potentially much faster than diffusion models.
- Investigate ONNX conversions and performance on consumer GPUs.

**SAM**

- Point-based object selection.
- Bounding-box prompting.
- Pixel-level masks.
- Can be combined with object detection.
- Original SAM is a sensible starting point for ONNX integration.

Also investigate SAM 3/3.1 for text-prompted segmentation and video tracking. These are substantially heavier and require separate runtime and licensing evaluation.

**FLUX.2 Klein 4B**

- Compact diffusion architecture.
- Image generation and editing.
- Promising consumer-GPU performance.
- Evaluate actual stable-diffusion.cpp support, quantization and memory usage.

### Priority B — Useful specialized features

| Project                                                                 | Purpose                                      | Notes                                       |
| ----------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| [PhotoMaker](https://github.com/TencentARC/PhotoMaker)                  | Identity-preserving portrait generation      | Check V1 versus V2 native support           |
| [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)                   | Image restoration/upscaling                  | May already be covered by diffusion runtime |
| [GFPGAN](https://github.com/TencentARC/GFPGAN)                          | Face restoration                             | ONNX feasibility                            |
| [Depth Anything V2](https://github.com/DepthAnything/Depth-Anything-V2) | Monocular depth estimation                   | ONNX                                        |
| [Qwen-Image-Edit](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)     | Instruction-based editing, text modification | Heavy models, offloading                    |
| [MOSS-Image](https://github.com/OpenMOSS/MOSS-Image)                    | High-quality image generation                | stable-diffusion.cpp                        |

**PhotoMaker**

Potential Tanit operations:

- Create profile pictures from reference photos.
- Preserve facial identity while modifying clothing, scene or style.
- Generate consistent portraits without per-person model training.

PhotoMaker V1 has a documented native implementation connection to stable-diffusion.cpp. Verify current support for PhotoMaker V2 separately.

**Depth Anything V2**

Potential operations:

- Depth mask generation
- Simulated depth of field
- Foreground/background effects
- Depth-guided image editing

### Priority C — Alternative infrastructure

| Project                                                             | Role                                                 | Recommendation                        |
| ------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| [edge-dit.cpp](https://github.com/THU-MIG/edge-dit.cpp)             | Alternative diffusion inference / low-VRAM execution | Benchmark, don't bundle automatically |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI)                | External generative AI workflow server               | Optional API provider                 |
| [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx)                | Speech/audio inference pipelines                     | Separate audio roadmap                |
| [OpenVINO GenAI](https://github.com/openvinotoolkit/openvino.genai) | Intel-specific AI acceleration                       | Investigate for Intel NPU hardware    |

Avoid duplicate runtimes unless they provide a measurable capability or performance advantage.

## 6. Image Vision Is a Separate Capability

Do not confuse image generation with image understanding.

| Task                      | Preferred backend        |
| ------------------------- | ------------------------ |
| Image captioning          | llama.cpp multimodal VLM |
| Visual question answering | llama.cpp multimodal VLM |
| Object detection          | ONNX Runtime             |
| Object segmentation       | ONNX Runtime             |
| Depth estimation          | ONNX Runtime             |
| Background removal        | ONNX Runtime             |
| Generative editing        | stable-diffusion.cpp     |
| Image compositing         | libvips                  |

A diffusion model's vision encoder is not necessarily exposed as a general-purpose image-understanding interface.

### Natural-language selections

Example:

`Remove the red car in the background.`

Proposed execution:

1. llama.cpp interprets the instruction.
2. A text-grounded detector locates candidate objects.
3. A segmentation model produces the exact mask.
4. Tanit allows the user to confirm or adjust the selection.
5. LaMa or a diffusion editing model removes the object.

Text-grounded detection may require an additional model, such as Grounding DINO. A conventional object detector alone does not necessarily support arbitrary text queries.

## 7. UI / UX Integration

Do not build separate interfaces for every model.

Extend Tanit's existing image viewer with a small set of operations:

| Action            | Behavior                                          |
| ----------------- | ------------------------------------------------- |
| Remove            | Remove selected object and reconstruct background |
| Replace           | Replace selected object from prompt               |
| Fill              | Generative fill within selected area              |
| Select Object     | Automatic segmentation                            |
| Remove Background | Foreground extraction                             |
| Enhance           | Upscale / restore / denoise                       |
| Generate          | Text-to-image                                     |
| Describe          | Vision-language understanding                     |
| Depth             | Generate depth map                                |
| Portrait          | Identity-preserving generation                    |

Selection tools:

- Rectangle
- Freehand brush
- Eraser
- Point/click selection
- Automatic object selection
- Prompt-guided selection

Editing should be non-destructive until accepted, with previews, before/after comparison and undo support.

### Batch operations

Especially useful in Tanit:

- Remove backgrounds from all selected photographs.
- Upscale all images in a folder.
- Restore old scanned photographs.
- Generate descriptions and metadata.
- Extract foreground objects.
- Apply a repeated editing recipe.

Use the existing file manager and job infrastructure.

## 8. Unified AI Model Registry

Models should declare capabilities and required components rather than relying on file extensions.

Example conceptual schema:

```
id: flux2-klein-4b
architecture: flux2-klein
runtime: stable-diffusion-cpp

capabilities:
  - image.generate
  - image.edit

components:
  - role: denoiser
    format: safetensors
  - role: text_encoder
  - role: vae

execution:
  gpu: optional
  cpu_offload: true
  persistent: false

requirements:
  vram_mb: null
  system_ram_mb: null
```

Requirements should be populated using actual benchmarks for a specific quantization and runtime, not inferred solely from parameter counts.

Proposed capability names:

```
image.understand
image.detect
image.segment
image.background.remove
image.object.remove
image.object.replace
image.inpaint
image.generate
image.edit
image.enhance
image.identity
image.depth
video.generate
```

Multiple models may provide the same capability.

Keep model/runtime selection independent of the user-facing operation.

## 9. Performance Considerations

Target hardware: RTX 3060, 12 GB VRAM.

### MOSS-Image

Previous research identified community reports around:

- 25-step generation: approximately 57 seconds
- 50-step generation: approximately 137 seconds

These are indicative ComfyUI measurements, **not verified stable-diffusion.cpp benchmarks**.

Actual results depend on quantization, resolution, model-loading strategy and offloading.

### General optimization strategy

- Use compact ONNX models for segmentation, background removal and restoration.
- Use diffusion only when generative reconstruction is required.
- Prefer crop-based processing for localized editing.
- Keep one heavyweight generation model resident at a time.
- Coordinate memory usage between llama.cpp and diffusion runtimes.
- Avoid simultaneous GPU-heavy jobs on low-VRAM hardware.
- Expose cancellation and structured progress.
- Benchmark both first-run and warm-model performance.

Record:

- Model and exact revision
- Quantization
- Resolution
- Inference steps
- Model-loading time
- Inference time
- Peak GPU memory
- Peak system memory
- GPU/CPU utilization
- Output quality

## 10. Security and Licensing

Before distributing any model or backend:

- Verify code license.
- Verify model-weight license separately.
- Check commercial redistribution permissions.
- Record model provenance, version and checksums.
- Review dependencies and third-party notices.
- Isolate externally supplied models and GPU workloads.
- Limit file access and process privileges where practical.

Examples requiring special attention:

- SAM 3: separate licensing review.
- PhotoMaker: third-party model dependencies.
- BRIA background-removal models: some versions require commercial licensing.
- FLUX family: license differs by model variant.
- GGUF community conversions: verify provenance and original model terms.

Prefer official repositories and validated conversions.

## 11. Proposed Implementation Order

### Phase 1 — Core editing

- Build stable-diffusion.cpp CLI with CUDA.
- Validate MOSS-Image generation.
- Benchmark RTX 3060 12 GB.
- Connect CLI to Tanit's tool runner.
- Implement image + mask passing.
- Implement brush-mask editing in viewer.
- Test model-supported inpainting.
- Evaluate LaMa ONNX for faster removal.

### Phase 2 — Smart selections

- Evaluate BiRefNet ONNX.
- Evaluate SAM ONNX.
- Implement click-to-select.
- Mask dilation and feathering.
- Crop-based editing and compositing.
- Background removal batch operation.

### Phase 3 — Advanced generation

- Benchmark FLUX.2 Klein 4B.
- Evaluate Qwen-Image-Edit.
- Test PhotoMaker V1/V2.
- Evaluate Real-ESRGAN and GFPGAN.
- Add non-destructive edit history.

### Phase 4 — Optional extensions

- Grounded object detection from text.
- Depth Anything V2.
- Video object segmentation.
- ComfyUI external provider.
- Persistent diffusion worker using C API.
- Benchmark edge-dit.cpp.

## 12. Architectural Decisions

**Agreed direction**

1. Keep Tanit's main application native C++.
2. Keep libvips for conventional image operations.
3. Reuse llama.cpp for image understanding.
4. Reuse ONNX Runtime for compact vision models.
5. Add stable-diffusion.cpp as an optional generative runtime.
6. Prefer CLI integration initially.
7. Consider a persistent native worker only when justified by performance or UX.
8. Treat segmentation, editing and understanding as distinct operations.
9. Support masks, image selections and batch processing through Tanit's existing viewer and job architecture.
10. Avoid Python/PyTorch dependencies in the standard desktop distribution.

**Not yet decided**

- Default image-generation model
- Default image-editing model
- LaMa versus diffusion for object removal
- SAM version / model size
- GPU-residency and memory policy
- Model download/installation UX
- Whether to support external ComfyUI workflows
- Whether persistent diffusion contexts justify additional complexity

## 13. Recommendation When Resuming

**Do not begin by integrating every model.**

Build one end-to-end workflow:

`Open image → Paint mask → Remove object → Preview → Accept → Save`

Use LaMa or a verified inpainting model as the initial backend.

Once that works, add automatic segmentation with SAM, then prompt-guided generative replacement.

This establishes the image editing UX, job APIs, mask representation and non-destructive workflow that nearly every subsequent AI image feature will reuse.

---

**Status: PARKED — research captured, no implementation committed.**

Revisit when Tanit's existing image viewer and tool infrastructure are ready for selective AI image editing.

Resolve the Phase 1 backend choiceAdd explicit model lifecycle decisions