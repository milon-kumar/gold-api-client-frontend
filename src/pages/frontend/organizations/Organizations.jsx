import React from "react";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";
import { useApiQuery } from "@/hooks/useAppQuery";
import { MODULES } from "@/store/default/modules";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, ArrowRight, Star, AlertCircle } from "lucide-react";
import { useLocation } from "react-router";

/* ---------------------------------- */
/*  Hero Right Slot — Stat Card       */
/* ---------------------------------- */
const OrgStatCard = ({ total }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
      <Building2 className="h-6 w-6 text-emerald-400" />
    </div>
    <div>
      <p className="text-2xl font-bold leading-none text-white">{total}</p>
      <p className="font-bengali mt-1.5 text-sm text-slate-400">
        অঙ্গসংগঠন ও প্রতিষ্ঠান
      </p>
    </div>
  </div>
);

/* ---------------------------------- */
/*  Organization Card (alternating)   */
/* ---------------------------------- */
const OrganizationCard = ({ org, index }) => {
  const isReversed = index % 2 === 1;

  return (
    <article
      className={`group grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${isReversed ? "" : ""
        }`}
    >
      {/* image */}
      <div className={`relative ${isReversed ? "lg:order-2" : "lg:order-1"}`}>
        {/* offset frame behind image */}
        <div
          className={`absolute -bottom-3 h-full w-full rounded-2xl border-2 border-emerald-200 ${isReversed ? "-left-3" : "-right-3"
            }`}
        />
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-lg">
          <img
            src={org?.image_full_path}
            alt={org?.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {org?.is_featured === 1 && (
            <Badge className="font-bengali absolute left-4 top-4 gap-1 border-none bg-amber-400/95 text-amber-950 hover:bg-amber-400">
              <Star className="h-3 w-3 fill-current" />
              বিশেষ
            </Badge>
          )}
        </div>
      </div>

      {/* content */}
      <div className={isReversed ? "lg:order-1" : "lg:order-2"}>
        {org?.sub_title && (
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-bengali text-sm font-semibold text-primary">
              {org.sub_title}
            </span>
          </div>
        )}

        <h2 className="font-bengali text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-3xl">
          {org?.title}
        </h2>

        {org?.sub_description && (
          <p className="font-bengali mt-4 line-clamp-4 text-base leading-relaxed text-muted-foreground">
            {org.sub_description}
          </p>
        )}

        <Button
          asChild
          variant="outline"
          className="font-bengali group/btn mt-6 gap-2 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <a href={`/organizations/${org?.slug}`}>
            বিস্তারিত দেখুন
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </div>
    </article>
  );
};

/* ---------------------------------- */
/*  Loading Skeleton                  */
/* ---------------------------------- */
const OrganizationCardSkeleton = ({ index }) => {
  const isReversed = index % 2 === 1;
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <Skeleton
        className={`aspect-[16/10] w-full rounded-2xl ${isReversed ? "lg:order-2" : "lg:order-1"
          }`}
      />
      <div className={isReversed ? "lg:order-1" : "lg:order-2"}>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-8 w-3/4" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-6 h-10 w-40 rounded-full" />
      </div>
    </div>
  );
};

const defaultHeroContent = {
  variant: "gradient",
  badge: "Our Network",
  title: "Our",
  subTitle: "Organizations",
  description:
    "Explore the institutions and organizations that work alongside us to promote education, community development, and humanitarian initiatives.",
};

/* ---------------------------------- */
/*  Main Page                         */
/* ---------------------------------- */
const Organizations = () => {
  const { pathname } = useLocation()
  const slug = pathname.split("/").filter(Boolean).pop();


  const {
    data: organizationItemQuery,
    isLoading: organizationItemLoading,
    error: organizationItemError,
  } = useApiQuery({
    url: "/module-items",
    queryKey: [MODULES.ORGANIZATIONS],
    params: {
      module_slug: MODULES.ORGANIZATIONS,
      limit: 3,
    },
  });
  const { data: getPageResponse, isLoading, refetch } = useApiQuery({
    url: `/page-by-slug/${slug}`,
    enabled: !!slug,
  });

  const page = getPageResponse?.data
  const meta = page?.meta ? JSON.parse(page.meta) : {};
  const organizationItems = organizationItemQuery?.data;

  return (
    <div className="min-h-screen bg-background">
      <PageHeroRenderer
        variant={meta?.headerTemplate ?? defaultHeroContent.variant}
        eyebrow={meta?.heroContent?.badge ?? defaultHeroContent.badge}
        title={meta?.heroContent?.title ?? defaultHeroContent.title}
        highlight={meta?.heroContent?.heightlight ?? defaultHeroContent.subTitle}
        description={
          meta?.heroContent?.description ?? defaultHeroContent.description
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          {
            label:slug
          },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {/* error state */}
        {organizationItemError && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-bengali font-semibold text-foreground">
              তথ্য লোড করা যায়নি
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
        {organizationItemLoading && (
          <div className="space-y-16 lg:space-y-24">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrganizationCardSkeleton key={i} index={i} />
            ))}
          </div>
        )}

        {/* empty state */}
        {!organizationItemLoading &&
          !organizationItemError &&
          !organizationItems?.length && (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-bengali font-semibold text-foreground">
                কোনো সংগঠন পাওয়া যায়নি
              </h3>
              <p className="font-bengali mt-1 text-sm text-muted-foreground">
                এই মুহূর্তে কোনো সংগঠনের তথ্য যুক্ত করা হয়নি।
              </p>
            </div>
          )}

        {/* organizations list — alternating feature rows */}
        {!organizationItemLoading && organizationItems?.length > 0 && (
          <div className="space-y-16 lg:space-y-24">
            {organizationItems.map((org, i) => (
              <OrganizationCard key={org.id} org={org} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Organizations;
