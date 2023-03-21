import { CreateTargetButton } from "@/features/target/CreateTargetButton.js";
import { TargetTable } from "@/features/target/TargetTable.js";
import { Stack, Title } from "@mantine/core";

export const TargetsPage = () => {
  return (
    <Stack>
      <Title order={4}>Targets</Title>
      <TargetTable />
      <CreateTargetButton />
    </Stack>
  );
};
