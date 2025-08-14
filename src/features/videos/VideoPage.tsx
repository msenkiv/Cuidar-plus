import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadVideos } from './api';
import type { Video } from './types';
import { Container, Title, Text, List, Button, Badge } from '@mantine/core';
import { markWatched, isWatched, toggleFavorite, isFavorite } from '../../lib/storage';

export function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [watched, setWatched] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    loadVideos().then(videos => {
      const v = videos.find(v => v.id === id);
      if (v) {
        setVideo(v);
        setWatched(isWatched(v.id));
        setFav(isFavorite(v.id));
      }
    });
  }, [id]);

  if (!video) return <Container>Vídeo não encontrado</Container>;

  const handleWatched = () => {
    markWatched(video.id);
    setWatched(true);
  };

  const handleFav = () => {
    toggleFavorite(video.id);
    setFav(isFavorite(video.id));
  };

  return (
    <Container>
      <Badge color="red" mb="md">
        Este conteúdo é educativo e não substitui orientação profissional. Em caso de dor intensa,
        febre, mau cheiro ou sangramento, procure assistência médica imediatamente.
      </Badge>
      <Title order={2}>{video.titulo}</Title>
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
        title={video.titulo}
        allowFullScreen
        style={{ marginTop: '1rem', border: 'none' }}
      ></iframe>
      <Text mt="md">{video.descricao}</Text>
      <Title order={4} mt="md">Materiais necessários</Title>
      <List>{video.materiais.map((m, i) => <List.Item key={i}>{m}</List.Item>)}</List>
      <Title order={4} mt="md">Passos</Title>
      <List type="ordered">{video.passos.map((p, i) => <List.Item key={i}>{p}</List.Item>)}</List>
      <Title order={4} mt="md">Avisos</Title>
      <List>{video.avisos.map((a, i) => <List.Item key={i}>{a}</List.Item>)}</List>
      <Button onClick={handleWatched} mt="md" disabled={watched}>
        {watched ? 'Já marcado como visto' : 'Marcar como visto'}
      </Button>
      <Button onClick={handleFav} mt="md" ml="sm" color={fav ? 'red' : 'blue'}>
        {fav ? 'Remover dos favoritos' : 'Favoritar'}
      </Button>
    </Container>
  );
}
