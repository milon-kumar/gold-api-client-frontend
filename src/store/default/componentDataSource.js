/**
 * =====================================================================
 * DATA SOURCES REGISTRY
 * =====================================================================
 * আপনার existing CRUD module-গুলোকে (Slider, Information, Image, Video,
 * Organization, Activity) Page Builder-এর সাথে connect করার config।
 *
 * ⚠️ শুধু ৩টি জিনিস আপনার API অনুযায়ী adjust করুন:
 *    1) url        → আপনার list endpoint
 *    2) getItems   → response থেকে array বের করার path
 *    3) mapItem    → আপনার DB field → builder-এর content field mapping
 *
 * নতুন Data Source যোগ করতে: এখানে একটি object যোগ করুন — ব্যস।
 * Builder-এর আর কোথাও হাত দিতে হবে না।
 *
 * mapItem যে shape return করে সেখান থেকে শুধুমাত্র selected template-এর
 * field-গুলোই নেওয়া হয় (extra key automatically বাদ পড়ে)। তাই একটি
 * source একাধিক template-এ ব্যবহার করা যায়।
 * =====================================================================
 */

import { MODULES } from "@/store/default/modules";

export const DATA_SOURCES = {
  /* ---------------- Slider CRUD ---------------- */
  slider: {
    label: "Slider",
    url: `/admin/business-module-items?module_slug=${MODULES.SLIDERS}`, // ⚠️ আপনার endpoint
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title", // list-এ যে field টা দেখাবে
      imageKey: "image_full_path", // thumbnail (optional)
      subtitleKey: "subtitle", // optional
    },
    // Slider record → slide/content shape
    mapItem: (item) => ({
      title: item.title || "",
      subtitle: item.subtitle || "",
      image: item.image_full_path || "",
      buttonText: item.button_text || "",
      buttonLink: item.button_link || "",
    }),
  },

  /* ---------------- Information CRUD (৪টি record) ---------------- */
  information: {
    label: "Introduction",
    url: `/admin/business-modules-by-slugs?module_slugs=[${MODULES.PRESIDENT_MESSAGE},${MODULES.INTRODUCTION},${MODULES.WHAT_WE_WANT},${MODULES.FOUNDING_PRESIDENT}]`, // ⚠️ আপনার endpoint
    getItems: (response) => response?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      // simple / modern / imageLeft / imageRight টেমপ্লেটের জন্য
      title: item.title || "",
      description: item.description || "",
      image: item.image_full_path || "",
      badge: item.badge || "",
      // founder টেমপ্লেটের জন্য (same source, ভিন্ন key —
      // template অনুযায়ী যেটা লাগবে সেটাই বসবে)
      founderName: item.name || item.title || "",
      founderImage: item.image || "",
      message: item.description || "",
      designation: item.designation || "",
    }),
  },

  /* ---------------- Get Staffs ---------------- */
  staff: {
    label: "Staff",
    url: `/admin/staffs`,
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "name",
      imageKey: "avatar_full_path",
      subtitleKey: "email",
    },
    mapItem: (item) => ({
      title: item.name || "",
      caption: item.title || "",
      image: item.avatar_full_path || item.url || "",
      description: item.description || "",
    }),
  },
  /* ---------------- Get ORGANIZATIONS ---------------- */
  organization: {
    label: "Organization",
    url: `/admin/business-module-items?module_slug=${MODULES.ORGANIZATIONS}`,
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },

  categories:  {
    label: "Image Category",
    url: `/admin/business-module-item-categories?module_slug=${MODULES.PHOTOS}`,
    params:{
      is_featured: true,
      status: "active"
    },
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "name",
      imageKey: "image_full_path",
      subtitleKey: "type",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },
  /* ---------------- List CRUDs ---------------- */
  photo: {
    label: "Image",
    url: `/admin/business-module-items?module_slug=${MODULES.PHOTOS}`,
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },

  images: {
    label: "Image",
    url: `/admin/business-module-items?module_slug=${MODULES.PHOTOS}`, // ⚠️
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },
  /* ---------------- List ANNUAL_PLANS ---------------- */
  anual_plan: {
    label: "Annual Plans",
    url: `/admin/business-module-items?module_slug=${MODULES.ANNUAL_PLANS}`, // ⚠️
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },
  /* ---------------- List REGULAR_ACTIVITIES ---------------- */
  regular_activities: {
    label: "Regular Activities",
    url: `/admin/business-module-items?module_slug=${MODULES.REGULAR_ACTIVITIES}`, // ⚠️
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },
  /* ---------------- List REGULAR_ACTIVITIES ---------------- */
  archives: {
    label: "Archives",
    url: `/admin/business-module-items?module_slug=${MODULES.ARCHIVES}`, // ⚠️
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },
  video: {
    label: "Video",
    url: `/admin/business-module-items?module_slug=${MODULES.VIDEOS}`, // ⚠️
    getItems: (response) => response?.data?.data || [],
    display: {
      titleKey: "title",
      imageKey: "image_full_path",
      subtitleKey: "sub_title",
    },
    mapItem: (item) => ({
      title: item.title || "",
      sub_title: item?.sub_title || "",
      sub_description: item?.sub_description,
      description: item.description || "",
      image: item.image_full_path || item.image || "",
    }),
  },

  activity: {
    label: "Activity",
    url: `/admin/business-module-items?module_slug=${MODULES.SOCIAL_ACTIVITIES}`, // ⚠️
    getItems: (response) => response?.data || [],
    display: { titleKey: "title", imageKey: "image" },
    mapItem: (item) => ({
      title: item.title || "",
      image: item.image_full_path || "",
      description: item.description || "",
      excerpt: item.description || "",
      date: item.date || item.created_at || "",
      link: item.link || "#",
    }),
  },
  news: {
    label: "Activity",
    url: `/admin/business-module-items?module_slug=${MODULES.SOCIAL_ACTIVITIES}`, // ⚠️
    getItems: (response) => [],
    display: { titleKey: "title", imageKey: "image" },
    mapItem: (item) => ({
      title: item.title || "",
      image: item.image_full_path || "",
      description: item.description || "",
      excerpt: item.description || "",
      date: item.date || item.created_at || "",
      link: item.link || "#",
    }),
  },
};

export const getDataSource = (key) => DATA_SOURCES[key] || null;

export const getDataSourceOptions = (keys = []) =>
  keys
    ?.filter((key) => DATA_SOURCES[key])
    ?.map((key) => ({ value: key, label: DATA_SOURCES[key].label }));
