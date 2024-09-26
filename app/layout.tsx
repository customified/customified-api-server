import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner"

import { ModalProvider } from "@/providers/modal-provider";
import { SessionProvider } from "next-auth/react";
import ToastProvider from "@/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

      <html lang="en">
      <body className={inter.className}>
      <SessionProvider>
        <ToastProvider/>
        <ModalProvider></ModalProvider>
        <Toaster/>
       {children}
       </SessionProvider>
        </body>
     </html>
    
    
    
  );
}
