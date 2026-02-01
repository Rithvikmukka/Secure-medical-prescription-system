# Secure Medical Prescription System

A comprehensive React + TypeScript application demonstrating advanced security features for medical prescription management.

## 🚀 Quick Start

```bash
npm install
npm run dev
# Access: http://localhost:5173/
```

**Demo Credentials:**
- Doctor: `doctor/doctor123`
- Pharmacist: `pharmacist/pharm123` 
- Patient: `patient/patient123`

## 🔐 Security Features

### Authentication System
- **Multi-Factor Authentication:** Password + 6-digit OTP
- **Secure Password Storage:** PBKDF2 salted hashing
- **Session Management:** Role-based authentication tokens
- **Rate Limiting:** OTP attempt protection

### Authorization & Access Control
- **Role-Based Access Control:** Doctor/Pharmacist/Patient roles
- **Medical Workflow:** Doctor creates → Pharmacist verifies → Patient views
- **Route Protection:** Programmatic permission enforcement
- **Audit Trail:** Complete action logging

### Cryptographic Implementation
- **AES-256 Encryption:** Prescription data protection
- **Hybrid Key Exchange:** AES + simulated RSA key exchange
- **Digital Signatures:** SHA-256 integrity verification
- **Proper Workflow:** Sign → Encrypt → Store → Decrypt → Verify

### Data Protection
- **Salted Password Hashing:** Prevents rainbow table attacks
- **Encoding Techniques:** Base64, URL, HTML encoding demonstrations
- **Tamper Detection:** Digital signature verification
- **Secure Storage:** Encrypted prescription data

## 🧪 Demo Walkthrough

### 1. Complete Security Workflow
1. Visit `http://localhost:5173/`
2. Select role → Login → OTP verification
3. Access role-specific dashboard

### 2. Encryption Demo (Doctor)
- Create prescription → See **ENCRYPTED** status
- View **[ENCRYPTED DATA]** placeholder
- Console shows cryptographic operations

### 3. Decryption Demo (Pharmacist)  
- Verify prescription → Console shows decrypted data
- Verification confirms integrity after decryption

### 4. Encoding Demo
- Create prescription → Console shows Base64 vs encryption
- Clear distinction between encoding and encryption

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── QRCode.tsx      # QR code generation
│   └── AuditLogViewer.tsx # Security audit display
├── routes/             # Page components
│   ├── RoleSelectPage.tsx
│   ├── LoginPage.tsx
│   ├── OtpPage.tsx
│   ├── DoctorRootPage.tsx
│   ├── PharmacistRootPage.tsx
│   └── PatientRootPage.tsx
├── state/              # Application state management
│   ├── AppStateContext.tsx
│   └── PresessionStateContext.tsx
├── utils/              # Security utilities
│   ├── crypto.ts       # AES encryption/decryption
│   ├── encoding.ts     # Base64 encoding demo
│   ├── passwordStore.ts # Hashed password storage
│   ├── hash.ts         # Digital signatures
│   ├── otp.ts          # OTP generation
│   └── storage.ts      # Data persistence
├── types/              # TypeScript definitions
│   ├── prescription.ts
│   └── audit.ts
└── routing/            # Route protection
    ├── RoleGuard.tsx
    └── rolePaths.ts
```

## 🔒 Security Documentation

**File:** `SECURITY_ANALYSIS.md`

**Comprehensive Analysis:**
- Multi-tier security architecture
- Attack vectors and mitigation strategies
- Risk assessment and threat modeling
- Medical context security considerations
- Implementation best practices

## 🛠️ Technology Stack

### Frontend
- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### Security Libraries
- **SJCL** - Stanford JavaScript Crypto Library
- **CryptoJS** - AES encryption implementation
- **QRCode.react** - QR code generation

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript** - Static type checking

## � Features

### Medical Prescription Workflow
- **Prescription Creation:** Doctors create encrypted prescriptions
- **Verification Process:** Pharmacists verify authenticity
- **Patient Access:** Patients view their own prescriptions
- **Audit Logging:** Complete forensic trail

### Security Demonstrations
- **Real-time Encryption:** Live AES encryption demonstration
- **Key Exchange:** Hybrid cryptography concepts
- **Digital Signatures:** Integrity and authenticity verification
- **Multi-Factor Auth:** Password + OTP security

### User Experience
- **Role-Based UI:** Tailored interfaces per role
- **Visual Security Indicators:** Clear status displays
- **Responsive Design:** Works across devices
- **Console Logging:** Detailed security operation traces

## � Deployment

### Development
```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

### Production Considerations
- **HTTPS Required:** Secure communication
- **Environment Variables:** Secure configuration
- **Database Integration:** Replace localStorage
- **Key Management:** Proper cryptographic key storage

## 📊 Architecture

### Security Layers
1. **Authentication Layer:** Multi-factor user verification
2. **Authorization Layer:** Role-based access control
3. **Encryption Layer:** Data protection at rest
4. **Audit Layer:** Comprehensive logging

### Data Flow
1. **User Authentication** → Role verification
2. **Prescription Creation** → Encryption + signing
3. **Verification Process** → Decryption + validation
4. **Audit Logging** → Immutable record keeping

---

**Note:** This application demonstrates security concepts for educational purposes. In production environments, additional security measures and compliance requirements would be necessary.
