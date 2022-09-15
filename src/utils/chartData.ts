import moment, { Moment } from 'moment'
import { ChartDataResponse } from '../database/querys'

export const getAdmissoesERecisoes = (chartData: ChartDataResponse[], end: Moment, start: Moment) => {
  const recisoesTotais = chartData.filter((item) => moment(item.data_de_recisao).isSameOrBefore(end)).length
  const admissoesTotais = chartData.filter((item) => moment(item.data_de_admissao).isSameOrAfter(start)).length
  const totalEmpregadosFim = chartData.filter((item) => !item.data_de_recisao || moment(item.data_de_recisao).isSameOrAfter(end)).length
  const totalEmpregadosInicio = chartData.filter((item) => moment(item.data_de_admissao).isBefore(start.startOf('month'))).length

  return {
    recisoesTotais,
    admissoesTotais,
    totalEmpregadosFim,
    totalEmpregadosInicio
  }
}
