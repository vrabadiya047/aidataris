import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Tenant data ─────────────────────────────────────── */
const ALL_USERS = [
  { n: 'Sarah Mitchell',  r: 'Admin',  d: 'Operations',  s: true,  l: '2 min ago' },
  { n: 'James Thornton',  r: 'Editor', d: 'Engineering', s: true,  l: '14 min ago' },
  { n: 'Lena Fischer',    r: 'Editor', d: 'Engineering', s: true,  l: '31 min ago' },
  { n: 'Omar Rashid',     r: 'Viewer', d: 'Engineering', s: false, l: '2 days ago' },
  { n: 'Daniel Kowalski', r: 'Editor', d: 'Legal',       s: false, l: '3 days ago' },
  { n: 'Chloe Nguyen',    r: 'Viewer', d: 'Legal',       s: true,  l: '45 min ago' },
  { n: 'Emma Faulkner',   r: 'Viewer', d: 'HR',          s: true,  l: '5 min ago' },
  { n: 'Marcus Webb',     r: 'Editor', d: 'HR',          s: true,  l: '1 hr ago' },
  { n: 'Priya Nambiar',   r: 'Viewer', d: 'Finance',     s: true,  l: '1 hr ago' },
]

const TENANTS = {
  global: {
    label: 'Global (SuperAdmin)',
    color: '#06B6D4',
    metrics: [
      { v: '1,247', l: 'Queries Today',     t: '+12% vs yesterday', c: '#06B6D4' },
      { v: '38',    l: 'PII Items Blocked', t: 'since midnight',    c: '#F87171' },
      { v: '1.4s',  l: 'Avg Response',      t: 'local inference',   c: '#34D399' },
      { v: '214',   l: 'Active Users',      t: 'online now',        c: '#F59E0B' },
    ],
    users: ALL_USERS,
    piiTotal: '3,913',
    piiBars: [
      { t: 'NAME',  n: 1204, p: 31, c: '#38BDF8' },
      { t: 'EMAIL', n: 876,  p: 22, c: '#34D399' },
      { t: 'PHONE', n: 654,  p: 17, c: '#A78BFA' },
      { t: 'TFN',   n: 423,  p: 11, c: '#F87171' },
      { t: 'ABN',   n: 312,  p: 8,  c: '#F59E0B' },
      { t: 'CC',    n: 198,  p: 5,  c: '#F472B6' },
      { t: 'OTHER', n: 246,  p: 6,  c: '#6B7280' },
    ],
  },
  engineering: {
    label: 'Engineering Dept',
    color: '#8B5CF6',
    metrics: [
      { v: '412',  l: 'Queries Today',     t: '+7% vs yesterday', c: '#06B6D4' },
      { v: '8',    l: 'PII Items Blocked', t: 'since midnight',   c: '#F87171' },
      { v: '1.2s', l: 'Avg Response',      t: 'local inference',  c: '#34D399' },
      { v: '47',   l: 'Active Users',      t: 'online now',       c: '#F59E0B' },
    ],
    users: ALL_USERS.filter(u => u.d === 'Engineering'),
    piiTotal: '847',
    piiBars: [
      { t: 'NAME',  n: 312, p: 37, c: '#38BDF8' },
      { t: 'EMAIL', n: 198, p: 23, c: '#34D399' },
      { t: 'PHONE', n: 143, p: 17, c: '#A78BFA' },
      { t: 'ABN',   n: 112, p: 13, c: '#F59E0B' },
      { t: 'TFN',   n: 52,  p: 6,  c: '#F87171' },
      { t: 'OTHER', n: 30,  p: 4,  c: '#6B7280' },
    ],
  },
  legal: {
    label: 'Legal Dept',
    color: '#F87171',
    metrics: [
      { v: '198',  l: 'Queries Today',     t: '-3% vs yesterday', c: '#06B6D4' },
      { v: '19',   l: 'PII Items Blocked', t: 'since midnight',   c: '#F87171' },
      { v: '1.6s', l: 'Avg Response',      t: 'local inference',  c: '#34D399' },
      { v: '28',   l: 'Active Users',      t: 'online now',       c: '#F59E0B' },
    ],
    users: ALL_USERS.filter(u => u.d === 'Legal'),
    piiTotal: '1,204',
    piiBars: [
      { t: 'NAME',  n: 487, p: 40, c: '#38BDF8' },
      { t: 'TFN',   n: 312, p: 26, c: '#F87171' },
      { t: 'EMAIL', n: 198, p: 16, c: '#34D399' },
      { t: 'CC',    n: 143, p: 12, c: '#F472B6' },
      { t: 'OTHER', n: 64,  p: 5,  c: '#6B7280' },
    ],
  },
  hr: {
    label: 'HR Dept',
    color: '#10B981',
    metrics: [
      { v: '89',   l: 'Queries Today',     t: '+2% vs yesterday', c: '#06B6D4' },
      { v: '7',    l: 'PII Items Blocked', t: 'since midnight',   c: '#F87171' },
      { v: '1.5s', l: 'Avg Response',      t: 'local inference',  c: '#34D399' },
      { v: '12',   l: 'Active Users',      t: 'online now',       c: '#F59E0B' },
    ],
    users: ALL_USERS.filter(u => u.d === 'HR'),
    piiTotal: '623',
    piiBars: [
      { t: 'NAME',  n: 243, p: 39, c: '#38BDF8' },
      { t: 'EMAIL', n: 187, p: 30, c: '#34D399' },
      { t: 'PHONE', n: 112, p: 18, c: '#A78BFA' },
      { t: 'TFN',   n: 81,  p: 13, c: '#F87171' },
    ],
  },
}

