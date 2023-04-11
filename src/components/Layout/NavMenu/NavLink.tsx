import { NavLinkProps, NavLink as RouterNavLink } from "react-router-dom";
import clsx from "clsx";
import { IconType } from "react-icons";

type Props = {
  icon?: IconType;
  label: string;
} & NavLinkProps;

function NavLink({ label, icon, ...props }: Props) {
  const Icon = icon;

  return (
    <li>
      <RouterNavLink
        className={({ isActive }) =>
          clsx(
            "relative flex items-center gap-2 px-6 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-100",
            isActive && [
              "before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-indigo-600",
              "bg-indigo-50 !text-indigo-600 hover:bg-indigo-100",
            ]
          )
        }
        {...props}
      >
        {Icon && <Icon size={24} />}
        {label}
      </RouterNavLink>
    </li>
  );
}

export default NavLink;
