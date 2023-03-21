import { TestResultWithDetails } from "@zentest/api";
import { Attachment } from "@/features/attachment/Attachment.js";
import { Text } from "@mantine/core";

type TestResultAttachmentsProps = {
  testResult: TestResultWithDetails;
};

export const TestResultAttachments = ({
  testResult,
}: TestResultAttachmentsProps) => {
  if (!testResult.attachments.length) {
    return <Text size="sm">None</Text>;
  }

  return (
    <>
      {testResult.attachments.map((attachment) => {
        return <Attachment key={attachment.id} attachment={attachment} />;
      })}
    </>
  );
};
