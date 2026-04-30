import { useState } from 'react'
import { motion } from 'framer-motion'

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

export default function Company() {
  const [form, setForm] = useState({ name: '', email: '', org: '', sector: '', msg: '' })
  const [done, setDone] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>

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
            { icon: '✉',  l: 'Email',    v: 'contact@aidataris.com.au' },
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
              onSubmit={e => { e.preventDefault(); setDone(true) }}
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem' }}>
                  Request Private Demo →
                </button>
                <p className="mono" style={{ color: 'var(--t4)', fontSize: '0.7rem' }}>
                  Your data is stored on your systems only. Never shared.
                </p>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </main>
  )
}
