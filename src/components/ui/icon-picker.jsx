import React, { useState } from "react";
import { ICON_OPTIONS } from "@/store/default/component-placeholder";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const IconPicker = ({ icon: selectedIcon, setIcon }) => {
    const [search, setSearch] = useState("");

    const filteredIcons = ICON_OPTIONS.filter(({ key }) =>
        key.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search icons..."
                    className="h-8 pl-7 text-xs"
                />
            </div>

            <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto hide-scrollbar rounded-md border bg-gray-50/50 p-1.5">
                {filteredIcons.length === 0 ? (
                    <p className="col-span-8 py-4 text-center text-xs text-muted-foreground">No icons found</p>
                ) : (
                    filteredIcons.map(({ key, icon: Icon }) => (
                        <button
                            key={key}
                            type="button"
                            title={key}
                            onClick={() => setIcon(key)}
                            className={cn(
                                "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border transition-all",
                                selectedIcon === key
                                    ? "border-blue-600 bg-blue-50 text-blue-600 ring-05 ring-blue-600"
                                    : "border-gray-200 text-muted-foreground hover:border-gray-300 hover:bg-white hover:text-foreground",
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export const IconRener = (icon) => {
    const ICONS = ICON_OPTIONS.reduce((acc, { key, icon }) => ({ ...acc, [key]: icon }), {});
    return ICONS[icon] || Boxes
}
