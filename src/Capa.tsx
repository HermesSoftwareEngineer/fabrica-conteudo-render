import { AbsoluteFill, Img, staticFile } from 'remotion';
import { FundoVivo, Marcado } from './kit';
import { FONTE_MONO, FONTE_TITULO, tema } from './tema';
import type { PropsCapa } from './tipos';

// Capa 1080x1920 (Still): texto grande e centralizado, legível também no recorte 3:4 e 1:1 da grade do perfil.
// `titulo` aceita \n e *destaque*; `destaque` vira a última linha em caixa azul.
export const Capa = ({ titulo, destaque, subtitulo, imagem }: PropsCapa) => {
  const linhas = titulo.split('\n');
  const maior = Math.max(...linhas.map((l) => l.replace(/\*/g, '').length), (destaque ?? '').length, 1);
  const fonte = Math.max(110, Math.min(230, Math.floor(900 / (maior * 0.62))));
  const estiloLinha = { fontFamily: FONTE_TITULO, fontWeight: 800, fontSize: fonte, lineHeight: 1.02, letterSpacing: -fonte * 0.03, color: tema.texto } as const;
  return (
    <AbsoluteFill style={{ background: tema.fundo }}>
      <FundoVivo />
      {imagem && (
        <AbsoluteFill>
          <Img src={staticFile(imagem)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.7), rgba(5,5,5,0.92))' }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: `0 ${tema.margem}px`, textAlign: 'center' }}>
        {linhas.map((l, i) => (
          <div key={i} style={estiloLinha}>
            <Marcado texto={l} raio={fonte * 0.16} />
          </div>
        ))}
        {destaque && (
          <div style={{ ...estiloLinha, color: '#fff', background: tema.azul, borderRadius: fonte * 0.2, padding: `${fonte * 0.04}px ${fonte * 0.22}px ${fonte * 0.1}px`, marginTop: 24 }}>{destaque}</div>
        )}
        {subtitulo && <div style={{ fontFamily: FONTE_MONO, fontWeight: 500, fontSize: 44, color: tema.mudo, marginTop: 56 }}>{subtitulo}</div>}
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: FONTE_MONO, fontWeight: 700, fontSize: 36, color: tema.mudo }}>{tema.perfil}</div>
    </AbsoluteFill>
  );
};
