import { Client as MinioClient } from "minio";
import { PrismaClient } from "../generated/prisma/index.js";

export const seed = async ({
  minio,
  prisma,
}: {
  minio: MinioClient;
  prisma: PrismaClient;
}) => {
  console.log("Seeding database and storage...");

  try {
    await minio.makeBucket("mybucket");
  } catch (error: any) {
    if (error.code !== "BucketAlreadyOwnedByYou") {
      throw error;
    }
  }

  await prisma.target.upsert({
    create: {
      apiKey: "00000000-0000-0000-0000-000000000000",
      label: "My GitHub Repository",
    },
    update: {},
    where: {
      apiKey: "00000000-0000-0000-0000-000000000000",
    },
  });

  console.log("Database and storage seeded");
};
