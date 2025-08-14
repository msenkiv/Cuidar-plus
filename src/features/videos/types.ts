export type Categoria =
  | 'Queimaduras'
  | 'Troca de Ataduras'
  | 'Higiene da Ferida'
  | 'Medicação'
  | 'Sinais de Alerta';

export interface Video {
  id: string;
  youtubeId: string;
  titulo: string;
  descricao: string;
  duracaoMin: number;
  categoria: Categoria;
  materiais: string[];
  passos: string[];
  avisos: string[];
}
