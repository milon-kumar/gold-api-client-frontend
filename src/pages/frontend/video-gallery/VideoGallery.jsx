import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiQuery } from '@/hooks/useAppQuery';
import { asset } from '@/lib/helper';
import {
    Dialog,
    DialogContent,
    DialogOverlay,
} from "@/components/ui/dialog";

const videos = [
    { id: 1, title: 'জুমার খুতবা - তাকওয়ার গুরুত্ব', speaker: 'মাওলানা আবু তাহের', duration: '৪৫:২০', views: '১২K', thumb: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=600&q=80' },
    { id: 2, title: 'দাওয়াতের আদব ও পদ্ধতি', speaker: 'মাওলানা তারেক জামিল', duration: '৩২:১০', views: '৮.৫K', thumb: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&q=80' },
    { id: 3, title: 'ইসলামে সেবার গুরুত্ব', speaker: 'ড. আব্দুল করিম', duration: '২৮:৪৫', views: '৬.২K', thumb: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&q=80' },
    { id: 4, title: 'যুবকদের প্রতি আহ্বান', speaker: 'মুফতি ইব্রাহিম', duration: '৫১:৩০', views: '১৫K', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
    { id: 5, title: 'রমজানের প্রস্তুতি', speaker: 'মাওলানা হাসান', duration: '৩৯:১৫', views: '১০K', thumb: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80' },
    { id: 6, title: 'নামাজের সৌন্দর্য', speaker: 'শাইখ আহমদ', duration: '২৫:০০', views: '৯K', thumb: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80' },
];

export default function VideoGallery() {
    //   const [page, setPage] = useState(0);
    //   const perPage = 3;
    //   const totalPages = Math.ceil(videos.length / perPage);
    //   const visible = videos.slice(page * perPage, (page + 1) * perPage);
    const [openModal, setOpenModal] =
        useState(false);

    const [selectedVideo, setSelectedVideo] =
        useState(null);
    const { data, isLoading, error } = useApiQuery({
        url: '/video-gallery',
        queryKey: ['video-gallery']
    });

    const videos = data?.data?.videos
    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setOpenModal(true);

    };

    return (
        <section className="sm:py-18 bg-gradient-to-b from-background via-secondary/30 to-background relative">
            <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                {/* <div className="flex items-end justify-between mb-12">
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div> */}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="wait">
                        {videos?.map((video, i) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() =>
                                    handleVideoClick(video)
                                }
                            >
                                <div className="relative rounded-2xl overflow-hidden aspect-video mb-4">
                                    <img
                                        src={asset(video.image)}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                            <Play className="w-6 h-6 text-primary ml-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                                        <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                                            <Clock className="w-3 h-3" /> {video.duration}
                                        </span>
                                        <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                                            <Eye className="w-3 h-3" /> {video.views}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors font-bengali line-clamp-1">{video.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1 font-bengali">{video.speaker}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Mobile pagination */}
                {/* <div className="flex sm:hidden items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${page === i ? 'bg-primary w-8' : 'bg-border'}`}
            />
          ))}
        </div> */}
            </div>
            <VideoModal
                open={openModal}
                setOpen={setOpenModal}
                videoUrl={selectedVideo?.video_link}
            />

        </section>
    );
}


const VideoModal = ({
    open,
    setOpen,
    videoUrl,
}) => {
    const getEmbedUrl = (url) => {

        if (!url) return "";

        // watch?v= → embed/
        if (url.includes("watch?v=")) {

            const videoId =
                url.split("watch?v=")[1]
                    ?.split("&")[0];

            return `https://www.youtube.com/embed/${videoId}`;

        }

        // already embed
        if (url.includes("embed")) {
            return url;
        }

        return url;

    };

    const embedUrl =
        getEmbedUrl(videoUrl);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
            <DialogContent
                className="
          max-w-5xl
          w-[95vw]
          p-0
          overflow-hidden
          border-none
          bg-black
        "
            >

                <div className="relative w-full aspect-video">

                    {embedUrl && (

                        <iframe
                            src={embedUrl}
                            title="Video Player"
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />

                    )}

                </div>

            </DialogContent>
        </Dialog>
    );
};