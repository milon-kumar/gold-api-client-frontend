import React from "react";
import { useApiQuery } from "@/hooks/useAppQuery";
import { MODULES } from "@/store/default/modules";
import { Mail, Phone, BookOpen, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";
import { useLocation } from "react-router";

/* =====================================================================
   Helpers
===================================================================== */

// description er "\n\n" block gulo ke section e bhaage.
// "শিক্ষা :" / "কর্মজীবন :" er moto line gulo heading hishebe detect kore.
const parseDescription = (text = "") => {
  const blocks = text
    .split(/\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block) => ({
    isHeading: block.length <= 60 && /[:：]\s*$/.test(block),
    text: block.replace(/[:：]\s*$/, ""),
    raw: block,
  }));
};

// numbered list line detect ("১. ..." / "1. ...")
const isListLine = (t) => /^[০-৯0-9]+[.।]\s/.test(t);

/* =====================================================================
   Skeleton (loading)
===================================================================== */
const AboutSkeleton = () => (
  <div className="mx-auto max-w-7xl animate-pulse px-4 py-20">
    <div className="mx-auto mb-14 h-8 w-72 rounded-full bg-slate-200" />
    <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
      <div className="aspect-[3/4] rounded-3xl bg-slate-200" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-slate-200"
            style={{ width: `${90 - i * 6}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

/* =====================================================================
   Sub components
===================================================================== */

const SectionBadge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
    {children}
  </span>
);

/* ---- President profile card (sticky, left side) ---- */
const PresidentCard = ({ content }) => (
  <div className="lg:sticky lg:top-24">
    <div className="group relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-slate-900/20">
      {content?.image_full_path ? (
        <img
          src={content.image_full_path}
          alt={content?.title || ""}
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-slate-500">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </div>
      )}
      {/* <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 pt-16 text-white">
        <span className="mb-2 block h-0.5 w-10 rounded-full bg-primary transition-all duration-300 group-hover:w-16" />
        <h3 className="text-lg font-bold leading-snug">
          ড. মুহাম্মাদ আসাদুল্লাহ আল-গালিব
        </h3>
        <p className="mt-1 text-sm text-white/80">
          প্রতিষ্ঠাতা ও আমীর — আহলেহাদীছ আন্দোলন বাংলাদেশ
        </p>
      </div> */}
    </div>
  </div>
);

/* ---- Biography body (right side) ---- */
const Biography = ({ content }) => {
  return (
    <div>
      {/* intro / short description */}
      {content?.short_description && (
        <div className="relative mb-10 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6 md:p-8">
          <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
          <div
            className="prose prose-sm max-w-none leading-relaxed text-slate-600 md:prose-base [&_br]:mb-2"
            dangerouslySetInnerHTML={{ __html: content.short_description }}
          />
        </div>
      )}

      {/* full biography, section-wise */}
      <div className="space-y-4">
        <p dangerouslySetInnerHTML={{ __html: content?.description }} />
      </div>
    </div>
  );
};

/* ---- Staff card ---- */
const StaffCard = ({ staff }) => (
  <div className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10">
    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {staff?.avatar_full_path ? (
        <img
          src={staff.avatar_full_path}
          alt={staff?.name || ""}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-16 w-16 text-slate-300"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </div>
      )}

      {/* hover contact overlay */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
        {staff?.email && (
          <a
            href={`mailto:${staff.email}`}
            aria-label={`Email ${staff.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 transition-colors hover:bg-primary hover:text-white"
          >
            <Mail className="h-4 w-4" />
          </a>
        )}
        {staff?.phone && (
          <a
            href={`tel:${staff.phone}`}
            aria-label={`Call ${staff.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 transition-colors hover:bg-primary hover:text-white"
          >
            <Phone className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>

    <div className="p-5">
      <h3 className="font-semibold leading-snug text-slate-900">
        {staff?.name}
      </h3>
      {staff?.meta?.position && (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
          {staff.meta.position}
        </p>
      )}
      <span className="mx-auto mt-3 block h-0.5 w-8 rounded-full bg-slate-200 transition-all duration-300 group-hover:w-14 group-hover:bg-primary" />
    </div>
  </div>
);

/* =====================================================================
   Main
===================================================================== */
const AboutUs = () => {
  const { pathname } = useLocation()
  const slug = pathname.split("/").filter(Boolean).pop();

  const {
    data: foundingPresidentQuery,
    isLoading: foundingPresidentModuleLoading,
  } = useApiQuery({
    url: "/module",
    queryKey: slug,
    params: { module_slug: slug },
  });

  const foundingPresidentContent = foundingPresidentQuery?.data;

  const { data: staffItemQuery, isLoading: staffItemLoading } = useApiQuery({
    url: "/staffs",
    queryKey: ["staffs"],
    params: { limit: 6 },
  });

  const { data: getPageResponse, isLoading, refetch } = useApiQuery({
    url: `/page-by-slug/${slug}`,
    enabled: !!slug,
  });

  const page = getPageResponse?.data
  const meta = page?.meta ? JSON.parse(page.meta) : {};

  const staffItems = staffItemQuery?.data;

  if (foundingPresidentModuleLoading) return <AboutSkeleton />;

  return (
    <div className="bg-white">
      <PageHeroRenderer
        variant={meta?.headerTemplate ?? "gradient"}
        eyebrow={meta?.heroContent?.badge ?? "About Us"}
        title={meta?.heroContent?.title ?? "About Us"}
        highlight={meta?.heroContent?.heightlight ?? "Learn More About Our Organization"}
        description={
          meta?.heroContent?.description ??
          "Discover our mission, vision, values, and the journey that drives us to serve our community with excellence."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: slug ?? "About Us" },
        ]}
      />
      {/* ============ PRESIDENT PROFILE ============ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:gap-16">
            <PresidentCard content={foundingPresidentContent} />
            <Biography content={foundingPresidentContent} />
          </div>
        </div>
      </section>

      {/* ============ STAFF / নেতৃবৃন্দ ============ */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <SectionBadge>নেতৃবৃন্দ</SectionBadge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              আমাদের দায়িত্বশীলগণ
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              সংগঠনের পথচলায় যাঁরা বিভিন্ন দায়িত্বে নিয়োজিত আছেন
            </p>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-primary/30" />
          </div>

          {staffItemLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : staffItems?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {staffItems.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">
              No staff members found
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;