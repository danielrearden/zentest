import { Navbar } from "@/components/layout/Navbar.js";
import { AppShell } from "@mantine/core";
import { Outlet } from "react-router";

export const Root = () => {
  return (
    <AppShell padding="md" navbar={<Navbar />}>
      <Outlet />
    </AppShell>
  );
};
