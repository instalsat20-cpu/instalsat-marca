-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "permission" SET DEFAULT 'doc_manual';

-- AlterTable
ALTER TABLE "LogoFile" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "GuideLine" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideLine_pkey" PRIMARY KEY ("id")
);
