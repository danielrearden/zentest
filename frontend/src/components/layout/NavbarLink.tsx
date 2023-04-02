import { NavLink } from "@mantine/core";
import { Link, useMatches } from "react-router-dom";
import { Icon } from "tabler-icons-react";

type NavbarLinkProps =
  | {
      icon: Icon;
      label: string;
      to: string;
    }
  | {
      href: string;
      icon: Icon;
      label: string;
    };

export const NavbarLink = (props: NavbarLinkProps) => {
  const matches = useMatches();

  if ("href" in props) {
    const { href, icon: LinkIcon, label } = props;

    return (
      <NavLink
        active={false}
        color="brand"
        component="a"
        href={href}
        label={label}
        icon={<LinkIcon size="1.5rem" />}
        target="_blank"
      />
    );
  }

  const { icon: LinkIcon, label, to } = props;
  const active = matches.some((match) => match.pathname === to);

  return (
    <NavLink
      active={active}
      color="brand"
      component={Link}
      to={to}
      label={label}
      icon={<LinkIcon size="1.5rem" />}
    />
  );
};
