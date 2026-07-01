"use strict";
console.info("Transparent PNG Builder app.js v45 loaded");

const modeSelect = document.getElementById("modeSelect");
const twoMode = document.getElementById("twoMode");
const splitMode = document.getElementById("splitMode");

const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const inputSplit = document.getElementById("inputSplit");
const splitOrientation = document.getElementById("splitOrientation");

const fileNameA = document.getElementById("fileNameA");
const fileNameB = document.getElementById("fileNameB");
const fileNameSplit = document.getElementById("fileNameSplit");

const miniA = document.getElementById("miniA");
const miniB = document.getElementById("miniB");
const miniSplit = document.getElementById("miniSplit");

const previewA = document.getElementById("previewA");
const previewB = document.getElementById("previewB");

const swatchA = document.getElementById("swatchA");
const swatchB = document.getElementById("swatchB");

const hexA = document.getElementById("hexA");
const hexB = document.getElementById("hexB");
const rA = document.getElementById("rA");
const gA = document.getElementById("gA");
const bA = document.getElementById("bA");
const rB = document.getElementById("rB");
const gB = document.getElementById("gB");
const bB = document.getElementById("bB");

const resetColorsBtn = document.getElementById("resetColorsBtn");
const swapColorsBtn = document.getElementById("swapColorsBtn");

const lowCut = document.getElementById("lowCut");
const highCut = document.getElementById("highCut");
const solidCut = document.getElementById("solidCut");
const rgbMode = document.getElementById("rgbMode");
const desatResult = document.getElementById("desatResult");
const cropMode = document.getElementById("cropMode");
const cropThreshold = document.getElementById("cropThreshold");
const cropPadding = document.getElementById("cropPadding");

const lowVal = document.getElementById("lowVal");
const highVal = document.getElementById("highVal");
const solidVal = document.getElementById("solidVal");
const desatVal = document.getElementById("desatVal");
const cropThresholdVal = document.getElementById("cropThresholdVal");
const cropPaddingVal = document.getElementById("cropPaddingVal");

const solveLinear = document.getElementById("solveLinear");
const shadowSuppress = document.getElementById("shadowSuppress");
const shadowThreshold = document.getElementById("shadowThreshold");
const shadowBgTolerance = document.getElementById("shadowBgTolerance");
const shadowMinLuma = document.getElementById("shadowMinLuma");
const shadowAlphaCeil = document.getElementById("shadowAlphaCeil");
const alphaMethod = document.getElementById("alphaMethod");
const coreBoost = document.getElementById("coreBoost");
const coreThreshold = document.getElementById("coreThreshold");
const coreFloor = document.getElementById("coreFloor");
const unionBoost = document.getElementById("unionBoost");
const unionThreshold = document.getElementById("unionThreshold");
const unionSimilarity = document.getElementById("unionSimilarity");
const unionFloor = document.getElementById("unionFloor");
const alphaMedian = document.getElementById("alphaMedian");
const alphaMedianKernel = document.getElementById("alphaMedianKernel");
const alphaMedianPasses = document.getElementById("alphaMedianPasses");
const alphaMedianBlend = document.getElementById("alphaMedianBlend");
const alphaMedianPassesVal = document.getElementById("alphaMedianPassesVal");
const alphaMedianBlendVal = document.getElementById("alphaMedianBlendVal");
const bgVeto = document.getElementById("bgVeto");
const bgVetoTolerance = document.getElementById("bgVetoTolerance");
const bgVetoLowAlphaOnly = document.getElementById("bgVetoLowAlphaOnly");
const bgVetoAlphaCeil = document.getElementById("bgVetoAlphaCeil");
const darkRescue = document.getElementById("darkRescue");
const darkThreshold = document.getElementById("darkThreshold");
const darkBoost = document.getElementById("darkBoost");

const shadowThresholdVal = document.getElementById("shadowThresholdVal");
const shadowBgToleranceVal = document.getElementById("shadowBgToleranceVal");
const shadowMinLumaVal = document.getElementById("shadowMinLumaVal");
const shadowAlphaCeilVal = document.getElementById("shadowAlphaCeilVal");
const coreThresholdVal = document.getElementById("coreThresholdVal");
const coreFloorVal = document.getElementById("coreFloorVal");
const unionThresholdVal = document.getElementById("unionThresholdVal");
const unionSimilarityVal = document.getElementById("unionSimilarityVal");
const unionFloorVal = document.getElementById("unionFloorVal");
const bgVetoToleranceVal = document.getElementById("bgVetoToleranceVal");
const bgVetoAlphaCeilVal = document.getElementById("bgVetoAlphaCeilVal");
const darkThresholdVal = document.getElementById("darkThresholdVal");
const darkBoostVal = document.getElementById("darkBoostVal");

const offAX = document.getElementById("offAX");
const offAY = document.getElementById("offAY");
const offBX = document.getElementById("offBX");
const offBY = document.getElementById("offBY");

const offAXVal = document.getElementById("offAXVal");
const offAYVal = document.getElementById("offAYVal");
const offBXVal = document.getElementById("offBXVal");
const offBYVal = document.getElementById("offBYVal");

const paintEnabled = document.getElementById("paintEnabled");
const paintMode = document.getElementById("paintMode");
const paintSize = document.getElementById("paintSize");
const paintStrength = document.getElementById("paintStrength");
const paintTarget = document.getElementById("paintTarget");
const paintSizeVal = document.getElementById("paintSizeVal");
const paintStrengthVal = document.getElementById("paintStrengthVal");
const paintTargetVal = document.getElementById("paintTargetVal");
const paintUndoBtn = document.getElementById("paintUndoBtn");

const resetOffsetsBtn = document.getElementById("resetOffsetsBtn");
const processBtn = document.getElementById("processBtn");
const downloadBtn = document.getElementById("downloadBtn");
const statusEl = document.getElementById("status");
const viewer = document.getElementById("viewer");
const viewerZoom = document.getElementById("viewerZoom");
const meta = document.getElementById("meta");
const diagnosticsEl = document.getElementById("diagnostics");

let bitmapA = null;
let bitmapB = null;
let bitmapSplit = null;

let prepared = null;
let autoBgA = [1, 1, 1];
let autoBgB = [0, 0, 0];

let resultCanvas = null;
let alphaCanvas = null;
let coreCanvas = null;
let mismatchCanvas = null;
let cropBoxCanvas = null;
let downloadUrl = null;
let currentView = "checker";
let lastCropPreview = null;

let paintBaseResultData = null;
let paintBaseAlphaData = null;
let paintMaskCanvas = null;
let paintUndoStack = [];
let isPaintingAlpha = false;
let paintStrokeChanged = false;
let paintTouched = false;
let lastBrushPointerClient = null;

let isViewerPanning = false;
let viewerPanPointerId = null;
let viewerPanStartX = 0;
let viewerPanStartY = 0;
let viewerPanStartScrollLeft = 0;
let viewerPanStartScrollTop = 0;

function setStatus(text, cls = "") {
  statusEl.textContent = text;
  statusEl.className = "status " + cls;
}

function srgbToLinear(v) {
  return v <= 0.04045 ? (v / 12.92) : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(v) {
  return v <= 0.0031308 ? (v * 12.92) : (1.055 * Math.pow(v, 1 / 2.4) - 0.055);
}

function toWorkColor(rgb, useLinear) {
  return useLinear ? rgb.map(srgbToLinear) : rgb.slice();
}

function fromWorkChannel(v, useLinear) {
  return clamp01(useLinear ? linearToSrgb(v) : v);
}

function median3(a, b, c) {
  if ((a <= b && b <= c) || (c <= b && b <= a)) return b;
  if ((b <= a && a <= c) || (c <= a && a <= b)) return a;
  return c;
}

function smoothstep(edge0, edge1, x) {
  if (edge0 === edge1) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function colorDistance3(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((dr * dr + dg * dg + db * db) / 3.0);
}

function luminanceSrgb(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function applyAlphaMedianCleanup(outData, alphaData, width, height, radius = 1, passes = 1, blend = 1.0) {
  radius = Math.max(1, Math.min(2, Number(radius) || 1));
  passes = Math.max(1, Math.min(3, Number(passes) || 1));
  blend = clamp01(Number(blend));

  let source = new Uint8ClampedArray(width * height);
  let temp = new Uint8ClampedArray(width * height);

  for (let p = 0; p < width * height; p++) {
    source[p] = outData[p * 4 + 3];
  }

  for (let pass = 0; pass < passes; pass++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const values = [];
        for (let dy = -radius; dy <= radius; dy++) {
          const yy = Math.max(0, Math.min(height - 1, y + dy));
          for (let dx = -radius; dx <= radius; dx++) {
            const xx = Math.max(0, Math.min(width - 1, x + dx));
            values.push(source[yy * width + xx]);
          }
        }

        values.sort((a, b) => a - b);
        const med = values[Math.floor(values.length / 2)];
        const idx = y * width + x;
        const oldAlpha = source[idx];
        temp[idx] = Math.round(oldAlpha * (1.0 - blend) + med * blend);
      }
    }

    const swap = source;
    source = temp;
    temp = swap;
  }

  for (let p = 0; p < width * height; p++) {
    const alpha = source[p];
    const i = p * 4;
    outData[i + 3] = alpha;
    alphaData[i] = alpha;
    alphaData[i + 1] = alpha;
    alphaData[i + 2] = alpha;
    alphaData[i + 3] = 255;
  }
}

function updateModeUi() {
  const mode = modeSelect.value;
  twoMode.classList.toggle("hidden", mode !== "two");
  splitMode.classList.toggle("hidden", mode !== "split");
}

function updateSliderLabels() {
  lowVal.textContent = Number(lowCut.value).toFixed(3);
  highVal.textContent = Number(highCut.value).toFixed(3);
  solidVal.textContent = Number(solidCut.value).toFixed(3);
  desatVal.textContent = Number(desatResult.value).toFixed(3);
  cropThresholdVal.textContent = Number(cropThreshold.value).toFixed(3);
  cropPaddingVal.textContent = String(Number(cropPadding.value));
  shadowThresholdVal.textContent = Number(shadowThreshold.value).toFixed(3);
  shadowBgToleranceVal.textContent = Number(shadowBgTolerance.value).toFixed(3);
  shadowMinLumaVal.textContent = Number(shadowMinLuma.value).toFixed(3);
  shadowAlphaCeilVal.textContent = Number(shadowAlphaCeil.value).toFixed(3);
  coreThresholdVal.textContent = Number(coreThreshold.value).toFixed(3);
  coreFloorVal.textContent = Number(coreFloor.value).toFixed(3);
  unionThresholdVal.textContent = Number(unionThreshold.value).toFixed(3);
  unionSimilarityVal.textContent = Number(unionSimilarity.value).toFixed(3);
  unionFloorVal.textContent = Number(unionFloor.value).toFixed(3);
  bgVetoToleranceVal.textContent = Number(bgVetoTolerance.value).toFixed(3);
  bgVetoAlphaCeilVal.textContent = Number(bgVetoAlphaCeil.value).toFixed(3);
  alphaMedianPassesVal.textContent = String(Number(alphaMedianPasses.value));
  alphaMedianBlendVal.textContent = Number(alphaMedianBlend.value).toFixed(3);
  darkThresholdVal.textContent = Number(darkThreshold.value).toFixed(3);
  darkBoostVal.textContent = Number(darkBoost.value).toFixed(3);
  paintSizeVal.textContent = String(Number(paintSize.value));
  paintStrengthVal.textContent = Number(paintStrength.value).toFixed(3);
  if (paintTargetVal && paintTarget) paintTargetVal.textContent = Number(paintTarget.value).toFixed(3);

  offAXVal.textContent = offAX.value;
  offAYVal.textContent = offAY.value;
  offBXVal.textContent = offBX.value;
  offBYVal.textContent = offBY.value;
}

modeSelect.addEventListener("change", async () => {
  resetPersistentPaintLayer(false);
  updateModeUi();
  invalidateResult();
  await refreshPreparedSources(true);
});

[lowCut, highCut, solidCut, desatResult, cropThreshold, cropPadding, shadowThreshold, shadowBgTolerance, shadowMinLuma, shadowAlphaCeil, coreThreshold, coreFloor, unionThreshold, unionSimilarity, unionFloor, bgVetoTolerance, bgVetoAlphaCeil, alphaMedianPasses, alphaMedianBlend, darkThreshold, darkBoost, paintSize, paintStrength, paintTarget, offAX, offAY, offBX, offBY].forEach(el => el.addEventListener("input", updateSliderLabels));
updateSliderLabels();
updateModeUi();

[solveLinear, shadowSuppress, alphaMethod, coreBoost, unionBoost, alphaMedian, alphaMedianKernel, bgVeto, bgVetoLowAlphaOnly, darkRescue].forEach(el => el.addEventListener("change", invalidateResult));
[shadowThreshold, shadowBgTolerance, shadowMinLuma, shadowAlphaCeil, coreThreshold, coreFloor, unionThreshold, unionSimilarity, unionFloor, bgVetoTolerance, bgVetoAlphaCeil, alphaMedianPasses, alphaMedianBlend, darkThreshold, darkBoost].forEach(el => el.addEventListener("input", invalidateResult));

resetOffsetsBtn.addEventListener("click", () => {
  offAX.value = 0; offAY.value = 0; offBX.value = 0; offBY.value = 0;
  updateSliderLabels();
});

function setupDrop(drop, input) {
  drop.addEventListener("dragover", event => {
    event.preventDefault();
    drop.classList.add("drag");
  });
  drop.addEventListener("dragleave", () => drop.classList.remove("drag"));
  drop.addEventListener("drop", event => {
    event.preventDefault();
    drop.classList.remove("drag");
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event("change"));
  });
}
setupDrop(document.getElementById("dropA"), inputA);
setupDrop(document.getElementById("dropB"), inputB);
setupDrop(document.getElementById("dropSplit"), inputSplit);

