import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MOCK_USERS = [
  { name: 'Sarah Mitchell',   role: 'Admin',   dept: 'Operations', status: 'Active',    last: '2 min ago' },
  { name: 'James Thornton',   role: 'Editor',  dept: 'Engineering', status: 'Active',   last: '14 min ago' },
  { name: 'Priya Nambiar',    role: 'Viewer',  dept: 'Finance',    status: 'Active',    last: '1 hr ago' },
  { name: 'Daniel Kowalski',  role: 'Editor',  dept: 'Legal',      status: 'Suspended', last: '3 days ago' },
  { name: 'Emma Faulkner',    role: 'Viewer',  dept: 'HR',         status: 'Active',    last: '5 min ago' },
]

const HEALTH_METRICS = [
  { label: 'Queries Today',     value: '1,247', trend: '+12%',  color: '#06B6D4' },
  { label: 'PII Blocked',       value: '38',    trend: 'today', color: '#EF4444' },
  { label: 'Avg Response Time', value: '1.4s',  trend: 'local', color: '#10B981' },
  { label: 'Active Users',      value: '214',   trend: 'online',color: '#F59E0B' },
]

const ROLE_PERMISSIONS = [
  { role: 'Admin',  color: '#EF4444', perms: ['Query', 'Upload Docs', 'Manage Users', 'System Config', 'Audit Logs', 'Export Data'] },
  { role: 'Editor', color: '#F59E0B', perms: ['Query', 'Upload Docs', '—', '—', 'Audit Logs', '—'] },
  { role: 'Viewer', color: '#06B6D4', perms: ['Query', '—', '—', '—', '—', '—'] },
]

const PERM_LABELS = ['Query', 'Upload Docs', 'Manage Users', 'System Config', 'Audit Logs', 'Export Data']

const REDACTION_STATS = [
  { type: 'NAME',        count: 1204, pct: 31 },
  { type: 'EMAIL',       count: 876,  pct: 22 },
  { type: 'PHONE',       count: 654,  pct: 17 },
  { type: 'TFN',         count: 423,  pct: 11 },
  { type: 'ABN',         count: 312,  pct: 8  },
  { type: 'CREDIT CARD', count: 198,  pct: 5  },
  { type: 'OTHER',       count: 246,  pct: 6  },
]

const PII_COLORS = {
  NAME: '#06B6D4', EMAIL: '#10B981', PHONE: '#8B5CF6',
  TFN: '#EF4444', ABN: '#F59E0B', 'CREDIT CARD': '#EC4899', OTHER: '#64748B',
}

