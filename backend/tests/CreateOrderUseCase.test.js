import test from 'node:test';
import assert from 'node:assert/strict';
import { CreateOrderUseCase } from '../src/application/usecases/CreateOrderUseCase.js';
import { EmailServicePort } from '../src/application/ports/out/EmailServicePort.js';
import { InMemoryOrderRepository } from
  '../src/infrastructure/adapters/out/persistence/InMemoryOrderRepository.js';

// Doble de prueba: demuestra que el nucleo se prueba SIN Nodemailer ni SMTP
class FakeEmail extends EmailServicePort {
  constructor(fail = false) { super(); this.sent = []; this.fail = fail; }
  async sendOrderConfirmation(o) {
    if (this.fail) throw new Error('SMTP caido');
    this.sent.push(['cliente', o.id]);
  }
  async sendAdminNewOrderAlert(o) { this.sent.push(['admin', o.id]); }
}

const input = {
  customer: { name: 'Ana', email: 'ana@test.com', phone: '9611234567' },
  items: [{ name: 'Playera', price: 250, quantity: 2 }],
};
const silent = { error() {} };

test('crea pedido PENDIENTE_DE_PAGO y notifica a cliente y admin', async () => {
  const email = new FakeEmail();
  const uc = new CreateOrderUseCase({
    orderRepository: new InMemoryOrderRepository(), emailService: email, logger: silent });
  const { order, notifications } = await uc.execute(input);
  assert.equal(order.status, 'PENDIENTE_DE_PAGO');
  assert.equal(order.total, 500);
  assert.deepEqual(notifications, { customer: true, admin: true });
  assert.equal(email.sent.length, 2);
});

test('si el correo falla, el pedido igual se registra', async () => {
  const repo = new InMemoryOrderRepository();
  const uc = new CreateOrderUseCase({
    orderRepository: repo, emailService: new FakeEmail(true), logger: silent });
  const { notifications } = await uc.execute(input);
  assert.equal(notifications.customer, false);
  assert.equal(repo.orders.length, 1);
});
