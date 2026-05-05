import nodemailer from 'nodemailer'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

function transporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

function row(k, v) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.78rem;font-weight:700;letter-spacing:0.06em;width:34%;text-transform:uppercase;vertical-align:top">${k}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:0.88rem;font-weight:600">${v}</td>
    </tr>`
}

export async function sendContactEmail(body) {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials not configured')
  }

  const { name, email, org, sector, inquiryType, msg } = body

  const mail = transporter()

  await mail.sendMail({
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

  await mail.sendMail({
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

export async function sendSubscribeEmail(body) {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials not configured')
  }

  const { name, email, industry } = body
  const mail = transporter()

  await mail.sendMail({
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

  await mail.sendMail({
    from:    `"AIDATARIS" <${SMTP_USER}>`,
    to:      email,
    subject: "You're on the list — AIDATARIS Insights",
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

/* ── Google Calendar helpers for serverless ──────────────── */

/**
 * Get the path to the service account JSON key file.
 * In serverless, GOOGLE_SERVICE_ACCOUNT_KEY is a base64-encoded JSON string
 * that gets written to a temp file. Locally it reads from the file directly.
 */
export function getKeyFilePath() {
  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (encoded) {
    // Serverless: decode and write to /tmp so googleapis can read it
    const tmpPath = '/tmp/service-account.json'
    try {
      writeFileSync(tmpPath, Buffer.from(encoded, 'base64'))
    } catch {
      // Already written in a previous warm invocation
    }
    return tmpPath
  }
  // Local: read from filesystem
  const localPath = join(__dirname, '..', 'service-account.json')
  return existsSync(localPath) ? localPath : null
}

export async function sendBookingEmails(body, eventDetails) {
  console.log('[booking-email] SMTP_USER set?', !!SMTP_USER, '| SMTP_PASS set?', !!SMTP_PASS)
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠  SMTP not configured — skipping booking emails.')
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

  const calLink = eventDetails?.htmlLink
    ? `<p><a href="${eventDetails.htmlLink}" style="color:#8B5CF6">Open in Google Calendar →</a></p>`
    : ''

  try {
    const info = await transporter.sendMail({
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
    console.log(`✉  Notification sent to ${SMTP_USER} — messageId: ${info.messageId}`)
  } catch (err) {
    console.error('✗  Notification email FAILED:', err.message)
  }

  try {
    const info2 = await transporter.sendMail({
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
    console.log(`✉  Confirmation sent to ${email} — messageId: ${info2.messageId}`)
  } catch (err) {
    console.error('✗  Confirmation email FAILED:', err.message)
  }
}

/** Export slot computation for serverless availability endpoint */
export function computeSlots(busyBlocks, date, durationMins, dayStart = 9, dayEnd = 17, slotMin = 30, tz = '+08:00') {
  const slots  = []
  const origin = new Date(`${date}T${String(dayStart).padStart(2, '0')}:00:00${tz}`)
  const limit  = new Date(`${date}T${String(dayEnd).padStart(2, '0')}:00:00${tz}`)
  const cur    = new Date(origin)
  while (cur < limit) {
    const slotEnd = new Date(cur.getTime() + durationMins * 60_000)
    if (slotEnd <= limit) {
      const overlaps = busyBlocks.some(b => cur < b.end && slotEnd > b.start)
      if (!overlaps) {
        const h = (cur.getUTCHours() + 8) % 24
        const m = cur.getUTCMinutes()
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      }
    }
    cur.setMinutes(cur.getMinutes() + slotMin)
  }
  return slots
}