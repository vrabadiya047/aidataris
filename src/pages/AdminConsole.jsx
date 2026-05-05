import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Static data ─────────────────────────────────────── */
const ALL_USERS = [
  { n: 'Sarah Mitchell',  r: 'Admin',  d: 'Operations',  s: true,  l: '2 min ago',  av: 'SM' },
  { n: 'James Thornton',  r: 'Editor', d: 'Engineering', s: true,  l: '14 min ago', av: 'JT' },
  { n: 'Lena Fischer',    r: 'Editor', d: 'Engineering', s: true,  l: '31 min ago', av: 'LF' },
  { n: 'Omar Rashid',     r: 'Viewer', d: 'Engineering', s: false, l: '2 days ago', av: 'OR' },
  { n: 'Daniel Kowalski', r: 'Editor', d: 'Legal',       s: false, l: '3 days ago', av: 'DK' },
  { n: 'Chloe Nguyen',    r: 'Viewer', d: 'Legal',       s: true,  l: '45 min ago', av: 'CN' },
  { n: 'Emma Faulkner',   r: 'Viewer', d: 'HR',          s: true,  l: '5 min ago',  av: 'EF' },
  { n: 'Marcus Webb',     r: 'Editor', d: 'HR',          s: true,  l: '1 hr ago',   av: 'MW' },
  { n: 'Priya Nambiar',   r: 'Viewer', d: 'Finance',     s: true,  l: '1 hr ago',   av: 'PN' },
]

const TENANTS = {
  global: {
    label: 'Global (SuperAdmin)', color: '#06B6D4',
    metrics: [
      { v: '1,247', l: 'Queries Today',    trend: '+12%', up: true,  c: '#06B6D4' },
      { v: '38',    l: 'PII Blocked',      trend: 'since midnight', up: null, c: '#F87171' },
      { v: '1.4s',  l: 'Avg Response',     trend: '-0.2s vs avg',  up: true,  c: '#34D399' },
      { v: '214',   l: 'Active Users',     trend: 'online now',    up: null,  c: '#F59E0B' },
    ],
    users: ALL_USERS, piiTotal: '3,913',
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
    label: 'Engineering Dept', color: '#8B5CF6',
    metrics: [
      { v: '412',  l: 'Queries Today',    trend: '+7%',  up: true,  c: '#06B6D4' },
      { v: '8',    l: 'PII Blocked',      trend: 'since midnight', up: null, c: '#F87171' },
      { v: '1.2s', l: 'Avg Response',     trend: '-0.4s vs avg',  up: true,  c: '#34D399' },
      { v: '47',   l: 'Active Users',     trend: 'online now',    up: null,  c: '#F59E0B' },
    ],
    users: ALL_USERS.filter(u => u.d === 'Engineering'), piiTotal: '847',
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
    label: 'Legal Dept', color: '#F87171',
    metrics: [
      { v: '198',  l: 'Queries Today',    trend: '-3%',  up: false, c: '#06B6D4' },
      { v: '19',   l: 'PII Blocked',      trend: 'since midnight', up: null, c: '#F87171' },
      { v: '1.6s', l: 'Avg Response',     trend: '+0.1s vs avg',  up: false, c: '#34D399' },
      { v: '28',   l: 'Active Users',     trend: 'online now',    up: null,  c: '#F59E0B' },
    ],
    users: ALL_USERS.filter(u => u.d === 'Legal'), piiTotal: '1,204',
    piiBars: [
      { t: 'NAME',  n: 487, p: 40, c: '#38BDF8' },
      { t: 'TFN',   n: 312, p: 26, c: '#F87171' },
      { t: 'EMAIL', n: 198, p: 16, c: '#34D399' },
      { t: 'CC',    n: 143, p: 12, c: '#F472B6' },
      { t: 'OTHER', n: 64,  p: 5,  c: '#6B7280' },
    ],
  },
  hr: {
    label: 'HR Dept', color: '#10B981',
    metrics: [
      { v: '89',   l: 'Queries Today',    trend: '+2%',  up: true,  c: '#06B6D4' },
      { v: '7',    l: 'PII Blocked',      trend: 'since midnight', up: null, c: '#F87171' },
      { v: '1.5s', l: 'Avg Response',     trend: 'on target',      up: null, c: '#34D399' },
      { v: '12',   l: 'Active Users',     trend: 'online now',     up: null, c: '#F59E0B' },
    ],
    users: ALL_USERS.filter(u => u.d === 'HR'), piiTotal: '623',
    piiBars: [
      { t: 'NAME',  n: 243, p: 39, c: '#38BDF8' },
      { t: 'EMAIL', n: 187, p: 30, c: '#34D399' },
      { t: 'PHONE', n: 112, p: 18, c: '#A78BFA' },
      { t: 'TFN',   n: 81,  p: 13, c: '#F87171' },
    ],
  },
}

