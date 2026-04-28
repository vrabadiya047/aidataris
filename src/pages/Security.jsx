import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const PII = [
  { t: 'TFN',         l: 'Tax File Number',     c: '#F87171', e: '872 493 157' },
  { t: 'ABN',         l: 'Business Number',     c: '#F59E0B', e: '51 824 753 556' },
  { t: 'ACN',         l: 'Company Number',      c: '#FB923C', e: '123 456 789' },
  { t: 'NAME',        l: 'Full Name',           c: '#38BDF8', e: 'James Thornton' },
  { t: 'PHONE',       l: 'Phone Number',        c: '#A78BFA', e: '0412 847 293' },
  { t: 'EMAIL',       l: 'Email Address',       c: '#34D399', e: 'j.t@email.com' },
  { t: 'CREDIT CARD', l: 'Credit Card',         c: '#F472B6', e: '4532 ···· 9012' },
  { t: 'BSB',         l: 'Bank BSB',            c: '#60A5FA', e: '062-123' },
  { t: 'PASSPORT',    l: 'Passport Number',     c: '#2DD4BF', e: 'PA 1234567' },
  { t: 'DRIVERS LIC', l: "Driver's Licence",    c: '#C4B5FD', e: 'AB123456' },
  { t: 'MEDICARE',    l: 'Medicare Number',     c: '#F9A8D4', e: '2345 67890 1' },
  { t: 'IP ADDRESS',  l: 'IP Address',          c: '#6EE7B7', e: '192.168.1.100' },
]

const LOG = [
  { t: '10:42:17', u: 'analyst_01', q: 'What are the site safety requirements for...', s: 'OK' },
  { t: '10:43:02', u: 'manager_07', q: 'Retrieve Q3 budget breakdown for Pilbara...', s: 'OK' },
  { t: '10:43:45', u: 'analyst_03', q: 'Show employee TFN records for payroll run', s: 'BLOCKED' },
  { t: '10:44:11', u: 'admin_01',   q: 'System health check — all nodes nominal',   s: 'OK' },
  { t: '10:45:02', u: 'viewer_12',  q: 'Legal contract clause 14.3 reference?',     s: 'OK' },
]

const AUTH = [
  { icon: '🔐', t: 'Multi-Factor Authentication', d: 'TOTP-based MFA enforced for all admin and analyst roles. Hardware key (FIDO2) support available.' },
  { icon: '🎫', t: 'JWT Session Management',      d: 'Short-lived JWT tokens with refresh rotation. Automatic session expiry on inactivity timeout.' },
  { icon: '🛡', t: 'Role-Based Access Control',   d: 'Granular Viewer / Editor / Admin permissions. Tenant-scoped access enforced at query time.' },
  { icon: '🔑', t: 'SSO Integration',             d: 'Compatible with Azure AD, Okta, and SAML 2.0 providers for enterprise identity federation.' },
]

const s = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

