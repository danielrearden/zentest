import { Configuration } from "./configuration.js";
import { PrismaClient } from "../generated/prisma/index.js";

export const createPrismaClient = (
  configuration: Configuration
): PrismaClient => {
  return new PrismaClient({
    datasources: {
      db: {
        url: configuration.databaseUrl,
      },
    },
  });
};
