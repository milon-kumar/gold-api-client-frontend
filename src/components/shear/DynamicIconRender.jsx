import React from "react";
import { HelpCircle } from "lucide-react";

import * as LucideIcons from "lucide-react";

const EXCLUDED_EXPORTS = new Set(["createLucideIcon", "default", "icons", "Icon"]);

function buildRegistry() {
  const seenComponents = new Map(); // component -> chosen name

  const names = Object.keys(LucideIcons)
    .filter((name) => !EXCLUDED_EXPORTS.has(name))
    .filter((name) => {
      const value = LucideIcons[name];
      return value && (typeof value === "function" || typeof value === "object");
    })
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

/** Full list of { name, component } for every unique Lucide icon. */
export function getIconRegistry() {
  if (!cachedRegistry) cachedRegistry = buildRegistry();
  return cachedRegistry;
}

/** Look up a single icon component by its exported name (e.g. "ArrowRight"). */
export function getIconComponent(name) {
  if (!name) return null;
  return LucideIcons[name] || null;
}

/** "ArrowUpRight" -> "arrow up right", for friendlier substring search. */
export function toSearchableLabel(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
}


const DynamicIconRender = ({ name, className, ...props }) => {
  const IconComponent = getIconComponent(name) || HelpCircle;
  return <IconComponent className={className} {...props} />;
};

export default DynamicIconRender;