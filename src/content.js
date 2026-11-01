/**
 * ============================================================
 *  CONTEÚDO DO SITE — edite aqui textos, seções, cores e itens.
 *  Nada de layout ou animação depende de textos fixos no HTML.
 * ============================================================
 *  A marca "VANTE" é fictícia e serve só de placeholder.
 *  Para trocar a forma do logo, veja src/brand/wordmark.js.
 *  Para trocar as cores, veja `colors` abaixo E src/styles/tokens.css.
 */

export const brand = {
  name: 'VANTE',
  kind: 'Banco digital',
  project: 'Identidade visual',
  tagline: 'Sempre em frente.',
  year: 2026,
  kitLabel: 'Baixar materiais',
};

/** Navegação — `id` precisa existir como seção. */
export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'simbolo', label: 'Símbolo' },
  { id: 'aplicacoes', label: 'Aplicações' },
  { id: 'app', label: 'App' },
  { id: 'nome', label: 'Nome' },
  { id: 'tipografia', label: 'Tipografia' },
  { id: 'cores', label: 'Cores' },
  { id: 'grafismos', label: 'Grafismos' },
];

export const loader = {
  messages: ['Alinhando as diagonais', 'Calibrando o coral', 'Montando o cartão'],
  done: 'Pronto. Sempre em frente.',
};

export const hero = {
  eyebrow: ['Banco digital', 'Identidade visual · 2026'],
  conceptLabel: 'Conceito',
  conceptLine: 'Nada fica parado',
  scrollCue: 'Role para avançar',
  concept: {
    title: ['Na VANTE,', 'tudo aponta', 'para frente.'],
    text: 'Quem está começando a vida financeira não tem um dinheiro estático: ele entra, sai, muda de plano. A marca acompanha esse ritmo com diagonais, contraste alto e uma única cor de sinal — longe da rigidez dos bancos de sempre.',
  },
  symbol: {
    label: 'Símbolo',
    title: ['O V é', 'o símbolo.'],
    text: 'A inicial já carrega a direção da marca. Duas hastes diagonais que se encontram num ponto — construídas em grade, sem curvas, sem enfeite.',
  },
  card: { number: '5214 0087 3391 2026', holder: 'MARINA ALVES', expiry: '08/31' },
};

export const applications = {
  label: 'Aplicações',
  intro: ['A mesma direção', 'em todos os', 'pontos de contato.'],
  items: [
    { id: 'assinatura', title: 'Assinatura', kind: 'signature' },
    { id: 'cartao', title: 'Cartão em uso', kind: 'card' },
    { id: 'icone', title: 'Ícone do app', kind: 'icon' },
    { id: 'campanha', title: 'Campanha', kind: 'campaign', headline: ['Seu dinheiro', 'não para.', 'Nem você.'] },
    { id: 'interface', title: 'Interface', kind: 'interface' },
    { id: 'ambiente', title: 'Ambiente', kind: 'signage', headline: 'Agência sem fila' },
  ],
};

export const app = {
  label: 'App',
  title: ['No bolso,', 'a mesma', 'direção.'],
  steps: [
    { id: 'login', title: 'Login', text: 'Fundo petróleo e o wordmark em coral: a marca abre o app.' },
    { id: 'dashboard', title: 'Dashboard', text: 'Saldo em destaque, gastos em barras diagonais e só o essencial na tela.' },
    { id: 'icone', title: 'Ícone', text: 'O V sozinho resolve o ícone — reconhecível em qualquer tela inicial.' },
  ],
};

export const name = {
  label: 'Nome',
  aside: 'Naming',
  title: ['Cinco letras.', 'Uma direção.'],
  text: 'VANTE vem de "avante": seguir para frente, sem pedir licença. Curto, fácil de falar e sem acento — funciona em qualquer tela.',
  guides: ['V · diagonal', 'A · avanço', 'N · ritmo', 'T · eixo', 'E · base'],
  facts: [
    { value: 5, label: 'letras', text: 'Cabe num ícone, num cartão e numa notificação.' },
    { value: 2, label: 'sílabas', text: 'Fala-se de um jeito só, em qualquer sotaque.' },
    { value: 1, label: 'direção', text: 'Todas as diagonais apontam para a direita.' },
    { value: 0, label: 'curvas', text: 'Construído apenas com retas em grade.' },
  ],
};

export const stacked = {
  label: 'Versão empilhada',
  title: 'O nome vira bloco.',
  text: 'VAN em cima, TE embaixo. A versão empilhada ocupa espaços quadrados — avatar, adesivo, fachada — sem perder a leitura.',
  versions: {
    label: 'Versões',
    title: ['Três formas.', 'Três fundos.'],
    text: 'Horizontal com assinatura, símbolo e empilhada. Cada uma aplicada sobre petróleo, areia e coral.',
    hint: 'Passe o mouse para pausar · arraste para rolar',
    hintTouch: 'As versões passam sozinhas enquanto você rola',
    items: [
      { id: 'horizontal', title: 'Horizontal + assinatura' },
      { id: 'simbolo', title: 'Símbolo' },
      { id: 'empilhada', title: 'Empilhada' },
    ],
  },
};

