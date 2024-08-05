'use client'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode } from 'react';
import '../globals.css';
import SellerDashboardSidebar from './dashboard/(components)/SellerDashboardSidebar';
import AdminDashboardNavbar from './dashboard/(components)/SellerDashboardNavbar';
import AuthProvider from '../Providers';

interface RootLayoutProps {
  children: ReactNode;
}

// Initialize a new QueryClient
const queryClient = new QueryClient();

export default function VendeurLayout({ children }: RootLayoutProps) {
  return (
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <SellerDashboardSidebar />
          <AdminDashboardNavbar>
            <main className="flex flex-col gap-4 p-4 lg:gap-6">{children}</main>
          </AdminDashboardNavbar>
      </div>
  );
}
