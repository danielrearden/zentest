import { StatusBadge } from "@/components/StatusBadge.js";
import { useApiQuery } from "@/hooks/useApiQuery.js";
import { Center, Pagination, Stack, Table, createStyles } from "@mantine/core";
import prettyMilliseconds from "pretty-ms";
import { useState } from "react";
import { useNavigate } from "react-router";

const useStyles = createStyles(() => ({
  clickable: {
    cursor: "pointer",
  },
}));

type TestResultTableProps = {
  reportUid: string;
};

export const TestResultTable = ({ reportUid }: TestResultTableProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data } = useApiQuery("/api/testResults", {
    parameters: {},
    query: {
      page,
      reportUid,
    },
  });
  const { classes } = useStyles();

  if (!data) {
    return null;
  }

  const { items: testResults, pages } = data;

  return (
    <Stack>
      <Table>
        <thead>
          <tr>
            <th>STATUS</th>
            <th>FILE</th>
            <th>TITLE</th>
            <th>PROJECT</th>
            <th>SHARD</th>
            <th>REPEAT</th>
            <th>RETRY</th>
            <th>STARTED AT</th>
            <th>DURATION</th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((testResult) => {
            return (
              <tr
                key={testResult.id}
                onClick={() => navigate(`/testResults/${testResult.id}`)}
                className={classes.clickable}
              >
                <td>
                  <StatusBadge status={testResult.status} />
                </td>
                <td>{testResult.testCase.filePath}</td>
                <td>{testResult.testCase.titleShort}</td>
                <td>{testResult.projectName ?? "-"}</td>
                <td>{testResult.shardIndex ?? "-"}</td>
                <td>{testResult.repeatEachIndex}</td>
                <td>{testResult.retryIndex}</td>
                <td>
                  {new Date(testResult.startedAt).toLocaleString("en-US")}
                </td>
                <td>{prettyMilliseconds(testResult.durationMs)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Center>
        <Pagination
          color="gray"
          total={pages}
          value={page}
          onChange={(value) => {
            setPage(value);
          }}
        />
      </Center>
    </Stack>
  );
};
