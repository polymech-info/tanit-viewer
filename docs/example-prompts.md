# Example Prompts for Generative AI Images

High-quality image prompts are usually specific, visual, and structured. The strongest prompts describe **what is in the image**, **how it is composed**, **the medium/style**, **lighting/color**, and **output constraints** such as aspect ratio or exclusions.

> Use these examples as starting points. Different image models interpret prompt syntax differently, so keep the creative description portable and add model-specific parameters only where supported.

---

## Prompt Quality Checklist

A strong image prompt usually includes:

1. **Subject** — the main person, object, place, product, or scene.
2. **Context / action** — what is happening and where.
3. **Composition** — close-up, wide shot, centered subject, rule of thirds, top-down, isometric, etc.
4. **Medium** — photo, 3D render, watercolor, editorial illustration, claymation, vector icon, concept art.
5. **Lighting** — softbox, golden hour, rim lighting, volumetric light, neon, overcast, cinematic shadows.
6. **Color / mood** — pastel, monochrome, warm, cool, muted, vibrant, optimistic, eerie, luxurious.
7. **Detail level** — minimal, clean, highly detailed, realistic texture, crisp edges.
8. **Camera / lens cues** for photographic prompts — macro, 35mm, 85mm portrait, shallow depth of field, long exposure.
9. **Output constraints** — aspect ratio, transparent background, isolated subject, no text, no watermark.
10. **Negative prompt / exclusions** where supported — blurry, distorted, extra limbs, low contrast, watermark, text.

### General Template

```text
[medium/type] of [subject], [action/context], [environment], [composition/framing], [lighting], [color palette/mood], [style/detail cues], [output constraints]
```

### Stable Diffusion-Style Template

```text
Positive prompt:
[subject], [scene], [composition], [style], [lighting], [detail/quality cues]

Negative prompt:
blurry, low quality, distorted anatomy, extra fingers, text, watermark, logo, cropped, oversaturated
```

### Midjourney-Style Template

```text
[subject and scene], [style], [composition], [lighting], [mood] --ar 16:9 --stylize 100 --no text, watermark, logo
```

---

## Copy-Ready Example Prompts

### 1. Product Photography — Luxury Skincare Bottle

```text
Studio product photograph of a frosted glass skincare serum bottle on a pale stone pedestal, soft beige background, minimal luxury branding area left blank, gentle condensation on glass, softbox lighting, subtle shadow, premium editorial composition, ultra-clean, realistic texture, high-end cosmetics campaign, no text, no watermark
```

**Use when:** you need ecommerce, advertising, or hero product imagery.

---

### 2. Product Photography — Tech Gadget

```text
Photorealistic hero shot of a compact matte-black wireless charging dock, floating slightly above a dark graphite surface, blue accent LED glow, dramatic rim lighting, shallow depth of field, premium consumer electronics advertisement, clean negative space on the right, sharp reflections, no logo, no text, no watermark
```

---

### 3. Editorial Portrait

```text
Editorial portrait photograph of a confident creative director in a modern studio, seated beside mood boards and fabric swatches, natural window light, 85mm lens look, shallow depth of field, calm focused expression, neutral earth-tone wardrobe, elegant magazine cover style, realistic skin texture, no text, no watermark
```

---

### 4. Cinematic Environment — Cyberpunk Street

```text
Cinematic wide shot of a rainy cyberpunk street market at night, neon signs reflected in wet pavement, steam rising from food stalls, pedestrians with umbrellas, layered depth, teal and magenta color palette, volumetric lighting, dramatic atmosphere, highly detailed urban worldbuilding, no text, no watermark
```

**Stable Diffusion negative prompt:**

```text
blurry, low contrast, oversaturated, distorted faces, extra limbs, unreadable text, watermark, logo, bad perspective
```

---

### 5. Cozy Interior Design

```text
Warm Scandinavian living room interior, low modular sofa, natural oak coffee table, textured wool rug, large window with soft morning light, indoor plants, ceramic objects, neutral cream and sage palette, architectural digest editorial photo, wide angle, clean composition, realistic materials, no people, no text
```

