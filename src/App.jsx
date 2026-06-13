import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Packages from './pages/Packages'
import Apply from './pages/Apply'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Certificates from './pages/Certificates'
import WhyStrength from './pages/WhyStrength'
import IdealClient from './pages/IdealClient'
import Terms from './pages/Terms'

// Helper component to scroll to top on path changes
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paket" element={<Packages />} />
          <Route path="/ansok" element={<Apply />} />
          <Route path="/licenser" element={<Certificates />} />
          <Route path="/varfor-styrketrana" element={<WhyStrength />} />
          <Route path="/ideal-klient" element={<IdealClient />} />
          <Route path="/villkor" element={<Terms />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
