// @ts-nocheck
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  BookOpen,
  Users,
  CalendarDays,
  Sparkles,
  MapPin,
  BadgeCheck,
  CircleCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import IconComponent from "@/components/shear/IconComponent";

/* ============================================================
   Dynamic Gradient Home Hero 
   ============================================================ */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const float = (delay = 0, duration = 5) => ({
  animate: { y: [0, -10, 0] },
  transition: {
    duration,
    delay,
    repeat: Infinity,
    ease: "easeInOut",
  },
});

// Icon mapping for dynamic icons
const iconMap = {
  Check: Check,
  Calendar: CalendarDays,
  CircleCheck: CircleCheck,
  // Add more icons as needed
};

export default function GradientHero({
  content = {},
  settings = {},
  styles = {},
}) {
  const {
    slogan = "Welcome",
    title = "Build Your Future",
    subtitle = "Simple, modern, and powerful solutions.",
    primaryButtonTitle = "Get Started",
    primaryButtonLink = "/about",
    secondaryButtonTitle = "Learn More",
    secondaryButtonLink = "/contact",
    rightSectionImage = null,
    stats: bottomStats = [],
    rightSecOneIcon = "Check",
    rightSecOneTitle = "Regular publications",
    rightSecOneSubTitle = "Monthly magazines and Islamic literature",
    rightSecTwoIcon = "Calendar",
    rightSecTwoHeaderTitle = "Upcoming events",
    rightSecTwoHeaderBadge = "Registration is ongoing.",
    rightSecTowTitle = "Annual Tablighi Ijtema 2027",
    rightSecTowItems = [],
    rightSecTowFooterIcon = "Check",
    rightSecTowFooterTitle = "A gathering of millions of people from home and abroad",
    rightSecThreeIcon = "Check",
    rightSecThreeTitle = "Big family",
    rightSecThreeSubTitle = "Millions of members and well-wishers",
    rightSecThreeDescription = "Connected from all over the country",
  } = content;



  // Destructure settings
  const {
    showCardOne = true,
    showCardTow = true,
    showCardThree = true,
    useImageInRightSection = false,
  } = settings;

  // Get icon components dynamically
  const CardOneIcon = iconMap[rightSecOneIcon] || Check;
  const CardTwoIcon = iconMap[rightSecTwoIcon] || CalendarDays;
  const CardTwoFooterIcon = iconMap[rightSecTowFooterIcon] || Check;
  const CardThreeIcon = iconMap[rightSecThreeIcon] || Check;


  // Format stats from content or use default
  const stats =
    bottomStats.length > 0 ? bottomStats.map((stat) => ({
      value: stat.count || "1",
      label: stat.title || "Default",
    }))
      : [];

  const tickerItems =
    content?.bottomTickerItems
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) || [];



  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-slate-950">
      {/* ---------- background layers ---------- */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-slate-950 to-slate-900" />
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
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <svg
        className="absolute -right-24 top-1/2 h-136 w-136 -translate-y-1/2 text-emerald-400/6 animate-[spin_160s_linear_infinite]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M100 10 L122 78 L190 78 L135 120 L156 188 L100 146 L44 188 L65 120 L10 78 L78 78 Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="4 6"
        />
      </svg>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-28 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          {/* ================= LEFT: content ================= */}
          <div>
            {/* slogan badge */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 backdrop-blur-sm"
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
              className="font-bengali text-4xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl xl:text-6xl"
            >
              {title}
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
                className="font-bengali group rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 px-8 py-6 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/35 hover:brightness-110"
              >
                <Link to={primaryButtonLink}>
                  {primaryButtonTitle}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-bengali rounded-full border-white/20 bg-white/5 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-amber-200"
              >
                <Link to={secondaryButtonLink}>{secondaryButtonTitle}</Link>
              </Button>
            </motion.div>

            {/* stats */}
            {
              stats?.length > 0 ? (
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-8"
                >
                  {stats.map((item, i) => (
                    <div key={i}>
                      <p className="font-bengali bg-linear-to-r from-emerald-400 to-amber-300 bg-clip-text text-3xl font-bold text-transparent">
                        {item.value}
                      </p>
                      <p className="font-bengali mt-1 text-sm text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              ) : null
            }

          </div>

          {/* ================= RIGHT: card composition ================= */}
          {
            (rightSectionImage && useImageInRightSection) ? (
              <img src={rightSectionImage} />
            ) : (
              <div className="relative hidden min-h-120 lg:block">
                {/* Card Two - Main Event Card (Middle) */}
                {showCardTow && (
                  <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute left-1/2 top-1/2 w-84 -translate-x-1/2 -translate-y-1/2"
                  >
                    <motion.div
                      {...float(0, 6)}
                      className="overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl"
                    >
                      {/* card header */}
                      <div className="flex items-center justify-between border-b border-white/10 bg-linear-to-r from-emerald-500/15 to-amber-400/10 px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IconComponent icon={rightSecTwoIcon} className="h-4 w-4 text-amber-300" />

                          <span className="font-bengali text-sm font-semibold text-white">
                            {rightSecTwoHeaderTitle}
                          </span>
                        </div>
                        <span className="font-bengali rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                          {rightSecTwoHeaderBadge}
                        </span>
                      </div>
                      {/* card body */}
                      <div className="px-6 py-5">
                        <p className="font-bengali text-lg font-bold leading-snug text-white">
                          {rightSecTowTitle}
                        </p>
                        <div className="font-bengali mt-3 space-y-2 text-sm text-slate-400">
                          {rightSecTowItems.map((item, idx) => {
                            const ItemIcon = iconMap[item.icon] || CircleCheck;
                            return (
                              <p key={idx} className="flex items-center gap-2">
                                <IconComponent icon={item.icon || 'CircleCheck'} className="h-3.5 w-3.5 text-emerald-400" />
                                {item.title}
                              </p>
                            );
                          })}
                        </div>
                        <div className="mt-5 h-px bg-linear-to-r from-emerald-500/40 via-white/10 to-transparent" />
                        <p className="font-bengali mt-4 flex items-center gap-2 text-xs text-slate-500">
                          <IconComponent icon={rightSecTowFooterIcon || 'CardTwoFooterIcon'} className="h-3.5 w-3.5 text-amber-300" />

                          {rightSecTowFooterTitle}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Card One - Top Left Mini Card */}
                {showCardOne && (
                  <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute -left-2 top-4 w-56"
                  >
                    <motion.div
                      {...float(0.9, 5)}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20">
                        <IconComponent icon={rightSecOneIcon} className="h-5 w-5 text-amber-300" />
                      </div>
                      <div>
                        <p className="font-bengali text-sm font-bold text-white">
                          {rightSecOneTitle}
                        </p>
                        <p className="font-bengali text-xs text-slate-400">
                          {rightSecOneSubTitle}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Card Three - Bottom Right Mini Card */}
                {showCardThree && (
                  <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: 0.65 }}
                    className="absolute -right-2 bottom-8 w-60"
                  >
                    <motion.div
                      {...float(1.7, 5.5)}
                      className="rounded-2xl border border-white/10 bg-white/6 p-4 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20">

                          <IconComponent icon={rightSecThreeIcon || 'CardThreeIcon'} className="h-5 w-5 text-emerald-300" />

                        </div>
                        <div>
                          <p className="font-bengali text-sm font-bold text-white">
                            {rightSecThreeTitle}
                          </p>
                          <p className="font-bengali text-xs text-slate-400">
                            {rightSecThreeSubTitle}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center">
                        <div className="flex -space-x-2">
                          {[
                            "bg-emerald-400",
                            "bg-amber-300",
                            "bg-cyan-400",
                            "bg-violet-400",
                          ].map((c, i) => (
                            <span
                              key={i}
                              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 ${c} text-[10px] font-bold text-slate-900`}
                            />
                          ))}
                        </div>
                        <span className="font-bengali ml-3 text-xs text-slate-400">
                          {rightSecThreeDescription}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* small glowing accents */}
                <div className="absolute right-10 top-16 h-2.5 w-2.5 rounded-full bg-amber-300/80 blur-[1px]" />
                <div className="absolute left-14 bottom-4 h-2 w-2 rounded-full bg-emerald-400/80 blur-[1px]" />
              </div>
            )
          }
        </div>
      </div>

      {/* ---------- bottom marquee ticker ---------- */}
      {tickerItems?.length > 0 ? (
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-slate-950/60 py-3.5 backdrop-blur-sm">
          <style>{`
          @keyframes hero-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
          <div className="flex w-max animate-[hero-marquee_28s_linear_infinite] hover:paused">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {tickerItems.map((item, i) => (
                  <React.Fragment key={`${dup}-${i}`}>
                    <span className="font-bengali whitespace-nowrap px-6 text-sm font-medium text-slate-400">
                      {item}
                    </span>
                    <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-linear-to-br from-emerald-400 to-amber-300" />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-5 w-5 animate-bounce text-slate-500" />
      </motion.div>
    </section>
  );
}
