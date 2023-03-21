import { TestResultWithDetails } from "@zentest/api";
import { Code, List, Text } from "@mantine/core";

type TestResultAnnotationsProps = {
  testResult: TestResultWithDetails;
};

export const TestResultAnnotations = ({
  testResult,
}: TestResultAnnotationsProps) => {
  if (!testResult.annotations.length) {
    return <Text size="sm">None</Text>;
  }

  return (
    <List>
      {testResult.annotations.map((annotation) => {
        return (
          <List.Item key={annotation.id}>
            <Code>
              {annotation.type}
              {annotation.description ? ` | ${annotation.description}` : ""}
            </Code>
          </List.Item>
        );
      })}
    </List>
  );
};
