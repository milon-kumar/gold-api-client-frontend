import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Volume2 } from 'lucide-react';

export default function InteractiveTiltBanner() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateXValue = ((y - centerY) / centerY) * 5;
      const rotateYValue = ((x - centerX) / centerX) * 5;
      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              y: ['0%', '100%'],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="perspective-1000"
        >
          <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20"
              animate={{ 
                x: ['-100%', '100%'],
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
            />
            
            <div className="relative flex items-center justify-center gap-4 px-8 py-5">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-rose-400 fill-rose-400/50" />
              </motion.div>
              
              <p className="text-white font-bengali text-base sm:text-lg md:text-xl font-semibold tracking-wide">
                দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
              </p>
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Volume2 className="w-5 h-5 text-cyan-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}