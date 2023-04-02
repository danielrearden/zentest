import { fileURLToPath } from "node:url";
import { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";
import formidable from "formidable";
import { Client as MinioClient } from "minio";
import Restana, {
  RequestExtensions,
  ResponseExtensions,
  Service,
  Protocol,
} from "restana";
import serveStatic from "serve-static";
import z from "zod";
import {
  api,
  Api,
  Method,
  Redirect,
  Route,
  RoutesByMethod,
} from "@zentest/api";
import { PrismaClient } from "../generated/prisma/index.js";
import { bodyParser } from "../middleware/bodyParser.js";
import { Configuration } from "./configuration.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type RouteConfig<TRoute extends Route<any, any, any, any, any>> = {
  middleware?: Middleware[];
  handler: Handler<TRoute>;
};

type MappedFormData<T> = T extends Record<string, z.ZodTypeAny>
  ? {
      [Key in keyof T]: z.output<T[Key]>;
    }
  : never;

type Handler<TRoute> = TRoute extends Route<
  infer Parameters,
  infer Query,
  infer Response,
  infer Body,
  infer FormData
>
  ? (
      context: {
        configuration: Configuration;
        parameters: z.output<Parameters>;
        headers: IncomingMessage["headers"];
        query: z.output<Query>;
        minio: MinioClient;
        prisma: PrismaClient;
      } & (undefined extends Body
        ? undefined extends FormData
          ? { [K in any]: never }
          : {
              formData: MappedFormData<Exclude<FormData, undefined>>;
              files: Record<string, formidable.File>;
            }
        : { body: z.input<Exclude<Body, undefined>> })
    ) => Promise<z.input<Response>>
  : never;

type Middleware = (
  req: IncomingMessage & RequestExtensions,
  res: ServerResponse & ResponseExtensions,
  next: (error?: unknown) => void
) => void | Promise<unknown>;

type ParsedMultipart = {
  fields: Record<string, string>;
  files: Record<string, formidable.File>;
};

const PUBLIC_DIR = fileURLToPath(new URL("../public", import.meta.url));

const sendResult = (result: any, res: ServerResponse & ResponseExtensions) => {
  if (result instanceof Readable) {
    result.pipe(res);
  } else if (result instanceof Redirect) {
    res.statusCode = 302;
    res.setHeader("location", result.url);
    res.end();
  } else {
    res.send(result);
  }
};

export const createApp = ({
  configuration,
  minio,
  prisma,
  routes,
}: {
  configuration: Configuration;
  minio: MinioClient;
  prisma: PrismaClient;
  routes: {
    DELETE: {
      [Route in keyof Api["routes"]["DELETE"]]: RouteConfig<
        Api["routes"]["DELETE"][Route]
      >;
    };
    GET: {
      [Route in keyof Api["routes"]["GET"]]: RouteConfig<
        Api["routes"]["GET"][Route]
      >;
    };
    POST: {
      [Route in keyof Api["routes"]["POST"]]: RouteConfig<
        Api["routes"]["POST"][Route]
      >;
    };
    PUT: {
      [Route in keyof Api["routes"]["PUT"]]: RouteConfig<
        Api["routes"]["PUT"][Route]
      >;
    };
  };
}): Service<Protocol.HTTP> => {
  const app = Restana({
    errorHandler: (err, req, res) => {
      console.log(err.message ?? String(err));
      res.send({ error: err.message ?? String(err) }, 500);
    },
  });

  for (const [method, routeMap] of Object.entries(
    api.routes as RoutesByMethod
  )) {
    for (const [route, routeOptions] of Object.entries(routeMap)) {
      const verb = method.toLowerCase() as Lowercase<Method>;
      const { middleware = [], handler } = routes[method as Method][
        route as keyof Api["routes"][Method]
      ] as RouteConfig<any>;

      if ("body" in routeOptions) {
        middleware.push(bodyParser);

        app[verb](route, ...middleware, async (req, res) => {
          const context: any = {
            body: routeOptions.body.parse(req.body),
            configuration,
            headers: req.headers,
            minio,
            parameters: routeOptions.parameters.parse(req.params),
            prisma,
            query: routeOptions.query.parse(req.query),
          };

          const result = routeOptions.response.parse(await handler(context));
          sendResult(result, res);
        });
      } else if ("formData" in routeOptions) {
        const fieldNames = Object.keys(routeOptions.formData);

        app[verb](route, ...middleware, async (req, res) => {
          const form = formidable({ multiples: false });
          const { fields, files } = await new Promise<ParsedMultipart>(
            (resolve, reject) => {
              form.parse(req, (err, fields, files) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({ fields, files } as ParsedMultipart);
                }
              });
            }
          );

          const formData: any = {};
          for (const [name, value] of Object.entries(fields)) {
            if (!fieldNames.includes(name)) {
              throw new Error(`Unexpected field: ${name}`);
            }
            formData[name] = routeOptions.formData[name].parse(
              JSON.parse(value as any)
            );
          }

          const context: any = {
            configuration,
            formData,
            files,
            headers: req.headers,
            minio,
            parameters: routeOptions.parameters.parse(req.params),
            prisma,
            query: routeOptions.query.parse(req.query),
          };

          const result = routeOptions.response.parse(await handler(context));
          sendResult(result, res);
        });
      } else {
        app[verb](route, ...middleware, async (req, res) => {
          const context: any = {
            configuration,
            headers: req.headers,
            minio,
            parameters: routeOptions.parameters.parse(req.params),
            prisma,
            query: routeOptions.query.parse(req.query),
          };

          const result = routeOptions.response.parse(await handler(context));
          sendResult(result, res);
        });
      }
    }
  }

  app.get("*", serveStatic(PUBLIC_DIR));

  let content = "";

  app.get("*", (req, res) => {
    if (!content) {
      content = readFileSync(join(PUBLIC_DIR, "index.html"), "utf8");
    }

    res.send(content, 200, {
      "Content-Type": "text/html",
    });
  });

  return app;
};

export const createRoute = <
  TMethod extends Method,
  TPath extends keyof Api["routes"][TMethod]
>(
  _method: TMethod,
  _route: TPath,
  handler: Handler<Api["routes"][TMethod][TPath]>,
  middleware?: Middleware[]
): {
  handler: Handler<Api["routes"][TMethod][TPath]>;
  middleware: Middleware[];
} => {
  return { handler, middleware: middleware ?? [] };
};
