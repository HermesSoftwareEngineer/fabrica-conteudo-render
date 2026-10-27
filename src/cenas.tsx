import React from 'react';
import { Easing, interpolate, spring } from 'remotion';
import { Marcado } from './kit';
import { MOLA, clamp01, formatarNumero, usePresenca } from './movimento';
import { FONTE_MONO, FONTE_TITULO, tema } from './tema';
import type { CenaReels } from './tipos';

type De<T extends CenaReels['tipo']> = Extract<CenaReels, { tipo: T }>;

// ---- Constantes de ajuste ----
const STAGGER = 8; // quadros entre cartões/linhas
const CPS_PADRAO = 28; // caracteres por segundo no código digitado
const CODIGO_ATRASO = 12; // quadros antes de começar a digitar
const CONTADOR_ATRASO = 8;
const CONTADOR_QUADROS = 42; // duração da subida
const CURSOR_PISCA = 15; // quadros por fase do cursor depois de parar de digitar

const caixa: React.CSSProperties = { background: tema.s1, border: `2px solid ${tema.linha}`, borderRadius: 32 };

// ---- Título ----
export const CenaTitulo: React.FC<{ c: De<'titulo'> }> = ({ c }) => {
  const linhas = c.texto.split('\n');
  const tam = c.tamanho ?? 132;
  return (
    <div style={{ textAlign: 'center' }}>
      {linhas.map((l, i) => (
        <Linha key={i} atraso={i * 6}>
          <div style={{ fontFamily: FONTE_TITULO, fontWeight: 800, fontSize: tam, lineHeight: 1.08, letterSpacing: -tam * 0.03 }}>
            <Marcado texto={l} raio={tam * 0.18} />
          </div>
        </Linha>
      ))}
      {c.subtitulo && (
        <Linha atraso={linhas.length * 6 + 6}>
          <div style={{ fontFamily: FONTE_MONO, fontWeight: 500, fontSize: 40, color: tema.mudo, marginTop: 40 }}>{c.subtitulo}</div>
        </Linha>
      )}
    </div>
  );
};

const Linha: React.FC<{ atraso: number; children: React.ReactNode }> = ({ atraso, children }) => {
  const { estilo } = usePresenca(atraso, atraso / 2);
  return <div style={estilo}>{children}</div>;
};

// ---- Cartões (entram um a um, saem em cascata) ----
export const CenaCartoes: React.FC<{ c: De<'cartoes'> }> = ({ c }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
    {c.itens.map((it, i) => (
      <Cartao key={i} atraso={6 + i * STAGGER} saida={i * 2} icone={it.icone ?? String(i + 1)} titulo={it.titulo} texto={it.texto} numerico={!it.icone} />
    ))}
  </div>
);

