import { Image } from "@mantine/core";
import { Gif, Jpg, Music, Png, PlayerPlay, Svg } from "tabler-icons-react";

type AttachmentIconProps = {
  contentType: string;
  isPlaywrightTrace: boolean;
};

export const AttachmentIcon = ({
  contentType,
  isPlaywrightTrace,
}: AttachmentIconProps) => {
  if (isPlaywrightTrace) {
    return <Image src="/playwright.svg" height="1rem" width="1rem" />;
  } else if (contentType === "image/png") {
    return <Png color="grey" size="1rem" />;
  } else if (contentType === "image/gif") {
    return <Gif color="grey" size="1rem" />;
  } else if (contentType === "image/jpeg" || contentType === "image/jpg") {
    return <Jpg color="grey" size="1rem" />;
  } else if (contentType === "image/svg+xml") {
    return <Svg color="grey" size="1rem" />;
  } else if (contentType.startsWith("video/")) {
    return <PlayerPlay color="grey" size="1rem" />;
  } else if (contentType.startsWith("audio/")) {
    return <Music color="grey" size="1rem" />;
  } else {
    return null;
  }
};
