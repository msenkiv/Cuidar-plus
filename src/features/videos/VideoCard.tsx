import { Card, Image, Text, Badge, Group, ActionIcon, Tooltip } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconEye, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { isFavorite, toggleFavorite, isWatched } from '../../lib/storage';
import { useState } from 'react';

interface Props {
  id: string;
  youtubeId: string;
  titulo: string;
  categoria: string;
  duracaoMin: number;
}

export function VideoCard({ id, youtubeId, titulo, categoria, duracaoMin }: Props) {
  const [fav, setFav] = useState(isFavorite(id));
  const watched = isWatched(id);

  const handleToggleFavorite = () => {
    toggleFavorite(id);
    setFav(isFavorite(id));
  };

  return (
    <Card className="video-card" shadow="sm" padding="sm" radius="md" withBorder>
      <Card.Section>
        <Image
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          fallbackSrc="/placeholder.svg"
          alt={titulo}
          height={180}
        />
      </Card.Section>

      <Group justify="space-between" mt="sm" mb="xs">
        <Text fw={500} lineClamp={2}>{titulo}</Text>
      </Group>

      <Badge color="blue" variant="light">{categoria}</Badge>
      <Badge color="gray" variant="light" ml="xs">{duracaoMin} min</Badge>
      {watched && <Badge color="green" variant="light" ml="xs">Visto</Badge>}

      <Group mt="sm" justify="space-between">
        <Tooltip label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
          <ActionIcon onClick={handleToggleFavorite} color={fav ? 'red' : 'gray'}>
            {fav ? <IconHeartFilled /> : <IconHeart />}
          </ActionIcon>
        </Tooltip>
        <Link to={`/video/${id}`}>
          <ActionIcon color="blue"><IconEye /></ActionIcon>
        </Link>
      </Group>
    </Card>
  );
}
