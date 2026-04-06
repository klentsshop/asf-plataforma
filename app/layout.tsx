import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
// 🆕 IMPORTACIONES SEGURAS
import { WhatsappFlotante } from "@/components/WhatsappFlotante"; 

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"] 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "Tu Abogado Sin Fronteras",
  description: "Servicios Jurídicos en Venezuela",
};

export default async function RootLayout({ // 👈 1. AÑADIMOS 'async' (Es vital para leer cookies)
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        
      <WhatsappFlotante />

        <SanityLive />
      </body>
    </html>
  );
}