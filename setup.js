// setup-app.js
import fs from 'fs';
import path from 'path';

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath, content) {
  const fullPath = path.join(process.cwd(), filePath);
  ensureDir(fullPath);
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`Created: ${filePath}`);
}

// ========================
// App.tsx
// ========================
writeFile('src/App.tsx', `
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider } from './app/providers/RouterProvider';
import { AuthProvider } from './features/auth/AuthContext';
import { useState } from 'react';

export default function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  const toggleColorScheme = () => {
    const next = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(next);
    localStorage.setItem('theme', next);
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
        <Notifications position="top-right" />
        <AuthProvider>
          <RouterProvider />
        </AuthProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
`);

// ========================
// main.tsx
// ========================
writeFile('src/main.tsx', `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

// ========================
// index.css
// ========================
writeFile('src/styles/index.css', `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--mantine-color-body);
}
a {
  text-decoration: none;
  color: inherit;
}
`);
// ========================
// RouterProvider.tsx
// ========================
writeFile('src/app/providers/RouterProvider.tsx', `
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';
import { HomePage } from '../../features/videos/HomePage';
import { VideoPage } from '../../features/videos/VideoPage';
import { FavoritesPage } from '../../features/videos/FavoritesPage';
import { LoginPage } from '../../features/auth/LoginPage';
import { SobrePage } from '../../features/videos/SobrePage';
import { ProtectedRoute } from '../routes/protected';

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sobre"
          element={
            <ProtectedRoute>
              <SobrePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
`);

// ========================
// ProtectedRoute.tsx
// ========================
writeFile('src/app/routes/protected.tsx', `
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}
`);

// ========================
// Navbar.tsx
// ========================
writeFile('src/app/layout/Navbar.tsx', `
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
`);

// ========================
// AuthContext.tsx
// ========================
writeFile('src/features/auth/AuthContext.tsx', `
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const login = (tokenValue: string) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be inside AuthProvider');
  return context;
}
`);

// ========================
// useAuth.ts
// ========================
writeFile('src/features/auth/useAuth.ts', `
import { useAuthContext } from './AuthContext';
export const useAuth = () => useAuthContext();
`);

// ========================
// LoginPage.tsx
// ========================
writeFile('src/features/auth/LoginPage.tsx', `
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
`);
// ========================
// storage.ts
// ========================
writeFile('src/lib/storage.ts', `
const FAVORITES_KEY = 'favorites';
const WATCHED_KEY = 'watched';

