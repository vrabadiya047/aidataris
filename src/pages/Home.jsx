import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Particles ───────────────────────────────────────── */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i, x: Math.random() * 100, startY: Math.random() * 100,
      size: Math.random() * 2 + 1, dur: Math.random() * 10 + 8, delay: Math.random() * 8,
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

/* ── PII Scanner terminal ────────────────────────────── */
const SEGMENTS = [
  { text: 'site_report_pilbara.pdf\n', pii: false, dim: true },
  { text: '─'.repeat(36) + '\n',       pii: false, dim: true },
  { text: 'Inspector:  ',              pii: false },
  { text: 'James Thornton',            pii: true, type: 'NAME',  col: '#38BDF8' },
  { text: '\nABN:        ',            pii: false },
  { text: '51 824 753 556',            pii: true, type: 'ABN',   col: '#F59E0B' },
  { text: '\nPhone:      ',            pii: false },
  { text: '0412 847 293',              pii: true, type: 'PHONE', col: '#A78BFA' },
  { text: '\nEmail:      ',            pii: false },
  { text: 'j.t@mining.com.au',         pii: true, type: 'EMAIL', col: '#34D399' },
  { text: '\nTFN:        ',            pii: false },
  { text: '872 493 157',               pii: true, type: 'TFN',   col: '#F87171' },
  { text: '\nCard:       ',            pii: false },
  { text: '4532 **** **** 9012',       pii: true, type: 'CC',    col: '#FB923C' },
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
    <motion.div className="terminal" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
      <div className="terminal-bar">
        <span className="terminal-dot" style={{ background: '#FF5F57' }} />
        <span className="terminal-dot" style={{ background: '#FFBD2E' }} />
        <span className="terminal-dot" style={{ background: '#28CA41' }} />
        <span className="mono" style={{ color: '#6B7280', fontSize: '0.72rem', marginLeft: 8 }}>pii-shield  /  site_report_pilbara.pdf</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.span
            animate={{ opacity: phase === 'scan' ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 0.8, repeat: phase === 'scan' ? Infinity : 0 }}
            style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: phase === 'scan' ? '#F59E0B' : phase === 'done' ? '#10B981' : '#6B7280', boxShadow: phase === 'done' ? '0 0 8px #10B981' : 'none' }}
          />
          <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: phase === 'scan' ? '#F59E0B' : phase === 'done' ? '#10B981' : '#6B7280' }}>
            {phase === 'scan' ? 'SCANNING' : phase === 'done' ? 'SECURED' : 'STANDBY'}
          </span>
        </span>
      </div>
      <div style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence>
          {phase === 'scan' && (
            <motion.div initial={{ top: 0 }} animate={{ top: '100%' }} exit={{ opacity: 0 }} transition={{ duration: 2, ease: 'linear' }}
              style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #06B6D4, #38BDF8, #06B6D4, transparent)', boxShadow: '0 0 20px rgba(6,182,212,0.9)', zIndex: 10, pointerEvents: 'none' }} />
          )}
        </AnimatePresence>
        <pre className="mono" style={{ fontSize: '0.78rem', lineHeight: 1.9, color: '#9CA3AF', whiteSpace: 'pre-wrap' }}>
          {SEGMENTS.map((seg, i) => {
            if (!seg.pii) return <span key={i} style={{ color: seg.dim ? '#4B5563' : '#9CA3AF' }}>{seg.text}</span>
            const redacted = phase === 'done' && shown.has(seg.type)
            return (
              <span key={i}>
                {redacted ? (
                  <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ background: seg.col + '18', border: `1px solid ${seg.col}50`, borderRadius: 4, padding: '0 5px', color: seg.col, whiteSpace: 'nowrap' }}>
                    {'█'.repeat(Math.min(seg.text.length, 10))}
                    <sup style={{ fontSize: '0.55rem', marginLeft: 3 }}>{seg.type}</sup>
                  </motion.span>
                ) : (
                  <span style={{ color: '#E5E7EB' }}>{seg.text}</span>
                )}
              </span>
            )
          })}
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }} className="mono" style={{ color: '#06B6D4' }}>▋</motion.span>
        </pre>
        {phase === 'done' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {SEGMENTS.filter(s => s.pii).map(s => (
              <span key={s.type} className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: s.col + '15', color: s.col, border: `1px solid ${s.col}35` }}>{s.type} ✓</span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Animated counter ────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const done = useRef(false)
  const elRef = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const start = Date.now(), dur = 1800
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1)
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
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

/* ── Architecture flow step ──────────────────────────── */
function FlowStep({ step, icon, color, title, desc, delay, isLast }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass"
        style={{ flex: 1, padding: '1.5rem 1.25rem', border: `1px solid ${color}25`, position: 'relative', textAlign: 'center' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color, borderRadius: '16px 16px 0 0' }} />
        <div className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color, letterSpacing: '0.15em', marginBottom: '0.75rem' }}>STEP {step}</div>
        <div style={{
          width: 48, height: 48, borderRadius: 12, margin: '0 auto 0.85rem',
          background: color + '15', border: `1px solid ${color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
        }}>{icon}</div>
        <div style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{title}</div>
        <div style={{ color: 'var(--t5)', fontSize: '0.75rem', lineHeight: 1.55 }}>{desc}</div>
      </motion.div>

      {!isLast && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }} transition={{ delay: delay + 0.3, duration: 0.4 }}
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 0.4rem' }}
        >
          <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, ${color}, #06B6D4)`, opacity: 0.6 }} />
          <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `6px solid #06B6D4`, opacity: 0.6 }} />
        </motion.div>
      )}
    </div>
  )
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } }
const card = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }

