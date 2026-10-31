/**
 * ============================================================
 *  DADOS SIMULADOS (mock) — substituem qualquer backend.
 * ============================================================
 *  Nada aqui faz requisição de rede. Os valores alimentam as telas
 *  do app (login, dashboard, ícone) e o "download" do kit de marca.
 *  Para ligar num backend real no futuro, troque estas funções por
 *  chamadas à sua API mantendo o mesmo formato de retorno.
 */
import { brand, colors } from '../content.js';
import { standaloneWordmark, SYMBOL } from '../brand/wordmark.js';

export const user = {
  firstName: 'Marina',
  avatarInitials: 'MA',
};

export const account = {
  balance: 4286.9,
  currency: 'BRL',
  /** gasto por dia da semana (0..1 relativo) */
  weekSpend: [0.42, 0.68, 0.35, 0.9, 0.55, 0.78, 0.3],
  weekLabels: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
  transactions: [
    { title: 'Pix recebido', detail: 'João P.', value: 350, icon: 'in' },
    { title: 'Mercado Bom Dia', detail: 'Cartão', value: -87.4, icon: 'card' },
    { title: 'Transporte', detail: 'Cartão', value: -12.9, icon: 'card' },
    { title: 'Caixinha Viagem', detail: 'Guardado', value: -200, icon: 'save' },
  ],
};

export const homeScreenApps = [
  'Mapas', 'Fotos', 'Câmera', 'Clima', 'Notas', 'Música', 'Agenda', 'Ajustes',
  'Mail', 'VELTA', 'Relógio', 'Loja',
];

export const formatBRL = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

/** Login simulado: sempre "funciona" após um pequeno atraso. */
export function mockLogin() {
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true, user }), 900));
}

/**
 * "Download" do kit de marca — gerado 100% no navegador.
 * Simula progresso (como se viesse de um servidor) e entrega um SVG
 * com logo, símbolo e paleta.
 */
export function mockDownloadKit(onProgress = () => {}) {
  return new Promise((resolve) => {
    let p = 0;
    const tick = () => {
      p = Math.min(1, p + 0.08 + Math.random() * 0.12);
      onProgress(p);
      if (p < 1) return setTimeout(tick, 90);
      const svg = buildKitSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brand.name.toLowerCase()}-kit-de-marca.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      resolve();
    };
    setTimeout(tick, 120);
  });
}

function buildKitSVG() {
  const sw = colors.palette
    .map((c, i) => {
      const x = 40 + i * 230;
      const fill = c.hex2 ? `url(#g)` : c.hex;
      return `<rect x="${x}" y="520" width="210" height="160" rx="14" fill="${fill}" stroke="#0E1716" stroke-opacity=".15"/>
        <text x="${x}" y="710" font-family="sans-serif" font-size="18" fill="#0E1716">${c.name} · ${c.hex}${c.hex2 ? ' → ' + c.hex2 : ''}</text>`;
    })
    .join('');
  const wm = standaloneWordmark('#0E1716').replace('<svg', '<svg x="40" y="60" width="600" height="133"');
  const wmLight = standaloneWordmark('#C4F263').replace('<svg', '<svg x="520" y="300" width="380" height="84"');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="980" height="760" viewBox="0 0 980 760">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#C4F263"/><stop offset="1" stop-color="#ECF0EB"/></linearGradient></defs>
  <rect width="980" height="760" fill="#ECF0EB"/>
  ${wm}
  <rect x="40" y="240" width="420" height="240" rx="18" fill="#C4F263"/>
  <path transform="translate(190 300) scale(1.2)" d="${SYMBOL.d}" fill="#0E1716"/>
  <rect x="480" y="240" width="460" height="240" rx="18" fill="#0E1716"/>
  ${wmLight}
  ${sw}
  <text x="40" y="40" font-family="sans-serif" font-size="14" fill="#0E1716" opacity=".6">${brand.name} · kit de marca (mock gerado no navegador)</text>
</svg>`;
}
