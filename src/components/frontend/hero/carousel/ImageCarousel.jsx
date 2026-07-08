import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { asset } from '@/lib/helper';

export default function MinimalImageCarousel({ ...rest }) {
    const { sliders: images } = rest;
    const [current, setCurrent] = useState(0);
    const [loadedImages, setLoadedImages] = useState({});

    useEffect(() => {
        if (!images || images.length === 0) return;

        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images]);

    // Preload images to handle loading states
    useEffect(() => {
        if (!images) return;

        images.forEach((img, index) => {
            const imgUrl = asset(img?.slider_image);
            if (!loadedImages[index]) {
                const image = new Image();
                image.onload = () => {
                    setLoadedImages(prev => ({ ...prev, [index]: true }));
                };
                image.src = imgUrl;
            }
        });
    }, [images]);

    if (!images || images.length === 0) {
        return (
            <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
                <div className="text-white">No images to display</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <motion.img
                        src={asset(images[current]?.slider_image)}
                        alt={images[current]?.title || "Slider image"}
                        className="w-full h-full object-contain"
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Optional: subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Optional: image counter / indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === current
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}