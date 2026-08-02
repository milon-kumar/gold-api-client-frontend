import React from "react";
import { Mail, Phone, MapPin, Blocks } from "lucide-react";

import { cn } from "@/lib/utils";
import { FiFacebook, FiYoutube, FiLinkedin, FiInstagram } from "react-icons/fi";

/**
 * Footer (Preview)
 * Renders a footer from the footer builder API data:
 * - columns[] (sorted by sort_order), each with a type:
 *     "about"   -> logo + about text        (config: logo, show_logo, about_text)
 *     "links"   -> list of page links       (links[])
 *     "contact" -> email / phone / location (config with show_* flags)
 *     "social"  -> social platform buttons  (config with enabled/url per platform)
 *     "custom_text" -> free text
 * - copyright_text -> bottom bar
 * - meta.theme -> one of: gradient | editorial | wave | minimal | split | aurora
 *   (same 6 identities as PageHeroRenderer — same data, different look)
 */

// "home" | "page/about" | "https://..." -> proper href
const resolveUrl = (url) => {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith("/") ? url : `/${url}`;
};

const sortByOrder = (arr = []) =>
  [...arr].sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0));

// logo path may be relative ("uploads/...") or full path may come separately
const resolveLogo = (column) => {
  if (column?.logo_full_path) return column.logo_full_path;
  const logo = column?.config?.logo;
  if (!logo) return null;
  if (/^https?:\/\//i.test(logo)) return logo;
  return `/${logo.replace(/^\/+/, "")}`;
};

/* ==================================================================
   Theme tokens — one entry per footer theme.
   Every column renderer reads colors from here instead of hardcoding
   them, so the exact same data can be shown in 6 different looks.
================================================================== */
const THEMES = {
  gradient: {
    footerBg: "bg-slate-950",
    heading: "text-white",
    body: "text-slate-400",
    muted: "text-slate-500",
    linkHover: "hover:text-emerald-300",
    accentLine: "bg-gradient-to-r from-emerald-400 to-amber-300",
    diamond: "bg-gradient-to-br from-emerald-400 to-amber-300",
    iconIdle: "border-white/5 bg-emerald-500/10 text-emerald-400",
    iconHover: "group-hover:border-emerald-400/30 group-hover:bg-emerald-500/20",
    socialIdle: "border-white/10 bg-white/5 text-slate-400",
    borderTop: "border-white/10",
    copyrightBg: "bg-slate-950/50",
    copyrightText: "text-slate-500",
    copyrightAccent:
      "bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent",
  },
  editorial: {
    footerBg: "bg-[#f9fbf9]",
    heading: "text-slate-900",
    body: "text-slate-600",
    muted: "text-slate-400",
    linkHover: "hover:text-emerald-700",
    accentLine: "bg-gradient-to-r from-emerald-600 to-amber-500",
    diamond: "bg-gradient-to-br from-emerald-600 to-amber-500",
    iconIdle: "border-emerald-100 bg-emerald-50 text-emerald-700",
    iconHover: "group-hover:border-emerald-300 group-hover:bg-emerald-100",
    socialIdle: "border-slate-200 bg-white text-slate-500",
    borderTop: "border-slate-200",
    copyrightBg: "bg-white/70",
    copyrightText: "text-slate-400",
    copyrightAccent: "text-emerald-700 font-medium",
  },
  wave: {
    footerBg: "bg-gradient-to-br from-emerald-800 to-teal-950",
    heading: "text-white",
    body: "text-emerald-100/75",
    muted: "text-emerald-200/50",
    linkHover: "hover:text-amber-300",
    accentLine: "bg-gradient-to-r from-amber-300 to-emerald-200",
    diamond: "bg-gradient-to-br from-amber-300 to-emerald-200",
    iconIdle: "border-white/10 bg-white/10 text-amber-200",
    iconHover: "group-hover:border-amber-300/30 group-hover:bg-white/20",
    socialIdle: "border-white/10 bg-white/10 text-emerald-100",
    borderTop: "border-white/10",
    copyrightBg: "bg-black/10",
    copyrightText: "text-emerald-200/60",
    copyrightAccent: "text-amber-300 font-medium",
  },
  minimal: {
    footerBg: "bg-white",
    heading: "text-slate-800",
    body: "text-slate-500",
    muted: "text-slate-400",
    linkHover: "hover:text-slate-900",
    accentLine: "bg-slate-300",
    diamond: "bg-slate-400",
    iconIdle: "border-slate-100 bg-slate-50 text-slate-600",
    iconHover: "group-hover:border-slate-300 group-hover:bg-slate-100",
    socialIdle: "border-slate-200 bg-slate-50 text-slate-500",
    borderTop: "border-slate-100",
    copyrightBg: "bg-white",
    copyrightText: "text-slate-400",
    copyrightAccent: "text-slate-700 font-medium",
  },
  split: {
    footerBg: "bg-slate-900",
    heading: "text-white",
    body: "text-slate-400",
    muted: "text-slate-500",
    linkHover: "hover:text-amber-300",
    accentLine: "bg-gradient-to-r from-amber-300 to-emerald-400",
    diamond: "bg-gradient-to-br from-amber-300 to-emerald-400",
    iconIdle: "border-white/10 bg-white/5 text-amber-300",
    iconHover: "group-hover:border-amber-300/30 group-hover:bg-white/10",
    socialIdle: "border-white/10 bg-white/5 text-slate-400",
    borderTop: "border-white/10",
    copyrightBg: "bg-slate-950/40",
    copyrightText: "text-slate-500",
    copyrightAccent: "text-amber-300 font-medium",
    panelHighlight:
      "rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-5",
  },
  aurora: {
    footerBg: "bg-[#0b1120]",
    heading: "text-white",
    body: "text-slate-400",
    muted: "text-slate-500",
    linkHover: "hover:text-cyan-300",
    accentLine: "bg-gradient-to-r from-cyan-400 to-emerald-400",
    diamond: "bg-gradient-to-br from-cyan-400 to-emerald-400",
    iconIdle: "border-white/5 bg-cyan-500/10 text-cyan-300",
    iconHover: "group-hover:border-cyan-400/30 group-hover:bg-cyan-500/20",
    socialIdle: "border-white/10 bg-white/5 text-slate-400",
    borderTop: "border-white/10",
    copyrightBg: "bg-black/20",
    copyrightText: "text-slate-500",
    copyrightAccent:
      "bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent",
  },
};

const getTheme = (theme) => THEMES[theme] || THEMES.gradient;

/* ==================================================================
   Decorative background layers — one per theme, purely visual
================================================================== */
const GradientLayers = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage:
          "radial-gradient(ellipse 90% 90% at 50% 0%, black, transparent)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 90% at 50% 0%, black, transparent)",
      }}
    />
    <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
    <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
  </>
);

