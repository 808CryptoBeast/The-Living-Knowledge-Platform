import * as THREE from "three";
import { OrbitControls }   from "three/addons/controls/OrbitControls.js";
import { EffectComposer }  from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass }      from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// ─────────────────────────────────────────────────────────────────────────────
// THE LIVING KNOWLEDGE PLATFORM — Galaxy Knowledge Universe
//
// FIX: Circular clip mask added to makeGoldCompassTexture() to remove the
// "Nainoa's Hawaiian Starcompass @ with english and numerical equivalent in
// degrees" caption that sits outside the circular compass boundary at the
// top/bottom edges of the source image.
// ─────────────────────────────────────────────────────────────────────────────

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getIsMobile() {
  return window.innerWidth <= 760 || window.matchMedia("(pointer: coarse)").matches;
}

let IS_MOBILE = getIsMobile();

function getSafePixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  return Math.min(dpr, IS_MOBILE ? 1.35 : 2);
}

function assetUrl(path) {
  return new URL(path, document.baseURI).href;
}

const ASSET_CANDIDATES = {
  kanaka: [
    "LKP/assets/images/kanaka.png",
    "assets/HI/kanaka.png",
    "assets/HI/kanaka-maoli.png"
  ],

  kemet: [
    "LKP/assets/images/kemet.png",
    "assets/images/kemet.png",
    "assets/k/kemet.png",
    "assets/k/kemet-icon.png"
  ],

  bridge: [
    "LKP/assets/images/bridge-culture.png",
    "LKP/assets/images/Culturalverse-icon.png",
    "assets/images/bridge-culture.png"
  ],

  dogon: [
    "LKP/assets/images/br-skyknowledge.png",
    "LKP/assets/images/cosmic-weave.png",
    "assets/images/br-skyknowledge.png"
  ],

  vedic: [
    "LKP/assets/images/bridge-word-creation.png",
    "LKP/assets/images/cosmic-weave.png",
    "assets/images/bridge-word-creation.png"
  ],

  dreamtime: [
    "LKP/assets/images/bridge-darkness.png",
    "LKP/assets/images/cosmic-weave.png",
    "assets/images/bridge-darkness.png"
  ],

  compass: [
    "LKP/assets/images/hawaiian-star-compass.jpg",
    "assets/HI/hawaiian-star-compass.jpg",
    "assets/hawaiian-star-compass.jpg",
    "assets/images/hawaiian-star-compass.jpeg",
    "assets/HI/hawaiian-star-compass.jpeg",
    "assets/hawaiian-star-compass.jpeg",
    "assets/images/hawaiian-star-compass.png",
    "assets/HI/hawaiian-star-compass.png",
    "assets/hawaiian-star-compass.png"
  ],

  iwa: [
    "LKP/assets/images/iwa-middle.png",
    "assets/HI/iwa-middle.png",
    "assets/HI/iwa.png",
    "assets/images/iwa.png"
  ],

  alohaCompare: [
    "assets/HI/aloha-comparison.jpg",
    "assets/HI/aloha-comparison.jpeg",
    "assets/HI/aloha-comparison.png",
    "assets/HI/aloha-compare.jpg",
    "assets/HI/aloha-compare.jpeg",
    "assets/HI/aloha-compare.png",
    "assets/HI/aloha-maat-comparison.jpg",
    "assets/HI/aloha-maat-comparison.jpeg",
    "assets/HI/aloha-maat-comparison.png",
    "assets/HI/aloha-maat-aloha.jpg",
    "assets/HI/aloha-maat-aloha.jpeg",
    "assets/HI/aloha-maat-aloha.png",
    "assets/HI/aloha.jpg",
    "assets/HI/aloha.jpeg",
    "assets/HI/aloha.png"
  ],

  maatCompare: [
    "assets/k/maat-comparison.jpg",
    "assets/k/maat-comparison.jpeg",
    "assets/k/maat-comparison.png",
    "assets/k/maat-compare.jpg",
    "assets/k/maat-compare.jpeg",
    "assets/k/maat-compare.png",
    "assets/k/aloha-maat-comparison.jpg",
    "assets/k/aloha-maat-comparison.jpeg",
    "assets/k/aloha-maat-comparison.png",
    "assets/k/aloha-maat-maat.jpg",
    "assets/k/aloha-maat-maat.jpeg",
    "assets/k/aloha-maat-maat.png",
    "assets/k/maat.jpg",
    "assets/k/maat.jpeg",
    "assets/k/maat.png"
  ]
};

const loadedImages = {};
const loadedImageUrls = {};

function loadImageFromUrl(key, url) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      loadedImages[key] = img;
      loadedImageUrls[key] = url;
      console.log(`[LKP] Loaded image "${key}":`, url);
      resolve(img);
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = url;
  });
}

async function loadImageFromCandidates(key, paths) {
  for (const path of paths) {
    const url = assetUrl(path);
    const img = await loadImageFromUrl(key, url);

    if (img) return img;
  }

  console.warn(`[LKP] Could not load image for "${key}". Tried:`, paths);
  return null;
}

