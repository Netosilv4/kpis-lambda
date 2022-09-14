import express from 'express'
import serverless from 'serverless-http'
import cors from 'cors'
import authRoutes from './modules/auth/routes'
import { errorMiddleware } from './middlewares/errorHandler'
import chartRoutes from './modules/charts/routes'

// Imports utilizados para popular o banco de dados
// import multer from 'multer';
// import { populateHandler } from './modules/populate';
// const upload = multer({ dest: 'tmp/uploads/' });

const app = express()

app.use(express.json())

app.use(cors())

// Função criada para popular o banco de dados, não é mais necessária, mas deixei aqui para fins de estudo e caso seja necessário reutilizar
// app.post("/populate", upload.single("file"), populateHandler);

app.use(chartRoutes)

app.use(authRoutes)

app.use(errorMiddleware)

export const handler = serverless(app)
