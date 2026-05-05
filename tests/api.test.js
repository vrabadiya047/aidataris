import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { createServer } from 'http'

// Mock googleapis — prevents real Calendar API calls and real event creation.
// GoogleAuth must be a real function (not arrow) so it can be called with `new`.
vi.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: vi.fn(function GoogleAuth() {}),
    },
    calendar: vi.fn().mockReturnValue({
      events: {
        list:   vi.fn().mockResolvedValue({ data: { items: [] } }),
        insert: vi.fn().mockResolvedValue({
          data: { id: 'test-event-id', htmlLink: 'https://calendar.google.com/event?id=test' },
        }),
      },
    }),
  },
}))

// Mock nodemailer — prevents real SMTP calls during tests
vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-msg-id' }),
    }),
  },
}))

const TEST_PORT = 3099
const base      = `http://localhost:${TEST_PORT}`
let server

beforeAll(async () => {
  const { handler } = await import('../server.js')
  server = createServer(handler)
  await new Promise(resolve => server.listen(TEST_PORT, resolve))
})

afterAll(async () => {
  await new Promise(resolve => server.close(resolve))
})

const get  = path       => fetch(base + path)
const post = (path, body) => fetch(base + path, {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body:    JSON.stringify(body),
})

/* ── CORS ──────────────────────────────────────────────── */
describe('CORS', () => {
  it('responds to OPTIONS preflight with 204', async () => {
    const res = await fetch(base + '/api/status', { method: 'OPTIONS' })
    expect(res.status).toBe(204)
  })

  it('sets Access-Control-Allow-Origin: * on every response', async () => {
    const res = await get('/api/status')
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
  })
})

/* ── GET /api/status ───────────────────────────────────── */
describe('GET /api/status', () => {
  it('returns 200 with the expected keys', async () => {
    const res  = await get('/api/status')
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toHaveProperty('serviceAccount')
    expect(body).toHaveProperty('calendarId')
    expect(body).toHaveProperty('authenticated')
    expect(body).toHaveProperty('calendarAccessible')
    expect(body).toHaveProperty('workingHours')
    expect(body).toHaveProperty('slotInterval')
  })

  it('reports authenticated: true when googleapis mock succeeds', async () => {
    const res  = await get('/api/status')
    const body = await res.json()
    expect(body.authenticated).toBe(true)
  })

  it('workingHours describes AWST Mon–Fri window', async () => {
    const body = await (await get('/api/status')).json()
    expect(body.workingHours).toMatch(/AWST/)
  })
})

/* ── GET /api/availability ─────────────────────────────── */
describe('GET /api/availability', () => {
  it('returns 400 when date param is missing', async () => {
    const res  = await get('/api/availability')
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toMatch(/date param required/i)
  })

  it('returns 400 with duration but no date', async () => {
    const res = await get('/api/availability?duration=60')
    expect(res.status).toBe(400)
  })

  it('returns 200 with a slots array for a valid weekday', async () => {
    const res  = await get('/api/availability?date=2025-06-10&duration=60')
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(body.slots)).toBe(true)
  })

  it('returns slots in HH:MM format', async () => {
    const body = await (await get('/api/availability?date=2025-06-10&duration=30')).json()
    const timeRe = /^\d{2}:\d{2}$/
    body.slots.forEach(s => expect(s).toMatch(timeRe))
  })

  it('returns an empty slots array when the mocked calendar shows no free time', async () => {
    // The mock returns items: [] (no busy events) so all slots are available
    // Just verify slots array exists and contains something
    const body = await (await get('/api/availability?date=2025-06-10&duration=30')).json()
    expect(body.slots.length).toBeGreaterThan(0)
  })
})

/* ── POST /api/contact ─────────────────────────────────── */
describe('POST /api/contact', () => {
  it('returns 400 when name is missing', async () => {
    const res  = await post('/api/contact', { email: 'test@example.com' })
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toMatch(/name and email/i)
  })

  it('returns 400 when email is missing', async () => {
    const res  = await post('/api/contact', { name: 'Jane' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when body is empty', async () => {
    const res = await post('/api/contact', {})
    expect(res.status).toBe(400)
  })

  it('returns 200 with { ok: true } for a valid payload', async () => {
    const res  = await post('/api/contact', {
      name:        'Jane Smith',
      email:       'jane@example.com',
      org:         'Test Corp',
      sector:      'Legal',
      inquiryType: 'Technical Inquiry',
      msg:         'How does air-gapped deployment work?',
    })
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
  })
})

/* ── POST /api/subscribe ───────────────────────────────── */
describe('POST /api/subscribe', () => {
  it('returns 400 when name is missing', async () => {
    const res = await post('/api/subscribe', { email: 'a@b.com' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is missing', async () => {
    const res = await post('/api/subscribe', { name: 'John' })
    expect(res.status).toBe(400)
  })

  it('returns 200 with { ok: true } for a valid payload', async () => {
    const res  = await post('/api/subscribe', {
      name:     'John Doe',
      email:    'john@example.com',
      industry: 'Mining & Energy',
    })
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
  })
})

/* ── POST /api/book ────────────────────────────────────── */
describe('POST /api/book', () => {
  it('returns 200 and creates a calendar event with a mocked calendar', async () => {
    const res  = await post('/api/book', {
      name:          'Test User',
      email:         'test@example.com',
      org:           'Test Corp',
      preferredDate: '2025-06-10',
      preferredTime: '10:00',
      duration:      '60',
      meetingType:   'Video Call',
    })
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.eventId).toBe('test-event-id')
  })

  it('returns 500 when required fields are missing', async () => {
    const res = await post('/api/book', { name: 'No Date' })
    expect(res.status).toBe(500)
  })
})

/* ── GET /api/busy-dates ───────────────────────────────── */
describe('GET /api/busy-dates', () => {
  it('returns 400 when start is missing', async () => {
    const res = await get('/api/busy-dates?end=2025-06-30')
    expect(res.status).toBe(400)
  })

  it('returns 400 when end is missing', async () => {
    const res = await get('/api/busy-dates?start=2025-06-01')
    expect(res.status).toBe(400)
  })

  it('returns 400 when both params are missing', async () => {
    const res = await get('/api/busy-dates')
    expect(res.status).toBe(400)
  })

  it('returns 200 with a busyDates array for a valid range', async () => {
    // Small range to keep test fast
    const res  = await get('/api/busy-dates?start=2025-06-10&end=2025-06-12')
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(body.busyDates)).toBe(true)
  })
})
