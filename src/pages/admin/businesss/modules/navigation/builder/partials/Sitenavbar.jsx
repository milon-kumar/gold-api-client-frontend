import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

/**
 * Public ওয়েবসাইটে saved navbar রেন্ডার করার কম্পোনেন্ট।
 * data = GET /api/navbar/{businessId} এর রেসপন্স (data ফিল্ড)
 *
 * data.left_config  → { logo_type, logo_url, logo_text, link, height }
 * data.items        → [{ label, url, target, children: [...] }]
 * data.right_config → [{ label, url, variant, newTab }]
 */
export const SiteNavbar = ({ data }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!data) return null;

  const left = data.left_config || {};
  const items = data.items || [];
  const buttons = data.right_config || [];

  const btnClass = (variant) =>
    ({
      primary:
        "bg-primary text-white hover:bg-primary/90 px-4 py-1.5 rounded-md text-sm font-medium",
      outline:
        "border border-primary text-primary hover:bg-primary/5 px-4 py-1.5 rounded-md text-sm font-medium",
      ghost: "text-slate-700 hover:text-primary px-2 py-1.5 text-sm font-medium",
    })[variant] || "";

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* -------- বাম: Logo -------- */}
        <a href={left.link || "/"} className="flex items-center gap-2 shrink-0">
          {left.logo_type !== "text" && left.logo_url && (
            <img
              src={left.logo_url}
              alt={left.logo_text || "logo"}
              style={{ height: left.height || 40 }}
            />
          )}
          {left.logo_type !== "image" && left.logo_text && (
            <span className="font-bold text-lg">{left.logo_text}</span>
          )}
        </a>

        {/* -------- মাঝখান: Links + Dropdown (desktop) -------- */}
        <ul className="hidden lg:flex items-center gap-1">
          {items.map((item) => (
            <li key={item.id} className="relative group">
              <a
                href={item.url}
                target={item.target}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary rounded-md"
              >
                {item.label}
                {item.children?.length > 0 && (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </a>
              {item.children?.length > 0 && (
                <ul className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-lg shadow-lg min-w-48 py-1">
                  {item.children.map((c) => (
                    <li key={c.id}>
                      <a
                        href={c.url}
                        target={c.target}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* -------- ডান: Buttons -------- */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {buttons.map((b, i) => (
            <a
              key={i}
              href={b.url}
              target={b.newTab ? "_blank" : "_self"}
              rel={b.newTab ? "noopener noreferrer" : undefined}
              className={btnClass(b.variant)}
            >
              {b.label}
            </a>
          ))}
        </div>

        {/* -------- Mobile toggle -------- */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* -------- Mobile menu -------- */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-4 py-3 space-y-1 bg-white">
          {items.map((item) => (
            <div key={item.id}>
              <a
                href={item.url}
                target={item.target}
                className="block px-2 py-2 text-sm font-medium text-slate-700"
              >
                {item.label}
              </a>
              {item.children?.map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target={c.target}
                  className="block pl-6 py-1.5 text-sm text-slate-500"
                >
                  └ {c.label}
                </a>
              ))}
            </div>
          ))}
          <div className="flex gap-2 pt-2 border-t mt-2">
            {buttons.map((b, i) => (
              <a
                key={i}
                href={b.url}
                target={b.newTab ? "_blank" : "_self"}
                className={btnClass(b.variant)}
              >
                {b.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};