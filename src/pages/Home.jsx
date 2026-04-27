import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/* ── PII Scanner ─────────────────────────────────────── */
const SEGMENTS = [
  { text: 'site_report_pilbara.pdf\n', pii: false, dim: true },
  { text: '─'.repeat(38) + '\n', pii: false, dim: true },
  { text: 'Inspector:  ', pii: false },
  { text: 'James Thornton',        pii: true,  type: 'NAME',   col: '#38BDF8' },
  { text: '\nABN:        ',        pii: false },
  { text: '51 824 753 556',        pii: true,  type: 'ABN',    col: '#F59E0B' },
  { text: '\nPhone:      ',        pii: false },
  { text: '0412 847 293',          pii: true,  type: 'PHONE',  col: '#A78BFA' },
  { text: '\nEmail:      ',        pii: false },
  { text: 'j.t@mining.com.au',     pii: true,  type: 'EMAIL',  col: '#34D399' },
  { text: '\nTFN:        ',        pii: false },
  { text: '872 493 157',           pii: true,  type: 'TFN',    col: '#F87171' },
  { text: '\nCard:       ',        pii: false },
  { text: '4532 **** **** 9012',   pii: true,  type: 'CC',     col: '#FB923C' },
  { text: '\n\nStatus: OPERATIONAL  |  Priority: HIGH\nDate:   2025-03-15', pii: false },
]

