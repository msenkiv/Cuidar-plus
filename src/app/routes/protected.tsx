import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}
