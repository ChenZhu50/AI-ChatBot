import express, { response } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required.')
      .max(1000, 'Prompt is too long.'),

   conversationId: z.string().uuid(),
});

app.get('/', (req: Request, res: Response) => {
   res.send(process.env.OPENAI_API_KEY);
}); //response to root

app.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello, API!' });
}); //response to root

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.format() });
      return;
   }

   try {
      const { prompt, conversationId } = req.body;
      const response = await chatService.sendMessage(conversationId, prompt);

      res.json({ message: response.message });
   } catch (error) {
      res.status(500).json({
         error: 'An error occurred while processing your request.',
      });
   }
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
