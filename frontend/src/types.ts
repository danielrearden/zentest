import { z } from "zod";
import { Route } from "@zentest/api";

export type ApiInput<TRoute> = TRoute extends Route<
  infer Parameters,
  infer Query,
  any,
  infer TBody,
  any
>
  ? {
      parameters: z.input<Parameters>;
      query: z.input<Query>;
    } & (undefined extends TBody
      ? {}
      : { body: z.input<Exclude<TBody, undefined>> })
  : never;

export type ApiData<TRoute> = TRoute extends Route<
  any,
  any,
  infer Response,
  any,
  any
>
  ? z.output<Response>
  : never;
