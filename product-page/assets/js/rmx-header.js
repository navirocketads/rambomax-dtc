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
  