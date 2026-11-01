/**
 * 02 Aplicações (scroll horizontal) · 03 App (celular) · 04 Nome · 04.1 Empilhada + versões
 */
import { gsap, ScrollTrigger, mm, BP, reduced, finePointer, $, $$, clamp } from './core.js';
import { splitIn } from './reveal.js';
import { HORIZONTAL, STACKED, LETTERS, STACK_SPLIT } from '../brand/wordmark.js';
import { mockLogin, formatBRL } from '../data/mock.js';

/* ------------------------------------------------------------------ */
/* 02 — Aplicações                                                     */
export function initGallery() {
  const section = $('[data-ga]');
  const stage = $('[data-ga-stage]', section);
  const track = $('[data-ga-track]', section);
  const items = $$('[data-ga-item]', section);
  const count = $('[data-ga-count]', section);
  const bar = $('[data-ga-progress]', section);
  const pad = (n) => String(n).padStart(2, '0');

  if (reduced) {
    stage.style.height = 'auto';
    track.style.flexWrap = 'wrap'; track.style.width = 'auto'; track.style.paddingRight = 'var(--gutter)';
    items.forEach((i) => i.classList.add('is-in'));
    return;
  }

  const dist = () => track.scrollWidth - innerWidth + innerWidth * 0.08;
  const tween = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      id: 'gallery', trigger: section, start: 'top top', end: () => `+=${dist()}`,
      pin: stage, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (st) => { bar.style.transform = `scaleX(${st.progress})`; },
    },
  });

  // título de abertura
  splitIn($('.ga__intro [data-split]'), { scrollTrigger: { trigger: section, start: 'top 60%' } });

  items.forEach((item, i) => {
    const par = $('.tile__par', item);
    // parallax interno da imagem enquanto o trilho anda
    gsap.fromTo(par, { xPercent: 8 }, {
      xPercent: -8, ease: 'none',
      scrollTrigger: { trigger: item, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
    });
    // entrada: sobe + desmascara
    gsap.from($('.tile', item), {
      clipPath: 'polygon(0 100%, 88% 100%, 100% 100%, 100% 100%, 0 100%)', duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: item, containerAnimation: tween, start: 'left 92%', toggleActions: 'play none none reverse' },
    });
    // item "ativo" (contador + legenda)
    ScrollTrigger.create({
      trigger: item, containerAnimation: tween, start: 'left 60%', end: 'right 40%',
      onToggle: (st) => {
        item.classList.toggle('is-in', st.isActive);
        if (st.isActive) count.textContent = pad(i + 1);
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* 03 — App                                                            */
export function initApp() {
  const section = $('[data-ap]');
  const stage = $('[data-ap-stage]', section);
  const rig = $('[data-ap-rig]', section);
  const float = $('[data-ap-float]', section);
  const steps = $$('[data-ap-step]', section);
  const bars = $$('[data-ap-bar]', section);
  const screens = $$('.ph--app .scr', section);
  const amount = $('.ph--app .scr__amount', section);
  const barsChart = $$('.ph--app .scr__bar i', section);
  const brandApp = $('.ph--app [data-app-brand]', section);
  const titleLines = $$('[data-split] .line__in', section);

  // interações dentro do celular (funcionam sempre, com dados mockados)
  section.addEventListener('click', async (e) => {
    const login = e.target.closest('[data-mock-login]');
    if (login) {
      login.classList.add('is-loading');
      await mockLogin();
      login.classList.remove('is-loading');
      login.textContent = 'Entrou ✓';
      setTimeout(() => { login.textContent = 'Entrar'; }, 1600);
    }
    const eye = e.target.closest('[data-eye]');
    if (eye) eye.closest('.scr').querySelector('.scr__amount').classList.toggle('is-hidden');
  });

  if (reduced) {
    screens.forEach((s) => { s.style.visibility = 'visible'; });
    return;
  }

  // flutuação + leve resposta ao mouse
  gsap.to(float, { y: -12, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  if (finePointer) {
    const ry = gsap.quickTo(float, 'rotateY', { duration: 1.2, ease: 'power3.out' });
    const rx = gsap.quickTo(float, 'rotateX', { duration: 1.2, ease: 'power3.out' });
    stage.addEventListener('pointermove', (e) => { ry((e.clientX / innerWidth - 0.5) * 16); rx(-(e.clientY / innerHeight - 0.5) * 10); });
  }

  const show = (idx) => {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
  };

  const o = { v: 0 };
  mm.add({ desktop: BP.desktop, mobile: BP.mobile }, (ctx) => {
    const { mobile } = ctx.conditions;
    gsap.set(titleLines, { yPercent: 110 });
    let current = -1;
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        id: 'app', trigger: section, start: 'top top', end: '+=280%', pin: stage, scrub: 0.9, anticipatePin: 1,
        onUpdate: (st) => {
          const idx = clamp(Math.floor((st.progress - 0.18) / 0.27), 0, 2);
          if (idx !== current) { current = idx; show(idx); }
        },
      },
    });

    tl.to(titleLines, { yPercent: 0, stagger: 0.08, duration: 0.5, ease: 'expo.out' }, 0)
      .to('[data-ap-bigv] path', { strokeDashoffset: 0, duration: 1.4 }, 0)
      .fromTo(rig, { x: mobile ? '40vw' : '30vw', y: '60vh', rotate: -32 }, { x: 0, y: 0, rotate: 0, duration: 1, ease: 'power3.out' }, 0)
      .fromTo('.ph--app', { rotateX: 35, rotateY: -30 }, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power3.out' }, 0)
      .from('[data-ap-shadow]', { opacity: 0, scale: 0.4, duration: 1 }, 0.2)
      // barra de progresso do passo 1
      .fromTo(bars[0], { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'none' }, 0.6)
      // tela 1 → 2 (desliza para cima)
      .set(screens[1], { visibility: 'visible', yPercent: 100 }, 1.4)
      .to(screens[0], { yPercent: -30, opacity: 0.2, duration: 0.6 }, 1.5)
      .to(screens[1], { yPercent: 0, duration: 0.6, ease: 'power3.out' }, 1.5)
      .fromTo(o, { v: 0 }, { v: 1, duration: 0.6, ease: 'power2.out', onUpdate: () => { amount.textContent = formatBRL(4286.9 * o.v); } }, 1.75)
      .from(barsChart, { scaleY: 0, stagger: 0.04, duration: 0.4, ease: 'back.out(2)' }, 1.8)
      .from('.ph--app .scr--dash .scr__list li', { x: 30, opacity: 0, stagger: 0.05, duration: 0.4 }, 1.85)
      .fromTo(bars[1], { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'none' }, 1.6)
      // tela 2 → 3 (zoom para a tela inicial)
      .set(screens[2], { visibility: 'visible', opacity: 0, scale: 1.2 }, 2.6)
      .to(screens[1], { scale: 0.85, opacity: 0, duration: 0.5 }, 2.7)
      .to(screens[2], { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 2.7)
      .from('.ph--app .scr__app', { scale: 0, opacity: 0, stagger: 0.02, duration: 0.35, ease: 'back.out(2)' }, 2.8)
      .fromTo(brandApp, { scale: 1 }, { scale: 1.35, duration: 0.35, ease: 'back.out(3)', yoyo: true, repeat: 1 }, 3.25)
      .from('.ph--app .scr__badge', { scale: 0, duration: 0.3, ease: 'back.out(3)' }, 3.5)
      .fromTo(bars[2], { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'none' }, 2.8)
      .to(rig, { rotate: 6, duration: 0.8, ease: 'none' }, 3.4)
      .to({}, { duration: 0.3 });
  });
}

/* ------------------------------------------------------------------ */
/* 04 — Nome (wordmark se desenha)                                     */
export function initName() {
  if (reduced) { gsap.set('.nm__wm .wm__fill', { opacity: 1 }); return; }
  const stage = $('[data-nm-stage]');
  const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 80%', end: 'bottom 35%', scrub: 0.8 } });
  tl.from('.nm__guides i', { scaleY: 0, stagger: 0.08, duration: 0.8, ease: 'power2.out' }, 0)
    .to('.nm__wm .wm__stroke', { strokeDashoffset: 0, stagger: 0.12, duration: 1, ease: 'power1.inOut' }, 0)
    .to('.nm__wm .wm__fill', { opacity: 1, stagger: 0.12, duration: 0.6 }, 0.7)
    .to('.nm__wm .wm__stroke', { opacity: 0, duration: 0.4 }, 1.6)
    .from('[data-nm-label]', { y: 16, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.8);
}

/* ------------------------------------------------------------------ */
/* 04.1 — Empilhada (letras migram de 1 para 2 linhas) + loop de versões */
export function initStack() {
  const section = $('[data-stk]');
  const stage = $('[data-stk-stage]', section);
  const svg = $('.stk__wm', stage);
  const meta = $('[data-stk-meta]', stage);

  // o SVG nasce com o viewBox horizontal; animamos as letras e o viewBox
  const H = HORIZONTAL, S = STACKED;
  const vb = { w: H.width, h: H.height };
  const setVB = () => svg.setAttribute('viewBox', `0 0 ${vb.w} ${vb.h}`);

  if (!reduced) {
    const tl = gsap.timeline({
      scrollTrigger: { id: 'stack', trigger: section, start: 'top top', end: '+=180%', pin: stage, scrub: 0.9, anticipatePin: 1,
        onUpdate: (st) => { meta.textContent = st.progress > 0.5 ? '2 linhas' : '1 linha'; } },
    });
    tl.from(svg, { scale: 0.85, opacity: 0, duration: 0.5 }, 0)
      .from('.stk__txt > *', { y: 40, opacity: 0, stagger: 0.1, duration: 0.5 }, 0.1);
    LETTERS.forEach(({ id }, i) => {
      const g = svg.querySelector(`[data-letter="${id}"]`);
      const from = H.pos[id], to = S.pos[id];
      const p = { x: from.x, y: from.y };
      tl.to(p, {
        x: to.x, y: to.y, duration: 1, ease: 'power3.inOut',
        onUpdate: () => g.setAttribute('transform', `translate(${p.x} ${p.y})`),
      }, 0.6 + (i >= STACK_SPLIT ? 0.05 * i : 0)); // a linha de baixo desce com leve atraso
    });
    tl.to(vb, { w: S.width, h: S.height, duration: 1, ease: 'power3.inOut', onUpdate: setVB }, 0.6)
      .to({}, { duration: 0.4 });
  } else {
    LETTERS.forEach(({ id }) => svg.querySelector(`[data-letter="${id}"]`).setAttribute('transform', `translate(${S.pos[id].x} ${S.pos[id].y})`));
    vb.w = S.width; vb.h = S.height; setVB();
  }

  initVersionsLoop();
}

function initVersionsLoop() {
  const loop = $('[data-vloop]');
  const cols = $$('[data-vloop-col]', loop);
  const items = $$('[data-vs-item]');
  const state = cols.map((c) => ({ el: $('.vloop__inner', c), dir: +c.dataset.dir, y: 0, h: 0 }));
  let speed = reduced ? 0 : 0.5;
  let target = speed;
  let drag = null;

  const measure = () => state.forEach((s) => { s.h = s.el.scrollHeight / 2; if (s.dir < 0) s.y = -s.h / 2; });
  measure();
  window.addEventListener('resize', measure);

  gsap.ticker.add(() => {
    speed += (target - speed) * 0.08;
    state.forEach((s) => {
      s.y -= speed * s.dir;
      if (s.y <= -s.h) s.y += s.h;
      if (s.y > 0) s.y -= s.h;
      s.el.style.transform = `translate3d(0, ${s.y}px, 0)`;
    });
  });

  // pausa no hover
  loop.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') target = 0; });
  loop.addEventListener('pointerleave', () => { target = reduced ? 0 : 0.5; drag = null; });
  // arrastar para rolar
  loop.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; drag = { y: e.clientY }; loop.setPointerCapture(e.pointerId); });
  loop.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dy = e.clientY - drag.y; drag.y = e.clientY;
    state.forEach((s) => { s.y += dy * s.dir; });
  });
  loop.addEventListener('pointerup', () => { drag = null; });

  // destacar a versão ao passar na lista
  items.forEach((li) => {
    const on = () => {
      loop.classList.add('has-focus');
      items.forEach((x) => x.classList.toggle('is-on', x === li));
      $$('.vt', loop).forEach((t) => t.classList.toggle('is-match', t.dataset.vt === li.dataset.vsItem));
    };
    const off = () => { loop.classList.remove('has-focus'); li.classList.remove('is-on'); };
    li.addEventListener('pointerenter', on); li.addEventListener('pointerleave', off);
    li.tabIndex = 0; li.addEventListener('focus', on); li.addEventListener('blur', off);
  });
}
