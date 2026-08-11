import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const VideoCard = ({ video, index = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="group relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer bg-gray-900"
      onClick={() => onClick?.(video)}
    >
      {video.image_full_path ? (
        <img
          src={video.image_full_path}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-gray-800" />
      )}

      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 flex items-center justify-center shadow-lg transition-all duration-300">
          <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/70 via-black/20 to-transparent">
        <p className="text-white text-sm font-semibold line-clamp-2">
          {video.title}
        </p>
      </div>
    </motion.div>
  );
};

export default VideoCard;