const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8098/api';

/* ──────────────────────────────────────────────
   LOCALSTORAGE BUDDY FALLBACK (offline-first)
   ────────────────────────────────────────────── */
const BUDDY_STORAGE_KEY = 'musclefocus_buddies_offline';

function getStoredBuddies() {
  try {
    const raw = localStorage.getItem(BUDDY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeBuddy(buddy) {
  const stored = getStoredBuddies();
  const newBuddy = {
    ...buddy,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    _offline: true,
  };
  stored.unshift(newBuddy); // newest first
  localStorage.setItem(BUDDY_STORAGE_KEY, JSON.stringify(stored));
  return newBuddy;
}

/* ──────────────────────────────────────────────
   LEADS
   ────────────────────────────────────────────── */
const LEAD_STORAGE_KEY = 'musclefocus_leads_offline';

function storeLead(lead) {
  const stored = JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '[]');
  const newLead = {
    ...lead,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    _offline: true,
  };
  stored.unshift(newLead);
  localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(stored));
  return newLead;
}

export const submitLead = async (leadData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (!response.ok) throw new Error('Backend error');
    return response.json();
  } catch (networkError) {
    // Backend is down → save to localStorage
    const saved = storeLead(leadData);
    return { ...saved, _offline: true, stripeCheckoutUrl: null };
  }
};

export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Inloggningen misslyckades.');
  }
  return response.json();
};

export const fetchLeads = async (token, status = '') => {
  const url = status ? `${API_BASE_URL}/leads?status=${status}` : `${API_BASE_URL}/leads`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Kunde inte hämta ansökningar.');
  return response.json();
};

export const updateLeadStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Kunde inte uppdatera status.');
  return response.json();
};

export const deleteLead = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Kunde inte ta bort ansökan.');
  return response.json();
};

/* ──────────────────────────────────────────────
   BUDDIES  (with offline fallback)
   ────────────────────────────────────────────── */
export const submitBuddy = async (buddyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/buddies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buddyData),
    });
    if (!response.ok) throw new Error('Backend error');
    return response.json();
  } catch (networkError) {
    // Backend is down → save to localStorage
    const saved = storeBuddy(buddyData);
    return { ...saved, _offline: true };
  }
};

export const fetchBuddies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/buddies`, { method: 'GET' });
    if (!response.ok) throw new Error('Backend error');
    return response.json();
  } catch (networkError) {
    // Backend is down → return from localStorage
    return getStoredBuddies();
  }
};

export const fetchAdminBuddies = async (token) => {
  const response = await fetch(`${API_BASE_URL}/buddies/admin-list`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Kunde inte hämta träningskompisar för admin.');
  return response.json();
};

export const updateBuddyStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/buddies/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Kunde inte uppdatera status för träningskompis.');
  return response.json();
};

export const deleteBuddy = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/buddies/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Kunde inte ta bort träningskompis.');
  return response.json();
};

/* ──────────────────────────────────────────────
   PAYMENT
   ────────────────────────────────────────────── */
export const verifyPayment = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/payment/verify?session_id=${sessionId}`, { method: 'GET' });
  if (!response.ok) throw new Error('Kunde inte verifiera betalningen.');
  return response.json();
};

/* ──────────────────────────────────────────────
   BACKEND HEALTH CHECK
   ────────────────────────────────────────────── */
export const isBackendOnline = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${API_BASE_URL}/buddies`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
};

/* ──────────────────────────────────────────────
   OFFLINE SYNC & CLEAR
   ────────────────────────────────────────────── */

// Sync stored leads to backend when it comes back online
export const syncStoredLeads = async () => {
  const stored = JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '[]');
  if (stored.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining = [];

  for (const lead of stored) {
    try {
      const { _offline, id, createdAt, ...leadData } = lead;
      await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      synced++;
    } catch {
      failed++;
      remaining.push(lead);
    }
  }

  localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(remaining));
  return { synced, failed };
};

// Sync stored buddies to backend when it comes back online
export const syncStoredBuddies = async () => {
  const stored = getStoredBuddies();
  if (stored.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining = [];

  for (const buddy of stored) {
    try {
      const { _offline, id, createdAt, ...buddyData } = buddy;
      await fetch(`${API_BASE_URL}/buddies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buddyData),
      });
      synced++;
    } catch {
      failed++;
      remaining.push(buddy);
    }
  }

  localStorage.setItem(BUDDY_STORAGE_KEY, JSON.stringify(remaining));
  return { synced, failed };
};

// Clear all offline data
export const clearOfflineData = () => {
  localStorage.removeItem(LEAD_STORAGE_KEY);
  localStorage.removeItem(BUDDY_STORAGE_KEY);
};

// Get offline stats
export const getOfflineStats = () => {
  const leads = JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '[]');
  const buddies = getStoredBuddies();
  return {
    leadsCount: leads.length,
    buddiesCount: buddies.length,
    totalCount: leads.length + buddies.length,
  };
};

/* ──────────────────────────────────────────────
   CLIENT AUTHENTICATION & PORTAL
   ────────────────────────────────────────────── */
export const registerClient = async (fullName, phoneNumber, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, phoneNumber, email, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Registreringen misslyckades.');
  }
  return response.json();
};

export const loginClient = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/client-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Inloggningen misslyckades.');
  }
  return response.json();
};

export const fetchClientProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/client/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Kunde inte hämta profil.');
  return response.json();
};

export const fetchClientHistory = async (token) => {
  const response = await fetch(`${API_BASE_URL}/client/history`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Kunde inte hämta historik.');
  return response.json();
};
