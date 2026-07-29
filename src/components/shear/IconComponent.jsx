import * as LucideIcons from "lucide-react";

const IconComponent = ({
    icon="Target",
    className,
    size = 20,
    color,
    ...props
}) => {

    const Icon = LucideIcons[icon];

    if (!Icon) return null;

    return (
        <Icon
            className={className}
            size={size}
            color={color}
            {...props}
        />
    );
};

export default IconComponent;