---

### 6. Food Photography

```text
Close-up food photograph of handmade mushroom ravioli in a shallow ceramic bowl, sage butter sauce, grated parmesan, fresh herbs, rustic linen napkin, warm restaurant lighting, shallow depth of field, appetizing texture, natural color, premium cookbook style, no text, no watermark
```

---

### 7. Character Design — Fantasy Explorer

```text
Full-body character design of a young desert explorer wearing layered linen robes, brass compass, weathered leather satchel, wind-swept scarf, sunlit dunes in the background, readable silhouette, practical costume design, warm ochre palette, detailed concept art, neutral pose, no text, no watermark
```

---

### 8. Creature Concept Art

```text
Creature concept art of a gentle moss-covered forest guardian, deer-like silhouette with branching antlers, glowing mushrooms growing along its back, misty ancient woodland, soft magical light, expressive eyes, whimsical but believable anatomy, highly detailed natural textures, fantasy artbook style
```

---

### 9. Children's Book Illustration

```text
Whimsical children's book illustration of a tiny fox sailing a walnut-shell boat across a moonlit pond, lily pads, fireflies, soft watercolor texture, rounded friendly shapes, gentle bedtime story mood, pastel blue and warm yellow palette, centered composition, no text
```

---

### 10. Minimal Vector Icon

```text
Minimal vector icon of a cloud with a small sparkle and upward arrow, rounded geometric shapes, flat design, two-color palette, crisp edges, centered on transparent background, app icon style, no text, no shadow
```

---

### 11. Isometric App Illustration

```text
Isometric 3D illustration of a creative workflow dashboard, floating panels, image thumbnails, sliders, color swatches, tiny stylized creators collaborating, clean rounded shapes, soft shadows, white and lavender background, modern SaaS landing page style, no readable text
```

---

### 12. Social Media Campaign Visual

```text
Bright summer campaign image of a reusable water bottle on a beach towel with citrus slices and sunglasses, top-down composition, vivid turquoise and coral palette, crisp sunlight, playful lifestyle brand mood, empty space for headline, no text, no watermark
```

---

### 13. Architectural Visualization

```text
Photorealistic architectural visualization of a small modern cabin beside a quiet alpine lake, timber and glass facade, warm interior lights visible at dusk, mountain reflection in water, cinematic wide angle, natural materials, peaceful atmosphere, realistic landscaping, no people, no text
```

---

### 14. Macro Nature Photo

```text
Macro photograph of dew drops on a vibrant green fern leaf, early morning forest light, extremely shallow depth of field, soft bokeh, crisp water droplets, natural color, peaceful organic mood, high detail, no text, no watermark
```

---

### 15. Poster-Style Graphic Without Text

```text
Bold retro-futurist poster illustration of a solar-powered train crossing a desert at sunrise, strong geometric shapes, limited orange teal cream palette, dramatic perspective, clean screenprint texture, large blank sky area for future typography, no text, no logo
```

---

### 16. Game Asset — Fantasy Potion

```text
Single fantasy potion bottle game asset, glowing emerald liquid inside a round glass vial, cork stopper, tiny gold label shape without writing, isolated on transparent background, hand-painted RPG inventory icon style, crisp silhouette, soft magical glow, no text
```

---

### 17. Fashion Lookbook

```text
High-fashion lookbook photograph of a model wearing an oversized ivory wool coat and structured black trousers, minimalist concrete studio, soft directional lighting, full-body pose, editorial styling, muted monochrome palette, sharp tailoring details, no text, no watermark
```

---

### 18. Scientific / Educational Illustration

```text
Clean educational illustration of a cross-section of healthy soil layers with roots, worms, pebbles, fungi networks, and water droplets, clear simplified shapes, natural earth-tone palette, textbook infographic style, no labels, no text, high readability
```

---

### 19. Sticker Design

```text
Cute die-cut sticker design of a smiling robot watering a tiny houseplant, thick white outline, rounded shapes, cheerful pastel palette, simple shading, centered composition, transparent background, kawaii style, no text
```

---

### 20. Abstract Background

