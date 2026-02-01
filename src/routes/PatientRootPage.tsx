import { useMemo } from 'react';
import { useAppState } from '../state/AppStateContext';
import { usePrescriptionSession } from '../state/PresessionStateContext';
import { roleAccent } from '../routing/rolePaths';
import './dashboard.css';

export default function PatientRootPage() {
  const { state } = useAppState();
  const { state: session } = usePrescriptionSession();
  const accent = roleAccent('patient');

  const mockPatientPrescriptions = useMemo(() => {
    return [
      {
        id: 'RX-1738424000000',
        doctorName: 'Dr. Smith',
        createdAt: new Date('2025-01-02T10:00:00'),
        medicines: ['Aspirin'],
        dosage: '500mg once daily',
        notes: 'Take after food',
        status: 'Issued' as const,
      },
      {
        id: 'RX-1738424000001',
        doctorName: 'Dr. Lee',
        createdAt: new Date('2025-01-03T14:30:00'),
        medicines: ['Ibuprofen', 'Paracetamol'],
        dosage: '400mg as needed',
        notes: 'Do not exceed 3 doses per day',
        status: 'Issued' as const,
      },
    ];
  }, []);

  return (
    <section className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: accent }}>
          Patient Prescription Viewer
        </h1>
        <p className="dashboard-subtitle">View prescriptions issued to you (session/mock data only)</p>
      </header>

      <div className="prescription-list">
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Your Prescriptions</h2>
        {mockPatientPrescriptions.length === 0 ? (
          <div className="empty-state">No prescriptions found.</div>
        ) : (
          mockPatientPrescriptions.map((p) => (
            <div key={p.id} className="prescription-card prescription-card--verified">
              <div className="prescription-header">
                <span className="prescription-id">{p.id}</span>
                <span className="prescription-status prescription-status--verified">Issued</span>
              </div>
              <div className="prescription-body">
                <p className="prescription-field">
                  <strong>Doctor:</strong> {p.doctorName}
                </p>
                <p className="prescription-field">
                  <strong>Medicines:</strong> {p.medicines.join(', ')}
                </p>
                <p className="prescription-field">
                  <strong>Dosage:</strong> {p.dosage}
                </p>
                {p.notes && (
                  <p className="prescription-field">
                    <strong>Notes:</strong> {p.notes}
                  </p>
                )}
                <p className="prescription-field">
                  <strong>Issued:</strong> {p.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notice">
        This is a view-only interface. No editing or verification actions are available. Data is
        session/mock only.
      </div>
    </section>
  );
}
