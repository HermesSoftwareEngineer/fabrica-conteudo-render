import { useMemo } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { CorpoCena } from './cenas';
import { AreaSegura, FundoVivo, ImagemCena, Legenda, montarPalavras } from './kit';
import { FONTE_TITULO, tema } from './tema';
import type { PropsReels } from './tipos';

// 1080x1920, 30 fps. Cenas dirigidas por JSON (inicioSeg/fimSeg). Áudio e legenda são opcionais.
export const Reels = ({ cenas, audio, legenda = false, palavras }: PropsReels) => {
  const { fps } = useVideoConfig();
  const lista = useMemo(() => (legenda ? montarPalavras(cenas, palavras) : []), [legenda, cenas, palavras]);
  return (
    <AbsoluteFill style={{ background: tema.fundo, fontFamily: FONTE_TITULO }}>
      <FundoVivo />
      {audio && <Audio src={staticFile(audio)} />}
      {cenas.map((c, i) => (
        <Sequence key={i} from={Math.round(c.inicioSeg * fps)} durationInFrames={Math.max(1, Math.round((c.fimSeg - c.inicioSeg) * fps))}>
          <AbsoluteFill>
            {c.imagem && <ImagemCena src={c.imagem} />}
            <AreaSegura legenda={legenda} etiqueta={c.etiqueta}>
              <CorpoCena c={c} />
            </AreaSegura>
          </AbsoluteFill>
        </Sequence>
      ))}
      {legenda && <Legenda palavras={lista} />}
    </AbsoluteFill>
  );
};
