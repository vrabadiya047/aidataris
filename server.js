/**
 * AIDATARIS — Google Calendar Booking Server
 *
 * Endpoints:
 *   GET  /api/availability?date=YYYY-MM-DD&duration=60  → { slots: ['09:00', '09:30', …] }
 *   POST /api/book  body: { name, email, org, sector, date, time, duration, meetingType, notes }
 *
 * Setup (one-time):
 *   1. Google Cloud Console → select/create project → Enable "Google Calendar API"
 *   2. IAM & Admin → Service Accounts → Create service account → Create JSON key → save as service-account.json
 *   3. Google Calendar → Settings (gear) → your calendar → Share with specific people
 *      Add the service account email (ends in .iam.gserviceaccount.com) → "Make changes to events"
 *   4. Create .env:
 *        CALENDAR_ID=your@gmail.com
 *        GOOGLE_SERVICE_ACCOUNT_KEY=./service-account.json
 *   5. Run:  node server.js
 */

import { readFileSync, existsSync } from 'fs'
import { createServer }             from 'http'
import { join, dirname, resolve }   from 'path'
import { fileURLToPath }            from 'url'
import nodemailer                   from 'nodemailer'

const __dirname = dirname(fileURLToPath(import.meta.url))

/* ── Load .env ─────────────────────────────────────────── */
try {
  readFileSync(join(__dirname, '.env'), 'utf8')
    .split('\n')
    .forEach(line => {
      const eq = line.indexOf('=')
      if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    })
} catch { /* no .env — use real env vars */ }

const PORT         = process.env.PORT                       || 3001
const CALENDAR_ID  = process.env.CALENDAR_ID                || process.env.GOOGLE_CALENDAR_ID
const KEY_FILE     = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || './service-account.json'
const API_KEY      = process.env.GOOGLE_API_KEY  // fallback for read-only public calendar

const SMTP_HOST    = process.env.SMTP_HOST || 'smtp.hostinger.com'
const SMTP_PORT    = parseInt(process.env.SMTP_PORT || '465', 10)
const SMTP_USER    = process.env.SMTP_USER  // support@aidataris.com.au
const SMTP_PASS    = process.env.SMTP_PASS

/* ── Working hours (AWST = UTC+8) ──────────────────────── */
const DAY_START = 9    // 9 am
const DAY_END   = 17   // 5 pm
const SLOT_MIN  = 30   // slot granularity in minutes
const TZ        = '+08:00'

/* ── Google Calendar client ─────────────────────────────── */
// Do NOT cache the calendar instance — service account JWT tokens expire
// after 1 hour and a cached client won't refresh them reliably.
// We cache only the imported google module (heavy import, stays stable).
let _google = null

async function getCalendar() {
  if (!existsSync(KEY_FILE)) return null
  try {
    if (!_google) {
      const mod = await import('googleapis')
      _google = mod.google
    }
    const auth = new _google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes:  ['https://www.googleapis.com/auth/calendar'],
    })
    return _google.calendar({ version: 'v3', auth })
  } catch (err) {
    console.error('Calendar auth failed:', err.message)
    return null
  }
}

/* ── Fetch busy blocks for a date ───────────────────────── */
async function getBusyBlocks(date) {
  const dayMin = new Date(`${date}T${String(DAY_START).padStart(2, '0')}:00:00${TZ}`)
  const dayMax = new Date(`${date}T${String(DAY_END).padStart(2, '0')}:00:00${TZ}`)

  const cal = await getCalendar()

  if (cal && CALENDAR_ID) {
    let resp
    try {
      resp = await cal.events.list({
        calendarId:   CALENDAR_ID,
        timeMin:      dayMin.toISOString(),
        timeMax:      dayMax.toISOString(),
        singleEvents: true,
        orderBy:      'startTime',
      })
    } catch (err) {
      const status  = err?.response?.status
      const message = err?.response?.data?.error?.message || err.message
      if (status === 404) {
        throw new Error(
          `Calendar not found (404).\n` +
          `  CALENDAR_ID in .env = "${CALENDAR_ID}"\n` +
          `  Fix: Make sure this is your exact Google Calendar ID (usually your Gmail address).\n` +
          `  Then share that calendar with your service account email and try again.`
        )
      }
      if (status === 403) {
        throw new Error(
          `Permission denied (403).\n` +
          `  The service account does not have access to calendar "${CALENDAR_ID}".\n` +
          `  Fix: Open Google Calendar → Settings → Share with specific people\n` +
          `       → add the service account email with "Make changes to events" permission.`
        )
      }
      throw new Error(`Google Calendar API error ${status || ''}: ${message}`)
    }
    return (resp.data.items || [])
      .filter(e => e.status !== 'cancelled' && (e.start.dateTime || e.start.date))
      .map(e => ({
        start: new Date(e.start.dateTime || e.start.date),
        end:   new Date(e.end.dateTime   || e.end.date),
      }))
  }

  if (API_KEY && CALENDAR_ID) {
    const body = JSON.stringify({
      timeMin: dayMin.toISOString(),
      timeMax: dayMax.toISOString(),
      items: [{ id: CALENDAR_ID }],
    })
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
    )
    const data = await res.json()
    return (data.calendars?.[CALENDAR_ID]?.busy || [])
      .map(b => ({ start: new Date(b.start), end: new Date(b.end) }))
  }

  throw new Error('No Google Calendar credentials configured. Add service-account.json or GOOGLE_API_KEY to .env')
}

/* ── Available time slots ───────────────────────────────── */
async function getAvailableSlots(date, durationMins) {
  const busy = await getBusyBlocks(date)
  const slots = []
  const origin = new Date(`${date}T${String(DAY_START).padStart(2, '0')}:00:00${TZ}`)
  const limit  = new Date(`${date}T${String(DAY_END).padStart(2, '0')}:00:00${TZ}`)
  const cur    = new Date(origin)

  while (cur < limit) {
    const slotEnd = new Date(cur.getTime() + durationMins * 60_000)
    if (slotEnd <= limit) {
      const overlaps = busy.some(b => cur < b.end && slotEnd > b.start)
      if (!overlaps) {
        slots.push(
          `${String(cur.getHours()).padStart(2, '0')}:${String(cur.getMinutes()).padStart(2, '0')}`
        )
      }
    }
    cur.setMinutes(cur.getMinutes() + SLOT_MIN)
  }

  return slots
}

