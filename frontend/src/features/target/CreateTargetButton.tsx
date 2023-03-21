import { Button, Group } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateTargetModal } from "@/features/target/CreateTargetModal.js";

export const CreateTargetButton = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Group position="right" mr="sm">
        <Button color="green" leftIcon={<Plus />} onClick={open}>
          Add
        </Button>
      </Group>
      <CreateTargetModal opened={opened} close={close} />
    </>
  );
};
