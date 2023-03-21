import { useQuery, UseQueryOptions } from "react-query";
import { Api } from "@zentest/api";
import { ApiData, ApiInput } from "@/types.js";

export const useApiQuery = <
  TPath extends keyof Api["routes"]["GET"],
  TRoute extends Api["routes"]["GET"][TPath]
>(
  path: TPath,
  input: ApiInput<TRoute>,
  options?: Omit<
    UseQueryOptions<
      ApiData<TRoute>,
      unknown,
      ApiData<TRoute>,
      (TPath | ApiInput<TRoute>)[]
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<
    ApiData<TRoute>,
    unknown,
    ApiData<TRoute>,
    (TPath | ApiInput<TRoute>)[]
  >(
    [path, input],
    async () => {
      let formattedPath = String(path);

      for (const [key, value] of Object.entries(input.parameters)) {
        formattedPath = formattedPath.replace(`:${key}`, value);
      }

      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(input.query)) {
        searchParams.append(key, String(value));
      }
      const response = await fetch(
        `${formattedPath}?${searchParams.toString()}`,
        {
          headers:
            "body" in input
              ? {
                  "Content-Type": "application/json",
                }
              : {},
          method: "GET",
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error [${response.status}] ${responseText}`);
      }

      return await response.json();
    },
    options
  );
};
