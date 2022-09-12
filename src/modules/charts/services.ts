import { HistoricoEmpregado } from '@prisma/client';
import { Prisma } from '../../database';
import { headCountChartQuery } from '../../database/querys';
import { ApiError } from '../../errors/ApiError';

interface ChartData {

}

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
        days.push({
            x: new Date(i),
            y: totalEmpregadosInicio,
        });
    }

    days.forEach((day) => {
        const recisoesDia = chartData.filter((data) => data.data_de_recisao && (data.data_de_recisao.getTime() <= day.x.getTime()));
        const admissoesDia = chartData.filter((data) => data.data_de_admissao < day.x && data.data_de_admissao.getTime() > start.getTime());
        if(recisoesDia.length) day.y -= recisoesDia.length
        if(admissoesDia.length) day.y += admissoesDia.length
    })

    return {
        chartData: {
            id: "headCount",
            color: "hsl(174, 70%, 50%)",
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
