/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Admin Auth Gate
   File: LKP/js/lkp-admin-auth.js

   - Initializes Supabase client, checks for an active session, and wires
     the sign-in form on admin.html.
   - Only accounts with role "admin" or "owner" in the profiles table
     can pass the gate.
   - Fires window event 'lkp:admin-authed' when access is confirmed so the
     workbench can initialize.
   - The gate overlay fades out with an "Access Granted" animation on success.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Config ───────────────────────────────────────────────────────────── */

  var SUPABASE_URL =
    window.LKP_SUPABASE_URL ||
    'https://fmrjdvsqdfyaqtzwbbqi.supabase.co';

  var SUPABASE_ANON_KEY =
    window.LKP_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcmpkdnNxZGZ5YXF0endiYnFpIiwi' +
    'cm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTE2MzYsImV4cCI6MjA5MTE2NzYzNn0.' +
    'UKyvX02bG4cNhb7U2TK96t8XFREHYYwHJIKbPK06nqs';

  var ADMIN_ROLES = ['admin', 'owner'];

  var supa = null;

  /* ── Element refs ─────────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  /* ── Status message ───────────────────────────────────────────────────── */

  function setStatus(msg, type) {
    var node = el('adminAccessStatus');
    if (!node) return;
    node.textContent = msg;
    node.className = 'admin-auth-gate__status' +
      (type === 'error'   ? ' is-error'   :
       type === 'success' ? ' is-success' : '');
  }

  /* ── Field-level errors ───────────────────────────────────────────────── */

  function setFieldError(fieldId, errorId, msg) {
    var field = el(fieldId);
    var errEl = el(errorId);
    if (field)  field.classList.toggle('is-error', !!msg);
    if (errEl)  errEl.textContent = msg || '';
  }

  function clearErrors() {
    setFieldError('adminEmailField',    'adminEmailError',    '');
    setFieldError('adminPasswordField', 'adminPasswordError', '');
  }

  /* ── Submit button states ─────────────────────────────────────────────── */

  function setBtnLoading(loading) {
    var btn  = el('adminSignInBtn');
    var icon = el('adminSignInIcon');
    var text = el('adminSignInBtnText');
    if (!btn) return;

    btn.disabled = loading;

    if (icon) {
      icon.className = loading
        ? 'fas fa-circle-notch fa-spin'
        : 'fas fa-user-shield';
      icon.setAttribute('aria-hidden', 'true');
    }
    if (text) text.textContent = loading ? 'Verifying…' : 'Sign In';
  }

  function setBtnGranted() {
    var btn  = el('adminSignInBtn');
    var icon = el('adminSignInIcon');
    var text = el('adminSignInBtnText');
    if (!btn) return;

    btn.disabled = true;
    btn.style.borderColor  = 'rgba(60,179,113,0.44)';
    btn.style.color        = '#8fffc7';
    if (icon) icon.className = 'fas fa-check';
    if (text) text.textContent = 'Access Granted';
  }

  /* ── Gate exit animation ──────────────────────────────────────────────── */

  function exitGate() {
    var gate = el('adminAuthGate');
    if (!gate) return;

    gate.classList.add('is-success');

    setTimeout(function () {
      gate.classList.add('is-exiting');
      setTimeout(function () {
        gate.hidden = true;
      }, 460);
    }, 950);
  }

  /* ── Inject signed-in user chip into topbar ───────────────────────────── */

  function injectUserChip(user, profile) {
    var links = document.querySelector('.admin-topbar__links');
    if (!links || links.querySelector('.admin-user-chip')) return;

    var chip = document.createElement('span');
    chip.className = 'admin-user-chip';
    chip.setAttribute('title', user.email + ' · ' + profile.role);
    chip.innerHTML =
      '<i class="fas fa-user-check" aria-hidden="true"></i>' +
      (profile.display_name || user.email.split('@')[0]).slice(0, 22);

    links.insertBefore(chip, links.firstChild);
  }

  /* ── Grant access ─────────────────────────────────────────────────────── */

  function grantAccess(user, profile) {
    window.LKP_ADMIN_AUTHED  = true;
    window.LKP_ADMIN_USER    = user;
    window.LKP_ADMIN_PROFILE = profile;

    setStatus('Welcome back, ' + (profile.display_name || user.email.split('@')[0]) + '!', 'success');
    setBtnGranted();
    injectUserChip(user, profile);

    var signOutBtn = el('adminSignOutBtn');
    if (signOutBtn) signOutBtn.classList.remove('is-hidden');

    exitGate();

    window.dispatchEvent(new CustomEvent('lkp:admin-authed', {
      detail: { user: user, profile: profile }
    }));
  }

  /* ── Fetch profile and check role ─────────────────────────────────────── */

  async function fetchProfile(userId) {
    try {
      var result = await supa
        .from('profiles')
        .select('role, display_name')
        .eq('id', userId)
        .single();

      if (result.error) {
        console.warn('[LKP Admin Auth] Profile fetch error:', result.error.message);
        return null;
      }
      return result.data;
    } catch (err) {
      console.warn('[LKP Admin Auth] Profile fetch exception:', err.message);
      return null;
    }
  }

  /* ── Check existing session on page load ──────────────────────────────── */

  async function checkExistingSession() {
    setStatus('Checking session…');

    try {
      var result = await supa.auth.getSession();

      if (result.error || !result.data.session) {
        setStatus('Sign in with your admin account.');
        el('adminEmail')?.focus();
        return;
      }

      var user    = result.data.session.user;
      var profile = await fetchProfile(user.id);

      if (!profile) {
        setStatus('Session found but profile could not be loaded.', 'error');
        el('adminEmail')?.focus();
        return;
      }

      if (!ADMIN_ROLES.includes(profile.role)) {
        setStatus(
          'Signed in as ' + user.email + ' but role "' + profile.role + '" is not admin/owner.',
          'error'
        );
        el('adminEmail')?.focus();
        return;
      }

      grantAccess(user, profile);

    } catch (err) {
      console.warn('[LKP Admin Auth] Session check failed:', err.message);
      setStatus('Could not reach server. Check your connection.', 'error');
      el('adminEmail')?.focus();
    }
  }

  /* ── Sign-in form submit ──────────────────────────────────────────────── */

  async function handleSignIn(e) {
    if (e && e.preventDefault) e.preventDefault();

    clearErrors();

    var emailInput = el('adminEmail');
    var passInput  = el('adminPassword');
    var email    = (emailInput?.value || '').trim();
    var password = passInput?.value || '';

    /* Client-side validation */
    var valid = true;
    if (!email) {
      setFieldError('adminEmailField', 'adminEmailError', 'Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('adminEmailField', 'adminEmailError', 'Enter a valid email address.');
      valid = false;
    }
    if (!password) {
      setFieldError('adminPasswordField', 'adminPasswordError', 'Password is required.');
      valid = false;
    }
    if (!valid) return;

    setBtnLoading(true);
    setStatus('Verifying credentials…');

    try {
      var signInResult = await supa.auth.signInWithPassword({
        email:    email,
        password: password
      });

      if (signInResult.error) {
        var msg = signInResult.error.message || 'Sign in failed.';
        /* Make Supabase error messages friendlier */
        if (/invalid login credentials/i.test(msg)) {
          msg = 'Incorrect email or password.';
        } else if (/email not confirmed/i.test(msg)) {
          msg = 'Please confirm your email before signing in.';
        } else if (/too many requests/i.test(msg)) {
          msg = 'Too many attempts. Wait a moment and try again.';
        }
        setStatus(msg, 'error');
        setFieldError('adminPasswordField', 'adminPasswordError', msg);
        setBtnLoading(false);
        passInput?.select();
        return;
      }

      var user    = signInResult.data.user;
      var profile = await fetchProfile(user.id);

      if (!profile) {
        setStatus('Signed in but profile could not be loaded.', 'error');
        setBtnLoading(false);
        return;
      }

      if (!ADMIN_ROLES.includes(profile.role)) {
        await supa.auth.signOut();
        var roleMsg = 'This account has role "' + profile.role + '" — admin or owner role required.';
        setStatus(roleMsg, 'error');
        setFieldError('adminEmailField', 'adminEmailError', roleMsg);
        setBtnLoading(false);
        return;
      }

      grantAccess(user, profile);

    } catch (err) {
      setStatus('Sign in failed: ' + (err.message || 'Unknown error'), 'error');
      setBtnLoading(false);
    }
  }

  /* ── Password visibility toggle ───────────────────────────────────────── */

  function initPasswordToggle() {
    var toggle  = el('adminPasswordToggle');
    var passEl  = el('adminPassword');
    var eyeIcon = el('adminPasswordEyeIcon');

    if (!toggle || !passEl) return;

    toggle.addEventListener('click', function () {
      var isHidden = passEl.type === 'password';
      passEl.type = isHidden ? 'text' : 'password';

      if (eyeIcon) {
        eyeIcon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
      }
      toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');

      passEl.focus();
    });
  }

  /* ── Keyboard UX ──────────────────────────────────────────────────────── */

  function initKeyboardNav() {
    var emailEl = el('adminEmail');
    var passEl  = el('adminPassword');

    /* Email → Tab/Enter moves focus to password */
    emailEl?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        passEl?.focus();
      }
    });

    /* Password → Enter submits */
    passEl?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSignIn(null);
      }
    });

    /* Clear field error on typing */
    emailEl?.addEventListener('input', function () {
      setFieldError('adminEmailField', 'adminEmailError', '');
    });
    passEl?.addEventListener('input', function () {
      setFieldError('adminPasswordField', 'adminPasswordError', '');
    });
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */

  function init() {
    if (!window.supabase) {
      setStatus('Auth library not available.', 'error');
      console.warn('[LKP Admin Auth] window.supabase not found — is the CDN script loaded?');
      return;
    }

    supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    /* Expose client so lkp-signout.js can call auth.signOut() */
    window._lkpSupaClient = supa;
    window.supabaseClient  = supa;

    /* Wire form */
    el('adminAuthForm')?.addEventListener('submit', handleSignIn);
    el('adminSignInBtn')?.addEventListener('click', function (e) {
      /* The form submit handles it; this catches the case where the button is
         type="submit" inside the form — browser fires submit anyway, but
         belt-and-suspenders for any edge case. */
    });

    initPasswordToggle();
    initKeyboardNav();

    /* Auto-focus email (after a brief delay so the page is painted) */
    setTimeout(function () {
      if (!window.LKP_ADMIN_AUTHED) el('adminEmail')?.focus();
    }, 120);

    checkExistingSession();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
