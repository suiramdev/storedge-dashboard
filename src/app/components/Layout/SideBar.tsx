"use client";

import {
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineSelector,
  HiOutlineShoppingCart,
  HiOutlineTag,
} from "react-icons/hi";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/app/components/Icons";

export default function SideBar() {
  const links = [
    {
      href: "/",
      icon: HiOutlineHome,
      name: "Home",
    },
    {
      href: "/products",
      icon: HiOutlineShoppingCart,
      name: "Products",
    },
    {
      href: "/orders",
      icon: HiOutlineTag,
      name: "Orders",
    },
    {
      href: "/settings",
      icon: HiOutlineCog,
      name: "Settings",
    },
  ];

  return (
    <div className="flex w-[208px] flex-col border-r border-gray-200 bg-white px-6">
      <div className="flex h-[72px] items-center py-2">
        <button className="flex w-full items-center justify-between rounded p-2 text-lg font-semibold hover:bg-gray-50">
          Demo store
          <HiOutlineSelector size={16} />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between pt-6 pb-2">
        <nav className="border-b border-gray-200 pb-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className={clsx(
                    "flex items-center gap-2 rounded p-2 font-medium hover:bg-gray-50",
                    usePathname() === link.href && "bg-gray-50 text-indigo-500"
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
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <Logo size={16} />
          <span className="text-xs text-gray-500">March 2023</span>
        </div>
      </div>
    </div>
  );
}
