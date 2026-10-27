import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const sora = loadSora('normal', { weights: ['600', '700', '800'], subsets: ['latin', 'latin-ext'] });
const mono = loadMono('normal', { weights: ['500', '700'], subsets: ['latin', 'latin-ext'] });

export const FONTE_TITULO = sora.fontFamily;
export const FONTE_MONO = mono.fontFamily;

// Paleta neutra do @hermess.dev (docs/padrao-de-edicao.md): preto, azul só como detalhe.
export const tema = {
  fundo: '#050505',
  s1: '#121212',
  s2: '#1A1A1A',
  linha: '#2A2A2A',
  texto: '#F2F2F2',
  mudo: '#8A8A8A',
  azul: '#4F6BFF',
  ceu: '#A9D0E8',
  vermelho: '#FF4D4D',
  verde: '#4ADE80',
  ambar: '#F5B841',
  margem: 84,
  perfil: '@hermess.dev',
};
export const LARGURA = 1080;
export const ALTURA = 1350;

// Reels / Capa (1080x1920). Zona segura do Instagram: topo ~250px, base ~420px.
export const ALTURA_REELS = 1920;
export const SEGURA = { topo: 250, base: 420 };
