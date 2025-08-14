import { useEffect, useState } from 'react';
import { loadVideos } from './api';
import type { Video } from './types';
import { VideoCard } from './VideoCard';
import { getFavorites } from '../../lib/storage';
import { SimpleGrid, Container, Title } from '@mantine/core';

export function FavoritesPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    loadVideos().then(v => {
      setVideos(v.filter(video => getFavorites().includes(video.id)));
    });
  }, []);

  return (
    <Container>
      <Title order={2} my="md">Favoritos</Title>
      <SimpleGrid cols={3} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
