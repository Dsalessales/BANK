/**
 * Templates de cada seção. Lêem tudo de src/content.js.
 * Atributos data-* são os ganchos usados pelas animações (src/motion).
 */
import { brand, nav, loader, hero, applications, app, name, stacked, typography, colors, pattern, closing } from '../content.js';
import { wordmarkSVG, symbolSVG, SYMBOL } from '../brand/wordmark.js';
import { card, phone, arrow, rollText, secHead, splitTitle, screenDashboard } from './components.js';
import { hexToRgb, rgbToCmyk, contrast } from '../utils/color.js';

const pad = (n) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
export const loaderHTML = () => `
<div class="ld" data-loader role="status" aria-label="Carregando a apresentação">
  <div class="ld__ghost" aria-hidden="true">${Array.from({ length: 24 }, () => symbolSVG({ outline: true })).join('')}</div>
  <div class="ld__mark" aria-hidden="true">${symbolSVG({ outline: true, gradient: true, id: 'ld' })}</div>
  <div class="ld__corner ld__tl"><span class="ld__logo">${wordmarkSVG()}</span><span class="label label--dim">${brand.kind}</span></div>
  <div class="ld__corner ld__tr label"><span class="label--dim">${brand.project}</span><span>${brand.tagline}</span></div>
  <div class="ld__foot">
    <p class="ld__msg"><span data-ld-msg data-done="${loader.done}" data-msgs='${JSON.stringify(loader.messages)}'>${loader.messages[0]}</span></p>
    <div class="ld__bar" aria-hidden="true"><i data-ld-bar></i></div>
    <span class="ld__pct label" data-ld-pct>0%</span>
  </div>
</div>`;

/* ------------------------------------------------------------------ */
export const headerHTML = () => `
<div class="progress" aria-hidden="true"><i data-progress></i></div>
<header class="nav" data-header data-theme="dark">
  <div class="nav__pill">
    <a class="nav__logo" href="#inicio" data-scroll-to="#inicio" aria-label="${brand.name} — voltar ao início">${wordmarkSVG()}</a>
    <nav class="nav__links" aria-label="Seções" data-nav-links>
      <span class="nav__hover" aria-hidden="true" data-nav-hover></span>
      ${nav.slice(1).map((n) => `<a class="nav__link" href="#${n.id}" data-scroll-to="#${n.id}" data-nav="${n.id}">${rollText(n.label)}</a>`).join('')}
    </nav>
    <a class="nav__cta" href="#" data-download data-magnetic>${rollText(brand.kitLabel)}${arrow('down')}</a>
    <button class="nav__menu" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn aria-label="Abrir menu">
      <span class="nav__burger" aria-hidden="true"><i></i><i></i></span>
    </button>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Seções" data-menu>
  <div class="menu__bg" aria-hidden="true"></div>
  <ol class="menu__list">
    ${nav.map((n, i) => `<li class="menu__item"><a href="#${n.id}" data-scroll-to="#${n.id}" data-menu-link><span class="degree">${pad(i)}</span><span class="menu__name">${n.label}</span></a></li>`).join('')}
  </ol>
  <div class="menu__foot label"><a href="#" class="menu__cta" data-download>${brand.kitLabel} ${arrow('down')}</a><span class="label--dim">${brand.tagline}</span></div>
</nav>
<div class="cursor" aria-hidden="true" data-cursor-el><span class="cursor__ring"><span class="cursor__label" data-cursor-label></span></span><span class="cursor__dot"></span></div>
<div class="toast label" data-toast aria-live="polite"></div>`;

