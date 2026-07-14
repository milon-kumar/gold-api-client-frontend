import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  FileText,
  BarChart3,
  Megaphone,
  Percent,
  Globe,
  Palette,
  FileEdit,
  Layers,
  Settings,
  Zap,
  LayoutDashboard,
  MoreVertical,
  RefreshCw,
  Eye,
  Copy,
  Trash2,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router";

const navigationItems = [
  { icon: Home, label: "Home" },
  { icon: ShoppingBag, label: "Orders" },
  { icon: Package, label: "Products" },
  { icon: Users, label: "Customers" },
  { icon: FileText, label: "Content" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Megaphone, label: "Marketing" },
  { icon: Percent, label: "Discounts" },
];

const salesChannelsItems = [
  { icon: Globe, label: "Online Store" },
  { icon: Palette, label: "Themes" },
];

const contentItems = [
  { icon: FileEdit, label: "Blog posts" },
  { icon: Layers, label: "Pages" },
  { icon: LayoutDashboard, label: "Navigation" },
  { icon: Settings, label: "Preferences" },
];

const appsItems = [{ icon: Zap, label: "Flow" }];

const themesData = [
  {
    id: "1",
    name: "Generated Data Theme",
    version: "1.0.0",
    added: "Jul 15 at 7:52 am EDT",
    isCurrent: true,
    image: "https://placehold.co/600x400/1a1a2e/ffffff?text=Theme+Preview",
  },
  {
    id: "2",
    name: "Trade",
    version: "15.2.0",
    added: "Tuesday at 5:51 am EDT",
    hasUpdate: true,
    image: "https://placehold.co/600x400/16213e/ffffff?text=Trade+Preview",
  },
  {
    id: "3",
    name: "Dawn",
    version: "15.0.0",
    added: "Monday at 2:30 pm EDT",
    image: "https://placehold.co/600x400/0f3460/ffffff?text=Dawn+Preview",
  },
  {
    id: "4",
    name: "Sense",
    version: "14.1.0",
    added: "Sunday at 9:15 am EDT",
    image: "https://placehold.co/600x400/533483/ffffff?text=Sense+Preview",
  },
];

export default function Themes() {
  const [themes, setThemes] = useState(themesData);
  const [passwordProtected, setPasswordProtected] = useState(true);
  const navigate = useNavigate();

  const handleThemeAction = (action, themeId) => {
    console.log(`${action} on theme ${themeId}`);
  };

  const handelAddTheme = () =>{
    navigate('/admin/settings/themes/builder')
  }

  return (
    <div>
      {/* Development notice */}
      <Card className="mb-6 bg-muted/30 border-primary/20">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Your online store is in development.
              </p>
              <p className="text-sm text-muted-foreground">
                To let visitors access your store, give them the password.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={passwordProtected}
                onCheckedChange={setPasswordProtected}
              />
              <span className="text-sm">Password protected</span>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              See store password
            </Button>
            <Button variant="link" size="sm" className="text-primary">
              Learn more
            </Button>
            <Button variant="link" size="sm" className="text-primary" onClick={handelAddTheme}>
              Add a new theme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current theme card */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Current theme
        </h2>
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-32 overflow-hidden rounded-md border bg-muted">
                  <img
                    src={themes[0].image}
                    alt={themes[0].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{themes[0].name}</h3>
                    <Badge className="bg-primary text-primary-foreground">
                      Current
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Version {themes[0].version} · Last saved: {themes[0].added}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit code</DropdownMenuItem>
                    <DropdownMenuItem>Customize</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme library */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Theme library
          </h2>
          <p className="text-xs text-muted-foreground">
            These themes are only visible to you. You can switch to another
            theme by publishing it to your store.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6">
          {themes.slice(1).map((theme) => (
            <Card key={theme.id} className="overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="h-full w-full object-cover"
                />
                {theme.hasUpdate && (
                  <Badge
                    variant="secondary"
                    className="absolute right-2 top-2 bg-primary text-primary-foreground"
                  >
                    Update available
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{theme.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Version {theme.version}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added: {theme.added}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Publish</DropdownMenuItem>
                      <DropdownMenuItem>Customize</DropdownMenuItem>
                      <DropdownMenuItem>Edit code</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 border-t bg-muted/20 p-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1">
                  Publish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          Generated test data · A theme and populated test store by Shopify to
          help you test commerce primitives.
        </p>
      </div>
    </div>
  );
}
