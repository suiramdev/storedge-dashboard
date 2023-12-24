import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "email" | "number" | "price";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  if (type === "price") {
    return (
      <div className={cn(inputClassName, className)}>
        <input type="number" className="flex-1 border-none bg-transparent outline-none" ref={ref} {...props} />
        <span className="ml-2 text-muted-foreground">$</span>
      </div>
    );
  }

  return <input type={type} className={cn(inputClassName, className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
