-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "clientInfo",
ADD COLUMN     "clientCompany" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "clientContactEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "clientContactName" TEXT NOT NULL DEFAULT '';
