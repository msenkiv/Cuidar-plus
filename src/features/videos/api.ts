import videosData from './data/videos.json';
import { z } from 'zod';
import type { Video } from './types';

const videoSchema = z.object({
  id: z.string(),
  youtubeId: z.string(),
  titulo: z.string(),
  descricao: z.string(),
  duracaoMin: z.number(),
  categoria: z.enum([
    'Queimaduras',
    'Troca de Ataduras',
    'Higiene da Ferida',
    'Medicação',
    'Sinais de Alerta',
  ]),
  materiais: z.array(z.string()),
  passos: z.array(z.string()),
  avisos: z.array(z.string()),
});

export async function loadVideos(): Promise<Video[]> {
  const parsed = z.array(videoSchema).safeParse(videosData);
  if (!parsed.success) {
    console.error('Erro de validação dos vídeos', parsed.error);
    return [];
  }
  return parsed.data as Video[];
}
