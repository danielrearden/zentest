import { Group, Stack, Title } from "@mantine/core";
import { useParams } from "react-router";
import { StatusBadge } from "@/components/StatusBadge.js";
import { useApiQuery } from "@/hooks/useApiQuery";
import { TestResultAnnotations } from "@/features/testResult/TestResultAnnotations.js";
import { TestResultAttachments } from "@/features/testResult/TestResultAttachments.js";
import { TestResultDetails } from "@/features/testResult/TestResultDetails.js";
import { TestResultErrors } from "@/features/testResult/TestResultErrors.js";
import { TestResultFileLink } from "@/features/testResult/TestResultFileLink.js";

export const TestResultPage = () => {
  const params = useParams();
  const testResultId = parseInt(params.testResultId as string, 10);

  const { data: testResult } = useApiQuery("/api/testResults/:testResultId", {
    parameters: {
      testResultId,
    },
    query: {},
  });

  if (!testResult) {
    return null;
  }

  return (
    <Stack>
      <Group>
        <StatusBadge size="lg" status={testResult.status} />
        <Title order={4}>{testResult.testCase.titleShort}</Title>
      </Group>
      <TestResultFileLink testResult={testResult} />

      <TestResultDetails testResult={testResult} />

      <Title order={4} mt="sm">
        Annotations
      </Title>
      <TestResultAnnotations testResult={testResult} />

      <Title order={5} mt="sm">
        Errors
      </Title>
      <TestResultErrors testResult={testResult} />

      <Title order={5} mt="sm">
        Attachments
      </Title>
      <TestResultAttachments testResult={testResult} />
    </Stack>
  );
};
