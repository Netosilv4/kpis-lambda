import { Request, Response } from 'express'
import { Prisma } from '../../database'
import { headCountChartHandler, turnoverChartHandler } from './services'

export const headCountChart = async (req: Request, res: Response) => {
  const { body, query } = req
  const response = await headCountChartHandler(body, query, {
    prisma: Prisma
  })
  res.status(200).json(response)
}

export const turnoverChart = async (req: Request, res: Response) => {
  const { body, query } = req
  const response = await turnoverChartHandler(body, query, {
    prisma: Prisma
  })
  res.status(200).json(response)
}
