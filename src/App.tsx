import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/storefront/CartDrawer';
import { AuthModal } from './components/storefront/AuthModal';
import { EmailInboxDrawer } from './components/storefront/EmailInboxDrawer';
import { PromoBannerModal } from './components/storefront/PromoBannerModal';

import { HomePage } from './pages/HomePage';
import { AllProductsPage } from './pages/AllProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { ShippingInfoPage } from './pages/ShippingInfoPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Product } from './types';
import { productUrlService } from './services/productUrlService';

function AppContent() {
  const { products } = useStore();
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync routing with browser location and handle direct URLs / 301 redirects
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      if (path.startsWith('/products/')) {
        const pathSlug = path.replace(/^\/products\//, '').replace(/\/$/, '');
        const matchedProduct = productUrlService.findProductBySlugOrId(pathSlug, products);
        if (matchedProduct) {
          const canonicalSlug = matchedProduct.slug || productUrlService.slugify(matchedProduct.name);
          if (pathSlug !== canonicalSlug) {
            // Instant 301 Redirect from old/historical slug to new permanent slug
            window.history.replaceState({ slug: canonicalSlug }, '', `/products/${canonicalSlug}`);
          }
          setSelectedProduct(matchedProduct);
          setActivePage('product-details');
          return;
        }
      } else if (path === '/products' || path === '/shop') {
        setActivePage('products');
      } else if (path === '/admin') {
        setActivePage('admin');
      } else if (path === '/search') {
        setActivePage('search');
      } else if (path === '/profile') {
        setActivePage('profile');
      } else if (path === '/checkout') {
        setActivePage('checkout');
      } else if (path === '/contact') {
        setActivePage('contact');
      } else if (path === '/shipping') {
        setActivePage('shipping');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [products]);

  // Scroll to top instantly on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, selectedProduct]);

  const navigateToPage = (page: string) => {
    setActivePage(page);
    if (page === 'home') window.history.pushState({}, '', '/');
    else if (page === 'products') window.history.pushState({}, '', '/products');
    else if (page === 'admin') window.history.pushState({}, '', '/admin');
    else if (page === 'search') window.history.pushState({}, '', '/search');
    else if (page === 'profile') window.history.pushState({}, '', '/profile');
    else if (page === 'checkout') window.history.pushState({}, '', '/checkout');
    else if (page === 'shipping') window.history.pushState({}, '', '/shipping');
    else if (page === 'contact') window.history.pushState({}, '', '/contact');
  };

  const handleViewProductDetails = (product: Product) => {
    const canonicalProduct = productUrlService.ensureProductUrl(product, products);
    const targetSlug = canonicalProduct.slug || productUrlService.slugify(product.name);
    window.history.pushState({ slug: targetSlug }, '', `/products/${targetSlug}`);
    setSelectedProduct(canonicalProduct);
    setActivePage('product-details');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isAdminView = activePage === 'admin';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 font-sans flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
      
      {/* Global Drawers and Modals */}
      <Sidebar setActivePage={navigateToPage} />
      <CartDrawer 
        onProceedToCheckout={() => navigateToPage('checkout')} 
        onExploreClick={() => navigateToPage('products')}
      />
      <AuthModal setActivePage={navigateToPage} />
      <EmailInboxDrawer />
      {!isAdminView && (
        <PromoBannerModal onNavigate={navigateToPage} />
      )}

      {/* Storefront Navigation Header (Hidden in Admin Dashboard) */}
      {!isAdminView && (
        <Navbar setActivePage={navigateToPage} />
      )}

      {/* Main Page Router View */}
      <main className="flex-1 w-full">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={navigateToPage} 
            onViewProductDetails={handleViewProductDetails} 
          />
        )}

        {activePage === 'products' && (
          <AllProductsPage 
            onViewProductDetails={handleViewProductDetails} 
          />
        )}

        {activePage === 'product-details' && selectedProduct && (
          <ProductDetailsPage 
            key={selectedProduct.id}
            product={selectedProduct} 
            onBack={() => navigateToPage('products')} 
            onViewProductDetails={handleViewProductDetails} 
          />
        )}

        {activePage === 'search' && (
          <SearchPage 
            onViewProductDetails={handleViewProductDetails} 
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage 
            onOrderCompleted={() => {
              // Stay on order confirmation view or go profile
            }} 
            onBackToShop={() => navigateToPage('products')} 
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage 
            setActivePage={navigateToPage} 
          />
        )}

        {activePage === 'shipping' && (
          <ShippingInfoPage />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'admin' && (
          <AdminDashboard 
            onExitAdmin={() => navigateToPage('home')} 
          />
        )}
      </main>

      {/* Storefront Footer (Hidden in Admin Dashboard) */}
      {!isAdminView && (
        <Footer setActivePage={navigateToPage} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
