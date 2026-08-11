import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import SectionHeader from "@/components/partials/frontend/SectionHeader";
import { useApiQuery } from "@/hooks/useAppQuery";
import VideoCard from "./partials/video-gallery/VideoCard";
import VideoLightbox from "./partials/video-gallery/VideoLightBox";

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
              <VideoCard key={index} video={video} index={index} onClick={(video) => setLightbox(video)}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No videos found</p>
          </div>
        )}
      </div>
        {
          lightbox && (
            <VideoLightbox video={lightbox} onClose={() => setLightbox(null)}/>
          )
        }
      
    </section>
  );
};

export default VideoGallery;