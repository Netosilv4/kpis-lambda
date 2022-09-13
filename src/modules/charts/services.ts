import { HistoricoEmpregado } from '@prisma/client';
import { headCountChartQuery } from '../../database/querys';
import { ApiError } from '../../errors/ApiError';


export const headCountChartHandler = async (body: any, params: any) => {
    if(!body.user) ApiError.unauthorized("Token inválido");
    const {  email } = body.user;
    const { mes, ano } = params;
    const start = new Date(Number(ano), Number(mes), 1, 0);
    const end = new Date(Number(ano), Number(mes) + 1, 0);
    const chartData = await headCountChartQuery(email, start, end)

    let recisoesMes: HistoricoEmpregado [] = chartData.filter((item) => item.data_de_recisao && item.data_de_recisao.getTime() <= end.getTime());
    let admissoesMes: HistoricoEmpregado [] = chartData.filter((item) => item.data_de_admissao.getTime() <= end.getTime() && item.data_de_admissao > start);
    
    const totalEmpregadosInicio = chartData.filter((item) => item.data_de_admissao.getTime() <= start.getTime() && (!item.data_de_recisao || item.data_de_recisao.getTime() >= end.getTime())).length
    const totalEmpregadosFim = totalEmpregadosInicio + admissoesMes.length - recisoesMes.length;
    const balancoGeral = ((totalEmpregadosFim - totalEmpregadosInicio) / totalEmpregadosInicio * 100).toFixed(2);
    
    const days = []
    for(let i = start; i <= end; i = new Date(i.setDate(i.getDate() + 1))) {
        const recisoesDia = chartData.filter((data) => data.data_de_recisao && (data.data_de_recisao.getTime() <= i.getTime()));
        const admissoesDia = chartData.filter((data) => data.data_de_admissao.getTime() < i.getTime() && data.data_de_admissao.getTime() > start.getTime());
        days.push({
            x: new Date(i),
            y: totalEmpregadosInicio + admissoesDia.length - recisoesDia.length,
        });
    }

    return {
        chartData: {
            id: "Headcount",
            data: [
                ...days.map((item) => ({
                    x: item.x.getDate(),
                    y: item.y,
                }))
            ],
        },
        generalData: {
            recisoesMes,
            admissoesMes,
            totalEmpregadosInicio,
            totalEmpregadosFim,
            balancoGeral,
        }
    }
};


export const turnoverChartHandler = async (body: any, params: any) => {
    if(!body.user) ApiError.unauthorized("Token inválido");
    const {  email } = body.user;
    const { mes, ano } = params;
    const start = new Date(Number(ano), Number(mes), 1, 0);
    const end = new Date(Number(ano), Number(mes) + 1, 0);
    const chartData = await headCountChartQuery(email, start, end)

    let recisoesMes: HistoricoEmpregado [] = chartData.filter((item) => item.data_de_recisao && item.data_de_recisao.getTime() <= end.getTime());
    let admissoesMes: HistoricoEmpregado [] = chartData.filter((item) => item.data_de_admissao.getTime() <= end.getTime() && item.data_de_admissao > start);
    const totalEmpregadosInicio = chartData.filter((item) => item.data_de_admissao.getTime() <= start.getTime() && (!item.data_de_recisao || item.data_de_recisao.getTime() >= end.getTime())).length
    const totalEmpregadosFim = totalEmpregadosInicio + admissoesMes.length - recisoesMes.length;
    const days = []

    for(let i = start; i <= end; i = new Date(i.setDate(i.getDate() + 1))) {
        const recisoesDia = chartData.filter((data) => data.data_de_recisao && (data.data_de_recisao.getTime() <= i.getTime())).length
        const admissoesDia = chartData.filter((data) => data.data_de_admissao.getTime() < i.getTime() && data.data_de_admissao.getTime() > start.getTime()).length;
        days.push({
            x: new Date(i),
            y: (recisoesDia / (totalEmpregadosInicio + admissoesDia - recisoesDia) * 100).toFixed(2),
        });
    }

    const balancoMes = admissoesMes.length - recisoesMes.length;
    const balancoGeral = (recisoesMes.length / (totalEmpregadosInicio + balancoMes) * 100).toFixed(2);

    return {
        chartData: {
            id: "Turnover",
            data: [
                ...days.map((item) => ({
                    x: item.x.getDate(),
                    y: item.y,
                }))
            ],
        },
        generalData: {
            totalEmpregadosInicio,
            totalEmpregadosFim,
            recisoesMes,
            admissoesMes,
            balancoGeral,
        } 
    }
}