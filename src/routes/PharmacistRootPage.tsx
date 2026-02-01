import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { usePrescriptionSession } from '../state/PresessionStateContext';
import { roleAccent } from '../routing/rolePaths';
import { computeDigitalSignature } from '../utils/hash';
import { decryptAndVerifyPrescription } from '../utils/crypto';
import QRCode from '../components/QRCode';
import AuditLogViewer from '../components/AuditLogViewer';
import type { QRPrescriptionData, Prescription } from '../types/prescription';
import './dashboard.css';

export default function PharmacistRootPage() {
  const { state } = useAppState();
  const { state: session, updatePrescriptionStatus, addAuditLogEntry } = usePrescriptionSession();
  const accent = roleAccent('pharmacist');

  const [qrJsonInput, setQrJsonInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'Not Verified' | 'Valid' | 'Invalid' | 'Tampered';
    prescriptionId?: string;
    message?: string;
  } | null>(null);

  const canVerify = useMemo(() => {
    return qrJsonInput.trim().length > 0;
  }, [qrJsonInput]);

  function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!canVerify) return;

    let qrData: QRPrescriptionData;
    try {
      qrData = JSON.parse(qrJsonInput.trim());
    } catch {
      setVerificationResult({
        status: 'Invalid',
        message: 'Invalid QR JSON format.',
      });
      addAuditLogEntry({
        actorRole: 'PHARMACIST',
        action: 'VERIFICATION_FAILED',
        prescriptionId: 'unknown',
        details: 'Invalid QR JSON format',
      });
      return;
    }

    if (!qrData.id || !qrData.digitalSignature) {
      setVerificationResult({
        status: 'Invalid',
        message: 'QR payload must contain id and digitalSignature.',
      });
      addAuditLogEntry({
        actorRole: 'PHARMACIST',
        action: 'VERIFICATION_FAILED',
        prescriptionId: qrData.id || 'unknown',
        details: 'Missing required fields in QR payload',
      });
      return;
    }

    const prescription = session.prescriptions.find((p: Prescription) => p.id === qrData.id);
    if (!prescription) {
      setVerificationResult({
        status: 'Invalid',
        prescriptionId: qrData.id,
        message: 'Prescription not found in session.',
      });
      addAuditLogEntry({
        actorRole: 'PHARMACIST',
        action: 'VERIFICATION_FAILED',
        prescriptionId: qrData.id,
        details: 'Prescription not found in session',
      });
      return;
    }

    // PROPER CRYPTOGRAPHIC WORKFLOW: Decrypt → Verify Signature
    let decryptedData: any;
    try {
      if (prescription.encryptedData) {
        // Decrypt the prescription data first (demonstrates proper workflow)
        // In a real system, pharmacist would have the private key to decrypt
        // For demo: We'll simulate having access to the private key
        const simulatedPrivateKey = `PRIVATE_KEY_${prescription.encryptedData.publicKey.split('_')[1]}`;
        decryptedData = decryptAndVerifyPrescription(
          prescription.encryptedData.encryptedData,
          prescription.encryptedData.encryptedKey,
          simulatedPrivateKey
        );
        
        console.log('🔓 Decrypted prescription data:', decryptedData);
      } else {
        // Fallback for non-encrypted prescriptions (backward compatibility)
        decryptedData = {
          patientName: prescription.patientName,
          medicineList: prescription.medicineList
        };
      }
    } catch (error) {
      setVerificationResult({
        status: 'Invalid',
        prescriptionId: prescription.id,
        message: 'Failed to decrypt prescription data.',
      });
      addAuditLogEntry({
        actorRole: 'PHARMACIST',
        action: 'VERIFICATION_FAILED',
        prescriptionId: prescription.id,
        details: 'Decryption failed - possible key mismatch',
      });
      return;
    }

    // Now verify digital signature on the decrypted data
    const expectedSignature = computeDigitalSignature({
      id: prescription.id,
      patientName: decryptedData.patientName,
      medicineList: decryptedData.medicineList,
      timestamp: prescription.timestamp,
    });

    if (qrData.digitalSignature === expectedSignature) {
      updatePrescriptionStatus(prescription.id, 'VERIFIED');
      setVerificationResult({
        status: 'Valid',
        prescriptionId: prescription.id,
        message: 'Signature matches after decryption. Prescription verified.',
      });
      addAuditLogEntry({
        actorRole: 'PHARMACIST',
        action: 'QR_VERIFIED',
        prescriptionId: prescription.id,
        details: 'Prescription verified after decryption',
      });
    } else {
      updatePrescriptionStatus(prescription.id, 'TAMPERED');
      setVerificationResult({
        status: 'Tampered',
        prescriptionId: prescription.id,
        message: 'Signature mismatch after decryption. Prescription may be tampered.',
      });
      addAuditLogEntry({
        actorRole: 'PHARMACIST',
        action: 'TAMPER_DETECTED',
        prescriptionId: prescription.id,
        details: 'Signature mismatch detected after decryption',
      });
    }
  }

  function onCopyQR(id: string, digitalSignature: string) {
    const payload: QRPrescriptionData = { id, digitalSignature };
    setQrJsonInput(JSON.stringify(payload, null, 2));
  }

  return (
    <section className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: accent }}>
          Pharmacist Verification Portal
        </h1>
        <p className="dashboard-subtitle">Verify prescription authenticity via QR payload</p>
      </header>

      <div className="verification-panel">
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Verify Prescription</h2>

        <form onSubmit={onVerify} aria-label="Verify prescription">
          <div className="form-row">
            <div className="field">
              <label className="label" htmlFor="qrJsonInput">
                QR JSON Payload
              </label>
              <textarea
                id="qrJsonInput"
                className="textarea"
                rows={4}
                value={qrJsonInput}
                onChange={(e) => setQrJsonInput(e.target.value)}
                placeholder='{"id":"...","digitalSignature":"..."}'
              />
            </div>
          </div>

          <button className="btn btn--primary" type="submit" disabled={!canVerify}>
            Verify
          </button>
        </form>

        {verificationResult && (
          <div
            className={`verification-result verification-result--${verificationResult.status.toLowerCase()}`}
          >
            <div className={`verification-status verification-status--${verificationResult.status.toLowerCase()}`}>
              Status: {verificationResult.status}
            </div>
            {verificationResult.prescriptionId && (
              <p className="prescription-field" style={{ margin: '4px 0' }}>
                <strong>ID:</strong> {verificationResult.prescriptionId}
              </p>
            )}
            {verificationResult.message && (
              <p className="prescription-field" style={{ margin: '4px 0' }}>
                {verificationResult.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="prescription-list">
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>All Prescriptions</h2>
        {session.prescriptions.length === 0 ? (
          <div className="empty-state">No prescriptions in session.</div>
        ) : (
          session.prescriptions.map((p: Prescription) => (
            <div key={p.id} className={`prescription-card prescription-card--${p.status.toLowerCase()}`}>
              <div className="prescription-header">
                <span className="prescription-id">{p.id}</span>
                <span className={`prescription-status prescription-status--${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </div>
              <div className="prescription-body">
                <p className="prescription-field">
                  <strong>Patient:</strong> {p.patientName}
                </p>
                <p className="prescription-field">
                  <strong>Doctor:</strong> {p.doctorName}
                </p>
                <p className="prescription-field">
                  <strong>Issued:</strong> {new Date(p.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => onCopyQR(p.id, p.digitalSignature)}
                style={{ marginTop: 8 }}
              >
                Copy QR Payload
              </button>
            </div>
          ))
        )}
      </div>

      <div className="notice">
        Paste QR JSON payload above to verify. Status updates persist across refresh.
      </div>

      <AuditLogViewer auditLog={session.auditLog} />
    </section>
  );
}
