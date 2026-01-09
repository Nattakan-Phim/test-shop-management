import express, { type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './config/database.js';
import { swaggerDocument } from './config/swagger.js';
import routes from './routes/index.js';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use(routes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;