import express, { response } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
}); //response to root

app.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello, API!' });
}); //response to root

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt } = req.body;

   const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
   });
   res.json({ message: response.output_text });
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
