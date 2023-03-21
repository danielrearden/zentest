import { createRoute } from "../factories/router.js";

export const listReportsRoute = createRoute(
  "GET",
  "/api/reports",
  async ({ query, prisma }) => {
    const page = query.page || 0;
    const pageSize = query.pageSize || 10;

    const reports = await prisma.report.findMany({
      include: {
        target: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const count = await prisma.report.count();
    const pages = Math.ceil(count / pageSize);

    return { items: reports, pages };
  }
);

export const getReportRoute = createRoute(
  "GET",
  "/api/reports/:reportUid",
  async ({ parameters, prisma }) => {
    const report = await prisma.report.findUnique({
      where: {
        uid: parameters.reportUid,
      },
      include: {
        target: true,
      },
    });

    if (!report) {
      throw new Error("Not found");
    }

    const counts = await Promise.all(
      (["FAILED", "FLAKY", "PASSED", "SKIPPED"] as const).map((status) => {
        return prisma.testResult.count({
          where: {
            reportId: report.id,
            status,
          },
        });
      })
    );

    return {
      ...report,
      countTestResultsByStatus: {
        FAILED: counts[0],
        FLAKY: counts[1],
        PASSED: counts[2],
        SKIPPED: counts[3],
      },
    };
  }
);
