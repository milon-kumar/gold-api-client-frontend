import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIconRegistry, toSearchableLabel } from "./DynamicIconRender";
import DynamicIcon from "./DynamicIconRender";

const PAGE_SIZE = 150;

/**
 * A trigger button + dialog for browsing and searching every icon in
 * lucide-react and picking one.
 *
 * Usage:
 *   const [icon, setIcon] = useState(module.icon);
 *   <IconPicker value={icon} onChange={setIcon} />
 *   // `icon` is stored as the icon's string name, e.g. "ArrowRight".
 *   // Render it anywhere later with <DynamicIcon name={icon} />
 */
const IconPicker = ({ value, onChange, label = "icon", placeholder = "Search icons…" }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const registry = useMemo(() => getIconRegistry(), []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return registry;
    return registry.filter(
      ({ name }) => name.toLowerCase().includes(query) || toSearchableLabel(name).includes(query)
    );
  }, [registry, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  const handleSearchChange = (rawValue) => {
    setSearch(rawValue);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSelect = (iconName) => {
    onChange?.(iconName);
    setOpen(false);
    setSearch("");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
      {/* Icon-only trigger — just the current icon (or a placeholder), no label text */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        title={value ? value : `Choose ${label}`}
        onClick={() => setOpen(true)}
        className="h-9 w-9 shrink-0"
      >
        {value ? (
          <DynamicIcon name={value} className="h-4 w-4 text-gray-700" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[70vh] flex-col sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Choose an icon</DialogTitle>
            <DialogDescription className="text-xs">
              {registry.length.toLocaleString()} icons — search by name
            </DialogDescription>
          </DialogHeader>

          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={placeholder}
              className="h-8 pl-8 pr-8 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="hide-scrollbar -mx-1 flex-1 overflow-y-auto px-1">
            {visible.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-muted-foreground">
                <Search className="mb-2 h-5 w-5" />
                No icons match &quot;{search}&quot;
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-1 py-2 sm:grid-cols-10">
                {visible.map(({ name, component: Icon }) => {
                  const isSelected = value === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => handleSelect(name)}
                      className={cn(
                        "group relative flex aspect-square flex-col items-center justify-center rounded-md border p-1 transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 text-gray-700 group-hover:text-gray-900" />
                      {isSelected && <Check className="absolute right-0.5 top-0.5 h-2.5 w-2.5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  Load more ({filtered.length - visible.length} remaining)
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconPicker;