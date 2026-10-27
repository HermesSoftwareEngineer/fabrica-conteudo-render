// Tipos de slide do carrossel (máx. 10; ver docs/padrao-de-conteudo.md do projeto de redes sociais).
export type Slide =
  | { tipo: 'capa'; titulo: string; destaque?: string; subtitulo?: string; imagem?: string }
  | { tipo: 'passo'; numero?: number; titulo: string; texto: string; imagem?: string }
  | { tipo: 'codigo'; titulo: string; codigo: string; legenda?: string; imagem?: string }
  | { tipo: 'comparacao'; titulo: string; esquerda: { rotulo: string; texto: string }; direita: { rotulo: string; texto: string }; imagem?: string }
  | { tipo: 'lista'; titulo: string; itens: string[]; imagem?: string }
  | { tipo: 'destaque'; valor: string; texto: string; imagem?: string }
  | { tipo: 'licao'; titulo: string; texto: string; chamada: string; imagem?: string };

export type PropsCarrossel = { slides: Slide[] };

export type Cena = { texto: string; imagem?: string; inicioSeg: number; fimSeg: number };
export type PropsReels = { cenas: Cena[]; audio?: string; legenda?: boolean };
