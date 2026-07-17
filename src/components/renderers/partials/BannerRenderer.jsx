// @ts-nocheck
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

/* ============================================================
   Home Page Hero Banners
   ============================================================

   দুটো variant:
   1. <GradientBanner content={...} />  → dark emerald gradient concept
   2. <AuroraBanner content={...} />    → animated aurora concept

   অথবা এক component দিয়েই:
   <DynamicBanner variant="aurora" content={...} />

   content structure:
   {
     slogan, title, subtitle,
     primayButtonTitle, primayButtonLink,
     seconderyButtonTitle, seconderyButtonLink,
     items: [{ label, value }]   // optional stats
   }
   ============================================================ */

/* ---------------- helpers ---------------- */

// title-এর শেষ শব্দটা আলাদা করে — সেটাই gradient highlight হবে
const splitTitle = (title = "") => {
  const words = title.trim().split(" ");
  if (words.length < 2) return { before: "", last: title };
  return {
    before: words.slice(0, -1).join(" "),
    last: words[words.length - 1],
  };
};

const useContent = (content = {}) => {
  const {
    slogan = "Welcome",
    title = "Build Your Future",
    subtitle = "Simple, modern, and powerful solutions.",
    // দুই রকম spelling-ই support করা হয়েছে
    primayButtonTitle,
    primayButtonLink,
    primaryButtonTitle,
    primaryButtonLink,
    seconderyButtonTitle,
    seconderyButtonLink,
    secondaryButtonTitle,
    secondaryButtonLink,
    items = [],
  } = content;

  return {
    slogan,
    title,
    subtitle,
    primaryTitle: primaryButtonTitle || primayButtonTitle || "Get Started",
    primaryLink: primaryButtonLink || primayButtonLink || "/about",
    secondaryTitle: secondaryButtonTitle || seconderyButtonTitle || "Learn More",
    secondaryLink: secondaryButtonLink || seconderyButtonLink || "/contact",
    items,
  };
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

/* ============================================================
   BANNER 1 — "gradient"
   Dark emerald gradient + grid pattern + glow blobs
   Left-aligned, editorial feel
   ============================================================ */
export function GradientBanner({ content = {} }) {
  const {
    slogan,
    title,
    subtitle,
    primaryTitle,
    primaryLink,
    secondaryTitle,
    secondaryLink,
    items,
  } = useContent(content);

  const { before, last } = splitTitle(title);

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-slate-950">
      {/* layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
      {/* grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 40%, black, transparent)",
        }}
      />
      {/* glow accents */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* slogan badge */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span className="font-bengali text-sm font-medium text-emerald-300">
              {slogan}
            </span>
          </motion.div>

          {/* title */}
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-bengali text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {before && <>{before} </>}
            <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
              {last}
            </span>
          </motion.h1>

          {/* subtitle */}
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-bengali mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            {subtitle}
          </motion.p>

          {/* buttons */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="font-bengali group h-13 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110"
            >
              <Link to={primaryLink}>
                {primaryTitle}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-bengali rounded-full border-white/20 bg-white/5 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link to={secondaryLink}>{secondaryTitle}</Link>
            </Button>
          </motion.div>

          {/* optional stats */}
          {items?.length > 0 && (
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-8"
            >
              {items.map((item, i) => (
                <div key={i}>
                  <p className="font-bengali text-3xl font-bold text-white">
                    {item?.value}
                  </p>
                  <p className="font-bengali mt-1 text-sm text-slate-400">
                    {item?.label}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
    </section>
  );
}

/* ============================================================
   BANNER 2 — "aurora"
   Deep navy + animated aurora glow — centered, premium feel
   ============================================================ */
export function AuroraBanner({ content = {} }) {
  const {
    slogan,
    title,
    subtitle,
    primaryTitle,
    primaryLink,
    secondaryTitle,
    secondaryLink,
    items,
  } = useContent(content);

  const { before, last } = splitTitle(title);

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#060b18]">
      {/* animated aurora blobs */}
      <div className="absolute left-1/4 top-0 h-[28rem] w-[28rem] -translate-x-1/2 animate-pulse rounded-full bg-emerald-500/25 blur-[110px] [animation-duration:5s]" />
      <div className="absolute right-0 top-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-400/15 blur-[110px] [animation-duration:7s]" />
      <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 animate-pulse rounded-full bg-violet-500/10 blur-[110px] [animation-duration:9s]" />
      {/* fine dots */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* top edge glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6">
        {/* slogan badge with live dot */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-bengali text-sm font-medium text-emerald-300">
            {slogan}
          </span>
        </motion.div>

        {/* title */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-bengali mx-auto max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          {before && <>{before} </>}
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
            {last}
          </span>
        </motion.h1>

        {/* subtitle */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-bengali mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          {subtitle}
        </motion.p>

        {/* buttons */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="font-bengali group relative rounded-full bg-white px-8 py-6 text-base font-bold text-slate-900 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-400/25"
          >
            <Link to={primaryLink}>
              {primaryTitle}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="font-bengali rounded-full border-white/20 bg-transparent px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
          >
            <Link to={secondaryLink}>{secondaryTitle}</Link>
          </Button>
        </motion.div>

        {/* optional stats */}
        {items?.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-x-12 gap-y-6"
          >
            {items.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span className="hidden h-8 w-px bg-white/10 sm:block" />
                )}
                <div className="text-center">
                  <p className="font-bengali bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent">
                    {item?.value}
                  </p>
                  <p className="font-bengali mt-1 text-sm text-slate-400">
                    {item?.label}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        )}

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-5 w-5 animate-bounce text-slate-500" />
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   DYNAMIC WRAPPER
   <DynamicBanner variant="gradient|aurora" content={...} />
   ============================================================ */
const BANNERS = {
  gradient: GradientBanner,
  aurora: AuroraBanner,
};

export default function DynamicBanner({ variant = "gradient", content = {} }) {
  const Banner = BANNERS[variant] || GradientBanner;
  return <Banner content={content} />;
}