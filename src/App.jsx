import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Technology from './pages/Technology'
import Security from './pages/Security'
import Solutions from './pages/Solutions'
import AdminConsole from './pages/AdminConsole'
import Company from './pages/Company'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/security"   element={<Security />} />
        <Route path="/solutions"  element={<Solutions />} />
        <Route path="/admin"      element={<AdminConsole />} />
        <Route path="/company"    element={<Company />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
