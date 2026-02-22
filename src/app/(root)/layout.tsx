import React from 'react';
import { ClerkProvider } from '@clerk/nextjs'
import TanstackReactQueryClientProvider from '@/components/tanstack-react-query-provider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
       <TanstackReactQueryClientProvider>
        {children}
       </TanstackReactQueryClientProvider>
    </ClerkProvider>
  );
};

export default Layout;