const EditorialLayers = () => (
  <div
    className="absolute inset-0 opacity-[0.35]"
    style={{
      backgroundImage: "radial-gradient(#d7e2dc 1px, transparent 1px)",
      backgroundSize: "18px 18px",
    }}
  />
);

const WaveLayers = () => (
  <>
    <svg
      className="absolute inset-x-0 top-0 h-14 w-full text-emerald-800/60"
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
    >
      <path d="M0,20 C100,40 300,0 400,20 L400,0 L0,0 Z" fill="currentColor" />
    </svg>
    <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />
  </>
);

const AuroraLayers = () => (
  <>
    <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
    <div className="absolute right-0 -bottom-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
    <span className="absolute right-16 top-10 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
  </>
);

const THEME_LAYERS = {
  gradient: GradientLayers,
  editorial: EditorialLayers,
  wave: WaveLayers,
  minimal: null,
  split: null,
  aurora: AuroraLayers,
};

/* ---------------- Shared: column heading ---------------- */
const ColumnHeading = ({ t, children }) => (
  <div className="mb-5 flex items-center gap-2.5">
    <span className={cn("h-px w-6", t.accentLine)} />
    <h4
      className={cn(
        "font-bengali text-sm font-semibold uppercase tracking-wider",
        t.heading,
      )}
    >
      {children}
    </h4>
  </div>
);

