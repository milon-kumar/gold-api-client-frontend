import React from 'react';
import { motion } from 'framer-motion';

const items = [
  'দাওয়াহ প্রশিক্ষণ',
  'ইসলামিক শিক্ষা',
  'সমাজসেবা',
  'যুব উন্নয়ন',
  'আন্তর্জাতিক সহযোগিতা',
  'ডিজিটাল দাওয়াহ',
  'গবেষণা ও প্রকাশনা',
  'ত্রাণ কার্যক্রম',
];

export default function ScrollingBanner() {
  return (
    <div className="py-6 border-y border-border/50 overflow-hidden bg-card/50">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-sm font-medium text-muted-foreground font-bengali"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}