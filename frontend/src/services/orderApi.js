const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export async function createOrder({ customer, items }) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, items }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'No se pudo crear el pedido');
  return data;
}