function PIIScanner() {
  const [phase, setPhase] = useState('idle')
  const [shown, setShown] = useState(new Set())

  useEffect(() => {
    let timers = []
    function cycle() {
      setPhase('idle'); setShown(new Set())
      timers.push(setTimeout(() => setPhase('scan'), 600))
      timers.push(setTimeout(() => {
        setPhase('done')
        SEGMENTS.filter(s => s.pii).forEach((s, i) => {
          timers.push(setTimeout(() => setShown(p => new Set([...p, s.type])), i * 180))
        })
      }, 2500))
      timers.push(setTimeout(cycle, 7500))
    }
    cycle()
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="terminal" style={{ animation: 'float-up 6s ease-in-out infinite' }}>
      {/* Chrome bar */}
      <div className="terminal-bar">
        <span className="terminal-dot" style={{ background: '#FF5F57' }} />
        <span className="terminal-dot" style={{ background: '#FFBD2E' }} />
        <span className="terminal-dot" style={{ background: '#28CA41' }} />
        <span className="mono" style={{ color: '#334155', fontSize: '0.72rem', marginLeft: 8 }}>
          pii-shield  /  site_report_pilbara.pdf
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: phase === 'scan' ? '#F59E0B' : phase === 'done' ? '#10B981' : '#334155',
            boxShadow: phase === 'scan' ? '0 0 8px #F59E0B' : phase === 'done' ? '0 0 8px #10B981' : 'none',
            transition: 'all 0.3s',
          }} />
          <span className="mono" style={{
            fontSize: '0.65rem', fontWeight: 700,
            color: phase === 'scan' ? '#F59E0B' : phase === 'done' ? '#10B981' : '#334155',
          }}>
            {phase === 'scan' ? 'SCANNING' : phase === 'done' ? 'SECURED' : 'STANDBY'}
          </span>
        </span>
      </div>

      {/* Scan content */}
      <div style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Moving scan line */}
        {phase === 'scan' && (
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #06B6D4 40%, #38BDF8 50%, #06B6D4 60%, transparent 100%)',
              boxShadow: '0 0 16px rgba(6,182,212,0.8)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}

        <pre className="mono" style={{ fontSize: '0.78rem', lineHeight: 1.85, color: '#475569', whiteSpace: 'pre-wrap' }}>
          {SEGMENTS.map((seg, i) => {
            if (!seg.pii) return (
              <span key={i} style={{ color: seg.dim ? '#1E293B' : '#94A3B8' }}>{seg.text}</span>
            )
            const redacted = phase === 'done' && shown.has(seg.type)
            return (
              <span key={i}>
                {redacted ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: seg.col + '18',
                      border: `1px solid ${seg.col}55`,
                      borderRadius: 4,
                      padding: '0 5px',
                      color: seg.col,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'█'.repeat(Math.min(seg.text.length, 10))}
                    <sup style={{ fontSize: '0.55rem', marginLeft: 3, opacity: 0.85 }}>{seg.type}</sup>
                  </motion.span>
                ) : (
                  <span style={{ color: '#E2E8F0' }}>{seg.text}</span>
                )}
              </span>
            )
          })}
          <span className="mono" style={{ color: '#06B6D4', animation: 'blink 1s step-end infinite' }}>▋</span>
        </pre>

        {/* PII legend */}
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(6,182,212,0.1)',
              display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
            }}
          >
            {SEGMENTS.filter(s => s.pii).map(s => (
              <span key={s.type} className="mono" style={{
                fontSize: '0.6rem', fontWeight: 700,
                padding: '2px 7px', borderRadius: 4,
                background: s.col + '15', color: s.col,
                border: `1px solid ${s.col}35`,
              }}>{s.type} ✓</span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ── Animated counter ───────────────────────────────── */
function Counter({ target, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ref.current) {
        ref.current = true
        const start = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1)
          setVal(Math.round(p * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    const el = document.getElementById('stats-anchor')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])
  return <>{val}{suffix}</>
}

/* ── Advantage cards ────────────────────────────────── */
const CARDS = [
  {
    icon: '🔒', color: '#06B6D4',
    title: '100% Local Inference',
    desc: 'No data ever leaves your firewall. Powered by local LLMs via Ollama. Zero cloud dependency, guaranteed.',
    stat: '0', statLabel: 'Cloud Calls',
  },
  {
    icon: '🏢', color: '#F59E0B',
    title: 'Multi-Tenant Isolation',
    desc: 'Physical and logical data separation for large-scale organisations with thousands of users and strict information barriers.',
    stat: '1K+', statLabel: 'Users / Tenant',
  },
  {
    icon: '📡', color: '#8B5CF6',
    title: 'Air-Gapped Ready',
    desc: 'Full operational capability offline — remote Pilbara mine sites, defence installations, classified government facilities.',
    stat: '100%', statLabel: 'Offline Capable',
  },
]

const TECH_PILLS = ['Self-RAG', 'GraphRAG', 'Agentic Tools', 'Multi-Modal Vision', 'Local LLMs', 'PII Shield']

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Home() {
  return (
    <main style={{ background: '#02060E' }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', paddingTop: 100, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', top: -350, left: -200, background: 'radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 65%)', animation: 'orb-1 14s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: -100, right: -200, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)', animation: 'orb-2 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: 0, right: '25%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)', animation: 'orb-3 11s ease-in-out infinite' }} />
          {/* Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(6,182,212,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.035) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '2rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              {/* Badge */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="label">Enterprise Sovereign AI · Perth, Australia</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                <span style={{ display: 'block', color: '#E2E8F0' }}>Your Data.</span>
                <span className="gradient-text" style={{ display: 'block' }}>Your Infrastructure.</span>
                <span className="gradient-text-amber" style={{ display: 'block' }}>Your Intelligence.</span>
              </h1>

              <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '2rem' }}>
                The world&apos;s first fully Sovereign RAG platform for high-security Australian enterprises.
                <strong style={{ color: '#94A3B8' }}> Intelligence without the cloud.</strong>
              </p>

              {/* Tech pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.25rem' }}>
                {TECH_PILLS.map(p => (
                  <span key={p} className="mono" style={{
                    fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20,
                    border: '1px solid rgba(6,182,212,0.2)', color: '#475569',
                    background: 'rgba(6,182,212,0.04)',
                  }}>{p}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/company" className="btn-primary">Request a Demo →</Link>
                <Link to="/technology" className="btn-ghost">Explore Technology</Link>
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <PIIScanner />
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            id="stats-anchor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1px',
              background: 'rgba(6,182,212,0.1)',
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(6,182,212,0.1)',
            }}
          >
            {[
              { label: 'PII Types Detected', val: 12, suffix: '+' },
              { label: 'Local Processing',   val: 100, suffix: '%' },
              { label: 'Cloud Dependencies', val: 0,   suffix: '' },
              { label: 'Users Per Tenant',   val: 1000, suffix: '+' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(2,6,14,0.95)', padding: '1.5rem', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#06B6D4' }}>
                  <Counter target={s.val} suffix={s.suffix} />
                </div>
                <div style={{ color: '#334155', fontSize: '0.75rem', marginTop: 4, letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sovereign Advantage ──────────────────────── */}
      <section className="section" style={{ background: '#020913' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span className="label">The Sovereign Advantage</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#E2E8F0', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              A Fortress of Intelligence
            </h2>
            <p style={{ color: '#475569', marginTop: '0.75rem', maxWidth: 520, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
              Not just a chatbot — a <strong style={{ color: '#64748B' }}>SaaS OS for Secure Knowledge</strong> engineered for organisations where data sovereignty is non-negotiable.
            </p>
          </motion.div>

          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}
          >
            {CARDS.map((c, i) => (
              <motion.div key={i} variants={item} className="glass" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
                {/* Shimmer effect */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 16, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)', animation: 'shimmer 4s ease infinite', animationDelay: `${i * 1.3}s` }} />
                </div>

                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: c.color + '18', border: `1px solid ${c.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: '1.25rem',
                }}>
                  {c.icon}
                </div>

                <h3 style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem' }}>{c.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>{c.desc}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="mono" style={{ color: c.color, fontWeight: 800, fontSize: '1.75rem' }}>{c.stat}</span>
                  <span style={{ color: '#334155', fontSize: '0.75rem' }}>{c.statLabel}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tech Preview ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="label">Platform Technology</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: '#E2E8F0', margin: '1rem 0', letterSpacing: '-0.02em' }}>
                Four Pillars of<br /><span className="gradient-text">Sovereign Intelligence</span>
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: '2rem' }}>
                Self-correcting RAG, knowledge graphs, agentic tools, and multi-modal vision — all running locally within your infrastructure.
              </p>
              <Link to="/technology" className="btn-ghost">Deep dive into the tech →</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            >
              {[
                { icon: '🔄', label: 'Self-RAG', desc: 'Critic loop · Zero hallucinations', col: '#06B6D4' },
                { icon: '🕸',  label: 'GraphRAG', desc: 'Entity relationships · Multi-hop', col: '#8B5CF6' },
                { icon: '⚙',  label: 'Agentic', desc: 'Local tools · Real computation', col: '#F59E0B' },
                { icon: '👁',  label: 'Vision', desc: 'Blueprints · Scans · Photos', col: '#10B981' },
              ].map((t, i) => (
                <div key={i} className="glass" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{t.icon}</div>
                  <div style={{ color: t.col, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{t.label}</div>
                  <div style={{ color: '#334155', fontSize: '0.75rem' }}>{t.desc}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Industry Strip ───────────────────────────── */}
      <section className="section" style={{ background: '#020913' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: '3.5rem' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="label">Industry Solutions</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: '#E2E8F0', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Built for WA&apos;s Most Demanding Sectors
            </h2>
          </motion.div>

          <motion.div
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
          >
            {[
              { icon: '⛏', col: '#F59E0B', name: 'Mining & Energy', tags: ['Offline Mode', 'Air-Gap', 'Safety Docs'], desc: 'Remote Pilbara sites, offshore platforms, zero connectivity dependency.' },
              { icon: '🏛', col: '#06B6D4', name: 'WA Government',   tags: ['Data Residency', 'ASD Essential 8', 'Classified Docs'], desc: 'Data sovereignty, AI Assurance Framework, full auditability.' },
              { icon: '⚖', col: '#8B5CF6', name: 'Legal & Health',  tags: ['PII Shield', 'Client Walls', 'Medical Records'], desc: 'High-confidentiality document intelligence, Privacy Act 1988 compliant.' },
            ].map((ind, i) => (
              <motion.div key={i} variants={item} className="glass" style={{ padding: '2rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: ind.col + '18', border: `1px solid ${ind.col}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: '1.25rem',
                }}>{ind.icon}</div>
                <h3 style={{ color: ind.col, fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{ind.name}</h3>
                <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{ind.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {ind.tags.map(t => (
                    <span key={t} className="mono" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4, background: ind.col + '12', color: ind.col, border: `1px solid ${ind.col}25` }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/solutions" className="btn-ghost">Explore all solutions →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section style={{ padding: '7rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)' }} />
        </div>
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <span className="label">Get Started</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#E2E8F0', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Ready to Secure<br /><span className="gradient-text-amber">Your Intelligence?</span>
          </h2>
          <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>
            Join Australian enterprises that trust AIDATARIS with their most sensitive data — completely on-premises, completely under their control.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/company" className="btn-primary">Request Demo →</Link>
            <Link to="/technology" className="btn-ghost">Learn the Technology</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
