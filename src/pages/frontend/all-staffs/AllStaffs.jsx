import React from "react";
import { useApiQuery } from "@/hooks/useAppQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Users, AlertCircle, ChevronRight } from "lucide-react";
import PageHeroRenderer from "@/components/renderers/PageHeroRenderer";
import { useLocation } from "react-router";

/* ---------------------------------- */
/*  Staff Card                        */
/* ---------------------------------- */
const StaffCard = ({ staff }) => {
  const initials = staff?.name?.trim()?.charAt(0) || "?";

  return (
    <Card className="group relative overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/60">
      {/* top accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-emerald-400/30 to-amber-300/30 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Avatar className="relative h-24 w-24 border-4 border-white shadow-lg ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-105">
            <AvatarImage
              src={staff?.avatar_full_path}
              alt={staff?.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-emerald-50 text-2xl font-semibold text-emerald-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-slate-900">
          {staff?.name}
        </h3>

        {staff?.meta?.position && (
          <Badge
            variant="secondary"
            className="mt-2 border-emerald-100 bg-emerald-50 font-medium text-emerald-700 hover:bg-emerald-100"
          >
            {staff.meta.position}
          </Badge>
        )}

        <div className="mt-5 w-full border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-2 text-sm">
            {staff?.email && (
              <a
                href={`mailto:${staff.email}`}
                className="flex items-center justify-center gap-2 text-slate-500 transition-colors hover:text-emerald-600"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{staff.email}</span>
              </a>
            )}
            {staff?.phone && (
              <a
                href={`tel:${staff.phone}`}
                className="flex items-center justify-center gap-2 text-slate-500 transition-colors hover:text-emerald-600"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{staff.phone}</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ---------------------------------- */
/*  Loading Skeleton                  */
/* ---------------------------------- */
const StaffCardSkeleton = () => (
  <Card className="border-slate-200">
    <CardContent className="flex flex-col items-center p-6">
      <Skeleton className="mb-4 h-24 w-24 rounded-full" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-2 h-5 w-24 rounded-full" />
      <div className="mt-5 w-full border-t border-slate-100 pt-4">
        <Skeleton className="mx-auto h-4 w-44" />
        <Skeleton className="mx-auto mt-2 h-4 w-32" />
      </div>
    </CardContent>
  </Card>
);

/* ---------------------------------- */
/*  Main Page                         */
/* ---------------------------------- */
const AllStaffs = () => {
  const { pathname } = useLocation()
  const slug = pathname.split("/").filter(Boolean).pop();



  const {
    data: staffItemQuery,
    isLoading: staffItemLoading,
    error: staffItemError,
  } = useApiQuery({
    url: "/staffs",
    queryKey: ["staffs"],
    params: {
      limit: 6,
    },
  });

  const staffItems = staffItemQuery?.data;
  const { data: getPageResponse, isLoading, refetch } = useApiQuery({
    url: `/page-by-slug/${slug}`,
    enabled: !!slug,
  });

  const page = getPageResponse?.data
  const meta = page?.meta ? JSON.parse(page.meta) : {};
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeroRenderer
        variant={meta?.headerTemplate ?? "gradient"}
        eyebrow={meta?.heroContent?.badge ?? "Our Team"}
        title={meta?.heroContent?.title ?? "Meet Our"}
        highlight={meta?.heroContent?.heightlight ?? "Dedicated Staff"}
        description={
          meta?.heroContent?.description ??
          "Get to know the dedicated professionals and team members who work tirelessly to support our mission, serve the community, and drive our organization forward."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Team" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* error state */}
        {staffItemError && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-slate-900">
              তথ্য লোড করা যায়নি
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              সার্ভারের সাথে সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              আবার চেষ্টা করুন
            </Button>
          </div>
        )}

        {/* loading state */}
        {staffItemLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StaffCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* empty state */}
        {!staffItemLoading && !staffItemError && !staffItems?.length && (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900">
              কোনো কর্মকর্তা পাওয়া যায়নি
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              এই মুহূর্তে কোনো কর্মকর্তার তথ্য যুক্ত করা হয়নি।
            </p>
          </div>
        )}

        {/* staff grid */}
        {!staffItemLoading && staffItems?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staffItems.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllStaffs;
