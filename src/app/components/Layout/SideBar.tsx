"use client";

import {
  HiChartSquareBar,
  HiCog,
  HiReceiptTax,
  HiShoppingCart,
  HiSupport,
  HiTag,
  HiTemplate,
  HiTicket,
  HiUserGroup,
} from "react-icons/hi";
import NavMenu, { NavLink } from "./NavMenu";

export default function SideBar() {
  return (
    <div className="flex w-64 flex-col justify-between border-r border-r-gray-200 py-6">
      <div className="flex flex-col gap-12">
        <NavMenu title="Management">
          <NavLink href="/" name="Dashboard" icon={HiTemplate} />
          <NavLink href="/products" name="Products" icon={HiShoppingCart} />
          <NavLink href="/orders" name="Orders" icon={HiTag} />
          <NavLink href="/customers" name="Customers" icon={HiUserGroup} />
          <NavLink href="/settings" name="Settings" icon={HiCog} />
        </NavMenu>
        <NavMenu title="Marketing">
          <NavLink href="/coupons" name="Coupons" icon={HiTicket} />
          <NavLink href="/discounts" name="Discounts" icon={HiReceiptTax} />
          <NavLink href="/campaigns" name="Campaigns" icon={HiChartSquareBar} />
        </NavMenu>
      </div>
      <NavMenu>
        <NavLink href="/support" name="Support" icon={HiSupport} />
      </NavMenu>
    </div>
  );
}
