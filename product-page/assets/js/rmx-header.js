(function(){
    const ready = (fn)=> (document.readyState!=='loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);
    ready(()=>{
      const header = document.getElementById('rmx-header'); if (!header) return;
      const toggle = header.querySelector('.nav-toggle');
      const nav = header.querySelector('.nav');
      if (!toggle || !nav) return;
      const open  = ()=>{ nav.classList.add('is-open');  toggle.setAttribute('aria-expanded','true'); };
      const close = ()=>{ nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false'); };
      const isOpen = ()=> nav.classList.contains('is-open');
      toggle.addEventListener('click', (e)=>{ e.stopPropagation(); isOpen()?close():open(); });
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
      document.addEventListener('click', (e)=>{ if (!header.contains(e.target)) close(); });
      document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') close(); });
      const mq = window.matchMedia('(min-width: 961px)');
      const onMQ = (e)=>{ if (e.matches) close(); };
      if (mq.addEventListener) mq.addEventListener('change', onMQ); else mq.addListener(onMQ);
    });
  })();
  

  // ===== Header mobile menu + smart anchors (offer/science/reviews/FAQ) =====
(function () {
  const header = document.getElementById('rmx-header');
  const nav    = document.getElementById('primary-nav');
  const toggle = header?.querySelector('.nav-toggle');

  if (!header || !nav) return;

  // helpers
  const isOpen  = () => nav.classList.contains('is-open');
  const open    = () => { nav.classList.add('is-open');  toggle?.setAttribute('aria-expanded','true'); };
  const close   = () => { nav.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false'); };

  // toggle
  toggle?.addEventListener('click', (e) => { e.stopPropagation(); isOpen() ? close() : open(); });
  document.addEventListener('click', (e) => { if (!header.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // fecha quando sobe pra desktop
  const mq = window.matchMedia('(min-width: 961px)');
  const handleMQ = (e) => { if (e.matches) close(); };
  if (mq.addEventListener) mq.addEventListener('change', handleMQ); else mq.addListener(handleMQ);

  // ===== Smooth scroll com offset do header fixo =====
  function scrollWithOffset(elem) {
    if (!elem) return;
    const headerH = header.getBoundingClientRect().height || 0;
    const y = elem.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  // Mapa de destinos (corrige #kit -> #offer e trata #faq)
  const MAP = {
    '#kit': '#offer',
    '#offer': '#offer',
    '#science': '#science',
    '#reviews': '#reviews',
    '#faq': '#what-to-expect' // a seção onde fica a aba do FAQ
  };

  // Ativa a aba FAQ
  function activateFAQTab() {
    // botão da aba FAQ
    const faqBtn = document.querySelector('.wte-tab[data-panel="wte-panel-faq"]');
    const expectBtn = document.querySelector('.wte-tab[data-panel="wte-panel-expect"]');
    const faqPanel = document.getElementById('wte-panel-faq');
    const expPanel = document.getElementById('wte-panel-expect');
    if (faqBtn && faqPanel && expectBtn && expPanel) {
      // estado visual das abas
      [faqBtn, expectBtn].forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      faqBtn.classList.add('active'); faqBtn.setAttribute('aria-selected','true');
      // painéis
      expPanel.classList.remove('is-active'); expPanel.setAttribute('hidden','');
      faqPanel.classList.add('is-active');    faqPanel.removeAttribute('hidden');
    }
  }

  // Delegação de cliques no menu
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const raw = a.getAttribute('href');
    const targetSel = MAP[raw] || raw; // corrige #kit
    const target = document.querySelector(targetSel);

    // se for FAQ, ativa a aba antes de rolar
    if (raw === '#faq') activateFAQTab();

    if (target) {
      e.preventDefault();
      close();            // fecha menu mobile
      // dá um pequeno delay para layout “fechado” aplicar antes do cálculo do offset
      setTimeout(() => scrollWithOffset(target), 50);
    }
  });
})();
