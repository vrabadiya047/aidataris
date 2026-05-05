import { getBusyBlocks } from '../src/calendar.js'
import { computeSlots } from '../src/email.js'

const TZ = '+08:00'
const DAY_START = 9
const DAY_END = 17

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
    const slots = computeSlots(busy, date, duration, DAY_START, DAY_END)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ slots }))
  } catch (err) {
    console.error('[availability]', err.message)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}
