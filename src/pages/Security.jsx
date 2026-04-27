import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const PII_TYPES = [
  { type: 'TFN',          label: 'Tax File Number',       color: '#EF4444', example: '872 493 157' },
  { type: 'ABN',          label: 'Business Number',       color: '#F59E0B', example: '51 824 753 556' },
  { type: 'ACN',          label: 'Company Number',        color: '#F97316', example: '123 456 789' },
  { type: 'NAME',         label: 'Full Name',             color: '#06B6D4', example: 'James Thornton' },
  { type: 'PHONE',        label: 'Phone Number',          color: '#8B5CF6', example: '0412 847 293' },
  { type: 'EMAIL',        label: 'Email Address',         color: '#10B981', example: 'j.t@email.com' },
  { type: 'CREDIT CARD',  label: 'Credit Card',           color: '#EC4899', example: '4532 **** **** 9012' },
  { type: 'BSB',          label: 'Bank BSB',              color: '#3B82F6', example: '062-123' },
  { type: 'PASSPORT',     label: 'Passport Number',       color: '#14B8A6', example: 'PA 1234567' },
  { type: 'DRIVERS LIC',  label: "Driver's Licence",      color: '#A78BFA', example: 'AB123456' },
  { type: 'MEDICARE',     label: 'Medicare Number',       color: '#F472B6', example: '2345 67890 1' },
  { type: 'IP ADDRESS',   label: 'IP Address',            color: '#34D399', example: '192.168.1.100' },
]

const AUDIT_ENTRIES = [
  { time: '10:42:17', user: 'analyst_01', query: 'What are the site safety requirements...', action: 'QUERY', status: 'OK' },
  { time: '10:43:02', user: 'manager_07', query: 'Retrieve Q3 budget breakdown for...', action: 'QUERY', status: 'OK' },
  { time: '10:43:45', user: 'analyst_03', query: 'Employee TFN records for payroll...', action: 'BLOCKED', status: 'PII_SHIELD' },
  { time: '10:44:11', user: 'admin_01',   query: 'System health check initiated',        action: 'ADMIN',  status: 'OK' },
]

const AUTH_FEATURES = [
  { icon: '🔐', title: 'Multi-Factor Authentication', desc: 'TOTP-based MFA enforced for all admin and analyst roles. Hardware key support available.' },
  { icon: '🎫', title: 'JWT Session Management',      desc: 'Short-lived JWT tokens with refresh rotation. Automatic session expiry on inactivity.' },
  { icon: '🛡', title: 'Role-Based Access Control',   desc: 'Granular Viewer vs Editor vs Admin permissions. Tenant-scoped access boundaries enforced at query time.' },
  { icon: '🔑', title: 'SSO Integration',             desc: 'Compatible with Azure AD, Okta, and SAML 2.0 providers for enterprise identity management.' },
]

export default function Security() {
  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <section className="page-hero grid-bg">
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="section-label">Security, Privacy & Compliance</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#F8FAFC', margin: '1rem 0' }}>
            Your Privacy Shield
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Automated detection, redaction, and auditability — engineered for Australian regulatory compliance
            across mining, government, and legal sectors.
          </p>
        </div>
      </section>

      {/* PII Shield */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Automated PII Shield</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0' }}>
              12+ PII Categories Detected & Redacted Before Indexing
            </h2>
            <p style={{ color: '#64748B', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              Before any document enters the knowledge base, AIDATARIS scans every byte for sensitive personal
              information and redacts it permanently — protecting your organisation and complying with the Privacy Act 1988.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}>
            {PII_TYPES.map((pii, i) => (
              <motion.div key={pii.type}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: '#0D1117',
                  border: `1px solid ${pii.color}33`,
                  borderRadius: 10,
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{
                    background: pii.color + '20', color: pii.color,
                    fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em',
                    padding: '2px 8px', borderRadius: 4,
                    fontFamily: 'Courier New, monospace',
                  }}>
                    {pii.type}
                  </span>
                  <span style={{ color: '#10B981', fontSize: '0.65rem', fontWeight: 700 }}>ACTIVE</span>
                </div>
                <div style={{ color: '#F8FAFC', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{pii.label}</div>
                <div style={{ fontFamily: 'Courier New, monospace', fontSize: '0.75rem', color: '#475569' }}>
                  e.g. <span style={{ color: pii.color }}>{pii.example}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section style={{ padding: '5rem 1.5rem', background: '#0D1117', borderTop: '1px solid #1E293B', borderBottom: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">Live Audit Trail</span>
              <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 1rem' }}>
                Every Query. Every Response. Every Action. Logged.
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                The AIDATARIS audit trail records a tamper-proof log of every interaction — who asked what, when, and what the system responded. Essential for compliance officers and regulatory audits.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Immutable log storage with cryptographic signing',
                  'User identity and session linked to every event',
                  'PII access attempts flagged and escalated',
                  'Exportable reports for regulatory submissions',
                ].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', color: '#CBD5E1', fontSize: '0.9rem' }}>
                    <span style={{ color: '#06B6D4', flexShrink: 0, marginTop: 2 }}>▸</span>{pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Audit log mockup */}
            <div style={{
              background: '#080C10',
              border: '1px solid #1E293B',
              borderRadius: 12,
              overflow: 'hidden',
              fontFamily: 'Courier New, monospace',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', borderBottom: '1px solid #1E293B',
                background: '#0D1117',
              }}>
                <span style={{ color: '#94A3B8', fontSize: '0.75rem', letterSpacing: '0.1em' }}>AUDIT LOG — LIVE</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontSize: '0.7rem', fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  RECORDING
                </span>
              </div>
              {AUDIT_ENTRIES.map((entry, i) => (
                <div key={i} style={{
                  padding: '0.75rem 1rem',
                  borderBottom: i < AUDIT_ENTRIES.length - 1 ? '1px solid #0F172A' : 'none',
                  display: 'grid',
                  gridTemplateColumns: 'auto auto 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  fontSize: '0.72rem',
                }}>
                  <span style={{ color: '#475569' }}>{entry.time}</span>
                  <span style={{ color: '#06B6D4' }}>{entry.user}</span>
                  <span style={{ color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.query}
                  </span>
                  <span style={{
                    padding: '1px 6px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 700,
                    background: entry.status === 'OK' ? '#10B98120' : '#EF444420',
                    color: entry.status === 'OK' ? '#10B981' : '#EF4444',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.status === 'PII_SHIELD' ? '⚡ BLOCKED' : '✓ ' + entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Auth */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Authentication & Access</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0' }}>
              Enterprise-Grade Identity Management
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {AUTH_FEATURES.map((f, i) => (
              <motion.div key={i} className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance bar */}
      <section style={{ padding: '4rem 1.5rem', background: '#0D1117', borderTop: '1px solid #1E293B', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span className="section-label">Regulatory Alignment</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 2rem' }}>
            Built for Australian Compliance Standards
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {['Privacy Act 1988', 'ASD Essential Eight', 'ISM (PSPF)', 'ISO 27001 Ready', 'GDPR Compatible', 'AI Assurance Framework'].map((badge, i) => (
              <span key={i} style={{
                padding: '0.5rem 1.25rem',
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.25)',
                borderRadius: 20,
                color: '#06B6D4',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>{badge}</span>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/company" className="btn-primary">Request a Compliance Brief</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
