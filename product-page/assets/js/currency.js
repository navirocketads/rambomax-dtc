// assets/js/currency.js
(function () {
    // --- 0) Override manual opcional: defina window.RMX_CURRENCY = 'EUR' antes deste script
    var forced = (window.RMX_CURRENCY || '').toUpperCase();
    if (!/^(USD|EUR|GBP)$/.test(forced)) forced = '';
  
    // --- 1) Preferência salva
    var saved = (localStorage.getItem('cur') || '').toUpperCase();
    if (!/^(USD|EUR|GBP)$/.test(saved)) saved = '';
  
    // --- 2) Detecta país pelo idioma
    function detectRegionFromLanguages() {
      var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).filter(Boolean);
      for (var i = 0; i < langs.length; i++) {
        var m = langs[i].match(/-([A-Z]{2})$/i);
        if (m) return m[1].toUpperCase();
      }
      // fallback: às vezes locale vem aqui
      var loc = (Intl.DateTimeFormat().resolvedOptions().locale || '');
      var m2 = loc.match(/-([A-Z]{2})$/i);
      return m2 ? m2[1].toUpperCase() : '';
    }
  
    // --- 3) Detecta pela timezone
    function detectRegionFromTZ() {
      try {
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (!tz) return '';
        if (tz === 'Europe/London' || tz === 'Europe/Jersey' || tz === 'Europe/Guernsey' || tz === 'Europe/Isle_of_Man') return 'GB';
        if (tz.startsWith('Europe/')) return 'EU'; // Trata como Eurozone genericamente
      } catch (e) {}
      return '';
    }
  
    var region = detectRegionFromLanguages();
    if (!region) region = detectRegionFromTZ();
  
    // --- 4) Mapa de Eurozone (país -> EUR)
    var EURO = new Set([
      'AT','BE','HR','CY','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MT','NL','PT','SK','SI','ES'
    ]);
    // Observação: se vier 'EU' do timezone, tratamos como Euro.
    var GBP_COUNTRIES = new Set(['GB']);
  
    function decideCurrency() {
      if (forced) return forced;
      if (saved) return saved;
      if (GBP_COUNTRIES.has(region)) return 'GBP';
      if (region === 'EU' || EURO.has(region)) return 'EUR';
      return 'USD';
    }
  
    var cur = decideCurrency();
    localStorage.setItem('cur', cur);
  
    var MAP = { USD: '$', EUR: '€', GBP: '£' };
    var SYM = MAP[cur];
  
    // --- 5) Alvos que existem no seu HTML
    var TARGETS = [
      // Offers v3
      '.ov3-perpack',           // ex.: <span class="curr">$</span>49
      '.ov3-line strong',       // Totals
      '.ov3-save',              // "Save $xxx"
      '.ov3-gift .price',       // bônus: <s>$15.00</s> FREE
  
      // Seções antigas (se existirem)
      '.rmx-price-now',
      '.rmx-price-was',
      '#rmxTotal',
      '#rmxSave'
    ];
  
    // --- 6) Regras de substituição
    // 6.a) Trocar <span class="curr">$</span> (ou €/£) pelo símbolo detectado
    function fixCurrSpans(scope) {
      scope.querySelectorAll('.curr').forEach(function (el) {
        var t = (el.textContent || '').trim();
        if (t === '$' || t === '€' || t === '£') el.textContent = SYM;
      });
    }
  
    // 6.b) Em outros textos, trocar SOMENTE quando tiver símbolo seguido de número
    //     Mantém unidades, palavras e sufixos intocados.
    var RE = /(^|\s)([$€£])(?=\d)/g;
    function swapTextNodes(el) {
      for (var i = 0; i < el.childNodes.length; i++) {
        var n = el.childNodes[i];
        if (n.nodeType === 3) {
          var before = n.nodeValue;
          var after = before.replace(RE, function (m, p1/*space*/, p2/*simbolo*/) {
            return p1 + SYM;
          });
          if (after !== before) n.nodeValue = after;
        }
      }
    }
  
    function run(scope) {
      try {
        fixCurrSpans(scope);
        TARGETS.forEach(function (sel) {
          scope.querySelectorAll(sel).forEach(function (el) {
            swapTextNodes(el);
            el.querySelectorAll('s, b, strong, i, span').forEach(swapTextNodes);
          });
        });
        // útil para depurar no inspector
        document.documentElement.setAttribute('data-cur', cur);
      } catch (e) {
        console.warn('[currency] erro:', e);
      }
    }
  
    // --- 7) Execução inicial
    function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();}
    ready(function(){ run(document); });
  
    // --- 8) Se conteúdo for injetado depois (ex.: carrossel lazy, tabs), reprocessa de leve
    var mo = new MutationObserver(function (muts) {
      // Reprocessa só o nó do mutation (barato e suficiente)
      muts.forEach(function (m) {
        if (m.addedNodes) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) run(node);
          });
        }
      });
    });
    try {
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  })();
  