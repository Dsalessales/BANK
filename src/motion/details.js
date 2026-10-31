/**
 * 05 Tipografia · 06 Cores · 07 Grafismos (canvas) · 08 Fechamento
 */
import { gsap, reduced, finePointer, $, $$, clamp, lerp } from './core.js';
import { typography } from '../content.js';
import { toast } from './ui.js';

/* ------------------------------------------------------------------ */
/* 05 — Tipografia                                                     */
export function initType() {
  const viewer = $('[data-ty-viewer]');
  const aa = $('[data-ty-aa]');
  const wLabel = $('[data-ty-wght]');
  const nameEl = $('[data-ty-name]');
  const roleEl = $('[data-ty-role]');
  const textEl = $('[data-ty-text]');
  const range = $('[data-ty-weight]');
  const tabs = $$('[data-ty-font]');
  const edit = $('[data-ty-edit]');
  const size = $('[data-ty-size]');
  const swap = $('[data-ty-swap]');
  let font = typography.fonts[0];
  const w = { v: 800 };

  const applyWeight = () => {
    aa.style.fontWeight = Math.round(w.v);
    wLabel.textContent = `wght ${Math.round(w.v)}`;
    range.value = Math.round(w.v);
  };
  const setFont = (id) => {
    font = typography.fonts.find((f) => f.id === id);
    tabs.forEach((t) => { const on = t.dataset.tyFont === id; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on); });
    gsap.timeline()
      .to(aa, { yPercent: -20, opacity: 0, duration: 0.25, ease: 'power2.in' })
      .add(() => {
        aa.style.fontFamily = font.family; aa.style.fontStretch = font.stretch;
        nameEl.textContent = font.name; roleEl.textContent = font.role; textEl.textContent = font.text;
      })
      .fromTo(aa, { yPercent: 20 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
  };
  tabs.forEach((t) => t.addEventListener('click', () => setFont(t.dataset.tyFont)));
  range.addEventListener('input', () => { w.v = +range.value; applyWeight(); });

  // peso varia com a posição horizontal do cursor sobre o "Aa"
  viewer.addEventListener('pointermove', (e) => {
    const r = viewer.getBoundingClientRect();
    const t = clamp((e.clientX - r.left) / r.width, 0, 1);
    gsap.to(w, { v: 200 + t * 700, duration: 0.6, ease: 'power3.out', onUpdate: applyWeight, overwrite: true });
  });

  // glifos: hover mostra o caractere no visualizador
  const original = aa.textContent;
  $$('[data-glyph]').forEach((g) => {
    g.addEventListener('pointerenter', () => { aa.textContent = g.textContent; });
    g.addEventListener('pointerleave', () => { aa.textContent = original; });
  });
  if (!reduced) {
    gsap.from('[data-glyph]', {
      opacity: 0, y: 20, duration: 0.6, ease: 'expo.out', stagger: { each: 0.012, from: 'start' },
      scrollTrigger: { trigger: '[data-ty-glyphs]', start: 'top 85%' },
    });
    // "onda" de destaque que percorre a grade uma vez ao entrar
    const glyphs = $$('[data-glyph]');
    gsap.timeline({ scrollTrigger: { trigger: '[data-ty-glyphs]', start: 'top 60%' } })
      .add(() => glyphs.forEach((g, i) => setTimeout(() => { g.classList.add('is-hot'); setTimeout(() => g.classList.remove('is-hot'), 260); }, 400 + i * 18)));
  }

  // testador
  size.addEventListener('input', () => { edit.style.fontSize = `${size.value}px`; });
  swap.addEventListener('click', () => edit.classList.toggle('is-text'));
  edit.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); edit.blur(); } });
  const fitSize = () => { if (innerWidth < 640) { size.value = 48; edit.style.fontSize = '48px'; } };
  fitSize();
}

