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
    "assets/images/kemet.png",
    "assets/k/kemet.png",
    "assets/k/kemet-icon.png"
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
// DESIGN GOAL: bright, readable gold lines on a transparent background.
// The compass image has black ink on white paper. We want:
//   - White/near-white paper → fully transparent (alpha 0)
//   - Dark ink (text, lines, markings) → bright gold, fully opaque
//
// This gives us crisp gold compass art floating on the dark sky,
// with every cardinal point, direction label, and degree marking visible.
//
// CAPTION REMOVAL: Math.min crops the square-shorter-dimension so any
// caption text in the extra height/width margins is never drawn. A clip
// at 0.496 radius keeps the outermost compass labels and removes
// corner remnants. Because corners are white = already transparent from
// the pixel pass, the clip is just a safety boundary.
function makeGoldCompassTexture(imgEl) {
  const sourceW = imgEl.naturalWidth  || imgEl.width  || 1024;
  const sourceH = imgEl.naturalHeight || imgEl.height || 1024;

  // Square crop on the shorter dimension — excludes caption strips.
  const size = Math.min(sourceW, sourceH);
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = canvas.height = size;

  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const sx = (sourceW - size) / 2;
  const sy = (sourceH - size) / 2;
  ctx.drawImage(imgEl, sx, sy, size, size, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data      = imageData.data;

  // High-contrast bright gold palette — readable against dark backgrounds.
  const goldBright = { r: 255, g: 238, b: 155 };  // bright warm gold (highlight)
  const goldMid    = { r: 238, g: 185, b: 68  };  // standard gold
  const goldDeep   = { r: 155, g: 105, b: 22  };  // deep shadow gold

  let visiblePixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a === 0) continue;

    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat  = maxC - minC;
    const lum  = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    // ── PAPER / WHITE BACKGROUND ─────────────────────────────────────────
    // Anything luminance >= 0.58 is paper, JPG haze, or off-white background.
    // Remove it completely.
    if (lum >= 0.58) {
      data[i+3] = 0;
      continue;
    }

    // ── ANTI-ALIAS HALO (lum 0.40 – 0.58) ───────────────────────────────
    // These are the soft edge pixels around ink lines — feather them out
    // so lines look smooth not chunky.
    if (lum >= 0.40) {
      const fade = (lum - 0.40) / 0.18;            // 0 at lum=0.40 → 1 at lum=0.58
      data[i+3] = Math.round(a * (1 - fade));
      if (data[i+3] <= 8) { data[i+3] = 0; continue; }
      // Still convert to gold for the partial pixels
    }

    // ── INK / ARTWORK (lum < 0.40) ───────────────────────────────────────
    // These are compass lines, text, the ʻiwa bird silhouette, degree marks.
    // Convert to bright gold — fully opaque so they pop against dark space.
    const darkness  = THREE.MathUtils.clamp(1 - lum / 0.40, 0, 1); // 0→1 as lum 0.40→0
    const strength  = THREE.MathUtils.clamp(darkness * 1.2, 0, 1);  // boost for thin lines

    // Lerp from goldDeep (for barely-dark edges) → goldBright (for solid black ink)
    const t = THREE.MathUtils.clamp(darkness * darkness, 0, 1);     // quadratic — snappier

    data[i]   = Math.round(goldDeep.r + (goldBright.r - goldDeep.r) * t);
    data[i+1] = Math.round(goldDeep.g + (goldBright.g - goldDeep.g) * t);
    data[i+2] = Math.round(goldDeep.b + (goldBright.b - goldDeep.b) * t);

    // Solid ink pixels = fully opaque. Halo pixels already handled above.
    if (lum < 0.40) {
      data[i+3] = Math.round(200 + 55 * darkness);  // 200-255, solid lines are 255
    }

    visiblePixels++;
  }

  ctx.putImageData(imageData, 0, 0);

  // ── SUBTLE GOLD RADIANCE PASS ─────────────────────────────────────────
  // Warm glow bloom around the ink lines — makes them feel lit from within.
  const glowCanvas = document.createElement("canvas");
  const glowCtx    = glowCanvas.getContext("2d");
  glowCanvas.width = glowCanvas.height = size;

  glowCtx.clearRect(0, 0, size, size);
  glowCtx.drawImage(canvas, 0, 0);
  glowCtx.globalCompositeOperation = "source-in";
  glowCtx.fillStyle = "rgba(255, 200, 60, 0.38)";
  glowCtx.fillRect(0, 0, size, size);

  const outCanvas = document.createElement("canvas");
  const outCtx    = outCanvas.getContext("2d");
  outCanvas.width = outCanvas.height = size;

  outCtx.clearRect(0, 0, size, size);
  outCtx.filter      = "blur(0.75px)";
  outCtx.globalAlpha = 0.22;
  outCtx.drawImage(glowCanvas, 0, 0);     // subtle glow bloom
  outCtx.filter      = "none";
  outCtx.globalAlpha = 1.0;
  outCtx.drawImage(canvas, 0, 0);         // sharp artwork on top

  // ── SANITY CHECK ──────────────────────────────────────────────────────
  const visibleRatio = visiblePixels / Math.max(1, size * size);
  if (visibleRatio < 0.0005) {
    console.warn("[LKP] Compass texture: too little survived, falling back.");
    return makeTextureFromImage(imgEl);
  }

  // ── CIRCULAR CLIP ─────────────────────────────────────────────────────
  // 0.496 keeps the outermost label ring (NW Horizon, SE Horizon etc.).
  // Caption text in corners = white = already transparent, so clip is cosmetic.
  const clipCanvas = document.createElement("canvas");
  const clipCtx    = clipCanvas.getContext("2d");
  clipCanvas.width = clipCanvas.height = size;

  clipCtx.clearRect(0, 0, size, size);
  clipCtx.save();
  clipCtx.beginPath();
  clipCtx.arc(size / 2, size / 2, size * 0.496, 0, Math.PI * 2);
  clipCtx.closePath();
  clipCtx.clip();
  clipCtx.drawImage(outCanvas, 0, 0);

  // ── SPECULAR HIGHLIGHT ────────────────────────────────────────────────
  // Bake in a subtle bright top-left highlight — makes the 3D dome feel lit.
  // Applied as source-atop so it only tints the ink pixels, not the transparent ones.
  const specGrd = clipCtx.createRadialGradient(
    size * 0.30, size * 0.24, 0,
    size * 0.50, size * 0.50, size * 0.496
  );
  specGrd.addColorStop(0,    "rgba(255, 252, 210, 0.18)");
  specGrd.addColorStop(0.25, "rgba(255, 230, 140, 0.08)");
  specGrd.addColorStop(0.65, "rgba(30,   15,   0, 0.02)");
  specGrd.addColorStop(1,    "rgba(0,     0,   0, 0.20)");

  clipCtx.globalCompositeOperation = "source-atop";
  clipCtx.fillStyle = specGrd;
  clipCtx.fillRect(0, 0, size, size);
  clipCtx.restore();

  console.log(
    "[LKP] Gold compass texture — visible ratio:", visibleRatio.toFixed(4),
    "| size:", size, "| src:", sourceW, "x", sourceH
  );

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

