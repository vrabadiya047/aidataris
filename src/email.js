import nodemailer from 'nodemailer'

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

  // Notification to support
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

  // Auto-reply to sender
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
