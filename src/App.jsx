import React, { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Chatbot from './components/Chatbot'
const Packages = lazy(() => import('./pages/Packages'))
const Apply = lazy(() => import('./pages/Apply'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ClientLogin = lazy(() => import('./pages/ClientLogin'))
const ClientRegister = lazy(() => import('./pages/ClientRegister'))
const ClientProfile = lazy(() => import('./pages/ClientProfile'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Certificates = lazy(() => import('./pages/Certificates'))
const WhyStrength = lazy(() => import('./pages/WhyStrength'))
const IdealClient = lazy(() => import('./pages/IdealClient'))
const Terms = lazy(() => import('./pages/Terms'))
const BmiCalculator = lazy(() => import('./pages/BmiCalculator'))
const FindBuddy = lazy(() => import('./pages/FindBuddy'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'))

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
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
