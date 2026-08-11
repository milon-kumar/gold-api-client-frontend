import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const getEmbedUrl = (url = "") => {
  if (!url) return null;

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return null;
};


const VideoLightbox = ({ video, onClose }) => {
  const embedUrl = video ? getEmbedUrl(video?.meta?.url) : null;

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full"
          >
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : video?.meta?.url ? (
                <video
                  src={video.meta.url}
                  poster={video.image_full_path || undefined}
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">
                  No video source found
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-bold">{video.title}</h3>
              {video.sub_description && (
                <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
                  {video.sub_description}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoLightbox;