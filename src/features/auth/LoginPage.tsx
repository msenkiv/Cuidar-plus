import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title } from '@mantine/core';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('fake-token');
    navigate('/');
  };

  return (
    <Paper maw={400} mx="auto" mt="xl" p="xl" withBorder>
      <Title order={2} mb="md">Entrar</Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <PasswordInput
          mt="sm"
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <Button type="submit" fullWidth mt="md">
          Entrar
        </Button>
      </form>
    </Paper>
  );
}
