import { Path, Link } from "@/router";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavItem {
  title: string;
  path: Path;
}

const navItems: NavItem[] = [
  {
    title: "General",
    path: "/settings",
  },
  {
    title: "Access control",
    path: "/settings/access-control",
  },
];

interface NavBarProps {
  className?: string;
}

export function NavBar({ className }: NavBarProps) {
  const { pathname } = useLocation();

  return (
    <div className={cn("flex gap-2 lg:flex-col", className)}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.path ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
