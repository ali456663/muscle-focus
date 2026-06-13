import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/api'
import { Lock, User, AlertCircle, Dumbbell } from 'lucide-react'
import './AdminLogin.css'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect straight to dashboard
    const token = localStorage.getItem('admin_token')
    if (token) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!username || !password) {
      setError('Vänligen fyll i båda fälten.')
      setLoading(false)
      return
    }

    try {
      const data = await loginAdmin(username, password)
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', data.username)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Felaktigt användarnamn eller lösenord.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="login-logo">
            <Dumbbell className="logo-icon" />
          </div>
          <h2>Admin Login</h2>
          <p>Logga in för att se och hantera klientansökningar</p>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Användarnamn</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Skriv användarnamn"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Skriv lösenord"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-login" disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
