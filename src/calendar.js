import { google } from 'googleapis'
import { getKeyFilePath } from './email.js'

const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
const TZ = '+08:00'
const DAY_START = 9
const DAY_END = 17

export async function getCalendar() {
  const keyFile = getKeyFilePath()
  if (!keyFile) return null
  const auth = new google.auth.GoogleAuth({ keyFile, scopes: ['https://www.googleapis.com/auth/calendar'] })
  return google.calendar({ version: 'v3', auth })
}

export async function getBusyBlocks(date) {
  const dayMin = new Date(`${date}T${String(DAY_START).padStart(2, '0')}:00:00${TZ}`)
  const dayMax = new Date(`${date}T${String(DAY_END).padStart(2, '0')}:00:00${TZ}`)
  const cal = await getCalendar()

  if (!cal || !GOOGLE_CALENDAR_ID) return []

  const resp = await cal.events.list({
    calendarId: GOOGLE_CALENDAR_ID,
    timeMin: dayMin.toISOString(),
    timeMax: dayMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  })

  return (resp.data.items || [])
    .filter(e => e.status !== 'cancelled')
    .map(e => ({
      start: new Date(e.start.dateTime || e.start.date),
      end:   new Date(e.end.dateTime   || e.end.date),
    }))
}
