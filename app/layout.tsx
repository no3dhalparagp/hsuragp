import "./globals.css";
import React, { ReactNode } from "react";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "react-datepicker/dist/react-datepicker.css";
import { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { StoreProvider } from "./StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import { ReactTanstankQuery } from "@/components/ReactTanstankQuery";
import { ThemeProvider } from "@/components/ThemeProvider";

 
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import IndianClock from "@/components/IndianClock";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};



type Props = {
  children: ReactNode;
};



export default async function RootLayout({ children }: Props) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />

        
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactTanstankQuery>
            <StoreProvider>
              <SessionProvider session={session}>
                <Toaster />

                
                  <main>
                    
                    {children}
                  </main>
                
              </SessionProvider>
            </StoreProvider>
          </ReactTanstankQuery>
        </ThemeProvider>
      </body>
    </html>
  );
}
