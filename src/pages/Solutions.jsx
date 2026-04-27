import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SOLUTIONS = [
  {
    id: 'mining',
    icon: '⛏',
    label: 'Mining & Energy',
    color: '#F59E0B',
    tagline: 'Intelligence at the Edge of the Earth',
    desc: 'Remote Pilbara mine sites, offshore platforms, and outback energy installations face a simple truth: the cloud is unavailable when it matters most. AIDATARIS operates fully offline, bringing enterprise AI to the most isolated environments in Western Australia.',
    features: [
      { title: 'Offline Air-Gap Mode', desc: 'Full RAG capability with zero network dependency. Pre-loaded knowledge base operates indefinitely without internet.' },
      { title: 'Safety Specification Analysis', desc: 'Instantly query MSDS sheets, engineering specs, hazard registers, and safety compliance documents.' },
      { title: 'Equipment & Maintenance Intelligence', desc: 'AI-powered analysis of maintenance logs, equipment manuals, and failure reports for predictive insights.' },
      { title: 'Regulatory Compliance', desc: 'Automated cross-reference against DMIRS regulations, WA Mines Safety Act, and site-specific procedures.' },
    ],
    stats: [
      { value: '0ms', label: 'Cloud Latency' },
      { value: '24/7', label: 'Offline Operation' },
      { value: '100%', label: 'Local Processing' },
    ],
    highlight: 'Trusted at remote Pilbara sites where satellite connectivity is intermittent or unavailable.',
  },
  {
    id: 'government',
    icon: '🏛',
    label: 'WA Government',
    color: '#06B6D4',
    tagline: 'Sovereignty by Statute, Intelligence by Design',
    desc: 'Western Australian government agencies face strict data sovereignty requirements. AIDATARIS aligns with the WA Government\'s AI Assurance Framework and the Australian Signals Directorate\'s Essential Eight — ensuring AI capability that regulators trust.',
    features: [
      { title: 'Data Residency Compliance', desc: 'All data stays within your government-controlled infrastructure. No third-party cloud providers, ever.' },
      { title: 'AI Assurance Framework', desc: 'Built to meet WA Government AI governance requirements with full auditability and explainability.' },
      { title: 'Classified Document Handling', desc: 'Multi-classification level support with strict information barrier enforcement between departments.' },
      { title: 'Parliamentary & Policy Intelligence', desc: 'Rapid search across legislation, policy documents, briefing notes, and ministerial correspondence.' },
    ],
    stats: [
      { value: '0',    label: 'Cloud Providers' },
      { value: '100%', label: 'Data Residency' },
      { value: 'Full', label: 'Audit Trail' },
    ],
    highlight: 'Aligned with ASD Essential Eight, PSPF, and the WA AI Assurance Framework.',
  },
  {
    id: 'legal',
    icon: '⚖',
    label: 'Legal & Health',
    color: '#8B5CF6',
    tagline: 'Confidentiality Is Not Optional',
    desc: 'Legal practices and health organisations handle Australia\'s most sensitive personal data. AIDATARIS provides powerful AI-assisted document intelligence with automatic PII redaction and strict client confidentiality — without any data leaving your premises.',
    features: [
      { title: 'Legal Document Intelligence', desc: 'Instant search across case files, precedents, contracts, and regulatory filings with full citation tracing.' },
      { title: 'Automatic PII Protection', desc: '12+ PII categories detected and redacted before indexing. TFN, Medicare numbers, names — protected by default.' },
      { title: 'Client Confidentiality Walls', desc: 'Information barriers prevent cross-matter data leakage. Each client matter is cryptographically isolated.' },
      { title: 'Medical Record Analysis', desc: 'Locally process patient records, clinical notes, and referral letters with zero external data exposure.' },
    ],
    stats: [
      { value: '12+',  label: 'PII Types Blocked' },
      { value: '100%', label: 'On-Premises' },
      { value: '0',    label: 'Third-Party Access' },
    ],
    highlight: 'Compliant with the Privacy Act 1988, Health Records Act, and legal professional privilege requirements.',
  },
]

export default function Solutions() {
  const [active, setActive] = useState('mining')
  const solution = SOLUTIONS.find(s => s.id === active)

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <section className="page-hero grid-bg">
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="section-label">Industry Solutions</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#F8FAFC', margin: '1rem 0' }}>
            Built for Western Australia&apos;s Most Demanding Sectors
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}>
            AIDATARIS operates where cloud AI cannot — in remote sites, secure government facilities, and confidential legal chambers.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap',
          borderBottom: '1px solid #1E293B', paddingBottom: '1rem',
        }}>
          {SOLUTIONS.map(s => (
            <button key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.25rem', borderRadius: 8,
                border: active === s.id ? `1px solid ${s.color}` : '1px solid #334155',
                background: active === s.id ? s.color + '15' : 'transparent',
                color: active === s.id ? s.color : '#94A3B8',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}>
              {/* Left */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: solution.color + '20',
                    border: `1px solid ${solution.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>{solution.icon}</span>
                  <div>
                    <div className="section-label" style={{ color: solution.color }}>{solution.label}</div>
                    <div style={{ color: '#F8FAFC', fontWeight: 700 }}>{solution.tagline}</div>
                  </div>
                </div>
                <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '2rem' }}>{solution.desc}</p>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {solution.stats.map((stat, i) => (
                    <div key={i} style={{
                      flex: 1, minWidth: 80, textAlign: 'center',
                      padding: '1rem', background: '#0D1117',
                      border: `1px solid ${solution.color}33`, borderRadius: 10,
                    }}>
                      <div style={{ color: solution.color, fontWeight: 900, fontSize: '1.5rem', fontFamily: 'Courier New, monospace' }}>{stat.value}</div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.25rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: '1rem', background: solution.color + '0A',
                  border: `1px solid ${solution.color}22`, borderRadius: 8,
                  color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>
                  💡 {solution.highlight}
                </div>
              </div>

              {/* Right: Feature cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {solution.features.map((feat, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      background: '#0D1117',
                      border: `1px solid #1E293B`,
                      borderLeft: `3px solid ${solution.color}`,
                      borderRadius: '0 10px 10px 0',
                      padding: '1rem 1.25rem',
                    }}
                  >
                    <div style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '0.35rem', fontSize: '0.95rem' }}>{feat.title}</div>
                    <div style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6 }}>{feat.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: '#0D1117', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="section-label">Ready to Deploy?</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', margin: '1rem 0' }}>
            Your Sector. Your Infrastructure.
          </h2>
          <p style={{ color: '#64748B', marginBottom: '2rem' }}>
            Let our team walk you through a sector-specific deployment plan tailored to your organisation&apos;s security requirements.
          </p>
          <Link to="/company" className="btn-primary">Request a Sector Demo</Link>
        </div>
      </section>
    </main>
  )
}
