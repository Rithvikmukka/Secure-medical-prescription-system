export type PrescriptionStatus = 'ISSUED' | 'VERIFIED' | 'INVALID' | 'TAMPERED';

export type Medicine = {
  name: string;
  dose: string;
  frequency: string;
};

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  timestamp: string;
  medicineList: Medicine[];
  status: PrescriptionStatus;
  digitalSignature: string;
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
