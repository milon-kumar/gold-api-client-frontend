import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Database, ImageOff, Search } from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery";
import {
  getDataSource,
  getDataSourceOptions,
} from "@/store/default/componentDataSource";

/**
 * =====================================================================
 * RESOURCE PICKER
 * =====================================================================
 * আপনার existing CRUD list থেকে record select করার Dialog।
 *
 * Props:
 *  - sourceKeys : string[]  — কোন কোন data source থেকে বাছা যাবে
 *                 (একাধিক দিলে উপরে source switcher dropdown আসবে)
 *  - onPick(mappedItem, rawItem, sourceKey) — item-এ click করলে call হয়
 *  - onUnpick(rawItem, sourceKey) — already-picked item-এ আবার click করলে
 *                 call হয় (toggle / unselect)। না দিলে toggle disabled।
 *  - closeOnPick : true হলে pick করার সাথে সাথে dialog বন্ধ হবে
 *                  (single select), false হলে খোলা থাকবে (multi add)
 *  - pickedIds   : already selected record id গুলো (✓ ও toggle-এর জন্য)
 *  - triggerLabel / triggerVariant / triggerClassName
 * =====================================================================
 */
const ResourcePicker = ({
  sourceKeys = [],
  onPick,
  onUnpick,
  closeOnPick = true,
  pickedIds = [],
  triggerLabel = "Select from existing",
  triggerVariant = "outline",
  triggerClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const [activeSourceKey, setActiveSourceKey] = useState(sourceKeys[0]);
  const [search, setSearch] = useState("");

  const sourceOptions = getDataSourceOptions(sourceKeys);
  const source = getDataSource(activeSourceKey);

  /* Dialog খোলা হলেই কেবল fetch হবে */
  const { data: response, isLoading } = useApiQuery({
    url: source?.url,
    enabled: open && !!source?.url,
  });

  const items = useMemo(() => {
    if (!source || !response) return [];
    const list = source.getItems(response) || [];

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((item) =>
      String(item[source.display?.titleKey] || "")
        .toLowerCase()
        .includes(q),
    );
  }, [response, search, source]);

  if (!sourceKeys.length) return null;

  const handlePick = (rawItem) => {
    const isPicked = rawItem.id != null && pickedIds.includes(rawItem.id);

    /* Already picked → toggle করে unselect (dialog খোলা থাকে) */
    if (isPicked && onUnpick) {
      onUnpick(rawItem, activeSourceKey);
      return;
    }

    const mapped = source.mapItem ? source.mapItem(rawItem) : rawItem;
    onPick(mapped, rawItem, activeSourceKey);
    if (closeOnPick) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={triggerVariant}
          className={`h-7 px-2 text-xs ${triggerClassName}`}
        >
          <Database className="mr-1 h-3 w-3" /> {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">
            Select from {source?.label || "existing data"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* একাধিক source থাকলে switcher */}
          {sourceOptions.length > 1 && (
            <Select value={activeSourceKey} onValueChange={setActiveSourceKey}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sourceOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="h-8 pl-8 text-xs"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {isLoading && (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Loading...
              </p>
            )}

            {!isLoading && items.length === 0 && (
              <p className="rounded border border-dashed py-8 text-center text-xs text-muted-foreground">
                No records found in {source?.label}.
              </p>
            )}
            {
              items?.length > 0 ? (
                <>
                  {items?.map((item, index) => {
                    const title =
                      item[source.display?.titleKey] || `Item ${index + 1}`;
                    const image = source.display?.imageKey
                      ? item[source.display.imageKey]
                      : null;
                    const subtitle = source.display?.subtitleKey
                      ? item[source.display.subtitleKey]
                      : null;
                    const isPicked = pickedIds.includes(item.id);

                    return (
                      <button
                        key={item.id ?? index}
                        type="button"
                        onClick={() => handlePick(item)}
                        className={`flex w-full items-center gap-3 rounded-md border p-2 text-left transition-colors ${isPicked
                            ? "border-primary bg-primary/10 hover:bg-primary/5"
                            : "hover:border-primary hover:bg-primary/5"
                          }`}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt=""
                            className="h-10 w-14 shrink-0 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-muted">
                            <ImageOff className="h-4 w-4 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{title}</p>
                          {subtitle && (
                            <p className="truncate text-[11px] text-muted-foreground">
                              {subtitle}
                            </p>
                          )}
                        </div>
                        {isPicked && (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </button>
                    );
                  })}</>
              ) : null
            }

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourcePicker;
