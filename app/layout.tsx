import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// IMPORTANTE: Importamos el componente Live que configuramos
import { SanityLive } from "@/sanity/lib/live";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tu Abogado Sin Fronteras",
  description: "Servicios Jurídicos Premium en Venezuela",
};

export default function RootLayout({
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
        
        {/* ESTA ES LA PIEZA CLAVE: 
          Permite que el "corazón" de la app lata en tiempo real.
        */}
        <SanityLive />
      </body>
    </html>
  );
}