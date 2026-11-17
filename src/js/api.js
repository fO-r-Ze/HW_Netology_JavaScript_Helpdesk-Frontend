import { API_BASE_URL } from './config.js';

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return response;
}

export async function getAllTickets() {
  const res = await request(`${API_BASE_URL}?method=allTickets`);
  return res.json();
}

export async function getTicketById(id) {
  const res = await request(`${API_BASE_URL}?method=ticketById&id=${id}`);
  return res.json();
}

export async function createTicket({ name, description, status = false }) {
  const res = await request(`${API_BASE_URL}?method=createTicket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, status }),
  });
  return res.json();
}

export async function updateTicket(id, { name, description, status }) {
  const res = await request(`${API_BASE_URL}?method=updateById&id=${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, status }),
  });
  return res.json();
}

export async function deleteTicket(id) {
  await request(`${API_BASE_URL}?method=deleteById&id=${id}`);
  return null;
}