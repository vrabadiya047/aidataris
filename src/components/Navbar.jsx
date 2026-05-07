import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Logo from './Logo'

const LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/solutions',  label: 'Solutions' },
  { to: '/technology',   label: 'Technology' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/security',     label: 'Security' },
  { to: '/company',    label: 'Company' },
  { to: '/contact',    label: 'Contact' },
]

const STATUS = ['⬤ AI_INFERENCE: LOCAL', '⬤ DATA_EGRESS: 0 BYTES', '⬤ PII_SHIELD: ACTIVE', '⬤ UPTIME: 99.99%', '⬤ CLOUD_DEPS: NONE', '⬤ AIR_GAP: READY', '⬤ ENCRYPTION: AES-256']


export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location              = useLocation()
  const { scrollYProgress }   = useScroll()
  const scaleX                = useSpring(scrollYProgress, { stiffness: 400, damping: 35 })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const ticker = [...STATUS, ...STATUS].join('   ·   ')

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}>

      {/* Scroll progress bar */}
      <motion.div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 210,
        background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #F59E0B)',
        transformOrigin: '0%', scaleX,
      }} />

      {/* Status ticker */}
      <div style={{
        background: 'var(--ticker-bg)', borderBottom: '1px solid rgba(6,182,212,0.1)',
        overflow: 'hidden', height: 26, display: 'flex', alignItems: 'center',
      }}>
        <motion.div
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', whiteSpace: 'nowrap' }}
        >
          {[ticker, ticker].map((t, i) => (
            <span key={i} className="mono" style={{ color: 'var(--ticker-text)', fontSize: '0.62rem', letterSpacing: '0.08em', paddingRight: 80, opacity: 0.75 }}>{t}</span>
          ))}
        </motion.div>
      </div>

      {/* Main nav */}
      <nav style={{
        background: scrolled ? 'var(--nav-bg2)' : 'var(--nav-bg)',
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        borderBottom: `1px solid var(--nav-bd)`,
        transition: 'background 0.4s, box-shadow 0.4s',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, padding: '0 1.5rem' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Logo size={32} />
            </motion.div>
            <span style={{ color: 'var(--nav-link-h)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.1em' }}>
              AIDATARIS
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }} className="nav-desk">
            {LINKS.map(link => {
              const active = location.pathname === link.to
              return (
                <Link key={link.to} to={link.to}
                  style={{
                    color: active ? 'var(--nav-active)' : 'var(--nav-link)',
                    textDecoration: 'none', fontSize: '0.84rem', fontWeight: active ? 600 : 500,
                    padding: '0.45rem 0.85rem', borderRadius: 9, position: 'relative',
                    background: active ? 'var(--nav-active-bg)' : 'transparent',
                    border: active ? '1px solid var(--nav-active-bd)' : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--nav-link-h)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--nav-link)'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {link.label}
                  {active && (
                    <motion.div layoutId="nav-pill"
                      style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#06B6D4' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="nav-desk">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link to="/book" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}>
                Book Consultation
              </Link>
            </motion.div>
          </div>

          {/* Mobile controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="nav-mob">
            <motion.button onClick={() => setOpen(!open)} whileTap={{ scale: 0.92 }}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9, color: 'var(--nav-link-h)', fontSize: '1.1rem', cursor: 'pointer', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.span key={open ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}>
                  {open ? '✕' : '☰'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--nav-bd)', background: 'var(--nav-bg2)', backdropFilter: 'blur(24px)' }}
            >
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {LINKS.map((link, i) => (
                  <motion.div key={link.to}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}>
                    <Link to={link.to} style={{
                      display: 'block', color: location.pathname === link.to ? '#06B6D4' : 'var(--nav-link)',
                      textDecoration: 'none', padding: '0.75rem 0.85rem', borderRadius: 10,
                      fontWeight: location.pathname === link.to ? 600 : 500,
                      background: location.pathname === link.to ? 'rgba(6,182,212,0.08)' : 'transparent',
                      fontSize: '0.95rem', transition: 'all 0.15s',
                    }}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  style={{ marginTop: '0.75rem' }}>
                  <Link to="/book" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                    Book Free Consultation →
                  </Link>
                </motion.div>
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
