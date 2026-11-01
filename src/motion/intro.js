/**
 * 00 + 01 — Intro fixa (pin).
 *  Entrada pós-loader → hero (wordmark gigante + cartão flutuando com tilt)
 *  → rolagem: wordmark sai, fundo vira areia com diagonal, cartão vira (verso)
 *  → conceito → cartão sai → grade + V se desenham → texto do símbolo.
 */
import { gsap, ScrollTrigger, mm, BP, reduced, finePointer, $, $$ } from './core.js';

export function introEnter() {
  if (reduced) return gsap.timeline();
  const letters = $$('.intro__wm .wm__letter');
  return gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.intro__base', { opacity: 0, duration: 1.2 }, 0)
    .from(letters, { yPercent: 120, opacity: 0, rotate: 6, transformOrigin: '0% 100%', duration: 1.5, stagger: 0.07 }, 0.05)
    .from('.intro__tag span', { opacity: 0, y: 12, duration: 0.8, stagger: 0.02 }, 0.6)
    .from('[data-card-rig]', { yPercent: 0, y: '70vh', rotate: -28, duration: 1.8, ease: 'expo.out' }, 0.25)
    .from('.intro__eyebrow, .intro__foot', { opacity: 0, y: 16, duration: 1, stagger: 0.1 }, 0.7);
}

export function initIntro() {
  const section = $('[data-intro]');
  const stage = $('[data-intro-stage]', section);
  const rig = $('[data-card-rig]');
  const tilt = $('[data-card-tilt]');
  const cardEl = $('[data-card]', tilt);
  const shine = $('[data-card-shine]');

  /* ---- tilt do cartão seguindo o mouse (só no hero) ---- */
  let tiltOn = true;
  if (finePointer && !reduced) {
    const rx = gsap.quickTo(tilt, 'rotateX', { duration: 1, ease: 'power3.out' });
    const ry = gsap.quickTo(tilt, 'rotateY', { duration: 1, ease: 'power3.out' });
    stage.addEventListener('pointermove', (e) => {
      if (!tiltOn) return;
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      rx(-ny * 18); ry(nx * 24);
      shine.style.setProperty('--sx', `${50 + nx * 80}%`);
      shine.style.setProperty('--sy', `${50 + ny * 80}%`);
    });
    stage.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }

  // flutuação contínua do cartão
  if (!reduced) gsap.to(cardEl, { y: -14, rotate: 1.5, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  if (reduced) {
    // estado final legível, sem pin
    gsap.set('[data-concept]', { visibility: 'visible' });
    gsap.set(['[data-hero]', '[data-card-rig]', '[data-symcam]', '[data-symtxt]'], { display: 'none' });
    gsap.set('[data-light]', { clipPath: 'inset(0% 0 0 0)' });
    return;
  }

  mm.add({ desktop: BP.desktop, mobile: BP.mobile }, (ctx) => {
    const { mobile } = ctx.conditions;
    const conceptLines = $$('[data-concept] .line__in');
    const symLines = $$('[data-symtxt] .line__in');
    gsap.set([conceptLines, symLines], { yPercent: 110 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut', duration: 1 },
      scrollTrigger: {
        id: 'intro', trigger: section, start: 'top top', end: mobile ? '+=320%' : '+=380%',
        pin: stage, scrub: 0.9, anticipatePin: 1,
        onUpdate: (st) => {
          tiltOn = st.progress < 0.04;
          section.dataset.headerThemeLive = st.progress > 0.16 ? 'light' : 'dark';
        },
      },
    });

    /* Fase 1 — hero sai, areia entra com a diagonal, cartão vai ao lado e vira */
    tl.to('.intro__wm', { scale: 1.35, yPercent: -40, opacity: 0, filter: 'blur(12px)', duration: 1.2 }, 0)
      .to('.intro__tag, .intro__eyebrow, .intro__foot', { opacity: 0, y: -30, duration: 0.6 }, 0)
      .to('[data-light]', { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.inOut' }, 0.25)
      .fromTo('[data-diag]', { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }, { clipPath: mobile ? 'polygon(44% 0, 100% 0, 100% 50%, 100% 50%)' : 'polygon(58% 0, 100% 0, 100% 100%, 84% 100%)', duration: 1.2, ease: 'power3.inOut' }, 0.5)
      .to(rig, mobile
        ? { left: '50%', top: '34%', scale: 0.8, rotate: -8, duration: 1.4 }
        : { left: '72%', top: '50%', scale: 1.08, rotate: -10, duration: 1.4 }, 0.2)
      .to(cardEl, { rotateY: 180, duration: 1.1, ease: 'power3.inOut' }, 0.9)
      .set('[data-concept]', { visibility: 'visible' }, 0.9)
      .to(conceptLines, { yPercent: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out' }, 1.0)
      .from('[data-concept] .intro__k, [data-concept] .intro__text', { opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'expo.out' }, 1.15)

      /* pausa de leitura */
      .to(cardEl, { rotateY: 360, duration: 1.1, ease: 'power3.inOut' }, 2.1)

      /* Fase 2 — conceito sai, cartão some, grade + V desenham */
      .to(conceptLines, { yPercent: -110, stagger: 0.05, duration: 0.6, ease: 'power3.in' }, 3.0)
      .to('[data-concept] .intro__k, [data-concept] .intro__text', { opacity: 0, y: -20, duration: 0.5 }, 3.0)
      .to(rig, { scale: 0.2, opacity: 0, rotate: 20, y: mobile ? -40 : -120, duration: 0.9, ease: 'power3.in' }, 3.0)
      .to('[data-diag]', { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', duration: 0.9 }, 3.1)
      .set('[data-symcam]', { visibility: 'visible' }, 3.2)
      .to('.symcam__grid line, .symcam__grid circle', { strokeDashoffset: 0, duration: 1, stagger: 0.04, ease: 'power2.inOut' }, 3.2)
      .to('.symcam__stroke', { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 3.6)
      .to('.symcam__fill', { opacity: 1, duration: 0.6 }, 4.6)
      .to('.symcam__grid', { opacity: 0.45, duration: 0.6 }, 4.6)
      .set('[data-symtxt]', { visibility: 'visible' }, 4.3)
      .to(symLines, { yPercent: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out' }, 4.4)
      .from('[data-symtxt] .intro__k, [data-symtxt] .intro__text', { opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'expo.out' }, 4.55)
      .to('.symcam__v', { rotate: -4, scale: 1.04, duration: 1, ease: 'none' }, 5)
      .to({}, { duration: 0.6 }); // respiro antes da próxima seção cobrir

    return () => { gsap.set(cardEl, { clearProps: 'all' }); };
  });
}

export const introTrigger = () => ScrollTrigger.getById('intro');
