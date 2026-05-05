import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Data ────────────────────────────────────────────── */
const PII = [
  { t: 'TFN',         l: 'Tax File Number',    c: '#F87171', e: '872 493 157' },
  { t: 'ABN',         l: 'Business Number',    c: '#F59E0B', e: '51 824 753 556' },
  { t: 'ACN',         l: 'Company Number',     c: '#FB923C', e: '123 456 789' },
  { t: 'NAME',        l: 'Full Name',          c: '#38BDF8', e: 'James Thornton' },
  { t: 'PHONE',       l: 'Phone Number',       c: '#A78BFA', e: '0412 847 293' },
  { t: 'EMAIL',       l: 'Email Address',      c: '#34D399', e: 'j.t@email.com' },
  { t: 'CREDIT CARD', l: 'Credit Card',        c: '#F472B6', e: '4532 ···· 9012' },
  { t: 'BSB',         l: 'Bank BSB',           c: '#60A5FA', e: '062-123' },
  { t: 'PASSPORT',    l: 'Passport Number',    c: '#2DD4BF', e: 'PA 1234567' },
  { t: 'DRIVERS LIC', l: "Driver's Licence",   c: '#C4B5FD', e: 'AB123456' },
  { t: 'MEDICARE',    l: 'Medicare Number',    c: '#F9A8D4', e: '2345 67890 1' },
  { t: 'IP ADDRESS',  l: 'IP Address',         c: '#6EE7B7', e: '192.168.1.100' },
]

const LOG = [
  { t: '10:42:17', u: 'analyst_01', q: 'What are the site safety requirements for...', s: 'OK' },
  { t: '10:43:02', u: 'manager_07', q: 'Retrieve Q3 budget breakdown for Pilbara...', s: 'OK' },
  { t: '10:43:45', u: 'analyst_03', q: 'Show employee TFN records for payroll run', s: 'BLOCKED' },
  { t: '10:44:11', u: 'admin_01',   q: 'System health check — all nodes nominal',   s: 'OK' },
  { t: '10:45:02', u: 'viewer_12',  q: 'Legal contract clause 14.3 reference?',     s: 'OK' },
]

const AUTH = [
  { icon: '🔐', color: '#06B6D4', t: 'Multi-Factor Authentication', d: 'TOTP-based MFA enforced for all admin and analyst roles. Hardware key (FIDO2) support available.' },
  { icon: '🎫', color: '#8B5CF6', t: 'JWT Session Management',      d: 'Short-lived JWT tokens with refresh rotation. Automatic session expiry on inactivity timeout.' },
  { icon: '🛡', color: '#F59E0B', t: 'Role-Based Access Control',   d: 'Granular Viewer / Editor / Admin permissions. Tenant-scoped access enforced at query time.' },
  { icon: '🔑', color: '#10B981', t: 'SSO Integration',             d: 'Compatible with Azure AD, Okta, and SAML 2.0 providers for enterprise identity federation.' },
]

const ENCRYPTION = [
  { label: 'Data at Rest',      spec: 'AES-256-GCM',   detail: 'All vector embeddings, documents, and metadata encrypted on disk.' },
  { label: 'Data in Transit',   spec: 'TLS 1.3',       detail: 'All internal service communication encrypted. External HTTPS enforced.' },
  { label: 'Vector Index',      spec: 'AES-256',       detail: 'Qdrant vector store encrypted at rest with per-collection key rotation.' },
  { label: 'Graph Database',    spec: 'AES-256',       detail: 'Neo4j enterprise encryption with HSM key management support.' },
  { label: 'Auth Tokens',       spec: 'RS-256 JWT',    detail: 'Asymmetric signing with 15-minute token TTL and secure refresh.' },
  { label: 'Audit Log',         spec: 'SHA-256 Chain', detail: 'Each log entry cryptographically chained — tamper-evident by design.' },
]

const COMPLIANCE = [
  { framework: 'Privacy Act 1988',            status: 'Full',    scope: 'Data handling, PII protection, breach notification' },
  { framework: 'ASD Essential Eight',         status: 'Full',    scope: 'Application control, patching, MFA, backup' },
  { framework: 'ISM (PSPF)',                  status: 'Ready',   scope: 'Government information security requirements' },
  { framework: 'Health Records Act 2001',     status: 'Full',    scope: 'Health information handling and patient privacy' },
  { framework: 'Legal Professional Privilege',status: 'Full',    scope: 'Client confidentiality and matter isolation' },
  { framework: 'ISO 27001',                   status: 'Ready',   scope: 'ISMS framework — documentation provided' },
  { framework: 'GDPR (Compatible)',           status: 'Ready',   scope: 'European data subject rights where applicable' },
  { framework: 'WA AI Assurance Framework',   status: 'Full',    scope: 'WA Government AI governance and explainability' },
]

