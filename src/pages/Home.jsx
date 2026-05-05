import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Force-Directed Graph ────────────────────────────── */
function ForceGraph() {
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const animRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const onMove = e => { const r = canvas.getBoundingClientRect(); mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top } }
    window.addEventListener('mousemove', onMove)

    const N = 42
    const COLORS = ['#06B6D4', '#38BDF8', '#8B5CF6', '#06B6D4', '#06B6D4']
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.2 + 1.2, col: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
    const edges = []
    nodes.forEach((_, i) => {
      const count = Math.floor(Math.random() * 2) + 2
      for (let k = 0; k < count; k++) { const j = Math.floor(Math.random() * N); if (j !== i) edges.push([i, j]) }
    })

    function tick() {
      const W = canvas.width, H = canvas.height, mx = mouseRef.current.x, my = mouseRef.current.y
      for (let i = 0; i < N; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < N; j++) {
          const b = nodes[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx*dx+dy*dy)||1
          if (d < 110) { const f=(110-d)/110*0.25, fx=(dx/d)*f, fy=(dy/d)*f; a.vx-=fx; a.vy-=fy; b.vx+=fx; b.vy+=fy }
        }
        const mdx=a.x-mx, mdy=a.y-my, md=Math.sqrt(mdx*mdx+mdy*mdy)||1
        if (md < 180) { const f=(180-md)/180*0.9; a.vx+=(mdx/md)*f; a.vy+=(mdy/md)*f }
      }
      edges.forEach(([si,ti]) => {
        const a=nodes[si], b=nodes[ti], dx=b.x-a.x, dy=b.y-a.y, d=Math.sqrt(dx*dx+dy*dy)||1
        const f=(d-130)/130*0.04, fx=(dx/d)*f, fy=(dy/d)*f
        a.vx+=fx; a.vy+=fy; b.vx-=fx; b.vy-=fy
      })
      nodes.forEach(n => {
        n.vx*=0.88; n.vy*=0.88; n.x+=n.vx; n.y+=n.vy
        if(n.x<0){n.x=0;n.vx*=-1} if(n.x>W){n.x=W;n.vx*=-1}
        if(n.y<0){n.y=0;n.vy*=-1} if(n.y>H){n.y=H;n.vy*=-1}
      })
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      edges.forEach(([si,ti]) => {
        const a=nodes[si], b=nodes[ti], dx=b.x-a.x, dy=b.y-a.y, d=Math.sqrt(dx*dx+dy*dy)
        if(d>260) return
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y)
        ctx.strokeStyle=`rgba(6,182,212,${(1-d/260)*0.18})`; ctx.lineWidth=0.7; ctx.stroke()
      })
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r+3,0,Math.PI*2); ctx.fillStyle=n.col+'18'; ctx.fill()
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle=n.col+'90'; ctx.fill()
      })
    }

    function loop() { tick(); draw(); animRef.current = requestAnimationFrame(loop) }
    loop()
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); window.removeEventListener('mousemove', onMove) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
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
          <motion.span animate={{ opacity: phase === 'scan' ? [1, 0.3, 1] : 1 }} transition={{ duration: 0.8, repeat: phase === 'scan' ? Infinity : 0 }}
            style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: phase === 'scan' ? '#F59E0B' : phase === 'done' ? '#10B981' : '#6B7280', boxShadow: phase === 'done' ? '0 0 8px #10B981' : 'none' }} />
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
                ) : <span style={{ color: '#E5E7EB' }}>{seg.text}</span>}
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

