import { createConfiguration } from "./factories/configuration.js";
import { createApp } from "./factories/router.js";
import { createMinioClient } from "./factories/minio.js";
import { createPrismaClient } from "./factories/prisma.js";
import { downloadAttachmentRoute } from "./routes/attachments.js";
import { downloadFileRoute } from "./routes/files.js";
import { getReportRoute, listReportsRoute } from "./routes/reports.js";
import {
  getTestResultRoute,
  listTestResultsRoute,
  uploadTestResultRoute,
} from "./routes/testResults.js";
import {
  createTargetRoute,
  deleteTargetRoute,
  listTargetsRoute,
  updateTargetRoute,
} from "./routes/targets.js";
import { migrate } from "./routines/migrate.js";
import { seed } from "./routines/seed.js";

const configuration = createConfiguration();
const minio = createMinioClient(configuration);
const prisma = createPrismaClient(configuration);
const app = createApp({
  configuration,
  minio,
  prisma,
  routes: {
    DELETE: {
      "/api/targets/:targetId": deleteTargetRoute,
    },
    GET: {
      "/api/attachments/:attachmentId/download": downloadAttachmentRoute,
      "/api/files/:bucket/:name": downloadFileRoute,
      "/api/reports": listReportsRoute,
      "/api/reports/:reportUid": getReportRoute,
      "/api/targets": listTargetsRoute,
      "/api/testResults": listTestResultsRoute,
      "/api/testResults/:testResultId": getTestResultRoute,
    },
    POST: {
      "/api/targets": createTargetRoute,
      "/api/testResults": uploadTestResultRoute,
    },
    PUT: {
      "/api/targets/:targetId": updateTargetRoute,
    },
  },
});

await migrate();

if (configuration.seed) {
  await seed({ minio, prisma });
}

await app.start(configuration.port);

console.log(`Listening on port ${configuration.port}`);
