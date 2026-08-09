import React from "react";
import { HelpCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";

/**
 * lucide-react exports every icon as a PascalCase named export, plus a
 * handful of exports that aren't icons at all (createLucideIcon, the
 * `icons` lookup map, etc.), and occasionally two names pointing at the
 * exact same component (deprecated aliases). This builds one clean,
 * de-duplicated, alphabetically sorted list to power search + display.
 */
const EXCLUDED_EXPORTS = new Set(["createLucideIcon", "default", "icons", "Icon"]);

// Real Lucide icons are function components or forwardRef/memo exotic
// objects (they carry a `$$typeof` symbol or a `.render` function). This
// filters out anything else — including, critically, values picked up via
// prototype-chain access rather than a real named export.
function isValidIconComponent(value) {
  if (typeof value === "function") return true;
  if (value && typeof value === "object") {
    return typeof value.$$typeof === "symbol" || typeof value.render === "function";
  }
  return false;
}

function buildRegistry() {
  const seenComponents = new Map(); // component -> chosen name

  const names = Object.keys(LucideIcons)
    .filter((name) => !EXCLUDED_EXPORTS.has(name))
    .filter((name) => isValidIconComponent(LucideIcons[name]))
    // When a component is exported under two names, prefer the one that
    // doesn't end in "Icon" (the shorter, canonical name).
    .sort((a, b) => {
      const aAlias = a.endsWith("Icon") ? 1 : 0;
      const bAlias = b.endsWith("Icon") ? 1 : 0;
      if (aAlias !== bAlias) return aAlias - bAlias;
      return a.localeCompare(b);
    });

  names.forEach((name) => {
    const component = LucideIcons[name];
    if (!seenComponents.has(component)) {
      seenComponents.set(component, name);
    }
  });

  return Array.from(seenComponents.entries())
    .map(([component, name]) => ({ name, component }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

let cachedRegistry = null;
let cachedLookup = null;

/** Full list of { name, component } for every unique Lucide icon. */
export function getIconRegistry() {
  if (!cachedRegistry) cachedRegistry = buildRegistry();
  return cachedRegistry;
}

// A Map (not the raw LucideIcons namespace) so lookups can never resolve
// to inherited Object.prototype members like "constructor", "toString",
// or "__proto__" when `name` is an unexpected/corrupt value — those would
// otherwise come back as a plain, non-renderable object and crash React
// with "Objects are not valid as a React child".
function getLookup() {
  if (!cachedLookup) {
    cachedLookup = new Map(getIconRegistry().map(({ name, component }) => [name, component]));
  }
  return cachedLookup;
}

/** Look up a single icon component by its exported name (e.g. "ArrowRight"). */
export function getIconComponent(name) {
  if (!name || typeof name !== "string") return null;
  return getLookup().get(name) || null;
}

/** "ArrowUpRight" -> "arrow up right", for friendlier substring search. */
export function toSearchableLabel(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
}
/**
 * Renders a Lucide icon from its string name (e.g. what IconPicker saves
 * to the database, "ArrowRight"). Falls back to a placeholder icon if the
 * stored name doesn't match a known Lucide icon, so a bad/stale value
 * never breaks the layout.
 *
 * Usage: <DynamicIcon name={module.icon} className="h-5 w-5 text-sky-600" />
 */
const DynamicIcon = ({ name, className, ...props }) => {
  const resolved = getIconComponent(name);
  // Belt-and-braces: only ever render something that's actually a
  // component (function, or a forwardRef/memo exotic object). Anything
  // else falls back to the placeholder instead of being handed to React.
  const IconComponent =
    typeof resolved === "function" || (resolved && typeof resolved.render === "function") || (resolved && typeof resolved.$$typeof === "symbol")
      ? resolved
      : HelpCircle;
  return <IconComponent className={className} {...props} />;
};

export default DynamicIcon;