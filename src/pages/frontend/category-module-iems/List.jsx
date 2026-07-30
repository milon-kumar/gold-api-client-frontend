import React from "react";
import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Tag,
  Star,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/* ---------------------------------- */
/*  Helpers                           */
/* ---------------------------------- */
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
/*  Dynamic SEO Head (category level) */
/* ---------------------------------- */
const SeoHead = ({ category }) => {
  const title = category?.name ? `${category.name}` : "Category";
  const description = category?.description || category?.name || "";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {category?.image_full_path && (
        <meta property="og:image" content={category.image_full_path} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

/* ---------------------------------- */
/*  Hero (matches the gradient        */
/*  design system)                    */
/* ---------------------------------- */
const CategoryHero = ({ category, total }) => (
  <section className="relative overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
    <div className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      {/* breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-emerald-400">{category?.name}</span>
      </nav>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {category?.type && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium capitalize text-emerald-300">
              <Tag className="h-4 w-4" />
              {category.type}
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {category?.name}
          </h1>
          {category?.description && (
            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
              {category.description}
            </p>
          )}
        </div>

        {typeof total === "number" && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20">
              <FolderOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none text-white">
                {total}
              </p>
              <p className="mt-1 text-xs text-slate-400">Total Items</p>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
  </section>
);

/* ---------------------------------- */
/*  Hero Skeleton                     */
/* ---------------------------------- */
const CategoryHeroSkeleton = () => (
  <section className="relative overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <Skeleton className="h-4 w-40 bg-white/10" />
      <Skeleton className="mt-6 h-6 w-28 rounded-full bg-white/10" />
      <Skeleton className="mt-4 h-10 w-2/3 bg-white/10" />
      <Skeleton className="mt-4 h-5 w-1/2 bg-white/10" />
    </div>
  </section>
);

/* ---------------------------------- */
/*  Module Item Card                  */
/* ---------------------------------- */
const ItemCard = ({ item, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
  >
    <Link
      to={`/details/${item.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* image */}
      <div className="relative aspect-video overflow-hidden">
        {item?.image_full_path ? (
          <img
            src={item.image_full_path}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {item?.is_featured === 1 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-semibold text-amber-950">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        )}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {item?.title}
        </h3>

        {item?.sub_title && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {item.sub_title}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-5">
          {item?.created_at ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(item.created_at)}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Read more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  </motion.article>
);

/* ---------------------------------- */
/*  Loading Skeleton                  */
/* ---------------------------------- */
const ItemCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <Skeleton className="aspect-video w-full rounded-none" />
    <div className="p-5">
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <Skeleton className="mt-5 h-4 w-24" />
    </div>
  </div>
);

/* ---------------------------------- */
/*  Main Page                         */
/* ---------------------------------- */
const List = () => {
  const { slug } = useParams();
  const {
    data: fetchCategoryModuleItems,
    isLoading,
    error,
  } = useApiQuery({
    url: `/category-module-items/${slug}`,
    queryKey: ["category-module-items", slug],
    enabled: !!slug,
  });

  const category = fetchCategoryModuleItems?.data;
  const items = category?.module_items;

  /* -------- loading -------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <CategoryHeroSkeleton />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* -------- error / not found -------- */
  if (error || !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="font-semibold text-foreground">Category not found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The category you're looking for doesn't exist or has been
            removed.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead category={category} />
      <CategoryHero category={category} total={items?.length} />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* empty state */}
        {!items?.length && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">
              No items found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are no items in this category yet.
            </p>
          </div>
        )}

        {/* items grid */}
        {items?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default List;