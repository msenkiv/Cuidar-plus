import { Group, Button, ActionIcon, Text } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMantineColorScheme } from '@mantine/core';
import { useAuth } from '../../features/auth/useAuth';

export function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Group px="md" py="sm" position="apart" bg="var(--mantine-color-body)">
      <Text fw={700} size="lg">Cuidar+</Text>
      <Group spacing="md">
        <Link to="/">Início</Link>
        <Link to="/favoritos">Favoritos</Link>
        <Link to="/sobre">Sobre</Link>
        <ActionIcon onClick={() => toggleColorScheme()}>
          {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
        </ActionIcon>
        <Button size="xs" color="red" onClick={handleLogout}>
          Sair
        </Button>
      </Group>
    </Group>
  );
}