function getList(key: string): string[] {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function getFavorites() {
  return getList(FAVORITES_KEY);
}

export function toggleFavorite(id: string) {
  const list = getFavorites();
  if (list.includes(id)) {
    setList(FAVORITES_KEY, list.filter((x) => x !== id));
  } else {
    setList(FAVORITES_KEY, [...list, id]);
  }
}

export function isFavorite(id: string) {
  return getFavorites().includes(id);
}

export function getWatched() {
  return getList(WATCHED_KEY);
}

export function markWatched(id: string) {
  const list = getWatched();
  if (!list.includes(id)) {
    setList(WATCHED_KEY, [...list, id]);
  }
}

export function isWatched(id: string) {
  return getWatched().includes(id);
}
`);

// ========================
// types.ts
// ========================
writeFile('src/features/videos/types.ts', `
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
`);

// ========================
// api.ts
// ========================
writeFile('src/features/videos/api.ts', `
import videosData from './data/videos.json';
import { z } from 'zod';
import { Video } from './types';

const videoSchema = z.object({
  id: z.string(),
  youtubeId: z.string(),
  titulo: z.string(),
  descricao: z.string(),
  duracaoMin: z.number(),
  categoria: z.string(),
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
  return parsed.data;
}
`);

// ========================
// VideoCard.tsx
// ========================
writeFile('src/features/videos/VideoCard.tsx', `
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
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Card.Section>
        <Image
          src={\`https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg\`}
          alt={titulo}
          height={180}
        />
      </Card.Section>

      <Group position="apart" mt="sm" mb="xs">
        <Text fw={500} lineClamp={2}>{titulo}</Text>
      </Group>

      <Badge color="blue" variant="light">{categoria}</Badge>
      <Badge color="gray" variant="light" ml="xs">{duracaoMin} min</Badge>
      {watched && <Badge color="green" variant="light" ml="xs">Visto</Badge>}

      <Group mt="sm" position="apart">
        <Tooltip label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
          <ActionIcon onClick={handleToggleFavorite} color={fav ? 'red' : 'gray'}>
            {fav ? <IconHeartFilled /> : <IconHeart />}
          </ActionIcon>
        </Tooltip>
        <Link to={\`/video/\${id}\`}>
          <ActionIcon color="blue"><IconEye /></ActionIcon>
        </Link>
      </Group>
    </Card>
  );
}
`);

// ========================
// HomePage.tsx
// ========================
writeFile('src/features/videos/HomePage.tsx', `
import { useEffect, useState } from 'react';
import { loadVideos } from './api';
import { Video } from './types';
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
`);

// ========================
// VideoPage.tsx
// ========================
writeFile('src/features/videos/VideoPage.tsx', `
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadVideos } from './api';
import { Video } from './types';
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
        src={\`https://www.youtube-nocookie.com/embed/\${video.youtubeId}\`}
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
`);

// ========================
// FavoritesPage.tsx
// ========================
writeFile('src/features/videos/FavoritesPage.tsx', `
import { useEffect, useState } from 'react';
import { loadVideos } from './api';
import { Video } from './types';
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
`);

// ========================
// SobrePage.tsx
// ========================
writeFile('src/features/videos/SobrePage.tsx', `
import { Container, Title, Text } from '@mantine/core';

export function SobrePage() {
  return (
    <Container>
      <Title order={2} my="md">Sobre o Cuidar+</Title>
      <Text>
        Este aplicativo fornece orientações em vídeo para cuidados pós-cirúrgicos. 
        As informações aqui apresentadas têm caráter educativo e não substituem a avaliação de um profissional de saúde.
      </Text>
      <Text mt="sm">
        Em caso de dor intensa, febre, mau cheiro ou sangramento, procure atendimento médico imediatamente.
      </Text>
    </Container>
  );
}
`);
// ========================
// videos.json
// ========================
writeFile('src/features/videos/data/videos.json', `
[
  {
    "id": "1",
    "youtubeId": "abcd1234",
    "titulo": "Cuidados com queimaduras leves",
    "descricao": "Aprenda como tratar queimaduras leves de forma segura em casa.",
    "duracaoMin": 4,
    "categoria": "Queimaduras",
    "materiais": ["Água corrente", "Gaze estéril", "Pomada para queimaduras"],
    "passos": ["Lavar a área com água corrente", "Aplicar pomada", "Cobrir com gaze"],
    "avisos": ["Não aplicar gelo", "Não estourar bolhas"]
  },
  {
    "id": "2",
    "youtubeId": "efgh5678",
    "titulo": "Troca de atadura no braço",
    "descricao": "Troque a atadura corretamente para evitar infecções.",
    "duracaoMin": 6,
    "categoria": "Troca de Ataduras",
    "materiais": ["Atadura limpa", "Tesoura", "Álcool 70%"],
    "passos": ["Remover atadura antiga", "Limpar a ferida", "Colocar nova atadura"],
    "avisos": ["Usar material estéril", "Evitar tocar na ferida com as mãos"]
  },
  {
    "id": "3",
    "youtubeId": "ijkl9012",
    "titulo": "Higienização de ferida cirúrgica",
    "descricao": "Passo a passo para higienizar a ferida cirúrgica corretamente.",
    "duracaoMin": 8,
    "categoria": "Higiene da Ferida",
    "materiais": ["Soro fisiológico", "Gaze", "Luvas descartáveis"],
    "passos": ["Lavar as mãos", "Aplicar soro na gaze", "Limpar a ferida do centro para fora"],
    "avisos": ["Não reutilizar materiais", "Descartar luvas corretamente"]
  },
  {
    "id": "4",
    "youtubeId": "mnop3456",
    "titulo": "Como tomar medicação oral pós-cirurgia",
    "descricao": "Dicas para tomar medicação oral de forma correta.",
    "duracaoMin": 3,
    "categoria": "Medicação",
    "materiais": ["Copo com água", "Medicamento prescrito"],
    "passos": ["Conferir a prescrição", "Ingerir com água", "Não deitar logo após tomar"],
    "avisos": ["Não tomar com bebidas alcoólicas", "Seguir horários indicados"]
  },
  {
    "id": "5",
    "youtubeId": "qrst7890",
    "titulo": "Sinais de alerta em pós-operatório",
    "descricao": "Identifique sinais de complicações após cirurgia.",
    "duracaoMin": 5,
    "categoria": "Sinais de Alerta",
    "materiais": ["Termômetro", "Relógio"],
    "passos": ["Observar temperatura", "Monitorar dor", "Verificar sangramento"],
    "avisos": ["Febre acima de 38°C", "Dor intensa", "Sangramento abundante"]
  },
  {
    "id": "6",
    "youtubeId": "abcd5678",
    "titulo": "Troca de curativo simples",
    "descricao": "Troque curativos pequenos de forma higiênica.",
    "duracaoMin": 4,
    "categoria": "Troca de Ataduras",
    "materiais": ["Curativo adesivo", "Álcool 70%"],
    "passos": ["Retirar curativo antigo", "Limpar área", "Colocar novo curativo"],
    "avisos": ["Usar luvas", "Não reutilizar curativo"]
  },
  {
    "id": "7",
    "youtubeId": "efgh9012",
    "titulo": "Lavar queimadura com soro",
    "descricao": "Utilize soro fisiológico para limpeza adequada.",
    "duracaoMin": 5,
    "categoria": "Queimaduras",
    "materiais": ["Soro fisiológico", "Gaze"],
    "passos": ["Lavar área com soro", "Secar levemente", "Cobrir com gaze"],
    "avisos": ["Evitar fricção", "Manter área limpa"]
  },
  {
    "id": "8",
    "youtubeId": "ijkl3456",
    "titulo": "Higiene das mãos antes do curativo",
    "descricao": "Técnica correta para lavar as mãos.",
    "duracaoMin": 2,
    "categoria": "Higiene da Ferida",
    "materiais": ["Sabão neutro", "Água corrente"],
    "passos": ["Molhar as mãos", "Ensaboar", "Enxaguar e secar"],
    "avisos": ["Usar toalha limpa", "Não tocar superfícies sujas"]
  },
  {
    "id": "9",
    "youtubeId": "mnop7890",
    "titulo": "Aplicar pomada antibiótica",
    "descricao": "Forma correta de aplicar pomada para evitar infecção.",
    "duracaoMin": 3,
    "categoria": "Medicação",
    "materiais": ["Pomada antibiótica", "Luvas descartáveis"],
    "passos": ["Lavar as mãos", "Aplicar pomada", "Cobrir ferida se necessário"],
    "avisos": ["Não usar pomada vencida", "Seguir orientação médica"]
  },
  {
    "id": "10",
    "youtubeId": "qrst1234",
    "titulo": "Medindo febre corretamente",
    "descricao": "Como medir a temperatura corporal no pós-operatório.",
    "duracaoMin": 2,
    "categoria": "Sinais de Alerta",
    "materiais": ["Termômetro digital"],
    "passos": ["Ligar termômetro", "Posicionar corretamente", "Aguardar leitura"],
    "avisos": ["Higienizar termômetro", "Seguir instruções do fabricante"]
  },
  {
    "id": "11",
    "youtubeId": "abcd9012",
    "titulo": "Enfaixar queimadura no braço",
    "descricao": "Técnica para enfaixar queimaduras.",
    "duracaoMin": 7,
    "categoria": "Queimaduras",
    "materiais": ["Gaze", "Atadura"],
    "passos": ["Cobrir queimadura", "Enfaixar suavemente", "Fixar ponta"],
    "avisos": ["Não apertar demais", "Trocar diariamente"]
  },
  {
    "id": "12",
    "youtubeId": "efgh3456",
    "titulo": "Troca de curativo em ferida profunda",
    "descricao": "Cuidados especiais em feridas mais graves.",
    "duracaoMin": 12,
    "categoria": "Troca de Ataduras",
    "materiais": ["Gaze estéril", "Pinça", "Soro fisiológico"],
    "passos": ["Lavar mãos", "Retirar curativo antigo com pinça", "Aplicar novo curativo"],
    "avisos": ["Usar material estéril", "Evitar contato direto"]
  },
  {
    "id": "13",
    "youtubeId": "ijkl7890",
    "titulo": "Limpeza de ferida no pé",
    "descricao": "Procedimento para feridas nos pés.",
    "duracaoMin": 6,
    "categoria": "Higiene da Ferida",
    "materiais": ["Soro fisiológico", "Gaze"],
    "passos": ["Lavar com soro", "Secar cuidadosamente", "Aplicar curativo"],
    "avisos": ["Não usar produtos irritantes", "Trocar curativo se molhar"]
  },
  {
    "id": "14",
    "youtubeId": "mnop1234",
    "titulo": "Organizando medicação diária",
    "descricao": "Dicas para organizar remédios no pós-operatório.",
    "duracaoMin": 4,
    "categoria": "Medicação",
    "materiais": ["Caixa organizadora", "Receita médica"],
    "passos": ["Separar doses", "Organizar por horário", "Conferir antes de tomar"],
    "avisos": ["Não misturar medicamentos", "Guardar em local fresco"]
  },
  {
    "id": "15",
    "youtubeId": "qrst5678",
    "titulo": "Reconhecendo sinais de infecção",
    "descricao": "Saiba identificar infecção na ferida.",
    "duracaoMin": 5,
    "categoria": "Sinais de Alerta",
    "materiais": ["Termômetro", "Espelho"],
    "passos": ["Observar vermelhidão", "Checar temperatura", "Analisar secreção"],
    "avisos": ["Procurar médico se houver pus", "Não ignorar sintomas"]
  }
]
`);
