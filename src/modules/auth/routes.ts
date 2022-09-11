import express from 'express'
import { login } from './controllers';
import rescue from 'express-rescue';

const authRoutes = express.Router();

authRoutes.post('/login', rescue(login));

export default authRoutes;