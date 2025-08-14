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
