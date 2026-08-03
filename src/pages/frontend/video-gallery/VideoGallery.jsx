import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  Eye,
  X,
  Video,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useApiQuery } from "@/hooks/useAppQuery";
import { MODULES } from "@/store/default/modules";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";
import { useLocation } from "react-router";

/* ---------------------------------- */
/*  Helpers                           */
/* ---------------------------------- */
// video.meta comes back as a JSON string, e.g. {"url":"https://youtube.com/...","source":"youtube"}
const parseVideoMeta = (video) => {
  if (!video?.meta) return {};
  if (typeof video.meta === "string") {
    try {
      return JSON.parse(video.meta);
    } catch {
      return {};
    }
  }
  return video.meta;
};

/* ---------------------------------- */
/*  Video Card                        */
/* ---------------------------------- */
const VideoCard = ({ video, index, onClick }) => {
  return (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.08 }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video?.image_full_path}
          alt={video?.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 text-primary" />
          </div>
        </div>

        {/* meta badges (only if data exists) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          {video?.duration && (
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
              <Clock className="h-3 w-3" /> {video.duration}
            </span>
          )}
          {video?.views && (
            <span className="ml-auto flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
              <Eye className="h-3 w-3" /> {video.views}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <span className="font-bengali line-clamp-1 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
          {video?.title}
        </span>
        {video?.sub_title && (
          <p className="font-bengali mt-1 line-clamp-2 text-sm text-muted-foreground">
            {video.sub_title}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ---------------------------------- */
/*  Loading Skeleton                  */
/* ---------------------------------- */
const VideoCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <Skeleton className="aspect-video w-full rounded-none" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  </div>
);

/* ---------------------------------- */
/*  Main Page                         */
/* ---------------------------------- */
export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { pathname } = useLocation();
  const slug = pathname.split("/").filter(Boolean).pop();

  const {
    data: videoItemQuery,
    isLoading: videoItemLoading,
    error: videoItemError,
  } = useApiQuery({
    url: "/module-items",
    queryKey: slug,
    params: {
      module_slug: slug,
      limit: 6,
    },
  });

  const videos = videoItemQuery?.data;

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setOpenModal(true);
  };

  const { data: getPageResponse, isLoading, refetch } = useApiQuery({
    url: `/page-by-slug/${slug}`,
    enabled: !!slug,
  });

  const page = getPageResponse?.data;
  const meta = page?.meta ? JSON.parse(page.meta) : {};

  return (
    <div className="min-h-screen bg-background">
      <PageHeroRenderer
        variant={meta?.headerTemplate ?? "gradient"}
        eyebrow={meta?.heroContent?.badge ?? "Videos"}
        title={meta?.heroContent?.title ?? "All videos content"}
        highlight={meta?.heroContent?.heightlight ?? "Learn More About Our Videos"}
        description={
          meta?.heroContent?.description ??
          "Discover our mission, vision, values, and the journey that drives us to serve our community with excellence."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: slug ?? "About Us" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* error state */}
        {videoItemError && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-bengali font-semibold text-foreground">
              ভিডিও লোড করা যায়নি
            </h3>
            <p className="font-bengali mt-1 text-sm text-muted-foreground">
              সার্ভারের সাথে সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।
            </p>
            <Button
              variant="outline"
              size="sm"
              className="font-bengali mt-4"
              onClick={() => window.location.reload()}
            >
              আবার চেষ্টা করুন
            </Button>
          </div>
        )}

        {/* loading state */}
        {videoItemLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* empty state */}
        {!videoItemLoading && !videoItemError && !videos?.length && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Video className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-bengali font-semibold text-foreground">
              কোনো ভিডিও পাওয়া যায়নি
            </h3>
            <p className="font-bengali mt-1 text-sm text-muted-foreground">
              এই মুহূর্তে কোনো ভিডিও যুক্ত করা হয়নি।
            </p>
          </div>
        )}

        {/* video grid */}
        {!videoItemLoading && videos?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="wait">
              {videos.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <VideoModal open={openModal} setOpen={setOpenModal} video={selectedVideo} />
    </div>
  );
}

/* ---------------------------------- */
/*  Video Modal — a proper player     */
/* ---------------------------------- */
const VideoModal = ({ open, setOpen, video }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const videoMeta = useMemo(() => parseVideoMeta(video), [video]);
  const rawUrl = videoMeta?.url;
  const source = videoMeta?.source; // "youtube" | "vimeo" | "mp4" | undefined

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // youtube: watch?v=...
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    // youtube: short link youtu.be/...
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    // youtube: already an /embed/ url
    if (url.includes("youtube.com/embed")) {
      return url.includes("autoplay") ? url : `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
    }

    // vimeo: vimeo.com/12345
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split(/[?&]/)[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(rawUrl);
  const isDirectFile = source === "mp4" || /\.(mp4|webm|ogg)(\?|$)/i.test(rawUrl || "");

  const handleOpenChange = (next) => {
    if (!next) setIframeLoaded(false);
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-black/85 backdrop-blur-sm" />
      <DialogContent className="w-[95vw] max-w-5xl overflow-hidden border-none bg-black p-0 gap-0">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3">
          <p className="font-bengali line-clamp-1 text-sm font-medium text-white/90">
            {video?.title || "Video"}
          </p>
       
        </div>

        {/* Player */}
        <div className="relative aspect-video w-full bg-black">
          {!rawUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-white/40" />
              <p className="font-bengali text-sm text-white/60">
                এই ভিডিওর লিংক পাওয়া যায়নি
              </p>
            </div>
          ) : (
            <>
              {!iframeLoaded && !isDirectFile && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                </div>
              )}

              {isDirectFile ? (
                <video
                  key={rawUrl}
                  src={rawUrl}
                  controls
                  autoPlay
                  className="h-full w-full"
                  onLoadedData={() => setIframeLoaded(true)}
                />
              ) : (
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  title={video?.title || "Video Player"}
                  className={`h-full w-full transition-opacity duration-300 ${
                    iframeLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                />
              )}
            </>
          )}
        </div>

        {/* Footer: sub title, if present */}
        {video?.sub_title && (
          <div className="border-t border-white/10 bg-slate-900 px-4 py-3">
            <p className="font-bengali line-clamp-2 text-xs text-white/60">
              {video.sub_title}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};