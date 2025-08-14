import { useEffect, useState } from 'react';
import { loadVideos } from './api';
import type { Video } from './types';
import { VideoCard } from './VideoCard';
import { SimpleGrid, TextInput, Select, Container, Title } from '@mantine/core';

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
      <TextInput placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.currentTarget.value)} mb="sm" />
      <Select
        placeholder="Filtrar por categoria"
        data={['Queimaduras','Troca de Ataduras','Higiene da Ferida','Medicação','Sinais de Alerta']}
        value={categoria}
        onChange={setCategoria}
        mb="sm"
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
        mb="md"
      />
      <SimpleGrid cols={3} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {filtered.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
