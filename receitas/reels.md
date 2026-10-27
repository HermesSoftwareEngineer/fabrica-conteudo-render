# Receita: Reels (1080x1920, 30 fps)
Template reutilizável, dirigido por JSON, no padrão de edição do @hermess.dev (paleta neutra, fundo vivo discreto, zona segura topo ~250px / base ~420px, nada flutuando).

1. Especialista grava `props/<cartao>.json` (modelo: `props/exemplo-reels.json`). Duração = maior `fimSeg`; cada cena usa `inicioSeg`/`fimSeg`.
2. Tipos de cena (`tipo`): `titulo` (texto, subtitulo?), `cartoes` (itens: {icone?, titulo, texto?}), `codigo` (codigo, arquivo?, destacar? linhas 1-based, caracteresPorSeg?), `contador` (ate, de?, prefixo?, sufixo?, decimais?, rotulo), `lista` (itens, misterio? "???" antes da revelação), `fechamento` (texto, chamada?).
3. Campos comuns: `etiqueta` (título curto no topo, troca por ideia), `fala` (só para a legenda), `imagem` (fundo opcional sem texto, em `public/`). `*palavra*` vira destaque em caixa azul.
4. Opcionais: `audio` ("<cartao>/voz.mp3", em `public/`); `legenda: true` liga a legenda palavra a palavra (usa `palavras: [{t, inicioSeg, destaque?}]` da transcrição, ou distribui a `fala` de cada cena). Padrão: sem legenda.
5. Render: `npx remotion render src/index.ts Reels --codec=h264 --output=saida/<cartao>.mp4 --props=props/<cartao>.json`
6. Capa (Still): `npx remotion still src/index.ts Capa saida/<cartao>-capa.png --props=props/<cartao>-capa.json` (`titulo` com \n e *destaque*, `destaque`, `subtitulo?`).
7. Conferir duração (≤ 90 s), resolução 1080x1920 e áudio (se houver). Resultado volta à VPS por scp; nunca vai ao Git. Constantes de movimento (molas, saída, legenda) ficam no topo de `src/movimento.ts`, `src/kit.tsx` e `src/cenas.tsx`.