camera.position.set(0, IS_MOBILE ? 1.9 : 1.6, 0);

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
controls.enablePan = false;
controls.enableZoom = true;
controls.zoomSpeed = IS_MOBILE ? 0.42 : 0.55;
controls.minDistance = 1;
controls.maxDistance = IS_MOBILE ? 92 : 120;
controls.rotateSpeed = IS_MOBILE ? -0.34 : -0.42;
controls.minPolarAngle = 0.28;
controls.maxPolarAngle = Math.PI * 0.86;
controls.autoRotate = !REDUCED_MOTION;
controls.autoRotateSpeed = IS_MOBILE ? 0.14 : 0.22;
controls.target.set(0, 0, 0);

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

const GALAXY_DEFS = [
  {
    id: "kanaka",
    name: "K\u0101naka Maoli",
    type: "spiral",
    color: 0x3cb371,
    hex: "#3cb371",
    assetKey: "kanaka",
    az: 54, alt: 44, r: 72,
    particleCount: IS_MOBILE ? 420 : 1400,
    concepts: [
      { id: "kumulipo",  label: "Kumulipo",       lessonId: "km-kumulipo",   color: 0x5eeebb, hex: "#5eeebb", az: 48, alt: 56, r: 68, major: true  },
      { id: "aloha",     label: "Aloha",           lessonId: "km-kumulipo",   color: 0x80ffbe, hex: "#80ffbe", az: 34, alt: 46, r: 70, major: true  },
      { id: "wayfinding",label: "Wayfinding",      lessonId: "km-starcompass",color: 0x44ddaa, hex: "#44ddaa", az: 66, alt: 40, r: 71, major: false },
      { id: "hokuleaa",  label: "H\u014dk\u016ble\u02bca", lessonId: "km-hokuleaa",  color: 0x5ce8c4, hex: "#5ce8c4", az: 42, alt: 62, r: 67, major: false },
      { id: "ahupuaa",   label: "Ahupu\u02bca\u02bca",     lessonId: "km-ahupuaa",   color: 0x3cb371, hex: "#3cb371", az: 78, alt: 32, r: 73, major: false },
      { id: "kalo",      label: "Kalo",            lessonId: "km-loikalo",    color: 0x44cc88, hex: "#44cc88", az: 88, alt: 26, r: 74, major: false },
      { id: "mana",      label: "Mana",            lessonId: "km-kumulipo",   color: 0x54c6ee, hex: "#54c6ee", az: 58, alt: 50, r: 69, major: false },
      { id: "pono",      label: "Pono",            lessonId: "km-kumulipo",   color: 0x3cb371, hex: "#3cb371", az: 28, alt: 38, r: 72, major: false },
      { id: "olelo",     label: "\u02bco\u0301lelo Hawai\u02bbi", lessonId: "km-olelo", color: 0x44ddaa, hex: "#44ddaa", az: 70, alt: 48, r: 70, major: false },
      { id: "laau",      label: "La\u02beau Lapa\u02beau", lessonId: "km-laau",      color: 0x44cc66, hex: "#44cc66", az: 96, alt: 20, r: 74, major: false }
    ]
  },
  {
    id: "kemet",
    name: "Kemet",
    type: "elliptical",
    color: 0xf0c96a,
    hex: "#f0c96a",
    assetKey: "kemet",
    az: 158, alt: 42, r: 72,
    particleCount: IS_MOBILE ? 360 : 1200,
    concepts: [
      { id: "maat",       label: "Ma\u02beat",      lessonId: "ke-maat",        color: 0xf0c96a, hex: "#f0c96a", az: 152, alt: 54, r: 68, major: true  },
      { id: "nun",        label: "Nun",             lessonId: "ke-nun",         color: 0x6699ff, hex: "#6699ff", az: 130, alt: 62, r: 67, major: true  },
      { id: "ennead",     label: "Ennead",          lessonId: "ke-ennead",      color: 0xf0c96a, hex: "#f0c96a", az: 170, alt: 38, r: 71, major: false },
      { id: "ptah",       label: "Ptah",            lessonId: "ke-ptah",        color: 0xd4ae5a, hex: "#d4ae5a", az: 142, alt: 34, r: 73, major: false },
      { id: "medunetjer", label: "Medu Netjer",     lessonId: "ke-medunetjer",  color: 0xf0c96a, hex: "#f0c96a", az: 186, alt: 26, r: 74, major: false },
      { id: "duat",       label: "Duat",            lessonId: "ke-maat",        color: 0x9272f5, hex: "#9272f5", az: 162, alt: 20, r: 74, major: false },
      { id: "imhotep",    label: "Imhotep",         lessonId: "ke-medicine",    color: 0xd4ae5a, hex: "#d4ae5a", az: 120, alt: 42, r: 71, major: false },
      { id: "kabakh",     label: "Ka \u00b7 Ba \u00b7 Akh", lessonId: "ke-maat", color: 0xf0c96a, hex: "#f0c96a", az: 198, alt: 30, r: 72, major: false },
      { id: "isfet",      label: "Isfet",           lessonId: "ke-maat",        color: 0xe06868, hex: "#e06868", az: 174, alt: 16, r: 76, major: false }
    ]
  }
];

