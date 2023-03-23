import { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  children?: ReactNode;
};

export default function DropdownItem({
  children,
  as: Component = "button",
  ...props
}: Props) {
  return (
    <Component
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
      {...props}
    >
      {children}
    </Component>
  );
}
