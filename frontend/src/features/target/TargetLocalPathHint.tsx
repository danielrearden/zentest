import { Code, HoverCard, Text } from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";

export const TargetLocalPathHint = () => {
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Text>
          <InfoCircle color="royalblue" size="1.25rem" />
        </Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm" weight="normal">
          The path to the project directory on your local machine for this
          target, like <Code>/Users/Shannon/Project</Code>. This value is
          persisted only in your browser's local storage. It is used to open
          files specific to the target.
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
