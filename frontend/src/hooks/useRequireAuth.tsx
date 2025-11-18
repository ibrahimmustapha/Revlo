import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { token, hydrated } = useAuth();
  const location = useLocation();
  if (!hydrated) return null;
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};
