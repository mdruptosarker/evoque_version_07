/**
 * EVOQUE Image Optimization Utility
 * Converts high-res raw images into responsive, compressed web-optimized sizes.
 */
export function optimizeImageUrl(url: string | undefined, width = 800, quality = 80): string {
  if (!url) {
    return `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  if (url.includes('images.unsplash.com')) {
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  return url;
}

/**
 * Preloads an image into browser memory cache for instant card-to-details transitions.
 */
export function preloadProductDetailImages(images: string[]): void {
  if (!images || images.length === 0) return;
  images.slice(0, 3).forEach((imgUrl) => {
    const optimized = optimizeImageUrl(imgUrl, 1000, 85);
    const img = new Image();
    img.src = optimized;
  });
}
