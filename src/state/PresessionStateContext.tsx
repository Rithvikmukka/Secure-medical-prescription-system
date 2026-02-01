import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Prescription, VerificationResult } from '../types/prescription';

type PrescriptionSessionState = {
  prescriptions: Prescription[];
  verificationResult: VerificationResult | null;
};

type PrescriptionSessionContextValue = {
  state: PrescriptionSessionState;
  addPrescription: (p: Prescription) => void;
  updatePrescriptionStatus: (id: string, status: Prescription['status']) => void;
  setVerificationResult: (r: VerificationResult | null) => void;
};

const PrescriptionSessionContext = createContext<PrescriptionSessionContextValue | null>(null);

const initialState: PrescriptionSessionState = {
  prescriptions: [],
  verificationResult: null,
};

export function PrescriptionSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PrescriptionSessionState>(initialState);

  const value = useMemo<PrescriptionSessionContextValue>(() => {
    return {
      state,
      addPrescription: (p) => setState((s) => ({ ...s, prescriptions: [...s.prescriptions, p] })),
      updatePrescriptionStatus: (id, status) =>
        setState((s) => ({
          ...s,
          prescriptions: s.prescriptions.map((p) => (p.id === id ? { ...p, status } : p)),
        })),
      setVerificationResult: (r) => setState((s) => ({ ...s, verificationResult: r })),
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
