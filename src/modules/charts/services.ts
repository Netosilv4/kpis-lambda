import { HistoricoEmpregado } from '@prisma/client';
import { Prisma } from '../../database';
import { ApiError } from '../../errors/ApiError';

interface ChartData {

}

export const headCountChartHandler = async (body: any, params: any) => {
    if(!body.user) ApiError.unauthorized("Token inválido");
    const { cargo } = body.user;
    const { mes, ano } = params;
    let query = {}
    const start = new Date(Number(ano), Number(mes - 1), 1);
    const end = new Date(Number(ano), Number(mes - 1) + 1, 0);
    if(cargo === "Diretor") {
        query = {
            where: {
                OR: [
                    {
                        dataDeRecisao: {
                            lt: end,
                            gt: start
                        }
                    },
                    {
                        dataDeRecisao: {
                            equals: null,
                        },
                        dataDeAdmissao: {
                            lt: end,
                        }
                    }
                ]
            },
        }
    }
    const chartData = await Prisma.historicoEmpregado.findMany({
        ...query,
        orderBy: {
            dataDeAdmissao: 'asc'
        }
    });
    const days = []
    console.log("end", end)
    console.log("start", start)
    let recisoesMes: HistoricoEmpregado [] = chartData.filter((item) => item.dataDeRecisao && item.dataDeRecisao.getTime() <= end.getTime());
    let admissoesMes: HistoricoEmpregado [] = chartData.filter((item) => item.dataDeAdmissao.getTime() <= end.getTime() && item.dataDeAdmissao > start);
    for(let i = start; i <= end; i = new Date(i.setDate(i.getDate() + 1))) {
        days.push({
            x: new Date(i),
            y: chartData.filter((item) => item.dataDeAdmissao.getTime() <= start.getTime() && (!item.dataDeRecisao || item.dataDeRecisao.getTime() >= end.getTime())).length,
        });
    }
    days.forEach((day) => {
        const recisoesDia = chartData.filter((data) => data.dataDeRecisao && (data.dataDeRecisao.getTime() <= day.x.getTime()));
        const admissoesDia = chartData.filter((data) => data.dataDeAdmissao < day.x && data.dataDeAdmissao.getTime() > start.getTime());
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
        }
    }
};
