import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const GRAD = { background: 'linear-gradient(135deg, #06B6D4, #38BDF8, #8B5CF6)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 5s ease infinite' }

function EditorialRule({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
      <span className="label">{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
    </div>
  )
}

const CASE_STUDIES = [
  {
    id: 'mining',
    color: '#8B5CF6',
    icon: '⛏',
    industry: 'Mining & Resources',
    location: 'Pilbara, WA',
    tag: 'Case Study · Mining & Resources · Pilbara, WA',
    title: 'Mining Safety Knowledge Base — Pilbara Site',
    headline: 'From 4 Hours of Manual Search to 8-Second AI Queries',
    problem: 'An 800-person Pilbara mining operation held 14,000+ safety documents across disconnected shared drives. Safety officers spent 3–4 hours per day manually retrieving compliance documents. Remote sites had zero reliable internet — cloud AI was not viable.',
    solution: 'Air-gapped AIDATARIS deployed on existing on-premise hardware. 14,000+ documents indexed in 6 hours. Staff now query in plain English from underground and remote stations — no internet required.',
    results: [
      { metric: '94%',   label: 'Reduction in document retrieval time' },
      { metric: '$270K', label: 'Annual value of recovered staff time' },
      { metric: '6 hrs', label: 'From installation to first live query' },
    ],
    impact: 'Safety officers recovered approximately 3 hours per day. The site compliance team eliminated manual cross-referencing across disconnected folders, reducing the risk of referencing outdated procedures.',
    tags: ['Air-Gapped', 'Safety Compliance', 'Document AI', 'Same-Day Deployment'],
    challenge_points: [
      'No reliable internet connectivity at remote Pilbara sites',
      '14,000+ safety documents across disconnected shared drives',
      '3–4 hours daily spent manually retrieving compliance records',
      'Strict legal obligation to reference only current, approved procedures',
    ],
    solution_points: [
      'Full air-gapped deployment on existing on-premise hardware — no new servers required',
      'All 14,000+ documents indexed, structured, and searchable in 6 hours',
      'Natural language queries available from underground and remote stations',
      'Automatic version control — AI only surfaces current approved procedures',
    ],
  },
  {
    id: 'government',
    color: '#06B6D4',
    icon: '🏛',
    industry: 'WA Government',
    location: 'Perth, WA',
    tag: 'Case Study · Government · Perth, WA',
    title: 'Policy Intelligence Platform — WA Government Agency',
    headline: 'Sovereign AI for a 600-Staff Government Agency — 100% Data Residency',
    problem: 'A 600-staff WA Government agency managed 8,000+ policy documents, legislative instruments, and internal procedures. Staff spent significant time cross-referencing legislation and policy — with cloud AI prohibited under data sovereignty requirements.',
    solution: 'AIDATARIS deployed within the agency\'s existing secure network. Policy documents, legislation, and internal procedures indexed and linked via knowledge graph. Staff query across all sources simultaneously with full source attribution.',
    results: [
      { metric: '78%',  label: 'Reduction in policy research time per query' },
      { metric: '0',    label: 'Bytes of data leaving the agency network' },
      { metric: '3 wk', label: 'From scoping call to production deployment' },
    ],
    impact: 'Policy officers moved from multi-hour cross-referencing tasks to minutes. The agency met ASD Essential Eight alignment requirements and established a documented AI governance framework ahead of WA Government mandates.',
    tags: ['100% Data Residency', 'ASD Essential Eight', 'Policy Intelligence', 'Sovereign AI'],
    challenge_points: [
      'Cloud AI prohibited — data sovereignty and residency requirements non-negotiable',
      '8,000+ policy documents, legislative instruments, and procedures to unify',
      'Staff spending hours manually cross-referencing legislation and internal policy',
      'AI governance framework required before deployment could proceed',
    ],
    solution_points: [
      'Deployed entirely within the agency\'s existing secure network — zero cloud dependency',
      'Knowledge graph links legislation, policy, and procedures for multi-hop reasoning',
      'ASD Essential Eight aligned from day one — audit trail and access controls built in',
      'AI governance documentation provided as part of the deployment package',
    ],
  },
  {
    id: 'legal',
    color: '#F59E0B',
    icon: '⚖',
    industry: 'Legal Services',
    location: 'Perth, WA',
    tag: 'Case Study · Legal Services · Perth, WA',
    title: 'Contract Intelligence Platform — Perth Law Firm',
    headline: 'Confidential Document AI with Zero Data Egress for a 120-Lawyer Firm',
    problem: 'A 120-lawyer Perth firm managed 40,000+ contracts, precedents, and matter files across multiple practice areas. Lawyers spent hours searching for relevant precedents and clauses — with strict professional obligations preventing any use of cloud-based AI tools.',
    solution: 'AIDATARIS deployed on the firm\'s existing infrastructure with matter-level access controls. Lawyers query across their own precedents, contracts, and research — fully isolated per practice area. Automatic PII detection prevents client data from appearing in cross-matter searches.',
    results: [
      { metric: '65%',  label: 'Reduction in precedent research time' },
      { metric: '40K+', label: 'Documents indexed and instantly searchable' },
      { metric: '100%', label: 'Client data isolated per matter — by design' },
    ],
    impact: 'Junior lawyers recovered 2+ hours per matter on precedent research. The firm eliminated the compliance risk of cloud AI while giving lawyers access to the entire firm\'s institutional knowledge — searchable in seconds.',
    tags: ['Legal Professional Privilege', 'Privacy Act 1988', 'Matter Isolation', 'Contract AI'],
    challenge_points: [
      'Professional privilege obligations prohibit any data leaving firm infrastructure',
      '40,000+ contracts, precedents, and matter files across multiple practice areas',
      'Hours spent per matter searching for relevant clauses and precedents',
      'Risk of cross-contamination between client matters in any shared system',
    ],
    solution_points: [
      'Deployed on existing firm infrastructure — no new cloud accounts or vendor access',
      'Matter-level access controls enforced at query time — client isolation guaranteed',
      'Automatic PII detection prevents client details from surfacing in cross-matter searches',
      'Full audit trail for every query — complete record of what was accessed and when',
    ],
  },
]

const STATS = [
  { val: '3',   suffix: '',  label: 'Industries Served' },
  { val: '94%', suffix: '',  label: 'Peak retrieval improvement' },
  { val: '0',   suffix: '',  label: 'Bytes leaving client networks' },
  { val: '3wk', suffix: '',  label: 'Average time to production' },
]

export default function CaseStudies() {
  const [active, setActive] = useState(null)

  return (
    <main style={{ background: 'var(--bg)' }}>
      <Helmet>
        <title>Case Studies | AIDATARIS — Sovereign AI Deployments</title>
        <meta name="description" content="Real sovereign AI deployments across mining, government, and legal sectors in Australia. Verified results, on-premise, zero data egress." />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: -300, left: -200, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: -100, right: -100, background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)' }} />
        </div>
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <span className="label">Case Studies</span>
            <div style={{ height: 1, width: 60, background: 'var(--divider-c)' }} />
            <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>Verified Deployments · On-Premise · Zero Cloud</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.5rem', maxWidth: 820, color: 'var(--t1)' }}>
            Real Deployments.{' '}
            <span style={GRAD}>Verified Results.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.6 }}
            style={{ color: 'var(--t3)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.8, maxWidth: 560, marginBottom: '3rem' }}>
            Every case study below is a live deployment running on client infrastructure. No cloud. No data shared. All outcomes independently verified with the client.
          </motion.p>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1px', background: 'var(--bd)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(6,182,212,0.1)', maxWidth: 680 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: 'var(--stat-cell)', padding: '1.75rem 1.5rem', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#06B6D4', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {s.val}{s.suffix}
                </div>
                <div style={{ color: 'var(--t5)', fontSize: '0.72rem', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--bg2)' }}>
        <div className="container">
          <EditorialRule label="All Deployments" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {CASE_STUDIES.map((cs, i) => (
              <motion.div key={cs.id}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ padding: '4rem 0', borderTop: '1px solid var(--bd)' }}>

                {/* Tag row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: cs.color + '18', border: `1px solid ${cs.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{cs.icon}</div>
                  <div className="mono" style={{ color: cs.color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em' }}>{cs.industry.toUpperCase()}</div>
                  <div style={{ height: 1, flex: 1, background: cs.color + '20', minWidth: 20 }} />
                  <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.58rem', letterSpacing: '0.06em' }}>{cs.location}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '5rem', alignItems: 'start' }}>

                  {/* Metrics column */}
                  <div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '2rem' }}>
                      {cs.headline}
                    </h2>
                    {cs.results.map((r, j) => (
                      <motion.div key={j}
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.15 + j * 0.1, duration: 0.5 }}
                        style={{
                          marginBottom: '0.85rem',
                          padding: j === 0 ? '1.25rem 1.5rem' : '0.85rem 1.25rem',
                          borderRadius: j === 0 ? 12 : 8,
                          background: j === 0 ? cs.color + '08' : 'transparent',
                          border: j === 0 ? `1px solid ${cs.color}25` : `1px solid ${cs.color}12`,
                          borderLeft: `3px solid ${cs.color}${j === 0 ? 'CC' : '50'}`,
                        }}>
                        <div style={{ fontSize: j === 0 ? 'clamp(2rem, 4vw, 3.2rem)' : 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, color: cs.color, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                          {r.metric}
                        </div>
                        <div style={{ color: j === 0 ? 'var(--t3)' : 'var(--t4)', fontSize: j === 0 ? '0.85rem' : '0.8rem', lineHeight: 1.5 }}>{r.label}</div>
                      </motion.div>
                    ))}
                    <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', color: '#10B981', fontSize: '0.58rem', fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      ✓ VERIFIED DEPLOYMENT RESULTS
                    </div>
                  </div>

                  {/* Detail column */}
                  <div>
                    <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                      {cs.title}
                    </h3>

                    <div style={{ marginBottom: '1.35rem' }}>
                      <div className="mono" style={{ color: '#F87171', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>THE PROBLEM</div>
                      <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.78 }}>{cs.problem}</p>
                    </div>

                    <div style={{ marginBottom: '1.35rem' }}>
                      <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>OUR SOLUTION</div>
                      <p style={{ color: 'var(--t3)', fontSize: '0.875rem', lineHeight: 1.78 }}>{cs.solution}</p>
                    </div>

                    {/* Expandable detail */}
                    <button
                      onClick={() => setActive(active === cs.id ? null : cs.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="mono" style={{ color: cs.color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                        {active === cs.id ? '▾ HIDE DETAIL' : '▸ VIEW FULL DETAIL'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {active === cs.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: 'hidden' }}>
                          <div style={{ marginBottom: '1.25rem' }}>
                            <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>CHALLENGE BREAKDOWN</div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {cs.challenge_points.map((pt, j) => (
                                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: 'var(--t4)', fontSize: '0.82rem', lineHeight: 1.65 }}>
                                  <span style={{ color: '#F87171', fontSize: '0.7rem', flexShrink: 0, marginTop: '0.2rem' }}>✕</span>
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div style={{ marginBottom: '1.25rem' }}>
                            <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>SOLUTION BREAKDOWN</div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {cs.solution_points.map((pt, j) => (
                                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: 'var(--t4)', fontSize: '0.82rem', lineHeight: 1.65 }}>
                                  <span style={{ color: '#10B981', fontSize: '0.7rem', flexShrink: 0, marginTop: '0.2rem' }}>✓</span>
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div style={{ padding: '1rem 1.25rem', borderRadius: 10, background: cs.color + '07', border: `1px solid ${cs.color}20`, marginBottom: '1rem' }}>
                            <div className="mono" style={{ color: cs.color, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>BUSINESS IMPACT</div>
                            <p style={{ color: 'var(--t3)', fontSize: '0.85rem', lineHeight: 1.72, margin: 0 }}>{cs.impact}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {cs.tags.map(t => (
                        <span key={t} className="mono" style={{ fontSize: '0.6rem', padding: '3px 10px', borderRadius: 4, background: cs.color + '12', color: cs.color, border: `1px solid ${cs.color}28` }}>{t}</span>
                      ))}
                    </div>

                    <Link to="/contact" className="btn-primary" style={{ fontSize: '0.85rem' }}>
                      Discuss a Similar Project →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: '1px solid var(--bd)' }} />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '10rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.1, 0.04] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, #06B6D4 0%, transparent 65%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <span className="label" style={{ marginBottom: '2rem', display: 'inline-block' }}>Start Your Deployment</span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: '1.5rem' }}>
            Your Organisation Could Be<br />
            <span style={GRAD}>Our Next Case Study.</span>
          </h2>
          <p style={{ color: 'var(--t3)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Book a free 30-minute consultation. We'll assess your environment and tell you honestly what a sovereign AI deployment would look like for your organisation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.2rem' }}>
              Request a Consultation →
            </Link>
            <Link to="/book" className="btn-ghost" style={{ fontSize: '1rem', padding: '0.9rem 2.2rem' }}>
              Book Free Call
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
