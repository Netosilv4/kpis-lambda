import { isANumber, mmDDYYYY } from '../utils/dateFormater'
import { generateToken, validateToken } from '../utils/jwt'

describe('Teste de funções utils', () => {
  test('Função mmDDYYYY retorna data formatada', async () => {
    const response = mmDDYYYY('01/01/2021')
    expect(response).toEqual(new Date('2021-01-01'))
  })

  test('Função mmDDYYYY retorna null quando data inválida', async () => {
    const response = mmDDYYYY('01/01/202')
    expect(response).toBeNull()
  })

  test('JWT gera token ao passar um body', () => {
    const body = {
      id: 1,
      email: ''
    }
    const token = generateToken(body)

    expect(token).toEqual(expect.any(String))
  })

  test('JWT gera um erro ao não passar body', () => {
    const body = null
    expect(() => generateToken(body)).toThrow()
  })

  test('JWT valida token com chave válida e retorna body correto', () => {
    const body = {
      id: 1,
      email: ''
    }
    const token = generateToken(body)

    const decoded = validateToken(token)

    expect(decoded).toEqual({
      id: 1,
      email: '',
      iat: expect.any(Number),
      exp: expect.any(Number)
    })
  })

  test('isANumber retorna resultado correto', () => {
    const response = isANumber(1)
    expect(response).not.toBe(0)
  })

  test('isANumber retorna 0 quando é um número do tipo "inifinity"', () => {
    const numero = 1 / 0
    const response = isANumber(numero)
    expect(response).toBe(0)
  })

  test('isANumber retorna 0 quando é um número do tipo "NaN"', () => {
    const numero = 'teste'
    const response = isANumber(numero)
    expect(response).toBe(0)
  })
})
