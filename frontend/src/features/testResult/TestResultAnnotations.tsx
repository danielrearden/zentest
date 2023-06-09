import { TestResultWithDetails } from "@zentest/api";
import { Code, Table, Title } from "@mantine/core";

type TestResultAnnotationsProps = {
  testResult: TestResultWithDetails;
};

export const TestResultAnnotations = ({
  testResult,
}: TestResultAnnotationsProps) => {
  if (!testResult.annotations.length) {
    return null;
  }

  return (
    <>
      <Title order={4} mt="sm">
        Annotations
      </Title>

      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>TYPE</th>
            <th>DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {testResult.annotations.map((annotation) => {
            return (
              <tr key={annotation.id}>
                <td>
                  <Code>{annotation.type}</Code>
                </td>
                <td>
                  {annotation.description ? (
                    <Code>{annotation.description}</Code>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
