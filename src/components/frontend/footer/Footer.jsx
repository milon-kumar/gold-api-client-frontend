import React from "react";
import {
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { FiFacebook,FiYoutube,FiLinkedin,FiInstagram } from "react-icons/fi";

/**
 * Footer (Preview)
 * Renders a footer from the footer builder API data:
 * - columns[] (sorted by sort_order), each with a type:
 *     "about"   -> logo + about text        (config: logo, show_logo, about_text)
 *     "links"   -> list of page links       (links[])
 *     "contact" -> email / phone / location (config with show_* flags)
 * - copyright_text -> bottom bar
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
                    className="mb-4 h-12 w-auto object-contain"
                />
            )}
            {config.about_text && (
                <p className="text-sm leading-relaxed text-slate-400">
                    {config.about_text}
                </p>
            )}
        </div>
    );
};

/* ---------------- Column: Links ---------------- */
const LinksColumn = ({ column }) => (
    <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            {column?.title}
        </h4>
        <ul className="space-y-2.5">
            {sortByOrder(column?.links).map((link) => (
                <li key={link.id}>
                    <a
                        href={resolveUrl(link.url)}
                        target={link.target || "_self"}
                        className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                    >
                        <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary/60 transition-transform group-hover:scale-150" />
                        {link.label}
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
                    <span className="text-sm leading-relaxed text-slate-400">
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
                        className="text-sm text-slate-400 transition-colors hover:text-white"
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
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                        {config.email}
                    </a>
                ),
                key: "email",
            },
    ].filter(Boolean);

    return (
        <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {column?.title}
            </h4>
            <ul className="space-y-3">
                {rows.map(({ icon: Icon, content, key }) => (
                    <li key={key} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                            <Icon className="h-3.5 w-3.5 text-primary" />
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
    { key: "facebook_link", icon: FiFacebook, label: "Facebook", hover: "hover:bg-[#1877F2]" },
    { key: "youtube_link", icon: FiYoutube, label: "YouTube", hover: "hover:bg-[#FF0000]" },
    { key: "instagram_link", icon: FiInstagram, label: "Instagram", hover: "hover:bg-[#E4405F]" },
    { key: "linkedin_link", icon: FiLinkedin, label: "LinkedIn", hover: "hover:bg-[#0A66C2]" },
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
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {column?.title}
            </h4>
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
                            "flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:scale-110 hover:text-white",
                            hover,
                        )}
                    >
                        <Icon className="h-4 w-4" />
                    </a>
                ))}
            </div>
        </div>
    );
};

/* ---------------- Column type registry ---------------- */
const COLUMN_RENDERERS = {
    about: AboutColumn,
    links: LinksColumn,
    contact: ContactColumn,
    social: SocialColumn,
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

    // 1 col on mobile, 2 on sm, up to 4 on lg (capped by column count)
    const lgCols = Math.min(columns.length || 1, 4);

    return (
        <footer className="w-full bg-violet-900">
            {/* Columns */}
            {columns.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
                    <div
                        className={cn(
                            "grid gap-10 md:gap-8",
                            "grid-cols-1 sm:grid-cols-2",
                            lgCols === 1 && "lg:grid-cols-1",
                            lgCols === 2 && "lg:grid-cols-2",
                            lgCols === 3 && "lg:grid-cols-3",
                            lgCols === 4 && "lg:grid-cols-4",
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

            {/* Copyright bar */}
            {copyrightText && (
                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6">
                        <p className="text-center text-xs text-slate-500 sm:text-left">
                            © {new Date().getFullYear()} {copyrightText}। সর্বস্বত্ব
                            সংরক্ষিত।
                        </p>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;