/* ------------------------------------------------------------------ */
/* 00 + 01 — Intro fixa: hero → conceito → símbolo                     */
export const introHTML = () => `
<section class="intro" id="inicio" data-section data-header-theme="dark" data-intro>
  <span id="simbolo" class="anchor" data-anchor-progress="0.88"></span>
  <div class="intro__stage" data-intro-stage>
    <div class="intro__base" data-base aria-hidden="true">
      <div class="intro__beam intro__beam--a"></div><div class="intro__beam intro__beam--b"></div>
    </div>
    <div class="intro__light" data-light aria-hidden="true"><div class="intro__diag" data-diag></div></div>

    <div class="intro__hero" data-hero>
      <div class="intro__eyebrow label"><span class="label--dim">${hero.eyebrow[0]}</span><span>${hero.eyebrow[1]}</span></div>
      <h1 class="intro__wm" aria-label="${brand.name} — ${brand.tagline}">${wordmarkSVG({ className: 'intro__wm-svg' })}</h1>
      <div class="intro__foot label">
        <span><span class="label--dim">${hero.conceptLabel}</span><br>${hero.conceptLine}</span>
        <span class="intro__cue">${hero.scrollCue} <i class="intro__cue-line"></i></span>
      </div>
    </div>

    <div class="intro__concept" data-concept>
      <span class="label intro__k">00 · ${hero.conceptLabel}</span>
      ${splitTitle(hero.concept.title, 'display display--m', 'h2')}
      <p class="intro__text">${hero.concept.text}</p>
    </div>

    <div class="card-rig" data-card-rig><div class="card-rig__enter" data-card-enter><div class="card-rig__tilt" data-card-tilt>${card({ className: 'card--hero' })}</div></div></div>

    <div class="symcam" data-symcam aria-hidden="true">
      <svg class="symcam__grid" viewBox="0 0 100 100" preserveAspectRatio="none">
        ${[0, 24, 38, 50, 62, 76, 100].map((x) => `<line x1="${x}" y1="-30" x2="${x}" y2="130" pathLength="1"/>`).join('')}
        ${[0, 72, 100].map((y) => `<line x1="-30" y1="${y}" x2="130" y2="${y}" pathLength="1"/>`).join('')}
        <line x1="-10" y1="-27.7" x2="40" y2="102.8" pathLength="1"/><line x1="110" y1="-27.7" x2="60" y2="102.8" pathLength="1"/>
        <circle cx="50" cy="72" r="2.2" pathLength="1"/>
      </svg>
      <svg class="symcam__v" viewBox="0 0 100 100">
        <path class="symcam__stroke" d="${SYMBOL.d}" pathLength="1"/>
        <path class="symcam__fill" d="${SYMBOL.d}"/>
      </svg>
    </div>

    <div class="intro__symtxt" data-symtxt>
      <span class="label intro__k">01 · ${hero.symbol.label}</span>
      ${splitTitle(hero.symbol.title, 'display display--m', 'h2')}
      <p class="intro__text">${hero.symbol.text}</p>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* 02 — Aplicações (scroll horizontal fixo)                            */
const appTile = (it) => {
  switch (it.kind) {
    case 'signature':
      return `<div class="tile tile--light tile--sig"><div class="tile__par">${wordmarkSVG({ layout: 'stacked' })}<span class="tile__hl">${brand.tagline}</span></div></div>`;
    case 'card':
      return `<div class="tile tile--grad"><div class="tile__par tile__card">${card({ back: false, className: 'card--tile' })}</div></div>`;
    case 'icon':
      return `<div class="tile tile--base tile--icon"><div class="tile__par"><span class="bigicon">${symbolSVG()}</span><span class="bigicon__name">${brand.name}</span></div></div>`;
    case 'campaign':
      return `<div class="tile tile--base tile--camp"><div class="tile__par"><div class="camp__shapes"><i></i><i></i><i></i></div><p class="camp__h">${it.headline.join('<br>')}</p><span class="camp__wm">${wordmarkSVG()}</span></div></div>`;
    case 'interface':
      return `<div class="tile tile--accent tile--ui"><div class="tile__par"><div class="ph ph--flat"><div class="ph__frame"><div class="ph__screen">${screenDashboard()}</div></div></div></div></div>`;
    case 'signage':
      return `<div class="tile tile--light tile--sign"><div class="tile__par"><div class="sign"><span class="sign__sym">${symbolSVG()}</span><span class="sign__txt">${wordmarkSVG()}<em>${it.headline}</em></span></div><div class="sign__floor"></div></div></div>`;
    default:
      return '';
  }
};

export const applicationsHTML = () => `
<section class="ga theme-dark curtain" id="aplicacoes" data-section data-header-theme="dark" data-ga>
  <div class="ga__stage" data-ga-stage>
    <div class="ga__head wrap">
      <span class="degree">02</span><span class="label">${applications.label}</span>
      <span class="ga__count label label--dim"><b data-ga-count>01</b> / ${pad(applications.items.length)}</span>
    </div>
    <div class="ga__track" data-ga-track>
      <div class="ga__intro">${splitTitle(applications.intro, 'display display--m', 'h2')}</div>
      ${applications.items.map((it, i) => `
        <figure class="ga__item ga__item--${i % 2 ? 'low' : 'high'}" data-ga-item data-cursor="${it.title}">
          ${appTile(it)}
          <figcaption class="label"><span class="degree">${pad(i + 1)}</span>${it.title}</figcaption>
        </figure>`).join('')}
    </div>
    <div class="ga__progress wrap" aria-hidden="true"><i data-ga-progress></i></div>
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* 03 — App (fixo, telas trocando)                                     */
export const appHTML = () => `
<section class="ap theme-accent curtain" id="app" data-section data-header-theme="accent" data-ap>
  <div class="ap__stage" data-ap-stage>
    <svg class="ap__bigv" viewBox="-2 -2 104 104" aria-hidden="true" data-ap-bigv><path d="${SYMBOL.d}" pathLength="1"/></svg>
    <div class="ap__lines" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="ap__txt wrap">
      <div class="ap__head"><span class="degree">03</span><span class="label">${app.label}</span></div>
      ${splitTitle(app.title, 'display display--m', 'h2')}
      <ol class="ap__steps">
        ${app.steps.map((s, i) => `<li class="ap__step${i === 0 ? ' is-active' : ''}" data-ap-step="${s.id}">
          <span class="degree">${pad(i + 1)}</span>
          <div><h3>${s.title}</h3><p>${s.text}</p></div>
          <i class="ap__step-bar"><b data-ap-bar></b></i>
        </li>`).join('')}
      </ol>
    </div>
    <div class="ap__rig" data-ap-rig><div class="ap__float" data-ap-float>${phone({ className: 'ph--app' })}</div><div class="ap__shadow" data-ap-shadow></div></div>
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* 04 — Nome                                                           */
export const nameHTML = () => `
<section class="nm theme-light" id="nome" data-section data-header-theme="light">
  <div class="wrap">
    ${secHead('04', name.label, name.aside)}
    <div class="nm__intro">
      ${splitTitle(name.title)}
      <p class="lead" data-fade>${name.text}</p>
    </div>
  </div>
  <div class="nm__stage" data-nm-stage>
    <div class="nm__guides" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    ${wordmarkSVG({ className: 'nm__wm', outline: true, label: brand.name })}
    <ol class="nm__labels label" aria-hidden="true">${name.guides.map((g) => `<li data-nm-label>${g}</li>`).join('')}</ol>
  </div>
  <div class="wrap">
    <ol class="nm__facts">${name.facts.map((f) => `<li data-fade><b data-count="${f.value}">${f.value}</b><span class="label">${f.label}</span><p>${f.text}</p></li>`).join('')}</ol>
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* 04.1 — Empilhada + versões                                          */
const versionTile = (kind, bg) => {
  const art = kind === 'horizontal'
    ? `<span class="vt__h">${wordmarkSVG()}<em>${brand.kind}</em></span>`
    : kind === 'simbolo' ? `<span class="vt__s">${symbolSVG()}</span>` : `<span class="vt__st">${wordmarkSVG({ layout: 'stacked' })}</span>`;
  return `<div class="vt vt--${bg}" data-vt="${kind}">${art}</div>`;
};

