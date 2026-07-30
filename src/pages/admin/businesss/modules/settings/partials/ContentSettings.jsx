import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, Layout, LayoutTemplate, Loader2, PanelBottom, Save } from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery";
import { SearchableSelectPopover } from "@/components/ui/searchable-select-popover";
import { Button } from "@/components/ui/button";

const ContentSettings = ({ settingsMeta, setSettingsMeta ,handelSaveBusinessMeta, updatingBusinessmeta}) => {
    const {
        data: pagesResponse,
        loading: pagesLoading,
        refetch: refetchPages,
    } = useApiQuery({
        url: "/admin/pages",
    });

    const { data: navbarsResponse, loading: navbarsLoading } = useApiQuery({
        url: "/admin/navbars/list",
    });

    const { data: footersResponse, loading: footersLoading } = useApiQuery({
        url: "/admin/footers/list",
    });

    const pageItems = (pagesResponse?.data?.data || []).map((page) => ({
        value: page.id,
        label: page.page_title,
    }));

    const navbarItems = (navbarsResponse?.data || []).map((navbar) => ({
        value: navbar.id,
        label: navbar.name,
    }));

    const footerItems = (footersResponse?.data || []).map((footer) => ({
        value: footer.id,
        label: footer.name,
    }));

    const updateMeta = (key, value) => setSettingsMeta((prev) => ({ ...prev, [key]: value }));

    return (
        <Card className="shadow-sm p-0 m-0">
            <CardHeader className="border-b bg-linear-to-r from-purple-50 to-violet-50 pt-4 flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Content & Settings
                </CardTitle>
                <CardDescription>Contract text, copyright information and configurations</CardDescription>
                </div>
                <div>
                    <Button className={''} disabled={updatingBusinessmeta} onClick={() => handelSaveBusinessMeta(settingsMeta)}>
                        {
                            updatingBusinessmeta? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>
                        }
                        {updatingBusinessmeta ? 'Updating...':'Update'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5 text-sm">
                            <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground" />
                            Home Page
                        </Label>
                        <SearchableSelectPopover
                            items={pageItems}
                            value={settingsMeta.home_page_id}
                            onSelect={(value) => updateMeta("home_page_id", value)}
                            placeholder="Select home page"
                            searchPlaceholder="Search pages..."
                            emptyText="No pages found."
                            disabled={pagesLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5 text-sm">
                            <Layout className="h-3.5 w-3.5 text-muted-foreground" />
                            Navbar
                        </Label>
                        <SearchableSelectPopover
                            items={navbarItems}
                            value={settingsMeta.navbar_id}
                            onSelect={(value) => updateMeta("navbar_id", value)}
                            placeholder="Select navbar"
                            searchPlaceholder="Search navbars..."
                            emptyText="No navbars found."
                            disabled={navbarsLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5 text-sm">
                            <PanelBottom className="h-3.5 w-3.5 text-muted-foreground" />
                            Footer
                        </Label>
                        <SearchableSelectPopover
                            items={footerItems}
                            value={settingsMeta.footer_id}
                            onSelect={(value) => updateMeta("footer_id", value)}
                            placeholder="Select footer"
                            searchPlaceholder="Search footers..."
                            emptyText="No footers found."
                            disabled={footersLoading}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ContentSettings;