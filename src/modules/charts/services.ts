import { headCountChartQuery } from '../../database/querys';
import { ApiError } from '../../errors/ApiError';
import moment from 'moment'
import { isBetweenMonth } from '../../utils/dateFormater';
moment.locale('pt-br');

export const headCountChartHandler = async (body: any, params: any) => {
    if(!body.user) ApiError.unauthorized("Token inválido");
    const {  email } = body.user;
    const { ano } = params;
    const start = moment().utc().year(ano).startOf('year');
    const end = moment().utc().year(ano).endOf('year');

    const chartData = await headCountChartQuery(email, start.toDate(), end.toDate())

    const totalEmpregadosInicio = chartData.filter((item) => moment(item.data_de_admissao).isBefore(start)).length
    
    const months = [];
    for(let i = moment.utc().year(ano).startOf('year'); i.isBefore(moment.utc().year(ano).endOf('year')); i.add(1, 'month')) {
        const recisoesMes = chartData.filter((item) => item.data_de_recisao && moment(item.data_de_recisao).utc().isBefore(i.endOf("month"))).length
        const admissoesMes = chartData.filter((item) => moment(item.data_de_admissao).isAfter(start) && moment(item.data_de_admissao).utc().isBefore(i.endOf("month"))).length
        months.push({
            x: i.format('MMMM'),
            y: totalEmpregadosInicio + admissoesMes - recisoesMes
        })
    }
    
    const totalEmpregadosFim = months[months.length - 1].y
    const balancoGeral = ((totalEmpregadosFim - totalEmpregadosInicio) / totalEmpregadosInicio * 100).toFixed(2);
    const recisoesTotais = chartData.filter((item) => moment(item.data_de_recisao).isBefore(end)).length
    const admissoesTotais = chartData.filter((item) => moment(item.data_de_admissao).isAfter(start)).length

    return {
        chartData: {
            id: "Headcount",
            data: months
        },
        generalData: {
            totalEmpregadosInicio: totalEmpregadosInicio,
            balancoGeral: balancoGeral,
            totalEmpregadosFim: totalEmpregadosFim,
            recisoesTotais,
            admissoesTotais
        }
    }
};


export const turnoverChartHandler = async (body: any, params: any) => {
    if(!body.user) ApiError.unauthorized("Token inválido");
    const {  email } = body.user;
    const { ano } = params;
    moment.locale('pt-br');
    const start = moment().utc().year(ano).startOf('year');
    const end = moment().utc().year(ano).endOf('year');

    const chartData = await headCountChartQuery(email, start.toDate(), end.toDate())

    const totalEmpregadosInicio = chartData.filter((item) => moment(item.data_de_admissao).isBefore(start)).length
   
    const months = []

    for(let i = moment.utc().year(ano).startOf('year'); i.isBefore(moment.utc().year(ano).endOf('year')); i.add(1, 'month')) {
        const recisoesMes = chartData.filter((item) => item.data_de_recisao && isBetweenMonth(item.data_de_recisao, i)).length
        const admissoesMes = chartData.filter((item) => isBetweenMonth(item.data_de_admissao, i)).length
        const empregadosMesInicio = chartData.filter((item) => moment(item.data_de_admissao).isBefore(i.startOf("month")) && (!item.data_de_recisao || moment(item.data_de_recisao).isAfter(i.startOf("month")))).length
        months.push({
            x: i.format('MMMM'),
            y: (recisoesMes / (empregadosMesInicio + admissoesMes - recisoesMes) * 100).toFixed(2),
        });
    }

    const recisoesTotais = chartData.filter((item) => moment(item.data_de_recisao).isBefore(end)).length
    const admissoesTotais = chartData.filter((item) => moment(item.data_de_admissao).isAfter(start)).length
    const balancoMes = admissoesTotais - recisoesTotais;
    const balancoGeral = (recisoesTotais / (totalEmpregadosInicio + balancoMes) * 100).toFixed(2);

    return {
        chartData: {
            id: "Turnover",
            data: months
        },
        generalData: {
            totalEmpregadosInicio,
            recisoesTotais,
            admissoesTotais,
            balancoGeral,
        } 
    }
}