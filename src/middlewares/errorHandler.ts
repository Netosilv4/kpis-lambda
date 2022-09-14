import { ApiError } from '../errors/ApiError'
import { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message })
  }
  res.status(500).json({
    status: 'error',
    message: error
  })
}
