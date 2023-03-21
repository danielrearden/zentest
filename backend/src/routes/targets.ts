import { createRoute } from "../factories/router.js";

export const listTargetsRoute = createRoute(
  "GET",
  "/api/targets",
  async ({ prisma, query }) => {
    const page = query.page || 0;
    const pageSize = query.pageSize || 10;

    const targets = await prisma.target.findMany({
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

    return { items: targets, pages };
  }
);

export const createTargetRoute = createRoute(
  "POST",
  "/api/targets",
  async ({ body, prisma }) => {
    const target = await prisma.target.create({
      data: {
        label: body.label,
      },
    });

    return target;
  }
);

export const deleteTargetRoute = createRoute(
  "DELETE",
  "/api/targets/:targetId",
  async ({ prisma, parameters }) => {
    const target = await prisma.target.delete({
      where: {
        id: parameters.targetId,
      },
    });

    return { deleted: true };
  }
);

export const updateTargetRoute = createRoute(
  "PUT",
  "/api/targets/:targetId",
  async ({ body, prisma, parameters }) => {
    const target = await prisma.target.update({
      where: {
        id: parameters.targetId,
      },
      data: {
        apiKey: body.apiKey,
        label: body.label,
      },
    });

    return target;
  }
);
