import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import SectionHeader from "@/components/partials/frontend/SectionHeader";

export default function Image({ items = [] }) {
    const [lightbox, setLightbox] = useState(null);

    return (
        <section id="gallery" className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <SectionHeader
                    badge="গ্যালারি"
                    title="ছবি সমূহ"
                    subtitle="আমাদের কার্যক্রমের স্মরণীয় মুহূর্ত"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
                    {items.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className={`group relative rounded-2xl overflow-hidden cursor-pointer ${index === 0
                                ? "col-span-2 row-span-2"
                                : index === items.length - 1
                                    ? "col-span-2"
                                    : ""
                                }`}
                            onClick={() => setLightbox(photo)}
                        >
                            <img
                                src={photo.image_full_path}
                                alt={photo.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-sm font-semibold line-clamp-2">
                                    {photo.title}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/80 hover:text-white"
                            onClick={() => setLightbox(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={lightbox.image_full_path}
                                alt={lightbox.title}
                                className="max-w-full max-h-[85vh] rounded-xl object-contain"
                            />

                            <div className="mt-4 text-center">
                                <h3 className="text-white text-xl font-bold">
                                    {lightbox.title}
                                </h3>

                                {lightbox.sub_description && (
                                    <p className="text-gray-300 mt-2 max-w-2xl">
                                        {lightbox.sub_description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}