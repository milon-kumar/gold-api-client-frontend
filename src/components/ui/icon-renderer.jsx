import * as LucideIcons from "lucide-react";
import { Circle } from "lucide-react";
import { ICON_OPTIONS } from "@/store/default/component-placeholder";

const ICON_MAP = ICON_OPTIONS.reduce((acc, { key, icon }) => {
  acc[key] = icon;
  return acc;
}, {});

const toPascalCase = (value = "") =>
  value
    .replace(/[_\-\s]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

export const IconRenderer = ({
  icon,
  size = 20,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}) => {
  const props = { size, color, className, strokeWidth };

  if (!icon) {
    return <Circle {...props} />;
  }

  // 1. our own short key from the icon picker, e.g. "dashboard", "cart", "module"
  if (ICON_MAP[icon]) {
    const MappedIcon = ICON_MAP[icon];
    return <MappedIcon {...props} />;
  }

  // 2. exact Lucide component name, e.g. "LayoutDashboard"
  if (LucideIcons[icon]) {
    const ExactIcon = LucideIcons[icon];
    return <ExactIcon {...props} />;
  }

  // 3. kebab/snake/space case -> PascalCase, e.g. "shopping-cart" -> "ShoppingCart"
  const pascalName = toPascalCase(icon);
  if (LucideIcons[pascalName]) {
    const PascalIcon = LucideIcons[pascalName];
    return <PascalIcon {...props} />;
  }

  // 4. unknown key, fall back to a neutral dot
  return <Circle {...props} />;
};