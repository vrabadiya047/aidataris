import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/* ── Typewriter hook ─────────────────────────────────── */
const PHRASES = ['Your Infrastructure.', 'Your Security.', 'Your Compliance.', 'Your Knowledge.']

function useTypewriter() {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const word = PHRASES[idx]
    let t
    if (typing) {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), 75)
      } else {
        t = setTimeout(() => setTyping(false), 2200)
      }
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), 38)
      } else {
        setIdx(i => (i + 1) % PHRASES.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(t)
  }, [text, typing, idx])

  return text
}

/* ── Floating particles ──────────────────────────────── */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      startY: Math.random() * 100,
      size: Math.random() * 2 + 1,
      dur: Math.random() * 10 + 8,
      delay: Math.random() * 8,
      color: ['#06B6D4', '#8B5CF6', '#F59E0B', '#38BDF8'][Math.floor(Math.random() * 4)],
    }))
  , [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div key={p.id}
          style={{ position: 'absolute', left: p.x + '%', borderRadius: '50%', width: p.size, height: p.size, background: p.color }}
          animate={{ y: [p.startY + 'vh', (p.startY - 60) + 'vh'], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── PII Scanner ─────────────────────────────────────── */
const SEGMENTS = [
  { text: 'site_report_pilbara.pdf\n',    pii: false, dim: true },
  { text: '─'.repeat(36) + '\n',          pii: false, dim: true },
  { text: 'Inspector:  ',                 pii: false },
  { text: 'James Thornton',               pii: true, type: 'NAME',  col: '#38BDF8' },
  { text: '\nABN:        ',               pii: false },
  { text: '51 824 753 556',               pii: true, type: 'ABN',   col: '#F59E0B' },
  { text: '\nPhone:      ',               pii: false },
  { text: '0412 847 293',                 pii: true, type: 'PHONE', col: '#A78BFA' },
  { text: '\nEmail:      ',               pii: false },
  { text: 'j.t@mining.com.au',            pii: true, type: 'EMAIL', col: '#34D399' },
  { text: '\nTFN:        ',               pii: false },
  { text: '872 493 157',                  pii: true, type: 'TFN',   col: '#F87171' },
  { text: '\nCard:       ',               pii: false },
  { text: '4532 **** **** 9012',          pii: true, type: 'CC',    col: '#FB923C' },
  { text: '\n\nStatus: OPERATIONAL  |  Priority: HIGH\nDate:   2025-03-15', pii: false },
]

function PIIScanner() {
  const [phase, setPhase] = useState('idle')
  const [shown, setShown] = useState(new Set())

  useEffect(() => {
    const ts = []
    function cycle() {
      setPhase('idle'); setShown(new Set())
      ts.push(setTimeout(() => setPhase('scan'), 600))
      ts.push(setTimeout(() => {
        setPhase('done')
        SEGMENTS.filter(s => s.pii).forEach((s, i) => {
          ts.push(setTimeout(() => setShown(p => new Set([...p, s.type])), i * 180))
        })
      }, 2500))
      ts.push(setTimeout(cycle, 7800))
    }
    cycle()
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      className="terminal"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="terminal-bar">
        <span className="terminal-dot" style={{ background: '#FF5F57' }} />
        <span className="terminal-dot" style={{ background: '#FFBD2E' }} />
        <span className="terminal-dot" style={{ background: '#28CA41' }} />
        <span className="mono" style={{ color: 'var(--t4)', fontSize: '0.72rem', marginLeft: 8 }}>
          pii-shield  /  site_report_pilbara.pdf
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.span
            animate={{ opacity: phase === 'scan' ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 0.8, repeat: phase === 'scan' ? Infinity : 0 }}
            style={{
              width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
              background: phase === 'scan' ? '#F59E0B' : phase === 'done' ? '#10B981' : 'var(--t5)',
              boxShadow: phase === 'done' ? '0 0 8px #10B981' : 'none',
            }}
          />
          <span className="mono" style={{
            fontSize: '0.65rem', fontWeight: 700,
            color: phase === 'scan' ? '#F59E0B' : phase === 'done' ? '#10B981' : 'var(--t5)',
          }}>
            {phase === 'scan' ? 'SCANNING' : phase === 'done' ? 'SECURED' : 'STANDBY'}
          </span>
        </span>
      </div>

      <div style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence>
          {phase === 'scan' && (
            <motion.div
              initial={{ top: 0 }} animate={{ top: '100%' }} exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'linear' }}
              style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, #06B6D4, #38BDF8, #06B6D4, transparent)',
                boxShadow: '0 0 20px rgba(6,182,212,0.9)', zIndex: 10, pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        <pre className="mono" style={{ fontSize: '0.78rem', lineHeight: 1.9, color: 'var(--t4)', whiteSpace: 'pre-wrap' }}>
          {SEGMENTS.map((seg, i) => {
            if (!seg.pii) return (
              <span key={i} style={{ color: seg.dim ? 'var(--t6)' : 'var(--t3)' }}>{seg.text}</span>
            )
            const redacted = phase === 'done' && shown.has(seg.type)
            return (
              <span key={i}>
                {redacted ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: seg.col + '18', border: `1px solid ${seg.col}50`,
                      borderRadius: 4, padding: '0 5px', color: seg.col, whiteSpace: 'nowrap',
                    }}
                  >
                    {'█'.repeat(Math.min(seg.text.length, 10))}
                    <sup style={{ fontSize: '0.55rem', marginLeft: 3 }}>{seg.type}</sup>
                  </motion.span>
                ) : (
                  <span style={{ color: 'var(--t1)' }}>{seg.text}</span>
                )}
              </span>
            )
          })}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
            className="mono" style={{ color: '#06B6D4' }}
          >▋</motion.span>
        </pre>

        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '0.75rem', paddingTop: '0.75rem',
              borderTop: '1px solid rgba(6,182,212,0.1)',
              display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
            }}
          >
            {SEGMENTS.filter(s => s.pii).map(s => (
              <span key={s.type} className="mono" style={{
                fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                background: s.col + '15', color: s.col, border: `1px solid ${s.col}35`,
              }}>{s.type} ✓</span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Animated counter ───────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const done = useRef(false)
  const elRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const start = Date.now()
        const dur = 1800
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(ease * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (elRef.current) obs.observe(elRef.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={elRef}>{val}{suffix}</span>
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } }
const card = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }

const CARDS = [
  { icon: '🔒', color: '#06B6D4', title: '100% Local Inference',    desc: 'No data ever leaves your firewall. Powered by local LLMs via Ollama. Zero cloud dependency, guaranteed.', stat: '0',    statLabel: 'Cloud Calls' },
  { icon: '🏢', color: '#F59E0B', title: 'Multi-Tenant Isolation',  desc: 'Physical and logical data separation for large-scale organisations with thousands of users and strict information barriers.', stat: '1K+', statLabel: 'Users / Tenant' },
  { icon: '📡', color: '#8B5CF6', title: 'Air-Gapped Ready',        desc: 'Full operational capability offline — remote Pilbara mine sites, defence installations, classified government facilities.', stat: '100%', statLabel: 'Offline Capable' },
]

const TECH_PILLS = ['Self-RAG', 'GraphRAG', 'Agentic Tools', 'Multi-Modal Vision', 'Local LLMs', 'PII Shield']

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const typeText = useTypewriter()

  return (
    <main style={{ background: 'var(--bg)' }}>

      {/* ── Hero ───────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', paddingTop: 100, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background layers */}
        <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', y: heroY }}>
          <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', top: -350, left: -200, background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)', animation: 'orb-1 14s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: -100, right: -200, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)', animation: 'orb-2 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: 0, right: '25%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)', animation: 'orb-3 11s ease-in-out infinite' }} />
          <div className="hero-grid" />
        </motion.div>
        <Particles />

        <motion.div
          style={{ position: 'relative', zIndex: 1, width: '100%', opacity: heroOpacity }}
          className="container"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', padding: '2rem 1.5rem' }}>
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ marginBottom: '1.5rem' }}
              >
                <span className="label">Enterprise Sovereign AI · Perth, Australia</span>
              </motion.div>

              <h1 style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                <motion.span
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ display: 'block', color: 'var(--t1)' }}
                >Your Data.</motion.span>

                {/* Typewriter line */}
                <span style={{
                  display: 'block', minHeight: '1.1em',
                  background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite',
                }}>
                  {typeText}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(1)' }}
                    style={{ WebkitTextFillColor: '#06B6D4', marginLeft: 2 }}
                  >|</motion.span>
                </span>

                <motion.span
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{ display: 'block', color: '#F59E0B' }}
                >Your Intelligence.</motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{ color: 'var(--t3)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '2rem' }}
              >
                The world&apos;s first fully Sovereign RAG platform for high-security Australian enterprises.
                <strong style={{ color: 'var(--t1)' }}> Intelligence without the cloud.</strong>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.25rem' }}
              >
                {TECH_PILLS.map((p, i) => (
                  <motion.span key={p}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.07 }}
                    className="mono"
                    style={{
                      fontSize: '0.7rem', padding: '4px 12px', borderRadius: 20,
                      border: '1px solid rgba(6,182,212,0.2)', color: 'var(--t3)',
                      background: 'rgba(6,182,212,0.05)',
                    }}
                  >{p}</motion.span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
              >
                <Link to="/company" className="btn-primary">Request a Demo →</Link>
                <Link to="/technology" className="btn-ghost">Explore Technology</Link>
              </motion.div>
            </motion.div>

            {/* Right: PII Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <PIIScanner />
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              margin: '3.5rem 1.5rem 0',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1px', background: 'var(--bd)',
              borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(6,182,212,0.1)',
            }}
          >
            {[
              { label: 'PII Types Detected', val: 12, suffix: '+' },
              { label: 'Local Processing',   val: 100, suffix: '%' },
              { label: 'Cloud Dependencies', val: 0,   suffix: '' },
              { label: 'Users Per Tenant',   val: 1000, suffix: '+' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--stat-cell)', padding: '1.5rem', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#06B6D4' }}>
                  <Counter target={s.val} suffix={s.suffix} />
                </div>
                <div style={{ color: 'var(--t4)', fontSize: '0.75rem', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Sovereign Advantage ──────────────────────── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '5rem' }} />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span className="label">The Sovereign Advantage</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              A Fortress of Intelligence
            </h2>
            <p style={{ color: 'var(--t3)', marginTop: '0.75rem', maxWidth: 520, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
              Not just a chatbot — a <strong style={{ color: 'var(--t1)' }}>SaaS OS for Secure Knowledge</strong> engineered for organisations where data sovereignty is non-negotiable.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}
          >
            {CARDS.map((c, i) => (
              <motion.div key={i} variants={card} className="glass"
                style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: c.color + '18', border: `1px solid ${c.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', marginBottom: '1.25rem',
                  }}
                >{c.icon}</motion.div>

                <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem' }}>{c.title}</h3>
                <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{c.desc}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="mono" style={{ color: c.color, fontWeight: 800, fontSize: '1.75rem' }}>{c.stat}</span>
                  <span style={{ color: 'var(--t4)', fontSize: '0.75rem' }}>{c.statLabel}</span>
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
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="label">Platform Technology</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0', letterSpacing: '-0.02em' }}>
                Four Pillars of<br />
                <span style={{
                  background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)',
                  backgroundSize: '200%', WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  animation: 'gradient-shift 5s ease infinite',
                }}>Sovereign Intelligence</span>
              </h2>
              <p style={{ color: 'var(--t3)', lineHeight: 1.75, marginBottom: '2rem' }}>
                Self-correcting RAG, knowledge graphs, agentic tools, and multi-modal vision — all running locally within your infrastructure.
              </p>
              <Link to="/technology" className="btn-ghost">Deep dive into the tech →</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            >
              {[
                { icon: '🔄', label: 'Self-RAG',  desc: 'Critic loop · Zero hallucinations', col: '#06B6D4' },
                { icon: '🕸',  label: 'GraphRAG', desc: 'Entity relationships · Multi-hop',   col: '#8B5CF6' },
                { icon: '⚙',  label: 'Agentic',   desc: 'Local tools · Real computation',     col: '#F59E0B' },
                { icon: '👁',  label: 'Vision',    desc: 'Blueprints · Scans · Photos',        col: '#10B981' },
              ].map((t, i) => (
                <motion.div key={i} className="glass" style={{ padding: '1.25rem' }}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, borderColor: t.col }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{t.icon}</div>
                  <div style={{ color: t.col, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{t.label}</div>
                  <div style={{ color: 'var(--t4)', fontSize: '0.75rem' }}>{t.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Industry Strip ───────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '5rem' }} />
        <div className="container">
          <motion.div
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="label">Industry Solutions</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Built for WA&apos;s Most Demanding Sectors
            </h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
          >
            {[
              { icon: '⛏', col: '#F59E0B', name: 'Mining & Energy', tags: ['Offline Mode', 'Air-Gap', 'Safety Docs'], desc: 'Remote Pilbara sites, offshore platforms, zero connectivity dependency.' },
              { icon: '🏛', col: '#06B6D4', name: 'WA Government',   tags: ['Data Residency', 'ASD Essential 8', 'Classified Docs'], desc: 'Data sovereignty, AI Assurance Framework, full auditability.' },
              { icon: '⚖', col: '#8B5CF6', name: 'Legal & Health',  tags: ['PII Shield', 'Client Walls', 'Medical Records'], desc: 'High-confidentiality document intelligence, Privacy Act 1988 compliant.' },
            ].map((ind, i) => (
              <motion.div key={i} variants={card} className="glass" style={{ padding: '2rem' }}
                whileHover={{ y: -6, borderColor: ind.col + '60' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: ind.col + '18', border: `1px solid ${ind.col}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', marginBottom: '1.25rem',
                  }}
                >{ind.icon}</motion.div>
                <h3 style={{ color: ind.col, fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{ind.name}</h3>
                <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1rem' }}>{ind.desc}</p>
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

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{ padding: '7rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(245,158,11,1) 0%, transparent 65%)', pointerEvents: 'none' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}
        >
          <span className="label">Get Started</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Ready to Secure<br />
            <span style={{ color: '#F59E0B' }}>Your Intelligence?</span>
          </h2>
          <p style={{ color: 'var(--t3)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 2.5rem' }}>
            Join Australian enterprises that trust AIDATARIS with their most sensitive data — completely on-premises, completely under their control.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/company" className="btn-primary">Request Demo →</Link>
            <Link to="/technology" className="btn-ghost">Learn the Technology</Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
