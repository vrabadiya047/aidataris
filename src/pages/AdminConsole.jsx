import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const METRICS = [
  { v: '1,247', l: 'Queries Today',     t: '+12% vs yesterday', c: '#06B6D4' },
  { v: '38',    l: 'PII Items Blocked', t: 'since midnight',    c: '#F87171' },
  { v: '1.4s',  l: 'Avg Response',      t: 'local inference',   c: '#34D399' },
  { v: '214',   l: 'Active Users',      t: 'online now',        c: '#F59E0B' },
]

const USERS = [
  { n: 'Sarah Mitchell',  r: 'Admin',  d: 'Operations',  s: true,  l: '2 min ago' },
  { n: 'James Thornton',  r: 'Editor', d: 'Engineering', s: true,  l: '14 min ago' },
  { n: 'Priya Nambiar',   r: 'Viewer', d: 'Finance',     s: true,  l: '1 hr ago' },
  { n: 'Daniel Kowalski', r: 'Editor', d: 'Legal',       s: false, l: '3 days ago' },
  { n: 'Emma Faulkner',   r: 'Viewer', d: 'HR',          s: true,  l: '5 min ago' },
]

const ROLE_COLOR = { Admin: '#F87171', Editor: '#F59E0B', Viewer: '#06B6D4' }

const PII_BARS = [
  { t: 'NAME',   n: 1204, p: 31, c: '#38BDF8' },
  { t: 'EMAIL',  n: 876,  p: 22, c: '#34D399' },
  { t: 'PHONE',  n: 654,  p: 17, c: '#A78BFA' },
  { t: 'TFN',    n: 423,  p: 11, c: '#F87171' },
  { t: 'ABN',    n: 312,  p: 8,  c: '#F59E0B' },
  { t: 'CC',     n: 198,  p: 5,  c: '#F472B6' },
  { t: 'OTHER',  n: 246,  p: 6,  c: '#334155' },
]

const PERMS = ['Query', 'Upload', 'Manage Users', 'Sys Config', 'Audit Logs', 'Export']
const ROLES = [
  { r: 'Admin',  c: '#F87171', p: [1, 1, 1, 1, 1, 1] },
  { r: 'Editor', c: '#F59E0B', p: [1, 1, 0, 0, 1, 0] },
  { r: 'Viewer', c: '#06B6D4', p: [1, 0, 0, 0, 0, 0] },
]

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

