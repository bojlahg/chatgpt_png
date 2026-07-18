# Transparent PNG Builder

A small browser tool for reconstructing transparent PNGs from two generated images of the same object on different solid backgrounds.

This is useful when an image generator can make a good object, character, icon, smoke, or effect, but cannot reliably give you a clean transparent PNG.

The trick is simple:

1. Generate the same image twice.
2. Use two different solid backgrounds.
3. Load both images into this tool.
4. The tool compares the two versions and reconstructs the alpha channel.

No server-side processing. No npm. No framework. Everything runs locally in the browser.

---

## Why this exists

Many AI image generators are bad at true transparency. They may say “transparent background”, but often produce:

- fake checkerboard backgrounds,
- white/black halos,
- dirty edges,
- baked shadows,
- semi-transparent junk,
- or a normal RGB image with no real alpha channel.

This tool uses a more controllable workflow: instead of asking the model for transparency directly, you ask it for the same subject on two different flat backgrounds.

For example:

- one image on pure green,
- the same image on pure red.

Because the object is supposed to be identical, the difference between the two images is mostly caused by the background showing through transparent or anti-aliased pixels. From that difference, the tool estimates alpha.

It is not magic, because pixels are cruel little rectangles and reality has terms and conditions. But it works surprisingly well for many generated assets.

---

## Typical use case with ChatGPT / image generation

Ask the image model to generate a pair of images with strict object consistency.

Example prompt:

```text
Generate a batch of 2 images featuring the exact same detailed cartoon cute robot.

Image 1: The character is isolated on a pure solid green background.
Image 2: The exact same character, from the same angle and with the same lighting, but isolated on a pure solid red background.

Maintain strict object consistency.
Do not merge images into one.
Output exactly 2 separate images.
```

Then download both images and load them into this tool.

Recommended background pairs:

```text
green / red
black / white
blue / yellow
```

For most characters and icons, high-contrast saturated backgrounds are easier to separate than subtle backgrounds.

---

## Better prompt template

```text
Generate 2 separate images of the exact same subject.

Subject:
[describe your character / object / effect]

Image 1:
The subject is isolated on a pure solid #00ff00 green background.

Image 2:
The exact same subject, same pose, same camera angle, same lighting, same proportions, isolated on a pure solid #ff0000 red background.

Important:
- The subject must be identical in both images.
- Do not change pose, shape, expression, lighting, or details.
- Do not add shadows on the ground.
- Do not add texture, gradients, or patterns to the background.
- Use a flat, pure, solid background color.
- Do not crop the subject.
- Do not combine both images into one collage.
- Output exactly 2 separate images.
```

For smoke, fire, glass, magic effects, or other translucent things, this method can work too, but the generator must keep the effect very consistent between both images.

---

## How to use the tool

1. Open `index.html` in a browser or run it through a local static server.
2. Choose input mode:
   - **Two images**: load two separate images.
   - **Split image**: load one image that contains two halves.
3. Pick or estimate background colors.
4. Click **Build transparent PNG**.
5. Inspect the result using:
   - Result
   - Dark preview
   - Light preview
   - Alpha mask
6. Use **Alpha cleanup** if needed.
7. Use **Paint** for manual fixes.
8. Download the final PNG, or open **Slice** to divide it into a grid.
9. In **Slice**, set rows, columns, gaps, and outer margins, inspect **Slice grid**, then download the non-empty tiles as one ZIP archive.

---

## Main features

### Alpha reconstruction

The tool estimates alpha from the difference between two versions of the same image on different backgrounds.

It supports:

- custom background colors,
- background color picking,
- RGB reconstruction,
- alpha cutoffs,
- solid alpha threshold,
- optional desaturation,
- optional crop.

### Alpha cleanup

Median cleanup can remove tiny holes and isolated noisy pixels in the alpha mask.

Options:

- kernel size,
- number of passes,
- cleanup strength.

This is often useful for small speckles around AI-generated characters.

### Paint layer

The tool includes a manual paint layer for quick alpha fixes.

The paint layer:

- is shown as a red overlay,
- survives pressing **Build**,
- can be reset,
- supports undo,
- can set alpha to a target value,
- works with zoomed preview.

This is useful when an otherwise good generated sprite has a few dirty areas, shadows, or leftover background pixels.

### Slicing

The **Slice** tab divides the built transparent PNG into separate files. It works on the final result after crop and Paint edits and has two modes.

