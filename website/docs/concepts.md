---
sidebar_position: 2
---

# Concepts

## Test Case
A test case is a step, or series of steps, used to test the functionality of your application. Test
cases written using JavaScript libraries like Jest or Playwright typically look something like this:

```typescript
test('sum', () => {
  expect(sum(1, 1)).toEqual(2);
});
```

## Test Result
A test result is a _single execution_ of a particular test case. An individual test command could
generate multiple test results for the same test case, depending on your testing library and
configuration. For example, each retry of a failed test is a separate test result. Likewise, each
repeated execution using an option like `--repeat-each` is a separate test result. Each test result
has its own set of errors, attachments and annotations associated with it.

## Report
Reports are a way of grouping test results together. How this grouping works is determined by how
you configure your test reporter, but typically test results are grouped together based on the
associated pull request or the CI run. Reports are a great way of seeing all the relevant tests even
when you use sharding with libraries like Playwright and run tests on different machines.

## Run ID
Run IDs are a way of further segmenting tests within a single report. The typical use case is with
CI platforms like Github Actions, which allow you to re-try individual workflows.

## Target
Targets are a way of grouping together related reports. Typically, you'll set up one target per
repository, although this largely depends on your organization's needs. Each target has its own
API key, which is used by reporters to authenticate with the ZenTest server.