import React from "react";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const ImageCard = ({ photo, index = 0, isFirst = false, isLast = false, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        isFirst && "col-span-2 row-span-2",
        isLast && !isFirst && "col-span-2"
      )}
      onClick={() => onClick?.(photo)}
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
  );
};

export default ImageCard;