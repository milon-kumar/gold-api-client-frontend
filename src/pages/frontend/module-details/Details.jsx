import React from "react";
import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CalendarDays,
  Tag,
  Star,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/* ---------------------------------- */
/*  Helpers                           */
/* ---------------------------------- */
const asset = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `/${path.replace(/^\/+/, "")}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

/* ---------------------------------- */
/*  Dynamic SEO Head                  */
/* ---------------------------------- */
const SeoHead = ({ item }) => {
  const seo = item?.meta?.seo_content || {};

  const title = seo.meta_title || item?.title || "Details";
  const description =
    seo.meta_description || item?.sub_description || item?.title || "";
  const keywords = seo.meta_keywords || "";
  const robots = seo.robots || "index, follow";
  const canonical =
    seo.canonical_url ||
    (typeof window !== "undefined" ? window.location.href : "");

  const ogTitle = seo.og_title || title;
  const ogDescription = seo.og_description || description;
  const ogImage = asset(seo.og_image) || item?.image_full_path;

  const twitterTitle = seo.twitter_title || ogTitle;
  const twitterDescription = seo.twitter_description || ogDescription;
  const twitterImage = asset(seo.twitter_image) || ogImage;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Helmet>
  );
};

/* ---------------------------------- */
/*  Hero (banner-style, matches       */
/*  the gradient design system)       */
/* ---------------------------------- */
const DetailsHero = ({ item }) => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    item?.category?.name && {
      label: item.category.name,
      href: `/categories/${item.category.slug}`,
    },
    { label: item?.title },
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black, transparent)",
        }}
      />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        {/* breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <React.Fragment key={i}>
                {isLast ? (
                  <span className="line-clamp-1 font-medium text-emerald-400">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href || "#"}
                    className="transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              </React.Fragment>
            );
          })}
        </nav>

        {/* category + featured badges */}
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          {item?.category?.name && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300">
              <Tag className="h-3 w-3" />
              {item.category.name}
            </span>
          )}
          {item?.is_featured === 1 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-medium text-amber-300">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        {/* title */}
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {item?.title}
        </h1>

        {item?.sub_title && item.sub_title !== item.title && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {item.sub_title}
          </p>
        )}

        {item?.created_at && (
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4 text-emerald-400" />
            Published on {formatDate(item.created_at)}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
    </section>
  );
};

/* ---------------------------------- */
/*  Hero Skeleton                     */
/* ---------------------------------- */
const DetailsHeroSkeleton = () => (
  <section className="relative overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
    <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <Skeleton className="h-4 w-48 bg-white/10" />
      <Skeleton className="mt-6 h-6 w-32 rounded-full bg-white/10" />
      <Skeleton className="mt-5 h-10 w-3/4 bg-white/10" />
      <Skeleton className="mt-4 h-5 w-1/2 bg-white/10" />
    </div>
  </section>
);

/* ---------------------------------- */
/*  Rich Text Content                 */
/*  Self-contained styling — does NOT */
/*  depend on @tailwindcss/typography */
/*  being installed. If that plugin   */
/*  IS installed, you can delete this */
/*  <style> block and just use the    */
/*  `prose` class instead.            */
/* ---------------------------------- */
const RichTextContent = ({ html }) => (
  <>
    <style>{`
      .rich-content h1, .rich-content h2, .rich-content h3,
      .rich-content h4, .rich-content h5, .rich-content h6 {
        font-weight: 700;
        line-height: 1.3;
        color: hsl(var(--foreground));
        margin-top: 1.75em;
        margin-bottom: 0.6em;
      }
      .rich-content h1 { font-size: 1.875rem; }
      .rich-content h2 { font-size: 1.5rem; }
      .rich-content h3 { font-size: 1.25rem; }
      .rich-content h4 { font-size: 1.125rem; }
      .rich-content p {
        margin-top: 0;
        margin-bottom: 1.25em;
        line-height: 1.8;
        color: hsl(var(--foreground) / 0.85);
      }
      .rich-content a {
        color: hsl(var(--primary));
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .rich-content a:hover { opacity: 0.8; }
      .rich-content strong, .rich-content b { font-weight: 700; color: hsl(var(--foreground)); }
      .rich-content em, .rich-content i { font-style: italic; }
      .rich-content ul, .rich-content ol {
        margin-top: 0;
        margin-bottom: 1.25em;
        padding-left: 1.5em;
      }
      .rich-content ul { list-style-type: disc; }
      .rich-content ol { list-style-type: decimal; }
      .rich-content li { margin-bottom: 0.5em; line-height: 1.8; }
      .rich-content li::marker { color: hsl(var(--primary)); }
      .rich-content blockquote {
        margin: 1.5em 0;
        padding: 0.75em 1.25em;
        border-left: 3px solid hsl(var(--primary));
        background: hsl(var(--primary) / 0.05);
        border-radius: 0 0.5rem 0.5rem 0;
        font-style: italic;
        color: hsl(var(--foreground) / 0.8);
      }
      .rich-content img {
        border-radius: 0.75rem;
        margin: 1.5em 0;
        max-width: 100%;
        height: auto;
      }
      .rich-content hr {
        margin: 2em 0;
        border: none;
        border-top: 1px solid hsl(var(--border));
      }
      .rich-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        font-size: 0.9375rem;
      }
      .rich-content th, .rich-content td {
        border: 1px solid hsl(var(--border));
        padding: 0.6em 0.9em;
        text-align: left;
      }
      .rich-content th {
        background: hsl(var(--muted));
        font-weight: 600;
      }
      .rich-content code {
        background: hsl(var(--muted));
        padding: 0.15em 0.4em;
        border-radius: 0.25rem;
        font-size: 0.875em;
      }
      .rich-content pre {
        background: hsl(var(--muted));
        padding: 1em;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1.5em 0;
      }
      .rich-content pre code { background: none; padding: 0; }
      .rich-content > *:first-child { margin-top: 0; }
      .rich-content > *:last-child { margin-bottom: 0; }
    `}</style>
    <div
      className="rich-content max-w-none text-base"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </>
);

/* ---------------------------------- */
/*  Main Page                         */
/* ---------------------------------- */
const Details = () => {
  const { id } = useParams();
  const {
    data: fetchItems,
    isLoading: fetchItemsLoading,
    error: fetchItemsError,
  } = useApiQuery({
    url: `/module-item-details/${id}`,
    queryKey: ["module-item-details", id],
    enabled: !!id,
  });

  const item = fetchItems?.data;

  /* -------- loading -------- */
  if (fetchItemsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DetailsHeroSkeleton />
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </main>
      </div>
    );
  }

  /* -------- error / not found -------- */
  if (fetchItemsError || !item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="font-semibold text-foreground">
            Content not found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  /* -------- content -------- */
  return (
    <div className="min-h-screen bg-background">
      <SeoHead item={item} />
      <DetailsHero item={item} />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* featured image */}
        {item?.image_full_path && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative -mt-20 mb-10 overflow-hidden rounded-2xl border border-border shadow-xl sm:-mt-24"
          >
            <img
              src={item.image_full_path}
              alt={item.title}
              className="aspect-video w-full object-cover"
            />
          </motion.div>
        )}

        {/* sub description as lead paragraph */}
        {item?.sub_description &&
          item.sub_description !== item.title &&
          item.sub_description !== item.sub_title && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-lg font-medium leading-relaxed text-foreground/90"
            >
              {item.sub_description}
            </motion.p>
          )}

        {/* rich description (HTML from backend) */}
        {item?.description && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RichTextContent html={item.description} />
          </motion.div>
        )}

        {/* back link */}
        <div className="mt-12 border-t border-border pt-6">
          <Button
            asChild
            variant="ghost"
            className="gap-2 px-0 hover:bg-transparent hover:text-primary"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              View All
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Details;