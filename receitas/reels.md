# Receita: Reels
1. Especialista grava `props/<cartao>.json` com `{ "cenas": [...], "audio": "<cartao>/voz.mp3" }`; tempos vêm do TTS ou da transcrição.
2. `npx remotion render src/index.ts Reels --codec=h264 --output=saida/<cartao>.mp4 --props=props/<cartao>.json`
3. Conferir duração (≤ 90 s), resolução 1080x1920 e áudio presente. Resultado volta à VPS por scp; nunca vai ao Git.
