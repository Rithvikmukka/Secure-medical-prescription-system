import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { usePrescriptionSession } from '../state/PresessionStateContext';
import { roleAccent } from '../routing/rolePaths';
import type { VerificationResult } from '../types/prescription';
import './dashboard.css';

export default function PharmacistRootPage() {
  const { state } = useAppState();
  const { state: session, setVerificationResult } = usePrescriptionSession();
  const accent = roleAccent('pharmacist');

  const [prescriptionId, setPrescriptionId] = useState('');

  const canVerify = useMemo(() => {
    return prescriptionId.trim().length > 0;
  }, [prescriptionId]);

  function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!canVerify) return;

    const mockResult: VerificationResult = {
      status: 'Not Verified',
      summary: {
        id: prescriptionId.trim(),
        patientNameOrId: 'Demo Patient',
        medicines: ['Aspirin'],
        dosage: '500mg once daily',
        notes: 'Take after food',
        doctorName: 'Dr. Smith',
        createdAt: new Date(),
      },
    };

    setVerificationResult(mockResult);
  }

  function onSimulatedScan() {
    const mockId = `RX-${Date.now()}`;
    setPrescriptionId(mockId);
  }

  const result = session.verificationResult;

  return (
    <section className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: accent }}>
          Pharmacist Verification Portal
        </h1>
        <p className="dashboard-subtitle">Verify prescription authenticity (UI simulation only)</p>
      </header>

      <div className="verification-panel">
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Verify Prescription</h2>

        <form onSubmit={onVerify} aria-label="Verify prescription">
          <div className="form-row">
            <div className="field">
              <label className="label" htmlFor="prescriptionId">
                Prescription ID
              </label>
              <input
                id="prescriptionId"
                className="input"
                type="text"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                autoComplete="off"
                placeholder="e.g. RX-123456789"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn--primary" type="submit" disabled={!canVerify}>
              Verify
            </button>
            <button className="btn btn--secondary" type="button" onClick={onSimulatedScan}>
              Simulate QR Scan
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`verification-result verification-result--${result.status.toLowerCase().replace(' ', '-')}`}
          >
            <div className={`verification-status verification-status--${result.status.toLowerCase().replace(' ', '-')}`}>
              Status: {result.status}
            </div>
            {result.summary && (
              <div className="prescription-body">
                <p className="prescription-field">
                  <strong>ID:</strong> {result.summary.id}
                </p>
                <p className="prescription-field">
                  <strong>Patient:</strong> {result.summary.patientNameOrId}
                </p>
                <p className="prescription-field">
                  <strong>Medicines:</strong> {result.summary.medicines?.join(', ')}
                </p>
                <p className="prescription-field">
                  <strong>Dosage:</strong> {result.summary.dosage}
                </p>
                {result.summary.notes && (
                  <p className="prescription-field">
                    <strong>Notes:</strong> {result.summary.notes}
                  </p>
                )}
                <p className="prescription-field">
                  <strong>Doctor:</strong> {result.summary.doctorName}
                </p>
                <p className="prescription-field">
                  <strong>Created:</strong> {result.summary.createdAt?.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="notice">
        Verification is UI-simulated only. No backend, cryptography, or real QR scanning is
        implemented yet.
      </div>
    </section>
  );
}
