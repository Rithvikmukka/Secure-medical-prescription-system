import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { usePrescriptionSession } from '../state/PresessionStateContext';
import { roleAccent } from '../routing/rolePaths';
import { generateUUID } from '../utils/uuid';
import { computeDigitalSignature } from '../utils/hash';
import QRCode from '../components/QRCode';
import AuditLogViewer from '../components/AuditLogViewer';
import type { Prescription, Medicine, QRPrescriptionData } from '../types/prescription';
import './dashboard.css';

export default function DoctorRootPage() {
  const { state } = useAppState();
  const { state: session, addPrescription, addAuditLogEntry } = usePrescriptionSession();
  const accent = roleAccent('doctor');

  const [patientName, setPatientName] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([{ name: '', dose: '', frequency: '' }]);
  const [notes, setNotes] = useState('');

  const canSubmit = useMemo(() => {
    return (
      patientName.trim().length > 0 &&
      medicines.every((m) => m.name.trim().length > 0 && m.dose.trim().length > 0 && m.frequency.trim().length > 0)
    );
  }, [patientName, medicines]);

  function addMedicineRow() {
    setMedicines([...medicines, { name: '', dose: '', frequency: '' }]);
  }

  function removeMedicineRow(index: number) {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  }

  function updateMedicine(index: number, field: keyof Medicine, value: string) {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const id = generateUUID();
    const timestamp = new Date().toISOString();
    const prescription: Prescription = {
      id,
      patientName: patientName.trim(),
      doctorName: 'Dr. Smith',
      timestamp,
      medicineList: medicines.map((m) => ({
        name: m.name.trim(),
        dose: m.dose.trim(),
        frequency: m.frequency.trim(),
      })),
      status: 'ISSUED',
      digitalSignature: computeDigitalSignature({
        id,
        patientName: patientName.trim(),
        medicineList: medicines.map((m) => ({
          name: m.name.trim(),
          dose: m.dose.trim(),
          frequency: m.frequency.trim(),
        })),
        timestamp,
      }),
    };

    addPrescription(prescription);
    addAuditLogEntry({
      actorRole: 'DOCTOR',
      action: 'PRESCRIPTION_ISSUED',
      prescriptionId: id,
      details: `Issued to ${patientName.trim()} with ${medicines.length} medicine(s)`,
    });

    setPatientName('');
    setMedicines([{ name: '', dose: '', frequency: '' }]);
    setNotes('');
  }

  return (
    <section className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: accent }}>
          Doctor Dashboard
        </h1>
        <p className="dashboard-subtitle">Issue digitally signed prescriptions (session only)</p>
      </header>

      <form className="dashboard-form" onSubmit={onSubmit} aria-label="Issue prescription">
        <div className="form-row">
          <div className="field">
            <label className="label" htmlFor="patientName">
              Patient Name
            </label>
            <input
              id="patientName"
              className="input"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label className="label">Medicine List</label>
            {medicines.map((med, idx) => (
              <div key={idx} className="form-row form-row--2" style={{ marginBottom: 8 }}>
                <input
                  className="input"
                  type="text"
                  placeholder="Name"
                  value={med.name}
                  onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                  autoComplete="off"
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Dose"
                  value={med.dose}
                  onChange={(e) => updateMedicine(idx, 'dose', e.target.value)}
                  autoComplete="off"
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                  autoComplete="off"
                />
                {medicines.length > 1 && (
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => removeMedicineRow(idx)}
                    style={{ padding: '10px 12px' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn--secondary" onClick={addMedicineRow}>
              Add Medicine
            </button>
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
                    <strong>Patient:</strong> {p.patientName}
                  </p>
                  <p className="prescription-field">
                    <strong>Doctor:</strong> {p.doctorName}
                  </p>
                  <p className="prescription-field">
                    <strong>Medicines:</strong>{' '}
                    {p.medicineList.map((m) => `${m.name} (${m.dose}, ${m.frequency})`).join('; ')}
                  </p>
                  <p className="prescription-field">
                    <strong>Issued:</strong> {new Date(p.timestamp).toLocaleString()}
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
        Prescriptions persist across refresh. QR codes contain {`{id, digitalSignature}`} for verification.
      </div>

      <AuditLogViewer auditLog={session.auditLog} />
    </section>
  );
}
