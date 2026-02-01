/**
 * Simple hash utility for demo purposes.
 * In production, use a proper cryptographic hash (SHA-256, etc.).
 */
export function computeHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Compute digital signature for a prescription.
 * Concatenates key fields and hashes them.
 */
export function computeDigitalSignature(prescription: {
  id: string;
  patientName: string;
  medicineList: { name: string; dose: string; frequency: string }[];
  timestamp: string;
}): string {
  const medicineStr = prescription.medicineList
    .map((m) => `${m.name}|${m.dose}|${m.frequency}`)
    .join(',');
  const payload = `${prescription.id}|${prescription.patientName}|${medicineStr}|${prescription.timestamp}`;
  return computeHash(payload);
}
