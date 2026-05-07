import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

/* ── Config ──────────────────────────────────────────────*/
const API_BASE  = typeof window !== 'undefined' ? window.location.origin : ''  // empty = same origin via Vite proxy; in production set to your server URL

const DURATION_OPTIONS = [
  { id: '30', label: '30 min', desc: 'Quick overview',   color: '#06B6D4' },
  { id: '60', label: '60 min', desc: 'Full discovery',   color: '#8B5CF6' },
  { id: '90', label: '90 min', desc: 'Deep dive + demo', color: '#F59E0B' },
]

const MEETING_TYPES = [
  { id: 'video',  icon: '📹', label: 'Video Call',    desc: 'Zoom / Teams / Meet' },
  { id: 'phone',  icon: '📞', label: 'Phone Call',    desc: 'We call you' },
  { id: 'onsite', icon: '🏢', label: 'On-site Perth', desc: 'Visit our office' },
]

const SECTORS = ['Mining & Energy', 'WA Government', 'Legal', 'Healthcare', 'Defence', 'Finance', 'Other']

const TIMEZONES = [
  { label: 'Perth — AWST (UTC+8)',            tz: 'Australia/Perth'     },
  { label: 'Sydney / Melbourne — AEST/AEDT',  tz: 'Australia/Sydney'    },
  { label: 'Brisbane — AEST (UTC+10)',         tz: 'Australia/Brisbane'  },
  { label: 'Adelaide — ACST/ACDT',            tz: 'Australia/Adelaide'  },
  { label: 'Darwin — ACST (UTC+9:30)',         tz: 'Australia/Darwin'    },
  { label: 'Auckland — NZST/NZDT',            tz: 'Pacific/Auckland'    },
  { label: 'Tokyo — JST (UTC+9)',              tz: 'Asia/Tokyo'          },
  { label: 'Hong Kong — HKT (UTC+8)',          tz: 'Asia/Hong_Kong'      },
  { label: 'Singapore — SGT (UTC+8)',          tz: 'Asia/Singapore'      },
  { label: 'Mumbai — IST (UTC+5:30)',          tz: 'Asia/Kolkata'        },
  { label: 'Dubai — GST (UTC+4)',              tz: 'Asia/Dubai'          },
  { label: 'London — GMT/BST',                tz: 'Europe/London'       },
  { label: 'Paris / Berlin — CET/CEST',       tz: 'Europe/Paris'        },
  { label: 'New York — EST/EDT',              tz: 'America/New_York'    },
  { label: 'Chicago — CST/CDT',              tz: 'America/Chicago'     },
  { label: 'Los Angeles — PST/PDT',           tz: 'America/Los_Angeles' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

/* ── Calendar helpers ────────────────────────────────────*/
function toYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildGrid(year, month) {
  const first   = new Date(year, month, 1)
  const daysInM = new Date(year, month + 1, 0).getDate()
  const offset  = first.getDay()        // 0=Sun
  const cells   = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInM; d++)   cells.push(new Date(year, month, d))
  return cells
}

/* ── Styles ──────────────────────────────────────────────*/
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
  return <div><label style={labelStyle}>{label}</label>{children}</div>
}
const focus = e => { e.target.style.borderColor = 'rgba(139,92,246,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)' }
const blur  = e => { e.target.style.borderColor = 'var(--input-bd)'; e.target.style.boxShadow = 'none' }

