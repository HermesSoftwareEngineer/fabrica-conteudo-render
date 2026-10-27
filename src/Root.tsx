import { Composition, Still } from 'remotion';
import { Capa } from './Capa';
import { Carrossel } from './Carrossel';
import { Reels } from './Reels';
import type { PropsCapa, PropsCarrossel, PropsReels } from './tipos';

const FPS = 30;
const carrosselPadrao: PropsCarrossel = { slides: [{ tipo: 'capa', titulo: 'Título de exemplo' }] };
const reelsPadrao: PropsReels = { cenas: [{ tipo: 'titulo', texto: 'Exemplo *de Reel*', inicioSeg: 0, fimSeg: 3 }] };
const capaPadrao: PropsCapa = { titulo: 'TÍTULO\nDA CAPA', destaque: 'EXEMPLO' };

export const Root = () => (
  <>
    <Composition id="Carrossel" component={Carrossel} width={1080} height={1350} fps={FPS}
      durationInFrames={carrosselPadrao.slides.length} defaultProps={carrosselPadrao}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.slides.length) })} />
    <Composition id="Reels" component={Reels} width={1080} height={1920} fps={FPS}
      durationInFrames={90} defaultProps={reelsPadrao}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, Math.round(Math.max(1, ...props.cenas.map((c) => c.fimSeg)) * FPS)) })} />
    <Still id="Capa" component={Capa} width={1080} height={1920} defaultProps={capaPadrao} />
  </>
);