async function preloadImages() {
  await Promise.allSettled(
    Object.entries(ASSET_CANDIDATES).map(([key, paths]) =>
      loadImageFromCandidates(key, paths)
    )
  );

  window.LKP_LOADED_IMAGES = loadedImages;
  window.LKP_LOADED_IMAGE_URLS = loadedImageUrls;

  window.dispatchEvent(
    new CustomEvent("lkp:images-ready", {
      detail: {
        images: loadedImages,
        urls: loadedImageUrls
      }
    })
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE / TEXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function makeTextureFromImage(imgEl) {
  const texture = new THREE.Texture(imgEl);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function canvasToTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  if (renderer?.capabilities?.getMaxAnisotropy) {
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  }

  return texture;
}

function removeWhiteBg(imgEl, threshold = 238, tolerance = 34) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const w = imgEl.naturalWidth || imgEl.width || 512;
  const h = imgEl.naturalHeight || imgEl.height || 512;

  canvas.width = w;
  canvas.height = h;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(imgEl, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min;

    const isWhiteLike =
      r >= threshold &&
      g >= threshold &&
      b >= threshold &&
      saturation <= tolerance;

    if (isWhiteLike) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvasToTexture(canvas);
}

// ─────────────────────────────────────────────────────────────────────────────
// GOLD COMPASS TEXTURE
// Removes white background, converts all compass artwork to gold.
//
// CAPTION FIX: The image is portrait — the compass circle fills the WIDTH
// and the caption text ("Nainoa's Hawaiian Starcompass...") sits in the
// EXTRA HEIGHT above/below. Using Math.min (crop to square) instead of
// Math.max (pad to square) automatically excludes the caption strips
// without ever needing to cut into the compass artwork itself.
// A soft 0.488 clip then just rounds the square corners cleanly.
// ─────────────────────────────────────────────────────────────────────────────

// Hawaiian star compass image processor.
//
// APPROACH: warm parchment face with bright gold text.
// The compass JPG is a printed document scan — "black" text is lum 0.05-0.45
// in a JPEG (compression + scanning lifts blacks). We preserve the face as
// a warm amber parchment, make text/lines bright gold, and remove only the
// truly white paper edges (lum >= 0.76).
//
// Caption removal: Math.min crops to the shorter dimension (portrait images
// have caption in extra height). Circular clip at 0.468 then removes any
// caption text that sits below the compass circle boundary.
function makeGoldCompassTexture(imgEl) {
  const sourceW = imgEl.naturalWidth  || imgEl.width  || 1024;
  const sourceH = imgEl.naturalHeight || imgEl.height || 1024;

  // Crop to shorter dimension — excludes portrait caption strips.
  const size = Math.min(sourceW, sourceH);
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = canvas.height = size;

  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Centre-crop from source.
  const sx = (sourceW - size) / 2;
  const sy = (sourceH - size) / 2;
  ctx.drawImage(imgEl, sx, sy, size, size, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data      = imageData.data;

  // ── Gold palette ────────────────────────────────────────────────────────
  // Three tiers: bright (ink/text), mid (compass lines), deep (shadow).
  // These are brighter than doc-4 originals so text pops on the parchment.
  const goldBright = { r: 255, g: 235, b: 148 };  // very bright warm gold (text)
  const goldMid    = { r: 228, g: 175, b: 64  };  // standard gold (lines)
  const goldDeep   = { r: 148, g: 100, b: 22  };  // deep amber (heavy ink)
  const goldPaper  = { r: 210, g: 158, b: 52  };  // warm parchment (light fills)

  let visiblePixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a === 0) continue;

    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat  = maxC - minC;
    const lum  = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    // ── Fully transparent: very white paper / background ──────────────────
    // Threshold at 0.76 — same as working doc-4 version.
    const isWhitePaper = lum >= 0.76 && sat <= 42 && r >= 185 && g >= 185 && b >= 185;
    if (isWhitePaper) { data[i+3] = 0; continue; }

    // ── Halo fade: anti-alias pixels around lines ─────────────────────────
    const isHalo = lum >= 0.66 && sat <= 55 && r >= 165 && g >= 165 && b >= 165;
    if (isHalo) {
      const fade = THREE.MathUtils.clamp((lum - 0.66) / 0.12, 0, 1);
      data[i+3] = Math.round(a * (1 - fade));
      if (data[i+3] <= 4) { data[i+3] = 0; continue; }
    }

    // ── Gold conversion ───────────────────────────────────────────────────
    // lum < 0.20 → very dark ink (text, ʻiwa bird, thick lines) → bright gold
    // lum 0.20-0.45 → medium ink (compass spokes, degree marks) → mid gold
    // lum 0.45-0.66 → light fills / parchment tones → warm amber
    const ink       = THREE.MathUtils.clamp((0.88 - lum) / 0.70, 0.18, 1);
    const edgeBoost = THREE.MathUtils.clamp((sat - 10) / 88, 0, 0.24);
    const strength  = THREE.MathUtils.clamp(ink + edgeBoost, 0.22, 1);
    const mixToHi   = THREE.MathUtils.clamp((lum - 0.18) / 0.52, 0, 1);

    let gR, gG, gB;

    if (lum < 0.20) {
      // Very dark ink → bright gold (high contrast, readable text)
      const t = THREE.MathUtils.clamp(1 - lum / 0.20, 0, 1);
      gR = Math.round(goldMid.r + (goldBright.r - goldMid.r) * t);
      gG = Math.round(goldMid.g + (goldBright.g - goldMid.g) * t);
      gB = Math.round(goldMid.b + (goldBright.b - goldMid.b) * t);
    } else if (lum < 0.45) {
      // Medium ink → mid gold
      const t = THREE.MathUtils.clamp(1 - (lum - 0.20) / 0.25, 0, 1);
      gR = Math.round(goldPaper.r + (goldMid.r - goldPaper.r) * t);
      gG = Math.round(goldPaper.g + (goldMid.g - goldPaper.g) * t);
      gB = Math.round(goldPaper.b + (goldMid.b - goldPaper.b) * t);
    } else {
      // Light fills / parchment → warm amber
      gR = goldPaper.r;
      gG = goldPaper.g;
      gB = goldPaper.b;
    }

    data[i]   = gR;
    data[i+1] = gG;
    data[i+2] = gB;

    // Alpha: dark ink fully opaque; parchment area semi-transparent.
    // Minimum 0.22 preserved from doc-4 so face area remains visible.
    const alphaStr = THREE.MathUtils.clamp((0.92 - lum) / 0.58, 0.22, 1);

    // Boost: text pixels (lum < 0.20) get extra opacity to ensure readability.
    const alphaBoost = lum < 0.20 ? THREE.MathUtils.clamp(1 - lum / 0.20, 0, 0.25) : 0;
    data[i+3] = Math.round(Math.max(data[i+3], 255 * (alphaStr + alphaBoost)));

    visiblePixels++;
  }

  ctx.putImageData(imageData, 0, 0);

  // ── Gold glow pass ────────────────────────────────────────────────────────
  const glowCanvas = document.createElement("canvas");
  const glowCtx    = glowCanvas.getContext("2d");
  glowCanvas.width = glowCanvas.height = size;
  glowCtx.clearRect(0, 0, size, size);
  glowCtx.drawImage(canvas, 0, 0);
  glowCtx.globalCompositeOperation = "source-in";
  glowCtx.fillStyle = "rgba(255, 204, 86, 0.72)";
  glowCtx.fillRect(0, 0, size, size);

  const outCanvas = document.createElement("canvas");
  const outCtx    = outCanvas.getContext("2d");
  outCanvas.width = outCanvas.height = size;
  outCtx.clearRect(0, 0, size, size);
  outCtx.filter      = "blur(1.15px)";
  outCtx.globalAlpha = 0.42;
  outCtx.drawImage(glowCanvas, 0, 0);
  outCtx.filter      = "none";
  outCtx.globalAlpha = 1;
  outCtx.drawImage(canvas, 0, 0);

  // ── Sanity ────────────────────────────────────────────────────────────────
  const visibleRatio = visiblePixels / Math.max(1, size * size);
  if (visibleRatio < 0.001) {
    console.warn("[LKP] Compass texture: too little survived, using original.");
    return makeTextureFromImage(imgEl);
  }

  // ── Circular clip at 0.468 ────────────────────────────────────────────────
  // Keeps the full compass circle (outer text ring is at ~0.46 radius).
  // Caption text outside the compass circle → already white → transparent.
  // This clip is a hard clean boundary for the compass edge.
  const clipCanvas = document.createElement("canvas");
  const clipCtx    = clipCanvas.getContext("2d");
  clipCanvas.width = clipCanvas.height = size;

  clipCtx.clearRect(0, 0, size, size);
  clipCtx.save();
  clipCtx.beginPath();
  clipCtx.arc(size / 2, size / 2, size * 0.468, 0, Math.PI * 2);
  clipCtx.closePath();
  clipCtx.clip();
  clipCtx.drawImage(outCanvas, 0, 0);

  // Specular highlight baked in (lit from upper-left for dome effect).
  const specGrd = clipCtx.createRadialGradient(
    size * 0.32, size * 0.26, 0,
    size * 0.50, size * 0.50, size * 0.468
  );
  specGrd.addColorStop(0,    "rgba(255, 245, 195, 0.24)");
  specGrd.addColorStop(0.28, "rgba(255, 225, 130, 0.10)");
  specGrd.addColorStop(0.65, "rgba(40,   25,   0, 0.03)");
  specGrd.addColorStop(1,    "rgba(0,     0,   0, 0.28)");

  clipCtx.globalCompositeOperation = "source-atop";
  clipCtx.fillStyle = specGrd;
  clipCtx.fillRect(0, 0, size, size);
  clipCtx.restore();

  console.log("[LKP] Compass texture ok — visRatio:", visibleRatio.toFixed(4),
    "src:", sourceW + "x" + sourceH, "crop:", size + "x" + size);

  return canvasToTexture(clipCanvas);
}

function makeGlowTex(r, g, b, peak, size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;

  const ctx = c.getContext("2d");
  const grd = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );

  grd.addColorStop(0,    `rgba(${r},${g},${b},${peak})`);
  grd.addColorStop(0.42, `rgba(${r},${g},${b},${(peak * 0.42).toFixed(3)})`);
  grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeLabelTex(text, hexColor, fontSize = "13px", bold = false) {
  const W = IS_MOBILE ? 280 : 320;
  const H = IS_MOBILE ? 48 : 52;

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;

  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  ctx.shadowColor = hexColor;
  ctx.shadowBlur = IS_MOBILE ? 8 : 12;
  ctx.fillStyle = hexColor;
  ctx.font = `${bold ? "700" : "400"} ${fontSize} 'DM Sans','Lora',serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.94;
  ctx.fillText(text, W / 2, H / 2);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDERER
// ─────────────────────────────────────────────────────────────────────────────

const canvas = document.getElementById("lkp-canvas");

if (!canvas) {
  throw new Error("[LKP] #lkp-canvas not found");
}

canvas.style.touchAction = "none";

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: !IS_MOBILE,
  powerPreference: "high-performance",
  alpha: false
});

renderer.setPixelRatio(getSafePixelRatio());
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = IS_MOBILE ? 1.02 : 1.08;
renderer.setClearColor(0x01030a);

const miniViewerCanvas = document.getElementById("lkp-mini-viewer-canvas");
const miniToggleBtn = document.getElementById("lkp-mini-toggle");
const miniZoomInBtn = document.getElementById("lkp-mini-zoom-in");
const miniZoomOutBtn = document.getElementById("lkp-mini-zoom-out");
const miniResetBtn = document.getElementById("lkp-mini-reset");
const miniFullscreenBtn = document.getElementById("lkp-mini-fullscreen");
const mobileViewerEl = document.getElementById("lkp-mobile-viewer");
const mobileViewerCanvas = document.getElementById("lkp-mobile-viewer-canvas");
const mobileViewerCloseBtn = document.getElementById("lkp-mobile-viewer-close");
const mobileViewerHelpOpenBtn = document.getElementById("lkp-mobile-viewer-help-open");
const mobileViewerHelpEl = document.getElementById("lkp-mobile-viewer-help");
const mobileViewerHelpCloseBtn = document.getElementById("lkp-mobile-viewer-help-close");
const mobileViewerHelpNeverBtn = document.getElementById("lkp-mobile-viewer-help-never");
const MOBILE_VIEWER_HELP_KEY = "lkp_mobile_viewer_help_seen_v1";
let miniRenderer = null;
let miniCamera = null;
let miniControls = null;
let mobileRenderer = null;
let mobileCamera = null;
let mobileControls = null;
const miniViewerState = {
  paused: false
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function stepMiniDistance(mult) {
  if (!miniCamera || !miniControls) return;
  const v = miniCamera.position.clone().sub(miniControls.target).multiplyScalar(mult);
  const max = IS_MOBILE ? 150 : 220;
  const min = 1;
  const len = clamp(v.length(), min, max);
  miniCamera.position.copy(miniControls.target).add(v.setLength(len));
}

function stepMobileDistance(mult) {
  if (!mobileCamera || !mobileControls) return;
  const v = mobileCamera.position.clone().sub(mobileControls.target).multiplyScalar(mult);
  const max = IS_MOBILE ? 150 : 220;
  const min = 1;
  const len = clamp(v.length(), min, max);
  mobileCamera.position.copy(mobileControls.target).add(v.setLength(len));
}

function syncMiniButtons() {
  if (miniToggleBtn) {
    miniToggleBtn.textContent = miniViewerState.paused ? "Resume Preview" : "Pause Preview";
    miniToggleBtn.setAttribute("aria-pressed", miniViewerState.paused ? "true" : "false");
  }
}

function setMobileHelpVisible(isVisible) {
  if (!mobileViewerHelpEl) return;

  mobileViewerHelpEl.hidden = !isVisible;
}

function maybeShowMobileHelpOnOpen() {
  try {
    const seen = localStorage.getItem(MOBILE_VIEWER_HELP_KEY) === "1";
    setMobileHelpVisible(!seen);
  } catch {
    setMobileHelpVisible(true);
  }
}

if (miniToggleBtn) {
  miniToggleBtn.addEventListener("click", () => {
    miniViewerState.paused = !miniViewerState.paused;
    syncMiniButtons();
  });
}

if (miniZoomInBtn) miniZoomInBtn.addEventListener("click", () => stepMiniDistance(0.86));
if (miniZoomOutBtn) miniZoomOutBtn.addEventListener("click", () => stepMiniDistance(1.16));
if (miniResetBtn) {
  miniResetBtn.addEventListener("click", () => {
    if (!miniCamera || !miniControls) return;
    miniCamera.position.copy(getOverviewCameraPos());
    miniControls.target.set(0, 0, 0);
    miniControls.update();
  });
}

if (miniFullscreenBtn && mobileViewerEl) {
  miniFullscreenBtn.addEventListener("click", () => {
    mobileViewerEl.classList.add("is-open");
    mobileViewerEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("lkp-mobile-viewer-open");
    maybeShowMobileHelpOnOpen();
    if (mobileCamera && mobileControls) {
      mobileCamera.position.copy(getOverviewCameraPos());
      mobileControls.target.set(0, 0, 0);
      mobileControls.update();
    }
    window.setTimeout(() => resizeAuxViewers(), 30);
  });
}

if (mobileViewerCloseBtn && mobileViewerEl) {
  mobileViewerCloseBtn.addEventListener("click", () => {
    mobileViewerEl.classList.remove("is-open");
    mobileViewerEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lkp-mobile-viewer-open");
    setMobileHelpVisible(false);
  });
}

if (mobileViewerHelpOpenBtn) {
  mobileViewerHelpOpenBtn.addEventListener("click", () => {
    setMobileHelpVisible(true);
  });
}

if (mobileViewerHelpCloseBtn) {
  mobileViewerHelpCloseBtn.addEventListener("click", () => {
    setMobileHelpVisible(false);

    try {
      localStorage.setItem(MOBILE_VIEWER_HELP_KEY, "1");
    } catch {}
  });
}

if (mobileViewerHelpNeverBtn) {
  mobileViewerHelpNeverBtn.addEventListener("click", () => {
    setMobileHelpVisible(false);

    try {
      localStorage.setItem(MOBILE_VIEWER_HELP_KEY, "1");
    } catch {}
  });
}

syncMiniButtons();

function resizeViewport(rendererRef, cameraRef, controlsRef, canvasRef) {
  if (!canvasRef || !rendererRef || !cameraRef) return;

  const rect = canvasRef.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  rendererRef.setPixelRatio(dpr);
  rendererRef.setSize(rect.width, rect.height, false);
  cameraRef.aspect = rect.width / rect.height;
  cameraRef.fov = IS_MOBILE ? 78 : 72;
  cameraRef.updateProjectionMatrix();

  if (controlsRef) {
    controlsRef.zoomSpeed = IS_MOBILE ? 0.42 : 0.55;
    controlsRef.maxDistance = IS_MOBILE ? 150 : 220;
    controlsRef.panSpeed = IS_MOBILE ? 0.34 : 0.48;
    controlsRef.rotateSpeed = IS_MOBILE ? -0.34 : -0.42;
    controlsRef.autoRotateSpeed = IS_MOBILE ? 0.14 : 0.22;
  }
}

function resizeAuxViewers() {
  resizeViewport(miniRenderer, miniCamera, miniControls, miniViewerCanvas);
  if (mobileViewerEl?.classList.contains("is-open")) {
    resizeViewport(mobileRenderer, mobileCamera, mobileControls, mobileViewerCanvas);
  }
}

function resizeMiniViewer() {
  resizeViewport(miniRenderer, miniCamera, miniControls, miniViewerCanvas);
}

function syncMiniViewer() {
  if (!miniRenderer || !miniCamera || !miniControls) return;
  if (miniViewerState.paused) return;
  miniControls.update();
  miniRenderer.render(scene, miniCamera);
}

function syncMobileViewer() {
  if (!mobileRenderer || !mobileCamera || !mobileControls) return;
  if (!mobileViewerEl?.classList.contains("is-open")) return;
  mobileControls.update();
  mobileRenderer.render(scene, mobileCamera);
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE / CAMERA / BLOOM
// ─────────────────────────────────────────────────────────────────────────────

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x01030a, IS_MOBILE ? 0.0055 : 0.004);

const camera = new THREE.PerspectiveCamera(
  IS_MOBILE ? 78 : 72,
  window.innerWidth / window.innerHeight,
  0.1,
  600
);

function getOverviewCameraPos() {
  return IS_MOBILE
    ? new THREE.Vector3(0, 9.5, 44)
    : new THREE.Vector3(0, 11.5, 58);
}

camera.position.copy(getOverviewCameraPos());

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  IS_MOBILE ? 0.42 : 0.80,
  IS_MOBILE ? 0.24 : 0.42,
  IS_MOBILE ? 0.78 : 0.64
);

composer.addPass(bloom);

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLS
// ─────────────────────────────────────────────────────────────────────────────

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = IS_MOBILE ? 0.075 : 0.06;
controls.enablePan = true;
controls.panSpeed = IS_MOBILE ? 0.34 : 0.48;
controls.screenSpacePanning = true;
controls.enableZoom = true;
controls.zoomSpeed = IS_MOBILE ? 0.42 : 0.55;
controls.minDistance = 1;
controls.maxDistance = IS_MOBILE ? 150 : 220;
controls.rotateSpeed = IS_MOBILE ? -0.34 : -0.42;
controls.minPolarAngle = 0.28;
controls.maxPolarAngle = Math.PI * 0.86;
controls.autoRotate = !REDUCED_MOTION;
controls.autoRotateSpeed = IS_MOBILE ? 0.14 : 0.22;
controls.target.set(0, 0, 0);

if (miniViewerCanvas) {
  miniRenderer = new THREE.WebGLRenderer({
    canvas: miniViewerCanvas,
    antialias: !IS_MOBILE,
    powerPreference: "high-performance",
    alpha: false
  });

  miniRenderer.outputColorSpace = THREE.SRGBColorSpace;
  miniRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  miniRenderer.toneMappingExposure = renderer.toneMappingExposure;
  miniRenderer.setClearColor(0x01030a);

  miniCamera = new THREE.PerspectiveCamera(
    IS_MOBILE ? 78 : 72,
    16 / 10,
    0.1,
    600
  );

  miniCamera.position.copy(getOverviewCameraPos());

  miniControls = new OrbitControls(miniCamera, miniRenderer.domElement);
  miniControls.enableDamping = true;
  miniControls.dampingFactor = IS_MOBILE ? 0.075 : 0.06;
  miniControls.enablePan = true;
  miniControls.panSpeed = IS_MOBILE ? 0.34 : 0.48;
  miniControls.screenSpacePanning = true;
  miniControls.enableZoom = true;
  miniControls.zoomSpeed = IS_MOBILE ? 0.42 : 0.55;
  miniControls.minDistance = 1;
  miniControls.maxDistance = IS_MOBILE ? 150 : 220;
  miniControls.rotateSpeed = IS_MOBILE ? -0.34 : -0.42;
  miniControls.minPolarAngle = 0.28;
  miniControls.maxPolarAngle = Math.PI * 0.86;
  miniControls.autoRotate = !REDUCED_MOTION;
  miniControls.autoRotateSpeed = IS_MOBILE ? 0.14 : 0.22;
  miniControls.target.set(0, 0, 0);

  miniViewerCanvas.addEventListener("pointerdown", () => {
    miniViewerCanvas.classList.add("is-panning");
  }, { passive: true });

  const clearMiniPanClass = () => miniViewerCanvas.classList.remove("is-panning");
  miniViewerCanvas.addEventListener("pointerup", clearMiniPanClass, { passive: true });
  miniViewerCanvas.addEventListener("pointercancel", clearMiniPanClass, { passive: true });
  miniViewerCanvas.addEventListener("pointerleave", clearMiniPanClass, { passive: true });

  miniViewerCanvas.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
  resizeMiniViewer();
}

if (mobileViewerCanvas) {
  mobileRenderer = new THREE.WebGLRenderer({
    canvas: mobileViewerCanvas,
    antialias: !IS_MOBILE,
    powerPreference: "high-performance",
    alpha: false
  });

  mobileRenderer.outputColorSpace = THREE.SRGBColorSpace;
  mobileRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  mobileRenderer.toneMappingExposure = renderer.toneMappingExposure;
  mobileRenderer.setClearColor(0x01030a);

  mobileCamera = new THREE.PerspectiveCamera(
    IS_MOBILE ? 78 : 72,
    4 / 5,
    0.1,
    600
  );

  mobileCamera.position.copy(getOverviewCameraPos());

  mobileControls = new OrbitControls(mobileCamera, mobileRenderer.domElement);
  mobileControls.enableDamping = true;
  mobileControls.dampingFactor = IS_MOBILE ? 0.075 : 0.06;
  mobileControls.enablePan = true;
  mobileControls.panSpeed = IS_MOBILE ? 0.34 : 0.48;
  mobileControls.screenSpacePanning = true;
  mobileControls.enableZoom = true;
  mobileControls.zoomSpeed = IS_MOBILE ? 0.42 : 0.55;
  mobileControls.minDistance = 1;
  mobileControls.maxDistance = IS_MOBILE ? 150 : 220;
  mobileControls.rotateSpeed = IS_MOBILE ? -0.34 : -0.42;
  mobileControls.minPolarAngle = 0.28;
  mobileControls.maxPolarAngle = Math.PI * 0.86;
  mobileControls.autoRotate = !REDUCED_MOTION;
  mobileControls.autoRotateSpeed = IS_MOBILE ? 0.14 : 0.22;
  mobileControls.target.set(0, 0, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE GROUPS
// ─────────────────────────────────────────────────────────────────────────────

const skyDome = new THREE.Group();
const compassGrp = new THREE.Group();

scene.add(skyDome, compassGrp);

// ─────────────────────────────────────────────────────────────────────────────
// SKY COORDINATE HELPER
// ─────────────────────────────────────────────────────────────────────────────

function skyPos(azDeg, altDeg, r = 68) {
  const az  = THREE.MathUtils.degToRad(azDeg);
  const alt = THREE.MathUtils.degToRad(altDeg);

  return new THREE.Vector3(
    r * Math.cos(alt) * Math.sin(az),
    r * Math.sin(alt),
    r * Math.cos(alt) * Math.cos(az)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALAXY DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

let GALAXY_DEFS = [];

const BRIDGE_CONCEPTS = [
  { id: "br-creation",  label: "Creation from P\u014d",  lessonId: "bridge-darkness",   color: 0x8899ff, hex: "#8899ff", az: 350, alt: 72, r: 62, major: true  },
  { id: "br-pairs",     label: "Paired Forces",           lessonId: "bridge-pairs",       color: 0x7b88ff, hex: "#7b88ff", az: 340, alt: 58, r: 64, major: false },
  { id: "br-alohamaat", label: "Aloha \u2194 Ma\u02beat", lessonId: "bridge-aloha-maat", color: 0xaa99ff, hex: "#aa99ff", az: 8,   alt: 64, r: 63, major: true  },
  { id: "br-star",      label: "Star Knowledge",          lessonId: "bridge-darkness",    color: 0x7b88ff, hex: "#7b88ff", az: 355, alt: 48, r: 65, major: false }
];

let CONNECTIONS = [
  // Dynamically populated in init() from enrichment data
];

function buildIntraCultureConnections(galaxies) {
  const links = [];

  galaxies.forEach((g) => {
    const concepts = Array.isArray(g.concepts) ? g.concepts : [];
    if (concepts.length < 2) return;

    // Chain all lessons in a culture so every node has a same-culture path.
    for (let i = 0; i < concepts.length - 1; i++) {
      links.push({ aId: concepts[i].id, bId: concepts[i + 1].id, str: 0.72, type: "intra", cultureId: g.id });
    }

    // Close the loop for a galaxy-like ring feeling when there are enough nodes.
    if (concepts.length > 2) {
      links.push({ aId: concepts[concepts.length - 1].id, bId: concepts[0].id, str: 0.64, type: "intra", cultureId: g.id });
    }

    // Reinforce a culture hub from the major lesson node to nearby lessons.
    const hub = concepts.find((c) => c.major) || concepts[0];
    concepts.forEach((c, idx) => {
      if (c.id === hub.id || idx % 2 !== 0) return;
      links.push({ aId: hub.id, bId: c.id, str: 0.50, type: "intra", cultureId: g.id });
    });
  });

  return links;
}

let ALL_CONCEPTS = [];
let CONCEPT_MAP = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND STARFIELD
// ─────────────────────────────────────────────────────────────────────────────

function makeBackgroundStars() {
  const N = IS_MOBILE ? 1450 : 4800;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);

  const COLS = [0x9ed8ff, 0xffffff, 0xffe8d0, 0xb48cff, 0xffd0aa].map((h) => new THREE.Color(h));

  for (let i = 0; i < N; i++) {
    const r  = 120 + Math.random() * 40;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 2 - 1);

    pos[i * 3]     = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.74;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);

    const c = COLS[Math.floor(Math.random() * COLS.length)];
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));

  skyDome.add(new THREE.Points(geo, new THREE.PointsMaterial({
    size: IS_MOBILE ? 0.19 : 0.16, vertexColors: true,
    transparent: true, opacity: IS_MOBILE ? 0.58 : 0.68,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  })));

  const S  = IS_MOBILE ? 80 : 280;
  const sp = new Float32Array(S * 3);

  for (let i = 0; i < S; i++) {
    const r  = 82 + Math.random() * 28;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 2 - 1);

    sp[i * 3]     = r * Math.sin(ph) * Math.cos(th);
    sp[i * 3 + 1] = r * Math.cos(ph) * 0.80;
    sp[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }

  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));

  skyDome.add(new THREE.Points(sg, new THREE.PointsMaterial({
    size: IS_MOBILE ? 0.32 : 0.36, color: 0xffffff,
    transparent: true, opacity: IS_MOBILE ? 0.62 : 0.80,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  })));
}

// ─────────────────────────────────────────────────────────────────────────────
// GALAXIES
// ─────────────────────────────────────────────────────────────────────────────

const galaxyObjects = new Map();
const nebulaObjects = [];

function buildSpiralParticles(color, N, scale) {
  const col    = new THREE.Color(color);
  const points = [];
  const armCount = 2;

  for (let arm = 0; arm < armCount; arm++) {
    const armOffset = arm * Math.PI;
    const armN = Math.floor(N * 0.44);

    for (let i = 0; i < armN; i++) {
      const t       = i / armN;
      const theta   = t * Math.PI * 3.6 + armOffset;
      const r       = (0.06 + t * 0.94) * scale;
      const scatter = (1 - t * 0.6) * scale * 0.12;
      const dust    = Math.random() < 0.18 ? scale * 0.15 : 0;

      points.push({
        x: r * Math.cos(theta) + (Math.random() - 0.5) * scatter + (Math.random() - 0.5) * dust,
        y: (Math.random() - 0.5) * scale * 0.08 * (1 - t * 0.4),
        z: r * Math.sin(theta) + (Math.random() - 0.5) * scatter + (Math.random() - 0.5) * dust,
        warm: t < 0.3
      });
    }
  }

  const hN = Math.floor(N * 0.22);
  for (let i = 0; i < hN; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * scale * 0.90;
    points.push({ x: r * Math.cos(a) + (Math.random() - 0.5) * scale * 0.08, y: (Math.random() - 0.5) * scale * 0.06, z: r * Math.sin(a) + (Math.random() - 0.5) * scale * 0.08, warm: Math.random() < 0.4 });
  }

  const cN = Math.floor(N * 0.14);
  for (let i = 0; i < cN; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.4) * scale * 0.20;
    points.push({ x: r * Math.cos(a), y: (Math.random() - 0.5) * scale * 0.07, z: r * Math.sin(a), warm: true });
  }

  const warm = points.filter((p) => p.warm);
  const cool = points.filter((p) => !p.warm);

  const warmPos = new Float32Array(warm.length * 3);
  const coolPos = new Float32Array(cool.length * 3);

  warm.forEach((p, i) => { warmPos[i*3]=p.x; warmPos[i*3+1]=p.y; warmPos[i*3+2]=p.z; });
  cool.forEach((p, i) => { coolPos[i*3]=p.x; coolPos[i*3+1]=p.y; coolPos[i*3+2]=p.z; });

  const wGeo = new THREE.BufferGeometry(); wGeo.setAttribute("position", new THREE.BufferAttribute(warmPos, 3));
  const cGeo = new THREE.BufferGeometry(); cGeo.setAttribute("position", new THREE.BufferAttribute(coolPos, 3));

  const wCol = col.clone().lerp(new THREE.Color(0xffffff), 0.48);
  const cCol = col.clone().lerp(new THREE.Color(0xff8844), 0.22);

  return [
    { geo: wGeo, color: wCol, size: IS_MOBILE ? 0.22 : 0.24, opacity: IS_MOBILE ? 0.58 : 0.72 },
    { geo: cGeo, color: cCol, size: IS_MOBILE ? 0.18 : 0.20, opacity: IS_MOBILE ? 0.42 : 0.52 }
  ];
}

function buildEllipticalParticles(color, N, scale) {
  const col     = new THREE.Color(color);
  const pts     = [];
  const corePts = [];
  const hazePts = [];

  for (let i = 0; i < Math.floor(N * 0.58); i++) {
    const r = scale * Math.pow(Math.random(), 0.44);
    const a = Math.random() * Math.PI * 2;
    pts.push({ x: r * Math.cos(a), y: (Math.random() - 0.5) * r * 0.22, z: r * Math.sin(a) * 0.64 });
  }

  for (let i = 0; i < Math.floor(N * 0.18); i++) {
    const r = Math.random() * scale * 0.18;
    const a = Math.random() * Math.PI * 2;
    corePts.push({ x: r * Math.cos(a), y: (Math.random() - 0.5) * 0.26, z: r * Math.sin(a) * 0.64 });
  }

  for (let i = 0; i < Math.floor(N * 0.24); i++) {
    const r = scale * (0.5 + Math.random() * 0.5);
    const a = Math.random() * Math.PI * 2;
    hazePts.push({ x: r * Math.cos(a) + (Math.random() - 0.5) * scale * 0.1, y: (Math.random() - 0.5) * r * 0.12, z: r * Math.sin(a) * 0.64 });
  }

  const mkGeo = (arr) => {
    const p = new Float32Array(arr.length * 3);
    arr.forEach((v, i) => { p[i*3]=v.x; p[i*3+1]=v.y; p[i*3+2]=v.z; });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  };

  const warmCol = col.clone().lerp(new THREE.Color(0xfff0c0), 0.60);
  const coreCol = new THREE.Color(0xfffacc);
  const hazeCol = col.clone().lerp(new THREE.Color(0xffaa44), 0.30);

  return [
    { geo: mkGeo(pts),     color: warmCol, size: IS_MOBILE ? 0.18 : 0.20, opacity: IS_MOBILE ? 0.44 : 0.55 },
    { geo: mkGeo(corePts), color: coreCol, size: IS_MOBILE ? 0.26 : 0.30, opacity: IS_MOBILE ? 0.68 : 0.82 },
    { geo: mkGeo(hazePts), color: hazeCol, size: IS_MOBILE ? 0.14 : 0.16, opacity: IS_MOBILE ? 0.24 : 0.32 }
  ];
}

function makeGalaxy(def) {
  const grp  = new THREE.Group();
  const cPos = skyPos(def.az, def.alt, def.r);

  grp.position.copy(cPos);
  grp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), cPos.clone().negate().normalize());

  const col   = new THREE.Color(def.color);
  const R = Math.round(col.r * 255), G = Math.round(col.g * 255), B = Math.round(col.b * 255);
  const SCALE = IS_MOBILE ? 4.8 : 8.5;
  const N     = def.particleCount;

  const layers = def.type === "spiral"
    ? buildSpiralParticles(def.color, N, SCALE)
    : buildEllipticalParticles(def.color, N, SCALE);

  layers.forEach(({ geo, color, size, opacity }) => {
    grp.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size, color, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    })));
  });

  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(R, G, B, 0.94, 128),
    transparent: true, opacity: IS_MOBILE ? 0.58 : 0.72,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  coreGlow.scale.setScalar(IS_MOBILE ? 3.7 : 6.2);
  grp.add(coreGlow);

  const outerGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(R, G, B, 0.14, 64),
    transparent: true, opacity: IS_MOBILE ? 0.28 : 0.38,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  outerGlow.scale.setScalar(IS_MOBILE ? 12 : 26);
  grp.add(outerGlow);

  const nebula = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(R, G, B, 0.22, 128),
    transparent: true,
    opacity: IS_MOBILE ? 0.18 : 0.26,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  const nebulaSpread = def.ecosystem?.nebula?.spread || (IS_MOBILE ? 16 : 24);
  nebula.scale.set(nebulaSpread * 1.6, nebulaSpread, 1);
  nebula.rotation.z = THREE.MathUtils.degToRad(def.az * 0.37 + def.alt);
  nebula.userData = {
    baseOpacity: IS_MOBILE ? 0.18 : 0.26,
    pulse: def.ecosystem?.nebula?.pulse || 1,
    phase: def.az * 0.017
  };
  grp.add(nebula);
  nebulaObjects.push(nebula);

  const mat = grp.children[0].material;
  skyDome.add(grp);
  galaxyObjects.set(def.id, { grp, coreGlow, outerGlow, nebula, mat });
}

function makeGalaxies() {
  GALAXY_DEFS.forEach(makeGalaxy);
}

// ─────────────────────────────────────────────────────────────────────────────
// CULTURE IMAGE DISC
// ─────────────────────────────────────────────────────────────────────────────

function makeGalaxyCoreDisc(def) {
  const grp = new THREE.Group();
  grp.position.copy(skyPos(def.az, def.alt, def.r));
  grp.lookAt(0, 0, 0);

  const imgEl = loadedImages[def.assetKey];
  let tex = null;

  if (imgEl) {
    const S  = 256;
    const cc = document.createElement("canvas");
    cc.width = cc.height = S;
    const ctx = cc.getContext("2d");
    ctx.clearRect(0, 0, S, S);
    ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(imgEl, 0, 0, S, S);
    tex = new THREE.CanvasTexture(cc);
    tex.colorSpace = THREE.SRGBColorSpace;
  }

  const discR = IS_MOBILE ? 0.72 : 1.10;
  const disc  = new THREE.Mesh(
    new THREE.CircleGeometry(discR, 64),
    new THREE.MeshBasicMaterial({
      map: tex, color: tex ? 0xffffff : def.color,
      transparent: true, opacity: tex ? 0.90 : 0.58,
      depthWrite: false, side: THREE.DoubleSide
    })
  );
  disc.userData.conceptId = `${def.id}-galaxy`;
  disc.userData.culture   = def.id;
  disc.userData.isGalaxyCore = true;
  grp.add(disc);

  const rim = [];
  for (let i = 0; i <= 80; i++) {
    const a = (i / 80) * Math.PI * 2;
    rim.push(new THREE.Vector3(Math.cos(a) * (discR + 0.08), Math.sin(a) * (discR + 0.08), 0));
  }
  grp.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(rim),
    new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.64 })
  ));

  const lSpr = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeLabelTex(def.name, def.hex, IS_MOBILE ? "11px" : "15px", true),
    transparent: true, opacity: 0.92, depthWrite: false
  }));
  lSpr.position.set(0, -(discR + 0.60), 0);
  lSpr.scale.set(IS_MOBILE ? 2.5 : 4.0, IS_MOBILE ? 0.40 : 0.62, 1);
  grp.add(lSpr);

  skyDome.add(grp);
}

// ─────────────────────────────────────────────────────────────────────────────
// CRYSTAL CONCEPT NODES
// ─────────────────────────────────────────────────────────────────────────────

const conceptNodes = [];
const pickable     = [];
const LESSON_MEMORY_KEY = "lkp-seen-lessons-v1";
let newLessonIds = new Set();

function safeReadSeenLessons() {
  try {
    const raw = window.localStorage.getItem(LESSON_MEMORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (_) {
    return new Set();
  }
}

function safeWriteSeenLessons(ids) {
  try {
    window.localStorage.setItem(LESSON_MEMORY_KEY, JSON.stringify(Array.from(ids)));
  } catch (_) {
    // Non-fatal if storage is unavailable.
  }
}

function makeCrystalNode(concept, buildIndex = 0) {
  const grp = new THREE.Group();
  grp.position.copy(skyPos(concept.az, concept.alt, concept.r));
  grp.userData = { conceptId: concept.id };

  const col = new THREE.Color(concept.color);
  const R = Math.round(col.r * 255), G = Math.round(col.g * 255), B = Math.round(col.b * 255);

  const size = concept.major
    ? IS_MOBILE ? 0.20 : 0.30
    : IS_MOBILE ? 0.12 : 0.18;

  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(size, 0),
    new THREE.MeshPhysicalMaterial({
      color: concept.color, emissive: concept.color,
      emissiveIntensity: concept.major ? 0.62 : 0.50,
      metalness: 0.06, roughness: 0.16, transparent: true, opacity: 0.90
    })
  );
  crystal.userData.conceptId = concept.id;
  crystal.userData.culture   = concept.culture;
  grp.add(crystal);
  pickable.push(crystal);

  const wire = new THREE.Mesh(
    new THREE.OctahedronGeometry(size * 1.28, 0),
    new THREE.MeshBasicMaterial({ color: concept.color, wireframe: true, transparent: true, opacity: IS_MOBILE ? 0.15 : 0.20 })
  );
  grp.add(wire);

  const gs   = concept.major ? IS_MOBILE ? 2.3 : 4.4 : IS_MOBILE ? 1.35 : 2.6;
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(R, G, B, 0.90, 64),
    transparent: true, opacity: concept.major ? 0.80 : 0.60,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  glow.scale.setScalar(gs);
  grp.add(glow);

  if (concept.major && !IS_MOBILE) {
    const sp = size * 4.4;
    [
      [new THREE.Vector3(-sp, 0, 0), new THREE.Vector3(sp, 0, 0)],
      [new THREE.Vector3(0, -sp, 0), new THREE.Vector3(0, sp, 0)]
    ].forEach((pair) => {
      grp.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pair),
        new THREE.LineBasicMaterial({ color: concept.color, transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending })
      ));
    });
  }

  const lSpr = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeLabelTex(concept.label, concept.hex,
      concept.major ? (IS_MOBILE ? "11px" : "13px") : (IS_MOBILE ? "10px" : "11px"),
      concept.major),
    transparent: true, opacity: IS_MOBILE ? 0.80 : 0.88, depthWrite: false
  }));
  lSpr.position.set(0, size + (IS_MOBILE ? 0.42 : 0.54), 0);
  lSpr.scale.set(
    concept.major ? (IS_MOBILE ? 2.35 : 3.0) : (IS_MOBILE ? 1.75 : 2.2),
    concept.major ? (IS_MOBILE ? 0.38 : 0.48) : (IS_MOBILE ? 0.30 : 0.38),
    1
  );
  grp.add(lSpr);

  skyDome.add(grp);
  const nowMs = performance.now();
  const isNewLesson = concept.lessonId ? newLessonIds.has(concept.lessonId) : false;
  const revealDelay = buildIndex * (IS_MOBILE ? 16 : 22) + (isNewLesson ? 0 : (IS_MOBILE ? 180 : 260));
  conceptNodes.push({
    concept,
    grp,
    crystal,
    glow,
    wire,
    label: lSpr,
    baseOpacity: concept.major ? 0.80 : 0.60,
    phase: Math.random() * Math.PI * 2,
    revealAt: nowMs + revealDelay,
    isNewLesson
  });
}

function makeAllConceptNodes() {
  let buildIndex = 0;
  GALAXY_DEFS.forEach((g) => {
    g.concepts.forEach((c) => makeCrystalNode({ ...c, culture: g.id, galaxyId: g.id }, buildIndex++));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTELLATION LINES + FLOW PARTICLES
// ─────────────────────────────────────────────────────────────────────────────

const flowItems = [];
const constellationLines = [];
let constellationBuildTick = 0;
const storyFocus = {
  active: false,
  galaxyId: null,
  path: [],
  startedAt: 0,
  stepMs: 1100,
  totalMs: 0
};

function culturePhaseKey(value) {
  const s = String(value || "lkp");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h % 628) / 100;
}

function triggerConnectionSurge(seedConceptId, galaxyId, strength = 1.0) {
  const now = performance.now();
  const burstDur = 2200;

  constellationLines.forEach((ln) => {
    const touchesConcept = seedConceptId && (ln.aId === seedConceptId || ln.bId === seedConceptId);
    const touchesGalaxy = galaxyId && (ln.aGalaxyId === galaxyId || ln.bGalaxyId === galaxyId || ln.cultureId === galaxyId);
    if (!touchesConcept && !touchesGalaxy) return;

    const nextBoost = touchesConcept ? 1.15 * strength : 0.72 * strength;
    ln.surgeBoost = Math.max(ln.surgeBoost || 0, nextBoost);
    ln.surgeUntil = Math.max(ln.surgeUntil || 0, now + burstDur);
  });
}

function startGuidedStory(galaxyId) {
  const ids = ALL_CONCEPTS
    .filter((c) => c.galaxyId === galaxyId)
    .sort((a, b) => (b.major ? 1 : 0) - (a.major ? 1 : 0))
    .slice(0, 6)
    .map((c) => c.id);

  if (!ids.length) return;

  storyFocus.active = true;
  storyFocus.galaxyId = galaxyId;
  storyFocus.path = ids;
  storyFocus.startedAt = performance.now();
  storyFocus.stepMs = IS_MOBILE ? 900 : 1100;
  storyFocus.totalMs = storyFocus.path.length * storyFocus.stepMs + 1000;
}

function makeConstellations() {
  let foundConnections = 0;
  let missingConnections = 0;
  const orbBudgetByGalaxy = new Map();

  constellationLines.length = 0;
  flowItems.length = 0;
  constellationBuildTick = performance.now();
  let buildIndex = 0;

  CONNECTIONS.forEach((conn) => {
    const aId = conn.aId;
    const bId = conn.bId;
    const str = conn.str ?? 0.6;
    const isIntra = conn.type === "intra";

    const ca = CONCEPT_MAP.get(aId);
    const cb = CONCEPT_MAP.get(bId);
    
    if (!ca || !cb) {
      missingConnections++;
      return;
    }
    
    foundConnections++;

    const pA  = skyPos(ca.az, ca.alt, ca.r);
    const pB  = skyPos(cb.az, cb.alt, cb.r);
    const mid = pA.clone().lerp(pB, 0.5);
    mid.add(mid.clone().normalize().multiplyScalar(mid.length() * 0.06));

    const curve = new THREE.CatmullRomCurve3([pA, mid, pB]);
    const colA = new THREE.Color(ca.color);
    const colB = new THREE.Color(cb.color);
    const colAB = isIntra ? colA.clone() : colA.clone().lerp(colB, 0.5);

    const baseOpacity = isIntra
      ? (str > 0.7 ? str * (IS_MOBILE ? 0.22 : 0.30) : str * (IS_MOBILE ? 0.16 : 0.22))
      : (str > 0.7 ? str * (IS_MOBILE ? 0.16 : 0.24) : str * (IS_MOBILE ? 0.10 : 0.14));

    const dormantOpacity = isIntra
      ? (IS_MOBILE ? 0.035 : 0.022)
      : (IS_MOBILE ? 0.028 : 0.016);

    const lineMat = new THREE.LineBasicMaterial({
      color: colAB,
      transparent: true,
      opacity: dormantOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(IS_MOBILE ? 24 : 40)),
      lineMat
    );

    skyDome.add(line);

    constellationLines.push({
      mat: lineMat,
      baseOpacity,
      dormantOpacity,
      aId,
      bId,
      isIntra,
      cultureId: conn.cultureId || null,
      aGalaxyId: ca.galaxyId,
      bGalaxyId: cb.galaxyId,
      mid,
      phase: culturePhaseKey(conn.cultureId || `${aId}:${bId}`),
      revealAt: constellationBuildTick + buildIndex * (IS_MOBILE ? 8 : 11),
      surgeUntil: 0,
      surgeBoost: 0
    });

    const lineRef = constellationLines[constellationLines.length - 1];
    buildIndex += 1;

    if (str >= 0.5 && !REDUCED_MOTION && !IS_MOBILE && isIntra) {
      const col2 = colAB;
      const R2 = Math.round(col2.r*255), G2 = Math.round(col2.g*255), B2 = Math.round(col2.b*255);
      const tex = makeGlowTex(R2, G2, B2, 0.96, 32);
      const galaxyId = conn.cultureId || ca.galaxyId;
      const used = orbBudgetByGalaxy.get(galaxyId) || 0;
      const maxForGalaxy = str >= 0.8 ? 2 : 1;
      const remaining = Math.max(0, maxForGalaxy - used);
      const N2 = Math.min(2, remaining);

      if (N2 <= 0) return;

      orbBudgetByGalaxy.set(galaxyId, used + N2);

      for (let i = 0; i < N2; i++) {
        const dot = new THREE.Sprite(new THREE.SpriteMaterial({
          map: tex, transparent: true, opacity: 0,
          depthWrite: false, blending: THREE.AdditiveBlending
        }));
        dot.scale.setScalar(isIntra ? 0.26 : 0.24);
        dot.userData = {
          curve,
          t: i / N2,
          speed: 0.0014 + Math.random() * 0.0012,
          maxOp: 0.60 * str,
          lineRef,
          bornAt: lineRef.revealAt + i * 40
        };
        skyDome.add(dot);
        flowItems.push(dot);
      }
    }
  });

  console.log(`[LKP Constellations] Found ${foundConnections} connections, ${missingConnections} missing`);
}

// ─────────────────────────────────────────────────────────────────────────────
// HAWAIIAN STAR COMPASS — GOLD IMAGE FLOOR
// ─────────────────────────────────────────────────────────────────────────────

let compassFloorMesh = null;

function makeStarCompass() {
  const Y = -4.52;

  const horizonPts = [];
  for (let i = 0; i <= 240; i++) {
    const a = (i / 240) * Math.PI * 2;
    horizonPts.push(new THREE.Vector3(Math.cos(a) * 72, 0, Math.sin(a) * 72));
  }
  skyDome.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(horizonPts),
    new THREE.LineBasicMaterial({ color: 0x263b52, transparent: true, opacity: IS_MOBILE ? 0.07 : 0.13, depthWrite: false, depthTest: false })
  ));

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(IS_MOBILE ? 11.5 : 17.5, 128),
    new THREE.MeshBasicMaterial({ color: 0x020714, transparent: true, opacity: IS_MOBILE ? 0.38 : 0.44, depthWrite: false, depthTest: false, side: THREE.DoubleSide })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, Y - 0.045, 0);
  shadow.renderOrder = 1;
  compassGrp.add(shadow);

  const goldAura = new THREE.Mesh(
    new THREE.CircleGeometry(IS_MOBILE ? 9.4 : 14.2, 128),
    new THREE.MeshBasicMaterial({ color: 0xd4ae5a, transparent: true, opacity: IS_MOBILE ? 0.075 : 0.095, depthWrite: false, depthTest: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
  );
  goldAura.rotation.x = -Math.PI / 2;
  goldAura.position.set(0, Y - 0.025, 0);
  goldAura.renderOrder = 2;
  compassGrp.add(goldAura);

  const cyanAura = new THREE.Mesh(
    new THREE.CircleGeometry(IS_MOBILE ? 7.8 : 12.1, 128),
    new THREE.MeshBasicMaterial({ color: 0x54c6ee, transparent: true, opacity: IS_MOBILE ? 0.025 : 0.04, depthWrite: false, depthTest: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
  );
  cyanAura.rotation.x = -Math.PI / 2;
  cyanAura.position.set(0, Y - 0.015, 0);
  cyanAura.renderOrder = 3;
  compassGrp.add(cyanAura);

  function addRing(radius, color, opacity, yOffset = 0) {
    const pts = [];
    for (let i = 0; i <= 240; i++) {
      const a = (i / 240) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Y + yOffset, Math.sin(a) * radius));
    }
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending })
    );
    ring.renderOrder = 4;
    compassGrp.add(ring);
  }

  addRing(IS_MOBILE ? 7.6  : 11.3, 0xd4ae5a, IS_MOBILE ? 0.18 : 0.24, 0.01);
  addRing(IS_MOBILE ? 6.55 : 9.85, 0xffcc66, IS_MOBILE ? 0.12 : 0.18, 0.015);
  addRing(IS_MOBILE ? 4.85 : 7.35, 0xd4ae5a, IS_MOBILE ? 0.08 : 0.12, 0.02);
}

function makeCompassImageOverlay() {
  const imgEl = loadedImages.compass;

  if (!imgEl || !compassGrp) {
    console.warn("[LKP] Hawaiian star compass image not loaded.");
    return;
  }

  const size = IS_MOBILE ? 19.25 : 28.5;
  const Y    = -4.48;
  const R    = size * 0.468;   // matches the clip radius in makeGoldCompassTexture

  const compassTexture = makeGoldCompassTexture(imgEl);

  // ── [A] Outer shadow halo ─────────────────────────────────────────────────
  const haloDisc = new THREE.Mesh(
    new THREE.CircleGeometry(R * 1.22, 128),
    new THREE.MeshBasicMaterial({
      color: 0x010509, transparent: true, opacity: IS_MOBILE ? 0.55 : 0.66,
      depthWrite: false, depthTest: false, side: THREE.DoubleSide
    })
  );
  haloDisc.rotation.x = -Math.PI / 2;
  haloDisc.position.set(0, Y - 0.12, 0);
  haloDisc.renderOrder = 10;
  compassGrp.add(haloDisc);

  // ── [B] Compass face — PlaneGeometry (perfect full UV) ───────────────────
  // The texture is a warm parchment with bright gold text.
  // MeshBasicMaterial ignores lights on the face so the texture renders
  // at its full processed brightness regardless of scene lighting angle.
  // The 3D depth comes from the surrounding geometry (rim, rings, hub).
  const faceMat = new THREE.MeshBasicMaterial({
    map:         compassTexture,
    color:       0xffffff,   // neutral tint — let the texture speak
    transparent: true,
    opacity:     1.0,
    depthWrite:  false,
    depthTest:   false,
    fog:         false,
    side:        THREE.DoubleSide,
    alphaTest:   0.008
  });

  const faceMesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), faceMat);
  faceMesh.rotation.x = -Math.PI / 2;
  faceMesh.position.set(0, Y + 0.06, 0);
  faceMesh.renderOrder = 20;
  faceMesh.name = "hawaiian-star-compass-gold-image";
  compassGrp.add(faceMesh);
  compassFloorMesh = faceMesh;

  // ── [C] Outer raised rim — TorusGeometry ──────────────────────────────────
  // This is the primary 3D element. The 4 dedicated point lights create a
  // bright specular highlight on the curved top surface and shadow underneath,
  // making the rim read as a physically raised metal ring.
  const rimGeo = new THREE.TorusGeometry(
    R,
    IS_MOBILE ? 0.44 : 0.66,   // tube radius
    IS_MOBILE ? 14 : 22,
    IS_MOBILE ? 100 : 180
  );
  const rimMat = new THREE.MeshPhysicalMaterial({
    color:              0xc8981e,
    emissive:           0x2c1800,
    emissiveIntensity:  0.20,
    metalness:          0.92,
    roughness:          0.11,
    clearcoat:          0.80,
    clearcoatRoughness: 0.07,
    reflectivity:       0.92
  });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.set(0, Y + 0.10, 0);
  rimMesh.renderOrder = 22;
  compassGrp.add(rimMesh);

  // ── [D] Inner bevel ring ──────────────────────────────────────────────────
  const bevelMesh = new THREE.Mesh(
    new THREE.TorusGeometry(R * 0.875, IS_MOBILE ? 0.16 : 0.23, IS_MOBILE ? 10 : 16, IS_MOBILE ? 80 : 150),
    rimMat.clone()
  );
  bevelMesh.material.emissiveIntensity = 0.24;
  bevelMesh.rotation.x = Math.PI / 2;
  bevelMesh.position.set(0, Y + 0.13, 0);
  bevelMesh.renderOrder = 23;
  compassGrp.add(bevelMesh);

  // ── [E] Stepped concentric wall rings ────────────────────────────────────
  const stepDefs = IS_MOBILE ? [
    { r: R * 0.955, h: 0.06, y: Y + 0.05 },
    { r: R * 0.855, h: 0.05, y: Y + 0.08 },
    { r: R * 0.720, h: 0.04, y: Y + 0.11 },
  ] : [
    { r: R * 0.955, h: 0.09, y: Y + 0.05 },
    { r: R * 0.855, h: 0.07, y: Y + 0.09 },
    { r: R * 0.720, h: 0.05, y: Y + 0.13 },
  ];

  const stepMat = new THREE.MeshStandardMaterial({
    color: 0xb88818, emissive: 0x181000, emissiveIntensity: 0.12,
    metalness: 0.85, roughness: 0.18, side: THREE.DoubleSide
  });

  stepDefs.forEach((def) => {
    const s = new THREE.Mesh(
      new THREE.CylinderGeometry(def.r, def.r, def.h, IS_MOBILE ? 80 : 144, 1, true),
      stepMat.clone()
    );
    s.position.set(0, def.y, 0);
    s.renderOrder = 21;
    compassGrp.add(s);

    // Glowing edge line at top of each step
    const edgePts = [];
    for (let i = 0; i <= 140; i++) {
      const a = (i / 140) * Math.PI * 2;
      edgePts.push(new THREE.Vector3(Math.cos(a) * def.r, def.y + def.h / 2, Math.sin(a) * def.r));
    }
    const eLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(edgePts),
      new THREE.LineBasicMaterial({ color: 0xf0c040, transparent: true, opacity: 0.52, depthWrite: false })
    );
    eLine.renderOrder = 21;
    compassGrp.add(eLine);
  });

  // ── [F] Centre hub ────────────────────────────────────────────────────────
  const hubH = IS_MOBILE ? 0.24 : 0.36;
  const hubMat = new THREE.MeshPhysicalMaterial({
    color: 0xe8bc28, emissive: 0x3c2400, emissiveIntensity: 0.35,
    metalness: 0.96, roughness: 0.08, clearcoat: 0.92, clearcoatRoughness: 0.05
  });

  const hubMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(IS_MOBILE ? 0.28 : 0.44, IS_MOBILE ? 0.36 : 0.54, hubH, IS_MOBILE ? 24 : 40),
    hubMat
  );
  hubMesh.position.set(0, Y + hubH / 2 + 0.06, 0);
  hubMesh.renderOrder = 25;
  compassGrp.add(hubMesh);

  const hubCap = new THREE.Mesh(
    new THREE.CircleGeometry(IS_MOBILE ? 0.28 : 0.44, IS_MOBILE ? 24 : 40),
    hubMat.clone()
  );
  hubCap.material.emissiveIntensity = 0.55;
  hubCap.rotation.x = -Math.PI / 2;
  hubCap.position.set(0, Y + hubH + 0.08, 0);
  hubCap.renderOrder = 26;
  compassGrp.add(hubCap);

  const hubGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(255, 215, 90, 0.96, 48),
    transparent: true, opacity: IS_MOBILE ? 0.62 : 0.80,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  hubGlow.scale.setScalar(IS_MOBILE ? 1.4 : 2.1);
  hubGlow.position.set(0, Y + hubH + 0.20, 0);
  hubGlow.renderOrder = 27;
  compassGrp.add(hubGlow);

  // ── [G] Outer aura ────────────────────────────────────────────────────────
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(200, 155, 38, 0.96, 128),
    transparent: true, opacity: IS_MOBILE ? 0.14 : 0.20,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  aura.scale.setScalar(size * 1.10);
  aura.position.set(0, Y + 0.05, 0);
  aura.renderOrder = 11;
  compassGrp.add(aura);

  console.log("[LKP] 3D compass built — size:", size, "R:", R.toFixed(2),
    "src:", imgEl.naturalWidth + "x" + imgEl.naturalHeight);
}

// ─────────────────────────────────────────────────────────────────────────────

let iwaSpr  = null;
let iwaAngle = 0;

function makeIwaBird() {
  const imgEl = loadedImages.iwa;

  if (!imgEl) {
    console.warn("[LKP] \u02bbIwa bird image was not loaded.");
    return;
  }

  const iS = IS_MOBILE ? 2.6 : 4.4;

  iwaSpr = new THREE.Sprite(new THREE.SpriteMaterial({
    map: removeWhiteBg(imgEl, 238, 34),
    transparent: true, opacity: 0, depthWrite: false, color: 0xb8d4f0
  }));

  iwaSpr.scale.set(iS, iS * 0.52, 1);
  skyDome.add(iwaSpr);
}

// ─────────────────────────────────────────────────────────────────────────────
// TWINKLE STARS
// ─────────────────────────────────────────────────────────────────────────────

const twinkles = [];

function makeTwinkles() {
  const tex   = makeGlowTex(255, 255, 255, 0.96, 48);
  const count = IS_MOBILE ? 8 : 24;

  for (let i = 0; i < count; i++) {
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
    }));

    const s = 0.12 + Math.random() * 0.22;
    spr.scale.setScalar(s);
    spr.position.copy(skyPos(Math.random() * 360, Math.random() * 80, 70 + Math.random() * 22));
    spr.userData.nextFlash = Math.random() * 6000;

    skyDome.add(spr);
    twinkles.push(spr);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTS
// ─────────────────────────────────────────────────────────────────────────────

function makeLights() {
  scene.add(new THREE.AmbientLight(0x3344aa, IS_MOBILE ? 0.42 : 0.36));

  const key = new THREE.PointLight(0xfff4e8, IS_MOBILE ? 2.2 : 2.8, 200, 1.2);
  key.position.set(0, 40, 20);
  scene.add(key);

  const em = new THREE.PointLight(0x3cb371, IS_MOBILE ? 1.45 : 2.0, 120, 1.4);
  em.position.set(-30, 20, -20);
  scene.add(em);

  const gd = new THREE.PointLight(0xf0c96a, IS_MOBILE ? 1.20 : 1.6, 120, 1.4);
  gd.position.set(40, 15, 30);
  scene.add(gd);

  const vi = new THREE.PointLight(0x7b88ff, IS_MOBILE ? 0.75 : 1.0, 100, 1.6);
  vi.position.set(0, 60, -40);
  scene.add(vi);

  // ── Compass-dedicated lights ───────────────────────────────────────────────
  // These are tuned to the compass Y position (-4.48) and its radius.
  // The goal: make the TorusGeometry rim catch a visible highlight on top,
  // the stepped rings show a gradient from bright to shadow, and the
  // compass face text reads clearly.

  // Primary key — warm gold from upper-left.
  // Strong enough to create a bright specular highlight on the rim top.
  const ck = new THREE.PointLight(0xffc844, IS_MOBILE ? 5.5 : 8.5, 48, 1.5);
  ck.position.set(-9, 20, 7);
  scene.add(ck);

  // Secondary from upper-right — fills the right half of the rim, reduces harsh shadow.
  const cr = new THREE.PointLight(0xffb030, IS_MOBILE ? 3.0 : 4.8, 44, 1.6);
  cr.position.set(11, 16, -5);
  scene.add(cr);

  // Fill from below the horizon — catches the rim underside edge, creates depth.
  const cf = new THREE.PointLight(0x3a5880, IS_MOBILE ? 0.90 : 1.45, 40, 2.0);
  cf.position.set(0, -6, 10);
  scene.add(cf);

  // Top zenith — even, bright, ensures every text label on the face is legible.
  const ct = new THREE.PointLight(0xfff5e0, IS_MOBILE ? 3.0 : 4.8, 38, 1.4);
  ct.position.set(0, 26, 0);
  scene.add(ct);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP + HOVER + CLICK NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

const tooltip  = document.getElementById("lkp-tooltip");
const raycaster = new THREE.Raycaster();
const pointer   = new THREE.Vector2(-10, -10);
const miniRaycaster = new THREE.Raycaster();
const miniPointer   = new THREE.Vector2(-10, -10);
const mobileRaycaster = new THREE.Raycaster();

let hoveredId    = null;
let miniHoveredId = null;
let mobileHoveredId = null;
let activeGalaxyId = null;
let selectedGalaxyId = null;

const CULTURE_LABELS = { kanaka: "K\u0101naka Maoli", kemet: "Kemet", bridge: "The Bridge" };
const CULTURE_COLORS = { kanaka: "#3cb371", kemet: "#f0c96a", bridge: "#7b88ff" };
const LESSON_URL     = "LKP/lessons.html#";

function syncCultureMapsFromData(cultures) {
  if (!Array.isArray(cultures)) return;
  cultures.forEach((culture) => {
    if (!culture?.id) return;
    const colors = window.LKP_GALAXY_BUILDER?.getCultureThemeColors
      ? window.LKP_GALAXY_BUILDER.getCultureThemeColors(culture)
      : null;
    CULTURE_LABELS[culture.id] = culture.name || culture.id;
    CULTURE_COLORS[culture.id] = colors
      ? `#${colors.main.toString(16).padStart(6, "0")}`
      : CULTURE_COLORS[culture.id] || "#54c6ee";
  });
}

