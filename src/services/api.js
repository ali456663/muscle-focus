const API_BASE_URL = 'http://localhost:8098/api';

export const submitLead = async (leadData) => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte skicka ansökan. Prova igen.');
  }
  
  return response.json();
};

export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Inloggningen misslyckades.');
  }
  
  return response.json(); // returns { token, username }
};

export const fetchLeads = async (token, status = '') => {
  const url = status 
    ? `${API_BASE_URL}/leads?status=${status}`
    : `${API_BASE_URL}/leads`;
    
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte hämta ansökningar.');
  }
  
  return response.json();
};

export const updateLeadStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte uppdatera status.');
  }
  
  return response.json();
};

export const deleteLead = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte ta bort ansökan.');
  }
  
  return response.json();
};

export const submitBuddy = async (buddyData) => {
  const response = await fetch(`${API_BASE_URL}/buddies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buddyData),
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte skicka din profil.');
  }
  
  return response.json();
};

export const fetchBuddies = async () => {
  const response = await fetch(`${API_BASE_URL}/buddies`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte hämta träningskompisar.');
  }
  
  return response.json();
};

export const fetchAdminBuddies = async (token) => {
  const response = await fetch(`${API_BASE_URL}/buddies/admin-list`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte hämta träningskompisar för admin.');
  }
  
  return response.json();
};

export const updateBuddyStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/buddies/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte uppdatera status för träningskompis.');
  }
  
  return response.json();
};

export const deleteBuddy = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/buddies/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte ta bort träningskompis.');
  }
  
  return response.json();
};

export const verifyPayment = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/payment/verify?session_id=${sessionId}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Kunde inte verifiera betalningen.');
  }
  
  return response.json();
};
