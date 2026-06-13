import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLeads, updateLeadStatus, deleteLead } from '../services/api'
import { LogOut, Trash2, CheckCircle, PhoneCall, Archive, Clock, RefreshCw, AlertCircle } from 'lucide-react'
import './AdminDashboard.css'

function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')
  const adminUser = localStorage.getItem('admin_user')

  useEffect(() => {
    if (!token) {
      navigate('/admin')
    } else {
      loadLeads()
    }
  }, [token, navigate, statusFilter])

  const loadLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchLeads(token, statusFilter)
      setLeads(data)
    } catch (err) {
      setError(err.message || 'Kunde inte hämta ansökningar. Logga in igen.')
      // If unauthorized, token might be invalid/expired
      if (err.message.includes('Inloggningen') || err.message.includes('401')) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus(token, id, newStatus)
      // Refresh list
      loadLeads()
    } catch (err) {
      setError(err.message || 'Kunde inte uppdatera status.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna ansökan permanent?')) {
      return
    }

    try {
      await deleteLead(token, id)
      // Refresh list
      loadLeads()
    } catch (err) {
      setError(err.message || 'Kunde inte ta bort ansökan.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin')
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toUpperCase()) {
      case 'NEW': return 'badge-new'
      case 'CONTACTED': return 'badge-contacted'
      case 'COMPLETED': return 'badge-completed'
      case 'ARCHIVED': return 'badge-archived'
      default: return ''
    }
  }

  const getStatusSwedish = (status) => {
    switch (status.toUpperCase()) {
      case 'NEW': return 'Ny'
      case 'CONTACTED': return 'Kontaktad'
      case 'COMPLETED': return 'Klar'
      case 'ARCHIVED': return 'Arkiverad'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('sv-SE', options)
  }

  return (
    <div className="dashboard-page container">
      {/* Dashboard Header */}
      <div className="dashboard-header glass-panel">
        <div className="admin-profile">
          <h2>Admin Panel</h2>
          <p>Inloggad som: <strong>{adminUser}</strong></p>
        </div>
        <div className="header-actions">
          <button onClick={loadLeads} className="btn-secondary btn-icon" title="Ladda om">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Logga ut</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="form-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="dashboard-filters">
        <button className={`filter-btn ${statusFilter === '' ? 'active' : ''}`} onClick={() => setStatusFilter('')}>
          Alla ({leads.length})
        </button>
        <button className={`filter-btn ${statusFilter === 'NEW' ? 'active' : ''}`} onClick={() => setStatusFilter('NEW')}>
          Nya
        </button>
        <button className={`filter-btn ${statusFilter === 'CONTACTED' ? 'active' : ''}`} onClick={() => setStatusFilter('CONTACTED')}>
          Kontaktade
        </button>
        <button className={`filter-btn ${statusFilter === 'COMPLETED' ? 'active' : ''}`} onClick={() => setStatusFilter('COMPLETED')}>
          Klara
        </button>
        <button className={`filter-btn ${statusFilter === 'ARCHIVED' ? 'active' : ''}`} onClick={() => setStatusFilter('ARCHIVED')}>
          Arkiverade
        </button>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="loading-state">
          <RefreshCw className="spinner" size={32} />
          <p>Hämtar intresseanmälningar...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="empty-state glass-panel">
          <Clock size={48} className="empty-icon" />
          <h3>Inga ansökningar hittades</h3>
          <p>Det finns inga klientansökningar i den här kategorin för tillfället.</p>
        </div>
      ) : (
        <div className="leads-list">
          {leads.map(lead => (
            <div key={lead.id} className="lead-card glass-panel">
              <div className="lead-card-header">
                <div>
                  <h3 className="lead-name">{lead.fullName}</h3>
                  <span className="lead-meta">
                    {lead.gender}, {lead.age} år &bull; {lead.city}
                  </span>
                </div>
                <div className="lead-status-wrapper">
                  <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                    {getStatusSwedish(lead.status)}
                  </span>
                  <span className="lead-date">{formatDate(lead.createdAt)}</span>
                </div>
              </div>

              <div className="lead-card-body">
                <div className="lead-info-row">
                  <div>
                    <strong>E-post:</strong>
                    <a href={`mailto:${lead.email}`} className="link-text">{lead.email}</a>
                  </div>
                  <div>
                    <strong>Telefon:</strong>
                    <a href={`tel:${lead.phoneNumber}`} className="link-text">{lead.phoneNumber}</a>
                  </div>
                  <div>
                    <strong>Önskat paket:</strong>
                    <span className="pkg-tag">{lead.trainingWish}</span>
                  </div>
                </div>

                {lead.message && (
                  <div className="lead-message">
                    <strong>Meddelande:</strong>
                    <p>{lead.message}</p>
                  </div>
                )}
              </div>

              <div className="lead-card-actions">
                <div className="action-group">
                  {lead.status.toUpperCase() === 'NEW' && (
                    <button 
                      onClick={() => handleStatusChange(lead.id, 'CONTACTED')} 
                      className="action-btn btn-contact"
                    >
                      <PhoneCall size={14} />
                      <span>Markera som kontaktad</span>
                    </button>
                  )}
                  {lead.status.toUpperCase() !== 'COMPLETED' && (
                    <button 
                      onClick={() => handleStatusChange(lead.id, 'COMPLETED')} 
                      className="action-btn btn-complete"
                    >
                      <CheckCircle size={14} />
                      <span>Markera som klar</span>
                    </button>
                  )}
                  {lead.status.toUpperCase() !== 'ARCHIVED' && (
                    <button 
                      onClick={() => handleStatusChange(lead.id, 'ARCHIVED')} 
                      className="action-btn btn-archive"
                    >
                      <Archive size={14} />
                      <span>Arkivera</span>
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(lead.id)} 
                  className="btn-delete"
                  title="Ta bort ansökan permanent"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
