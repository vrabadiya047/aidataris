import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: '🔄', color: '#06B6D4', tag: 'Self-Correcting RAG',
    title: 'Zero Hallucinations. Guaranteed.',
    body: 'AIDATARIS employs a Self-RAG architecture with a built-in Critic loop that scores retrieval relevance before every response. If the context doesn\'t justify an answer, the system refuses — never fabricates.',
    points: ['Critic model scores retrieval before every answer', 'Auto re-query when context score fails threshold', 'Confidence score attached to every response', 'Source citations always included'],
    flow: ['Query', '▶', 'Retrieve', '▶', 'Critic', '▶', 'Answer'],
    flowHi: [false, false, false, false, true, false, true],
  },
  {
    icon: '🕸', color: '#8B5CF6', tag: 'GraphRAG',
    title: 'Map Every Relationship in Your Data.',
    body: 'Standard RAG finds paragraphs. GraphRAG finds connections. Our knowledge graph engine maps relationships between entities, regulations, personnel, and projects — enabling multi-hop reasoning across your entire corpus.',
    points: ['Entity extraction from unstructured documents', 'Relationship graphs across personnel, assets & law', 'Multi-hop queries spanning disparate sources', 'Ideal for complex engineering and legal document sets'],
    flow: ['Doc', '▶', 'Entities', '▶', 'Graph', '▶', 'Reasoning'],
    flowHi: [false, false, false, false, true, false, true],
  },
  {
    icon: '⚙', color: '#F59E0B', tag: 'Agentic Tool Calling',
    title: 'AI That Acts. Not Just Answers.',
    body: 'AIDATARIS agents invoke local Python tools for real computation — budget analysis, timeline modelling, unit conversions, regulatory cross-checks. Intelligence that delivers actionable output, not just text.',
    points: ['Local Python tool execution (zero external API calls)', 'Budget and cost analysis with live calculations', 'Project timeline and scheduling computation', 'Custom tool registration for domain-specific tasks'],
    flow: ['Intent', '▶', 'Select Tool', '▶', 'Execute', '▶', 'Synthesise'],
    flowHi: [false, false, false, false, true, false, true],
  },
  {
    icon: '👁', color: '#10B981', tag: 'Multi-Modal Vision',
    title: 'Blueprints. Photos. Scans. All Local.',
    body: 'Beyond text. AIDATARIS processes engineering blueprints, site photographs, scanned legal documents, and handwritten notes — all through the vision LLM running entirely within your infrastructure.',
    points: ['Engineering blueprint and CAD drawing analysis', 'Scanned PDF and handwritten document OCR', 'Site photograph interpretation and annotation', 'Table and chart extraction from any document type'],
    flow: ['Image', '▶', 'Vision LLM', '▶', 'Extract', '▶', 'Index'],
    flowHi: [false, false, false, false, true, false, true],
  },
]

function FlowBar({ steps, hi, color }) {
  return (
    <div className="mono" style={{
      display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap',
      padding: '0.7rem 1rem', background: 'var(--term-bg)',
      borderRadius: 8, border: '1px solid rgba(6,182,212,0.08)',
      fontSize: '0.75rem',
    }}>
      {steps.map((s, i) => (
        <span key={i} style={{ color: hi[i] ? color : s === '▶' ? 'var(--t6)' : 'var(--t4)', fontWeight: hi[i] ? 700 : 400 }}>{s}</span>
      ))}
    </div>
  )
}

const fade = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }

export default function Technology() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 800, height: 400, borderRadius: '50%', top: -200, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <span className="label">Platform Technology</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Intelligence Without<br /><span className="gradient-text">Compromise</span>
          </h1>
          <p style={{ color: 'var(--t5)', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Four pillars of sovereign AI processing — each engineered to deliver enterprise-grade intelligence entirely within your own infrastructure.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '2rem 1.5rem 6rem' }}>
        <div className="container">
          {FEATURES.map((f, i) => (
            <motion.div key={f.tag}
              variants={fade} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3.5rem',
                alignItems: 'center',
                padding: '4rem 0',
                borderBottom: '1px solid rgba(6,182,212,0.07)',
              }}
            >
              {/* Text */}
              <div style={{ order: i % 2 === 1 ? 2 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <span style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: f.color + '18', border: `1px solid ${f.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                  }}>{f.icon}</span>
                  <span className="label" style={{ color: f.color, border: `1px solid ${f.color}30`, background: f.color + '0A' }}>{f.tag}</span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 800, color: 'var(--t1)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{f.title}</h2>
                <p style={{ color: 'var(--t5)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{f.body}</p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                  {f.points.map((pt, pi) => (
                    <li key={pi} style={{ display: 'flex', gap: '0.5rem', color: 'var(--t3)', fontSize: '0.875rem', alignItems: 'flex-start' }}>
                      <span style={{ color: f.color, flexShrink: 0, marginTop: 1 }}>▸</span> {pt}
                    </li>
                  ))}
                </ul>

                <FlowBar steps={f.flow} hi={f.flowHi} color={f.color} />
              </div>

              {/* Visual card */}
              <div style={{ order: i % 2 === 1 ? 1 : 2 }}>
                <div className="glass" style={{ padding: '2rem', border: `1px solid ${f.color}1A` }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: f.color + '15', border: `2px solid ${f.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', marginBottom: '1.5rem',
                    boxShadow: `0 0 30px ${f.color}20`,
                  }}>{f.icon}</div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.7rem', marginBottom: '0.4rem', letterSpacing: '0.1em' }}>PROCESSING PIPELINE</div>
                    <FlowBar steps={f.flow} hi={f.flowHi} color={f.color} />
                  </div>

                  <div style={{
                    padding: '0.75rem 1rem',
                    background: f.color + '08',
                    border: `1px solid ${f.color}1A`,
                    borderRadius: 8,
                  }}>
                    <div className="mono" style={{ fontSize: '0.7rem', color: f.color + 'CC', letterSpacing: '0.08em' }}>
                      INFERENCE: LOCAL  ·  API_CALLS: 0  ·  EGRESS: NONE
                    </div>
                  </div>

                  {/* Pulse indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                    <div style={{ position: 'relative', width: 12, height: 12 }}>
                      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: f.color, animation: 'pulse-ring 2s ease-out infinite' }} />
                      <div style={{ position: 'absolute', inset: 2, borderRadius: '50%', background: f.color }} />
                    </div>
                    <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--t4)' }}>MODULE ACTIVE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="label">Next Step</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0', letterSpacing: '-0.02em' }}>
            See the Security Architecture
          </h2>
          <p style={{ color: 'var(--t5)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Every byte stays within your perimeter. Explore our privacy and compliance engine.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/security" className="btn-primary">Security & Compliance →</Link>
            <Link to="/company" className="btn-ghost">Book a Demo</Link>
          </div>
        </div>
      </section>

      <style>{`@media (max-width: 768px) { .tech-grid > div { order: unset !important; } }`}</style>
    </main>
  )
}
