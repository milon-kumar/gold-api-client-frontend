import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, BookOpen, Heart, Mic, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { asset, getWords } from '@/lib/helper';
import IconRenderer from '@/components/partials/IconRenderer';
const stats = [
    { icon: Users, value: '৫০,০০০+', label: 'সদস্য', color: 'from-blue-500 to-cyan-400', gradient: 'from-blue-500/20 to-cyan-500/20' },
    { icon: BookOpen, value: '১,২০০+', label: 'প্রোগ্রাম', color: 'from-amber-500 to-orange-500', gradient: 'from-amber-500/20 to-orange-500/20' },
    { icon: Heart, value: '৩০০+', label: 'সেবা প্রকল্প', color: 'from-rose-500 to-pink-500', gradient: 'from-rose-500/20 to-pink-500/20' },
    { icon: Mic, value: '৮০০+', label: 'বয়ান', color: 'from-violet-500 to-purple-500', gradient: 'from-violet-500/20 to-purple-500/20' },
];

const FloatingParticle = ({ delay, duration, x, y, size, color }) => (
    <motion.div
        className="absolute rounded-full"
        style={{
            width: size,
            height: size,
            backgroundColor: color,
            left: x,
            top: y,
            filter: 'blur(8px)',
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

export default function HeroSection(props) {
    const { statistics, webNotices, webSettings, staffs } = props

    const words =
        webSettings?.web_title
            ?.trim()
            .split(/\s+/) || [];

    const firstWord = words[0] || "";
    const secondPart = words.slice(1, 3).join(" ");
    const restWords = words.slice(3).join(" ");

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-3xl"
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
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-3xl"
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-400/10 to-orange-400/10 blur-3xl"
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
                    color={['#3B82F6', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 5)]}
                />
            ))}

            {/* Animated Shapes */}
            <Shape className="top-20 left-10 w-32 h-32" delay={0.2}>
                <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl rotate-12 backdrop-blur-sm border border-white/20" />
            </Shape>

            <Shape className="bottom-32 right-20 w-40 h-40" delay={0.4}>
                <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full backdrop-blur-sm border border-white/20" />
            </Shape>

            <Shape className="top-1/2 right-10 w-24 h-24" delay={0.6}>
                <div className="w-full h-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl -rotate-6 backdrop-blur-sm border border-white/20" />
            </Shape>

            <Shape className="bottom-20 left-20 w-28 h-28" delay={0.8}>
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                    <polygon points="50,15 85,40 75,85 25,85 15,40" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                </svg>
            </Shape>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
            }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-medium font-bengali">দাওয়াহ ও তাবলীগের সেবায়</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </motion.div>

                        <motion.h1
                            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight font-bengali"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >

                            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                {firstWord}
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                                {secondPart}
                            </span>
                            <br />
                            {
                                restWords && (
                                    <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        {restWords}
                                    </span>
                                )
                            }
                        </motion.h1>

                        {
                            webSettings?.about_us_desc && (
                                <motion.div
                                    className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed font-bengali"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    dangerouslySetInnerHTML={{
                                        __html: getWords(webSettings?.about_us_desc)
                                    }}
                                />
                            )
                        }

                        <motion.div
                            className="flex flex-wrap gap-4 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-full px-8 py-6 text-base shadow-xl shadow-primary/30 font-bengali group relative overflow-hidden">
                                <span className="relative z-10 flex items-center">
                                    যোগাযোগ করুন
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </Button>
                            <Button variant="outline" className="rounded-full px-8 py-6 text-base border-2 group hover:border-primary/50 hover:bg-primary/5 font-bengali">
                                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                ভিডিও দেখুন
                            </Button>
                        </motion.div>

                        {/* Trust Badges */}
                        {
                            staffs && staffs?.length > 0 && (
                                <motion.div
                                    className="flex items-center gap-6 mt-10 pt-6 border-t border-border/50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <div className="flex -space-x-2">
                                        {staffs?.slice(0, 6).map((staff) => (
                                            <div key={staff.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                                                {
                                                    staff?.photo ? (
                                                        <img src={asset(staff?.photo?.replace('uploads', ''))} alt={staff.name} className="w-full h-full rounded-full" />
                                                    ) :
                                                        (
                                                            staff?.name?.charAt(0).toUpperCase()
                                                        )
                                                }
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{staffs?.length - 1}+ সক্রিয় সদস্য</p>
                                        <p className="text-xs text-muted-foreground">বিশ্বব্যাপী আমাদের নেটওয়ার্ক</p>
                                    </div>
                                </motion.div>
                            )}
                    </motion.div>

                    {/* Right - Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        {/* Decorative rotating ring */}
                        <motion.div
                            className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-2 border-dashed border-primary/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />

                        <div className="grid grid-cols-2 gap-5 relative z-10">
                            {statistics.map((stat, i) => {
                                const randomIndex = Math.floor(Math.random() * 4); // 0 to 3
                                const gradient = stats[randomIndex].gradient;
                                const color = stats[randomIndex].color;

                                return (
                                    <motion.div
                                        key={stat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="group relative"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                        <div className={`relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl ${i === 0 ? 'lg:translate-y-8' : ''} ${i === 3 ? 'lg:-translate-y-8' : ''}`}>
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <IconRenderer icon={stat?.icon} size={24} color="white" />
                                            </div>
                                            <motion.h3
                                                className="text-3xl sm:text-4xl font-black text-foreground font-bengali"
                                                initial={{ scale: 0.5 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                                            >
                                                {stat?.total - 1}+
                                            </motion.h3>
                                            <p className="text-sm text-muted-foreground mt-1 font-bengali">{stat?.title}</p>

                                            {/* Animated underline */}
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Floating card decoration */}
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
                                <span className="text-sm font-medium font-bengali">১০০% বিশ্বস্ত</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
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