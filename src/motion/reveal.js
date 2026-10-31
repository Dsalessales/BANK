/**
 * Revelações genéricas reutilizadas em todas as seções:
 *  - [data-split]  títulos com linhas que sobem
 *  - [data-fade]   elementos que sobem + aparecem
 *  - [data-count]  números que contam até o valor
 *  - .sec-head__rule linha que se desenha
 */
import { gsap, reduced, $$ } from './core.js';

/** Anima as linhas de um título (usado também dentro de timelines). */
export const splitIn = (el, opts = {}) =>
  gsap.fromTo($$('.line__in', el), { yPercent: 110, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out', ...opts });

export function initReveals() {
  if (reduced) return;

  $$('[data-split]').forEach((el) => {
    if (el.closest('[data-intro], [data-ga], [data-ap]')) return; // animados pelas próprias timelines
    gsap.set($$('.line__in', el), { yPercent: 110, rotate: 3 });
    splitIn(el, { paused: true, scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
  });

  $$('[data-fade]').forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
    });
  });

  $$('.sec-head__rule').forEach((el) => {
    gsap.from(el, { scaleX: 0, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  $$('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count);
    const o = { v: 0 };
    gsap.to(o, {
      v: to, duration: 1.6, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(o.v); },
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}
