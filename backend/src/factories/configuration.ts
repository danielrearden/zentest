import yargs from "yargs";

export const createConfiguration = () => {
  return yargs()
    .env("ZENTEST")
    .option("port", {
      demandOption: false,
      default: 3000,
      type: "number",
    })
    .option("public-url", {
      demandOption: true,
      type: "string",
    })
    .option("database-url", {
      demandOption: true,
      type: "string",
    })
    .option("seed", {
      demandOption: false,
      default: false,
      type: "boolean",
    })
    .option("storage-url", {
      demandOption: true,
      type: "string",
    })
    .option("storage-access-key", {
      demandOption: true,
      type: "string",
    })
    .option("storage-secret-key", {
      demandOption: true,
      type: "string",
    })
    .option("storage-bucket", {
      demandOption: true,
      type: "string",
    })
    .parseSync();
};

export type Configuration = ReturnType<typeof createConfiguration>;