function getConceptFromEvent(e, domEl, cam, ray) {
  if (!domEl || !cam) return null;
  const b = domEl.getBoundingClientRect();
  if (!b.width || !b.height) return null;

  const p = new THREE.Vector2(
    ((e.clientX - b.left) / b.width) * 2 - 1,
    -((e.clientY - b.top) / b.height) * 2 + 1
  );

  ray.setFromCamera(p, cam);
  const hits = ray.intersectObjects(pickable, false);
  if (!hits.length) return null;

  const id = hits[0].object?.userData?.conceptId;
  return id ? CONCEPT_MAP.get(id) || null : null;
}

function setPointerFromEvent(e) {
  const b = renderer.domElement.getBoundingClientRect();
  pointer.x =  ((e.clientX - b.left) / b.width)  * 2 - 1;
  pointer.y = -((e.clientY - b.top)  / b.height) * 2 + 1;

  if (tooltip) {
    const lx = e.clientX + 18, ly = e.clientY - 12;
    tooltip.style.left = `${lx}px`;
    tooltip.style.top  = `${ly}px`;
    if (lx + tooltip.offsetWidth > window.innerWidth)
      tooltip.style.left = `${Math.max(8, e.clientX - tooltip.offsetWidth - 12)}px`;
  }
}

function setMiniPointerFromEvent(e) {
  if (!miniRenderer?.domElement || !miniCamera) return;
  const b = miniRenderer.domElement.getBoundingClientRect();
  miniPointer.x = ((e.clientX - b.left) / b.width) * 2 - 1;
  miniPointer.y = -((e.clientY - b.top) / b.height) * 2 + 1;

  if (tooltip) {
    const lx = e.clientX + 18, ly = e.clientY - 12;
    tooltip.style.left = `${lx}px`;
    tooltip.style.top  = `${ly}px`;
    if (lx + tooltip.offsetWidth > window.innerWidth)
      tooltip.style.left = `${Math.max(8, e.clientX - tooltip.offsetWidth - 12)}px`;
  }
}

