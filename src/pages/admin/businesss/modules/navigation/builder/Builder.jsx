import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderMenuBuilder } from "./partials/HeaderMenuBuilder";
import { FooterBuilder } from "./partials/FooterBuilder";
import { useApiQuery } from "@/hooks/useAppQuery";


// ---------- Mock: আপনার ৩ টাইপের পেজ (API থেকে আসবে) ----------
const PAGES = [
  { id: 1, title: "হোম", type: "default", slug: "/" },
  { id: 2, title: "আমাদের পরিচিতি", type: "default", slug: "/about" },
  {
    id: 3,
    title: "কর্মী সম্মেলন ২০২৫",
    type: "custom",
    slug: "/conference-2025",
  },
  { id: 4, title: "আমীরে জামায়াতের পরিচয়", type: "custom", slug: "/amir" },
  {
    id: 5,
    title: "ইউটিউব চ্যানেল",
    type: "link",
    slug: "https://youtube.com/@channel",
  },
  { id: 6, title: "যোগাযোগ", type: "default", slug: "/contact" },
];

const TYPE_STYLES = {
  default: "bg-blue-100 text-blue-700",
  custom: "bg-violet-100 text-violet-700",
  link: "bg-amber-100 text-amber-700",
  external: "bg-emerald-100 text-emerald-700",
};

const TypeBadge = ({ type }) => (
  <Badge
    variant="secondary"
    className={`text-[10px] px-1.5 py-0 font-medium ${TYPE_STYLES[type] || TYPE_STYLES.default}`}
  >
    {type}
  </Badge>
);

let uid = 100;
const newId = (prefix) => `${prefix}-${++uid}`;


/* ============================================================ */

export default function Builder() {

  const {data:allActivePagesResponse} = useApiQuery({
    url: "/admin/all-active-pages"
  })

  const {data:businessSettings} = useApiQuery({
    url: "/admin/business-settings"
  })
  

  const allActivePages = allActivePagesResponse?.data || []
  const setting = businessSettings?.data || {}

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Appearance সেটিংস
          </h1>
          <p className="text-sm text-slate-500">
            হেডার মেনু ও ফুটার — drag & drop দিয়ে ম্যানেজ করুন
          </p>
        </div>
        <Tabs defaultValue="menu">
          <TabsList>
            <TabsTrigger value="menu">হেডার মেনু</TabsTrigger>
            <TabsTrigger value="footer">ফুটার</TabsTrigger>
          </TabsList>
          <TabsContent value="menu" className="mt-5">
            <HeaderMenuBuilder 
              allActivePages={allActivePages}
            />
          </TabsContent>
          <TabsContent value="footer" className="mt-5">
            <FooterBuilder allActivePages={allActivePages} setting={setting}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
