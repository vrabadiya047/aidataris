import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Secure Network Animation ────────────────────────── */
function SecureNetworkAnimation() {
  const canvasRef = useRef(null)
  const frameRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let nodes = [], edges = [], packets = [], lastPacket = 0

    function hex(n) { return Math.round(n).toString(16).padStart(2, '0') }

    function init() {
      nodes = []; edges = []; packets = []
      const W = canvas.width, H = canvas.height
      const cx = W * 0.64, cy = H * 0.46

      // Central AI core
      nodes.push({ x: cx, y: cy, r: 10, color: '#8B5CF6', type: 'core', pulse: 0 })

      // Satellite nodes — Fibonacci spiral for organic spread
      const PHI = 2.39996
      for (let i = 0; i < 30; i++) {
        const angle  = i * PHI
        const radius = 52 + Math.sqrt(i + 1) * 36
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius * 0.68   // flatten vertically
        if (x < 12 || x > W - 12 || y < 32 || y > H - 32) continue
        nodes.push({
          x, y,
          r: 1.8 + Math.random() * 3.2,
          color: i % 6 === 0 ? '#F59E0B' : i % 9 === 0 ? '#10B981' : '#06B6D4',
          type: i % 8 === 0 ? 'secure' : 'node',
          pulse: 0,
        })
      }

      // Build edges — always connect core if close enough; others probabilistic
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          const threshold = (i === 0 || j === 0) ? 250 : 105
          if (d < threshold) edges.push({ i, j })
        }
      }
    }

    const ro = new ResizeObserver(() => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; init() })
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight
    init()
    ro.observe(canvas)

    function spawnPacket(t) {
      if (t - lastPacket < 260 || nodes.length < 3) return
      lastPacket = t
      const srcIdx = 1 + Math.floor(Math.random() * (nodes.length - 1))
      const dstIdx = Math.random() < 0.74 ? 0 : 1 + Math.floor(Math.random() * (nodes.length - 1))
      if (srcIdx === dstIdx) return
      packets.push({
        sx: nodes[srcIdx].x, sy: nodes[srcIdx].y,
        tx: nodes[dstIdx].x, ty: nodes[dstIdx].y,
        dst: dstIdx, t: 0,
        speed: 0.0038 + Math.random() * 0.007,
        color: dstIdx === 0 ? '#8B5CF6' : '#06B6D4',
      })
    }

    function draw(time) {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Subtle perimeter shield ring around core
      const core = nodes[0]
      if (core) {
        const shieldR = Math.min(W, H) * 0.38
        const sg = ctx.createRadialGradient(core.x, core.y, shieldR * 0.85, core.x, core.y, shieldR)
        sg.addColorStop(0, 'rgba(139,92,246,0)')
        sg.addColorStop(0.7, 'rgba(139,92,246,0.03)')
        sg.addColorStop(1, 'rgba(139,92,246,0.09)')
        ctx.beginPath(); ctx.arc(core.x, core.y, shieldR, 0, Math.PI * 2)
        ctx.fillStyle = sg; ctx.fill()
        ctx.beginPath(); ctx.arc(core.x, core.y, shieldR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(139,92,246,0.12)'; ctx.lineWidth = 1; ctx.stroke()
      }

      // Edges
      for (const e of edges) {
        const a = nodes[e.i], b = nodes[e.j]
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        const isCoreEdge = e.i === 0 || e.j === 0
        ctx.strokeStyle = isCoreEdge ? 'rgba(139,92,246,0.16)' : 'rgba(6,182,212,0.08)'
        ctx.lineWidth   = isCoreEdge ? 0.9 : 0.55
        ctx.stroke()
      }

      // Nodes
      for (const n of nodes) {
        const glowR = n.r * (n.type === 'core' ? 4.5 : 3)
        const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        gr.addColorStop(0, n.color + hex((n.type === 'core' ? 0.45 : 0.2) * 255))
        gr.addColorStop(1, n.color + '00')
        ctx.beginPath(); ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = gr; ctx.fill()

        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.color + (n.type === 'core' ? 'EE' : 'C8')
        ctx.fill()

        // Pulse ripple on arrival
        if (n.pulse > 0) {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + (1 - n.pulse) * 32, 0, Math.PI * 2)
          ctx.strokeStyle = n.color + hex(n.pulse * 0.65 * 255)
          ctx.lineWidth = 1.5; ctx.stroke()
          n.pulse = Math.max(0, n.pulse - 0.02)
        }

        // AI core — two spinning orbital arcs
        if (n.type === 'core') {
          const s = time * 0.00055
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 10, s, s + Math.PI * 1.35)
          ctx.strokeStyle = '#8B5CF6A0'; ctx.lineWidth = 1.8; ctx.stroke()

          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 18, -s * 0.65, -s * 0.65 + Math.PI * 0.8)
          ctx.strokeStyle = '#06B6D460'; ctx.lineWidth = 1.1; ctx.stroke()

          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 26, s * 0.4 + 1, s * 0.4 + 1 + Math.PI * 0.5)
          ctx.strokeStyle = '#F59E0B35'; ctx.lineWidth = 0.8; ctx.stroke()
        }
      }

      // Data packets with glowing trails
      packets = packets.filter(p => {
        p.t += p.speed
        if (p.t >= 1) {
          if (nodes[p.dst]) nodes[p.dst].pulse = 1
          return false
        }
        const steps = 8
        for (let k = steps; k >= 0; k--) {
          const tt = Math.max(0, p.t - k * 0.014)
          const x  = p.sx + (p.tx - p.sx) * tt
          const y  = p.sy + (p.ty - p.sy) * tt
          const a  = ((steps - k) / steps) * 0.92
          const r  = Math.max(0.4, 2.5 - k * 0.22)
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fillStyle = p.color + hex(a * 255)
          ctx.fill()
        }
        return true
      })

      spawnPacket(time)
      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frameRef.current); ro.disconnect() }
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
const PROBLEMS = [
  {
    icon: '☁', color: '#EF4444',
    title: 'Cloud AI Exposes Your Data',
    desc: 'Every query sent to OpenAI or Google trains their models. For regulated industries, that is a compliance breach waiting to happen.',
  },
  {
    icon: '📋', color: '#F59E0B',
    title: 'Compliance Is Getting Stricter',
    desc: 'Privacy Act, ISM, PSPF, and industry frameworks require data sovereignty. Cloud AI vendors cannot meet these requirements.',
  },
  {
    icon: '📡', color: '#8B5CF6',
    title: 'Remote Sites Lack Connectivity',
    desc: 'Mining, construction, and field operations often run with no reliable internet. Cloud AI is simply not viable at the coalface.',
  },
  {
    icon: '📁', color: '#06B6D4',
    title: 'Internal Data Sits Unused',
    desc: 'Your organisation holds decades of reports, logs, and documents. Without AI, that knowledge is buried in folders nobody can search.',
  },
]

