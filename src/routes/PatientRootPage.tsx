import { useMemo } from 'react';
import { useAppState } from '../state/AppStateContext';
import { usePrescriptionSession } from '../state/PresessionStateContext';
import { roleAccent } from '../routing/rolePaths';
import QRCode from '../components/QRCode';
import type { QRPrescriptionData } from '../types/prescription';
import './dashboard.css';

export default function PatientRootPage() {
  const { state } = useAppState();
  const { state: session } = usePrescriptionSession();
  const accent = roleAccent('patient');

  return (
    <section className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: accent }}>
          Patient Prescription Viewer
        </h1>
        <p className="dashboard-subtitle">View-only access to your prescriptions (session only)</p>
      </header>

      <div className="prescription-list">
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Your Prescriptions</h2>
        {session.prescriptions.length === 0 ? (
          <div className="empty-state">No prescriptions found.</div>
        ) : (
          session.prescriptions.map((p) => {
            const qrData: QRPrescriptionData = { id: p.id, digitalSignature: p.digitalSignature };
            return (
              <div key={p.id} className={`prescription-card prescription-card--${p.status.toLowerCase()}`}>
                <div className="prescription-header">
                  <span className="prescription-id">{p.id}</span>
                  <span className={`prescription-status prescription-status--${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </div>
                <div className="prescription-body">
                  <p className="prescription-field">
                    <strong>Doctor:</strong> {p.doctorName}
                  </p>
                  <p className="prescription-field">
                    <strong>Issued:</strong> {new Date(p.timestamp).toLocaleString()}
                  </p>
                  <p className="prescription-field">
                    <strong>Medicines:</strong>{' '}
                    {p.medicineList.map((m) => `${m.name} (${m.dose}, ${m.frequency})`).join('; ')}
                  </p>
                </div>
                <div style={{ marginTop: 12 }}>
                  <QRCode data={qrData} size={96} expandable />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="notice">
        This is a view-only interface. No editing or verification actions are available. Data is
        session-only.
      </div>
    </section>
  );
}
