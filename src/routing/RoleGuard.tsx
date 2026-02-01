import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppState, type Role } from '../state/AppStateContext';
import { roleRootPath } from './rolePaths';

type Props = {
  allowedRole: Exclude<Role, null>;
  children: ReactNode;
};

export default function RoleGuard({ allowedRole, children }: Props) {
  const location = useLocation();
  const { state } = useAppState();

  if (state.selectedRole === null) {
    return <Navigate to="/" replace />;
  }

  if (state.authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (state.selectedRole !== allowedRole) {
    return <Navigate to={roleRootPath(state.selectedRole)} replace />;
  }

  return <>{children}</>;
}
