import { AbsoluteFill, Img, useCurrentFrame, staticFile } from 'remotion';
import { tema } from './tema';
import type { PropsCarrossel } from './tipos';

// Um slide por frame (--sequence): 1080x1350, sem texto dentro das imagens geradas.
export const Carrossel = ({ slides }: PropsCarrossel) => {
  const s = slides[Math.min(useCurrentFrame(), slides.length - 1)];
  return (
    <AbsoluteFill style={{ background: tema.fundo, color: tema.texto, fontFamily: tema.fonte, padding: tema.margem }}>
      {s.imagem && <Img src={staticFile(s.imagem)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />}
      <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <h1 style={{ fontSize: 84, lineHeight: 1.05, color: tema.destaque, margin: 0 }}>{s.titulo}</h1>
        {s.texto && <p style={{ fontSize: 44, lineHeight: 1.3 }}>{s.texto}</p>}
      </div>
    </AbsoluteFill>
  );
};
