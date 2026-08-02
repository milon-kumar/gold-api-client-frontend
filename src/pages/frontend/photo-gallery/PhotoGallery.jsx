import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery";
import SectionHeader from "@/components/partials/frontend/SectionHeader";
import { asset } from "@/lib/helper";
import { MODULES } from "@/store/default/modules";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";
import { useLocation } from "react-router";

export default function PhotoGallery() {
  const { pathname } = useLocation()
  const slug = pathname.split("/").filter(Boolean).pop();

  const getDynamicSpan = (index) => {
    if (index === 0) {
      return "col-span-2 row-span-2";
    }
    if (index % 6 === 0) {
      return "col-span-2";
    }
    if (index % 4 === 0) {
      return "row-span-2";
    }

    return "";
  };

  const [lightbox, setLightbox] = useState(null);

  const {
    data: imageItemQuery,
    isLoading: imageItemLoading,
    error: imageItemError,
  } = useApiQuery({
    url: "/module-items",
    queryKey: slug,
    params: {
      module_slug: slug,
      limit: 9,
    },
  });

  const { data: getPageResponse, isLoading, refetch } = useApiQuery({
    url: `/page-by-slug/${slug}`,
    enabled: !!slug,
  });

  const images = imageItemQuery?.data;
  const page = getPageResponse?.data
  const meta = page?.meta ? JSON.parse(page.meta) : {};
  return (
    <section id="gallery">
      <PageHeroRenderer
        variant={meta?.headerTemplate ?? "gradient"}
        eyebrow={meta?.heroContent?.badge ?? "Photo Gallery"}
        title={meta?.heroContent?.title ?? "Explore Our"}
        highlight={meta?.heroContent?.heightlight ?? "Photo Collection"}
        description={
          meta?.heroContent?.description ??
          "Browse our collection of photos capturing memorable moments, community events, educational activities, and the work we do to make a positive impact."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Photo Gallery" },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
          {images?.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${getDynamicSpan(i)}`}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img?.image_full_path}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-semibold font-bengali">
                  {img.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
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
              className="absolute top-6 right-6 text-white/80 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={asset(lightbox?.image_url)}
              alt={lightbox.title}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
