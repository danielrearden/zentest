import { ActionIcon } from "@mantine/core";
import { X } from "tabler-icons-react";
import { useApiMutation } from "@/hooks/useApiMutation.js";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery.js";

type DeleteTargetButtonProps = {
  targetId: number;
};

export const DeleteTargetButton = ({ targetId }: DeleteTargetButtonProps) => {
  const { mutateAsync: deleteTarget } = useApiMutation(
    "DELETE",
    `/api/targets/:targetId`
  );
  const invalidateQuery = useInvalidateQuery();

  return (
    <ActionIcon
      variant="light"
      title="Delete target"
      onClick={async () => {
        await deleteTarget({
          query: {},
          parameters: { targetId },
        });
        await invalidateQuery("/api/targets");
      }}
    >
      <X color="red" size="1.25rem" />
    </ActionIcon>
  );
};