async function loadBitmapFromFile(file) {
  if (!file) return null;
  return await createImageBitmap(file, {
    imageOrientation: "none",
    premultiplyAlpha: "none",
    colorSpaceConversion: "default"
  });
}

function bitmapToImageData(bitmap) {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" });
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

function updateFileLabel(input, labelEl, fallback = "No file") {
  if (!labelEl) return;
  const file = input && input.files && input.files[0];
  labelEl.textContent = file ? file.name : fallback;
}

document.querySelectorAll(".filePickBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.fileInput;
    const input = document.getElementById(id);
    if (input) input.click();
  });
});

function renderMini(container, bitmap, label) {
  container.innerHTML = "";
  if (!bitmap) {
    container.textContent = label;
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  container.appendChild(canvas);
}

function invalidateResult() {
  resultCanvas = null;
  alphaCanvas = null;
  coreCanvas = null;
  mismatchCanvas = null;
  cropBoxCanvas = null;
  paintBaseResultData = null;
  paintBaseAlphaData = null;
  lastCropPreview = null;
  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
    downloadUrl = null;
  }
  downloadBtn.style.display = "none";
}

inputA.addEventListener("change", async () => {
  resetPersistentPaintLayer(false);
  updateFileLabel(inputA, fileNameA);
  bitmapA = await loadBitmapFromFile(inputA.files[0]);
  renderMini(miniA, bitmapA, "image A");
  invalidateResult();
  await refreshPreparedSources(true);
});

inputB.addEventListener("change", async () => {
  resetPersistentPaintLayer(false);
  updateFileLabel(inputB, fileNameB);
  bitmapB = await loadBitmapFromFile(inputB.files[0]);
  renderMini(miniB, bitmapB, "image B");
  invalidateResult();
  await refreshPreparedSources(true);
});

inputSplit.addEventListener("change", async () => {
  resetPersistentPaintLayer(false);
  updateFileLabel(inputSplit, fileNameSplit);
  bitmapSplit = await loadBitmapFromFile(inputSplit.files[0]);
  renderMini(miniSplit, bitmapSplit, "split image");
  invalidateResult();
  await refreshPreparedSources(true);
});

splitOrientation.addEventListener("change", async () => {
  invalidateResult();
  await refreshPreparedSources(true);
});

