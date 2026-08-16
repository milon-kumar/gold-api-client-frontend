import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Users,
  BookOpen,
  Heart,
  Mic,
  Sparkles,
  Shield,
  Zap,
  HandIcon,
  Combine,
  Target,
  Award,
  Globe,
  TrendingUp
} from "lucide-react";

const FloatingParticle = ({ delay, duration, x, y, size, color }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      left: x,
      top: y,
      filter: "blur(8px)",
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0],
      y: [0, -100, -200],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const Shape = ({ children, className, delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8 }}
  >
    {children}
  </motion.div>
);

const IconRenderer = ({ icon: Icon, size, color }) => {
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
};

// Map string icon names to actual components
const iconMap = {
  Users: Users,
  Award: Award,
  Globe: Globe,
  TrendingUp: TrendingUp,
  BookOpen: BookOpen,
  Heart: Heart,
  Mic: Mic,
  Shield: Shield,
  Zap: Zap,
  Sparkles: Sparkles,
  Target: Target,
  HandIcon: HandIcon,
  Combine: Combine,
};

export default function DynamicBanner({ content = {}, settings = {}, styles = {} }) {
  const {
    slogan = "Welcome",
    title = "Build Your Future",
    subtitle = "Simple, modern, and powerful solutions.",
    primaryButtonTitle = "Get Started",
    primaryButtonLink = "/about",
    secondaryButtonTitle = "Learn More",
    secondaryButtonLink = "/contact",
    rightSectionImage = null,
    stats = [],
  } = content;

  const {
    showCardOne = true,
    showCardThree = true,
    showCardTow = true,
    useImageInRightSection = false
  } = settings || {};


  // Process title for animated display
  const words = title?.trim().split(/\s+/) || [];
  const firstWord = words[0] || "";
  const secondPart = words.slice(1, 3).join(" ");
  const restWords = words.slice(3).join(" ");

  const colors = ["#3B82F6", "#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B"];

  // Transform stats data - using 'stats' instead of 'items'
  const statsData = stats?.map((item, index) => ({
    id: item._id || index,
    total: parseInt(item.count) || 0,
    title: item.title || "Stat",
    color: [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-emerald-500 to-green-500",
      "from-orange-500 to-amber-500",
    ][index % 4],
    gradient: [
      "from-blue-500/20 to-cyan-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-emerald-500/20 to-green-500/20",
      "from-orange-500/20 to-amber-500/20",
    ][index % 4],
    icon: iconMap[item.Icon] || Combine, // Using 'Icon' property from your data
  })) || [];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-linear-to-r from-blue-400/30 to-cyan-400/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-linear-to-r from-purple-400/30 to-pink-400/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-linear-to-r from-amber-400/10 to-orange-400/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.5}
          duration={3 + Math.random() * 2}
          size={4 + Math.random() * 8}
          x={`${Math.random() * 100}%`}
          y={`${Math.random() * 100}%`}
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      ))}

      {/* Decorative Shapes */}
      <Shape className="top-20 left-10 w-32 h-32" delay={0.2}>
        <div className="w-full h-full bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl rotate-12 backdrop-blur-sm border border-white/20" />
      </Shape>

      <Shape className="bottom-32 right-20 w-40 h-40" delay={0.4}>
        <div className="w-full h-full bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full backdrop-blur-sm border border-white/20" />
      </Shape>

      <Shape className="top-1/2 right-10 w-24 h-24" delay={0.6}>
        <div className="w-full h-full bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-2xl -rotate-6 backdrop-blur-sm border border-white/20" />
      </Shape>

      <Shape className="bottom-20 left-20 w-28 h-28" delay={0.8}>
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
          <polygon
            points="50,15 85,40 75,85 25,85 15,40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
        </svg>
      </Shape>

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Slogan Badge */}
            {slogan && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">
                  {slogan}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {firstWord}
              </span>
              <br />
              <span className="bg-linear-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                {secondPart}
              </span>
              <br />
              {restWords && (
                <span className="bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {restWords}
                </span>
              )}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.div
                className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                dangerouslySetInnerHTML={{
                  __html: subtitle,
                }}
              />
            )}

            {/* Buttons - Fixed typo in variable names */}
            {(primaryButtonTitle || secondaryButtonTitle) && (
              <motion.div
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {primaryButtonTitle && primaryButtonLink && (
                  <a
                    href={primaryButtonLink}
                    className="group relative inline-flex items-center px-8 py-3 rounded-full bg-linear-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-white font-medium transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      {primaryButtonTitle}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </a>
                )}
                {secondaryButtonTitle && secondaryButtonLink && (
                  <a
                    href={secondaryButtonLink}
                    className="group inline-flex items-center px-8 py-3 rounded-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 font-medium"
                  >
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {secondaryButtonTitle}
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Stats Cards */}
          {
            (rightSectionImage && useImageInRightSection) ? (
              <img src={rightSectionImage} />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Animated Border Ring */}
                <motion.div
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-2 border-dashed border-primary/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

                <div className="grid grid-cols-2 gap-5 relative z-10">
                  {statsData.map((stat, i) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="group relative"
                    >
                      {/* Glow Effect */}
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />

                      {/* Card */}
                      <div
                        className={`relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl ${i === 0 ? "lg:translate-y-8" : ""
                          } ${i === 3 ? "lg:-translate-y-8" : ""}`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-14 h-14 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <IconRenderer icon={stat.icon} size={24} color="white" />
                        </div>

                        {/* Count */}
                        <motion.h3
                          className="text-3xl sm:text-4xl font-black text-foreground"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                        >
                          {stat.total}+
                        </motion.h3>

                        {/* Title */}
                        <p className="text-sm text-muted-foreground mt-1">
                          {stat.title}
                        </p>

                        {/* Hover Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating Trust Badge */}
                <motion.div
                  className="absolute -bottom-10 -left-10 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">100% Trusted</span>
                  </div>
                </motion.div>
              </motion.div>
            )
          }
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center">
          <div className="w-1 h-2 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}