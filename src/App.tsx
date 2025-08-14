// src/App.tsx (corrigido)
import {
  MantineProvider,
  ColorSchemeScript,
  localStorageColorSchemeManager,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider } from './app/providers/RouterProvider';
import { AuthProvider } from './features/auth/AuthContext';

const colorSchemeManager = localStorageColorSchemeManager({ key: 'theme' });

export default function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider
        defaultColorScheme="light"
        colorSchemeManager={colorSchemeManager}
        theme={{
          primaryColor: 'teal',
          defaultRadius: 'md',
          fontFamily: 'Poppins, sans-serif',
          headings: { fontFamily: 'Poppins, sans-serif' },
        }}
      >
        <Notifications position="top-right" />
        <AuthProvider>
          <RouterProvider />
        </AuthProvider>
      </MantineProvider>
    </>
  );
}
