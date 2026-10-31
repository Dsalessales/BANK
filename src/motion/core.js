/**
 * Núcleo do movimento: GSAP + ScrollTrigger + Lenis (scroll suave).
 * Tudo que é animado por rolagem passa por aqui.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: 1 });

export { gsap, ScrollTrigger };

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const mm = gsap.matchMedia();
export const BP = { mobile: '(max-width: 860px)', desktop: '(min-width: 861px)' };

export let lenis = null;

export function initSmoothScroll() {
  if (reduced) return null;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.3, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  return lenis;
}

/** Rolagem para um alvo — respeita seções fixas (pins) e âncoras "por progresso". */
export function scrollToTarget(selector, { immediate = false } = {}) {
  const el = document.querySelector(selector);
  if (!el) return;
  let y;
  const prog = el.dataset.anchorProgress;
  if (prog) {
    // âncora dentro de uma seção fixa: vai para um ponto do progresso do pin
    const st = ScrollTrigger.getAll().find((s) => s.trigger === el.closest('[data-section]') && s.pin);
    y = st ? st.start + (st.end - st.start) * parseFloat(prog) : el.getBoundingClientRect().top + window.scrollY;
  } else {
    const st = ScrollTrigger.getAll().find((s) => s.trigger === el && s.pin);
    y = st ? st.start : el.getBoundingClientRect().top + window.scrollY;
  }
  if (lenis) lenis.scrollTo(y, { duration: immediate ? 0 : 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), immediate });
  else window.scrollTo({ top: y, behavior: immediate || reduced ? 'auto' : 'smooth' });
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