export const stackHTML = () => {
  const bgs = ['base', 'light', 'accent'];
  const tiles = stacked.versions.items.flatMap((v) => bgs.map((b) => versionTile(v.id, b)));
  const colA = tiles.filter((_, i) => i % 2 === 0);
  const colB = tiles.filter((_, i) => i % 2 === 1);
  const col = (arr, dir) => `<div class="vloop__col" data-vloop-col data-dir="${dir}"><div class="vloop__inner">${arr.join('')}${arr.join('')}</div></div>`;
  return `
<section class="stk theme-accent" data-section data-header-theme="accent" data-stk>
  <div class="stk__stage" data-stk-stage>
    <div class="stk__head wrap label"><span><span class="degree">04.1</span> ${stacked.label}</span><span class="label--dim" data-stk-meta>1 linha</span></div>
    ${wordmarkSVG({ className: 'stk__wm', label: brand.name })}
    <div class="stk__txt wrap"><h2 class="display display--s" data-stk-title>${stacked.title}</h2><p>${stacked.text}</p></div>
  </div>
  <div class="vs" data-versions>
    <div class="vs__grid wrap">
      <div class="vs__text">
        <span class="label"><span class="degree">04.2</span> ${stacked.versions.label}</span>
        ${splitTitle(stacked.versions.title, 'display display--s')}
        <p data-fade>${stacked.versions.text}</p>
        <ul class="vs__list">${stacked.versions.items.map((v, i) => `<li data-vs-item="${v.id}" data-fade><span class="degree">${pad(i + 1)}</span><b>${v.title}</b><span class="label">3 fundos ${arrow('ne')}</span></li>`).join('')}</ul>
        <p class="label label--dim"><span class="only-mouse">${stacked.versions.hint}</span><span class="only-touch">${stacked.versions.hintTouch}</span></p>
      </div>
      <div class="vloop" data-vloop data-cursor="Arraste" aria-label="Versões da marca">${col(colA, 1)}${col(colB, -1)}</div>
    </div>
  </div>
</section>`;
};

