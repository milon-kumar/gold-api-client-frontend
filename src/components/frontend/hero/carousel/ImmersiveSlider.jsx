import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { asset } from '@/lib/helper';

// const images = [
//     {
//         id: 1,
//         url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1600&q=80',
//         alt: 'Islamic architecture',
//     },
//     {
//         id: 2,
//         url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80',
//         alt: 'Youth gathering',
//     },
//     {
//         id: 3,
//         url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80',
//         alt: 'Community service',
//     },
//     {
//         id: 4,
//         url: 'https://images.unsplash.com/photo-1773311400657-29c0891cc045?q=80&w=1170',
//         alt: 'Mosque interior',
//     },
//     {
//         id: 5,
//         url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=1600&q=80',
//         alt: 'Islamic calligraphy',
//     },
// ];

export default function ImageCarousel(props) {
    const { sliders: images } = props

    console.log("images", images)

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrent(prev => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const goTo = (idx) => {
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prev = () => {
        setDirection(-1);
        setCurrent(prev => (prev - 1 + images.length) % images.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const next = () => {
        setDirection(1);
        setCurrent(prev => (prev + 1) % images.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const currentImage = images[current];

    return (
        <>
            {/* Main Carousel */}
            <div className={`relative overflow-hidden bg-black ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'}`}>
                {/* Images */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage.id}
                        initial={{
                            opacity: 0,
                            scale: direction === 1 ? 1.1 : 0.9,
                            x: direction === 1 ? 50 : -50
                        }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{
                            opacity: 0,
                            scale: direction === 1 ? 0.9 : 1.1,
                            x: direction === 1 ? -50 : 50
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            src={asset(currentImage?.slider_image)}
                            alt={currentImage?.slider_caption}
                            className="w-full h-full object-contain"
                        />
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={prev}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 group z-20"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                    onClick={next}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 group z-20"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`rounded-full transition-all duration-300 ${i === current
                                ? 'w-8 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium z-20">
                    {current + 1} / {images.length}
                </div>

                {/* Fullscreen Button */}
                {/* <button
                    onClick={toggleFullscreen}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all z-20"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </button> */}

                {/* Pause/Play Button */}
                {/* <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all z-20"
                >
                    {isAutoPlaying ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </button> */}

                {/* Thumbnail Strip */}
                <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2 z-20">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`relative flex-shrink-0 transition-all duration-300 ${i === current
                                ? 'ring-2 ring-white scale-105'
                                : 'ring-1 ring-white/30 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={asset(img?.slider_image)}
                                alt={img?.slider_caption}
                                className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-md"
                            />
                        </button>
                    ))}
                </div>

                {/* Loading/Progress Bar */}
                {/* {isAutoPlaying && (
                    <motion.div
                        key={current}
                        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-white to-white/50 z-20"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, ease: "linear" }}
                    />
                )} */}
            </div>

            {/* Exit Fullscreen handler */}
            {isFullscreen && (
                <button
                    onClick={toggleFullscreen}
                    className="fixed top-6 right-6 z-[60] w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </>
    );
}