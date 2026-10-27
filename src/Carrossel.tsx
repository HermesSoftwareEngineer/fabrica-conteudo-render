import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Barra, Conteudo, Fundo, Rodape, corpo, titulo } from './base';
import { FONTE_MONO, FONTE_TITULO, tema } from './tema';
import type { PropsCarrossel, Slide } from './tipos';

const Corpo: React.FC<{ s: Slide }> = ({ s }) => {
  switch (s.tipo) {
    case 'capa':
      return (
        <Conteudo>
          <Barra />
          <h1 style={titulo(128)}>{s.titulo}</h1>
          {s.destaque && (
            <div style={{ ...titulo(128), background: tema.azul, borderRadius: 28, padding: '6px 34px 18px', alignSelf: 'flex-start', marginTop: 18 }}>{s.destaque}</div>
          )}
          {s.subtitulo && <p style={{ ...corpo, color: tema.ceu, marginTop: 44 }}>{s.subtitulo}</p>}
        </Conteudo>
      );
    case 'passo':
      return (
        <Conteudo>
          {s.numero !== undefined && (
            <div style={{ fontFamily: FONTE_MONO, fontWeight: 700, fontSize: 40, color: tema.azul, marginBottom: 28 }}>PASSO {String(s.numero).padStart(2, '0')}</div>
          )}
          <h2 style={titulo(88)}>{s.titulo}</h2>
          <p style={{ ...corpo, marginTop: 40, color: '#D6D6D6' }}>{s.texto}</p>
        </Conteudo>
      );
    case 'codigo':
      return (
        <Conteudo>
          <h2 style={{ ...titulo(72), marginBottom: 36 }}>{s.titulo}</h2>
          <pre style={{ margin: 0, background: tema.s1, border: `2px solid ${tema.linha}`, borderRadius: 24, padding: 40, fontFamily: FONTE_MONO, fontWeight: 500, fontSize: 36, lineHeight: 1.45, color: tema.ceu, whiteSpace: 'pre-wrap', fontVariantLigatures: 'none' }}>
            {s.codigo}
          </pre>
          {s.legenda && <p style={{ ...corpo, fontSize: 38, color: tema.mudo, marginTop: 32 }}>{s.legenda}</p>}
        </Conteudo>
      );
    case 'comparacao':
      return (
        <Conteudo>
          <h2 style={{ ...titulo(72), marginBottom: 44 }}>{s.titulo}</h2>
          {[
            { l: s.esquerda, cor: tema.vermelho },
            { l: s.direita, cor: tema.verde },
          ].map(({ l, cor }) => (
            <div key={l.rotulo} style={{ background: tema.s1, border: `2px solid ${tema.linha}`, borderLeft: `10px solid ${cor}`, borderRadius: 20, padding: '28px 36px', marginBottom: 28 }}>
              <div style={{ fontFamily: FONTE_MONO, fontWeight: 700, fontSize: 32, color: cor }}>{l.rotulo}</div>
              <div style={{ ...corpo, fontSize: 42, marginTop: 10 }}>{l.texto}</div>
            </div>
          ))}
        </Conteudo>
      );
    case 'lista':
      return (
        <Conteudo>
          <h2 style={{ ...titulo(76), marginBottom: 44 }}>{s.titulo}</h2>
          {s.itens.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 28, alignItems: 'baseline', marginBottom: 26 }}>
              <span style={{ fontFamily: FONTE_MONO, fontWeight: 700, fontSize: 40, color: tema.azul }}>{i + 1}</span>
              <span style={{ ...corpo, fontSize: 44 }}>{it}</span>
            </div>
          ))}
        </Conteudo>
      );
    case 'destaque':
      return (
        <Conteudo>
          <div style={{ ...titulo(300), color: tema.ceu, letterSpacing: -10 }}>{s.valor}</div>
          <p style={{ ...corpo, fontSize: 54, marginTop: 24 }}>{s.texto}</p>
        </Conteudo>
      );
    case 'licao':
      return (
        <Conteudo>
          <Barra />
          <h2 style={titulo(92)}>{s.titulo}</h2>
          <p style={{ ...corpo, marginTop: 36, color: '#D6D6D6' }}>{s.texto}</p>
          <div style={{ marginTop: 56, fontFamily: FONTE_TITULO, fontWeight: 800, fontSize: 44, background: tema.azul, borderRadius: 22, padding: '18px 34px', alignSelf: 'flex-start' }}>{s.chamada}</div>
        </Conteudo>
      );
  }
};

// Um slide por quadro (--sequence): 1080x1350 (4:5).
export const Carrossel: React.FC<PropsCarrossel> = ({ slides }) => {
  const i = Math.min(useCurrentFrame(), slides.length - 1);
  const s = slides[i];
  return (
    <>
      <Fundo imagem={s.imagem} />
      <Corpo s={s} />
      <Rodape n={i + 1} total={slides.length} />
    </>
  );
};
