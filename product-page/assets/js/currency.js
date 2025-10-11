// Troca APENAS o símbolo ($ → €, £, etc.), mantendo os mesmos valores numéricos.
(function () {
    // 1) Mapeia símbolo por moeda
    const SYMBOLS = {
      USD: '$', EUR: '€', GBP: '£', CHF: 'CHF', DKK: 'kr', SEK: 'kr', NOK: 'kr', PLN: 'zł'
    };
  
    // 2) Descobre país/moeda
    function detectCurrency() {
      // a) Override opcional por query: ?cur=EUR (útil pra teste/ads)
      const qp = new URLSearchParams(location.search);
      const force = (qp.get('cur') || qp.get('currency') || '').toUpperCase();
      if (SYMBOLS[force]) return force;
  
      // b) Cloudflare (se existir)
      try {
        const cc = (window.cloudflare && cloudflare.country) || '';
        const cur = countryToCurrency(cc);
        if (cur) return cur;
      } catch {}
  
      // c) Idioma do navegador (fallback rápido e sem requisição)
      try {
        const lang = (navigator.language || '').toUpperCase(); // ex: "pt-BR", "en-GB"
        const cc = lang.split('-')[1] || '';
        const cur = countryToCurrency(cc);
        if (cur) return cur;
      } catch {}
  
      // d) Padrão
      return 'USD';
    }
  
    function countryToCurrency(cc) {
      switch (cc) {
        case 'FR': case 'ES': case 'IT': case 'PT': case 'DE': case 'NL':
        case 'BE': case 'FI': case 'IE': case 'LU': case 'AT': case 'GR':
        case 'EE': case 'LV': case 'LT': case 'MT': case 'CY': case 'SI': case 'SK':
          return 'EUR';
        case 'GB': return 'GBP';
        case 'CH': return 'CHF';
        case 'DK': return 'DKK';
        case 'SE': return 'SEK';
        case 'NO': return 'NOK';
        case 'PL': return 'PLN';
        default: return 'USD';
      }
    }
  
    const CURRENCY = detectCurrency();
    const SYMBOL = SYMBOLS[CURRENCY] || '$';
  
    // 3) Substitui símbolos no DOM (somente caractere '$')
    const TARGETS = [
      '.ov3-perpack', '.ov3-line strong', '.ov3-save',
      '.rmx-price-now', '.rmx-total', '.rmx-save'
    ];
  
    function replaceSymbols(root = document) {
      TARGETS.forEach(sel => {
        root.querySelectorAll(sel).forEach(el => {
          // Troca todos os '$' visíveis no texto
          el.textContent = el.textContent.replace(/\$/g, SYMBOL);
        });
      });
    }
  
    // Rodar quando a página estiver pronta
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        replaceSymbols();
        observeMutations();
      });
    } else {
      replaceSymbols();
      observeMutations();
    }
  
    // 4) Se algum script atualizar preços depois, garantimos a troca
    function observeMutations() {
      const mo = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'childList' || m.type === 'characterData') {
            replaceSymbols(document);
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  
    // Log de debug (remova se quiser)
    console.log(`💱 Currency symbol set to "${SYMBOL}" (${CURRENCY})`);
  })();
  