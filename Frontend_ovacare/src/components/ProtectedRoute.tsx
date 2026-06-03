import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('ovacare_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default ProtectedRoute;