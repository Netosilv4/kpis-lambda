import express from 'express'
import rescue from 'express-rescue';
import { jwtHandler } from '../../middlewares/jwtHandler';
import { headCountChart, turnoverChart } from './controllers';

const chartRoutes = express.Router();

chartRoutes.get("/headCountChart", rescue(jwtHandler),  rescue(headCountChart))

chartRoutes.get("/turnoverChart", rescue(jwtHandler),  rescue(turnoverChart))

export default chartRoutes;