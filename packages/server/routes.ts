import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';

const routes = express.Router();

routes.get('/', (req: Request, res: Response) => {
   res.send(process.env.OPENAI_API_KEY);
}); //response to root

routes.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello, API!' });
}); //response to root

routes.post('/api/chat', chatController.sendMessage);

export default routes; //since this the only object in this file, we can use default export
