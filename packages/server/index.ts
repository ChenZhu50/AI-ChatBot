import express, { response } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config(); // Load environment variables from .env file

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

let conversation = new Map<string, string>();

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

   const { prompt, conversationId } = req.body;

   const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversation.get(conversationId),
   });
   conversation.set(conversationId, response.id);
   res.json({ message: response.output_text });
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
