import { useQueryClient, QueryClient } from "react-query";
import { Api } from "@zentest/api";
import { ApiInput } from "@/types.js";

export const useInvalidateQuery = () => {
  const client = useQueryClient();

  return <
    TPath extends keyof Api["routes"]["GET"],
    TRoute extends Api["routes"]["GET"][TPath]
  >(
    path: TPath,
    input?: ApiInput<TRoute>
  ): Promise<void> => {
    return client.invalidateQueries([path, input].filter(Boolean));
  };
};