const BENEFITS = [
  {
    icon: '🔐', color: '#06B6D4',
    title: 'No Data Leaves Your Organisation',
    desc: 'Every document, query, and answer stays on your hardware. Nothing touches the internet. Complete data sovereignty from day one.',
  },
  {
    icon: '⚡', color: '#10B981',
    title: 'Instant Insights from Internal Data',
    desc: 'Ask questions across thousands of documents in seconds. Surface knowledge that would take your team weeks to find manually.',
  },
  {
    icon: '✅', color: '#8B5CF6',
    title: 'Built-in Compliance & Audit Trail',
    desc: 'Every query logged with source citations. Automated audit trails meet government, legal, and enterprise compliance requirements.',
  },
]

const SERVICES = [
  {
    icon: '🔒', color: '#06B6D4', title: 'On-Premise AI Deployment',
    tagline: 'Your infrastructure. Your control.',
    desc: 'We install a complete AI system inside your network. No cloud. No data egress. Operational in weeks, not months. Air-gap compatible for the most sensitive environments.',
    benefits: ['Zero cloud dependencies', 'Air-gap compatible', 'Full data sovereignty'],
    highlight: true,
  },
  {
    icon: '🧠', color: '#8B5CF6', title: 'Intelligent Document Search',
    tagline: 'Find answers buried in your files',
    desc: 'Connect to your internal document library. Ask questions in plain English. Get precise answers with source citations across thousands of files instantly — without a Google account.',
    benefits: ['Natural language queries', 'Source-cited responses', 'Cross-document reasoning'],
  },
  {
    icon: '🤖', color: '#F59E0B', title: 'AI Process Automation',
    tagline: 'Reduce manual workload',
    desc: 'Automate repetitive analysis, report generation, and compliance checking. AI agents handle the routine work so your team can focus on decisions that matter.',
    benefits: ['Automated reporting', 'Compliance checking', 'Workflow integration'],
  },
  {
    icon: '📊', color: '#10B981', title: 'Data Engineering & Pipelines',
    tagline: 'Turn raw data into business intelligence',
    desc: 'We design and build data pipelines that clean, structure, and connect your data sources — giving AI a reliable foundation to work from and giving you real-time visibility.',
    benefits: ['Eliminate data silos', 'Real-time dashboards', 'Scalable infrastructure'],
  },
]

const USE_CASES = [
  {
    icon: '⛏', color: '#F59E0B', industry: 'Mining & Resources',
    title: 'Equipment Logs + Safety Intelligence',
    problem: 'Mining operations generate thousands of equipment reports, safety logs, and maintenance records daily. Critical failure patterns are buried and inaccessible until something breaks — costing days of downtime and safety incidents.',
    solution: 'AIDATARIS ingests all equipment and safety records on-site, enabling engineers to query maintenance history, identify failure patterns, and surface safety risks in seconds. Zero cloud, fully operational at remote sites.',
    results: ['Query across 10+ years of maintenance records instantly', 'Safety anomalies detected before incidents occur', 'Compliance reporting generated automatically'],
  },
  {
    icon: '🏛', color: '#06B6D4', industry: 'Government & Defence',
    title: 'Policy Compliance & Knowledge Management',
    problem: 'Government agencies hold vast policy libraries, legal frameworks, and compliance documents. Staff spend hours searching for the right policy, responses are inconsistent, and document retrieval is a manual process with real risk of error.',
    solution: 'Deploy a secure AI knowledge base on government infrastructure. Staff query policy documents, get accurate cited answers, and generate compliant reports — without ever sending sensitive data outside agency boundaries.',
    results: ['90% faster policy lookups', 'Consistent, source-cited responses', 'Meets ISM and PSPF requirements'],
  },
  {
    icon: '⚖', color: '#8B5CF6', industry: 'Legal & Professional Services',
    title: 'Contract Review & Risk Analysis',
    problem: 'Legal teams review hundreds of contracts manually, missing risks buried in dense clauses. Due diligence takes weeks. Client data is subject to professional obligations — it cannot be processed by external cloud providers.',
    solution: 'On-premise AI reviews contracts, flags risk clauses, cross-references precedents, and summarises key obligations. Client data never leaves your network, meeting all professional and regulatory obligations.',
    results: ['Contract review time reduced by 70%', 'Risk clauses flagged automatically', 'Client data stays on your servers — always'],
  },
]

const PROCESS_STEPS = [
  {
    num: '01', icon: '🔍', color: '#06B6D4', title: 'Discovery',
    desc: 'We start with your business problems, not our solutions. A 30-minute call covers your data environment, security requirements, and AI goals. No sales pitch — just clarity.',
  },
  {
    num: '02', icon: '🗺', color: '#8B5CF6', title: 'System Design',
    desc: 'We map your data sources, define the AI architecture, and produce a detailed deployment plan tailored to your infrastructure. You see exactly what will be built — before we begin.',
  },
  {
    num: '03', icon: '🏗', color: '#F59E0B', title: 'Deployment',
    desc: 'We install, configure, and security-harden the complete AI stack inside your infrastructure. Connected to your existing document sources, with zero disruption. Live within 2–4 weeks.',
  },
  {
    num: '04', icon: '🛡', color: '#10B981', title: 'Ongoing Support',
    desc: 'Continuous monitoring, model updates, and capability additions. Your system improves over time as we measure outcomes, learn your organisation\'s needs, and deliver ongoing value.',
  },
]

const PRICING = [
  {
    tier: 'Starter',
    price: '$5,000–$10,000',
    period: 'one-time setup',
    color: '#06B6D4',
    desc: 'Proof-of-concept deployment for a single use case. Ideal for organisations evaluating on-premise AI before a full rollout.',
    items: [
      'Single document corpus',
      'Natural language search',
      'Basic admin console',
      'PII detection included',
      '30-day support period',
    ],
    cta: 'Book Discovery Call',
    ctaLink: '/contact',
  },
  {
    tier: 'Enterprise',
    price: 'Custom',
    period: 'scoped to your needs',
    color: '#8B5CF6',
    desc: 'Full deployment across your organisation. Multi-dataset, multi-user, fully integrated with existing systems and compliance frameworks.',
    items: [
      'Unlimited document corpus',
      'Multi-user access control',
      'Full audit trail & compliance',
      'Custom integrations',
      'Air-gap deployment option',
      'Dedicated support',
    ],
    cta: 'Get Custom AI Deployment Plan',
    ctaLink: '/contact',
    highlight: true,
    microcopy: "We'll analyse your requirements and propose a tailored solution.",
  },
  {
    tier: 'Ongoing Support',
    price: 'Monthly',
    period: 'retainer',
    color: '#10B981',
    desc: 'Continued model updates, monitoring, and feature additions after initial deployment. Keep your system current and performant.',
    items: [
      'Model updates & improvements',
      'System health monitoring',
      'Priority response SLA',
      'Feature additions',
      'Quarterly review calls',
    ],
    cta: 'Learn More',
    ctaLink: '/contact',
  },
]

