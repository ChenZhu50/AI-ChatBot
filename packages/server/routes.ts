import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';
import { Prisma } from './generated/prisma';
import { PrismaClient } from './generated/prisma';
import { is } from 'zod/locales';

const routes = express.Router();

routes.get('/', (req: Request, res: Response) => {
   res.send(process.env.OPENAI_API_KEY);
}); //response to root

routes.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello, API!' });
}); //response to root

routes.post('/api/chat', chatController.sendMessage);

routes.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   const prisma = new PrismaClient();
   const productId = Number(req.params.id);

   if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
   }

   const reviews = await prisma.review.findMany({
      where: { productID: productId },
      orderBy: { createdAt: 'desc' },
   });

   res.json(reviews);
});

export default routes; //since this the only object in this file, we can use default export