```text
Abstract generative background of translucent glass ribbons flowing through a soft gradient space, iridescent blue violet and pearl colors, elegant motion, subtle depth, smooth reflections, premium tech brand wallpaper, no objects, no text, no watermark
```

---

## Model-Specific Notes

### Midjourney

- Add parameters at the end of the prompt.
- `--ar` or `--aspect` controls aspect ratio, for example `--ar 16:9`.
- `--no` excludes unwanted content.
- `--seed` helps reproduce or compare variations.
- Short, clear prompts often work better than long lists.

Example:

```text
Minimal editorial product photo of a ceramic coffee cup on a marble counter, morning sunlight, soft shadows, calm neutral palette --ar 4:5 --no text, logo, watermark
```

### Stable Diffusion / SDXL / FLUX-Style Workflows

- Many UIs support a separate **negative prompt** field.
- Some UIs support weighting like `(keyword:1.2)` to increase emphasis.
- Keep a reusable negative prompt for common artifacts, then customize it per image.
- Seeds, CFG/prompt guidance, sampler, steps, and image size can strongly affect output.

Example:

```text
Positive prompt:
(masterpiece, best quality), cinematic portrait of an astronaut botanist tending plants inside a greenhouse on Mars, warm interior lights, red desert visible through glass, detailed suit fabric, hopeful mood, shallow depth of field

Negative prompt:
blurry, low quality, distorted hands, extra fingers, bad anatomy, unreadable text, watermark, logo, oversaturated, cropped face
```

### DALL·E / GPT Image-Style Prompting

- Use natural language and be explicit about the desired result.
- Include composition, mood, style, and constraints in complete sentences.
- For edits, specify the area and the exact change.
- If text is needed in the image, keep it short and simple; otherwise say “no text.”

Example:

```text
Create a clean editorial illustration of a small team reviewing image generations on a large studio monitor. Use a modern flat-vector style, soft gradients, rounded shapes, and a white/lavender color palette. Leave empty space in the upper right for a headline. Do not include readable text or logos.
```

---

## Prompt Improvement Patterns

### Weak → Better

Weak:

```text
A nice logo
```

Better:

```text
Minimal vector logo mark of a sparkling pixel wand, geometric shapes, single-color black version, centered on white background, clean negative space, no text, no mockup
```

Weak:

```text
A city
```

Better:

```text
Wide cinematic view of a floating garden city above the clouds, glass bridges, hanging greenery, sunrise glow, soft mist, elegant futuristic architecture, hopeful atmosphere, detailed environment concept art
```

Weak:

```text
A woman in a room
```

Better:

```text
Natural-light portrait photograph of a ceramic artist in her sunlit studio, shelves of handmade pottery behind her, linen apron, calm expression, warm earthy palette, 50mm lens look, shallow depth of field, editorial documentary style
```

---

## Practical Rules of Thumb

- **Start simple, then iterate.** Add one modifier at a time so you know what changed.
- **Describe what you want, not only what you do not want.** Negative prompts help, but the positive prompt should carry the image.
- **Avoid contradictory instructions.** “Minimal” and “extremely detailed background” may fight each other.
- **Use exact numbers when count matters.** “Three candles” is better than “some candles.”
- **Prefer style descriptors over living-artist imitation.** Use “Art Nouveau botanical poster,” “Bauhaus geometric,” or “cinematic noir lighting” instead of copying a living artist’s name.
- **Reserve space intentionally.** For marketing graphics, say “empty space for headline” instead of expecting usable typography.
- **Expect text rendering issues.** If typography matters, generate the image without text and add text manually in design software.
- **Record prompt, seed, model, aspect ratio, and settings** when you find a good result.

---

## Useful Prompt Modifier Bank

### Composition

- close-up portrait
- wide establishing shot
- centered composition
- rule of thirds
- top-down flat lay
- isometric view
- symmetrical composition
- dynamic diagonal composition
- negative space for headline

### Lighting

- softbox studio lighting
- golden hour sunlight
- overcast natural light
- rim lighting
- volumetric light
- neon reflections
- candlelit atmosphere
- high-key lighting
- low-key cinematic shadows

### Visual Style

- photorealistic editorial
- premium product photography
- hand-painted concept art
- watercolor illustration
- claymation style
- low-poly 3D
- flat vector illustration
- screenprint poster
- retro-futurist graphic design
- architectural visualization

### Quality / Detail

- crisp edges
- realistic material texture
- clean silhouette
- highly detailed environment
- subtle reflections
- shallow depth of field
- natural color grading
- refined composition

### Common Exclusions

```text
text, watermark, logo, blurry, low quality, distorted anatomy, extra fingers, cropped subject, oversaturated, harsh artifacts, duplicate objects
```

---

## Researched Sources

### GitHub / Open Repositories

- GitHub: **imJunaidAfzal/Prompt-Engineering** — prompt engineering examples for text-to-image models including Stable Diffusion, Midjourney, and DALL·E.  
  https://github.com/imJunaidAfzal/Prompt-Engineering
- GitHub Topics: **prompt-generator** — repository discovery for prompt generators and prompt tooling.  
  https://github.com/topics/prompt-generator
- GitHub: **devanshug2307/Awesome-AI-Image-Prompts** — curated AI image prompt collection for DALL·E, Midjourney, Imagen, Flux, ChatGPT Image, and Stable Diffusion.  
  https://github.com/devanshug2307/Awesome-AI-Image-Prompts
- GitHub: **YouMind-OpenLab/ai-image-prompts-skill** — large curated image prompt library / skill for multiple image models.  
  https://github.com/YouMind-OpenLab/ai-image-prompts-skill
- GitHub: **backblaze-b2-samples/image-generation-prompt-flow** — example app showing prompt optimization, prompt lineage, and model comparison for image generation.  
  https://github.com/backblaze-b2-samples/image-generation-prompt-flow
- GitHub Topics: **text-to-image** — broader discovery of text-to-image model projects and examples.  
  https://github.com/topics/text-to-image

### Official / Documentation Sources

- Midjourney Docs: **Prompt Basics** — short, clear prompts; specificity; numbers; focusing on desired content.  
  https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics
- Midjourney Docs: **Parameter List** — `--no`, `--quality`, `--seed`, `--stylize`, style references, etc.  
  https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List
- Midjourney Docs: **Aspect Ratio** — using `--ar` / `--aspect`.  
  https://docs.midjourney.com/hc/en-us/articles/31894244298125-Aspect-Ratio
- OpenAI Help: **Images in ChatGPT** — generating/editing images, aspect ratios, and describing edits.  
  https://help.openai.com/en/articles/11084440-images-in-chatgpt
- OpenAI Help: **Best practices for prompt engineering with the OpenAI API** — clear, specific instructions and examples.  
  https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
- Hugging Face Diffusers: **The Stable Diffusion Guide** — Stable Diffusion usage, settings, and prompt engineering notes.  
  https://huggingface.co/docs/diffusers/v0.14.0/stable_diffusion

### Articles / Learning Resources

- O’Reilly preview: **Standard Practices for Image Generation with Midjourney** from *Prompt Engineering for Generative AI* — format modifiers and standardized image generation practices.  
  https://www.oreilly.com/library/view/prompt-engineering-for/9781098153427/ch08.html
- Saxifrage Blog: **Prompt Engineering: From Words to Art and Copy** — image prompt template concepts and iterative prompting.  
  https://www.saxifrage.xyz/post/prompt-engineering
- Stable Diffusion Art: **How to use negative prompts?** — practical use cases for negative prompts in Stable Diffusion.  
  https://stable-diffusion-art.com/how-to-use-negative-prompts
- Machine Learning Mastery: **Prompting Techniques for Stable Diffusion** — subject, style, color, negative prompts, and generation settings.  
  https://www.machinelearningmastery.com/prompting-techniques-stable-diffusion
- Portkey: **Prompt Engineering for Stable Diffusion** — examples of weighting, negative prompts, seeds, and aspect ratio.  
  https://portkey.ai/blog/prompt-engineering-for-stable-diffusion
