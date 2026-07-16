import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Star,
  Sparkles,
  Shield,
  Zap,
  Rocket,
  Globe,
  Users,
  Award,
  TrendingUp,
  Clock,
  Coffee,
  Briefcase,
  Code,
  Heart,
  BookOpen,
  Mic,
} from "lucide-react";

// Icon mapping for dynamic icons
const iconMap = {
  Users: Users,
  Award: Award,
  Globe: Globe,
  TrendingUp: TrendingUp,
  Star: Star,
  Rocket: Rocket,
  Clock: Clock,
  Coffee: Coffee,
  Briefcase: Briefcase,
  Code: Code,
  Sparkles: Sparkles,
  Shield: Shield,
  Zap: Zap,
  Heart: Heart,
  BookOpen: BookOpen,
  Mic: Mic,
};

// Floating Star Particles
const StarParticle = ({ delay, duration, x, y, size, color, rotation }) => (
  <motion.div
    className="absolute"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      color: color,
    }}
    initial={{ opacity: 0, rotate: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      rotate: [0, rotation || 360],
      y: [0, -80, -160],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  >
    <Star size={size} fill="currentColor" stroke="none" />
  </motion.div>
);

// Floating Orb
const Orb = ({ color, size, x, y, delay, duration }) => (
  <motion.div
    className="absolute rounded-full blur-3xl"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}40, ${color}10)`,
      left: x,
      top: y,
    }}
    animate={{
      scale: [1, 1.3, 1],
      x: [0, 30, 0],
      y: [0, -20, 0],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Constellation lines
const Constellation = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
    <motion.line
      x1="10%"
      y1="20%"
      x2="30%"
      y2="40%"
      stroke="white"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    />
    <motion.line
      x1="30%"
      y1="40%"
      x2="50%"
      y2="25%"
      stroke="white"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 1 }}
    />
    <motion.line
      x1="50%"
      y1="25%"
      x2="70%"
      y2="45%"
      stroke="white"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 1.5 }}
    />
    <motion.line
      x1="70%"
      y1="45%"
      x2="90%"
      y2="30%"
      stroke="white"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 2 }}
    />
    <motion.circle cx="10%" cy="20%" r="3" fill="white" />
    <motion.circle cx="30%" cy="40%" r="3" fill="white" />
    <motion.circle cx="50%" cy="25%" r="3" fill="white" />
    <motion.circle cx="70%" cy="45%" r="3" fill="white" />
    <motion.circle cx="90%" cy="30%" r="3" fill="white" />
  </svg>
);

// Glowing ring
const GlowingRing = ({ delay = 0 }) => (
  <motion.div
    className="absolute rounded-full border border-white/10"
    style={{
      width: "500px",
      height: "500px",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      opacity: [0.1, 0.3, 0.1],
    }}
    transition={{
      duration: 20,
      delay: delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

const IconRenderer = ({ icon: Icon, size, color, className }) => {
  if (!Icon) return null;
  const IconComponent = typeof Icon === 'string' ? iconMap[Icon] || Star : Icon;
  return <IconComponent size={size} color={color} className={className} />;
};

export default function StellarBanner({ 
  content = {},
  className = "",
}) {
    console.log("content - ",content)

  const {
    slogan = "Welcome",
    title = "Build Your Future",
    subtitle = "Simple, modern, and powerful solutions.",
    primaryButtonTitle = "Get Started",
    primaryButtonLink = "/about",
    secondaryButtonTitle = "Learn More",
    secondaryButtonLink = "/contact",
    items = [],
    theme = "cosmic",
  } = content;

  // Process title for animated display
  const words = title?.trim().split(/\s+/) || [];
  const firstWord = words[0] || "";
  const secondPart = words.slice(1, 3).join(" ");
  const restWords = words.slice(3).join(" ");

  // Theme colors
  const themes = {
    cosmic: {
      bg: "from-gray-900 via-indigo-950 to-purple-950",
      accent: "from-purple-500 to-pink-500",
      primary: "from-blue-500 to-cyan-400",
      glow: "from-blue-500/30 to-purple-500/30",
      particles: ["#818CF8", "#C084FC", "#F472B6", "#34D399", "#60A5FA"],
      button: "from-purple-500 to-pink-500",
    },
    nebula: {
      bg: "from-slate-900 via-blue-950 to-indigo-950",
      accent: "from-indigo-500 to-purple-500",
      primary: "from-cyan-400 to-blue-500",
      glow: "from-cyan-500/30 to-indigo-500/30",
      particles: ["#22D3EE", "#818CF8", "#C084FC", "#F472B6", "#34D399"],
      button: "from-cyan-500 to-blue-500",
    },
    galaxy: {
      bg: "from-black via-purple-950 to-pink-950",
      accent: "from-pink-500 to-rose-500",
      primary: "from-purple-400 to-pink-400",
      glow: "from-purple-500/30 to-pink-500/30",
      particles: ["#D946EF", "#F472B6", "#60A5FA", "#A78BFA", "#34D399"],
      button: "from-pink-500 to-rose-500",
    },
  };

  const currentTheme = themes[theme] || themes.cosmic;

  // Stats data from items or default
  const defaultItems = [
    { _id: 1, count: 50000, title: "Users", icon: "Users" },
    { _id: 2, count: 1200, title: "Programs", icon: "BookOpen" },
    { _id: 3, count: 300, title: "Projects", icon: "Heart" },
    { _id: 4, count: 800, title: "Speeches", icon: "Mic" },
  ];

  const statsData = (items?.length > 0 ? items : defaultItems).map((item, index) => ({
    id: item._id || index,
    total: item.count || 0,
    title: item.title || "Stat",
    icon: iconMap[item.icon] || Star,
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
  }));

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br ${currentTheme.bg} ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Primary Orbs */}
        <Orb 
          color="#818CF8" 
          size="600px" 
          x="-10%" 
          y="-20%" 
          delay={0} 
          duration={10}
        />
        <Orb 
          color="#C084FC" 
          size="500px" 
          x="70%" 
          y="60%" 
          delay={2} 
          duration={12}
        />
        <Orb 
          color="#F472B6" 
          size="400px" 
          x="50%" 
          y="-10%" 
          delay={4} 
          duration={8}
        />

        {/* Glowing Rings */}
        <GlowingRing delay={0} />
        <GlowingRing delay={5} />
        <GlowingRing delay={10} />

        {/* Constellation */}
        <Constellation />

        {/* Star Particles */}
        {[...Array(30)].map((_, i) => (
          <StarParticle
            key={i}
            delay={i * 0.3}
            duration={4 + Math.random() * 3}
            size={4 + Math.random() * 8}
            x={`${Math.random() * 100}%`}
            y={`${Math.random() * 100}%`}
            color={currentTheme.particles[Math.floor(Math.random() * currentTheme.particles.length)]}
            rotation={180 + Math.random() * 180}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full z-10">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium tracking-wider">
                  {slogan}
                </span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">
                {firstWord}
              </span>
              <br />
              <span className={`bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent`}>
                {secondPart}
              </span>
              <br />
              {restWords && (
                <span className="text-white/80">
                  {restWords}
                </span>
              )}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="mt-6 text-lg text-white/60 max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Buttons */}
            {(primaryButtonTitle || secondaryButtonTitle) && (
              <motion.div
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {primaryButtonTitle && primaryButtonLink && (
                  <motion.a
                    href={primaryButtonLink}
                    className="group relative inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium shadow-xl shadow-purple-500/30 transition-all duration-300 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      {primaryButtonTitle}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </motion.a>
                )}
                {secondaryButtonTitle && secondaryButtonLink && (
                  <motion.a
                    href={secondaryButtonLink}
                    className="group inline-flex items-center px-8 py-3 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-white font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {secondaryButtonTitle}
                  </motion.a>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
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
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  {/* Card */}
                  <motion.div
                    className={`relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 ${
                      i === 0 ? "lg:translate-y-8" : ""
                    } ${i === 3 ? "lg:-translate-y-8" : ""}`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/20`}
                    >
                      <IconRenderer icon={stat.icon} size={24} color="white" />
                    </div>
                    
                    {/* Count */}
                    <motion.h3
                      className="text-3xl sm:text-4xl font-black text-white"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                    >
                      {stat.total.toLocaleString()}+
                    </motion.h3>
                    
                    {/* Title */}
                    <p className="text-sm text-white/60 mt-1">
                      {stat.title}
                    </p>
                    
                    {/* Hover Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Floating Trust Badge */}
            <motion.div
              className="absolute -bottom-10 -left-10 p-4 bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-white/80">Secure & Trusted</span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
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
        <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center">
          <motion.div
            className="w-1 h-2 bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full mt-2"
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}