import { TestResultWithDetails } from "@zentest/api";
import { Attachment } from "@/features/attachment/Attachment.js";
import { Title } from "@mantine/core";

type TestResultAttachmentsProps = {
  testResult: TestResultWithDetails;
};

export const TestResultAttachments = ({
  testResult,
}: TestResultAttachmentsProps) => {
  if (!testResult.attachments.length) {
    return null;
  }

  return (
    <>
      <Title order={5} mt="sm">
        Attachments
      </Title>
      {testResult.attachments.map((attachment) => {
        return <Attachment key={attachment.id} attachment={attachment} />;
      })}
    </>
  );
};