/* ── Create calendar event ──────────────────────────────── */
async function createBooking(body) {
  const { name, email, org, sector, meetingType, notes } = body
  const date     = body.date     || body.preferredDate
  const time     = body.time     || body.preferredTime
  const duration = body.duration || body.sessionDuration

  const cal = await getCalendar()
  if (!cal) throw new Error('Event creation requires service-account.json — see server.js setup instructions.')
  if (!CALENDAR_ID) throw new Error('CALENDAR_ID not set in .env')
  if (!date) throw new Error('date is required')
  if (!time) throw new Error('time is required')

  const [h, m]  = time.split(':').map(Number)
  const startDT = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00${TZ}`)
  const endDT   = new Date(startDT.getTime() + parseInt(duration, 10) * 60_000)

  const desc = [
    `Client:       ${name}`,
    `Email:        ${email}`,
    `Organisation: ${org || '—'}`,
    `Sector:       ${sector || '—'}`,
    `Format:       ${meetingType || '—'}`,
    notes ? `\nAgenda:\n${notes}` : '',
  ].join('\n').trim()

  const resp = await cal.events.insert({
    calendarId: CALENDAR_ID,
    resource: {
      summary:     `Consultation — ${name}${org ? ' · ' + org : ''}`,
      description: desc,
      start: { dateTime: startDT.toISOString(), timeZone: 'Australia/Perth' },
      end:   { dateTime: endDT.toISOString(),   timeZone: 'Australia/Perth' },
      // Attendee invites require Google Workspace domain delegation.
      // Client is notified via Formspree email instead.
    },
  })
  return resp.data
}

/* ── Send booking emails ────────────────────────────────── */
async function sendBookingEmails(body, calEvent) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠  SMTP not configured — skipping email. Add SMTP_USER and SMTP_PASS to .env')
    return
  }

  const transporter = nodemailer.createTransport({
    host:   SMTP_HOST,
    port:   SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const { name, email, org, sector, meetingType, notes, clientTimezone, clientLocalTime } = body
  const date     = body.date     || body.preferredDate
  const time     = body.time     || body.preferredTime
  const duration = body.duration

  const timeDisplay = clientLocalTime && clientTimezone && clientTimezone !== 'Australia/Perth'
    ? `${clientLocalTime} local (${time} AWST)`
    : `${time} AWST`

  const calLink = calEvent?.htmlLink
    ? `<p><a href="${calEvent.htmlLink}" style="color:#8B5CF6">Open in Google Calendar →</a></p>`
    : ''

  // ── Notification to you ─────────────────────────────────
  await transporter.sendMail({
    from:    `"AIDATARIS Bookings" <${SMTP_USER}>`,
    to:      SMTP_USER,
    subject: `New Booking: ${name}${org ? ' · ' + org : ''} — ${date} at ${time} AWST`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
        <div style="background:#0f0f1a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#8B5CF6;margin:0;font-size:1.3rem;letter-spacing:-0.02em">New Consultation Booking</h2>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            ${[
              ['Client',       name],
              ['Email',        `<a href="mailto:${email}">${email}</a>`],
              ['Organisation', org      || '—'],
              ['Sector',       sector   || '—'],
              ['Date',         date],
              ['Time',         timeDisplay],
              ['Duration',     duration || '—'],
              ['Format',       meetingType || '—'],
              ['Timezone',     clientTimezone || 'Australia/Perth'],
            ].map(([k, v]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.8rem;font-weight:700;letter-spacing:0.06em;width:36%;text-transform:uppercase">${k}</td>
                <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:0.9rem;font-weight:600">${v}</td>
              </tr>`).join('')}
          </table>
          ${notes ? `<div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;border-left:3px solid #8B5CF6"><p style="margin:0 0 6px;color:#6b7280;font-size:0.75rem;font-weight:700;letter-spacing:0.06em">AGENDA</p><p style="margin:0;color:#374151;font-size:0.9rem;line-height:1.6">${notes.replace(/\n/g,'<br>')}</p></div>` : ''}
          ${calLink}
          <p style="margin-top:24px;color:#9ca3af;font-size:0.78rem">This booking was submitted via the AIDATARIS website calendar.</p>
        </div>
      </div>`,
  })

  // ── Confirmation to the client ──────────────────────────
  await transporter.sendMail({
    from:    `"AIDATARIS" <${SMTP_USER}>`,
    to:      email,
    subject: `Your AIDATARIS Consultation is Confirmed — ${date}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
        <div style="background:#0f0f1a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#06B6D4;margin:0;font-size:1.3rem;letter-spacing:-0.02em">Consultation Confirmed</h2>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:0.88rem">AIDATARIS — Sovereign AI for Serious Organisations</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 24px">Hi ${name}, thanks for booking a consultation. Here are your session details:</p>
          <div style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:24px">
            ${[
              ['Date',     date],
              ['Time',     timeDisplay],
              ['Duration', duration || '—'],
              ['Format',   meetingType || '—'],
            ].map(([k, v]) => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb">
                <span style="color:#6b7280;font-size:0.78rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase">${k}</span>
                <span style="color:#111827;font-size:0.88rem;font-weight:600">${v}</span>
              </div>`).join('')}
          </div>
          <p style="color:#374151;font-size:0.88rem;line-height:1.6">We'll be in touch within 1 business day to confirm and share a meeting link. If anything changes, reply to this email or contact us at <a href="mailto:${SMTP_USER}" style="color:#8B5CF6">${SMTP_USER}</a>.</p>
          <p style="margin-top:24px;color:#9ca3af;font-size:0.78rem">AIDATARIS · Perth, Western Australia · aidataris.com.au</p>
        </div>
      </div>`,
  })

  console.log(`✉  Emails sent — notify: ${SMTP_USER}, confirm: ${email}`)
}

