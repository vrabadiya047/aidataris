import { google } from 'googleapis'
import { sendBookingEmails, getKeyFilePath } from '../src/email.js'

const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

const TZ = '+08:00'
const DAY_START = 9
const DAY_END = 17

async function getCalendar() {
  const keyFile = getKeyFilePath()
  if (!keyFile) return null
  const auth = new google.auth.GoogleAuth({ keyFile, scopes: ['https://www.googleapis.com/auth/calendar'] })
  return google.calendar({ version: 'v3', auth })
}

async function getBusyBlocks(date) {
  const dayMin = new Date(`${date}T${String(DAY_START).padStart(2, '0')}:00:00${TZ}`)
  const dayMax = new Date(`${date}T${String(DAY_END).padStart(2, '0')}:00:00${TZ}`)
  const cal = await getCalendar()
  if (cal && GOOGLE_CALENDAR_ID) {
    const resp = await cal.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: dayMin.toISOString(),
      timeMax: dayMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })
    return (resp.data.items || [])
      .filter(e => e.status !== 'cancelled')
      .map(e => ({ start: new Date(e.start.dateTime || e.start.date), end: new Date(e.end.dateTime || e.end.date) }))
  }
  return []
}

async function createBooking(body) {
  const cal = await getCalendar()
  if (!cal) throw new Error('Google Calendar not configured. Add GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_API_KEY to Vercel environment variables.')
  if (!GOOGLE_CALENDAR_ID) throw new Error('GOOGLE_CALENDAR_ID not set in Vercel environment variables')

  const { name, email, org, sector, meetingType, notes } = body
  const date     = body.date     || body.preferredDate
  const time     = body.time     || body.preferredTime
  const duration = body.duration  || body.sessionDuration || 60

  const [h, m]  = time.split(':').map(Number)
  const startDT = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00${TZ}`)
  const endDT   = new Date(startDT.getTime() + parseInt(duration, 10) * 60_000)

  // Check slot is still available
  const busy = await getBusyBlocks(date)
  const conflict = busy.some(b => startDT < b.end && endDT > b.start)
  if (conflict) throw new Error('This time slot is no longer available. Please refresh and choose another time.')

  const desc = [
    `Client:       ${name}`,
    `Email:        ${email}`,
    `Organisation: ${org || '—'}`,
    `Sector:       ${sector || '—'}`,
    `Format:       ${meetingType || '—'}`,
    notes ? `\nAgenda:\n${notes}` : '',
  ].join('\n').trim()

  const resp = await cal.events.insert({
    calendarId: GOOGLE_CALENDAR_ID,
    resource: {
      summary:     `Consultation — ${name}${org ? ' · ' + org : ''}`,
      description: desc,
      start: { dateTime: startDT.toISOString(), timeZone: 'Australia/Perth' },
      end:   { dateTime: endDT.toISOString(),   timeZone: 'Australia/Perth' },
    },
  })
  return resp.data
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  let body = req.body
  if (!body || typeof body !== 'object') {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid request body' }))
    return
  }

  const date = body.date || body.preferredDate
  const time = body.time || body.preferredTime

  const { name, email } = body
  if (!name || !email) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'name and email are required' }))
    return
  }
  if (!date || !time) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'date and time are required' }))
    return
  }

  try {
    const event = await createBooking(body)
    sendBookingEmails(body, event).catch(err => console.error('[booking-email]', err.message))
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, eventId: event.id, eventLink: event.htmlLink }))
  } catch (err) {
    console.error('[book]', err.message)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message || 'Failed to create booking' }))
  }
}