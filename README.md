# Secure Medical Prescription System

A React and TypeScript application built for a Foundations of Cyber Security course project. It demonstrates a prescription workflow for doctors, pharmacists, and patients, with browser-based authentication, encryption, and audit logging.

## Workflow

- Doctors create prescriptions and generate QR codes containing the prescription ID and a verification value.
- Pharmacists submit the QR payload to decrypt prescription data and compare the verification value.
- Patients have a read-only view of saved prescriptions.
- Prescription creation and verification events appear in an audit log.

## Run locally

Install Node.js and npm, then run:

```sh
git clone https://github.com/Rithvikmukka/Secure-medical-prescription-system.git
cd Secure-medical-prescription-system
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To build and preview the application:

```sh
npm run build
npm run preview
```

No backend or external database is required. Prescription records, audit logs, and demo password hashes are stored in the browser's local storage.

## Demo accounts

Select the matching role before signing in.

| Role | Username | Password |
| --- | --- | --- |
| Doctor | `doctor` | `doctor123` |
| Pharmacist | `pharmacist` | `pharm123` |
| Patient | `patient` | `patient123` |

After a successful password check, the application displays a six-digit OTP in an alert. Enter it on the verification page to continue. OTP delivery is simulated; no email or SMS is sent.

To try the prescription workflow, create a prescription as a doctor, then sign in as a pharmacist in the same browser and use the QR payload to verify it. Clear the application's browser storage to reset saved data.

## Security implementation

- **Password hashing:** Salted PBKDF2 through SJCL, using 1,000 iterations for the demonstration.
- **Prescription encryption:** AES encryption and decryption through CryptoJS.
- **Role-based screens:** React route guards and role-specific views for doctors, pharmacists, and patients.
- **OTP verification:** A local demonstration with expiry and an attempt limit.
- **Audit logging:** Prescription and verification events recorded in browser storage.

This is an educational prototype. Authentication and authorization run in the browser, and local data can be inspected or modified by the user. The RSA key exchange is simulated with Base64 encoding. The prescription verification value uses a simple non-cryptographic hash, rather than SHA-256 or a digital signature. Audit logs are editable local records.

A deployed system would need server-side authorization, secure session and key management, a real OTP provider, cryptographic signature verification, and protected data and log storage. Use sample data when exploring this project.

## Project structure

```text
src/
  components/   QR code display and audit log viewer
  routes/       Login, OTP, and role-specific pages
  routing/      Route guards and role paths
  state/        Authentication and prescription state
  types/        Prescription and audit log types
  utils/        Encryption, hashing, OTP, and storage helpers
```

Built with React 18, TypeScript, Vite, React Router, CryptoJS, SJCL, and qrcode.react.

[Security analysis](SECURITY_ANALYSIS.md) contains the coursework threat model and risk assessment. Some descriptions there refer to intended production controls; the implementation notes above describe the current code.
