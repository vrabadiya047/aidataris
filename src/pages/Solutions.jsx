import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SOLUTIONS = [
  {
    id: 'mining', icon: '⛏', color: '#F59E0B',
    label: 'Mining & Energy', tagline: 'Intelligence at the Edge of the Earth',
    desc: 'Remote Pilbara mine sites, offshore platforms, and outback energy installations need AI that works when the cloud doesn\'t. AIDATARIS operates fully offline, bringing enterprise intelligence to the most isolated environments in Western Australia.',
    stats: [{ v: '0ms', l: 'Cloud Latency' }, { v: '24/7', l: 'Offline Operation' }, { v: '100%', l: 'Local Processing' }],
    highlight: 'Trusted at remote Pilbara sites where satellite connectivity is intermittent or unavailable.',
    features: [
      { t: 'Air-Gap Offline Mode',          d: 'Full RAG capability with zero network dependency. Pre-loaded knowledge base operates indefinitely without internet.' },
      { t: 'Safety Specification Analysis', d: 'Instantly query MSDS sheets, engineering specs, hazard registers, and safety compliance documents.' },
      { t: 'Equipment Intelligence',        d: 'AI-powered analysis of maintenance logs, equipment manuals, and failure reports for predictive insights.' },
      { t: 'Regulatory Compliance',         d: 'Automated cross-reference against DMIRS, WA Mines Safety Act, and site-specific procedures.' },
    ],
  },
  {
    id: 'government', icon: '🏛', color: '#06B6D4',
    label: 'WA Government', tagline: 'Sovereignty by Statute, Intelligence by Design',
    desc: 'Western Australian government agencies face strict data sovereignty requirements. AIDATARIS aligns with the WA Government\'s AI Assurance Framework and the ASD Essential Eight — ensuring AI capability that regulators trust.',
    stats: [{ v: '0', l: 'Cloud Providers' }, { v: '100%', l: 'Data Residency' }, { v: 'Full', l: 'Audit Trail' }],
    highlight: 'Aligned with ASD Essential Eight, PSPF, and the WA Government AI Assurance Framework.',
    features: [
      { t: 'Data Residency Compliance', d: 'All data stays within government-controlled infrastructure. No third-party cloud providers, ever.' },
      { t: 'AI Assurance Framework',    d: 'Built to meet WA Government AI governance requirements with full auditability and explainability.' },
      { t: 'Classified Doc Handling',   d: 'Multi-classification level support with strict information barrier enforcement between departments.' },
      { t: 'Policy Intelligence',       d: 'Rapid search across legislation, policy documents, briefing notes, and ministerial correspondence.' },
    ],
  },
  {
    id: 'legal', icon: '⚖', color: '#8B5CF6',
    label: 'Legal & Health', tagline: 'Confidentiality Is Not Optional',
    desc: 'Legal practices and health organisations handle Australia\'s most sensitive personal data. AIDATARIS delivers powerful AI document intelligence with automatic PII redaction — without any data leaving your premises.',
    stats: [{ v: '12+', l: 'PII Types Blocked' }, { v: '100%', l: 'On-Premises' }, { v: '0', l: 'Third-Party Access' }],
    highlight: 'Compliant with the Privacy Act 1988, Health Records Act, and legal professional privilege requirements.',
    features: [
      { t: 'Legal Document Intelligence', d: 'Instant search across case files, precedents, contracts, and regulatory filings with full citation tracing.' },
      { t: 'Automatic PII Protection',    d: '12+ PII categories detected and redacted before indexing. TFN, Medicare numbers, names — protected by default.' },
      { t: 'Client Confidentiality Walls',d: 'Information barriers prevent cross-matter data leakage. Each client matter is cryptographically isolated.' },
      { t: 'Medical Record Analysis',     d: 'Locally process patient records, clinical notes, and referral letters with zero external data exposure.' },
    ],
  },
]

export default function Solutions() {
  const [active, setActive] = useState('mining')
  const sol = SOLUTIONS.find(s => s.id === active)

  return (
    <main style={{ background: '#02060E', minHeight: '100vh', paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span className="label">Industry Solutions</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: '#E2E8F0', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Built for WA&apos;s Most<br /><span className="gradient-text">Demanding Sectors</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.75 }}>
            AIDATARIS operates where cloud AI cannot — remote mine sites, secure government data centres, and confidential legal chambers.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="section">
        <div className="container">
          {/* Tab strip */}
          <div style={{
            display: 'flex', gap: '0.5rem', marginBottom: '3rem', flexWrap: 'wrap',
            padding: '0.5rem', background: 'rgba(6,14,40,0.5)',
            borderRadius: 14, border: '1px solid rgba(6,182,212,0.08)',
            width: 'fit-content',
          }}>
            {SOLUTIONS.map(s => (
              <button key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.25rem', borderRadius: 10,
                  border: active === s.id ? `1px solid ${s.color}50` : '1px solid transparent',
                  background: active === s.id ? s.color + '15' : 'transparent',
                  color: active === s.id ? s.color : '#94A3B8',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
                {/* Left */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: sol.color + '18', border: `1px solid ${sol.color}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                    }}>{sol.icon}</div>
                    <div>
                      <div style={{ color: sol.color, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{sol.label}</div>
                      <div style={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.9rem' }}>{sol.tagline}</div>
                    </div>
                  </div>

                  <p style={{ color: '#94A3B8', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem' }}>{sol.desc}</p>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                    {sol.stats.map((st, i) => (
                      <div key={i} className="glass" style={{ padding: '1rem', textAlign: 'center', border: `1px solid ${sol.color}20` }}>
                        <div className="mono" style={{ color: sol.color, fontWeight: 800, fontSize: '1.4rem' }}>{st.v}</div>
                        <div style={{ color: '#64748B', fontSize: '0.7rem', marginTop: 4 }}>{st.l}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '1rem 1.25rem', borderRadius: 10,
                    background: sol.color + '08', border: `1px solid ${sol.color}18`,
                    color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, fontStyle: 'italic',
                  }}>
                    💡 {sol.highlight}
                  </div>
                </div>

                {/* Right: Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sol.features.map((f, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{
                        padding: '1.25rem 1.5rem',
                        background: 'rgba(6,14,40,0.5)',
                        border: `1px solid rgba(6,182,212,0.08)`,
                        borderLeft: `3px solid ${sol.color}`,
                        borderRadius: '0 12px 12px 0',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>{f.t}</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.83rem', lineHeight: 1.6 }}>{f.d}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: '#020913' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="label">Deploy Today</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#E2E8F0', margin: '1rem 0', letterSpacing: '-0.02em' }}>
            Your Sector. Your Infrastructure.
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '2rem', lineHeight: 1.7 }}>
            Let our team walk you through a sector-specific deployment plan tailored to your organisation&apos;s security requirements.
          </p>
          <Link to="/company" className="btn-primary">Request a Sector Demo →</Link>
        </div>
      </section>
    </main>
  )
}
