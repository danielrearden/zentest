import { useApiQuery } from "@/hooks/useApiQuery";
import { Center, Pagination, Stack, Table, createStyles } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router";

const useStyles = createStyles(() => ({
  clickable: {
    cursor: "pointer",
  },
  narrowColumn: {
    width: "200px",
  },
  wideColumn: {
    width: "400px",
  },
}));

export const ReportTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data } = useApiQuery("/api/reports", {
    parameters: {},
    query: { page },
  });
  const { classes } = useStyles();

  if (!data) {
    return null;
  }

  const { items: reports, pages } = data;

  return (
    <Stack>
      <Table>
        <thead>
          <tr>
            <th className={classes.wideColumn}>UID</th>
            <th>LABEL</th>
            <th className={classes.narrowColumn}>CREATED AT</th>
            <th>TARGET</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            return (
              <tr
                key={report.uid}
                onClick={() => navigate(`/reports/${report.uid}`)}
                className={classes.clickable}
              >
                <td className={classes.wideColumn}>{report.uid}</td>
                <td>{report.label}</td>
                <td className={classes.narrowColumn}>
                  {new Date(report.createdAt).toLocaleString("en-US")}
                </td>
                <td>{report.target.label}</td>
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
