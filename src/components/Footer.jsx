import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from './Logo'

const FORMSPREE = 'https://formspree.io/f/mojrazpn'

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(6,182,212,0.15)', borderRadius: 8,
  padding: '0.65rem 0.85rem', color: '#E5E7EB', fontSize: '0.83rem',
  outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}

const INDUSTRIES = ['Mining & Energy', 'WA Government', 'Legal', 'Healthcare', 'Defence', 'Finance', 'Other']

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', industry: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, formSource: 'Footer Lead Capture' }),
      })
      if (res.ok) setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer style={{ background: '#020914', borderTop: '1px solid rgba(6,182,212,0.1)' }}>

      {/* Lead capture strip */}
      <div style={{ borderBottom: '1px solid rgba(6,182,212,0.08)', padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="label" style={{ marginBottom: '1rem', display: 'inline-block' }}>Stay Informed</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 900, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                Get sovereign AI insights<br />
                <span style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  direct to your inbox.
                </span>
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Case studies, compliance updates, and product news for Australian enterprise. No spam. Unsubscribe any time.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { icon: '📍', text: 'Perth, Western Australia' },
                  { icon: '✉',  text: 'support@aidataris.com.au' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {done ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '2rem', borderRadius: 14, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>✓</div>
                <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>You're on the list</div>
                <div style={{ color: '#64748B', fontSize: '0.8rem' }}>We'll be in touch with relevant insights for your sector.</div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#475569', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>NAME *</label>
                    <input required type="text" value={form.name} onChange={set('name')} placeholder="James Thornton"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.15)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#475569', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>WORK EMAIL *</label>
                    <input required type="email" value={form.email} onChange={set('email')} placeholder="j.t@company.com.au"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.15)'}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#475569', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>INDUSTRY *</label>
                  <select required value={form.industry} onChange={set('industry')}
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', background: 'rgba(255,255,255,0.05)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.15)'}
                  >
                    <option value="" style={{ background: '#020914' }}>Select your industry...</option>
                    {INDUSTRIES.map(ind => <option key={ind} value={ind} style={{ background: '#020914' }}>{ind}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #06B6D4, #2563EB)', color: '#fff',
                    fontWeight: 700, fontSize: '0.85rem', opacity: loading ? 0.7 : 1,
                    fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s',
                  }}>
                  {loading ? 'Sending…' : 'Get Sovereign AI Insights →'}
                </button>
                <p style={{ color: '#334155', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>
                  No spam. No cloud. Your email stays with us only.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <Logo size={28} />
                <span style={{ color: '#F1F5F9', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.08em' }}>AIDATARIS</span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7 }}>
                Enterprise Sovereign AI.<br />Perth, Western Australia.<br />Intelligence without the cloud.
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {['Qdrant', 'Neo4j', 'Ollama'].map(t => (
                  <span key={t} className="mono" style={{ fontSize: '0.6rem', padding: '2px 7px', borderRadius: 4, background: 'rgba(6,182,212,0.08)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.15)' }}>{t}</span>
                ))}
              </div>
            </div>

            {[
              { h: 'Platform',  links: [['Technology', '/technology'], ['Security & Compliance', '/security'], ['Admin Console', '/admin']] },
              { h: 'Solutions', links: [['Mining & Energy', '/solutions'], ['WA Government', '/solutions'], ['Legal & Health', '/solutions']] },
              { h: 'Company',   links: [['About', '/company'], ['Careers', '/careers'], ['Contact Us', '/contact'], ['Request Demo', '/contact']] },
            ].map(col => (
              <div key={col.h}>
                <h4 className="mono" style={{ color: '#06B6D4', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                  {col.h.toUpperCase()}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {col.links.map(([l, to]) => (
                    <Link key={l} to={to}
                      style={{ color: '#475569', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#06B6D4'}
                      onMouseLeave={e => e.target.style.color = '#475569'}
                    >{l}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid rgba(6,182,212,0.08)', paddingTop: '1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <p style={{ color: '#334155', fontSize: '0.78rem' }}>
              © 2025 AIDATARIS Pty Ltd · Perth, WA, Australia
            </p>
            <span className="mono" style={{ color: '#1E293B', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              INFERENCE:LOCAL · EGRESS:NONE · CLOUD:NEVER
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
