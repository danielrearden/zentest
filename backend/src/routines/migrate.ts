import { execSync } from "child_process";

export const migrate = async () => {
  console.log("Applying migrations...");

  execSync("pnpm --filter backend prisma migrate deploy");

  console.log("Migrations applied");
};
