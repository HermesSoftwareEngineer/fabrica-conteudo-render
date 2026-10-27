import { AbsoluteFill, Audio, Img, Sequence, staticFile, useVideoConfig } from 'remotion';
import { tema } from './tema';
import type { PropsReels } from './tipos';

// 1080x1920, 30 fps. Legenda sincronizada pelos tempos das cenas (TTS ou transcrição).
export const Reels = ({ cenas, audio, legenda = true }: PropsReels) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: tema.fundo, fontFamily: tema.fonte }}>
      {audio && <Audio src={staticFile(audio)} />}
      {cenas.map((c, i) => (
        <Sequence key={i} from={Math.round(c.inicioSeg * fps)} durationInFrames={Math.max(1, Math.round((c.fimSeg - c.inicioSeg) * fps))}>
          <AbsoluteFill>
            {c.imagem && <Img src={staticFile(c.imagem)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            {legenda && (
              <div style={{ position: 'absolute', bottom: 260, left: tema.margem, right: tema.margem, color: tema.texto, fontSize: 64, fontWeight: 700, textAlign: 'center', textShadow: '0 4px 16px #000' }}>
                {c.texto}
              </div>
            )}
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
