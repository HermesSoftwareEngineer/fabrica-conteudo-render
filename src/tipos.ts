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

// ---------------------------------------------------------------------------
// Reels (1080x1920, 30 fps). Convenção de texto: *palavra* = destaque (caixa azul).
// ---------------------------------------------------------------------------

/** Campos comuns a toda cena. A duração vem de inicioSeg/fimSeg. */
export type CenaBase = {
  inicioSeg: number;
  fimSeg: number;
  /** Etiqueta curta no topo da zona segura; troca a cada ideia. Aceita *destaque*. */
  etiqueta?: string;
  /** Fala da cena (usada só na legenda palavra a palavra, que é opcional). Aceita *palavra* para destacar. */
  fala?: string;
  /** Imagem de fundo opcional (sem texto), escurecida. Caminho dentro de public/. */
  imagem?: string;
};

export type ItemCartao = { icone?: string; titulo: string; texto?: string };

export type CenaReels =
  | (CenaBase & { tipo: 'titulo'; texto: string; subtitulo?: string; tamanho?: number })
  | (CenaBase & { tipo: 'cartoes'; itens: ItemCartao[] })
  | (CenaBase & { tipo: 'codigo'; codigo: string; arquivo?: string; destacar?: number[]; caracteresPorSeg?: number })
  | (CenaBase & { tipo: 'contador'; ate: number; de?: number; decimais?: number; prefixo?: string; sufixo?: string; rotulo: string })
  | (CenaBase & { tipo: 'lista'; itens: string[]; misterio?: boolean })
  | (CenaBase & { tipo: 'fechamento'; texto: string; chamada?: string });

/** Palavra com tempo absoluto (s) no vídeo, vinda de transcrição/TTS. */
export type Palavra = { t: string; inicioSeg: number; destaque?: boolean };

export type PropsReels = {
  cenas: CenaReels[];
  /** Áudio opcional (caminho dentro de public/). */
  audio?: string;
  /** Legenda palavra a palavra (opcional; padrão: desligada). */
  legenda?: boolean;
  /** Palavras com tempo exato (transcrição). Sem isto, a legenda distribui a `fala` de cada cena. */
  palavras?: Palavra[];
};

export type PropsCapa = { titulo: string; destaque?: string; subtitulo?: string; imagem?: string };
