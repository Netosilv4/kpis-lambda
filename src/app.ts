import express from 'express'
import serverless from 'serverless-http'
import cors from 'cors'
import authRoutes from './modules/auth/routes';
import { errorMiddleware } from './middlewares/errorHandler';
import chartRoutes from './modules/charts/routes';

const app = express();

app.use(express.json());

app.use(cors());

app.get("/teste", (req, res) => {
  res.status(200).json({ message: "Hello World" })
});

app.use(chartRoutes)

app.use(authRoutes)


app.use(errorMiddleware)

export const handler = serverless(app);
