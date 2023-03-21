import { ReportWithDetails } from "@zentest/api";
import { StatusBadge } from "@/components/StatusBadge.js";
import { Group, Text } from "@mantine/core";

type ReportDetailsProps = {
  report: ReportWithDetails;
};

export const ReportDetails = ({ report }: ReportDetailsProps) => {
  return (
    <Group>
      <StatusBadge status="PASSED" />
      <Text size="md" mr="md">
        {report.countTestResultsByStatus.PASSED}
      </Text>
      <StatusBadge status="FLAKY" />
      <Text size="md" mr="md">
        {report.countTestResultsByStatus.FLAKY}
      </Text>
      <StatusBadge status="FAILED" />
      <Text size="md" mr="md">
        {report.countTestResultsByStatus.FAILED}
      </Text>
      <StatusBadge status="SKIPPED" />
      <Text size="md" mr="md">
        {report.countTestResultsByStatus.SKIPPED}
      </Text>
    </Group>
  );
};
