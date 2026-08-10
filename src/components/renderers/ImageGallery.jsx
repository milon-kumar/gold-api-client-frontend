import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import SectionHeader from "@/components/partials/frontend/SectionHeader";
import { useApiQuery } from "@/hooks/useAppQuery";

/**
 * =====================================================================
 * IMAGE GALLERY (frontend/preview)
 * =====================================================================
 * content.imageGallery -এর প্রতিটা entry ResourcePicker থেকে সেভ হওয়া, এবং
 * সবগুলোর _sourceResource এক (module পাল্টালে ArrayField clearAll করে দেয়,
 * তাই একই field-এ module+category+item মিক্স হওয়ার কথা না)।
 *
 * entry shape (builderHelper.js -> addFromSource):
 *   { _id, _sourceId, _sourceResource, item: <rawItem>, image?: ... }
 *
 * resource === "item"     → entry.item নিজেই পুরো module item (image সহ)।
 *                            আলাদা fetch লাগবে না, সরাসরি দেখানো যায়।
 * resource === "category" → entry.item হলো category object, যার ভিতরে
 *                            module_items[] আগে থেকেই embedded (picker যখন
 *                            category list আনে তখনই backend সেটা পাঠায়)।
 *                            আলাদা fetch লাগবে না, flatten করলেই হয়।
 * resource === "module"   → entry.item শুধু module-এর info, ভিতরে items
 *                            embedded নেই। এই মডিউল id গুলো দিয়ে items
 *                            fetch করে আনতে হবে — এখানেই একমাত্র API কল।
 * =====================================================================
 */
const ImageGallery = ({
  template,
  content = {},
  settings = {},
  styles = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const gallery = content?.imageGallery || [];
  const resource = gallery[0]?._sourceResource;

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
      id="gallery"
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

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : hasItems ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-45 sm:auto-rows-55">
            {filteredItems.map((photo, index) => (
              <motion.div
                key={photo.id ?? index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                  index === 0
                    ? "col-span-2 row-span-2"
                    : index === filteredItems.length - 1
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No images found</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
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
              className="max-w-5xl w-full"
            >
              <img
                src={lightbox.image_full_path}
                alt={lightbox.title}
                className="w-full max-h-[85vh] rounded-xl object-contain"
              />

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

export default ImageGallery;