import { MantineProvider, MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colors: {
    brand: [
      "#f7ffff",
      "#effeff",
      "#e7fdfd",
      "#e0fcfc",
      "#d6fcfa",
      "#cef8f6",
      "#c6f5f2",
      "#9edcd7",
      "#77c3be",
      "#4eaaa5",
    ],
  },
  colorScheme: "dark",
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  );
};
