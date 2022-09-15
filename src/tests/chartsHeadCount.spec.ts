import { ChartDataResponse } from '../database/querys'
import { ApiError } from '../errors/ApiError'
import ChartModel from '../modules/charts/model'
import { headCountChartHandler } from '../modules/charts/services'
import { chartDataMock, responseHeadcountMock } from '../utils/jest'

const bodyUser = {
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

    const response = await headCountChartHandler({
      user: bodyUser
    },
    {
      ano: 2022
    })

    expect(response).toEqual(responseHeadcountMock)
  })

  test('Deve retornar 401 quando não encontrar o usuario', async () => {
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
        user: bodyUser
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
