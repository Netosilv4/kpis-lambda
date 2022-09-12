import { HistoricoEmpregado } from "@prisma/client"
import { Prisma } from "."

export const headCountChartQuery = async (email: string, start: Date, end: Date) => {
    const data = Prisma.$queryRaw<HistoricoEmpregado[]>`
    WITH RECURSIVE subordinates AS (
                select
                    id,
                    cargo,
                    nome,
                    email,
                    email_gestor,
                    he.data_de_admissao,
                    he.data_de_recisao
                FROM
                    empregados y
                inner join 
                    historico_empregado he 
                on y.id = he.empregado_id 
                WHERE
                    y.email_gestor = ${email}
                UNION
                    select
                        e.id,
                        e.cargo,
                        e.nome,
                        e.email,
                        e.email_gestor,
                        he2.data_de_admissao,
                        he2.data_de_recisao 
                    FROM
                        empregados e
                    inner join
                        historico_empregado he2
                    on e.id = he2.empregado_id 
                    INNER JOIN subordinates s ON s.email = e.email_gestor
            ) SELECT
                *
            FROM
                subordinates
            where
                subordinates.data_de_admissao <= ${end}
            and 
                (
                    (
                        subordinates.data_de_recisao <= ${end} 
                            and 
                        subordinates.data_de_recisao >= ${start}
                    )
                    or subordinates.data_de_recisao is null
                )
    `
    return data
}