import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppStateContext';
import { verifyOTP, getStoredOTP, getRemainingTime, clearOTP } from '../utils/otp';
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
  const { state, setAuthStatus } = useAppState();
  const navigate = useNavigate();
  
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const role = state.selectedRole;
  if (role === null) {
    navigate('/');
    return null;
  }

  const accent = roleAccent(role);
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  useEffect(() => {
    const storedOTP = getStoredOTP();
    if (!storedOTP) {
      navigate('/login');
      return;
    }

    if (storedOTP.role !== role) {
      navigate('/login');
      return;
    }

    setRemainingTime(getRemainingTime());

    const timer = setInterval(() => {
      const time = getRemainingTime();
      setRemainingTime(time);
      if (time === 0) {
        setError('OTP has expired. Please request a new one.');
        clearOTP();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = verifyOTP(otpCode);
    
    if (result.success) {
      setAuthStatus('authenticated');
      navigate(`/${role}`);
    } else {
      setError(result.error || 'Verification failed');
      
      if (result.error?.includes('expired') || result.error?.includes('Too many failed')) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }
    
    setIsLoading(false);
  };

  const handleResend = () => {
    clearOTP();
    navigate('/login');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="auth-shell">
      <h1 className="h1">OTP Verification</h1>
      <p className="subtle">Enter the 6-digit code sent to your device</p>

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

      <form onSubmit={handleSubmit} className="form" style={{ marginTop: 24 }}>
        <div className="field">
          <label className="label" htmlFor="otp">
            OTP Code
          </label>
          <input
            id="otp"
            className="input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            autoComplete="one-time-code"
            autoFocus
          />
          {remainingTime > 0 && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              Expires in {formatTime(remainingTime)}
            </div>
          )}
        </div>

        {error && (
          <div className="notice" style={{ marginTop: 0, borderColor: 'var(--error)', color: 'var(--error)' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        </div>
      </form>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          type="button"
          className="btn-link"
          onClick={() => navigate('/login')}
          style={{ fontSize: 12, color: 'var(--muted)' }}
        >
          ← Back to login
        </button>
      </div>
    </section>
  );
}
