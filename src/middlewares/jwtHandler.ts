import { NextFunction, Request, Response } from 'express'
import { validateToken } from '../utils/jwt'
import { ApiError } from '../errors/ApiError'

export const jwtHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return ApiError.unauthorized('Token não encontrado')
    const decoded = validateToken(token)
    req.body.user = decoded
    next()
  } catch (err) {
    ApiError.unauthorized('Token inválido')
  }
}
