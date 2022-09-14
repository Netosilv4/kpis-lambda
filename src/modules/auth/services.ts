import { ApiError } from '../../errors/ApiError'
import { generateToken } from '../../utils/jwt'
import { validateLogin } from './validators'
import { Context } from '../../../context'

export const handleLogin = async (body: any, context: Context) => {
  validateLogin(body)
  const user = await context.prisma.empregado.findFirst({
    where: {
      email: body.email
    }
  })
  if (!user) return ApiError.notFound('Usuario não encontrado')
  const token = generateToken(user)
  return {
    ...user,
    token
  }
}