function clamp01(x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function byteFromFloat(x) {
  return Math.max(0, Math.min(255, Math.floor(x * 255.0 + 0.5)));
}

function medianOfArray(values) {
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

function median3(a, b, c) {
  if (a > b) {
    if (b > c) return b;
    return a > c ? c : a;
  } else {
    if (a > c) return a;
    return b > c ? c : b;
  }
}

function luminance(rgb) {
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function estimateBackgroundFromImageData(img) {
  const data = img.data;
  const width = img.width;
  const height = img.height;
  const c = Math.min(32, Math.floor(height / 4), Math.floor(width / 4));
  if (c <= 0) throw new Error("Image is too small for corner background estimation.");

  const r = [], g = [], b = [];
  function addPatch(x0, y0, patchWidth, patchHeight) {
    for (let y = y0; y < y0 + patchHeight; y++) {
      for (let x = x0; x < x0 + patchWidth; x++) {
        const idx = (y * width + x) * 4;
        r.push(data[idx] / 255.0);
        g.push(data[idx + 1] / 255.0);
        b.push(data[idx + 2] / 255.0);
      }
    }
  }
  addPatch(0, 0, c, c);
  addPatch(width - c, 0, c, c);
  addPatch(0, height - c, c, c);
  addPatch(width - c, height - c, c, c);

  return [medianOfArray(r), medianOfArray(g), medianOfArray(b)];
}

function cropImageData(img, x0, y0, width, height) {
  const out = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    const sy = y0 + y;
    for (let x = 0; x < width; x++) {
      const sx = x0 + x;
      const srcIdx = (sy * img.width + sx) * 4;
      const dstIdx = (y * width + x) * 4;
      out[dstIdx] = img.data[srcIdx];
      out[dstIdx + 1] = img.data[srcIdx + 1];
      out[dstIdx + 2] = img.data[srcIdx + 2];
      out[dstIdx + 3] = img.data[srcIdx + 3];
    }
  }
  return { data: out, width, height };
}

function detectSplitOrientation(splitImg) {
  const totalW = splitImg.width;
  const totalH = splitImg.height;

  const leftW = Math.floor(totalW / 2);
  const rightW = totalW - leftW;
  const topH = Math.floor(totalH / 2);
  const bottomH = totalH - topH;

  let verticalScore = -1;
  if (leftW > 0 && rightW > 0) {
    const left = cropImageData(splitImg, 0, 0, leftW, totalH);
    const right = cropImageData(splitImg, leftW, 0, rightW, totalH);
    const lumLeft = luminance(estimateBackgroundFromImageData(left));
    const lumRight = luminance(estimateBackgroundFromImageData(right));
    verticalScore = Math.abs(lumLeft - lumRight);
  }

  let horizontalScore = -1;
  if (topH > 0 && bottomH > 0) {
    const top = cropImageData(splitImg, 0, 0, totalW, topH);
    const bottom = cropImageData(splitImg, 0, topH, totalW, bottomH);
    const lumTop = luminance(estimateBackgroundFromImageData(top));
    const lumBottom = luminance(estimateBackgroundFromImageData(bottom));
    horizontalScore = Math.abs(lumTop - lumBottom);
  }

  return verticalScore >= horizontalScore ? "vertical" : "horizontal";
}

function buildPreparedSources() {
  const mode = modeSelect.value;

  if (mode === "two") {
    if (!bitmapA || !bitmapB) return null;
    const imgA = bitmapToImageData(bitmapA);
    const imgB = bitmapToImageData(bitmapB);

    return {
      mode: "two",
      sourceA: { img: imgA, label: "Image A", autoBg: estimateBackgroundFromImageData(imgA) },
      sourceB: { img: imgB, label: "Image B", autoBg: estimateBackgroundFromImageData(imgB) }
    };
  }

  if (!bitmapSplit) return null;
  const splitImg = bitmapToImageData(bitmapSplit);
  const requestedOrientation = splitOrientation.value;
  const orientation = requestedOrientation === "auto" ? detectSplitOrientation(splitImg) : requestedOrientation;

  if (orientation === "vertical") {
    const leftW = Math.floor(splitImg.width / 2);
    const rightW = splitImg.width - leftW;
    if (leftW <= 0 || rightW <= 0) throw new Error("Split image is too narrow for vertical split.");
    const left = cropImageData(splitImg, 0, 0, leftW, splitImg.height);
    const right = cropImageData(splitImg, leftW, 0, rightW, splitImg.height);
    return {
      mode: "split",
      orientation,
      sourceA: { img: left, label: "Left half", autoBg: estimateBackgroundFromImageData(left) },
      sourceB: { img: right, label: "Right half", autoBg: estimateBackgroundFromImageData(right) }
    };
  }

  const topH = Math.floor(splitImg.height / 2);
  const bottomH = splitImg.height - topH;
  if (topH <= 0 || bottomH <= 0) throw new Error("Split image is too short for horizontal split.");
  const top = cropImageData(splitImg, 0, 0, splitImg.width, topH);
  const bottom = cropImageData(splitImg, 0, topH, splitImg.width, bottomH);
  return {
    mode: "split",
    orientation,
    sourceA: { img: top, label: "Top half", autoBg: estimateBackgroundFromImageData(top) },
    sourceB: { img: bottom, label: "Bottom half", autoBg: estimateBackgroundFromImageData(bottom) }
  };
}

function floatsToHex(rgb) {
  const r = byteFromFloat(rgb[0]).toString(16).padStart(2, "0");
  const g = byteFromFloat(rgb[1]).toString(16).padStart(2, "0");
  const b = byteFromFloat(rgb[2]).toString(16).padStart(2, "0");
  return "#" + r + g + b;
}

function bytesToFloatRgb(r, g, b) {
  return [Number(r) / 255.0, Number(g) / 255.0, Number(b) / 255.0];
}

function setSwatches() {
  swatchA.style.background = floatsToHex(getBgA());
  swatchB.style.background = floatsToHex(getBgB());
}

function getBgA() {
  return bytesToFloatRgb(rA.value, gA.value, bA.value);
}

function getBgB() {
  return bytesToFloatRgb(rB.value, gB.value, bB.value);
}

function applyRgbToControls(prefix, rgb) {
  const rr = byteFromFloat(rgb[0]);
  const gg = byteFromFloat(rgb[1]);
  const bb = byteFromFloat(rgb[2]);

  if (prefix === "A") {
    rA.value = rr; gA.value = gg; bA.value = bb; hexA.value = floatsToHex(rgb);
  } else {
    rB.value = rr; gB.value = gg; bB.value = bb; hexB.value = floatsToHex(rgb);
  }
  setSwatches();
}

function parseHex(hex) {
  const s = String(hex || "").trim();
  const m = s.match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const h = m[1];
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return [r / 255.0, g / 255.0, b / 255.0];
}

function syncFromHex(prefix) {
  const value = prefix === "A" ? hexA.value : hexB.value;
  const rgb = parseHex(value);
  if (!rgb) return;
  applyRgbToControls(prefix, rgb);
}

function syncFromRgb(prefix) {
  const rr = prefix === "A" ? rA.value : rB.value;
  const gg = prefix === "A" ? gA.value : gB.value;
  const bb = prefix === "A" ? bA.value : bB.value;
  applyRgbToControls(prefix, bytesToFloatRgb(rr, gg, bb));
}

hexA.addEventListener("change", () => syncFromHex("A"));
hexB.addEventListener("change", () => syncFromHex("B"));
[rA, gA, bA].forEach(el => el.addEventListener("change", () => syncFromRgb("A")));
[rB, gB, bB].forEach(el => el.addEventListener("change", () => syncFromRgb("B")));

resetColorsBtn.addEventListener("click", () => {
  applyRgbToControls("A", autoBgA);
  applyRgbToControls("B", autoBgB);
});

swapColorsBtn.addEventListener("click", () => {
  const a = getBgA();
  const b = getBgB();
  applyRgbToControls("A", b);
  applyRgbToControls("B", a);
});

function renderSourcePreview(container, sourceImg, label, overlayRect = null) {
  container.innerHTML = "";
  if (!sourceImg) {
    container.textContent = label;
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = sourceImg.width;
  canvas.height = sourceImg.height;
  const ctx = canvas.getContext("2d");
  const imgData = new ImageData(new Uint8ClampedArray(sourceImg.data), sourceImg.width, sourceImg.height);
  ctx.putImageData(imgData, 0, 0);
  container.appendChild(canvas);
}

function computeSourceOverlayRect(sourceImg, ox, oy, minX, minY, cropBox) {
  if (!cropBox || !cropBox.applied) return null;

  const sx0 = cropBox.x - (ox - minX);
  const sy0 = cropBox.y - (oy - minY);
  const sx1 = sx0 + cropBox.croppedWidth - 1;
  const sy1 = sy0 + cropBox.croppedHeight - 1;

  const x0 = Math.max(0, sx0);
  const y0 = Math.max(0, sy0);
  const x1 = Math.min(sourceImg.width - 1, sx1);
  const y1 = Math.min(sourceImg.height - 1, sy1);

  if (x1 < x0 || y1 < y0) return null;
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

function updateCropPreviewOverlays() {
  if (!prepared) {
    renderSourcePreview(previewA, null, "source A");
    renderSourcePreview(previewB, null, "source B");
    return;
  }
  renderSourcePreview(previewA, prepared.sourceA.img, prepared.sourceA.label);
  renderSourcePreview(previewB, prepared.sourceB.img, prepared.sourceB.label);
}

function sampleAverageColor(sourceImg, x, y, radius = 2) {
  const { width, height, data } = sourceImg;
  let r = 0, g = 0, b = 0, count = 0;

  for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius); yy++) {
    for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx++) {
      const i = (yy * width + xx) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }

  if (count <= 0) return [0, 0, 0];
  return [r / count / 255.0, g / count / 255.0, b / count / 255.0];
}

function attachPicker(container, sourceKey, prefix) {
  container.onclick = (event) => {
    if (!prepared || !prepared[sourceKey]) return;
    const source = prepared[sourceKey];
    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const rx = (event.clientX - rect.left) / rect.width;
    const ry = (event.clientY - rect.top) / rect.height;
    const x = Math.max(0, Math.min(source.img.width - 1, Math.round(rx * (source.img.width - 1))));
    const y = Math.max(0, Math.min(source.img.height - 1, Math.round(ry * (source.img.height - 1))));
    const rgb = sampleAverageColor(source.img, x, y, 2);
    applyRgbToControls(prefix, rgb);
  };
}

attachPicker(previewA, "sourceA", "A");
attachPicker(previewB, "sourceB", "B");

async function refreshPreparedSources(resetColorControls = false) {
  try {
    prepared = buildPreparedSources();
  } catch (error) {
    prepared = null;
    diagnosticsEl.innerHTML = `<div><b>Diagnostics</b></div><div class="hint" style="margin-top:6px">${String(error && error.message ? error.message : error)}</div>`;
    updateCropPreviewOverlays();
    return;
  }

  if (!prepared) {
    diagnosticsEl.innerHTML = `<div><b>Diagnostics</b></div><div class="hint" style="margin-top:6px">Load the sources. Auto-detected corner colors will appear here.</div>`;
    updateCropPreviewOverlays();
    return;
  }

  autoBgA = prepared.sourceA.autoBg.slice();
  autoBgB = prepared.sourceB.autoBg.slice();

  if (resetColorControls) {
    applyRgbToControls("A", autoBgA);
    applyRgbToControls("B", autoBgB);
  } else {
    setSwatches();
  }

  updateCropPreviewOverlays();

  let extra = "";
  if (prepared.mode === "split") {
    extra += `Mode: <code>split</code>, orientation: <code>${prepared.orientation}</code><br>`;
  } else {
    extra += `Mode: <code>two separate images</code><br>`;
  }

  diagnosticsEl.innerHTML =
    `<div><b>Diagnostics</b></div>` +
    `<div style="margin-top:8px">` +
    `<span class="badge">A = ${prepared.sourceA.label}</span>` +
    `<span class="badge">B = ${prepared.sourceB.label}</span>` +
    `</div>` +
    `<div style="margin-top:6px">` +
    extra +
    `Auto bg A: <code>${autoBgA.map(v => v.toFixed(3)).join(", ")}</code> · luminance <code>${luminance(autoBgA).toFixed(3)}</code><br>` +
    `Auto bg B: <code>${autoBgB.map(v => v.toFixed(3)).join(", ")}</code> · luminance <code>${luminance(autoBgB).toFixed(3)}</code><br>` +
    `You can adjust the current colors manually, with the picker, or with Reset colors to auto.` +
    `</div>`;
}

function computeCanvasLayout(imgA, imgB, offAXv, offAYv, offBXv, offBYv) {
  const minX = Math.min(offAXv, offBXv, 0);
  const minY = Math.min(offAYv, offBYv, 0);
  const maxX = Math.max(offAXv + imgA.width, offBXv + imgB.width);
  const maxY = Math.max(offAYv + imgA.height, offBYv + imgB.height);
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

function sampleAligned(img, bg, x, y, ox, oy, minX, minY) {
  const sx = x - (ox - minX);
  const sy = y - (oy - minY);

  if (sx < 0 || sy < 0 || sx >= img.width || sy >= img.height) {
    return bg;
  }

  const i = (sy * img.width + sx) * 4;
  return [img.data[i] / 255.0, img.data[i + 1] / 255.0, img.data[i + 2] / 255.0];
}

function qualityLabel(avgMismatch, badPct) {
  if (avgMismatch < 0.02 && badPct < 1.0) return { text: "good", cls: "ok" };
  if (avgMismatch < 0.06 && badPct < 6.0) return { text: "medium", cls: "warn" };
  return { text: "poor", cls: "err" };
}


function cropCanvas(sourceCanvas, x, y, width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  ctx.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
  return c;
}

function computeAlphaBounds(alphaPixels, width, height, threshold255) {
  let minX = width, minY = height, maxX = -1, maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4 + 3;
      if (alphaPixels[i] > threshold255) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return null;
  return { minX, minY, maxX, maxY };
}

function colorDistance01(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt((dr * dr + dg * dg + db * db) / 3.0);
}

function computeSourceUnionBounds(srcA, srcB, bgA, bgB, layout, aox, aoy, box, boy, threshold01) {
  const width = layout.width;
  const height = layout.height;
  let minX = width, minY = height, maxX = -1, maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = sampleAligned(srcA, bgA, x, y, aox, aoy, layout.minX, layout.minY);
      const b = sampleAligned(srcB, bgB, x, y, box, boy, layout.minX, layout.minY);

      const da = colorDistance01(a, bgA);
      const db = colorDistance01(b, bgB);

      if (da > threshold01 || db > threshold01) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return null;
  return { minX, minY, maxX, maxY };
}

function drawCropBoxCanvas(sourceCanvas, cropInfo) {
  const c = document.createElement("canvas");
  c.width = sourceCanvas.width;
  c.height = sourceCanvas.height;

  const ctx = c.getContext("2d");
  ctx.drawImage(sourceCanvas, 0, 0);

  if (cropInfo && cropInfo.applied) {
    const line = Math.max(2, Math.round(Math.min(c.width, c.height) / 240));
    ctx.save();
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = line;
    ctx.setLineDash([line * 6, line * 4]);
    ctx.strokeRect(
      cropInfo.x + line * 0.5,
      cropInfo.y + line * 0.5,
      Math.max(0, cropInfo.croppedWidth - line),
      Math.max(0, cropInfo.croppedHeight - line)
    );
    ctx.restore();
  }

  return c;
}

function applyBoundsToCropInfo(bounds, width, height, padding, threshold, mode) {
  if (!bounds) {
    return {
      applied: false,
      originalWidth: width,
      originalHeight: height,
      croppedWidth: width,
      croppedHeight: height,
      threshold,
      padding,
      mode
    };
  }

  const x0 = Math.max(0, bounds.minX - padding);
  const y0 = Math.max(0, bounds.minY - padding);
  const x1 = Math.min(width - 1, bounds.maxX + padding);
  const y1 = Math.min(height - 1, bounds.maxY + padding);
  const cw = x1 - x0 + 1;
  const ch = y1 - y0 + 1;

  return {
    applied: true,
    originalWidth: width,
    originalHeight: height,
    croppedWidth: cw,
    croppedHeight: ch,
    threshold,
    padding,
    mode,
    x: x0,
    y: y0
  };
}


const brushPreviewEl = document.createElement("div");
brushPreviewEl.className = "brushPreviewOverlay";

function hideBrushPreview() {
  lastBrushPointerClient = null;
  brushPreviewEl.style.display = "none";
}

function updateBrushPreviewFromClient(clientX, clientY) {
  if (!paintEnabled.checked) {
    hideBrushPreview();
    return;
  }

  const canvas = getDisplayedPaintCanvas();
  const pt = canvas ? clientToCanvasPoint(canvas, clientX, clientY) : null;
  if (!canvas || !pt || !pt.metrics) {
    hideBrushPreview();
    return;
  }

  const brushDiameterCss = Math.max(4, Number(paintSize.value) / pt.metrics.scaleX);

  brushPreviewEl.style.width = `${brushDiameterCss}px`;
  brushPreviewEl.style.height = `${brushDiameterCss}px`;
  brushPreviewEl.style.left = `${clientX}px`;
  brushPreviewEl.style.top = `${clientY}px`;
  brushPreviewEl.style.display = "block";

  lastBrushPointerClient = { clientX, clientY };
}

function refreshBrushPreview() {
  if (!paintEnabled.checked || !lastBrushPointerClient) {
    hideBrushPreview();
    return;
  }

  updateBrushPreviewFromClient(lastBrushPointerClient.clientX, lastBrushPointerClient.clientY);
}

function cloneCanvasImageData(canvas) {
  if (!canvas) return null;
  return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
}

function ensurePaintMaskCanvas(width, height, preserve = true) {
  if (paintMaskCanvas && preserve && paintMaskCanvas.width === width && paintMaskCanvas.height === height) {
    return paintMaskCanvas;
  }

  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  paintMaskCanvas = c;
  if (!preserve) {
    paintTouched = false;
    paintUndoStack = [];
  }
  return paintMaskCanvas;
}

function clearPaintMaskCanvas() {
  if (!paintMaskCanvas) return;
  paintMaskCanvas.getContext("2d").clearRect(0, 0, paintMaskCanvas.width, paintMaskCanvas.height);
}

function resetPersistentPaintLayer(showMessage = false) {
  clearPaintMaskCanvas();
  paintUndoStack = [];
  paintTouched = false;
  if (paintBaseResultData && paintBaseAlphaData && resultCanvas && alphaCanvas) {
    rebuildResultFromBaseAndMask();
    renderViewer();
    updateDownloadFromResultCanvas();
  }
  if (showMessage) {
    setStatus("Paint layer reset.", "ok");
  }
}

function clonePaintMaskImageData() {
  if (!paintMaskCanvas) return null;
  return paintMaskCanvas.getContext("2d").getImageData(0, 0, paintMaskCanvas.width, paintMaskCanvas.height);
}

function isPaintMaskNonEmpty() {
  if (!paintMaskCanvas) return false;
  const data = clonePaintMaskImageData().data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) return true;
  }
  return false;
}

function buildPaintOverlayPreviewCanvas(baseCanvas) {
  if (!baseCanvas) return baseCanvas;
  const out = document.createElement("canvas");
  out.width = baseCanvas.width;
  out.height = baseCanvas.height;
  const ctx = out.getContext("2d", { colorSpace: "srgb" });
  ctx.drawImage(baseCanvas, 0, 0);

  if (!paintMaskCanvas || paintMaskCanvas.width !== baseCanvas.width || paintMaskCanvas.height !== baseCanvas.height) {
    return out;
  }

  const mask = paintMaskCanvas.getContext("2d").getImageData(0, 0, paintMaskCanvas.width, paintMaskCanvas.height).data;
  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = out.width;
  overlayCanvas.height = out.height;
  const overlayCtx = overlayCanvas.getContext("2d", { colorSpace: "srgb" });
  const overlay = overlayCtx.createImageData(out.width, out.height);
  let hasVisible = false;

  for (let i = 0; i < mask.length; i += 4) {
    const a = mask[i + 3];
    if (!a) continue;
    overlay.data[i] = 255;
    overlay.data[i + 1] = 32;
    overlay.data[i + 2] = 32;
    overlay.data[i + 3] = Math.min(220, a);
    hasVisible = true;
  }

  if (hasVisible) {
    overlayCtx.putImageData(overlay, 0, 0);
    ctx.drawImage(overlayCanvas, 0, 0);
  }
  return out;
}

function rebuildResultFromBaseAndMask() {
  if (!resultCanvas || !alphaCanvas || !paintBaseResultData || !paintBaseAlphaData) return false;

  const resultCtx = resultCanvas.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" });
  const alphaCtx = alphaCanvas.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" });
  const resultImage = new ImageData(new Uint8ClampedArray(paintBaseResultData.data), paintBaseResultData.width, paintBaseResultData.height);
  const alphaImage = new ImageData(new Uint8ClampedArray(paintBaseAlphaData.data), paintBaseAlphaData.width, paintBaseAlphaData.height);

  if (paintMaskCanvas && paintMaskCanvas.width === resultCanvas.width && paintMaskCanvas.height === resultCanvas.height) {
    const maskData = paintMaskCanvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, paintMaskCanvas.width, paintMaskCanvas.height).data;
    const targetAlpha = clamp01(Number((paintTarget && paintTarget.value) || 1.0));
    for (let i = 0; i < maskData.length; i += 4) {
      const mask = maskData[i + 3] / 255.0;
      if (mask <= 0) continue;
      const baseAlpha = paintBaseResultData.data[i + 3] / 255.0;
      const newAlpha = clamp01(baseAlpha * (1.0 - mask) + targetAlpha * mask);
      const aByte = byteFromFloat(newAlpha);
      resultImage.data[i + 3] = aByte;
      alphaImage.data[i] = aByte;
      alphaImage.data[i + 1] = aByte;
      alphaImage.data[i + 2] = aByte;
      alphaImage.data[i + 3] = 255;
    }
  }

  resultCtx.putImageData(resultImage, 0, 0);
  alphaCtx.putImageData(alphaImage, 0, 0);
  return true;
}

