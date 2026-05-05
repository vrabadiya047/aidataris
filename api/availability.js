import { computeSlots, getKeyFilePath } from '../src/email.js'

const TZ = '+08:00'
const DAY_START = 9
const DAY_END = 17

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

async function getBusyBlocks(date) {
  const dayMin = new Date(`${date}T${String(DAY_START).padStart(2, '0')}:00:00${TZ}`)
  const dayMax = new Date(`${date}T${String(DAY_END).padStart(2, '0')}:00:00${TZ}`)

  if (GOOGLE_API_KEY && GOOGLE_CALENDAR_ID) {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeMin: dayMin.toISOString(),
          timeMax: dayMax.toISOString(),
          items: [{ id: GOOGLE_CALENDAR_ID }],
        }),
      }
    )
    const data = await res.json()
    return (data.calendars?.[GOOGLE_CALENDAR_ID]?.busy || []).map(b => ({
      start: new Date(b.start),
      end: new Date(b.end),
    }))
  }

  return []
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const url = new URL(req.url, `https://${req.headers.host || 'aidataris.vercel.app'}`)
  const date = url.searchParams.get('date')
  const duration = parseInt(url.searchParams.get('duration') || '60', 10)

  if (!date) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'date param required (YYYY-MM-DD)' }))
    return
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'date must be YYYY-MM-DD' }))
    return
  }

  try {
    const busy = await getBusyBlocks(date)
    const slots = computeSlots(busy, date, duration)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ slots }))
  } catch (err) {
    console.error('[availability]', err.message)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}