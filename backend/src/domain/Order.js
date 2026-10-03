export const OrderStatus = Object.freeze({
  PENDING_PAYMENT: 'PENDIENTE_DE_PAGO',
  PAID: 'PAGADO',
  CANCELLED: 'CANCELADO',
});

export class Order {
  constructor({ id = null, customer, items, status = OrderStatus.PENDING_PAYMENT,
                createdAt = new Date() }) {
    if (!items || items.length === 0) {
      throw new Error('El pedido debe contener al menos un producto');
    }
    this.id = id;
    this.customer = customer;   // { name, email, phone }
    this.items = items;         // [{ name, price, quantity }]
    this.status = status;
    this.createdAt = createdAt;
  }

  get total() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