function resetPaintHistoryFromCurrentResult() {
  paintBaseResultData = cloneCanvasImageData(resultCanvas);
  paintBaseAlphaData = cloneCanvasImageData(alphaCanvas);

  if (resultCanvas && alphaCanvas) {
    const keepExistingMask = !!paintMaskCanvas && paintMaskCanvas.width === resultCanvas.width && paintMaskCanvas.height === resultCanvas.height;
    ensurePaintMaskCanvas(resultCanvas.width, resultCanvas.height, keepExistingMask);
    if (!keepExistingMask) {
      clearPaintMaskCanvas();
      paintUndoStack = [];
      paintTouched = false;
    }
    rebuildResultFromBaseAndMask();
    paintTouched = isPaintMaskNonEmpty();
  }
}

async function updateDownloadFromResultCanvas() {
  if (!resultCanvas) return;
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = resultCanvas.width;
  exportCanvas.height = resultCanvas.height;
  const exportCtx = exportCanvas.getContext("2d", { colorSpace: "srgb" });
  exportCtx.drawImage(resultCanvas, 0, 0);

  if (paintTouched) {
    const image = exportCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height);
    const data = image.data;

    // When alpha brush is used, some viewers/engines can reveal fringe colors stored in
    // nearly-transparent edge pixels. We keep normal straight-alpha RGB for visible pixels,
    // but aggressively clean the almost invisible tail so the saved PNG behaves better.
    const zeroCut = 1;
    const fadeCut = 20;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];

      if (a <= zeroCut) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        continue;
      }

      if (a < fadeCut) {
        const t = a / fadeCut;
        data[i] = Math.round(data[i] * t);
        data[i + 1] = Math.round(data[i + 1] * t);
        data[i + 2] = Math.round(data[i + 2] * t);
      }
    }

    exportCtx.putImageData(image, 0, 0);
  }

  const blob = await new Promise(resolve => exportCanvas.toBlob(resolve, "image/png"));
  downloadUrl = URL.createObjectURL(blob);
  downloadBtn.href = downloadUrl;
  downloadBtn.style.display = "inline-block";
}

function pushPaintUndoSnapshot() {
  if (!paintMaskCanvas) return;
  paintUndoStack.push({ mask: clonePaintMaskImageData() });
  if (paintUndoStack.length > 20) paintUndoStack.shift();
}

function restorePaintUndoSnapshot() {
  const snap = paintUndoStack.pop();
  if (!snap || !paintMaskCanvas) return false;
  paintMaskCanvas.getContext("2d").putImageData(snap.mask, 0, 0);
  paintTouched = isPaintMaskNonEmpty();
  rebuildResultFromBaseAndMask();
  renderViewer();
  updateDownloadFromResultCanvas();
  return true;
}

function isPaintableCurrentView() {
  return ["checker", "dark", "light", "alpha"].includes(currentView);
}

function updatePaintViewerClass() {
  viewer.classList.toggle("paintActive", !!paintEnabled.checked && isPaintableCurrentView() && !!resultCanvas);
  viewer.classList.toggle("paintBlocked", !!paintEnabled.checked && !isPaintableCurrentView() && !!resultCanvas);
  refreshBrushPreview();
}

function getDisplayedPaintCanvas() {
  if (!paintEnabled.checked || !resultCanvas || !alphaCanvas) return null;
  if (!isPaintableCurrentView()) return null;
  return viewer.querySelector(".viewerStage canvas") || viewer.querySelector("canvas");
}

function getCanvasSourceSize(canvas) {
  return {
    width: Number(canvas?.dataset?.sourceWidth) || canvas?.width || 1,
    height: Number(canvas?.dataset?.sourceHeight) || canvas?.height || 1
  };
}

function clientToCanvasPoint(canvas, clientX, clientY) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;

  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    return null;
  }

  const source = getCanvasSourceSize(canvas);
  const scaleX = source.width / rect.width;
  const scaleY = source.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
    metrics: {
      cssWidth: rect.width,
      cssHeight: rect.height,
      sourceWidth: source.width,
      sourceHeight: source.height,
      scaleX,
      scaleY
    }
  };
}

function eventToCanvasPoint(canvas, event) {
  return clientToCanvasPoint(canvas, event.clientX, event.clientY);
}

