/**
 * PUERTO DE SALIDA: contrato que el nucleo necesita para notificar por correo.
 * No conoce SMTP, Nodemailer, Mailtrap ni ningun proveedor.
 */
export class EmailServicePort {
  /** Envia al cliente el comprobante e instrucciones de pago. */
  async sendOrderConfirmation(order) {
    throw new Error('EmailServicePort.sendOrderConfirmation no implementado');
  }

  /** Avisa al administrador de que llego un nuevo pedido. */
  async sendAdminNewOrderAlert(order) {
    throw new Error('EmailServicePort.sendAdminNewOrderAlert no implementado');
  }
}
