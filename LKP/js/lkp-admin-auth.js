/* ═══════════════════════════════════════════════════════════════════════════
   THE LIVING KNOWLEDGE PLATFORM — Admin Auth Gate
   File: LKP/js/lkp-admin-auth.js

   Initializes the Supabase client, checks for an existing admin session,
   and wires the sign-in form. Fires 'lkp:admin-authed' on window when
   a confirmed admin/owner role is verified. The workbench listens for this
   event before it initializes.
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var SUPABASE_URL      = 'https://fmrjdvsqdfyaqtzwbbqi.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcmpkdnNxZGZ5YXF0endiYnFpIiwi' +
    'cm9sZSI6ImFub24iLCJpYXQiOjE3NzU1OTE2MzYsImV4cCI6MjA5MTE2NzYzNn0.' +
    'UKyvX02bG4cNhb7U2TK96t8XFREHYYwHJIKbPK06nqs';

  var ADMIN_ROLES = ['admin', 'owner'];

  var supa = null;

  /* ── UI helpers ─────────────────────────────────────────────────────────── */

  function setStatus(msg, isError) {
    var el = document.getElementById('adminAccessStatus');
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#ff9aa5' : '';
  }

  function setBtnState(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing in…';
    } else {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-user-shield"></i> Sign In';
    }
  }

  /* ── Reveal admin app after confirmed auth ──────────────────────────────── */

  function grantAccess(user, profile) {
    window.LKP_ADMIN_AUTHED  = true;
    window.LKP_ADMIN_USER    = user;
    window.LKP_ADMIN_PROFILE = profile;

    var app = document.getElementById('adminApp');
    if (app) app.classList.remove('is-hidden');

    var signOutBtn = document.getElementById('adminSignOutBtn');
    if (signOutBtn) signOutBtn.classList.remove('is-hidden');

    setStatus(
      'Signed in as ' + (profile.display_name || user.email) +
      ' · role: ' + profile.role
    );

    window.dispatchEvent(new CustomEvent('lkp:admin-authed', {
      detail: { user: user, profile: profile }
    }));
  }

  /* ── Role check ─────────────────────────────────────────────────────────── */

  async function fetchProfile(userId) {
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
  }

  /* ── Check existing session on page load ────────────────────────────────── */

  async function checkExistingSession() {
    setStatus('Checking session…');

    try {
      var sessionResult = await supa.auth.getSession();

      if (sessionResult.error || !sessionResult.data.session) {
        setStatus('Sign in with your admin account to continue.');
        return;
      }

      var user    = sessionResult.data.session.user;
      var profile = await fetchProfile(user.id);

      if (!profile) {
        setStatus('Could not load profile. Try signing in again.');
        return;
      }

      if (!ADMIN_ROLES.includes(profile.role)) {
        setStatus(
          'Signed in as ' + user.email + ' but role "' + profile.role + '" is not admin or owner.',
          true
        );
        return;
      }

      grantAccess(user, profile);

    } catch (err) {
      console.warn('[LKP Admin Auth] Session check failed:', err.message);
      setStatus('Session check failed. Try signing in.');
    }
  }

  /* ── Sign-in form handler ───────────────────────────────────────────────── */

  async function handleSignIn() {
    var emailEl    = document.getElementById('adminEmail');
    var passwordEl = document.getElementById('adminPassword');
    var btn        = document.getElementById('adminSignInBtn');

    var email    = (emailEl?.value || '').trim();
    var password = passwordEl?.value || '';

    if (!email || !password) {
      setStatus('Enter your email and password.', true);
      return;
    }

    setBtnState(btn, true);
    setStatus('Verifying…');

    try {
      var signInResult = await supa.auth.signInWithPassword({
        email:    email,
        password: password
      });

      if (signInResult.error) {
        setStatus(signInResult.error.message, true);
        setBtnState(btn, false);
        return;
      }

      var user    = signInResult.data.user;
      var profile = await fetchProfile(user.id);

      if (!profile) {
        setStatus('Signed in but could not load profile.', true);
        setBtnState(btn, false);
        return;
      }

      if (!ADMIN_ROLES.includes(profile.role)) {
        await supa.auth.signOut();
        setStatus(
          'Account role "' + profile.role + '" does not have admin access.',
          true
        );
        setBtnState(btn, false);
        return;
      }

      grantAccess(user, profile);

    } catch (err) {
      setStatus('Sign in failed: ' + err.message, true);
      setBtnState(btn, false);
    }
  }

  /* ── Init ───────────────────────────────────────────────────────────────── */

  function init() {
    if (!window.supabase) {
      setStatus('Supabase library not loaded.', true);
      console.warn('[LKP Admin Auth] window.supabase not available.');
      return;
    }

    supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    /* Expose so lkp-signout.js can call supa.auth.signOut() */
    window._lkpSupaClient = supa;
    window.supabaseClient  = supa;

    /* Wire sign-in form */
    document.getElementById('adminSignInBtn')
      ?.addEventListener('click', handleSignIn);

    document.getElementById('adminPassword')
      ?.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleSignIn();
      });

    /* Check for an already-active session */
    checkExistingSession();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
