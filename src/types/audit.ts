export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: 'DOCTOR' | 'PHARMACIST' | 'SYSTEM';
  action: 'PRESCRIPTION_ISSUED' | 'QR_VERIFIED' | 'VERIFICATION_FAILED' | 'TAMPER_DETECTED';
  prescriptionId: string;
  details?: string;
}
