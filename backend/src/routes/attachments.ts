import { Redirect } from "@zentest/api";
import { createRoute } from "../factories/router.js";

export const downloadAttachmentRoute = createRoute(
  "GET",
  "/api/attachments/:attachmentId/download",
  async ({ configuration, parameters, minio, prisma }) => {
    const attachment = await prisma.attachment.findUnique({
      where: {
        id: parameters.attachmentId,
      },
    });

    if (!attachment) {
      throw new Error("Not found");
    }

    if (attachment.isPlaywrightTrace) {
      const fileUrl = new URL(
        `/api/files/${attachment.uploadBucketName}/${attachment.uploadObjectName}`,
        configuration.publicUrl
      );
      const searchParams = new URLSearchParams({
        trace: fileUrl.toString(),
      });
      const traceViewerUrl = new URL("https://trace.playwright.dev/");
      traceViewerUrl.search = searchParams.toString();

      return new Redirect(traceViewerUrl.toString());
    } else {
      return await minio.getObject(
        attachment.uploadBucketName,
        attachment.uploadObjectName
      );
    }
  }
);
