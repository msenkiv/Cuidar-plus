// src/App.tsx (corrigido)
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider } from './app/providers/RouterProvider';
import { AuthProvider } from './features/auth/AuthContext';

const colorSchemeManager = localStorageColorSchemeManager({ key: 'theme' });

export default function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        defaultColorScheme="light"
        colorSchemeManager={colorSchemeManager}
      >
        <Notifications position="top-right" />
        <AuthProvider>
          <RouterProvider />
        </AuthProvider>
      </MantineProvider>
    </>
  );
}
