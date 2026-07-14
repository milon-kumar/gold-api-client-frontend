// LeftControlPanel.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUUId } from "@/lib/helper";
import { defaultPageConfig } from "@/store/default/page-config";
import {
  LayoutTemplate,
  Plus,
  Search,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useState } from "react";

// const componentCategories = [
//   {
//     id: "hero",
//     name: "Hero Sections",
//     icon: <Layout className="h-4 w-4" />,
//     components: [
//       {
//         id: "hero-centered",
//         name: "Centered Hero",
//         icon: <LayoutGrid className="h-4 w-4" />,
//         description: "Centered hero with heading, subheading and CTA",
//         category: "hero",
//         preview:
//           "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Centered+Hero",
//         tags: ["hero", "centered", "cta"],
//         defaultSettings: {
//           template: "centered",
//           layout: "full-width",
//           backgroundColor: "#3b82f6",
//           textColor: "#ffffff",
//           padding: 80,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Build Amazing Websites",
//             subheading: "Create stunning pages with our drag-and-drop builder",
//             ctaText: "Get Started",
//             ctaLink: "#",
//             image: "hero-image.jpg",
//           },
//         },
//       },
//       {
//         id: "hero-left",
//         name: "Left Aligned Hero",
//         icon: <PanelLeft className="h-4 w-4" />,
//         description: "Hero with content on left and image on right",
//         category: "hero",
//         preview:
//           "https://via.placeholder.com/200x100/8b5cf6/ffffff?text=Left+Hero",
//         tags: ["hero", "left-aligned", "image"],
//         defaultSettings: {
//           template: "left-aligned",
//           layout: "full-width",
//           backgroundColor: "#8b5cf6",
//           textColor: "#ffffff",
//           padding: 80,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Powerful Platform",
//             subheading: "Everything you need to grow your business",
//             ctaText: "Learn More",
//             ctaLink: "#",
//             image: "platform-image.jpg",
//           },
//         },
//       },
//       {
//         id: "hero-right",
//         name: "Right Aligned Hero",
//         icon: <PanelRight className="h-4 w-4" />,
//         description: "Hero with image on left and content on right",
//         category: "hero",
//         preview:
//           "https://via.placeholder.com/200x100/ec4899/ffffff?text=Right+Hero",
//         tags: ["hero", "right-aligned", "image"],
//         defaultSettings: {
//           template: "right-aligned",
//           layout: "full-width",
//           backgroundColor: "#ec4899",
//           textColor: "#ffffff",
//           padding: 80,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Innovative Solutions",
//             subheading: "Transform your ideas into reality",
//             ctaText: "Explore",
//             ctaLink: "#",
//             image: "innovation-image.jpg",
//           },
//         },
//       },
//       {
//         id: "hero-video",
//         name: "Video Hero",
//         icon: <Play className="h-4 w-4" />,
//         description: "Hero with video background and overlay",
//         category: "hero",
//         preview:
//           "https://via.placeholder.com/200x100/ef4444/ffffff?text=Video+Hero",
//         tags: ["hero", "video", "overlay"],
//         defaultSettings: {
//           template: "video",
//           layout: "full-width",
//           backgroundColor: "#ef4444",
//           textColor: "#ffffff",
//           padding: 80,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Watch Our Story",
//             subheading: "Discover what makes us unique",
//             ctaText: "Play Video",
//             ctaLink: "#",
//             videoUrl: "https://www.youtube.com/watch?v=example",
//           },
//         },
//       },
//     ],
//   },
//   {
//     id: "about",
//     name: "About Sections",
//     icon: <Info className="h-4 w-4" />,
//     components: [
//       {
//         id: "about-details",
//         name: "About Details",
//         icon: <FileText className="h-4 w-4" />,
//         description: "Company information with stats and features",
//         category: "about",
//         preview: "https://via.placeholder.com/200x100/10b981/ffffff?text=About",
//         tags: ["about", "details", "stats"],
//         defaultSettings: {
//           template: "details",
//           layout: "boxed",
//           backgroundColor: "#ffffff",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "About Our Company",
//             subheading: "We are dedicated to excellence",
//             content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//             stats: [
//               { label: "Years of Experience", value: "10+" },
//               { label: "Happy Clients", value: "500+" },
//               { label: "Projects Completed", value: "1000+" },
//             ],
//           },
//         },
//       },
//       {
//         id: "about-team",
//         name: "Team Members",
//         icon: <Users className="h-4 w-4" />,
//         description: "Showcase your team members",
//         category: "about",
//         preview: "https://via.placeholder.com/200x100/14b8a6/ffffff?text=Team",
//         tags: ["about", "team", "members"],
//         defaultSettings: {
//           template: "team",
//           layout: "boxed",
//           backgroundColor: "#f8fafc",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Meet Our Team",
//             subheading: "The people behind our success",
//             team: [
//               { name: "John Doe", role: "CEO", image: "john.jpg" },
//               { name: "Jane Smith", role: "CTO", image: "jane.jpg" },
//               { name: "Mike Johnson", role: "Design Lead", image: "mike.jpg" },
//             ],
//           },
//         },
//       },
//       {
//         id: "about-timeline",
//         name: "Timeline",
//         icon: <Clock className="h-4 w-4" />,
//         description: "Company history timeline",
//         category: "about",
//         preview:
//           "https://via.placeholder.com/200x100/06b6d4/ffffff?text=Timeline",
//         tags: ["about", "timeline", "history"],
//         defaultSettings: {
//           template: "timeline",
//           layout: "boxed",
//           backgroundColor: "#ffffff",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Our Journey",
//             subheading: "How we grew to where we are today",
//             events: [
//               {
//                 year: "2010",
//                 title: "Company Founded",
//                 description: "Started with a small team",
//               },
//               {
//                 year: "2013",
//                 title: "First Major Client",
//                 description: "Secured enterprise partnership",
//               },
//               {
//                 year: "2016",
//                 title: "Expansion",
//                 description: "Opened new offices",
//               },
//               {
//                 year: "2020",
//                 title: "Global Reach",
//                 description: "Expanded to 20 countries",
//               },
//             ],
//           },
//         },
//       },
//     ],
//   },
//   {
//     id: "features",
//     name: "Features & Services",
//     icon: <Zap className="h-4 w-4" />,
//     components: [
//       {
//         id: "features-grid",
//         name: "Features Grid",
//         icon: <Grid className="h-4 w-4" />,
//         description: "Features in a responsive grid layout",
//         category: "features",
//         preview:
//           "https://via.placeholder.com/200x100/8b5cf6/ffffff?text=Features",
//         tags: ["features", "grid", "services"],
//         defaultSettings: {
//           template: "grid-3",
//           layout: "boxed",
//           backgroundColor: "#ffffff",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Our Features",
//             subheading: "Everything you need to succeed",
//             features: [
//               {
//                 title: "Fast Performance",
//                 description: "Lightning fast loading times",
//                 icon: "zap",
//               },
//               {
//                 title: "Responsive Design",
//                 description: "Looks great on all devices",
//                 icon: "layout",
//               },
//               {
//                 title: "Easy Customization",
//                 description: "Simple drag and drop interface",
//                 icon: "settings",
//               },
//               {
//                 title: "Secure Platform",
//                 description: "Enterprise-grade security",
//                 icon: "shield",
//               },
//               {
//                 title: "24/7 Support",
//                 description: "Round the clock assistance",
//                 icon: "phone",
//               },
//               {
//                 title: "Analytics",
//                 description: "Track your performance",
//                 icon: "chart",
//               },
//             ],
//           },
//         },
//       },
//       {
//         id: "features-cards",
//         name: "Feature Cards",
//         icon: <LayoutGrid className="h-4 w-4" />,
//         description: "Feature cards with icons and hover effects",
//         category: "features",
//         preview: "https://via.placeholder.com/200x100/0ea5e9/ffffff?text=Cards",
//         tags: ["features", "cards", "hover"],
//         defaultSettings: {
//           template: "cards",
//           layout: "boxed",
//           backgroundColor: "#f1f5f9",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Why Choose Us",
//             subheading: "We deliver exceptional value",
//             cards: [
//               {
//                 icon: "shield",
//                 title: "Reliability",
//                 description: "99.9% uptime guaranteed",
//               },
//               {
//                 icon: "award",
//                 title: "Quality",
//                 description: "Award-winning solutions",
//               },
//               {
//                 icon: "trending-up",
//                 title: "Growth",
//                 description: "Scalable infrastructure",
//               },
//             ],
//           },
//         },
//       },
//     ],
//   },
//   {
//     id: "contact",
//     name: "Contact Sections",
//     icon: <Mail className="h-4 w-4" />,
//     components: [
//       {
//         id: "contact-form",
//         name: "Contact Form",
//         icon: <MessageSquare className="h-4 w-4" />,
//         description: "Contact form with validation",
//         category: "contact",
//         preview:
//           "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Contact",
//         tags: ["contact", "form", "email"],
//         defaultSettings: {
//           template: "form",
//           layout: "boxed",
//           backgroundColor: "#ffffff",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Get In Touch",
//             subheading: "We'd love to hear from you",
//             fields: ["name", "email", "message"],
//           },
//         },
//       },
//       {
//         id: "contact-info",
//         name: "Contact Info",
//         icon: <MapPin className="h-4 w-4" />,
//         description: "Contact details with map",
//         category: "contact",
//         preview: "https://via.placeholder.com/200x100/8b5cf6/ffffff?text=Info",
//         tags: ["contact", "info", "map"],
//         defaultSettings: {
//           template: "info",
//           layout: "boxed",
//           backgroundColor: "#f8fafc",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Contact Information",
//             subheading: "Reach out to us",
//             address: "123 Main St, City, Country",
//             phone: "+1 234 567 8900",
//             email: "contact@company.com",
//           },
//         },
//       },
//     ],
//   },
//   {
//     id: "testimonials",
//     name: "Testimonials",
//     icon: <Star className="h-4 w-4" />,
//     components: [
//       {
//         id: "testimonials-grid",
//         name: "Testimonials Grid",
//         icon: <LayoutGrid className="h-4 w-4" />,
//         description: "Client testimonials in grid",
//         category: "testimonials",
//         preview:
//           "https://via.placeholder.com/200x100/10b981/ffffff?text=Testimonials",
//         tags: ["testimonials", "clients", "reviews"],
//         defaultSettings: {
//           template: "grid",
//           layout: "boxed",
//           backgroundColor: "#ffffff",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "What Our Clients Say",
//             subheading: "Real feedback from real customers",
//             testimonials: [
//               {
//                 name: "John Doe",
//                 role: "CEO, Company",
//                 content: "Great service! Highly recommended.",
//                 rating: 5,
//               },
//               {
//                 name: "Jane Smith",
//                 role: "Product Manager",
//                 content: "Amazing platform!",
//                 rating: 5,
//               },
//               {
//                 name: "Mike Johnson",
//                 role: "Developer",
//                 content: "Best tool I've ever used.",
//                 rating: 4,
//               },
//             ],
//           },
//         },
//       },
//     ],
//   },
//   {
//     id: "pricing",
//     name: "Pricing Tables",
//     icon: <DollarSign className="h-4 w-4" />,
//     components: [
//       {
//         id: "pricing-tiers",
//         name: "Pricing Tiers",
//         icon: <Columns className="h-4 w-4" />,
//         description: "Pricing plans in columns",
//         category: "pricing",
//         preview:
//           "https://via.placeholder.com/200x100/ef4444/ffffff?text=Pricing",
//         tags: ["pricing", "plans", "tiers"],
//         defaultSettings: {
//           template: "tiers",
//           layout: "boxed",
//           backgroundColor: "#ffffff",
//           textColor: "#000000",
//           padding: 60,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             heading: "Simple Pricing",
//             subheading: "Choose the plan that fits your needs",
//             plans: [
//               {
//                 name: "Basic",
//                 price: "$29",
//                 features: ["Feature 1", "Feature 2", "Feature 3"],
//               },
//               {
//                 name: "Pro",
//                 price: "$49",
//                 features: ["Everything in Basic", "Feature 4", "Feature 5"],
//               },
//               {
//                 name: "Enterprise",
//                 price: "$99",
//                 features: ["Everything in Pro", "Feature 6", "Feature 7"],
//               },
//             ],
//           },
//         },
//       },
//     ],
//   },
//   {
//     id: "footer",
//     name: "Footer",
//     icon: <PanelBottom className="h-4 w-4" />,
//     components: [
//       {
//         id: "footer-standard",
//         name: "Standard Footer",
//         icon: <Layout className="h-4 w-4" />,
//         description: "Standard footer with links and social",
//         category: "footer",
//         preview:
//           "https://via.placeholder.com/200x100/1e293b/ffffff?text=Footer",
//         tags: ["footer", "links", "social"],
//         defaultSettings: {
//           template: "standard",
//           layout: "full-width",
//           backgroundColor: "#1e293b",
//           textColor: "#ffffff",
//           padding: 40,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             company: "My Company",
//             links: ["Home", "About", "Services", "Contact"],
//             social: ["facebook", "twitter", "linkedin"],
//           },
//         },
//       },
//       {
//         id: "footer-minimal",
//         name: "Minimal Footer",
//         icon: <PanelBottom className="h-4 w-4" />,
//         description: "Minimal footer with copyright only",
//         category: "footer",
//         preview:
//           "https://via.placeholder.com/200x100/0f172a/ffffff?text=Minimal",
//         tags: ["footer", "minimal", "copyright"],
//         defaultSettings: {
//           template: "minimal",
//           layout: "full-width",
//           backgroundColor: "#0f172a",
//           textColor: "#94a3b8",
//           padding: 20,
//           margin: 0,
//           contentSource: "static",
//           customContent: {
//             copyright: "© 2026 My Company. All rights reserved.",
//           },
//         },
//       },
//     ],
//   },
// ];

