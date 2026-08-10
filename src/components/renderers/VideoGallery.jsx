import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import SectionHeader from "@/components/partials/frontend/SectionHeader";
import { useApiQuery } from "@/hooks/useAppQuery";

/**
 * =====================================================================
 * VIDEO GALLERY (frontend/preview)
 * =====================================================================
 * resource === "item"     → entry.item সরাসরি দেখানো যায়।
 * resource === "category" → entry.item.module_items[] flatten করলেই হয়।
 * resource === "module"   → module id দিয়ে items fetch করতে হবে।
 *
 * video url ধরা হচ্ছে item.meta?.url থেকে। YouTube/Vimeo watch-link হলে
 * getEmbedUrl() সেটাকে embeddable /embed/{id} URL-এ কনভার্ট করে — raw watch
 * link সরাসরি <iframe src> এ দিলে embed হয় না, তাই এই কনভার্সনটা must।
 * =====================================================================
 */

/** YouTube/Vimeo watch-link হলে embeddable URL রিটার্ন করে, নাহলে null (direct file হিসেবে ধরা হবে) */
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

const VideoGallery = ({
  template,
  content = {},
  settings = {},
  styles = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const gallery = content?.videoGallery || [];
  const resource = gallery[0]?._sourceResource; // "module" | "category" | "item" | undefined

  const moduleIds = useMemo(() => {
    if (resource !== "module") return [];
    return gallery.map((g) => g?.item?.id).filter(Boolean);
  }, [resource, gallery]);

  const {
    data: moduleItemsQuery,
    isLoading: moduleItemsLoading,
  } = useApiQuery({
    url: "/admin/get-module-items-by-module-ids",
    params: { module_ids: moduleIds },
    enabled: resource === "module" && moduleIds.length > 0,
  });

  const items = useMemo(() => {
    if (resource === "item") {
      return gallery.map((g) => g?.item).filter(Boolean);
    }

    if (resource === "category") {
      return gallery.flatMap((g) => g?.item?.module_items || []);
    }

    if (resource === "module") {
      return moduleItemsQuery?.data || [];
    }

    return [];
  }, [resource, gallery, moduleItemsQuery]);

  /* ---------------- category filter বাটন গুলো ---------------- */
  const categories = useMemo(() => {
    if (resource === "category") {
      return gallery
        .map((g) => ({ id: g?.item?.id, name: g?.item?.name }))
        .filter((c) => c.id);
    }

    if (resource === "module") {
      const map = new Map();
      (items || []).forEach((item) => {
        if (item?.category) map.set(item.category.id, item.category);
      });
      return Array.from(map.values());
    }

    return [];
  }, [resource, gallery, items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return items;
    return items.filter((item) => {
      const catId = item?.category?.id ?? item?.category_id;
      return catId === selectedCategory;
    });
  }, [items, selectedCategory]);

  const isLoading = resource === "module" && moduleItemsLoading;
  const hasItems = filteredItems?.length > 0;

  // ✅ raw url (YouTube/Vimeo watch-link বা direct file) থেকে embeddable url আলাদা করে রাখা
  const activeEmbedUrl = lightbox ? getEmbedUrl(lightbox?.meta?.url) : null;

  return (
    <section
      id="video-gallery"
      className=""
      style={{
        backgroundColor: styles?.sectionBG || undefined,
        color: styles?.sectionTextColor || undefined,
        paddingTop: `${styles?.sectionPaddingY ?? 0}px`,
        paddingBottom: `${styles?.sectionPaddingY ?? 0}px`,
        paddingLeft: `${styles?.paddingX ?? 0}px`,
        paddingRight: `${styles?.paddingX ?? 0}px`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {settings?.showHeader && (
          <SectionHeader
            badge={settings?.showBadge && (content?.badge || "")}
            title={content?.title || ""}
            subtitle={content?.subtitle || ""}
          />
        )}

        {/* Category Filter Buttons */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-semibold cursor-pointer
                transition-all duration-300 border
                ${
                  selectedCategory === "all"
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/30 scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:text-primary hover:shadow-sm"
                }
              `}
            >
              <span className="relative z-10">All</span>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  relative px-6 py-2.5 rounded-full text-sm font-semibold cursor-pointer
                  transition-all duration-300 border overflow-hidden
                  ${
                    selectedCategory === category.id
                      ? "bg-linear-to-r from-primary to-primary/80 text-white border-primary shadow-sm shadow-primary/30 scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:text-primary hover:shadow-sm hover:-translate-y-0.5"
                  }
                `}
              >
                {selectedCategory === category.id && (
                  <span className="absolute inset-0 bg-white/10 animate-pulse" />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Video Grid (3–4 per row) */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : hasItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((video, index) => (
              <motion.div
                key={video.id ?? index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer bg-gray-900"
                onClick={() => setLightbox(video)}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No videos found</p>
          </div>
        )}
      </div>

      {/* Video Player Lightbox */}
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
              className="absolute top-6 right-6 text-white/80 hover:text-white cursor-pointer"
              onClick={() => setLightbox(null)}
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
                {activeEmbedUrl ? (
                  // ✅ YouTube/Vimeo watch-link কে embed url-এ কনভার্ট করেই iframe-এ দেওয়া হচ্ছে
                  <iframe
                    src={activeEmbedUrl}
                    title={lightbox.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : lightbox?.meta?.url ? (
                  // YouTube/Vimeo না হলে সরাসরি video file হিসেবে ধরে native player চালানো
                  <video
                    src={lightbox.meta.url}
                    poster={lightbox.image_full_path || undefined}
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
                <h3 className="text-white text-xl font-bold">{lightbox.title}</h3>

                {lightbox.sub_description && (
                  <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
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
};

export default VideoGallery;