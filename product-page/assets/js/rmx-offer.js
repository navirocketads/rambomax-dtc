// assets/js/rmx-offer.js
document.addEventListener('DOMContentLoaded', () => {
  
    // 1) Dados dos kits
    const RMX_KITS = {
      one:  { ribbon:"", 
      imgs:["https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-6_39PM.webp",
      "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_18PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_29PM.webp",
  "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_21PM.webp",
  "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_30PM.webp"],
              title:"Basic", sub:"1 Pack · 30-Day Supply", was:199, total:39, per:39, save:130, days:30,
              note:"Free US Shipping on 3+ bottles", href:"https://pay.gvitalabs.com/checkout/198194802:1", sku:"RMX-1", gifts:[] },
      three:{ ribbon:"MOST POPULAR", 
      imgs:["https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-6_39PM.webp",
      "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_18PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_29PM.webp",
  "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_21PM.webp",
  "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_30PM.webp"],
              title:"Most Popular", sub:"3 Packs · 90-Day Supply", was:597, total:90, per:30, save:420, days:90,
              note:"Includes FREE US Shipping + 2 Gifts", href:"https://pay.gvitalabs.com/checkout/198194803:1", sku:"RMX-3",
              gifts:[
                {name:"3 Techniques to last at least 30 minutes in bed ($49) - FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/Screenshot-2025-09-29-at-08.25.42.jpg"},
                {name:"1K Testosterone Guide ($49) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/testoGuide.jpg"}
              ]},
      six:  { ribbon:"BEST VALUE", 
      imgs:["https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-6_39PM.webp",
      "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_18PM.webp",
    "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_29PM.webp",
  "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_21PM.webp",
  "https://vsl.infotrendnews.online/wp-content/uploads/2025/10/Generated-Image-October-07-2025-7_30PM.webp"],
              title:"Best Value", sub:"6 Packs · 180-Day Supply", was:1188, total:150, per:25, save:894, days:180,
              note:"FREE US Shipping + 3 Gifts + Biggest Savings", href:"https://pay.gvitalabs.com/checkout/198194804:1", sku:"RMX-6",
              gifts:[
                {name:"Rambo Max App - Daily Progress Track ($97/mo) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/ramboMaxAPP.jpg"},
                {name:"3 Techniques to last at least 30 minutes in bed ($49) - FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/Screenshot-2025-09-29-at-08.25.42.jpg"},
                {name:"1K Testosterone Guide ($49) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/testoGuide.jpg"}
              ]}
    };
  

    
    // 2) Cache
  const $ = s => document.querySelector(s);
  const el = {
    switcher: document.querySelector('.rmx-switch'),
    gallery:  $('#rmxGallery'),
    dots:     $('#rmxDots'),
    ribbon:   $('#rmxRibbon'),
    t: $('#rmxKitTitle'), s: $('#rmxKitSub'),
    now: $('#rmxNow'), was: $('#rmxWas'),
    total: $('#rmxTotal'), save: $('#rmxSave'), perDay: $('#rmxPerDay'),
    note: $('#rmxNote'), gifts: $('#rmxGifts'),
    buy: $('#rmxBuy'),
  };

  if (!el.gallery || !el.switcher || !el.now || !el.total) {
    console.warn('[RMX] Required elements not found. Check IDs / HTML.');
    return;
  }

  const fmt  = n => `$${Number(n).toLocaleString()}`;
  const fmt2 = n => `$${Number(n).toFixed(2)}`;

  // --- monta carrossel nativo ---
  function renderGallery(imgs = []) {
    // fallback se vier string única (retrocompat)
    if (!Array.isArray(imgs)) imgs = [String(imgs)].filter(Boolean);
    if (imgs.length === 0) {
      imgs = ['https://vsl.infotrendnews.online/wp-content/uploads/2025/09/RAMBOMAX-1BTS-DTC.jpg'];
    }

    el.gallery.innerHTML = imgs.map((src,i)=>(
      `<div class="rmx-slide"><img src="${src}" alt="Rambo Max image ${i+1}"></div>`
    )).join('');

    // bullets
    el.dots.innerHTML = imgs.map((_,i)=>`<span class="rmx-dot${i===0?' is-active':''}"></span>`).join('');

    // ativa dot conforme scroll
    const slides = Array.from(el.gallery.children);
    const dots   = Array.from(el.dots.children);

    function setActiveByScroll(){
      const w = el.gallery.clientWidth;
      const idx = Math.round(el.gallery.scrollLeft / (w+10 /* gap aprox */));
      dots.forEach((d,i)=>d.classList.toggle('is-active', i===idx));
    }
    el.gallery.removeEventListener('scroll', setActiveByScroll);
    el.gallery.addEventListener('scroll', setActiveByScroll, {passive:true});

    // click nos dots (salta para slide)
    dots.forEach((d,i)=>{
      d.onclick = () => {
        const slide = slides[i];
        if (slide) slide.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
      };
    });

    // teclas ← →
    el.gallery.onkeydown = (e)=>{
      if (e.key === 'ArrowRight') el.gallery.scrollBy({left: el.gallery.clientWidth, behavior:'smooth'});
      if (e.key === 'ArrowLeft')  el.gallery.scrollBy({left:-el.gallery.clientWidth, behavior:'smooth'});
    };
  }

  // 3) Atualização de variante
  function updateKit(key){
    const k = RMX_KITS[key];
    if (!k) { console.warn('[RMX] Unknown kit key:', key); return; }

    // ribbon
    if (k.ribbon){
      el.ribbon.style.display = 'block';
      el.ribbon.querySelector('span').textContent = k.ribbon;
    } else {
      el.ribbon.style.display = 'none';
    }

    // imagens
    renderGallery(k.imgs || k.img);

    // textos & preços
    el.t.textContent = k.title;
    el.s.textContent = k.sub;

    el.now.innerHTML     = `${fmt(k.per)} <span class="rmx-unit">/ bottle</span>`;
    el.was.textContent   = fmt(k.was);
    el.total.textContent = `Total: ${fmt(k.total)}`;
    el.save.textContent  = `Save ${fmt(k.save)}`;
    el.perDay.textContent = `Only ${fmt2((k.days ? k.total/k.days : k.per/30))} per day`;

    // nota
    el.note.textContent = k.note || '';

    // gifts
    el.gifts.innerHTML = '';
    (k.gifts || []).forEach(g => {
      const d = document.createElement('div');
      d.className = 'rmx-gift';
      d.innerHTML = `<img src="${g.img}" alt=""><span>${g.name}</span>`;
      el.gifts.appendChild(d);
    });

    // CTA
    el.buy.href = k.href;
    el.buy.dataset.sku = k.sku;
  }

  // 4) Listener dos radios/labels
  el.switcher.addEventListener('click', (e) => {
    const input = e.target.closest('input[name="rmx-kit"]');
    if (input) { updateKit(input.value); return; }
    const label = e.target.closest('label[for]');
    if (label) {
      const inp = document.getElementById(label.getAttribute('for'));
      if (inp) { inp.checked = true; updateKit(inp.value); }
    }
  });

  // 5) Estado inicial (vai respeitar o radio "checked")
  const checked = document.querySelector('input[name="rmx-kit"]:checked');
  updateKit(checked ? checked.value : 'one');
});