const CustomPageLeftControlPanel = ({
  sections,
  onAddSection,
  onRemoveSection,
  onToggleVisibleSection,
  onAddComponent,
  onRemoveComponent,
  onToggleVisibleComponent,
  setSelectedSectionId,
  setSelectedComponentId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const filteredComponents = defaultPageConfig;

  const handelAddSection = () => {
    const section = {
      id: getUUId(),
      title: `Section ${sections.length + 1}`,
      order: sections.length + 1,
      is_visible: true,
      settings: {},
      components: [],
    };

    onAddSection(section);
  };

  const handleAddComponent = (component) => {
    const newComponent = {
      id: getUUId(),
      ...component,
    };

    onAddComponent(openPopoverId, newComponent);
    setOpenPopoverId(null);
  };

  const handelSelectComponent = (section, component) => {
    setSelectedSectionId(section.id);
    setSelectedComponentId(component.id);
  };

  console.log("CustomPageLeftControlPanel - ", {
    sections,
  });

  return (
    <Card className="w-72 border-r rounded-none">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-sm flex items-center justify-between gap-2">
          <div className="text-sm flex items-center gap-1">
            <LayoutTemplate className="h-4 w-4" />
            <span>Sections</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {sections.length}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="sticky top-48 p-3">
        <ScrollArea className="h-[calc(100vh-150px)] hide-scrollbar">
          {sections?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <LayoutTemplate className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No sections added yet</p>
              <p className="text-xs mb-2">Click "Add Section" to get started</p>
              <Button size="sm" onClick={handelAddSection}>
                <Plus /> Add section
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* {sections?.map((section, index) => (
                <div
                  key={section.id}
                  className="group rounded-lg border bg-background transition-all"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {section.title}
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                          Section #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Popover
                        key={index}
                        open={openPopoverId === section.id}
                        onOpenChange={(open) =>
                          setOpenPopoverId(open ? section.id : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button size="sm" className="gap-1">
                            <Plus className="h-3 w-3" />
                            Add
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-96 p-0"
                          align="start"
                          sideOffset={5}
                          style={{ height: "500px" }}
                        >
                          <div className="flex flex-col h-full">
                            <div className="p-4 border-b shrink-0">
                              <div className="relative">
                                <Input
                                  placeholder="Search components..."
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  className="pl-8"
                                />
                                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                  <Search className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
                              <div className="grid grid-cols-2 gap-3">
                                {filteredComponents.map((component) => (
                                  <div
                                    key={component.id}
                                    className="group relative border rounded-md p-2 hover:border-primary hover:bg-accent/50 transition-all cursor-pointer"
                                    onClick={() =>
                                      handleAddComponent(component)
                                    }
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                                        {component.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">
                                          {component.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate">
                                          {component.description}
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap gap-0.5 shrink-0">
                                        {component.tags
                                          .slice(0, 1)
                                          .map((tag) => (
                                            <Badge
                                              key={tag}
                                              variant="outline"
                                              className="text-[8px] px-1 py-0 h-4"
                                            >
                                              {tag}
                                            </Badge>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {filteredComponents.length === 0 && (
                                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                                    <p>No components found</p>
                                    <p className="text-sm">
                                      Try adjusting your search
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onToggleVisibleSection(section)}
                      >
                        {section.is_visible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => onRemoveSection(section)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {section.components.length > 0 && (
                    <div className="border-t bg-muted/20 px-3 py-2 space-y-2">
                      {section.components.map((component) => (
                        <div
                          key={component.id}
                          className="flex items-center justify-between rounded-md border bg-background px-2 py-2"
                        >
                          <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                              handelSelectComponent(section, component)
                            }
                          >
                            <GripVertical className="h-3 w-3 text-muted-foreground" />

                            <p className="text-xs font-medium">
                              {component.name}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                onToggleVisibleComponent(
                                  section?.id,
                                  component?.id,
                                )
                              }
                            >
                              {component.is_visible ? (
                                <Eye className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() =>
                                onRemoveComponent(section?.id, component?.id)
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))} */}

              <Button size="sm" onClick={handelAddSection}>
                <Plus /> Add section
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CustomPageLeftControlPanel;
