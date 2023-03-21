import { EditableText } from "@/components/input/EditableText.js";
import { useTargetLocalPath } from "@/hooks/useTargetLocalPath.js";

type TargetLocalPathInputProps = {
  targetId: number;
};

export const TargetLocalPathInput = ({
  targetId,
}: TargetLocalPathInputProps) => {
  const [localPath, setLocalPath] = useTargetLocalPath(targetId);

  return (
    <EditableText
      value={localPath}
      onSave={async (value) => {
        setLocalPath(value);
      }}
    />
  );
};