const Cartao: React.FC<{ atraso: number; saida: number; icone: string; titulo: string; texto?: string; numerico: boolean }> = ({ atraso, saida, icone, titulo, texto, numerico }) => {
  const { estilo } = usePresenca(atraso, saida);
  return (
    <div style={{ ...estilo, ...caixa, display: 'flex', alignItems: 'center', gap: 32, padding: '32px 36px' }}>
      <div
        style={{
          width: 104,
          height: 104,
          flex: 'none',
          borderRadius: 26,
          background: tema.s2,
          border: `2px solid ${tema.linha}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: numerico ? FONTE_MONO : FONTE_TITULO,
          fontWeight: 700,
          fontSize: numerico ? 56 : 58,
          color: numerico ? tema.azul : tema.texto,
        }}
      >
        {icone}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONTE_TITULO, fontWeight: 800, fontSize: 52, lineHeight: 1.1 }}>
          <Marcado texto={titulo} raio={12} />
        </div>
        {texto && <div style={{ fontFamily: FONTE_TITULO, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: tema.mudo, marginTop: 10 }}>{texto}</div>}
      </div>
    </div>
  );
};

// ---- Código digitado com cursor ----
export const CenaCodigo: React.FC<{ c: De<'codigo'> }> = ({ c }) => {
  const { estilo, frame, fps } = usePresenca(0);
  const cps = c.caracteresPorSeg ?? CPS_PADRAO;
  const linhas = c.codigo.split('\n');
  const total = c.codigo.length;
  const digitados = Math.min(total, Math.max(0, Math.floor(((frame - CODIGO_ATRASO) / fps) * cps)));
  const fimDigitacao = CODIGO_ATRASO + (total / cps) * fps;
  const terminou = digitados >= total;
  const maior = Math.max(...linhas.map((l) => l.length), 1);
  const fonte = Math.max(26, Math.min(44, Math.floor(820 / (maior * 0.6))));
  const cursorLigado = !terminou || Math.floor((frame - fimDigitacao) / CURSOR_PISCA) % 2 === 0;
  const dest = spring({ frame: frame - fimDigitacao - 4, fps, config: MOLA });

  let restante = digitados;
  return (
    <div style={{ ...estilo, ...caixa, overflow: 'hidden', background: '#0B0B0B' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 30px', borderBottom: `2px solid ${tema.linha}`, background: tema.s1 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 20, height: 20, borderRadius: 10, background: tema.linha }} />
        ))}
        <div style={{ fontFamily: FONTE_MONO, fontWeight: 500, fontSize: 28, color: tema.mudo, marginLeft: 12 }}>{c.arquivo ?? 'terminal'}</div>
      </div>
      <div style={{ padding: '30px 0', fontFamily: FONTE_MONO, fontWeight: 500, fontSize: fonte, lineHeight: 1.6 }}>
        {linhas.map((l, i) => {
          const n = Math.min(l.length, Math.max(0, restante));
          const naLinhaAtual = restante >= 0 && restante <= l.length && !terminou && n === restante;
          const mostrarCursor = naLinhaAtual || (terminou && i === linhas.length - 1);
          restante -= l.length + 1;
          const destacada = c.destacar?.includes(i + 1);
          const comentario = /^\s*(#|\/\/)/.test(l);
          return (
            <div
              key={i}
              style={{
                padding: '0 30px',
                minHeight: fonte * 1.6,
                whiteSpace: 'pre',
                color: comentario ? tema.mudo : tema.texto,
                background: destacada ? `rgba(79,107,255,${0.2 * clamp01(dest)})` : 'transparent',
                borderLeft: `6px solid ${destacada ? `rgba(79,107,255,${clamp01(dest)})` : 'transparent'}`,
              }}
            >
              {l.slice(0, n)}
              {mostrarCursor && cursorLigado && <span style={{ display: 'inline-block', width: fonte * 0.55, height: fonte * 1.1, marginLeft: 2, verticalAlign: 'text-bottom', background: tema.azul }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---- Contador que sobe ----
export const CenaContador: React.FC<{ c: De<'contador'> }> = ({ c }) => {
  const { estilo, frame } = usePresenca(0);
  const de = c.de ?? 0;
  const p = interpolate(frame, [CONTADOR_ATRASO, CONTADOR_ATRASO + CONTADOR_QUADROS], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const valor = de + (c.ate - de) * p;
  const fim = p >= 1;
  return (
    <div style={{ ...estilo, textAlign: 'center' }}>
      <div
        style={{
          fontFamily: FONTE_TITULO,
          fontWeight: 800,
          fontSize: 300,
          lineHeight: 1,
          letterSpacing: -9,
          fontVariantNumeric: 'tabular-nums',
          color: fim ? tema.texto : tema.mudo,
        }}
      >
        {c.prefixo}
        {formatarNumero(valor, c.decimais ?? 0)}
        {c.sufixo}
      </div>
      <div style={{ margin: '56px auto 0', width: 640, height: 12, borderRadius: 6, background: tema.s2 }}>
        <div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 6, background: tema.azul }} />
      </div>
      <div style={{ fontFamily: FONTE_TITULO, fontWeight: 700, fontSize: 52, lineHeight: 1.25, color: tema.texto, marginTop: 48 }}>
        <Marcado texto={c.rotulo} raio={12} />
      </div>
    </div>
  );
};

// ---- Lista com revelação item a item (opcional "???") ----
export const CenaLista: React.FC<{ c: De<'lista'> }> = ({ c }) => {
  const n = c.itens.length;
  const dur = Math.round((c.fimSeg - c.inicioSeg) * 30);
  const passo = Math.max(10, Math.floor((dur * 0.65 - 8) / Math.max(1, n)));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {c.itens.map((t, i) => (
        <LinhaLista key={i} indice={i} texto={t} misterio={!!c.misterio} revela={8 + i * passo} saida={i * 2} />
      ))}
    </div>
  );
};

const LinhaLista: React.FC<{ indice: number; texto: string; misterio: boolean; revela: number; saida: number }> = ({ indice, texto, misterio, revela, saida }) => {
  const { estilo, frame, fps } = usePresenca(misterio ? indice * 4 : revela, saida);
  const r = clamp01(spring({ frame: frame - revela, fps, config: MOLA }));
  const mostrar = misterio ? r : 1;
  return (
    <div style={{ ...estilo, ...caixa, display: 'flex', alignItems: 'center', gap: 32, padding: '30px 36px', borderColor: misterio && r > 0.5 ? tema.azul : tema.linha }}>
      <div style={{ fontFamily: FONTE_MONO, fontWeight: 700, fontSize: 56, color: tema.azul, width: 70 }}>{indice + 1}</div>
      <div style={{ position: 'relative', flex: 1, minHeight: 66 }}>
        {misterio && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', fontFamily: FONTE_MONO, fontWeight: 700, fontSize: 52, color: tema.linha, opacity: 1 - r }}>???</div>}
        <div style={{ opacity: mostrar, transform: `translateY(${(1 - mostrar) * 14}px)`, fontFamily: FONTE_TITULO, fontWeight: 700, fontSize: 52, lineHeight: 1.2 }}>
          <Marcado texto={texto} raio={12} />
        </div>
      </div>
    </div>
  );
};

// ---- Fechamento ----
export const CenaFechamento: React.FC<{ c: De<'fechamento'> }> = ({ c }) => (
  <div style={{ textAlign: 'center' }}>
    <Linha atraso={0}>
      <div style={{ fontFamily: FONTE_TITULO, fontWeight: 800, fontSize: 112, lineHeight: 1.08, letterSpacing: -3 }}>
        <Marcado texto={c.texto} raio={20} />
      </div>
    </Linha>
    <Linha atraso={8}>
      <div style={{ width: 96, height: 8, borderRadius: 4, background: tema.azul, margin: '48px auto' }} />
    </Linha>
    <Linha atraso={12}>
      <div style={{ fontFamily: FONTE_MONO, fontWeight: 700, fontSize: 48, color: tema.texto }}>{c.chamada ?? tema.perfil}</div>
    </Linha>
  </div>
);

export const CorpoCena: React.FC<{ c: CenaReels }> = ({ c }) => {
  switch (c.tipo) {
    case 'titulo':
      return <CenaTitulo c={c} />;
    case 'cartoes':
      return <CenaCartoes c={c} />;
    case 'codigo':
      return <CenaCodigo c={c} />;
    case 'contador':
      return <CenaContador c={c} />;
    case 'lista':
      return <CenaLista c={c} />;
    case 'fechamento':
      return <CenaFechamento c={c} />;
  }
};
