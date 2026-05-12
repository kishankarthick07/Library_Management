import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly }) {
  const { member, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-yellow-50 to-white">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-yellow-300 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading library...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (adminOnly && member.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
