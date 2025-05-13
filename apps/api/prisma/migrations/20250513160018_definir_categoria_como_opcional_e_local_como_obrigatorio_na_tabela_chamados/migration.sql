/*
  Warnings:

  - Made the column `localId` on table `chamados` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "chamados" DROP CONSTRAINT "chamados_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "chamados" DROP CONSTRAINT "chamados_localId_fkey";

-- AlterTable
ALTER TABLE "chamados" ALTER COLUMN "categoriaId" DROP NOT NULL,
ALTER COLUMN "localId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "chamados" ADD CONSTRAINT "chamados_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados" ADD CONSTRAINT "chamados_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
