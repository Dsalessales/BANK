# Análise da referência e plano de implementação

Referência estudada: `studionextlevel.com.br/kyvo/`, uma apresentação de identidade visual de um banco digital em formato *one-page*, com narrativa guiada pela rolagem.

Este projeto é uma **implementação original** da mesma *experiência*: arquitetura de seções, padrões de movimento e interações. **Não reaproveita** código, textos, imagens, fotos nem fontes da referência:

- A marca (VELTA), os textos e os dados são fictícios e foram escritos para este estudo.
- Os mockups (cartão, celular, telas do app, sacola, fachada) são feitos em HTML/CSS/SVG, sem fotos.
- As fontes são livres: Archivo Expanded no lugar da fonte de títulos da referência e Manrope no texto.
- Todo o JavaScript e o CSS foram escritos do zero.

---

## 1. Estrutura e navegação

A referência é uma página única, sem rotas. A "navegação entre páginas" acontece por âncoras com rolagem suave. Algumas seções ficam fixas na tela (*pin*) enquanto a rolagem avança uma animação.

| # | Seção | Tipo | Tema do header |
|---|-------|------|----------------|
| — | Loader | Overlay em tela cheia | — |
| 00 | Início / hero | **Fixa** (*pin*), ~380% de rolagem | escuro → claro |
| 01 | Símbolo | Continuação da mesma *pin* (âncora por progresso) | claro |
| 02 | Aplicações | **Fixa**, trilho horizontal | escuro |
| 03 | App | **Fixa**, ~280%, celular trocando telas | lima |
| 04 | Nome | Rolagem normal, wordmark que se desenha | claro |
| 04.1 | Versão empilhada | **Fixa**, ~180%, letras migram para 2 linhas | lima |
| 04.2 | Versões | Rolagem normal + carrossel vertical infinito | lima → claro |
| 05 | Tipografia | Rolagem normal, ferramentas interativas | escuro |
| 06 | Cores | Rolagem normal, faixas que expandem e copiam | claro |
| 07 | Grafismos | Canvas interativo em tela cheia + aplicações | escuro |
| 08 | Fechamento | Frase revelada palavra a palavra, wordmark gigante | escuro |

Navegação:

- **Desktop:** header em pílula fixa, com links para 01–07, um indicador de hover que desliza, um ponto na seção ativa e o botão "Baixar materiais".
- **Mobile (≤ 860px):** pílula com logo, botão de download e hambúrguer, que abre um menu em tela cheia (verde-sinal, revelado em círculo a partir do botão).
- Barra de progresso de leitura no topo.
- Seções "cortina": as seções seguintes sobem sobre as anteriores, com cantos arredondados.

## 2. Componentes

| Componente | Onde está aqui |
|---|---|
| Loader (símbolo desenhado, barra, mensagens, saída em *clip*) | `render/sections.js` → `loaderHTML`, `motion/ui.js` → `runLoader` |
| Header em pílula + menu mobile | `headerHTML`, `initHeader`, `initMenu` |
| Cursor personalizado (ponto + anel, modos link/rótulo/texto, inversão sobre lima) | `initCursor` |
| Botões magnéticos + texto que "rola" no hover | `initMagnetic`, `rollText` |
| Cabeçalho de seção (número · rótulo ─── detalhe) | `secHead` |
| Títulos com linhas que sobem | `splitTitle` + `motion/reveal.js` |
| Cartão de crédito 3D (frente/verso, brilho seguindo o mouse) | `render/components.js` → `card` |
| Celular + 3 telas do app (login, dashboard, tela inicial) | `phone`, `screen*` |
| Trilho horizontal com contador e progresso | `applicationsHTML`, `initGallery` |
| Carrossel vertical infinito (pausa no hover, arrastar) | `stackHTML`, `initVersionsLoop` |
| Visualizador de fonte, grade de glifos, testador editável | `typeHTML`, `initType` |
| Faixas de cor (expandir, copiar, toast) | `colorsHTML`, `initColors` |
| Campo de pattern em canvas | `patternHTML`, `initPattern` |
| Toast global | `toast()` |
| Grão animado (overlay) | `.grain` em `base.css` |

## 3. Animações e interações mapeadas

