import { Attachment as AttachmentType } from "@zentest/api";
import { AttachmentIcon } from "@/features/attachment/AttachmentIcon.js";
import { Anchor, Box, Center, Group, Text } from "@mantine/core";
import { File } from "tabler-icons-react";

type AttachmentProps = {
  attachment: AttachmentType;
};

export const Attachment = ({ attachment }: AttachmentProps) => {
  return (
    <Group spacing={0}>
      <Box w="2.5rem" h="2.5rem">
        <Center pos="absolute" w="2.5rem" h="2.5rem">
          <File color="grey" size="2.5rem" strokeWidth=".05rem" />
        </Center>
        <Center pos="absolute" w="2.5rem" h="2.5rem">
          <AttachmentIcon
            contentType={attachment.contentType}
            isPlaywrightTrace={attachment.isPlaywrightTrace}
          />
        </Center>
      </Box>
      <Text size="sm">
        <Anchor href={`/api/attachments/${attachment.id}/download`}>
          {attachment.originalName}
        </Anchor>
      </Text>
    </Group>
  );
};
