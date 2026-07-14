import { Facebook, Youtube, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

/**
 * Public ওয়েবসাইটে saved footer রেন্ডার করার কম্পোনেন্ট।
 * data = GET /api/footer/{businessId} এর রেসপন্স (data ফিল্ড)
 *
 * data.columns → [{ title, type, config, links: [...] }]
 */
const SOCIAL_ICONS = {
  facebook_link: Facebook,
  youtube_link: Youtube,
  instagram_link: Instagram,
  linkedin_link: Linkedin,
};

export const SiteFooter = ({ data }) => {
  if (!data) return null;
  const columns = data.columns || [];

  const gridCols =
    {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
    }[columns.length] || "md:grid-cols-4";

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className={`max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8`}>
        {columns.map((col) => (
          <div key={col.id}>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">
              {col.title}
            </h4>

            {/* -------- links -------- */}
            {col.type === "links" && (
              <ul className="space-y-2">
                {(col.links || []).map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.url}
                      target={l.target}
                      rel={l.target === "_blank" ? "noopener noreferrer" : undefined}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* -------- about -------- */}
            {col.type === "about" && (
              <div className="space-y-3">
                {col.config?.show_logo && col.config?.logo && (
                  <img
                    src={col.config.logo}
                    alt="logo"
                    className="h-12"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                {col.config?.about_text && (
                  <p className="text-sm leading-relaxed">
                    {col.config.about_text}
                  </p>
                )}
              </div>
            )}

            {/* -------- contact -------- */}
            {col.type === "contact" && (
              <ul className="space-y-2 text-sm">
                {col.config?.show_email && col.config?.email && (
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                    <a href={`mailto:${col.config.email}`} className="hover:text-white">
                      {col.config.email}
                    </a>
                  </li>
                )}
                {col.config?.show_phone && col.config?.phone && (
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                    <a href={`tel:${col.config.phone}`} className="hover:text-white">
                      {col.config.phone}
                    </a>
                  </li>
                )}
                {col.config?.show_location && col.config?.location && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{col.config.location}</span>
                  </li>
                )}
              </ul>
            )}

            {/* -------- social -------- */}
            {col.type === "social" && (
              <div className="flex flex-wrap gap-3">
                {Object.entries(SOCIAL_ICONS).map(([key, Icon]) => {
                  const item = col.config?.[key];
                  if (!item?.enabled || !item?.url) return null;
                  return (
                    <a
                      key={key}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* -------- custom_text -------- */}
            {col.type === "custom_text" && (
              <p className="text-sm whitespace-pre-line leading-relaxed">
                {col.config?.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {data.copyright_text && (
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-slate-500 text-center">
            {data.copyright_text}
          </div>
        </div>
      )}
    </footer>
  );
};