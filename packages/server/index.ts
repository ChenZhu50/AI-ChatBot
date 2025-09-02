import express from 'express';
import type {Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!'
  );
}); //response to root

app.get('/api/hello', (req: Request, res: Response) => {
  res.send({message: 'Hello, API!'});
}); //response to root

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
