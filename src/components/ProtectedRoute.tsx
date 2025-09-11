import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/adminAuth';
import { getAdminPrefix } from '../utils/adminPrefix';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    const adminBase = getAdminPrefix();
    return <Navigate to={adminBase} replace />;
  }
  return children;
}