/* ---------------- Column: About ---------------- */
const AboutColumn = ({ column, t }) => {
  const config = column?.config || {};
  const logoSrc = resolveLogo(column);

  return (
    <div>
      {config.show_logo && logoSrc && (
        <img
          src={logoSrc}
          alt={column?.title || "logo"}
          className="mb-5 h-12 w-auto object-contain"
        />
      )}
      {config.about_text && (
        <p className={cn("font-bengali text-sm leading-relaxed", t.body)}>
          {config.about_text}
        </p>
      )}
      <div className="mt-5 flex items-center gap-2">
        <span className={cn("h-px w-8", t.borderTop)} />
        <span className={cn("h-1.5 w-1.5 rotate-45", t.diamond)} />
        <span className={cn("h-px w-8", t.borderTop)} />
      </div>
    </div>
  );
};

/* ---------------- Column: Links ---------------- */
const LinksColumn = ({ column, t }) => (
  <div>
    <ColumnHeading t={t}>{column?.title}</ColumnHeading>
    <ul className="space-y-2.5">
      {sortByOrder(column?.links).map((link) => (
        <li key={link.id}>
          <a
            href={resolveUrl(link.url)}
            target={link.target || "_self"}
            className={cn(
              "font-bengali group inline-flex items-center gap-2.5 text-sm transition-colors",
              t.body,
              t.linkHover,
            )}
          >
            <span
              className={cn(
                "h-1 w-1 flex-shrink-0 rotate-45 transition-transform group-hover:scale-150",
                t.diamond,
              )}
            />
            <span className="transition-transform group-hover:translate-x-0.5">
              {link.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

/* ---------------- Column: Contact ---------------- */
const ContactColumn = ({ column, t }) => {
  const config = column?.config || {};

  const rows = [
    config.show_location &&
      config.location && {
        icon: MapPin,
        content: (
          <span className={cn("font-bengali text-sm leading-relaxed", t.body)}>
            {config.location}
          </span>
        ),
        key: "location",
      },
    config.show_phone &&
      config.phone && {
        icon: Phone,
        content: (
          <a
            href={`tel:${config.phone}`}
            className={cn("font-bengali text-sm transition-colors", t.body, t.linkHover)}
          >
            {config.phone}
          </a>
        ),
        key: "phone",
      },
    config.show_email &&
      config.email && {
        icon: Mail,
        content: (
          <a
            href={`mailto:${config.email}`}
            className={cn("text-sm transition-colors", t.body, t.linkHover)}
          >
            {config.email}
          </a>
        ),
        key: "email",
      },
  ].filter(Boolean);

  return (
    <div>
      <ColumnHeading t={t}>{column?.title}</ColumnHeading>
      <ul className="space-y-3">
        {rows.map(({ icon: Icon, content, key }) => (
          <li key={key} className="group flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-colors",
                t.iconIdle,
                t.iconHover,
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ---------------- Column: Social ---------------- */
const SOCIAL_PLATFORMS = [
  {
    key: "facebook_link",
    icon: FiFacebook,
    label: "Facebook",
    hover: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white",
  },
  {
    key: "youtube_link",
    icon: FiYoutube,
    label: "YouTube",
    hover: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white",
  },
  {
    key: "instagram_link",
    icon: FiInstagram,
    label: "Instagram",
    hover: "hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white",
  },
  {
    key: "linkedin_link",
    icon: FiLinkedin,
    label: "LinkedIn",
    hover: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white",
  },
];

const SocialColumn = ({ column, t }) => {
  const config = column?.config || {};

  const activePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => config?.[p.key]?.enabled && config?.[p.key]?.url,
  );

  if (!activePlatforms.length) return null;

  return (
    <div>
      <ColumnHeading t={t}>{column?.title}</ColumnHeading>
      <div className="flex flex-wrap items-center gap-2.5">
        {activePlatforms.map(({ key, icon: Icon, label, hover }) => (
          <a
            key={key}
            href={config[key].url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm transition-all hover:scale-110",
              t.socialIdle,
              hover,
            )}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
      <p className={cn("font-bengali mt-4 text-xs leading-relaxed", t.muted)}>
        সোশ্যাল মিডিয়ায় আমাদের সাথে যুক্ত থাকুন
      </p>
    </div>
  );
};

const CustomText = ({ column, t }) => (
  <div>
    <ColumnHeading t={t}>{column?.title}</ColumnHeading>
    <p className={cn("font-bengali text-sm leading-relaxed", t.body)}>
      {column?.config?.text}
    </p>
  </div>
);

/* ---------------- Column type registry ---------------- */
const COLUMN_RENDERERS = {
  about: AboutColumn,
  links: LinksColumn,
  contact: ContactColumn,
  social: SocialColumn,
  custom_text: CustomText,
};

/* ---------------- Main Footer ---------------- */
const Footer = ({ footer = {} }) => {
  const columns = sortByOrder(footer?.columns || []);
  const copyrightText = footer?.copyright_text;
  const theme = footer?.meta?.theme || "gradient";
  const t = getTheme(theme);
  const Layers = THEME_LAYERS[theme];
  const isSplit = theme === "split";

  // Nothing configured yet -> placeholder for the preview
  if (!columns.length && !copyrightText) {
    return (
      <div className="rounded border border-dashed p-4 text-center text-xs text-muted-foreground">
        Footer — no columns configured
      </div>
    );
  }

  // 1 col on mobile, 2 on sm, up to 5 on lg (capped by column count)
  const lgCols = Math.min(columns.length || 1, 5);

  return (
    <footer className={cn("relative w-full overflow-hidden", t.footerBg)}>
      {Layers && <Layers />}

      {/* ---------- Columns ---------- */}
      {columns.length > 0 && (
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
          <div
            className={cn(
              "grid gap-10 md:gap-8",
              "grid-cols-1 sm:grid-cols-2",
              lgCols === 1 && "lg:grid-cols-1",
              lgCols === 2 && "lg:grid-cols-2",
              lgCols === 3 && "lg:grid-cols-3",
              lgCols === 4 && "lg:grid-cols-4",
              lgCols === 5 && "lg:grid-cols-5",
            )}
          >
            {columns.map((column, idx) => {
              const Renderer = COLUMN_RENDERERS[column?.type];
              const wrap = isSplit && idx === 0 ? t.panelHighlight : "";

              return (
                <div key={column.id} className={wrap}>
                  {Renderer ? (
                    <Renderer column={column} t={t} />
                  ) : (
                    <div className="rounded border border-dashed border-slate-700 p-4 text-center text-xs text-slate-500">
                      Unknown column type: "{column?.type}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- Copyright bar ---------- */}
      {copyrightText && (
        <div className={cn("relative border-t backdrop-blur-sm", t.borderTop, t.copyrightBg)}>
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6">
            <p className={cn("font-bengali text-center text-xs sm:text-left", t.copyrightText)}>
              © {new Date().getFullYear()}{" "}
              <span className={t.copyrightAccent}>{copyrightText}</span>
              । সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex items-center gap-2">
              <span className={cn("h-px w-6", t.borderTop)} />
              <span className={cn("h-1.5 w-1.5 rotate-45", t.diamond)} />
              <span className={cn("h-px w-6", t.borderTop)} />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

export const RootFooter = ({ onNavigate }) => {
  const cols = [
    {
      h: "Product",
      links: [
        ["Modules", "modules"],
        ["Page Builder", "builder"],
        ["Live Dashboard", "dashboard"],
        ["Account Management", "accounts"],
      ],
    },
    {
      h: "Popular Modules",
      links: [
        ["Notice Board", "modules"],
        ["Annual Plan", "modules"],
        ["Staff Directory", "modules"],
        ["Photo Gallery", "modules"],
      ],
    },
    {
      h: "Company",
      links: [
        ["Register Business", "register"],
        ["Contact Us", "contact"],
        ["Home", "home"],
      ],
    },
  ];
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-emerald-500 text-white grid place-items-center">
                <Blocks className="w-5 h-5" />
              </span>
              <span className="text-lg font-bold">OrgSuite</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              The all-in-one platform for organizations to build, publish, and
              manage their entire web presence.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-5">
                {c.h}
              </div>
              <div className="space-y-3">
                {c.links.map(([label, id]) => (
                  <button
                    key={label}
                    onClick={() => onNavigate(id)}
                    className="block text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <span>© 2026 OrgSuite. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <Blocks className="w-3.5 h-3.5" />
            Built with the Dynamic Page Builder
          </span>
        </div>
      </div>
    </footer>
  );
};