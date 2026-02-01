import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Prescription, VerificationResult } from '../types/prescription';
import type { AuditLogEntry } from '../types/audit';
import { savePrescriptions, loadPrescriptions, saveAuditLog, loadAuditLog } from '../utils/storage';

type PrescriptionSessionState = {
  prescriptions: Prescription[];
  verificationResult: VerificationResult | null;
  auditLog: AuditLogEntry[];
};

type PrescriptionSessionContextValue = {
  state: PrescriptionSessionState;
  addPrescription: (p: Prescription) => void;
  updatePrescriptionStatus: (id: string, status: Prescription['status']) => void;
  setVerificationResult: (r: VerificationResult | null) => void;
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
};

const PrescriptionSessionContext = createContext<PrescriptionSessionContextValue | null>(null);

export function PrescriptionSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PrescriptionSessionState>(() => ({
    prescriptions: loadPrescriptions(),
    verificationResult: null,
    auditLog: loadAuditLog(),
  }));

  useEffect(() => {
    savePrescriptions(state.prescriptions);
  }, [state.prescriptions]);

  useEffect(() => {
    saveAuditLog(state.auditLog);
  }, [state.auditLog]);

  const value = useMemo<PrescriptionSessionContextValue>(() => {
    return {
      state,
      addPrescription: (p) =>
        setState((s) => ({
          ...s,
          prescriptions: [...s.prescriptions, p],
        })),
      updatePrescriptionStatus: (id, status) =>
        setState((s) => ({
          ...s,
          prescriptions: s.prescriptions.map((p) => (p.id === id ? { ...p, status } : p)),
        })),
      setVerificationResult: (r) => setState((s) => ({ ...s, verificationResult: r })),
      addAuditLogEntry: (entry) =>
        setState((s) => ({
          ...s,
          auditLog: [
            ...s.auditLog,
            {
              ...entry,
              id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
            },
          ],
        })),
    };
  }, [state]);

  return (
    <PrescriptionSessionContext.Provider value={value}>
      {children}
    </PrescriptionSessionContext.Provider>
  );
}

export function usePrescriptionSession() {
  const ctx = useContext(PrescriptionSessionContext);
  if (!ctx) throw new Error('usePrescriptionSession must be used within PrescriptionSessionProvider');
  return ctx;
}
