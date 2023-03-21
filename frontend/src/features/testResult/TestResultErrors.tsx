import { Stack, Text } from "@mantine/core";
import { TestResultWithDetails } from "@zentest/api";
import { Error } from "@/features/error/Error.js";

type TestResultErrorProps = {
  testResult: TestResultWithDetails;
};

export const TestResultErrors = ({ testResult }: TestResultErrorProps) => {
  if (!testResult.errors.length) {
    return <Text size="sm">None</Text>;
  }

  return (
    <Stack>
      {testResult.errors.map((error) => {
        return <Error error={error} testResult={testResult} />;
      })}
    </Stack>
  );
};
