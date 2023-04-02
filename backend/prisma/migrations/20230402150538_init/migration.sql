-- CreateEnum
CREATE TYPE "TestResultStatus" AS ENUM ('PASSED', 'FAILED', 'FLAKY', 'SKIPPED');

-- CreateTable
CREATE TABLE "Target" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "targetId" INTEGER NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT NOT NULL,
    "titleLong" TEXT NOT NULL,
    "titleShort" TEXT NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cwd" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "projectName" TEXT,
    "repeatEachIndex" INTEGER NOT NULL,
    "retryIndex" INTEGER NOT NULL,
    "reporter" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,
    "runId" TEXT NOT NULL,
    "shardIndex" INTEGER,
    "status" "TestResultStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "stderr" TEXT,
    "stdout" TEXT,
    "testCaseId" INTEGER NOT NULL,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "contentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPlaywrightTrace" BOOLEAN NOT NULL,
    "originalName" TEXT NOT NULL,
    "testResultId" INTEGER NOT NULL,
    "uploadBucketName" TEXT NOT NULL,
    "uploadObjectName" TEXT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annotation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "testResultId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT,
    "fingerprint" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "testResultId" INTEGER NOT NULL,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Target_apiKey_key" ON "Target"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Report_uid_key" ON "Report"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "TestCase_filePath_titleLong_key" ON "TestCase"("filePath", "titleLong");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
