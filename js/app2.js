// js/section7.js
// Section7: chips + Swiper

document.addEventListener('DOMContentLoaded', () => {
  // 혹시 Swiper가 안 불러졌으면 바로 종료
  if (!window.Swiper) return;

  const chips  = Array.from(document.querySelectorAll('.section7 .chip'));
  const tracks = Array.from(document.querySelectorAll('.section7 .track'));
  if (!chips.length || !tracks.length) return;

  // 각 track마다 Swiper 한 개씩 생성
  const swipers = tracks.map(track => {
    const swiperEl = track.querySelector('.chip-swiper');
    if (!swiperEl) return null;

    return new Swiper(swiperEl, {
      // 카드 1장 + 옆 카드 살짝 보이게
      slidesPerView: 1.2,
      spaceBetween: 16,
      loop: false,

      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
      },

      // 자동 슬라이드
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },

      allowTouchMove: true,
      simulateTouch: true,
      grabCursor: true,
    });
  });

  // 칩 클릭 → 해당 트랙만 보이도록
  function activateChip(chip) {
    const id = chip.getAttribute('data-track');
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    // chip active 토글
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    // track active 토글
    tracks.forEach(t => t.classList.remove('active'));
    target.classList.add('active');

    // 해당 track의 swiper 업데이트
    const idx = tracks.indexOf(target);
    if (idx > -1 && swipers[idx]) {
      try {
        swipers[idx].update();
      } catch (e) {
        // 에러 나더라도 콘솔 안 지저분하게 무시
      }
    }
  }

  // 칩 클릭 이벤트
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.classList.contains('active')) return;
      activateChip(chip);
    });
  });

  // 처음 로드될 때 active 칩 기준으로 한 번 정리
  const initialChip = document.querySelector('.section7 .chip.active') || chips[0];
  if (initialChip) activateChip(initialChip);
});
