import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import TanstackReactQueryClientProvider from "@/components/tanstack-react-query-provider";
import { shadcn } from "@clerk/themes";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
      }}
    >
      <TanstackReactQueryClientProvider>
        {children}
      </TanstackReactQueryClientProvider>
    </ClerkProvider>
  );
};

export default Layout;
