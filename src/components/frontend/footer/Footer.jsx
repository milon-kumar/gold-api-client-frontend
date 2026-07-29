import React from "react";
import { Mail, Phone, MapPin ,Blocks} from "lucide-react";

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
 * - copyright_text -> bottom bar
 *
 * Design: GradientHero-এর color concept —
 * emerald-950 → slate-950 gradient, grid pattern, emerald/amber accents
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
 
/* ---------------- Shared: column heading ---------------- */
// GradientHero-র eyebrow style: ছোট emerald line + title
const ColumnHeading = ({ children }) => (
  <div className="mb-5 flex items-center gap-2.5">
    <span className="h-px w-6 bg-gradient-to-r from-emerald-400 to-amber-300" />
    <h4 className="font-bengali text-sm font-semibold uppercase tracking-wider text-white">
      {children}
    </h4>
  </div>
);
 
/* ---------------- Column: About ---------------- */
const AboutColumn = ({ column }) => {
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
        <p className="font-bengali text-sm leading-relaxed text-slate-400">
          {config.about_text}
        </p>
      )}
      {/* ছোট decorative diamond line — GradientHero-র ticker separator-এর মতো */}
      <div className="mt-5 flex items-center gap-2">
        <span className="h-px w-8 bg-white/10" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gradient-to-br from-emerald-400 to-amber-300" />
        <span className="h-px w-8 bg-white/10" />
      </div>
    </div>
  );
};
 
/* ---------------- Column: Links ---------------- */
const LinksColumn = ({ column }) => (
  <div>
    <ColumnHeading>{column?.title}</ColumnHeading>
    <ul className="space-y-2.5">
      {sortByOrder(column?.links).map((link) => (
        <li key={link.id}>
          <a
            href={resolveUrl(link.url)}
            target={link.target || "_self"}
            className="font-bengali group inline-flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-emerald-300"
          >
            <span className="h-1 w-1 flex-shrink-0 rotate-45 bg-gradient-to-br from-emerald-400 to-amber-300 transition-transform group-hover:scale-150" />
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
const ContactColumn = ({ column }) => {
  const config = column?.config || {};
 
  const rows = [
    config.show_location &&
      config.location && {
        icon: MapPin,
        content: (
          <span className="font-bengali text-sm leading-relaxed text-slate-400">
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
            className="font-bengali text-sm text-slate-400 transition-colors hover:text-emerald-300"
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
            className="text-sm text-slate-400 transition-colors hover:text-emerald-300"
          >
            {config.email}
          </a>
        ),
        key: "email",
      },
  ].filter(Boolean);
 
  return (
    <div>
      <ColumnHeading>{column?.title}</ColumnHeading>
      <ul className="space-y-3">
        {rows.map(({ icon: Icon, content, key }) => (
          <li key={key} className="group flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/5 bg-emerald-500/10 transition-colors group-hover:border-emerald-400/30 group-hover:bg-emerald-500/20">
              <Icon className="h-3.5 w-3.5 text-emerald-400" />
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
    hover: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  },
  {
    key: "youtube_link",
    icon: FiYoutube,
    label: "YouTube",
    hover: "hover:bg-[#FF0000] hover:border-[#FF0000]",
  },
  {
    key: "instagram_link",
    icon: FiInstagram,
    label: "Instagram",
    hover: "hover:bg-[#E4405F] hover:border-[#E4405F]",
  },
  {
    key: "linkedin_link",
    icon: FiLinkedin,
    label: "LinkedIn",
    hover: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
  },
];
 
const SocialColumn = ({ column }) => {
  const config = column?.config || {};
 
  // Only enabled platforms that actually have a URL
  const activePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => config?.[p.key]?.enabled && config?.[p.key]?.url,
  );
 
  if (!activePlatforms.length) return null;
 
  return (
    <div>
      <ColumnHeading>{column?.title}</ColumnHeading>
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
              "flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 backdrop-blur-sm transition-all hover:scale-110 hover:text-white",
              hover,
            )}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
      <p className="font-bengali mt-4 text-xs leading-relaxed text-slate-500">
        সোশ্যাল মিডিয়ায় আমাদের সাথে যুক্ত থাকুন
      </p>
    </div>
  );
};

const CustomText = ({column}) =>{
  return (
    <div>
      <ColumnHeading>{column?.title}</ColumnHeading>
    <p className="font-bengali text-sm leading-relaxed text-slate-400">{column?.config?.text}</p>
    </div>
  )
}
 
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
    <footer className="relative w-full overflow-hidden bg-slate-950">
      {/* ---------- GradientHero background layers ---------- */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900" />
      {/* grid pattern (নিচের দিকে fade হয়) */}
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
      {/* glow accents */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
 
      {/* top hairline — hero-র bottom hairline-এর সাথে মিলিয়ে */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
 
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
            {columns.map((column) => {
              const Renderer = COLUMN_RENDERERS[column?.type];
 
              return (
                <div key={column.id}>
                  {Renderer ? (
                    <Renderer column={column} />
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
        <div className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6">
            <p className="font-bengali text-center text-xs text-slate-500 sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text font-medium text-transparent">
                {copyrightText}
              </span>
              । সর্বস্বত্ব সংরক্ষিত।
            </p>
            {/* ছোট diamond accent — hero-র সাথে মিল রেখে */}
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-white/10" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gradient-to-br from-emerald-400 to-amber-300" />
              <span className="h-px w-6 bg-white/10" />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
 
export default Footer;

export const RootFooter = ({onNavigate}) => {
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
