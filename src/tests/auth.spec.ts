import { ApiError } from '../errors/ApiError'
import AuthModel from '../modules/auth/model'
import { handleLogin } from '../modules/auth/services'

const empregadoEmailValido = {
  id: '',
  nome: 'João',
  email: 'teste@teste.com.br',
  cargo: 'Diretor',
  created_at: new Date(),
  updated_at: new Date(),
  email_gestor: '',
  status: 'Ativo'
}

describe('Teste de autenticação', () => {
  test('Retorna empregado', async () => {
    jest.spyOn(AuthModel, 'findUser').mockResolvedValueOnce(empregadoEmailValido)
    const response = await handleLogin({ email: 'teste@teste.com.br' })

    expect(response).toHaveProperty('token')

    expect(response).toEqual({
      ...response,
      token: expect.any(String)
    })
  })

  test('Retorna 400 quando não enviado body', async () => {
    try {
      await handleLogin(null)
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })

  test('Retorna 400 quando não enviado o email', async () => {
    try {
      await handleLogin({ email: '' })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })

  test('Retorna 404 quando não encontrado usuario', async () => {
    jest.spyOn(AuthModel, 'findUser').mockResolvedValueOnce(null)

    try {
      await handleLogin({ email: 'netos2@teste.com' })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(404)
      }
    }
  })

  test('Retorna 401 quando o email é inválido', async () => {
    try {
      await handleLogin({ email: '' })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })
})