function setMobilePointerFromEvent(e) {
  if (!mobileRenderer?.domElement || !mobileCamera) return;
  if (tooltip) {
    const lx = e.clientX + 18, ly = e.clientY - 12;
    tooltip.style.left = `${lx}px`;
    tooltip.style.top  = `${ly}px`;
    if (lx + tooltip.offsetWidth > window.innerWidth) {
      tooltip.style.left = `${Math.max(8, e.clientX - tooltip.offsetWidth - 12)}px`;
    }
  }
}

renderer.domElement.addEventListener("pointermove", setPointerFromEvent, { passive: true });
renderer.domElement.addEventListener("pointerdown", setPointerFromEvent, { passive: true });

let lastTap      = 0;
let lastClickedId = null;
let zoomTarget   = null;
let zoomStart    = null;
let zoomProgress = 0;
let miniZoomTarget = null;
let miniZoomStart = null;
let miniZoomProgress = 0;

renderer.domElement.addEventListener("click", () => {
  if (!hoveredId) return;
  
  const c = CONCEPT_MAP.get(hoveredId);
  if (!c) return;

  const now = performance.now();
  const isDoubleClick = lastClickedId === hoveredId && (now - lastTap) < 400;
  lastClickedId = hoveredId;
  lastTap = now;

  // Find the galaxy this concept belongs to
  const galaxy = GALAXY_DEFS.find(g => g.id === c.galaxyId);
  if (!galaxy) return;

  if (isDoubleClick && c.lessonId) {
    // Trigger a brief surge before navigation to make relationships feel alive.
    triggerConnectionSurge(c.id, galaxy.id, 1.0);
    window.setTimeout(() => {
      window.location.href = LESSON_URL + c.lessonId;
    }, 260);
  } else {
    // Single-click zooms to the galaxy
    const galaxyPos = skyPos(galaxy.az, galaxy.alt, galaxy.r);
    startZoomTo(galaxyPos);
    selectedGalaxyId = galaxy.id;
    activeGalaxyId = galaxy.id;
    triggerConnectionSurge(c.id, galaxy.id, 0.9);
    startGuidedStory(galaxy.id);
  }
});

