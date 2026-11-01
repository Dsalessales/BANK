/**
 * UI global: loader, header (tema por seção, esconder ao rolar, indicador
 * de hover, seção ativa), menu mobile, cursor, botões magnéticos,
 * barra de progresso, toast e "download" simulado.
 */
import { gsap, ScrollTrigger, lenis, reduced, finePointer, scrollToTarget, $, $$, lerp } from './core.js';
import { mockDownloadKit } from '../data/mock.js';

/* ------------------------------------------------------------------ */
/* Loader                                                              */
export function runLoader() {
  const el = $('[data-loader]');
  const bar = $('[data-ld-bar]', el);
  const pct = $('[data-ld-pct]', el);
  const msg = $('[data-ld-msg]', el);
  const msgs = JSON.parse(msg.dataset.msgs);
  const state = { p: 0 };

  if (reduced) {
    return document.fonts.ready.then(() => { el.remove(); });
  }

  const tl = gsap.timeline();
  tl.to('.ld__mark .sym__stroke', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0)
    .to('.ld__ghost', { opacity: 1, duration: 1.4, ease: 'power1.out' }, 0.2)
    .to('.ld__mark .sym__fill', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.2);

  // progresso "real": fontes + um tempo mínimo para a animação respirar
  const fontsReady = document.fonts.ready;
  const minTime = new Promise((r) => setTimeout(r, 1900));
  let target = 0.6;
  fontsReady.then(() => { target = 0.85; });
  const tick = gsap.ticker.add(() => {
    state.p = lerp(state.p, target, 0.06);
    bar.style.transform = `scaleX(${state.p})`;
    pct.textContent = `${Math.round(state.p * 100)}%`;
    const i = Math.min(msgs.length - 1, Math.floor(state.p * msgs.length));
    if (msg.textContent !== msgs[i] && state.p < 0.99) msg.textContent = msgs[i];
  });

  return Promise.all([fontsReady, minTime]).then(() => new Promise((resolve) => {
    target = 1;
    gsap.delayedCall(0.55, () => {
      gsap.ticker.remove(tick);
      bar.style.transform = 'scaleX(1)';
      pct.textContent = '100%';
      msg.textContent = msg.dataset.done;
      gsap.timeline({ delay: 0.45, onComplete: () => { el.remove(); } })
        .to('.ld__mark', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'expo.in' }, 0)
        .to('.ld__ghost', { opacity: 0, duration: 0.5 }, 0)
        .to('.ld__corner, .ld__foot', { opacity: 0, y: -10, duration: 0.4, stagger: 0.05 }, 0)
        .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 0.45)
        .add(resolve, 0.75);
    });
  }));
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
export function initHeader() {
  const header = $('[data-header]');
  const links = $$('[data-nav]', header);
  const hover = $('[data-nav-hover]', header);
  const wrap = $('[data-nav-links]', header);

  // indicador que desliza entre os links
  const moveHover = (a) => {
    if (!a) return gsap.to(hover, { opacity: 0, duration: 0.3 });
    links.forEach((l) => l.classList.toggle('is-hot', l === a));
    gsap.to(hover, { x: a.offsetLeft, width: a.offsetWidth, opacity: 1, duration: 0.55, ease: 'expo.out' });
  };
  links.forEach((a) => a.addEventListener('mouseenter', () => moveHover(a)));
  wrap.addEventListener('mouseleave', () => { links.forEach((l) => l.classList.remove('is-hot')); moveHover(null); });

  // tema do header conforme a seção sob ele
  const sections = $$('[data-header-theme]');
  const setTheme = () => {
    const y = header.getBoundingClientRect().bottom - 10;
    let theme = 'dark';
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) theme = s.dataset.headerThemeLive || s.dataset.headerTheme;
    }
    if (header.dataset.theme !== theme) header.dataset.theme = theme;
    document.querySelector('.progress')?.classList.toggle('on-accent', theme === 'accent');
  };

  // seção ativa (pontinho no link)
  const ids = links.map((l) => l.dataset.nav);
  const setActive = () => {
    const mid = window.innerHeight * 0.45;
    let current = null;
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const sec = el.closest('[data-section]') || el;
      const r = sec.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = id;
    });
    // "símbolo" é uma âncora dentro da intro: ativo na metade final dela
    const intro = ScrollTrigger.getById('intro');
    if (intro && intro.isActive) current = intro.progress > 0.6 ? 'simbolo' : null;
    links.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === current));
  };

  // esconder ao rolar para baixo, mostrar ao subir
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    const menuOpen = document.body.classList.contains('menu-open');
    const jumping = document.body.hasAttribute('data-nav-jump'); // rolagem disparada por link: header fica visível
    // só muda de estado com movimento claro; parado ou rolando devagar, o header fica como está
    // (antes ele reaparecia a cada atualização lenta e "piscava")
    const dy = y - lastY;
    if (y < window.innerHeight * 0.6 || dy < -6) header.classList.remove('is-hidden');
    else if (dy > 6 && !menuOpen && !jumping) header.classList.add('is-hidden');
    lastY = y;
    setTheme();
    setActive();
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: onScroll, onRefresh: onScroll });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

export function revealHeader() {
  const h = $('[data-header]');
  h.classList.add('is-pre');
  requestAnimationFrame(() => requestAnimationFrame(() => h.classList.remove('is-pre')));
}

