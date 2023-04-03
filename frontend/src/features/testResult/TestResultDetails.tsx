import { TestResult } from "@zentest/api";
import { Anchor, Table } from "@mantine/core";
import prettyMilliseconds from "pretty-ms";
import { Link } from "react-router-dom";

type TestResultDetailsProps = {
  testResult: TestResult;
};

export const TestResultDetails = ({ testResult }: TestResultDetailsProps) => {
  const startedAt = new Date(testResult.startedAt);
  const finishedAt = new Date(startedAt.getTime() + testResult.durationMs);

  return (
    <Table withBorder withColumnBorders>
      <tbody>
        <tr>
          <th>REPORT</th>
          <th>SHARD</th>
          <th>REPEAT</th>
          <th>RETRY</th>
        </tr>
        <tr>
          <td width="25%">
            <Anchor component={Link} to={`/reports/${testResult.report.uid}`}>
              {testResult.report.label}
            </Anchor>
          </td>
          <td width="25%">{testResult.shardIndex ?? "-"}</td>
          <td width="25%">{testResult.repeatEachIndex}</td>
          <td width="25%">{testResult.retryIndex}</td>
        </tr>
        <tr>
          <th>PROJECT</th>
          <th>STARTED AT</th>
          <th>FINISHED AT</th>
          <th>DURATION</th>
        </tr>
        <tr>
          <td width="25%">{testResult.projectName ?? "-"}</td>
          <td width="25%">{startedAt.toLocaleString("en-US")}</td>
          <td width="25%">{finishedAt.toLocaleString("en-US")}</td>
          <td width="25%">{prettyMilliseconds(testResult.durationMs)}</td>
        </tr>
      </tbody>
    </Table>
  );
};
