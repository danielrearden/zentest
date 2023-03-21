import { TestResult } from "@zentest/api";
import { Badge, BadgeProps } from "@mantine/core";

type StatusBadgeProps = {
  status: TestResult["status"];
} & BadgeProps;

const getBadgeColor = (status: TestResult["status"]) => {
  switch (status) {
    case "PASSED":
      return "green";
    case "FAILED":
      return "red";
    case "FLAKY":
      return "orange";
    case "SKIPPED":
      return "yellow";
    default:
      return "gray";
  }
};

export const StatusBadge = ({ size, status }: StatusBadgeProps) => {
  return (
    <Badge size={size} color={getBadgeColor(status)}>
      {status}
    </Badge>
  );
};
