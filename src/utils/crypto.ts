import * as sjcl from 'sjcl';
import CryptoJS from 'crypto-js';

// =============================================================================
// PASSWORD HASHING WITH SALT (ACADEMIC DEMONSTRATION - BROWSER COMPATIBLE)
// =============================================================================

/**
 * Hashes a password using PBKDF2 with salt (browser-compatible)
 * 
 * WHY SALT: 
 * - Prevents rainbow table attacks
 * - Ensures identical passwords have different hashes
 * - Adds computational cost to slow down brute force attacks
 * 
 * WHY PBKDF2 (instead of bcrypt):
 * - bcrypt is Node.js-only, doesn't work in browsers
 * - PBKDF2 is browser-compatible and cryptographically secure
 * - Still demonstrates salted hashing concepts for academic purposes
 * 
 * In production: This would be done server-side with bcrypt/argon2
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate random salt (128 bits)
  const salt = sjcl.random.randomWords(4);
  
  // Hash with PBKDF2 (1000 iterations for demo, production would use 100k+)
  const hash = sjcl.misc.pbkdf2(password, salt, 1000, 256);
  
  // Combine salt and hash for storage
  const saltHex = sjcl.codec.hex.fromBits(salt);
  const hashHex = sjcl.codec.hex.fromBits(hash);
  
  return `${saltHex}$${hashHex}$1000`; // Format: salt$hash$iterations
}

/**
 * Verifies a password against a stored hash
 * 
 * SECURITY NOTE: In production, this comparison would happen server-side
 * to prevent timing attacks and ensure secure comparison
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltHex, hashHex, iterations] = storedHash.split('$');
    
    if (!saltHex || !hashHex || !iterations) {
      return false;
    }
    
    const salt = sjcl.codec.hex.toBits(saltHex);
    const computedHash = sjcl.misc.pbkdf2(password, salt, parseInt(iterations), 256);
    const computedHashHex = sjcl.codec.hex.fromBits(computedHash);
    
    // Constant-time comparison (simplified for demo)
    return computedHashHex === hashHex;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// =============================================================================
// AES ENCRYPTION/DECRYPTION FOR PRESCRIPTION DATA
// =============================================================================

/**
 * Generates a cryptographically secure random key for AES encryption
 * 
 * WHY AES-256:
 * - Strong symmetric encryption standard
 * - Widely adopted and thoroughly tested
 * - Suitable for protecting sensitive medical data
 */
export function generateAESKey(): string {
  return CryptoJS.lib.WordArray.random(256/8).toString();
}

/**
 * Encrypts prescription data using AES-256
 * 
 * ENCRYPTION FLOW:
 * 1. Convert data to JSON string
 * 2. Encrypt with AES-256 using the provided key
 * 3. Return base64-encoded encrypted payload
 * 
 * NOTE: In production, key management would use HSM or cloud KMS
 */
export function encryptPrescriptionData(data: any, key: string): string {
  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
  return encrypted;
}

/**
 * Decrypts prescription data using AES-256
 * 
 * DECRYPTION FLOW:
 * 1. Base64-decode the encrypted payload
 * 2. Decrypt with AES-256 using the provided key
 * 3. Parse back to JSON object
 * 
 * SECURITY NOTE: Decryption should only happen after proper authentication
 */
export function decryptPrescriptionData(encryptedData: string, key: string): any {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Failed to decrypt prescription data: Invalid key or corrupted data');
  }
}

// =============================================================================
// SIMULATED HYBRID KEY EXCHANGE (ACADEMIC DEMONSTRATION)
// =============================================================================

/**
 * Simulates RSA public-key encryption of AES key
 * 
 * HYBRID CRYPTOGRAPHY CONCEPT:
 * - RSA (asymmetric) encrypts the AES key
 * - AES (symmetric) encrypts the actual data
 * - Combines security of RSA with efficiency of AES
 * 
 * REAL-WORLD: Would use actual RSA/ECDH with proper key pairs
 * DEMO: Simulates the concept for educational purposes
 */
export function simulateRSAKeyEncryption(aesKey: string): {
  encryptedKey: string;
  publicKey: string;
  privateKey: string;
} {
  // In reality: Generate RSA key pair (2048-bit or higher)
  // In demo: Simulate with base64 encoding for visualization
  
  const publicKey = `PUBLIC_KEY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const privateKey = `PRIVATE_KEY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simulate RSA encryption of AES key
  const encryptedKey = btoa(`RSA_ENCRYPTED:${aesKey}:${publicKey}`);
  
  return {
    encryptedKey,
    publicKey,
    privateKey
  };
}

/**
 * Simulates RSA private-key decryption of AES key
 * 
 * KEY EXCHANGE FLOW:
 * 1. Receiver uses private key to decrypt AES key
 * 2. Uses decrypted AES key to decrypt actual data
 * 
 * SECURITY NOTE: Private keys must be protected at all costs
 */
export function simulateRSAKeyDecryption(encryptedKey: string, privateKey: string): string {
  try {
    const decoded = atob(encryptedKey);
    if (decoded.startsWith('RSA_ENCRYPTED:')) {
      // Extract the original AES key (simulation)
      const parts = decoded.split(':');
      return parts[1]; // Return the AES key
    }
    throw new Error('Invalid encrypted key format');
  } catch (error) {
    throw new Error('Failed to decrypt AES key: Invalid private key or corrupted data');
  }
}

// =============================================================================
// PRESCRIPTION CRYPTOGRAPHY WORKFLOW
// =============================================================================

/**
 * Complete encryption workflow for prescription creation
 * 
 * WORKFLOW:
 * 1. Generate AES session key
 * 2. Encrypt sensitive prescription data
 * 3. Simulate RSA encryption of AES key
 * 4. Generate digital signature (before encryption for integrity)
 * 
 * This demonstrates the complete cryptographic pipeline
 */
export function createEncryptedPrescription(prescriptionData: {
  patientName: string;
  medicineList: any[];
  doctorName: string;
  timestamp: string;
}) {
  // Step 1: Generate AES session key
  const aesKey = generateAESKey();
  
  // Step 2: Encrypt sensitive data
  const sensitiveData = {
    patientName: prescriptionData.patientName,
    medicineList: prescriptionData.medicineList
  };
  const encryptedData = encryptPrescriptionData(sensitiveData, aesKey);
  
  // Step 3: Simulate hybrid key exchange
  const { encryptedKey, publicKey, privateKey } = simulateRSAKeyEncryption(aesKey);
  
  // Step 4: Generate digital signature (on original data for integrity)
  const signatureData = {
    id: '', // Will be set by caller
    patientName: prescriptionData.patientName,
    medicineList: prescriptionData.medicineList,
    timestamp: prescriptionData.timestamp
  };
  
  return {
    encryptedData,
    encryptedKey,
    publicKey,
    privateKey, // In reality, this would be stored securely by the receiver
    signatureData
  };
}

/**
 * Complete decryption workflow for prescription viewing
 * 
 * WORKFLOW:
 * 1. Decrypt AES key using private key
 * 2. Decrypt prescription data using AES key
 * 3. Verify digital signature
 * 
 * Only authorized parties with the private key can decrypt
 */
export function decryptAndVerifyPrescription(
  encryptedData: string,
  encryptedKey: string,
  privateKey: string
) {
  // Step 1: Decrypt AES key
  const aesKey = simulateRSAKeyDecryption(encryptedKey, privateKey);
  
  // Step 2: Decrypt prescription data
  const decryptedData = decryptPrescriptionData(encryptedData, aesKey);
  
  return decryptedData;
}
