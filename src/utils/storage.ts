import type { Prescription } from '../types/prescription';
import type { AuditLogEntry } from '../types/audit';

const STORAGE_KEYS = {
  PRESCRIPTIONS: 'medical-prescriptions',
  AUDIT_LOG: 'medical-audit-log',
} as const;

export function savePrescriptions(prescriptions: Prescription[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  } catch (error) {
    console.error('Failed to save prescriptions to localStorage:', error);
  }
}

export function loadPrescriptions(): Prescription[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load prescriptions from localStorage:', error);
    return [];
  }
}

export function saveAuditLog(log: AuditLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(log));
  } catch (error) {
    console.error('Failed to save audit log to localStorage:', error);
  }
}

export function loadAuditLog(): AuditLogEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load audit log from localStorage:', error);
    return [];
  }
}

export function appendAuditLogEntry(entry: AuditLogEntry): void {
  const existingLog = loadAuditLog();
  const updatedLog = [...existingLog, entry];
  saveAuditLog(updatedLog);
}
