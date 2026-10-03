import { useState } from 'react';
import { createOrder } from '../services/orderApi';

const money = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

/** cart: [{ id, name, price, quantity }]   onDone: vacia el carrito */
export default function Checkout({ cart, onDone }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await createOrder({
        customer: form,
        items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
      });
      setResult(data);
      onDone?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const p = result.paymentInfo;
    return (
      <section className="checkout-success">
        <h2>Pedido {result.id} registrado</h2>
        <p>Estado: <b>Pendiente de pago</b> - Total: <b>{money(result.total)}</b></p>
        {result.notifications.customer
          ? <p>Enviamos el comprobante e instrucciones a <b>{form.email}</b>.</p>
          : <p>No pudimos enviar el correo; conserva estos datos de pago.</p>}
        <h3>Datos para tu transferencia</h3>
        <ul>
          <li>Banco: {p.bank}</li>
          <li>Beneficiario: {p.accountHolder}</li>
          <li>CLABE: {p.clabe}</li>
          <li>Referencia: {result.id}</li>
        </ul>
        <p>{p.instructions}</p>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="checkout-form">
      <h2>Finalizar pedido</h2>
      <input name="name" placeholder="Nombre completo" required
             value={form.name} onChange={change} />
      <input name="email" type="email" placeholder="Correo electronico" required
             value={form.email} onChange={change} />
      <input name="phone" placeholder="Telefono" required
             value={form.phone} onChange={change} />

      <h3>Resumen</h3>
      <ul>
        {cart.map((i) => (
          <li key={i.id}>{i.quantity} x {i.name} - {money(i.price * i.quantity)}</li>
        ))}
      </ul>
      <p><b>Total: {money(total)}</b></p>
      <p>El pago se realiza por transferencia; te enviaremos las instrucciones por correo.</p>

      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading || cart.length === 0}>
        {loading ? 'Procesando...' : 'Confirmar pedido'}
      </button>
    </form>
  );
}
