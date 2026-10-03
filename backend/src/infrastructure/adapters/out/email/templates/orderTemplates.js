const money = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const itemRows = (order) => order.items.map((i) => `
  <tr>
    <td style="padding:6px;border-bottom:1px solid #eee">${esc(i.name)}</td>
    <td style="padding:6px;border-bottom:1px solid #eee" align="center">${i.quantity}</td>
    <td style="padding:6px;border-bottom:1px solid #eee" align="right">${money(i.price)}</td>
    <td style="padding:6px;border-bottom:1px solid #eee" align="right">
      ${money(i.price * i.quantity)}</td>
  </tr>`).join('');

const table = (order) => `
  <table width="100%" cellspacing="0" style="font-size:14px">
    <tr style="background:#f4f4f4"><th align="left" style="padding:6px">Producto</th>
      <th>Cant.</th><th align="right">Precio</th><th align="right">Subtotal</th></tr>
    ${itemRows(order)}
    <tr><td colspan="3" align="right" style="padding:8px"><b>Total</b></td>
      <td align="right" style="padding:8px"><b>${money(order.total)}</b></td></tr>
  </table>`;

export function customerOrderEmail(order, pay) {
  const subject = `Pedido ${order.id} recibido - Instrucciones de pago`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#222">
    <h2>Gracias por tu compra, ${esc(order.customer.name)}</h2>
    <p>Tu pedido <b>${order.id}</b> fue registrado con estado
       <b>${order.status.replace(/_/g, ' ')}</b>.</p>
    ${table(order)}
    <h3>Como completar tu pago</h3>
    <p>Realiza una transferencia o deposito con los siguientes datos:</p>
    <ul>
      <li>Banco: <b>${esc(pay.bank)}</b></li>
      <li>Beneficiario: <b>${esc(pay.accountHolder)}</b></li>
      <li>CLABE: <b>${esc(pay.clabe)}</b></li>
      <li>Referencia / concepto: <b>${order.id}</b></li>
      <li>Monto exacto: <b>${money(order.total)}</b></li>
    </ul>
    <p>${esc(pay.instructions)}</p>
  </div>`;
  const text = [
    `Pedido ${order.id} - ${order.status}`,
    ...order.items.map((i) => `${i.quantity} x ${i.name}  ${money(i.price * i.quantity)}`),
    `TOTAL: ${money(order.total)}`,
    `Banco: ${pay.bank} | CLABE: ${pay.clabe} | Referencia: ${order.id}`,
    pay.instructions,
  ].join('\n');
  return { subject, html, text };
}

export function adminOrderEmail(order) {
  const subject = `Nuevo pedido ${order.id} por ${money(order.total)}`;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#222">
    <h2>Nuevo pedido pendiente de pago</h2>
    <p>Cliente: <b>${esc(order.customer.name)}</b> (${esc(order.customer.email)})
       Tel: ${esc(order.customer.phone)}</p>
    ${table(order)}
  </div>`;
  const text = `Nuevo pedido ${order.id} de ${order.customer.name} `
             + `<${order.customer.email}> por ${money(order.total)}`;
  return { subject, html, text };
}
