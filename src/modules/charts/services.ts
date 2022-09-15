import moment from 'moment'
import { getAdmissoesERecisoes } from '../../utils/chartData'
import { isBetweenMonth, isANumber } from '../../utils/dateFormater'
import { validateChartBody, validateChartParams } from './validators'
import ChartModel from './model'
moment.locale('pt-br')

export const headCountChartHandler = async (body: any, params: any) => {
  validateChartBody(body)
  validateChartParams(params)
  const { ano } = params
  const { email } = body.user

  const start = moment().utc().year(ano).startOf('year')
  const end = moment().utc().year(ano).endOf('year')

  const chartData = await ChartModel.getChartData(email, start.toDate(), end.toDate())

  const { admissoesTotais, recisoesTotais, totalEmpregadosFim, totalEmpregadosInicio } = getAdmissoesERecisoes(chartData, end, start)

  const months = []

  for (let i = moment.utc().year(ano).startOf('year'); i.isSameOrBefore(moment.utc().year(ano).endOf('year')); i.add(1, 'month')) {
    const recisoesMes = chartData.filter((item) => item.data_de_recisao && moment(item.data_de_recisao).utc().isSameOrBefore(i.endOf('month'))).length
    const admissoesMes = chartData.filter((item) => moment(item.data_de_admissao).isSameOrAfter(start) && moment(item.data_de_admissao).utc().isSameOrBefore(i.endOf('month'))).length

    months.push({
      x: i.format('MMMM'),
      y: totalEmpregadosInicio + admissoesMes - recisoesMes
    })
  }

  const balancoGeral = isANumber(((totalEmpregadosFim - totalEmpregadosInicio) / totalEmpregadosInicio * 100))

  return {
    chartData: {
      id: 'Headcount',
      data: months
    },
    generalData: {
      totalEmpregadosInicio,
      balancoGeral,
      totalEmpregadosFim,
      recisoesTotais,
      admissoesTotais
    }
  }
}

export const turnoverChartHandler = async (body: any, params: any) => {
  validateChartBody(body)
  validateChartParams(params)
  const { ano } = params
  const { email } = body.user

  moment.locale('pt-br')

  const start = moment().utc().year(ano).startOf('year')
  const end = moment().utc().year(ano).endOf('year')

  const chartData = await ChartModel.getChartData(email, start.toDate(), end.toDate())

  const { admissoesTotais, recisoesTotais, totalEmpregadosFim, totalEmpregadosInicio } = getAdmissoesERecisoes(chartData, end, start)

  const months = []

  for (let i = moment.utc().year(ano).startOf('year'); i.isSameOrBefore(moment.utc().year(ano).endOf('year')); i.add(1, 'month')) {
    const recisoesMes = chartData.filter((item) => item.data_de_recisao && isBetweenMonth(item.data_de_recisao, i)).length
    const admissoesMes = chartData.filter((item) => isBetweenMonth(item.data_de_admissao, i)).length
    const empregadosMesInicio = chartData.filter((item) => moment(item.data_de_admissao).isSameOrBefore(i.startOf('month')) && (!item.data_de_recisao || moment(item.data_de_recisao).isSameOrAfter(i.startOf('month')))).length

    months.push({
      x: i.format('MMMM'),
      y: (recisoesMes / (empregadosMesInicio + admissoesMes - recisoesMes) * 100).toFixed(2)
    })
  }

  const balancoGeral = (recisoesTotais / (totalEmpregadosFim) * 100).toFixed(2)

  return {
    chartData: {
      id: 'Turnover',
      data: months
    },
    generalData: {
      totalEmpregadosInicio,
      balancoGeral,
      totalEmpregadosFim,
      recisoesTotais,
      admissoesTotais
    }
  }
}
