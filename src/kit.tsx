import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONTE_TITULO, SEGURA, tema } from './tema';
import { clamp01, usePresenca } from './movimento';
import type { CenaReels, Palavra } from './tipos';

// ---- Constantes de ajuste (Studio) ----
const GRADE_PX = 72;
const GRADE_VEL = 0.35; // px/quadro (deriva lenta da grade; só o fundo se mexe)
const FAIXA_PERIODO_SEG = 5; // faixa de luz neutra que desce devagar
const LEG_FONTE = 84;
const LEG_QUADROS_ENTRADA = 5;
const LEG_ESCALA_INICIAL = 0.92;
const LEG_DESLOC = 7; // px (máx. 6-8)
const LEG_ESCALA_DESTAQUE = 1.05;
const LEG_MAX_PALAVRAS = 3;
const LEG_QUADROS_SAIDA = 4;
const LEG_RESERVA = 230; // espaço extra embaixo da área útil quando há legenda

/** Fundo vivo discreto e monocromático: grade cinza em deriva lenta, faixa de luz neutra e vinheta. */
export const FundoVivo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const d = (frame * GRADE_VEL) % GRADE_PX;
  const periodo = FAIXA_PERIODO_SEG * fps;
  const y = ((frame % periodo) / periodo) * (height + 600) - 600;
  return (
    <AbsoluteFill style={{ background: tema.fundo }}>
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: `${GRADE_PX}px ${GRADE_PX}px`,
          backgroundPosition: `${d}px ${d}px`,
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 15%, transparent 75%)',
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: y, height: 600, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.035), transparent)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.7))' }} />
    </AbsoluteFill>
  );
};

/** Camada de imagem opcional por cena (escurecida), com fade de entrada/saída. */
export const ImagemCena: React.FC<{ src: string }> = ({ src }) => {
  const { opacidade } = usePresenca();
  return (
    <AbsoluteFill style={{ opacity: opacidade }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.6), rgba(5,5,5,0.9))' }} />
    </AbsoluteFill>
  );
};

/** Texto com *destaque* em caixa azul. */
export const Marcado: React.FC<{ texto: string; raio?: number }> = ({ texto, raio = 18 }) => {
  const partes = texto.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {partes.map((p, i) =>
        p.length > 2 && p.startsWith('*') && p.endsWith('*') ? (
          <span
            key={i}
            style={{ background: tema.azul, color: '#fff', borderRadius: raio, padding: '0 0.2em 0.05em', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}
          >
            {p.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
};

/** Etiqueta curta de título (caixa com fundo), troca a cada ideia. */
export const Etiqueta: React.FC<{ texto: string }> = ({ texto }) => {
  const { estilo } = usePresenca(0);
  return (
    <div
      style={{
        ...estilo,
        alignSelf: 'center',
        fontFamily: FONTE_TITULO,
        fontWeight: 800,
        fontSize: 54,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: tema.texto,
        background: tema.s2,
        border: `2px solid ${tema.linha}`,
        borderRadius: 24,
        padding: '16px 34px 20px',
        textAlign: 'center',
      }}
    >
      <Marcado texto={texto} raio={14} />
    </div>
  );
};

/** Área útil dentro da zona segura. Com legenda, reserva espaço extra embaixo. */
export const AreaSegura: React.FC<{ children: React.ReactNode; legenda?: boolean; etiqueta?: string }> = ({ children, legenda, etiqueta }) => (
  <div
    style={{
      position: 'absolute',
      top: SEGURA.topo,
      bottom: SEGURA.base + (legenda ? LEG_RESERVA : 0),
      left: tema.margem,
      right: tema.margem,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: FONTE_TITULO,
      color: tema.texto,
    }}
  >
    {etiqueta && <Etiqueta texto={etiqueta} />}
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: etiqueta ? 32 : 0 }}>{children}</div>
  </div>
);

// ---- Legenda palavra a palavra (opcional) ----

/** Usa `palavras` (transcrição) se houver; senão distribui a `fala` de cada cena pelo tempo da cena. */
export const montarPalavras = (cenas: CenaReels[], palavras?: Palavra[]): Palavra[] => {
  if (palavras && palavras.length) return palavras;
  const out: Palavra[] = [];
  for (const c of cenas) {
    if (!c.fala) continue;
    const ws = c.fala.trim().split(/\s+/);
    const ini = c.inicioSeg + 0.1;
    const fim = Math.max(ini + 0.3, c.fimSeg - 0.3);
    const pesos = ws.map((w) => w.replace(/\*/g, '').length + 2);
    const soma = pesos.reduce((a, b) => a + b, 0);
    let acc = 0;
    ws.forEach((w, i) => {
      out.push({ t: w.replace(/\*/g, ''), inicioSeg: ini + (acc / soma) * (fim - ini), destaque: w.includes('*') });
      acc += pesos[i];
    });
  }
  return out;
};

type Grupo = { ini: number; fim: number; palavras: Palavra[] };
const agrupar = (ps: Palavra[]): Grupo[] => {
  const gs: Grupo[] = [];
  let atual: Palavra[] = [];
  ps.forEach((p, i) => {
    atual.push(p);
    const prox = ps[i + 1];
    const quebra = atual.length >= LEG_MAX_PALAVRAS || /[.,!?:;]$/.test(p.t) || !prox || prox.inicioSeg - p.inicioSeg > 0.8;
    if (quebra) {
      const fimMax = atual[atual.length - 1].inicioSeg + 0.9;
      gs.push({ ini: atual[0].inicioSeg, fim: prox ? Math.min(fimMax, prox.inicioSeg) : fimMax, palavras: atual });
      atual = [];
    }
  });
  return gs;
};

export const Legenda: React.FC<{ palavras: Palavra[] }> = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grupos = React.useMemo(() => agrupar([...palavras].sort((a, b) => a.inicioSeg - b.inicioSeg)), [palavras]);
  const t = frame / fps;
  const g = grupos.find((x) => t >= x.ini && t < x.fim);
  if (!g) return null;
  const fimQ = g.fim * fps;
  const saida = interpolate(frame, [fimQ - LEG_QUADROS_SAIDA, fimQ], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: tema.margem,
        right: tema.margem,
        bottom: SEGURA.base + 40,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontFamily: FONTE_TITULO,
        fontWeight: 800,
        fontSize: LEG_FONTE,
        lineHeight: 1.1,
        opacity: saida,
      }}
    >
      {g.palavras.map((p, i) => {
        const e = Easing.out(Easing.cubic)(clamp01((frame - p.inicioSeg * fps) / LEG_QUADROS_ENTRADA));
        const alvo = p.destaque ? LEG_ESCALA_DESTAQUE : 1;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 0.14em',
              color: p.destaque ? tema.ceu : tema.texto,
              opacity: e,
              transform: `translateY(${(1 - e) * LEG_DESLOC}px) scale(${LEG_ESCALA_INICIAL + (alvo - LEG_ESCALA_INICIAL) * e})`,
              textShadow: '0 4px 18px rgba(0,0,0,0.9)',
            }}
          >
            {p.t}
          </span>
        );
      })}
    </div>
  );
};
