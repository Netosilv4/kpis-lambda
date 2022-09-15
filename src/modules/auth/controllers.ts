import { Request, Response } from 'express'
import { handleLogin } from './services'

export const login = async (req: Request, res: Response) => {
  const { email } = req.body
  const response = await handleLogin({ email })
  res.status(200).json(response)
}
