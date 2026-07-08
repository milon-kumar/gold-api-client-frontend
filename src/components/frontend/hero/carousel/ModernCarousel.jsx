import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Users, BookOpen, Heart, Mic, Sparkles, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
    {
        id: 1,
        badge: 'দাওয়াহ ও তাবলীগের সেবায়',
        title: 'ইসলামের সুমহান',
        titleHighlight: 'বাণী ছড়িয়ে দিন',
        titleEnd: 'সারা বিশ্বে',
        desc: 'ইসলামিক দাওয়াহ ও শিক্ষামূলক কার্যক্রমের সবচেয়ে বড় ডিজিটাল প্ল্যাটফর্ম। আমাদের সাথে যুক্ত হন এবং দ্বীনের খেদমতে অংশ নিন।',
        image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1200&q=80',
        gradient: 'from-emerald-600/40 via-teal-600/20 to-transparent',
    },
    {
        id: 2,
        badge: 'যুব উন্নয়ন কার্যক্রম',
        title: 'তরুণ প্রজন্মকে',
        titleHighlight: 'দ্বীনের পথে',
        titleEnd: 'আহ্বান করুন',
        desc: 'যুবকদের নৈতিক ও আধ্যাত্মিক উন্নয়নে আমরা প্রতিশ্রুতিবদ্ধ। আজই আমাদের যুব প্রোগ্রামে অংশ নিন।',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
        gradient: 'from-violet-600/40 via-purple-600/20 to-transparent',
    },
    {
        id: 3,
        badge: 'সামাজিক সেবা প্রকল্প',
        title: 'মানবতার সেবায়',
        titleHighlight: 'আমরা সবসময়',
        titleEnd: 'আপনার পাশে',
        desc: 'বন্যা ত্রাণ, স্বাস্থ্যসেবা এবং দরিদ্রদের সহায়তায় আমরা কাজ করে যাচ্ছি। আপনিও অংশীদার হন।',
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80',
        gradient: 'from-rose-600/40 via-pink-600/20 to-transparent',
    },
];

const stats = [
    { icon: Users, value: '৫০,০০০+', label: 'সদস্য' },
    { icon: BookOpen, value: '১,২০০+', label: 'প্রোগ্রাম' },
    { icon: Heart, value: '৩০০+', label: 'সেবা প্রকল্প' },
    { icon: Mic, value: '৮০০+', label: 'বয়ান' },
];

// Particle component
const ParticleField = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 100; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 3 + 1,
                    duration: Math.random() * 20 + 10,
                    delay: Math.random() * 10,
                });
            }
            setParticles(newParticles);
        };
        generateParticles();
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white/20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

// Floating shapes component
const FloatingShapes = () => {
    const shapes = [
        { type: 'circle', size: 300, left: -150, top: -150, delay: 0 },
        { type: 'square', size: 200, right: -100, bottom: -100, delay: 2 },
        { type: 'triangle', size: 250, left: '70%', top: '60%', delay: 4 },
        { type: 'circle', size: 150, right: '10%', top: '20%', delay: 1 },
        { type: 'square', size: 120, left: '20%', bottom: '10%', delay: 3 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes.map((shape, idx) => (
                <motion.div
                    key={idx}
                    className="absolute"
                    style={{
                        left: shape.left,
                        right: shape.right,
                        top: shape.top,
                        bottom: shape.bottom,
                        width: shape.size,
                        height: shape.size,
                    }}
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        delay: shape.delay,
                        ease: "linear",
                    }}
                >
                    {shape.type === 'circle' && (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-3xl border border-white/10" />
                    )}
                    {shape.type === 'square' && (
                        <div className="w-full h-full rotate-45 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-3xl border border-white/10" />
                    )}
                    {shape.type === 'triangle' && (
                        <div className="w-full h-full clip-triangle bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-3xl border border-white/10" />
                    )}
                </motion.div>
            ))}
        </div>
    );
};

// Animated grid background
const AnimatedGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <motion.path
                    d="M0,100 Q30,80 60,100 T120,100 T180,100 T240,100"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.3"
                    animate={{
                        d: [
                            "M0,100 Q30,80 60,100 T120,100 T180,100 T240,100",
                            "M0,100 Q30,120 60,100 T120,100 T180,100 T240,100",
                            "M0,100 Q30,80 60,100 T120,100 T180,100 T240,100",
                        ],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </svg>
        </div>
    );
};

// Glowing orb component
const GlowingOrb = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrent(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const goTo = (idx) => {
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
    };

    const prev = () => {
        setDirection(-1);
        setCurrent(prev => (prev - 1 + slides.length) % slides.length);
    };

    const next = () => {
        setDirection(1);
        setCurrent(prev => (prev + 1) % slides.length);
    };

    const slide = slides[current];

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-black">
            {/* Background image with parallax effect */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} via-black/70 to-black/90`} />
                </motion.div>
            </AnimatePresence>

            {/* Premium overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
            
            {/* Particle and shape effects */}
            <ParticleField />
            <FloatingShapes />
            <AnimatedGrid />
            <GlowingOrb />

            {/* Content */}
            <div className="relative flex-1 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-3xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={slide.id}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                >
                                    {/* Premium badge */}
                                    <motion.div 
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 mb-8 shadow-2xl"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                        <span className="text-white text-sm font-medium tracking-wide">{slide.badge}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/40" />
                                        <Globe className="w-3 h-3 text-white/60" />
                                    </motion.div>

                                    {/* Main title with premium typography */}
                                    <motion.h1 
                                        className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] mb-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="text-white">{slide.title}<br /></span>
                                        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                            {slide.titleHighlight}
                                        </span>
                                        <br />
                                        <span className="text-white">{slide.titleEnd}</span>
                                    </motion.h1>

                                    {/* Description */}
                                    <motion.p 
                                        className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed font-light"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {slide.desc}
                                    </motion.p>

                                    {/* CTA Buttons */}
                                    <motion.div 
                                        className="flex flex-wrap gap-4 mt-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-8 py-6 text-base shadow-2xl shadow-emerald-500/25 group font-semibold">
                                            শুরু করুন
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base backdrop-blur-sm group font-semibold">
                                            <Play className="w-4 h-4 mr-2 fill-white group-hover:scale-110 transition-transform" />
                                            ভিডিও দেখুন
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right side - Premium stats card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <Shield className="w-6 h-6 text-emerald-400" />
                                    <h3 className="text-white font-bold text-lg">আমাদের অর্জন</h3>
                                </div>
                                <div className="space-y-6">
                                    {stats.map((stat, idx) => (
                                        <motion.div
                                            key={stat.label}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                                                    <stat.icon className="w-6 h-6 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                                    <p className="text-sm text-white/60">{stat.label}</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: idx * 0.2 }}
                                            >
                                                <ArrowRight className="w-5 h-5 text-white/40" />
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Slide controls - Premium design */}
                    <div className="flex items-center gap-4 mt-12">
                        <button 
                            onClick={prev} 
                            className="group w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="flex gap-3">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`rounded-full transition-all duration-500 ${i === current 
                                        ? 'w-12 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400' 
                                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>
                        <button 
                            onClick={next} 
                            className="group w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats bar for mobile */}
            <div className="relative z-10 lg:hidden bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((s, idx) => (
                            <motion.div 
                                key={s.label} 
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                                    <s.icon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-white leading-none">{s.value}</p>
                                    <p className="text-xs text-white/60 font-bengali mt-0.5">{s.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add custom CSS for triangle shape */}
            <style jsx>{`
                .clip-triangle {
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                }
            `}</style>
        </section>
    );
}