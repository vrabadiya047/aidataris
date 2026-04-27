import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Logo from './Logo'

const STATUS_ITEMS = [
  '⬤ AI_INFERENCE: LOCAL',
  '⬤ DATA_EGRESS: 0 BYTES',
  '⬤ PII_SHIELD: ACTIVE',
  '⬤ UPTIME: 99.99%',
  '⬤ ENCRYPTION: AES-256',
  '⬤ CLOUD_DEPS: NONE',
  '⬤ AIR_GAP: READY',
  '⬤ VERSION: 2.1.0',
]

const LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/technology', label: 'Technology' },
  { to: '/security',   label: 'Security' },
  { to: '/solutions',  label: 'Solutions' },
  { to: '/admin',      label: 'Admin Console' },
  { to: '/company',    label: 'Company' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const ticker = [...STATUS_ITEMS, ...STATUS_ITEMS].join('   ·   ')

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 201,
          background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #F59E0B)',
          transformOrigin: '0%', scaleX,
        }}
      />
      {/* Status ticker */}
      <div style={{
        background: 'rgba(2, 6, 14, 0.9)',
        borderBottom: '1px solid rgba(6,182,212,0.1)',
        overflow: 'hidden',
        height: 28,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap' }}>
          <span className="mono" style={{ color: '#38BDF8', fontSize: '0.65rem', letterSpacing: '0.08em', paddingRight: 60 }}>
            {ticker}
          </span>
          <span className="mono" style={{ color: '#38BDF8', fontSize: '0.65rem', letterSpacing: '0.08em', paddingRight: 60 }}>
            {ticker}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        background: scrolled ? 'rgba(2,6,14,0.95)' : 'rgba(2,6,14,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.06)'}`,
        transition: 'all 0.3s',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 60, padding: '0 1.5rem',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Logo size={32} />
            <span style={{
              color: '#E2E8F0', fontWeight: 800, fontSize: '1.1rem',
              letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif',
            }}>AIDATARIS</span>
          </Link>

          {/* Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="nav-desktop">
            {LINKS.map(link => {
              const active = location.pathname === link.to
              return (
                <Link key={link.to} to={link.to} style={{
                  color: active ? '#06B6D4' : '#64748B',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
                  padding: '0.4rem 0.75rem', borderRadius: 8,
                  background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
                  transition: 'all 0.2s',
                  border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="nav-desktop">
            <Link to="/company" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.83rem' }}>
              Request Demo
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="nav-mobile"
            style={{ background: 'none', border: 'none', color: '#E2E8F0', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}>
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid rgba(6,182,212,0.1)' }}
            >
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {LINKS.map(link => (
                  <Link key={link.to} to={link.to} style={{
                    color: location.pathname === link.to ? '#06B6D4' : '#94A3B8',
                    textDecoration: 'none', padding: '0.7rem 0.75rem', borderRadius: 8,
                    borderBottom: '1px solid rgba(6,182,212,0.06)', fontSize: '0.95rem',
                  }}>
                    {link.label}
                  </Link>
                ))}
                <Link to="/company" className="btn-primary" style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                  Request Demo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <style>{`
        @media (min-width: 960px)  { .nav-desktop { display: flex !important; } .nav-mobile { display: none !important; } }
        @media (max-width: 959px) { .nav-desktop { display: none !important; } .nav-mobile { display: block !important; } }
      `}</style>
    </div>
  )
}
