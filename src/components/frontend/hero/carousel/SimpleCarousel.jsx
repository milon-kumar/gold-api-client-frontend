import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    badge: 'দাওয়াহ ও তাবলীগের সেবায়',
    title: 'ইসলামের সুমহান',
    titleHighlight: 'বাণী ছড়িয়ে দিন',
    titleEnd: 'সারা বিশ্বে',
    desc: 'ইসলামিক দাওয়াহ ও শিক্ষামূলক কার্যক্রমের সবচেয়ে বড় ডিজিটাল প্ল্যাটফর্ম। আমাদের সাথে যুক্ত হন এবং দ্বীনের খেদমতে অংশ নিন।',
    image:
      'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1200&q=80',
  },
  {
    id: 2,
    badge: 'যুব উন্নয়ন কার্যক্রম',
    title: 'তরুণ প্রজন্মকে',
    titleHighlight: 'দ্বীনের পথে',
    titleEnd: 'আহ্বান করুন',
    desc: 'যুবকদের নৈতিক ও আধ্যাত্মিক উন্নয়নে আমরা প্রতিশ্রুতিবদ্ধ। আজই আমাদের যুব প্রোগ্রামে অংশ নিন।',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
  },
  {
    id: 3,
    badge: 'সামাজিক সেবা প্রকল্প',
    title: 'মানবতার সেবায়',
    titleHighlight: 'আমরা সবসময়',
    titleEnd: 'আপনার পাশে',
    desc: 'বন্যা ত্রাণ, স্বাস্থ্যসেবা এবং দরিদ্রদের সহায়তায় আমরা কাজ করে যাচ্ছি। আপনিও অংশীদার হন।',
    image:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80',
  },
];

export default function HeroSplitSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const next = () => {
    setCurrent((prev) =>
      (prev + 1) % slides.length
    );
  };

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="relative z-10">

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 font-bengali">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {slide.badge}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight font-bengali">

                {slide.title}

                <br />

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                  {slide.titleHighlight}
                </span>

                <br />

                {slide.titleEnd}

              </h1>

              {/* Description */}
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed font-bengali max-w-xl">
                {slide.desc}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 mt-8">

                <Button className="rounded-full px-7 py-6 text-base font-bengali group">

                  শুরু করুন

                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />

                </Button>

                <Button
                  variant="outline"
                  className="rounded-full px-7 py-6 text-base font-bengali group"
                >

                  <Play className="w-4 h-4 mr-2" />

                  ভিডিও দেখুন

                </Button>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">

          <AnimatePresence mode="wait">

            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >

              <div className="relative rounded-3xl overflow-hidden shadow-2xl">

                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-[420px] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              </div>

            </motion.div>

          </AnimatePresence>

          {/* Vertical Thumbnails */}
          <div className="absolute -right-14 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">

            <button
              onClick={prev}
              className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {slides.map((s, i) => (

              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === current
                    ? 'border-primary scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >

                <img
                  src={s.image}
                  alt=""
                  className="w-full h-full object-cover"
                />

              </button>

            ))}

            <button
              onClick={next}
              className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}