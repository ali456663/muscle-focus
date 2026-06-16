import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLeads, updateLeadStatus, deleteLead, fetchAdminBuddies, deleteBuddy } from '../services/api'
import { LogOut, Trash2, CheckCircle, PhoneCall, Archive, Clock, RefreshCw, AlertCircle, Users, Dumbbell } from 'lucide-react'
import './AdminDashboard.css'

function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [buddies, setBuddies] = useState([])
  const [activeTab, setActiveTab] = useState('leads') // 'leads' or 'buddies'
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
      loadData()
    }
  }, [token, navigate, statusFilter, activeTab])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      if (activeTab === 'leads') {
        const data = await fetchLeads(token, statusFilter)
        setLeads(data)
      } else {
        const data = await fetchAdminBuddies(token)
        setBuddies(data)
      }
    } catch (err) {
      setError(err.message || 'Kunde inte hämta data. Logga in igen.')
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
      loadData()
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
      loadData()
    } catch (err) {
      setError(err.message || 'Kunde inte ta bort ansökan.')
    }
  }

  const handleDeleteBuddy = async (id) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna träningskompis permanent?')) {
      return
    }

    try {
      await deleteBuddy(token, id)
      // Refresh list
      loadData()
    } catch (err) {
      setError(err.message || 'Kunde inte ta bort träningskompis.')
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
          <button onClick={loadData} className="btn-secondary btn-icon" title="Ladda om">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Logga ut</span>
          </button>
        </div>
      </div>

      {/* Tab switching navigation */}
      <div className="dashboard-tab-bar glass-panel" style={{ display: 'flex', gap: '16px', padding: '12px 20px', borderRadius: '8px', marginBottom: '30px' }}>
        <button 
          onClick={() => { setActiveTab('leads'); setStatusFilter(''); }} 
          className={`filter-btn ${activeTab === 'leads' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none' }}
        >
          <Users size={16} />
          <span>Klientansökningar</span>
        </button>
        <button 
          onClick={() => setActiveTab('buddies')} 
          className={`filter-btn ${activeTab === 'buddies' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none' }}
        >
          <Dumbbell size={16} />
          <span>Träningskompisar</span>
        </button>
      </div>

      {error && (
        <div className="form-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'leads' ? (
        <>
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
                      <div>
                        <strong>Betalning:</strong>
                        {lead.paymentStatus === 'PAID' ? (
                          <span className="payment-status-badge paid" style={{ background: 'rgba(0, 255, 136, 0.15)', border: '1px solid #00ff88', color: '#00ff88', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '600', marginLeft: '6px', display: 'inline-block' }}>
                            BETALD ({lead.amountPaid} kr)
                          </span>
                        ) : lead.paymentStatus === 'PENDING_PAYMENT' ? (
                          <span className="payment-status-badge pending" style={{ background: 'rgba(255, 170, 0, 0.15)', border: '1px solid #ffaa00', color: '#ffaa00', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '600', marginLeft: '6px', display: 'inline-block' }}>
                            VÄNTAR BETALNING
                          </span>
                        ) : (
                          <span className="payment-status-badge none" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '600', marginLeft: '6px', display: 'inline-block' }}>
                            Konsultation
                          </span>
                        )}
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
        </>
      ) : (
        <>
          {/* Buddies List */}
          {loading ? (
            <div className="loading-state">
              <RefreshCw className="spinner" size={32} />
              <p>Hämtar träningskompisar...</p>
            </div>
          ) : buddies.length === 0 ? (
            <div className="empty-state glass-panel">
              <Clock size={48} className="empty-icon" />
              <h3>Inga träningskompisar hittades</h3>
              <p>Det finns inga registrerade träningskompisar för tillfället.</p>
            </div>
          ) : (
            <div className="leads-list">
              {buddies.map(buddy => (
                <div key={buddy.id} className="lead-card glass-panel text-left" style={{ textAlign: 'left' }}>
                  <div className="lead-card-header">
                    <div>
                      <h3 className="lead-name">{buddy.fullName}</h3>
                      <span className="lead-meta">
                        {buddy.age} år &bull; {buddy.city} &bull; {buddy.gym}
                      </span>
                    </div>
                    <div className="lead-status-wrapper">
                      <span className="lead-date">{formatDate(buddy.createdAt)}</span>
                    </div>
                  </div>

                  <div className="lead-card-body">
                    <div className="lead-info-row">
                      <div>
                        <strong>Kontaktuppgift:</strong>
                        <span className="pkg-tag" style={{ background: 'rgba(0, 255, 136, 0.15)', color: 'var(--accent-neon)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>{buddy.contactInfo}</span>
                      </div>
                    </div>

                    {buddy.message && (
                      <div className="lead-message">
                        <strong>Meddelande:</strong>
                        <p>{buddy.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="lead-card-actions" style={{ justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleDeleteBuddy(buddy.id)} 
                      className="btn-delete"
                      title="Ta bort träningskompis permanent"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminDashboard
