import { TestResultWithDetails } from "@zentest/api";
import { Code, Table, Title } from "@mantine/core";

type TestResultTagsProps = {
  testResult: TestResultWithDetails;
};

export const TestResultTags = ({ testResult }: TestResultTagsProps) => {
  if (!testResult.tags.length) {
    return null;
  }

  return (
    <>
      <Title order={4} mt="sm">
        Tags
      </Title>

      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>KEY</th>
            <th>VALUE</th>
          </tr>
        </thead>
        <tbody>
          {testResult.tags.map((tag) => {
            return (
              <tr key={tag.id}>
                <td>
                  <Code>{tag.key}</Code>
                </td>
                <td>
                  <Code>{tag.value}</Code>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
