import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { admin, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (admin && admin.role === 'admin') {
    return children;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/admin/login" />;
};

export default AdminRoute;
