import { ActionIcon, TextInput } from "@mantine/core";
import { Refresh } from "tabler-icons-react";
import { useApiMutation } from "@/hooks/useApiMutation.js";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery.js";

type TargetApiKeyInputProps = {
  targetApiKey: string;
  targetId: number;
};

export const TargetApiKeyInput = ({
  targetApiKey,
  targetId,
}: TargetApiKeyInputProps) => {
  const { mutateAsync: updateTarget } = useApiMutation(
    "PUT",
    `/api/targets/:targetId`
  );
  const invalidateQuery = useInvalidateQuery();

  return (
    <TextInput
      type="text"
      value={targetApiKey}
      readOnly
      rightSection={
        <ActionIcon
          variant="light"
          title="Refresh API key"
          onClick={async () => {
            await updateTarget({
              query: {},
              parameters: { targetId },
              body: { apiKey: crypto.randomUUID() },
            });
            await invalidateQuery("/api/targets");
          }}
        >
          <Refresh color="green" size="1.25rem" />
        </ActionIcon>
      }
    />
  );
};
