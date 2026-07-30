import React from 'react';
import { useApiQuery } from '@/hooks/useAppQuery';
import { useParams, useNavigate } from 'react-router';

import PageHeader from '@/components/shear/PageHeader';
import SEO, { resolveImageUrl, stripHtml } from './SEO';
import DetailsHero from './partials/DetailsHero';
import DetailsContent from './partials/DetailsContent';
import DetailsSidebar from './partials/DetailsSidebar';

const SITE_NAME = import.meta.env.VITE_SITE_NAME || '';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: fetchItems, isLoading: fetchItemsLoading } = useApiQuery({
    url: `/module-item-details/${id}`,
    enabled: !!id,
  });

  const item = fetchItems?.data || {};
  const seo = item.meta?.seo_content || {};

  const fallbackDescription = item.sub_description || stripHtml(item.description || '');

  const seoTitle = seo.meta_title || item.title || 'Details';
  const seoDescription = seo.meta_description || fallbackDescription;

  if (fetchItemsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="space-y-4 p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-80 bg-white rounded-xl animate-pulse"></div>
          <div className="h-48 bg-white rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!item.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Item not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seo.meta_keywords}
        robots={seo.robots}
        canonicalUrl={seo.canonical_url}
        ogTitle={seo.og_title}
        ogDescription={seo.og_description}
        ogImage={seo.og_image || item.image}
        twitterTitle={seo.twitter_title}
        twitterDescription={seo.twitter_description}
        twitterImage={seo.twitter_image || item.image}
        siteName={SITE_NAME}
      />

      <PageHeader
        title={item.title}
        subtitle={item.sub_title}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />

      <div className="p-6 space-y-6">
        <DetailsHero item={item} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DetailsContent item={item} />
          </div>
          <div className="lg:col-span-1">
            <DetailsSidebar item={item} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;