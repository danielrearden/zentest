import { Client as MinioClient } from "minio";
import { Configuration } from "./configuration.js";

export const createMinioClient = (
  configuration: Configuration
): MinioClient => {
  const storageUrl = new URL(configuration.storageUrl);

  return new MinioClient({
    endPoint: storageUrl.hostname,
    port: storageUrl.port ? parseInt(storageUrl.port, 10) : undefined,
    useSSL: storageUrl.protocol === "https:",
    accessKey: configuration.storageAccessKey,
    secretKey: configuration.storageSecretKey,
  });
};