/* ------------------------------------------------------------------ */
/* Links de rolagem                                                    */
let jumpTimer;
export function initScrollLinks() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-scroll-to]');
    if (!a) return;
    e.preventDefault();
    const target = a.dataset.scrollTo;
    document.body.setAttribute('data-nav-jump', '');
    $('[data-header]').classList.remove('is-hidden');
    clearTimeout(jumpTimer);
    jumpTimer = setTimeout(() => document.body.removeAttribute('data-nav-jump'), 2200);
    if (document.body.classList.contains('menu-open')) {
      closeMenu();
      setTimeout(() => scrollToTarget(target), 450);
    } else scrollToTarget(target);
    history.replaceState(null, '', target);
  });
}

/* ------------------------------------------------------------------ */
/* Menu mobile                                                         */
let menuTl;
function buildMenu() {
  const menu = $('[data-menu]');
  menuTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .set(menu, { visibility: 'visible' })
    .fromTo('.menu__bg', { clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }, { clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)', duration: 1, ease: 'expo.inOut' })
    .fromTo('.menu__item a', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.045 }, 0.35)
    .fromTo('.menu__foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
}
export function openMenu() {
  const btn = $('[data-menu-btn]');
  document.body.classList.add('menu-open');
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-label', 'Fechar menu');
  $('[data-header]').dataset.themeLock = $('[data-header]').dataset.theme;
  $('[data-header]').dataset.theme = 'accent';
  lenis?.stop();
  menuTl.timeScale(1).play();
  $('.menu__item a')?.focus({ preventScroll: true });
}
export function closeMenu() {
  const btn = $('[data-menu-btn]');
  document.body.classList.remove('menu-open');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Abrir menu');
  lenis?.start();
  menuTl.timeScale(1.6).reverse();
}
export function initMenu() {
  buildMenu();
  $('[data-menu-btn]').addEventListener('click', () => (document.body.classList.contains('menu-open') ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu(); });
}

/* ------------------------------------------------------------------ */
/* Barra de progresso                                                  */
export function initProgress() {
  const bar = $('[data-progress]');
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}

/* ------------------------------------------------------------------ */
/* Cursor personalizado                                                */
export function initCursor() {
  if (!finePointer || reduced) return;
  const el = $('[data-cursor-el]');
  const ring = $('.cursor__ring', el);
  const dot = $('.cursor__dot', el);
  const label = $('[data-cursor-label]', el);
  document.documentElement.classList.add('has-cursor');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...pos };
  const setDot = { x: gsap.quickSetter(dot, 'x', 'px'), y: gsap.quickSetter(dot, 'y', 'px') };
  const setRing = { x: gsap.quickSetter(ring, 'x', 'px'), y: gsap.quickSetter(ring, 'y', 'px') };

  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    el.classList.add('is-on');
  }, { passive: true });
  document.addEventListener('pointerleave', () => el.classList.remove('is-on'));
  window.addEventListener('pointerdown', () => el.classList.add('is-down'));
  window.addEventListener('pointerup', () => el.classList.remove('is-down'));

  gsap.ticker.add(() => {
    ringPos.x = lerp(ringPos.x, pos.x, 0.18);
    ringPos.y = lerp(ringPos.y, pos.y, 0.18);
    setDot.x(pos.x); setDot.y(pos.y);
    setRing.x(ringPos.x); setRing.y(ringPos.y);
  });

  // modos: rótulo (data-cursor), link, texto editável
  const update = (target) => {
    const lab = target.closest('[data-cursor]');
    const edit = target.closest('[contenteditable]');
    const link = target.closest('a, button, input[type="range"], [data-glyph]');
    // um link "dentro" de uma área rotulada ganha do rótulo (ex.: botões dentro de figuras)
    const linkWins = link && lab && lab.contains(link) && link !== lab && !link.hasAttribute('data-cursor');
    if (edit) el.dataset.mode = 'text';
    else if (lab && !linkWins) { el.dataset.mode = 'label'; label.textContent = lab.dataset.cursor; }
    else if (link) { el.dataset.mode = 'link'; }
    else el.dataset.mode = '';
    // inverter cores sobre fundos na cor de destaque
    const sec = target.closest('.theme-accent, .tile--accent, .co__strip--accent, .co__strip--grad, .vt--accent, .menu, .pt__art--card, .tile--grad');
    el.classList.toggle('on-accent', !!sec || document.body.classList.contains('menu-open'));
  };
  document.addEventListener('pointerover', (e) => update(e.target));
}

/* ------------------------------------------------------------------ */
/* Botões magnéticos                                                   */
export function initMagnetic() {
  if (!finePointer || reduced) return;
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
let toastTl;
export function toast(text, swatch) {
  const el = $('[data-toast]');
  el.textContent = text;
  el.style.setProperty('--swatch', swatch || 'var(--accent)');
  toastTl?.kill();
  toastTl = gsap.timeline()
    .fromTo(el, { yPercent: 150, xPercent: -50 }, { yPercent: 0, xPercent: -50, duration: 0.7, ease: 'back.out(1.6)' })
    .to(el, { yPercent: 150, duration: 0.5, ease: 'expo.in' }, '+=1.8');
}

/* ------------------------------------------------------------------ */
/* Download do kit (simulado, sem servidor)                            */
export function initDownloads() {
  document.addEventListener('click', async (e) => {
    const a = e.target.closest('[data-download]');
    if (!a) return;
    e.preventDefault();
    if (a.classList.contains('is-busy')) return;
    a.classList.add('is-busy');
    let bar = a.querySelector('.btn__progress');
    if (!bar) { bar = document.createElement('i'); bar.className = 'btn__progress'; a.appendChild(bar); }
    toast('Preparando o kit…');
    await mockDownloadKit((p) => gsap.to(bar, { width: `${p * 100}%`, duration: 0.2, ease: 'none' }));
    toast('Kit baixado · gerado no navegador');
    gsap.to(bar, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: () => { bar.remove(); a.classList.remove('is-busy'); } });
  });
}
