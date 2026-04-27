import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const TECH_FEATURES = [
  {
    id: 'self-rag',
    icon: '🔄',
    accent: '#06B6D4',
    label: 'Self-Correcting RAG',
    title: 'Zero Hallucinations, Guaranteed',
    desc: 'AIDATARIS employs a Self-RAG architecture with a built-in "Critic" loop that verifies context relevance before every answer. If the retrieved context does not justify a response, the system refuses to answer — ensuring no fabricated output ever reaches your users.',
    points: [
      'Critic model evaluates retrieval quality before answering',
      'Automatic re-query when context score is insufficient',
      'Confidence scores attached to every response',
      'Full explainability: source documents always cited',
    ],
    flow: ['Query', '→', 'Retrieve', '→', 'Critic', '→', 'Answer'],
    flowColors: ['#94A3B8', '#334155', '#94A3B8', '#334155', '#F59E0B', '#334155', '#06B6D4'],
  },
  {
    id: 'graphrag',
    icon: '🕸',
    accent: '#F59E0B',
    label: 'GraphRAG',
    title: 'Map Every Relationship in Your Data',
    desc: 'Standard RAG finds relevant paragraphs. GraphRAG finds connections. Our knowledge graph engine maps complex relationships between technical entities, materials, personnel, regulations, and projects — enabling multi-hop reasoning across your entire document corpus.',
    points: [
      'Entity extraction from unstructured documents',
      'Relationship graphs for personnel, assets & regulations',
      'Multi-hop queries across disparate data sources',
      'Ideal for complex engineering and legal document sets',
    ],
    flow: ['Document', '→', 'Entities', '→', 'Graph', '→', 'Reasoning'],
    flowColors: ['#94A3B8', '#334155', '#94A3B8', '#334155', '#F59E0B', '#334155', '#06B6D4'],
  },
  {
    id: 'agentic',
    icon: '⚙',
    accent: '#8B5CF6',
    label: 'Agentic Tool Calling',
    title: 'AI That Takes Action, Not Just Answers',
    desc: 'AIDATARIS agents can invoke local Python tools to perform real computation — budgeting calculations, timeline analysis, unit conversions, regulatory checks. The AI doesn\'t just retrieve information; it processes it to deliver actionable insights.',
    points: [
      'Local Python tool execution (no external API calls)',
      'Budget and cost analysis with real-time calculations',
      'Project timeline modelling and scheduling tools',
      'Custom tool registration for domain-specific tasks',
    ],
    flow: ['Intent', '→', 'Tool Select', '→', 'Execute', '→', 'Synthesise'],
    flowColors: ['#94A3B8', '#334155', '#94A3B8', '#334155', '#8B5CF6', '#334155', '#06B6D4'],
  },
  {
    id: 'vision',
    icon: '👁',
    accent: '#10B981',
    label: 'Multi-Modal Vision',
    title: 'Read Blueprints, Photos & Scanned Documents',
    desc: 'AIDATARIS processes more than text. The multi-modal vision engine analyses engineering blueprints, site photographs, scanned legal documents, and technical drawings — all processed locally with no image data leaving your infrastructure.',
    points: [
      'Engineering blueprint and CAD drawing analysis',
      'Scanned PDF and handwritten document OCR',
      'Site photograph interpretation and annotation',
      'Table and chart data extraction from documents',
    ],
    flow: ['Image', '→', 'Vision LLM', '→', 'Extract', '→', 'Index'],
    flowColors: ['#94A3B8', '#334155', '#94A3B8', '#334155', '#10B981', '#334155', '#06B6D4'],
  },
]

function FlowDiagram({ steps, colors }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      flexWrap: 'wrap', padding: '0.75rem 1rem',
      background: '#0A0A0A', borderRadius: 8, border: '1px solid #1E293B',
      fontFamily: 'Courier New, monospace', fontSize: '0.8rem',
    }}>
      {steps.map((step, i) => (
        <span key={i} style={{ color: colors[i] || '#94A3B8', fontWeight: step !== '→' ? 700 : 400 }}>
          {step}
        </span>
      ))}
    </div>
  )
}

export default function Technology() {
  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <section className="page-hero grid-bg">
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="section-label">Platform Technology</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#F8FAFC', margin: '1rem 0' }}>
            Intelligence Without Compromise
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Four pillars of sovereign AI processing — each engineered to deliver enterprise-grade intelligence
            entirely within your own infrastructure.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        {TECH_FEATURES.map((feature, i) => (
          <motion.div key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
              gap: '3rem',
              alignItems: 'center',
              padding: '3.5rem 0',
              borderBottom: '1px solid #1E293B',
            }}
            className={`tech-row ${i % 2 === 1 ? 'reverse' : ''}`}
          >
            {/* Text side */}
            <div style={{ order: i % 2 === 1 ? 2 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: feature.accent + '20',
                  border: `1px solid ${feature.accent}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', flexShrink: 0,
                }}>
                  {feature.icon}
                </span>
                <span className="section-label" style={{ color: feature.accent }}>{feature.label}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontWeight: 800, color: '#F8FAFC', marginBottom: '1rem' }}>
                {feature.title}
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '1.5rem' }}>{feature.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {feature.points.map((pt, pi) => (
                  <li key={pi} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#CBD5E1', fontSize: '0.9rem' }}>
                    <span style={{ color: feature.accent, flexShrink: 0, marginTop: 2 }}>▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual side */}
            <div style={{ order: i % 2 === 1 ? 1 : 2 }}>
              <div style={{
                background: '#0D1117',
                border: `1px solid ${feature.accent}33`,
                borderRadius: 16,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: feature.accent + '15',
                  border: `2px solid ${feature.accent}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                }}>
                  {feature.icon}
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    PROCESSING PIPELINE
                  </div>
                  <FlowDiagram steps={feature.flow} colors={feature.flowColors} />
                </div>
                <div style={{
                  padding: '0.75rem', background: feature.accent + '0A',
                  border: `1px solid ${feature.accent}22`, borderRadius: 8,
                }}>
                  <div style={{ fontFamily: 'Courier New, monospace', fontSize: '0.75rem', color: feature.accent }}>
                    INFERENCE: LOCAL · API_CALLS: 0 · DATA_EGRESS: NONE
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: '#0D1117', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="section-label">Explore More</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', margin: '1rem 0' }}>
            See the Security Architecture
          </h2>
          <p style={{ color: '#64748B', marginBottom: '2rem' }}>
            Every byte of data stays within your perimeter. Learn how our privacy and compliance engine protects your organisation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/security" className="btn-primary">Security & Compliance</Link>
            <Link to="/company" className="btn-secondary">Book a Demo</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .tech-row { grid-template-columns: 1fr !important; }
          .tech-row > div { order: unset !important; }
        }
      `}</style>
    </main>
  )
}