function startZoomTo(pos) {
  if (!pos) return;
  zoomTarget   = pos.clone().multiplyScalar(IS_MOBILE ? 0.26 : 0.22);
  zoomStart    = camera.position.clone();
  zoomProgress = 0;
  controls.autoRotate = false;
}

function startMiniZoomTo(pos) {
  if (!pos || !miniCamera || !miniControls) return;
  miniZoomTarget = pos.clone().multiplyScalar(IS_MOBILE ? 0.26 : 0.22);
  miniZoomStart = miniCamera.position.clone();
  miniZoomProgress = 0;
  miniControls.autoRotate = false;
}

function updateMiniTooltip(e) {
  miniHoveredId = getConceptFromEvent(e, miniRenderer?.domElement, miniCamera, miniRaycaster)?.id || null;

  if (!tooltip) return;

  if (miniHoveredId) {
    const c = CONCEPT_MAP.get(miniHoveredId);
    if (!c) return;

    tooltip.innerHTML = `
      <div class="lkp-tip__title" style="color:${c.hex}">${c.label}</div>
      <div class="lkp-tip__culture" style="color:${CULTURE_COLORS[c.culture] || "#fff"}">◈ ${CULTURE_LABELS[c.culture] || ""}</div>
      <div class="lkp-tip__action">${IS_MOBILE ? "Tap" : "Click"} to open this lesson →</div>
    `;
    tooltip.classList.remove("hidden");
    tooltip.classList.add("visible");
  }
}

