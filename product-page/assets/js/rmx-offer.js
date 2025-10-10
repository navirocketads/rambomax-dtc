// assets/js/rmx-offer.js
document.addEventListener('DOMContentLoaded', () => {
  // Imagens fixas do carrossel
  const GALLERY_IMGS = [
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-6_41PM.png",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_18PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_29PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_21PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_30PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-6_39PM.png"
  ];

  const gallery = document.getElementById('rmxGallery');
  const dotsWrap = document.getElementById('rmxDots');
  if (!gallery || !dotsWrap) return;

  // Monta slides (usa GALLERY_IMGS!)
  gallery.innerHTML = GALLERY_IMGS.map((src,i) =>
    `<div class="rmx-slide${i===0?' is-active':''}">
       <img src="${src}" alt="Rambo Max image ${i+1}">
     </div>`
  ).join('');

  // Monta dots
  dotsWrap.innerHTML = GALLERY_IMGS.map((_,i)=>
    `<span class="rmx-dot${i===0?' is-active':''}" data-idx="${i}"></span>`
  ).join('');

  const slides = Array.from(gallery.querySelectorAll('.rmx-slide'));
  const dots   = Array.from(dotsWrap.querySelectorAll('.rmx-dot'));

  let idx = 0;
  const clamp = (n) => Math.max(0, Math.min(slides.length-1, n));

  function show(i){
    idx = clamp(i);
    slides.forEach((s,k)=>s.classList.toggle('is-active', k===idx));
    dots.forEach((d,k)=>d.classList.toggle('is-active', k===idx));
  }

  // Dots click
  dots.forEach(d => d.addEventListener('click', e => {
    const i = +e.currentTarget.dataset.idx;
    show(i);
  }));

  // Swipe (touch + mouse)
  let startX = 0, deltaX = 0, swiping = false;

  function onStart(e){
    const t = e.touches ? e.touches[0] : e;
    startX = t.clientX;
    deltaX = 0;
    swiping = true;
  }
  function onMove(e){
    if (!swiping) return;
    const t = e.touches ? e.touches[0] : e;
    deltaX = t.clientX - startX;
  }
  function onEnd(){
    if (!swiping) return;
    swiping = false;
    const TH = 40;
    if (deltaX >  TH) show(idx - 1);
    if (deltaX < -TH) show(idx + 1);
  }

  gallery.addEventListener('touchstart', onStart, {passive:true});
  gallery.addEventListener('touchmove',  onMove,  {passive:true});
  gallery.addEventListener('touchend',   onEnd);

  gallery.addEventListener('mousedown', (e)=>{ onStart(e); e.preventDefault(); });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  // Fallback de imagem
  gallery.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', () => {
      img.src = "https://via.placeholder.com/900x700.png?text=RAMBO+MAX";
    });
  });
});
