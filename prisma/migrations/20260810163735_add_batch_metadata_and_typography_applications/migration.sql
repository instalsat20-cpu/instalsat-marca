-- AlterTable
ALTER TABLE "GraphicElement" ADD COLUMN     "colorMode" TEXT NOT NULL DEFAULT 'colorido',
ADD COLUMN     "variation" TEXT NOT NULL DEFAULT 'Outro';

-- AlterTable
ALTER TABLE "LogoFile" ADD COLUMN     "variation" TEXT NOT NULL DEFAULT 'Outro';

-- CreateTable
CREATE TABLE "TypographyApplication" (
    "id" TEXT NOT NULL,
    "typographyId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "sizePx" INTEGER,
    "lineHeight" TEXT,
    "exampleText" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypographyApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TypographyApplication_typographyId_order_idx" ON "TypographyApplication"("typographyId", "order");

-- AddForeignKey
ALTER TABLE "TypographyApplication" ADD CONSTRAINT "TypographyApplication_typographyId_fkey" FOREIGN KEY ("typographyId") REFERENCES "Typography"("id") ON DELETE CASCADE ON UPDATE CASCADE;
