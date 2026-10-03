// Adaptador de ejemplo. Sustituyelo por tu repositorio real (MongoDB, MySQL, etc.).
export class InMemoryOrderRepository {
  constructor() { this.orders = []; }

  async save(order) {
    order.id = order.id ?? `PED-${String(this.orders.length + 1).padStart(5, '0')}`;
    this.orders.push(order);
    return order;
  }

  async findById(id) { return this.orders.find((o) => o.id === id) ?? null; }
}
