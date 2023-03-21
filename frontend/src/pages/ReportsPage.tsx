import { ReportTable } from "@/features/report/ReportTable.js";
import { Stack, Title } from "@mantine/core";

export const ReportsPage = () => {
  return (
    <Stack>
      <Title order={4}>Reports</Title>
      <ReportTable />
    </Stack>
  );
};
