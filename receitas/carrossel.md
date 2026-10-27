# Receita: carrossel
1. Especialista grava `props/<cartao>.json` com `{ "slides": [...] }` (máx. 10) e imagens em `public/<cartao>/`.
2. `npx remotion render src/index.ts Carrossel --sequence --image-format=png --output=saida/<cartao> --props=props/<cartao>.json`
3. Conferir a contagem de PNGs = número de slides; imagens da IA nunca levam texto (texto só no template).
