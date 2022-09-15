import { ChartDataResponse } from '../database/querys'
import { ApiError } from '../errors/ApiError'
import ChartModel from '../modules/charts/model'
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
    jest.spyOn(ChartModel, 'getChartData').mockReturnValueOnce(chartDataMock as unknown as Promise<ChartDataResponse[]>)
    const ANO = 2022

    const response = await turnoverChartHandler({
      user: BODY_USER
    },
    {
      ano: ANO
    }
    )

    expect(response).toEqual(responseTurnoverMock)
  })

  test('Deve retornar 401 quando não encontrar o usuario', async () => {
    expect(
      headCountChartHandler(null, null)
    ).rejects.toBeInstanceOf(ApiError)

    try {
      await headCountChartHandler(null, null)
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(401)
      }
    }
  })

  test('Deve retornar 400 quando não enviar periodo para consulta', async () => {
    const params = [
      {
        user: BODY_USER
      },
      {
        ano: ''
      }
    ]
    expect(
      headCountChartHandler(params[0], params[1])
    ).rejects.toBeInstanceOf(ApiError)

    try {
      await headCountChartHandler(params[0], params[1])
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(400)
      }
    }
  })
})