/* ── Main component ──────────────────────────────────────*/
export default function BookConsultation() {
  // Stable today reference — never recreated on re-render
  const todayRef = useRef((() => { const d = new Date(); d.setHours(0,0,0,0); return d })())
  const today = todayRef.current

  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  // Which days in current view have ≥1 slot (fetched in bulk)
  const [availMap,      setAvailMap]      = useState({})
  const [loadingMonth,  setLoadingMonth]  = useState(false)
  const fetchingRef = useRef(false)  // prevent duplicate in-flight fetches

  // Selected date + slots
  const [selectedDate, setSelectedDate]   = useState('')
  const [slots,        setSlots]          = useState([])
  const [loadingSlots, setLoadingSlots]   = useState(false)
  const [slotsError,   setSlotsError]     = useState('')

  // Booking
  const [selectedTime, setSelectedTime]   = useState('')
  const [duration,     setDuration]       = useState('60')
  const [meetingType,  setMeetingType]    = useState('video')
  const [form, setForm] = useState({ name: '', email: '', org: '', sector: '', notes: '' })
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [error,    setError]    = useState('')
  const [backendUp, setBackendUp] = useState(null)

  const [timezone, setTimezone] = useState(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return 'Australia/Perth' }
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  /* ── Convert an AWST "HH:MM" slot to the selected timezone ── */
  function convertSlot(awstTime) {
    try {
      const dt = new Date(`${selectedDate}T${awstTime}:00+08:00`)
      const display = dt.toLocaleTimeString('en-AU', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone,
      })
      const localDate = dt.toLocaleDateString('en-CA', { timeZone: timezone }) // YYYY-MM-DD
      return { display, diffDay: localDate !== selectedDate, localDate }
    } catch {
      return { display: awstTime, diffDay: false, localDate: selectedDate }
    }
  }

  function awstLabel(awstTime) {
    if (timezone === 'Australia/Perth') return awstTime
    return `${awstTime} AWST`
  }

  /* ── Check backend on mount ──────────────────────────── */
  useEffect(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    fetch(`${API_BASE}/api/availability?date=${toYMD(d)}&duration=60`)
      .then(r => setBackendUp(r.ok || r.status < 500))
      .catch(() => setBackendUp(false))
  }, [])

  /* ── Fetch availability for whole month ──────────────── */
  const fetchMonthAvailability = useCallback(async (year, month, dur) => {
    if (!backendUp) return
    if (fetchingRef.current) return   // already in-flight
    fetchingRef.current = true
    setLoadingMonth(true)
    const newMap = {}
    const grid = buildGrid(year, month)
    const weekdays = grid.filter(d => d && d >= today && d.getDay() !== 0 && d.getDay() !== 6)

    await Promise.all(weekdays.map(async d => {
      const key = toYMD(d)
      try {
        const r = await fetch(`${API_BASE}/api/availability?date=${key}&duration=${dur}`)
        const j = await r.json()
        newMap[key] = Array.isArray(j.slots) && j.slots.length > 0
      } catch {
        newMap[key] = false
      }
    }))

    setAvailMap(prev => ({ ...prev, ...newMap }))
    setLoadingMonth(false)
    fetchingRef.current = false
  }, [backendUp, today])   // today is stable (ref); duration passed as arg

  // Fetch when month changes or backend becomes available
  useEffect(() => {
    fetchMonthAvailability(calYear, calMonth, duration)
  }, [calYear, calMonth, backendUp])  // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Fetch slots for a specific date ─────────────────── */
  async function pickDate(dateStr) {
    setSelectedDate(dateStr)
    setSelectedTime('')
    setSlots([])
    setSlotsError('')

    if (!backendUp) {
      // static fallback slots
      setSlots(['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30'])
      return
    }

    setLoadingSlots(true)
    try {
      const r = await fetch(`${API_BASE}/api/availability?date=${dateStr}&duration=${duration}`)
      const j = await r.json()
      if (j.error) { setSlotsError(j.error); setSlots([]) }
      else setSlots(j.slots || [])
    } catch {
      setSlotsError('Could not load available slots. Please try again.')
    } finally {
      setLoadingSlots(false)
    }
  }

  /* ── Re-fetch slots when duration changes ────────────── */
  useEffect(() => {
    if (selectedDate) pickDate(selectedDate)
    fetchMonthAvailability(calYear, calMonth, duration)
  }, [duration])  // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Navigate months ─────────────────────────────────── */
  function prevMonth() {
    if (calYear === today.getFullYear() && calMonth === today.getMonth()) return
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  /* ── Submit booking ──────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) { setError('Please select a date and time.'); return }
    setLoading(true); setError('')

    const { display: localTime } = convertSlot(selectedTime)
    const payload = {
      ...form,
      preferredDate:     selectedDate,
      preferredTime:     selectedTime,          // always AWST for calendar
      clientTimezone:    timezone,
      clientLocalTime:   localTime,
      duration:          DURATION_OPTIONS.find(d => d.id === duration)?.label,
      meetingType:       MEETING_TYPES.find(m => m.id === meetingType)?.label,
    }

    try {
      const r = await fetch(`${API_BASE}/api/book`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const j = await r.json()
      if (r.ok) setDone(true)
      else setError(j.error || 'Booking failed. Please email support@aidataris.com.au')
    } catch {
      setError('Network error. Please email support@aidataris.com.au')
    } finally {
      setLoading(false)
    }
  }

  /* ── Day cell status ─────────────────────────────────── */
  function getDayStatus(d) {
    if (!d) return 'empty'
    if (d < today) return 'past'
    const dow = d.getDay()
    if (dow === 0 || dow === 6) return 'weekend'
    const key = toYMD(d)
    if (key === selectedDate) return 'selected'
    if (!backendUp) return 'unknown'
    if (availMap[key] === true)  return 'available'
    if (availMap[key] === false) return 'busy'
    return 'unknown'
  }

  function dayCellStyle(status) {
    const base = {
      width: 36, height: 36, borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.85rem', fontWeight: 600, cursor: 'default',
      border: '1px solid transparent', transition: 'all 0.15s',
      fontFamily: 'Inter, sans-serif',
    }
    switch (status) {
      case 'selected':  return { ...base, background: '#8B5CF6', color: '#fff', border: '1px solid #8B5CF6', boxShadow: '0 0 12px rgba(139,92,246,0.4)' }
      case 'available': return { ...base, background: 'rgba(6,182,212,0.1)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.3)', cursor: 'pointer' }
      case 'busy':      return { ...base, color: 'var(--t6)', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', textDecoration: 'line-through' }
      case 'past':
      case 'weekend':   return { ...base, color: 'var(--t6)', opacity: 0.4 }
      case 'unknown':   return { ...base, color: 'var(--t3)', cursor: 'pointer' }
      default:          return base
    }
  }

  const grid         = buildGrid(calYear, calMonth)
  const activeDur    = DURATION_OPTIONS.find(d => d.id === duration)
  const canGoPrev    = !(calYear === today.getFullYear() && calMonth === today.getMonth())

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 88 }}>
      <Helmet>
        <title>Book a Consultation | AIDATARIS — On-Premise AI Experts</title>
        <meta name="description" content="Schedule a private consultation with AIDATARIS. Pick a time that works for you — we'll confirm and send a calendar invite. Perth-based team." />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 700, height: 350, borderRadius: '50%', top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
          <div className="hero-grid" />
        </div>
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <span className="label">Book a Consultation</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 900, color: 'var(--t1)', margin: '1.25rem 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Schedule Time with a<br />
            <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Sovereign AI Expert.
            </span>
          </h1>
          <p style={{ color: 'var(--t4)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
            Pick a time that works for you. We'll send a calendar invite and prepare a session tailored to your organisation.
          </p>
        </div>
      </section>

      {/* ── Strip ─────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem 3rem', padding: '1rem 1.5rem' }}>
          {[
            { icon: '📅', text: backendUp ? 'Live availability from Google Calendar' : 'Request preferred time' },
            { icon: '✉',  text: 'Calendar invite sent automatically' },
            { icon: '📍', text: 'Perth, Western Australia' },
          ].map((item, i) => (
            <div key={i} className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--t4)', fontWeight: 600, letterSpacing: '0.06em' }}>
              <span>{item.icon}</span> {item.text.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={{ maxWidth: 560, margin: '0 auto', padding: '5rem 2rem', textAlign: 'center', border: '1px solid rgba(16,185,129,0.25)' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  style={{ width: 72, height: 72, borderRadius: '50%', background: '#10B98115', border: '1px solid #10B98135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
                  ✓
                </motion.div>
                <h3 style={{ color: '#10B981', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.75rem' }}>Consultation Booked</h3>
                <p style={{ color: 'var(--t4)', lineHeight: 1.75, maxWidth: 360, margin: '0 auto 1.5rem' }}>
                  Your session has been submitted. Check your inbox for a calendar invite — we'll confirm within 1 business day.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxWidth: 320, margin: '0 auto 2rem', textAlign: 'left' }}>
                  {[
                    { label: 'DATE',   val: selectedDate },
                    { label: 'TIME',   val: (() => { try { const dt = new Date(`${selectedDate}T${selectedTime}:00+08:00`); const local = dt.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone }); return timezone === 'Australia/Perth' ? local + ' AWST' : `${local} (${selectedTime} AWST)` } catch { return selectedTime + ' AWST' } })() },
                    { label: 'FORMAT', val: MEETING_TYPES.find(m => m.id === meetingType)?.label },
                    { label: 'LENGTH', val: activeDur?.label },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '0.65rem 0.85rem', borderRadius: 8, background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)' }}>
                      <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.58rem', letterSpacing: '0.1em' }}>{r.label}</div>
                      <div style={{ color: 'var(--t1)', fontSize: '0.85rem', fontWeight: 600, marginTop: 2 }}>{r.val}</div>
                    </div>
                  ))}
                </div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--t5)', letterSpacing: '0.08em' }}>AIDATARIS · PERTH, WESTERN AUSTRALIA</div>
              </motion.div>
            ) : (
              <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

                  {/* ── LEFT: Calendar ─────────────────────── */}
                  <div>
                    {/* Duration selector */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={labelStyle}>SESSION LENGTH</div>
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        {DURATION_OPTIONS.map(d => (
                          <button key={d.id} type="button" onClick={() => setDuration(d.id)}
                            style={{
                              flex: 1, padding: '0.65rem 0.5rem', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                              background: duration === d.id ? d.color + '15' : 'var(--glass-bg)',
                              border: `1px solid ${duration === d.id ? d.color + '55' : 'var(--glass-bd)'}`,
                              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                            }}>
                            <div style={{ color: duration === d.id ? d.color : 'var(--t2)', fontWeight: 800, fontSize: '0.9rem' }}>{d.label}</div>
                            <div style={{ color: 'var(--t5)', fontSize: '0.65rem', marginTop: '0.15rem' }}>{d.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Month calendar */}
                    <div className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(139,92,246,0.15)' }}>
                      {/* Month header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <button onClick={prevMonth} disabled={!canGoPrev}
                          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--glass-bd)', background: 'var(--glass-bg)', cursor: canGoPrev ? 'pointer' : 'not-allowed', color: canGoPrev ? 'var(--t2)' : 'var(--t6)', fontFamily: 'Inter,sans-serif', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: canGoPrev ? 1 : 0.35 }}>
                          ‹
                        </button>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1rem' }}>{MONTHS[calMonth]}</div>
                          <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>{calYear}</div>
                        </div>
                        <button onClick={nextMonth}
                          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--glass-bd)', background: 'var(--glass-bg)', cursor: 'pointer', color: 'var(--t2)', fontFamily: 'Inter,sans-serif', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ›
                        </button>
                      </div>

                      {/* Day-of-week headers */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '0.5rem' }}>
                        {DAYS.map(d => (
                          <div key={d} className="mono" style={{ textAlign: 'center', fontSize: '0.58rem', fontWeight: 700, color: 'var(--t5)', letterSpacing: '0.06em', padding: '0.25rem 0' }}>{d}</div>
                        ))}
                      </div>

                      {/* Day cells */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
                        {grid.map((d, i) => {
                          if (!d) return <div key={i} />
                          const status = getDayStatus(d)
                          const isClickable = status === 'available' || status === 'unknown'
                          return (
                            <motion.button key={i} type="button"
                              whileHover={isClickable ? { scale: 1.12 } : {}}
                              whileTap={isClickable ? { scale: 0.95 } : {}}
                              onClick={() => isClickable && pickDate(toYMD(d))}
                              style={dayCellStyle(status)}>
                              {d.getDate()}
                            </motion.button>
                          )
                        })}
                      </div>

                      {/* Legend */}
                      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--bd)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {[
                          { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', label: 'Available' },
                          { color: '#EF4444', bg: 'rgba(239,68,68,0.05)', label: 'Booked' },
                          { color: '#8B5CF6', bg: '#8B5CF6', label: 'Selected', textCol: '#fff' },
                        ].map(l => (
                          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.bg, border: `1px solid ${l.color}50` }} />
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--t5)', letterSpacing: '0.06em' }}>{l.label}</span>
                          </div>
                        ))}
                        {loadingMonth && (
                          <div className="mono" style={{ fontSize: '0.6rem', color: '#06B6D4', letterSpacing: '0.06em', marginLeft: 'auto' }}>
                            ↻ checking availability…
                          </div>
                        )}
                      </div>

                      {!backendUp && (
                        <div style={{ marginTop: '0.85rem', padding: '0.6rem 0.85rem', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.75rem', color: '#F59E0B', lineHeight: 1.5 }}>
                          ⚡ Backend not connected — select any weekday. We'll confirm availability when we respond.
                        </div>
                      )}
                    </div>

                    {/* Meeting type */}
                    <div style={{ marginTop: '1.5rem' }}>
                      <div style={labelStyle}>MEETING FORMAT</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {MEETING_TYPES.map(m => (
                          <button key={m.id} type="button" onClick={() => setMeetingType(m.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1rem',
                              borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                              background: meetingType === m.id ? 'rgba(139,92,246,0.1)' : 'var(--glass-bg)',
                              border: `1px solid ${meetingType === m.id ? 'rgba(139,92,246,0.45)' : 'var(--glass-bd)'}`,
                              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                            }}>
                            <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                            <div>
                              <div style={{ color: meetingType === m.id ? '#8B5CF6' : 'var(--t2)', fontWeight: 700, fontSize: '0.85rem' }}>{m.label}</div>
                              <div style={{ color: 'var(--t5)', fontSize: '0.7rem' }}>{m.desc}</div>
                            </div>
                            {meetingType === m.id && <span style={{ marginLeft: 'auto', color: '#8B5CF6', fontSize: '0.8rem' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT: Slots + Form ─────────────────── */}
                  <div>

                    {/* Timezone selector */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={labelStyle}>🌐 YOUR TIMEZONE</div>
                      <select
                        value={TIMEZONES.find(t => t.tz === timezone) ? timezone : '__custom__'}
                        onChange={e => setTimezone(e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                        onFocus={focus} onBlur={blur}
                      >
                        {!TIMEZONES.find(t => t.tz === timezone) && (
                          <option value="__custom__">{timezone}</option>
                        )}
                        {TIMEZONES.map(t => (
                          <option key={t.tz} value={t.tz} style={{ background: 'var(--bg)' }}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Time slots panel */}
                    <AnimatePresence mode="wait">
                      {selectedDate && (
                        <motion.div key={selectedDate}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          style={{ marginBottom: '2rem' }}>
                          <div style={labelStyle}>
                            AVAILABLE TIMES — {selectedDate}
                            {backendUp && <span style={{ color: '#10B981', marginLeft: '0.5rem' }}>● LIVE</span>}
                          </div>

                          {loadingSlots ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--t5)', fontSize: '0.85rem' }}>
                              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                Checking Google Calendar…
                              </motion.span>
                            </div>
                          ) : slotsError ? (
                            <div style={{ padding: '1rem', borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', fontSize: '0.82rem' }}>
                              {slotsError}
                            </div>
                          ) : slots.length === 0 ? (
                            <div style={{ padding: '1.5rem', borderRadius: 10, background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)', textAlign: 'center' }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
                              <div style={{ color: 'var(--t3)', fontSize: '0.875rem' }}>No available slots on this date.</div>
                              <div style={{ color: 'var(--t5)', fontSize: '0.78rem', marginTop: '0.35rem' }}>Please pick another day.</div>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                              {slots.map(t => {
                                const { display, diffDay, localDate } = convertSlot(t)
                                const isSelected = selectedTime === t
                                return (
                                  <motion.button key={t} type="button"
                                    onClick={() => setSelectedTime(t)}
                                    whileTap={{ scale: 0.92 }}
                                    style={{
                                      padding: '0.6rem 0.35rem', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                                      background: isSelected ? '#8B5CF6' : 'var(--glass-bg)',
                                      border: `1px solid ${isSelected ? '#8B5CF6' : 'rgba(139,92,246,0.15)'}`,
                                      color: isSelected ? '#fff' : 'var(--t2)',
                                      fontWeight: isSelected ? 700 : 500,
                                      fontSize: '0.82rem', transition: 'all 0.15s',
                                      fontFamily: 'Inter, sans-serif',
                                    }}>
                                    <div>{display}</div>
                                    {diffDay && (
                                      <div style={{ fontSize: '0.58rem', opacity: 0.7, marginTop: 1 }}>
                                        {new Date(localDate + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                                      </div>
                                    )}
                                    {timezone !== 'Australia/Perth' && (
                                      <div style={{ fontSize: '0.58rem', opacity: isSelected ? 0.8 : 0.45, marginTop: 1 }}>{t} AWST</div>
                                    )}
                                  </motion.button>
                                )
                              })}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {!selectedDate && (
                        <motion.div key="prompt"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          style={{ marginBottom: '2rem', padding: '2.5rem', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)', textAlign: 'center' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</div>
                          <div style={{ color: 'var(--t3)', fontSize: '0.9rem', lineHeight: 1.6 }}>Select a date from the calendar<br />to see available time slots.</div>
                          {backendUp === false && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#F59E0B' }}>
                              Showing static slots — backend not connected.
                            </div>
                          )}
                          {backendUp === true && (
                            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981', display: 'inline-block' }} />
                              <span className="mono" style={{ fontSize: '0.62rem', color: '#10B981', letterSpacing: '0.08em' }}>LIVE GOOGLE CALENDAR SYNC ACTIVE</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Details form */}
                    <AnimatePresence>
                      {selectedTime && (
                        <motion.form key="form"
                          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                          onSubmit={handleSubmit}
                          style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                          {/* Selected slot summary */}
                          <div style={{ padding: '1rem 1.25rem', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                              { label: 'DATE',   val: selectedDate },
                              { label: 'TIME',   val: (() => { const { display } = convertSlot(selectedTime); return timezone === 'Australia/Perth' ? display + ' AWST' : `${display} (${selectedTime} AWST)` })() },
                              { label: 'LENGTH', val: activeDur?.label },
                            ].map(r => (
                              <div key={r.label}>
                                <div className="mono" style={{ color: 'var(--t5)', fontSize: '0.58rem', letterSpacing: '0.1em' }}>{r.label}</div>
                                <div style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '0.9rem' }}>{r.val}</div>
                              </div>
                            ))}
                            <button type="button" onClick={() => setSelectedTime('')}
                              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--t5)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Inter,sans-serif' }}>
                              ✕ change
                            </button>
                          </div>

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
                                <option value="">Select sector…</option>
                                {SECTORS.map(s => <option key={s} value={s} style={{ background: 'var(--bg)' }}>{s}</option>)}
                              </select>
                            </Field>
                          </div>

                          <Field label="AGENDA — WHAT WOULD YOU LIKE TO COVER?">
                            <textarea rows={4} value={form.notes} onChange={set('notes')}
                              placeholder="Briefly describe your use case, current environment, or specific questions you'd like answered…"
                              style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
                          </Field>

                          {error && (
                            <div style={{ padding: '0.75rem 1rem', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171', fontSize: '0.82rem' }}>
                              {error}
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <button type="submit" disabled={loading} className="btn-primary"
                              style={{ background: '#8B5CF6', fontSize: '0.95rem', padding: '0.875rem 2rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                              {loading ? 'Booking…' : 'Confirm Booking →'}
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                              <span className="mono" style={{ color: 'var(--t5)', fontSize: '0.62rem', letterSpacing: '0.08em' }}>CALENDAR INVITE SENT TO YOUR EMAIL</span>
                            </div>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* What to expect sidebar card */}
                    {!selectedTime && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(139,92,246,0.12)' }}>
                        <div className="mono" style={{ color: '#8B5CF6', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem' }}>WHAT TO EXPECT</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {[
                            { step: '01', text: 'Pick a date and time — you\'ll see only slots when Expert is free.' },
                            { step: '02', text: 'A Google Calendar invite is sent automatically to your email.' },
                            { step: '03', text: 'We prepare based on your sector, use case, and agenda.' },
                            { step: '04', text: 'Session runs with a senior AIDATARIS engineer, not a sales rep.' },
                          ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                              <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8B5CF6', flexShrink: 0, marginTop: 2 }}>{s.step}</span>
                              <span style={{ color: 'var(--t4)', fontSize: '0.83rem', lineHeight: 1.6 }}>{s.text}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem 5rem', background: 'var(--bg2)' }}>
        <hr className="divider" style={{ marginBottom: '3rem' }} />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {[
              { icon: '📅', stat: 'Live Sync',   label: 'Google Calendar',        color: '#8B5CF6' },
              { icon: '✉',  stat: 'Auto',        label: 'Calendar Invite Sent',   color: '#06B6D4' },
              { icon: '🌏', stat: 'Perth WA',    label: 'Australian-Owned',       color: '#F59E0B' },
              { icon: '🔒', stat: 'NDA Ready',   label: 'On Request',             color: '#10B981' },
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
