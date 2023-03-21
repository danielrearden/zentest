import { TestResult } from "@zentest/api";
import { Anchor, Table } from "@mantine/core";
import prettyMilliseconds from "pretty-ms";
import { Link } from "react-router-dom";

type TestResultDetailsProps = {
  testResult: TestResult;
};

export const TestResultDetails = ({ testResult }: TestResultDetailsProps) => {
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
              {testResult.report.uid}
            </Anchor>
          </td>
          <td width="25%">{testResult.shardIndex ?? "-"}</td>
          <td width="25%">{testResult.repeatEachIndex}</td>
          <td width="25%">{testResult.retryIndex}</td>
        </tr>
        <tr>
          <th>PROJECT</th>
          <th>RUN ID</th>
          <th>STARTED AT</th>
          <th>DURATION</th>
        </tr>
        <tr>
          <td width="25%">{testResult.projectName ?? "-"}</td>
          <td width="25%">{testResult.runId}</td>
          <td width="25%">
            {new Date(testResult.startedAt).toLocaleString("en-US")}
          </td>
          <td width="25%">{prettyMilliseconds(testResult.durationMs)}</td>
        </tr>
      </tbody>
    </Table>
  );
};