function updateAuxTooltip(hoverId, actionLabel) {
  if (!tooltip) return;
  if (!hoverId) {
    tooltip.classList.remove("visible");
    tooltip.classList.add("hidden");
    return;
  }

  const c = CONCEPT_MAP.get(hoverId);
  if (!c) return;

  tooltip.innerHTML = `
    <div class="lkp-tip__title" style="color:${c.hex}">${c.label}</div>
    <div class="lkp-tip__culture" style="color:${CULTURE_COLORS[c.culture] || "#fff"}">◈ ${CULTURE_LABELS[c.culture] || ""}</div>
    <div class="lkp-tip__action">${actionLabel}</div>
  `;
  tooltip.classList.remove("hidden");
  tooltip.classList.add("visible");
}

renderer.domElement.addEventListener("dblclick", () => {
  if (hoveredId) {
    const c = CONCEPT_MAP.get(hoveredId);
    if (c) startZoomTo(skyPos(c.az, c.alt, c.r));
  } else {
    selectedGalaxyId = null;
    activeGalaxyId = null;
    zoomTarget   = getOverviewCameraPos();
    zoomStart    = camera.position.clone();
    zoomProgress = 0;
    window.setTimeout(() => { controls.autoRotate = !REDUCED_MOTION; }, 1800);
  }
});

