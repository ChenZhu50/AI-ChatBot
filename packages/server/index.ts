import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send(process.env.OPENAI_API_KEY);
}); //response to root

app.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello, API!' });
}); //response to root

app.post('/api/chat', chatController.sendMessage);

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
