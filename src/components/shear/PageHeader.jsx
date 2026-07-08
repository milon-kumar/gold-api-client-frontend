// components/PageHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router'; // Next.js hole useRouter use korben
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Plus,
    Save,
    Trash2,
    RefreshCw,
    MoreVertical
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StatusBadge from './StatusBadge';

const PageHeader = ({
    title,
    subtitle,
    status = null,
    showBackButton = false,
    onBackClick,
    backRoute,
    primaryAction,
    secondaryAction,
    extraActions = [],
    statusText,
    statusType = 'default', // success, warning, error, info, default
    className = '',
}) => {
    const navigate = useNavigate();

    // Dynamically status badge color change er jonno
    const getStatusColorClass = () => {
        switch (statusType) {
            case 'success':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400';
            case 'warning':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400';
            case 'error':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'info':
                return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    // Back button routing logic
    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
        } else if (backRoute) {
            navigate(backRoute);
        } else {
            navigate(-1); // Default go back
        }
    };

    // Icon helper map matching default icons
    const renderIcon = (iconName) => {
        const icons = {
            plus: <Plus className="mr-2 h-4 w-4" />,
            save: <Save className="mr-2 h-4 w-4" />,
            delete: <Trash2 className="mr-2 h-4 w-4" />,
            refresh: <RefreshCw className="mr-2 h-4 w-4" />,
        };
        return icons[iconName] || iconName;
    };

    return (
        <div className={`sticky top-14 bg-background/95 backdrop-blur p-1 sm:p-4 sm:mb-6 z-40 border rounded-md border-border ${className}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    {showBackButton && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleBack}
                            className="rounded-full"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-semibold truncate">
                                {title}
                            </h1>
                            {
                                status && (
                                    <StatusBadge status={status} />
                                )
                            }
                        </div>
                        <p className="text-xs text-muted-foreground truncate hidden sm:block">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2 sm:ml-auto">
                    {secondaryAction && (
                        <Button
                            variant={secondaryAction.variant || "outline"}
                            size="sm"
                            onClick={secondaryAction.onClick}
                            disabled={secondaryAction.disabled}
                        >
                            {secondaryAction.icon && renderIcon(secondaryAction.icon)}
                            {secondaryAction.title}
                        </Button>
                    )}

                    {/* Primary Action */}
                    {primaryAction && (
                        <Button
                            variant={primaryAction.variant || "default"}
                            size={primaryAction.variant || "default"}
                            onClick={primaryAction.onClick}
                            disabled={primaryAction.disabled}
                        >
                            {primaryAction.icon && renderIcon(primaryAction.icon)}
                            {primaryAction.title}
                        </Button>
                    )}

                    {extraActions.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {extraActions.map((action, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={action.onClick}
                                        className={action.className || ""}
                                    >
                                        {action.icon && <span className="mr-2">{action.icon}</span>}
                                        {action.title}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PageHeader;
