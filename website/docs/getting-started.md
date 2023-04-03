---
sidebar_position: 1
---

# Getting Started

## Deployment

### Self-Hosted

The ZenTest server is available as a Docker image that can be deployed locally or using the service
of your choice.

```bash
docker run -it --rm \
  -p 3000:3000 \
  -e "ZENTEST_PUBLIC_URL=http://localhost:3000" \
  -e "ZENTEST_DATABASE_URL=postgresql://zentest:zentest@host.docker.internal:5436/zentest?schema=public" \
  -e "ZENTEST_STORAGE_URL=http://host.docker.internal:9000" \
  -e "ZENTEST_STORAGE_BUCKET=mybucket" \
  -e "ZENTEST_STORAGE_ACCESS_KEY=zentest" \
  -e "ZENTEST_STORAGE_SECRET_KEY=zentest1" \
  zentest/server
```

The ZenTest server requires a Postgres database and a bucket of S3-compatible storage. Both
the database and the storage bucket must exist for the server to start successfully.

:::note

Each time the server starts, it will apply any pending migrations to your database. You do not
need to do anything other than make sure the database exists and is accessible.

:::

#### Environment Variables

| Environment Variable         | Required | Description                                            |
| ---------------------------- | -------- | ------------------------------------------------------ |
| `ZENTEST_PUBLIC_URL`         | YES      | The URL at which your ZenTest server will be available |
| `ZENTEST_DATABASE_URL`       | YES      | URL for Postgres database that will be used by ZenTest |
| `ZENTEST_STORAGE_URL`        | YES      | URL for storage provider that will be used by ZenTest  |
| `ZENTEST_STORAGE_BUCKET`     | YES      | The bucket ZenTest will use for storing uploaded files |
| `ZENTEST_STORAGE_ACCESS_KEY` | YES      | Access key for the storage provider                    |
| `ZENTEST_STORAGE_SECRET_KEY` | YES      | Secret key for the storage provider                    |

#### Health checks

The ZenTest server exposes three endpoints for health checks on port 9000:

- `/health` - used for generic health checks, responds with 500 when the server is not ready or
  shutting down, or 200 otherwise
- `/live` - used with Kubernetes liveness probes
- `/ready` - used with Kubernetes readiness probes

/ready
The endpoint responds:

200 status code, message "SERVER_IS_READY".
500 status code, message "SERVER_IS_NOT_READY".
Used to configure readiness probe.

### ZenTest Cloud

**Coming Soon!** If you're interested in using a managed instance of ZenTest, you can sign up for
the private beta waitlist [here](https://forms.gle/k3avjtC7rJ2iWbrYA).

## Configuration

- Once deployed, navigate to your ZenTest instance.
- Click on "Targets"
- Click on "+ Add"
- Enter a label for your target and click "Create".
- Copy the API key for your newly generated target.

## Test Reporters

### Playwright

Install the reporter

```bash
npm install @zentest/playwright-reporter
```

Then add it to `playwright.config.ts`:

```typescript
export default defineConfig({
  reporter: [
    [
      "@zentest/playwright-reporter",
      {
        apiKey: "2716dfff-fce6-4a53-be3b-36db7e31bbea",
        apiUrl: "http://localhost:3000",
        reportId: "123",
        reportLabel: "PR title",
        reportUrl: "https://github.com",
      },
    ],
  ],
  // The rest of your configuration...
});
```

#### Reporter options

| Environment Variable | Required | Description                                            |
| -------------------- | -------- | ------------------------------------------------------ |
| `apiUrl`             | YES      | The URL at which your ZenTest server will be available |
| `apiKey`             | YES      | The API key for the target you are using               |
| `reportId`           | NO       | The report ID to associate with these test results     |
| `reportLabel`        | NO       | A human readable label for the report                  |
| `reportUrl`          | NO       | A URL to associate with the report                     |
| `tags`               | NO       | Tags to associate with the generated test results      |

#### GitHub Actions Example

If you're using GitHub Actions, you could configure your reporter like this for `pull_request`
workflows:

```typescript
export default defineConfig({
  reporter: [
    process.env.CI
      ? [
        "@zentest/playwright-reporter",
        {
          apiKey: "YOUR_API_KEY",
          apiUrl: "YOUR_API_URL",
          reportId: process.env.GITHUB_RUN_ID,
          reportLabel: `${process.env.GITHUB_PR_TITLE}`,
          reportUrl: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
          tags: {
            prAuthor: process.env.GITHUB_PR_AUTHOR,
            prNumber: process.env.GITHUB_PR_NUMBER,
            runAttempt: process.env.GITHUB_RUN_ATTEMPT,
            sha: process.env.GITHUB_PR_SHA,
          },
        },
      ],
      : ["html"],
  ],
  // The rest of your configuration...
});
```

:::note

To populate some of the environment variables shown above, you'll need to set it as an environment variable in your
workflow as shown in the [docs](https://docs.github.com/en/actions/learn-github-actions/variables#defining-environment-variables-for-a-single-workflow):

```yaml
env:
  GITHUB_PR_NUMBER: github.event.number
  GITHUB_PR_TITLE: github.event.pull_request.title
  GITHUB_PR_AUTHOR: github.event.pull_request.user.login
  GITHUB_PR_SHA: github.event.pull_request.head.sha
```

:::

This configuration will group your test results by the GitHub Actions run ID and provide additional
metadata about the associated pull request. This is an example configuration; you can group and tag
your tests in whatever way makes sense for your organization.
