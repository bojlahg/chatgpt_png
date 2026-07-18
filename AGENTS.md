# AGENTS.md

## Project overview

Transparent PNG Builder is a dependency-free, client-side web application. It reconstructs a transparent PNG from two matching images rendered against different solid backgrounds. The application must remain usable as a static site: there is no backend, package manager, build step, framework, or server-side image processing.

## Repository map

- `index.html` contains the complete UI and all control defaults.
- `styles.css` contains the responsive layout, previews, zoom behavior, and paint-overlay styling.
- `app.js` contains DOM wiring, image loading, split-image preparation, background estimation, alpha/RGB reconstruction, crop logic, painting, export, zoom/pan, and sample loading.
- `samples.json` is the optional sample catalog.
- `samples/` contains the images referenced by `samples.json`.
- `pyserv.cmd` starts a local static server on port 8000.
- `README.md` is user-facing documentation.

## Non-negotiable constraints

- Keep the default application dependency-free and statically hostable. Do not introduce npm, a bundler, a framework, or a backend unless the task explicitly requires that architectural change.
- All user-supplied images must stay in the browser. Do not add uploads, telemetry, remote processing, or persistence without explicit approval and matching documentation.
- Preserve both input modes: two separate images and one vertically/horizontally split image.
- Preserve output transparency and export through a PNG blob. Test the saved/downloadable artifact, not only the preview canvas.
- Treat `samples.json` as optional. The application must still work when it is missing, empty, or invalid.
- Keep source A/B, background A/B, offsets, previews, and diagnostics consistently paired.
- Preserve the paint layer across rebuilds when output dimensions are unchanged; reset it when a source/mode change makes it invalid.
- Save text files as UTF-8. In Windows PowerShell, use `Get-Content -Encoding utf8` when inspecting text containing typographic symbols.

## Working conventions

- Make focused edits. `app.js` is large, so first locate the relevant state variables, event listeners, processing branch, and render/export path with `rg`.
- Use modern browser APIs already present in the project and plain JavaScript in strict mode.
- Prefer `textContent` and explicit DOM construction for dynamic or configuration-derived text. Use `innerHTML` only for fixed, controlled markup; escape any interpolated value.
- Revoke obsolete object URLs and close or release replaceable image resources when adding new load paths.
- Guard asynchronous image loads and exports against stale completion when the same action can be triggered repeatedly.
- Any control that changes generated pixels, dimensions, alignment, or background colors must either rebuild the output immediately or call `invalidateResult()` so a stale PNG cannot be downloaded.
- When adding or renaming a control, update all of the following as applicable: the HTML `id`, DOM lookup, label display, event listener, processing read, diagnostics/meta output, and invalidation behavior.
- If the visible version changes, keep the title/header, `app.js` console banner, and `?v=` cache-busting query strings in sync.
- Keep comments factual and concise. Explain image-processing invariants and non-obvious coordinate transforms, not routine syntax.

## Image-processing invariants

- Channel values used by the solver are normalized to `[0, 1]`; canvas image data and alpha masks use `[0, 255]`.
- The reconstruction assumes the foreground is spatially consistent and only the solid background changes.
- Background colors must be sufficiently different; retain the existing near-equality rejection.
- Offset and crop calculations share the union-canvas coordinate system. Check `layout.minX`/`minY` when changing alignment code.
- Crop is applied after reconstruction and debug canvases must remain aligned with the result.
- When alpha changes, keep the result canvas, alpha canvas, paint base data, displayed viewer, and downloadable PNG synchronized.
- Avoid hidden color-space changes. The linear-light option and normal sRGB path must remain explicit.
- Be cautious with per-pixel allocations. Large images already create several full-size buffers; avoid allocating arrays or objects inside hot pixel loops when practical.

## Sample catalog rules

`samples.json` accepts either a top-level array or `{ "samples": [...] }`.

- Two-image entry: `mode: "two"`, `sourceA`, and `sourceB`.
- Split-image entry: `mode: "split"` plus `split` (or legacy `file`).
- Split `orientation` may be `auto`, `vertical`, or `horizontal`.
- Every referenced path must exist with exact case so GitHub Pages works on case-sensitive hosting.
- Render catalog labels and paths as untrusted text even though the file is local to the site.

## Verification

Run the smallest relevant checks after every change. Before handing off a behavior change, run the full static and browser smoke checks below.

### Static checks

From the repository root:

```powershell
python -m json.tool samples.json > $null
node --check app.js
git diff --check
```

If `node` or `python` is not on `PATH`, use an available equivalent runtime. Also verify that every `getElementById(...)` reference exists in `index.html` and that HTML IDs are unique after UI changes.

### Local browser smoke test

```powershell
python -m http.server 8000
```

Open `http://localhost:8000` and verify:

1. The page, stylesheet, `app.js`, `samples.json`, and sample thumbnails load without console errors.
2. Load `Fox black / white`, build the image, and confirm a result canvas and `Download transparent.png` appear.
3. Confirm the downloaded PNG has transparency and the expected dimensions.
4. Load at least one split sample and confirm auto/explicit split orientation works.
5. Change a pixel-affecting setting and confirm the old download is invalidated until a rebuild, unless that setting intentionally updates the result live.
6. Check Result, Dark preview, Light preview, Alpha mask, Core mask, Crop box, and Mismatch overlay.
7. Check Fit and at least one fixed zoom level; verify Ctrl+wheel zoom, scrolling, and middle-button pan.
8. Enable Paint, make a stroke, undo it, reset the layer, and confirm each change updates both preview and download.
9. Exercise crop and non-zero offsets, including resetting offsets.

For layout-related work, test a narrow viewport as well as desktop width.

## Review priorities

Prioritize findings in this order:

1. Incorrect or stale downloadable pixels, alpha, crop, or dimensions.
2. Privacy regressions or unexpected network access involving user images.
3. Source alignment, coordinate mapping, zoom, or painting errors.
4. Crashes, races, excessive memory use, and browser compatibility problems.
5. Accessibility, responsive layout, diagnostics, and documentation drift.

Report review findings with a reproducible scenario and precise file/line reference. Do not treat the absence of an automated test suite as proof that an image-processing change is safe; perform the browser smoke path with representative samples.

## Documentation expectations

- Update `README.md` when workflows, controls, sample schema, supported modes, hosting, privacy behavior, or limitations change.
- Keep UI labels, README terminology, diagnostics, and filenames consistent.
- Do not document generated values by hand when they can drift; describe the invariant or validation procedure instead.
