import './globals.css'
import type { Metadata } from 'next'
import { CookiesProvider } from 'next-client-cookies/server';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'API Entegrasyon Uygulaması',
  description: 'API servisleri ile entegre çalışan cari listesi uygulaması',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookiesProvider>
          {children}
        </CookiesProvider>
      </body>
    </html>
  )
}