/* ------------------------------------------------------------------ */
/* 06 — Cores                                                          */
export function initColors() {
  const strips = $$('[data-co-strip]');
  const open = (s) => strips.forEach((x) => x.classList.toggle('is-open', x === s));
  strips.forEach((s) => {
    if (finePointer) s.addEventListener('pointerenter', () => open(s));
    const btn = $('button', s);
    btn.addEventListener('focus', () => open(s));
    btn.addEventListener('click', async () => {
      open(s);
      const value = btn.dataset.copy;
      try { await navigator.clipboard.writeText(value); toast(`Copiado · ${value}`, value.split(',')[0]); }
      catch { toast(`${value} · copie manualmente`, value.split(',')[0]); }
      if (!reduced) gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });

  if (reduced) { gsap.set('[data-co-gradfill]', { clipPath: 'inset(0 0% 0 0)' }); return; }

  gsap.from(strips, { yPercent: 30, opacity: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-co-strips]', start: 'top 85%' } });
  gsap.to('[data-co-gradfill]', { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: '[data-co-grad]', start: 'top 85%', end: 'center 40%', scrub: 0.6 } });
  gsap.from('[data-co-seg]', { scaleX: 0, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-co-bar]', start: 'top 88%' } });
}

/* ------------------------------------------------------------------ */
/* 07 — Grafismos: campo de traços diagonais que apontam para o cursor  */
export function initPattern() {
  const field = $('[data-pt-field]');
  const canvas = $('[data-pt-canvas]', field);
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const ACCENT = css.getPropertyValue('--accent').trim() || '#FF6F59';
  let W = 0, H = 0, dpr = 1, cells = [], visible = false;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
  const BASE = -68 * (Math.PI / 180); // ângulo das diagonais do V

  const build = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = field.clientWidth; H = field.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const step = W < 640 ? 34 : 46;
    cells = [];
    for (let y = step / 2; y < H + step; y += step) {
      for (let x = step / 2; x < W + step; x += step) {
        cells.push({ x, y, a: BASE, s: 0.5, glow: 0, seed: Math.random() * Math.PI * 2 });
      }
    }
  };
  build();
  new ResizeObserver(build).observe(field);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(field);

  field.addEventListener('pointermove', (e) => {
    const r = field.getBoundingClientRect();
    mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top; mouse.active = true;
  });
  field.addEventListener('pointerleave', () => { mouse.active = false; });

  let t = 0;
  const draw = () => {
    if (!visible) return;
    t += 0.012;
    // sem mouse (ou no toque): um ponto passeia sozinho
    if (!mouse.active) {
      mouse.tx = W * (0.5 + 0.35 * Math.sin(t * 0.7));
      mouse.ty = H * (0.5 + 0.3 * Math.sin(t * 1.1));
    }
    mouse.x = lerp(mouse.x < -999 ? mouse.tx : mouse.x, mouse.tx, 0.08);
    mouse.y = lerp(mouse.y < -999 ? mouse.ty : mouse.y, mouse.ty, 0.08);
    ctx.clearRect(0, 0, W, H);
    const R = Math.max(220, W * 0.22);
    for (const c of cells) {
      const dx = mouse.x - c.x, dy = mouse.y - c.y;
      const d = Math.hypot(dx, dy);
      const k = reduced ? 0 : Math.max(0, 1 - d / R);
      const targetA = k > 0 ? lerp(BASE, Math.atan2(dy, dx), k * 0.9) : BASE + Math.sin(t + c.seed) * 0.06;
      c.a = lerp(c.a, targetA, 0.12);
      c.s = lerp(c.s, 0.45 + k * 0.9, 0.12);
      c.glow = lerp(c.glow, k, 0.1);
      const len = 15 * c.s;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.a);
      ctx.globalAlpha = 0.16 + c.glow * 0.84;
      ctx.fillStyle = c.glow > 0.02 ? ACCENT : '#F3EEE8';
      // fragmento = paralelogramo (pedaço da haste do V)
      ctx.beginPath();
      ctx.moveTo(-len, -1.6 - c.glow * 1.8); ctx.lineTo(len, -1.6 - c.glow * 1.8);
      ctx.lineTo(len - 3, 1.6 + c.glow * 1.8); ctx.lineTo(-len - 3, 1.6 + c.glow * 1.8);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  };
  gsap.ticker.add(draw);
}

/* ------------------------------------------------------------------ */
/* 08 — Fechamento                                                     */
export function initClosing() {
  const words = $$('[data-cl-phrase] .w');
  if (reduced) { gsap.set(words, { opacity: 1 }); return; }
  gsap.to(words, {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: '[data-cl-phrase]', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
  });
  gsap.fromTo('[data-cl-giant] .wm', { yPercent: 60 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-cl-giant]', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
  });
  gsap.from('[data-cl-giant] .wm__letter', {
    yPercent: 30, stagger: 0.06, ease: 'none',
    scrollTrigger: { trigger: '[data-cl-giant]', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
  });
  gsap.from('.cl__glow', { opacity: 0, scale: 0.6, ease: 'none', scrollTrigger: { trigger: '[data-cl]', start: 'top 70%', end: 'bottom bottom', scrub: true } });
}
