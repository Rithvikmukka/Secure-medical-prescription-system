import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { QRPrescriptionData } from '../types/prescription';

interface QRCodeProps {
  data: QRPrescriptionData;
  size?: number;
  className?: string;
  expandable?: boolean;
}

export default function QRCode({ data, size = 128, className, expandable = false }: QRCodeProps) {
  const [expanded, setExpanded] = React.useState(false);

  const jsonString = JSON.stringify(data);

  if (expandable) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--muted)',
            fontSize: '12px',
          }}
        >
          {expanded ? 'Hide QR' : 'Show QR'}
        </button>
        {expanded && (
          <div style={{ marginTop: '8px' }}>
            <QRCodeSVG value={jsonString} size={size} level="M" includeMargin />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <QRCodeSVG value={jsonString} size={size} level="M" includeMargin />
    </div>
  );
}
