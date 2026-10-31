# Estudo · apresentação de marca com scroll animations

Frontend independente e navegável de uma apresentação de identidade visual para um **banco digital fictício (VANTE)**: loader, hero fixo com cartão 3D, trilho horizontal, celular trocando telas, wordmark que se desenha e se empilha, ferramentas de tipografia e cor, pattern interativo em canvas e fechamento com revelação palavra a palavra.

É uma implementação original inspirada na *experiência* de uma referência de mercado. A análise completa e o mapa de seções, animações e mocks estão em **[docs/ANALISE.md](docs/ANALISE.md)**.

## Rodar

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

O build sai em `dist/`. É estático, com caminhos relativos, e funciona em qualquer hospedagem ou subpasta. Para conferir o build localmente: `npm run preview`.

Stack: Vite · GSAP 3 + ScrollTrigger · Lenis · fontes livres via Fontsource (Archivo Expanded e Manrope). Não há backend.

## Onde mexer

| Quero trocar… | Arquivo |
|---|---|
| Textos, seções do menu, itens da galeria, passos do app, versões, escala tipográfica, paleta, frase final | `src/content.js` |
| Cores, fontes, espaçamentos, raios, curvas de animação | `src/styles/tokens.css` (cores também em `content.js`, que calcula RGB/CMYK/contraste) |
| Forma do logo / símbolo | `src/brand/wordmark.js` (letras são *paths* numa grade de altura 100) |
| Dados do app (nome, saldo, transações, gastos) e o "download" do kit | `src/data/mock.js` |
| Cartão, celular e telas do app | `src/render/components.js` + `src/styles/components.css` |
| HTML de cada seção | `src/render/sections.js` |
| Animações de cada seção | `src/motion/` (ver abaixo) |

### Trocar por imagens reais

Os mockups são HTML/CSS para o projeto não depender de arquivos externos. Para usar fotos:

1. Coloque os arquivos em `public/media/`.
2. Nos templates (`appTile()` em `sections.js`, ou `card()` / `phone()` em `components.js`), troque o conteúdo por `<img src="./media/arquivo.webp" alt="…">`.

Os wrappers `.tile__par` já fazem o *parallax*, então a imagem herda o movimento.

### Trocar a marca

1. Edite o nome e os textos em `content.js`.
2. Para outro logo, substitua os `d` dos `LETTERS` em `wordmark.js`. Mantenha os *paths* fechados para que o traço e o preenchimento funcionem. A versão empilhada é calculada sozinha: `STACK_SPLIT` (em `wordmark.js`) diz quantas letras ficam na linha de cima.
3. Se preferir um logo em arquivo SVG pronto, cole os paths dele nas letras ou troque `wordmarkSVG()` por um `<img>`. Nesse caso, as animações de desenhar e empilhar deixam de se aplicar.

## Estrutura

```
estudo-banco-digital/
├─ index.html              casca mínima (o conteúdo é montado em JS)
├─ public/favicon.svg
├─ docs/ANALISE.md         análise da referência, mapa de animações, frontend × backend
└─ src/
   ├─ main.js              ordem: render → loader → animações → entrada
   ├─ content.js           TODO o conteúdo editável
   ├─ data/mock.js         dados simulados + download gerado no navegador
   ├─ brand/wordmark.js    geometria da marca (horizontal, empilhada, símbolo)
   ├─ utils/color.js       hex → RGB/CMYK, contraste WCAG
   ├─ render/
   │  ├─ components.js     cartão, celular, telas do app, helpers
   │  └─ sections.js       template de cada seção
   ├─ motion/
   │  ├─ core.js           GSAP, ScrollTrigger, Lenis, scrollTo com pins
   │  ├─ ui.js             loader, header, menu, cursor, magnético, toast, download
   │  ├─ reveal.js         títulos em linhas, fades, contadores
   │  ├─ intro.js          00/01 hero → conceito → símbolo (pin)
   │  ├─ showcase.js       02 galeria horizontal · 03 app · 04 nome · 04.1 empilhada + loop
   │  └─ details.js        05 tipografia · 06 cores · 07 pattern (canvas) · 08 fechamento
   └─ styles/
      ├─ tokens.css        variáveis de design
      ├─ base.css          reset, tipografia, temas, botões, grão
      ├─ ui.css            loader, header, menu, cursor, toast
      ├─ components.css    cartão e celular
      └─ sections.css      seções + responsivo
```

## Convenções de animação

- **Ganchos `data-*`:** o HTML marca o que anima (`data-fade`, `data-split`, `data-count`, `data-cursor="Rótulo"`, `data-magnetic`, `data-scroll-to="#id"`, `data-download`). Para adicionar uma revelação a um elemento novo, basta o atributo.
- **Ordem dos pins:** os ScrollTriggers são criados na ordem visual da página, em `main.js`. Uma seção fixa nova precisa entrar na posição certa dessa lista.
- **Âncora dentro de seção fixa:** use `<span id="x" class="anchor" data-anchor-progress="0.8">`. O link vai para 80% do progresso daquele *pin*.
- **Tema do header:** cada seção declara `data-header-theme="dark|light|accent"`. Uma timeline pode mudar o tema ao vivo com `section.dataset.headerThemeLive`.
- **Movimento reduzido:** com `prefers-reduced-motion`, o Lenis, os *pins* e o *scrub* são desligados e os estados finais aparecem direto.

## Testado

Chromium em 1440×900 e 390×844 (toque). Os testes cobriram: rolagem completa sem erros no console, links do menu caindo exatamente nas seções (inclusive dentro dos *pins*), menu mobile abrindo e fechando, cópia de cor, download do kit, troca de fonte e testador de tipografia.
