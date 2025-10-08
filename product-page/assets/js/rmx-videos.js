document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.rv-card');
  
    // Pausa todos ao iniciar um
    function pauseOthers(except) {
      document.querySelectorAll('.rv-video').forEach(v => {
        if (v !== except) {
          v.pause();
          const btn = v.closest('.rv-frame')?.querySelector('.rv-play');
          if (btn) btn.classList.remove('is-hidden');
        }
      });
    }
  
    cards.forEach(card => {
      const frame = card.querySelector('.rv-frame');
      const video = card.querySelector('.rv-video');
      const play  = card.querySelector('.rv-play');
  
      if (!frame || !video || !play) return;
  
      // aplica poster se fornecido no data-poster
      const poster = frame.getAttribute('data-poster');
      if (poster) video.setAttribute('poster', poster);
  
      // Começar ao clicar no botão
      play.addEventListener('click', () => {
        pauseOthers(video);
        // mostra controles apenas durante a reprodução
        video.setAttribute('controls', 'controls');
        play.classList.add('is-hidden');
        video.play().catch(()=>{ /* ignore */ });
      });
  
      // se o usuário pausar manualmente, reexibe o botão play
      video.addEventListener('pause', () => {
        play.classList.remove('is-hidden');
        // pode manter os controles visíveis se preferir:
        // video.removeAttribute('controls');
      });
  
      // ao terminar, volta para estado inicial
      video.addEventListener('ended', () => {
        play.classList.remove('is-hidden');
        video.currentTime = 0;
        // video.removeAttribute('controls'); // opcional
      });
    });
  });
  