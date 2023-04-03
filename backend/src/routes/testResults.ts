import { createReadStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { createRoute } from "../factories/router.js";

export const uploadTestResultRoute = createRoute(
  "POST",
  "/api/testResults",
  async ({
    configuration,
    formData: { payload },
    files,
    headers,
    minio,
    prisma,
  }) => {
    const apiKey = headers["x-api-key"];

    if (typeof apiKey !== "string") {
      throw new Error("Invalid API key");
    }

    const target = await prisma.target.findUnique({
      where: {
        apiKey,
      },
    });

    if (!target) {
      throw new Error("Invalid API key");
    }

    for (const [name, file] of Object.entries(files)) {
      const attachment = payload.attachments.find(
        (attachment) => attachment.name === name
      );

      if (!attachment) {
        throw new Error(`Attachment not found: ${name}`);
      }

      await minio.putObject(
        configuration.storageBucket,
        name,
        createReadStream(file.filepath)
      );

      try {
        await unlink(file.filepath);
      } catch {
        // Ignore
      }
    }

    const report = await prisma.report.upsert({
      create: {
        uid: payload.reportUid,
        label: payload.reportLabel,
        url: payload.reportUrl,
        targetId: target.id,
      },
      update: {
        label: payload.reportLabel,
        url: payload.reportUrl,
      },
      where: {
        uid: payload.reportUid,
      },
    });

    const testCase = await prisma.testCase.upsert({
      create: {
        titleLong: payload.titleLong,
        titleShort: payload.titleShort,
        filePath: payload.filePath,
      },
      update: {
        titleShort: payload.titleShort,
      },
      where: {
        filePath_titleLong: {
          filePath: payload.filePath,
          titleLong: payload.titleLong,
        },
      },
    });

    const testResult = await prisma.testResult.create({
      data: {
        cwd: payload.cwd,
        durationMs: payload.durationMs,
        projectName: payload.projectName,
        repeatEachIndex: payload.repeatEachIndex,
        retryIndex: payload.retryIndex,
        reporter: payload.reporter,
        reportId: report.id,
        shardIndex: payload.shardIndex,
        startedAt: payload.startedAt,
        status: payload.status,
        stderr: payload.stderr,
        stdout: payload.stdout,
        testCaseId: testCase.id,
      },
    });

    await prisma.error.createMany({
      data: payload.errors.map((error) => {
        return {
          fingerprint: error.fingerprint,
          message: error.message,
          stack: error.stack,
          testResultId: testResult.id,
        };
      }),
    });

    await prisma.annotation.createMany({
      data: payload.annotations.map((annotation) => {
        return {
          description: annotation.description,
          type: annotation.type,
          testResultId: testResult.id,
        };
      }),
    });

    await prisma.attachment.createMany({
      data: payload.attachments.map((attachment) => {
        return {
          contentType: attachment.contentType,
          isPlaywrightTrace: attachment.isPlaywrightTrace,
          originalName: attachment.originalName,
          testResultId: testResult.id,
          uploadBucketName: configuration.storageBucket,
          uploadObjectName: attachment.name,
        };
      }),
    });

    await prisma.tag.createMany({
      data: Object.entries(payload.tags).map(([key, value]) => {
        return {
          key,
          value,
          testResultId: testResult.id,
        };
      }),
    });

    return { uploaded: true };
  }
);

export const listTestResultsRoute = createRoute(
  "GET",
  "/api/testResults",
  async ({ prisma, query }) => {
    const pageSize = query.pageSize ?? 10;
    const page = query.page ?? 1;
    const reportUid = query.reportUid;
    const items = await prisma.testResult.findMany({
      include: {
        report: {
          include: {
            target: true,
          },
        },
        testCase: true,
      },
      orderBy: [
        {
          testCase: {
            filePath: "asc",
          },
        },
        {
          testCase: {
            titleLong: "asc",
          },
        },
        {
          projectName: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      where: {
        report: {
          uid: reportUid,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const count = await prisma.testResult.count({
      where: {
        report: {
          uid: reportUid,
        },
      },
    });
    const pages = Math.ceil(count / pageSize);

    return { items, pages };
  }
);

export const getTestResultRoute = createRoute(
  "GET",
  "/api/testResults/:testResultId",
  async ({ parameters, prisma }) => {
    const testResult = await prisma.testResult.findUnique({
      include: {
        annotations: true,
        attachments: true,
        errors: true,
        report: {
          include: {
            target: true,
          },
        },
        tags: true,
        testCase: true,
      },
      where: {
        id: parameters.testResultId,
      },
    });

    if (!testResult) {
      throw new Error("Not found");
    }

    return testResult;
  }
);
