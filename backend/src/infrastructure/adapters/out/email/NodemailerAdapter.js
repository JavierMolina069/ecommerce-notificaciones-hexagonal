import nodemailer from 'nodemailer';
import { EmailServicePort } from '../../../../application/ports/out/EmailServicePort.js';
import { customerOrderEmail, adminOrderEmail } from './templates/orderTemplates.js';

/**
 * ADAPTADOR DE SALIDA: implementa EmailServicePort usando Nodemailer (SMTP).
 * Es el UNICO archivo que conoce a Nodemailer. Cambiar de proveedor
 * (SendGrid, SES...) = crear otro adaptador, sin tocar dominio ni casos de uso.
 */
export class NodemailerAdapter extends EmailServicePort {
  constructor({ smtp, from, adminEmail, paymentInfo, transporter }) {
    super();
    this.transporter = transporter ?? nodemailer.createTransport(smtp);
    this.from = from;
    this.adminEmail = adminEmail;
    this.paymentInfo = paymentInfo;
  }

  async sendOrderConfirmation(order) {
    const { subject, html, text } = customerOrderEmail(order, this.paymentInfo);
    const info = await this.transporter.sendMail({
      from: this.from, to: order.customer.email, subject, html, text,
    });
    return { messageId: info.messageId };
  }

  async sendAdminNewOrderAlert(order) {
    const { subject, html, text } = adminOrderEmail(order);
    const info = await this.transporter.sendMail({
      from: this.from, to: this.adminEmail, subject, html, text,
    });
    return { messageId: info.messageId };
  }
}
