import { Order } from '../../domain/Order.js';

export class CreateOrderUseCase {
  /**
   * @param {object} deps
   * @param {object} deps.orderRepository  puerto de salida de persistencia
   * @param {import('../ports/out/EmailServicePort.js').EmailServicePort} deps.emailService
   */
  constructor({ orderRepository, emailService, logger = console }) {
    this.orderRepository = orderRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async execute({ customer, items }) {
    if (!customer?.email) throw new Error('El correo del cliente es obligatorio');

    // 1) Se registra el pedido como "Pendiente de Pago" (sin cobro en linea)
    const order = await this.orderRepository.save(new Order({ customer, items }));

    // 2) Notificaciones: un fallo de correo NO debe cancelar el pedido ya guardado
    const [toCustomer, toAdmin] = await Promise.allSettled([
      this.emailService.sendOrderConfirmation(order),
      this.emailService.sendAdminNewOrderAlert(order),
    ]);
    [toCustomer, toAdmin].forEach((r) => {
      if (r.status === 'rejected') {
        this.logger.error(`[Notificacion] ${order.id}: ${r.reason?.message}`);
      }
    });

    return {
      order,
      notifications: {
        customer: toCustomer.status === 'fulfilled',
        admin: toAdmin.status === 'fulfilled',
      },
    };
  }
}
