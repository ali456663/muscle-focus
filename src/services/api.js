const API_BASE_URL = 'http://localhost:8098/api';

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
    const timeout = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${API_BASE_URL}/buddies`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
};
