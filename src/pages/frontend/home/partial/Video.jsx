import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/partials/frontend/SectionHeader";

const PER_PAGE = 6;

const Video = ({ items = [] }) => {
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(items.length / PER_PAGE);

    const visible = useMemo(() => {
        const start = page * PER_PAGE;
        return items.slice(start, start + PER_PAGE);
    }, [items, page]);

    return (
        <section
            id="media"
            className="py-20 sm:py-28 bg-linear-to-b from-background via-secondary/30 to-background relative"
        >
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-end justify-between mb-6">
                    <SectionHeader
                        badge="মিডিয়া"
                        title="বয়ান ও ভিডিও"
                        subtitle="বিখ্যাত আলেমদের গুরুত্বপূর্ণ বয়ান সমূহ"
                        align="left"
                    />

                    {totalPages > 1 && (
                        <div className="hidden sm:flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() =>
                                    setPage((prev) => Math.max(0, prev - 1))
                                }
                                disabled={page === 0}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(totalPages - 1, prev + 1)
                                    )
                                }
                                disabled={page === totalPages - 1}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="wait">
                        {visible.map((video, index) => {
                            const meta =
                                typeof video.meta === "string"
                                    ? JSON.parse(video.meta)
                                    : video.meta || {};

                            return (
                                <motion.a
                                    key={video.id}
                                    href={meta.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="group block"
                                >
                                    <div className="relative rounded-2xl overflow-hidden aspect-video mb-4">
                                        <img
                                            src={video.image_full_path}
                                            alt={video.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Play className="w-6 h-6 text-red-600 fill-red-600 ml-1" />
                                            </div>
                                        </div>

                                        {video.is_featured == 1 && (
                                            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* <h4 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                        {video.title}
                                    </h4>

                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {video.sub_description}
                                    </p>

                                    {video.sub_title && (
                                        <p className="text-xs text-primary mt-2 font-medium">
                                            {video.sub_title}
                                        </p>
                                    )} */}
                                </motion.a>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {totalPages > 1 && (
                    <div className="flex sm:hidden items-center justify-center gap-2 mt-8">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`h-2.5 rounded-full transition-all ${page === i
                                    ? "w-8 bg-primary"
                                    : "w-2.5 bg-border"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Video;