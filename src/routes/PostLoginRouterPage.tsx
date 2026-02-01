import { Navigate } from 'react-router-dom';
import { useAppState } from '../state/AppStateContext';
import { roleRootPath } from '../routing/rolePaths';

export default function PostLoginRouterPage() {
  const { state } = useAppState();

  if (state.selectedRole === null) {
    return <Navigate to="/" replace />;
  }

  if (state.authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  if (state.authStatus === 'password_verified') {
    return <Navigate to="/otp" replace />;
  }

  return <Navigate to={roleRootPath(state.selectedRole)} replace />;
}
