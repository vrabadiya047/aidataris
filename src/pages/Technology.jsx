import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Architecture layers ─────────────────────────────── */
const ARCH_LAYERS = [
  {
    num: '01', label: 'Client Layer', color: '#06B6D4',
    desc: 'Browser-based console on local network. Zero internet dependency.',
    modules: [
      { name: 'Admin Console', sub: 'React Dashboard' },
      { name: 'Query Interface', sub: 'Semantic Search' },
      { name: 'Analytics UI', sub: 'Real-time Charts' },
      { name: 'Audit Viewer', sub: 'Log Explorer' },
    ],
    connector: 'HTTPS — Local Network Only',
  },
  {
    num: '02', label: 'API Gateway', color: '#8B5CF6',
    desc: 'FastAPI handles routing, JWT auth, rate limiting, and tamper-proof audit logging.',
    modules: [
      { name: 'FastAPI', sub: 'REST + WebSocket' },
      { name: 'JWT Auth', sub: 'Token Validation' },
      { name: 'RBAC Engine', sub: 'Access Control' },
      { name: 'Audit Logger', sub: 'Immutable Log' },
      { name: 'Rate Limiter', sub: 'Request Guard' },
    ],
    connector: 'Internal Process — Air-Gap Perimeter',
  },
  {
    num: '03', label: 'AI Processing Core', color: '#F59E0B',
    desc: 'All LLM inference runs locally via Ollama. Zero external API calls. Air-gap compatible.',
    modules: [
      { name: 'Ollama Runtime', sub: 'LLM Inference' },
      { name: 'Self-RAG Engine', sub: 'Critic + Retry' },
      { name: 'GraphRAG', sub: 'Knowledge Graph' },
      { name: 'Agent System', sub: 'Local Tool Calling' },
      { name: 'Vision LLM', sub: 'Multi-modal OCR' },
    ],
    connector: 'Query · Store · Retrieve',
  },
  {
    num: '04', label: 'Storage Layer', color: '#10B981',
    desc: 'Hybrid vector + graph + relational storage. All data on your hardware.',
    modules: [
      { name: 'Qdrant', sub: 'Vector Database' },
      { name: 'Neo4j', sub: 'Graph Database' },
      { name: 'PostgreSQL', sub: 'Metadata Store' },
      { name: 'MinIO', sub: 'Object Storage' },
    ],
    connector: 'Raw Document Feed',
  },
  {
    num: '05', label: 'Ingestion Pipeline', color: '#F87171',
    desc: 'Automated processing with PII detection before any content enters the index.',
    modules: [
      { name: 'Doc Loader', sub: 'PDF · DOCX · IMG' },
      { name: 'PII Shield', sub: '12+ Categories' },
      { name: 'OCR Engine', sub: 'Tesseract Local' },
      { name: 'Chunker', sub: 'Semantic Split' },
      { name: 'Embedder', sub: 'Vector Generator' },
    ],
  },
]

