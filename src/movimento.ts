import type React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Valores de movimento em constantes: ajuste aqui no Studio. Nada flutua: tudo entra, assenta e sai.
export const MOLA = { damping: 22, stiffness: 150, mass: 0.9 }; // amortecida (~sem overshoot)
export const FRAMES_SAIDA = 9; // saída ease-in no fim da cena
export const DESLOC_ENTRADA = 48; // px
export const DESLOC_SAIDA = 28; // px
export const ESCALA_INICIAL = 0.96;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Presença de um elemento dentro de uma cena: entra por mola, assenta parado, sai com ease-in no fim da cena. */
export const usePresenca = (atraso = 0, atrasoSaida = 0) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ent = spring({ frame: frame - atraso, fps, config: MOLA });
  const fim = durationInFrames;
  const ini = Math.min(fim - 2, durationInFrames - FRAMES_SAIDA + atrasoSaida);
  const sai = interpolate(frame, [ini, fim], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacidade = clamp01(ent) * (1 - sai);
  const dy = (1 - ent) * DESLOC_ENTRADA - sai * DESLOC_SAIDA;
  const escala = ESCALA_INICIAL + (1 - ESCALA_INICIAL) * ent - 0.02 * sai;
  const estilo: React.CSSProperties = { opacity: opacidade, transform: `translateY(${dy}px) scale(${escala})` };
  return { frame, fps, ent, sai, opacidade, estilo };
};

export const formatarNumero = (v: number, decimais = 0) => {
  const [i, d] = Math.abs(v).toFixed(decimais).split('.');
  const milhar = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (v < 0 ? '-' : '') + milhar + (d ? ',' + d : '');
};