const ROLE_COLOR = { Admin: '#F87171', Editor: '#F59E0B', Viewer: '#06B6D4' }
const PERMS = ['Query', 'Upload', 'Manage Users', 'Sys Config', 'Audit Logs', 'Export']
const ROLES = [
  { r: 'Admin',  c: '#F87171', p: [1, 1, 1, 1, 1, 1] },
  { r: 'Editor', c: '#F59E0B', p: [1, 1, 0, 0, 1, 0] },
  { r: 'Viewer', c: '#06B6D4', p: [1, 0, 0, 0, 0, 0] },
]

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

/* ── Tenant Dropdown ─────────────────────────────────── */
function TenantSwitcher({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = TENANTS[value]

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>TENANT SCOPE</div>
      <button
        onClick={() => setOpen(o => !o)}
        className="glass"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.65rem 1rem', border: `1px solid ${current.color}35`,
          background: current.color + '08', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', minWidth: 220, borderRadius: 10,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: current.color, boxShadow: `0 0 8px ${current.color}`, flexShrink: 0 }} />
        <span style={{ color: 'var(--t1)', fontWeight: 600, fontSize: '0.875rem', flex: 1, textAlign: 'left' }}>{current.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ color: 'var(--t4)', fontSize: '0.75rem' }}>▼</motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="glass"
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              zIndex: 100, border: '1px solid rgba(6,182,212,0.18)',
              borderRadius: 10, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            }}
          >
            {Object.entries(TENANTS).map(([key, t]) => (
              <button key={key}
                onClick={() => { onChange(key); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  background: value === key ? t.color + '12' : 'transparent',
                  border: 'none', borderBottom: key !== 'hr' ? '1px solid rgba(6,182,212,0.06)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (value !== key) e.currentTarget.style.background = 'rgba(6,182,212,0.05)' }}
                onMouseLeave={e => { if (value !== key) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                <span style={{ color: value === key ? t.color : 'var(--t2)', fontWeight: value === key ? 700 : 500, fontSize: '0.85rem' }}>{t.label}</span>
                {value === key && <span style={{ marginLeft: 'auto', color: t.color, fontSize: '0.7rem' }}>✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminConsole() {
  const [tenant, setTenant] = useState('global')
  const data = TENANTS[tenant]

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>
      <Helmet>
        <title>Admin Console | AIDATARIS Sovereign AI</title>
        <meta name="description" content="Enterprise admin console for AIDATARIS Sovereign AI — manage users, monitor PII redaction, and govern your on-premises AI deployment in real time." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span className="label">Enterprise Admin Console</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em' }}>
            Total Governance.<br /><span className="gradient-text-amber">Total Control.</span>
          </h1>
          <p style={{ color: 'var(--t4)', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Manage 1,000+ users, monitor compliance in real time, and govern every aspect of your Sovereign AI deployment from a single pane of glass.
          </p>
        </div>
      </section>

      {/* Tenant Switcher + Metrics */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <span className="label" style={{ display: 'block' }}>System Health Dashboard</span>
            <TenantSwitcher value={tenant} onChange={setTenant} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tenant}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
            >
              {data.metrics.map((m, i) => (
                <div key={i} className="glass" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', border: `1px solid ${m.c}18` }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.c }} />
                  <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: m.c, marginBottom: '0.25rem' }}>{m.v}</div>
                  <div style={{ color: 'var(--t3)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{m.l}</div>
                  <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--t4)' }}>{m.t.toUpperCase()}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* User table */}
      <section className="section" style={{ paddingTop: 0, background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="label">User Governance</span>
              <h2 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                Granular Role-Based Access Control
                {tenant !== 'global' && (
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: data.color, fontWeight: 600 }}>
                    — {data.label}
                  </span>
                )}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.entries(ROLE_COLOR).map(([r, c]) => (
                <span key={r} className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: c + '18', color: c, border: `1px solid ${c}30` }}>{r}</span>
              ))}
            </div>
          </div>

          <div className="terminal" style={{ borderRadius: 14 }}>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 640 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '0.75rem 1.5rem', background: 'var(--surface)', borderBottom: '1px solid rgba(6,182,212,0.08)' }}>
                  {['User', 'Role', 'Department', 'Status', 'Last Active'].map(h => (
                    <div key={h} className="mono" style={{ color: '#6B7280', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>{h}</div>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={tenant}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {data.users.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem' }}>
                        No users in this tenant scope.
                      </div>
                    ) : data.users.map((u, i) => (
                      <div key={u.n} style={{
                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                        padding: '0.9rem 1.5rem', alignItems: 'center',
                        borderBottom: i < data.users.length - 1 ? '1px solid rgba(6,182,212,0.05)' : 'none',
                        transition: 'background 0.15s', cursor: 'default',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ color: '#E5E7EB', fontWeight: 600, fontSize: '0.88rem' }}>{u.n}</div>
                        <div>
                          <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: ROLE_COLOR[u.r] + '18', color: ROLE_COLOR[u.r], border: `1px solid ${ROLE_COLOR[u.r]}25` }}>{u.r}</span>
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.83rem' }}>{u.d}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.s ? '#10B981' : '#EF4444', boxShadow: u.s ? '0 0 6px #10B981' : '0 0 6px #EF4444' }} />
                          <span style={{ color: u.s ? '#10B981' : '#EF4444', fontSize: '0.78rem' }}>{u.s ? 'Active' : 'Suspended'}</span>
                        </div>
                        <div className="mono" style={{ color: '#6B7280', fontSize: '0.75rem' }}>{u.l}</div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Permissions matrix */}
      <section className="section">
        <div className="container">
          <span className="label">Permission Matrix</span>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="terminal" style={{ borderRadius: 14 }}>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 560 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(6, 1fr)', padding: '0.75rem 1.5rem', background: 'var(--surface)', borderBottom: '1px solid rgba(6,182,212,0.08)', gap: '0.5rem' }}>
                    <div className="mono" style={{ color: '#6B7280', fontSize: '0.68rem', fontWeight: 700 }}>ROLE</div>
                    {PERMS.map(p => <div key={p} className="mono" style={{ color: '#6B7280', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center' }}>{p}</div>)}
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
                          {v ? <span style={{ color: '#10B981', fontSize: '1.1rem' }}>✓</span> : <span style={{ color: '#4B5563' }}>—</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PII stats */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '4rem' }} />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <div>
              <span className="label" style={{ color: '#F87171', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>Compliance Dashboard</span>
              <h2 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.6rem', margin: '1rem 0', letterSpacing: '-0.02em' }}>PII Redaction Statistics</h2>
              <p style={{ color: 'var(--t4)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Real-time visibility into what sensitive data your organisation handles — and the assurance that none of it is stored unprotected.
              </p>
              <AnimatePresence mode="wait">
                <motion.div key={tenant + '-pii'}
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="glass" style={{ padding: '1.25rem' }}
                >
                  <div className="mono" style={{ color: '#6B7280', fontSize: '0.7rem', marginBottom: '0.25rem', letterSpacing: '0.08em' }}>TOTAL REDACTED — LAST 30 DAYS</div>
                  <div className="mono" style={{ color: '#06B6D4', fontWeight: 900, fontSize: '2.8rem' }}>{data.piiTotal}</div>
                  {tenant !== 'global' && (
                    <div className="mono" style={{ color: data.color, fontSize: '0.68rem', marginTop: '0.25rem' }}>↑ SCOPED TO {data.label.toUpperCase()}</div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={tenant + '-bars'}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                {data.piiBars.map((bar, i) => (
                  <div key={bar.t} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="mono" style={{ width: 55, flexShrink: 0, fontSize: '0.68rem', fontWeight: 700, color: bar.c }}>{bar.t}</span>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: bar.p + '%' }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', background: bar.c, borderRadius: 4 }}
                      />
                    </div>
                    <span className="mono" style={{ width: 40, textAlign: 'right', color: '#6B7280', fontSize: '0.72rem' }}>{bar.n.toLocaleString()}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--t1)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            See the Full Console Live
          </h2>
          <p style={{ color: 'var(--t4)', marginBottom: '2rem' }}>
            Walk through the complete admin experience with your own organisation&apos;s data in a private demo.
          </p>
          <Link to="/contact" className="btn-primary">Book a Demo →</Link>
        </div>
      </section>
    </main>
  )
}