const BRIDGE_CONCEPTS = [
  { id: "br-creation",  label: "Creation from P\u014d",  lessonId: "bridge-darkness",   color: 0x8899ff, hex: "#8899ff", az: 350, alt: 72, r: 62, major: true  },
  { id: "br-pairs",     label: "Paired Forces",           lessonId: "bridge-pairs",       color: 0x7b88ff, hex: "#7b88ff", az: 340, alt: 58, r: 64, major: false },
  { id: "br-alohamaat", label: "Aloha \u2194 Ma\u02beat", lessonId: "bridge-aloha-maat", color: 0xaa99ff, hex: "#aa99ff", az: 8,   alt: 64, r: 63, major: true  },
  { id: "br-star",      label: "Star Knowledge",          lessonId: "bridge-darkness",    color: 0x7b88ff, hex: "#7b88ff", az: 355, alt: 48, r: 65, major: false }
];

const CONNECTIONS = [
  ["kumulipo",  "aloha",        0.9],
  ["kumulipo",  "hokuleaa",     0.7],
  ["aloha",     "pono",         0.9],
  ["aloha",     "mana",         0.7],
  ["wayfinding","hokuleaa",     0.9],
  ["ahupuaa",   "kalo",         0.9],
  ["ahupuaa",   "laau",         0.6],
  ["maat",      "ennead",       0.8],
  ["maat",      "ptah",         0.7],
  ["maat",      "isfet",        0.6],
  ["nun",       "ennead",       0.8],
  ["imhotep",   "medunetjer",   0.6],
  ["duat",      "kabakh",       0.8],
  ["kumulipo",  "br-creation",  0.5],
  ["nun",       "br-creation",  0.6],
  ["aloha",     "br-alohamaat", 0.7],
  ["maat",      "br-alohamaat", 0.7],
  ["hokuleaa",  "br-star",      0.5],
  ["br-creation","br-pairs",    0.8]
];

