-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDIO', 'CLIENT_ADMIN', 'CLIENT_USER', 'PARTNER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT_USER',
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "rgb" TEXT NOT NULL,
    "cmyk" TEXT NOT NULL,
    "pantone" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Typography" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "googleFont" TEXT,
    "description" TEXT NOT NULL,
    "weights" TEXT,
    "downloadUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Typography_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogoFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variation" TEXT NOT NULL,
    "colorMode" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "colorProfile" TEXT NOT NULL,
    "previewUrl" TEXT,
    "downloadUrl" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'logo_basic',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogoFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphicElement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "previewUrl" TEXT,
    "format" TEXT NOT NULL,
    "colorProfile" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'elements_basic',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GraphicElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "previewUrl" TEXT,
    "downloadUrl" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'docs_basic',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL DEFAULT 'Instalsat',
    "primaryColor" TEXT NOT NULL DEFAULT '#003841',
    "accentColor" TEXT NOT NULL DEFAULT '#E05829',
    "bgLight" TEXT NOT NULL DEFAULT '#EEF5FF',
    "bgMedium" TEXT NOT NULL DEFAULT '#DCE3EC',
    "logoUrl" TEXT,
    "fontFamily" TEXT NOT NULL DEFAULT 'Rubik',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Content_section_key" ON "Content"("section");
