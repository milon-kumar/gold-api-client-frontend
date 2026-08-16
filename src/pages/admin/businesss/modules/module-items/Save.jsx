import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from "sonner";
import useImageUpload from '@/hooks/use-image-upload';

import PageHeader from '@/components/shear/PageHeader';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useApiMutation } from '@/hooks/useAppMutation';

import BasicInfoCard from './partials/BasicInfoCard';
import CategoryCard from './partials/CategoryCard';
import StatusSettingsCard from './partials/StatusSettingsCard';
import SeoCard from './partials/SeoCard';
import ImageUploadCard from './partials/ImageUploadCard';
import QuickInfoCard from './partials/QuickInfoCard';
import VideoInformationCard from './partials/VideoInformationCard';
import ListTypeBookInfo from './partials/ListTypeBookInfo';
import ListTypeSimpleInfo from './partials/ListTypeSimpleInfo';

const emptySeoContent = {
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_image: '',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  canonical_url: '',
  robots: 'index, follow',
};


const Save = () => {
  const { moduleSlug, id } = useParams();
  const { setting } = useSelector((state) => state);
  const navigate = useNavigate();

  const isEditing = Boolean(id) && id !== 'new';
  const [saving, setSaving] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    sub_title: '',
    sub_description: '',
    description: '',
    is_featured: false,
    status: 'active',
    category_id: null,
    meta: {
      url: null,
      seo_content: emptySeoContent
    }
  });

  const [seoContent, setSeoContent] = useState(emptySeoContent);
  const [seoUseMainImage, setSeoUseMainImage] = useState(false);

  const ogFileInputRef = useRef(null);
  const twitterFileInputRef = useRef(null);

  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl,
  } = useImageUpload(setting?.setting?.item?.image_size || 5);

  const {
    image: ogImageBase64,
    preview: ogImagePreview,
    error: ogImageError,
    handleImageChange: handleOgImageChange,
    resetImage: resetOgImage,
    setImageUrl: setOgImageUrl,
  } = useImageUpload(setting?.setting?.item?.image_size || 5);

  const {
    image: twitterImageBase64,
    preview: twitterImagePreview,
    error: twitterImageError,
    handleImageChange: handleTwitterImageChange,
    resetImage: resetTwitterImage,
    setImageUrl: setTwitterImageUrl,
  } = useImageUpload(setting?.setting?.item?.image_size || 5);

  // Module details (title, whether a category is required, etc.)
  const { data: moduleQuery, isLoading: moduleFetching } = useApiQuery({
    url: `/admin/business-module-by-page-slug`,
    enabled: !!moduleSlug,
    params: { slug: moduleSlug },
  });

  const moduleData = moduleQuery?.data || {};
  const moduleTitle = moduleData?.title || 'Item';
  const moduleType = moduleData?.module_type || 'list';
  const moduleMeta = moduleData?.meta || {};
  const requiredCategory = Boolean(moduleMeta?.category_required);

  // Categories, only fetched when this module requires one
  const { data: categoryGetQuery, isLoading: categoryGetLoading } = useApiQuery({
    url: `/admin/business-module-item-categories-by-slug/${moduleSlug}`,
    enabled: requiredCategory && !!moduleSlug,
  });

  const categories =
    categoryGetQuery?.data?.map((category) => ({
      id: category.id,
      name: category.name,
    })) || [];

  // Existing item, only fetched in edit mode
  const { data: itemGetQuery, isLoading: itemGetLoading } = useApiQuery({
    url: `/admin/business-module-items/${id}`,
    enabled: isEditing,
    params: { module_slug: moduleSlug },
  });

  useEffect(() => {
    if (!itemGetQuery?.success) return;
    const item = itemGetQuery.data;
    setFormData({
      title: item.title || '',
      sub_title: item.sub_title || '',
      sub_description: item.sub_description || '',
      description: item.description || '',
      is_featured: Boolean(item.is_featured),
      status: item.status || 'active',
      category_id: item.category_id || null,
      meta: item.meta
    });

    const savedSeo = { ...emptySeoContent, ...(item.meta?.seo_content || {}) };
    setSeoContent(savedSeo);

    if (item.image) {
      setExistingImageUrl(item.image);
      setImageUrl({ image: item.image, preview: item.image_full_path });
    }

    const usingMainImage =
      Boolean(item.image) && savedSeo.og_image === item.image && savedSeo.twitter_image === item.image;

    setSeoUseMainImage(usingMainImage);
    if (usingMainImage) {
      resetOgImage();
      resetTwitterImage();
    } else {
      setOgImageUrl({ image: savedSeo.og_image, preview: savedSeo.og_image });
      setTwitterImageUrl({ image: savedSeo.twitter_image, preview: savedSeo.twitter_image });
    }
  }, [itemGetQuery]);

  const { mutate: itemMutation, isLoading: itemMutationLoading } = useApiMutation({
    url: "/admin/business-module-items",
    method: 'POST',
  });

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeoFieldChange = (key, value) => {
    setSeoContent((prev) => ({ ...prev, [key]: value }));
  };

  const currentImagePreview = preview || existingImageUrl || null;
  const currentImageValue = imageBase64 || existingImageUrl || '';

  useEffect(() => {
    if (!seoUseMainImage) return;
    setSeoContent((prev) => ({ ...prev, og_image: currentImageValue, twitter_image: currentImageValue }));
  }, [seoUseMainImage, currentImageValue]);

  useEffect(() => {
    if (seoUseMainImage || !ogImageBase64) return;
    setSeoContent((prev) => ({ ...prev, og_image: ogImageBase64 }));
  }, [ogImageBase64, seoUseMainImage]);

  useEffect(() => {
    if (seoUseMainImage || !twitterImageBase64) return;
    setSeoContent((prev) => ({ ...prev, twitter_image: twitterImageBase64 }));
  }, [twitterImageBase64, seoUseMainImage]);

  const handleToggleSeoUseMainImage = (checked) => {
    setSeoUseMainImage(checked);
    if (checked) {
      resetOgImage();
      resetTwitterImage();
    }
  };

  const handleRemoveOgImage = () => {
    resetOgImage();
    handleSeoFieldChange('og_image', '');
  };

  const handleRemoveTwitterImage = () => {
    resetTwitterImage();
    handleSeoFieldChange('twitter_image', '');
  };

  const handleRemoveImage = () => {
    resetImage();
    setExistingImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (requiredCategory && !formData.category_id) {
      toast.error('Category is required');
      return;
    }

    setSaving(true);

    const payload = {
      id: isEditing ? id : undefined,
      module_slug: moduleSlug,
      title: formData.title,
      sub_title: formData.sub_title,
      sub_description: formData.sub_description,
      description: formData.description,
      is_featured: formData.is_featured ? 1 : 0,
      status: formData.status,
      category_id: requiredCategory ? formData.category_id : undefined,
      image: imageBase64 || existingImageUrl || null,
      meta: {
        ...formData.meta,        
        url: formData.meta.url || null,
        seo_content: seoContent,
      },
    };

    try {
      const response = await itemMutation(payload);
      if (response?.success) {
        toast.success(response?.message || `${moduleTitle} saved successfully`);
        navigate(`/admin/module/${moduleSlug}`);
      } else {
        toast.error(response?.message || `Failed to save ${moduleTitle.toLowerCase()}`);
      }
    } catch (error) {
      toast.error(`Error saving ${moduleTitle.toLowerCase()} data`);
    } finally {
      setSaving(false);
    }
  };
  
  if (moduleFetching || itemGetLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="space-y-4 p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-96 bg-white rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={isEditing ? `Edit ${moduleTitle}` : `Add New ${moduleTitle}`}
        subtitle={isEditing ? `Update ${moduleTitle.toLowerCase()} information` : `Add a new item to ${moduleTitle}`}
        showBackButton={true}
        onBackClick={() => navigate(`/admin/module/${moduleSlug}`)}
        primaryAction={{
          onClick: handleSubmit,
          disabled: saving || itemMutationLoading,
          icon: 'save',
          title: isEditing ? `Update ${moduleTitle}` : `Create ${moduleTitle}`,
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {requiredCategory && (
              <CategoryCard
                categories={categories}
                categoryId={formData.category_id}
                onChange={(value) => handleFieldChange('category_id', value)}
                loading={categoryGetLoading}
              />
            )}
            <BasicInfoCard formData={formData} onFieldChange={handleFieldChange} moduleTitle={moduleTitle} />

            <StatusSettingsCard
              isFeatured={formData.is_featured}
              status={formData.status}
              onFeaturedChange={(checked) => handleFieldChange('is_featured', checked)}
              onStatusChange={(value) => handleFieldChange('status', value)}
            />
            
            {
                moduleMeta.list_type === 'simple' && (
                  <ListTypeSimpleInfo
                    moduleMeta={moduleMeta}
                    formData={formData}
                    setFormData={setFormData}
                    itemGetLoading={itemGetLoading}
                  />
                )
            }
          </div>

          <div className="lg:col-span-1 space-y-6">
            {
              moduleMeta.list_type === 'book' && (
                <ListTypeBookInfo
                  moduleMeta={moduleMeta}
                  formData={formData}
                  setFormData={setFormData}
                  itemGetLoading={itemGetLoading}
                />
              )
            }


            <ImageUploadCard
              preview={currentImagePreview}
              imageError={imageError}
              imageBase64={imageBase64}
              imageMaxSize={setting?.setting?.item?.image_size || 5}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
            />

            {!moduleFetching && moduleType === 'video' && (
              <VideoInformationCard
                meta={formData.meta || {}}
                onChange={(name, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    meta: {
                      ...prev.meta,
                      [name]: value,
                    },
                  }))
                }
              />
            )}

            <SeoCard
              seoContent={seoContent}
              onSeoFieldChange={handleSeoFieldChange}
              seoUseMainImage={seoUseMainImage}
              onToggleSeoUseMainImage={handleToggleSeoUseMainImage}
              mainImagePreview={currentImagePreview}
              ogImage={{
                preview: ogImagePreview,
                error: ogImageError,
                fileInputRef: ogFileInputRef,
                onFileChange: handleOgImageChange,
                onRemove: handleRemoveOgImage,
              }}
              twitterImage={{
                preview: twitterImagePreview,
                error: twitterImageError,
                fileInputRef: twitterFileInputRef,
                onFileChange: handleTwitterImageChange,
                onRemove: handleRemoveTwitterImage,
              }}
            />
            {isEditing && <QuickInfoCard item={itemGetQuery?.data} />}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Save;