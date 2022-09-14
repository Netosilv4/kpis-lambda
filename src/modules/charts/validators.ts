import Joi from 'joi'
import { ApiError } from '../../errors/ApiError'

export const validateChartBody = (body: any) => {
  const schema = Joi.object({
    user: Joi.object({
      email: Joi.string().email().required(),
      id: Joi.string().required(),
      nome: Joi.string().required(),
      created_at: Joi.date().required(),
      updated_at: Joi.date().required(),
      status: Joi.string().required(),
      cargo: Joi.string().required(),
      email_gestor: Joi.string().email().empty(''),
      iat: Joi.number().required(),
      exp: Joi.number().required()
    }).required()
  })

  const { error } = schema.validate(body)
  if (error) ApiError.unauthorized(error.message)
}

export const validateChartParams = (params: any) => {
  const schema = Joi.object({
    ano: Joi.number().required()
  })

  const { error } = schema.validate(params)
  if (error) ApiError.badRequest(error.message)
}
