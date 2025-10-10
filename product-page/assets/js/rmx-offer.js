// assets/js/rmx-offer.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== 1) Imagens fixas do carrossel =====
  // (mantidas do seu projeto; troque a lista se quiser outra ordem)
  const GALLERY_IMGS = [
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-6_41PM.png",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_18PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_29PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_21PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_30PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-6_39PM.png"
  ];

  // ===== 2) Cache de elementos =====
  const $ = s => document.querySelector(s);
  const el = {
    gallery: $('#rmxGallery'),
    dots:    $('#rmxDots'),
  };

  if (!el.gallery || !el.dots) {
    console.warn('[RMX] Gallery or dots container not found.');
    return;
  }

  // ===== 3) Render do carrossel fixo =====
  function renderGallery(imgs = []) {
    // fallback
    if (!Array.isArray(imgs)) imgs = [String(imgs)].filter(Boolean);
    if (imgs.length === 0) {
      imgs = ['https://via.placeholder.com/800x600.png?text=Rambo+Max'];
    }

    // slides
    el.gallery.innerHTML = imgs.map((src, i) => `
      <div class="rmx-slide">
        <img src="${src}" alt="Rambo Max image ${i + 1}" loading="lazy" draggable="false">
      </div>
    `).join('');

    // dots
    el.dots.innerHTML = imgs.map((_, i) =>
      `<button class="rmx-dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Go to image ${i + 1}"></button>`
    ).join('');

    const slides = Array.from(el.gallery.children);
    const dots   = Array.from(el.dots.children);

    // segurança: se alguma imagem quebrar, troca por placeholder
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      img.addEventListener('error', () => {
        img.src = 'https://via.placeholder.com/800x600.png?text=Rambo+Max';
      });
    });

    // ativa dot conforme scroll (assume CSS com scroll-snap)
    function setActiveByScroll() {
      const slideWidth = el.gallery.clientWidth; // largura visível
      // margem entre slides pode vir do gap via CSS; arredondamos
      const idx = Math.round(el.gallery.scrollLeft / slideWidth);
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }

    el.gallery.addEventListener('scroll', setActiveByScroll, { passive: true });

    // clique nos dots
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        const slide = slides[i];
        if (slide) slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    // teclas ← →
    el.gallery.setAttribute('tabindex', '0'); // garante foco para teclado
    el.gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') el.gallery.scrollBy({ left: el.gallery.clientWidth, behavior: 'smooth' });
      if (e.key === 'ArrowLeft')  el.gallery.scrollBy({ left: -el.gallery.clientWidth, behavior: 'smooth' });
    }, { passive: true });
  }

  // ===== 4) Inicializa =====
  renderGallery(GALLERY_IMGS);
});
