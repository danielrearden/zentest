import { NavbarLink } from "@/components/layout/NavbarLink.js";
import {
  Divider,
  Group,
  Image,
  Navbar as MantineNavbar,
  Title,
  createStyles,
} from "@mantine/core";
import { Book2, ReportAnalytics, Target } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  logoText: {
    background: "linear-gradient(0deg, #0d98ba 0%, #8fbc8f 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));

export const Navbar = () => {
  const { classes } = useStyles();
  return (
    <MantineNavbar width={{ base: 200 }} p="xs">
      <MantineNavbar.Section mb="sm">
        <Group position="center">
          <Image src="/favicon.svg" height="1.75rem" width="1.75rem" />
          <Title
            className={classes.logoText}
            order={3}
            weight={800}
            align="center"
          >
            ZenTest
          </Title>
        </Group>
      </MantineNavbar.Section>
      <MantineNavbar.Section grow>
        <NavbarLink to="/reports" label="Reports" icon={ReportAnalytics} />
        <NavbarLink to="/targets" label="Targets" icon={Target} />
        <Divider my="sm" />
        <NavbarLink
          href="https://zentest.dev"
          label="Documentation"
          icon={Book2}
        />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};
