const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;

interface OTPData {
  code: string;
  expiresAt: number;
  attempts: number;
  role: string;
}

const SESSION_KEY = 'mfa-otp';

export function generateOTP(role: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  
  const otpData: OTPData = {
    code,
    expiresAt,
    attempts: 0,
    role,
  };
  
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(otpData));
  console.log(`🔐 OTP for ${role}: ${code} (expires in ${OTP_EXPIRY_MINUTES} minutes)`);
  
  return code;
}

export function verifyOTP(inputCode: string): { success: boolean; error?: string; role?: string } {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) {
    return { success: false, error: 'No OTP found. Please request a new one.' };
  }

  const otpData: OTPData = JSON.parse(stored);
  
  // Check expiration
  if (Date.now() > otpData.expiresAt) {
    sessionStorage.removeItem(SESSION_KEY);
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  // Check attempts
  if (otpData.attempts >= MAX_ATTEMPTS) {
    sessionStorage.removeItem(SESSION_KEY);
    return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
  }

  // Increment attempts
  otpData.attempts++;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(otpData));

  // Verify code
  if (inputCode === otpData.code) {
    sessionStorage.removeItem(SESSION_KEY);
    return { success: true, role: otpData.role };
  }

  const remainingAttempts = MAX_ATTEMPTS - otpData.attempts;
  return {
    success: false,
    error: remainingAttempts > 0 
      ? `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`
      : 'Too many failed attempts. Please request a new OTP.',
  };
}

export function getStoredOTP(): OTPData | null {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  
  const otpData: OTPData = JSON.parse(stored);
  
  // Check if expired
  if (Date.now() > otpData.expiresAt) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
  
  return otpData;
}

export function clearOTP(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getRemainingTime(): number {
  const otpData = getStoredOTP();
  if (!otpData) return 0;
  
  return Math.max(0, Math.ceil((otpData.expiresAt - Date.now()) / 1000));
}
