import { formatTargetLocalPathKey } from "@/utilities/formatTargetLocalPathKey.js";
import { useLocalStorage } from "@mantine/hooks";

export const useTargetLocalPath = (targetId: number) => {
  const key = formatTargetLocalPathKey(targetId);
  return useLocalStorage({ key, defaultValue: "" });
};
