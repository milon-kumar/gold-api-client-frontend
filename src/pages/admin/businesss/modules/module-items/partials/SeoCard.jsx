import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

const SeoImageField = ({
  label,
  useMainImage,
  mainImagePreview,
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
      {!useMainImage && (
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

    {useMainImage ? (
      <div className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
        {mainImagePreview ? (
          <img src={mainImagePreview} alt="Main" className="h-10 w-10 rounded object-cover" />
        ) : (
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        )}
        <p className="text-xs text-muted-foreground">Using the main image</p>
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

const SeoCard = ({
  seoContent,
  onSeoFieldChange,
  seoUseMainImage,
  onToggleSeoUseMainImage,
  mainImagePreview,
  ogImage,
  twitterImage,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Search className="h-5 w-5 text-purple-600" />
          SEO
        </CardTitle>
        <CardDescription>Search engine and social sharing details</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Use Main Image for SEO</p>
            <p className="text-xs text-muted-foreground">
              Automatically use the item's main image for Open Graph and Twitter previews
            </p>
          </div>
          <Switch checked={seoUseMainImage} onCheckedChange={onToggleSeoUseMainImage} />
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
                onChange={(e) => onSeoFieldChange("meta_title", e.target.value)}
                placeholder="Meta title"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={seoContent.meta_description}
                onChange={(e) => onSeoFieldChange("meta_description", e.target.value)}
                rows={3}
                placeholder="Meta description"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Keywords</Label>
              <Input
                value={seoContent.meta_keywords}
                onChange={(e) => onSeoFieldChange("meta_keywords", e.target.value)}
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
                  onChange={(e) => onSeoFieldChange("og_title", e.target.value)}
                  placeholder="OG title"
                />
              </div>
              <div className="space-y-2">
                <Label>OG Description</Label>
                <Textarea
                  value={seoContent.og_description}
                  onChange={(e) => onSeoFieldChange("og_description", e.target.value)}
                  rows={2}
                  placeholder="OG description"
                />
              </div>
              <SeoImageField
                label="OG Image"
                useMainImage={seoUseMainImage}
                mainImagePreview={mainImagePreview}
                preview={ogImage.preview}
                value={seoContent.og_image}
                error={ogImage.error}
                onChange={(value) => onSeoFieldChange("og_image", value)}
                onPick={() => ogImage.fileInputRef.current?.click()}
                onRemove={ogImage.onRemove}
                fileInputRef={ogImage.fileInputRef}
                onFileChange={ogImage.onFileChange}
              />
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">Twitter</p>
              <div className="space-y-2">
                <Label>Twitter Title</Label>
                <Input
                  value={seoContent.twitter_title}
                  onChange={(e) => onSeoFieldChange("twitter_title", e.target.value)}
                  placeholder="Twitter title"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter Description</Label>
                <Textarea
                  value={seoContent.twitter_description}
                  onChange={(e) => onSeoFieldChange("twitter_description", e.target.value)}
                  rows={2}
                  placeholder="Twitter description"
                />
              </div>
              <SeoImageField
                label="Twitter Image"
                useMainImage={seoUseMainImage}
                mainImagePreview={mainImagePreview}
                preview={twitterImage.preview}
                value={seoContent.twitter_image}
                error={twitterImage.error}
                onChange={(value) => onSeoFieldChange("twitter_image", value)}
                onPick={() => twitterImage.fileInputRef.current?.click()}
                onRemove={twitterImage.onRemove}
                fileInputRef={twitterImage.fileInputRef}
                onFileChange={twitterImage.onFileChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Canonical URL</Label>
              <Input
                value={seoContent.canonical_url}
                onChange={(e) => onSeoFieldChange("canonical_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Robots</Label>
              <Input
                value={seoContent.robots}
                onChange={(e) => onSeoFieldChange("robots", e.target.value)}
                placeholder="index, follow"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeoCard;