import { Anchor, Code, MantineTheme, useMantineTheme } from "@mantine/core";
import { parse } from "ansicolor";
import { Error as ErrorType, TestResult } from "@zentest/api";
import { useTargetLocalPath } from "@/hooks/useTargetLocalPath.js";
import { formatLocalFilePath } from "@/utilities/formatLocalFilePath.js";

const getThemeColor = (
  theme: MantineTheme,
  color?: string
): string | undefined => {
  if (!color) {
    return undefined;
  }

  return theme.colors[color === "magenta" ? "pink" : color][5];
};

type ErrorProps = {
  error: ErrorType;
  testResult: TestResult;
};

export const Error = ({ error, testResult }: ErrorProps) => {
  const theme = useMantineTheme();
  const [localPath] = useTargetLocalPath(testResult.report.target.id);

  return (
    <Code key={error.id} block pos="relative">
      {parse(error.stack ?? error.message).spans.flatMap(
        ({ bgColor, color, text }, index) => {
          const matches = Array.from(
            text.matchAll(new RegExp(`${testResult.cwd}\\S+`, "g"))
          );

          if (localPath && matches.length) {
            return matches.map((match) => {
              const [matchText] = match;
              const [before, after] = text.split(matchText);
              return (
                <>
                  <span
                    key={`${index}-before`}
                    style={{
                      color: getThemeColor(theme, color?.name),
                      backgroundColor: getThemeColor(theme, bgColor?.name),
                    }}
                  >
                    {before}
                  </span>
                  <span
                    key={`${index}-match`}
                    style={{
                      color: getThemeColor(theme, color?.name),
                      backgroundColor: getThemeColor(theme, bgColor?.name),
                    }}
                  >
                    <Anchor
                      style={{ fontFamily: theme.fontFamilyMonospace }}
                      href={formatLocalFilePath(
                        matchText.replace(testResult.cwd, localPath)
                      )}
                    >
                      {matchText}
                    </Anchor>
                  </span>
                  <span
                    key={`${index}-after`}
                    style={{
                      color: getThemeColor(theme, color?.name),
                      backgroundColor: getThemeColor(theme, bgColor?.name),
                    }}
                  >
                    {after}
                  </span>
                </>
              );
            });
          }

          return (
            <span
              key={index}
              style={{
                color: getThemeColor(theme, color?.name),
                backgroundColor: getThemeColor(theme, bgColor?.name),
              }}
            >
              {text}
            </span>
          );
        }
      )}
    </Code>
  );
};
