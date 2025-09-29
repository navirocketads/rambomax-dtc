// assets/js/rmx-offer.js
document.addEventListener('DOMContentLoaded', () => {
  
    // 1) Dados dos kits
    const RMX_KITS = {
      one:  { ribbon:"", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/RAMBOMAX-1BTS-DTC.jpg",
              title:"Basic", sub:"1 Bottle · 30-Day Supply", was:199, total:69, per:69, save:130, days:30,
              note:"Free US Shipping on 3+ bottles", href:"https://pay.gvitalabs.com/checkout/178934197:1", sku:"RMX-1", gifts:[] },
      three:{ ribbon:"MOST POPULAR", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/RAMBOMAX-3BTS-DTC.jpg",
              title:"Most Popular", sub:"3 Bottles · 90-Day Supply", was:597, total:177, per:59, save:420, days:90,
              note:"Includes FREE US Shipping + 2 Gifts", href:"https://pay.gvitalabs.com/checkout/178934436:1", sku:"RMX-3",
              gifts:[
                {name:"Lesbian Trick - Sexual Performance Video Lessons ($140) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/Screenshot-2025-09-29-at-08.25.42.jpg"},
                {name:"1K Testosterone Guide ($49) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/testoGuide.jpg"}
              ]},
      six:  { ribbon:"BEST VALUE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/RAMBOMAX-6BTS-DTC.jpg",
              title:"Best Value", sub:"6 Bottles · 180-Day Supply", was:1188, total:294, per:49, save:894, days:180,
              note:"FREE US Shipping + 3 Gifts + Biggest Savings", href:"https://pay.gvitalabs.com/checkout/178934426:1", sku:"RMX-6",
              gifts:[
                {name:"Rambo Max App - Daily Progress Track ($97/mo) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/ramboMaxAPP.jpg"},
                {name:"Lesbian Trick - Sexual Performance Video Lessons ($140) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/Screenshot-2025-09-29-at-08.25.42.jpg"},
                {name:"1K Testosterone Guide ($49) — FREE", img:"https://vsl.infotrendnews.online/wp-content/uploads/2025/09/testoGuide.jpg"}
              ]}
    };
  
    // 2) Cache de elementos
    const $ = s => document.querySelector(s);
    const el = {
      switcher: document.querySelector('.rmx-switch'),
      image: $('#rmxImage'),
      ribbon: $('#rmxRibbon'),
      t: $('#rmxKitTitle'), s: $('#rmxKitSub'),
      now: $('#rmxNow'), was: $('#rmxWas'),
      total: $('#rmxTotal'), save: $('#rmxSave'), perDay: $('#rmxPerDay'),
      note: $('#rmxNote'), gifts: $('#rmxGifts'),
      buy: $('#rmxBuy'),
    };
  
    // Se algo essencial faltar, aborta para não quebrar a página
    if (!el.image || !el.switcher || !el.now || !el.total) {
      console.warn('[RMX] Required elements not found. Check IDs / HTML.');
      return;
    }
  
    const fmt  = n => `$${Number(n).toLocaleString()}`;
    const fmt2 = n => `$${Number(n).toFixed(2)}`;
  
    // fallback da imagem
    el.image.addEventListener('error', () => {
      el.image.src = 'https://via.placeholder.com/720x540.png?text=RAMBO+MAX';
    });
  
    // 3) Função principal de atualização
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
  
      // imagem + textos
      el.image.src = k.img;
      el.image.alt = `Rambo Max — ${k.sub}`;
      el.t.textContent = k.title;
      el.s.textContent = k.sub;
  
      // preços
      el.now.innerHTML   = `${fmt(k.per)} <span class="rmx-unit">/ bottle</span>`;
      el.was.textContent = fmt(k.was);
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
  
    // 4) Delegação de eventos no wrapper (pega clique em label OU input)
    el.switcher.addEventListener('click', (e) => {
      // prioriza o input (se foi clicado diretamente)
      const input = e.target.closest('input[name="rmx-kit"]');
      if (input) {
        updateKit(input.value);
        return;
      }
      // se foi clique no label, encontra o input via htmlFor
      const label = e.target.closest('label[for]');
      if (label) {
        const inp = document.getElementById(label.getAttribute('for'));
        if (inp) {
          inp.checked = true;                    // garante estado visual
          updateKit(inp.value);                  // atualiza painel
        }
      }
    });
  
    // 5) Estado inicial conforme o rádio marcado
    const checked = document.querySelector('input[name="rmx-kit"]:checked');
    updateKit(checked ? checked.value : 'one');
  });
  