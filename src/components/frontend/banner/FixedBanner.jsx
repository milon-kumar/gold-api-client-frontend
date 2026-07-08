import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Zap } from 'lucide-react';

export default function PremiumFixedBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-1000" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              opacity: 0
            }}
            animate={{ 
              y: ['-20px', '20px', '-20px'],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Glass effect container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            {/* Left decorative icon */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="w-px h-8 bg-white/20" />
            </div>

            {/* Text content */}
            <div className="flex-1 text-center">
              <motion.p 
                className="text-white font-bengali text-base sm:text-lg md:text-xl font-medium tracking-wide"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="inline-flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                </span>
              </motion.p>
            </div>

            {/* Right decorative icon */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-px h-8 bg-white/20" />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Animated border bottom */}
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{ 
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}