/**
 * Ponto de entrada: monta o HTML a partir do conteúdo e liga as animações.
 *
 * Ordem:
 *  1. render  — seções em src/render/sections.js (conteúdo: src/content.js)
 *  2. loader  — roda enquanto as fontes carregam
 *  3. motion  — ScrollTriggers são criados na ordem da página (importante p/ pins)
 *  4. entrada — hero entra, scroll é liberado
 */
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/archivo/wdth.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/components.css';
import './styles/sections.css';

import * as S from './render/sections.js';
import { ScrollTrigger, initSmoothScroll, scrollToTarget } from './motion/core.js';
import * as UI from './motion/ui.js';
import { initReveals } from './motion/reveal.js';
import { initIntro, introEnter } from './motion/intro.js';
import { initGallery, initApp, initName, initStack } from './motion/showcase.js';
import { initType, initColors, initPattern, initClosing } from './motion/details.js';

/* 1. Render ----------------------------------------------------------- */
document.querySelector('#chrome').innerHTML = S.loaderHTML() + S.headerHTML();
document.querySelector('#main').innerHTML = [
  S.introHTML(), S.applicationsHTML(), S.appHTML(), S.nameHTML(), S.stackHTML(),
  S.typeHTML(), S.colorsHTML(), S.patternHTML(), S.closingHTML(),
].join('');

/* 2. Loader + 3. Motion ---------------------------------------------- */
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
const lenis = initSmoothScroll();
document.body.classList.add('is-loading');

// ScrollTriggers na ordem visual da página
initIntro();
initGallery();
initApp();
initName();
initStack();
initType();
initColors();
initPattern();
initClosing();
initReveals();

UI.initHeader();
UI.initScrollLinks();
UI.initMenu();
UI.initProgress();
UI.initCursor();
UI.initMagnetic();
UI.initDownloads();

document.querySelector('[data-header]').classList.add('is-pre');

/* 4. Entrada ---------------------------------------------------------- */
const enter = introEnter().pause();
UI.runLoader().then(() => {
  document.body.classList.remove('is-loading');
  ScrollTrigger.refresh();
  enter.play();
  UI.revealHeader();
  lenis?.start();
  if (location.hash) setTimeout(() => scrollToTarget(location.hash), 300);
});

// Recalcula pins quando as fontes mudam medidas
document.fonts.ready.then(() => ScrollTrigger.refresh());
let rz;
window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => ScrollTrigger.refresh(), 200); });
