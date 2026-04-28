import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid rgba(6,182,212,0.1)', padding: '4rem 1.5rem 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <Logo size={28} />
              <span style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.08em' }}>AIDATARIS</span>
            </div>
            <p style={{ color: 'var(--t4)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Enterprise Sovereign AI.<br />Perth, Western Australia.<br />Intelligence without the cloud.
            </p>
          </div>

          {[
            { h: 'Platform',  links: [['Technology', '/technology'], ['Security & Compliance', '/security'], ['Admin Console', '/admin']] },
            { h: 'Solutions', links: [['Mining & Energy', '/solutions'], ['WA Government', '/solutions'], ['Legal & Health', '/solutions']] },
            { h: 'Company',   links: [['About', '/company'], ['Careers', '/careers'], ['Contact', '/company'], ['Request Demo', '/company']] },
          ].map(col => (
            <div key={col.h}>
              <h4 className="mono" style={{ color: '#06B6D4', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                {col.h.toUpperCase()}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.links.map(([l, to]) => (
                  <Link key={l} to={to}
                    style={{ color: 'var(--t4)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#06B6D4'}
                    onMouseLeave={e => e.target.style.color = 'var(--t4)'}
                  >{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid rgba(6,182,212,0.08)', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <p style={{ color: 'var(--t5)', fontSize: '0.78rem' }}>
            © 2025 AIDATARIS Pty Ltd · Perth, WA, Australia
          </p>
          <span className="mono" style={{ color: 'var(--t6)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
            INFERENCE:LOCAL · EGRESS:NONE · CLOUD:NEVER
          </span>
        </div>
      </div>
    </footer>
  )
}
