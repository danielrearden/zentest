import { TestResultWithDetails } from "@zentest/api";
import { useTargetLocalPath } from "@/hooks/useTargetLocalPath.js";
import { formatLocalFilePath } from "@/utilities/formatLocalFilePath.js";
import { Anchor, Text } from "@mantine/core";

type TestResultFileLinkProps = {
  testResult: TestResultWithDetails;
};

export const TestResultFileLink = ({ testResult }: TestResultFileLinkProps) => {
  const [localPath] = useTargetLocalPath(testResult.report.target.id);

  if (!localPath) {
    return <Text size="sm">{testResult.testCase.filePath}</Text>;
  }

  return (
    <Anchor
      href={formatLocalFilePath(localPath, testResult.testCase.filePath)}
      size="sm"
    >
      {testResult.testCase.filePath}
    </Anchor>
  );
};
