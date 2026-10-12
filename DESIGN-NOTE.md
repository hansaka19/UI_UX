# GEMWORLD — Brief 01 design note

## User and task

This prototype addresses Brief 01 of the UI/UX Development Intern challenge. The primary user is a gemstone trader using a phone, potentially unfamiliar with digital tools. The task is to enter available gemstone information and understand an indicative estimate. This is a frontend assessment prototype, not a production valuation service.

The brief asks for clear inputs, sensible guidance and validation, missing-information handling, a usable phone layout and a result that explains its limits. A separate review screen is optional. We use a single scrolling form with a result summary rather than adding another step.

## Research and reference use

The supplied rough calculator informed the domain and general flow: gem type, weight, treatment, colour, clarity and cut. Its visual design was not copied. The challenge explicitly allows illustrative values, so no market-price API or valuation model was built.

[GIA’s gemstone encyclopedia](https://www.gia.edu/gem-encyclopedia) is a reference for gemstone names; the secondary list includes Spinel, Tourmaline, Garnet, Aquamarine, Amethyst, Citrine, Topaz, Zircon and Peridot. [GIA’s treatment overview](https://www.gia.edu/gem-treatment) is a useful follow-up reference for the distinction between heat treatment and other treatments. Selecting Unheated is not evidence that a gem has no other treatments.

Mobile interaction principles considered include recognizable labels, visible units, large targets, accessible keyboard alternatives and error recovery. Useful follow-up references are [Nielsen Norman Group’s recognition principle](https://www.nngroup.com/articles/recognition-and-recall/) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/). These are design references, not a claim of a complete accessibility certification or research with actual traders.

## Decisions

- A centered capsule groups the gem preview, colour strength, carats and gem type. Off-white surfaces and purple accents follow the user’s selected visual references. Treatment illustrations retain their original orange/grey colours.
- Gem and treatment wheels start with “Scroll to choose”, rather than assuming a gem or treatment. Selected names remain readable; touch, tap and keyboard interaction are available.
- The two carat columns can scroll independently or be edited in place by tapping the selected number. “Scroll or tap to edit” is retained because the typing capability is otherwise hard to discover. It replaces the longer instruction.
- A square handle on a light-to-deep colour arc replaces the strength dropdown. The hue follows the selected gem; the 3D preview updates live. Unknown colour remains available. This screen approximation cannot grade a real gem.
- Icons distinguish Heated, Unheated and I do not know. Short English labels remain beside them, because icons alone may be misunderstood. Their comprehension by non-reading users has not been established.
- Additional details are progressively disclosed. Unknown values are supported rather than converted to favourable defaults. Duplicate guidance outside the expanded details was removed.
- Validation focuses a visible wheel/input, not its hidden radio. Editing inputs hides an old estimate to avoid stale results. Reset restores empty gem/treatment states, 0.00 carats and unknown optional details.

## Calculation, assumptions and trade-offs

The only priced example is a blue, heated sapphire with medium colour, no visible marks and good sparkle. The made-up band is USD 400–600 per carat; 2.00 carats produces USD 800–1,200. Other or incomplete combinations return guidance rather than invented prices. Help offers a filled-in example so the result state can be reviewed.

The result shows total, per-carat band, selected details and the demo limitation. This fulfils the prototype scope but does not represent complete pricing coverage. Origin, certificates and other treatments are not part of the example engine.

Custom wheels and the 3D preview make the experience distinctive but add discovery and device-performance risks. The gem uses one shared illustrative cut, not an accurate cut for every variety. The colour control maps its continuous preview to Light/Medium/Deep sample categories. The narrow capsule requires vertical scrolling on small phones; an entire form is not expected to fit in one viewport.

## Validation and next steps

Automated Chromium checks covered 320×568, 375×667, 390×844 and 1024×900: entry, required-field errors and visible focus, filled example/result, result invalidation, missing/unsupported data, secondary gem selection, reset, runtime console and horizontal overflow. Separate checks covered inline carat editing, colour-ring drag/keyboard operation, three gem hues and reduced-motion behaviour. Rendered screenshots were inspected.

These checks do not prove non-technical usability. Next, test with 3–5 traders: choose a gem, enter carats, select unknown treatment and explain whether the result guarantees a selling price. Observe whether they discover scrolling and number editing without coaching. Test touch dragging, memory and rendering on a real iPhone Safari device. Improve icon comprehension and colour grading guidance based on findings.

## AI and tool disclosure

I used AI tools throughout this project. I directed the design, and I reviewed and tested what they produced.

- **Codex** helped me interpret the brief and write the first interaction code, the styling, the 3D gem geometry and optical shader, the documentation and early QA checks.
- **Claude (Claude Code)** helped me match the expanded gem picker to my sketch. It also reviewed the page for usability problems. Following that review, I fixed a bug where the first tap on a gem opened the picker, made the weight question visible, enlarged text smaller than 13px, renamed the title from "Valuation Calculator" to "Gem Price Guide", and moved the "Scroll to choose" hint into each wheel's centre slot. Claude also helped me publish the site on GitHub Pages and prepare this note as a PDF.
- **OpenAI Image Gen** generated the treatment icon strip.
- **Three.js** renders the gem preview. **Playwright (Chromium)** and Node/Python were used for automated browser checks.

My own design decisions include the capsule layout, the point-down gem, carat wheels that can also be edited by tapping, the floating gem picker, the colour-strength ring, the purple accents and keeping the icons' original colours. I asked for long instructions and duplicate explanations to be shortened or removed. I chose to show "Scroll to choose" instead of pre-selecting a treatment, so the app never assumes an answer for the user.

I checked the output by running the page in a browser and reviewing screenshots at phone widths, and by running automated checks of the main flows. I have not tested it with real traders or on a real iPhone. The prices are not market data, and the 3D rendering is not photorealistic. I can explain every part of this prototype.
