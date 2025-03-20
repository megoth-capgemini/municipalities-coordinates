import { HTMLAttributes } from "react";
import { clsx } from "clsx";

export default function Loading({
  className,
  ...props
}: HTMLAttributes<HTMLProgressElement>) {
  return (
    <progress
      className={clsx("bulma-progress", className)}
      max="100"
      {...props}
    />
  );
}