export const typography = {
  label: 'Tipografia',
  aside: 'Archivo Expanded · Manrope',
  fonts: [
    {
      id: 'display',
      name: 'Archivo Expanded',
      role: 'Títulos',
      family: 'var(--font-display)',
      stretch: '125%',
      text: 'Larga, pesada e em caixa alta quando precisa. A largura transmite estabilidade; o peso dá a energia. Usada em títulos, números de destaque e no app.',
    },
    {
      id: 'text',
      name: 'Manrope',
      role: 'Texto',
      family: 'var(--font-text)',
      stretch: '100%',
      text: 'Geométrica e aberta, lê bem em tamanhos pequenos. Assume textos corridos, legendas, rótulos e toda a interface.',
    },
  ],
  glyphs: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&?!R$%→',
  tester: 'Sempre em frente.',
  scale: [
    { role: 'Display', size: 'clamp(3rem, 7vw, 6.5rem)', sample: 'Sempre em frente.', meta: '104 / 0.95 · Archivo 800', font: 'display' },
    { role: 'Título', size: 'clamp(2rem, 4vw, 3.5rem)', sample: 'Seu dinheiro em movimento', meta: '56 / 1.05 · Archivo 700', font: 'display' },
    { role: 'Subtítulo', size: 'clamp(1.35rem, 2.2vw, 2rem)', sample: 'Pix, cartão e investimentos num lugar só', meta: '32 / 1.2 · Manrope 600', font: 'text' },
    { role: 'Corpo', size: '1.125rem', sample: 'Abra sua conta em minutos, sem tarifa de manutenção e sem fila.', meta: '18 / 1.55 · Manrope 400', font: 'text' },
    { role: 'Legenda', size: '0.75rem', sample: 'CONTA DIGITAL · CNPJ FICTÍCIO', meta: '12 / 1.4 · Manrope 600 · +12% tracking', font: 'text', caps: true },
  ],
};

/** Cores — hex é a fonte da verdade; RGB, CMYK e contraste são calculados. */
export const colors = {
  label: 'Cores',
  aside: 'Clique para copiar',
  title: ['Uma cor de sinal.', 'Um fundo que', 'deixa ela brilhar.'],
  text: 'O coral salta na tela do celular, entre tantos azuis e roxos de banco. O petróleo segura o contraste; a areia dá respiro.',
  palette: [
    { id: 'accent', name: 'Coral', hex: '#FF6F59', use: 'Energia da marca: destaques, ícone e CTAs.' },
    { id: 'base', name: 'Petróleo', hex: '#0B2230', use: 'Base e contraste. Não é preto puro: tem azul no fundo.' },
    { id: 'light', name: 'Areia', hex: '#F3EEE8', use: 'Respiro para textos longos e telas claras.' },
    { id: 'grad', name: 'Degradê coral', hex: '#FF6F59', hex2: '#F3EEE8', use: 'Transições e fundos de campanha.' },
  ],
  gradient: { eyebrow: 'Degradê', lines: ['Do escuro para a luz.', 'Do sinal ao movimento.'] },
  proportion: [
    { id: 'base', label: 'Petróleo', value: 50 },
    { id: 'light', label: 'Areia', value: 30 },
    { id: 'accent', label: 'Coral', value: 14 },
    { id: 'grad', label: 'Degradê', value: 6 },
  ],
  note: '* CMYK é uma conversão aproximada a partir do RGB; confirme com a gráfica antes de imprimir.',
};

export const pattern = {
  label: 'Grafismos',
  aside: 'Pattern interativo',
  title: ['A marca funciona', 'mesmo sem o nome.'],
  text: 'Fragmentos das diagonais do V viram pattern. Mova o cursor: cada traço aponta para onde você vai.',
  uses: [
    { id: 'variacao', title: 'Pattern · variação', kind: 'pattern-a' },
    { id: 'cartao', title: 'Pattern · cartão', kind: 'pattern-card' },
    { id: 'sacola', title: 'Aplicação · embalagem', kind: 'pattern-bag' },
  ],
};

export const closing = {
  label: 'Em uma frase',
  phrase: 'VANTE usa diagonais, contraste e uma cor de sinal para ser o banco de quem não fica parado: leve na energia e firme na forma.',
  /** palavras (sem pontuação) que ficam na cor de destaque */
  highlight: ['diagonais,', 'sinal', 'parado:'],
  primary: 'Baixar materiais',
  secondary: 'Voltar ao início',
  kit: 'Logo, símbolo, versões, paleta e pattern · .svg (gerado no navegador)',
  footer: ['VANTE · Banco digital', 'Estudo de identidade visual · 2026', 'Sempre em frente.'],
};
