// js/onboarding.js
// 온보딩 페이지( .onboarding 이 있을 때만 )에서 동작.
// 메인 페이지에는 조용히 no-op.

(() => {
  function ready(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  ready(() => {
    const ob = document.querySelector('.onboarding');
    if (!ob) return; // 온보딩 없는 페이지는 종료

    // 스타일 인라인 주입
    const style = document.createElement('style');
    style.textContent = `
      .onboarding{opacity:1; transform:translateY(0); transition:opacity .45s ease, transform .45s ease;}
      .onboarding.ob-leave{opacity:0; transform:translateY(-6%);}
      .onboarding.ob-hide{display:none!important;}
    `;
    document.head.appendChild(style);

    // 스크롤 잠금/해제
    const lockScroll = (on) => {
      document.documentElement.style.overflow = on ? 'hidden' : '';
      document.body.style.overflow = on ? 'hidden' : '';
      document.body.style.touchAction = on ? 'none' : '';
    };
    lockScroll(true);

    // 종료 처리
    let closed = false;
    function afterDismiss() {
      lockScroll(false);
      // 온보딩 종료 뒤, 첫 섹션으로 스크롤
      const s1 = document.querySelector('.section1');
      if (s1) {
        try { s1.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        catch { window.scrollTo(0, 0); }
      }
    }
    function dismiss(reason = 'auto') {
      if (closed) return;
      closed = true;
      ob.classList.add('ob-leave');
      const fin = () => { ob.classList.add('ob-hide'); afterDismiss(); };
      ob.addEventListener('transitionend', fin, { once: true });
      setTimeout(fin, 650); // 안전망
    }

    // 인터랙션: 아무 곳이나 탭/클릭
    ob.addEventListener('click', () => dismiss('tap'));
    // CTA 요소들 클릭 시 버블 막고 닫기
    ['h2','h3','p','button','a'].forEach(sel => {
      ob.querySelectorAll(sel).forEach(el => {
        el.addEventListener('click', e => { e.stopPropagation(); dismiss('cta'); });
      });
    });

    // 스와이프 업 제스처
    let sy=null, sx=null, moved=false;
    ob.addEventListener('touchstart', e => {
      const t = e.touches[0]; sy=t.clientY; sx=t.clientX; moved=false;
    }, { passive: true });
    ob.addEventListener('touchmove', () => { moved = true; }, { passive: true });
    ob.addEventListener('touchend', e => {
      if (sy == null) return;
      const t = e.changedTouches[0];
      const dy = sy - t.clientY;
      const dx = Math.abs((sx ?? t.clientX) - t.clientX);
      if (moved && dy > 60 && dx < 80) dismiss('swipe-up');
      sy=null; sx=null; moved=false;
    });

    // ESC/Enter로 닫기 (접근성)
    const keyHandler = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') dismiss('key');
    };
    document.addEventListener('keydown', keyHandler);

    // 자동 닫힘(원치 않으면 주석 처리)
    const timer = setTimeout(() => dismiss('auto'), 2000);

    // 페이지 떠날 때 정리
    window.addEventListener('beforeunload', () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', keyHandler);
    });
  });
})();
