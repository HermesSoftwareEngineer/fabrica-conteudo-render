export type Slide = { titulo: string; texto?: string; imagem?: string };
export type PropsCarrossel = { slides: Slide[] };
export type Cena = { texto: string; imagem?: string; inicioSeg: number; fimSeg: number };
export type PropsReels = { cenas: Cena[]; audio?: string; legenda?: boolean };
