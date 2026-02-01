import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, useAppState } from '../state/AppStateContext';

type RoleCardSpec = {
  role: Exclude<Role, null>;
  title: string;
  responsibility: string;
  securityResponsibility: string;
  accentCssVar: '--doctor' | '--pharmacist' | '--patient';
};

const roles: RoleCardSpec[] = [
  {
    role: 'doctor',
    title: 'Doctor',
    responsibility: 'Issues prescriptions for patients.',
    securityResponsibility: 'Digitally signs prescriptions before issuance.',
    accentCssVar: '--doctor',
  },
  {
    role: 'pharmacist',
    title: 'Pharmacist',
    responsibility: 'Dispenses medication using prescriptions.',
    securityResponsibility: 'Verifies prescription authenticity before dispensing.',
    accentCssVar: '--pharmacist',
  },
  {
    role: 'patient',
    title: 'Patient',
    responsibility: 'Views prescriptions issued by a doctor.',
    securityResponsibility: 'Cannot alter prescriptions; view-only access.',
    accentCssVar: '--patient',
  },
];

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const { setSelectedRole, state } = useAppState();

  function onSelect(role: Exclude<Role, null>) {
    setSelectedRole(role);
    navigate('/login');
  }

  const selectedRole = state.selectedRole;

  const roleLabel =
    selectedRole === null
      ? 'No role selected'
      : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);

  const selectedAccent =
    selectedRole === 'doctor'
      ? 'var(--doctor)'
      : selectedRole === 'pharmacist'
        ? 'var(--pharmacist)'
        : selectedRole === 'patient'
          ? 'var(--patient)'
          : 'rgba(183, 196, 221, 0.5)';

  return (
    <section>
      <h1 className="h1">Select your role</h1>
      <p className="subtle">
        This system demonstrates security concepts through role-based actions. Choose who you are to
        continue.
      </p>

      <div className="kv" aria-label="Current session role">
        <span className="dot" style={{ background: selectedAccent }} />
        <span>Selected role:</span>
        <strong style={{ color: selectedRole ? selectedAccent : 'var(--muted)' }}>{roleLabel}</strong>
      </div>

      {selectedRole !== null ? (
        <div className="role-context" aria-label="Role context">
          Role context locked for this session
        </div>
      ) : null}

      <div className="role-grid" style={{ marginTop: 14 }}>
        {roles.map((r) => {
          const accent = `var(${r.accentCssVar})`;
          const isSelected = selectedRole === r.role;
          const isDimmed = selectedRole !== null && !isSelected;

          return (
            <button
              key={r.role}
              type="button"
              className={
                `role-card${isSelected ? ' role-card--selected' : ''}${isDimmed ? ' role-card--dimmed' : ''}`
              }
              onClick={() => onSelect(r.role)}
              aria-label={`Select role: ${r.title}`}
              aria-pressed={isSelected}
              style={
                isSelected
                  ? ({ ['--role-accent' as any]: accent } as React.CSSProperties)
                  : undefined
              }
            >
              <div className="role-accent" style={{ background: accent }} />
              <h2 className="role-name" style={{ color: accent }}>
                {r.title}
              </h2>

              <div className="role-lines">
                <p className="role-line">
                  <strong>Responsibility:</strong> {r.responsibility}
                </p>
                <p className="role-line">
                  <strong>Security responsibility:</strong> {r.securityResponsibility}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="notice">
        Role selection is stored in the current session (in-memory). Authentication and OTP are added
        in later steps.
      </div>
    </section>
  );
}
