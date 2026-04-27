import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const navLinks = [
  { to: '/',           label: 'Home' },
  { to: '/technology', label: 'Technology' },
  { to: '/security',   label: 'Security & Compliance' },
  { to: '/solutions',  label: 'Solutions' },
  { to: '/admin',      label: 'Admin Console' },
  { to: '/company',    label: 'Company' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1E293B',
      transition: 'background 0.3s',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Logo size={34} />
          <span style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.05em' }}>
            AIDATARIS
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden-mobile">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: location.pathname === link.to ? '#06B6D4' : '#94A3B8',
              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
              transition: 'color 0.2s',
              borderBottom: location.pathname === link.to ? '1px solid #06B6D4' : '1px solid transparent',
              paddingBottom: 2,
            }}
              onMouseEnter={e => { if (location.pathname !== link.to) e.target.style.color = '#F8FAFC' }}
              onMouseLeave={e => { if (location.pathname !== link.to) e.target.style.color = '#94A3B8' }}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/company" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            Request Demo
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: '#F8FAFC', fontSize: '1.5rem', cursor: 'pointer' }}
          className="show-mobile"
        >
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
            style={{ borderTop: '1px solid #1E293B', background: '#0A0A0A', overflow: 'hidden' }}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  color: location.pathname === link.to ? '#06B6D4' : '#94A3B8',
                  textDecoration: 'none', fontSize: '1rem', fontWeight: 500,
                  padding: '0.5rem 0', borderBottom: '1px solid #1E293B',
                }}>
                  {link.label}
                </Link>
              ))}
              <Link to="/company" className="btn-primary" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                Request Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 900px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 899px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  )
}