/* ------------------------------------------------------------------ */
/* 05 — Tipografia                                                     */
export const typeHTML = () => {
  const [d, t] = typography.fonts;
  return `
<section class="ty theme-dark curtain" id="tipografia" data-section data-header-theme="dark">
  <div class="wrap">
    ${secHead('05', typography.label, typography.aside)}
    <div class="ty__top">
      <div class="ty__viewer" data-ty-viewer data-cursor="Mova">
        <svg class="ty__diag" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="100" x2="100" y2="0"/></svg>
        <span class="ty__base" aria-hidden="true"></span>
        <span class="ty__aa" data-ty-aa>Aa</span>
        <div class="ty__vfoot label"><span data-ty-name>${d.name}</span><span data-ty-wght>wght 800</span><span data-ty-role>${d.role}</span></div>
      </div>
      <div class="ty__copy">
        <div class="ty__tabs" role="tablist">${typography.fonts.map((f, i) => `<button role="tab" type="button" class="ty__tab${i === 0 ? ' is-on' : ''}" aria-selected="${i === 0}" data-ty-font="${f.id}">${f.name}</button>`).join('')}</div>
        <p class="lead" data-ty-text>${d.text}</p>
        <label class="ty__range label">Peso <input type="range" min="200" max="900" step="1" value="800" data-ty-weight></label>
        <p class="label label--dim"><span class="only-mouse">Dica: mova o cursor sobre o “Aa” para variar o peso.</span><span class="only-touch">Dica: arraste o dedo para os lados sobre o “Aa” para variar o peso.</span></p>
      </div>
    </div>
    <ul class="ty__glyphs" data-ty-glyphs aria-label="Caracteres da fonte de títulos">
      ${[...typography.glyphs.replace('R$', '\u0001')].map((c) => `<li data-glyph>${c === '\u0001' ? 'R$' : c}</li>`).join('')}
    </ul>
    <div class="ty__tester" data-fade>
      <div class="ty__tester-bar label">
        <span>Teste a fonte</span>
        <label>Tamanho <input type="range" min="24" max="160" value="88" data-ty-size></label>
        <button type="button" class="ty__swap" data-ty-swap>${d.name} ⇄ ${t.name}</button>
      </div>
      <p class="ty__edit" contenteditable="true" spellcheck="false" data-ty-edit data-cursor="Escreva">${typography.tester}</p>
    </div>
    <div class="ty__scale">
      <div class="ty__scale-head label"><span>Hierarquia</span><span class="label--dim">Proposta · a validar</span></div>
      <ol>${typography.scale.map((s) => `<li data-fade><span class="label label--dim">${s.role}</span><span class="ty__sample ty__sample--${s.font}${s.caps ? ' is-caps' : ''}" style="font-size:${s.size}">${s.sample}</span><span class="label label--dim ty__meta">${s.meta}</span></li>`).join('')}</ol>
    </div>
  </div>
</section>`;
};

