import MainSidebar from '@/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
        <MainSidebar/>
        {children}
    </SidebarProvider>
  );
};

export default Layout;