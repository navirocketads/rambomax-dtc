(function(){
    const ready = (fn)=> (document.readyState!=='loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);
    ready(()=>{
      const tabs = document.querySelectorAll('.wte-tab');
      if (!tabs.length) return;
      const panels = {
        'wte-panel-expect': document.getElementById('wte-panel-expect'),
        'wte-panel-faq': document.getElementById('wte-panel-faq')
      };
      tabs.forEach(btn=>{
        btn.addEventListener('click', ()=>{
          tabs.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
          btn.classList.add('active'); btn.setAttribute('aria-selected','true');
          Object.values(panels).forEach(p=>{ if(p){ p.classList.remove('is-active'); p.setAttribute('hidden',''); }});
          const target = panels[btn.dataset.panel];
          if (target){ target.classList.add('is-active'); target.removeAttribute('hidden'); }
        });
      });
    });
  })();
  