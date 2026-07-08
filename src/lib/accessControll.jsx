import {
    Building2,
    Settings,
    Activity,
    Users,
    Download,
    LayoutDashboard,
    Images,
    Video,
    Info,
    MenuSquare,
    Grid2x2,
    FolderKanban,
    ImageIcon,
    BarChart3,
    Layers3,
    UserPlus,
    HandCoins,
} from 'lucide-react';

export const getModuleIcon = (iconName,size) => {
    const icons = {
        LayoutDashboard, Images, Video, Info, MenuSquare, Download,
        Grid2x2, Activity, FolderKanban, Building2, ImageIcon, Users,
        Settings, BarChart3, Layers3, UserPlus, HandCoins
    };
    const IconComponent = icons[iconName] || Grid2x2;
    return <IconComponent className={`w-${size || 5} h-${size || 5}`}/>;
};
