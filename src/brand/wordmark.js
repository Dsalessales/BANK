/**
 * Geometria da marca (fictícia) — tudo construído com retas e diagonais,
 * numa grade de altura 100. Trocar a marca = trocar estas formas.
 *
 * Cada letra tem: largura (w), posição na linha horizontal (x) e um path
 * SVG em coordenadas locais (0..w, 0..100). Os paths são fechados para
 * permitir tanto preenchimento quanto o efeito de "desenhar" (stroke).
 */

const H = 100;

export const LETTERS = [
  { id: 'v', char: 'V', w: 100, d: 'M0 0H24L50 72L76 0H100L62 100H38Z' },
  { id: 'e', char: 'E', w: 70, d: 'M0 0H70V20H22V40H62V60H22V80H70V100H0Z' },
  { id: 'l', char: 'L', w: 64, d: 'M0 0H22V80H64V100H0Z' },
  { id: 't', char: 'T', w: 80, d: 'M0 0H80V20H51V100H29V20H0Z' },
  { id: 'a', char: 'A', w: 100, d: 'M38 0H62L100 100H76L68 78H32L24 100H0ZM50 30L39.5 60H60.5Z' },
];

/** Espaçamento entre letras (kerning simples, por par). */
const KERN = { ve: 12, el: 12, lt: 4, ta: 6 };

/** Layout horizontal: x de cada letra. */
export const HORIZONTAL = (() => {
  let x = 0;
  const out = {};
  LETTERS.forEach((l, i) => {
    out[l.id] = { x, y: 0 };
    const next = LETTERS[i + 1];
    x += l.w + (next ? KERN[l.id + next.id] ?? 10 : 0);
  });
  return { pos: out, width: x, height: H };
})();

/** Layout empilhado: "VEL" em cima, "TA" embaixo, alinhado à esquerda. */
export const STACKED = (() => {
  const gap = 16;
  const p = HORIZONTAL.pos;
  const pos = {
    v: { x: p.v.x, y: 0 },
    e: { x: p.e.x, y: 0 },
    l: { x: p.l.x, y: 0 },
    t: { x: 0, y: H + gap },
    a: { x: 80 + KERN.ta, y: H + gap },
  };
  return { pos, width: p.l.x + 64, height: H * 2 + gap };
})();

/** O símbolo é o V. */
export const SYMBOL = LETTERS[0];

/**
 * Renderiza a marca como SVG.
 * @param {object} o
 * @param {'horizontal'|'stacked'} [o.layout]
 * @param {string} [o.className]
 * @param {string} [o.fill]   cor de preenchimento (padrão: currentColor)
 * @param {boolean} [o.outline] desenha também um contorno (para animação de traço)
 * @param {string} [o.label]  rótulo acessível
 */
export function wordmarkSVG({ layout = 'horizontal', className = '', fill = 'currentColor', outline = false, label } = {}) {
  const L = layout === 'stacked' ? STACKED : HORIZONTAL;
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  const letters = LETTERS.map((l) => {
    const { x, y } = L.pos[l.id];
    return `<g class="wm__letter" data-letter="${l.id}" transform="translate(${x} ${y})">
      ${outline ? `<path class="wm__stroke" d="${l.d}" fill="none" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke" pathLength="1"/>` : ''}
      <path class="wm__fill" d="${l.d}" fill="${fill}" fill-rule="evenodd"/>
    </g>`;
  }).join('');
  return `<svg class="wm ${className}" viewBox="0 0 ${L.width} ${L.height}" ${aria}>${letters}</svg>`;
}

/** Símbolo isolado (V) — com gradiente opcional. */
export function symbolSVG({ className = '', gradient = false, outline = false, id = 'sym' } = {}) {
  const fill = gradient ? `url(#${id}-grad)` : 'currentColor';
  return `<svg class="sym ${className}" viewBox="-4 -4 108 108" aria-hidden="true">
    ${gradient ? `<defs><linearGradient id="${id}-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--mist)"/><stop offset="1" stop-color="var(--lime)"/>
    </linearGradient></defs>` : ''}
    ${outline ? `<path class="sym__stroke" d="${SYMBOL.d}" fill="none" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke" pathLength="1"/>` : ''}
    <path class="sym__fill" d="${SYMBOL.d}" fill="${fill}"/>
  </svg>`;
}

/** String SVG autocontida (cores reais) — usada pelo "download" simulado. */
export function standaloneWordmark(color = '#0E1716') {
  const L = HORIZONTAL;
  const g = LETTERS.map((l) => `<path transform="translate(${L.pos[l.id].x} 0)" d="${l.d}" fill="${color}" fill-rule="evenodd"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.width} ${L.height}">${g}</svg>`;
}
