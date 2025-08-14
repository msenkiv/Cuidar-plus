import { useEffect, useState } from 'react';
import { loadVideos } from './api';
import type { Video } from './types';
import { VideoCard } from './VideoCard';
import {
  SimpleGrid,
  TextInput,
  Select,
  Container,
  Title,
  Paper,
  Stack,
} from '@mantine/core';

export function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [duracao, setDuracao] = useState<string | null>(null);

  useEffect(() => {
    loadVideos().then(setVideos);
  }, []);

  const filtered = videos.filter(v => {
    const matchSearch = v.titulo.toLowerCase().includes(search.toLowerCase()) ||
      v.descricao.toLowerCase().includes(search.toLowerCase());
    const matchCategoria = !categoria || v.categoria === categoria;
    const matchDuracao =
      !duracao ||
      (duracao === 'curto' && v.duracaoMin < 5) ||
      (duracao === 'medio' && v.duracaoMin >= 5 && v.duracaoMin <= 10) ||
      (duracao === 'longo' && v.duracaoMin > 10);
    return matchSearch && matchCategoria && matchDuracao;
  });

  return (
    <Container>
      <Title order={2} my="md">Vídeos</Title>
      <Paper shadow="xs" p="md" mb="md">
        <Stack>
          <TextInput
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Select
            placeholder="Filtrar por categoria"
            data={['Queimaduras','Troca de Ataduras','Higiene da Ferida','Medicação','Sinais de Alerta']}
            value={categoria}
            onChange={setCategoria}
          />
          <Select
            placeholder="Filtrar por duração"
            data={[
              { value: 'curto', label: 'Curto (< 5min)' },
              { value: 'medio', label: 'Médio (5–10min)' },
              { value: 'longo', label: 'Longo (> 10min)' },
            ]}
            value={duracao}
            onChange={setDuracao}
          />
        </Stack>
      </Paper>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {filtered.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
