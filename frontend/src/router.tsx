import { createBrowserRouter, RouteObject } from "react-router-dom";
import { HomePage } from "@/pages/HomePage.js";
import { ReportPage } from "@/pages/ReportPage.js";
import { ReportsPage } from "@/pages/ReportsPage.js";
import { TestResultPage } from "@/pages/TestResultPage.js";
import { TargetsPage } from "@/pages/TargetsPage.js";
import { Root } from "@/pages/Root.js";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/reports",
        element: <ReportsPage />,
      },
      {
        path: "/reports/:reportUid",
        element: <ReportPage />,
      },
      {
        path: "/testResults/:testResultId",
        element: <TestResultPage />,
      },
      {
        path: "/targets",
        element: <TargetsPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
