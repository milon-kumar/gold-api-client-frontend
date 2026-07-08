import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export default function MinimalPremiumBanner() {
  return (
    <div className="relative w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center justify-center gap-3"
        >
          <Crown className="w-5 h-5 text-amber-500" />
          
          <div className="relative">
            <p className="text-gray-800 dark:text-white font-bengali text-sm sm:text-base font-medium tracking-wide">
              দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
            </p>
            
            {/* Underline animation */}
            <motion.div 
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <Crown className="w-5 h-5 text-amber-500 rotate-180" />
        </motion.div>
      </div>
    </div>
  );
}