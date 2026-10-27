import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FONTE_MONO, FONTE_TITULO, tema } from './tema';

// Fundo: foto/arte (opcional, sem texto) escurecida + grade discreta + vinheta. Sem elementos flutuando.
export const Fundo: React.FC<{ imagem?: string }> = ({ imagem }) => (
  <AbsoluteFill style={{ background: tema.fundo }}>
    {imagem && <Img src={staticFile(imagem)} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />}
    {imagem && <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.55), rgba(5,5,5,0.88))' }} />}
    <AbsoluteFill
      style={{
        opacity: 0.07,
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 15%, transparent 75%)',
      }}
    />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.65))' }} />
  </AbsoluteFill>
);

// Rodapé: perfil e indicador n/N; seta de arrastar exceto no último.
export const Rodape: React.FC<{ n: number; total: number }> = ({ n, total }) => (
  <div style={{ position: 'absolute', left: tema.margem, right: tema.margem, bottom: 56, display: 'flex', justifyContent: 'space-between', fontFamily: FONTE_MONO, fontSize: 28, color: tema.mudo }}>
    <span>{tema.perfil}</span>
    <span>
      {n}/{total}
      {n < total ? '  →' : ''}
    </span>
  </div>
);

export const Barra: React.FC = () => <div style={{ width: 96, height: 8, borderRadius: 4, background: tema.azul, marginBottom: 36 }} />;

export const Conteudo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ padding: `${tema.margem}px ${tema.margem}px 150px`, justifyContent: 'center', fontFamily: FONTE_TITULO, color: tema.texto }}>{children}</AbsoluteFill>
);

export const titulo = (px: number): React.CSSProperties => ({
  fontFamily: FONTE_TITULO,
  fontWeight: 800,
  fontSize: px,
  lineHeight: 1.04,
  letterSpacing: -px * 0.03,
  margin: 0,
});

export const corpo: React.CSSProperties = { fontFamily: FONTE_TITULO, fontWeight: 600, fontSize: 46, lineHeight: 1.3, color: tema.texto, margin: 0 };
