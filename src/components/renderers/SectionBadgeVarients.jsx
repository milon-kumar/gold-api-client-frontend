import React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge — premium variants
 *
 * <Badge variant="soft">Our Services</Badge>
 * variants: soft | outline | dot | gradient | glow | glass | gold | line
 */

const VARIANTS = {
  /* 1. SOFT — tinted background, subtle border */
  soft: "rounded-full border border-primary/15 bg-primary/8 bg-primary/5 px-4 py-1.5 text-[16px] font-semibold text-primary",

  /* 2. OUTLINE — clean bordered pill, uppercase tracking */
  outline:
    "rounded-full border-[1.5px] border-slate-300 bg-transparent px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600",

  /* 3. DOT — soft pill + pulsing status dot */
  dot: "rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-[18px] font-semibold text-primary [&>i]:relative [&>i]:flex [&>i]:h-2 [&>i]:w-2",

  /* 4. GRADIENT — filled gradient, colored shadow */
  gradient:
    "rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-1.5 text-[18px] font-semibold text-white shadow-lg shadow-violet-500/30",

  /* 5. GLOW — dark pill with neon ring glow */
  glow: "rounded-full bg-slate-900 px-4 py-1.5 text-[18px] font-semibold text-white ring-1 ring-primary/50 shadow-[0_0_18px_-2px] shadow-primary/50",

  /* 6. GLASS — frosted, for image/hero backgrounds */
  glass:
    "rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-[18px] font-semibold text-white backdrop-blur-md shadow-sm",

  /* 7. GOLD — premium/featured label */
  gold: "rounded-full border border-amber-300/70 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-1.5 text-[18px] font-bold text-amber-700 shadow-sm",

  /* 8. LINE — eyebrow text between hairlines (no pill) */
  line: "bg-transparent p-0 text-[18px] font-semibold uppercase tracking-[0.26em] text-primary",
};

const Badge = ({ variant = "soft", className, children, ...props }) => {
  // "dot" variant: pulsing dot before text
  if (variant === "dot") {
    return (
      <span
        className={cn("inline-flex items-center gap-2", VARIANTS.dot, className)}
        {...props}
      >
        <i className="relative flex h-2 w-2">
          <i className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <i className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </i>
        {children}
      </span>
    );
  }

  // "line" variant: hairlines on both sides
  if (variant === "line") {
    return (
      <span
        className={cn("inline-flex items-center gap-3", VARIANTS.line, className)}
        {...props}
      >
        <i className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
        {children}
        <i className="h-px w-10 bg-gradient-to-l from-transparent to-primary/60" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[16px]",
        VARIANTS[variant] ?? VARIANTS.soft,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;