/* ── Chat mockup ─────────────────────────────────────── */
function ChatMockup() {
  const [citationOpen, setCitationOpen] = useState(false)

  return (
    <div style={{
      background: '#0B1628',
      border: '1px solid rgba(6,182,212,0.2)',
      borderRadius: 18,
      boxShadow: '0 0 0 1px rgba(6,182,212,0.06), 0 32px 80px rgba(0,0,0,0.45), 0 0 40px rgba(6,182,212,0.06)',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Title bar */}
      <div style={{
        background: '#0D1F3A',
        padding: '0.65rem 1rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        borderBottom: '1px solid rgba(6,182,212,0.1)',
      }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD2E' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28CA41' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem',
            background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)',
            borderRadius: 6, padding: '2px 10px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
            <span className="mono" style={{ fontSize: '0.6rem', color: '#9CA3AF', letterSpacing: '0.06em' }}>AIDATARIS · LOCAL INFERENCE · SECURE</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 320 }}>

        {/* System header */}
        <div style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: '0.6rem', color: '#4B5563', letterSpacing: '0.1em' }}>TODAY · PILBARA SITE 07 · SESSION ENCRYPTED</span>
        </div>

        {/* User message */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <div style={{
            maxWidth: '78%',
            background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
            color: '#fff', borderRadius: '14px 14px 3px 14px',
            padding: '0.75rem 1rem', fontSize: '0.83rem', lineHeight: 1.55, fontWeight: 500,
            boxShadow: '0 4px 16px rgba(14,165,233,0.25)',
          }}>
            What is the max load for the Sector 4 ventilation shafts?
          </div>
        </motion.div>

        {/* Thinking indicator then AI response */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.65, duration: 0.5 }}
          style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}
        >
          {/* Avatar */}
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 800, color: '#fff',
          }}>A</div>

          <div style={{ flex: 1 }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(6,182,212,0.15)',
              borderRadius: '3px 14px 14px 14px',
              padding: '0.85rem 1rem',
            }}>
              <p style={{ color: '#E5E7EB', fontSize: '0.83rem', lineHeight: 1.65, margin: 0, marginBottom: '0.75rem' }}>
                Based on the{' '}
                <span style={{
                  background: 'rgba(6,182,212,0.15)', color: '#38BDF8',
                  borderRadius: 4, padding: '1px 5px', fontSize: '0.78rem', fontWeight: 600,
                }}>Pilbara Site Engineering Specs [Page 42]</span>
                , the maximum load is{' '}
                <span style={{ color: '#10B981', fontWeight: 700 }}>4,500kg</span>
                . This was updated in the latest Q3 audit.
              </p>

              {/* Source citation button + expand */}
              <div>
                <button
                  onClick={() => setCitationOpen(o => !o)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    background: citationOpen ? 'rgba(139,92,246,0.18)' : 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.35)',
                    color: '#A78BFA', fontSize: '0.7rem', fontWeight: 700,
                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>📎</span>
                  SOURCE CITATION
                  <motion.span animate={{ rotate: citationOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: '0.6rem' }}>▼</motion.span>
                </button>

                <AnimatePresence>
                  {citationOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: '0.6rem', padding: '0.65rem 0.75rem',
                        background: 'rgba(139,92,246,0.07)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: 8,
                      }}>
                        {[
                          { doc: 'Pilbara Site Engineering Specs v4.2', page: 'p. 42', match: '98%' },
                          { doc: 'Q3 Structural Audit Report 2024',     page: 'p. 7',  match: '91%' },
                        ].map((src, i) => (
                          <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.3rem 0',
                            borderBottom: i === 0 ? '1px solid rgba(139,92,246,0.12)' : 'none',
                          }}>
                            <div>
                              <div className="mono" style={{ color: '#C4B5FD', fontSize: '0.67rem', fontWeight: 600 }}>{src.doc}</div>
                              <div className="mono" style={{ color: '#6B7280', fontSize: '0.6rem' }}>{src.page}</div>
                            </div>
                            <span className="mono" style={{
                              fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                              background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)',
                            }}>{src.match}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Input bar */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid rgba(6,182,212,0.1)',
        background: '#0D1F3A',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
      }}>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: 10, padding: '0.6rem 0.85rem',
          color: '#4B5563', fontSize: '0.78rem',
          fontFamily: 'Inter, sans-serif',
        }}>Ask anything about your documents...</div>
        <button style={{
          width: 34, height: 34, borderRadius: 9, border: 'none',
          background: 'linear-gradient(135deg, #06B6D4, #2563EB)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '0.9rem', flexShrink: 0,
        }}>↑</button>
        <button style={{
          width: 34, height: 34, borderRadius: 9, border: '1px solid rgba(6,182,212,0.2)',
          background: 'rgba(6,182,212,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0, color: '#06B6D4',
        }}>🎙</button>
      </div>
    </div>
  )
}

