import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={clsx(
          "flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "disabled:cursor-not-allowed disabled:bg-gray-100",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
