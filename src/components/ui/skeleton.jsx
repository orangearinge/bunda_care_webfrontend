import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-skeleton
      className={cn("rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }
