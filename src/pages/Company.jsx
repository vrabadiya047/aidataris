import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const VALUES = [
  { icon: '🛡', c: '#06B6D4', t: 'Sovereignty First',   d: 'We believe organisations have the right to own and control their intelligence — not lease it from a cloud provider.' },
  { icon: '🔬', c: '#8B5CF6', t: 'Engineer-Led',        d: 'Every feature is designed by engineers who understand the real demands of mining sites, government agencies, and legal practices.' },
  { icon: '🌏', c: '#F59E0B', t: 'Western Australian',  d: 'Founded in Perth. Built for WA\'s unique challenges — remote sites, strict sovereignty laws, and a regulatory environment that demands auditability.' },
  { icon: '🔒', c: '#10B981', t: 'Privacy by Default',  d: 'PII redaction is not a feature you turn on — it\'s the default state. Data protection is never an afterthought at AIDATARIS.' },
]

const inputStyle = {
  width: '100%', background: 'var(--input-bg)',
  border: '1px solid rgba(6,182,212,0.15)', borderRadius: 10,
  padding: '0.8rem 1rem', color: 'var(--t1)', fontSize: '0.9rem',
  outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}

const FORMSPREE = 'https://formspree.io/f/mojrazpn'

export default function Company() {
  const [form, setForm] = useState({ name: '', email: '', org: '', sector: '', msg: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, formSource: 'Demo Request — Company Page' }),
      })
      if (res.ok) { setDone(true) } else { setError('Something went wrong. Please try again or email us directly.') }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>
      <Helmet>
        <title>About AIDATARIS | Sovereign AI Company — Perth, Western Australia</title>
        <meta name="description" content="AIDATARIS is a Perth-based enterprise AI company building sovereign, on-premises RAG platforms for Australian mining, government, and legal sectors. Data sovereignty is not optional." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span className="label">About AIDATARIS</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Engineering the Future<br />of <span className="gradient-text">Secure Intelligence</span>
          </h1>
          <p style={{ color: 'var(--t5)', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Perth-based. Enterprise-focused. Uncompromisingly sovereign. We build AI that your organisation controls — not the cloud.
          </p>
        </div>
      </section>

      {/* About + Values */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="label">Our Mission</span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0', letterSpacing: '-0.02em' }}>
                Intelligence Without Compromise
              </h2>
              {['AIDATARIS was founded with a single belief: that enterprise organisations should never have to choose between powerful AI and data sovereignty.',
                'Based in Perth, Western Australia, we serve the sectors that cannot afford data breaches — mining, government, legal, and healthcare.',
                'Our platform runs entirely within your infrastructure. We never see your data. We never want to.'
              ].map((p, i) => (
                <p key={i} style={{ color: 'var(--t5)', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.95rem' }}>{p}</p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            >
              {VALUES.map((v, i) => (
                <div key={i} className="glass" style={{ padding: '1.5rem', border: `1px solid ${v.c}18` }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: v.c + '18', border: `1px solid ${v.c}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', marginBottom: '0.75rem',
                  }}>{v.icon}</div>
                  <div style={{ color: v.c, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{v.t}</div>
                  <div style={{ color: 'var(--t5)', fontSize: '0.78rem', lineHeight: 1.6 }}>{v.d}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location strip */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '3rem' }} />
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { icon: '📍', l: 'Location', v: 'Perth, Western Australia' },
            { icon: '✉',  l: 'Email',    v: 'support@aidataris.com.au' },
            { icon: '🌐', l: 'Focus',    v: 'Enterprise · Government · Mining' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div className="mono" style={{ color: 'var(--t4)', fontSize: '0.65rem', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>{item.l.toUpperCase()}</div>
              <div style={{ color: 'var(--t3)', fontSize: '0.9rem' }}>{item.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
            <span className="label">Founder</span>
            <div style={{ flex: 1, height: 1, background: 'var(--divider-c)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 900, color: 'var(--t1)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.75rem' }}>
                Sovereign AI Expertise,<br />
                <span className="gradient-text">Built for High-Security Environments.</span>
              </h2>
              <p style={{ color: 'var(--t5)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.1rem' }}>
                AIDATARIS was built for one specific challenge: deploying enterprise AI in environments where data sovereignty is non-negotiable. Mining operations, government agencies, and critical infrastructure organisations cannot afford the compliance risks that come with cloud AI — and they shouldn't have to.
              </p>
              <p style={{ color: 'var(--t5)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.1rem' }}>
                Our team brings experience from the German Aerospace Center (DLR) and CTI Consulting — environments where security, auditability, and zero-failure tolerances are standard. We apply that same engineering discipline to every commercial deployment.
              </p>
              <p style={{ color: 'var(--t5)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '2.25rem' }}>
                We don't sell software licences. We solve high-stakes, high-cost problems for organisations that cannot afford to get this wrong — then stand behind the result with ongoing support.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Ollama', 'Qdrant', 'Neo4j', 'FastAPI', 'Python', 'PyTorch'].map(t => (
                  <span key={t} className="mono" style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', background: 'rgba(6,182,212,0.05)' }}>{t}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Demo Request Form */}
      <section id="demo" className="section">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label">Get Started</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.02em' }}>
              Request a <span className="gradient-text-amber">Private Demo</span>
            </h2>
            <p style={{ color: 'var(--t5)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
              Our team will tailor a demo to your organisation&apos;s sector and security requirements. No generic walkthroughs.
            </p>
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass"
              style={{ padding: '3.5rem', textAlign: 'center', border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}
            >
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#10B98118', border: '1px solid #10B98135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1.25rem' }}>✓</div>
              <h3 style={{ color: '#10B981', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Request Received</h3>
              <p style={{ color: 'var(--t5)', lineHeight: 1.7 }}>
                Our team will be in touch within 1 business day to schedule your private demo. Welcome to sovereign AI.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="glass"
              style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { k: 'name',  l: 'Full Name',   p: 'James Thornton',          t: 'text' },
                  { k: 'email', l: 'Work Email',   p: 'j.t@company.com.au',      t: 'email' },
                  { k: 'org',   l: 'Organisation', p: 'Rio Tinto Ltd',            t: 'text' },
                ].map(f => (
                  <div key={f.k}>
                    <label style={{ display: 'block', color: 'var(--t4)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, Courier New, monospace' }}>
                      {f.l.toUpperCase()} *
                    </label>
                    <input required type={f.t} value={form[f.k]} onChange={set(f.k)} placeholder={f.p}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'var(--input-bd)'}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--t4)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, Courier New, monospace' }}>
                  SECTOR *
                </label>
                <select required value={form.sector} onChange={set('sector')}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--input-bd)'}
                >
                  <option value="">Select your sector...</option>
                  {['Mining & Energy', 'WA Government', 'Legal', 'Healthcare', 'Defence', 'Finance', 'Other'].map(s => (
                    <option key={s} value={s} style={{ background: 'var(--bg)' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--t4)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, Courier New, monospace' }}>
                  WHAT ARE YOU TRYING TO SOLVE?
                </label>
                <textarea
                  rows={4} value={form.msg} onChange={set('msg')}
                  placeholder="Describe your use case, current pain points, or questions about AIDATARIS..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--input-bd)'}
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '0.75rem 1rem', color: '#F87171', fontSize: '0.82rem' }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <button type="submit" disabled={loading} className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Sending…' : 'Request Private Demo →'}
                </button>
                <p className="mono" style={{ color: 'var(--t4)', fontSize: '0.7rem' }}>
                  Your data is stored on our systems only. Never shared.
                </p>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </main>
  )
}
