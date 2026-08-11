import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESET_GRADIENTS = [
  "bg-linear-to-r from-cyan-500 to-blue-500",
  "bg-linear-to-r from-pink-500 to-rose-500",
  "bg-linear-to-r from-amber-500 to-orange-500",
  "bg-linear-to-r from-emerald-500 to-teal-500",
  "bg-linear-to-r from-violet-500 to-purple-500",
  "bg-linear-to-r from-slate-900 to-slate-700",
  "bg-linear-to-r from-red-500 to-yellow-500",
  "bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500",
  "bg-linear-to-br from-fuchsia-500 via-rose-500 to-orange-400",
  "bg-linear-to-r from-lime-500 to-green-600",
  "bg-linear-to-r from-sky-500 to-indigo-500",
  "bg-linear-to-r from-gray-700 to-gray-900",
];

const DIRECTIONS = [
  { label: "→", value: "to right" },
  { label: "←", value: "to left" },
  { label: "↑", value: "to top" },
  { label: "↓", value: "to bottom" },
  { label: "↗", value: "to top right" },
  { label: "↘", value: "to bottom right" },
  { label: "↖", value: "to top left" },
  { label: "↙", value: "to bottom left" },
];

// arbitrary value গুলোতে space এর জায়গায় "_" লাগে (tailwind syntax)
const toArbitraryClass = ({ type, direction, from, via, to }) => {
  const dir = direction.replace(/\s+/g, "_");
  if (type === "radial") {
    const stops = via ? `${from},${via},${to}` : `${from},${to}`;
    return `bg-[radial-gradient(circle,${stops})]`;
  }
  const stops = via ? `${from},${via},${to}` : `${from},${to}`;
  return `bg-[linear-gradient(${dir},${stops})]`;
};

// আগের custom value থেকে fields পার্স করে ফিরিয়ে আনার চেষ্টা (edit করার সময় কাজে লাগবে)
const parseCustomValue = (value) => {
  const match = value?.match(/bg-\[(linear|radial)-gradient\(([^)]+)\)\]/);
  if (!match) return null;

  const type = match[1] === "radial" ? "radial" : "linear";
  const parts = match[2].split(",").map((p) => p.trim());

  if (type === "radial") {
    const [, ...colors] = parts; // প্রথমটা "circle"
    return {
      type,
      direction: "to right",
      from: colors[0]?.replace(/_/g, " ") || "#06b6d4",
      via: colors.length > 2 ? colors[1]?.replace(/_/g, " ") : "",
      to: (colors.length > 2 ? colors[2] : colors[1])?.replace(/_/g, " ") || "#3b82f6",
    };
  }

  const [dirRaw, ...colors] = parts;
  return {
    type,
    direction: dirRaw.replace(/_/g, " "),
    from: colors[0]?.replace(/_/g, " ") || "#06b6d4",
    via: colors.length > 2 ? colors[1]?.replace(/_/g, " ") : "",
    to: (colors.length > 2 ? colors[2] : colors[1])?.replace(/_/g, " ") || "#3b82f6",
  };
};

const GradentColorPicker = ({ value, onChange }) => {
  const parsedCustom = useMemo(() => parseCustomValue(value), [value]);

  const [type, setType] = useState(parsedCustom?.type || "linear");
  const [direction, setDirection] = useState(parsedCustom?.direction || "to right");
  const [from, setFrom] = useState(parsedCustom?.from || "#06b6d4");
  const [via, setVia] = useState(parsedCustom?.via || "");
  const [to, setTo] = useState(parsedCustom?.to || "#3b82f6");
  const [useVia, setUseVia] = useState(Boolean(parsedCustom?.via));

  const applyCustom = (overrides = {}) => {
    const next = toArbitraryClass({
      type,
      direction,
      from,
      via: useVia ? via || "#a855f7" : "",
      to,
      ...overrides,
    });
    onChange?.(next);
  };

  const previewStyle = useMemo(() => {
    if (!value) return {};
    // preset class হলে inline style দরকার নেই, তবে fallback হিসেবে custom গুলোর জন্য
    return {};
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 shadow-sm transition hover:border-primary hover:shadow"
        >
          <span
            className={cn("h-5 w-5 shrink-0 rounded-md border border-white shadow", value)}
            style={previewStyle}
          />
          <span className="truncate text-xs text-slate-500">{value || "Select gradient"}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-3" align="start">
        <Tabs defaultValue="preset">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* ---------- Preset tab ---------- */}
          <TabsContent value="preset" className="mt-3">
            <div className="grid grid-cols-4 gap-2">
              {PRESET_GRADIENTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange?.(preset)}
                  className={cn(
                    "h-10 rounded-md border-2 transition",
                    preset,
                    value === preset
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-slate-300"
                  )}
                  title={preset}
                />
              ))}
            </div>
          </TabsContent>

          {/* ---------- Custom tab ---------- */}
          <TabsContent value="custom" className="mt-3 space-y-3">
            {/* preview */}
            <div
              className="h-12 w-full rounded-md border"
              style={{
                background:
                  type === "radial"
                    ? `radial-gradient(circle, ${from}, ${useVia && via ? via + "," : ""} ${to})`
                    : `linear-gradient(${direction}, ${from}, ${useVia && via ? via + "," : ""} ${to})`,
              }}
            />

            {/* type */}
            <div className="flex gap-2">
              {["linear", "radial"].map((t) => (
                <Button
                  key={t}
                  type="button"
                  size="sm"
                  variant={type === t ? "default" : "outline"}
                  className="flex-1 capitalize"
                  onClick={() => {
                    setType(t);
                    applyCustom({ type: t });
                  }}
                >
                  {t}
                </Button>
              ))}
            </div>

            {/* direction (linear হলে দেখাবে) */}
            {type === "linear" && (
              <div className="grid grid-cols-4 gap-1.5">
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => {
                      setDirection(d.value);
                      applyCustom({ direction: d.value });
                    }}
                    className={cn(
                      "flex h-8 items-center justify-center rounded-md border text-sm",
                      direction === d.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}

            {/* colors */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  applyCustom({ from: e.target.value });
                }}
                className="h-8 w-8 cursor-pointer rounded border"
              />
              <span className="text-xs text-slate-500">From</span>

              {useVia && (
                <>
                  <input
                    type="color"
                    value={via || "#a855f7"}
                    onChange={(e) => {
                      setVia(e.target.value);
                      applyCustom({ via: e.target.value });
                    }}
                    className="h-8 w-8 cursor-pointer rounded border"
                  />
                  <span className="text-xs text-slate-500">Via</span>
                </>
              )}

              <input
                type="color"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  applyCustom({ to: e.target.value });
                }}
                className="h-8 w-8 cursor-pointer rounded border"
              />
              <span className="text-xs text-slate-500">To</span>

              <button
                type="button"
                onClick={() => {
                  const next = !useVia;
                  setUseVia(next);
                  applyCustom({ via: next ? via || "#a855f7" : "" });
                }}
                className="ml-auto text-xs text-primary underline"
              >
                {useVia ? "− via" : "+ via"}
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default GradentColorPicker;