const DIFFERENTIATORS = [
  { icon: '🛡', color: '#06B6D4', title: '100% On-Premise',        desc: 'Your data never leaves your building. We deploy AI inside your infrastructure — no cloud, no third parties, no compromise.' },
  { icon: '🌏', color: '#8B5CF6', title: 'Built for Australia',     desc: 'Perth-based team. We understand Australian compliance requirements, WA industries, and local business conditions.' },
  { icon: '📡', color: '#F59E0B', title: 'Air-Gap Ready',           desc: 'Fully operational with no internet access. Mining sites, classified facilities, remote operations — all supported.' },
  { icon: '⚡', color: '#10B981', title: 'Fast Deployment',         desc: 'Working prototype in weeks, not quarters. We move fast without cutting corners on security or reliability.' },
  { icon: '🏛', color: '#F87171', title: 'Enterprise-Grade',        desc: 'Built to meet government, legal, and financial compliance from day one. Not bolted on as an afterthought.' },
  { icon: '🎯', color: '#A78BFA', title: 'Designed for High-Risk Environments', desc: 'Purpose-built for classified facilities, remote mine sites, and critical infrastructure. Where failure is not an option — and our architecture reflects that.' },
]

const CASE_STUDIES = [
  {
    label: 'Case Study 01', color: '#F59E0B', icon: '☀',
    title: 'AI-Powered Solar Maintenance Analysis',
    industry: 'Solar Energy · Regional Western Australia',
    problem: 'A WA solar operator managing 12,000+ panels across remote regional sites had no automated way to identify underperforming cells. Manual drone inspections cost $80,000/year and still missed 30% of degraded cells — which became critical failures causing unplanned grid curtailment events worth $40K+ each.',
    solution: 'We built an on-premise computer vision pipeline that ingests drone imagery and thermal scan data, flags degraded cells automatically, and generates prioritised work orders — fully local, zero cloud. Deployed in 3 weeks on existing site hardware.',
    results: [
      { metric: '$34K',  label: 'Saved year-one — 43% reduction in inspection costs' },
      { metric: '17%',   label: 'Increase in annual energy yield from earlier fault detection' },
      { metric: '3 wks', label: 'From engagement to first production insight' },
    ],
    tags: ['Computer Vision', 'On-Premise', 'Thermal Imaging', 'ROI: 4 months'],
  },
  {
    label: 'Case Study 02', color: '#06B6D4', icon: '🏗',
    title: 'Predictive Maintenance for Civil Infrastructure',
    industry: 'Civil Infrastructure · Perth Metro',
    problem: 'A Perth infrastructure contractor was losing $200,000+/year to unplanned equipment failures across 60+ machines. Maintenance was purely reactive — engineers responded after breakdowns, not before. Downtime averaged 18 hours per incident.',
    solution: 'We designed and deployed a real-time ML system on the client\'s on-premise server — ingesting live sensor data, learning normal operating envelopes, and alerting engineers 4–7 days before failure thresholds were breached. $22K deployment. No cloud required.',
    results: [
      { metric: '8× ROI', label: '$180K annual savings on a $22K deployment' },
      { metric: '61%',    label: 'Reduction in unplanned downtime within 6 months' },
      { metric: '4–7d',   label: 'Advance warning — prevented 3 critical failures in month one' },
    ],
    tags: ['Machine Learning', 'IoT Sensors', 'Real-Time', 'On-Premise'],
  },
  {
    label: 'Case Study 03', color: '#8B5CF6', icon: '⛏',
    title: 'Mining Safety Knowledge Base — Pilbara Site',
    industry: 'Mining & Resources · Pilbara, Western Australia',
    problem: 'An 800-person Pilbara mining operation had 14,000+ safety documents, MSDS sheets, and maintenance records across disconnected shared drives. Safety officers spent 3–4 hours per day manually retrieving compliance documents. Remote sites had no reliable internet — cloud AI was not viable.',
    solution: 'We deployed an air-gapped AIDATARIS instance on the site\'s existing on-premise server — no new hardware, no internet required. The system indexed all 14,000+ documents in 6 hours and was live the same day. Staff now query in plain English from underground and remote stations.',
    results: [
      { metric: '94%',    label: 'Reduction in compliance document retrieval time' },
      { metric: '6 hrs',  label: 'From installation to first live query — same-day go-live' },
      { metric: '$270K',  label: 'Estimated annual value of recovered staff time' },
    ],
    tags: ['Air-Gapped', 'Safety Compliance', 'Document AI', 'Same-Day Deployment'],
  },
]

