import React, { createContext, useContext, useMemo, useState } from 'react';

export type Role = 'doctor' | 'pharmacist' | 'patient' | null;
export type AuthStatus = 'unauthenticated' | 'password_verified' | 'otp_verified' | 'authenticated';

export type OtpState = {
  code: string | null;
  expiresAt: number | null;
  attempts: number;
};

export type AppState = {
  selectedRole: Role;
  authStatus: AuthStatus;
  otp: OtpState;
};

type AppStateContextValue = {
  state: AppState;
  setSelectedRole: (role: Role) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setOtp: (otp: OtpState) => void;
  resetSession: () => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

const initialState: AppState = {
  selectedRole: null,
  authStatus: 'unauthenticated',
  otp: {
    code: null,
    expiresAt: null,
    attempts: 0,
  },
};

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const value = useMemo<AppStateContextValue>(() => {
    return {
      state,
      setSelectedRole: (role) => setState((s) => ({ ...s, selectedRole: role })),
      setAuthStatus: (status) => setState((s) => ({ ...s, authStatus: status })),
      setOtp: (otp) => setState((s) => ({ ...s, otp })),
      resetSession: () => setState(initialState),
    };
  }, [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
