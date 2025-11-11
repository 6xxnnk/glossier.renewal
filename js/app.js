// js/app.js
// 메인 앱 스크립트: 드롭다운, 스와이퍼, 칩-트랙 탭, 바텀 도크.

(function(){
  function ready(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  ready(() => {
    /* =========================
       1) 상단 드롭다운 (클릭 토글)
       ========================= */
    const menus = document.querySelectorAll('.menulist .menu');
    const menuBtns = document.querySelectorAll('.menulist .menu_btn');
    const navs = document.querySelectorAll('.menulist .nav');

    function closeAllMenus(){
      navs.forEach(n => n.classList.remove('active'));
      menuBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.menulist .has-submenu').forEach(li => li.classList.remove('open'));
    }

    menuBtns.forEach((btn, i) => {
      btn.addEventListener('click', (e) => {
        const isOpen = btn.classList.contains('active');
        closeAllMenus();
        if (!isOpen) {
          btn.classList.add('active');
          navs[i]?.classList.add('active');
        }
        e.stopPropagation();
      });
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.menulist .panel li.has-submenu > a');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const li = trigger.parentElement;
        const panel = trigger.closest('.panel');
        panel.querySelectorAll('li.has-submenu.open').forEach(op => {
          if (op !== li) op.classList.remove('open');
        });
        li.classList.toggle('open');
        return;
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.menulist')) closeAllMenus();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllMenus();
    });

    /* =========================
       2) 섹션2: Featured Swiper
       ========================= */
    function initMainSwiper(){
      if (!window.Swiper || !document.querySelector('.mySwiper')) return;
      return new Swiper('.mySwiper', {
        slidesPerView: 1.5,
        spaceBetween: 30,
        pagination: { el: '.section2 .swiper-pagination', clickable: true },
        navigation: { nextEl: '.section2 .swiper-button-next', prevEl: '.section2 .swiper-button-prev' },
        autoplay: { delay: 3000, disableOnInteraction: false },
        speed: 1000,
        breakpoints: {
          768:  { slidesPerView: 2.25, spaceBetween: 28 },
          1024: { slidesPerView: 3,    spaceBetween: 32 },
        },
      });
    }
    let mainSwiper = initMainSwiper();

    /* =========================================
       3) 섹션7: 칩 클릭 → 트랙 전환 + Swiper 생성
       ========================================= */
    const chipButtons = document.querySelectorAll('.section7 .chip');
    const tracks = document.querySelectorAll('.section7 .track');
    const instances = new Map();

    function initTrackSwiper(trackEl) {
      if (!window.Swiper || !trackEl) return;
      const swiperEl = trackEl.querySelector('.chip-swiper');
      if (!swiperEl) return;

      if (instances.has(trackEl)) {
        try { instances.get(trackEl).destroy(true, true); } catch {}
        instances.delete(trackEl);
      }

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
      instances.set(trackEl, inst);
    }

    const firstActive = document.querySelector('.section7 .track.active');
    if (firstActive) initTrackSwiper(firstActive);

    chipButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        chipButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const id = btn.getAttribute('data-track');
        tracks.forEach(t => t.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
          target.classList.add('active');
          initTrackSwiper(target);
        }
      });
    });

    /* === 리사이즈 대응 (Swiper 재생성 보강) === */
    let rAF = null;
    window.addEventListener('resize', () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        if (mainSwiper) mainSwiper.update(); // 메인 Swiper도 업데이트
        const visible = document.querySelector('.section7 .track.active');
        if (visible && instances.has(visible)) {
          try { instances.get(visible).update(); } catch {}
        }
      });
    });

    /* =========================
       4) 바텀 도크 활성 표시
       ========================= */
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
})();
