// @ts-nocheck
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  BookOpen,
  Users,
  HeartHandshake,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import * as LucideIcons from "lucide-react";

/* ============================================================
   Aurora Home Hero — Dynamic Content Version
   দুই কলাম layout: বামে content, ডানে floating glass cards
   ============================================================ */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

// উপরে-নিচে ভাসতে থাকা animation
const float = (delay = 0, duration = 5) => ({
  animate: { y: [0, -12, 0] },
  transition: {
    duration,
    delay,
    repeat: Infinity,
    ease: "easeInOut",
  },
});

// Icon Renderer - dynamically gets icon from LucideIcons
const IconRenderer = ({ iconName, size, color, className }) => {
  if (!iconName) return null;
  
  // Get icon from LucideIcons by name
  const IconComponent = LucideIcons[iconName];
  
  if (!IconComponent) {
    // Fallback to Star icon if icon not found
    const FallbackIcon = LucideIcons.Star;
    return <FallbackIcon size={size} color={color} className={className} />;
  }
  
  return <IconComponent size={size} color={color} className={className} />;
};

export default function AuroraHero({ content = {}, settings = {}, styles = {} }) {
  console.log("🚀 ~ AuroraHero ~ content:", { content, settings, styles });

  // Destructure content with fallbacks
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
    rightSecOneIcon = "MapPin",
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

  // Format stats from content or use default
  const stats =
    bottomStats?.length > 0 
      ? bottomStats.map((stat) => ({
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
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#060b18]">
      {/* ---------- background layers ---------- */}
      <div className="absolute left-1/4 top-0 h-[28rem] w-[28rem] -translate-x-1/2 animate-pulse rounded-full bg-emerald-500/25 blur-[110px] [animation-duration:5s]" />
      <div className="absolute right-0 top-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-400/15 blur-[110px] [animation-duration:7s]" />
      <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 animate-pulse rounded-full bg-violet-500/10 blur-[110px] [animation-duration:9s]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          {/* ================= LEFT: content ================= */}
          <div>
            {/* slogan badge */}
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
                className="font-bengali group rounded-full bg-white px-8 py-6 text-base font-bold text-slate-900 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-400/25"
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
                className="font-bengali rounded-full border-white/20 bg-transparent px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                <Link to={secondaryButtonLink}>{secondaryButtonTitle}</Link>
              </Button>
            </motion.div>

            {/* stats */}
            {stats?.length > 0 && (
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-8"
              >
                {stats.map((item, i) => (
                  <div key={i}>
                    <p className="font-bengali bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent">
                      {item.value}
                    </p>
                    <p className="font-bengali mt-1 text-sm text-slate-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* ================= RIGHT: floating cards ================= */}
           {
            (rightSectionImage && useImageInRightSection) ? (
              <img src={rightSectionImage} />
            ) : (
    <div className="relative hidden min-h-[480px] lg:block">
            {/* decorative rotating ring */}
            <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-400/20 [animation:spin_40s_linear_infinite]" />
            <div className="absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

            {/* Card Two - Main Event Card (Middle) */}
            {showCardTow && (
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  {...float(0, 6)}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/30 to-cyan-400/20">
                    <IconRenderer 
                      iconName={rightSecTwoIcon} 
                      size={20} 
                      color="#6EE7B7" 
                    />
                  </div>
                  <p className="font-bengali text-lg font-semibold leading-relaxed text-white">
                    {rightSecTowTitle}
                  </p>
                  
                  {/* Items list */}
                  {rightSecTowItems?.length > 0 && (
                    <div className="font-bengali mt-3 space-y-2 text-sm text-slate-400">
                      {rightSecTowItems.map((item, idx) => (
                        <p key={idx} className="flex items-center gap-2">
                          <IconRenderer 
                            iconName={item.icon || "CircleCheck"} 
                            size={14} 
                            color="#6EE7B7" 
                          />
                          {item.title}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-5 h-px bg-linear-to-r from-emerald-500/40 via-white/10 to-transparent" />
                  <p className="font-bengali mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <IconRenderer 
                      iconName={rightSecTowFooterIcon} 
                      size={14} 
                      color="#FCD34D" 
                    />
                    {rightSecTowFooterTitle}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Card One - Top Right Mini Card */}
            {showCardOne && (
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -right-2 top-6 w-52"
              >
                <motion.div
                  {...float(0.8, 5)}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20">
                    <IconRenderer 
                      iconName={rightSecOneIcon} 
                      size={20} 
                      color="#67E8F9" 
                    />
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

            {/* Card Three - Bottom Left Mini Card */}
            {showCardThree && (
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="absolute -left-4 bottom-10 w-56"
              >
                <motion.div
                  {...float(1.6, 5.5)}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/20">
                    <IconRenderer 
                      iconName={rightSecThreeIcon} 
                      size={20} 
                      color="#C4B5FD" 
                    />
                  </div>
                  <div>
                    <p className="font-bengali text-sm font-bold text-white">
                      {rightSecThreeTitle}
                    </p>
                    <p className="font-bengali text-xs text-slate-400">
                      {rightSecThreeSubTitle}
                    </p>
                    <p className="font-bengali text-xs text-slate-500 mt-1">
                      {rightSecThreeDescription}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* small glowing orb accents */}
            <div className="absolute right-16 bottom-2 h-3 w-3 rounded-full bg-emerald-400/80 blur-[1px]" />
            <div className="absolute left-10 top-14 h-2 w-2 rounded-full bg-cyan-300/80 blur-[1px]" />
          </div>
            )
          }
      
        </div>
      </div>

      {/* bottom marquee ticker */}
      {tickerItems?.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-slate-950/60 py-3.5 backdrop-blur-sm">
          <style>
            {`
              @keyframes hero-marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
              .hover\\:paused:hover {
                animation-play-state: paused !important;
              }
            `}
          </style>
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
      )}

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