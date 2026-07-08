// @ts-nocheck
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/partials/frontend/SectionHeader';
import { asset, getHtmlContent } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from "@/components/ui/card";

const publications = [
    {
        id: 1,
        name: 'মাসিক আত-তাহরীক',
        description: 'ধর্ম, সমাজ ও সাহিত্য বিষয়ক গবেষণা পত্রিকা। প্রতিটি সংখ্যায় থাকে গবেষণাধর্মী লেখা, সমকালীন বিষয়ে বিশ্লেষণ এবং সাহিত্যের চমৎকার আয়োজন।',
        image_url: 'assets/images/at-tahreek.png',
        link: 'https://at-tahreek.com/',
        button_text: 'বিস্তারিত দেখুন'
    },
    {
        id: 2,
        name: 'তাওহীদের ডাক',
        description: 'কুরআন ও সুন্নাহকে আঁকড়ে ধরার এক অনন্য বার্তা। ইসলামী জ্ঞানচর্চা ও তাওহীদের শিক্ষা ছড়িয়ে দেয়ার লক্ষ্যে আমাদের প্রচেষ্টা।',
        image_url: 'assets/images/tawheeder-dak.png',
        link: 'https://tawheederdak.com/',
        button_text: 'বিস্তারিত দেখুন'
    },
    {
        id: 3,
        name: 'সোনামণি প্রতিভা',
        description: 'একটি সৃজনশীল শিশু-কিশোর পত্রিকা। শিশু-কিশোরদের মেধা বিকাশ ও সৃজনশীলতা বৃদ্ধির জন্য নানান আয়োজন।',
        image_url: 'assets/images/sonamoni-Protiva.png',
        link: 'https://ahlehadeethbd.org/protiva/',
        button_text: 'বিস্তারিত দেখুন'
    },
    {
        id: 4,
        name: 'আহলেহাদীছ পত্রিকা',
        description: 'আহলেহাদীছ আন্দোলনের মুখপত্র। ইসলামী আন্দোলনের সর্বশেষ সংবাদ ও কার্যক্রমের বিবরণী।',
        image_url: 'assets/images/at-tahreek.png',
        link: '#',
        button_text: 'বিস্তারিত দেখুন'
    },
    {
        id: 5,
        name: 'শিশু মেলা',
        description: 'শিশুদের জন্য বিনোদন ও শিক্ষামূলক সামগ্রী সমৃদ্ধ একটি মাসিক পত্রিকা।',
        image_url: 'assets/images/sonamoni-Protiva.png',
        link: '#',
        button_text: 'বিস্তারিত দেখুন'
    },
    {
        id: 6,
        name: 'নারী জাগরণ',
        description: 'নারীদের ইসলামী জীবনযাপন ও অধিকার বিষয়ক আলোচনাপত্র।',
        image_url: 'assets/images/tawheeder-dak.png',
        link: '#',
        button_text: 'বিস্তারিত দেখুন'
    },
];

export default function PublicationsSlider({ webSettings, items = publications }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const sliderRef = useRef(null);

    const itemsPerView = 3;
    const totalSlides = Math.ceil(items.length / itemsPerView);
    const maxIndex = totalSlides - 1;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const getVisibleItems = () => {
        const start = currentIndex * itemsPerView;
        const end = start + itemsPerView;
        return items.slice(start, end);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!touchStart) return;
        const touchEnd = e.touches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            setTouchStart(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStart(null);
    };

    const establisher = webSettings?.service_title || '';
    const words = establisher.split(' ');
    const firstWord = words[0] || '';
    const remainingWords = words.slice(1).join(' ') || '';


    return (
        <section id="publications-slider" className="py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <SectionHeader
                    badge={remainingWords}
                    title={webSettings?.service_title}
                    subtitle=""
                />

                <div className="relative mt-12">
                    <div
                        ref={sliderRef}
                        className="overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {getVisibleItems().map((item) => (
                                <PublicationCard key={item.id} item={item} />
                            ))}
                        </motion.div>
                    </div>

                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </button>
                        </>
                    )}
                </div>

                {/* Slider Dots */}
                {totalSlides > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === index
                                    ? 'w-8 h-2.5 bg-primary'
                                    : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// Card Component - Image on Left, Content on Right
function PublicationCard({ item }) {
    const { title, description, image_url, link, button_text } = item;

    return (
        <div className="flex flex-col sm:flex-row border p-3 rounded-md">
            <div className="sm:w-2/5 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={asset(image_url)}
                    alt={title}
                    className="w-full h-48 sm:h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded"
                />
            </div>
            <div className="sm:w-3/5 px-3 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: getHtmlContent(description) }} />
            </div>
        </div>
    );
}