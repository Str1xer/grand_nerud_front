import * as React from "react";

import { cn } from "@/lib/utils";

interface InputComponentProps extends React.ComponentProps<"input"> {
  status?: "default" | "error";
}

const Input = React.forwardRef<HTMLInputElement, InputComponentProps>(
  ({ className, type, status = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
          status === "error" ? "border-red-500" : "border-input"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