renderer.domElement.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTap < 320) {
    e.preventDefault();
    if (hoveredId) {
      const c = CONCEPT_MAP.get(hoveredId);
      if (c) { startZoomTo(skyPos(c.az, c.alt, c.r)); return; }
    }
  }
  lastTap = now;
  if (!hoveredId) return;
  const c = CONCEPT_MAP.get(hoveredId);
  if (c?.lessonId) window.location.href = LESSON_URL + c.lessonId;
}, { passive: false });

if (miniViewerCanvas) {
  miniViewerCanvas.addEventListener("pointermove", (e) => {
    setMiniPointerFromEvent(e);
    updateMiniTooltip(e);
  }, { passive: true });

  miniViewerCanvas.addEventListener("pointerdown", (e) => {
    setMiniPointerFromEvent(e);
    updateMiniTooltip(e);
  }, { passive: true });

  miniViewerCanvas.addEventListener("pointerleave", () => {
    miniHoveredId = null;
    updateAuxTooltip(null, "");
  }, { passive: true });

  miniViewerCanvas.addEventListener("click", (e) => {
    const c = getConceptFromEvent(e, miniRenderer?.domElement, miniCamera, miniRaycaster);
    if (c?.lessonId) window.location.href = LESSON_URL + c.lessonId;
  });

  miniViewerCanvas.addEventListener("dblclick", (e) => {
    const c = getConceptFromEvent(e, miniRenderer?.domElement, miniCamera, miniRaycaster);
    if (c) {
      startMiniZoomTo(skyPos(c.az, c.alt, c.r));
      return;
    }

    if (!miniCamera || !miniControls) return;
    miniZoomTarget = getOverviewCameraPos();
    miniZoomStart = miniCamera.position.clone();
    miniZoomProgress = 0;
    window.setTimeout(() => {
      if (miniControls) miniControls.autoRotate = !REDUCED_MOTION;
    }, 1800);
  });
}

if (mobileViewerCanvas) {
  mobileViewerCanvas.addEventListener("pointermove", (e) => {
    setMobilePointerFromEvent(e);
    mobileHoveredId = getConceptFromEvent(e, mobileRenderer?.domElement, mobileCamera, mobileRaycaster)?.id || null;
    updateAuxTooltip(mobileHoveredId, `${IS_MOBILE ? "Tap" : "Click"} to open this lesson →`);
  }, { passive: true });

  mobileViewerCanvas.addEventListener("pointerdown", (e) => {
    setMobilePointerFromEvent(e);
    mobileHoveredId = getConceptFromEvent(e, mobileRenderer?.domElement, mobileCamera, mobileRaycaster)?.id || null;
    updateAuxTooltip(mobileHoveredId, `${IS_MOBILE ? "Tap" : "Click"} to open this lesson →`);
  }, { passive: true });

  mobileViewerCanvas.addEventListener("pointerleave", () => {
    mobileHoveredId = null;
    updateAuxTooltip(null, "");
  }, { passive: true });

  mobileViewerCanvas.addEventListener("click", (e) => {
    const c = getConceptFromEvent(e, mobileRenderer?.domElement, mobileCamera, mobileRaycaster);
    if (c?.lessonId) window.location.href = LESSON_URL + c.lessonId;
  });

  mobileViewerCanvas.addEventListener("dblclick", (e) => {
    const c = getConceptFromEvent(e, mobileRenderer?.domElement, mobileCamera, mobileRaycaster);
    if (c) {
      if (!mobileCamera || !mobileControls) return;
      mobileCamera.position.copy(skyPos(c.az, c.alt, c.r).multiplyScalar(IS_MOBILE ? 0.26 : 0.22));
      mobileControls.autoRotate = false;
      return;
    }

    if (!mobileCamera || !mobileControls) return;
    mobileCamera.position.copy(getOverviewCameraPos());
    mobileControls.target.set(0, 0, 0);
    mobileControls.autoRotate = !REDUCED_MOTION;
    mobileControls.update();
  });
}

