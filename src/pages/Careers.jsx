import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const PERKS = [
  { icon: '🏠', t: 'Hybrid / Remote WA',    d: 'Work from our Perth HQ or fully remote within Western Australia.' },
  { icon: '🔒', t: 'Mission-Driven Work',    d: 'Build AI that protects sensitive data — not extracts it. Every line of code matters.' },
  { icon: '🧠', t: 'Cutting-Edge Stack',     d: 'Self-RAG, GraphRAG, local LLMs, vision models. No legacy CRUD apps here.' },
  { icon: '📈', t: 'Equity & Growth',        d: 'Early-stage equity, competitive salary, and a direct line to shaping the product.' },
]

const ROLES = [
  {
    id: 'frontend',
    icon: '⬡',
    color: '#06B6D4',
    title: 'Frontend Developer',
    dept: 'Engineering',
    type: 'Full-Time',
    location: 'Perth, WA · Hybrid',
    tagline: 'Craft the interface for sovereign AI.',
    desc: 'You will design and build the enterprise web platform that operations teams, compliance officers, and executives rely on daily. From the admin console to the document intelligence UI, your work is the face of AIDATARIS.',
    responsibilities: [
      'Build and maintain React-based enterprise UI components with Framer Motion animations',
      'Collaborate with design to translate Figma mockups into pixel-perfect, accessible interfaces',
      'Own the front-end of the Admin Console — user management, PII dashboards, audit log viewers',
      'Implement real-time data visualisations for system health, query analytics, and compliance stats',
      'Optimise rendering performance for large document and user tables',
      'Write clean, testable TypeScript with full component coverage',
    ],
    requirements: [
      '2+ years production experience with React and modern JavaScript / TypeScript',
      'Strong understanding of CSS layout, animations, and responsive design',
      'Experience with state management (Zustand, Jotai, or Redux Toolkit)',
      'Familiarity with REST and WebSocket APIs',
      'Eye for detail — you notice when a transition is 20ms too slow',
    ],
    niceToHave: [
      'Experience with Framer Motion or GSAP',
      'Prior work on enterprise B2B SaaS products',
      'Familiarity with data visualisation libraries (Recharts, Victory, D3)',
      'Interest in AI / LLM products',
    ],
  },
  {
    id: 'software',
    icon: '⚙',
    color: '#8B5CF6',
    title: 'Software Engineer',
    dept: 'Engineering',
    type: 'Full-Time',
    location: 'Perth, WA · Hybrid',
    tagline: 'Engineer the backbone of on-premises AI.',
    desc: 'You will build the core platform infrastructure that runs entirely within customer environments — RAG pipelines, document ingestion APIs, authentication systems, and the orchestration layer that ties it all together. Security and reliability are non-negotiable.',
    responsibilities: [
      'Design and develop RESTful APIs using Python (FastAPI) for document ingestion, search, and query orchestration',
      'Build and optimise the vector store ingestion pipeline — chunking, embedding, indexing',
      'Implement RBAC, JWT session management, SSO integrations (Azure AD, Okta, SAML 2.0)',
      'Develop PII detection and redaction services that run pre-indexing on all document types',
      'Build audit logging infrastructure with cryptographic signing for tamper-proof compliance records',
      'Write infrastructure-as-code for containerised on-premises deployments (Docker, Kubernetes)',
      'Participate in customer deployment reviews to ensure security requirements are met',
    ],
    requirements: [
      '3+ years of backend or full-stack software engineering',
      'Strong Python proficiency — FastAPI, SQLAlchemy, async patterns',
      'Experience with containerisation: Docker, Docker Compose, and ideally Kubernetes',
      'Understanding of authentication flows: OAuth 2.0, JWT, MFA, SAML',
      'Comfort working in security-conscious environments with strict data handling requirements',
    ],
    niceToHave: [
      'Experience with vector databases — Weaviate, Qdrant, ChromaDB, or pgvector',
      'Familiarity with LangChain, LlamaIndex, or similar RAG frameworks',
      'Background in cybersecurity or compliance-regulated industries',
      'Knowledge of the ASD Essential Eight or PSPF frameworks',
      'Previous startup experience',
    ],
  },
  {
    id: 'ai',
    icon: '🧠',
    color: '#10B981',
    title: 'AI Engineer',
    dept: 'AI Research & Engineering',
    type: 'Full-Time',
    location: 'Perth, WA · Hybrid',
    tagline: 'Build intelligence that never leaves the premises.',
    desc: 'You will design, implement, and continuously improve the AI core of AIDATARIS — Self-RAG with critic loops, GraphRAG knowledge graph construction, multi-modal vision pipelines, and agentic tool-calling systems. All running locally, all under customer control.',
    responsibilities: [
      'Architect and improve the Self-RAG retrieval pipeline including the critic scoring and re-query loop',
      'Build and maintain GraphRAG pipelines — entity extraction, relationship mapping, and multi-hop reasoning',
      'Develop multi-modal document processing: OCR, blueprint analysis, scanned PDF ingestion using local vision LLMs',
      'Integrate and optimise locally-hosted LLMs (Llama, Mistral, Qwen) via Ollama and vLLM',
      'Design agentic tool-calling workflows for domain-specific tasks: budget analysis, regulatory cross-checks, timeline modelling',
      'Evaluate and benchmark model performance — latency, accuracy, hallucination rate — across customer document corpora',
      'Research and prototype emerging techniques from the RAG and LLM literature',
    ],
    requirements: [
      '2+ years of hands-on machine learning or NLP engineering (production, not just notebooks)',
      'Strong Python — PyTorch, HuggingFace Transformers, NumPy',
      'Direct experience building or deploying RAG systems at scale',
      'Familiarity with embedding models, vector similarity search, and chunking strategies',
      'Understanding of LLM inference — quantisation, context window management, prompt engineering',
    ],
    niceToHave: [
      'Experience with GraphRAG, knowledge graph construction, or entity extraction pipelines',
      'Prior work with local/private LLM deployment (Ollama, vLLM, llama.cpp)',
      'Familiarity with self-correcting or agentic AI architectures',
      'Published research or open-source contributions in NLP / LLM space',
      'Experience in a regulated industry: mining, government, legal, or healthcare',
    ],
  },
]

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

