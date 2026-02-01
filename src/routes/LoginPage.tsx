import { Link, Navigate, useNavigate } from 'react-router-dom';
import { type FormEvent, useMemo, useState } from 'react';
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

export default function LoginPage() {
  const navigate = useNavigate();
  const { state, setAuthStatus } = useAppState();

  const role = state.selectedRole;
  if (role === null) return <Navigate to="/" replace />;

  const accent = roleAccent(role);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => {
    return usernameOrEmail.trim().length > 0 && password.trim().length > 0;
  }, [usernameOrEmail, password]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (!canSubmit) return;

    setAuthStatus('password_verified');
    navigate('/otp');
  }

  return (
    <section className="auth-shell">
      <h1 className="h1">Login</h1>
      <p className="subtle">
        Single-factor login (username + password). MFA (OTP) is required next to complete access.
      </p>

      <div className="role-banner" aria-label="Selected role">
        <div className="role-banner-row">
          <h2 className="role-title" style={{ color: accent }}>
            {roleLabel}
          </h2>
          <div className="role-pill">
            <span className="dot" style={{ background: accent }} />
            <span>Role context active</span>
          </div>
        </div>
        <div className="security-note">
          Security posture: password accepted only if role context exists. OTP verification is pending.
        </div>
      </div>

      <form className="auth-form" onSubmit={onSubmit} aria-label="Login form">
        <div className="field">
          <label className="label" htmlFor="usernameOrEmail">
            Username or Email
          </label>
          <input
            id="usernameOrEmail"
            className="input"
            type="text"
            autoComplete="username"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {submitted && !canSubmit ? (
          <div className="inline-error" role="alert">
            Both fields are required.
          </div>
        ) : null}

        <button className="primary" type="submit" disabled={!canSubmit} aria-label="Login">
          Login
        </button>
      </form>

      <div style={{ marginTop: 6 }}>
        <Link to="/">Back to role selection</Link>
      </div>
    </section>
  );
}
