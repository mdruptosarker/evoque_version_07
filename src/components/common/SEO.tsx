import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'product' | 'article';
  canonicalUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export const SEO: React.FC<SEOProps> = ({
  title = 'EVOQUE — Premium High-Fashion Clothing & Essentials',
  description = 'Shop minimalist, high-fashion luxury clothing at EVOQUE. Fast Cash on Delivery across Bangladesh. Tailored wool coats, cashmere sweaters, and heavy boxy tees.',
  ogImage = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
  ogUrl = window.location.href,
  ogType = 'website',
  canonicalUrl,
  twitterCard = 'summary_large_image',
  jsonLd
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('EVOQUE') ? title : `${title} | EVOQUE`;
    document.title = formattedTitle;

    // 2. Helper to update meta tag
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    
    // OpenGraph
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', ogUrl);
    setMetaTag('property', 'og:type', ogType);

    // Twitter Cards
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:site', '@evoque_today');

    // 3. Canonical Link Tag
    const targetCanonical = canonicalUrl || ogUrl || window.location.href;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', targetCanonical);

    // 4. Inject JSON-LD Schema
    const existingScript = document.getElementById('evoque-json-ld');
    if (existingScript) existingScript.remove();

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'evoque-json-ld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const existing = document.getElementById('evoque-json-ld');
      if (existing) existing.remove();
    };
  }, [title, description, ogImage, ogUrl, ogType, canonicalUrl, twitterCard, jsonLd]);

  return null;
};
