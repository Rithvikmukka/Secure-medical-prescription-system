import { Navigate, Route, Routes } from 'react-router-dom';
import RoleSelectPage from './routes/RoleSelectPage';
import LoginPage from './routes/LoginPage';
import PostLoginRouterPage from './routes/PostLoginRouterPage';
import DoctorRootPage from './routes/DoctorRootPage';
import PharmacistRootPage from './routes/PharmacistRootPage';
import PatientRootPage from './routes/PatientRootPage';
import RoleGuard from './routing/RoleGuard';
import { useAppState } from './state/AppStateContext';
import { roleAccent, roleLabel } from './routing/rolePaths';

function HeaderIdentity() {
  const { state } = useAppState();
  const role = state.selectedRole;

  if (role === null) return null;

  const accent = roleAccent(role);
  const label = roleLabel(role);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid var(--border)',
        borderRadius: 999,
        padding: '6px 10px',
        color: 'var(--muted)',
        fontSize: 12,
      }}
      aria-label="Session role context"
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: accent }} />
      <span>Role:</span>
      <strong style={{ color: 'var(--text)' }}>{label}</strong>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div className="topbar-title">Secure Medical Prescription System</div>
          <HeaderIdentity />
        </div>
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<PostLoginRouterPage />} />

          <Route
            path="/doctor"
            element={
              <RoleGuard allowedRole="doctor">
                <DoctorRootPage />
              </RoleGuard>
            }
          />
          <Route
            path="/pharmacist"
            element={
              <RoleGuard allowedRole="pharmacist">
                <PharmacistRootPage />
              </RoleGuard>
            }
          />
          <Route
            path="/patient"
            element={
              <RoleGuard allowedRole="patient">
                <PatientRootPage />
              </RoleGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
