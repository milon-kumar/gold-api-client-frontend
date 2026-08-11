import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ImageLightbox = ({ photo, onClose }) => {
  return (
    <AnimatePresence>
      {photo && (
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
            className="max-w-5xl w-full"
          >
            <img
              src={photo.image_full_path}
              alt={photo.title}
              className="w-full max-h-[85vh] rounded-xl object-contain"
            />

            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-bold">{photo.title}</h3>
              {photo.sub_description && (
                <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
                  {photo.sub_description}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;