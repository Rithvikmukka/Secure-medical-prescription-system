import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { usePrescriptionSession } from '../state/PresessionStateContext';
import { roleAccent } from '../routing/rolePaths';
import type { Prescription } from '../types/prescription';
import './dashboard.css';

export default function DoctorRootPage() {
  const { state } = useAppState();
  const { state: session, addPrescription } = usePrescriptionSession();
  const accent = roleAccent('doctor');

  const [patientNameOrId, setPatientNameOrId] = useState('');
  const [medicines, setMedicines] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');

  const canSubmit = useMemo(() => {
    return patientNameOrId.trim().length > 0 && medicines.trim().length > 0 && dosage.trim().length > 0;
  }, [patientNameOrId, medicines, dosage]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const newPrescription: Prescription = {
      id: `RX-${Date.now()}`,
      patientNameOrId: patientNameOrId.trim(),
      medicines: medicines.split(',').map((m) => m.trim()).filter(Boolean),
      dosage: dosage.trim(),
      notes: notes.trim() || undefined,
      createdAt: new Date(),
      status: 'Unsigned',
      createdBy: 'doctor',
    };

    addPrescription(newPrescription);

    setPatientNameOrId('');
    setMedicines('');
    setDosage('');
    setNotes('');
  }

  return (
    <section className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: accent }}>
          Doctor Dashboard
        </h1>
        <p className="dashboard-subtitle">Issue and manage prescriptions (session only)</p>
      </header>

      <form className="dashboard-form" onSubmit={onSubmit} aria-label="Issue prescription">
        <div className="form-row">
          <div className="field">
            <label className="label" htmlFor="patientNameOrId">
              Patient Name / ID
            </label>
            <input
              id="patientNameOrId"
              className="input"
              type="text"
              value={patientNameOrId}
              onChange={(e) => setPatientNameOrId(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-row form-row--2">
          <div className="field">
            <label className="label" htmlFor="medicines">
              Medicine name(s)
            </label>
            <input
              id="medicines"
              className="input"
              type="text"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              autoComplete="off"
              placeholder="e.g. Aspirin, Ibuprofen"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="dosage">
              Dosage
            </label>
            <input
              id="dosage"
              className="input"
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              autoComplete="off"
              placeholder="e.g. 500mg twice daily"
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            className="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional instructions..."
          />
        </div>

        <button className="btn btn--primary" type="submit" disabled={!canSubmit}>
          Issue Prescription
        </button>
      </form>

      <div className="prescription-list">
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Issued Prescriptions (Session Only)</h2>
        {session.prescriptions.length === 0 ? (
          <div className="empty-state">No prescriptions issued in this session.</div>
        ) : (
          session.prescriptions.map((p) => (
            <div key={p.id} className={`prescription-card prescription-card--${p.status.toLowerCase()}`}>
              <div className="prescription-header">
                <span className="prescription-id">{p.id}</span>
                <span className={`prescription-status prescription-status--${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </div>
              <div className="prescription-body">
                <p className="prescription-field">
                  <strong>Patient:</strong> {p.patientNameOrId}
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
                  <strong>Created:</strong> {p.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notice">
        Prescriptions are stored only in the current session. No backend persistence or cryptographic
        signing is implemented yet.
      </div>
    </section>
  );
}