export default function AdminConsole() {
  return (
    <main style={{ background: '#02060E', minHeight: '100vh', paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span className="label">Enterprise Admin Console</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: '#E2E8F0', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Total Governance.<br /><span className="gradient-text-amber">Total Control.</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Manage 1,000+ users, monitor compliance in real time, and govern every aspect of your Sovereign AI deployment from a single pane of glass.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="section">
        <div className="container">
          <span className="label" style={{ marginBottom: '1.5rem', display: 'block' }}>System Health Dashboard</span>
          <motion.div
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
          >
            {METRICS.map((m, i) => (
              <motion.div key={i} variants={fade} className="glass" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', border: `1px solid ${m.c}18` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.c }} />
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: m.c, marginBottom: '0.25rem' }}>{m.v}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{m.l}</div>
                <div className="mono" style={{ fontSize: '0.68rem', color: '#64748B' }}>{m.t.toUpperCase()}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* User table */}
      <section className="section" style={{ paddingTop: 0, background: '#020913' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="label">User Governance</span>
              <h2 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                Granular Role-Based Access Control
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Object.entries(ROLE_COLOR).map(([r, c]) => (
                <span key={r} className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: c + '18', color: c, border: `1px solid ${c}30` }}>{r}</span>
              ))}
            </div>
          </div>

          <div className="terminal" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '0.75rem 1.5rem', background: '#070F1D', borderBottom: '1px solid rgba(6,182,212,0.08)' }}>
              {['User', 'Role', 'Department', 'Status', 'Last Active'].map(h => (
                <div key={h} className="mono" style={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>{h}</div>
              ))}
            </div>
            {USERS.map((u, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                padding: '0.9rem 1.5rem', alignItems: 'center',
                borderBottom: i < USERS.length - 1 ? '1px solid rgba(6,182,212,0.05)' : 'none',
                transition: 'background 0.15s', cursor: 'default',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.88rem' }}>{u.n}</div>
                <div>
                  <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: ROLE_COLOR[u.r] + '18', color: ROLE_COLOR[u.r], border: `1px solid ${ROLE_COLOR[u.r]}25` }}>{u.r}</span>
                </div>
                <div style={{ color: '#475569', fontSize: '0.83rem' }}>{u.d}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.s ? '#10B981' : '#EF4444', boxShadow: u.s ? '0 0 6px #10B981' : '0 0 6px #EF4444' }} />
                  <span style={{ color: u.s ? '#10B981' : '#EF4444', fontSize: '0.78rem' }}>{u.s ? 'Active' : 'Suspended'}</span>
                </div>
                <div className="mono" style={{ color: '#64748B', fontSize: '0.75rem' }}>{u.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Permissions matrix */}
      <section className="section">
        <div className="container">
          <span className="label">Permission Matrix</span>
          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <div className="terminal" style={{ borderRadius: 14, display: 'inline-block', minWidth: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(6, 1fr)', padding: '0.75rem 1.5rem', background: '#070F1D', borderBottom: '1px solid rgba(6,182,212,0.08)', gap: '0.5rem' }}>
                <div className="mono" style={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 700 }}>ROLE</div>
                {PERMS.map(p => <div key={p} className="mono" style={{ color: '#64748B', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center' }}>{p}</div>)}
              </div>
              {ROLES.map((row, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '120px repeat(6, 1fr)',
                  padding: '0.9rem 1.5rem', gap: '0.5rem',
                  borderBottom: i < ROLES.length - 1 ? '1px solid rgba(6,182,212,0.05)' : 'none',
                  alignItems: 'center',
                }}>
                  <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: 4, background: row.c + '18', color: row.c, width: 'fit-content', border: `1px solid ${row.c}25` }}>{row.r}</span>
                  {row.p.map((v, pi) => (
                    <div key={pi} style={{ textAlign: 'center' }}>
                      {v ? <span style={{ color: '#10B981', fontSize: '1.1rem' }}>✓</span> : <span style={{ color: '#64748B' }}>—</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PII stats */}
      <section className="section" style={{ background: '#020913' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <div>
              <span className="label" style={{ color: '#F87171', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>Compliance Dashboard</span>
              <h2 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '1.6rem', margin: '1rem 0', letterSpacing: '-0.02em' }}>PII Redaction Statistics</h2>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Real-time visibility into what sensitive data your organisation handles — and the assurance that none of it is stored unprotected.
              </p>
              <div className="glass" style={{ padding: '1.25rem' }}>
                <div className="mono" style={{ color: '#64748B', fontSize: '0.7rem', marginBottom: '0.25rem', letterSpacing: '0.08em' }}>TOTAL REDACTED — LAST 30 DAYS</div>
                <div className="mono" style={{ color: '#06B6D4', fontWeight: 900, fontSize: '2.8rem' }}>3,913</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PII_BARS.map((bar, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="mono" style={{ width: 55, flexShrink: 0, fontSize: '0.68rem', fontWeight: 700, color: bar.c }}>{bar.t}</span>
                  <div style={{ flex: 1, background: 'rgba(6,14,40,0.8)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: bar.p + '%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      style={{ height: '100%', background: bar.c, borderRadius: 4 }}
                    />
                  </div>
                  <span className="mono" style={{ width: 40, textAlign: 'right', color: '#64748B', fontSize: '0.72rem' }}>{bar.n.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#E2E8F0', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            See the Full Console Live
          </h2>
          <p style={{ color: '#475569', marginBottom: '2rem' }}>
            Walk through the complete admin experience with your own organisation&apos;s data in a private demo.
          </p>
          <Link to="/company" className="btn-primary">Book a Demo →</Link>
        </div>
      </section>
    </main>
  )
}
