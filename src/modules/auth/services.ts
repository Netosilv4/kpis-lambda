import { ApiError } from '../../errors/ApiError'
import { generateToken } from '../../utils/jwt'
import AuthModel from './model'
import { validateLogin } from './validators'

export const handleLogin = async (body: any) => {
  validateLogin(body)
  const user = await AuthModel.findUser(body.email)
  if (user === null) return ApiError.notFound('Usuario não encontradooo')
  const token = generateToken(user)
  return {
    ...user,
    token
  }
}
