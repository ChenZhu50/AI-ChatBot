import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const routes = express.Router();

routes.get('/', (req: Request, res: Response) => {
   res.send(process.env.OPENAI_API_KEY);
}); //response to root

routes.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello, API!' });
}); //response to root

routes.post('/api/chat', chatController.sendMessage);

routes.get('/api/products/:id/reviews', reviewController.getReviews);

routes.post(
   '/api/products/:id/reviews/summarize',
   reviewController.summarizeReviews
);

export default routes; //since this the only object in this file, we can use default export
