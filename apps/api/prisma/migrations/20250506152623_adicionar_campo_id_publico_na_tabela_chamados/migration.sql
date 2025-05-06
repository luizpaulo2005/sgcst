/*
  Warnings:

  - A unique constraint covering the columns `[id_publico]` on the table `chamados` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "chamados" ADD COLUMN     "id_publico" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chamados_id_publico_key" ON "chamados"("id_publico");
