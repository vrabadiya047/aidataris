import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const INQUIRY_TYPES = [
  { id: 'demo',        icon: '🖥',  label: 'Book a Demo',          color: '#06B6D4', desc: 'See AIDATARIS deployed live in a private walkthrough.' },
  { id: 'technical',  icon: '⚙',  label: 'Technical Inquiry',    color: '#8B5CF6', desc: 'Architecture questions, integration planning, security reviews.' },
  { id: 'commercial', icon: '📋', label: 'Commercial / Pricing',  color: '#F59E0B', desc: 'Licensing, enterprise agreements, deployment scoping.' },
  { id: 'other',      icon: '✉',  label: 'General Enquiry',      color: '#10B981', desc: 'Anything else — we read every message.' },
]

const SECTORS = ['Mining & Energy', 'WA Government', 'Legal', 'Healthcare', 'Defence', 'Finance', 'Other']

const inputStyle = {
  width: '100%', background: 'var(--input-bg)',
  border: '1px solid var(--input-bd)', borderRadius: 10,
  padding: '0.85rem 1rem', color: 'var(--t1)', fontSize: '0.9rem',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block', color: 'var(--t4)', fontSize: '0.7rem',
  fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.5rem',
  fontFamily: 'JetBrains Mono, monospace',
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function Contact() {
  const [inquiry, setInquiry] = useState('demo')
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
      const res = await fetch(`${window.location.origin}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, inquiryType: INQUIRY_TYPES.find(t => t.id === inquiry)?.label }),
      })
      const j = await res.json()
      if (res.ok) { setDone(true) } else { setError(j.error || 'Something went wrong. Please email support@aidataris.com.au directly.') }
    } catch {
      setError('Network error. Please email support@aidataris.com.au directly.')
    } finally {
      setLoading(false)
    }
  }

  const focus = e => { e.target.style.borderColor = 'rgba(6,182,212,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.08)' }
  const blur  = e => { e.target.style.borderColor = 'var(--input-bd)'; e.target.style.boxShadow = 'none' }

  const activeInquiry = INQUIRY_TYPES.find(t => t.id === inquiry)

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>
      <Helmet>
        <title>Contact Us | AIDATARIS — Book an On-Premises AI Demo</title>
        <meta name="description" content="Get in touch with AIDATARIS to book a private on-premises demo, ask technical questions, or discuss enterprise licensing. Perth-based team, response within 1 business day." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <span className="label">Get in Touch</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Talk to a Sovereign AI<br /><span className="gradient-text">Expert Today</span>
          </h1>
          <p style={{ color: 'var(--t4)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            No sales scripts. No generic demos. Tell us what you&apos;re trying to solve and we&apos;ll tailor every conversation to your sector and security requirements.
          </p>
        </div>
      </section>

      {/* Response promise strip */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid rgba(6,182,212,0.08)', borderBottom: '1px solid rgba(6,182,212,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem 3rem', padding: '1rem 1.5rem' }}>
          {[
            { icon: '⚡', text: 'Response within 1 business day' },
            { icon: '🔒', text: 'NDA available on request' },
            { icon: '📍', text: 'Perth, Western Australia' },
          ].map((item, i) => (
            <div key={i} className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--t4)', fontWeight: 600, letterSpacing: '0.06em' }}>
              <span>{item.icon}</span> {item.text.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>

            {/* Left: info + channels */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="label">Direct Channels</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.9rem)', fontWeight: 900, color: 'var(--t1)', margin: '1rem 0 1.5rem', letterSpacing: '-0.02em' }}>
                Reach the Right Person,<br />First Time.
              </h2>

              {/* Contact cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                {[
                  { icon: '✉',  label: 'Email Us',      value: 'support@aidataris.com.au',          color: '#06B6D4', href: 'mailto:support@aidataris.com.au' },
                  { icon: '📞', label: 'Call Us',        value: '+61 406 377 710',                   color: '#8B5CF6', href: 'tel:+61406377710' },
                  { icon: '📍', label: 'Headquarters',  value: '25 Guthrie St, Osborne Park WA 6017', color: '#10B981', href: null },
                ].map((c, i) => (
                  <motion.a
                    key={i}
                    href={c.href || undefined}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="glass"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1.1rem 1.25rem', textDecoration: 'none',
                      border: `1px solid ${c.color}18`,
                      cursor: c.href ? 'pointer' : 'default',
                      transition: 'border-color 0.2s, transform 0.2s',
                    }}
                    whileHover={c.href ? { x: 4, borderColor: c.color + '45' } : {}}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: c.color + '15', border: `1px solid ${c.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                    }}>{c.icon}</div>
                    <div>
                      <div className="mono" style={{ fontSize: '0.63rem', color: 'var(--t5)', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{c.label.toUpperCase()}</div>
                      <div style={{ color: c.href ? c.color : 'var(--t3)', fontSize: '0.875rem', fontWeight: 600 }}>{c.value}</div>
                    </div>
                    {c.href && <div style={{ marginLeft: 'auto', color: c.color, fontSize: '0.9rem', opacity: 0.6 }}>→</div>}
                  </motion.a>
                ))}
              </div>

              {/* What to expect */}
              <div className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(6,182,212,0.12)' }}>
                <div className="mono" style={{ color: '#06B6D4', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem' }}>WHAT TO EXPECT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { step: '01', text: 'We respond within 1 business day with a tailored introduction.' },
                    { step: '02', text: 'A 30-minute discovery call to understand your sector and security requirements.' },
                    { step: '03', text: 'A private demo using documentation representative of your organisation.' },
                    { step: '04', text: 'A deployment proposal scoped to your infrastructure and compliance needs.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                      <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#06B6D4', flexShrink: 0, marginTop: 2 }}>{s.step}</span>
                      <span style={{ color: 'var(--t4)', fontSize: '0.83rem', lineHeight: 1.6 }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass"
                    style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.04)' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                      style={{ width: 64, height: 64, borderRadius: '50%', background: '#10B98115', border: '1px solid #10B98135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.5rem' }}
                    >✓</motion.div>
                    <h3 style={{ color: '#10B981', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Message Received</h3>
                    <p style={{ color: 'var(--t4)', lineHeight: 1.75, maxWidth: 360, margin: '0 auto 1.5rem' }}>
                      Our team will review your enquiry and respond within 1 business day. We look forward to speaking with you.
                    </p>
                    <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--t5)', letterSpacing: '0.08em' }}>AIDATARIS · PERTH, WESTERN AUSTRALIA</div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Inquiry type selector */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={labelStyle}>ENQUIRY TYPE</div>
                      <motion.div variants={stagger} initial="hidden" animate="show"
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        {INQUIRY_TYPES.map(t => (
                          <motion.button key={t.id} variants={fade}
                            onClick={() => setInquiry(t.id)}
                            style={{
                              padding: '0.85rem 1rem', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                              background: inquiry === t.id ? t.color + '12' : 'var(--glass-bg)',
                              border: `1px solid ${inquiry === t.id ? t.color + '50' : 'var(--glass-bd)'}`,
                              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            <div style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{t.icon}</div>
                            <div style={{ color: inquiry === t.id ? t.color : 'var(--t2)', fontWeight: 700, fontSize: '0.8rem' }}>{t.label}</div>
                            <div style={{ color: 'var(--t5)', fontSize: '0.7rem', lineHeight: 1.4, marginTop: '0.2rem' }}>{t.desc}</div>
                          </motion.button>
                        ))}
                      </motion.div>
                    </div>

                    {/* Form fields */}
                    <form onSubmit={handleSubmit}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Field label="FULL NAME *">
                          <input required type="text" value={form.name} onChange={set('name')}
                            placeholder="James Thornton" style={inputStyle} onFocus={focus} onBlur={blur} />
                        </Field>
                        <Field label="WORK EMAIL *">
                          <input required type="email" value={form.email} onChange={set('email')}
                            placeholder="j.t@company.com.au" style={inputStyle} onFocus={focus} onBlur={blur} />
                        </Field>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Field label="ORGANISATION *">
                          <input required type="text" value={form.org} onChange={set('org')}
                            placeholder="Rio Tinto Ltd" style={inputStyle} onFocus={focus} onBlur={blur} />
                        </Field>
                        <Field label="SECTOR *">
                          <select required value={form.sector} onChange={set('sector')}
                            style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} onFocus={focus} onBlur={blur}>
                            <option value="">Select sector...</option>
                            {SECTORS.map(s => <option key={s} value={s} style={{ background: 'var(--bg)' }}>{s}</option>)}
                          </select>
                        </Field>
                      </div>

                      <Field label={`MESSAGE${activeInquiry ? ' — ' + activeInquiry.label.toUpperCase() : ''}`}>
                        <textarea rows={5} value={form.msg} onChange={set('msg')}
                          placeholder={
                            inquiry === 'demo'       ? "Describe your use case, document types, user count, and any specific compliance requirements..." :
                            inquiry === 'technical'  ? "Detail your infrastructure environment, integration requirements, or architecture questions..." :
                            inquiry === 'commercial' ? "Tell us about your organisation size, expected user count, and deployment timeline..." :
                            "Tell us what's on your mind..."
                          }
                          style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
                      </Field>

                      {error && (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '0.75rem 1rem', color: '#F87171', fontSize: '0.82rem' }}>
                          {error}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.25rem' }}>
                        <button type="submit" disabled={loading} className="btn-primary"
                          style={{ fontSize: '0.95rem', padding: '0.875rem 2rem', background: activeInquiry?.color === '#06B6D4' ? undefined : activeInquiry?.color, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                          {loading ? 'Sending…' : 'Send Enquiry →'}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                          <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>YOUR DATA STAYS ON OUR SERVERS ONLY</span>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom trust strip */}
      <section style={{ padding: '3rem 1.5rem 5rem', background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '3rem' }} />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {[
              { icon: '⏱', stat: '< 1 Day',   label: 'Response Time',        color: '#06B6D4' },
              { icon: '🔒', stat: 'NDA Ready', label: 'On Request',            color: '#8B5CF6' },
              { icon: '🌏', stat: 'Perth WA',  label: 'Australian-Owned',      color: '#F59E0B' },
              { icon: '🛡', stat: '0 Bytes',   label: 'Data Shared With Us',   color: '#10B981' },
            ].map((item, i) => (
              <motion.div key={i} className="glass" style={{ padding: '1.5rem', border: `1px solid ${item.color}15` }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div className="mono" style={{ color: item.color, fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.stat}</div>
                <div style={{ color: 'var(--t5)', fontSize: '0.78rem' }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
