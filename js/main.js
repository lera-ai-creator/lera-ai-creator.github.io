// ---------- превью-петли играют, только когда видны ----------
// На первом экране — autoplay; ниже — data-autoplay + preload="none": файл грузится только при прокрутке.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loops = document.querySelectorAll('video[autoplay], video[data-autoplay]');

if (reduceMotion) {
  loops.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
} else if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.15 });
  loops.forEach(v => io.observe(v));
}

// ---------- проигрыватель полной версии ----------
const player = document.getElementById('player');
const playerVideo = player.querySelector('video');
const playerTitle = player.querySelector('.player__title');
const playerImg = player.querySelector('.player__img');

document.addEventListener('click', e => {
  const btn = e.target.closest('.js-play, .js-zoom');
  if (!btn) return;
  const isImage = btn.classList.contains('js-zoom');
  player.classList.toggle('player--image', isImage);
  player.classList.toggle('player--vertical', btn.closest('.ad') !== null);
  playerTitle.textContent = btn.dataset.title || '';
  if (isImage) {
    playerImg.src = btn.dataset.img;
    player.showModal();
    return;
  }
  playerVideo.poster = btn.dataset.poster || '';
  playerVideo.src = btn.dataset.video;
  player.showModal();
  playerVideo.play().catch(() => {});
});

player.querySelector('.player__close').addEventListener('click', () => player.close());
// клик по затемнению вокруг ролика тоже закрывает
player.addEventListener('click', e => { if (e.target === player) player.close(); });
player.addEventListener('close', () => {
  playerVideo.pause();
  playerVideo.removeAttribute('src');
  playerVideo.load();
  playerImg.removeAttribute('src');
});
