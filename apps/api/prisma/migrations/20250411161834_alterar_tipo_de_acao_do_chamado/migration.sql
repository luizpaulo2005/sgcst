/*
  Warnings:

  - The values [COMENTAR] on the enum `AcaoChamado` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AcaoChamado_new" AS ENUM ('ABRIR', 'FECHAR', 'REABRIR', 'CANCELAR', 'ALTERAR');
ALTER TABLE "logs_chamados" ALTER COLUMN "acao" TYPE "AcaoChamado_new" USING ("acao"::text::"AcaoChamado_new");
ALTER TYPE "AcaoChamado" RENAME TO "AcaoChamado_old";
ALTER TYPE "AcaoChamado_new" RENAME TO "AcaoChamado";
DROP TYPE "AcaoChamado_old";
COMMIT;
