import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";
import useImageUpload from "@/hooks/use-image-upload";

const SeoImageField = ({
  label,
  useLogo,
  logoFullPath,
  preview,
  value,
  error,
  onChange,
  onPick,
  onRemove,
  fileInputRef,
  onFileChange,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      {!useLogo && (
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onPick}>
            <Upload className="h-4 w-4" />
          </Button>
          {value && (
            <Button type="button" size="sm" variant="destructive" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </div>
      )}
    </div>

    {useLogo ? (
      <div className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
        {logoFullPath ? (
          <img src={logoFullPath} alt="Logo" className="h-10 w-10 rounded object-contain bg-white border" />
        ) : (
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        )}
        <p className="text-xs text-muted-foreground">Using the business logo</p>
      </div>
    ) : (
      <>
        {preview && <img src={preview} alt={label} className="h-20 w-auto rounded-md border object-cover" />}
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </>
    )}
  </div>
);

const SeoSettings = ({
  seoContent,
  setSeoContent,
  logo,
  logoFullPath,
  handelSaveBusinessMeta,
  updatingBusinessmeta,
}) => {
  const ogFileInputRef = useRef(null);
  const twitterFileInputRef = useRef(null);

  const seoUseLogo = Boolean(
    logo && seoContent.og_image === logo && seoContent.twitter_image === logo,
  );

  const {
    image: ogImageBase64,
    preview: ogImagePreview,
    error: ogImageError,
    handleImageChange: handleOgImageChange,
    resetImage: resetOgImage,
  } = useImageUpload(5);

  const {
    image: twitterImageBase64,
    preview: twitterImagePreview,
    error: twitterImageError,
    handleImageChange: handleTwitterImageChange,
    resetImage: resetTwitterImage,
  } = useImageUpload(5);

  const updateSeoField = (key, value) => setSeoContent((prev) => ({ ...prev, [key]: value }));

  const handleToggleUseLogo = (checked) => {
    if (checked) {
      setSeoContent((prev) => ({ ...prev, og_image: logo || "", twitter_image: logo || "" }));
      resetOgImage();
      resetTwitterImage();
    } else {
      setSeoContent((prev) => ({ ...prev, og_image: "", twitter_image: "" }));
    }
  };

  const handleOgFileChange = (e) => {
    handleOgImageChange(e);
  };

  const handleTwitterFileChange = (e) => {
    handleTwitterImageChange(e);
  };

  React.useEffect(() => {
    if (seoUseLogo || !ogImageBase64) return;
    updateSeoField("og_image", ogImageBase64);
  }, [ogImageBase64]);

  React.useEffect(() => {
    if (seoUseLogo || !twitterImageBase64) return;
    updateSeoField("twitter_image", twitterImageBase64);
  }, [twitterImageBase64]);

  const handleRemoveOgImage = () => {
    resetOgImage();
    updateSeoField("og_image", "");
  };

  const handleRemoveTwitterImage = () => {
    resetTwitterImage();
    updateSeoField("twitter_image", "");
  };

  return (
    <Card className="shadow-sm p-0 m-0">
      <CardHeader className="border-b bg-linear-to-r from-fuchsia-100 to-pink-100 pt-4 flex justify-between items-start">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-5 w-5 text-fuchsia-600" />
            SEO
          </CardTitle>
          <CardDescription>Search engine and social sharing details for your business</CardDescription>
        </div>
        <div>
          <Button disabled={updatingBusinessmeta} onClick={() => handelSaveBusinessMeta({ seo_content: seoContent })}>
            {updatingBusinessmeta ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {updatingBusinessmeta ? "Updating..." : "Update"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="py-6 space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Use Logo as SEO Image</p>
            <p className="text-xs text-muted-foreground">
              Automatically use the business logo for Open Graph and Twitter previews
            </p>
          </div>
          <Switch checked={seoUseLogo} onCheckedChange={handleToggleUseLogo} />
        </div>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="social">Open Graph & Twitter</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="meta" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                value={seoContent.meta_title}
                onChange={(e) => updateSeoField("meta_title", e.target.value)}
                placeholder="Meta title"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={seoContent.meta_description}
                onChange={(e) => updateSeoField("meta_description", e.target.value)}
                rows={3}
                placeholder="Meta description"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Keywords</Label>
              <Input
                value={seoContent.meta_keywords}
                onChange={(e) => updateSeoField("meta_keywords", e.target.value)}
                placeholder="Comma separated keywords"
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6 pt-4">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">Open Graph</p>
              <div className="space-y-2">
                <Label>OG Title</Label>
                <Input
                  value={seoContent.og_title}
                  onChange={(e) => updateSeoField("og_title", e.target.value)}
                  placeholder="OG title"
                />
              </div>
              <div className="space-y-2">
                <Label>OG Description</Label>
                <Textarea
                  value={seoContent.og_description}
                  onChange={(e) => updateSeoField("og_description", e.target.value)}
                  rows={2}
                  placeholder="OG description"
                />
              </div>
              <SeoImageField
                label="OG Image"
                useLogo={seoUseLogo}
                logoFullPath={logoFullPath}
                preview={ogImagePreview}
                value={seoContent.og_image}
                error={ogImageError}
                onChange={(value) => updateSeoField("og_image", value)}
                onPick={() => ogFileInputRef.current?.click()}
                onRemove={handleRemoveOgImage}
                fileInputRef={ogFileInputRef}
                onFileChange={handleOgFileChange}
              />
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">Twitter</p>
              <div className="space-y-2">
                <Label>Twitter Title</Label>
                <Input
                  value={seoContent.twitter_title}
                  onChange={(e) => updateSeoField("twitter_title", e.target.value)}
                  placeholder="Twitter title"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter Description</Label>
                <Textarea
                  value={seoContent.twitter_description}
                  onChange={(e) => updateSeoField("twitter_description", e.target.value)}
                  rows={2}
                  placeholder="Twitter description"
                />
              </div>
              <SeoImageField
                label="Twitter Image"
                useLogo={seoUseLogo}
                logoFullPath={logoFullPath}
                preview={twitterImagePreview}
                value={seoContent.twitter_image}
                error={twitterImageError}
                onChange={(value) => updateSeoField("twitter_image", value)}
                onPick={() => twitterFileInputRef.current?.click()}
                onRemove={handleRemoveTwitterImage}
                fileInputRef={twitterFileInputRef}
                onFileChange={handleTwitterFileChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Canonical URL</Label>
              <Input
                value={seoContent.canonical_url}
                onChange={(e) => updateSeoField("canonical_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Robots</Label>
              <Input
                value={seoContent.robots}
                onChange={(e) => updateSeoField("robots", e.target.value)}
                placeholder="index, follow"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeoSettings;