# GEMWORLD — Gem Price Guide (mobile prototype)

**Live prototype:** https://hansaka19.github.io/UI_UX/
**Source:** https://github.com/hansaka19/UI_UX

A single-page, responsive HTML/CSS/JavaScript take-home prototype. No build step, backend or API key is required. Three.js is bundled locally for the 3D preview.

## Run locally

The 3D preview uses ES modules and needs an HTTP server. From this folder run:

```sh
python3 -m http.server 8080
```

Then visit http://localhost:8080. VS Code Live Server also works.

## Publish with GitHub Pages

1. Create a GitHub repository, e.g. `gemwise`.
2. Upload **the contents of this folder** to the repository root: every `.html`, `.css` and `.js` file, `favicon.svg`, `.nojekyll`, and the complete `assets/` and `vendor/` folders. Do not upload the parent workspace or PDF.
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select your `main` branch and `/ (root)`, then **Save**.
6. When deployment completes, Pages will display the live URL, normally `https://YOUR-USERNAME.github.io/gemwise/`.

All asset paths are relative, so deployment under a repository subpath works. This prototype is published at https://hansaka19.github.io/UI_UX/.

## What works

- Gem selection, optional other-gem list, carat input and treatment selection.
- Inline validation and keyboard focus on the first invalid input.
- Expandable colour, clarity and sparkle details, including unknown options.
- Sample calculation, unsupported/unknown states, recalculation and reset.
- Help dialog, Escape-to-close and a clearly labelled filled-in demo example.
- Result focus/announcement and reduced-motion support.
- Inputs stay in memory only; refreshing clears them. No data leaves the page.

## Demo calculation

Only the **blue, heated sapphire / medium colour / no visible marks / good sparkle** example has a sample band: USD 400–600 per carat. Total = entered carats × that illustrative band. Try **Help → Try a filled-in example** to explore it.

These values are invented, not current gem-market prices. Unknown details are never silently converted to favourable defaults. Other gem types and qualities display an expert-advice state. “No heat treatment” does not imply absence of all treatments; the expanded guidance states that other treatments are outside this demo.

## Design and AI disclosure

The UI uses the user-selected capsule layout, illustrated scroll wheels, visible units and concise labels. It intentionally starts blank and hides the result until calculation, rather than copying the static screenshot's filled state. Phone status bars and home indicators belong to the device, so they are omitted from the webpage.

AI tools used: Codex and Claude (Claude Code). They assisted with brief interpretation, the SVG concept, HTML/CSS/JavaScript implementation, a usability review of the page, and automated browser checks at 320px and 390px widths.

Current decisions, trade-offs, QA evidence and tool disclosure: [DESIGN-NOTE.md](./DESIGN-NOTE.md). Review this note and only submit work you can explain.

How I checked the output: [fill in what you tested yourself, e.g. on your own phone]

Submit only work you understand and can explain.

Research references: [GIA sapphire guide](https://www.gia.edu/sapphire/buyers-guide), [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [W3C form labels](https://www.w3.org/WAI/tutorials/forms/labels/).

Official deployment reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## සිංහලෙන් ඉක්මනින් පටන් ගන්න

- VS Code Live Server හෝ ඉහත Python server එක භාවිත කරන්න. 3D preview සඳහා file එක double-click කර open කිරීම ප්‍රමාණවත් නැහැ.
- Help → Try a filled-in example එකෙන් working sample result එක බලන්න.
- GitHub repository එකට මේ folder එකේ files root එකට upload කරන්න.
- Settings → Pages → Deploy from a branch → main → / (root) → Save.
- Live link එක: https://hansaka19.github.io/UI_UX/

## 3D gemstone preview

Uses a local procedural brilliant-style cut (`gem-cut.js`) and a small optical shader (`gem-optics.js`). Up to six internal facet reflections/refractions and tinted absorption are sampled against a 256px procedural studio cubemap. The pavilion remains downward and the gem turns slowly. The colour ring updates the shader live for sapphire, ruby, emerald and Other. The original copied Transilk GLB remains untouched as an archived source asset; no Blender scene or Transilk website was changed. This shared cut and its optical appearance are illustrative, not gem identification or grading. WebGL failure leaves the calculator usable. Reduced-motion users receive a stationary gem; drawing pauses offscreen. Mobile DPR is capped at 1.25; desktop uses native DPR. Real iPhone Safari performance is not yet verified.

Third-party code: Three.js 0.170.0 (MIT; see `vendor/LICENSE-three.txt`), including its bundled Draco WebAssembly decoder (Google Draco, Apache 2.0; see `vendor/LICENSE-draco.txt`). Run through HTTP to load ES modules. The archived Draco loader/decoder files are not used by the current procedural preview.

## Visual direction

Current styling uses off-white soft surfaces, subtle shadows and deep-purple controls in `soft-ui.css`, layered over the existing base styles. A centered capsule groups the gem, circular colour control, editable carat wheels and gemstone wheel. Desktop uses two columns; phones retain one scrolling column. The page title is "Gem Price Guide" rather than "Valuation", because the result is an illustrative estimate, not a valuation.

## Wheel selection

Gem type and carat weight use vertically scrolling, snapping wheels. Weight has separate whole (00–99) and decimal (00–99) columns, covering 0.01–99.99 ct; 0.00 is rejected on calculation. Arrow keys, Home and End are supported. Reset returns to 0.00; the filled example synchronizes both columns to 2.00. No text keyboard is required for weight.

Tap the centered whole or decimal number to edit that column in place. Enter or tapping outside commits; Escape cancels. Only that column changes. Both scrolling wheels remain visible and usable.

## Assignment content, distinct from visual references

The screenshots are visual/interaction references, not a source of product data. Main choices are Ruby, Sapphire and Emerald; Other opens secondary varieties: Spinel, Tourmaline, Garnet, Aquamarine, Amethyst, Citrine, Topaz, Zircon and Peridot, plus an unknown option. Names were checked against https://www.gia.edu/gem-encyclopedia . This is a chosen prototype subset, not a list mandated by the brief.

Carat range is 0.01–99.99 ct. Heat-treatment choices are scoped explicitly to a gem report. The result action is Calculate estimate; total/per-carat values are clearly illustrative. The brief allows sample values and does not request a real pricing engine. The current price demo still covers one stated sapphire example only; other qualities/types do not receive fabricated market quotes. References must not be presented as evidence for the sample USD price band.

### Illustrated heat-treatment picker

The treatment input uses a scroll-snap wheel with short English labels and generated icons. Flame = heat treatment confirmed by report; crossed flame = no heat treatment confirmed by report; report/question mark = unknown. The initial/reset state is a “Scroll to choose” placeholder; Unknown is an explicit choice. Icons supplement the report labels; they do not identify treatment from the gem's appearance. The transparent three-icon strip in `assets/treatment-icons.png` was generated with OpenAI Image Gen and integrated using CSS sprite positioning. The wheel supports tap and keyboard selection as well as touch scrolling. Comprehension with non-reading users still needs usability testing.

### Colour-strength ring

A 270-degree light-to-deep colour arc around the gem replaces the colour-strength dropdown. Drag/tap its square handle or use arrow keys/Home/End; its continuous preview maps to the original Light/Medium/Deep sample-engine categories. The arc hue follows the selected gemstone and the Three.js material updates live. Unknown remains available and is restored on reset. This is a visual approximation, not a gem colour grading instrument; existing screen-colour limitations still apply.
