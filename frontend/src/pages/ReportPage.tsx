import { Stack, Title } from "@mantine/core";
import { useParams } from "react-router";
import { useApiQuery } from "@/hooks/useApiQuery.js";
import { ReportDetails } from "@/features/report/ReportDetails.js";
import { TestResultTable } from "@/features/testResult/TestResultTable.js";

export const ReportPage = () => {
  const params = useParams();
  const reportUid = params.reportUid as string;
  const { data: report } = useApiQuery("/api/reports/:reportUid", {
    parameters: {
      reportUid,
    },
    query: {},
  });

  if (!report) {
    return null;
  }

  return (
    <Stack>
      <Title order={4}>{`${report.uid} | ${report.label}`}</Title>
      <ReportDetails report={report} />
      <Title order={5}>Test Case Runs</Title>
      <TestResultTable reportUid={reportUid} />
    </Stack>
  );
};
