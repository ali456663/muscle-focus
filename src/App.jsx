import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Packages from './pages/Packages'
import Apply from './pages/Apply'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ClientLogin from './pages/ClientLogin'
import ClientRegister from './pages/ClientRegister'
import ClientProfile from './pages/ClientProfile'
import ResetPassword from './pages/ResetPassword'
import Certificates from './pages/Certificates'
import WhyStrength from './pages/WhyStrength'
import IdealClient from './pages/IdealClient'
import Terms from './pages/Terms'
import BmiCalculator from './pages/BmiCalculator'
import FindBuddy from './pages/FindBuddy'
import Chatbot from './components/Chatbot'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import NotFound from './pages/NotFound'

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
      <div className="led-border"></div>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bmi" element={<BmiCalculator />} />
          <Route path="/paket" element={<Packages />} />
          <Route path="/hitta-kompis" element={<FindBuddy />} />
          <Route path="/ansok" element={<Apply />} />
          <Route path="/licenser" element={<Certificates />} />
          <Route path="/varfor-styrketrana" element={<WhyStrength />} />
          <Route path="/ideal-klient" element={<IdealClient />} />
          <Route path="/villkor" element={<Terms />} />
          <Route path="/login" element={<ClientLogin />} />
          <Route path="/register" element={<ClientRegister />} />
          <Route path="/profil" element={<ClientProfile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