function paintAlphaAtCanvasPoint(cx, cy) {
  if (!resultCanvas || !alphaCanvas) return false;
  ensurePaintMaskCanvas(resultCanvas.width, resultCanvas.height, true);
  if (!paintMaskCanvas) return false;

  const radius = Math.max(0.5, Number(paintSize.value) * 0.5);
  const strength = clamp01(Number(paintStrength.value));
  const mode = paintMode.value;

  const width = paintMaskCanvas.width;
  const height = paintMaskCanvas.height;

  const x0 = Math.max(0, Math.floor(cx - radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const x1 = Math.min(width - 1, Math.ceil(cx + radius));
  const y1 = Math.min(height - 1, Math.ceil(cy + radius));
  if (x1 < x0 || y1 < y0) return false;

  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const maskCtx = paintMaskCanvas.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" });
  const maskImage = maskCtx.getImageData(x0, y0, w, h);
  let changed = false;

  for (let yy = 0; yy < h; yy++) {
    const py = y0 + yy;
    for (let xx = 0; xx < w; xx++) {
      const px = x0 + xx;
      const dx = px + 0.5 - cx;
      const dy = py + 0.5 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) continue;

      const falloff = 1.0 - clamp01(dist / radius);
      const apply = strength * falloff;
      if (apply <= 0) continue;

      const i = (yy * w + xx) * 4;
      const oldMask = maskImage.data[i + 3] / 255.0;
      let newMask;
      if (mode === "erase") {
        newMask = clamp01(oldMask * (1.0 - apply));
      } else {
        newMask = clamp01(oldMask + (1.0 - oldMask) * apply);
      }

      const aByte = byteFromFloat(newMask);
      if (aByte === maskImage.data[i + 3]) continue;
      maskImage.data[i] = 255;
      maskImage.data[i + 1] = 0;
      maskImage.data[i + 2] = 0;
      maskImage.data[i + 3] = aByte;
      changed = true;
    }
  }

  if (!changed) return false;
  maskCtx.putImageData(maskImage, x0, y0);
  paintTouched = isPaintMaskNonEmpty();
  rebuildResultFromBaseAndMask();
  return true;
}

function handlePaintPointer(event) {
  const canvas = getDisplayedPaintCanvas();
  if (!canvas) return false;
  const pt = eventToCanvasPoint(canvas, event);
  if (!pt) return false;
  const changed = paintAlphaAtCanvasPoint(pt.x, pt.y);

  if (changed) {
    paintStrokeChanged = true;
    refreshCurrentViewerCanvasAfterPaint();
    updateBrushPreviewFromClient(event.clientX, event.clientY);
  }

  return changed;
}

viewer.addEventListener("pointerdown", event => {
  const isMouse = event.pointerType === "mouse";
  const isStrictLeftPaint =
    (!isMouse || (event.button === 0 && event.buttons === 1));

  const isStrictMiddlePan =
    isMouse && event.button === 1 && event.buttons === 4;

  if (isStrictMiddlePan && viewer.classList.contains("zoomed")) {
    event.preventDefault();
    isViewerPanning = true;
    viewerPanPointerId = event.pointerId;
    viewerPanStartX = event.clientX;
    viewerPanStartY = event.clientY;
    viewerPanStartScrollLeft = viewer.scrollLeft;
    viewerPanStartScrollTop = viewer.scrollTop;
    viewer.classList.add("panning");
    viewer.setPointerCapture?.(event.pointerId);
    hideBrushPreview();
    return;
  }

  // Right button and any weird multi-button combo are ignored completely.
  // No preventDefault, no painting, no "helpful" browser wrestling. Amazing that this needs saying.
  if (!isStrictLeftPaint) {
    return;
  }

  if (!paintEnabled.checked) return;

  const canvas = getDisplayedPaintCanvas();
  if (!canvas) {
    setStatus("Switch to Result, Dark preview, Light preview, or Alpha mask to paint the red layer.", "bad");
    return;
  }

  event.preventDefault();
  viewer.setPointerCapture?.(event.pointerId);
  pushPaintUndoSnapshot();
  isPaintingAlpha = true;
  paintStrokeChanged = false;
  handlePaintPointer(event);
});

viewer.addEventListener("pointermove", event => {
  if (isViewerPanning && event.pointerId === viewerPanPointerId) {
    event.preventDefault();
    viewer.scrollLeft = viewerPanStartScrollLeft - (event.clientX - viewerPanStartX);
    viewer.scrollTop = viewerPanStartScrollTop - (event.clientY - viewerPanStartY);
    return;
  }

  if (paintEnabled.checked) {
    updateBrushPreviewFromClient(event.clientX, event.clientY);
  }

  if (!isPaintingAlpha) return;

  // Continue painting only while the left mouse button is the only active button.
  if (event.pointerType === "mouse" && event.buttons !== 1) {
    return;
  }

  event.preventDefault();
  handlePaintPointer(event);
});

viewer.addEventListener("pointerleave", () => {
  if (!isPaintingAlpha && !isViewerPanning) hideBrushPreview();
});

window.addEventListener("pointerup", async event => {
  if (isViewerPanning && event.pointerId === viewerPanPointerId) {
    isViewerPanning = false;
    viewerPanPointerId = null;
    viewer.classList.remove("panning");
    viewer.releasePointerCapture?.(event.pointerId);
    return;
  }

  if (!isPaintingAlpha) return;

  // Ignore right/middle releases if a left paint stroke is still active.
  if (event.pointerType === "mouse" && event.button !== 0 && event.buttons !== 0) {
    return;
  }

  isPaintingAlpha = false;
  viewer.releasePointerCapture?.(event.pointerId);

  if (paintStrokeChanged) {
    paintTouched = true;
    await updateDownloadFromResultCanvas();
    refreshCurrentViewerCanvasAfterPaint();
    setStatus("Paint layer stroke applied. Download updated.", "ok");
  }
});

paintEnabled.addEventListener("change", () => {
  updatePaintViewerClass();
  if (!paintEnabled.checked) hideBrushPreview();
  if (paintEnabled.checked && !resultCanvas) {
    setStatus("Build a result first, then use the paint layer.", "bad");
  }
});

paintMode.addEventListener("change", updatePaintViewerClass);
paintSize.addEventListener("input", refreshBrushPreview);
paintTarget.addEventListener("input", () => {
  updateSliderLabels();
  if (paintBaseResultData && paintBaseAlphaData && resultCanvas && alphaCanvas) {
    rebuildResultFromBaseAndMask();
    renderViewer();
    updateDownloadFromResultCanvas();
  }
});

paintUndoBtn.addEventListener("click", () => {
  const ok = restorePaintUndoSnapshot();
  setStatus(ok ? "Paint layer stroke undone. Download updated." : "Nothing to undo.", ok ? "ok" : "bad");
});

paintResetLayerBtn.addEventListener("click", () => {
  resetPersistentPaintLayer(true);
});

async function processImages() {
  processBtn.disabled = true;
  setStatus("Processing...");

  try {
    if (!prepared) {
      await refreshPreparedSources(false);
    }
    if (!prepared) {
      throw new Error("No input images.");
    }

    const srcA = prepared.sourceA.img;
    const srcB = prepared.sourceB.img;
    const bgA = getBgA();
    const bgB = getBgB();

    const aox = Number(offAX.value);
    const aoy = Number(offAY.value);
    const box = Number(offBX.value);
    const boy = Number(offBY.value);

    const layout = computeCanvasLayout(srcA, srcB, aox, aoy, box, boy);
    const width = layout.width;
    const height = layout.height;
    const pixelCount = width * height;

    const alphaLow = Number(lowCut.value);
    const alphaHigh = Number(highCut.value);
    const solidAlpha = Number(solidCut.value);
    const desat = Number(desatResult.value);
    const cropModeValue = cropMode.value;
    const cropThresholdValue = Number(cropThreshold.value);
    const cropPaddingValue = Number(cropPadding.value);

    const useLinear = !!solveLinear.checked;
    const shadowSuppressEnabled = !!shadowSuppress.checked;
    const shadowThresholdValue = Number(shadowThreshold.value);
    const shadowBgToleranceValue = Number(shadowBgTolerance.value);
    const shadowMinLumaValue = Number(shadowMinLuma.value);
    const shadowAlphaCeilValue = Number(shadowAlphaCeil.value);
    const alphaMethodValue = alphaMethod.value;
    const coreBoostEnabled = !!coreBoost.checked;
    const coreThresholdValue = Number(coreThreshold.value);
    const coreFloorValue = Number(coreFloor.value);
    const unionBoostEnabled = !!unionBoost.checked;
    const unionThresholdValue = Number(unionThreshold.value);
    const unionSimilarityValue = Number(unionSimilarity.value);
    const unionFloorValue = Number(unionFloor.value);
    const alphaMedianEnabled = !!alphaMedian.checked;
    const alphaMedianKernelValue = Number(alphaMedianKernel.value);
    const alphaMedianPassesValue = Number(alphaMedianPasses.value);
    const alphaMedianBlendValue = Number(alphaMedianBlend.value);
    const bgVetoEnabled = !!bgVeto.checked;
    const bgVetoToleranceValue = Number(bgVetoTolerance.value);
    const bgVetoLowAlphaOnlyEnabled = !!bgVetoLowAlphaOnly.checked;
    const bgVetoAlphaCeilValue = Number(bgVetoAlphaCeil.value);
    const darkRescueEnabled = !!darkRescue.checked;
    const darkThresholdValue = Number(darkThreshold.value);
    const darkBoostValue = Number(darkBoost.value);

    const bgAWork = toWorkColor(bgA, useLinear);
    const bgBWork = toWorkColor(bgB, useLinear);
    const bgALuma = luminanceSrgb(bgA[0], bgA[1], bgA[2]);
    const bgBLuma = luminanceSrgb(bgB[0], bgB[1], bgB[2]);

    const bgDiff = [
      bgAWork[0] - bgBWork[0],
      bgAWork[1] - bgBWork[1],
      bgAWork[2] - bgBWork[2]
    ];
    const bgDiffLenSq =
      bgDiff[0] * bgDiff[0] +
      bgDiff[1] * bgDiff[1] +
      bgDiff[2] * bgDiff[2];

    if (bgDiffLenSq < 1e-8) {
      throw new Error("Background colors are too similar. Use two more different solid colors.");
    }

    const outCanvas = document.createElement("canvas");
    outCanvas.width = width;
    outCanvas.height = height;
    const outCtx = outCanvas.getContext("2d", { colorSpace: "srgb" });
    const outImage = outCtx.createImageData(width, height);
    const O = outImage.data;

    const alphaCanvasLocal = document.createElement("canvas");
    alphaCanvasLocal.width = width;
    alphaCanvasLocal.height = height;
    const alphaCtx = alphaCanvasLocal.getContext("2d");
    const alphaImage = alphaCtx.createImageData(width, height);
    const A = alphaImage.data;

    const coreCanvasLocal = document.createElement("canvas");
    coreCanvasLocal.width = width;
    coreCanvasLocal.height = height;
    const coreCtx = coreCanvasLocal.getContext("2d");
    const coreImage = coreCtx.createImageData(width, height);
    const C = coreImage.data;

    const mismatchCanvasLocal = document.createElement("canvas");
    mismatchCanvasLocal.width = width;
    mismatchCanvasLocal.height = height;
    const mismatchCtx = mismatchCanvasLocal.getContext("2d");
    const mismatchImage = mismatchCtx.createImageData(width, height);
    const M = mismatchImage.data;

    let mismatchSum = 0.0;
    let mismatchCount = 0;
    let badCount = 0;
    let maxMismatch = 0.0;

    for (let p = 0; p < pixelCount; p++) {
      const x = p % width;
      const y = Math.floor(p / width);
      const i = p * 4;

      const aSrc = sampleAligned(srcA, bgA, x, y, aox, aoy, layout.minX, layout.minY);
      const bSrc = sampleAligned(srcB, bgB, x, y, box, boy, layout.minX, layout.minY);

      const a = toWorkColor(aSrc, useLinear);
      const b = toWorkColor(bSrc, useLinear);

      const Ar = a[0], Ag = a[1], Ab = a[2];
      const Br = b[0], Bg = b[1], Bb = b[2];

      const pixelDiff = [Ar - Br, Ag - Bg, Ab - Bb];

      let oneMinusAlphaProjection =
        (pixelDiff[0] * bgDiff[0] +
         pixelDiff[1] * bgDiff[1] +
         pixelDiff[2] * bgDiff[2]) / bgDiffLenSq;

      oneMinusAlphaProjection = clamp01(oneMinusAlphaProjection);
      let alphaFromProjection = clamp01(1.0 - oneMinusAlphaProjection);

      const channelAlphas = [];
      for (let ch = 0; ch < 3; ch++) {
        if (Math.abs(bgDiff[ch]) > 1e-6) {
          const candidate = clamp01(1.0 - pixelDiff[ch] / bgDiff[ch]);
          channelAlphas.push(candidate);
        }
      }

      let alpha = alphaFromProjection;
      if (channelAlphas.length) {
        const a0 = channelAlphas[0] ?? alphaFromProjection;
        const a1 = channelAlphas[1] ?? a0;
        const a2 = channelAlphas[2] ?? a1;

        if (alphaMethodValue === "channelAverage") {
          alpha = clamp01((a0 + a1 + a2) / 3.0);
        } else if (alphaMethodValue === "channelMedian") {
          alpha = clamp01(median3(a0, a1, a2));
        } else if (alphaMethodValue === "channelMax") {
          alpha = clamp01(Math.max(a0, a1, a2));
        }
      }

      if (alpha < alphaLow) alpha = 0.0;
      if (alpha > alphaHigh) alpha = 1.0;
      if (alpha > solidAlpha) alpha = 1.0;

      const distA = colorDistance3(Ar, Ag, Ab, bgAWork[0], bgAWork[1], bgAWork[2]);
      const distB = colorDistance3(Br, Bg, Bb, bgBWork[0], bgBWork[1], bgBWork[2]);
      const coreScore = Math.min(distA, distB);
      const unionScore = Math.max(distA, distB);
      const sourceDiff = colorDistance3(Ar, Ag, Ab, Br, Bg, Bb);

      const distASrgb = colorDistance3(aSrc[0], aSrc[1], aSrc[2], bgA[0], bgA[1], bgA[2]);
      const distBSrgb = colorDistance3(bSrc[0], bSrc[1], bSrc[2], bgB[0], bgB[1], bgB[2]);
      const aLuma = luminanceSrgb(aSrc[0], aSrc[1], aSrc[2]);
      const bLuma = luminanceSrgb(bSrc[0], bSrc[1], bSrc[2]);

      const shadowA =
        shadowSuppressEnabled &&
        (bgALuma - aLuma) >= shadowThresholdValue &&
        distBSrgb <= shadowBgToleranceValue &&
        aLuma >= shadowMinLumaValue;

      const shadowB =
        shadowSuppressEnabled &&
        (bgBLuma - bLuma) >= shadowThresholdValue &&
        distASrgb <= shadowBgToleranceValue &&
        bLuma >= shadowMinLumaValue;

      const shadowCandidate = shadowA || shadowB;

      const vetoCandidate = bgVetoEnabled && distASrgb <= bgVetoToleranceValue && distBSrgb <= bgVetoToleranceValue;
      const vetoApplies =
        vetoCandidate &&
        (!bgVetoLowAlphaOnlyEnabled || alpha <= bgVetoAlphaCeilValue);

      if (vetoApplies) {
        alpha = 0.0;
      }

      let ra = 0.0, ga = 0.0, ba = 0.0;
      let rb = 0.0, gb = 0.0, bb2 = 0.0;
      let r = 0.0, g = 0.0, bb = 0.0;
      let mismatch = 0.0;

      if (alpha > 1e-6) {
        const reconstruct = (alphaValue) => {
          const oneMinus = 1.0 - alphaValue;
          return {
            ra: clamp01((Ar - bgAWork[0] * oneMinus) / alphaValue),
            ga: clamp01((Ag - bgAWork[1] * oneMinus) / alphaValue),
            ba: clamp01((Ab - bgAWork[2] * oneMinus) / alphaValue),
            rb: clamp01((Br - bgBWork[0] * oneMinus) / alphaValue),
            gb: clamp01((Bg - bgBWork[1] * oneMinus) / alphaValue),
            bb2: clamp01((Bb - bgBWork[2] * oneMinus) / alphaValue)
          };
        };

        let rec = reconstruct(alpha);
        ra = rec.ra; ga = rec.ga; ba = rec.ba;
        rb = rec.rb; gb = rec.gb; bb2 = rec.bb2;

        // Experimental boost #1: if a pixel is clearly not background in both sources,
        // force it to stay reasonably opaque.
        if (coreBoostEnabled && coreScore >= coreThresholdValue) {
          alpha = Math.max(alpha, coreFloorValue);
        }

        // Experimental boost #1b: one-sided object confidence.
        // Example: a black object part on a black background may look like background
        // in Source B, but Source A still proves that the pixel is object.
        if (unionBoostEnabled && unionScore >= unionThresholdValue && sourceDiff <= unionSimilarityValue) {
          alpha = Math.max(alpha, unionFloorValue);
        }

        // Experimental boost #2: dark-region rescue.
        // If the reconstructed foreground is dark and the pixel is still confidently
        // "object-like" in both sources, push alpha up a bit.
        let previewR = fromWorkChannel((ra + rb) * 0.5, useLinear);
        let previewG = fromWorkChannel((ga + gb) * 0.5, useLinear);
        let previewB = fromWorkChannel((ba + bb2) * 0.5, useLinear);
        const previewLuma = luminanceSrgb(previewR, previewG, previewB);

        if (darkRescueEnabled && coreScore > Math.max(0.02, coreThresholdValue * 0.5) && previewLuma < darkThresholdValue) {
          const darkWeight = 1.0 - clamp01(previewLuma / Math.max(1e-6, darkThresholdValue));
          alpha = clamp01(Math.max(alpha, alpha + darkBoostValue * darkWeight));
        }

        // Experimental suppressor: cast shadows are often only visible on the light background.
        // If one source is basically background and the other is just a medium-dark shadow,
        // cap alpha so it does not become an extracted sprite part.
        if (shadowCandidate) {
          alpha = Math.min(alpha, shadowAlphaCeilValue);
        }

        // Reconstruct again with final alpha if any experimental pass changed it.
        rec = reconstruct(Math.max(alpha, 1e-6));
        ra = rec.ra; ga = rec.ga; ba = rec.ba;
        rb = rec.rb; gb = rec.gb; bb2 = rec.bb2;

        const mode = rgbMode ? rgbMode.value : "average";
        if (mode === "sourceA") {
          r = ra; g = ga; bb = ba;
        } else if (mode === "sourceB") {
          r = rb; g = gb; bb = bb2;
        } else {
          r = clamp01((ra + rb) * 0.5);
          g = clamp01((ga + gb) * 0.5);
          bb = clamp01((ba + bb2) * 0.5);
        }

        if (desat > 0) {
          const gray = r * 0.2126 + g * 0.7152 + bb * 0.0722;
          r = clamp01(r * (1.0 - desat) + gray * desat);
          g = clamp01(g * (1.0 - desat) + gray * desat);
          bb = clamp01(bb * (1.0 - desat) + gray * desat);
        }

        const dr = ra - rb;
        const dg = ga - gb;
        const db = ba - bb2;
        mismatch = Math.sqrt((dr * dr + dg * dg + db * db) / 3.0);

        if (alpha > 0.05) {
          mismatchSum += mismatch;
          mismatchCount++;
          if (mismatch > 0.08) badCount++;
          if (mismatch > maxMismatch) maxMismatch = mismatch;
        }
      }

      O[i] = byteFromFloat(fromWorkChannel(r, useLinear));
      O[i + 1] = byteFromFloat(fromWorkChannel(g, useLinear));
      O[i + 2] = byteFromFloat(fromWorkChannel(bb, useLinear));
      O[i + 3] = byteFromFloat(alpha);

      const av = byteFromFloat(alpha);
      A[i] = av; A[i + 1] = av; A[i + 2] = av; A[i + 3] = 255;

      const coreVis = byteFromFloat(clamp01(coreScore));
      const unionVis = byteFromFloat(clamp01(unionScore));
      const unionHit = unionBoostEnabled && unionScore >= unionThresholdValue && sourceDiff <= unionSimilarityValue;
      if (shadowCandidate) {
        C[i] = 255;
        C[i + 1] = 70;
        C[i + 2] = 40;
      } else if (vetoCandidate) {
        C[i] = 255;
        C[i + 1] = vetoApplies ? 230 : 180;
        C[i + 2] = 40;
      } else {
        C[i] = unionHit ? 80 : coreVis;
        C[i + 1] = unionHit ? 255 : coreVis;
        C[i + 2] = coreBoostEnabled && coreScore >= coreThresholdValue ? 255 : unionVis;
      }
      C[i + 3] = 255;

      const heat = clamp01(mismatch * 4.0);
      const baseMix = 0.55;
      const overlayMix = heat * 0.85;
      const outRPreview = fromWorkChannel(r, useLinear);
      const outGPreview = fromWorkChannel(g, useLinear);
      const outBPreview = fromWorkChannel(bb, useLinear);
      const mr = outRPreview * baseMix + overlayMix;
      const mg = outGPreview * baseMix + overlayMix * 0.22;
      const mb = outBPreview * baseMix;

      M[i] = byteFromFloat(clamp01(mr));
      M[i + 1] = byteFromFloat(clamp01(mg));
      M[i + 2] = byteFromFloat(clamp01(mb));
      M[i + 3] = byteFromFloat(Math.max(alpha, heat * alpha));
    }

    if (alphaMedianEnabled) {
      applyAlphaMedianCleanup(
        outImage.data,
        alphaImage.data,
        width,
        height,
        alphaMedianKernelValue,
        alphaMedianPassesValue,
        alphaMedianBlendValue
      );
    }

    outCtx.putImageData(outImage, 0, 0);
    alphaCtx.putImageData(alphaImage, 0, 0);
    coreCtx.putImageData(coreImage, 0, 0);
    mismatchCtx.putImageData(mismatchImage, 0, 0);

    let cropInfo = {
      applied: false,
      originalWidth: width,
      originalHeight: height,
      croppedWidth: width,
      croppedHeight: height,
      threshold: cropThresholdValue,
      padding: cropPaddingValue,
      mode: cropModeValue
    };

    if (cropModeValue === "alpha") {
      const bounds = computeAlphaBounds(outImage.data, width, height, byteFromFloat(cropThresholdValue));
      cropInfo = applyBoundsToCropInfo(bounds, width, height, cropPaddingValue, cropThresholdValue, cropModeValue);
    } else if (cropModeValue === "sourceUnion") {
      const bounds = computeSourceUnionBounds(srcA, srcB, bgA, bgB, layout, aox, aoy, box, boy, cropThresholdValue);
      cropInfo = applyBoundsToCropInfo(bounds, width, height, cropPaddingValue, cropThresholdValue, cropModeValue);
    }

    cropBoxCanvas = drawCropBoxCanvas(outCanvas, cropInfo);

    if (cropInfo.applied && cropModeValue !== "none") {
      resultCanvas = cropCanvas(outCanvas, cropInfo.x, cropInfo.y, cropInfo.croppedWidth, cropInfo.croppedHeight);
      alphaCanvas = cropCanvas(alphaCanvasLocal, cropInfo.x, cropInfo.y, cropInfo.croppedWidth, cropInfo.croppedHeight);
      coreCanvas = cropCanvas(coreCanvasLocal, cropInfo.x, cropInfo.y, cropInfo.croppedWidth, cropInfo.croppedHeight);
      mismatchCanvas = cropCanvas(mismatchCanvasLocal, cropInfo.x, cropInfo.y, cropInfo.croppedWidth, cropInfo.croppedHeight);
    } else {
      resultCanvas = outCanvas;
      alphaCanvas = alphaCanvasLocal;
      coreCanvas = coreCanvasLocal;
      mismatchCanvas = mismatchCanvasLocal;
    }

    lastCropPreview = {
      ...cropInfo,
      minX: layout.minX,
      minY: layout.minY,
      aox,
      aoy,
      box,
      boy
    };
    updateCropPreviewOverlays();

    resetPaintHistoryFromCurrentResult();
    await updateDownloadFromResultCanvas();

    const avgMismatch = mismatchCount > 0 ? mismatchSum / mismatchCount : 0.0;
    const badPct = mismatchCount > 0 ? (badCount / mismatchCount) * 100.0 : 0.0;
    const q = qualityLabel(avgMismatch, badPct);

    diagnosticsEl.innerHTML =
      `<div><b>Diagnostics</b></div>` +
      `<div style="margin-top:8px">` +
      `<span class="badge">A = ${prepared.sourceA.label}</span>` +
      `<span class="badge">B = ${prepared.sourceB.label}</span>` +
      `<span class="badge ${q.cls}">match quality: ${q.text}</span>` +
      `</div>` +
      `<div style="margin-top:6px">` +
      `Background A used: <code>${bgA.map(v => v.toFixed(3)).join(", ")}</code> · HEX <code>${floatsToHex(bgA)}</code><br>` +
      `Background B used: <code>${bgB.map(v => v.toFixed(3)).join(", ")}</code> · HEX <code>${floatsToHex(bgB)}</code><br>` +
      `Average difference inside the object: <code>${avgMismatch.toFixed(4)}</code><br>` +
      `Problem pixels (&gt; 0.08): <code>${badPct.toFixed(2)}%</code><br>` +
      `Maximum difference: <code>${maxMismatch.toFixed(4)}</code><br>` +
      `Experimental: linear <code>${useLinear ? "on" : "off"}</code> · alpha method <code>${alphaMethodValue}</code><br>` +
      `Shadow suppression: <code>${shadowSuppressEnabled ? "on" : "off"}</code> · threshold <code>${shadowThresholdValue.toFixed(3)}</code> · bg tolerance <code>${shadowBgToleranceValue.toFixed(3)}</code> · min luma <code>${shadowMinLumaValue.toFixed(3)}</code> · alpha ceiling <code>${shadowAlphaCeilValue.toFixed(3)}</code><br>` +
      `Core boost: <code>${coreBoostEnabled ? "on" : "off"}</code> · threshold <code>${coreThresholdValue.toFixed(3)}</code> · floor <code>${coreFloorValue.toFixed(3)}</code><br>` +
      `One-sided boost: <code>${unionBoostEnabled ? "on" : "off"}</code> · threshold <code>${unionThresholdValue.toFixed(3)}</code> · similarity <code>${unionSimilarityValue.toFixed(3)}</code> · floor <code>${unionFloorValue.toFixed(3)}</code><br>` +
      `Alpha median cleanup: <code>${alphaMedianEnabled ? "on" : "off"}</code> · kernel <code>${alphaMedianKernelValue * 2 + 1}×${alphaMedianKernelValue * 2 + 1}</code> · passes <code>${alphaMedianPassesValue}</code> · strength <code>${alphaMedianBlendValue.toFixed(3)}</code><br>` +
      `Dual background veto: <code>${bgVetoEnabled ? "on" : "off"}</code> · tolerance <code>${bgVetoToleranceValue.toFixed(3)}</code> · low-alpha-only <code>${bgVetoLowAlphaOnlyEnabled ? "on" : "off"}</code> · alpha ceiling <code>${bgVetoAlphaCeilValue.toFixed(3)}</code><br>` +
      `Paint layer: <code>${paintEnabled.checked ? "enabled" : "disabled"}</code> · mode <code>${paintMode.value}</code> · size <code>${paintSize.value}</code> · target <code>${paintTarget ? Number(paintTarget.value).toFixed(3) : "1.000"}</code> · mask <code>${paintTouched ? "present" : "empty"}</code><br>` +
      `Dark rescue: <code>${darkRescueEnabled ? "on" : "off"}</code> · threshold <code>${darkThresholdValue.toFixed(3)}</code> · boost <code>${darkBoostValue.toFixed(3)}</code><br>` +
      `In the <b>Core mask</b> tab bright areas are intersection confidence, blue is union confidence, green means one-sided boost passed, red means shadow suppression candidate, yellow means dual-background-veto candidate.<br>` +
      `In the <b>Mismatch overlay</b> tab red highlights show areas where the images differ by more than the background.` +
      `</div>`;

    meta.innerHTML =
      `Output size: <code>${resultCanvas.width}×${resultCanvas.height}</code>${cropInfo.applied ? ` (cropped from ${cropInfo.originalWidth}×${cropInfo.originalHeight})` : ``}<br>` +
      `A: <code>${prepared.sourceA.label}</code>, B: <code>${prepared.sourceB.label}</code><br>` +
      `bgA: <code>${bgA.map(v => v.toFixed(4)).join(", ")}</code> · ${floatsToHex(bgA)}<br>` +
      `bgB: <code>${bgB.map(v => v.toFixed(4)).join(", ")}</code> · ${floatsToHex(bgB)}<br>` +
      `alpha low/high: <code>${alphaLow.toFixed(3)} / ${alphaHigh.toFixed(3)}</code><br>` +
      `solidify above: <code>${solidAlpha.toFixed(3)}</code><br>` +
      `final RGB mode: <code>${rgbMode ? rgbMode.value : "average"}</code><br>` +
      `desaturate result: <code>${desat.toFixed(3)}</code><br>` +
      `experimental: linear <code>${useLinear ? "on" : "off"}</code> · alpha method <code>${alphaMethodValue}</code><br>` +
      `shadow suppression: <code>${shadowSuppressEnabled ? "on" : "off"}</code> · threshold <code>${shadowThresholdValue.toFixed(3)}</code> · bg tolerance <code>${shadowBgToleranceValue.toFixed(3)}</code> · min luma <code>${shadowMinLumaValue.toFixed(3)}</code> · alpha ceiling <code>${shadowAlphaCeilValue.toFixed(3)}</code><br>` +
      `core boost: <code>${coreBoostEnabled ? "on" : "off"}</code> · threshold <code>${coreThresholdValue.toFixed(3)}</code> · floor <code>${coreFloorValue.toFixed(3)}</code><br>` +
      `one-sided boost: <code>${unionBoostEnabled ? "on" : "off"}</code> · threshold <code>${unionThresholdValue.toFixed(3)}</code> · similarity <code>${unionSimilarityValue.toFixed(3)}</code> · floor <code>${unionFloorValue.toFixed(3)}</code><br>` +
      `alpha median cleanup: <code>${alphaMedianEnabled ? "on" : "off"}</code> · kernel <code>${alphaMedianKernelValue * 2 + 1}×${alphaMedianKernelValue * 2 + 1}</code> · passes <code>${alphaMedianPassesValue}</code> · strength <code>${alphaMedianBlendValue.toFixed(3)}</code><br>` +
      `dual background veto: <code>${bgVetoEnabled ? "on" : "off"}</code> · tolerance <code>${bgVetoToleranceValue.toFixed(3)}</code> · low-alpha-only <code>${bgVetoLowAlphaOnlyEnabled ? "on" : "off"}</code> · alpha ceiling <code>${bgVetoAlphaCeilValue.toFixed(3)}</code><br>` +
      `dark rescue: <code>${darkRescueEnabled ? "on" : "off"}</code> · threshold <code>${darkThresholdValue.toFixed(3)}</code> · boost <code>${darkBoostValue.toFixed(3)}</code><br>` +
      `crop mode: <code>${cropModeValue}</code> · threshold <code>${cropThresholdValue.toFixed(3)}</code> · padding <code>${cropPaddingValue}</code><br>` +
      `offsets: A <code>(${aox}, ${aoy})</code>, B <code>(${box}, ${boy})</code>`;

    setStatus(
      cropInfo.applied
        ? `Done. PNG built and cropped: ${cropInfo.originalWidth}×${cropInfo.originalHeight} → ${cropInfo.croppedWidth}×${cropInfo.croppedHeight}.`
        : "Done. PNG was built locally in the browser.",
      "ok"
    );
    renderViewer({ preserveScroll: false });
  } catch (error) {
    console.error(error);
    setStatus(String(error && error.message ? error.message : error), "err");
  } finally {
    processBtn.disabled = false;
  }
}



function getViewerZoomValue() {
  if (!viewerZoom || viewerZoom.value === "fit") return "fit";
  const value = Number(viewerZoom.value);
  return Number.isFinite(value) && value > 0 ? value : "fit";
}

function applyViewerZoom(canvas, preserveScroll = false) {
  if (!canvas) return;

  const stage = canvas.closest(".viewerStage");
  if (!stage) return;

  const zoom = getViewerZoomValue();
  const source = getCanvasSourceSize(canvas);
  const oldScrollLeft = viewer.scrollLeft;
  const oldScrollTop = viewer.scrollTop;

  canvas.style.width = `${source.width}px`;
  canvas.style.height = `${source.height}px`;
  canvas.style.left = "0px";
  canvas.style.top = "0px";

  if (zoom === "fit") {
    viewer.classList.remove("zoomed");

    const vw = Math.max(1, viewer.clientWidth);
    const vh = Math.max(1, viewer.clientHeight);
    const scale = Math.min(1, vw / source.width, vh / source.height);
    const cssW = Math.max(1, Math.floor(source.width * scale));
    const cssH = Math.max(1, Math.floor(source.height * scale));

    stage.style.width = `${cssW}px`;
    stage.style.height = `${cssH}px`;
    canvas.style.transform = `scale(${scale})`;

    viewer.scrollLeft = 0;
    viewer.scrollTop = 0;

    requestAnimationFrame(() => {
      if (!viewer.contains(canvas) || getViewerZoomValue() !== "fit") return;
      applyViewerZoom(canvas, false);
      refreshBrushPreview();
    });
    return;
  }

  viewer.classList.add("zoomed");

  const cssW = Math.max(1, Math.round(source.width * zoom));
  const cssH = Math.max(1, Math.round(source.height * zoom));
  stage.style.width = `${cssW}px`;
  stage.style.height = `${cssH}px`;
  canvas.style.transform = `scale(${zoom})`;

  if (preserveScroll) {
    viewer.scrollLeft = oldScrollLeft;
    viewer.scrollTop = oldScrollTop;
  } else {
    viewer.scrollLeft = 0;
    viewer.scrollTop = 0;
  }

  requestAnimationFrame(() => {
    if (!viewer.contains(canvas) || getViewerZoomValue() === "fit") return;
    if (preserveScroll) {
      viewer.scrollLeft = oldScrollLeft;
      viewer.scrollTop = oldScrollTop;
    } else {
      viewer.scrollLeft = 0;
      viewer.scrollTop = 0;
    }
    refreshBrushPreview();
  });
}

function zoomPreviewByStep(direction, anchorEvent = null) {
  const values = ["fit", "1", "2", "4", "8"];
  let index = values.indexOf(viewerZoom.value);
  if (index < 0) index = 0;

  if (direction > 0) index = Math.min(values.length - 1, index + 1);
  else index = Math.max(0, index - 1);

  if (viewerZoom.value === values[index]) return;

  let anchor = null;
  const canvas = viewer.querySelector(".viewerStage canvas") || viewer.querySelector("canvas");
  if (anchorEvent && canvas) {
    const rect = canvas.getBoundingClientRect();
    if (
      anchorEvent.clientX >= rect.left &&
      anchorEvent.clientX <= rect.right &&
      anchorEvent.clientY >= rect.top &&
      anchorEvent.clientY <= rect.bottom
    ) {
      anchor = {
        rx: (anchorEvent.clientX - rect.left) / rect.width,
        ry: (anchorEvent.clientY - rect.top) / rect.height,
        dx: anchorEvent.clientX - viewer.getBoundingClientRect().left,
        dy: anchorEvent.clientY - viewer.getBoundingClientRect().top
      };
    }
  }

  viewerZoom.value = values[index];
  renderViewer({ preserveScroll: false });

  if (anchor && viewer.classList.contains("zoomed")) {
    const after = viewer.querySelector(".viewerStage canvas") || viewer.querySelector("canvas");
    if (after) {
      const targetX = anchor.rx * after.getBoundingClientRect().width;
      const targetY = anchor.ry * after.getBoundingClientRect().height;
      viewer.scrollLeft = Math.max(0, targetX - anchor.dx);
      viewer.scrollTop = Math.max(0, targetY - anchor.dy);
    }
  }
}

function getCanvasToShowForCurrentView() {
  let canvasToShow = resultCanvas;
  if (currentView === "alpha") canvasToShow = alphaCanvas;
  if (currentView === "coremask") canvasToShow = coreCanvas;
  if (currentView === "cropbox") canvasToShow = cropBoxCanvas || resultCanvas;
  if (currentView === "mismatch") canvasToShow = mismatchCanvas;
  return canvasToShow;
}

function shouldUsePaintDisplayCopy(canvasToShow) {
  return !!(
    canvasToShow &&
    ["checker", "dark", "light", "alpha"].includes(currentView) &&
    (paintTouched || paintEnabled.checked)
  );
}

function tagDisplayCanvas(canvas, sourceCanvas) {
  if (!canvas || !sourceCanvas) return canvas;
  canvas.dataset.sourceWidth = String(sourceCanvas.width);
  canvas.dataset.sourceHeight = String(sourceCanvas.height);
  return canvas;
}

function createViewerStage(canvas) {
  const stage = document.createElement("div");
  stage.className = "viewerStage";
  stage.appendChild(canvas);
  return stage;
}

function makeDisplayCanvasForCurrentView(canvasToShow) {
  if (!canvasToShow) return null;

  if (
    shouldUsePaintDisplayCopy(canvasToShow) &&
    (!paintMaskCanvas || paintMaskCanvas.width === canvasToShow.width && paintMaskCanvas.height === canvasToShow.height)
  ) {
    return tagDisplayCanvas(buildPaintOverlayPreviewCanvas(canvasToShow), canvasToShow);
  }

  return tagDisplayCanvas(canvasToShow, canvasToShow);
}

function refreshCurrentViewerCanvasAfterPaint() {
  const displayed = viewer.querySelector("canvas");
  const source = getCanvasToShowForCurrentView();

  if (!displayed || !source) {
    renderViewer({ preserveScroll: true });
    return;
  }

  const nextDisplay = makeDisplayCanvasForCurrentView(source);

  // If the currently displayed node is also the source canvas, do not draw an overlay into it.
  // That would be the fun kind of bug where the preview edits the data it is previewing.
  if (!nextDisplay || displayed === source) {
    renderViewer({ preserveScroll: true });
    return;
  }

  const keepStyleWidth = displayed.style.width;
  const keepStyleHeight = displayed.style.height;
  const keepTransform = displayed.style.transform;
  const keepScrollLeft = viewer.scrollLeft;
  const keepScrollTop = viewer.scrollTop;

  displayed.width = nextDisplay.width;
  displayed.height = nextDisplay.height;
  tagDisplayCanvas(displayed, source);
  if (keepStyleWidth) displayed.style.width = keepStyleWidth;
  if (keepStyleHeight) displayed.style.height = keepStyleHeight;
  if (keepTransform) displayed.style.transform = keepTransform;

  const ctx = displayed.getContext("2d", { colorSpace: "srgb" });
  ctx.clearRect(0, 0, displayed.width, displayed.height);
  ctx.drawImage(nextDisplay, 0, 0);

  viewer.scrollLeft = keepScrollLeft;
  viewer.scrollTop = keepScrollTop;
  updatePaintViewerClass();
  refreshBrushPreview();
}

function renderViewer(options = {}) {
  const oldWasZoomed = viewer.classList.contains("zoomed");
  const preserveScroll = options.preserveScroll ?? (oldWasZoomed && getViewerZoomValue() !== "fit");

  viewer.innerHTML = "";
  viewer.className = "viewer";
  if (currentView === "dark") viewer.classList.add("dark");
  if (currentView === "light") viewer.classList.add("light");
  if (currentView === "mismatch") viewer.classList.add("diff");

  const canvasToShow = getCanvasToShowForCurrentView();

  if (!canvasToShow) {
    viewer.classList.add("empty");
    updatePaintViewerClass();
    return;
  }

  const displayCanvas = makeDisplayCanvasForCurrentView(canvasToShow);
  const stage = createViewerStage(displayCanvas);

  viewer.appendChild(stage);
  applyViewerZoom(displayCanvas, preserveScroll);
  if (!document.body.contains(brushPreviewEl)) {
    document.body.appendChild(brushPreviewEl);
  }
  updatePaintViewerClass();
  requestAnimationFrame(() => {
    refreshBrushPreview();
  });
}

viewerZoom.addEventListener("change", () => {
  renderViewer({ preserveScroll: false });
});

viewer.addEventListener("wheel", event => {
  if (!resultCanvas || isPaintingAlpha || isViewerPanning) return;

  // Ctrl+wheel zooms. Plain wheel remains normal scrolling when zoomed,
  // because fighting scrollbars is how tools become punishment.
  if (!event.ctrlKey) return;

  event.preventDefault();
  zoomPreviewByStep(event.deltaY < 0 ? 1 : -1, event);
}, { passive: false });

processBtn.addEventListener("click", processImages);

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentView = tab.dataset.view;
    renderViewer({ preserveScroll: false });
  });
});


