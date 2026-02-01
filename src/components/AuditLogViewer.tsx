import React from 'react';
import type { AuditLogEntry } from '../types/audit';
import '../routes/dashboard.css';

interface AuditLogViewerProps {
  auditLog: AuditLogEntry[];
}

export default function AuditLogViewer({ auditLog }: AuditLogViewerProps) {
  const getActionColor = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'PRESCRIPTION_ISSUED':
        return '#3b82f6'; // blue
      case 'QR_VERIFIED':
        return '#22c55e'; // green
      case 'VERIFICATION_FAILED':
        return '#ef4444'; // red
      case 'TAMPER_DETECTED':
        return '#a855f7'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  const getRoleColor = (role: AuditLogEntry['actorRole']) => {
    switch (role) {
      case 'DOCTOR':
        return '#3b82f6'; // blue
      case 'PHARMACIST':
        return '#22c55e'; // green
      case 'SYSTEM':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  if (auditLog.length === 0) {
    return (
      <div className="audit-log-viewer">
        <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>Audit Log</h3>
        <div className="empty-state">No audit entries yet.</div>
      </div>
    );
  }

  return (
    <div className="audit-log-viewer">
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>Audit Log</h3>
      <div className="audit-log-entries">
        {auditLog
          .slice()
          .reverse()
          .map((entry) => (
            <div key={entry.id} className="audit-log-entry">
              <div className="audit-log-header">
                <span className="audit-log-timestamp">{new Date(entry.timestamp).toLocaleString()}</span>
                <span
                  className="audit-log-role"
                  style={{ color: getRoleColor(entry.actorRole), borderColor: getRoleColor(entry.actorRole) }}
                >
                  {entry.actorRole}
                </span>
                <span
                  className="audit-log-action"
                  style={{ color: getActionColor(entry.action), borderColor: getActionColor(entry.action) }}
                >
                  {entry.action.replace('_', ' ')}
                </span>
              </div>
              <div className="audit-log-details">
                <span className="audit-log-prescription-id">ID: {entry.prescriptionId}</span>
                {entry.details && <span className="audit-log-message">{entry.details}</span>}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
