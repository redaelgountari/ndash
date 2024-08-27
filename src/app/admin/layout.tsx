'use client';

import { ReactNode } from 'react';
import '../globals.css';
import SellerDashboardSidebar from './dashboard/(components)/Dash';
import AdminDashboardNavbar from './dashboard/(components)/Navbar';
import { Provider } from 'react-redux';
import { store } from '../store'

interface RootLayoutProps {
  children: ReactNode;
}

export default function VendeurLayout({ children }: RootLayoutProps) {
  return (
    <Provider store={store}>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <SellerDashboardSidebar />
        <AdminDashboardNavbar>
          <main className="flex flex-col gap-4 p-4 lg:gap-6">{children}</main>
        </AdminDashboardNavbar>
      </div>
    </Provider>
  );
}
