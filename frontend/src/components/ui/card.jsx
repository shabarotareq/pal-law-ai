import React from "react";
import clsx from "clsx";

export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-200 bg-white shadow-md p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => (
  <div
    className={clsx("mb-4 border-b border-gray-100 pb-3", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={clsx("text-xl font-semibold text-gray-800", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={clsx("text-gray-600", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div
    className={clsx("mt-4 border-t border-gray-100 pt-3", className)}
    {...props}
  >
    {children}
  </div>
);
