import { Readable } from "node:stream";
import { z } from "zod";

export type Method = "DELETE" | "GET" | "POST" | "PUT";

export type Route<
  TParameters extends z.AnyZodObject,
  TQuery extends z.AnyZodObject,
  TResponse extends z.ZodTypeAny,
  TBody extends z.AnyZodObject | undefined,
  TFormData extends Record<string, z.ZodTypeAny> | undefined
> = {
  parameters: TParameters;
  query: TQuery;
  response: TResponse;
  body?: TBody;
  formData?: TFormData;
};

export type RoutesByMethod = Record<
  Method,
  Record<string, Route<any, any, any, any, any>>
>;

export const SerializedDateSchema = z.date().transform((value) => {
  return value.toISOString();
});

export const TargetSchema = z.object({
  id: z.number(),
  apiKey: z.string(),
  createdAt: SerializedDateSchema,
  label: z.string(),
});

export type Target = z.output<typeof TargetSchema>;

export const ReportSchema = z.object({
  id: z.number(),
  createdAt: SerializedDateSchema,
  label: z.string(),
  target: TargetSchema,
  uid: z.string(),
});

export type Report = z.output<typeof ReportSchema>;

export const TestCaseSchema = z.object({
  id: z.number(),
  filePath: z.string(),
  titleLong: z.string(),
  titleShort: z.string(),
});

export type TestCase = z.output<typeof TestCaseSchema>;

export const TestResultSchema = z.object({
  id: z.number(),
  createdAt: SerializedDateSchema,
  cwd: z.string(),
  durationMs: z.number(),
  projectName: z.string().nullable(),
  repeatEachIndex: z.number(),
  report: ReportSchema,
  retryIndex: z.number(),
  runId: z.string(),
  shardIndex: z.number().nullable(),
  startedAt: SerializedDateSchema,
  status: z.enum(["PASSED", "FAILED", "FLAKY", "SKIPPED"]),
  stderr: z.string().nullable(),
  stdout: z.string().nullable(),
  testCase: TestCaseSchema,
});

export type TestResult = z.output<typeof TestResultSchema>;

export const AnnotationSchema = z.object({
  id: z.number(),
  description: z.string().nullable(),
  type: z.string(),
});

export type Annotation = z.output<typeof AnnotationSchema>;

export const AttachmentSchema = z.object({
  id: z.number(),
  contentType: z.string(),
  originalName: z.string(),
  isPlaywrightTrace: z.boolean(),
});

export type Attachment = z.output<typeof AttachmentSchema>;

export const ErrorSchema = z.object({
  id: z.number(),
  filePath: z.string().nullable(),
  message: z.string(),
  stack: z.string().nullable(),
});

export type Error = z.output<typeof ErrorSchema>;

export const TestResultWithDetailsSchema = TestResultSchema.extend({
  annotations: z.array(AnnotationSchema),
  attachments: z.array(AttachmentSchema),
  errors: z.array(ErrorSchema),
});

export type TestResultWithDetails = z.output<
  typeof TestResultWithDetailsSchema
>;

export const ReportWithDetailsSchema = ReportSchema.extend({
  countTestResultsByStatus: z.object({
    FAILED: z.number(),
    FLAKY: z.number(),
    PASSED: z.number(),
    SKIPPED: z.number(),
  }),
});

export type ReportWithDetails = z.output<typeof ReportWithDetailsSchema>;

export class Redirect {
  public constructor(public readonly url: string) {}
}

export const api = {
  routes: {
    DELETE: {
      "/api/targets/:targetId": {
        query: z.object({}),
        parameters: z.object({
          targetId: z.coerce.number(),
        }),
        response: z.object({
          deleted: z.boolean(),
        }),
      },
    },
    GET: {
      "/api/attachments/:attachmentId/download": {
        query: z.object({}),
        parameters: z.object({
          attachmentId: z.coerce.number(),
        }),
        response: z.union([z.instanceof(Redirect), z.instanceof(Readable)]),
      },
      "/api/files/:bucket/:name": {
        query: z.object({}),
        parameters: z.object({
          bucket: z.coerce.string(),
          name: z.coerce.string(),
        }),
        response: z.instanceof(Readable),
      },
      "/api/reports": {
        query: z.object({
          page: z.coerce.number(),
          pageSize: z.coerce.number().optional(),
        }),
        parameters: z.object({}),
        response: z.object({
          items: z.array(ReportSchema),
          pages: z.number(),
        }),
      },
      "/api/reports/:reportUid": {
        query: z.object({}),
        parameters: z.object({
          reportUid: z.coerce.string(),
        }),
        response: ReportWithDetailsSchema,
      },
      "/api/targets": {
        query: z.object({
          page: z.coerce.number(),
          pageSize: z.coerce.number().optional(),
        }),
        parameters: z.object({}),
        response: z.object({
          items: z.array(TargetSchema),
          pages: z.number(),
        }),
      },
      "/api/testResults": {
        query: z.object({
          page: z.coerce.number(),
          pageSize: z.coerce.number().optional(),
          reportUid: z.coerce.string(),
        }),
        parameters: z.object({}),
        response: z.object({
          items: z.array(TestResultSchema),
          pages: z.number(),
        }),
      },
      "/api/testResults/:testResultId": {
        query: z.object({}),
        parameters: z.object({
          testResultId: z.coerce.number(),
        }),
        response: TestResultWithDetailsSchema,
      },
    },
    POST: {
      "/api/targets": {
        body: z.object({
          label: z.string(),
        }),
        query: z.object({}),
        parameters: z.object({}),
        response: TargetSchema,
      },
      "/api/testResults": {
        formData: {
          payload: z.object({
            annotations: z.array(
              z.object({
                description: z.string().nullable(),
                type: z.string(),
              })
            ),
            attachments: z.array(
              z.object({
                contentType: z.string(),
                name: z.string(),
                originalName: z.string(),
                isPlaywrightTrace: z.boolean(),
              })
            ),
            cwd: z.string(),
            durationMs: z.number(),
            errors: z.array(
              z.object({
                filePath: z.string().nullable(),
                message: z.string(),
                stack: z.string(),
                fingerprint: z.string(),
              })
            ),
            filePath: z.string(),
            projectName: z.string().nullable(),
            repeatEachIndex: z.number(),
            retryIndex: z.number(),
            reporter: z.string(),
            reportLabel: z.string(),
            reportUid: z.string(),
            reportUrl: z.string().nullable(),
            runId: z.string(),
            shardIndex: z.number().nullable(),
            startedAt: z.string(),
            status: z.enum(["PASSED", "FAILED", "FLAKY", "SKIPPED"]),
            stderr: z.string().nullable(),
            stdout: z.string().nullable(),
            titleLong: z.string(),
            titleShort: z.string(),
          }),
        },
        parameters: z.object({}),
        query: z.object({}),
        response: z.object({
          uploaded: z.boolean(),
        }),
      },
    },
    PUT: {
      "/api/targets/:targetId": {
        body: z.object({
          label: z.string().optional(),
          apiKey: z.string().optional(),
        }),
        query: z.object({}),
        parameters: z.object({
          targetId: z.coerce.number(),
        }),
        response: TargetSchema,
      },
    },
  },
};

export type Api = typeof api;
