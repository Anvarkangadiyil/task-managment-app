import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-600 text-white shadow",
        secondary: "border-zinc-700 bg-zinc-800 text-zinc-300",
        destructive: "border-transparent bg-red-950/60 text-red-400 border-red-900",
        outline: "text-zinc-300 border-zinc-800",
        admin: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        user: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        inProgress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
