import { useMutation, UseMutationOptions } from "react-query";
import { Api } from "@zentest/api";
import { ApiData, ApiInput } from "@/types.js";

export const useApiMutation = <
  TMethod extends Exclude<keyof Api["routes"], "GET">,
  TPath extends keyof Api["routes"][TMethod],
  TRoute extends Api["routes"][TMethod][TPath]
>(
  method: TMethod,
  path: TPath,
  options?: Omit<
    UseMutationOptions<ApiData<TRoute>, unknown, ApiInput<TRoute>, unknown>,
    "mutationFn"
  >
) => {
  return useMutation<ApiData<TRoute>, unknown, ApiInput<TRoute>>(
    async (input) => {
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
          method,
          body: "body" in input ? JSON.stringify(input.body) : undefined,
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
