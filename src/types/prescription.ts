export type PrescriptionStatus = 'Unsigned' | 'Verified' | 'Invalid' | 'Tampered';

export type Prescription = {
  id: string;
  patientNameOrId: string;
  medicines: string[];
  dosage: string;
  notes?: string;
  createdAt: Date;
  status: PrescriptionStatus;
  createdBy: 'doctor';
};

export type VerificationResult = {
  status: 'Not Verified' | 'Valid' | 'Invalid' | 'Tampered';
  summary?: {
    id?: string;
    patientNameOrId?: string;
    medicines?: string[];
    dosage?: string;
    notes?: string;
    doctorName?: string;
    createdAt?: Date;
  };
};