/* ------------------------------------------------------------------ */
/* 06 — Cores                                                          */
export const colorsHTML = () => `
<section class="co theme-light curtain" id="cores" data-section data-header-theme="light">
  <div class="wrap">
    ${secHead('06', colors.label, colors.aside)}
    <div class="co__intro">${splitTitle(colors.title)}<p class="lead" data-fade>${colors.text}</p></div>
  </div>
  <ul class="co__strips wrap" data-co-strips>
    ${colors.palette.map((c, i) => {
      const rgb = hexToRgb(c.hex);
      const cmyk = rgbToCmyk(rgb);
      const fg = c.id === 'base' ? '#F3EEE8' : '#0B2230';
      const ratio = c.id === 'base' ? contrast(c.hex, colors.palette[0].hex) : contrast(c.hex, '#0B2230');
      const vs = c.id === 'base' ? 'sobre coral' : 'com petróleo';
      const copy = c.hex2 ? `${c.hex}, ${c.hex2}` : c.hex;
      return `<li class="co__strip co__strip--${c.id}${i === 0 ? ' is-open' : ''}" data-co-strip>
        <button type="button" data-copy="${copy}" data-cursor="Copiar" aria-label="Copiar ${c.name} ${copy}">
          <span class="co__k label">${pad(i + 1)} · ${c.name}</span>
          <span class="co__hex">${c.hex2 ? 'Degradê' : c.hex}</span>
          <span class="co__info">
            <span class="co__use">${c.use}</span>
            <span class="co__specs label">
              <span><em>RGB</em>${rgb.join(' · ')}</span>
              <span><em>CMYK*</em>${cmyk.join(' · ')}</span>
              <span><em>Contraste</em>${ratio.toFixed(1)} : 1 ${vs}</span>
            </span>
          </span>
        </button>
      </li>`;
    }).join('')}
  </ul>
  <div class="wrap">
    <div class="co__grad" data-co-grad>
      <div class="co__grad-fill" data-co-gradfill></div>
      <div class="co__grad-txt"><span class="label">${colors.gradient.eyebrow}</span><p class="display display--s">${colors.gradient.lines.join('<br>')}</p></div>
      <span class="co__grad-ends label">${colors.palette[3].hex} → ${colors.palette[3].hex2}</span>
    </div>
    <div class="co__prop">
      <div class="co__prop-head label"><span>Proporção de uso</span><span class="pill">Proposta · a validar</span></div>
      <div class="co__bar" data-co-bar>${colors.proportion.map((p) => `<span class="co__seg co__seg--${p.id}" style="--w:${p.value}" data-co-seg><b><em data-count="${p.value}">${p.value}</em>%</b> ${p.label}</span>`).join('')}</div>
      <p class="label label--dim">${colors.note}</p>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* 07 — Grafismos                                                      */
const patternArt = (kind) => {
  if (kind === 'pattern-card') return `<div class="pt__art pt__art--card"><div class="pt__pat"></div>${card({ back: false, className: 'card--pattern' })}</div>`;
  if (kind === 'pattern-bag') return `<div class="pt__art pt__art--bag"><div class="bag"><span class="bag__handle"></span><div class="bag__body"><div class="pt__pat pt__pat--accent"></div><span class="bag__wm">${wordmarkSVG()}</span></div></div></div>`;
  return `<div class="pt__art pt__art--a"><div class="pt__pat pt__pat--big"></div><span class="pt__sym">${symbolSVG()}</span></div>`;
};

export const patternHTML = () => `
<section class="pt theme-dark curtain" id="grafismos" data-section data-header-theme="dark">
  <div class="pt__field" data-pt-field data-cursor="Mova">
    <canvas data-pt-canvas aria-hidden="true"></canvas>
    <div class="pt__over wrap">
      ${secHead('07', pattern.label, pattern.aside)}
      <div class="pt__copy">${splitTitle(pattern.title, 'display pt__title')}<p class="lead" data-fade>${pattern.text}</p></div>
    </div>
  </div>
  <div class="pt__uses wrap">
    ${pattern.uses.map((u, i) => `<figure class="pt__use" data-fade data-cursor="${u.title}">${patternArt(u.kind)}<figcaption class="label"><span class="degree">${pad(i + 1)}</span>${u.title}</figcaption></figure>`).join('')}
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* 08 — Fechamento                                                     */
export const closingHTML = () => {
  const words = closing.phrase.split(' ');
  return `
<section class="cl theme-dark" data-section data-header-theme="dark" data-cl>
  <div class="cl__glow" aria-hidden="true"></div>
  <div class="wrap">
    ${secHead('08', closing.label)}
    <p class="cl__phrase display" data-cl-phrase aria-label="${closing.phrase}">${words.map((w) => `<span class="w${closing.highlight.includes(w) ? ' w--hl' : ''}" aria-hidden="true">${w}</span>`).join(' ')}</p>
    <div class="cl__actions">
      <a href="#" class="btn btn--accent" data-download data-magnetic><span class="btn__fill" aria-hidden="true"></span>${rollText(closing.primary)}${arrow('right')}</a>
      <a href="#inicio" class="btn btn--ghost" data-scroll-to="#inicio" data-magnetic>${rollText(closing.secondary)}${arrow('up')}</a>
    </div>
    <p class="label label--dim cl__kit">${closing.kit}</p>
  </div>
  <div class="cl__giant" data-cl-giant aria-hidden="true">${wordmarkSVG()}</div>
  <footer class="cl__foot wrap label">${closing.footer.map((f, i) => `<span class="${i === 1 ? 'label--dim' : ''}">${f}</span>`).join('')}</footer>
</section>`;
};
