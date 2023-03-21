import { execSync } from "child_process";

export const migrate = async () => {
  console.log("Applying migrations...");

  execSync("prisma migrate deploy");

  console.log("Migrations applied");
};
