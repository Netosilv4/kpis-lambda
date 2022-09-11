import express from 'express'
import rescue from 'express-rescue';
import { jwtHandler } from '../../middlewares/jwtHandler';
import { headCountChart } from './controllers';

const chartRoutes = express.Router();

chartRoutes.get("/headCountChart", rescue(jwtHandler),  rescue(headCountChart))

export default chartRoutes;