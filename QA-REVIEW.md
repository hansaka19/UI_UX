# Brief 01 QA review — 12 October 2026

## Verdict

The local prototype covers the brief's suggested functional scope: mobile inputs, validation, uncertain information and an illustrative result with limitations. It is not evidence that non-technical users can use it without coaching. The remaining priority is user/device testing, not more decoration.

## Requirement checks

| Brief requirement | Evidence | Status |
| --- | --- | --- |
| Colored gemstone entry | Gem wheel, Other varieties, carat input, heat-treatment wheel, colour ring and optional details | Covered |
| Understandable labels/guidance | Visible weight question/unit, English treatment labels and icons, concise instructions | Implemented; real-user comprehension unverified |
| Validation | Empty gem/weight/treatment errors; visible first-error focus; carat editing constrains numbers | Pass in tested flows |
| Missing/uncertain information | Explicit unknown options; unsupported/incomplete cases display guidance, not made-up quotes | Pass |
| Indicative result | Demo label, total/per-carat, summary and explicit result disclaimer | Pass |
| Phone layout | 320×568, 375×667 and 390×844 Chromium; 1024×900 desktop | No horizontal overflow/runtime errors in tested flows |
| Review step | Not mandatory in brief; result summary plus stale-result invalidation used | Covered by chosen approach |
| Source/run instructions | README and local static frontend/source ZIP | Available |
| Design note and AI disclosure | DESIGN-NOTE.md includes rationale, references, trade-offs and disclosure | Available; contributor must understand it |

## Changes made during this review

- Shortened the weight instruction to “Scroll or tap to edit”.
- Preserved the current “Scroll to choose” default wheel row; no extra external gem-scroll instruction is needed.
- Removed duplicate “Use this section only for details you know” text outside the expanded optional details.
- Fixed validation/reset focus to target the visible gem/treatment wheel rather than a one-pixel hidden radio.
- Preserved the current user-edited title, existing placeholder states, purple accents and original icon colours.

## Executed checks

Playwright Chromium against http://localhost:8080: initial empty state, page identity, required errors/focus, Help filled example, USD 800–1,200 example result, limitation copy, stale-result invalidation, unknown/unsupported result, secondary gem selection, reset, console and overflow. All four viewport runs passed. Independent inline whole/decimal editing, Enter/blur, Escape and reset checks passed. Screenshots were inspected. Browser plugin was not available; Playwright was used.

## Limits and next improvements

- Only the specified blue-sapphire combination has illustrative pricing. The brief permits sample values; this does not establish wider valuation coverage.
- The first capsule is tall on a small phone, and gem-type selection comes below weight. There is a discoverability trade-off in the accepted visual layout. Test whether users find that wheel; consider putting gem selection nearer the preview if they miss it.
- The circular colour control needs testing to establish that users can drag it accurately without coaching. Screen appearance cannot grade a gem.
- Icons are supplemented with labels; understanding by users who cannot read English is unverified.
- Real iPhone Safari, assistive-technology usability and GPU/memory performance remain untested. No claim of full WCAG compliance or actual-user usability testing is made.
- This review applies to local files. It does not establish that an existing hosted GitHub Pages deployment contains these latest edits.