/* ── Editorial rule header ───────────────────────────── */
function EditorialRule({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
      <span className="label">{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
    </div>
  )
}

/* ── Data ────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: '🧠', color: '#06B6D4', title: 'AI Consulting',
    tagline: 'Strategy to deployment',
    desc: 'We map where AI creates real ROI in your business, build a practical roadmap, and guide you through every step — from proof-of-concept to production.',
    benefits: ['Identify automation opportunities', 'Clear ROI from day one', 'No wasted investment'],
  },
  {
    icon: '⚙', color: '#8B5CF6', title: 'Data Engineering',
    tagline: 'Turn raw data into business intelligence',
    desc: 'We design and build data pipelines, warehouses, and analytics platforms that give you clean, reliable data your AI can actually learn from.',
    benefits: ['Eliminate data silos', 'Real-time dashboards', 'Scalable infrastructure'],
  },
  {
    icon: '📈', color: '#10B981', title: 'Machine Learning Solutions',
    tagline: 'Predictions that drive decisions',
    desc: 'Custom ML models trained on your data to predict outcomes, detect anomalies, and automate complex decisions — built for your exact business problem.',
    benefits: ['Predictive maintenance', 'Demand forecasting', 'Anomaly detection'],
  },
  {
    icon: '🔒', color: '#F59E0B', title: 'On-Premise AI Systems',
    tagline: '★ Our unique strength',
    desc: 'AI that runs entirely within your own infrastructure. Your data never leaves your servers. Perfect for regulated industries and organisations that cannot use cloud AI.',
    benefits: ['Zero data egress', 'Regulatory compliance', 'Complete data sovereignty'],
    highlight: true,
  },
]

const USE_CASES = [
  {
    icon: '☀', color: '#F59E0B', industry: 'Solar Companies',
    title: 'AI-Powered Solar Intelligence',
    problem: 'Manual panel inspections are expensive, infrequent, and miss early-stage defects — costing operators thousands in lost yield each season.',
    solution: 'Computer vision models analyse drone footage to detect hotspots, soiling, and cell degradation automatically. Cleaning routes are optimised by AI.',
    results: ['40% reduction in inspection costs', '15% improvement in energy yield', 'Faults detected weeks earlier'],
  },
  {
    icon: '🏗', color: '#06B6D4', industry: 'Infrastructure',
    title: 'Predictive Maintenance AI',
    problem: 'Unplanned equipment failures cause costly downtime, emergency repairs, and safety risks on construction and infrastructure sites.',
    solution: 'ML models continuously analyse sensor data to predict failures days before they occur, enabling planned maintenance windows instead of emergency responses.',
    results: ['60% reduction in unplanned downtime', 'Up to 30% lower maintenance costs', 'Improved on-site safety record'],
  },
  {
    icon: '💼', color: '#8B5CF6', industry: 'Business Automation',
    title: 'Intelligent Process Automation',
    problem: 'Manual document handling, repetitive data entry, and slow reporting cycles drain resources that should be focused on growing the business.',
    solution: 'Custom AI agents automate document processing, customer queries, compliance reporting, and workflows — all running inside your own systems.',
    results: ['70% faster document processing', 'Staff freed for high-value work', 'Consistent, error-free outputs'],
  },
]

const DIFFERENTIATORS = [
  { icon: '🛡', color: '#06B6D4', title: 'Secure On-Premise AI',     desc: 'Your data never leaves your building. We deploy AI inside your infrastructure — no cloud, no third parties, no risk.' },
  { icon: '🔧', color: '#8B5CF6', title: 'Custom-Built Solutions',    desc: 'No templates. No off-the-shelf software. Every system is engineered from scratch to solve your specific problem.' },
  { icon: '📍', color: '#F59E0B', title: 'Perth, WA Based',           desc: 'Local team. Australian business hours. We understand WA regulations, industries, and the unique challenges of operating here.' },
  { icon: '⚡', color: '#10B981', title: 'Fast Deployment',           desc: 'From consultation to working prototype in weeks, not months. We move fast without cutting corners on quality or security.' },
  { icon: '📐', color: '#F87171', title: 'Scalable Architecture',     desc: 'Built to grow with you. Start with one use case and expand across your organisation without rebuilding from scratch.' },
  { icon: '🤝', color: '#A78BFA', title: 'Transparent Partnership',   desc: 'No black-box solutions. We explain what we build and why, so your team understands and owns the system we deliver.' },
]

const CASE_STUDIES = [
  {
    label: 'Case Study 01', color: '#F59E0B', icon: '☀',
    title: 'Solar Panel Performance Monitoring AI',
    industry: 'Solar Energy · Western Australia',
    problem: 'A WA solar operator managing 12,000+ panels across regional sites had no reliable way to identify underperforming cells early. Manual inspections cost over $80,000/year and missed 30% of faults until they became critical failures.',
    solution: 'We built an on-premise computer vision pipeline that ingests drone imagery and thermal data, automatically flags degraded cells, and generates prioritised maintenance work orders — all running on the client\'s local server.',
    results: [
      { metric: '43%', label: 'Reduction in inspection cost' },
      { metric: '17%', label: 'Increase in annual energy yield' },
      { metric: '3×',  label: 'Faster fault detection' },
    ],
    tags: ['Computer Vision', 'On-Premise', 'Thermal Imaging', 'Python'],
  },
  {
    label: 'Case Study 02', color: '#06B6D4', icon: '🏗',
    title: 'Predictive Maintenance for Infrastructure',
    industry: 'Civil Infrastructure · Perth Metro',
    problem: 'A Perth infrastructure company was losing an estimated $200,000/year to unplanned equipment failures. Maintenance was purely reactive — teams would respond after breakdowns rather than preventing them.',
    solution: 'We designed and deployed a real-time ML system that ingests sensor data from 60+ machines, learns normal operating patterns, and alerts engineers when anomalous readings predict failure — typically 4–7 days in advance.',
    results: [
      { metric: '61%',  label: 'Reduction in unplanned downtime' },
      { metric: '$180K', label: 'Estimated annual savings' },
      { metric: '4–7',  label: 'Days advance warning' },
    ],
    tags: ['Machine Learning', 'IoT Sensors', 'Real-Time', 'On-Premise'],
  },
]

/* ── Home ────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <main style={{ background: 'var(--bg)' }}>
      <Helmet>
        <title>AIDATARIS | Secure AI & Data Solutions for Australian Businesses — Perth, WA</title>
        <meta name="description" content="AIDATARIS builds custom AI systems, data engineering pipelines, and on-premise ML solutions for Australian businesses. Secure, sovereign AI for solar, infrastructure, and enterprise. Perth, WA." />
        <meta name="keywords" content="AI solutions Perth, data engineering Australia, machine learning consulting WA, on-premise AI, sovereign AI Perth, AI for solar companies, predictive maintenance AI" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', paddingTop: 100, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <ForceGraph />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <motion.div animate={{ scale: [1, 1.12, 1], x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', top: -300, left: -200, background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)' }} />
          <motion.div animate={{ scale: [1, 1.08, 1], x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: -80, right: -150, background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 25%, var(--bg) 100%)' }} />

        <motion.div style={{ position: 'relative', zIndex: 1, width: '100%', opacity: heroOpacity, y: heroY }}>
          <div className="container" style={{ padding: '2rem 1.5rem' }}>

            {/* Label row */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.75rem', flexWrap: 'wrap' }}>
              <span className="label">Perth, Western Australia</span>
              <div style={{ height: 1, width: 60, background: 'var(--divider-c)' }} />
              <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>AI Consulting · Data Engineering · On-Premise</span>
            </motion.div>

            {/* H1 — massive editorial */}
            <h1 style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '2rem', maxWidth: 860 }}>
              {[
                { text: 'Secure AI & Data', delay: 0.15 },
                { text: 'Solutions for', delay: 0.27 },
              ].map((line, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: line.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block', color: 'var(--t1)' }}>
                  {line.text}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.39, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'block', background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>
                Australian Business.
              </motion.span>
            </h1>

            {/* Sub-headline */}
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.65 }}
              style={{ color: 'var(--t3)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.8, maxWidth: 580, marginBottom: '2.75rem' }}>
              We build custom AI systems that run{' '}
              <em style={{ color: '#06B6D4', fontStyle: 'normal', fontWeight: 600 }}>inside your infrastructure</em> — keeping your data private, secure, and fully under your control.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.1rem' }}>Book Free Consultation →</Link>
              <Link to="/contact" className="btn-ghost"   style={{ fontSize: '1rem', padding: '0.9rem 2.1rem' }}>Get a Quote</Link>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '5rem' }}>
              {['On-Premise AI', 'Data Engineering', 'ML Solutions', 'AI Consulting', 'Zero Cloud', 'Perth Based'].map((p, i) => (
                <motion.span key={p} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + i * 0.06 }}
                  className="mono" style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(6,182,212,0.2)', color: 'var(--t4)', background: 'rgba(6,182,212,0.05)' }}>
                  {p}
                </motion.span>
              ))}
            </motion.div>

            {/* PIIScanner + Stats grid */}
            <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <PIIScanner />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--bd)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(6,182,212,0.1)' }}>
                {[
                  { label: 'Industries Served',   val: 8,   suffix: '+' },
                  { label: 'Local Processing',     val: 100, suffix: '%' },
                  { label: 'Cloud Dependencies',   val: 0,   suffix: '' },
                  { label: 'PII Types Protected',  val: 12,  suffix: '+' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'var(--stat-cell)', padding: '2rem', textAlign: 'center' }}>
                    <div className="mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#06B6D4', letterSpacing: '-0.03em' }}>
                      <Counter target={s.val} suffix={s.suffix} />
                    </div>
                    <div style={{ color: 'var(--t4)', fontSize: '0.75rem', marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="01 · What We Build" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '4rem', maxWidth: 620, lineHeight: 1.15 }}>
            AI Services With Real{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>Business Impact</span>
          </motion.h2>

          <div>
            {SERVICES.map((svc, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay: i * 0.07 }}
                whileHover={{ x: 6 }} transition2={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{ display: 'grid', gridTemplateColumns: '5.5rem 1fr', gap: '2.5rem', padding: '2.75rem 0', borderBottom: '1px solid var(--bd)', alignItems: 'start' }}>

                {/* Stroke number */}
                <div style={{
                  fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1,
                  color: 'transparent', WebkitTextStroke: `1px ${svc.color}40`,
                  letterSpacing: '-0.04em', paddingTop: '0.3rem', fontFamily: 'Inter, sans-serif',
                  userSelect: 'none',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: svc.color + '15', border: `1px solid ${svc.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{svc.icon}</div>
                      <div>
                        {svc.highlight && <div className="mono" style={{ color: svc.color, fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '2px' }}>★ UNIQUE TO US</div>}
                        <h3 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.015em' }}>{svc.title}</h3>
                      </div>
                    </div>
                    <div className="mono" style={{ color: svc.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{svc.tagline.toUpperCase()}</div>
                    <p style={{ color: 'var(--t3)', fontSize: '0.9rem', lineHeight: 1.78 }}>{svc.desc}</p>
                  </div>
                  <div style={{ paddingTop: '0.25rem' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      {svc.benefits.map((b, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: 'var(--t3)', fontSize: '0.875rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: svc.color, flexShrink: 0, boxShadow: `0 0 6px ${svc.color}80` }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="How It Works" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 560, lineHeight: 1.15 }}>
            Document to Intelligence{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>in Five Steps.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '4.5rem' }}>
            From raw PDF upload to a cited, audited AI response — everything runs on your hardware, inside your network.
          </motion.p>

          {/* Steps grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0', border: '1px solid var(--bd)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { num: '01', icon: '📄', color: '#06B6D4', title: 'Upload Documents', desc: 'PDFs, Word docs, images, scanned files — any format accepted locally.' },
              { num: '02', icon: '🛡', color: '#F87171', title: 'PII Auto-Detection', desc: '12+ sensitive data categories detected and permanently redacted before storage.' },
              { num: '03', icon: '🕸', color: '#8B5CF6', title: 'Intelligent Indexing', desc: 'Semantic vector embeddings and a knowledge graph built from your content.' },
              { num: '04', icon: '🧠', color: '#F59E0B', title: 'AI Query & Reasoning', desc: 'Natural language queries with multi-hop graph reasoning and local tool calling.' },
              { num: '05', icon: '✓',  color: '#10B981', title: 'Cited, Audited Answer', desc: 'Every response includes source citations and is written to the immutable audit log.' },
            ].map((step, i, arr) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  padding: '2.25rem 1.75rem',
                  borderRight: i < arr.length - 1 ? '1px solid var(--bd)' : 'none',
                  background: 'var(--glass-bg)',
                  transition: 'background 0.3s',
                }}
                whileHover={{ background: step.color + '06' }}>
                <div className="mono" style={{ color: step.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '1rem' }}>{step.num}</div>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: step.color + '15', border: `1px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>
                  {step.icon}
                </div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ color: 'var(--t4)', fontSize: '0.82rem', lineHeight: 1.65 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Supporting note */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { icon: '⚡', text: 'Average query response < 3 seconds on-prem' },
              { icon: '🔒', text: 'Zero bytes leave your network at any step' },
              { icon: '📋', text: 'Full audit trail generated automatically' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--t5)', fontSize: '0.8rem' }}>
                <span>{item.icon}</span> {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="02 · Real-World Applications" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '4rem', maxWidth: 600, lineHeight: 1.15 }}>
            AI Working in the Field.{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>Right Now.</span>
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {USE_CASES.map((uc, i) => (
              <motion.div key={i} className="glass"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ boxShadow: `0 24px 64px rgba(0,0,0,0.16), 0 0 40px ${uc.color}12` }}
                style={{ padding: '2.75rem', position: 'relative', overflow: 'hidden', border: `1px solid ${uc.color}22` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: uc.color, borderRadius: '16px 0 0 16px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: uc.color + '18', border: `1px solid ${uc.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{uc.icon}</div>
                      <div>
                        <div className="mono" style={{ color: uc.color, fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.1em' }}>{uc.industry.toUpperCase()}</div>
                        <h3 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.08rem', lineHeight: 1.3 }}>{uc.title}</h3>
                      </div>
                    </div>
                    <div style={{ marginBottom: '0.85rem' }}>
                      <div className="mono" style={{ color: '#F87171', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.35rem' }}>THE PROBLEM</div>
                      <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.75 }}>{uc.problem}</p>
                    </div>
                    <div>
                      <div className="mono" style={{ color: '#06B6D4', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.35rem' }}>OUR SOLUTION</div>
                      <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.75 }}>{uc.solution}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: '#10B981', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1rem' }}>RESULTS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {uc.results.map((r, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem 1rem', borderRadius: 8, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                          <span style={{ color: '#10B981', fontSize: '0.9rem' }}>▸</span>
                          <span style={{ color: 'var(--t2)', fontSize: '0.875rem', fontWeight: 500 }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="03 · Why AIDATARIS" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '4rem', maxWidth: 580, lineHeight: 1.15 }}>
            Built Different.{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>For Good Reason.</span>
          </motion.h2>

          {/* Feature grid — clean bordered cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', border: '1px solid var(--bd)', borderRadius: 16, overflow: 'hidden' }}>
            {DIFFERENTIATORS.map((d, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.07, duration: 0.5 }}
                style={{
                  padding: '2.25rem 2.5rem',
                  borderRight: '1px solid var(--bd)',
                  borderBottom: '1px solid var(--bd)',
                  display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                  background: 'var(--glass-bg)',
                  transition: 'background 0.3s',
                }}
                whileHover={{ background: d.color + '08' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: d.color + '12', border: `1px solid ${d.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  {d.icon}
                </div>
                <div>
                  <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.45rem' }}>{d.title}</h3>
                  <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.72 }}>{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="04 · Case Studies" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '1rem', maxWidth: 560, lineHeight: 1.15 }}>
            From Problem to{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>Measurable Result</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 500, marginBottom: '5rem' }}>
            Real deployments. Real outcomes. All running on-premise inside client infrastructure.
          </motion.p>

          {CASE_STUDIES.map((cs, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: '5rem 0', borderTop: '1px solid var(--bd)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '5rem', alignItems: 'start' }}>

                {/* Left — giant metrics */}
                <div>
                  <div className="mono" style={{ color: cs.color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '2.5rem' }}>
                    {cs.label.toUpperCase()} · {cs.industry}
                  </div>
                  {cs.results.map((r, j) => (
                    <motion.div key={j}
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.15 + j * 0.1, duration: 0.6 }}
                      style={{ marginBottom: '2.25rem' }}>
                      <div style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, color: cs.color, lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'Inter, sans-serif' }}>
                        {r.metric}
                      </div>
                      <div style={{ color: 'var(--t4)', fontSize: '0.875rem', marginTop: '0.4rem', letterSpacing: '0.01em' }}>{r.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Right — details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: cs.color + '18', border: `1px solid ${cs.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{cs.icon}</div>
                    <h3 style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.9rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{cs.title}</h3>
                  </div>

                  <div style={{ marginBottom: '1.35rem' }}>
                    <div className="mono" style={{ color: '#F87171', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>THE PROBLEM</div>
                    <p style={{ color: 'var(--t3)', fontSize: '0.9rem', lineHeight: 1.78 }}>{cs.problem}</p>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>OUR SOLUTION</div>
                    <p style={{ color: 'var(--t3)', fontSize: '0.9rem', lineHeight: 1.78 }}>{cs.solution}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {cs.tags.map(t => (
                      <span key={t} className="mono" style={{ fontSize: '0.6rem', padding: '3px 10px', borderRadius: 4, background: cs.color + '12', color: cs.color, border: `1px solid ${cs.color}28` }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Bottom border for last item */}
          <div style={{ borderTop: '1px solid var(--bd)' }} />
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="05 · About" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.75rem' }}>
                A Perth Startup with<br />
                <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>Enterprise Engineering Depth.</span>
              </h2>
              <p style={{ color: 'var(--t3)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.1rem' }}>
                AIDATARIS was founded with a single belief: Australian businesses deserve access to powerful, secure AI — without handing their data to overseas cloud providers.
              </p>
              <p style={{ color: 'var(--t3)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.1rem' }}>
                We're a team of engineers with research and industry experience spanning the German Aerospace Center (DLR) and Australian enterprise. We've worked on real ML systems in demanding environments — and we bring that rigour to every client engagement.
              </p>
              <p style={{ color: 'var(--t3)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '2.25rem' }}>
                Based in Perth, WA. Focused on building AI that's fast to deploy, secure by design, and built to grow with your business.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Qdrant', 'Neo4j', 'Ollama', 'Python', 'FastAPI', 'PyTorch'].map(t => (
                  <span key={t} className="mono" style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', background: 'rgba(6,182,212,0.05)' }}>{t}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="glass" style={{ padding: '2.5rem', border: '1px solid rgba(6,182,212,0.18)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: 18, overflow: 'hidden', flexShrink: 0, boxShadow: '0 0 24px rgba(6,182,212,0.25)' }}>
                  <img src="/photo.png" alt="Vivek Rabadiya" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--t1)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>Vivek Rabadiya</h3>
                  <div className="mono" style={{ color: '#06B6D4', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.85rem' }}>FOUNDER & CEO</div>
                  <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.75, marginBottom: '1.35rem' }}>
                    AI engineer and data architect with hands-on experience at the{' '}
                    <span style={{ color: '#06B6D4', fontWeight: 600 }}>German Aerospace Center (DLR)</span> and deep roots in Perth's tech community through{' '}
                    <span style={{ color: '#8B5CF6', fontWeight: 600 }}>EIT Perth</span>.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {[
                      { icon: '🚀', text: 'German Aerospace Center (DLR)' },
                      { icon: '🎓', text: 'EIT Perth' },
                      { icon: '📍', text: 'Perth, Western Australia' },
                    ].map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--t4)', fontSize: '0.82rem' }}>
                        <span>{c.icon}</span> {c.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section style={{ padding: '12rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, #06B6D4 0%, transparent 65%)', pointerEvents: 'none' }} />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, #8B5CF6 0%, transparent 65%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
            <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'var(--divider-c)' }} />
            <span className="label">Ready to Get Started?</span>
            <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'var(--divider-c)' }} />
          </div>

          <h2 style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1.03, marginBottom: '1.75rem' }}>
            Ready to deploy AI<br />
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>
              that you own?
            </span>
          </h2>

          <p style={{ color: 'var(--t3)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 3rem' }}>
            Book a free 30-minute consultation. We'll listen to your challenges, tell you honestly what AI can and can't do for your situation, and give you a clear path forward.
          </p>

          <Link to="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Book Free Consultation →
          </Link>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '📍', text: 'Perth, Western Australia' },
              { icon: '✉',  text: 'support@aidataris.com.au' },
              { icon: '⏱',  text: 'Response within 1 business day' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--t5)', fontSize: '0.85rem' }}>
                <span>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  )
}
