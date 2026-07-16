import React from "react";
import { cn } from "@/lib/utils";

/**
 * SectionHeader — premium UI, 4 variants
 *
 * <SectionHeader variant="classic"  badge="Our Services" title="..." subtitle="..." />
 * <SectionHeader variant="gradient" badge="..." title="..." subtitle="..." />
 * <SectionHeader variant="split"    badge="..." title="..." subtitle="..." />
 * <SectionHeader variant="elegant"  badge="..." title="..." subtitle="..." />
 */

/* ---------------------------------------------------------------- */
/* Variant 1: CLASSIC — centered, dot-pill badge, gradient underline */
/* ---------------------------------------------------------------- */
const ClassicHeader = ({ badge, title, subtitle }) => (
  <div className="mb-12 text-center">
    {badge && (
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        {badge}
      </span>
    )}
    {title && (
      <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
    )}
    {subtitle && (
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
        {subtitle}
      </p>
    )}
    <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-primary/30" />
  </div>
);

/* ---------------------------------------------------------------- */
/* Variant 2: GRADIENT — gradient title, soft glow badge             */
/* ---------------------------------------------------------------- */
const GradientHeader = ({ badge, title, subtitle }) => (
  <div className="mb-12 text-center">
    {badge && (
      <span className="relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/25">
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5L8 13.8 2 9.2h7.6z" />
        </svg>
        {badge}
      </span>
    )}
    {title && (
      <h2 className="mt-4 bg-gradient-to-r from-slate-900 via-violet-800 to-indigo-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent md:text-4xl">
        {title}
      </h2>
    )}
    {subtitle && (
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base">
        {subtitle}
      </p>
    )}
  </div>
);

/* ---------------------------------------------------------------- */
/* Variant 3: SPLIT — left aligned, vertical accent bar              */
/* ---------------------------------------------------------------- */
const SplitHeader = ({ badge, title, subtitle }) => (
  <div className="mb-12 flex items-start gap-5">
    <div className="mt-1 h-14 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-primary to-primary/20" />
    <div>
      {badge && (
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

/* ---------------------------------------------------------------- */
/* Variant 4: ELEGANT — badge between hairlines, refined & minimal   */
/* ---------------------------------------------------------------- */
const ElegantHeader = ({ badge, title, subtitle }) => (
  <div className="mb-12 text-center">
    {badge && (
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/70" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-600">
          {badge}
        </span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/70" />
      </div>
    )}
    {title && (
        <span className="font-semibold text-2xl my-2">{title}</span>
    )}
    {subtitle && (
      <p className="mx-auto max-w-lg text-sm italic leading-relaxed text-slate-500">
        {subtitle}
      </p>
    )}
    <div className="mx-auto mt-6 flex items-center justify-center gap-2">
      <span className="h-1 w-1 rounded-full bg-amber-400" />
      <span className="h-1.5 w-1.5 rotate-45 bg-amber-500" />
      <span className="h-1 w-1 rounded-full bg-amber-400" />
    </div>
  </div>
);

/* ---------------------------------------------------------------- */
/* Registry + main component                                         */
/* ---------------------------------------------------------------- */
const VARIANTS = {
  classic: ClassicHeader,
  gradient: GradientHeader,
  split: SplitHeader,
  elegant: ElegantHeader,
};

const SectionHeader = ({ variant = "classic", className, ...props }) => {
  const Variant = VARIANTS[variant] ?? ClassicHeader;
  return (
    <div className={cn(className)}>
      <Variant {...props} />
    </div>
  );
};

export default SectionHeader;
export { ClassicHeader, GradientHeader, SplitHeader, ElegantHeader };
