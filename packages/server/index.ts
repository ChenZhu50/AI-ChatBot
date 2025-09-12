import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config(); // Load environment variables from .env file

//setting up express app
const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