function updateTooltip() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickable, false);
  const hit  = hits.length ? hits[0].object : null;

  hoveredId    = hit ? hit.userData.conceptId : null;

  renderer.domElement.style.cursor = hoveredId ? "pointer" : "default";

  if (!tooltip) return;

  if (hoveredId) {
    const c = CONCEPT_MAP.get(hoveredId);
    if (!c) return;

    tooltip.innerHTML = `
      <div class="lkp-tip__title" style="color:${c.hex}">${c.label}</div>
      <div class="lkp-tip__culture" style="color:${CULTURE_COLORS[c.culture] || "#fff"}">◈ ${CULTURE_LABELS[c.culture] || ""}</div>
      <div class="lkp-tip__action">${IS_MOBILE ? "Tap" : "Click"} to study this lesson →</div>
    `;
    tooltip.classList.remove("hidden");
    tooltip.classList.add("visible");
  } else {
    tooltip.classList.remove("visible");
    tooltip.classList.add("hidden");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON IMAGE HOOKS
// ─────────────────────────────────────────────────────────────────────────────

window.LKP_getComparisonImage = function(type) {
  if (type === "aloha") return loadedImages.alohaCompare || null;
  if (type === "maat")  return loadedImages.maatCompare  || null;
  return null;
};

window.LKP_getComparisonImageSrc = function(type) {
  const img = window.LKP_getComparisonImage(type);
  return img ? img.src : "";
};

window.LKP_mountComparisonImage = function(type, targetSelector) {
  const img    = window.LKP_getComparisonImage(type);
  const target = document.querySelector(targetSelector);
  if (!img || !target) return false;
  target.innerHTML = "";
  const clone = new window.Image();
  clone.src = img.src;
  clone.alt = type === "aloha" ? "Aloha comparison image" : "Ma\u02beat comparison image";
  clone.loading = "lazy"; clone.decoding = "async";
  clone.className = `lkp-comparison-img lkp-comparison-img--${type}`;
  target.appendChild(clone);
  return true;
};

function autoMountComparisonImages() {
  document.querySelectorAll("[data-lkp-comparison-image]").forEach((el) => {
    const type = el.getAttribute("data-lkp-comparison-image");
    if (type === "aloha" || type === "maat")
      window.LKP_mountComparisonImage(type, `[data-lkp-comparison-image="${type}"]`);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION LOOP
// ─────────────────────────────────────────────────────────────────────────────

const clock = new THREE.Clock();

function onFrame() {
  const t   = clock.getElapsedTime();
  const now = performance.now();
  const spd = REDUCED_MOTION ? 0.14 : 1.0;
  const hoveredGalaxyId = hoveredId ? (CONCEPT_MAP.get(hoveredId)?.galaxyId || null) : null;
  const focusedGalaxyId = selectedGalaxyId || hoveredGalaxyId;

  if (storyFocus.active && now > storyFocus.startedAt + storyFocus.totalMs) {
    storyFocus.active = false;
    selectedGalaxyId = null;
    activeGalaxyId = null;
  }

  activeGalaxyId = focusedGalaxyId;

  compassGrp.rotation.y = -t * 0.038 * spd;

  if (compassFloorMesh) {
    // MeshBasicMaterial: fade opacity to 1 on load.
    compassFloorMesh.material.opacity = THREE.MathUtils.lerp(
      compassFloorMesh.material.opacity, 1.0, 0.08
    );
  }

  galaxyObjects.forEach((obj, gId) => {
    const isActive = focusedGalaxyId === gId;
    const pulse = REDUCED_MOTION ? 0 : Math.sin(t * 0.9 + (gId === "kanaka" ? 0 : Math.PI)) * (IS_MOBILE ? 0.035 : 0.06);
    
    // Breathing effect: subtle scale expansion/contraction
    const breathe = REDUCED_MOTION ? 0 : Math.sin(t * 0.4) * 0.015;

    obj.coreGlow.material.opacity  = THREE.MathUtils.lerp(obj.coreGlow.material.opacity,  isActive ? 0.88 : 0.70 + pulse,      0.06);
    obj.outerGlow.material.opacity = THREE.MathUtils.lerp(obj.outerGlow.material.opacity, isActive ? 0.54 : 0.38 + pulse * 0.5, 0.05);
    if (obj.nebula) {
      const nPulse = REDUCED_MOTION ? 0 : Math.sin(t * 0.38 * obj.nebula.userData.pulse + obj.nebula.userData.phase) * 0.04;
      obj.nebula.material.opacity = THREE.MathUtils.lerp(
        obj.nebula.material.opacity,
        isActive ? obj.nebula.userData.baseOpacity + 0.14 : obj.nebula.userData.baseOpacity + nPulse,
        0.045
      );
      if (!REDUCED_MOTION) obj.nebula.rotation.z += 0.00045 * obj.nebula.userData.pulse * spd;
    }
    obj.mat.opacity                = THREE.MathUtils.lerp(obj.mat.opacity,                isActive ? 0.70 : 0.52,               0.04);
    
    // Galaxy core breathing
    obj.grp.scale.setScalar(1 + breathe);

    if (!REDUCED_MOTION) {
      obj.grp.rotation.z += (IS_MOBILE ? 0.00014 : 0.00025) * spd * (gId === "kanaka" ? 1 : -1);
    }
  });

  constellationLines.forEach((ln) => {
    let targetOpacity = ln.dormantOpacity;
    const touchesHover = hoveredId && (ln.aId === hoveredId || ln.bId === hoveredId);

    if (focusedGalaxyId) {
      if (ln.isIntra) {
        targetOpacity = ln.cultureId === focusedGalaxyId ? ln.baseOpacity : ln.dormantOpacity * 0.6;
      } else {
        const touchesFocused = ln.aGalaxyId === focusedGalaxyId || ln.bGalaxyId === focusedGalaxyId;
        targetOpacity = touchesFocused ? ln.baseOpacity * 0.74 : ln.dormantOpacity * 0.55;
      }
    }

    if (touchesHover) {
      targetOpacity = Math.max(targetOpacity, ln.baseOpacity * 1.04);
    }

    // Seasonal "knowledge tides" pulse per culture/connection.
    const tide = REDUCED_MOTION ? 0 : (Math.sin(t * 0.52 + ln.phase) * 0.5 + 0.5);
    const tideBoost = ln.isIntra ? (0.05 + tide * 0.10) : (0.02 + tide * 0.05);

    // Event surge temporarily amplifies related lines.
    if (ln.surgeUntil > now) {
      const k = (ln.surgeUntil - now) / 2200;
      targetOpacity += (ln.surgeBoost || 0) * k * 0.22;
    } else {
      ln.surgeBoost = 0;
    }

    // Depth layering: farther connections feel softer.
    const depthDist = camera.position.distanceTo(ln.mid);
    const depthFactor = THREE.MathUtils.clamp(1.15 - ((depthDist - 22) / 58), 0.38, 1.0);

    // Growth trace reveal on load/new additions.
    const revealAlpha = THREE.MathUtils.clamp((now - ln.revealAt) / 900, 0, 1);

    targetOpacity = (targetOpacity + tideBoost) * depthFactor * revealAlpha;

    ln.mat.opacity = THREE.MathUtils.lerp(ln.mat.opacity, targetOpacity, 0.11);
  });

  conceptNodes.forEach((cn, idx) => {
    cn.crystal.rotation.y += (IS_MOBILE ? 0.006 : 0.009) * spd;
    cn.crystal.rotation.x  = Math.sin(t * 0.38 + idx * 0.88) * 0.20;
    cn.wire.rotation.y    -= (IS_MOBILE ? 0.004 : 0.006) * spd;
    cn.wire.rotation.z     = Math.sin(t * 0.28 + idx * 0.62) * 0.14;

    const isHov  = hoveredId === cn.concept.id;
    const pulse  = REDUCED_MOTION ? 0 : Math.sin(t * 1.5 + cn.phase) * (IS_MOBILE ? 0.08 : 0.13);
    
    // Count incoming connections for this concept
    let connectionCount = 0;
    CONNECTIONS.forEach((conn) => {
      const aId = conn.aId;
      const bId = conn.bId;
      if (aId === cn.concept.id || bId === cn.concept.id) connectionCount++;
    });
    const connectionGlow = (connectionCount / Math.max(1, CONNECTIONS.length)) * 0.15;

    const revealNode = THREE.MathUtils.clamp((now - cn.revealAt) / (cn.isNewLesson ? 520 : 840), 0, 1);
    const guideIdx = storyFocus.active
      ? Math.floor((now - storyFocus.startedAt) / storyFocus.stepMs)
      : -1;
    const guideConceptId = storyFocus.active && guideIdx >= 0 && guideIdx < storyFocus.path.length
      ? storyFocus.path[guideIdx]
      : null;
    const inFocusedGalaxy = focusedGalaxyId && cn.concept.galaxyId === focusedGalaxyId;
    const dimForStory = storyFocus.active && !inFocusedGalaxy;
    const spotlight = guideConceptId && cn.concept.id === guideConceptId;

    cn.crystal.material.emissiveIntensity = THREE.MathUtils.lerp(
      cn.crystal.material.emissiveIntensity,
      spotlight ? 1.06 : isHov ? 0.96 : cn.concept.major ? 0.62 : 0.50,
      0.12
    );

    const opacityGate = dimForStory ? 0.26 : 1.0;
    cn.crystal.material.opacity = THREE.MathUtils.lerp(cn.crystal.material.opacity, 0.90 * revealNode * opacityGate, 0.12);
    cn.wire.material.opacity = THREE.MathUtils.lerp(cn.wire.material.opacity, (IS_MOBILE ? 0.15 : 0.20) * revealNode * opacityGate, 0.12);
    cn.label.material.opacity = THREE.MathUtils.lerp(cn.label.material.opacity, (IS_MOBILE ? 0.80 : 0.88) * revealNode * (dimForStory ? 0.35 : 1.0), 0.12);

    cn.glow.material.opacity = THREE.MathUtils.lerp(
      cn.glow.material.opacity,
      (cn.baseOpacity + pulse + connectionGlow + (isHov ? 0.24 : 0) + (spotlight ? 0.25 : 0)) * revealNode * opacityGate,
      0.10
    );
    const targetScale = spotlight ? 1.46 : isHov ? 1.30 : 1.0;
    cn.grp.scale.setScalar(THREE.MathUtils.lerp(cn.grp.scale.x, targetScale * (0.82 + revealNode * 0.18), 0.12));
    
    // Subtle breathing/pulsing based on concept importance
    const breathe = REDUCED_MOTION ? 0 : Math.sin(t * 0.5 + idx) * 0.02;
    cn.grp.scale.multiplyScalar(1 + breathe * 0.1);
  });

  flowItems.forEach((dot) => {
    if (dot.userData.bornAt && now < dot.userData.bornAt) {
      dot.material.opacity = 0;
      return;
    }

    dot.userData.t = (dot.userData.t + dot.userData.speed) % 1;
    dot.position.copy(dot.userData.curve.getPoint(dot.userData.t));
    const ft = dot.userData.t;
    
    // Pulsing along the connection line
    const linePulse = Math.sin(t * 2.2 + dot.userData.t * 6) * 0.3;
    const opacityBase = dot.userData.maxOp * (ft < 0.08 ? ft / 0.08 : ft > 0.90 ? (1 - ft) / 0.10 : 1);
    
    const lineRef = dot.userData.lineRef;
    const surgeBoost = lineRef && lineRef.surgeUntil > now ? 1 + ((lineRef.surgeUntil - now) / 2200) * 0.7 : 1;
    dot.material.opacity = opacityBase * (1 + linePulse * 0.5) * surgeBoost;
    dot.scale.setScalar(1 + Math.sin(t * 1.8 + ft * 4) * 0.15); // Pulsing scale
  });

  if (iwaSpr) {
    if (!REDUCED_MOTION) {
      iwaAngle += (IS_MOBILE ? 0.00125 : 0.0018) * spd;
      const iR = IS_MOBILE ? 18 : 30;
      const iH = (IS_MOBILE ? 14 : 16) + Math.sin(t * 0.24) * (IS_MOBILE ? 3.5 : 5);
      iwaSpr.position.set(Math.cos(iwaAngle) * iR, iH, Math.sin(iwaAngle) * iR);
      iwaSpr.material.opacity = 0.48 + Math.sin(t * 1.6) * 0.16;
      const flip = Math.cos(iwaAngle) > 0 ? 1 : -1;
      iwaSpr.scale.set(Math.abs(iwaSpr.scale.x) * flip, iwaSpr.scale.y, 1);
    } else {
      iwaSpr.position.set(20, 16, 0);
      iwaSpr.material.opacity = 0.40;
    }
  }

  if (!REDUCED_MOTION) {
    twinkles.forEach((spr) => {
      if (now >= spr.userData.nextFlash) {
        const age = now - spr.userData.nextFlash;
        spr.material.opacity = age < 550 ? Math.sin((age / 550) * Math.PI) * 0.84 : 0;
        if (age >= 550) spr.userData.nextFlash = now + 2500 + Math.random() * 8000;
      }
    });
  }

  if (zoomTarget && zoomProgress < 1) {
    zoomProgress = Math.min(1, zoomProgress + (IS_MOBILE ? 0.034 : 0.028));
    const ease = 1 - Math.pow(1 - zoomProgress, 3);
    camera.position.lerpVectors(zoomStart, zoomTarget, ease);
    if (zoomProgress >= 1) zoomTarget = null;
  }

  if (miniZoomTarget && miniZoomProgress < 1 && miniCamera) {
    miniZoomProgress = Math.min(1, miniZoomProgress + (IS_MOBILE ? 0.034 : 0.028));
    const ease = 1 - Math.pow(1 - miniZoomProgress, 3);
    miniCamera.position.lerpVectors(miniZoomStart, miniZoomTarget, ease);
    if (miniZoomProgress >= 1) miniZoomTarget = null;
  }

  updateTooltip();
  controls.update();
  composer.render();
  syncMiniViewer();
  syncMobileViewer();
}

// ─────────────────────────────────────────────────────────────────────────────
// RESIZE / ORIENTATION
// ─────────────────────────────────────────────────────────────────────────────

function handleResize() {
  IS_MOBILE = getIsMobile();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov    = IS_MOBILE ? 78 : 72;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(getSafePixelRatio());
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloom.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMappingExposure = IS_MOBILE ? 1.02 : 1.08;
  scene.fog.density     = IS_MOBILE ? 0.0055 : 0.004;
  controls.zoomSpeed    = IS_MOBILE ? 0.42 : 0.55;
  controls.maxDistance  = IS_MOBILE ? 150 : 220;
  controls.panSpeed     = IS_MOBILE ? 0.34 : 0.48;
  controls.rotateSpeed  = IS_MOBILE ? -0.34 : -0.42;
  controls.autoRotateSpeed = IS_MOBILE ? 0.14 : 0.22;
  resizeAuxViewers();
}

window.addEventListener("resize",            handleResize,                         { passive: true });
window.addEventListener("orientationchange", () => window.setTimeout(handleResize, 250), { passive: true });

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function injectLoader() {
  if (document.getElementById("lkp-loader")) return;
  const iconPrimary = assetUrl("LKP/assets/images/LKP-1.png");
  const iconAltA    = assetUrl("LKP/assets/images/LKP-2.png");
  const iconAltB    = assetUrl("assets/images/LKP-1.png");
  const el = document.createElement("div");
  el.id = "lkp-loader";
  el.innerHTML = `
    <div class="lkp-loader__inner">
      <div class="lkp-loader__icon-wrap">
        <div class="lkp-loader__fill"></div>
        <img class="lkp-loader__icon" src="${iconPrimary}" alt="The Living Knowledge Platform" loading="eager" decoding="sync" onerror="if(this.dataset.fbk!=='1'){this.dataset.fbk='1';this.src='${iconAltA}';return;} if(this.dataset.fbk!=='2'){this.dataset.fbk='2';this.src='${iconAltB}';return;}" />
        <div class="lkp-loader__ring"></div>
        <div class="lkp-loader__upload"></div>
      </div>
      <div class="lkp-loader__title">Living Knowledge</div>
      <div class="lkp-loader__sub">Uploading the living archive&hellip;</div>
    </div>
  `;
  document.body.appendChild(el);
}

let loaderFailsafeTimer = null;

function armLoaderFailsafe(ms = 6500) {
  if (loaderFailsafeTimer) window.clearTimeout(loaderFailsafeTimer);
  loaderFailsafeTimer = window.setTimeout(() => {
    dismissLoader();
  }, ms);
}

function dismissLoader() {
  const el = document.getElementById("lkp-loader");
  if (!el) return;
  if (loaderFailsafeTimer) {
    window.clearTimeout(loaderFailsafeTimer);
    loaderFailsafeTimer = null;
  }
  el.classList.add("out");
  window.setTimeout(() => el.remove(), 800);
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG HELPERS
// ─────────────────────────────────────────────────────────────────────────────

window.LKP_debugAssets = function() {
  console.table(loadedImageUrls);
  return { images: loadedImages, urls: loadedImageUrls };
};

window.LKP_debugCompass = function() {
  console.log("[LKP] Compass image:", loadedImages.compass);
  console.log("[LKP] Compass URL:",   loadedImageUrls.compass);
  console.log("[LKP] Compass floor mesh:", compassFloorMesh);
  return { image: loadedImages.compass || null, url: loadedImageUrls.compass || "", floorMesh: compassFloorMesh || null };
};

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────

async function init() {
  injectLoader();
  armLoaderFailsafe();

  try {
    // Generate galaxy definitions dynamically from CULTURALVERSE_DATA
    if (window.LKP_GALAXY_BUILDER && window.CULTURALVERSE_DATA) {
      syncCultureMapsFromData(window.CULTURALVERSE_DATA.cultures);

      GALAXY_DEFS = window.LKP_GALAXY_BUILDER.buildGalaxyDefsFromData(
        window.CULTURALVERSE_DATA.cultures,
        IS_MOBILE
      );

      BRIDGE_CONCEPTS.length = 0;

      ALL_CONCEPTS = [
        ...GALAXY_DEFS.flatMap((g) =>
          g.concepts.map((c) => ({ ...c, culture: g.id, galaxyId: g.id }))
        )
      ];

      CONCEPT_MAP = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));

      const seenLessons = safeReadSeenLessons();
      const allLessonIds = new Set(ALL_CONCEPTS.map((c) => c.lessonId).filter(Boolean));
      newLessonIds = new Set(Array.from(allLessonIds).filter((id) => !seenLessons.has(id)));
      safeWriteSeenLessons(allLessonIds);

      // Generate dynamic connections from enrichment data
      CONNECTIONS.length = 0;

      const intraConnections = buildIntraCultureConnections(GALAXY_DEFS);
      const crossConnectionsRaw = window.LKP_GALAXY_BUILDER.buildConnectionsFromData
        ? window.LKP_GALAXY_BUILDER.buildConnectionsFromData(window.CULTURALVERSE_DATA.cultures)
        : [];

      const crossConnections = crossConnectionsRaw.map(([aId, bId, str]) => ({
        aId,
        bId,
        str,
        type: "cross"
      }));

      CONNECTIONS.push(...intraConnections, ...crossConnections);
      console.log('[LKP Three] Generated', intraConnections.length, 'intra-culture and', crossConnections.length, 'cross-culture connections');

      console.log('[LKP Three] Generated', GALAXY_DEFS.length, 'galaxies from CULTURALVERSE_DATA');
    } else {
      console.warn('[LKP Three] Galaxy builder or data unavailable; using legacy approach');
    }
    await preloadImages();

    makeLights();
    makeBackgroundStars();
    makeGalaxies();

    GALAXY_DEFS.forEach(makeGalaxyCoreDisc);

    makeAllConceptNodes();
    makeConstellations();

    makeStarCompass();
    makeCompassImageOverlay();

    makeIwaBird();
    makeTwinkles();

    autoMountComparisonImages();
    handleResize();

    let firstFrame = true;

    renderer.setAnimationLoop(() => {
      onFrame();
      if (firstFrame) { firstFrame = false; dismissLoader(); }
    });
  } catch (err) {
    console.error("[LKP] Viewer init failed:", err);
    dismissLoader();
  }
}

init();