/* ── Dashboard UI Mockup ─────────────────────────────── */
function DashboardMockup() {
  const bars = [32, 55, 48, 72, 90, 58, 80, 95, 70, 88, 78, 64, 92, 85, 96]
  const maxBar = Math.max(...bars)

  function sparkPath(data, W, H) {
    const hi = Math.max(...data), lo = Math.min(...data), range = (hi - lo) || 1
    return data.map((v, i) => {
      const x = ((i / (data.length - 1)) * W).toFixed(1)
      const y = (H - ((v - lo) / range) * H).toFixed(1)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const KPIS = [
    { l: 'Documents', v: '14,293', d: '+289 this week', up: true,  c: '#06B6D4', spark: [40,52,48,65,58,72,68,80,76,90] },
    { l: 'Queries / Day', v: '3,847',  d: '↑ 18% vs prior month', up: true, c: '#8B5CF6', spark: [60,55,70,65,80,72,85,78,92,88] },
    { l: 'Compliance',   v: '99.2%',  d: 'ISM · PSPF · E8', up: false, c: '#10B981', spark: [95,96,97,95,98,97,99,98,99,99] },
    { l: 'PII Blocked',  v: '6,102',  d: 'Auto-redacted today', up: false, c: '#F59E0B', spark: [20,35,42,48,55,62,68,72,80,88] },
  ]

  const NAV = [
    { icon: '▦', label: 'Dash',  active: true },
    { icon: '📄', label: 'Docs',  active: false },
    { icon: '🔍', label: 'Query', active: false },
    { icon: '📋', label: 'Audit', active: false },
    { icon: '👥', label: 'Users', active: false },
  ]

  return (
    <div style={{
      border: '1px solid rgba(6,182,212,0.18)', borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(6,182,212,0.04), inset 0 1px 0 rgba(255,255,255,0.02)',
      background: '#060A0F',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>

      {/* ── Title bar ── */}
      <div style={{ background: 'rgba(3,5,8,0.98)', padding: '0.55rem 1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', borderBottom: '1px solid rgba(6,182,212,0.07)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA41', flexShrink: 0 }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2D3748', fontSize: '0.58rem', letterSpacing: '0.05em', marginLeft: '0.4rem', flex: 1 }}>
          aidataris.local:3000 — Intelligence Console
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2D3748', fontSize: '0.48rem' }}>v2.4.1</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.15rem 0.5rem', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#10B981', fontSize: '0.46rem', fontWeight: 700, letterSpacing: '0.06em' }}>ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* ── App shell: sidebar + content ── */}
      <div style={{ display: 'flex' }}>

        {/* Sidebar */}
        <div style={{ width: 46, background: '#030508', borderRight: '1px solid rgba(6,182,212,0.06)', display: 'flex', flexDirection: 'column', padding: '0.5rem 0.25rem', gap: '1px', flexShrink: 0 }}>
          {NAV.map((n, i) => (
            <div key={i} style={{
              padding: '0.48rem 0', borderRadius: 6, cursor: 'default',
              background: n.active ? 'rgba(6,182,212,0.09)' : 'transparent',
              borderLeft: `2px solid ${n.active ? '#06B6D4' : 'transparent'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            }}>
              <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>{n.icon}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: n.active ? '#06B6D4' : '#2D3748', fontSize: '0.35rem', fontWeight: 700, letterSpacing: '0.04em' }}>{n.label.toUpperCase()}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: '0.45rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '0.7rem' }}>⚙</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2D3748', fontSize: '0.35rem', letterSpacing: '0.04em' }}>CFG</span>
          </div>
        </div>

        {/* Main panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Top nav bar */}
          <div style={{ padding: '0.42rem 0.8rem', background: '#060A0F', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(6,182,212,0.05)' }}>
            <span style={{ color: '#2D3748', fontSize: '0.58rem' }}>Dashboard</span>
            <span style={{ color: '#1A202C', fontSize: '0.52rem' }}>›</span>
            <span style={{ color: '#06B6D4', fontSize: '0.58rem', fontWeight: 600 }}>Intelligence Overview</span>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', borderRadius: 5, background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)' }}>
              <span style={{ color: '#2D3748', fontSize: '0.52rem' }}>🔍</span>
              <span style={{ color: '#2D3748', fontSize: '0.58rem', fontStyle: 'italic' }}>Search documents...</span>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>VR</div>
          </div>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(6,182,212,0.06)' }}>
            {KPIS.map((m, i) => (
              <div key={i} style={{ padding: '0.7rem 0.8rem', background: '#060A0F' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2D3748', fontSize: '0.46rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.l}</span>
                  <svg width="44" height="16" style={{ flexShrink: 0 }}>
                    <path d={sparkPath(m.spark, 44, 14)} fill="none" stroke={m.c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
                  </svg>
                </div>
                <div style={{ color: m.c, fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '0.18rem' }}>{m.v}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.18rem' }}>
                  {m.up && <span style={{ color: '#10B981', fontSize: '0.42rem', fontWeight: 700 }}>▲</span>}
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: m.up ? '#10B981' : '#4A5568', fontSize: '0.44rem' }}>{m.d}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + status */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1px', background: 'rgba(6,182,212,0.06)' }}>

            {/* Bar chart with gridlines */}
            <div style={{ padding: '0.7rem 0.8rem', background: '#060A0F' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4A5568', fontSize: '0.46rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Query Volume — 15 Days</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#06B6D4', fontSize: '0.44rem' }}>Avg 256/day ▲</span>
              </div>
              <div style={{ position: 'relative', height: 44 }}>
                {[0.25, 0.5, 0.75].map(f => (
                  <div key={f} style={{ position: 'absolute', left: 0, right: 0, top: `${(1 - f) * 100}%`, height: '1px', background: 'rgba(6,182,212,0.06)' }} />
                ))}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                  {bars.map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: `${(h / maxBar) * 100}%`,
                      background: i === bars.length - 1
                        ? 'linear-gradient(180deg, #06B6D4 0%, rgba(6,182,212,0.35) 100%)'
                        : `rgba(6,182,212,${0.07 + (h / maxBar) * 0.22})`,
                      borderRadius: '2px 2px 0 0',
                      boxShadow: i === bars.length - 1 ? '0 0 6px rgba(6,182,212,0.35)' : 'none',
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                {['21','22','23','24','25','26','27','28','29','30','1','2','3','4','5'].map((d, i) => (
                  <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', color: i === 14 ? '#06B6D4' : '#1A202C', fontSize: '0.4rem', fontWeight: i === 14 ? 700 : 400 }}>{d}</span>
                ))}
              </div>
            </div>

            {/* System health with latency */}
            <div style={{ padding: '0.7rem 0.8rem', background: '#060A0F' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4A5568', fontSize: '0.46rem', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>System Health</div>
              {[
                { l: 'LLM Runtime',     s: 'ONLINE',  lat: '1.2s avg', c: '#10B981' },
                { l: 'Vector DB',       s: 'ONLINE',  lat: '12ms',     c: '#10B981' },
                { l: 'Knowledge Graph', s: 'ONLINE',  lat: '8ms',      c: '#10B981' },
                { l: 'Internet',        s: 'BLOCKED', lat: 'air-gap',  c: '#EF4444' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.28rem 0', borderBottom: i < 3 ? '1px solid rgba(6,182,212,0.05)' : 'none' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: item.c, boxShadow: `0 0 4px ${item.c}`, flexShrink: 0 }} />
                  <span style={{ color: '#4A5568', fontSize: '0.58rem', flex: 1 }}>{item.l}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2D3748', fontSize: '0.42rem' }}>{item.lat}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: item.c, fontSize: '0.42rem', fontWeight: 700 }}>{item.s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Query input */}
          <div style={{ padding: '0.5rem 0.8rem', background: '#030508', borderTop: '1px solid rgba(6,182,212,0.06)', borderBottom: '1px solid rgba(6,182,212,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.38rem 0.6rem', borderRadius: 7, background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.16)' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#06B6D4', fontSize: '0.5rem', fontWeight: 700, flexShrink: 0 }}>⬡ AI</span>
              <span style={{ color: '#2D3748', fontSize: '0.6rem', flex: 1, fontStyle: 'italic' }}>Ask anything across your documents... e.g. "Show safety incidents for Excavator E-7"</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#06B6D4', fontSize: '0.42rem', padding: '0.12rem 0.38rem', borderRadius: 4, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', flexShrink: 0 }}>↵</span>
            </div>
          </div>

          {/* Live audit log */}
          <div style={{ padding: '0.5rem 0.8rem', background: '#060A0F' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4A5568', fontSize: '0.46rem', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Live Audit Log</div>
            {[
              { q: 'Maintenance incidents — Excavator E-7 — past 90 days', u: 'j.thornton', t: '2m', src: '14 docs', ms: '1.4s' },
              { q: 'Compliance gap analysis — WHS Act s.47 procedures', u: 'a.morrison', t: '11m', src: '8 docs', ms: '0.9s' },
              { q: 'Q3 safety incident summary — Pilbara site — all events', u: 'r.chen',    t: '29m', src: '23 docs', ms: '2.1s' },
            ].map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.4rem', padding: '0.28rem 0', borderBottom: i < 2 ? '1px solid rgba(6,182,212,0.05)' : 'none', alignItems: 'center' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 4px #10B981', flexShrink: 0 }} />
                <span style={{ color: '#4A5568', fontSize: '0.6rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.q}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2D3748', fontSize: '0.44rem', flexShrink: 0 }}>{q.u}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#06B6D4', fontSize: '0.44rem', fontWeight: 600, flexShrink: 0 }}>{q.src}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2D3748', fontSize: '0.42rem', flexShrink: 0 }}>{q.ms}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1A202C', fontSize: '0.42rem', flexShrink: 0 }}>{q.t} ago</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

/* ── Architecture Diagram ────────────────────────────── */
function ArchitectureDiagram() {
  const SOURCES = [
    { icon: '📄', l: 'PDFs & Word Docs',  c: '#06B6D4' },
    { icon: '🖼', l: 'Images & Scans',    c: '#8B5CF6' },
    { icon: '📊', l: 'Reports & Data',    c: '#F59E0B' },
    { icon: '🗄', l: 'Databases & APIs',  c: '#10B981' },
  ]
  const OUTPUTS = [
    { icon: '🔍', l: 'Semantic Search',    c: '#06B6D4' },
    { icon: '📋', l: 'Audit Trail',        c: '#8B5CF6' },
    { icon: '📊', l: 'Analytics',          c: '#F59E0B' },
    { icon: '✅', l: 'Compliance Reports', c: '#10B981' },
  ]
  const ENGINE = [
    { icon: '🛡', l: 'PII Shield',       c: '#F87171' },
    { icon: '🧠', l: 'AI Query Engine',  c: '#8B5CF6' },
    { icon: '🕸', l: 'Knowledge Graph',  c: '#06B6D4' },
  ]

  const node = c => ({
    padding: '0.5rem 0.7rem', borderRadius: 8,
    background: c + '0D', border: `1px solid ${c}20`,
    display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--t3)',
  })

  const Arrow = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="30" height="50" viewBox="0 0 30 50" fill="none">
        <path d="M4 25 H22" stroke="rgba(6,182,212,0.38)" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 17 L22 25 L14 33" stroke="rgba(6,182,212,0.38)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="4" y1="10" x2="4" y2="40" stroke="rgba(6,182,212,0.07)" strokeWidth="1" strokeDasharray="2,4"/>
      </svg>
    </div>
  )

  return (
    <div style={{ background: '#050810', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 14, padding: '1.75rem 1.5rem', overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr', alignItems: 'center', minWidth: 520 }}>

        <div>
          <div className="mono" style={{ color: 'rgba(100,116,139,0.7)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', marginBottom: '0.65rem' }}>DATA SOURCES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {SOURCES.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={node(s.c)}>
                <span style={{ fontSize: '0.82rem', flexShrink: 0 }}>{s.icon}</span>
                <span style={{ fontSize: '0.72rem' }}>{s.l}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <Arrow />

        <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(160deg, rgba(6,182,212,0.06), rgba(139,92,246,0.06))',
            border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: '1.1rem 0.9rem',
            boxShadow: '0 0 36px rgba(6,182,212,0.06)',
          }}>
          <div className="mono" style={{ color: '#06B6D4', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', marginBottom: '0.7rem' }}>AIDATARIS ENGINE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
            {ENGINE.map((e, i) => (
              <div key={i} style={{ padding: '0.42rem 0.6rem', borderRadius: 7, background: e.c + '10', border: `1px solid ${e.c}22`, display: 'flex', alignItems: 'center', gap: '0.38rem' }}>
                <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>{e.icon}</span>
                <span style={{ color: e.c, fontSize: '0.7rem', fontWeight: 600 }}>{e.l}</span>
              </div>
            ))}
          </div>
          <div className="mono" style={{ color: 'rgba(45,55,72,0.9)', fontSize: '0.44rem', textAlign: 'center', marginTop: '0.6rem', letterSpacing: '0.07em' }}>100% ON-PREMISE · AIR-GAP READY</div>
        </motion.div>

        <Arrow />

        <div>
          <div className="mono" style={{ color: 'rgba(100,116,139,0.7)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', marginBottom: '0.65rem' }}>SECURE OUTPUTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {OUTPUTS.map((o, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={node(o.c)}>
                <span style={{ fontSize: '0.82rem', flexShrink: 0 }}>{o.icon}</span>
                <span style={{ fontSize: '0.72rem' }}>{o.l}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── GradText shorthand ──────────────────────────────── */
const GRAD = { background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }

/* ── Home ────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <main style={{ background: 'var(--bg)' }}>
      <Helmet>
        <title>Sovereign AI Platform Australia | AIDATARIS</title>
        <meta name="description" content="Secure, on-premise AI systems for mining, government, and enterprise in Australia. No cloud. Full data control. Perth-based sovereign AI platform." />
        <meta name="keywords" content="Sovereign AI platform, AI solutions Perth, On-prem AI Australia, on-premise AI deployment, air-gapped AI, secure AI systems Perth, sovereign AI Australia, government AI Australia, mining AI, enterprise AI Perth" />
        <meta property="og:title" content="AIDATARIS | Secure AI Systems That Run Inside Your Organisation" />
        <meta property="og:description" content="Deploy AI without sending your data to the cloud. On-premise, air-gapped intelligence for high-security industries. Perth, WA." />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', paddingTop: 100, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <SecureNetworkAnimation />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <motion.div animate={{ scale: [1, 1.12, 1], x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', top: -300, left: -200, background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)' }} />
          <motion.div animate={{ scale: [1, 1.08, 1], x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: -80, right: -150, background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 25%, var(--bg) 100%)' }} />

        <motion.div style={{ position: 'relative', zIndex: 1, width: '100%', opacity: heroOpacity, y: heroY }}>
          <div className="container" style={{ padding: '2rem 1.5rem' }}>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.75rem', flexWrap: 'wrap' }}>
              <span className="label">Perth, Western Australia</span>
              <div style={{ height: 1, width: 60, background: 'var(--divider-c)' }} />
              <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>On-Premise · Air-Gapped · Sovereign AI</span>
            </motion.div>

            <h1 style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '2rem', maxWidth: 900 }}>
              {[
                { text: 'On-Premise AI Systems', delay: 0.15 },
                { text: 'for High-Security Industries', delay: 0.27 },
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
                style={{ display: 'block', ...GRAD }}>
                No Cloud. No Data Leakage.
              </motion.span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.65 }}
              style={{ color: 'var(--t3)', fontSize: 'clamp(1rem, 1.8vw, 1.18rem)', lineHeight: 1.8, maxWidth: 580, marginBottom: '0.85rem' }}>
              Deploy AI inside your organisation —{' '}
              <em style={{ color: '#06B6D4', fontStyle: 'normal', fontWeight: 600 }}>no cloud, no data leakage, full control.</em>
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.55 }}
              style={{ color: 'var(--t5)', fontSize: '0.95rem', lineHeight: 1.72, maxWidth: 520, marginBottom: '2.75rem' }}>
              We design and deploy secure AI systems tailored to your organisation — from scoping to go-live, fully on your infrastructure.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.5 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.1rem' }}>Request Secure AI Demo →</Link>
              <Link to="/book" className="btn-ghost"   style={{ fontSize: '1rem', padding: '0.9rem 2.1rem' }}>Book Free Consultation</Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {['On-Premise AI', 'Air-Gap Ready', 'Zero Data Egress', 'Mining', 'Government', 'Legal', 'Perth Based'].map((p, i) => (
                <motion.span key={p} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + i * 0.06 }}
                  className="mono" style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(6,182,212,0.2)', color: 'var(--t4)', background: 'rgba(6,182,212,0.05)' }}>
                  {p}
                </motion.span>
              ))}
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ── PII DEMO + STATS STRIP ───────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', borderTop: '1px solid var(--bd)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
              <PIIScanner />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--bd)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(6,182,212,0.1)' }}>
              {[
                { label: 'Industries Served',   val: 8,   suffix: '+' },
                { label: 'Local Processing',     val: 100, suffix: '%' },
                { label: 'Cloud Dependencies',   val: 0,   suffix: '' },
                { label: 'PII Types Protected',  val: 12,  suffix: '+' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--stat-cell)', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#06B6D4', letterSpacing: '-0.03em' }}>
                    <Counter target={s.val} suffix={s.suffix} />
                  </div>
                  <div style={{ color: 'var(--t4)', fontSize: '0.78rem', marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM SECTION ──────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="The Problem" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start', marginBottom: '2rem' }}>
            <div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                The Compliance Risk Your Leadership{' '}
                <span style={GRAD}>Cannot Afford to Ignore.</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                style={{ color: 'var(--t3)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: 460 }}>
                Every query your team sends to a cloud AI platform is a data exposure event. For mining, government, and legal organisations operating under Australian privacy law, one sensitive query can constitute a compliance breach — and no cloud vendor can be held accountable. The risk is real, growing, and entirely preventable.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#EF4444', fontSize: '1.1rem', flexShrink: 0 }}>⚠</span>
                <p style={{ color: '#F87171', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>
                  <strong>Australian Privacy Act 1988</strong> requires organisations to protect personal information from unauthorised disclosure. Cloud AI vendors process your data on overseas servers — outside your legal control.
                </p>
              </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {PROBLEMS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.08, duration: 0.5 }}
                  style={{ padding: '1.75rem', borderRadius: 14, border: `1px solid ${p.color}22`, background: p.color + '06', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color}80, transparent)` }} />
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                  <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{p.title}</h3>
                  <p style={{ color: 'var(--t4)', fontSize: '0.82rem', lineHeight: 1.7 }}>{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTION + BENEFITS ───────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="The Solution" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center', marginBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                AI That Runs Entirely{' '}
                <span style={GRAD}>Inside Your Infrastructure.</span>
              </h2>
              <p style={{ color: 'var(--t3)', fontSize: '1rem', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                AIDATARIS installs a complete intelligence system on your own hardware. It ingests your internal files, structures your knowledge, and answers questions — all without a single byte leaving your network.
              </p>
              <p style={{ color: 'var(--t3)', fontSize: '1rem', lineHeight: 1.85, marginBottom: '2rem' }}>
                The result: your organisation can finally use AI to surface insights from decades of internal data, automate manual analysis tasks, and meet compliance requirements — without compromising on security.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-primary">Request Secure AI Demo →</Link>
                <Link to="/platform" className="btn-ghost">How It Works</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {BENEFITS.map((b, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass" style={{ padding: '1.75rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', border: `1px solid ${b.color}22` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: b.color + '15', border: `1px solid ${b.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                    {b.icon}
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{b.title}</h3>
                    <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.7 }}>{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="01 · What We Build" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 620, lineHeight: 1.15 }}>
            We Reduce Manual Workload{' '}
            <span style={GRAD}>and Improve Decision Speed.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 500, marginBottom: '4rem' }}>
            Every service we deliver runs inside your infrastructure. No cloud dependency, no data risk, no compliance headache.
          </motion.p>

          <div>
            {SERVICES.map((svc, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay: i * 0.07 }}
                whileHover={{ x: 6 }}
                style={{ display: 'grid', gridTemplateColumns: '5.5rem 1fr', gap: '2.5rem', padding: '2.75rem 0', borderBottom: '1px solid var(--bd)', alignItems: 'start' }}>

                <div style={{
                  fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1,
                  color: 'transparent', WebkitTextStroke: `1px ${svc.color}40`,
                  letterSpacing: '-0.04em', paddingTop: '0.3rem',
                  userSelect: 'none',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: svc.color + '15', border: `1px solid ${svc.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{svc.icon}</div>
                      <div>
                        {svc.highlight && <div className="mono" style={{ color: svc.color, fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '2px' }}>★ OUR CORE CAPABILITY</div>}
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
            From Raw Documents to{' '}
            <span style={GRAD}>Verified Answers.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '4.5rem' }}>
            From raw file upload to a cited, audited AI response — everything runs on your hardware, inside your network.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', border: '1px solid var(--bd)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { num: '01', icon: '📄', color: '#06B6D4', title: 'Ingest Internal Files',  desc: 'PDFs, reports, Word docs, images, scanned records — any format accepted locally.' },
              { num: '02', icon: '🛡', color: '#F87171', title: 'PII Auto-Detection',     desc: '12+ sensitive data categories detected and redacted before storage.' },
              { num: '03', icon: '🕸', color: '#8B5CF6', title: 'Structure Using AI',     desc: 'Semantic indexing and a knowledge graph built from your content.' },
              { num: '04', icon: '🧠', color: '#F59E0B', title: 'Query Securely',          desc: 'Natural language queries with multi-hop reasoning. Zero internet required.' },
              { num: '05', icon: '✓',  color: '#10B981', title: 'Get Verified Answers',   desc: 'Every response includes source citations and a full audit trail.' },
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

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { icon: '⚡', text: 'Average query response under 3 seconds on-premise' },
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

      {/* ── PLATFORM DASHBOARD PREVIEW ───────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="Platform Preview" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <span className="label" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>Enterprise Intelligence Console</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', lineHeight: 1.12, marginBottom: '1.25rem' }}>
                A Complete Intelligence Interface.{' '}
                <span style={GRAD}>Running on Your Hardware.</span>
              </h2>
              <p style={{ color: 'var(--t3)', fontSize: '0.95rem', lineHeight: 1.82, marginBottom: '1.75rem' }}>
                The AIDATARIS admin console gives your team everything they need — semantic search across your document library, real-time compliance status, immutable audit logs, and system health monitoring. All running inside your network, with zero cloud dependency.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.25rem' }}>
                {[
                  { icon: '📊', text: 'Real-time query analytics and usage tracking per user' },
                  { icon: '🛡', text: 'Live compliance dashboard — ISM, PSPF, Essential Eight' },
                  { icon: '📋', text: 'Tamper-proof audit log with source citations for every query' },
                  { icon: '⚡', text: 'System health monitoring — zero external network calls' },
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/book" className="btn-primary">Book a Live Demo →</Link>
                <Link to="/platform" className="btn-ghost">See Architecture</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <DashboardMockup />
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                {[
                  { icon: '🔒', text: '100% On-Premise' },
                  { icon: '📡', text: 'Air-Gap Compatible' },
                  { icon: '⚙', text: 'Deployed in Weeks' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--t5)', fontSize: '0.75rem' }}>
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span className="label">System Architecture</span>
              <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', fontWeight: 800, color: 'var(--t1)', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
                Data In. Intelligence Out.{' '}
                <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Zero Egress.</span>
              </h3>
              <p style={{ color: 'var(--t5)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.7 }}>
                Every byte flows through AIDATARIS and stays on your infrastructure. Nothing leaves your network.
              </p>
            </div>
            <ArchitectureDiagram />
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="02 · Industries We Serve" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 600, lineHeight: 1.15 }}>
            Real Problems.{' '}
            <span style={GRAD}>Real Results.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 500, marginBottom: '4rem' }}>
            We focus on industries where data sensitivity and compliance requirements make cloud AI impossible. This is where we create the most value.
          </motion.p>

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
                    <div style={{ marginTop: '1.5rem' }}>
                      <Link to="/contact" className="btn-ghost" style={{ fontSize: '0.85rem', padding: '0.65rem 1.4rem' }}>
                        Discuss Your Use Case →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ──────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="03 · Our Process" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 580, lineHeight: 1.15 }}>
            Clear Process.{' '}
            <span style={GRAD}>No Surprises.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 520, marginBottom: '4rem' }}>
            We work in four structured stages — from a 30-minute discovery call to a live, production-grade AI system inside your infrastructure. Every step is defined before we begin, and every commitment we make is in writing.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'var(--bd)', border: '1px solid var(--bd)', borderRadius: 16, overflow: 'hidden' }}>
            {PROCESS_STEPS.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ padding: '2.5rem 2rem', background: 'var(--glass-bg)', transition: 'background 0.3s' }}
                whileHover={{ background: step.color + '06' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="mono" style={{ color: step.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em' }}>{step.num}</div>
                  <div style={{ flex: 1, height: 1, background: step.color + '30' }} />
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: step.color + '15', border: `1px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
                  {step.icon}
                </div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.72 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}
            style={{ marginTop: '3.5rem', textAlign: 'center' }}>
            <Link to="/contact" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.85rem 2rem', marginRight: '1rem' }}>
              Start with a Discovery Call →
            </Link>
            <p style={{ color: 'var(--t5)', fontSize: '0.78rem', marginTop: '0.85rem' }}>
              Free 30-minute call. We'll confirm fit before you invest any time or budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="04 · Investment" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 600, lineHeight: 1.15 }}>
            Transparent Pricing.{' '}
            <span style={GRAD}>Scoped to Your Needs.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 500, marginBottom: '4rem' }}>
            We don't do hidden fees or surprise invoices. Every engagement starts with a discovery call so we scope accurately before you commit.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {PRICING.map((plan, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className={plan.highlight ? 'glass-premium' : 'glass'}
                style={{
                  padding: '2.5rem',
                  border: plan.highlight ? 'none' : `1px solid ${plan.color}22`,
                  position: 'relative', overflow: 'hidden',
                  ...(plan.highlight ? {} : {}),
                }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <span className="mono" style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 4, background: plan.color + '20', color: plan.color, border: `1px solid ${plan.color}40` }}>MOST POPULAR</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: plan.highlight ? `linear-gradient(90deg, ${plan.color}, #06B6D4)` : plan.color + '60', borderRadius: '16px 16px 0 0' }} />

                <div className="mono" style={{ color: plan.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.5rem' }}>{plan.tier.toUpperCase()}</div>
                <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.25rem' }}>{plan.price}</div>
                <div style={{ color: 'var(--t5)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>{plan.period}</div>
                <p style={{ color: 'var(--t3)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.75rem', minHeight: '3.5rem' }}>{plan.desc}</p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                  {plan.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--t3)', fontSize: '0.85rem' }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: plan.color + '20', border: `1px solid ${plan.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: plan.color, fontSize: '0.55rem', fontWeight: 700 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link to={plan.ctaLink} className={plan.highlight ? 'btn-primary' : 'btn-ghost'} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  {plan.cta} →
                </Link>
                {plan.microcopy && (
                  <p style={{ textAlign: 'center', color: 'var(--t5)', fontSize: '0.72rem', marginTop: '0.85rem', lineHeight: 1.55 }}>
                    {plan.microcopy}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', color: 'var(--t5)', fontSize: '0.82rem', marginTop: '2rem' }}>
            All pricing in AUD. GST applicable. Free 30-minute discovery call before any commitment.
          </motion.p>
        </div>
      </section>

      {/* ── WHY AIDATARIS ────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="05 · Why AIDATARIS" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 580, lineHeight: 1.15 }}>
            Built for Serious Organisations,{' '}
            <span style={GRAD}>Not Side Projects.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '4rem' }}>
            We focus exclusively on high-security, high-stakes deployments. That narrow focus means we do this better than anyone else.
          </motion.p>

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
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="06 · Case Studies" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '1rem', maxWidth: 560, lineHeight: 1.15 }}>
            From Problem to{' '}
            <span style={GRAD}>Measurable Result.</span>
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.25rem', flexWrap: 'wrap' }}>
                    <div className="mono" style={{ color: cs.color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em' }}>
                      {cs.label.toUpperCase()}
                    </div>
                    <div style={{ height: 1, flex: 1, background: cs.color + '25', minWidth: 20 }} />
                    <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.58rem', letterSpacing: '0.06em' }}>{cs.industry}</span>
                  </div>
                  {cs.results.map((r, j) => (
                    <motion.div key={j}
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.15 + j * 0.1, duration: 0.6 }}
                      style={{
                        marginBottom: '1rem',
                        padding: j === 0 ? '1.25rem 1.5rem' : '0.85rem 1.25rem',
                        borderRadius: j === 0 ? 12 : 8,
                        background: j === 0 ? cs.color + '08' : 'transparent',
                        border: j === 0 ? `1px solid ${cs.color}25` : `1px solid ${cs.color}12`,
                        borderLeft: `3px solid ${cs.color}${j === 0 ? 'CC' : '50'}`,
                        boxShadow: j === 0 ? `0 8px 32px ${cs.color}0A` : 'none',
                      }}>
                      <div style={{ fontSize: j === 0 ? 'clamp(2.2rem, 4.5vw, 3.8rem)' : 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: cs.color, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '0.3rem' }}>
                        {r.metric}
                      </div>
                      <div style={{ color: j === 0 ? 'var(--t3)' : 'var(--t4)', fontSize: j === 0 ? '0.85rem' : '0.8rem', lineHeight: 1.55 }}>{r.label}</div>
                    </motion.div>
                  ))}
                  <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', color: '#10B981', fontSize: '0.58rem', fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    ✓ VERIFIED DEPLOYMENT RESULTS
                  </div>
                </div>

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
          <div style={{ borderTop: '1px solid var(--bd)' }} />
        </div>
      </section>

      {/* ── FOUNDER ──────────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="07 · Who We Are" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.75rem' }}>
                Sovereign AI Expertise,<br />
                <span style={GRAD}>Built for High-Security Environments.</span>
              </h2>
              <p style={{ color: 'var(--t3)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.1rem' }}>
                AIDATARIS was built for one specific challenge: deploying enterprise AI in environments where data sovereignty is non-negotiable. Mining operations, government agencies, and critical infrastructure organisations cannot afford the compliance risks that come with cloud AI — and they shouldn't have to.
              </p>
              <p style={{ color: 'var(--t3)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.1rem' }}>
                Our team brings experience from the German Aerospace Center (DLR) and CTI Consulting — environments where security, auditability, and zero-failure tolerances are standard. We apply that same engineering discipline to every commercial deployment.
              </p>
              <p style={{ color: 'var(--t3)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '2.25rem' }}>
                We don't sell software licences. We solve high-stakes, high-cost problems for organisations that cannot afford to get this wrong — then stand behind the result with ongoing support.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Ollama', 'Qdrant', 'Neo4j', 'FastAPI', 'Python', 'PyTorch'].map(t => (
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
                    Specialist in sovereign AI systems, secure data architecture, and enterprise AI deployment. Vivek brings hands-on engineering experience from the{' '}
                    <span style={{ color: '#06B6D4', fontWeight: 600 }}>German Aerospace Center (DLR)</span>{' '}
                    and{' '}
                    <span style={{ color: '#F59E0B', fontWeight: 600 }}>CTI Consulting</span>{' '}
                    — applying that same mission-critical rigour to protect Australian organisations from the risks of cloud AI.
                  </p>
                  <blockquote style={{ borderLeft: '2px solid rgba(6,182,212,0.4)', paddingLeft: '1rem', margin: '0 0 1.25rem', color: 'var(--t3)', fontSize: '0.85rem', lineHeight: 1.75, fontStyle: 'italic' }}>
                    "Australian organisations are being told that accessing modern AI requires sending sensitive data to overseas servers. That's a choice we should refuse to accept. Sovereign AI — powerful, compliant, fully in your control — is not a future aspiration. It's deployable today."
                  </blockquote>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {[
                      { icon: '🚀', text: 'German Aerospace Center (DLR)' },
                      { icon: '💼', text: 'CTI Consulting' },
                      { icon: '🎓', text: 'EIT Perth' },
                      { icon: '📍', text: 'Perth, Western Australia' },
                    ].map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--t4)', fontSize: '0.82rem' }}>
                        <span>{c.icon}</span> {c.text}
                      </div>
                    ))}
                    <a href="https://www.linkedin.com/in/vivekrabadiya" target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#0A66C2', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      linkedin.com/in/vivekrabadiya
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section style={{ padding: '12rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'var(--bg2)' }}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, #06B6D4 0%, transparent 65%)', pointerEvents: 'none' }} />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, #8B5CF6 0%, transparent 65%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
            <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'var(--divider-c)' }} />
            <span className="label">Ready to Deploy Secure AI?</span>
            <div style={{ flex: 1, maxWidth: 100, height: 1, background: 'var(--divider-c)' }} />
          </div>

          <h2 style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1.03, marginBottom: '1.75rem' }}>
            Your Data Should Never<br />
            <span style={GRAD}>Leave Your Building.</span>
          </h2>

          <p style={{ color: 'var(--t3)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 1.5rem' }}>
            Book a free 30-minute consultation. We'll assess your data environment, security requirements, and AI readiness — then tell you honestly what deployment would look like for your organisation.
          </p>
          <p style={{ color: 'var(--t5)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 3rem', fontStyle: 'italic' }}>
            We'll analyse your requirements and propose a tailored solution — no commitment, no obligation.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Request Secure AI Demo →
            </Link>
            <Link to="/book" className="btn-ghost" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Get Custom Deployment Plan
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
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
