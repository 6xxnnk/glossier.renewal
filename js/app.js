// js/app.js

// 안전 시작
function ready(fn){ if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn);} else {fn();} }

ready(() => {
  /* ===== 드롭다운 메뉴: 클릭 토글 ===== */
  const menuBtns = Array.from(document.querySelectorAll('.menu_btn'));
  const navs = Array.from(document.querySelectorAll('.nav'));

  function closeAll(){
    navs.forEach(n => n.classList.remove('active'));
    menuBtns.forEach(b => b.classList.remove('active'));
  }
  menuBtns.forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      const open = btn.classList.contains('active');
      closeAll();
      if (!open) {
        btn.classList.add('active');
        navs[i]?.classList.add('active');
      }
      e.stopPropagation();
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu')) closeAll();
  });

  /* ===== Section 2: Featured Swiper ===== */
  if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
    new Swiper('.mySwiper', {
      slidesPerView: 1.5,
      spaceBetween: 30,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      autoplay: { delay: 3000, disableOnInteraction: false },
      speed: 1000,
      breakpoints: {
        768:  { slidesPerView: 2.25, spaceBetween: 28 },
        1024: { slidesPerView: 3,    spaceBetween: 32 },
      },
    });
  }

  /* ===== Section 7: Chip → 각 트랙 Swiper 동적 생성 ===== */
  const chips   = document.querySelectorAll('.section7 .chip');
  const tracks  = document.querySelectorAll('.section7 .track');
  const swipers = new Map(); // Map<trackEl, Swiper>

  function initTrack(trackEl){
    if (!trackEl) return;
    // 파괴 후 재생성(이미 존재하면)
    if (swipers.has(trackEl)) {
      try { swipers.get(trackEl).destroy(true,true); } catch {}
      swipers.delete(trackEl);
    }
    const swiperEl = trackEl.querySelector('.chip-swiper');
    if (!swiperEl) return;
    const inst = new Swiper(swiperEl, {
      slidesPerView: 1.15,
      spaceBetween: 12,
      pagination: { el: swiperEl.querySelector('.swiper-pagination'), clickable: true },
      speed: 500,
      breakpoints: {
        768:  { slidesPerView: 2.1, spaceBetween: 14 },
        1024: { slidesPerView: 3,   spaceBetween: 16 },
      },
    });
    swipers.set(trackEl, inst);
  }

  // 최초 활성 트랙 초기화
  initTrack(document.querySelector('.section7 .track.active'));

  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      // 칩 활성
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');

      // 패널 전환
      const id = chip.getAttribute('data-track');
      tracks.forEach(t=>t.classList.remove('active'));
      const target = document.getElementById(id);
      if (target) {
        target.classList.add('active');
        initTrack(target);
      }
    });
  });

  /* ===== Bottom dock (선택 상태) – 선택 사항 ===== */
  const dockLinks = document.querySelectorAll('.bottom-nav .dock a');
  function setDockActive(){
    const hash = window.location.hash || '#';
    dockLinks.forEach(a => {
      const match = a.getAttribute('href') === hash || (hash === '#' && a.classList.contains('active'));
      a.classList.toggle('active', match);
    });
  }
  setDockActive();
  window.addEventListener('hashchange', setDockActive);
});
