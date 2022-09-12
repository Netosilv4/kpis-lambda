-- CreateTable
CREATE TABLE "empregados" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "cargo" TEXT NOT NULL,
    "email_gestor" TEXT,

    CONSTRAINT "empregados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_empregado" (
    "empregado_id" TEXT NOT NULL,
    "data_de_admissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_de_recisao" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "historico_empregado_empregado_id_key" ON "historico_empregado"("empregado_id");

-- AddForeignKey
ALTER TABLE "historico_empregado" ADD CONSTRAINT "historico_empregado_empregado_id_fkey" FOREIGN KEY ("empregado_id") REFERENCES "empregados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
