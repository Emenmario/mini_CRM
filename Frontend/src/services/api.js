const BASE_URL = 'http://localhost:5000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const api = {
  // Stats
  async getStats() {
    const res = await fetch(`${BASE_URL}/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Leads CRUD
  async getLeads() {
    const res = await fetch(`${BASE_URL}/leads`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

 async createLead(formData) {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(formData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw data; 
  }

  return data;
},
  async updateLeadStatus(id, status) {
    const res = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async deleteLead(id) {
    const res = await fetch(`${BASE_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};