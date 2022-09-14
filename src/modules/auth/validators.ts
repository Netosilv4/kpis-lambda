import Joi from 'joi'
import { ApiError } from '../../errors/ApiError'

export const validateLogin = (body: any) => {
  if (!body) ApiError.badRequest('Body não pode ser vazio')
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email não pode ser vazio',
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    })
  })
  const { error } = schema.validate(body)
  if (error) ApiError.badRequest(error.details[0].message)
}
