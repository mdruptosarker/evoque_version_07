import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminSidebar } from './AdminSidebar';
import { AdminSalesTab } from './AdminSalesTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminSEOTab } from './AdminSEOTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminCouponsTab } from './AdminCouponsTab';
import { SEO } from '../../components/common/SEO';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('sales');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <AdminLoginPage 
        onLoginSuccess={() => setActiveTab('sales')} 
        onBackToStore={onExitAdmin} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col lg:flex-row font-sans">
      <SEO title="Executive Admin Dashboard | EVOQUE" />
      
      {/* Sidebar Navigation */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExitAdmin={onExitAdmin} 
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto lg:max-h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'sales' && <AdminSalesTab />}
          {activeTab === 'orders' && <AdminOrdersTab />}
          {activeTab === 'products' && <AdminProductsTab />}
          {activeTab === 'seo' && <AdminSEOTab />}
          {activeTab === 'categories' && <AdminCategoriesTab />}
          {activeTab === 'users' && <AdminUsersTab />}
          {activeTab === 'coupons' && <AdminCouponsTab />}
        </div>
      </main>
    </div>
  );
};
