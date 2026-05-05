import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './ThemeContext'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Technology from './pages/Technology'
import Security from './pages/Security'
import Solutions from './pages/Solutions'
import AdminConsole from './pages/AdminConsole'
import Company from './pages/Company'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import BookConsultation from './pages/BookConsultation'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}

function AppLayout() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/technology" element={<AnimatedPage><Technology /></AnimatedPage>} />
          <Route path="/security"   element={<AnimatedPage><Security /></AnimatedPage>} />
          <Route path="/solutions"  element={<AnimatedPage><Solutions /></AnimatedPage>} />
          <Route path="/admin"      element={<AnimatedPage><AdminConsole /></AnimatedPage>} />
          <Route path="/company"    element={<AnimatedPage><Company /></AnimatedPage>} />
          <Route path="/careers"    element={<AnimatedPage><Careers /></AnimatedPage>} />
          <Route path="/contact"    element={<AnimatedPage><Contact /></AnimatedPage>} />
          <Route path="/book"       element={<AnimatedPage><BookConsultation /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}
