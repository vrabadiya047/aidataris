import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Logo from './Logo'
import { useTheme } from '../ThemeContext'

const STATUS = ['⬤ AI_INFERENCE: LOCAL', '⬤ DATA_EGRESS: 0 BYTES', '⬤ PII_SHIELD: ACTIVE', '⬤ UPTIME: 99.99%', '⬤ ENCRYPTION: AES-256', '⬤ CLOUD_DEPS: NONE', '⬤ AIR_GAP: READY', '⬤ VERSION: 2.1.0']

const LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/technology', label: 'Technology' },
  { to: '/security',   label: 'Security' },
  { to: '/solutions',  label: 'Solutions' },
  { to: '/admin',      label: 'Admin Console' },
  { to: '/company',    label: 'Company' },
  { to: '/contact',   label: 'Contact' },
]

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const ticker = [...STATUS, ...STATUS].join('   ·   ')

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}>
      {/* Scroll progress */}
      <motion.div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 201,
        background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #F59E0B)',
        transformOrigin: '0%', scaleX,
      }} />

      {/* Status ticker */}
      <div style={{
        background: 'var(--ticker-bg)',
        borderBottom: '1px solid rgba(6,182,212,0.12)',
        overflow: 'hidden', height: 28,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap' }}>
          {[ticker, ticker].map((t, i) => (
            <span key={i} className="mono" style={{ color: 'var(--ticker-text)', fontSize: '0.65rem', letterSpacing: '0.08em', paddingRight: 60 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        background: scrolled ? 'var(--nav-bg2)' : 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid var(--nav-bd)`,
        transition: 'background 0.3s',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 60, padding: '0 1.5rem',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Logo size={32} />
            <span style={{ color: 'var(--t1)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em' }}>
              AIDATARIS
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="nav-desk">
            {LINKS.map(link => {
              const active = location.pathname === link.to
              return (
                <Link key={link.to} to={link.to} style={{
                  color: active ? 'var(--nav-active, #06B6D4)' : 'var(--nav-link)',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
                  padding: '0.4rem 0.75rem', borderRadius: 8,
                  background: active ? 'var(--nav-active-bg, rgba(6,182,212,0.08))' : 'transparent',
                  border: active ? '1px solid var(--nav-active-bd, rgba(6,182,212,0.2))' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--nav-link-h)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--nav-link)'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="nav-desk">
            <button className="theme-toggle" onClick={toggle} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <AnimatePresence mode="wait">
                <motion.span key={theme}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </motion.span>
              </AnimatePresence>
            </button>
            <Link to="/company" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.83rem' }}>
              Request Demo
            </Link>
          </div>

          {/* Mobile controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="nav-mob">
            <button className="theme-toggle" onClick={toggle}>
              <AnimatePresence mode="wait">
                <motion.span key={theme}
                  initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button onClick={() => setOpen(!open)}
              style={{ background: 'none', border: 'none', color: 'var(--t1)', fontSize: '1.3rem', cursor: 'pointer' }}>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--nav-bd)', background: 'var(--nav-bg2)' }}
            >
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {LINKS.map(link => (
                  <Link key={link.to} to={link.to} style={{
                    color: location.pathname === link.to ? '#06B6D4' : 'var(--nav-link)',
                    textDecoration: 'none', padding: '0.7rem 0.75rem', borderRadius: 8,
                    borderBottom: '1px solid var(--bd-s)', fontSize: '0.95rem',
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
        @media (min-width: 960px)  { .nav-desk { display: flex !important; } .nav-mob { display: none !important; } }
        @media (max-width: 959px)  { .nav-desk { display: none !important; } .nav-mob { display: flex !important; } }
      `}</style>
    </div>
  )
}
