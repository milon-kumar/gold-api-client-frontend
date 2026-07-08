import React from 'react';
import { motion } from 'framer-motion';

export default function SolidBackgroundBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary">
      {/* Decorative shapes - top left */}
      <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />
      
      {/* Decorative shapes - top right */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white/10 blur-xl" />
      
      {/* Decorative shapes - bottom left */}
      <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-accent/15 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-white/5 blur-lg" />
      
      {/* Decorative shapes - bottom right */}
      <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-accent/20 blur-xl" />
      
      {/* Floating small circles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white/40 animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-white/30 animate-pulse delay-500" />
      <div className="absolute bottom-1/4 left-2/3 w-2 h-2 rounded-full bg-white/40 animate-pulse delay-1000" />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse delay-700" />
      
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 20px,
          rgba(255,255,255,0.1) 20px,
          rgba(255,255,255,0.1) 40px
        )`
      }} />
      
      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-medium tracking-wide drop-shadow-lg"
        >
          দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
        </motion.p>
        
        {/* Animated underline effect */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white/30 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100px' }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ maxWidth: '80%' }}
        />
      </div>
    </div>
  );
}