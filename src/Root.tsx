import { Composition } from 'remotion';
import { Carrossel } from './Carrossel';
import { Reels } from './Reels';
import type { PropsCarrossel, PropsReels } from './tipos';

const carrosselPadrao: PropsCarrossel = { slides: [{ titulo: 'Título de exemplo', texto: 'Texto curto.' }] };
const reelsPadrao: PropsReels = { cenas: [{ texto: 'Exemplo', inicioSeg: 0, fimSeg: 3 }] };

export const Root = () => (
  <>
    <Composition id="Carrossel" component={Carrossel} width={1080} height={1350} fps={30}
      durationInFrames={carrosselPadrao.slides.length} defaultProps={carrosselPadrao}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.slides.length) })} />
    <Composition id="Reels" component={Reels} width={1080} height={1920} fps={30}
      durationInFrames={90} defaultProps={reelsPadrao}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, Math.round(Math.max(...props.cenas.map((c) => c.fimSeg)) * 30)) })} />
  </>
);