/* ── Platform pillars ────────────────────────────────── */
const PILLARS = [
  {
    num: '01', icon: '🔐', color: '#06B6D4', tag: 'Data Sovereignty',
    title: 'Your Data Never Leaves Your Network.',
    body: 'Every document, query, and AI response is processed entirely within your infrastructure. No cloud API calls, no data egress, no third-party processing. You own every byte — always.',
    points: [
      'All AI inference runs locally on your hardware',
      'Zero external API calls at any point in the pipeline',
      'Full control over data retention and deletion',
      'Air-gap compatible for classified environments',
    ],
    flow: ['Your Data', '▶', 'Your Network', '▶', 'Your Hardware', '▶', 'Your Answer'],
    flowHi: [false, false, false, false, false, false, true],
    outcome: { metric: '0', label: 'Bytes Leave Your Network' },
  },
  {
    num: '02', icon: '🧠', color: '#8B5CF6', tag: 'Intelligent Retrieval',
    title: 'Find Hidden Insights Across Your Documents.',
    body: 'Standard keyword search finds paragraphs. AIDATARIS finds connections. Our AI maps relationships across people, assets, regulations, and projects — answering questions that span your entire document history.',
    points: [
      'Natural language queries across any document type',
      'Cross-document reasoning and relationship mapping',
      'Source citations included with every answer',
      'Searches years of records in seconds',
    ],
    flow: ['Question', '▶', 'Search', '▶', 'Connect', '▶', 'Cited Answer'],
    flowHi: [false, false, false, false, false, false, true],
    outcome: { metric: '4×', label: 'Deeper Context Than Search' },
  },
  {
    num: '03', icon: '⚙', color: '#F59E0B', tag: 'Agentic Automation',
    title: 'Automate Analysis Tasks. Free Your Team.',
    body: 'AI agents run complex multi-step tasks automatically — compliance checks, report generation, risk analysis, cost modelling. What took your team days now runs in minutes, on your infrastructure, without manual input.',
    points: [
      'Automated compliance checking and gap analysis',
      'Report generation from raw data and documents',
      'Budget and cost analysis with live calculations',
      'Custom workflow automation for domain tasks',
    ],
    flow: ['Task', '▶', 'Plan', '▶', 'Execute', '▶', 'Deliver'],
    flowHi: [false, false, false, false, false, false, true],
    outcome: { metric: '100%', label: 'Local — No External APIs' },
  },
  {
    num: '04', icon: '✅', color: '#10B981', tag: 'Compliance by Design',
    title: 'Audit Trail Built in From Day One.',
    body: 'Every query is logged with timestamps, user identity, source documents, and AI reasoning. Immutable audit trails meet government, legal, and financial compliance requirements without additional tooling.',
    points: [
      'Immutable audit log for every query and response',
      'User identity and role tracked for all actions',
      'Source citations attached to every AI answer',
      'Meets Privacy Act, ISM, PSPF, and ASD Essential Eight',
    ],
    flow: ['Query', '▶', 'Authenticate', '▶', 'Answer', '▶', 'Log'],
    flowHi: [false, false, false, false, false, false, true],
    outcome: { metric: '8', label: 'Compliance Frameworks Covered' },
  },
]

/* ── Tech stack ──────────────────────────────────────── */
const STACK = [
  { layer: 'Frontend',    color: '#06B6D4', items: ['React 19', 'Vite 8', 'Framer Motion', 'React Router v7', 'Recharts'] },
  { layer: 'API Layer',   color: '#8B5CF6', items: ['FastAPI', 'Pydantic v2', 'SQLAlchemy', 'JWT / OAuth2', 'WebSockets'] },
  { layer: 'AI Core',     color: '#F59E0B', items: ['Ollama', 'Llama 3.3 70B', 'Mistral-7B', 'LlaVA Vision', 'LangGraph'] },
  { layer: 'Storage',     color: '#10B981', items: ['Qdrant', 'Neo4j 5.x', 'PostgreSQL 16', 'MinIO', 'Redis'] },
  { layer: 'Processing',  color: '#F87171', items: ['Tesseract OCR', 'PyMuPDF', 'spaCy NER', 'Sentence-Transformers', 'Presidio PII'] },
  { layer: 'Deployment',  color: '#A78BFA', items: ['Docker Compose', 'Nginx Proxy', 'Prometheus', 'Grafana', 'Air-Gap Bundle'] },
]

/* ── Helpers ─────────────────────────────────────────── */
function FlowBar({ steps, hi, color }) {
  return (
    <div className="mono" style={{
      display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap',
      padding: '0.65rem 1rem', background: 'var(--term-bg)',
      borderRadius: 8, border: '1px solid rgba(6,182,212,0.1)', fontSize: '0.72rem',
    }}>
      {steps.map((s, i) => (
        <span key={i} style={{ color: hi[i] ? color : s === '▶' ? 'var(--t6)' : 'var(--t4)', fontWeight: hi[i] ? 700 : 400 }}>{s}</span>
      ))}
    </div>
  )
}

