export type PrescriptionStatus = 'ISSUED' | 'VERIFIED' | 'INVALID' | 'TAMPERED';

export type EncryptionStatus = 'ENCRYPTED' | 'DECRYPTED';

export type Medicine = {
  name: string;
  dose: string;
  frequency: string;
};

export interface EncryptedPrescriptionData {
  encryptedData: string;
  encryptedKey: string;
  publicKey: string;
  // Note: privateKey would be stored securely by authorized parties
}

export interface Prescription {
  id: string;
  patientName: string; // Clear text for UI display (in production, this would also be encrypted)
  doctorName: string;
  timestamp: string;
  medicineList: Medicine[]; // Clear text for UI display
  status: PrescriptionStatus;
  digitalSignature: string;
  encryptionStatus: EncryptionStatus;
  encryptedData?: EncryptedPrescriptionData; // Only stored when encryption is enabled
}

export type QRPrescriptionData = {
  id: string;
  digitalSignature: string;
};

export type VerificationResult = {
  status: 'Not Verified' | 'Valid' | 'Invalid' | 'Tampered';
  summary?: {
    id?: string;
    patientName?: string;
    medicines?: string[];
    dosage?: string;
    notes?: string;
    doctorName?: string;
    createdAt?: Date;
  };
};
