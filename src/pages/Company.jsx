import { useState } from 'react'
import { motion } from 'framer-motion'

const VALUES = [
  { icon: '🛡', title: 'Sovereignty First',    desc: 'We built AIDATARIS because we believe organisations have the right to own and control their intelligence — not lease it from a cloud provider.' },
  { icon: '🔬', title: 'Engineer-Led',         desc: 'Every feature is designed by engineers who understand the real operational demands of mining sites, government agencies, and legal practices.' },
  { icon: '🌏', title: 'Western Australian',   desc: 'Founded in Perth, built for WA\'s unique challenges — remote sites, strict data sovereignty laws, and a regulatory environment that demands auditability.' },
  { icon: '🔒', title: 'Privacy by Default',   desc: 'PII redaction is not a feature you turn on — it\'s the default state. Data protection is never an afterthought at AIDATARIS.' },
]

const TEAM = [
  { name: 'Vijay Rabadiya',  role: 'Founder & CEO',         initials: 'VR', color: '#06B6D4' },
  { name: 'Engineering Team', role: 'AI & Platform',         initials: 'ET', color: '#F59E0B' },
  { name: 'Security Team',   role: 'Privacy & Compliance',  initials: 'ST', color: '#8B5CF6' },
]

export default function Company() {
  const [form, setForm] = useState({ name: '', email: '', org: '', sector: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <section className="page-hero grid-bg">
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="section-label">About AIDATARIS</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#F8FAFC', margin: '1rem 0' }}>
            Engineering the Future of Secure Intelligence
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Perth-based. Enterprise-focused. Uncompromisingly sovereign. We build AI that your organisation controls — not the cloud.
          </p>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">Our Mission</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 1rem' }}>
                Intelligence Without Compromise
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '1rem' }}>
                AIDATARIS was founded with a single belief: that enterprise organisations should never have to choose between powerful AI and data sovereignty. The two are not mutually exclusive.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '1rem' }}>
                Based in Perth, Western Australia, we serve the sectors that cannot afford data breaches — mining operations, government agencies, legal practices, and healthcare providers.
              </p>
              <p style={{ color: '#94A3B8', lineHeight: 1.7 }}>
                Our platform runs entirely within your infrastructure. We never see your data. We never want to.
              </p>
            </div>

            {/* Values */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {VALUES.map((v, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: '#0D1117', border: '1px solid #1E293B',
                    borderRadius: 10, padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{v.icon}</div>
                  <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{v.title}</div>
                  <div style={{ color: '#64748B', fontSize: '0.8rem', lineHeight: 1.5 }}>{v.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '4rem 1.5rem', background: '#0D1117', borderTop: '1px solid #1E293B', borderBottom: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <span className="section-label">The Team</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 2.5rem' }}>
            Built by Engineers, for Engineers
          </h2>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {TEAM.map((member, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: member.color + '20',
                  border: `2px solid ${member.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  fontSize: '1.1rem', fontWeight: 800, color: member.color,
                }}>
                  {member.initials}
                </div>
                <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.95rem' }}>{member.name}</div>
                <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.25rem' }}>{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section id="demo" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Get Started</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0' }}>
              Request a Private Demo
            </h2>
            <p style={{ color: '#64748B', lineHeight: 1.7 }}>
              Our team will tailor a demo to your organisation&apos;s specific sector and security requirements. No generic walkthroughs — just what matters to you.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: '#0D2818', border: '1px solid #10B98144',
                borderRadius: 16, padding: '3rem', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ color: '#10B981', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                Request Received
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>
                Our team will be in touch within 1 business day to schedule your private demo. Welcome to sovereign AI.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              background: '#0D1117', border: '1px solid #1E293B',
              borderRadius: 16, padding: '2.5rem',
              display: 'flex', flexDirection: 'column', gap: '1.25rem',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    FULL NAME *
                  </label>
                  <input
                    required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="James Thornton"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    WORK EMAIL *
                  </label>
                  <input
                    required type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="j.thornton@company.com.au"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    ORGANISATION *
                  </label>
                  <input
                    required value={form.org}
                    onChange={e => setForm({ ...form, org: e.target.value })}
                    placeholder="Rio Tinto Ltd"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    SECTOR *
                  </label>
                  <select
                    required value={form.sector}
                    onChange={e => setForm({ ...form, sector: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Select sector...</option>
                    <option>Mining & Energy</option>
                    <option>WA Government</option>
                    <option>Legal</option>
                    <option>Healthcare</option>
                    <option>Defence</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  WHAT ARE YOU TRYING TO SOLVE?
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  placeholder="Describe your use case, current pain points, or questions about AIDATARIS..."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Request Private Demo →
              </button>

              <p style={{ color: '#334155', fontSize: '0.75rem' }}>
                Your information is stored on our systems only. We will never share your details with third parties.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: '4rem 1.5rem', background: '#0D1117', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '📍', label: 'Location', value: 'Perth, Western Australia' },
            { icon: '✉', label: 'Email', value: 'contact@aidataris.com.au' },
            { icon: '🌐', label: 'Focus', value: 'Enterprise · Government · Mining' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{item.label.toUpperCase()}</div>
              <div style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

const inputStyle = {
  width: '100%',
  background: '#0A0A0A',
  border: '1px solid #334155',
  borderRadius: 8,
  padding: '0.75rem 1rem',
  color: '#F8FAFC',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}
