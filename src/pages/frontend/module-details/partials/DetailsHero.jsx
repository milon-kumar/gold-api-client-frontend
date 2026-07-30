import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Image as ImageIcon } from "lucide-react";
import StatusBadge from "@/components/shear/StatusBadge";

const DetailsHero = ({ item }) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative h-64 w-full bg-gradient-to-br from-slate-100 to-slate-50 sm:h-80">
        {item.image_full_path ? (
          <img src={item.image_full_path} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status={item.status} />
            {Boolean(item.is_featured) && (
              <Badge className="bg-yellow-400 text-yellow-950 border-0 gap-1">
                <Star className="h-3 w-3 fill-yellow-950" />
                Featured
              </Badge>
            )}
            {item.category?.name && (
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                {item.category.name}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">{item.title}</h1>
          {item.sub_title && <p className="mt-1 text-white/90 text-sm sm:text-base">{item.sub_title}</p>}
        </div>
      </div>
    </div>
  );
};

export default DetailsHero;