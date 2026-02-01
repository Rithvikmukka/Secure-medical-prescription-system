import { Link, Navigate } from 'react-router-dom';
import { useAppState } from '../state/AppStateContext';
import './authPages.css';

function roleAccent(role: string | null) {
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

export default function OtpPage() {
  const { state } = useAppState();

  const role = state.selectedRole;
  if (role === null) return <Navigate to="/" replace />;

  const accent = roleAccent(role);
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <section className="auth-shell">
      <h1 className="h1">OTP Verification</h1>
      <p className="subtle">This step is intentionally a placeholder. OTP logic is implemented next.</p>

      <div className="role-banner" aria-label="Role context">
        <div className="role-banner-row">
          <h2 className="role-title" style={{ color: accent }}>
            {roleLabel}
          </h2>
          <div className="role-pill">
            <span className="dot" style={{ background: accent }} />
            <span>Role context preserved</span>
          </div>
        </div>
        <div className="security-note">Multi-factor authentication (OTP) is required to complete login.</div>
      </div>

      <div className="notice" style={{ marginTop: 0 }}>
        OTP generation, expiry, and verification are not added yet.
      </div>

      <div style={{ marginTop: 6 }}>
        <Link to="/login">Back to login</Link>
      </div>
    </section>
  );
}
