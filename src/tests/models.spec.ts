import { Prisma } from '../database'
import AuthModel from '../modules/auth/model'
import ChartModel from '../modules/charts/model'
import { chartDataMock } from '../utils/jest'
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

describe('Teste de metodos para models', () => {
  test('AuthModel findUser', async () => {
    jest.spyOn(Prisma.empregado, 'findFirst').mockResolvedValueOnce(empregadoEmailValido)
    const response = await AuthModel.findUser('teste@teste.com.br')
    expect(response).toEqual(empregadoEmailValido)
  })

  test('ChartModel getChartData', async () => {
    jest.spyOn(Prisma, '$queryRaw').mockResolvedValueOnce(chartDataMock)

    const start = new Date('2021-01-01')
    const end = new Date('2021-01-31')
    const response = await ChartModel.getChartData('teste@1234.com', start, end)

    expect(response).toEqual(chartDataMock)
  })
})