const statusColor = s => s === 'Full' ? '#10B981' : '#F59E0B'

function EditorialRule({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
      <span className="label">{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
    </div>
  )
}

const cardIn = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

/* ── Page ────────────────────────────────────────────── */
export default function Security() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>
      <Helmet>
        <title>Security & Compliance | AIDATARIS Sovereign AI</title>
        <meta name="description" content="AIDATARIS is built for Australia's most regulated industries. AES-256 encryption, Privacy Act 1988 compliant, ASD Essential Eight aligned, with zero data egress by design." />
        <meta name="keywords" content="sovereign AI security, Privacy Act 1988, ASD Essential Eight, on-premise AI compliance, air-gap security, data sovereignty Australia" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(239,68,68,0.07) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="label">Security, Privacy & Compliance</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Your Data. Your Perimeter.{' '}
            <span style={{ background: 'linear-gradient(135deg, #F87171, #EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Full Stop.
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ color: 'var(--t4)', fontSize: '1.05rem', lineHeight: 1.78 }}>
            Automated PII detection, AES-256 encryption, tamper-proof audit logs, and zero-egress architecture — engineered for Australia's most regulated industries.
          </motion.p>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { val: '0',    label: 'Bytes Egressed' },
              { val: '12+',  label: 'PII Categories' },
              { val: 'AES-256', label: 'Encryption' },
              { val: '100%', label: 'On-Premise' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F87171', letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ color: 'var(--t5)', fontSize: '0.72rem', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ZERO-EGRESS ARCHITECTURE ─────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="01 · Zero-Egress Architecture" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                The Only Safe AI Is{' '}
                <span style={{ background: 'linear-gradient(135deg, #F87171, #EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  One That Stays In.
                </span>
              </h2>
              <p style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.78, marginBottom: '2rem' }}>
                Cloud AI sends your documents to servers you don't control, in jurisdictions you may not know about, processed by systems you cannot audit. AIDATARIS eliminates this risk entirely by running every computation inside your network.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: '✓', text: 'LLM inference runs on your GPU — zero API calls', color: '#10B981' },
                  { icon: '✓', text: 'Documents never leave your server', color: '#10B981' },
                  { icon: '✓', text: 'Air-gap deployable — no internet post-install', color: '#10B981' },
                  { icon: '✓', text: 'Full source code review available on request', color: '#10B981' },
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.6rem 0.9rem', borderRadius: 8, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
                    <span style={{ color: pt.color, fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>{pt.icon}</span>
                    <span style={{ color: 'var(--t2)', fontSize: '0.875rem' }}>{pt.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Egress diagram */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="glass" style={{ padding: '2rem', border: '1px solid rgba(239,68,68,0.15)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #EF4444, #F87171, #EF4444)' }} />
                <div className="mono" style={{ color: '#F87171', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1.5rem' }}>NETWORK TOPOLOGY</div>

                {/* Inside perimeter */}
                <div style={{ border: '2px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem', background: 'rgba(16,185,129,0.03)' }}>
                  <div className="mono" style={{ color: '#10B981', fontSize: '0.6rem', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 700 }}>✓ YOUR PERIMETER — ALL AI RUNS HERE</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {[
                      { name: 'Admin Console', color: '#06B6D4' },
                      { name: 'FastAPI Server', color: '#8B5CF6' },
                      { name: 'Ollama LLM', color: '#F59E0B' },
                      { name: 'Qdrant Vector DB', color: '#F59E0B' },
                      { name: 'Neo4j Graph', color: '#10B981' },
                      { name: 'Document Store', color: '#10B981' },
                    ].map((n, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.6rem', borderRadius: 6, background: 'var(--glass-bg)', border: `1px solid ${n.color}22` }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                        <span style={{ color: 'var(--t3)', fontSize: '0.72rem' }}>{n.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blocked arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(239,68,68,0.3)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#EF4444', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 900 }}>✕</div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: '#EF4444', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em' }}>DATA EGRESS BLOCKED</div>
                    <div style={{ color: 'var(--t5)', fontSize: '0.72rem', marginTop: 2 }}>OpenAI · Anthropic · Google · Azure · AWS</div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', borderRadius: 6, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', textAlign: 'center' }}>
                  <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>INTERNET / EXTERNAL CLOUD</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PII SHIELD ───────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="02 · Automated PII Shield" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start', marginBottom: '3.5rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                12+ PII Categories Detected{' '}
                <span style={{ color: '#F87171' }}>Before Indexing</span>
              </h2>
              <p style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.78 }}>
                Before any document enters the knowledge base, every byte is scanned by the local Presidio PII engine. Sensitive data is permanently redacted — never stored, never retrievable. Your organisation stays compliant with Privacy Act 1988 by default.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Detection Engine', val: 'Microsoft Presidio (local)' },
                { label: 'Processing',       val: 'Pre-indexing — before storage' },
                { label: 'Method',           val: 'Permanent redaction (not masking)' },
                { label: 'Confidence',       val: '>97% recall across AU document types' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid var(--bd)' }}>
                  <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.7rem', minWidth: 120, letterSpacing: '0.04em' }}>{r.label}</span>
                  <span style={{ color: 'var(--t2)', fontSize: '0.85rem', fontWeight: 500 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.85rem' }}>
            {PII.map(p => (
              <motion.div key={p.t} variants={cardIn} className="glass"
                style={{ padding: '1.15rem 1.25rem', border: `1px solid ${p.c}18` }}
                whileHover={{ y: -3, borderColor: p.c + '45', boxShadow: `0 8px 24px rgba(0,0,0,0.08), 0 0 12px ${p.c}15` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: p.c + '18', color: p.c, border: `1px solid ${p.c}30` }}>{p.t}</span>
                  <span style={{ fontSize: '0.6rem', color: '#10B981', fontWeight: 700 }}>● ACTIVE</span>
                </div>
                <div style={{ color: 'var(--t2)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{p.l}</div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--t5)' }}>e.g. <span style={{ color: p.c }}>{p.e}</span></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ENCRYPTION ───────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="03 · Encryption Standards" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '4rem', maxWidth: 540, lineHeight: 1.15 }}>
            Military-Grade Encryption,{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every Layer.
            </span>
          </motion.h2>

          <div style={{ border: '1px solid var(--bd)', borderRadius: 16, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '1.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg2)', borderBottom: '1px solid var(--bd)' }}>
              {['Layer', 'Standard', 'Scope'].map(h => (
                <span key={h} className="mono" style={{ color: 'var(--t5)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em' }}>{h}</span>
              ))}
            </div>
            {ENCRYPTION.map((row, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '1.5rem', padding: '1.1rem 1.5rem', borderBottom: i < ENCRYPTION.length - 1 ? '1px solid var(--bd)' : 'none', alignItems: 'center', background: 'var(--glass-bg)', transition: 'background 0.2s' }}>
                <span style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.875rem' }}>{row.label}</span>
                <span className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#06B6D4', padding: '3px 8px', borderRadius: 5, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', textAlign: 'center', whiteSpace: 'nowrap' }}>{row.spec}</span>
                <span style={{ color: 'var(--t4)', fontSize: '0.82rem', lineHeight: 1.5 }}>{row.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIT TRAIL ──────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="04 · Immutable Audit Trail" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Every Query. Every Response.{' '}
                <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Immutably Logged.
                </span>
              </h2>
              <p style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.78, marginBottom: '2rem' }}>
                Tamper-proof log of every interaction — who asked what, when, and what the system responded. Essential for compliance officers, legal discovery, and regulatory audits.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {[
                  'Immutable log with cryptographic chain signing',
                  'User identity linked to every interaction event',
                  'PII access attempts flagged & escalated automatically',
                  'BLOCKED queries logged with full context',
                  'Exportable reports for regulatory submissions',
                  'Configurable retention policies (1–7 years)',
                ].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.6rem', color: 'var(--t3)', fontSize: '0.875rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#06B6D4', flexShrink: 0, marginTop: 1 }}>▸</span> {pt}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Audit terminal */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
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
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ minWidth: 480 }}>
                    {/* Column headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '72px 100px 1fr 90px', padding: '0.5rem 1.25rem', borderBottom: '1px solid rgba(6,182,212,0.08)', gap: '0.75rem' }}>
                      {['TIME', 'USER', 'QUERY', 'STATUS'].map(h => (
                        <span key={h} className="mono" style={{ color: 'var(--t6)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em' }}>{h}</span>
                      ))}
                    </div>
                    {LOG.map((e, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '72px 100px 1fr 90px',
                        padding: '0.75rem 1.25rem', borderBottom: i < LOG.length - 1 ? '1px solid rgba(6,182,212,0.06)' : 'none',
                        alignItems: 'center', gap: '0.75rem',
                        background: e.s === 'BLOCKED' ? 'rgba(239,68,68,0.03)' : 'transparent',
                      }}>
                        <span className="mono" style={{ color: '#6B7280', fontSize: '0.68rem' }}>{e.t}</span>
                        <span className="mono" style={{ color: '#06B6D4', fontSize: '0.68rem' }}>{e.u}</span>
                        <span className="mono" style={{ color: '#6B7280', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.q}</span>
                        <span className="mono" style={{
                          fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, textAlign: 'center',
                          background: e.s === 'OK' ? '#10B98118' : '#EF444418',
                          color: e.s === 'OK' ? '#10B981' : '#EF4444',
                          border: `1px solid ${e.s === 'OK' ? '#10B98130' : '#EF444430'}`,
                        }}>
                          {e.s === 'BLOCKED' ? '⚡ ' + e.s : '✓ ' + e.s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AUTH & ACCESS ─────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="05 · Authentication & Access" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '4rem', maxWidth: 500, lineHeight: 1.15 }}>
            Enterprise-Grade Identity Management
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {AUTH.map((a, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.5 }}
                className="glass"
                style={{ padding: '1.75rem', border: `1px solid ${a.color}18`, position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -4, borderColor: a.color + '40', boxShadow: `0 12px 36px rgba(0,0,0,0.1), 0 0 20px ${a.color}12` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${a.color}, ${a.color}00)` }} />
                <div style={{ width: 44, height: 44, borderRadius: 12, background: a.color + '15', border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
                  {a.icon}
                </div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{a.t}</h3>
                <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.68 }}>{a.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE MATRIX ────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="06 · Compliance Matrix" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Built for Australian{' '}
                <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Compliance Standards.
                </span>
              </h2>
              <p style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.78, marginBottom: '2rem' }}>
                AIDATARIS was designed from day one for Australia's regulatory environment — not retrofitted. Each framework alignment has been validated by our legal and compliance team.
              </p>
              <Link to="/contact" className="btn-primary">Request Compliance Documentation →</Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ border: '1px solid var(--bd)', borderRadius: 16, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem', padding: '0.75rem 1.25rem', background: 'var(--bg2)', borderBottom: '1px solid var(--bd)' }}>
                  <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em' }}>FRAMEWORK</span>
                  <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em' }}>STATUS</span>
                </div>
                {COMPLIANCE.map((row, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem', padding: '0.95rem 1.25rem', borderBottom: i < COMPLIANCE.length - 1 ? '1px solid var(--bd)' : 'none', alignItems: 'center', background: 'var(--glass-bg)' }}>
                    <div>
                      <div style={{ color: 'var(--t1)', fontWeight: 600, fontSize: '0.85rem' }}>{row.framework}</div>
                      <div style={{ color: 'var(--t5)', fontSize: '0.72rem', marginTop: '2px' }}>{row.scope}</div>
                    </div>
                    <span className="mono" style={{
                      fontSize: '0.62rem', fontWeight: 700, padding: '3px 8px', borderRadius: 5,
                      background: statusColor(row.status) + '18',
                      color: statusColor(row.status),
                      border: `1px solid ${statusColor(row.status)}35`,
                      textAlign: 'center', whiteSpace: 'nowrap',
                    }}>
                      {row.status === 'Full' ? '✓ ' : '◐ '}{row.status}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.62rem', marginTop: '0.75rem', letterSpacing: '0.06em' }}>
                ✓ Full alignment  ◐ Framework-ready (documentation provided)
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="label">Security-First Partnership</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Ready to Eliminate Your Data Exposure Risk?
          </h2>
          <p style={{ color: 'var(--t4)', marginBottom: '2.5rem', lineHeight: 1.75 }}>
            Book a technical consultation. Our team will walk through your specific compliance requirements and show you exactly how AIDATARIS addresses them.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">Book Security Consultation →</Link>
            <Link to="/technology" className="btn-ghost">View Platform Architecture</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
