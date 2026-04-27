import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const PII_SEGMENTS = [
  { text: 'Site Inspection Report — Pilbara Region\n', redact: false },
  { text: 'Prepared by: ',                              redact: false },
  { text: 'James Thornton',                             redact: true,  type: 'NAME' },
  { text: '  |  ABN: ',                                 redact: false },
  { text: '51 824 753 556',                             redact: true,  type: 'ABN' },
  { text: '\nPhone: ',                                  redact: false },
  { text: '0412 847 293',                               redact: true,  type: 'PHONE' },
  { text: '  |  Email: ',                               redact: false },
  { text: 'j.thornton@mining.com.au',                   redact: true,  type: 'EMAIL' },
  { text: '\nTFN: ',                                    redact: false },
  { text: '872 493 157',                                redact: true,  type: 'TFN' },
  { text: '  |  Card: ',                                redact: false },
  { text: '4532 1234 5678 9012',                        redact: true,  type: 'CREDIT CARD' },
  { text: '\n\nSite Status: Operational  |  Priority: HIGH\nInspection Date: 2025-03-15', redact: false },
]

const PII_COLORS = {
  NAME: '#06B6D4', ABN: '#F59E0B', PHONE: '#8B5CF6',
  EMAIL: '#10B981', TFN: '#EF4444', 'CREDIT CARD': '#F97316',
}

function PIIScanner() {
  const [phase, setPhase] = useState('idle') // idle | scanning | redacted
  const [revealedPII, setRevealedPII] = useState([])

  useEffect(() => {
    let t1, t2, t3, t4
    function runCycle() {
      setPhase('idle')
      setRevealedPII([])
      t1 = setTimeout(() => setPhase('scanning'), 800)
      t2 = setTimeout(() => {
        setPhase('redacted')
        const piiItems = PII_SEGMENTS.filter(s => s.redact).map(s => s.type)
        piiItems.forEach((type, i) => {
          t3 = setTimeout(() => setRevealedPII(prev => [...prev, type]), i * 200)
        })
      }, 2800)
      t4 = setTimeout(runCycle, 7000)
    }
    runCycle()
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      background: '#0D1117',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: '1.5rem',
      fontFamily: 'Courier New, monospace',
      fontSize: '0.8rem',
      lineHeight: 1.8,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scan line */}
      <AnimatePresence>
        {phase === 'scanning' && (
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #06B6D4, transparent)',
              boxShadow: '0 0 12px #06B6D4',
              zIndex: 10,
            }}
          />
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1E293B',
      }}>
        <span style={{ color: '#94A3B8', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          AIDATARIS PII SHIELD — LIVE REDACTION
        </span>
        <span style={{
          color: phase === 'scanning' ? '#F59E0B' : phase === 'redacted' ? '#10B981' : '#64748B',
          fontSize: '0.7rem', fontWeight: 700,
        }}>
          {phase === 'scanning' ? '⬤ SCANNING' : phase === 'redacted' ? '⬤ SECURED' : '⬤ STANDBY'}
        </span>
      </div>

      {/* Document content */}
      <div style={{ color: '#94A3B8', whiteSpace: 'pre-wrap' }}>
        {PII_SEGMENTS.map((seg, i) => {
          if (!seg.redact) return <span key={i} style={{ color: '#CBD5E1' }}>{seg.text}</span>
          const isRedacted = phase === 'redacted' && revealedPII.includes(seg.type)
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {isRedacted ? (
                <motion.span
                  initial={{ opacity: 0, scaleX: 0.5 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  style={{
                    background: PII_COLORS[seg.type] + '22',
                    border: `1px solid ${PII_COLORS[seg.type]}55`,
                    borderRadius: 3,
                    padding: '0 4px',
                    color: PII_COLORS[seg.type],
                    fontSize: '0.75rem',
                  }}
                >
                  {'█'.repeat(seg.text.length > 8 ? 8 : seg.text.length)}
                  <sup style={{ fontSize: '0.55rem', marginLeft: 3, opacity: 0.9 }}>{seg.type}</sup>
                </motion.span>
              ) : (
                <span style={{ color: '#F8FAFC' }}>{seg.text}</span>
              )}
            </span>
          )
        })}
      </div>

      {/* PII count badge */}
      {phase === 'redacted' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #1E293B',
            display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
          }}
        >
          {Object.entries(PII_COLORS).slice(0, 6).map(([type, color]) => (
            <span key={type} style={{
              background: color + '18', border: `1px solid ${color}44`,
              borderRadius: 4, padding: '1px 6px', fontSize: '0.65rem',
              color, fontWeight: 700, letterSpacing: '0.05em',
            }}>{type}</span>
          ))}
        </motion.div>
      )}
    </div>
  )
}

