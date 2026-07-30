import React from "react";
import { Helmet } from "react-helmet-async";

const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_URL || "";

export const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return `${STORAGE_BASE_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};

export const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").trim();

const SEO = ({
  title,
  description,
  keywords,
  robots = "index, follow",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  type = "article",
  siteName,
}) => {
  const resolvedOgImage = resolveImageUrl(ogImage);
  const resolvedTwitterImage = resolveImageUrl(twitterImage || ogImage);
  const resolvedUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      {resolvedUrl && <link rel="canonical" href={resolvedUrl} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {resolvedOgImage && <meta property="og:image" content={resolvedOgImage} />}
      {resolvedUrl && <meta property="og:url" content={resolvedUrl} />}
      {siteName && <meta property="og:site_name" content={siteName} />}

      <meta name="twitter:card" content={resolvedTwitterImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      {resolvedTwitterImage && <meta name="twitter:image" content={resolvedTwitterImage} />}
    </Helmet>
  );
};

export default SEO;