export default function Security() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(239,68,68,0.07) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span className="label">Security, Privacy & Compliance</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Your <span className="gradient-text">Privacy Shield</span>
          </h1>
          <p style={{ color: 'var(--t5)', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Automated detection, redaction, and auditability — engineered for Australian regulatory compliance across mining, government, and legal sectors.
          </p>
        </div>
      </section>

      {/* PII Shield grid */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label" style={{ color: '#F87171', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)' }}>Automated PII Shield</span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0', letterSpacing: '-0.02em' }}>
              12+ PII Categories Detected & Redacted<br /><span style={{ color: '#F87171' }}>Before Indexing</span>
            </h2>
            <p style={{ color: 'var(--t5)', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
              Before any document enters the knowledge base, every byte is scanned for sensitive personal information and permanently redacted — protecting your organisation and complying with the Privacy Act 1988.
            </p>
          </div>

          <motion.div
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}
          >
            {PII.map(p => (
              <motion.div key={p.t} variants={s} className="glass" style={{ padding: '1.25rem', border: `1px solid ${p.c}18` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span className="mono" style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    background: p.c + '18', color: p.c, border: `1px solid ${p.c}30`,
                  }}>{p.t}</span>
                  <span style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 700 }}>● ACTIVE</span>
                </div>
                <div style={{ color: 'var(--t3)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{p.l}</div>
                <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--t4)' }}>
                  e.g. <span style={{ color: p.c }}>{p.e}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Audit trail */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="label">Live Audit Trail</span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0', letterSpacing: '-0.02em' }}>
                Every Query. Every Response.<br /><span className="gradient-text">Immutably Logged.</span>
              </h2>
              <p style={{ color: 'var(--t5)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Tamper-proof log of every interaction — who asked what, when, and what the system responded. Essential for compliance officers and regulatory audits.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {['Immutable log with cryptographic signing', 'User identity linked to every event', 'PII access attempts flagged & escalated', 'Exportable reports for regulatory submissions'].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', color: 'var(--t4)', fontSize: '0.875rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#06B6D4', flexShrink: 0, marginTop: 1 }}>▸</span> {pt}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Audit log terminal */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="terminal">
                <div className="terminal-bar">
                  <span className="terminal-dot" style={{ background: '#FF5F57' }} />
                  <span className="terminal-dot" style={{ background: '#FFBD2E' }} />
                  <span className="terminal-dot" style={{ background: '#28CA41' }} />
                  <span className="mono" style={{ color: 'var(--t6)', fontSize: '0.72rem', marginLeft: 8 }}>audit-log — live stream</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'pulse-ring 2s ease infinite' }} />
                    <span className="mono" style={{ color: '#10B981', fontSize: '0.65rem', fontWeight: 700 }}>RECORDING</span>
                  </span>
                </div>
                {LOG.map((e, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '70px 100px 1fr 80px',
                    padding: '0.75rem 1.25rem',
                    borderBottom: i < LOG.length - 1 ? '1px solid rgba(6,182,212,0.06)' : 'none',
                    alignItems: 'center', gap: '0.75rem',
                  }}>
                    <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.68rem' }}>{e.t}</span>
                    <span className="mono" style={{ color: '#06B6D4', fontSize: '0.68rem' }}>{e.u}</span>
                    <span className="mono" style={{ color: 'var(--t4)', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.q}</span>
                    <span className="mono" style={{
                      fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, textAlign: 'center',
                      background: e.s === 'OK' ? '#10B98118' : '#EF444418',
                      color: e.s === 'OK' ? '#10B981' : '#EF4444',
                      border: `1px solid ${e.s === 'OK' ? '#10B98130' : '#EF444430'}`,
                    }}>
                      {e.s === 'BLOCKED' ? '⚡ ' + e.s : '✓ ' + e.s}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auth features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label">Authentication & Access</span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Enterprise-Grade Identity Management
            </h2>
          </div>
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}
          >
            {AUTH.map((a, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="glass" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{a.icon}</div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{a.t}</h3>
                <p style={{ color: 'var(--t5)', fontSize: '0.85rem', lineHeight: 1.6 }}>{a.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Compliance badges */}
      <section style={{ padding: '4rem 1.5rem 6rem', background: 'var(--bg2)', textAlign: 'center' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <span className="label">Regulatory Alignment</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0 2.5rem', letterSpacing: '-0.02em' }}>
            Built for Australian Compliance Standards
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            {['Privacy Act 1988', 'ASD Essential Eight', 'ISM (PSPF)', 'ISO 27001 Ready', 'GDPR Compatible', 'AI Assurance Framework', 'Health Records Act', 'Legal Professional Privilege'].map((b, i) => (
              <span key={i} style={{
                padding: '0.5rem 1.25rem', borderRadius: 20,
                border: '1px solid rgba(6,182,212,0.2)',
                background: 'rgba(6,182,212,0.05)',
                color: 'var(--t4)', fontSize: '0.85rem', fontWeight: 500,
              }}>{b}</span>
            ))}
          </div>
          <Link to="/company" className="btn-primary">Request a Compliance Brief →</Link>
        </div>
      </section>
    </main>
  )
}
