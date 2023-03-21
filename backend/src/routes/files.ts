import cors from "cors";
import { createRoute } from "../factories/router.js";

export const downloadFileRoute = createRoute(
  "GET",
  "/api/files/:bucket/:name",
  async ({ parameters, minio }) => {
    const stream = await minio.getObject(parameters.bucket, parameters.name);

    return stream;
  },
  [cors()]
);
