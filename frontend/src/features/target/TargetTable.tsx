import { useApiQuery } from "@/hooks/useApiQuery.js";
import {
  Center,
  Group,
  Pagination,
  Stack,
  Table,
  createStyles,
} from "@mantine/core";
import { useState } from "react";
import { TargetLocalPathInput } from "@/features/target/TargetLocalPathInput.js";
import { TargetLocalPathHint } from "@/features/target/TargetLocalPathHint.js";
import { DeleteTargetButton } from "@/features/target/DeleteTargetButton.js";
import { TargetLabelInput } from "@/features/target/TargetLabelInput.js";
import { TargetApiKeyInput } from "@/features/target/TargetApiKeyInput.js";

const useStyles = createStyles(() => ({
  narrowColumn: {
    width: "200px",
  },
  wideColumn: {
    width: "400px",
  },
}));

export const TargetTable = () => {
  const [page, setPage] = useState(1);
  const { data } = useApiQuery("/api/targets", {
    parameters: {},
    query: { page, pageSize: 100 },
  });
  const { classes } = useStyles();

  if (!data) {
    return null;
  }

  const { items: targets, pages } = data;

  return (
    <Stack>
      <Table>
        <thead>
          <tr>
            <th className={classes.narrowColumn}></th>
            <th>LABEL</th>
            <th className={classes.wideColumn}>
              <Group>
                LOCAL PATH
                <TargetLocalPathHint />
              </Group>
            </th>
            <th className={classes.wideColumn}>API KEY</th>
          </tr>
        </thead>
        <tbody>
          {targets.map((target) => {
            return (
              <tr key={target.id}>
                <td className={classes.narrowColumn}>
                  <DeleteTargetButton targetId={target.id} />
                </td>
                <td>
                  <TargetLabelInput
                    targetId={target.id}
                    targetLabel={target.label}
                  />
                </td>
                <td className={classes.wideColumn}>
                  <TargetLocalPathInput targetId={target.id} />
                </td>
                <td className={classes.wideColumn}>
                  <TargetApiKeyInput
                    targetApiKey={target.apiKey}
                    targetId={target.id}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Center>
        <Pagination
          color="gray"
          total={pages}
          value={page}
          onChange={(value) => {
            setPage(value);
          }}
        />
      </Center>
    </Stack>
  );
};