function setupLeftTabs() {
  const buttons = Array.from(document.querySelectorAll(".leftTab"));
  const panes = Array.from(document.querySelectorAll(".leftPane"));

  function activate(key) {
    buttons.forEach(btn => btn.classList.toggle("active", btn.dataset.leftTab === key));
    panes.forEach(pane => pane.classList.toggle("active", pane.dataset.leftPane === key));
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => activate(btn.dataset.leftTab));
  });

  activate("input");
}


const samplesPanel = document.getElementById("samplesPanel");
const samplesList = document.getElementById("samplesList");
const samplesHint = document.getElementById("samplesHint");

function clearTwoInputsUi() {
  resetPersistentPaintLayer(false);
  inputA.value = "";
  inputB.value = "";
  bitmapA = null;
  bitmapB = null;
  renderMini(miniA, null, "image A");
  renderMini(miniB, null, "image B");
  updateFileLabel(inputA, fileNameA, "No file");
  updateFileLabel(inputB, fileNameB, "No file");
}

function clearSplitInputUi() {
  resetPersistentPaintLayer(false);
  inputSplit.value = "";
  bitmapSplit = null;
  renderMini(miniSplit, null, "split image");
  updateFileLabel(inputSplit, fileNameSplit, "No file");
}

function fileNameFromUrl(url) {
  try {
    const clean = url.split("?")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || "sample.png";
  } catch {
    return "sample.png";
  }
}