const ADVANTAGE_CARDS = [
  {
    icon: '🔒',
    title: '100% Local Inference',
    desc: 'No data ever leaves your firewall. Powered by local LLMs via Ollama. Zero cloud dependency.',
    accent: '#06B6D4',
  },
  {
    icon: '🏢',
    title: 'Multi-Tenant Isolation',
    desc: 'Rigorous physical and logical data separation for large-scale organisations with 1,000+ users.',
    accent: '#F59E0B',
  },
  {
    icon: '📡',
    title: 'Air-Gapped Ready',
    desc: 'Full operational capability in offline environments — remote mining sites, defence installations.',
    accent: '#8B5CF6',
  },
]

const STATS = [
  { value: '12+',  label: 'PII Types Detected' },
  { value: '100%', label: 'Local Processing' },
  { value: '0',    label: 'Cloud Dependencies' },
  { value: '1K+',  label: 'Users per Tenant' },
]

export default function Home() {
  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="grid-bg" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '7rem 1.5rem 4rem',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,182,212,0.06), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}>
            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="section-label">Enterprise Sovereign AI · Perth, Australia</span>
                <h1 style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginTop: '1rem',
                  marginBottom: '1.5rem',
                  color: '#F8FAFC',
                }}>
                  Your Data.
                  <br />
                  <span style={{ color: '#06B6D4' }}>Your Infrastructure.</span>
                  <br />
                  Your Intelligence.
                </h1>
                <p style={{
                  color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7,
                  marginBottom: '2rem', maxWidth: 480,
                }}>
                  The world&apos;s first fully Sovereign RAG platform designed for high-security
                  Australian enterprises. Intelligence without the cloud.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/company" className="btn-primary">Request a Demo</Link>
                  <Link to="/technology" className="btn-secondary">Explore Technology</Link>
                </div>
              </motion.div>
            </div>

            {/* Right: PII Animation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <PIIScanner />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#0D1117', borderTop: '1px solid #1E293B', borderBottom: '1px solid #1E293B' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1.5rem', textAlign: 'center',
        }}>
          {STATS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#06B6D4', fontFamily: 'Courier New, monospace' }}>{s.value}</div>
              <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.25rem', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sovereign Advantage */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">The Sovereign Advantage</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#F8FAFC', marginTop: '0.75rem' }}>
              A Fortress of Intelligence
            </h2>
            <p style={{ color: '#64748B', marginTop: '0.75rem', maxWidth: 520, margin: '0.75rem auto 0' }}>
              AIDATARIS is not just a chatbot. It&apos;s a SaaS OS for Secure Knowledge — engineered for organisations where data sovereignty is non-negotiable.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem',
          }}>
            {ADVANTAGE_CARDS.map((card, i) => (
              <motion.div key={i} className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ borderTop: `3px solid ${card.accent}` }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{card.icon}</div>
                <h3 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                  {card.title}
                </h3>
                <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.9rem' }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry teaser */}
      <section style={{ padding: '5rem 1.5rem', background: '#0D1117', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">Industry Solutions</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 1rem' }}>
                Built for Western Australia&apos;s Most Demanding Sectors
              </h2>
              <p style={{ color: '#64748B', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                From remote Pilbara mine sites to government data centres and legal chambers — AIDATARIS operates where cloud AI cannot.
              </p>
              <Link to="/solutions" className="btn-secondary">Explore Solutions</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '⛏', label: 'Mining & Energy', desc: 'Offline mode for remote sites, safety spec analysis', color: '#F59E0B' },
                { icon: '🏛', label: 'WA Government',  desc: 'AI Assurance Framework, data residency compliance', color: '#06B6D4' },
                { icon: '⚖', label: 'Legal & Health',  desc: 'High-confidentiality document search, PII protection', color: '#8B5CF6' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    padding: '1rem', background: '#1E293B', borderRadius: 10,
                    border: '1px solid #334155',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ color: item.color, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{item.label}</div>
                    <div style={{ color: '#64748B', fontSize: '0.85rem' }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(245,158,11,0.06), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <span className="section-label">Get Started Today</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#F8FAFC', margin: '1rem 0' }}>
            Ready to Secure Your Data?
          </h2>
          <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '2rem' }}>
            Join Australian enterprises that trust AIDATARIS to handle their most sensitive data — completely on-premises, completely under their control.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/company" className="btn-primary">Request Demo</Link>
            <Link to="/technology" className="btn-secondary">Learn the Technology</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
