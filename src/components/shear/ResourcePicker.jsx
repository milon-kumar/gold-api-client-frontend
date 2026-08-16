import { useEffect, useMemo, useState } from "react";
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
import { Check, ChevronLeft, ChevronRight, Database, ImageOff, Search } from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery";
import {
  getDataSource,
  getDataSourceOptions,
} from "@/store/default/componentDataSource";
import { getWords } from "@/lib/helper";
import { SearchableSelectPopover } from "../ui/searchable-select-popover";

/**
 * =====================================================================
 * RESOURCE PICKER
 * =====================================================================
 * আপনার existing CRUD list থেকে record select করার Dialog।
 *
 * Props:
 *  - field       : { moduleType, ... } — moduleType সব query/pick এর সাথে যাবে
 *  - sourceKeys  : string[]  — কোন কোন data source থেকে বাছা যাবে
 *                  (একাধিক দিলে উপরে source switcher dropdown আসবে)
 *  - onPick(mappedItem, rawItem, sourceKey) — item-এ click করলে call হয়
 *       mappedItem = { id, resource, module_type, ...source.mapItem(rawItem) }
 *  - onUnpick(rawItem, sourceKey) — already-picked item-এ আবার click করলে
 *                  call হয় (toggle / unselect)। না দিলে toggle disabled।
 *  - closeOnPick : true হলে pick করার সাথে সাথে dialog বন্ধ হবে
 *                  (single select), false হলে খোলা থাকবে (multi add)
 *  - pickedIds   : already selected record id গুলো (✓ ও toggle-এর জন্য)
 *  - triggerLabel / triggerVariant / triggerClassName
 * =====================================================================
 */

const RESOURCE_TABS = [
  { value: "module", label: "Module" },
  { value: "category", label: "Category" },
  { value: "item", label: "Item" },
];