/* ── Send contact-form email ────────────────────────────── */
async function sendContactEmail(body) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠  SMTP not configured — skipping contact email.')
    return
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const { name, email, org, sector, inquiryType, msg } = body

  const row = (k, v) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.78rem;font-weight:700;letter-spacing:0.06em;width:34%;text-transform:uppercase;vertical-align:top">${k}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:0.88rem;font-weight:600">${v}</td>
    </tr>`

  // Notification to support
  await transporter.sendMail({
    from:    `"AIDATARIS Contact" <${SMTP_USER}>`,
    to:      SMTP_USER,
    subject: `[${inquiryType || 'Enquiry'}] ${name}${org ? ' · ' + org : ''}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#0f0f1a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#06B6D4;margin:0;font-size:1.2rem">New Contact Enquiry</h2>
          <p style="color:#475569;margin:6px 0 0;font-size:0.82rem">${inquiryType || 'General'}</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            ${row('Name', name)}
            ${row('Email', `<a href="mailto:${email}" style="color:#06B6D4">${email}</a>`)}
            ${row('Organisation', org || '—')}
            ${row('Sector', sector || '—')}
            ${row('Type', inquiryType || '—')}
          </table>
          ${msg ? `<div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;border-left:3px solid #06B6D4"><p style="margin:0 0 6px;color:#6b7280;font-size:0.72rem;font-weight:700;letter-spacing:0.06em">MESSAGE</p><p style="margin:0;color:#374151;font-size:0.88rem;line-height:1.65">${msg.replace(/\n/g, '<br>')}</p></div>` : ''}
          <p style="margin-top:24px;color:#9ca3af;font-size:0.75rem">Submitted via the AIDATARIS contact form.</p>
        </div>
      </div>`,
  })

  // Auto-reply to sender
  await transporter.sendMail({
    from:    `"AIDATARIS" <${SMTP_USER}>`,
    to:      email,
    subject: 'We received your enquiry — AIDATARIS',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#0f0f1a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#06B6D4;margin:0;font-size:1.2rem">Thanks for reaching out, ${name.split(' ')[0]}.</h2>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:0.92rem;line-height:1.65;margin:0 0 16px">We've received your ${inquiryType ? inquiryType.toLowerCase() : 'enquiry'} and will respond within 1 business day.</p>
          <p style="color:#374151;font-size:0.88rem;line-height:1.65;margin:0 0 24px">In the meantime, if your matter is urgent you can reply directly to this email and we'll prioritise it.</p>
          <p style="color:#9ca3af;font-size:0.75rem;margin:0">AIDATARIS · Perth, Western Australia · <a href="mailto:${SMTP_USER}" style="color:#06B6D4">${SMTP_USER}</a></p>
        </div>
      </div>`,
  })

  console.log(`✉  Contact email sent — notify: ${SMTP_USER}, reply-to: ${email}`)
}

