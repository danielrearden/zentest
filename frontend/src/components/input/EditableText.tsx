import { ActionIcon, TextInput, TextInputProps } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DeviceFloppy, Edit } from "tabler-icons-react";

type EditableTextProps = {
  value: string;
  onSave: (value: string) => Promise<void>;
} & TextInputProps;

export const EditableText = ({
  value,
  onSave,
  ...props
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const ref = useFocusTrap(isEditing);

  useEffect(() => {
    setInputValue(value);
  }, [value, setInputValue]);

  const button = isEditing ? (
    <ActionIcon
      title="Save"
      variant="light"
      onClick={() => {
        setIsEditing(false);
        onSave(inputValue);
      }}
    >
      <DeviceFloppy color="green" size="1.5rem" />
    </ActionIcon>
  ) : (
    <ActionIcon
      title="Edit"
      variant="light"
      onClick={() => {
        setIsEditing(true);
      }}
    >
      <Edit color="gray" size="1.5rem" />
    </ActionIcon>
  );

  return (
    <TextInput
      ref={ref}
      type="text"
      value={inputValue}
      onChange={(event) => {
        setInputValue(event.target.value);
      }}
      readOnly={!isEditing}
      {...props}
      rightSection={button}
    />
  );
};
