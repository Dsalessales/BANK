/**
 * Componentes visuais reutilizáveis — tudo em HTML/CSS/SVG, sem fotos.
 * Para usar imagens reais, troque o conteúdo destas funções por <img>.
 */
import { brand, hero } from '../content.js';
import { wordmarkSVG, symbolSVG } from '../brand/wordmark.js';
import { account, user, homeScreenApps, formatBRL } from '../data/mock.js';

export const arrow = (dir = 'down') => {
  const r = { down: 0, right: -90, up: 180, ne: -135 }[dir] ?? 0;
  return `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" style="transform:rotate(${r}deg)"><path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
};

/** Texto que "rola" no hover (duas cópias empilhadas). */
export const rollText = (txt) =>
  `<span class="roll"><span class="roll__a">${txt}</span><span class="roll__b" aria-hidden="true">${txt}</span></span>`;

/** Cabeçalho de seção: número · rótulo ─── detalhe */
export const secHead = (num, label, aside = '') => `
  <header class="sec-head" data-fade>
    <span class="degree">${num}</span>
    <span class="label">${label}</span>
    <span class="sec-head__rule"></span>
    ${aside ? `<span class="label label--dim">${aside}</span>` : ''}
  </header>`;

/** Título com linhas que sobem (split por linha definida no conteúdo). */
export const splitTitle = (lines, cls = 'display', tag = 'h2') =>
  `<${tag} class="${cls}" data-split aria-label="${lines.join(' ')}">${lines
    .map((l) => `<span class="line" aria-hidden="true"><span class="line__in">${l}</span></span>`)
    .join('')}</${tag}>`;

/** Cartão de crédito em CSS (frente e verso). */
export function card({ className = '', back = true } = {}) {
  const c = hero.card;
  return `<div class="card ${className}" data-card>
    <div class="card__face card__front">
      <div class="card__shine" data-card-shine></div>
      <div class="card__sym">${symbolSVG()}</div>
      <div class="card__logo">${wordmarkSVG()}</div>
      <div class="card__chip"><i></i><i></i><i></i></div>
      <svg class="card__nfc" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5c2 3 2 7 0 10M10.5 3.5c3 4 3 9 0 13M14 2c4 5 4 11 0 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      <div class="card__num">${c.number.replace(/ /g, '&ensp;')}</div>
      <div class="card__holder">${c.holder}</div>
      <div class="card__brand"><i></i><i></i></div>
    </div>
    ${back ? `<div class="card__face card__back">
      <div class="card__stripe"></div>
      <div class="card__sign"><span>${c.expiry}</span><b>•••</b></div>
      <div class="card__sym card__sym--back">${symbolSVG()}</div>
      <p class="card__fine">Cartão fictício · ${brand.name} · uso ilustrativo</p>
    </div>` : ''}
  </div>`;
}

/* ------------------------------------------------------------------ */
/*  Telas do app (mock)                                                */
/* ------------------------------------------------------------------ */
const statusBar = () => `<div class="ph__status"><span>9:41</span><span class="ph__isl"></span><span class="ph__sig"><i></i><i></i><i></i><b></b></span></div>`;

export const screenLogin = () => `
  <div class="scr scr--login" data-screen="login">
    ${statusBar()}
    <div class="scr__login-logo">${wordmarkSVG()}</div>
    <div class="scr__login-card">
      <p class="scr__hello">Olá, ${user.firstName}</p>
      <p class="scr__sub">Que bom te ver de novo</p>
      <div class="scr__field"><span>Senha</span><b>• • • • • •</b></div>
      <button class="scr__btn" type="button" data-mock-login>Entrar</button>
      <p class="scr__faceid"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 6V3.5A1.5 1.5 0 0 1 3.5 2H6M14 2h2.5A1.5 1.5 0 0 1 18 3.5V6M18 14v2.5a1.5 1.5 0 0 1-1.5 1.5H14M6 18H3.5A1.5 1.5 0 0 1 2 16.5V14M7 8v1M13 8v1M10 8v3h-1M7.5 13.5c1.5 1 3.5 1 5 0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>Entrar com Face ID</p>
    </div>
  </div>`;

export const screenDashboard = () => `
  <div class="scr scr--dash" data-screen="dashboard">
    ${statusBar()}
    <div class="scr__top"><span class="scr__avatar">${user.avatarInitials}</span><span class="scr__greet">Oi, ${user.firstName}</span><span class="scr__bell"></span></div>
    <div class="scr__balance">
      <span class="scr__label">Saldo disponível</span>
      <button class="scr__eye" type="button" data-eye aria-label="Mostrar/ocultar saldo"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="2.5" fill="currentColor"/></svg></button>
      <strong class="scr__amount" data-count-to="${account.balance}">${formatBRL(account.balance)}</strong>
    </div>
    <div class="scr__actions">${['Pix', 'Pagar', 'Cartão', 'Guardar'].map((a) => `<span><i></i>${a}</span>`).join('')}</div>
    <div class="scr__chart">
      <span class="scr__label">Gastos da semana</span>
      <div class="scr__bars">${account.weekSpend
        .map((v, i) => `<span class="scr__bar${i === 3 ? ' is-hi' : ''}" style="--h:${v}"><i></i><em>${account.weekLabels[i]}</em></span>`)
        .join('')}</div>
    </div>
    <ul class="scr__list">${account.transactions
      .map((t) => `<li><i class="scr__ti scr__ti--${t.icon}"></i><span><b>${t.title}</b><em>${t.detail}</em></span><strong class="${t.value > 0 ? 'is-in' : ''}">${t.value > 0 ? '+ ' : '− '}${formatBRL(Math.abs(t.value))}</strong></li>`)
      .join('')}</ul>
  </div>`;

export const screenHome = () => `
  <div class="scr scr--home" data-screen="icone">
    ${statusBar()}
    <div class="scr__widget"><b>sex, 31</b><span>Sem compromissos</span></div>
    <div class="scr__grid">${homeScreenApps
      .map((n, i) => n === brand.name
        ? `<span class="scr__app scr__app--brand" data-app-brand><i>${symbolSVG()}</i><em>${n}</em><b class="scr__badge">2</b></span>`
        : `<span class="scr__app" style="--i:${i}"><i></i><em>${n}</em></span>`)
      .join('')}</div>
    <div class="scr__dock"><i></i><i></i><i></i><i></i></div>
  </div>`;

/** Celular em CSS com telas empilhadas. `screens`: lista de ids. */
export function phone({ className = '', screens = ['login', 'dashboard', 'icone'] } = {}) {
  const map = { login: screenLogin, dashboard: screenDashboard, icone: screenHome };
  return `<div class="ph ${className}" data-phone>
    <div class="ph__frame">
      <div class="ph__screen">${screens.map((s) => map[s]()).join('')}</div>
      <div class="ph__glare"></div>
    </div>
    <span class="ph__btn ph__btn--a"></span><span class="ph__btn ph__btn--b"></span><span class="ph__btn ph__btn--c"></span>
  </div>`;
}
