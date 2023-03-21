import { RouterProvider } from "react-router";
import { ApiProvider } from "@/contexts/api.js";
import { ThemeProvider } from "@/contexts/theme.js";
import { router } from "@/router.js";

export const App = () => {
  return (
    <ApiProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApiProvider>
  );
};