const ROLE_COLOR = { Admin: '#F87171', Editor: '#F59E0B', Viewer: '#06B6D4' }
const PERMS      = ['Query', 'Upload', 'Manage Users', 'Sys Config', 'Audit Logs', 'Export']
const ROLES      = [
  { r: 'Admin',  c: '#F87171', p: [1,1,1,1,1,1] },
  { r: 'Editor', c: '#F59E0B', p: [1,1,0,0,1,0] },
  { r: 'Viewer', c: '#06B6D4', p: [1,0,0,0,0,0] },
]

const SERVICES = [
  { name: 'Ollama LLM Runtime', status: 'online', uptime: '99.98%', resp: '1.2s',  color: '#06B6D4', desc: 'Llama 3.3 70B' },
  { name: 'Qdrant Vector DB',   status: 'online', uptime: '99.99%', resp: '12ms',  color: '#8B5CF6', desc: '2.4M vectors' },
  { name: 'Neo4j Graph DB',     status: 'online', uptime: '99.97%', resp: '8ms',   color: '#F59E0B', desc: '847K nodes' },
  { name: 'FastAPI Gateway',    status: 'online', uptime: '100%',   resp: '4ms',   color: '#10B981', desc: 'v0.115.5' },
  { name: 'PostgreSQL',         status: 'online', uptime: '99.99%', resp: '2ms',   color: '#34D399', desc: 'Metadata store' },
  { name: 'MinIO Storage',      status: 'online', uptime: '99.99%', resp: '6ms',   color: '#A78BFA', desc: '1.2 TB used' },
]

const SPARK = [
  { d: 'Mon', v: 820  },
  { d: 'Tue', v: 1040 },
  { d: 'Wed', v: 960  },
  { d: 'Thu', v: 1180 },
  { d: 'Fri', v: 1247 },
  { d: 'Sat', v: 380  },
  { d: 'Sun', v: 210  },
]
const SPARK_MAX = Math.max(...SPARK.map(s => s.v))

const RECENT = [
  { ts: '10:47:23', user: 'analyst_01', dept: 'Engineering', q: 'Extraction rates for Pilbara site Q3?',        ms: '1.2s', ok: true  },
  { ts: '10:46:51', user: 'manager_07', dept: 'Finance',     q: 'Q3 budget breakdown for northern operations',  ms: '1.8s', ok: true  },
  { ts: '10:46:12', user: 'analyst_03', dept: 'HR',          q: 'Employee TFN records for payroll run',         ms: '0.3s', ok: false },
  { ts: '10:45:44', user: 'legal_02',   dept: 'Legal',       q: 'Contract clause 14.3 liability reference?',    ms: '2.1s', ok: true  },
  { ts: '10:44:02', user: 'sarah_m',    dept: 'Operations',  q: 'Site safety blast exclusion zone specs?',      ms: '0.9s', ok: true  },
]

const LIVE_POOL = [
  { user: 'analyst_01', dept: 'Engineering', q: 'What are the extraction rates for Pilbara site Q3?',            ms: '1.2s', ok: true  },
  { user: 'manager_07', dept: 'Finance',     q: 'Retrieve Q3 budget breakdown for northern operations',           ms: '1.8s', ok: true  },
  { user: 'analyst_03', dept: 'HR',          q: 'Show employee TFN records for payroll processing',               ms: '0.3s', ok: false },
  { user: 'legal_02',   dept: 'Legal',       q: 'Contract clause 14.3 liability — Pilbara ops agreement 2024',   ms: '2.1s', ok: true  },
  { user: 'sarah_m',    dept: 'Operations',  q: 'Site safety requirements for blast exclusion zones?',            ms: '0.9s', ok: true  },
  { user: 'admin_01',   dept: 'IT',          q: 'System health check — all vector nodes nominal',                 ms: '0.4s', ok: true  },
  { user: 'finance_03', dept: 'Finance',     q: 'Capital expenditure forecast for FY26 by region',               ms: '1.5s', ok: true  },
  { user: 'legal_01',   dept: 'Legal',       q: 'Compliance checklist for WA mining permit renewal',              ms: '2.4s', ok: true  },
  { user: 'eng_05',     dept: 'Engineering', q: 'Failure analysis report for crusher unit B7-North',              ms: '1.6s', ok: true  },
  { user: 'hr_02',      dept: 'HR',          q: 'Retrieve Medicare number fields from employee onboarding',       ms: '0.2s', ok: false },
]