export default function AdminConsole() {
  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <section className="page-hero grid-bg">
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="section-label">Enterprise Admin Console</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#F8FAFC', margin: '1rem 0' }}>
            Total Governance. Total Control.
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Manage 1,000+ users, monitor compliance in real time, and govern every aspect of your Sovereign AI deployment from a single pane of glass.
          </p>
        </div>
      </section>

      {/* System Health */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">System Health Dashboard</span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem', marginTop: '1.5rem',
          }}>
            {HEALTH_METRICS.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: '#0D1117',
                  border: `1px solid ${m.color}33`,
                  borderRadius: 12, padding: '1.5rem',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: m.color,
                }} />
                <div style={{
                  fontSize: '2rem', fontWeight: 900, color: m.color,
                  fontFamily: 'Courier New, monospace', marginBottom: '0.25rem',
                }}>{m.value}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{m.label}</div>
                <div style={{
                  marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 700,
                  color: m.color, fontFamily: 'Courier New, monospace',
                }}>{m.trend.toUpperCase()}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Management */}
      <section style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-label">User Governance</span>
              <h2 style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.25rem' }}>
                Granular Role-Based Access Control
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Admin', 'Editor', 'Viewer'].map((role, i) => {
                const colors = ['#EF4444', '#F59E0B', '#06B6D4']
                return (
                  <span key={role} style={{
                    padding: '0.25rem 0.75rem', borderRadius: 4, fontSize: '0.75rem',
                    fontWeight: 700, background: colors[i] + '20', color: colors[i],
                    border: `1px solid ${colors[i]}44`,
                  }}>{role}</span>
                )
              })}
            </div>
          </div>

          {/* User table */}
          <div style={{ background: '#0D1117', border: '1px solid #1E293B', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '0.75rem 1.5rem',
              borderBottom: '1px solid #1E293B',
              background: '#0A0A0A',
            }}>
              {['User', 'Role', 'Department', 'Status', 'Last Active'].map(h => (
                <div key={h} style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>
            {MOCK_USERS.map((u, i) => {
              const roleColor = u.role === 'Admin' ? '#EF4444' : u.role === 'Editor' ? '#F59E0B' : '#06B6D4'
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  padding: '0.9rem 1.5rem',
                  borderBottom: i < MOCK_USERS.length - 1 ? '1px solid #0F172A' : 'none',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1E293B20'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</div>
                  <div style={{
                    display: 'inline-flex', padding: '2px 8px', borderRadius: 4,
                    background: roleColor + '18', color: roleColor,
                    fontSize: '0.75rem', fontWeight: 700, width: 'fit-content',
                  }}>{u.role}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{u.dept}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: u.status === 'Active' ? '#10B981' : '#EF4444',
                    }} />
                    <span style={{ color: u.status === 'Active' ? '#10B981' : '#EF4444', fontSize: '0.8rem' }}>{u.status}</span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.8rem', fontFamily: 'Courier New, monospace' }}>{u.last}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Permissions matrix */}
      <section style={{ padding: '2rem 1.5rem 4rem', background: '#0D1117', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="section-label">Permission Matrix</span>
          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E293B' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Role</th>
                  {PERM_LABELS.map(p => (
                    <th key={p} style={{ padding: '0.75rem 0.5rem', color: '#475569', fontWeight: 700, textAlign: 'center', fontSize: '0.75rem' }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLE_PERMISSIONS.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #0F172A' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        color: row.color, fontWeight: 700, fontSize: '0.85rem',
                        background: row.color + '18', padding: '2px 10px', borderRadius: 4,
                      }}>{row.role}</span>
                    </td>
                    {row.perms.map((perm, pi) => (
                      <td key={pi} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                        {perm !== '—'
                          ? <span style={{ color: '#10B981', fontSize: '1rem' }}>✓</span>
                          : <span style={{ color: '#334155', fontSize: '0.9rem' }}>—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Redaction stats */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            <div>
              <span className="section-label">Compliance Dashboard</span>
              <h2 style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.5rem', margin: '0.75rem 0 1rem' }}>
                PII Redaction Statistics
              </h2>
              <p style={{ color: '#94A3B8', lineHeight: 1.7 }}>
                Real-time visibility into what sensitive data your organisation handles — and the assurance that none of it is stored unprotected.
              </p>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0D1117', borderRadius: 8, border: '1px solid #1E293B' }}>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', fontFamily: 'Courier New, monospace', marginBottom: '0.25rem' }}>
                  TOTAL PII ITEMS REDACTED — LAST 30 DAYS
                </div>
                <div style={{ color: '#06B6D4', fontWeight: 900, fontSize: '2.5rem', fontFamily: 'Courier New, monospace' }}>
                  3,913
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {REDACTION_STATS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: 70, flexShrink: 0, fontSize: '0.7rem', fontWeight: 700,
                    color: PII_COLORS[s.type] || '#64748B',
                    fontFamily: 'Courier New, monospace',
                  }}>{s.type}</span>
                  <div style={{ flex: 1, background: '#0D1117', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: s.pct + '%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ height: '100%', background: PII_COLORS[s.type] || '#64748B', borderRadius: 4 }}
                    />
                  </div>
                  <span style={{ width: 40, textAlign: 'right', color: '#64748B', fontSize: '0.75rem', fontFamily: 'Courier New, monospace' }}>
                    {s.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem', textAlign: 'center', background: '#0D1117', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '1rem' }}>
            See the Full Admin Console
          </h2>
          <p style={{ color: '#64748B', marginBottom: '2rem' }}>
            Request a live demo and walk through the complete admin experience with your own team&apos;s data.
          </p>
          <Link to="/company" className="btn-primary">Book a Demo</Link>
        </div>
      </section>
    </main>
  )
}
