import { useApiMutation } from "@/hooks/useApiMutation.js";
import { EditableText } from "@/components/input/EditableText.js";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery.js";

type TargetLabelInputProps = {
  targetId: number;
  targetLabel: string;
};

export const TargetLabelInput = ({
  targetId,
  targetLabel,
}: TargetLabelInputProps) => {
  const { mutateAsync: updateTarget } = useApiMutation(
    "PUT",
    `/api/targets/:targetId`
  );
  const invalidateQuery = useInvalidateQuery();

  return (
    <EditableText
      value={targetLabel}
      onSave={async (value) => {
        await updateTarget({
          query: {},
          parameters: { targetId },
          body: { label: value },
        });
        await invalidateQuery("/api/targets");
      }}
    />
  );
};
