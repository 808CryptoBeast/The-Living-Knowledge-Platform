/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Sign-Out Module
   File: LKP/js/lkp-signout.js

   Drop this script on every page that has a sign-out button.
   It handles:
   - Button loading state (spinner + "Signing out…" text)
   - Full-screen cosmic departure overlay with star dissolve animation
   - Supabase sign-out
   - Redirect to index.html (or custom URL)

   USAGE — add to any page:
     <script defer src="LKP/js/lkp-signout.js"></script>

   Then on any sign-out button add:
     data-lkp-signout                         — triggers with default redirect
     data-lkp-signout="profile.html"          — triggers with custom redirect
     data-lkp-signout-confirm="true"          — shows confirm step first

   The module auto-finds window._lkpSupaClient or window.supabase.
   It also handles id="adminSignOutBtn" automatically for the Admin Deck.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Config ────────────────────────────────────────────────────────── */

  const DEFAULT_REDIRECT = "index.html";
  const OVERLAY_ID       = "lkp-signout-overlay";

  /* ── Resolve Supabase client ─────────────────────────────────────────── */

  function getSupabase() {
    return (
      window._lkpSupaClient ||
      window.LKP_SUPABASE   ||
      window._supaClient     ||
      null
    );
  }

  /* ── CSS injected once ───────────────────────────────────────────────── */

  function injectStyles() {
    if (document.getElementById("lkp-signout-styles")) return;

    const style = document.createElement("style");
    style.id = "lkp-signout-styles";
    style.textContent = `
      /* ── Sign-out button loading state ── */
      .lkp-signing-out {
        pointer-events: none !important;
        opacity: 0.72 !important;
        position: relative;
      }

      .lkp-signing-out .lkp-so-spinner {
        display: inline-block !important;
      }

      .lkp-so-spinner {
        display: none;
        width: 13px;
        height: 13px;
        border: 2px solid rgba(240, 201, 106, 0.30);
        border-top-color: #f0c96a;
        border-radius: 50%;
        animation: lkp-spin 0.72s linear infinite;
        flex-shrink: 0;
      }

      @keyframes lkp-spin {
        to { transform: rotate(360deg); }
      }

      /* ── Full-screen departure overlay ── */
      #lkp-signout-overlay {
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

      #lkp-signout-overlay.lkp-so--visible {
        opacity: 1;
        pointer-events: all;
      }

      /* Starfield canvas sits behind the content */
      #lkp-so-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0.55;
      }

      /* Content layer */
      .lkp-so-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        text-align: center;
      }

      /* Pulsing orb */
      .lkp-so-orb {
        width: 88px;
        height: 88px;
        border-radius: 50%;
        background: radial-gradient(circle at 38% 34%,
          rgba(240, 201, 106, 0.28) 0%,
          rgba(84, 198, 238, 0.10) 55%,
          transparent 100%
        );
        border: 1px solid rgba(240, 201, 106, 0.32);
        box-shadow:
          0 0 28px rgba(240, 201, 106, 0.18),
          0 0 60px rgba(84, 198, 238, 0.08),
          inset 0 0 28px rgba(84, 198, 238, 0.07);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: lkp-so-pulse 2.4s ease-in-out infinite;
      }

      @keyframes lkp-so-pulse {
        0%, 100% { transform: scale(1);    box-shadow: 0 0 28px rgba(240,201,106,0.18), 0 0 60px rgba(84,198,238,0.08); }
        50%       { transform: scale(1.07); box-shadow: 0 0 44px rgba(240,201,106,0.30), 0 0 80px rgba(84,198,238,0.14); }
      }

      .lkp-so-orb-symbol {
        font-size: 32px;
        color: #f0c96a;
        text-shadow: 0 0 18px rgba(240,201,106,0.60);
        animation: lkp-so-rotate 8s linear infinite;
        display: block;
      }

      @keyframes lkp-so-rotate {
        to { transform: rotate(360deg); }
      }

      .lkp-so-title {
        font-family: 'Pirata One', 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(2.2rem, 6vw, 3.8rem);
        font-weight: 400;
        color: #f0c96a;
        letter-spacing: 0.04em;
        line-height: 1;
        text-shadow: 0 0 24px rgba(240,201,106,0.28);
        margin: 0;
        opacity: 0;
        transform: translateY(12px);
        animation: lkp-so-rise 0.55s ease 0.18s forwards;
      }

      .lkp-so-sub {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        color: rgba(168, 190, 228, 0.72);
        letter-spacing: 0.12em;
        margin: 0;
        opacity: 0;
        transform: translateY(8px);
        animation: lkp-so-rise 0.55s ease 0.34s forwards;
      }

      .lkp-so-dots {
        display: flex;
        gap: 8px;
        opacity: 0;
        animation: lkp-so-rise 0.4s ease 0.5s forwards;
      }

      .lkp-so-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(240, 201, 106, 0.55);
        animation: lkp-so-blink 1.2s ease-in-out infinite;
      }

      .lkp-so-dot:nth-child(2) { animation-delay: 0.20s; }
      .lkp-so-dot:nth-child(3) { animation-delay: 0.40s; }

      @keyframes lkp-so-blink {
        0%, 100% { opacity: 0.28; transform: scale(0.85); }
        50%       { opacity: 1;    transform: scale(1.15); }
      }

      @keyframes lkp-so-rise {
        to { opacity: 1; transform: translateY(0); }
      }

      /* Confirm modal (optional) */
      .lkp-so-confirm {
        position: fixed;
        inset: 0;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(1, 3, 10, 0.78);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.22s ease;
      }

      .lkp-so-confirm.lkp-so--visible {
        opacity: 1;
        pointer-events: all;
      }

      .lkp-so-confirm__box {
        width: min(440px, 100%);
        padding: 28px 24px;
        border-radius: 28px;
        border: 1px solid rgba(240, 201, 106, 0.22);
        background:
          linear-gradient(145deg, rgba(255,255,255,0.04), transparent),
          rgba(4, 10, 26, 0.92);
        box-shadow: 0 28px 80px rgba(0,0,0,0.52);
        display: flex;
        flex-direction: column;
        gap: 18px;
        transform: scale(0.96) translateY(8px);
        transition: transform 0.22s ease;
      }

      .lkp-so-confirm.lkp-so--visible .lkp-so-confirm__box {
        transform: scale(1) translateY(0);
      }

      .lkp-so-confirm__title {
        font-family: 'Pirata One', Georgia, serif;
        font-size: 2rem;
        font-weight: 400;
        color: #f0c96a;
        margin: 0;
        line-height: 1;
      }

      .lkp-so-confirm__body {
        color: rgba(168, 190, 228, 0.80);
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }

      .lkp-so-confirm__actions {
        display: flex;
        gap: 10px;
      }

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
      .lkp-so-confirm__no:hover {
        opacity: 0.85;
        transform: translateY(-1px);
      }

      .lkp-so-confirm__yes {
        background: rgba(255, 107, 122, 0.12);
        border: 1px solid rgba(255, 107, 122, 0.30);
        color: #ff6b7a;
      }

      .lkp-so-confirm__no {
        background: rgba(240, 201, 106, 0.10);
        border: 1px solid rgba(240, 201, 106, 0.28);
        color: #f0c96a;
      }
    `;

    document.head.appendChild(style);
  }

  /* ── Starfield canvas animation ──────────────────────────────────────── */

  function runStarfield(canvas) {
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
        s.y -= s.speed;
        s.x += s.drift;
        s.alpha -= 0.0008;

        if (s.y < -4 || s.alpha <= 0) {
          s.x     = Math.random() * canvas.width;
          s.y     = canvas.height + 4;
          s.alpha = 0.3 + Math.random() * 0.7;
          s.speed = 0.18 + Math.random() * 0.55;
          s.drift = (Math.random() - 0.5) * 0.22;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 228, 160, ${s.alpha.toFixed(3)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }

  /* ── Build overlay DOM ───────────────────────────────────────────────── */

  function buildOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;

    const el = document.createElement("div");
    el.id = OVERLAY_ID;
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("role", "status");

    el.innerHTML = `
      <canvas id="lkp-so-canvas"></canvas>
      <div class="lkp-so-content">
        <div class="lkp-so-orb">
          <span class="lkp-so-orb-symbol">◈</span>
        </div>
        <h2 class="lkp-so-title">E mālama</h2>
        <p class="lkp-so-sub">Signing out of your galaxy&hellip;</p>
        <div class="lkp-so-dots">
          <span class="lkp-so-dot"></span>
          <span class="lkp-so-dot"></span>
          <span class="lkp-so-dot"></span>
        </div>
      </div>
    `;

    document.body.appendChild(el);
  }

  /* ── Set button to loading state ─────────────────────────────────────── */

  function setButtonLoading(btn) {
    if (!btn) return;

    // Store original content
    btn.dataset.originalHtml = btn.innerHTML;

    // Inject spinner inline
    btn.innerHTML = `
      <span class="lkp-so-spinner"></span>
      Signing out&hellip;
    `;
    btn.classList.add("lkp-signing-out");
    btn.disabled = true;
  }

  function resetButton(btn) {
    if (!btn || !btn.dataset.originalHtml) return;
    btn.innerHTML = btn.dataset.originalHtml;
    btn.classList.remove("lkp-signing-out");
    btn.disabled = false;
  }

  /* ── Show overlay ────────────────────────────────────────────────────── */

  function showOverlay() {
    buildOverlay();

    const overlay = document.getElementById(OVERLAY_ID);
    const canvas  = document.getElementById("lkp-so-canvas");

    const stopStars = runStarfield(canvas);

    // Small delay so browser paints the overlay before we block
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add("lkp-so--visible");
      });
    });

    return stopStars;
  }

  /* ── Confirm modal ───────────────────────────────────────────────────── */

  function showConfirm(btn, redirect) {
    return new Promise((resolve) => {
      // Remove any existing confirm
      document.querySelector(".lkp-so-confirm")?.remove();

      const el = document.createElement("div");
      el.className = "lkp-so-confirm";
      el.innerHTML = `
        <div class="lkp-so-confirm__box">
          <h3 class="lkp-so-confirm__title">Sign Out?</h3>
          <p class="lkp-so-confirm__body">
            Your progress is saved to your account.<br>
            You can sign back in on any device to continue.
          </p>
          <div class="lkp-so-confirm__actions">
            <button class="lkp-so-confirm__yes" type="button">Yes, Sign Out</button>
            <button class="lkp-so-confirm__no"  type="button">Stay In</button>
          </div>
        </div>
      `;

      document.body.appendChild(el);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add("lkp-so--visible");
        });
      });

      el.querySelector(".lkp-so-confirm__yes").addEventListener("click", () => {
        el.classList.remove("lkp-so--visible");
        setTimeout(() => el.remove(), 260);
        resolve(true);
      });

      el.querySelector(".lkp-so-confirm__no").addEventListener("click", () => {
        el.classList.remove("lkp-so--visible");
        setTimeout(() => el.remove(), 260);
        resetButton(btn);
        resolve(false);
      });

      el.addEventListener("click", (e) => {
        if (e.target === el) {
          el.classList.remove("lkp-so--visible");
          setTimeout(() => el.remove(), 260);
          resetButton(btn);
          resolve(false);
        }
      });

      document.addEventListener("keydown", function onKey(e) {
        if (e.key === "Escape") {
          document.removeEventListener("keydown", onKey);
          el.classList.remove("lkp-so--visible");
          setTimeout(() => el.remove(), 260);
          resetButton(btn);
          resolve(false);
        }
      });
    });
  }

  /* ── Core sign-out flow ──────────────────────────────────────────────── */

  async function triggerSignOut(btn, redirect, withConfirm) {
    // If confirm requested, wait for user choice
    if (withConfirm) {
      setButtonLoading(btn);
      const confirmed = await showConfirm(btn, redirect);
      if (!confirmed) return;
    } else {
      setButtonLoading(btn);
    }

    // Show the departure overlay
    const stopStars = showOverlay();

    // Give the overlay 480ms to render before signing out
    await new Promise(r => setTimeout(r, 480));

    try {
      const supa = getSupabase();
      if (supa) {
        await supa.auth.signOut();
      }

      // Also clear local LKP caches so the next user starts clean
      const CLEAR_KEYS = [
        "cv_completed",
        "cv_mana",
        "lkp_rewards_state_v1",
        "lkp_rewards_daily_v1"
      ];
      CLEAR_KEYS.forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });

    } catch (err) {
      console.warn("[LKP SignOut] Error during sign-out:", err.message);
      // Continue to redirect anyway — don't trap the user
    }

    // Let the overlay linger for 1.1s so the animation reads properly
    await new Promise(r => setTimeout(r, 1100));

    stopStars();

    window.location.href = redirect || DEFAULT_REDIRECT;
  }

  /* ── Wire up buttons ─────────────────────────────────────────────────── */

  function wireButton(btn) {
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

    // Wire all [data-lkp-signout] buttons
    document.querySelectorAll("[data-lkp-signout]").forEach(wireButton);

    // Auto-wire the Admin Deck sign-out button by ID
    const adminBtn = document.getElementById("adminSignOutBtn");
    if (adminBtn && !adminBtn.dataset.lkpSignoutWired) {
      adminBtn.dataset.lkpSignoutRedirect = "index.html";
      adminBtn.dataset.lkpSignoutConfirm  = "true";
      wireButton(adminBtn);
    }

    // Watch for dynamically added buttons (e.g. after auth renders the topbar)
    const observer = new MutationObserver(() => {
      document.querySelectorAll("[data-lkp-signout]:not([data-lkp-signout-wired])").forEach(wireButton);

      const adminBtnLate = document.getElementById("adminSignOutBtn");
      if (adminBtnLate && !adminBtnLate.dataset.lkpSignoutWired) {
        adminBtnLate.dataset.lkpSignoutRedirect = "index.html";
        adminBtnLate.dataset.lkpSignoutConfirm  = "true";
        wireButton(adminBtnLate);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ── Public API ──────────────────────────────────────────────────────── */

  window.LKPSignOut = {
    trigger: triggerSignOut,
    wire:    wireButton
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();