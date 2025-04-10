-- CreateEnum
CREATE TYPE "AcaoChamado" AS ENUM ('ABRIR', 'FECHAR', 'REABRIR', 'COMENTAR', 'ALTERAR');

-- CreateTable
CREATE TABLE "logs_chamados" (
    "id" TEXT NOT NULL,
    "acao" "AcaoChamado" NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "chamadoId" TEXT NOT NULL,

    CONSTRAINT "logs_chamados_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logs_chamados" ADD CONSTRAINT "logs_chamados_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_chamados" ADD CONSTRAINT "logs_chamados_chamadoId_fkey" FOREIGN KEY ("chamadoId") REFERENCES "chamados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