function setInputFile(input, file) {
  const dt = new DataTransfer();
  if (file) dt.items.add(file);
  input.files = dt.files;
}

async function loadRemoteFile(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const blob = await response.blob();
  return new File([blob], fileNameFromUrl(url), { type: blob.type || "image/png" });
}

function normalizeSampleMode(sample) {
  if (sample.mode === "split" || sample.split || sample.file) return "split";
  return "two";
}

function sampleImageUrls(sample) {
  if (normalizeSampleMode(sample) === "split") return [sample.split || sample.file].filter(Boolean);
  return [sample.sourceA, sample.sourceB].filter(Boolean);
}

function describeSample(sample) {
  const mode = normalizeSampleMode(sample);
  if (mode === "split") {
    return `Mode: split<br><code>${sample.split || sample.file || ""}</code>`;
  }
  return `Mode: two<br><code>${sample.sourceA || ""}</code><br><code>${sample.sourceB || ""}</code>`;
}

function makeSampleThumb(url, label) {
  const wrap = document.createElement("div");
  wrap.className = "sampleThumb";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  img.alt = label || url;
  img.src = url;
  img.onerror = () => {
    wrap.classList.add("broken");
    wrap.textContent = "missing";
  };

  wrap.appendChild(img);
  return wrap;
}