const ALL_CONCEPTS = [
  ...GALAXY_DEFS.flatMap((g) =>
    g.concepts.map((c) => ({ ...c, culture: g.id, galaxyId: g.id }))
  ),
  ...BRIDGE_CONCEPTS.map((c) => ({ ...c, culture: "bridge", galaxyId: "bridge" }))
];

const CONCEPT_MAP = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));

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

  const mat = grp.children[0].material;
  skyDome.add(grp);
  galaxyObjects.set(def.id, { grp, coreGlow, outerGlow, mat });
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

function makeCrystalNode(concept) {
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
  conceptNodes.push({ concept, grp, crystal, glow, wire, baseOpacity: concept.major ? 0.80 : 0.60, phase: Math.random() * Math.PI * 2 });
}

function makeAllConceptNodes() {
  GALAXY_DEFS.forEach((g) => {
    g.concepts.forEach((c) => makeCrystalNode({ ...c, culture: g.id, galaxyId: g.id }));
  });
  BRIDGE_CONCEPTS.forEach((c) => makeCrystalNode({ ...c, culture: "bridge", galaxyId: "bridge" }));
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTELLATION LINES + FLOW PARTICLES
// ─────────────────────────────────────────────────────────────────────────────

const flowItems = [];

function makeConstellations() {
  CONNECTIONS.forEach(([aId, bId, str]) => {
    const ca = CONCEPT_MAP.get(aId);
    const cb = CONCEPT_MAP.get(bId);
    if (!ca || !cb) return;

    const pA  = skyPos(ca.az, ca.alt, ca.r);
    const pB  = skyPos(cb.az, cb.alt, cb.r);
    const mid = pA.clone().lerp(pB, 0.5);
    mid.add(mid.clone().normalize().multiplyScalar(mid.length() * 0.06));

    const curve = new THREE.CatmullRomCurve3([pA, mid, pB]);
    const colAB = new THREE.Color(ca.color).lerp(new THREE.Color(cb.color), 0.5);

    skyDome.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(IS_MOBILE ? 24 : 40)),
      new THREE.LineBasicMaterial({
        color: colAB, transparent: true,
        opacity: str > 0.7 ? str * (IS_MOBILE ? 0.16 : 0.24) : str * (IS_MOBILE ? 0.10 : 0.14),
        depthWrite: false, blending: THREE.AdditiveBlending
      })
    ));

    if (str >= 0.6 && !REDUCED_MOTION && !IS_MOBILE) {
      const col2 = colAB;
      const R2 = Math.round(col2.r*255), G2 = Math.round(col2.g*255), B2 = Math.round(col2.b*255);
      const tex = makeGlowTex(R2, G2, B2, 0.96, 32);
      const N2  = str >= 0.8 ? 4 : 2;

      for (let i = 0; i < N2; i++) {
        const dot = new THREE.Sprite(new THREE.SpriteMaterial({
          map: tex, transparent: true, opacity: 0,
          depthWrite: false, blending: THREE.AdditiveBlending
        }));
        dot.scale.setScalar(0.24);
        dot.userData = { curve, t: i / N2, speed: 0.0014 + Math.random() * 0.0012, maxOp: 0.60 * str };
        skyDome.add(dot);
        flowItems.push(dot);
      }
    }
  });
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

  const size = IS_MOBILE ? 19.25 : 28.5;  // world-unit diameter of compass face
  const Y    = -4.48;                       // Y position (ground level)
  const R    = size * 0.496;               // face radius (matches texture clip)

  const compassTexture = makeGoldCompassTexture(imgEl);

  // ── [A] Outer shadow / depth disc ────────────────────────────────────────
  // Dark halo outside the compass — grounds it in space, adds perceived depth.
  const haloDisc = new THREE.Mesh(
    new THREE.CircleGeometry(R * 1.18, 128),
    new THREE.MeshBasicMaterial({
      color: 0x000408, transparent: true, opacity: IS_MOBILE ? 0.58 : 0.70,
      depthWrite: false, depthTest: false, side: THREE.DoubleSide
    })
  );
  haloDisc.rotation.x = -Math.PI / 2;
  haloDisc.position.set(0, Y - 0.10, 0);
  haloDisc.renderOrder = 10;
  compassGrp.add(haloDisc);

  // ── [B] Dark backing disc — CRITICAL for text readability ─────────────────
  // The compass texture is now transparent-background bright-gold-lines.
  // Without a dark backing, the gold lines sit directly on the star field
  // which is fine but a subtle dark disc improves contrast dramatically.
  const backDisc = new THREE.Mesh(
    new THREE.CircleGeometry(R * 0.992, 128),
    new THREE.MeshBasicMaterial({
      color: 0x050c18, transparent: true, opacity: IS_MOBILE ? 0.60 : 0.72,
      depthWrite: false, depthTest: false, side: THREE.DoubleSide
    })
  );
  backDisc.rotation.x = -Math.PI / 2;
  backDisc.position.set(0, Y + 0.04, 0);
  backDisc.renderOrder = 18;
  compassGrp.add(backDisc);

  // ── [C] Compass face — flat PlaneGeometry (correct full UV mapping) ────────
  // PlaneGeometry is the ONLY geometry that maps UV 0→1 across the full texture.
  // Any sphere or dome geometry maps only a fraction of the texture vertically.
  const faceMat = new THREE.MeshStandardMaterial({
    map:         compassTexture,
    color:       0xffffff,   // tint neutral so gold reads true
    emissive:    0x1a0e00,   // very subtle warm self-emission so dark lines aren't flat
    emissiveIntensity: IS_MOBILE ? 0.10 : 0.14,
    metalness:   0.22,
    roughness:   0.62,
    transparent: true,
    opacity:     1.0,
    depthWrite:  false,
    depthTest:   false,
    fog:         false,
    side:        THREE.DoubleSide,
    alphaTest:   0.005       // discard fully-transparent pixels
  });

  const faceMesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), faceMat);
  faceMesh.rotation.x = -Math.PI / 2;
  faceMesh.position.set(0, Y + 0.06, 0);
  faceMesh.renderOrder = 20;
  faceMesh.name = "hawaiian-star-compass-gold-image";
  compassGrp.add(faceMesh);
  compassFloorMesh = faceMesh;

  // ── [D] Outer physical rim — TorusGeometry ────────────────────────────────
  // A raised metal ring. Lights hit the curved tube top differently than sides
  // = highlight on top, shadow underneath = real 3D depth perception.
  const rimR    = R;
  const tubeR   = IS_MOBILE ? 0.42 : 0.62;

  const rimGeo  = new THREE.TorusGeometry(rimR, tubeR, IS_MOBILE ? 14 : 22, IS_MOBILE ? 100 : 180);
  const rimMat  = new THREE.MeshPhysicalMaterial({
    color:                0xc8981e,
    emissive:             0x2e1c00,
    emissiveIntensity:    0.18,
    metalness:            0.92,
    roughness:            0.12,
    clearcoat:            0.75,
    clearcoatRoughness:   0.08,
    reflectivity:         0.90
  });

  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.set(0, Y + 0.10, 0);
  rimMesh.renderOrder = 22;
  compassGrp.add(rimMesh);

  // ── [E] Inner bevel ring ──────────────────────────────────────────────────
  const bevelR   = R * 0.875;
  const bevelTube = IS_MOBILE ? 0.16 : 0.23;

  const bevelMesh = new THREE.Mesh(
    new THREE.TorusGeometry(bevelR, bevelTube, IS_MOBILE ? 10 : 16, IS_MOBILE ? 80 : 150),
    rimMat.clone()
  );
  bevelMesh.material.emissiveIntensity = 0.22;
  bevelMesh.rotation.x = Math.PI / 2;
  bevelMesh.position.set(0, Y + 0.13, 0);
  bevelMesh.renderOrder = 23;
  compassGrp.add(bevelMesh);

  // ── [F] Stepped concentric raised rings (wall cylinders) ─────────────────
  // Three visible steps at ascending Y heights simulate a physical instrument dial.
  // Each ring is a thin open-ended cylinder (just the wall, no caps).
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
    color:     0xb88a18,
    emissive:  0x1a1000,
    emissiveIntensity: 0.12,
    metalness: 0.85,
    roughness: 0.18,
    side:      THREE.DoubleSide
  });

  stepDefs.forEach((def) => {
    const stepMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(def.r, def.r, def.h, IS_MOBILE ? 80 : 144, 1, true),
      stepMat.clone()
    );
    stepMesh.position.set(0, def.y, 0);
    stepMesh.renderOrder = 21;
    compassGrp.add(stepMesh);

    // Thin glowing line at the top edge of each step (ring groove highlight)
    const edgePts = [];
    for (let i = 0; i <= 140; i++) {
      const a = (i / 140) * Math.PI * 2;
      edgePts.push(new THREE.Vector3(
        Math.cos(a) * def.r, def.y + def.h / 2, Math.sin(a) * def.r
      ));
    }
    const edgeLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(edgePts),
      new THREE.LineBasicMaterial({
        color: 0xf0c040, transparent: true, opacity: 0.55, depthWrite: false
      })
    );
    edgeLine.renderOrder = 21;
    compassGrp.add(edgeLine);
  });

  // ── [G] Centre hub ────────────────────────────────────────────────────────
  // Traditional compass pivot — slightly raised truncated cone with clearcoat.
  const hubH  = IS_MOBILE ? 0.24 : 0.36;
  const hubR0 = IS_MOBILE ? 0.30 : 0.46;   // top radius
  const hubR1 = IS_MOBILE ? 0.38 : 0.56;   // bottom radius (wider base)

  const hubMat = new THREE.MeshPhysicalMaterial({
    color:              0xe8bc28,
    emissive:           0x3c2400,
    emissiveIntensity:  0.32,
    metalness:          0.96,
    roughness:          0.08,
    clearcoat:          0.90,
    clearcoatRoughness: 0.06
  });

  const hubMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(hubR0, hubR1, hubH, IS_MOBILE ? 24 : 40),
    hubMat
  );
  hubMesh.position.set(0, Y + hubH / 2 + 0.06, 0);
  hubMesh.renderOrder = 25;
  compassGrp.add(hubMesh);

  // Hub top cap
  const hubCap = new THREE.Mesh(
    new THREE.CircleGeometry(hubR0, IS_MOBILE ? 24 : 40),
    hubMat.clone()
  );
  hubCap.material.emissiveIntensity = 0.50;
  hubCap.rotation.x = -Math.PI / 2;
  hubCap.position.set(0, Y + hubH + 0.08, 0);
  hubCap.renderOrder = 26;
  compassGrp.add(hubCap);

  // Hub centre glow
  const hubGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(255, 215, 95, 0.96, 48),
    transparent: true, opacity: IS_MOBILE ? 0.60 : 0.78,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  hubGlow.scale.setScalar(IS_MOBILE ? 1.4 : 2.1);
  hubGlow.position.set(0, Y + hubH + 0.20, 0);
  hubGlow.renderOrder = 27;
  compassGrp.add(hubGlow);

  // ── [H] Outer gold ambient aura ───────────────────────────────────────────
  const auraSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTex(200, 155, 40, 0.96, 128),
    transparent: true, opacity: IS_MOBILE ? 0.16 : 0.24,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  auraSprite.scale.setScalar(size * 1.12);
  auraSprite.position.set(0, Y + 0.05, 0);
  auraSprite.renderOrder = 11;
  compassGrp.add(auraSprite);

  console.log("[LKP] 3D compass complete:", {
    texSize: `${imgEl.naturalWidth || imgEl.width}x${imgEl.naturalHeight || imgEl.height}`,
    worldSize: size, rimR: R.toFixed(2)
  });
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