**Fixed grid** uses:

- columns and rows,
- horizontal and vertical gaps between tiles,
- horizontal and vertical outer margins.

Each tile has the same integer pixel size. If the available width or height does not divide evenly, leftover pixels on the right or bottom are discarded. The **Slice preview** shows the exact exported rectangles in both modes.

**Auto-detect objects** is intended for AI-generated icon sheets that do not follow an exact grid. It detects foreground bands from output alpha, groups nearby strokes into objects, tightly crops every object, and adds configurable padding. Controls include:

- alpha threshold,
- horizontal and vertical merge gaps,
- output padding,
- minimum foreground pixel count for rejecting noise.

Increase a merge gap when one icon is split into multiple boxes. Increase the alpha threshold or minimum pixel count when background noise becomes a separate object.

**Download slices ZIP** creates `transparent_slices.zip` locally in the browser. Files are numbered from left to right and top to bottom as `transparent_01.png`, `transparent_02.png`, and so on. In fixed-grid mode, fully transparent tiles are omitted while later position-based numbers stay unchanged.

### Zoom and pan

The preview supports:

- Fit,
- 100%,
- 200%,
- 400%,
- 800%,
- scrollbars,
- middle mouse pan,
- Ctrl + mouse wheel zoom.

---

## Running locally

Because the tool loads optional `samples.json`, it is best to run it from a local server instead of opening it through `file://`.

From the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

There are no dependencies. You do not need Node.js, npm, Vite, React, Vue, or any other ceremony humans invented to render a button.

---

## GitHub Pages

This project can be hosted directly on GitHub Pages.

Repository structure:

```text
your-repo/
  index.html
  styles.css
  app.js
  samples.json
  samples/
    fox_black.png
    fox_white.png
    rabbit.png
```

In GitHub:

1. Go to repository **Settings**.
2. Open **Pages**.
3. Set source to **Deploy from a branch**.
4. Select branch `main`.
5. Select folder `/ root`.
6. Save.

The site will be available at:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

---

## Optional sample configuration

The tool can auto-load a sample panel from `samples.json`.

Example:

```json
{
  "samples": [
    {
      "label": "Fox black / white",
      "mode": "two",
      "sourceA": "samples/fox_black.png",
      "sourceB": "samples/fox_white.png"
    },
    {
      "label": "Rabbit split left-right red / green",
      "mode": "split",
      "split": "samples/rabbit.png",
      "orientation": "vertical"
    }
  ]
}
```

Supported sample modes:

```text
two
split
```

For split images, `orientation` can be:

```text
vertical
horizontal
```

---

## Tips for better results

Use flat backgrounds.

Good:

```text
pure solid green
pure solid red
pure solid black
pure solid white
```

Bad:

```text
gradient background
textured background
shadowy background
studio floor
transparent checkerboard fake background
```

Ask the model to avoid cast shadows.

Bad shadows can become part of the reconstructed alpha. If the subject has a ground shadow, you may need to remove it manually with the Paint layer.

Try saturated colors.

For difficult subjects, red/green or blue/yellow backgrounds can make the alpha solve easier.

Keep the subject identical.

If the model changes the object between the two images, the tool cannot know which pixels are object and which pixels are variation noise.

---

## Limitations

This method works best when:

- the subject is almost identical in both images,
- the backgrounds are flat solid colors,
- there are no cast shadows,
- the image generator does not change the subject between generations.

It may struggle with:

- inconsistent poses,
- changing details,
- hair/fur that changes shape,
- smoke that changes between images,
- strong baked shadows,
- reflections,
- transparent glass,
- motion blur,
- compression artifacts.

Some ambiguity is impossible to solve from only two RGB images. For example, a dark object part on a black background can look very similar to a shadow or background artifact. In those cases, use the Paint layer.

---

## Privacy

All processing happens in your browser.

The tool does not upload your images anywhere.

If you host it on GitHub Pages, the static site is public, but the images you load through the file picker stay local in your browser.

---

## Project files

```text
index.html   - markup and UI layout
styles.css   - styling
app.js       - image processing, alpha reconstruction, paint layer, zoom/preview logic
samples.json - optional sample list
```

---

## Development notes

This project intentionally avoids build tools and dependencies.

That means:

- no npm install,
- no bundler,
- no framework,
- easy static hosting,
- easy local editing.

The downside is that `app.js` is a single large file. At some point, if the project grows more, it may make sense to split the JavaScript into modules.

