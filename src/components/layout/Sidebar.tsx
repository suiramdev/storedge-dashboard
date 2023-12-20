import React, { useState, Suspense, cloneElement } from "react";
import {
  BadgePercentIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  LucideIcon,
  PieChartIcon,
  SettingsIcon,
  ShoppingBagIcon,
  TagIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { NavLink, NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarCollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: LucideIcon;
}

const SidebarCollapsible = ({ name, icon, children, ...props }: SidebarCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const Icon = icon as LucideIcon;

  return (
    <Collapsible {...props} open={isOpen} onOpenChange={setIsOpen} className="flex flex-col space-y-0.5">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Suspense fallback={<Skeleton className="mr-2 h-4 w-4" />}>
            {icon && <Icon className="mr-2 h-4 w-4" />}
          </Suspense>
          {name}
          <CaretDownIcon
            className={cn("ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform", isOpen && "rotate-180")}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col space-y-0.5">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SidebarLink)
            return cloneElement(child as React.ReactElement<{ variant: string }>, {
              variant: "collapsible-child",
            });
          return child;
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface SidebarLinkProps extends Omit<NavLinkProps, "children"> {
  name: string;
  icon?: LucideIcon;
  variant?: "default" | "collapsible-child";
}

const SidebarLink = ({ name, icon, variant, ...props }: SidebarLinkProps) => {
  const Icon = icon as LucideIcon;

  return (
    <NavLink {...props}>
      {({ isActive }) => (
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn("w-full justify-start", variant === "collapsible-child" && "font-light")}
        >
          {variant === "collapsible-child" && <div className="mr-2 h-4 w-4" />}
          <Suspense fallback={<Skeleton className="mr-2 h-4 w-4" />}>
            {Icon && <Icon className="mr-2 h-4 w-4" />}
          </Suspense>
          {name}
        </Button>
      )}
    </NavLink>
  );
};

function Sidebar() {
  return (
    <aside className="flex flex-col space-y-6 overflow-y-scroll rounded-lg border px-4 py-6">
      <div className="flex flex-1 flex-col space-y-6">
        <div className="flex flex-col space-y-0.5">
          <h1 className="mb-2 px-4 text-sm text-muted-foreground">Management</h1>
          <SidebarLink to="/" name="Dashboard" icon={LayoutDashboardIcon} />
          <SidebarCollapsible name="Products" icon={ShoppingBagIcon}>
            <SidebarLink to="/products" name="All products" />
          </SidebarCollapsible>
          <SidebarCollapsible name="Orders" icon={TagIcon}>
            <SidebarLink to="/orders" name="All orders" />
          </SidebarCollapsible>
          <SidebarLink to="/customers" name="Customers" icon={UsersIcon} />
        </div>
        <div className="flex flex-col space-y-0.5">
          <h1 className="mb-2 px-4 text-sm text-muted-foreground">Marketing</h1>
          <SidebarLink to="/coupons" name="Coupons" icon={TicketIcon} />
          <SidebarLink to="/discounts" name="Discounts" icon={BadgePercentIcon} />
          <SidebarLink to="/campaigns" name="Campaigns" icon={PieChartIcon} />
        </div>
      </div>
      <div className="flex flex-col space-y-0.5">
        <h1 className="my-2 px-4 text-sm text-muted-foreground">General</h1>
        <SidebarLink to="/settings" name="Settings" icon={SettingsIcon} />
        <SidebarLink to="/support" name="Support" icon={LifeBuoyIcon} />
      </div>
    </aside>
  );
}

export default Sidebar;
