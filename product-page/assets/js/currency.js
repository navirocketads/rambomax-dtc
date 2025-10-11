// assets/js/currency.js
(() => {
    const LS_KEY = 'rmx_currency'; // 'USD' | 'EUR' | 'GBP'
    const DEBUG = false;
    const log = (...a) => { if (DEBUG) console.log('[currency]', ...a); };
  
    // ---- Helpers -------------------------------------------------------------
    const setCur = (cur) => { localStorage.setItem(LS_KEY, cur); return cur; };
    const getParamCur = () => {
      const m = /(?:\?|&)cur=(usd|eur|gbp)\b/i.exec(location.search);
      return m ? m[1].toUpperCase() : null;
    };
  
    // Países da zona do euro
    const EURO_CC = new Set([
      'AT','BE','CY','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MT','NL','PT','SK','SI','ES'
    ]);
    // Timezones com GBP
    const GBP_TZ = new Set(['Europe/London']); // inclui GB e territórios que usam esse TZ
    // Alguns timezones europeus que NÃO são EUR (evita falso positivo)
    const NON_EUR_TZ = new Set([
      'Europe/London',      // GBP
      'Europe/Zurich',      // CHF
      'Europe/Geneva',      // CHF
      'Europe/Copenhagen',  // DKK
      'Europe/Stockholm',   // SEK
      'Europe/Oslo',        // NOK
      'Europe/Prague',      // CZK
      'Europe/Bucharest',   // RON
      'Europe/Budapest',    // HUF
      'Europe/Warsaw',      // PLN
      'Europe/Sofia',       // BGN
      'Europe/Belgrade',    // RSD
      'Europe/Kyiv',        // UAH
      'Europe/Moscow'       // RUB
    ]);
  
    // ---- Detecção (prioriza timezone) ---------------------------------------
    function detectCurrency() {
      // 1) URL override (ótimo pra teste)
      const q = getParamCur();
      if (q) return q; // 'USD' | 'EUR' | 'GBP'
  
      // 2) Cache
      const saved = localStorage.getItem(LS_KEY);
      if (saved === 'USD' || saved === 'EUR' || saved === 'GBP') return saved;
  
      // 3) Timezone primeiro (mais confiável)
      let tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch {}
      if (tz) {
        if (GBP_TZ.has(tz)) return 'GBP';
        if (tz.startsWith('Europe/') && !NON_EUR_TZ.has(tz)) return 'EUR';
      }
  
      // 4) Fallback: região do locale
      let region = null;
      try {
        const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
        try { region = new Intl.Locale(lang).maximize().region || null; } catch {}
        if (!region) {
          const loc = Intl.DateTimeFormat().resolvedOptions().locale || '';
          const m = /-([A-Z]{2})\b/.exec(loc);
          region = m ? m[1] : null;
        }
      } catch {}
  
      if (region === 'GB') return 'GBP';
      if (region && EURO_CC.has(region)) return 'EUR';
  
      // 5) Default
      return 'USD';
    }
  
    // ---- Aplicação do símbolo (apenas símbolo, não mexe no número) ----------
    function applySymbol(cur) {
      const SYM = cur === 'EUR' ? '€' : cur === 'GBP' ? '£' : '$';
  
      // (A) elementos dedicados <span class="curr">
      document.querySelectorAll('.curr').forEach(el => { el.textContent = SYM; });
  
      // (B) troca símbolos em textos visíveis dentro das áreas do site
      // Evita mexer em <script>, <style> e inputs.
      const scopes = document.querySelectorAll(`
        .rmx-offer,
        .rmx-offers-v2,
        .rmx-offers-v3,
        .hl,
        .proof,
        .wte,
        .cmp,
        .rmx-authority,
        .rm-testimonials,
        .rmx-guarantee-section,
        .mech
      `);
  
      const replaceInNode = (node) => {
        if (!node || !node.nodeValue) return;
        if (!/[$€£]/.test(node.nodeValue)) return;
        node.nodeValue = node.nodeValue.replace(/[$€£]/g, SYM);
      };
  
      scopes.forEach(root => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) => {
            const p = n.parentNode && n.parentNode.nodeName;
            if (p === 'SCRIPT' || p === 'STYLE') return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(replaceInNode);
      });
  
      // (C) titles/aria-label (UX)
      document.querySelectorAll('[title],[aria-label]').forEach(el => {
        if (el.title && /[$€£]/.test(el.title)) el.title = el.title.replace(/[$€£]/g, SYM);
        const ar = el.getAttribute('aria-label');
        if (ar && /[$€£]/.test(ar)) el.setAttribute('aria-label', ar.replace(/[$€£]/g, SYM));
      });
    }
  
    // ---- Boot ---------------------------------------------------------------
    function init() {
      const cur = detectCurrency();
      setCur(cur);
      applySymbol(cur);
  
      // helper p/ console
      window.__setCurrency = (c) => {
        c = String(c || '').toUpperCase();
        if (!['USD','EUR','GBP'].includes(c)) {
          console.warn('Use "USD", "EUR" ou "GBP"');
          return;
        }
        setCur(c);
        applySymbol(c);
      };
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  })();
  