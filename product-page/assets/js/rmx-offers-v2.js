// assets/js/rmx-offers-v2.js
document.addEventListener('DOMContentLoaded', () => {
    // Preços / links (mesmo dataset do seu rmx-offer.js)
    const KITS = {
      one:  { was:199, total:39, href:"https://pay.gvitalabs.com/checkout/198194802:1", sku:"RMX-1" },
      three:{ was:597, total:90, href:"https://pay.gvitalabs.com/checkout/198194803:1", sku:"RMX-3" },
      six:  { was:1188, total:150, href:"https://pay.gvitalabs.com/checkout/198194804:1", sku:"RMX-6" }
    };
    const fmt = n => `$${Number(n).toLocaleString()}`;
  
    // Preenche preços/savings
    [["one","#p-one","#s-one"],["three","#p-three","#s-three"],["six","#p-six","#s-six"]]
      .forEach(([k,pSel,sSel])=>{
        const kit=KITS[k]; const p=document.querySelector(pSel); const s=document.querySelector(sSel);
        if(!kit||!p||!s) return; p.textContent=fmt(kit.total); s.textContent=`Save ${fmt(kit.was-kit.total)}`;
      });
  
    // Aplica links + UTMs nos CTAs
    document.querySelectorAll('.ov2-card').forEach(card=>{
      const key = card.dataset.kit, a = card.querySelector('.ov2-cta'); if(!a||!KITS[key]) return;
      const base = new URL(KITS[key].href); const qs = new URLSearchParams(location.search);
      qs.forEach((v,k)=>{ if(!base.searchParams.has(k)) base.searchParams.set(k,v); });
      a.href = base.toString(); a.dataset.sku = KITS[key].sku;
    });
  
    // Social proof slider (texto)
    const track = document.querySelector('.pr-track');
    const dots  = [...document.querySelectorAll('.pr-dot')];
    if (track && dots.length) {
      let idx = 0;
      const go = i => { idx = Math.max(0, Math.min(i, dots.length-1));
        track.style.transform = `translateX(-${idx*100}%)`;
        dots.forEach((d,j)=>d.classList.toggle('is-active', j===idx));
      };
      dots.forEach((d,i)=> d.addEventListener('click', ()=>go(i)));
      // Swipe básico
      let sx=0; track.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
      track.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) go(idx + (dx<0?1:-1));
      });
    }
  });
  




(function(){
  const track = document.getElementById('proofTrack');
  const dotsWrap = document.getElementById('proofDots');
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.children);
  dotsWrap.innerHTML = cards.map((_,i)=>`<span class="dot${i===0?' is-active':''}"></span>`).join('');
  const dots = Array.from(dotsWrap.children);

  function syncDots(){
    const w = track.clientWidth;
    const idx = Math.round(track.scrollLeft / (w + 14 /* gap */));
    dots.forEach((d,i)=>d.classList.toggle('is-active', i===idx));
  }
  track.addEventListener('scroll', syncDots, {passive:true});

  dots.forEach((d,i)=>d.addEventListener('click',()=>{
    cards[i]?.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
  }));
})();

