/* ═══════════════════════════════════════════════════════════════════════════
   KA PAEPAE ʻIKE OLA — XRPL TESTNET INTEGRATION
   File: LKP/js/lkp-xrpl.js

   Records lesson completions on the XRPL Testnet as transactions with Memo
   fields containing structured proof-of-learning data. Each completed lesson
   gets a unique tx hash stored alongside its reward record.

   Flow:
     1. User completes a lesson → lkp:lesson-completed fires
     2. Check if testnet wallet exists in localStorage
     3. If none, offer to create one (funded from XRPL testnet faucet)
     4. If wallet exists, submit a Payment tx with structured Memo
     5. Store txHash in localStorage alongside the reward record
═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const WALLET_KEY   = 'lkp_xrpl_testnet_wallet_v1';
  const TX_LOG_KEY   = 'lkp_xrpl_tx_log_v1';
  const TESTNET_WSS  = 'wss://s.altnet.rippletest.net:51233';
  const FAUCET_URL   = 'https://faucet.altnet.rippletest.net/accounts';
  /* The testnet faucet address — used as a nominal destination for memo payments */
  const FAUCET_ADDR = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe';

  let _client = null;
  let _connecting = false;

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function getWallet() {
    return readJSON(WALLET_KEY, null);
  }

  function saveWallet(wallet) {
    writeJSON(WALLET_KEY, {
      address:  wallet.address  || wallet.classicAddress,
      seed:     wallet.seed,
      network:  'testnet',
      created:  new Date().toISOString()
    });
  }

  function getTxLog() {
    return readJSON(TX_LOG_KEY, []);
  }

  function logTx(entry) {
    const log = getTxLog();
    log.push(entry);
    writeJSON(TX_LOG_KEY, log.slice(-200));
  }

  /* ── XRPL client ──────────────────────────────────────────────────────── */

  async function getClient() {
    if (_client && _client.isConnected()) return _client;
    if (_connecting) {
      await new Promise(resolve => setTimeout(resolve, 1800));
      return _client;
    }

    if (!window.xrpl) {
      console.warn('[LKP XRPL] xrpl.js not loaded — skipping on-chain recording.');
      return null;
    }

    _connecting = true;
    try {
      _client = new window.xrpl.Client(TESTNET_WSS);
      await _client.connect();
      console.log('[LKP XRPL] Connected to testnet.');
    } catch (err) {
      console.warn('[LKP XRPL] Connection failed:', err.message);
      _client = null;
    } finally {
      _connecting = false;
    }
    return _client;
  }

  /* ── Wallet creation ──────────────────────────────────────────────────── */

  async function createTestnetWallet() {
    if (!window.xrpl) return null;

    try {
      const resp = await fetch(FAUCET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!resp.ok) throw new Error('Faucet returned ' + resp.status);

      const data = await resp.json();
      const walletData = data.account || data.wallet || data;
      const wallet = {
        address: walletData.address || walletData.classicAddress,
        seed:    walletData.secret  || walletData.seed
      };

      if (!wallet.address || !wallet.seed) throw new Error('Unexpected faucet response shape.');

      saveWallet(wallet);
      console.log('[LKP XRPL] Testnet wallet created:', wallet.address);
      return wallet;
    } catch (err) {
      console.warn('[LKP XRPL] Wallet creation failed:', err.message);
      return null;
    }
  }

  /* ── Record on-chain ──────────────────────────────────────────────────── */

  async function recordCompletion(lessonData) {
    let walletRecord = getWallet();
    if (!walletRecord) {
      walletRecord = await createTestnetWallet();
      if (!walletRecord) return null;
    }

    const client = await getClient();
    if (!client) return null;

    if (!window.xrpl) return null;

    try {
      const wallet = window.xrpl.Wallet.fromSeed(walletRecord.seed);

      const memoData = JSON.stringify({
        platform: 'lkp',
        type:     'lesson_complete',
        id:       lessonData.lessonId || lessonData.id,
        title:    (lessonData.lesson?.title || lessonData.title || '').slice(0, 80),
        culture:  lessonData.lesson?.cultureId || '',
        ts:       Math.floor(Date.now() / 1000)
      });

      const toHex = str => Array.from(new TextEncoder().encode(str))
        .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      const tx = {
        TransactionType: 'Payment',
        Account:  wallet.address,
        Destination: FAUCET_ADDR,
        Amount:   '1',
        Memos: [{
          Memo: {
            MemoType: toHex('lkp/lesson-complete'),
            MemoData: toHex(memoData)
          }
        }]
      };

      const prepared = await client.autofill(tx);
      const signed   = wallet.sign(prepared);
      const result   = await client.submitAndWait(signed.tx_blob);

      const txHash = result.result?.hash || signed.hash;
      console.log('[LKP XRPL] Lesson recorded on testnet. TX:', txHash);

      logTx({
        txHash,
        lessonId:  lessonData.lessonId || lessonData.id,
        title:     lessonData.lesson?.title || '',
        ts:        new Date().toISOString(),
        network:   'testnet'
      });

      window.dispatchEvent(new CustomEvent('lkp:xrpl-recorded', {
        detail: { txHash, lessonId: lessonData.lessonId }
      }));

      return txHash;
    } catch (err) {
      console.warn('[LKP XRPL] Recording failed:', err.message);
      return null;
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  window.LKPXrpl = {
    getWallet,
    createTestnetWallet,
    recordCompletion,
    getTxLog,

    hasWallet() { return !!getWallet(); },

    async ensureWallet() {
      if (getWallet()) return getWallet();
      return createTestnetWallet();
    }
  };

  /* ── Auto-record on lesson completion ────────────────────────────────── */

  window.addEventListener('lkp:lesson-completed', async function (event) {
    const { lesson, lessonId } = event.detail || {};

    if (!window.xrpl) return;

    const xrplReady = window.LKPRewards?.exportXRPLReadyClaims?.()
      ?.some(r => r.lessonId === lessonId || r.id === lessonId);

    if (xrplReady || true) {
      try {
        await recordCompletion({ lessonId, lesson });
      } catch {}
    }
  });

  console.log('[LKP XRPL] Module loaded. Wallet present:', !!getWallet());

})();