const FLOW_STEPS = [
  { step: 1, icon: '📄', color: '#06B6D4', title: 'Document Upload',      desc: 'PDF, DOCX, images, blueprints ingested into the secure pipeline' },
  { step: 2, icon: '🛡', color: '#F87171', title: 'PII Privacy Shield',   desc: 'TFNs, ABNs, Medicare numbers, names — redacted before indexing' },
  { step: 3, icon: '🕸', color: '#8B5CF6', title: 'Qdrant + Neo4j Engine', desc: 'GraphRAG builds entity relationships across your entire corpus' },
  { step: 4, icon: '🤖', color: '#10B981', title: 'Local Ollama LLM',     desc: 'On-premises inference. Zero cloud calls. Zero data egress.' },
]

const BENEFITS = [
  {
    icon: '🏢', color: '#06B6D4',
    title: 'Complete Departmental Isolation.',
    desc: 'Host Legal, HR, and Engineering on a single server with mathematically guaranteed zero data overlap via Hierarchical Multi-Tenancy. Each department operates in a cryptographically isolated namespace — a query from Legal cannot surface Engineering data. Ever.',
    stat: '0', statLabel: 'Cross-Dept Leakage',
    tags: ['Multi-Tenancy', 'Namespace Isolation', 'Cryptographic Walls'],
  },
  {
    icon: '⚙', color: '#F59E0B',
    title: 'Autonomous Engineering Tools.',
    desc: 'Our AI doesn\'t just read; it safely executes local Python math, pipeline, and timeline calculations to verify site budgets with 100% precision. No external API calls. No data leaving your environment. Computation that your compliance team can actually audit.',
    stat: '100%', statLabel: 'Local Computation',
    tags: ['Agentic Tools', 'Local Python', 'Zero External APIs'],
  },
  {
    icon: '🔒', color: '#10B981',
    title: 'Automated Privacy Shield.',
    desc: 'Every query and document is scrubbed of sensitive PII before indexing, backed by a permanent, cryptographically-signed audit trail for your compliance officers. 12+ PII categories detected automatically — TFN, ABN, Medicare, credit cards, passports, and more.',
    stat: '12+', statLabel: 'PII Categories',
    tags: ['Auto-Redaction', 'Signed Audit Log', 'Privacy Act 1988'],
  },
]

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <main style={{ background: 'var(--bg)' }}>
      <Helmet>
        <title>AIDATARIS | Enterprise Sovereign AI &amp; Local RAG — Perth, Western Australia</title>
        <meta name="description" content="100% on-premises, air-gapped Sovereign AI for Australian mining, government, and legal sectors. GraphRAG, agentic tools, PII protection. Zero cloud. Zero egress. Built in Perth, WA." />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', paddingTop: 100, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', y: heroY }}>
          <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', top: -350, left: -200, background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)', animation: 'orb-1 14s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: -100, right: -200, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', animation: 'orb-2 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: 0, right: '25%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)', animation: 'orb-3 11s ease-in-out infinite' }} />
          <div className="hero-grid" />
        </motion.div>
        <Particles />

        <motion.div style={{ position: 'relative', zIndex: 1, width: '100%', opacity: heroOpacity }} className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', padding: '2rem 1.5rem' }}>

            {/* Left copy */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }} style={{ marginBottom: '1.5rem' }}>
                <span className="label">Enterprise Sovereign AI · Perth, Western Australia</span>
              </motion.div>

              <h1 style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.9rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ display: 'block', color: 'var(--t1)' }}>
                  Sovereign AI for
                </motion.span>
                <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32, duration: 0.6 }}
                  style={{ display: 'block', color: 'var(--t1)' }}>
                  High-Security Australian
                </motion.span>
                <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.44, duration: 0.6 }}
                  style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)',
                    backgroundSize: '200% 200%', WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    animation: 'gradient-shift 5s ease infinite',
                  }}>
                  Enterprise.
                </motion.span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
                style={{ color: 'var(--t3)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 500, marginBottom: '2.25rem' }}>
                Bring the intelligence to your data, not your data to the cloud. The secure, air-gapped RAG architecture built for Western Australia.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/company" className="btn-primary">Book On-Premises Demo →</Link>
                <Link to="/security" className="btn-ghost">View Security Architecture</Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '1.75rem' }}>
                {['Self-RAG', 'GraphRAG', 'Agentic Tools', 'Multi-Modal Vision', 'Air-Gapped', 'PII Shield'].map((p, i) => (
                  <motion.span key={p} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + i * 0.07 }}
                    className="mono" style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(6,182,212,0.2)', color: 'var(--t4)', background: 'rgba(6,182,212,0.05)' }}>
                    {p}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: PII terminal */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <PIIScanner />
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
            style={{ margin: '3.5rem 1.5rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1px', background: 'var(--bd)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(6,182,212,0.1)' }}>
            {[
              { label: 'PII Types Detected',  val: 12,   suffix: '+' },
              { label: 'Local Processing',    val: 100,  suffix: '%' },
              { label: 'Cloud Dependencies',  val: 0,    suffix: '' },
              { label: 'Users Per Tenant',    val: 1000, suffix: '+' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--stat-cell)', padding: '1.5rem', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#06B6D4' }}><Counter target={s.val} suffix={s.suffix} /></div>
                <div style={{ color: 'var(--t4)', fontSize: '0.75rem', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Architecture & Trust ─────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '5rem' }} />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label">Zero-Egress Data Pipeline</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              How Your Data Stays <span className="gradient-text">Sovereign</span>
            </h2>
            <p style={{ color: 'var(--t4)', marginTop: '0.75rem', maxWidth: 540, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
              Every byte follows the same immutable pipeline — ingestion, redaction, indexing, inference — entirely within your perimeter.
            </p>
          </motion.div>

          {/* Flow diagram */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {FLOW_STEPS.map((s, i) => (
              <FlowStep key={s.step} {...s} delay={i * 0.15} isLast={i === FLOW_STEPS.length - 1} />
            ))}
          </div>

          {/* Trust banner */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }}
            style={{ marginTop: '3rem', padding: '1.25rem 2rem', borderRadius: 12, background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.5rem 2rem' }}>
            {[
              '✦ Australian Privacy Principles (APP)',
              '✦ ISO 27001 Readiness',
              '✦ Zero-Egress Architecture',
              '✦ ASD Essential Eight Aligned',
              '✦ PSPF Compatible',
            ].map((item, i) => (
              <span key={i} className="mono" style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--t4)', letterSpacing: '0.06em' }}>{item}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Solutions ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label">Our Solutions</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Enterprise Products.<br /><span className="gradient-text">Built for Security-First Organisations.</span>
            </h2>
            <p style={{ color: 'var(--t4)', marginTop: '0.75rem', maxWidth: 520, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
              Three flagship products designed to solve the hardest intelligence problems in high-security Australian enterprise.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: '🕸', color: '#06B6D4',
                name: 'Sovereign RAG',
                tagline: 'Private document intelligence',
                desc: 'Query your entire document corpus in natural language — contracts, manuals, blueprints, compliance codes — with zero data leaving your perimeter. Powered by Qdrant vector search and Neo4j knowledge graphs.',
                tags: ['Qdrant Vector DB', 'Neo4j GraphRAG', 'Local Ollama LLM'],
                link: '/solutions',
              },
              {
                icon: '🛡', color: '#8B5CF6',
                name: 'Compliance Shield',
                tagline: 'Auto-PII redaction',
                desc: 'Every document ingested is automatically scanned and redacted across 12+ PII categories — TFN, ABN, Medicare, credit cards, and more — before indexing. A cryptographically-signed audit trail satisfies your compliance officers.',
                tags: ['12+ PII Categories', 'Signed Audit Log', 'Privacy Act 1988'],
                link: '/security',
              },
              {
                icon: '📡', color: '#F59E0B',
                name: 'Offline Edge AI',
                tagline: 'P2P sync for remote sites',
                desc: 'Full RAG intelligence with zero internet dependency. Pre-loaded knowledge bases sync peer-to-peer across remote Pilbara sites. Voice-to-text transcription runs entirely on-device. Operations never stop, even when the network does.',
                tags: ['P2P Sync', 'Air-Gapped', 'Voice-to-Text'],
                link: '/solutions',
              },
            ].map((sol, i) => (
              <motion.div key={i} variants={card} className="glass"
                style={{ padding: '2.25rem', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 280 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${sol.color}, transparent)` }} />
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: sol.color + '18',
                  border: `1px solid ${sol.color}35`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem',
                }}>{sol.icon}</div>
                <div className="mono" style={{ color: sol.color, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                  {sol.tagline.toUpperCase()}
                </div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.75rem' }}>{sol.name}</h3>
                <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>{sol.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                  {sol.tags.map(t => (
                    <span key={t} className="mono" style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 4, background: sol.color + '12', color: sol.color, border: `1px solid ${sol.color}25` }}>{t}</span>
                  ))}
                </div>
                <Link to={sol.link} style={{ color: sol.color, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Learn more →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Leadership ───────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '5rem' }} />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label">Our Leadership</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Built by Engineers Who've<br /><span className="gradient-text">Worked in the Field.</span>
            </h2>
          </motion.div>

          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="glass" style={{ padding: '2.5rem', border: '1px solid rgba(6,182,212,0.18)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Avatar */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: 20,
                    background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                    boxShadow: '0 0 30px rgba(6,182,212,0.25)',
                    marginBottom: '0.75rem', overflow: 'hidden',
                  }}>
                    <img src="/photo.png" alt="Vivek Rabadiya"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div className="mono" style={{ fontSize: '0.6rem', color: '#06B6D4', fontWeight: 700, letterSpacing: '0.1em' }}>FOUNDER & CEO</div>
                </div>

                {/* Bio */}
                <div>
                  <h3 style={{ color: 'var(--t1)', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Vivek Rabadiya</h3>
                  <p style={{ color: 'var(--t4)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Enterprise AI architect with research experience at the <span style={{ color: '#06B6D4', fontWeight: 600 }}>German Aerospace Center (DLR)</span> and academic grounding through <span style={{ color: '#8B5CF6', fontWeight: 600 }}>EIT Perth</span>. Specialises in deploying sovereign, on-premises AI systems for high-security environments where cloud is not an option.
                  </p>

                  {/* Credentials */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                      { icon: '🚀', label: 'German Aerospace Center (DLR)', color: '#06B6D4' },
                      { icon: '🎓', label: 'EIT Perth',                      color: '#8B5CF6' },
                    ].map((c, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.45rem 0.85rem', borderRadius: 8,
                        background: c.color + '0E', border: `1px solid ${c.color}25`,
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>{c.icon}</span>
                        <span style={{ color: c.color, fontSize: '0.78rem', fontWeight: 600 }}>{c.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div>
                    <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.63rem', letterSpacing: '0.12em', marginBottom: '0.6rem' }}>CORE STACK</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {[
                        { name: 'Qdrant',  color: '#06B6D4' },
                        { name: 'Neo4j',   color: '#10B981' },
                        { name: 'Ollama',  color: '#F59E0B' },
                        { name: 'Python',  color: '#8B5CF6' },
                        { name: 'GraphRAG',color: '#38BDF8' },
                        { name: 'FastAPI', color: '#34D399' },
                      ].map(s => (
                        <span key={s.name} className="mono" style={{
                          fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20,
                          background: s.color + '12', color: s.color, border: `1px solid ${s.color}25`, fontWeight: 700,
                        }}>{s.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── End-User Experience ──────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="label">The End-User Experience</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Enterprise Security in the Back.<br />
              <span className="gradient-text">Intuitive Chat in the Front.</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

            {/* Left: copy */}
            <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: 'var(--t1)', marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                An interface your team<br />already knows how to use.
              </h3>
              <p style={{ color: 'var(--t3)', lineHeight: 1.8, fontSize: '0.975rem', marginBottom: '2rem' }}>
                You don&apos;t need to train your engineers to use complex databases. AIDATARIS provides a sleek, conversational interface. Employees simply type or speak their questions, and the AI retrieves the exact blueprints, safety manuals, and compliance codes they need — complete with source citations.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.25rem' }}>
                {[
                  { icon: '💬', text: 'Natural language chat interface' },
                  { icon: '📎', text: 'Inline document previews & citations' },
                  { icon: '🎙', text: 'Voice-to-text for field engineers' },
                ].map((pt, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                    }}>{pt.icon}</span>
                    <span style={{ color: 'var(--t2)', fontWeight: 600, fontSize: '0.925rem' }}>{pt.text}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.65rem 1.1rem', borderRadius: 8,
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                  <span className="mono" style={{ color: '#10B981', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>ZERO RETRAINING REQUIRED FOR END USERS</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: chat mockup */}
            <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <ChatMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Benefit-Driven Features ──────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label">Enterprise Value</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Built for Organisations That<br />Cannot Afford to Compromise
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {BENEFITS.map((b, i) => (
              <motion.div key={i} variants={card} className="glass"
                style={{ padding: '2.25rem', position: 'relative', overflow: 'hidden' }}
                whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 280 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${b.color}, transparent)` }} />
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{ width: 52, height: 52, borderRadius: 14, background: b.color + '18', border: `1px solid ${b.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  {b.icon}
                </motion.div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{b.title}</h3>
                <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>{b.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {b.tags.map(t => (
                    <span key={t} className="mono" style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 4, background: b.color + '12', color: b.color, border: `1px solid ${b.color}25` }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', borderTop: '1px solid var(--bd-s)', paddingTop: '1rem' }}>
                  <span className="mono" style={{ color: b.color, fontWeight: 800, fontSize: '1.75rem' }}>{b.stat}</span>
                  <span style={{ color: 'var(--t5)', fontSize: '0.75rem' }}>{b.statLabel}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Air-Gapped / Pilbara ─────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg2)', position: 'relative', overflow: 'hidden' }}>
        <hr className="divider" style={{ marginBottom: '5rem' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', bottom: -200, right: -100, background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)' }} />
          <div className="hero-grid" />
        </div>
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center' }}>

            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="label" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.06)' }}>
                Sovereign Offline Mode
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Built for the Edge.<br />
                <span style={{ color: '#F59E0B' }}>Built for the Pilbara.</span>
              </h2>
              <p style={{ color: 'var(--t3)', lineHeight: 1.8, fontSize: '0.975rem', marginBottom: '2rem' }}>
                Our Sovereign Offline Mode guarantees full intelligence capabilities at remote sites with zero internet connectivity. Field engineers can query safety specifications and engineering blueprints hands-free using local Voice-to-Text transcription — keeping operations running when the network goes down.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2.25rem' }}>
                {[
                  'Full RAG capability with zero network dependency',
                  'Pre-loaded knowledge base operates indefinitely offline',
                  'Voice-to-Text transcription runs entirely on-device',
                  'Safety spec and blueprint queries in seconds, anywhere',
                  'Automated DMIRS and WA Mines Safety Act cross-reference',
                ].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.6rem', color: 'var(--t3)', fontSize: '0.875rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }}>▸</span> {pt}
                  </li>
                ))}
              </ul>
              <Link to="/solutions" className="btn-primary" style={{ background: '#F59E0B' }}>
                See Mining & Energy Solution →
              </Link>
            </motion.div>

            {/* Right: rugged terminal */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="terminal">
                <div className="terminal-bar">
                  <span className="terminal-dot" style={{ background: '#FF5F57' }} />
                  <span className="terminal-dot" style={{ background: '#FFBD2E' }} />
                  <span className="terminal-dot" style={{ background: '#28CA41' }} />
                  <span className="mono" style={{ color: '#6B7280', fontSize: '0.7rem', marginLeft: 8 }}>sovereign-offline  /  pilbara-site-07</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B', animation: 'pulse-ring 2s ease infinite' }} />
                    <span className="mono" style={{ fontSize: '0.62rem', color: '#F59E0B', fontWeight: 700 }}>OFFLINE MODE</span>
                  </span>
                </div>
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  {[
                    { label: 'NETWORK',   val: 'DISCONNECTED', col: '#F87171' },
                    { label: 'AI STATUS', val: 'OPERATIONAL',  col: '#10B981' },
                    { label: 'MODEL',     val: 'LOCAL · LLAMA-3.1', col: '#38BDF8' },
                    { label: 'EGRESS',    val: '0 BYTES',      col: '#10B981' },
                    { label: 'SITE',      val: 'PILBARA-07 · WA', col: '#F59E0B' },
                  ].map((row, i) => (
                    <div key={i} className="mono" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: i < 4 ? '1px solid rgba(6,182,212,0.06)' : 'none', fontSize: '0.72rem' }}>
                      <span style={{ color: '#4B5563' }}>{row.label}</span>
                      <span style={{ color: row.col, fontWeight: 700 }}>{row.val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
                    <div className="mono" style={{ fontSize: '0.68rem', color: '#9CA3AF', marginBottom: '0.3rem' }}>› query</div>
                    <div className="mono" style={{ fontSize: '0.72rem', color: '#E5E7EB' }}>"What are the confined space entry requirements under WA Mines Safety Regulations 1995?"</div>
                    <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                        <span className="mono" style={{ fontSize: '0.62rem', color: '#10B981' }}>● GENERATING FROM LOCAL KNOWLEDGE BASE</span>
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Industry Strip ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="label">Industry Solutions</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: 'var(--t1)', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Built for WA&apos;s Most Demanding Sectors
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '⛏', col: '#F59E0B', name: 'Mining & Energy',  tags: ['Offline Mode', 'Air-Gap', 'Safety Docs'],           desc: 'Remote Pilbara sites, offshore platforms, zero connectivity dependency.' },
              { icon: '🏛', col: '#06B6D4', name: 'WA Government',    tags: ['Data Residency', 'ASD Essential 8', 'Classified'],   desc: 'Data sovereignty, AI Assurance Framework, full auditability.' },
              { icon: '⚖', col: '#8B5CF6', name: 'Legal & Health',   tags: ['PII Shield', 'Client Walls', 'Medical Records'],     desc: 'High-confidentiality document intelligence, Privacy Act 1988 compliant.' },
            ].map((ind, i) => (
              <motion.div key={i} variants={card} className="glass" style={{ padding: '2rem' }}
                whileHover={{ y: -6, borderColor: ind.col + '60' }} transition={{ type: 'spring', stiffness: 300 }}>
                <motion.div whileHover={{ scale: 1.1, rotate: -5 }}
                  style={{ width: 52, height: 52, borderRadius: 14, background: ind.col + '18', border: `1px solid ${ind.col}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  {ind.icon}
                </motion.div>
                <h3 style={{ color: ind.col, fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{ind.name}</h3>
                <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1rem' }}>{ind.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {ind.tags.map(t => <span key={t} className="mono" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4, background: ind.col + '12', color: ind.col, border: `1px solid ${ind.col}25` }}>{t}</span>)}
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/solutions" className="btn-ghost">Explore all solutions →</Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section style={{ padding: '7rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.09, 0.05] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(245,158,11,1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <span className="label">Deploy Today</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Your Infrastructure.<br />
            <span style={{ color: '#F59E0B' }}>Your Intelligence. Your Control.</span>
          </h2>
          <p style={{ color: 'var(--t3)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Join Australian enterprises that trust AIDATARIS with their most sensitive data — completely on-premises, zero egress, complete governance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/company" className="btn-primary">Book On-Premises Demo →</Link>
            <Link to="/security" className="btn-ghost">View Security Architecture</Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
