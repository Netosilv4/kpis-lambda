
import { parse } from 'csv-parse'
import { Request, Response } from 'express'
import fs from 'fs'
import { Prisma } from '../database'
import { mmDDYYYY } from '../utils/dateFormater'

const formatRow = (rows: any) => {
  const data = rows.map((row: any) => ({
    empregado: {
      id: row[0],
      status: row[1],
      nome: row[2],
      email: row[3],
      email_gestor: row[4],
      cargo: row[7]
    },
    historico: {
      empregado_id: row[0],
      data_de_admissao: mmDDYYYY(row[5]),
      data_de_recisao: mmDDYYYY(row[6])
    }
  }
  ))
  return data
}

// Este script foi utilizado apenas no inicio do projeto para parsear o csv e popular o banco de dados e não esta mais sendo utilizado

export const populateHandler = async (req: Request, res: Response) => {
  try {
    const rows: any = []
    if (req.query.populateKey !== process.env.POPULATE_KEY) return res.status(401).send('Unauthorized')
    if (!req.file) return res.status(400).json({ message: 'File not found' })
    const file = req.file
    const stream = fs.createReadStream(file.path)
    const parser = parse({
      delimiter: ',',
      from_line: 2
    })
    stream.pipe(parser)
    for await (const record of parser) {
      rows.push(record)
    }
    const data = await formatRow(rows)
    const empregadosResult = await Prisma.empregado.createMany({
      data: data.map((item: any) => item.empregado),
      skipDuplicates: true
    })
    const historicoResult = await Prisma.historicoEmpregado.createMany({
      data: data.map((item: any) => item.historico),
      skipDuplicates: true
    })
    fs.unlinkSync(file.path)
    res.status(200).json({ message: 'Success', empregadosResult, historicoResult })
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', err })
  }
}
