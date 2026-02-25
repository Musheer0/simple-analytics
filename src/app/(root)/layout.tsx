import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import TanstackReactQueryClientProvider from "@/components/tanstack-react-query-provider";
import { shadcn } from "@clerk/themes";
import Script from "next/script";

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
         <Script
          src="http://localhost:3000/js/pixel.js"
          data-websiteid="cmm2cyj7n00031mk4tjmo6uci"
          defer
        ></Script>
    </ClerkProvider>
  );
};

export default Layout;
