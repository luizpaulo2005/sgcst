-- CreateEnum
CREATE TYPE "TipoToken" AS ENUM ('RECUPERAR_SENHA', 'DEFINIR_SENHA');

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "tipo" "TipoToken" NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valido_ate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
