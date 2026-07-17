import React from "react";
import { ChevronRight } from "lucide-react";

/* ============================================================
   PageHeroRenderer — Dynamic Page Header Component
   ============================================================

   USAGE:

   <PageHeroRenderer
     variant="gradient"            // gradient | editorial | wave | minimal | split | aurora
     eyebrow="আমাদের টিম"
     title="পরিচিত হোন আমাদের"
     highlight="দায়িত্বশীলদের"     // highlighted word (gradient text / underline)
     titleAfter="সাথে"             // text after highlight (optional)
     description="প্রতিষ্ঠানের প্রতিটি কাজের পেছনে..."
     breadcrumbs={[
       { label: "হোম", href: "/" },
       { label: "কর্মকর্তাবৃন্দ" },   // last item = active
     ]}
     rightSlot={<YourCustomCard />}  // optional: stat card, preview card etc.
   />

   ============================================================ */

/* ---------------- Shared pieces ---------------- */

const Breadcrumbs = ({ items = [], dark = false }) => {
  if (!items.length) return null;
  return (
    <nav
      className={`mb-8 flex flex-wrap items-center gap-1.5 text-sm ${
        dark ? "text-slate-400" : "text-muted-foreground"
      }`}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {isLast ? (
              <span
                className={`font-bengali font-medium ${
                  dark ? "text-emerald-400" : "text-primary"
                }`}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || "#"}
                className={`font-bengali transition-colors ${
                  dark ? "hover:text-white" : "hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

const Eyebrow = ({ children, dark = false }) => (
  <div className="mb-5 flex items-center gap-3">
    <span className={`h-px w-10 ${dark ? "bg-emerald-400" : "bg-primary"}`} />
    <span
      className={`font-bengali text-sm font-semibold uppercase tracking-widest ${
        dark ? "text-emerald-300" : "text-primary"
      }`}
    >
      {children}
    </span>
  </div>
);

const UnderlineStroke = ({ className = "" }) => (
  <svg
    className={`absolute -bottom-2 left-0 h-4 w-full ${className}`}
    viewBox="0 0 300 20"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M4 14 C 60 4, 140 4, 296 12"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

/* ============================================================
   VARIANT 1 — "gradient"
   Dark emerald gradient + grid pattern + glow blobs
   ============================================================ */
const GradientHero = ({
  eyebrow,
  title,
  highlight,
  titleAfter,
  description,
  breadcrumbs,
  rightSlot,
}) => (
  <section className="relative overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
    <div className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <Breadcrumbs items={breadcrumbs} dark />
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {eyebrow && <Eyebrow dark>{eyebrow}</Eyebrow>}
          <h1 className="font-bengali text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}{" "}
            {highlight && (
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
                  {highlight}
                </span>
                <UnderlineStroke className="text-emerald-400" />
              </span>
            )}
            {titleAfter && <> {titleAfter}</>}
          </h1>
          {description && (
            <p className="font-bengali mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="justify-self-start lg:justify-self-end">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
  </section>
);

/* ============================================================
   VARIANT 2 — "editorial"
   Light background + dotted pattern + hand-drawn underline
   ============================================================ */
const EditorialHero = ({
  eyebrow,
  title,
  highlight,
  titleAfter,
  description,
  breadcrumbs,
  rightSlot,
}) => (
  <section className="relative overflow-hidden bg-background">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "radial-gradient(hsl(var(--primary) / 0.35) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
      }}
    />
    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <Breadcrumbs items={breadcrumbs} />
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="font-bengali text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}{" "}
            {highlight && (
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{highlight}</span>
                <UnderlineStroke className="text-primary" />
              </span>
            )}
            {titleAfter && <> {titleAfter}</>}
          </h1>
          {description && (
            <p className="font-bengali mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="justify-self-start lg:justify-self-end">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
    <div className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  </section>
);

/* ============================================================
   VARIANT 3 — "wave"
   Rich gradient + curved SVG wave bottom divider
   ============================================================ */
const WaveHero = ({
  eyebrow,
  title,
  highlight,
  titleAfter,
  description,
  breadcrumbs,
  rightSlot,
}) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900">
    {/* diagonal light streaks */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(115deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)",
      }}
    />
    <div className="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
    <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-12 lg:px-8">
      <Breadcrumbs
        items={breadcrumbs}
        dark
      />
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {eyebrow && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="font-bengali text-sm font-medium text-white">
                {eyebrow}
              </span>
            </div>
          )}
          <h1 className="font-bengali text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}{" "}
            {highlight && (
              <span className="text-amber-300">{highlight}</span>
            )}
            {titleAfter && <> {titleAfter}</>}
          </h1>
          {description && (
            <p className="font-bengali mt-6 max-w-xl text-base leading-relaxed text-emerald-100/90 sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="justify-self-start lg:justify-self-end">
            {rightSlot}
          </div>
        )}
      </div>
    </div>

    {/* wave divider into page background */}
    <svg
      className="absolute bottom-0 left-0 w-full text-background"
      viewBox="0 0 1440 80"
      fill="currentColor"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,20 1440,50 L1440,80 L0,80 Z" />
    </svg>
  </section>
);

/* ============================================================
   VARIANT 4 — "minimal"
   Centered, quiet, lots of whitespace — for formal pages
   ============================================================ */
const MinimalHero = ({
  eyebrow,
  title,
  highlight,
  titleAfter,
  description,
  breadcrumbs,
}) => (
  <section className="relative overflow-hidden border-b border-border bg-background">
    <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-10 text-center sm:px-6 sm:pb-16 sm:pt-12">
      {breadcrumbs?.length > 0 && (
        <div className="mb-6 flex justify-center">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      {eyebrow && (
        <span className="font-bengali mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          {eyebrow}
        </span>
      )}
      <h1 className="font-bengali text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
        {title}{" "}
        {highlight && <span className="text-primary">{highlight}</span>}
        {titleAfter && <> {titleAfter}</>}
      </h1>
      {description && (
        <p className="font-bengali mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
      {/* small decorative diamond divider */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <span className="h-px w-12 bg-border" />
        <span className="h-1.5 w-1.5 rotate-45 bg-primary" />
        <span className="h-px w-12 bg-border" />
      </div>
    </div>
  </section>
);

/* ============================================================
   VARIANT 5 — "split"
   Two-tone split: content left, solid color panel right
   ============================================================ */
const SplitHero = ({
  eyebrow,
  title,
  highlight,
  titleAfter,
  description,
  breadcrumbs,
  rightSlot,
}) => (
  <section className="relative overflow-hidden bg-background">
    {/* right color panel (desktop) */}
    <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-gradient-to-b from-emerald-600 to-teal-700 lg:block">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(#fff 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* angled edge */}
      <div className="absolute inset-y-0 -left-10 w-20 -skew-x-6 bg-background" />
    </div>

    <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <Breadcrumbs items={breadcrumbs} />
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="font-bengali text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}{" "}
            {highlight && (
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{highlight}</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-emerald-200/70" />
              </span>
            )}
            {titleAfter && <> {titleAfter}</>}
          </h1>
          {description && (
            <p className="font-bengali mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="justify-self-start lg:justify-self-end lg:pr-4">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  </section>
);

/* ============================================================
   VARIANT 6 — "aurora"
   Deep navy + animated soft aurora gradients — premium feel
   ============================================================ */
const AuroraHero = ({
  eyebrow,
  title,
  highlight,
  titleAfter,
  description,
  breadcrumbs,
  rightSlot,
}) => (
  <section className="relative overflow-hidden bg-[#060b18]">
    {/* aurora blobs */}
    <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 animate-pulse rounded-full bg-emerald-500/25 blur-[100px] [animation-duration:5s]" />
    <div className="absolute right-0 top-1/4 h-80 w-80 animate-pulse rounded-full bg-cyan-400/15 blur-[100px] [animation-duration:7s]" />
    <div className="absolute bottom-0 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]" />
    {/* fine noise-like dots */}
    <div
      className="absolute inset-0 opacity-[0.12]"
      style={{
        backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
        backgroundSize: "18px 18px",
      }}
    />

    <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <Breadcrumbs items={breadcrumbs} dark />
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {eyebrow && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-bengali text-sm font-medium text-emerald-300">
                {eyebrow}
              </span>
            </div>
          )}
          <h1 className="font-bengali text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}{" "}
            {highlight && (
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                {highlight}
              </span>
            )}
            {titleAfter && <> {titleAfter}</>}
          </h1>
          {description && (
            <p className="font-bengali mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="justify-self-start lg:justify-self-end">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-emerald-400/40 to-transparent" />
  </section>
);

/* ============================================================
   RENDERER
   ============================================================ */
const VARIANTS = {
  gradient: GradientHero,
  editorial: EditorialHero,
  wave: WaveHero,
  minimal: MinimalHero,
  split: SplitHero,
  aurora: AuroraHero,
};

const PageHeroRenderer = ({ variant = "gradient", ...props }) => {
  const HeroComponent = VARIANTS[variant] || GradientHero;
  return <HeroComponent {...props} />;
};

export default PageHeroRenderer;