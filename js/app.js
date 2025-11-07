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
      // 2차 서브메뉴도 닫기
      document.querySelectorAll('.menulist .has-submenu').forEach(li => li.classList.remove('open'));
    }

    // 버튼 클릭: 해당 nav 토글, 나머지는 닫기
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

    // 1차 패널 내 2차 서브메뉴 토글 (li.has-submenu > a)
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.menulist .panel li.has-submenu > a');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const li = trigger.parentElement;
        // 같은 패널 내에서는 하나만 열리도록
        const panel = trigger.closest('.panel');
        panel.querySelectorAll('li.has-submenu.open').forEach(op => {
          if (op !== li) op.classList.remove('open');
        });
        li.classList.toggle('open');
        return;
      }
    });

    // 패널/버튼 외부 클릭 → 전체 닫기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.menulist')) closeAllMenus();
    });

    // ESC로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllMenus();
    });

    /* =========================
       2) 섹션2: Featured Swiper
       ========================= */
    if (window.Swiper && document.querySelector('.mySwiper')) {
      try {
        new Swiper('.mySwiper', {
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
      } catch (err) {
        console.warn('Main Swiper init failed:', err);
      }
    }

    /* =========================================
       3) 섹션7: 칩 클릭 → 트랙 전환 + Swiper 생성
       ========================================= */
    const chipButtons = document.querySelectorAll('.section7 .chip');
    const tracks = document.querySelectorAll('.section7 .track');
    const instances = new Map(); // Map<HTMLElement, Swiper>

    function initTrackSwiper(trackEl) {
      if (!window.Swiper || !trackEl) return;
      const swiperEl = trackEl.querySelector('.chip-swiper');
      if (!swiperEl) return;

      // 기존 인스턴스가 있으면 파괴 후 갱신(이미지/크기 변경 대응)
      if (instances.has(trackEl)) {
        try { instances.get(trackEl).destroy(true, true); } catch {}
        instances.delete(trackEl);
      }

      try {
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
      } catch (err) {
        console.warn('Chip Swiper init failed:', err);
      }
    }

    // 최초 활성 트랙 초기화
    const firstActive = document.querySelector('.section7 .track.active');
    if (firstActive) initTrackSwiper(firstActive);

    // 칩 클릭 핸들링
    chipButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // 칩 활성 토글
        chipButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 패널 전환
        const id = btn.getAttribute('data-track');
        tracks.forEach(t => t.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
          target.classList.add('active');
          initTrackSwiper(target);
        }
      });
    });

    // 리사이즈 시 보이는 트랙만 업데이트
    let rAF = null;
    window.addEventListener('resize', () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
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
