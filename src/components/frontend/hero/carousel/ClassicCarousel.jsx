import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Users, Briefcase, Award } from 'lucide-react';

// Stats data (you can make this dynamic too if needed)
const stats = [
    { label: 'সক্রিয় ব্যবহারকারী', value: '৫০K+', icon: Users },
    { label: 'প্রকল্প সম্পন্ন', value: '১২০+', icon: Briefcase },
    { label: 'বিশেষজ্ঞ দল', value: '৩৫', icon: Users },
    { label: 'পুরস্কার', value: '২৫', icon: Award },
];

// Helper function to parse meta data
const parseMetaData = (metaString) => {
    try {
        return JSON.parse(metaString);
    } catch {
        return {
            primary_button_title: 'শুরু করুন',
            primary_button_link: '#',
            secondary_button_title: 'ভিডিও দেখুন',
            secondary_button_link: '#',
            slogan: ''
        };
    }
};

export default function HeroSlider({ sliders }) {
    console.log("classic carousel - ", sliders);

    // If sliders is empty or undefined, show a default/fallback state
    if (!sliders || sliders.length === 0) {
        return (
            <section className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900">
                <p className="text-white text-xl">কোন স্লাইডার পাওয়া যায়নি</p>
            </section>
        );
    }

    // Transform API data to match the component's expected structure
    const slides = sliders.map((item) => {
        const meta = parseMetaData(item.meta);

        // Split title into parts for highlighting (you can customize this logic)
        const titleParts = item?.title?.split(' ');
        const midIndex = Math.ceil(titleParts.length / 2);
        const title = titleParts.slice(0, midIndex).join(' ') + ' ';
        const titleHighlight = titleParts.slice(midIndex, midIndex + 1).join(' ') || ' ';
        const titleEnd = titleParts.slice(midIndex + 1).join(' ') || ' ';

        // Generate a gradient based on index or random
        const gradients = [
            'from-blue-900',
            'from-purple-900',
            'from-green-900',
            'from-red-900',
        ];
        const color = gradients[item.id % gradients.length] || 'from-gray-900';

        // Use the image_full_path if available, otherwise use image
        const imageUrl = item.image_full_path || item.image || '/placeholder-image.jpg';

        return {
            id: item.id,
            image: imageUrl,
            badge: meta.slogan || 'বিশেষ অফার',
            title: title,
            titleHighlight: titleHighlight,
            titleEnd: titleEnd,
            desc: item.description || item.sub_description || 'ডিফল্ট বিবরণ',
            color: color,
            // Additional data you might need
            primaryButtonTitle: meta.primary_button_title || 'শুরু করুন',
            primaryButtonLink: meta.primary_button_link || '#',
            secondaryButtonTitle: meta.secondary_button_title || 'ভিডিও দেখুন',
            secondaryButtonLink: meta.secondary_button_link || '#',
            isFeatured: item.is_featured === 1
        };
    });

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrent(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

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
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Background image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <img
                        src={slide.image}
                        alt={slide.title || `Slide ${slide.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                        }}
                    />
                    <div className={`absolute inset-0 bg-linear-to-r ${slide.color} via-black/60 to-black/30`} />
                </motion.div>
            </AnimatePresence>

            {/* Dot grid overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }} />

            {/* Content */}
            <div className="relative flex-1 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-8 w-full">
                    <div className="max-w-3xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.7 }}
                            >
                                <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <span className="font-bengali">{slide.badge}</span>
                                </motion.div>

                                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight font-bengali text-white">
                                    {slide.title}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                                        {slide.titleHighlight}
                                    </span>
                                    {slide.titleEnd}
                                </h1>

                                <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed font-bengali">
                                    {slide.desc}
                                </p>

                                <div className="flex flex-wrap gap-3 mt-8">
                                    <Button
                                        className="bg-white text-primary hover:bg-white/90 rounded-full px-7 py-6 text-base shadow-2xl font-bengali group"
                                        onClick={() => window.location.href = slide.primaryButtonLink}
                                    >
                                        {slide.primaryButtonTitle}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-white/40 text-white hover:bg-white/10 rounded-full px-7 py-6 text-base font-bengali group"
                                        onClick={() => window.location.href = slide.secondaryButtonLink}
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        {slide.secondaryButtonTitle}
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Slide controls */}
                    <div className="flex items-center gap-4 mt-12">
                        <button
                            onClick={prev}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`rounded-full transition-all duration-500 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                                        }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="relative z-10 bg-white/10 backdrop-blur-xl border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x divide-white/20">
                        {stats.map((s) => (
                            <div key={s.label} className="flex items-center gap-3 sm:px-8 first:pl-0">
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                                    <s.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-white font-bengali leading-none">{s.value}</p>
                                    <p className="text-xs text-white/60 font-bengali mt-0.5">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Example usage in a parent component:
const ParentComponent = () => {
    const sliderData = sliderItemQuery?.data || [];

    return <HeroSlider sliders={sliderData} />;
};