const ResourcePicker = ({
  field = {},
  sourceKeys = [],
  initialResource="module",
  onPick,
  onUnpick,
  clearAll,
  closeOnPick = true,
  pickedIds = [],
  triggerLabel = "Select from existing",
  triggerVariant = "outline",
  triggerClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const [activeSourceKey, setActiveSourceKey] = useState(sourceKeys[0]);
  const [search, setSearch] = useState("");
  const [resource, setResource] = useState(initialResource);
  const [page, setPage] = useState(1);
  const [selectedModule,setSelectedModule] = useState(null)
  const sourceOptions = getDataSourceOptions(sourceKeys);
  const source = getDataSource(activeSourceKey);


  const { data: modulesResponse, isLoading: modulesLoading } = useApiQuery({
    url: "/admin/business-modules",
    params:{
      module_types: field.dataSources,
    }
  });

  const modules = modulesResponse?.data?.data;
  const popoverModules = modules?.map((i) =>{
    return {
      label : `${i.title} - ${i.creation_type === 'system' ? 'System' : 'Custom'}`,
      value: i.id,
    }
  }) || [];


  const handleResourceChange = (nextResource) => {
    if (nextResource === resource) return;
    setResource(nextResource);
    setPage(1);
    clearAll()
  };

  useEffect(() => {
    if (!open) {
      setSearch("");
      setPage(1);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const queryUrl = useMemo(() => {
    if (!source) return null;
    if (resource === "module") return source.getModuleUrl();
    if (resource === "category") return source.getCategoryUrl();
    if (resource === "item") return source.getModuleItem();
    return source.getUrl;
  }, [resource, source]);

  const queryParams = useMemo(() => {
    if (!source) return {};
    const base = {
      search,
      page,
      module_type: field?.moduleType,
      module_id: selectedModule?.id || null,
    };
    if (resource === "module") return source.getModuleParams(base);
    if (resource === "category") return source.getCategoryParams(base);
    if (resource === "item") return source.getItemsParams(base);
    return base;
  }, [resource, search, page, source, field?.moduleType, selectedModule]);

  const {
    data: queryResponse,
    isLoading: queryLoading,
    isFetching: queryFetching,
    refetch: queryRefetch,
  } = useApiQuery({
    url: queryUrl,
    params: queryParams,
    enabled: open && !!queryUrl,
  });

  useEffect(() => {
    if (!open || !source?.url) return;
    queryRefetch();
  }, [open, resource, search, page, queryUrl]);

 const resourceData = useMemo(() => {
    if (!source || !queryResponse) return [];
    const list = source.getItems(queryResponse);
    return Array.isArray(list) ? list : [];
  }, [queryResponse, source]);

  const pagination = useMemo(() => {
    const d = queryResponse?.data;
    if (!d) return null;
    return {
      currentPage: d.current_page ?? page,
      lastPage: d.last_page ?? 1,
      perPage: d.per_page,
      total: d.total,
      hasPrev: !!d.prev_page_url || (d.current_page ?? page) > 1,
      hasNext: !!d.next_page_url || (d.current_page ?? page) < (d.last_page ?? 1),
    };
  }, [queryResponse, page]);

  if (!sourceKeys.length) return null;

  const handlePick = (rawItem) => {
    const isPicked = rawItem.id != null && pickedIds.includes(rawItem.id);

    if (isPicked && onUnpick) {
      onUnpick(rawItem, activeSourceKey);
      return;
    }

    const mapped = source.mapItem ? source.mapItem(rawItem) : rawItem;
    const rest = {
      id: rawItem.id,
      module_type: field?.moduleType || selectedModule?.module_type,
      module: field?.moduleType || selectedModule,
      ...mapped,
      resource,
    };

    onPick(rest, rawItem, activeSourceKey);
    if (closeOnPick) setOpen(false);
  };

  const showLoading = queryLoading || queryFetching;

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
          <DialogTitle className="text-xs">
            <div className="space-y-2">
              <p className="capitalize">Select from {resource}</p>
              {console.log("Active source key - ",activeSourceKey)}
              <div className="flex justify-between items-center">
               
                {
                  (activeSourceKey !== 'modules' && activeSourceKey !== 'information') && (
                    <div className="flex gap-1">
                  {RESOURCE_TABS.map((tab) => (
                    <Button
                      key={tab.value}
                      onClick={() => handleResourceChange(tab.value)}
                      variant={resource === tab.value ? "default" : "outline"}
                      size="xs"
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
                  )
                }
                {
                  (activeSourceKey === 'modules' && !modulesLoading && modules.length > 0) ? (
                    <div>
                      <SearchableSelectPopover
                        items = {popoverModules}
                        value={selectedModule?.id}
                        onSelect={(value) =>{
                          const selected = modules.find(
                              (m) => Number(m.id) === Number(value)
                          );
                          clearAll()
                          setSelectedModule(selected)
                        }}
                      />
                    </div>
                  ): null
                } 
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
         
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
          <div className="max-h-72 min-h-[8rem] space-y-1.5 overflow-y-auto pr-1 hide-scrollbar">
            {showLoading && (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Loading...
              </p>
            )}

            {!showLoading && resourceData?.length === 0 && (
              <p className="rounded border border-dashed py-8 text-center text-xs text-muted-foreground">
                No records found in {source?.label}.
              </p>
            )}

            {!showLoading &&
              resourceData?.map((item, index) => {
                const title = item[source.display?.titleKey] || item.title ||item.name || `Item ${index + 1}`;
                const image =(source.display?.imageKey && item[source.display.imageKey]) || item.avatar_full_path || null;
                const subtitle = source.display?.subtitleKey ? item[source.display.subtitleKey] : null;
                const isPicked = item.id != null && pickedIds.includes(item.id);

                return (
                  <button
                    key={item.id ?? index}
                    type="button"
                    onClick={() => handlePick(item)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-md border p-2 text-left transition-colors ${
                      isPicked
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
                      <p className="truncate text-xs font-medium">{getWords(title,5)}</p>
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
              })}
          </div>

          {/* Pagination */}
          {pagination && pagination.lastPage > 1 && (
            <div className="flex items-center justify-between border-t pt-2">
              <p className="text-[11px] text-muted-foreground">
                Page {pagination.currentPage} of {pagination.lastPage}
                {pagination.total != null ? ` • ${pagination.total} total` : ""}
              </p>
              <div className="flex gap-1">
                <Button
                  size="xs"
                  variant="outline"
                  disabled={!pagination.hasPrev || showLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  disabled={!pagination.hasNext || showLoading}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.lastPage, p + 1))
                  }
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourcePicker;

// import { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Check, Database, ImageOff, Search, Settings } from "lucide-react";
// import { useApiQuery } from "@/hooks/useAppQuery";
// import {
//   getDataSource,
//   getDataSourceOptions,
// } from "@/store/default/componentDataSource";
// import DynamicIcon from "./DynamicIconRender";

// /**
//  * =====================================================================
//  * RESOURCE PICKER
//  * =====================================================================
//  * আপনার existing CRUD list থেকে record select করার Dialog।
//  *
//  * Props:
//  *  - sourceKeys : string[]  — কোন কোন data source থেকে বাছা যাবে
//  *                 (একাধিক দিলে উপরে source switcher dropdown আসবে)
//  *  - onPick(mappedItem, rawItem, sourceKey) — item-এ click করলে call হয়
//  *  - onUnpick(rawItem, sourceKey) — already-picked item-এ আবার click করলে
//  *                 call হয় (toggle / unselect)। না দিলে toggle disabled।
//  *  - closeOnPick : true হলে pick করার সাথে সাথে dialog বন্ধ হবে
//  *                  (single select), false হলে খোলা থাকবে (multi add)
//  *  - pickedIds   : already selected record id গুলো (✓ ও toggle-এর জন্য)
//  *  - triggerLabel / triggerVariant / triggerClassName
//  * =====================================================================
//  */
// const ResourcePicker = ({
//   field = {},
//   sourceKeys = [],
//   onPick,
//   onUnpick,
//   closeOnPick = true,
//   pickedIds = [],
//   triggerLabel = "Select from existing",
//   triggerVariant = "outline",
//   triggerClassName = "",
// }) => {
//   const [open, setOpen] = useState(false);
//   const [activeSourceKey, setActiveSourceKey] = useState(sourceKeys[0]);
//   const [search, setSearch] = useState("");
//   const [resource, setResource] = useState('module')

//   const sourceOptions = getDataSourceOptions(sourceKeys);
//   const source = getDataSource(activeSourceKey);


//   const handelResourceChange = (resource) => {
//     setResource(resource)
//   }

//   const queryUrl = useMemo(() => {
//     let URL;
//     if (resource === 'module') {
//       URL = source.getModuleUrl()
//     }

//     if (resource === 'category') {
//       URL = source.getCategoryUrl()
//     }

//     if (resource === 'item') {
//       URL = source.getModuleItem()
//     }
//     return URL;
//   }, [resource])

//   const queryParams = useMemo(() => {
//     let params;
//     if (resource === 'module') {
//       params = source.getModuleParams({
//         search: search,
//         module_type: field?.moduleType
//       })
//     }

//     if (resource === 'category') {
//       params = source.getCategoryParams({
//         search:search,
//         module_type: field?.moduleType
//       })
//     }

//     if (resource === 'item') {
//       params = source.getItemsParams({
//         search:search,
//         module_type: field?.moduleType
//       })
//     }
//     return params;
//   }, [resource,search])

//   const { data: queryResponse, isLoading: queryLoading, refetch: queryRefetch } = useApiQuery({
//     url: queryUrl,
//     params: queryParams,
//     enabled: open && !!source?.url,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       await queryRefetch();
//     };
//     fetchData();
//   }, [resource,search, queryRefetch])


//   const resourceData = useMemo(()=>{
//     if (!source || !resource || !queryResponse) return [];
//     console.log("queryResponse asdfasdfasdf - ",queryResponse)
//     const list = source.getItems(queryResponse)
//     return list;
//   },[queryResponse,source,resource,search])
  
//   console.log("Handel Resource Query - ", {
//     queryUrl,
//     queryParams,
//     queryResponse,
//     queryLoading,
//     resourceData
//   });

//   const URL = source?.getUrl(field?.moduleType);
//   const params = source?.getParams({
//     module_type: field?.moduleType
//   })

//   const { data: response, isLoading } = useApiQuery({
//     url: URL,
//     params: params,
//     enabled: open && !!source?.url,
//   });

//   const items = useMemo(() => {
//     if (!source || !response) return [];
//     const list = source.getItems(response) || [];

//     if (!search.trim()) return list;
//     const q = search.toLowerCase();
//     return list.filter((item) =>
//       String(item[source.display?.titleKey] || "")
//         .toLowerCase()
//         .includes(q),
//     );
//   }, [response, search, source]);

//   if (!sourceKeys.length) return null;

//   const handlePick = (rawItem) => {
//     const isPicked = rawItem.id != null && pickedIds.includes(rawItem.id);

//     if (isPicked && onUnpick) {
//       onUnpick(rawItem, activeSourceKey);
//       return;
//     }

//     const mapped = source.mapItem ? source.mapItem(rawItem) : rawItem;
//     onPick(mapped, rawItem, activeSourceKey);
//     if (closeOnPick) setOpen(false);
//   };


//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           size="sm"
//           variant={triggerVariant}
//           className={`h-7 px-2 text-xs ${triggerClassName}`}
//         >
//           <Database className="mr-1 h-3 w-3" /> {triggerLabel}
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="text-xs">
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="capitalize">
//                     Select from {resource}</p>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <Button onClick={() => handelResourceChange('module')} variant={resource === 'module' ? '' : 'outline'} size="xs">Module</Button>
//                   <Button onClick={() => handelResourceChange('category')} variant={resource === 'category' ? '' : 'outline'} size="xs">Category</Button>
//                   <Button onClick={() => handelResourceChange('item')} variant={resource === 'item' ? '' : 'outline'} size="xs">Item</Button>
//                 </div>
//                 <div>
//                   <Button size="xs">Setting</Button>
//                 </div>
//               </div>
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-3">
//           {sourceOptions.length > 1 && (
//             <Select value={activeSourceKey} onValueChange={setActiveSourceKey}>
//               <SelectTrigger className="h-8 text-xs">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {sourceOptions.map((opt) => (
//                   <SelectItem key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}

//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
//             <Input
//               className="h-8 pl-8 text-xs"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           {/* List */}
//           <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
//             {isLoading && (
//               <p className="py-8 text-center text-xs text-muted-foreground">
//                 Loading...
//               </p>
//             )}

//             {!isLoading && items.length === 0 && (
//               <p className="rounded border border-dashed py-8 text-center text-xs text-muted-foreground">
//                 No records found in {source?.label}.
//               </p>
//             )}

//             {items.map((item, index) => {
//               const title =
//                 item[source.display?.titleKey] || `Item ${index + 1}`;
//               const image = source.display?.imageKey
//                 ? item[source.display.imageKey]
//                 : null;
//               const subtitle = source.display?.subtitleKey
//                 ? item[source.display.subtitleKey]
//                 : null;
//               const isPicked = pickedIds.includes(item.id);

//               return (
//                 <button
//                   key={item.id ?? index}
//                   type="button"
//                   onClick={() => handlePick(item)}
//                   className={`flex w-full items-center gap-3 rounded-md border p-2 text-left transition-colors ${isPicked
//                     ? "border-primary bg-primary/10 hover:bg-primary/5"
//                     : "hover:border-primary hover:bg-primary/5"
//                     }`}
//                 >
//                   {image ? (
//                     <img
//                       src={image}
//                       alt=""
//                       className="h-10 w-14 shrink-0 rounded object-cover"
//                     />
//                   ) : (
//                     <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-muted">
//                       <ImageOff className="h-4 w-4 text-muted-foreground/50" />
//                     </div>
//                   )}
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-xs font-medium">{title}</p>
//                     {subtitle && (
//                       <p className="truncate text-[11px] text-muted-foreground">
//                         {subtitle}
//                       </p>
//                     )}
//                   </div>
//                   {isPicked && (
//                     <Check className="h-4 w-4 shrink-0 text-primary" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ResourcePicker;


// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Check, Database, ImageOff, Search } from "lucide-react";
// import { useApiQuery } from "@/hooks/useAppQuery";
// import { SearchableSelectPopover } from "../ui/searchable-select-popover";

// const ResourcePicker = ({
//   sourceKeys = [],
//   onPick,
//   onUnpick,
//   closeOnPick = true,
//   pickedIds = [],
//   triggerLabel = "Select from existing",
//   triggerVariant = "outline",
//   triggerClassName = "",
// }) => {
//   const [open, setOpen] = useState(false);
//   const [activeSourceKey, setActiveSourceKey] = useState(sourceKeys[0]);
//   const [search, setSearch] = useState("");

//   const { data: modulesResponse, isLoading: modulesLoading } = useApiQuery({
//     url: "/admin/business-modules",
//   });

//   const modules = modulesResponse?.data?.data || [];
//   const moduleSlugs = (modules || []).map((page) => ({
//     value: page.title_slug,
//     label: page.title,
//   }));

//   const {
//     data: itemsFetching,
//     loading: itemsLoading,
//     refetch: refetchItems,
//   } = useApiQuery({
//     url: "/admin/business-module-items",
//     enabled: open && !!activeSourceKey, // ✅ dialog bondho thakle fetch hobe na
//     params: {
//       module_slug: activeSourceKey,
//     },
//   });

//   const moduleItemsRaw = itemsFetching?.data?.data || [];

//   // ✅ search filter ekhon generic module items er upor
//   const moduleItems = search.trim()
//     ? moduleItemsRaw.filter((item) =>
//         String(item?.title || "")
//           .toLowerCase()
//           .includes(search.trim().toLowerCase()),
//       )
//     : moduleItemsRaw;

//   if (!sourceKeys.length) return null;

//   // ✅ generic mapper — business-module-items er real field name onujayi
//   const mapModuleItem = (rawItem) => ({
//     id: rawItem.id,
//     title: rawItem.title || "",
//     subtitle: rawItem.sub_title || "",
//     image: rawItem.image_full_path || "",
//     // ...rawItem, // caller-er dorkar hole raw field o thakbe
//   });

//   const handlePick = (rawItem) => {
//     const isPicked = rawItem.id != null && pickedIds.includes(rawItem.id);

//     if (isPicked && onUnpick) {
//       onUnpick(rawItem, activeSourceKey);
//       return;
//     }

//     const mapped = mapModuleItem(rawItem);
//     onPick(mapped, rawItem, activeSourceKey);
//     if (closeOnPick) setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           size="sm"
//           variant={triggerVariant}
//           className={`h-7 px-2 text-xs ${triggerClassName}`}
//         >
//           <Database className="mr-1 h-3 w-3" /> {triggerLabel}
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="text-sm">Select from existing data</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-3">
//           {moduleSlugs.length > 1 && (
//             <SearchableSelectPopover
//               items={moduleSlugs}
//               value={activeSourceKey}
//               onSelect={(value) => setActiveSourceKey(value)}
//               placeholder="Select Module"
//               searchPlaceholder="Search pages..."
//               emptyText="No pages found."
//               disabled={modulesLoading}
//             />
//           )}

//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
//             <Input
//               className="h-8 pl-8 text-xs"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
//             {itemsLoading && (
//               <p className="py-8 text-center text-xs text-muted-foreground">
//                 Loading...
//               </p>
//             )}

//             {!itemsLoading && moduleItems.length === 0 && (
//               <p className="rounded border border-dashed py-8 text-center text-xs text-muted-foreground">
//                 No records found.
//               </p>
//             )}
//             {console.log("moduleItems", moduleItems)}

//             {moduleItems?.map((item, index) => {
//               console.log("what is the full item", item);
//               const title = item?.title || `Item ${index + 1}`;
//               const image = item?.image_full_path || null;
//               const subtitle = item?.sub_title || null;
//               const isPicked = pickedIds.includes(item.id);

//               console.log("image", image, "title", title, "subtitle", subtitle, "isPicked", isPicked);
//               return (
//                 <button
//                   key={item.id ?? index}
//                   type="button"
//                   onClick={() => handlePick(item)}
//                   className={`flex w-full items-center gap-3 rounded-md border p-2 text-left transition-colors ${
//                     isPicked
//                       ? "border-primary bg-primary/10 hover:bg-primary/5"
//                       : "hover:border-primary hover:bg-primary/5"
//                   }`}
//                 >
//                   {image ? (
//                     <img
//                       src={image}
//                       alt=""
//                       className="h-10 w-14 shrink-0 rounded object-cover"
//                     />
//                   ) : (
//                     <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-muted">
//                       <ImageOff className="h-4 w-4 text-muted-foreground/50" />
//                     </div>
//                   )}
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-xs font-medium">{title}</p>
//                     {subtitle && (
//                       <p className="truncate text-[11px] text-muted-foreground">
//                         {subtitle}
//                       </p>
//                     )}
//                   </div>
//                   {isPicked && (
//                     <Check className="h-4 w-4 shrink-0 text-primary" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ResourcePicker;