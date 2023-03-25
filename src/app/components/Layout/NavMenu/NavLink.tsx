"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

type Props = {
  href: string;
  icon?: IconType;
  name: string;
};

export default function NavLink({ href, icon, name }: Props) {
  const pathname = usePathname();
  const Icon = icon;

  return (
    <li>
      <Link
        className={clsx(
          "relative flex items-center gap-2 px-6 py-2 text-sm font-semibold hover:bg-gray-100",
          pathname == href && [
            "before:absolute before:top-0 before:left-0 before:h-full before:w-0.5 before:bg-indigo-600",
            "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
          ]
        )}
        href={href}
      >
        {Icon && (
          <Icon
            size={24}
            className={clsx(
              pathname == href ? "fill-indigo-300" : "fill-gray-300"
            )}
          />
        )}
        {name}
      </Link>
    </li>
  );
}
