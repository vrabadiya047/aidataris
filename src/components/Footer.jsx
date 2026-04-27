import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={{
      background: '#0D1117',
      borderTop: '1px solid #1E293B',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <Logo size={30} />
              <span style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
                AIDATARIS
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Enterprise Sovereign AI. Perth, Western Australia.
              <br />Intelligence without the cloud.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.05em' }}>PLATFORM</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['Technology', '/technology'], ['Security & Compliance', '/security'], ['Admin Console', '/admin']].map(([label, to]) => (
                <Link key={to} to={to} style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#06B6D4'}
                  onMouseLeave={e => e.target.style.color = '#64748B'}
                >{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.05em' }}>SOLUTIONS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Mining & Energy', 'WA Government', 'Legal & Health'].map(s => (
                <Link key={s} to="/solutions" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#06B6D4'}
                  onMouseLeave={e => e.target.style.color = '#64748B'}
                >{s}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#F8FAFC', fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', letterSpacing: '0.05em' }}>COMPANY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['About', '/company'], ['Contact', '/company'], ['Request Demo', '/company']].map(([label, to]) => (
                <Link key={label} to={to} style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#06B6D4'}
                  onMouseLeave={e => e.target.style.color = '#64748B'}
                >{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <p style={{ color: '#334155', fontSize: '0.8rem' }}>
            © 2025 AIDATARIS Pty Ltd. All rights reserved. Perth, WA, Australia.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#334155', fontSize: '0.75rem' }} className="mono">
              AI_INFERENCE: LOCAL · DATA_RESIDENCY: ON-PREMISES · CLOUD: NEVER
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
