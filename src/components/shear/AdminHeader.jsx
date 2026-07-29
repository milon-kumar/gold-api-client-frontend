import {
    Menu,
    Search,
    Bell,
    BadgeCheckIcon,
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    ExternalLink,
    Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/shear/ThemeToggle.jsx";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth.js";
import { useNavigate } from "react-router";
const DropdownMenuAvatar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = async () => {
        const response = await logout();
        if (response?.success) {
            navigate('/login')
        }
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <div>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheckIcon />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCardIcon />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BellIcon />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>
                    <LogOutIcon />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const AdminHeader = () => {
    const navigate = useNavigate()
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 dark:bg-gray-950 dark:border-gray-800 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1">
                <div className="relative max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full pl-8 bg-gray-50 dark:bg-gray-900"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <a href="/" target="_blank">
                    <Button variant="ghost" size="icon">
                        <ExternalLink className="h-5 w-5" />
                    </Button>
                </a>
                <ThemeToggle />
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/settings')}>
                    <Settings className="h-5 w-5" />
                </Button>
                {/*<Avatar>*/}
                {/*    <AvatarImage src="https://github.com/shadcn.png" />*/}
                {/*    <AvatarFallback>CN</AvatarFallback>*/}
                {/*</Avatar>*/}
                <DropdownMenuAvatar />
            </div>
        </header>
    );
};

export default AdminHeader;
