import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, BookOpen, Heart, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
    { icon: Users, value: '৫০,০০০+', label: 'সদস্য', color: 'from-primary to-emerald-400' },
    { icon: BookOpen, value: '১,২০০+', label: 'প্রোগ্রাম', color: 'from-amber-400 to-orange-500' },
    { icon: Heart, value: '৩০০+', label: 'সেবা প্রকল্প', color: 'from-rose-400 to-pink-500' },
    { icon: Mic, value: '৮০০+', label: 'বয়ান', color: 'from-violet-400 to-purple-500' },
];

export default function HeroSection({ ...rest }) {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-bengali">দাওয়াহ ও তাবলীগের সেবায়</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight font-bengali">
                            <span className="text-foreground">গায়েবী মুসলিম</span>
                            <br />
                            <span className="text-gradient">পাহাড়ত্ব বন্ধু কত</span>
                            <br />
                            <span className="text-foreground">করতে হবে</span>
                        </h1>

                        <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed font-bengali">
                            ইসলামিক দাওয়াহ ও শিক্ষামূলক কার্যক্রমের সবচেয়ে বড় ডিজিটাল প্ল্যাটফর্ম। আমাদের সাথে যুক্ত হন এবং দ্বীনের খেদমতে অংশ নিন।
                        </p>

                        <div className="flex flex-wrap gap-3 mt-8">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-7 py-6 text-base shadow-xl shadow-primary/20 font-bengali group">
                                শুরু করুন
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" className="rounded-full px-7 py-6 text-base border-2 group font-bengali">
                                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                ভিডিও দেখুন
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right - Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className={`group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${i === 0 ? 'lg:translate-y-8' : ''} ${i === 3 ? 'lg:-translate-y-8' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-foreground font-bengali">{stat.value}</h3>
                                <p className="text-sm text-muted-foreground mt-1 font-bengali">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}