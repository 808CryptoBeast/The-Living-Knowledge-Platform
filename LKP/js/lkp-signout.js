/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Auth Animation Module
   File: LKP/js/lkp-signout.js

   Handles both sign-out AND sign-in animations across all pages.

   SIGN-OUT: Full cosmic departure overlay with starfield, confirm dialog,
             Supabase sign-out, localStorage clear, then redirect.

   SIGN-IN:  Welcome overlay that plays after a successful Supabase sign-in.
             Call LKPSignOut.showSignInSuccess(displayName) from profile.js
             after auth succeeds.

   AUTO-WIRES these buttons (no HTML changes needed beyond adding the script):
     #adminSignOutBtn    — Admin Deck sign-out (with confirm dialog)
     #profileSignOutBtn  — Profile page sign-out (with confirm dialog)
     [data-lkp-signout]  — Any other button on any page

   USAGE on your lesson/other pages:
     <button data-lkp-signout>Sign Out</button>
     <button data-lkp-signout="login.html" data-lkp-signout-confirm="true">Sign Out</button>

   SIGN-IN ANIMATION — call from profile.js after successful auth:
     LKPSignOut.showSignInSuccess("Wayfinder Name");
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const DEFAULT_REDIRECT = "index.html";
  const SIGNOUT_OVERLAY_ID = "lkp-signout-overlay";
  const SIGNIN_OVERLAY_ID  = "lkp-signin-overlay";

  /* ── Supabase resolver ───────────────────────────────────────────────── */

  function getSupabase() {
    return window._lkpSupaClient || window.LKP_SUPABASE || window._supaClient || null;
  }

  /* ══════════════════════════════════════════════════════════════════════
     STYLES
  ══════════════════════════════════════════════════════════════════════ */

  function injectStyles() {
    if (document.getElementById("lkp-auth-anim-styles")) return;

    const style = document.createElement("style");
    style.id = "lkp-auth-anim-styles";
    style.textContent = `

      /* ── Shared button loading state ── */
      .lkp-btn-loading {
        pointer-events: none !important;
        opacity: 0.72 !important;
      }
      .lkp-btn-spinner {
        display: inline-block;
        width: 13px;
        height: 13px;
        border: 2px solid rgba(240, 201, 106, 0.28);
        border-top-color: #f0c96a;
        border-radius: 50%;
        animation: lkp-spin 0.7s linear infinite;
        flex-shrink: 0;
        vertical-align: middle;
      }
      @keyframes lkp-spin { to { transform: rotate(360deg); } }

      /* ── Shared overlay base ── */
      .lkp-auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 28px;
        background: #01030a;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.38s ease;
      }
      .lkp-auth-overlay.lkp--visible {
        opacity: 1;
        pointer-events: all;
      }
      .lkp-auth-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0.55;
      }
      .lkp-auth-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        text-align: center;
        padding: 0 24px;
      }

      /* ── Orb ── */
      .lkp-auth-orb {
        width: 88px;
        height: 88px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: lkp-orb-pulse 2.4s ease-in-out infinite;
      }
      .lkp-auth-orb--out {
        background: radial-gradient(circle at 38% 34%, rgba(240,201,106,0.28) 0%, rgba(84,198,238,0.10) 55%, transparent 100%);
        border: 1px solid rgba(240,201,106,0.32);
        box-shadow: 0 0 28px rgba(240,201,106,0.18), 0 0 60px rgba(84,198,238,0.08), inset 0 0 28px rgba(84,198,238,0.07);
      }
      .lkp-auth-orb--in {
        background: radial-gradient(circle at 38% 34%, rgba(84,198,238,0.28) 0%, rgba(240,201,106,0.10) 55%, transparent 100%);
        border: 1px solid rgba(84,198,238,0.38);
        box-shadow: 0 0 28px rgba(84,198,238,0.22), 0 0 60px rgba(240,201,106,0.10), inset 0 0 28px rgba(240,201,106,0.07);
      }
      @keyframes lkp-orb-pulse {
        0%,100% { transform: scale(1); }
        50%      { transform: scale(1.08); }
      }
      .lkp-auth-orb-symbol {
        font-size: 32px;
        display: block;
        animation: lkp-symbol-rotate 8s linear infinite;
      }
      .lkp-auth-orb--out .lkp-auth-orb-symbol {
        color: #f0c96a;
        text-shadow: 0 0 18px rgba(240,201,106,0.60);
      }
      .lkp-auth-orb--in .lkp-auth-orb-symbol {
        color: #54c6ee;
        text-shadow: 0 0 18px rgba(84,198,238,0.70);
        animation-direction: reverse;
      }
      @keyframes lkp-symbol-rotate { to { transform: rotate(360deg); } }

      /* ── Text ── */
      .lkp-auth-title {
        font-family: 'Pirata One', 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(2.2rem, 6vw, 3.8rem);
        font-weight: 400;
        letter-spacing: 0.04em;
        line-height: 1;
        margin: 0;
        opacity: 0;
        transform: translateY(12px);
        animation: lkp-rise 0.55s ease 0.18s forwards;
      }
      .lkp-auth-overlay--out .lkp-auth-title  { color: #f0c96a; text-shadow: 0 0 24px rgba(240,201,106,0.28); }
      .lkp-auth-overlay--in  .lkp-auth-title  { color: #54c6ee; text-shadow: 0 0 24px rgba(84,198,238,0.32); }

      .lkp-auth-sub {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        color: rgba(168,190,228,0.72);
        letter-spacing: 0.12em;
        margin: 0;
        opacity: 0;
        transform: translateY(8px);
        animation: lkp-rise 0.55s ease 0.34s forwards;
      }

      /* Sign-in welcome name line */
      .lkp-auth-name {
        font-family: 'Pirata One', Georgia, serif;
        font-size: clamp(1.1rem, 3vw, 1.6rem);
        color: #f0c96a;
        letter-spacing: 0.06em;
        margin: 0;
        opacity: 0;
        transform: translateY(6px);
        animation: lkp-rise 0.5s ease 0.50s forwards;
      }

      /* ── Dots ── */
      .lkp-auth-dots {
        display: flex;
        gap: 8px;
        opacity: 0;
        animation: lkp-rise 0.4s ease 0.5s forwards;
      }
      .lkp-auth-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        animation: lkp-blink 1.2s ease-in-out infinite;
      }
      .lkp-auth-overlay--out .lkp-auth-dot { background: rgba(240,201,106,0.55); }
      .lkp-auth-overlay--in  .lkp-auth-dot { background: rgba(84,198,238,0.55); }
      .lkp-auth-dot:nth-child(2) { animation-delay: 0.20s; }
      .lkp-auth-dot:nth-child(3) { animation-delay: 0.40s; }
      @keyframes lkp-blink {
        0%,100% { opacity: 0.28; transform: scale(0.85); }
        50%      { opacity: 1;    transform: scale(1.15); }
      }

      /* ── Sign-in success checkmark ── */
      .lkp-auth-check {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 2px solid rgba(84,198,238,0.40);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        opacity: 0;
        transform: scale(0.7);
        animation: lkp-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.62s forwards;
      }
      @keyframes lkp-pop {
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes lkp-rise {
        to { opacity: 1; transform: translateY(0); }
      }

      /* ── Confirm modal ── */
      .lkp-so-confirm {
        position: fixed;
        inset: 0;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(1,3,10,0.78);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.22s ease;
      }
      .lkp-so-confirm.lkp--visible {
        opacity: 1;
        pointer-events: all;
      }
      .lkp-so-confirm__box {
        width: min(440px, 100%);
        padding: 28px 24px;
        border-radius: 28px;
        border: 1px solid rgba(240,201,106,0.22);
        background: linear-gradient(145deg, rgba(255,255,255,0.04), transparent), rgba(4,10,26,0.92);
        box-shadow: 0 28px 80px rgba(0,0,0,0.52);
        display: flex;
        flex-direction: column;
        gap: 18px;
        transform: scale(0.96) translateY(8px);
        transition: transform 0.22s ease;
      }
      .lkp-so-confirm.lkp--visible .lkp-so-confirm__box { transform: scale(1) translateY(0); }
      .lkp-so-confirm__title {
        font-family: 'Pirata One', Georgia, serif;
        font-size: 2rem;
        font-weight: 400;
        color: #f0c96a;
        margin: 0;
        line-height: 1;
      }
      .lkp-so-confirm__body {
        color: rgba(168,190,228,0.80);
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }
      .lkp-so-confirm__actions { display: flex; gap: 10px; }
      .lkp-so-confirm__yes,
      .lkp-so-confirm__no {
        flex: 1;
        min-height: 42px;
        border-radius: 999px;
        border: 0;
        cursor: pointer;
        font-size: 13px;
        font-weight: 900;
        font-family: inherit;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
      .lkp-so-confirm__yes:hover,
      .lkp-so-confirm__no:hover { opacity: 0.85; transform: translateY(-1px); }
      .lkp-so-confirm__yes {
        background: rgba(255,107,122,0.12);
        border: 1px solid rgba(255,107,122,0.30);
        color: #ff6b7a;
      }
      .lkp-so-confirm__no {
        background: rgba(240,201,106,0.10);
        border: 1px solid rgba(240,201,106,0.28);
        color: #f0c96a;
      }
    `;

    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════════════════════════
     STARFIELD CANVAS
  ══════════════════════════════════════════════════════════════════════ */

  function runStarfield(canvas, direction = "up") {
    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 180 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     0.5 + Math.random() * 1.5,
      speed: 0.18 + Math.random() * 0.55,
      alpha: 0.2 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.22
    }));

    let raf;
    let running = true;

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        // Sign-out: stars fly upward (departing)
        // Sign-in: stars fly inward/downward (arriving)
        if (direction === "up") {
          s.y -= s.speed;
          s.x += s.drift;
        } else {
          s.y += s.speed * 0.6;
          s.x += s.drift * 0.5;
          s.r  = Math.min(s.r + 0.002, 2.5);
        }

        s.alpha -= 0.0006;

        if (s.y < -4 || s.y > canvas.height + 4 || s.alpha <= 0) {
          s.x     = Math.random() * canvas.width;
          s.y     = direction === "up" ? canvas.height + 4 : -4;
          s.alpha = 0.3 + Math.random() * 0.7;
          s.speed = 0.18 + Math.random() * 0.55;
          s.r     = 0.5 + Math.random() * 1.5;
          s.drift = (Math.random() - 0.5) * 0.22;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        // Sign-out: gold stars   Sign-in: cyan stars
        const color = direction === "up" ? `255,228,160` : `160,228,255`;
        ctx.fillStyle = `rgba(${color},${s.alpha.toFixed(3)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { running = false; cancelAnimationFrame(raf); };
  }

  /* ══════════════════════════════════════════════════════════════════════
     BUTTON HELPERS
  ══════════════════════════════════════════════════════════════════════ */

  function setButtonLoading(btn, text = "Signing out\u2026") {
    if (!btn) return;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `<span class="lkp-btn-spinner"></span> ${text}`;
    btn.classList.add("lkp-btn-loading");
    btn.disabled = true;
  }

  function resetButton(btn) {
    if (!btn || !btn.dataset.originalHtml) return;
    btn.innerHTML = btn.dataset.originalHtml;
    btn.classList.remove("lkp-btn-loading");
    btn.disabled = false;
  }

  /* ══════════════════════════════════════════════════════════════════════
     CONFIRM DIALOG
  ══════════════════════════════════════════════════════════════════════ */

  function showConfirm(btn) {
    return new Promise((resolve) => {
      document.querySelector(".lkp-so-confirm")?.remove();

      const el = document.createElement("div");
      el.className = "lkp-so-confirm";
      el.innerHTML = `
        <div class="lkp-so-confirm__box">
          <h3 class="lkp-so-confirm__title">Sign Out?</h3>
          <p class="lkp-so-confirm__body">
            Your progress is saved to your account.<br>
            Sign back in on any device to continue.
          </p>
          <div class="lkp-so-confirm__actions">
            <button class="lkp-so-confirm__yes" type="button">Yes, Sign Out</button>
            <button class="lkp-so-confirm__no"  type="button">Stay In</button>
          </div>
        </div>`;
      document.body.appendChild(el);

      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("lkp--visible")));

      const dismiss = (result) => {
        el.classList.remove("lkp--visible");
        setTimeout(() => el.remove(), 260);
        if (!result) resetButton(btn);
        resolve(result);
      };

      el.querySelector(".lkp-so-confirm__yes").addEventListener("click", () => dismiss(true));
      el.querySelector(".lkp-so-confirm__no").addEventListener("click",  () => dismiss(false));
      el.addEventListener("click", e => { if (e.target === el) dismiss(false); });
      document.addEventListener("keydown", function onKey(e) {
        if (e.key === "Escape") { document.removeEventListener("keydown", onKey); dismiss(false); }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     SIGN-OUT OVERLAY
  ══════════════════════════════════════════════════════════════════════ */

  function buildSignOutOverlay() {
    if (document.getElementById(SIGNOUT_OVERLAY_ID)) return;

    const el = document.createElement("div");
    el.id = SIGNOUT_OVERLAY_ID;
    el.className = "lkp-auth-overlay lkp-auth-overlay--out";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "assertive");
    el.innerHTML = `
      <canvas class="lkp-auth-canvas" id="lkp-so-canvas"></canvas>
      <div class="lkp-auth-content">
        <div class="lkp-auth-orb lkp-auth-orb--out">
          <span class="lkp-auth-orb-symbol">◈</span>
        </div>
        <h2 class="lkp-auth-title">E mālama</h2>
        <p class="lkp-auth-sub">Signing out of your galaxy&hellip;</p>
        <div class="lkp-auth-dots">
          <span class="lkp-auth-dot"></span>
          <span class="lkp-auth-dot"></span>
          <span class="lkp-auth-dot"></span>
        </div>
      </div>`;
    document.body.appendChild(el);
  }

  async function triggerSignOut(btn, redirect, withConfirm) {
    setButtonLoading(btn, "Signing out\u2026");

    if (withConfirm) {
      const confirmed = await showConfirm(btn);
      if (!confirmed) return;
    }

    buildSignOutOverlay();
    const overlay  = document.getElementById(SIGNOUT_OVERLAY_ID);
    const canvas   = document.getElementById("lkp-so-canvas");
    const stopStars = runStarfield(canvas, "up");

    await new Promise(r => setTimeout(r, 40));
    overlay.classList.add("lkp--visible");
    await new Promise(r => setTimeout(r, 480));

    try {
      const supa = getSupabase();
      if (supa) await supa.auth.signOut();

      ["cv_completed","cv_mana","lkp_rewards_state_v1","lkp_rewards_daily_v1"]
        .forEach(k => { try { localStorage.removeItem(k); } catch {} });
    } catch (err) {
      console.warn("[LKP SignOut] error:", err.message);
    }

    await new Promise(r => setTimeout(r, 1100));
    stopStars();
    window.location.href = redirect || DEFAULT_REDIRECT;
  }

  /* ══════════════════════════════════════════════════════════════════════
     SIGN-IN ANIMATION  ← NEW
     Call from profile.js after successful Supabase sign-in:
       LKPSignOut.showSignInSuccess("Wayfinder Name");
  ══════════════════════════════════════════════════════════════════════ */

  function showSignInSuccess(displayName) {
    // Remove any existing sign-in overlay
    document.getElementById(SIGNIN_OVERLAY_ID)?.remove();

    const el = document.createElement("div");
    el.id = SIGNIN_OVERLAY_ID;
    el.className = "lkp-auth-overlay lkp-auth-overlay--in";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    const greeting = displayName ? `Aloha, ${displayName}` : "Aloha, Wayfinder";

    el.innerHTML = `
      <canvas class="lkp-auth-canvas" id="lkp-si-canvas"></canvas>
      <div class="lkp-auth-content">
        <div class="lkp-auth-orb lkp-auth-orb--in">
          <span class="lkp-auth-orb-symbol">◈</span>
        </div>
        <h2 class="lkp-auth-title">Welcome Back</h2>
        <p class="lkp-auth-name">${escapeHtml(greeting)}</p>
        <p class="lkp-auth-sub">Entering your galaxy&hellip;</p>
        <div class="lkp-auth-check">✦</div>
      </div>`;

    document.body.appendChild(el);

    const canvas = document.getElementById("lkp-si-canvas");
    const stopStars = runStarfield(canvas, "in");

    // Fade in
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.classList.add("lkp--visible");
    }));

    // Hold for 2s then fade out and remove
    setTimeout(() => {
      el.classList.remove("lkp--visible");
      setTimeout(() => { stopStars(); el.remove(); }, 420);
    }, 2000);
  }

  /* ── Sign-in button loading state helpers (call from profile.js) ────── */

  function showSignInLoading(btn) {
    setButtonLoading(btn, "Signing in\u2026");
  }

  function hideSignInLoading(btn) {
    resetButton(btn);
  }

  /* ── HTML escape ─────────────────────────────────────────────────────── */

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ══════════════════════════════════════════════════════════════════════
     WIRE BUTTONS
  ══════════════════════════════════════════════════════════════════════ */

  function wireSignOutButton(btn) {
    if (!btn || btn.dataset.lkpSignoutWired) return;
    btn.dataset.lkpSignoutWired = "true";

    btn.addEventListener("click", () => {
      const redirect    = btn.dataset.lkpSignout || btn.dataset.lkpSignoutRedirect || DEFAULT_REDIRECT;
      const withConfirm = btn.dataset.lkpSignoutConfirm === "true";
      triggerSignOut(btn, redirect, withConfirm);
    });
  }

  function init() {
    injectStyles();

    // Wire all generic [data-lkp-signout] buttons
    document.querySelectorAll("[data-lkp-signout]").forEach(wireSignOutButton);

    // ── Auto-wire Admin Deck sign-out button ──
    const adminBtn = document.getElementById("adminSignOutBtn");
    if (adminBtn && !adminBtn.dataset.lkpSignoutWired) {
      adminBtn.dataset.lkpSignoutRedirect = "index.html";
      adminBtn.dataset.lkpSignoutConfirm  = "true";
      wireSignOutButton(adminBtn);
    }

    // ── Auto-wire Profile page sign-out button ──
    const profileBtn = document.getElementById("profileSignOutBtn");
    if (profileBtn && !profileBtn.dataset.lkpSignoutWired) {
      profileBtn.dataset.lkpSignoutRedirect = "index.html";
      profileBtn.dataset.lkpSignoutConfirm  = "true";
      wireSignOutButton(profileBtn);
    }

    // Watch for buttons added dynamically (after auth renders them)
    const observer = new MutationObserver(() => {
      document.querySelectorAll("[data-lkp-signout]:not([data-lkp-signout-wired])").forEach(wireSignOutButton);

      const adminBtnLate = document.getElementById("adminSignOutBtn");
      if (adminBtnLate && !adminBtnLate.dataset.lkpSignoutWired) {
        adminBtnLate.dataset.lkpSignoutRedirect = "index.html";
        adminBtnLate.dataset.lkpSignoutConfirm  = "true";
        wireSignOutButton(adminBtnLate);
      }

      const profileBtnLate = document.getElementById("profileSignOutBtn");
      if (profileBtnLate && !profileBtnLate.dataset.lkpSignoutWired) {
        profileBtnLate.dataset.lkpSignoutRedirect = "index.html";
        profileBtnLate.dataset.lkpSignoutConfirm  = "true";
        wireSignOutButton(profileBtnLate);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ── Public API ──────────────────────────────────────────────────────── */

  window.LKPSignOut = {
    trigger:           triggerSignOut,
    wire:              wireSignOutButton,
    showSignInSuccess, // ← call this from profile.js after sign-in
    showSignInLoading, // ← call this when sign-in starts
    hideSignInLoading  // ← call this if sign-in fails
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();