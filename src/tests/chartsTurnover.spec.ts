import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { ApiError } from '../errors/ApiError'
import { headCountChartHandler, turnoverChartHandler } from '../modules/charts/services'
import { chartDataMock, responseTurnoverMock } from '../utils/jest'

const BODY_USER = {
  id: '12',
  nome: 'João',
  email: 'teste@teste.com.br',
  cargo: 'Diretor',
  created_at: new Date(),
  updated_at: new Date(),
  email_gestor: '',
  status: 'Ativo',
  iat: 0,
  exp: 0
}

describe('Teste geração de dados para o gráfico de headcount', () => {
  test('Deve retornar os dados para o gráfico', async () => {
    const prismaMock = mockDeep<PrismaClient>()
    prismaMock.$queryRaw.mockResolvedValueOnce(chartDataMock)
    const ANO = 2022

    const response = await turnoverChartHandler({
      user: BODY_USER
    },
    {
      ano: ANO
    },
    {
      prisma: prismaMock
    }
    )

    expect(response).toEqual(responseTurnoverMock)
  })

  test('Deve retornar 401 quando não encontrar o usuario', async () => {
    const prisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()

    expect(
      headCountChartHandler(null, null, {
        prisma
      })
    ).rejects.toBeInstanceOf(ApiError)

    try {
      await headCountChartHandler(null, null, { prisma })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(401)
      }
    }
  })

  test('Deve retornar 400 quando não enviar periodo para consulta', async () => {
    const prisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>()

    const params = [
      {
        user: BODY_USER
      },
      {
        ano: ''
      }
    ]
    expect(
      headCountChartHandler(params[0], params[1], { prisma })
    ).rejects.toBeInstanceOf(ApiError)

    try {
      await headCountChartHandler(params[0], params[1], { prisma })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })
})
