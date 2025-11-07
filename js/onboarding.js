// js/onboarding.js
(() => {
  // 온보딩 엘리먼트가 없는 페이지(메인 등)는 조용히 종료
  function boot() {
    const obEl = document.querySelector('.onboarding');
    if (!obEl) return;

    // 임베드 스타일
    const style = document.createElement('style');
    style.textContent = `
      .onboarding{opacity:1; transform:translateY(0); transition:opacity .48s ease, transform .48s ease;}
      .onboarding.ob-leave{opacity:0; transform:translateY(-6%);}
      .onboarding.ob-hide{display:none!important;}
    `;
    document.head.appendChild(style);

    // 스크롤 잠금
    const lock = (on) => {
      document.documentElement.style.overflow = on ? 'hidden' : '';
      document.body.style.overflow = on ? 'hidden' : '';
      document.body.style.touchAction = on ? 'none' : '';
    };
    lock(true);

    // 닫기
    const dismiss = () => {
      if (obEl.classList.contains('ob-leave')) return;
      obEl.classList.add('ob-leave');
      const fin = () => { obEl.classList.add('ob-hide'); lock(false); };
      obEl.addEventListener('transitionend', fin, { once:true });
      setTimeout(fin, 650);
    };

    // 인터랙션
    obEl.addEventListener('click', () => dismiss());
    ['h2','h3','p','button','a'].forEach(sel=>{
      obEl.querySelectorAll(sel).forEach(el=>{
        el.addEventListener('click', e=>{ e.stopPropagation(); dismiss(); });
      });
    });
    // 스와이프 업
    let sy=null,sx=null,moved=false;
    obEl.addEventListener('touchstart',e=>{const t=e.touches[0]; sy=t.clientY; sx=t.clientX; moved=false;},{passive:true});
    obEl.addEventListener('touchmove',()=>{moved=true;},{passive:true});
    obEl.addEventListener('touchend',e=>{
      if(sy==null) return;
      const t=e.changedTouches[0]; const dy=sy-t.clientY; const dx=Math.abs((sx??t.clientX)-t.clientX);
      if(moved && dy>60 && dx<80) dismiss();
      sy=null; sx=null; moved=false;
    });

    // 자동 닫힘 (원치 않으면 주석)
    setTimeout(dismiss, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
