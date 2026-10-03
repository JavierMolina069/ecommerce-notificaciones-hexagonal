import { Router } from 'express';

/** ADAPTADOR DE ENTRADA: traduce HTTP -> caso de uso. */
export function buildOrderRouter({ createOrderUseCase, paymentInfo }) {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const { order, notifications } = await createOrderUseCase.execute(req.body);
      res.status(201).json({
        id: order.id,
        status: order.status,
        total: order.total,
        paymentInfo,
        notifications,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