function makeSampleButton(sample) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sampleBtn";

  const thumbs = document.createElement("div");
  thumbs.className = "sampleThumbs";
  const urls = sampleImageUrls(sample);
  urls.forEach((url, index) => thumbs.appendChild(makeSampleThumb(url, `${sample.label || sample.name || "sample"} ${index + 1}`)));

  const title = document.createElement("div");
  title.className = "sampleTitle";
  title.textContent = sample.label || sample.name || "Unnamed sample";

  const meta = document.createElement("div");
  meta.className = "sampleMeta";
  meta.innerHTML = describeSample(sample);

  btn.appendChild(thumbs);
  btn.appendChild(title);
  btn.appendChild(meta);

  btn.addEventListener("click", async () => {
    try {
      setStatus("Loading sample...", "");
      invalidateResult();

      if (normalizeSampleMode(sample) === "split") {
        modeSelect.value = "split";
        updateModeUi();
        clearTwoInputsUi();

        if (sample.orientation && ["auto", "vertical", "horizontal"].includes(sample.orientation)) {
          splitOrientation.value = sample.orientation;
        }

        const file = await loadRemoteFile(sample.split || sample.file);
        setInputFile(inputSplit, file);
        updateFileLabel(inputSplit, fileNameSplit, file.name);
        bitmapSplit = await loadBitmapFromFile(file);
        renderMini(miniSplit, bitmapSplit, "split image");
      } else {
        modeSelect.value = "two";
        updateModeUi();
        clearSplitInputUi();

        const [fileA, fileB] = await Promise.all([
          loadRemoteFile(sample.sourceA),
          loadRemoteFile(sample.sourceB)
        ]);

        setInputFile(inputA, fileA);
        setInputFile(inputB, fileB);
        updateFileLabel(inputA, fileNameA, fileA.name);
        updateFileLabel(inputB, fileNameB, fileB.name);

        bitmapA = await loadBitmapFromFile(fileA);
        bitmapB = await loadBitmapFromFile(fileB);
        renderMini(miniA, bitmapA, "image A");
        renderMini(miniB, bitmapB, "image B");
      }

      await refreshPreparedSources(true);
      setStatus(`Sample loaded: ${sample.label || sample.name || "Unnamed sample"}`, "ok");
    } catch (err) {
      console.error("[samples] failed to load sample image", err);
      setStatus("Failed to load sample image. Check DevTools → Console and Network.", "bad");
    }
  });

  return btn;
}

function extractSamples(data) {
  return Array.isArray(data) ? data : (Array.isArray(data.samples) ? data.samples : []);
}

function renderSamples(data, sourceLabel) {
  const samples = extractSamples(data);
  samplesList.innerHTML = "";

  if (!samples.length) {
    samplesPanel.classList.add("hidden");
    return false;
  }

  let validCount = 0;

  for (const sample of samples) {
    const mode = normalizeSampleMode(sample);
    const validTwo = mode === "two" && sample.sourceA && sample.sourceB;
    const validSplit = mode === "split" && (sample.split || sample.file);

    if (!validTwo && !validSplit) {
      console.warn("[samples] skipped invalid sample", sample);
      continue;
    }

    samplesList.appendChild(makeSampleButton(sample));
    validCount++;
  }

  if (!validCount) {
    samplesPanel.classList.add("hidden");
    return false;
  }

  samplesPanel.querySelector(".head").textContent = `Sample inputs (${sourceLabel})`;
  samplesPanel.classList.remove("hidden");
  return true;
}

async function initSamplesPanel() {
  if (!samplesPanel || !samplesList) return;

  try {
    const response = await fetch("samples.json", { cache: "no-store" });

    if (!response.ok) {
      console.info("[samples] samples.json not found, hiding panel", response.status);
      samplesPanel.classList.add("hidden");
      return;
    }

    const data = await response.json();
    console.info("[samples] loaded samples.json", data);
    window.__samplesDebug = { fileName: "samples.json", data, errors: [] };
    renderSamples(data, "samples.json");
  } catch (err) {
    window.__samplesDebug = { fileName: null, data: null, errors: [err.message || String(err)] };
    console.warn("[samples] failed to load samples.json", err);
    samplesPanel.classList.add("hidden");
  }
}

setupLeftTabs();

refreshPreparedSources(true);
initSamplesPanel();
