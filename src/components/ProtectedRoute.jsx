import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role = 'patient' }) {
  const { user, admin } = useAuth();
  const location = useLocation();
  const allowed = role === 'admin' ? admin : user;
  if (!allowed) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }
  return <Outlet />;
}
