import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { CreateOrderUseCase } from './application/usecases/CreateOrderUseCase.js';
import { NodemailerAdapter } from './infrastructure/adapters/out/email/NodemailerAdapter.js';
import { InMemoryOrderRepository } from
  './infrastructure/adapters/out/persistence/InMemoryOrderRepository.js';
import { buildOrderRouter } from './infrastructure/adapters/in/http/orderRouter.js';

// ---- Composition root: unico lugar donde se "enchufan" los adaptadores ----
const paymentInfo = {
  bank: process.env.PAY_BANK,
  accountHolder: process.env.PAY_HOLDER,
  clabe: process.env.PAY_CLABE,
  instructions: process.env.PAY_INSTRUCTIONS,
};

const emailService = new NodemailerAdapter({
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  },
  from: process.env.MAIL_FROM,
  adminEmail: process.env.ADMIN_EMAIL,
  paymentInfo,
});

const createOrderUseCase = new CreateOrderUseCase({
  orderRepository: new InMemoryOrderRepository(),
  emailService,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/orders', buildOrderRouter({ createOrderUseCase, paymentInfo }));

app.listen(process.env.PORT || 4000, () =>
  console.log(`API lista en http://localhost:${process.env.PORT || 4000}`));
