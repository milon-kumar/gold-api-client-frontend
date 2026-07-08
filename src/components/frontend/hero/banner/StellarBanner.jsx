import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Users, BookOpen, Heart, Mic, Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
    { icon: Users, value: '৫০,০০০+', label: 'সদস্য', color: 'from-primary to-emerald-400' },
    { icon: BookOpen, value: '১,২০০+', label: 'প্রোগ্রাম', color: 'from-amber-400 to-orange-500' },
    { icon: Heart, value: '৩০০+', label: 'সেবা প্রকল্প', color: 'from-rose-400 to-pink-500' },
    { icon: Mic, value: '৮০০+', label: 'বয়ান', color: 'from-violet-400 to-purple-500' },
];

// Animated particle component
const FloatingParticle = ({ delay, duration, x, y, size, color }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            x: [x, x + (Math.random() - 0.5) * 100],
            y: [y, y + (Math.random() - 0.5) * 100]
        }}
        transition={{ 
            duration: duration,
            delay: delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
        }}
        className="absolute rounded-full"
        style={{
            width: size,
            height: size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: 'blur(2px)'
        }}
    />
);

// Animated shape component
const AnimatedShape = ({ type, delay, duration, x, y, color, size }) => {
    const shapes = {
        circle: (size) => (
            <div 
                className="rounded-full border-2"
                style={{ width: size, height: size, borderColor: color }}
            />
        ),
        square: (size) => (
            <div 
                className="border-2 rotate-45"
                style={{ width: size, height: size, borderColor: color }}
            />
        ),
        triangle: (size) => (
            <div 
                className="triangle"
                style={{ 
                    width: 0,
                    height: 0,
                    borderLeft: `${size/2}px solid transparent`,
                    borderRight: `${size/2}px solid transparent`,
                    borderBottom: `${size}px solid ${color}`,
                    opacity: 0.3
                }}
            />
        ),
        ring: (size) => (
            <div 
                className="rounded-full border"
                style={{ width: size, height: size, borderColor: color, borderWidth: '2px' }}
            />
        )
    };

    return (
        <motion.div
            className="absolute"
            style={{ x, y }}
            animate={{
                x: [x, x + 20, x - 20, x],
                y: [y, y - 20, y + 20, y],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 0.8, 1]
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }}
        >
            {shapes[type](size)}
        </motion.div>
    );
};

export default function HeroSection({ ...rest }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <section 
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            style={{
                background: 'radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15), transparent), radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.1), transparent)'
            }}
        >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating particles */}
                {[...Array(30)].map((_, i) => (
                    <FloatingParticle
                        key={`particle-${i}`}
                        delay={i * 0.5}
                        duration={5 + (i % 5)}
                        x={`${Math.random() * 100}%`}
                        y={`${Math.random() * 100}%`}
                        size={2 + (i % 8)}
                        color={i % 3 === 0 ? 'rgba(139, 92, 246, 0.6)' : i % 3 === 1 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(236, 72, 153, 0.6)'}
                    />
                ))}

                {/* Animated geometric shapes */}
                <AnimatedShape 
                    type="circle" 
                    delay={0} 
                    duration={8} 
                    x="10%" 
                    y="20%" 
                    color="rgba(139, 92, 246, 0.3)"
                    size={80}
                />
                <AnimatedShape 
                    type="square" 
                    delay={1} 
                    duration={12} 
                    x="85%" 
                    y="15%" 
                    color="rgba(6, 182, 212, 0.3)"
                    size={60}
                />
                <AnimatedShape 
                    type="ring" 
                    delay={2} 
                    duration={10} 
                    x="75%" 
                    y="70%" 
                    color="rgba(236, 72, 153, 0.3)"
                    size={100}
                />
                <AnimatedShape 
                    type="triangle" 
                    delay={1.5} 
                    duration={9} 
                    x="15%" 
                    y="80%" 
                    color="rgba(245, 158, 11, 0.3)"
                    size={50}
                />
                <AnimatedShape 
                    type="circle" 
                    delay={0.5} 
                    duration={15} 
                    x="50%" 
                    y="85%" 
                    color="rgba(139, 92, 246, 0.2)"
                    size={120}
                />

                {/* Glowing orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />

                {/* Grid pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <motion.div 
                style={{ y, opacity }}
                className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full"
            >
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30 text-white text-sm font-medium mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="font-bengali animate-pulse">দাওয়াহ ও তাবলীগের সেবায়</span>
                            <Star className="w-3 h-3 text-cyan-400" />
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight font-bengali">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                                গায়েবী মুসলিম
                            </span>
                            <br />
                            <span className="text-white">পাহাড়ত্ব বন্ধু কত</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                করতে হবে
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-gray-300 max-w-lg leading-relaxed font-bengali backdrop-blur-sm">
                            ইসলামিক দাওয়াহ ও শিক্ষামূলক কার্যক্রমের সবচেয়ে বড় ডিজিটাল প্ল্যাটফর্ম। 
                            আমাদের সাথে যুক্ত হন এবং দ্বীনের খেদমতে অংশ নিন।
                        </p>

                        <div className="flex flex-wrap gap-3 mt-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-full px-8 py-6 text-base shadow-xl shadow-purple-500/30 font-bengali group">
                                    শুরু করুন
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="outline" className="rounded-full px-8 py-6 text-base border-2 border-purple-500/50 text-white hover:bg-purple-500/20 group font-bengali">
                                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    ভিডিও দেখুন
                                </Button>
                            </motion.div>
                        </div>

                        {/* Animated decorative line */}
                        <motion.div 
                            className="mt-12 flex gap-2"
                            initial={{ width: 0 }}
                            animate={{ width: 'auto' }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                                    style={{ width: 30 + i * 20 }}
                                    animate={{
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.3,
                                        repeat: Infinity
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right - Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-2 gap-5"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                whileHover={{ 
                                    y: -10,
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                className={`group relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 ${i === 0 ? 'lg:translate-y-8' : ''} ${i === 3 ? 'lg:-translate-y-8' : ''}`}
                            >
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
                                
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg relative`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                    <motion.div
                                        className="absolute inset-0 rounded-xl bg-white"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileHover={{ scale: 1.5, opacity: 0.2 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                
                                <h3 className="text-2xl sm:text-3xl font-black text-white font-bengali">{stat.value}</h3>
                                <p className="text-sm text-gray-400 mt-1 font-bengali">{stat.label}</p>
                                
                                {/* Decorative corner accent */}
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{
                    y: [0, 10, 0]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
                    <motion.div
                        className="w-1 h-2 rounded-full bg-white/50 mt-2"
                        animate={{
                            y: [0, 12, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                </div>
            </motion.div>
        </section>
    );
}