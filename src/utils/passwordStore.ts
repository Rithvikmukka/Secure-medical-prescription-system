import { hashPassword, verifyPassword } from './crypto';

// =============================================================================
// SIMULATED PASSWORD DATABASE (ACADEMIC DEMONSTRATION)
// =============================================================================

/**
 * Simulated user database with hashed passwords
 * 
 * In production: This would be a proper database with:
 * - Secure connection
 * - Proper indexing
 * - Backup strategies
 * - Access controls
 * 
 * For demo: Using localStorage to simulate persistent storage
 * 
 * SECURITY NOTE: Never store passwords in plaintext, always use salted hashes
 */
interface UserCredentials {
  username: string;
  hashedPassword: string;
  role: 'doctor' | 'pharmacist' | 'patient';
}

const STORAGE_KEY = 'medical-user-credentials';

/**
 * Initialize demo users with hashed passwords
 * 
 * DEMO CREDENTIALS:
 * - doctor / doctor123
 * - pharmacist / pharm123  
 * - patient / patient123
 * 
 * In production: Users would register with their own passwords
 */
export async function initializeDemoUsers(): Promise<void> {
  const demoUsers: UserCredentials[] = [
    {
      username: 'doctor',
      hashedPassword: await hashPassword('doctor123'),
      role: 'doctor'
    },
    {
      username: 'pharmacist',
      hashedPassword: await hashPassword('pharm123'),
      role: 'pharmacist'
    },
    {
      username: 'patient',
      hashedPassword: await hashPassword('patient123'),
      role: 'patient'
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
  console.log('🔐 Demo users initialized with hashed passwords');
  console.log('Credentials: doctor/doctor123, pharmacist/pharm123, patient/patient123');
}

/**
 * Get all stored user credentials
 */
export function getStoredUsers(): UserCredentials[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse stored user credentials:', error);
    return [];
  }
}

/**
 * Verify user credentials against stored hashes
 * 
 * SECURITY FLOW:
 * 1. Find user by username
 * 2. Compare provided password with stored hash
 * 3. Return role if verification succeeds
 * 
 * TIMING ATTACK PREVENTION: In production, use constant-time comparison
 */
export async function verifyUserCredentials(
  username: string, 
  password: string
): Promise<{ success: boolean; role?: 'doctor' | 'pharmacist' | 'patient' }> {
  const users = getStoredUsers();
  const user = users.find(u => u.username === username);
  
  if (!user) {
    // Use consistent timing to prevent username enumeration attacks
    await hashPassword('dummy'); // Perform same hashing operation
    return { success: false };
  }
  
  const isValidPassword = await verifyPassword(password, user.hashedPassword);
  
  if (isValidPassword) {
    return { success: true, role: user.role };
  }
  
  return { success: false };
}

/**
 * Check if demo users are initialized
 */
export function areDemoUsersInitialized(): boolean {
  const users = getStoredUsers();
  return users.length > 0;
}
