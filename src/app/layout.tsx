import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const geistMono = Host_Grotesk({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Simple Analytics | Lightweight Website Analytics",
  description:
    "Lightweight, script-based website analytics. Drop a script, collect events, see clean analytics. Fast, easy integration with real-time dashboard.",
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/favicon-32x32.png",
  },
  openGraph: {
    title: "Simple Analytics | Lightweight Website Analytics",
    description: "TLightweight, script-based website analytics. Drop a script, collect events, see clean analytics. Fast, easy integration with real-time dashboard.",
    url: "https://simple-analytics-liart.vercel.app",
    siteName: "Simple Analytics",
    images: [
      {
        url: "http://simple-analytics-liart.vercel.app/ob.png",
        width: 1200,
        height: 630,
        alt: "My OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://simple-analytics-liart.vercel.app/js/pixel.min.js"
          data-websiteid="cmm6358j8000004ld369zx3y4"
        ></script>
      </head>
      <body className={`${geistMono.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />{" "}
        </ThemeProvider>
      </body>
    </html>
  );
}
