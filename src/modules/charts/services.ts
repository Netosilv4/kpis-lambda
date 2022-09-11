import { Prisma } from '../../database';
import { ApiError } from '../../errors/ApiError';

export const headCountChartHandler = async (body: any) => {
    if(!body.user) ApiError.unauthorized("Token inválido");
    const { cargo, email, emailGestor } = body.user;
    let query = {}
    const start = new Date(2022, 9, 1);
    const finish = new Date(2022, 12, 15);
    if(cargo === "Diretor") {
        query = {
            where: {
                OR: [
                    {
                        dataDeRecisao: {
                            lt: finish,
                            gt: start
                        }
                    },
                    {
                        dataDeRecisao: {
                            equals: null,
                        },
                        dataDeAdmissao: {
                            lt: finish,
                        }
                    }
                ] 
            },
        }
    }
    const chartData = await Prisma.historicoEmpregado.findMany(query);
    const dates = [];
    while(start <= finish) {
        dates.push({
            day: start.getDate(),
            month: start.getMonth(),
            year: start.getFullYear(),
            count: 0,
        });
        start.setDate(start.getDate() + 1);
    }
    // chartData.forEach((data) => {
    //     const dayAdmissao = data.dataDeAdmissao.getDate();
    //     const dayRecisao = data.dataDeRecisao ? data.dataDeRecisao.getDate() : null
    //     if(data.dataDeAdmissao > firstDayOfMonth) {
    //         days.forEach((day, index) => {
    //             if(index >= dayAdmissao) {
    //                 days[index].count += 1;
    //             }
    //         })
    //     }
    //     if(dayRecisao) {
    //         days.forEach((day, index) => {
    //             if(index >= dayRecisao) {
    //                 days[index].count -= 1;
    //             }
    //         })
    //     }
    // })

    return dates;
};