**Rolagem (GSAP ScrollTrigger + Lenis)**

- *Scrub* com atraso suave (0,6–0,9 s) em todas as timelines fixas.
- Intro: o wordmark cresce, desfoca e sai; a névoa sobe com *clip-path*; a diagonal verde entra; o cartão vai para o lado e gira 180° (verso) e depois volta; o conceito entra linha a linha; o cartão some; a grade se desenha (*stroke-dashoffset*); o V se desenha e preenche; o texto do símbolo entra.
- Aplicações: trilho horizontal, *parallax* interno em cada imagem (`containerAnimation`), revelação por *clip-path*, contador `01 / 06` e barra de progresso.
- App: o celular entra inclinado e endireita. As telas trocam (deslizar, depois zoom). O saldo conta até o valor, as barras do gráfico crescem com *back-ease*, o ícone do app pulsa e o badge aparece. Os passos à esquerda acompanham com barras de progresso.
- Nome: guias diagonais crescem, cada letra é contornada e depois preenchida, e os rótulos entram.
- Empilhada: cada letra migra da posição horizontal para a empilhada, junto com o `viewBox`.
- Cores: o degradê preenche da esquerda para a direita com *scrub*, e a barra de proporção entra com contagem.
- Fechamento: cada palavra acende conforme a rolagem; o wordmark gigante sobe com *parallax* por letra; o brilho cresce.
- Revelações genéricas: `[data-fade]`, `[data-split]`, `[data-count]`, linhas `.sec-head__rule`.

**Mouse / toque**

- Tilt 3D do cartão e do celular; brilho do cartão segue o cursor.
- Cursor com rótulos contextuais (`data-cursor="Copiar"`, `"Arraste"`, `"Escreva"`…).
- Indicador do menu que desliza entre links.
- Botões magnéticos (elástico).
- "Aa" muda de peso conforme a posição horizontal do cursor; glifos aparecem no visualizador no hover.
- Pattern: cada traço gira para apontar o cursor e acende em lima; sem mouse, um ponto passeia sozinho.
- Carrossel de versões: pausa no hover, arrastar rola, e a lista destaca a versão correspondente.
- Faixas de cor expandem no hover/foco e copiam no clique.

**Contínuas:** feixes de luz no hero, flutuação do cartão e do celular, grão animado, indicador "role para avançar".

**Responsivo:** breakpoints em 1080, 860, 640 e 480px. As timelines usam `gsap.matchMedia` com posições diferentes no mobile, e as faixas de cor viram lista vertical.

**Acessibilidade:** link "pular para o conteúdo", `aria-label` nos títulos divididos, foco visível, menu fecha com Esc, `prefers-reduced-motion` desliga pins, *scrub* e Lenis (mostra os estados finais).

## 4. Frontend × backend

Na referência praticamente tudo é frontend estático. Os pontos que, num produto real, dependeriam de servidor:

| Funcionalidade | Na referência | Neste projeto (mock) |
|---|---|---|
| "Baixar materiais" | Link para arquivo hospedado | `mockDownloadKit()` gera um SVG (logo, símbolo, paleta) **no navegador**, com progresso simulado |
| Login do app | Imagem estática | Botão funcional com carregamento simulado (`mockLogin()`), sem credenciais |
| Saldo / transações / gastos | Imagem estática | Dados em `src/data/mock.js`, renderizados nas telas |
| Mostrar/ocultar saldo | — | Interação local (desfoque) |
| Copiar cor | Clipboard API | Igual, com toast e *fallback* |

Não há banco de dados, API, autenticação, CMS nem servidor. O build é estático e roda em qualquer hospedagem.

## 5. Decisões de implementação

- **Vite + JavaScript puro:** a referência usa Astro, mas o resultado final é o mesmo HTML/CSS/JS estático. Aqui o HTML é montado a partir de `content.js`, então trocar o conteúdo não exige mexer no layout.
- **GSAP + ScrollTrigger + Lenis:** as mesmas categorias de ferramenta identificadas na referência, por serem o padrão de mercado para esse tipo de experiência.
- **Marca geométrica em código:** as letras são *paths* de retas numa grade de 100, o que permite desenhar o traço, preencher e reorganizar as letras (empilhada) com a mesma fonte de verdade.