/* ── Send subscriber email ──────────────────────────────── */
async function sendSubscribeEmail(body) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠  SMTP not configured — skipping subscribe email.')
    return
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const { name, email, industry } = body

  // Notification to support
  await transporter.sendMail({
    from:    `"AIDATARIS" <${SMTP_USER}>`,
    to:      SMTP_USER,
    subject: `New Subscriber: ${name} — ${industry || 'Unknown sector'}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#0f0f1a;padding:20px 28px;border-radius:12px 12px 0 0">
          <h2 style="color:#8B5CF6;margin:0;font-size:1.1rem">New Stay Informed Signup</h2>
        </div>
        <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.75rem;font-weight:700;width:34%;text-transform:uppercase">Name</td><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:0.88rem;font-weight:600">${name}</td></tr>
            <tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.75rem;font-weight:700;text-transform:uppercase">Email</td><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:0.88rem;font-weight:600"><a href="mailto:${email}" style="color:#8B5CF6">${email}</a></td></tr>
            <tr><td style="padding:9px 0;color:#6b7280;font-size:0.75rem;font-weight:700;text-transform:uppercase">Industry</td><td style="padding:9px 0;color:#111827;font-size:0.88rem;font-weight:600">${industry || '—'}</td></tr>
          </table>
          <p style="margin-top:20px;color:#9ca3af;font-size:0.73rem">Footer "Stay Informed" form · AIDATARIS website</p>
        </div>
      </div>`,
  })

  // Confirmation to subscriber
  await transporter.sendMail({
    from:    `"AIDATARIS" <${SMTP_USER}>`,
    to:      email,
    subject: 'You\'re on the list — AIDATARIS Insights',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#0f0f1a;padding:20px 28px;border-radius:12px 12px 0 0">
          <h2 style="color:#8B5CF6;margin:0;font-size:1.1rem">You're on the list, ${name.split(' ')[0]}.</h2>
        </div>
        <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:0.9rem;line-height:1.65;margin:0 0 14px">We'll send you relevant sovereign AI case studies, compliance updates, and product news — no more than once or twice a month, and only content relevant to <strong>${industry || 'your sector'}</strong>.</p>
          <p style="color:#374151;font-size:0.88rem;line-height:1.65;margin:0 0 20px">No spam. Unsubscribe any time by replying to this email.</p>
          <p style="color:#9ca3af;font-size:0.73rem;margin:0">AIDATARIS · Perth, Western Australia · <a href="mailto:${SMTP_USER}" style="color:#8B5CF6">${SMTP_USER}</a></p>
        </div>
      </div>`,
  })

  console.log(`✉  Subscribe email sent — notify: ${SMTP_USER}, confirm: ${email}`)
}

/* ── Date helper ────────────────────────────────────────── */
export function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* ── Pure slot calculator (exported for tests) ──────────── */
export function computeSlots(busyBlocks, date, durationMins, dayStart = DAY_START, dayEnd = DAY_END, slotMin = SLOT_MIN, tz = TZ) {
  const slots  = []
  const origin = new Date(`${date}T${String(dayStart).padStart(2, '0')}:00:00${tz}`)
  const limit  = new Date(`${date}T${String(dayEnd).padStart(2, '0')}:00:00${tz}`)
  const cur    = new Date(origin)
  while (cur < limit) {
    const slotEnd = new Date(cur.getTime() + durationMins * 60_000)
    if (slotEnd <= limit) {
      const overlaps = busyBlocks.some(b => cur < b.end && slotEnd > b.start)
      if (!overlaps) slots.push(`${String(cur.getUTCHours() + 8).padStart(2, '0').slice(-2)}:${String(cur.getUTCMinutes()).padStart(2, '0')}`)
    }
    cur.setMinutes(cur.getMinutes() + slotMin)
  }
  return slots
}

/* ── Read POST body ─────────────────────────────────────── */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', c => { raw += c })
    req.on('end',  () => { try { resolve(JSON.parse(raw)) } catch { resolve({}) } })
    req.on('error', reject)
  })
}

/* ── Helper: JSON response ──────────────────────────────── */
function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(status)
  res.end(JSON.stringify(body))
}

/* ── HTTP request handler (exported for tests) ──────────── */
export async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  const url = new URL(req.url, `http://localhost:${PORT}`)

  /* GET /api/status — configuration check */
  if (req.method === 'GET' && url.pathname === '/api/status') {
    const cal = await getCalendar()
    let calendarAccessible = false
    let calendarError = null
    if (cal && CALENDAR_ID) {
      try {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const d = toDateStr(tomorrow)
        await getBusyBlocks(d)
        calendarAccessible = true
      } catch (err) {
        calendarError = err.message
      }
    }
    json(res, 200, {
      serviceAccount: existsSync(KEY_FILE),
      calendarId:     CALENDAR_ID || null,
      authenticated:  !!cal,
      calendarAccessible,
      calendarError,
      workingHours:   `${DAY_START}:00 – ${DAY_END}:00 AWST (Mon–Fri)`,
      slotInterval:   `${SLOT_MIN} min`,
    })
    return
  }

  /* GET /api/availability?date=YYYY-MM-DD&duration=60 */
  if (req.method === 'GET' && url.pathname === '/api/availability') {
    const date     = url.searchParams.get('date')
    const duration = parseInt(url.searchParams.get('duration') || '60', 10)
    if (!date) { json(res, 400, { error: 'date param required (YYYY-MM-DD)' }); return }
    try {
      const slots = await getAvailableSlots(date, duration)
      json(res, 200, { slots })
    } catch (err) {
      console.error('[availability]', err.message)
      json(res, 500, { error: err.message })
    }
    return
  }

  /* POST /api/book */
  if (req.method === 'POST' && url.pathname === '/api/book') {
    try {
      const body  = await readBody(req)
      const event = await createBooking(body)
      // Fire emails in the background — don't block the booking response
      sendBookingEmails(body, event).catch(err => console.error('[email]', err.message))
      json(res, 200, { ok: true, eventId: event.id, eventLink: event.htmlLink })
    } catch (err) {
      console.error('[book]', err.message)
      json(res, 500, { error: err.message })
    }
    return
  }

  /* POST /api/contact */
  if (req.method === 'POST' && url.pathname === '/api/contact') {
    try {
      const body = await readBody(req)
      if (!body.name || !body.email) { json(res, 400, { error: 'name and email are required' }); return }
      sendContactEmail(body).catch(err => console.error('[contact-email]', err.message))
      json(res, 200, { ok: true })
    } catch (err) {
      console.error('[contact]', err.message)
      json(res, 500, { error: err.message })
    }
    return
  }

  /* POST /api/subscribe */
  if (req.method === 'POST' && url.pathname === '/api/subscribe') {
    try {
      const body = await readBody(req)
      if (!body.name || !body.email) { json(res, 400, { error: 'name and email are required' }); return }
      sendSubscribeEmail(body).catch(err => console.error('[subscribe-email]', err.message))
      json(res, 200, { ok: true })
    } catch (err) {
      console.error('[subscribe]', err.message)
      json(res, 500, { error: err.message })
    }
    return
  }

  /* Legacy: GET /api/busy-dates?start=YYYY-MM-DD&end=YYYY-MM-DD */
  if (req.method === 'GET' && url.pathname === '/api/busy-dates') {
    const start = url.searchParams.get('start')
    const end   = url.searchParams.get('end')
    if (!start || !end) { json(res, 400, { error: 'start and end params required' }); return }
    try {
      const busy    = []
      const cur     = new Date(start + 'T00:00:00' + TZ)
      const endDate = new Date(end   + 'T00:00:00' + TZ)
      while (cur <= endDate) {
        const d     = cur.toISOString().slice(0, 10)
        const slots = await getAvailableSlots(d, 60)
        if (slots.length === 0) busy.push(d)
        cur.setDate(cur.getDate() + 1)
      }
      json(res, 200, { busyDates: busy })
    } catch (err) {
      console.error('[busy-dates]', err.message)
      json(res, 500, { error: err.message })
    }
    return
  }

  /* Serve built static files */
  const distIndex = join(__dirname, 'dist', 'index.html')
  try {
    const fp      = url.pathname === '/' ? distIndex : join(__dirname, 'dist', url.pathname)
    const content = readFileSync(fp)
    const ext     = fp.split('.').pop()
    const mime    = { js: 'application/javascript', css: 'text/css', ico: 'image/x-icon', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml' }
    res.setHeader('Content-Type', mime[ext] || 'text/plain')
    res.writeHead(200)
    res.end(content)
  } catch {
    try {
      res.setHeader('Content-Type', 'text/html')
      res.writeHead(200)
      res.end(readFileSync(distIndex))
    } catch {
      res.writeHead(500)
      res.end('Run `npm run build` first, then `node server.js`')
    }
  }
}

/* ── Start server only when run directly ────────────────── */
const __filename = fileURLToPath(import.meta.url)
const isMain     = process.argv[1] && resolve(process.argv[1]) === __filename
const server     = createServer(handler)

if (isMain) server.listen(PORT, async () => {
  console.log(`\n🗓  AIDATARIS booking server → http://localhost:${PORT}`)
  console.log(`   Status:       GET /api/status`)
  console.log(`   Availability: GET /api/availability?date=YYYY-MM-DD&duration=60`)
  console.log(`   Book:         POST /api/book\n`)

  const cal = await getCalendar()
  if (!existsSync(KEY_FILE)) {
    console.warn('⚠  service-account.json not found — add it to the project root.')
    console.warn('   See .env.example for setup steps.\n')
  } else if (!CALENDAR_ID) {
    console.warn('⚠  CALENDAR_ID not set in .env')
    console.warn('   Add: CALENDAR_ID=your@gmail.com\n')
  } else if (cal) {
    // Quick connectivity test on startup
    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      await getBusyBlocks(toDateStr(tomorrow))
      console.log(`✓  Calendar access confirmed: ${CALENDAR_ID}`)
      console.log(`   Working hours: ${DAY_START}:00–${DAY_END}:00 AWST, Mon–Fri`)
      console.log(`   Fresh auth client created per request (token expiry safe)\n`)
    } catch (err) {
      console.error(`✗  Calendar access failed for: ${CALENDAR_ID}`)
      console.error(`   ${err.message.split('\n')[0]}`)
      console.error(`\n   Open http://localhost:${PORT}/api/status for details\n`)
    }
  }
})