const COMPLIANCE_ITEMS = [
  { f: 'Privacy Act 1988',         s: 'Full',  c: '#10B981', last: '2025-04-12' },
  { f: 'ASD Essential Eight',      s: 'Full',  c: '#10B981', last: '2025-03-28' },
  { f: 'ISM (PSPF)',               s: 'Ready', c: '#F59E0B', last: '2025-02-15' },
  { f: 'Health Records Act 2001',  s: 'Full',  c: '#10B981', last: '2025-04-01' },
  { f: 'WA AI Assurance Framework',s: 'Full',  c: '#10B981', last: '2025-03-10' },
  { f: 'ISO 27001',                s: 'Ready', c: '#F59E0B', last: '2025-01-20' },
]

/* ── Shared helpers ──────────────────────────────────── */
function TenantSwitcher({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = TENANTS[value]
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <button onClick={() => setOpen(o => !o)} className="glass"
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', border: `1px solid ${current.color}35`, background: current.color + '08', cursor: 'pointer', fontFamily: 'Inter, sans-serif', minWidth: 220, borderRadius: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: current.color, boxShadow: `0 0 8px ${current.color}`, flexShrink: 0 }} />
        <span style={{ color: 'var(--t1)', fontWeight: 600, fontSize: '0.875rem', flex: 1, textAlign: 'left' }}>{current.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} style={{ color: 'var(--t4)', fontSize: '0.65rem' }}>▼</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.16 }}
            className="glass" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200, border: '1px solid rgba(6,182,212,0.18)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
            {Object.entries(TENANTS).map(([key, t], idx, arr) => (
              <button key={key} onClick={() => { onChange(key); setOpen(false) }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: value === key ? t.color + '12' : 'transparent', border: 'none', borderBottom: idx < arr.length - 1 ? '1px solid rgba(6,182,212,0.06)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (value !== key) e.currentTarget.style.background = 'rgba(6,182,212,0.05)' }}
                onMouseLeave={e => { if (value !== key) e.currentTarget.style.background = 'transparent' }}>
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

/* ── Tabs ────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',   label: '⬡  Overview' },
  { id: 'users',      label: '👤 Users' },
  { id: 'compliance', label: '🛡  Compliance' },
  { id: 'feed',       label: '⚡ Live Feed' },
]

/* ── Overview tab ────────────────────────────────────── */
function OverviewTab({ tenant, onTenantChange, data }) {
  return (
    <div style={{ padding: '3rem 1.5rem' }}>
      <div className="container">

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span className="label">System Health Dashboard</span>
            <p style={{ color: 'var(--t4)', fontSize: '0.82rem', marginTop: '0.4rem' }}>All metrics scoped to selected tenant. Data refreshes every 30 seconds.</p>
          </div>
          <TenantSwitcher value={tenant} onChange={onTenantChange} />
        </div>

        {/* KPI cards */}
        <AnimatePresence mode="wait">
          <motion.div key={tenant}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {data.metrics.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}
                className="glass" style={{ padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden', border: `1px solid ${m.c}18` }}
                whileHover={{ y: -3, boxShadow: `0 12px 36px rgba(0,0,0,0.12), 0 0 20px ${m.c}14` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${m.c}, ${m.c}00)` }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div className="mono" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: m.c, letterSpacing: '-0.03em', lineHeight: 1 }}>{m.v}</div>
                  {m.up !== null && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: m.up ? '#10B981' : '#EF4444', marginTop: '0.15rem' }}>
                      {m.up ? '▲' : '▼'} {m.trend}
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--t2)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.15rem' }}>{m.l}</div>
                {m.up === null && <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--t5)', letterSpacing: '0.06em' }}>{m.trend.toUpperCase()}</div>}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Services + Sparkline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

          {/* System services */}
          <div className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(6,182,212,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em' }}>SYSTEM SERVICES</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse-ring 2s ease infinite' }} />
                <span className="mono" style={{ color: '#10B981', fontSize: '0.62rem', fontWeight: 700 }}>ALL ONLINE</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SERVICES.map((svc, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto auto', gap: '0.6rem', alignItems: 'center', padding: '0.55rem 0.75rem', borderRadius: 8, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                  <div>
                    <div style={{ color: 'var(--t1)', fontSize: '0.8rem', fontWeight: 600 }}>{svc.name}</div>
                    <div style={{ color: 'var(--t5)', fontSize: '0.65rem' }}>{svc.desc}</div>
                  </div>
                  <span className="mono" style={{ color: '#10B981', fontSize: '0.65rem', fontWeight: 700 }}>{svc.uptime}</span>
                  <span className="mono" style={{ color: svc.color, fontSize: '0.65rem' }}>{svc.resp}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Query sparkline */}
          <div className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(6,182,212,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em' }}>QUERY VOLUME — LAST 7 DAYS</div>
              <span style={{ color: '#06B6D4', fontSize: '0.72rem', fontWeight: 700 }}>↑ 12% WoW</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: 100 }}>
              {SPARK.map((s, i) => {
                const pct = (s.v / SPARK_MAX) * 100
                const isToday = i === 4
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', height: '100%', justifyContent: 'flex-end' }}>
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                      transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: '100%', background: isToday ? '#06B6D4' : 'rgba(6,182,212,0.3)', borderRadius: '4px 4px 0 0', position: 'relative', cursor: 'default' }}
                      whileHover={{ background: '#06B6D4', opacity: 0.85 }}>
                      {isToday && (
                        <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)', background: '#06B6D4', color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>
                          {s.v.toLocaleString()}
                        </div>
                      )}
                    </motion.div>
                    <span style={{ color: 'var(--t5)', fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>{s.d}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ borderTop: '1px solid var(--bd)', marginTop: '1.25rem', paddingTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { label: 'Peak Today',  val: '1,247' },
                { label: 'Weekly Total',val: '6,037' },
                { label: 'Avg/Day',     val: '862' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div className="mono" style={{ color: '#06B6D4', fontWeight: 800, fontSize: '1rem' }}>{s.val}</div>
                  <div style={{ color: 'var(--t5)', fontSize: '0.65rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent queries mini-table */}
        <div className="glass" style={{ border: '1px solid rgba(6,182,212,0.12)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em' }}>RECENT QUERY ACTIVITY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'pulse-ring 2s ease infinite' }} />
              <span className="mono" style={{ color: '#10B981', fontSize: '0.62rem', fontWeight: 700 }}>LIVE</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 600 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '72px 110px 100px 1fr 64px 90px', padding: '0.55rem 1.5rem', gap: '0.75rem', borderBottom: '1px solid var(--bd)' }}>
                {['TIME', 'USER', 'DEPT', 'QUERY', 'RESP', 'STATUS'].map(h => (
                  <span key={h} className="mono" style={{ color: 'var(--t6)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em' }}>{h}</span>
                ))}
              </div>
              {RECENT.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                  style={{ display: 'grid', gridTemplateColumns: '72px 110px 100px 1fr 64px 90px', padding: '0.7rem 1.5rem', gap: '0.75rem', borderBottom: i < RECENT.length - 1 ? '1px solid var(--bd)' : 'none', alignItems: 'center', background: !r.ok ? 'rgba(239,68,68,0.03)' : 'transparent', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = r.ok ? 'rgba(6,182,212,0.03)' : 'rgba(239,68,68,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = !r.ok ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                  <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.68rem' }}>{r.ts}</span>
                  <span className="mono" style={{ color: '#06B6D4', fontSize: '0.72rem' }}>{r.user}</span>
                  <span style={{ color: 'var(--t4)', fontSize: '0.75rem' }}>{r.dept}</span>
                  <span style={{ color: 'var(--t3)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.q}</span>
                  <span className="mono" style={{ color: 'var(--t4)', fontSize: '0.68rem' }}>{r.ms}</span>
                  <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, textAlign: 'center', background: r.ok ? '#10B98118' : '#EF444418', color: r.ok ? '#10B981' : '#EF4444', border: `1px solid ${r.ok ? '#10B98130' : '#EF444430'}` }}>
                    {r.ok ? '✓ OK' : '⚡ BLOCKED'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Users tab ───────────────────────────────────────── */
function UsersTab({ data, tenant }) {
  return (
    <div style={{ padding: '3rem 1.5rem' }}>
      <div className="container">

        {/* User table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="label">User Governance</span>
            <h2 style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Role-Based Access Control
              {tenant !== 'global' && <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: TENANTS[tenant].color, fontWeight: 600 }}>— {TENANTS[tenant].label}</span>}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {Object.entries(ROLE_COLOR).map(([r, c]) => (
              <span key={r} className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: c + '18', color: c, border: `1px solid ${c}30` }}>{r}</span>
            ))}
          </div>
        </div>

        <div className="glass" style={{ overflow: 'hidden', marginBottom: '2rem', border: '1px solid rgba(6,182,212,0.12)' }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 640 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '0.6rem 1.5rem', background: 'var(--bg2)', borderBottom: '1px solid var(--bd)', gap: '0.75rem' }}>
                {['User', 'Role', 'Department', 'Status', 'Last Active'].map(h => (
                  <div key={h} className="mono" style={{ color: 'var(--t5)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em' }}>{h}</div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tenant} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {data.users.map((u, i) => (
                    <div key={u.n} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '0.85rem 1.5rem', alignItems: 'center', borderBottom: i < data.users.length - 1 ? '1px solid var(--bd)' : 'none', gap: '0.75rem', transition: 'background 0.15s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${ROLE_COLOR[u.r]}30, ${ROLE_COLOR[u.r]}15)`, border: `1px solid ${ROLE_COLOR[u.r]}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 800, color: ROLE_COLOR[u.r] }}>{u.av}</span>
                        </div>
                        <span style={{ color: 'var(--t1)', fontWeight: 600, fontSize: '0.875rem' }}>{u.n}</span>
                      </div>
                      <div>
                        <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: ROLE_COLOR[u.r] + '18', color: ROLE_COLOR[u.r], border: `1px solid ${ROLE_COLOR[u.r]}25` }}>{u.r}</span>
                      </div>
                      <div style={{ color: 'var(--t4)', fontSize: '0.82rem' }}>{u.d}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.s ? '#10B981' : '#EF4444', boxShadow: u.s ? '0 0 6px #10B981' : '0 0 6px #EF4444', flexShrink: 0 }} />
                        <span style={{ color: u.s ? '#10B981' : '#EF4444', fontSize: '0.78rem' }}>{u.s ? 'Active' : 'Suspended'}</span>
                      </div>
                      <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.72rem' }}>{u.l}</div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Permissions matrix */}
        <div>
          <span className="label" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>Permission Matrix</span>
          <div className="glass" style={{ overflow: 'hidden', border: '1px solid rgba(6,182,212,0.12)' }}>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 520 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(6, 1fr)', padding: '0.6rem 1.5rem', background: 'var(--bg2)', borderBottom: '1px solid var(--bd)', gap: '0.5rem' }}>
                  <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em' }}>ROLE</div>
                  {PERMS.map(p => <div key={p} className="mono" style={{ color: 'var(--t5)', fontSize: '0.58rem', fontWeight: 700, textAlign: 'center', letterSpacing: '0.06em' }}>{p}</div>)}
                </div>
                {ROLES.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px repeat(6, 1fr)', padding: '0.85rem 1.5rem', gap: '0.5rem', borderBottom: i < ROLES.length - 1 ? '1px solid var(--bd)' : 'none', alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 4, background: row.c + '18', color: row.c, width: 'fit-content', border: `1px solid ${row.c}25` }}>{row.r}</span>
                    {row.p.map((v, pi) => (
                      <div key={pi} style={{ textAlign: 'center' }}>
                        <motion.span whileHover={{ scale: 1.3 }} style={{ display: 'inline-block', color: v ? '#10B981' : 'var(--t6)', fontSize: v ? '1rem' : '0.85rem' }}>
                          {v ? '✓' : '—'}
                        </motion.span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Compliance tab ──────────────────────────────────── */
function ComplianceTab({ data, tenant }) {
  return (
    <div style={{ padding: '3rem 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

          {/* PII total */}
          <div className="glass" style={{ padding: '2rem', border: '1px solid rgba(239,68,68,0.15)' }}>
            <span className="label" style={{ color: '#F87171', borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)', marginBottom: '1.25rem', display: 'inline-block' }}>PII Redaction Shield</span>
            <AnimatePresence mode="wait">
              <motion.div key={tenant + '-pii'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>TOTAL REDACTED — LAST 30 DAYS</div>
                <div className="mono" style={{ color: '#F87171', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>{data.piiTotal}</div>
                {tenant !== 'global' && <div className="mono" style={{ color: TENANTS[tenant].color, fontSize: '0.65rem', marginTop: '0.4rem' }}>SCOPED: {TENANTS[tenant].label.toUpperCase()}</div>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* PII bars */}
          <div className="glass" style={{ padding: '2rem', border: '1px solid rgba(6,182,212,0.12)' }}>
            <div className="mono" style={{ color: '#06B6D4', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1.25rem' }}>BY CATEGORY</div>
            <AnimatePresence mode="wait">
              <motion.div key={tenant + '-bars'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {data.piiBars.map((bar, i) => (
                  <div key={bar.t} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="mono" style={{ width: 55, flexShrink: 0, fontSize: '0.65rem', fontWeight: 700, color: bar.c }}>{bar.t}</span>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 5, overflow: 'hidden', border: '1px solid var(--bd)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: bar.p + '%' }} transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', background: bar.c, borderRadius: 4 }} />
                    </div>
                    <span className="mono" style={{ width: 42, textAlign: 'right', color: 'var(--t5)', fontSize: '0.68rem' }}>{bar.n.toLocaleString()}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Compliance framework list */}
        <div className="glass" style={{ overflow: 'hidden', border: '1px solid rgba(6,182,212,0.12)' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--bd)' }}>
            <span className="label">Regulatory Compliance Status</span>
          </div>
          {COMPLIANCE_ITEMS.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px', gap: '1rem', padding: '0.95rem 1.5rem', borderBottom: i < COMPLIANCE_ITEMS.length - 1 ? '1px solid var(--bd)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ color: 'var(--t1)', fontWeight: 600, fontSize: '0.875rem' }}>{item.f}</span>
              <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, textAlign: 'center', background: item.c + '18', color: item.c, border: `1px solid ${item.c}30`, whiteSpace: 'nowrap' }}>
                {item.s === 'Full' ? '✓ ' : '◐ '}{item.s}
              </span>
              <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem' }}>Reviewed {item.last}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Live Feed tab ───────────────────────────────────── */
function FeedTab({ feed }) {
  const [filter, setFilter] = useState('all')
  const filtered = feed.filter(e => filter === 'all' || (filter === 'ok' ? e.ok : !e.ok))

  return (
    <div style={{ padding: '3rem 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', animation: 'pulse-ring 2s ease infinite' }} />
            <span className="mono" style={{ color: '#10B981', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE QUERY STREAM — UPDATING EVERY 2.8s</span>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[['all', 'All'], ['ok', '✓ OK'], ['blocked', '⚡ Blocked']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ padding: '0.4rem 0.85rem', borderRadius: 7, border: `1px solid ${filter === v ? 'rgba(6,182,212,0.4)' : 'var(--bd)'}`, background: filter === v ? 'rgba(6,182,212,0.1)' : 'transparent', color: filter === v ? '#06B6D4' : 'var(--t4)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.18s' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="glass" style={{ overflow: 'hidden', border: '1px solid rgba(6,182,212,0.12)' }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 640 }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '80px 120px 100px 1fr 64px 96px', padding: '0.55rem 1.5rem', gap: '0.75rem', background: 'var(--bg2)', borderBottom: '1px solid var(--bd)' }}>
                {['TIME', 'USER', 'DEPT', 'QUERY', 'RESP', 'STATUS'].map(h => (
                  <span key={h} className="mono" style={{ color: 'var(--t6)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em' }}>{h}</span>
                ))}
              </div>
              <AnimatePresence mode="popLayout">
                {filtered.slice(0, 15).map(entry => (
                  <motion.div key={entry.id}
                    layout
                    initial={{ opacity: 0, y: -12, background: 'rgba(6,182,212,0.06)' }}
                    animate={{ opacity: 1, y: 0, background: entry.ok ? 'transparent' : 'rgba(239,68,68,0.03)' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'grid', gridTemplateColumns: '80px 120px 100px 1fr 64px 96px', padding: '0.75rem 1.5rem', gap: '0.75rem', borderBottom: '1px solid var(--bd)', alignItems: 'center' }}>
                    <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.67rem' }}>{entry.ts}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="mono" style={{ fontSize: '0.5rem', fontWeight: 700, color: '#06B6D4' }}>{entry.user.slice(0,2).toUpperCase()}</span>
                      </div>
                      <span className="mono" style={{ color: '#06B6D4', fontSize: '0.68rem' }}>{entry.user}</span>
                    </div>
                    <span style={{ color: 'var(--t4)', fontSize: '0.75rem' }}>{entry.dept}</span>
                    <span style={{ color: 'var(--t3)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.q}</span>
                    <span className="mono" style={{ color: 'var(--t4)', fontSize: '0.68rem' }}>{entry.ms}</span>
                    <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, textAlign: 'center', background: entry.ok ? '#10B98118' : '#EF444418', color: entry.ok ? '#10B981' : '#EF4444', border: `1px solid ${entry.ok ? '#10B98130' : '#EF444430'}`, whiteSpace: 'nowrap' }}>
                      {entry.ok ? '✓ OK' : '⚡ BLOCK'}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
            ↳ SHOWING {Math.min(filtered.length, 15)} OF {filtered.length} EVENTS
          </span>
          <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
            EGRESS: 0 BYTES · INFERENCE: LOCAL · AUDIT: IMMUTABLE
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────── */
export default function AdminConsole() {
  const [tenant, setTenant] = useState('global')
  const [tab, setTab]       = useState('overview')
  const [feed, setFeed]     = useState(() =>
    LIVE_POOL.map((e, i) => ({
      ...e,
      id: i,
      ts: `10:${47 - i}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    }))
  )
  const poolIdx = useRef(0)

  useEffect(() => {
    if (tab !== 'feed') return
    const timer = setInterval(() => {
      const base = LIVE_POOL[poolIdx.current % LIVE_POOL.length]
      poolIdx.current++
      const now = new Date()
      const ts  = [now.getHours(), now.getMinutes(), now.getSeconds()].map(n => String(n).padStart(2, '0')).join(':')
      setFeed(prev => [{ ...base, id: Date.now(), ts }, ...prev.slice(0, 19)])
    }, 2800)
    return () => clearInterval(timer)
  }, [tab])

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>
      <Helmet>
        <title>Admin Console | AIDATARIS Sovereign AI</title>
        <meta name="description" content="Enterprise admin console for AIDATARIS — live system health, user governance, PII compliance tracking, and real-time query monitoring. All on-premise." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '4rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="label">Enterprise Admin Console</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Total Governance.{' '}
            <span style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Total Control.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }}
            style={{ color: 'var(--t4)', fontSize: '1rem', lineHeight: 1.75 }}>
            Manage users, monitor compliance, and govern every aspect of your Sovereign AI deployment — real-time, from a single pane of glass.
          </motion.p>

          {/* Live system status strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              { val: '6/6',  label: 'Services Online', c: '#10B981' },
              { val: '1,247', label: 'Queries Today',   c: '#06B6D4' },
              { val: '100%', label: 'Data On-Prem',    c: '#F59E0B' },
              { val: '38',   label: 'PII Blocked',      c: '#F87171' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: s.c, letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ color: 'var(--t5)', fontSize: '0.7rem', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ borderBottom: '1px solid var(--bd)', background: 'var(--bg2)', position: 'sticky', top: 88, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div className="container" style={{ padding: '0 1.5rem', display: 'flex', gap: '0.15rem', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '0.9rem 1.25rem',
                border: 'none', borderBottom: tab === t.id ? '2px solid #06B6D4' : '2px solid transparent',
                background: 'transparent', color: tab === t.id ? '#06B6D4' : 'var(--t4)',
                fontWeight: tab === t.id ? 700 : 500, fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', whiteSpace: 'nowrap',
                marginBottom: '-1px',
              }}
              onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.color = 'var(--t1)' } }}
              onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.color = 'var(--t4)' } }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
          {tab === 'overview'   && <OverviewTab    tenant={tenant} onTenantChange={setTenant} data={TENANTS[tenant]} />}
          {tab === 'users'      && <UsersTab        data={TENANTS[tenant]} tenant={tenant} />}
          {tab === 'compliance' && <ComplianceTab   data={TENANTS[tenant]} tenant={tenant} />}
          {tab === 'feed'       && <FeedTab         feed={feed} />}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: 'var(--bg2)', borderTop: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 900, color: 'var(--t1)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            See the Full Console With Your Data
          </h2>
          <p style={{ color: 'var(--t4)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Walk through the complete admin experience in a private demo scoped to your organisation's documents and users.
          </p>
          <Link to="/contact" className="btn-primary">Book a Private Demo →</Link>
        </div>
      </section>
    </main>
  )
}