function ArchLayer({ layer, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }}>
      <div style={{
        border: `1px solid ${layer.color}28`,
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        background: layer.color + '05',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${layer.color}, ${layer.color}40)`, borderRadius: '12px 0 0 12px' }} />

        <div style={{ marginLeft: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
            <span className="mono" style={{ color: layer.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em' }}>LAYER {layer.num}</span>
            <span style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '0.95rem' }}>{layer.label}</span>
            <div style={{ flex: 1, height: 1, background: layer.color + '18', minWidth: 20 }} />
            <span style={{ color: 'var(--t5)', fontSize: '0.8rem' }}>{layer.desc}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {layer.modules.map((m, j) => (
              <div key={j} style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 8,
                background: 'var(--glass-bg)',
                border: `1px solid ${layer.color}28`,
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.78rem' }}>{m.name}</div>
                <div className="mono" style={{ color: layer.color, fontSize: '0.58rem', letterSpacing: '0.06em' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connector arrow */}
      {layer.connector && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.3rem 0' }}>
          <div style={{ width: 1, height: 10, background: 'rgba(6,182,212,0.25)' }} />
          <span className="mono" style={{ fontSize: '0.58rem', color: '#06B6D4', padding: '2px 10px', borderRadius: 10, background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)' }}>
            ↓ {layer.connector} 🔒
          </span>
          <div style={{ width: 1, height: 6, background: 'rgba(6,182,212,0.25)' }} />
          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid rgba(6,182,212,0.35)' }} />
        </div>
      )}
    </motion.div>
  )
}

function EditorialRule({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
      <span className="label">{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
    </div>
  )
}

/* ── Page ────────────────────────────────────────────── */
export default function Technology() {
  const [activePillar, setActivePillar] = useState(null)

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>
      <Helmet>
        <title>Platform — How AIDATARIS Works | On-Premise AI for High-Security Industries</title>
        <meta name="description" content="AIDATARIS installs a complete AI system inside your infrastructure. No cloud. No data egress. Intelligent document search, automated analysis, and full compliance audit — all on your hardware." />
        <meta name="keywords" content="on-premise AI platform, air-gapped AI, secure AI architecture, sovereign AI Australia, document AI Perth, enterprise AI deployment" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 900, height: 400, borderRadius: '50%', top: -200, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="label">How It Works</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            AI That Runs Inside<br />
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>
              Your Infrastructure.
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ color: 'var(--t4)', fontSize: '1.05rem', lineHeight: 1.78, maxWidth: 580, margin: '0 auto 2.5rem' }}>
            We install a complete intelligence system on your own hardware. It connects to your documents, answers your team's questions, and automates analysis tasks — without a single byte leaving your network.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { val: '0',    label: 'External API Calls' },
              { val: '100%', label: 'On-Premise' },
              { val: '0ms',  label: 'Cloud Latency' },
              { val: '24/7', label: 'Air-Gap Ready' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#06B6D4', letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ color: 'var(--t5)', fontSize: '0.72rem', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PLAIN ENGLISH OVERVIEW ───────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                step: '01', color: '#06B6D4', icon: '📦',
                title: 'We Install on Your Hardware',
                desc: 'AIDATARIS arrives as a secure software bundle. We install it on a server inside your building — on-site or via secure remote session. Nothing goes to the cloud.',
              },
              {
                step: '02', color: '#8B5CF6', icon: '📄',
                title: 'Connect to Your Documents',
                desc: 'We connect to your existing file systems, SharePoint, shared drives, or document repositories. Your files stay where they are — we index them locally.',
              },
              {
                step: '03', color: '#F59E0B', icon: '🧠',
                title: 'AI Understands Your Content',
                desc: 'The system reads and structures your documents — reports, contracts, equipment logs, policies. It builds a knowledge base that understands context, not just keywords.',
              },
              {
                step: '04', color: '#10B981', icon: '💬',
                title: 'Your Team Gets Answers',
                desc: 'Staff ask questions in plain English. The AI searches your knowledge base, cites its sources, and delivers accurate answers in seconds. Every query is logged for audit.',
              },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ padding: '2rem', borderRadius: 14, background: 'var(--glass-bg)', border: `1px solid ${item.color}22`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: item.color + '70' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span className="mono" style={{ color: item.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em' }}>{item.step}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: item.color + '15', border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{item.icon}</div>
                </div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.72 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SYSTEM ARCHITECTURE DIAGRAM ──────────────────── */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="01 · System Architecture" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>

            {/* Left: Diagram */}
            <div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                Full-Stack On-Premise Architecture
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                style={{ color: 'var(--t4)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
                Every component runs on your hardware. Data flows between layers within your network perimeter — never reaching the internet.
              </motion.p>

              {ARCH_LAYERS.map((layer, i) => (
                <ArchLayer key={i} layer={layer} index={i} />
              ))}
            </div>

            {/* Right: Data flow + security badge */}
            <div style={{ position: 'sticky', top: '7rem' }}>
              <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>

                {/* Security perimeter card */}
                <div className="glass" style={{ padding: '2rem', border: '1px solid rgba(6,182,212,0.2)', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)' }} />
                  <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem' }}>SECURITY PERIMETER</div>

                  {/* Perimeter boxes */}
                  <div style={{ border: '2px dashed rgba(6,182,212,0.2)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem', background: 'rgba(6,182,212,0.02)' }}>
                    <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.6rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>YOUR NETWORK BOUNDARY</div>
                    {[
                      { color: '#06B6D4', label: 'React Console', tag: 'Frontend' },
                      { color: '#8B5CF6', label: 'FastAPI Gateway', tag: 'API' },
                      { color: '#F59E0B', label: 'Ollama + LLMs', tag: 'AI Core' },
                      { color: '#10B981', label: 'Qdrant + Neo4j', tag: 'Storage' },
                    ].map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.45rem 0', borderBottom: j < 3 ? '1px solid var(--bd)' : 'none' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}80`, flexShrink: 0 }} />
                        <span style={{ color: 'var(--t2)', fontSize: '0.82rem', fontWeight: 600, flex: 1 }}>{item.label}</span>
                        <span className="mono" style={{ color: item.color, fontSize: '0.58rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: item.color + '15', border: `1px solid ${item.color}30` }}>{item.tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* Blocked external */}
                  <div style={{ padding: '0.75rem 1rem', borderRadius: 8, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#EF4444', fontSize: '0.9rem' }}>🚫</span>
                      <div>
                        <div className="mono" style={{ color: '#EF4444', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em' }}>BLOCKED: EXTERNAL NETWORK</div>
                        <div style={{ color: 'var(--t5)', fontSize: '0.75rem', marginTop: '2px' }}>OpenAI · Anthropic · Azure · AWS · Google</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data flow card */}
                <div className="glass" style={{ padding: '2rem', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div className="mono" style={{ color: '#8B5CF6', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1.25rem' }}>QUERY DATA FLOW</div>
                  {[
                    { step: '1', text: 'User submits natural language query', color: '#06B6D4' },
                    { step: '2', text: 'FastAPI validates JWT + logs event', color: '#8B5CF6' },
                    { step: '3', text: 'Self-RAG retrieves from Qdrant + Neo4j', color: '#F59E0B' },
                    { step: '4', text: 'Critic loop scores context relevance', color: '#F59E0B' },
                    { step: '5', text: 'LLM synthesises cited response', color: '#10B981' },
                    { step: '6', text: 'Audit log appended, response returned', color: '#10B981' },
                  ].map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem 0', borderBottom: j < 5 ? '1px solid var(--bd)' : 'none' }}>
                      <span className="mono" style={{ width: 18, height: 18, borderRadius: '50%', background: item.color + '18', border: `1px solid ${item.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 700, color: item.color, flexShrink: 0, marginTop: 1 }}>
                        {item.step}
                      </span>
                      <span style={{ color: 'var(--t3)', fontSize: '0.82rem', lineHeight: 1.5 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM PILLARS ─────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="02 · Platform Pillars" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 560, lineHeight: 1.15 }}>
            Four Engines.{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>
              One Platform.
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 520, marginBottom: '4.5rem' }}>
            Each pillar addresses a core failure mode of cloud AI — combined, they deliver intelligence that is accurate, deep, actionable, and private.
          </motion.p>

          {PILLARS.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay: i * 0.06 }}
              style={{ display: 'grid', gridTemplateColumns: '5.5rem 1fr', gap: '2.5rem', padding: '3rem 0', borderBottom: '1px solid var(--bd)', alignItems: 'start' }}>

              {/* Stroke number */}
              <div style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1px ${p.color}40`, letterSpacing: '-0.04em', paddingTop: '0.3rem', userSelect: 'none' }}>
                {p.num}
              </div>

              {/* Content */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: p.color + '15', border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{p.icon}</div>
                    <span className="label" style={{ color: p.color, borderColor: p.color + '30', background: p.color + '0A' }}>{p.tag}</span>
                  </div>
                  <h3 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', letterSpacing: '-0.02em', marginBottom: '0.85rem', lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ color: 'var(--t3)', fontSize: '0.9rem', lineHeight: 1.78, marginBottom: '1.25rem' }}>{p.body}</p>
                  <FlowBar steps={p.flow} hi={p.flowHi} color={p.color} />
                </div>
                <div>
                  {/* Outcome stat */}
                  <div style={{ padding: '1.25rem 1.5rem', borderRadius: 12, background: p.color + '08', border: `1px solid ${p.color}20`, marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: p.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{p.outcome.metric}</div>
                    <div style={{ color: 'var(--t4)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{p.outcome.label}</div>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {p.points.map((pt, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--t3)', fontSize: '0.875rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0, marginTop: '0.4rem', boxShadow: `0 0 6px ${p.color}80` }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="03 · Technology Stack" />

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 540, lineHeight: 1.15 }}>
            Proven Stack.{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>
              No Proprietary Lock-In.
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 500, marginBottom: '4rem' }}>
            Built exclusively on open-source components. Your organisation is never dependent on a vendor's pricing decisions.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {STACK.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                className="glass"
                style={{ padding: '1.75rem', border: `1px solid ${s.color}18`, position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -4, boxShadow: `0 16px 48px rgba(0,0,0,0.12), 0 0 24px ${s.color}12` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, ${s.color}00)` }} />
                <div className="mono" style={{ color: s.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '1rem' }}>{s.layer.toUpperCase()}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {s.items.map((item, j) => (
                    <span key={j} style={{ padding: '3px 9px', borderRadius: 5, background: s.color + '0F', border: `1px solid ${s.color}28`, color: 'var(--t2)', fontSize: '0.78rem', fontWeight: 500 }}>{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPLOYMENT ───────────────────────────────────── */}
      <section style={{ padding: '8rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="04 · Deployment" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Deployed in Hours.<br />
                <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>
                  Not Months.
                </span>
              </h2>
              <p style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.78, marginBottom: '2rem' }}>
                AIDATARIS ships as a Docker Compose bundle. One command deploys the entire stack to your on-premise server or air-gapped environment — no internet required after initial setup.
              </p>

              {/* Hardware specs */}
              <div style={{ marginBottom: '2rem' }}>
                <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem' }}>MINIMUM HARDWARE</div>
                {[
                  { label: 'CPU',     val: '16-core x86_64 (e.g. Xeon, Ryzen)' },
                  { label: 'RAM',     val: '64 GB DDR4 ECC' },
                  { label: 'GPU',     val: 'NVIDIA RTX 4090 or A10 (24 GB VRAM)' },
                  { label: 'Storage', val: '2 TB NVMe SSD (RAID recommended)' },
                  { label: 'OS',      val: 'Ubuntu 22.04 LTS / RHEL 9' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.55rem 0', borderBottom: '1px solid var(--bd)', alignItems: 'center' }}>
                    <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.7rem', minWidth: 70, letterSpacing: '0.06em' }}>{r.label}</span>
                    <span style={{ color: 'var(--t2)', fontSize: '0.85rem' }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Deployment modes */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Docker Compose', 'Kubernetes', 'Air-Gap Bundle', 'VMware / Hyper-V', 'Bare Metal'].map((m, i) => (
                  <span key={i} className="mono" style={{ fontSize: '0.65rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', background: 'rgba(6,182,212,0.05)' }}>{m}</span>
                ))}
              </div>
            </motion.div>

            {/* Terminal deploy card */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="terminal">
                <div className="terminal-bar">
                  <span className="terminal-dot" style={{ background: '#FF5F57' }} />
                  <span className="terminal-dot" style={{ background: '#FFBD2E' }} />
                  <span className="terminal-dot" style={{ background: '#28CA41' }} />
                  <span className="mono" style={{ color: 'var(--t6)', fontSize: '0.72rem', marginLeft: 8 }}>deploy — production</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <pre className="mono" style={{ fontSize: '0.78rem', lineHeight: 2, color: '#9CA3AF', whiteSpace: 'pre-wrap' }}>
                    <span style={{ color: '#4B5563' }}># Clone and configure</span>{'\n'}
                    <span style={{ color: '#38BDF8' }}>git</span> clone aidataris-platform.tar.gz{'\n'}
                    <span style={{ color: '#38BDF8' }}>cp</span> .env.example .env{'\n'}
                    <span style={{ color: '#38BDF8' }}>nano</span> .env{'\n'}{'\n'}
                    <span style={{ color: '#4B5563' }}># Pull models (offline bundle available)</span>{'\n'}
                    <span style={{ color: '#38BDF8' }}>ollama</span> pull <span style={{ color: '#A78BFA' }}>llama3.3:70b</span>{'\n'}
                    <span style={{ color: '#38BDF8' }}>ollama</span> pull <span style={{ color: '#A78BFA' }}>llava:34b</span>{'\n'}{'\n'}
                    <span style={{ color: '#4B5563' }}># Launch all services</span>{'\n'}
                    <span style={{ color: '#38BDF8' }}>docker</span> compose up -d{'\n'}{'\n'}
                    <span style={{ color: '#10B981' }}>✓  qdrant         started (port 6333)</span>{'\n'}
                    <span style={{ color: '#10B981' }}>✓  neo4j          started (port 7474)</span>{'\n'}
                    <span style={{ color: '#10B981' }}>✓  postgres       started (port 5432)</span>{'\n'}
                    <span style={{ color: '#10B981' }}>✓  fastapi        started (port 8000)</span>{'\n'}
                    <span style={{ color: '#10B981' }}>✓  react-console  started (port 3000)</span>{'\n'}
                    <span style={{ color: '#34D399', fontWeight: 700 }}>✓  AIDATARIS online — 0 external calls</span>
                  </pre>
                </div>
              </div>

              {/* SLA card */}
              <div className="glass" style={{ marginTop: '1.25rem', padding: '1.25rem 1.5rem', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.875rem' }}>Guided Deployment Included</div>
                  <div style={{ color: 'var(--t4)', fontSize: '0.78rem', marginTop: 2 }}>Our team configures and validates your environment on-site or via secure remote session.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DEPLOYMENT MODEL ─────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div className="container">
          <EditorialRule label="05 · Deployment Options" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: '0.75rem', maxWidth: 540, lineHeight: 1.15 }}>
            Three Ways to Deploy.{' '}
            <span style={{ background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }}>
              All Secure.
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            style={{ color: 'var(--t4)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '3.5rem' }}>
            We adapt to your infrastructure requirements. Whether you have an existing server room, a private cloud, or need a fully air-gapped deployment, we have a model that fits.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                icon: '🏢', color: '#06B6D4', title: 'On-Premise',
                desc: 'Deployed on a server inside your building. Full physical control. Your IT team manages the hardware.',
                tags: ['Your Hardware', 'Your Building', 'IT Team Managed'],
              },
              {
                icon: '📡', color: '#F87171', title: 'Air-Gapped',
                desc: 'No network connectivity required. Delivered as an offline bundle for classified environments, remote sites, or SCIF facilities.',
                tags: ['No Internet Required', 'Offline Bundle', 'Remote Sites'],
                highlight: true,
              },
              {
                icon: '☁', color: '#8B5CF6', title: 'Private Cloud',
                desc: 'Deployed within your organisation\'s private cloud (Azure Gov, AWS GovCloud, or on-prem VMware/Hyper-V) — isolated from public endpoints.',
                tags: ['Private Tenancy', 'Isolated Network', 'Your Cloud Account'],
              },
            ].map((opt, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass"
                style={{ padding: '2rem', border: `1px solid ${opt.color}22`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: opt.color + (opt.highlight ? 'CC' : '60') }} />
                {opt.highlight && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', padding: '2px 7px', borderRadius: 4, background: opt.color + '20', color: opt.color, border: `1px solid ${opt.color}40` }}>MOST SECURE</span>
                  </div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: opt.color + '15', border: `1px solid ${opt.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>{opt.icon}</div>
                <h3 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{opt.title}</h3>
                <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{opt.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {opt.tags.map(t => (
                    <span key={t} className="mono" style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 4, background: opt.color + '12', color: opt.color, border: `1px solid ${opt.color}28` }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="label">Ready to Deploy?</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Book a Free Architecture Consultation
          </h2>
          <p style={{ color: 'var(--t4)', marginBottom: '2.5rem', lineHeight: 1.75 }}>
            We'll assess your infrastructure, your data sources, and your compliance requirements — then tell you exactly what deployment would look like. No commitment required.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">Book Free Consultation →</Link>
            <Link to="/security" className="btn-ghost">Security & Compliance</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
