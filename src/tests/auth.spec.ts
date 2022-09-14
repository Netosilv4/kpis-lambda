import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { ApiError } from '../errors/ApiError'
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
    const prisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()
    prisma.empregado.findFirst.mockResolvedValue(empregadoEmailValido)

    const response = await handleLogin({ email: 'teste@teste.com.br' }, {
      prisma
    })

    expect(response).toHaveProperty('token')

    expect(response).toEqual({
      ...response,
      token: expect.any(String)
    })
  })

  test('Retorna 400 quando não enviado o email', async () => {
    const prisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()
    prisma.empregado.findFirst.mockResolvedValue(empregadoEmailValido)

    expect(
      handleLogin({ email: '' }, { prisma })
    ).rejects.toBeInstanceOf(ApiError)

    try {
      await handleLogin({ email: '' }, { prisma })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })

  test('Retorna 404 quando não encontra do usuario', async () => {
    const prisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()
    prisma.empregado.findFirst.mockResolvedValue(null)

    expect(
      handleLogin({ email: 'testeVazio@email.com' }, { prisma })
    ).rejects.toBeInstanceOf(ApiError)

    try {
      await handleLogin({ email: 'netos2@teste.com' }, { prisma })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(404)
      }
    }
  })

  test('Retorna 401 quando o email é inválido', async () => {
    const prisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()
    prisma.empregado.findFirst.mockResolvedValue(empregadoEmailValido)

    expect(
      handleLogin({ email: 'testeInvalido' }, { prisma })
    ).rejects.toBeInstanceOf(ApiError)

    try {
      await handleLogin({ email: '' }, { prisma })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })
})
