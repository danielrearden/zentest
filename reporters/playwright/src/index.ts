import { randomUUID } from "node:crypto";
import { basename, join, relative } from "node:path";
import {
  FullConfig,
  Location,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter.js";
import boxen from "boxen";
import chalk from "chalk";
import got from "got";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { z } from "zod";
import { Api } from "@zentest/api";

type Payload = z.infer<
  Api["routes"]["POST"]["/api/testResults"]["formData"]["payload"]
>;

export type ZenTestReporterOptions = {
  apiKey: string;
  apiUrl: string;
  reportId?: string;
  reportLabel?: string;
  reportUrl?: string;
  tags?: Record<string, string>;
};

export type ZenTestReporterOptionsWithDefaults = {
  apiKey: string;
  apiUrl: string;
  reportId: string;
  reportLabel: string;
  reportUrl: string | null;
  tags: Record<string, string>;
};

export default class ZenTestReporter implements Reporter {
  private config: FullConfig | null = null;
  private options: ZenTestReporterOptionsWithDefaults;

  public constructor(options: ZenTestReporterOptions) {
    this.options = {
      ...options,
      reportId: options.reportId ?? randomUUID(),
      reportLabel: options.reportLabel ?? "Playwright",
      reportUrl: options.reportUrl ?? null,
      tags: options.tags ?? {},
    };
  }

  public async onBegin(config: FullConfig) {
    this.config = config;

    console.log(
      "\n" +
        chalk.hex("#4eaaa5")(
          boxen(
            `View your ZenTest report: ${chalk.white.bold(
              new URL(
                `/reports/${this.options.reportId}`,
                this.options.apiUrl
              ).toString()
            )}`,
            {
              padding: 1,
              borderStyle: "bold",
            }
          )
        )
    );
  }

  public async onTestEnd?(test: TestCase, result: TestResult) {
    const form = new FormData();
    const payload: Payload = {
      annotations: test.annotations.map(({ description = null, type }) => {
        return {
          description,
          type,
        };
      }),
      attachments: result.attachments
        .filter((attachment) => {
          return Boolean(attachment.path);
        })
        .map((attachment) => {
          const name = basename(attachment.path!);

          return {
            contentType: attachment.contentType,
            name: `${randomUUID()}-${name}`,
            originalName: name,
            isPlaywrightTrace: attachment.name === "trace",
          };
        }),
      cwd: process.cwd(),
      durationMs: result.duration,
      errors: result.errors.map((error) => {
        return {
          filePath: error.location
            ? this.normalizeFilePath(error.location)
            : null,
          fingerprint: error.message ?? String(error),
          message: error.value
            ? `Non-Error was thrown: ${String(error.value)}`
            : error.message ?? "",
          stack: error.stack ?? "",
        };
      }),
      filePath: this.normalizeFilePath(test.location),
      projectName: test.parent.project()?.name ?? null,
      repeatEachIndex: test.repeatEachIndex,
      retryIndex: result.retry,
      reporter: "PLAYWRIGHT",
      reportUid: this.options.reportId,
      reportLabel: this.options.reportLabel,
      reportUrl: this.options.reportUrl,
      shardIndex: this.config?.shard?.current ?? null,
      startedAt: result.startTime.toISOString(),
      status:
        test.outcome() === "flaky"
          ? "FLAKY"
          : result.status === "skipped"
          ? "SKIPPED"
          : result.status === "passed"
          ? "PASSED"
          : "FAILED",
      stderr: result.stderr.map((value) => value.toString).join("\n"),
      stdout: result.stdout.map((value) => value.toString).join("\n"),
      tags: this.options.tags,
      titleLong: this.formatLongTitle(test),
      titleShort: test.title,
    };

    form.set("payload", JSON.stringify(payload));

    for (const [index, playwrightAttachment] of result.attachments.entries()) {
      const attachment = payload.attachments[index];

      if (playwrightAttachment.path) {
        const file = await fileFromPath(playwrightAttachment.path);
        form.set(attachment.name, file);
      }
    }

    await got.post(new URL("/api/testResults", this.options.apiUrl), {
      headers: {
        "x-api-key": `${this.options.apiKey}`,
      },
      body: form,
    });
  }

  private normalizeFilePath(location: Location): string {
    const rootDir = basename(this.config!.rootDir);
    const filePath = relative(rootDir, location.file);

    return `${join(rootDir, filePath)}:${location.line}:${location.column}`;
  }

  private formatLongTitle(testCase: TestCase): string {
    const titlePath = [testCase.title];
    let parent: Suite | undefined = testCase.parent;

    while (parent) {
      // Don't include the root suite or project in the title path
      if (parent.location) {
        titlePath.unshift(parent.title);
        parent = parent.parent;
      } else {
        parent = undefined;
      }
    }

    return titlePath.join(" > ");
  }
}
