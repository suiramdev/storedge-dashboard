"use client";

import {
  HiCog,
  HiHome,
  HiSelector,
  HiShoppingCart,
  HiTag,
} from "react-icons/hi";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function SideBar() {
  const links = [
    {
      href: "/",
      icon: HiHome,
      name: "Home",
    },
    {
      href: "/products",
      icon: HiShoppingCart,
      name: "Products",
    },
    {
      href: "/orders",
      icon: HiTag,
      name: "Orders",
    },
    {
      href: "/settings",
      icon: HiCog,
      name: "Settings",
    },
  ];

  return (
    <div className="flex w-64 flex-col bg-indigo-700 px-4 text-indigo-200">
      <div className="flex h-16 items-center py-2">
        <button className="flex w-full items-center justify-between rounded p-2 text-lg font-semibold hover:bg-black/10">
          Demo store
          <HiSelector size={16} />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between pt-6 pb-2">
        <nav>
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className={clsx(
                    "flex items-center gap-2 rounded p-2 font-medium",
                    usePathname() === link.href
                      ? "bg-black/20 text-white"
                      : "hover:bg-black/10"
                  )}
                  href={link.href}
                >
                  {<link.icon size={16} />}
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
