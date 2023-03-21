import { Button, Center, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { useApiMutation } from "@/hooks/useApiMutation.js";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery.js";

type CreateTargetModalProps = {
  opened: boolean;
  close: () => void;
};

export const CreateTargetModal = ({
  opened,
  close,
}: CreateTargetModalProps) => {
  const [targetLabel, setTargetLabel] = useState("");
  const { mutateAsync: createTarget } = useApiMutation("POST", `/api/targets`);
  const invalidateQuery = useInvalidateQuery();

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <TextInput
          data-autofocus
          label="Label"
          placeholder="Target label like the repo name"
          value={targetLabel}
          onChange={(event) => {
            setTargetLabel(event.currentTarget.value);
          }}
          mb="md"
        />
        <Center>
          <Button
            color="green"
            onClick={async () => {
              await createTarget({
                query: {},
                parameters: {},
                body: { label: targetLabel },
              });
              invalidateQuery("/api/targets");
              close();
              setTargetLabel("");
            }}
          >
            Create Target
          </Button>
        </Center>
      </Modal>
    </>
  );
};