let hoveredId    = null;
let activeGalaxyId = null;

const CULTURE_LABELS = { kanaka: "K\u0101naka Maoli", kemet: "Kemet", bridge: "The Bridge" };
const CULTURE_COLORS = { kanaka: "#3cb371", kemet: "#f0c96a", bridge: "#7b88ff" };
const LESSON_URL     = "lessons.html#";

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

renderer.domElement.addEventListener("pointermove", setPointerFromEvent, { passive: true });
renderer.domElement.addEventListener("pointerdown", setPointerFromEvent, { passive: true });

renderer.domElement.addEventListener("click", () => {
  if (!hoveredId) return;
  const c = CONCEPT_MAP.get(hoveredId);
  if (c?.lessonId) window.location.href = LESSON_URL + c.lessonId;
});

let lastTap      = 0;
let zoomTarget   = null;
let zoomStart    = null;
let zoomProgress = 0;

function startZoomTo(pos) {
  if (!pos) return;
  zoomTarget   = pos.clone().multiplyScalar(IS_MOBILE ? 0.26 : 0.22);
  zoomStart    = camera.position.clone();
  zoomProgress = 0;
  controls.autoRotate = false;
}

renderer.domElement.addEventListener("dblclick", () => {
  if (hoveredId) {
    const c = CONCEPT_MAP.get(hoveredId);
    if (c) startZoomTo(skyPos(c.az, c.alt, c.r));
  } else {
    zoomTarget   = new THREE.Vector3(0, IS_MOBILE ? 1.9 : 1.6, 0);
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

function updateTooltip() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickable, false);
  const hit  = hits.length ? hits[0].object : null;

  hoveredId    = hit ? hit.userData.conceptId : null;
  activeGalaxyId = hoveredId ? CONCEPT_MAP.get(hoveredId)?.galaxyId ?? null : null;

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

  compassGrp.rotation.y = -t * 0.038 * spd;

  if (compassFloorMesh) {
    // Fade the face in smoothly on first load — MeshStandardMaterial starts
    // at whatever opacity it was constructed with (1.0 here) so this is instant.
    compassFloorMesh.material.opacity = THREE.MathUtils.lerp(
      compassFloorMesh.material.opacity, 1.0, 0.08
    );
    // Keep emissiveIntensity breathing slightly — makes gold feel warm and alive.
    if (!REDUCED_MOTION) {
      compassFloorMesh.material.emissiveIntensity = 0.10 + Math.sin(clock.getElapsedTime() * 0.55) * 0.04;
    }
  }

  galaxyObjects.forEach((obj, gId) => {
    const isActive = activeGalaxyId === gId;
    const pulse = REDUCED_MOTION ? 0 : Math.sin(t * 0.9 + (gId === "kanaka" ? 0 : Math.PI)) * (IS_MOBILE ? 0.035 : 0.06);

    obj.coreGlow.material.opacity  = THREE.MathUtils.lerp(obj.coreGlow.material.opacity,  isActive ? 0.88 : 0.70 + pulse,      0.06);
    obj.outerGlow.material.opacity = THREE.MathUtils.lerp(obj.outerGlow.material.opacity, isActive ? 0.54 : 0.38 + pulse * 0.5, 0.05);
    obj.mat.opacity                = THREE.MathUtils.lerp(obj.mat.opacity,                isActive ? 0.70 : 0.52,               0.04);

    if (!REDUCED_MOTION) {
      obj.grp.rotation.z += (IS_MOBILE ? 0.00014 : 0.00025) * spd * (gId === "kanaka" ? 1 : -1);
    }
  });

  conceptNodes.forEach((cn, idx) => {
    cn.crystal.rotation.y += (IS_MOBILE ? 0.006 : 0.009) * spd;
    cn.crystal.rotation.x  = Math.sin(t * 0.38 + idx * 0.88) * 0.20;
    cn.wire.rotation.y    -= (IS_MOBILE ? 0.004 : 0.006) * spd;
    cn.wire.rotation.z     = Math.sin(t * 0.28 + idx * 0.62) * 0.14;

    const isHov  = hoveredId === cn.concept.id;
    const pulse  = REDUCED_MOTION ? 0 : Math.sin(t * 1.5 + cn.phase) * (IS_MOBILE ? 0.08 : 0.13);

    cn.crystal.material.emissiveIntensity = THREE.MathUtils.lerp(cn.crystal.material.emissiveIntensity, isHov ? 0.96 : cn.concept.major ? 0.62 : 0.50, 0.12);
    cn.glow.material.opacity = THREE.MathUtils.lerp(cn.glow.material.opacity, cn.baseOpacity + pulse + (isHov ? 0.24 : 0), 0.10);
    cn.grp.scale.setScalar(THREE.MathUtils.lerp(cn.grp.scale.x, isHov ? 1.30 : 1.0, 0.12));
  });

  flowItems.forEach((dot) => {
    dot.userData.t = (dot.userData.t + dot.userData.speed) % 1;
    dot.position.copy(dot.userData.curve.getPoint(dot.userData.t));
    const ft = dot.userData.t;
    dot.material.opacity = dot.userData.maxOp * (ft < 0.08 ? ft / 0.08 : ft > 0.90 ? (1 - ft) / 0.10 : 1);
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

  updateTooltip();
  controls.update();
  composer.render();
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
  controls.maxDistance  = IS_MOBILE ? 92 : 120;
  controls.rotateSpeed  = IS_MOBILE ? -0.34 : -0.42;
  controls.autoRotateSpeed = IS_MOBILE ? 0.14 : 0.22;
}

window.addEventListener("resize",            handleResize,                         { passive: true });
window.addEventListener("orientationchange", () => window.setTimeout(handleResize, 250), { passive: true });

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function injectLoader() {
  if (document.getElementById("lkp-loader")) return;
  const el = document.createElement("div");
  el.id = "lkp-loader";
  el.innerHTML = `
    <div class="lkp-loader__inner">
      <div class="lkp-loader__ring"></div>
      <div class="lkp-loader__title">Living Knowledge</div>
      <div class="lkp-loader__sub">Navigating the stars&hellip;</div>
    </div>
  `;
  document.body.appendChild(el);
}

function dismissLoader() {
  const el = document.getElementById("lkp-loader");
  if (!el) return;
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
}

init();