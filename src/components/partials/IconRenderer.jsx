import * as LucideIcons from "lucide-react";

const IconRenderer = ({ icon, size = 24, color = "black" }) => {
    const buildName = icon.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")

    const IconComponent = LucideIcons[buildName];

    if (!IconComponent) return null;
    return <IconComponent size={size} color={color} />;
};

export default IconRenderer;