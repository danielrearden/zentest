export const formatLocalFilePath = (...parts: string[]) => {
  return ["vscode://file", ...parts]
    .map((part) => {
      return part.replace(/\/$/, "");
    })
    .join("/");
};