function RoleCard({ role }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div variants={fade}>
      <div
        className="glass"
        style={{ border: `1px solid ${role.color}20`, overflow: 'hidden', marginBottom: '1rem' }}
      >
        {/* Card header — always visible */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            padding: '1.75rem 2rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1rem', flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: role.color + '18', border: `1px solid ${role.color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', color: role.color,
            }}>{role.icon}</div>
            <div>
              <div style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem' }}>{role.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[role.dept, role.type, role.location].map((tag, i) => (
                  <span key={i} className="mono" style={{
                    fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    background: i === 0 ? role.color + '15' : 'var(--glass-bg)',
                    color: i === 0 ? role.color : 'var(--t4)',
                    border: `1px solid ${i === 0 ? role.color + '30' : 'var(--glass-bd)'}`,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <p style={{ color: 'var(--t4)', fontSize: '0.85rem', maxWidth: 280 }}>{role.tagline}</p>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
              style={{ color: role.color, fontSize: '1.1rem', flexShrink: 0 }}
            >▼</motion.div>
          </div>
        </div>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ borderTop: `1px solid ${role.color}18`, padding: '2rem' }}>
                <p style={{ color: 'var(--t3)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem' }}>
                  {role.desc}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <div className="mono" style={{ color: role.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.85rem' }}>RESPONSIBILITIES</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {role.responsibilities.map((r, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.6rem', color: 'var(--t3)', fontSize: '0.85rem', lineHeight: 1.6, alignItems: 'flex-start' }}>
                          <span style={{ color: role.color, flexShrink: 0, marginTop: 3 }}>▸</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="mono" style={{ color: role.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.85rem' }}>REQUIREMENTS</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                      {role.requirements.map((r, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.6rem', color: 'var(--t3)', fontSize: '0.85rem', lineHeight: 1.6, alignItems: 'flex-start' }}>
                          <span style={{ color: '#10B981', flexShrink: 0, marginTop: 3 }}>✓</span> {r}
                        </li>
                      ))}
                    </ul>

                    <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.85rem' }}>NICE TO HAVE</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {role.niceToHave.map((r, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.6rem', color: 'var(--t5)', fontSize: '0.83rem', lineHeight: 1.6, alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--t5)', flexShrink: 0, marginTop: 3 }}>◦</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={`mailto:support@aidataris.com.au?subject=Application — ${role.title}`}
                  className="btn-primary"
                  style={{ fontSize: '0.9rem', padding: '0.75rem 2rem' }}
                >
                  Apply for this Role →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Careers() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span className="label">Careers at AIDATARIS</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Build AI That<br /><span className="gradient-text">Stays Sovereign.</span>
          </h1>
          <p style={{ color: 'var(--t4)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 540, margin: '0 auto 2rem' }}>
            We are a small, focused team of engineers in Perth building the AI platform that high-security Australian enterprises actually trust. If that sounds like your kind of problem, we want to talk.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['3 Open Roles', 'Perth · Hybrid', 'Early-Stage Equity'].map((tag, i) => (
              <span key={i} className="mono" style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '5px 14px', borderRadius: 20,
                background: 'rgba(6,182,212,0.08)', color: '#06B6D4',
                border: '1px solid rgba(6,182,212,0.25)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '3rem' }} />
        <div className="container">
          <motion.div
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}
          >
            {PERKS.map((p, i) => (
              <motion.div key={i} variants={fade} className="glass" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                <div style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{p.t}</div>
                <div style={{ color: 'var(--t4)', fontSize: '0.82rem', lineHeight: 1.65 }}>{p.d}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <span className="label">Open Positions</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0', letterSpacing: '-0.02em' }}>
              3 Roles · Perth, WA
            </h2>
            <p style={{ color: 'var(--t4)', lineHeight: 1.75, maxWidth: 560 }}>
              Click any role to read the full position description and apply directly.
            </p>
          </div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {ROLES.map(role => <RoleCard key={role.id} role={role} />)}
          </motion.div>
        </div>
      </section>

      {/* Don't see a fit? */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <span className="label">Not seeing your role?</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.02em' }}>
            We hire for <span className="gradient-text">exceptional people</span><br />before we have the role.
          </h2>
          <p style={{ color: 'var(--t4)', lineHeight: 1.75, marginBottom: '2rem' }}>
            If you care about data sovereignty, security, and building AI the right way, send us a note anyway. We read every email.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:support@aidataris.com.au" className="btn-primary">
              Send a Speculative Application →
            </a>
            <Link to="/company" className="btn-ghost">Learn About Us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
