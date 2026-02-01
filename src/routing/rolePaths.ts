import type { Role } from '../state/AppStateContext';

export function roleRootPath(role: Exclude<Role, null>): '/doctor' | '/pharmacist' | '/patient' {
  switch (role) {
    case 'doctor':
      return '/doctor';
    case 'pharmacist':
      return '/pharmacist';
    case 'patient':
      return '/patient';
  }
}

export function roleAccent(role: Role): string {
  switch (role) {
    case 'doctor':
      return 'var(--doctor)';
    case 'pharmacist':
      return 'var(--pharmacist)';
    case 'patient':
      return 'var(--patient)';
    default:
      return 'rgba(183, 196, 221, 0.6)';
  }
}

export function roleLabel(role: Role): string {
  if (role === null) return 'No role selected';
  return role.charAt(0).toUpperCase() + role.slice(1);
}
