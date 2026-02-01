import { Link, Navigate, useNavigate } from 'react-router-dom';
import { type FormEvent, useMemo, useState, useEffect } from 'react';
import { useAppState } from '../state/AppStateContext';
import { generateOTP } from '../utils/otp';
import { verifyUserCredentials, initializeDemoUsers, areDemoUsersInitialized } from '../utils/passwordStore';
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
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Initialize demo users with hashed passwords on component mount
  useEffect(() => {
    if (!areDemoUsersInitialized()) {
      initializeDemoUsers();
    }
  }, []);

  const canSubmit = useMemo(() => {
    return usernameOrEmail.trim().length > 0 && password.trim().length > 0;
  }, [usernameOrEmail, password]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setLoginError('');

    if (!canSubmit) return;

    setIsLoading(true);

    try {
      // Verify credentials against hashed passwords
      const verification = await verifyUserCredentials(usernameOrEmail.trim(), password);
      
      if (!verification.success) {
        setLoginError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Check if verified role matches selected role
      if (verification.role !== role) {
        setLoginError(`Access denied. Selected role (${role}) doesn't match your credentials (${verification.role}).`);
        setIsLoading(false);
        return;
      }

      // Generate OTP for the verified role
      const otp = generateOTP(role!);
      
      // Show OTP to user (demo simulation)
      alert(`🔐 Your OTP code is: ${otp}\n\nIn production, this would be sent via SMS/email.`);
      
      setAuthStatus('password_verified');
      navigate('/otp');
    } catch (error) {
      setLoginError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
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
            Username
          </label>
          <input
            id="usernameOrEmail"
            className="input"
            type="text"
            autoComplete="username"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="doctor, pharmacist, or patient"
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
            placeholder="Enter your password"
          />
        </div>

        {loginError && (
          <div className="notice" style={{ marginTop: 0, borderColor: 'var(--error)', color: 'var(--error)' }}>
            {loginError}
          </div>
        )}

        <button
          type="submit"
          className="btn btn--primary"
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? 'Verifying...' : 'Login & Generate OTP'}
        </button>
      </form>

      <div className="demo-credentials" style={{ marginTop: 16, padding: 12, background: 'rgba(11, 18, 32, 0.55)', borderRadius: 8, fontSize: 12 }}>
        <strong>Demo Credentials (hashed passwords):</strong><br />
        • Username: <code>doctor</code>, Password: <code>doctor123</code><br />
        • Username: <code>pharmacist</code>, Password: <code>pharm123</code><br />
        • Username: <code>patient</code>, Password: <code>patient123</code><br />
        <em>Note: Passwords are stored as salted bcrypt hashes</em>
      </div>

      <div style={{ marginTop: 6 }}>
        <Link to="/">Back to role selection</Link>
      </div>
    </section>
  );
}
